import { monaco } from "../../EditorService";
import { EditorApi } from "./EditorApi";
import { CodeType } from "./CodeType";
import { Configuration } from "./Configuration";
import { StringUtil } from "./StringUtil";
import { FormatterCSharp } from "./FormatterCSharp";
import { SyntacticAnalysisCSharp } from "./SyntacticAnalysisCSharp";

export class Docomment {
    private static _config: Configuration = new Configuration();
    private static _event: monaco.editor.IModelContentChangedEvent;
    private static _activeEditor: monaco.editor.ICodeEditor;
    private static _vsCodeApi: EditorApi;
    private static _isEnterKey: boolean = false;

    /** Hook ICodeEditor */
    public static Hook(editor: monaco.editor.ICodeEditor) {
        var codeChanged = editor.onDidChangeModelContent(e => {
            var lang = editor.getModel().getModeId();
            if (lang !== "csharp") {
                codeChanged.dispose(); // 不是移除hook
            } else { // Detect Language for csharp
                this._activeEditor = editor;
                this._vsCodeApi = new EditorApi(editor);
                this._event = e;

                // Can Fire Document Comment
                if (!this.IsTriggerDocomment()) return;
                // Get Code
                const code: string = this.GetCode();
                // console.log("GetCode: " + code);
                // Detect Code Type
                const codeType: CodeType = this.GetCodeType(code);
                // console.log("CodeType: ", codeType);
                if (codeType === null) return;
                // Gene Comment
                const docomment = this.GeneDocomment(code, codeType);
                // console.log(docomment);
                if (StringUtil.IsNullOrWhiteSpace(docomment)) return;
                // Write Comment
                this.WriteDocomment(code, codeType, docomment);
                // Move Cursor to <Summary>
                this.MoveCursorTo(code, codeType, docomment);
            }
        });
    }

    private static IsTriggerDocomment(): boolean {
        // NG: KeyCode is EMPTY
        const eventText: string = this._event.changes[this._event.changes.length - 1].text;
        if (eventText == null || eventText === '') {
            return false;
        }

        // NG: ActiveChar is NULL
        const activeChar: string = this._vsCodeApi.ReadCharAtCurrent();
        // console.log('activeChar = ', activeChar);
        if (activeChar == null) {
            return false;
        }

        // NG: KeyCode is NOT '/' or Enter
        const isActivationKey: boolean = SyntacticAnalysisCSharp.IsActivationKey(activeChar, this._config.syntax);
        const isEnterKey: boolean = SyntacticAnalysisCSharp.IsEnterKey(activeChar, eventText);
        if (!isActivationKey && !isEnterKey) {
            return false;
        }
        this._isEnterKey = isEnterKey;

        // NG: Activate on Enter NOT '/'
        if (this._config.activateOnEnter) {
            if (isActivationKey) {
                return false;
            }
        }

        // NG: '////'
        const activeLine: string = this._vsCodeApi.ReadLineAtCurrent();
        if (isActivationKey) {
            // NG: '////'
            if (!SyntacticAnalysisCSharp.IsDocCommentStrict(activeLine, this._config.syntax)) {
                return false;
            }

            // NG: '/' => Insert => Event => ' /// '
            if (SyntacticAnalysisCSharp.IsDoubleDocComment(activeLine, this._config.syntax)) {
                return false;
            }
        }

        // Comment Line
        if (isEnterKey) {
            if (this._config.activateOnEnter) {
                // NG: '////'
                if (!SyntacticAnalysisCSharp.IsDocCommentOnActivationEnter(activeLine, this._config.syntax)) {
                    return false;
                }
            }
            // NG: '////'
            else if (!SyntacticAnalysisCSharp.IsDocComment(activeLine, this._config.syntax)) {
                return false;
            }
        }

        // OK
        return true;
    }

    private static GetCode(): string {
        const code: string = this._vsCodeApi.ReadNextCodeFromCurrent(this._config.eol);
        const removedAttr: string = code.split(this._config.eol).filter(line => !SyntacticAnalysisCSharp.IsAttribute(line.trim())).join('');
        return removedAttr;
    }

    private static GetCodeType(code: string): CodeType {

        // If the previous line was a doc comment and we hit enter.
        // Extend the doc comment without generating anything else,
        // even if there's a method or something next line.
        if (!this._config.activateOnEnter && this._isEnterKey && SyntacticAnalysisCSharp.IsDocComment(this._vsCodeApi.ReadLineAtCurrent(), this._config.syntax)) {
            return CodeType.Comment;
        }

        /* namespace */
        if (SyntacticAnalysisCSharp.IsNamespace(code)) return CodeType.Namespace;

        /* class */
        if (SyntacticAnalysisCSharp.IsClass(code)) return CodeType.Class;

        /* interface */
        if (SyntacticAnalysisCSharp.IsInterface(code)) return CodeType.Interface;

        /* struct */
        if (SyntacticAnalysisCSharp.IsStruct(code)) return CodeType.Struct;

        /* enum */
        if (SyntacticAnalysisCSharp.IsEnum(code)) return CodeType.Enum;

        /* delegate */
        if (SyntacticAnalysisCSharp.IsDelegate(code)) return CodeType.Delegate;

        /* event */
        if (SyntacticAnalysisCSharp.IsEvent(code)) return CodeType.Event;

        /* method */
        if (SyntacticAnalysisCSharp.IsMethod(code)) return CodeType.Method;

        /* property */
        if (SyntacticAnalysisCSharp.IsProperty(code)) return CodeType.Property;

        /* field */
        if (SyntacticAnalysisCSharp.IsField(code)) return CodeType.Field;

        /* comment */
        if (SyntacticAnalysisCSharp.IsComment(code)) return CodeType.Comment;

        return CodeType.None;
    }

    private static GeneDocomment(code: string, codeType: CodeType): string {

        let genericList: Array<string> = null;
        let paramNameList: Array<string> = null;
        let hasReturn = false;
        let hasValue = false;

        switch (codeType) {
            case CodeType.Namespace:
                break;
            case CodeType.Class:
                genericList = SyntacticAnalysisCSharp.GetGenericList(code);
                break;
            case CodeType.Interface:
                genericList = SyntacticAnalysisCSharp.GetGenericList(code);
                break;
            case CodeType.Struct:
                break;
            case CodeType.Enum:
                break;
            case CodeType.Delegate:
                genericList = SyntacticAnalysisCSharp.GetGenericMethodsList(code);
                paramNameList = SyntacticAnalysisCSharp.GetMethodParamNameList(code);
                hasReturn = SyntacticAnalysisCSharp.HasMethodReturn(code);
                break;
            case CodeType.Event:
                break;
            case CodeType.Method:
                genericList = SyntacticAnalysisCSharp.GetGenericMethodsList(code);
                paramNameList = SyntacticAnalysisCSharp.GetMethodParamNameList(code);
                hasReturn = SyntacticAnalysisCSharp.HasMethodReturn(code);
                break;
            case CodeType.Field:
                break;
            case CodeType.Property:
                hasValue = true;
                break;
            case CodeType.Comment:
                return SyntacticAnalysisCSharp.GetCommentSyntax(this._config.syntax) + ' ';
            case CodeType.None:
                return '';
        }

        return this.GeneSummary(code, codeType, genericList, paramNameList, hasReturn, hasValue);
    }

    private static GeneSummary(code: string, codeType: CodeType, genericList: Array<string>, paramNameList: Array<string>, hasReturn: boolean, hasValue: boolean): string {

        let docommentList: Array<string> = new Array<string>();

        // if (ConfigAdvancedCSharp.HasAttribute(this._config.advanced, codeType, Attribute.summary)) {
        /* <summary> */
        docommentList.push('<summary>');
        docommentList.push('');
        docommentList.push('</summary>');
        // }

        /* <param> */
        // if (ConfigAdvancedCSharp.HasAttribute(this._config.advanced, codeType, Attribute.param)) {
        if (paramNameList !== null) {
            paramNameList.forEach(name => {
                docommentList.push('<param name="' + name + '"></param>');
            });
        }
        // }

        /* <typeparam> */
        // if (ConfigAdvancedCSharp.HasAttribute(this._config.advanced, codeType, Attribute.typeparam)) {
        if (genericList !== null) {
            genericList.forEach(name => {
                docommentList.push('<typeparam name="' + name + '"></typeparam>');
            });
        }
        // }

        /* <returns> */
        // if (ConfigAdvancedCSharp.HasAttribute(this._config.advanced, codeType, Attribute.returns)) {
        if (hasReturn) {
            docommentList.push('<returns></returns>');
        }
        // }

        /* <value> */
        // if (ConfigAdvancedCSharp.HasAttribute(this._config.advanced, codeType, Attribute.value)) {
        if (hasValue) {
            docommentList.push('<value></value>');
        }
        // }

        // Format
        const indentBaseLine: string = this._vsCodeApi.ReadLineAtCurrent();
        const indent: string = StringUtil.GetIndent(code, indentBaseLine, this._config.insertSpaces, this._config.detectIdentation);
        const docomment: string = FormatterCSharp.Format(docommentList, indent, this._config.syntax, this._config.activateOnEnter);
        return docomment;
    }

    private static WriteDocomment(code: string, codeType: CodeType, docomment: string): void {
        const position: monaco.Position = this._vsCodeApi.GetActivePosition();

        if (codeType === CodeType.Comment) {
            const indentBaseLine: string = this._vsCodeApi.ReadPreviousLineFromCurrent();
            const indent: string = StringUtil.GetIndent(code, indentBaseLine, this._config.insertSpaces, this._config.detectIdentation);
            const indentLen: number = StringUtil.GetIndentLen(indent, this._config.insertSpaces, this._config.detectIdentation);
            const insertPosition: monaco.Position = this._vsCodeApi.GetPosition(position.lineNumber + 1, indentLen - 1);
            this._vsCodeApi.InsertText(insertPosition, docomment);
        } else {
            if (this._isEnterKey) {
                const active: monaco.Position = this._vsCodeApi.GetActivePosition();
                const anchor: monaco.Position = this._vsCodeApi.GetPosition(active.lineNumber + 1, active.column);
                const replaceSelection = this._vsCodeApi.GetSelectionByPosition(anchor, active);
                this._vsCodeApi.ReplaceText(replaceSelection, docomment);
            } else {
                const insertPosition: monaco.Position = this._vsCodeApi.ShiftPositionChar(position, 1);
                this._vsCodeApi.InsertText(insertPosition, docomment);
            }
        }
    }

    private static MoveCursorTo(code: string, codeType: CodeType, docomment: string): void {
        const curPosition = this._vsCodeApi.GetActivePosition();
        const indentBaseLine: string = this._vsCodeApi.ReadLineAtCurrent();
        const indent: string = StringUtil.GetIndent(code, indentBaseLine, this._config.insertSpaces, this._config.detectIdentation);
        const indentLen: number = StringUtil.GetIndentLen(indent, this._config.insertSpaces, this._config.detectIdentation);
        const line = curPosition.lineNumber + SyntacticAnalysisCSharp.GetLineOffset(this._config.syntax, codeType);
        setTimeout(() => { //TODO:不用则不更新位置
            this._activeEditor.setPosition({ lineNumber: line, column: indentLen + 4 });
        }, 1);
        // const character = indentLen - 1 + docomment.length;
        // this._vsCodeApi.MoveSelection(line, character);
    }

}
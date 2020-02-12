import { monaco } from "../../EditorService";
import { CodeType } from "./CodeType";
import { Configuration } from "./Configuration";
import { StringUtil } from "./StringUtil";
import { FormatterCSharp } from "./FormatterCSharp";
import { SyntacticAnalysisCSharp } from "./SyntacticAnalysisCSharp";

export class Docomment {
    private static _config: Configuration = new Configuration();
    private static _event: monaco.editor.IModelContentChangedEvent;
    private static _activeEditor: monaco.editor.ICodeEditor;
    private static _isEnterKey: boolean = false;

    /** Hook ICodeEditor */
    public static Hook(editor: monaco.editor.ICodeEditor) {
        var codeChanged = editor.onDidChangeModelContent(e => {
            var lang = editor.getModel().getModeId();
            if (lang !== "csharp") {
                codeChanged.dispose(); // 不是移除hook
            } else { // Detect Language for csharp
                this._activeEditor = editor;
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
        const activeChar: string = this.ReadCharAtCurrent();
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
        const activeLine: string = this.ReadLineAtCurrent();
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
        const code: string = this.ReadNextCodeFromCurrent(this._config.eol);
        const removedAttr: string = code.split(this._config.eol).filter(line => !SyntacticAnalysisCSharp.IsAttribute(line.trim())).join('');
        return removedAttr;
    }

    private static GetCodeType(code: string): CodeType {

        // If the previous line was a doc comment and we hit enter.
        // Extend the doc comment without generating anything else,
        // even if there's a method or something next line.
        if (!this._config.activateOnEnter && this._isEnterKey && SyntacticAnalysisCSharp.IsDocComment(this.ReadLineAtCurrent(), this._config.syntax)) {
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
        const indentBaseLine: string = this.ReadLineAtCurrent();
        const indent: string = StringUtil.GetIndent(code, indentBaseLine, this._config.insertSpaces, this._config.detectIdentation);
        const docomment: string = FormatterCSharp.Format(docommentList, indent, this._config.syntax, this._config.activateOnEnter);
        return docomment;
    }

    private static WriteDocomment(code: string, codeType: CodeType, docomment: string): void {
        const position: monaco.Position = this.GetActivePosition();

        if (codeType === CodeType.Comment) {
            const indentBaseLine: string = this.ReadPreviousLineFromCurrent();
            const indent: string = StringUtil.GetIndent(code, indentBaseLine, this._config.insertSpaces, this._config.detectIdentation);
            const indentLen: number = StringUtil.GetIndentLen(indent, this._config.insertSpaces, this._config.detectIdentation);
            const insertPosition: monaco.Position = this.GetPosition(position.lineNumber + 1, indentLen);
            this.InsertText(insertPosition, docomment);
        } else {
            if (this._isEnterKey) {
                const active: monaco.Position = this.GetActivePosition();
                const anchor: monaco.Position = this.GetPosition(active.lineNumber + 1, active.column);
                const replaceSelection = this.GetSelectionByPosition(anchor, active);
                this.ReplaceText(replaceSelection, docomment);
            } else {
                const insertPosition: monaco.Position = this.ShiftPositionChar(position, 1);
                this.InsertText(insertPosition, docomment);
            }
        }
    }

    private static MoveCursorTo(code: string, codeType: CodeType, docomment: string): void {
        const curPosition = this.GetActivePosition();
        const indentBaseLine: string = this.ReadLineAtCurrent();
        const indent: string = StringUtil.GetIndent(code, indentBaseLine, this._config.insertSpaces, this._config.detectIdentation);
        const indentLen: number = StringUtil.GetIndentLen(indent, this._config.insertSpaces, this._config.detectIdentation);
        const line = curPosition.lineNumber + SyntacticAnalysisCSharp.GetLineOffset(this._config.syntax, codeType);
        setTimeout(() => { //TODO:不用则不更新位置
            this._activeEditor.setPosition({ lineNumber: line, column: indentLen + 4 });
        }, 1);
        // const character = indentLen - 1 + docomment.length;
        // this.MoveSelection(line, character);
    }

    //#region ====Editor Api====
    private static GetActivePosition(): monaco.Position {
        // return this._activeEditor.selection.active;
        // console.log("GetActivePosition: ", this._activeEditor.getPosition());
        return this._activeEditor.getPosition();
    }

    private static GetActiveLine(): number {
        return this.GetActivePosition().lineNumber;
    }

    private static GetLineCount(): number {
        //return this._activeEditor.document.lineCount;
        return this._activeEditor.getModel().getLineCount();
    }

    private static GetActiveCharPosition(): number {
        //return this._activeEditor.selection.active.character;
        //return this._activeEditor.getSelection().getPosition().column;
        return this._activeEditor.getPosition().column - 1;
    }

    private static GetPosition(line: number, charcter: number): monaco.Position {
        return new monaco.Position(line, charcter);
    }

    private static ShiftPositionLine(position: monaco.Position, offset: number): monaco.Position {
        return this.GetPosition(position.lineNumber + offset, position.column);
    }

    private static ShiftPositionChar(position: monaco.Position, offset: number): monaco.Position {
        return this.GetPosition(position.lineNumber, position.column + offset);
    }

    private static GetSelection(line: number, charcter: number): monaco.Selection {
        return new monaco.Selection(line, charcter, line, charcter);
    }

    private static GetSelectionByPosition(anchor: monaco.Position, active: monaco.Position): monaco.Selection {
        return new monaco.Selection(anchor.lineNumber, anchor.column, active.lineNumber, active.column);
    }

    private static MoveSelection(line: number, charcter: number): void {
        // const move: monaco.Selection = this.GetSelection(line, charcter);
        // this._activeEditor.selection = move;
        // this._activeEditor.setSelection(move);
        console.log("SetPosition to: ", line, charcter);
        setTimeout(() => {
            this._activeEditor.setPosition(new monaco.Position(line, 12));
            console.log("NewPosition:", this._activeEditor.getPosition());
        }, 1);

        //this._activeEditor.setSelection(new monaco.Selection(line, 1, line, 12));
        // var range = new monaco.Range(line, 12, line, 12);
        // var selection = new monaco.Selection(line, 12, line, 12);
        //this._activeEditor.executeEdits("", [{ range: range, text: "", forceMoveMarkers: true }], [selection]);

    }

    private static InsertText(position: monaco.Position, text: string) {
        // console.log("InsertText: ", position, text);
        // this._activeEditor.edit((editBuilder) => {
        //     editBuilder.insert(position, text);
        // });
        var range = new monaco.Range(position.lineNumber, position.column, position.lineNumber, position.column);
        var op = { range: range, text: text, forceMoveMarkers: true };
        this._activeEditor.executeEdits("Docomment", [op]);
    }

    private static ReplaceText(selection: monaco.Selection, text: string) {
        console.log("ReplaceText: ", selection, text);
        // this._activeEditor.edit((editBuilder) => {
        //     editBuilder.replace(selection, text);
        // });
        var op = { range: selection, text: text, forceMoveMarkers: true };
        this._activeEditor.executeEdits("Docomment", [op]);
    }

    private static ReadLine(line: number): string {
        //return this._activeEditor.document.lineAt(line).text;
        return this._activeEditor.getModel().getLineContent(line);
    }

    private static ReadLineAtCurrent(): string {
        // console.log('GetActiveLine:', this.GetActiveLine());
        return this.ReadLine(this.GetActiveLine());
    }

    private static ReadCharAtCurrent(): string {
        // console.log("ReadLine = " + this.ReadLineAtCurrent());
        return this.ReadLineAtCurrent().charAt(this.GetActiveCharPosition());
    }

    private static ReadNextCodeFromCurrent(eol: string = '\n'): string {
        const lineCount: number = this.GetLineCount();
        const curLine: number = this.GetActiveLine();

        let code = '';
        for (let i: number = curLine; i < lineCount - 1; i++) {

            const line: string = this.ReadLine(i + 1);

            // Skip empty line
            if (StringUtil.IsNullOrWhiteSpace(line)) continue;

            code += line + eol;

            // Detect start of code
            if (!StringUtil.IsCodeBlockStart(line)) {
                continue;
            }

            return StringUtil.RemoveComment(code);
        }

        return null;
    }

    private static ReadPreviousCodeFromCurrent(): string {
        const curLine: number = this.GetActiveLine();

        let code = '';
        for (let i: number = curLine; 0 < i; i--) {

            const line: string = this.ReadLine(i - 1);

            // Skip empty line
            if (StringUtil.IsNullOrWhiteSpace(line)) continue;

            code += line;

            // Detect start of code
            if (!StringUtil.IsCodeBlockStart(line)) {
                continue;
            }

            return code;
        }

        return null;
    }

    private static ReadPreviousLineFromCurrent(): string {
        const curLine: number = this.GetActiveLine();

        for (let i: number = curLine; 0 < i; i--) {

            // Skip empty line
            const line: string = this.ReadLine(i - 1);
            if (StringUtil.IsNullOrWhiteSpace(line)) continue;

            return line;
        }

        return null;
    }

    private static ReadNextLineFromCurrent(): string {
        const lineCount: number = this.GetLineCount();
        const curLine: number = this.GetActiveLine();

        for (let i: number = curLine; i < lineCount - 1; i++) {

            // Skip empty line
            const line: string = this.ReadLine(i + 1);
            if (StringUtil.IsNullOrWhiteSpace(line)) continue;

            return line;
        }

        return null;
    }
    //#endregion

}
import { monaco } from '../../EditorService'
import { StringUtil } from './StringUtil'

//TODO: 修改为全static方法 or Move to Docomment.ts
export class EditorApi {
    private _activeEditor: monaco.editor.ICodeEditor;

    constructor(activeEditor: monaco.editor.ICodeEditor) {
        this._activeEditor = activeEditor;
    }

    // public IsLanguage(languageId: string): boolean {
    //     if (!this._activeEditor.getModel()) return false;
    //     return (this._activeEditor.getModel().getModeId() === languageId);
    // }

    public GetActivePosition(): monaco.Position {
        // return this._activeEditor.selection.active;
        // console.log("GetActivePosition: ", this._activeEditor.getPosition());
        return this._activeEditor.getPosition();
    }

    public GetActiveLine(): number {
        return this.GetActivePosition().lineNumber;
    }

    public GetLineCount(): number {
        //return this._activeEditor.document.lineCount;
        return this._activeEditor.getModel().getLineCount();
    }

    public GetActiveCharPosition(): number {
        //return this._activeEditor.selection.active.character;
        //return this._activeEditor.getSelection().getPosition().column;
        return this._activeEditor.getPosition().column - 1;
    }

    public GetPosition(line: number, charcter: number): monaco.Position {
        return new monaco.Position(line, charcter);
    }

    public ShiftPositionLine(position: monaco.Position, offset: number): monaco.Position {
        return this.GetPosition(position.lineNumber + offset, position.column);
    }

    public ShiftPositionChar(position: monaco.Position, offset: number): monaco.Position {
        return this.GetPosition(position.lineNumber, position.column + offset);
    }

    public GetSelection(line: number, charcter: number): monaco.Selection {
        return new monaco.Selection(line, charcter, line, charcter);
    }

    public GetSelectionByPosition(anchor: monaco.Position, active: monaco.Position): monaco.Selection {
        return new monaco.Selection(anchor.lineNumber, anchor.column, active.lineNumber, active.column);
    }

    public MoveSelection(line: number, charcter: number): void {
        // const move: monaco.Selection = this.GetSelection(line, charcter);
        // this._activeEditor.selection = move;
        // this._activeEditor.setSelection(move);
        console.log("SetPosition to: ", line, charcter);
        setTimeout(() => {
            this._activeEditor.setPosition(new monaco.Position(line, 12));
            console.log("NewPosition:", this._activeEditor.getPosition());
        },1);
        
        //this._activeEditor.setSelection(new monaco.Selection(line, 1, line, 12));
        // var range = new monaco.Range(line, 12, line, 12);
        // var selection = new monaco.Selection(line, 12, line, 12);
        //this._activeEditor.executeEdits("", [{ range: range, text: "", forceMoveMarkers: true }], [selection]);

    }

    public InsertText(position: monaco.Position, text: string) {
        // console.log("InsertText: ", position, text);
        // this._activeEditor.edit((editBuilder) => {
        //     editBuilder.insert(position, text);
        // });
        var range = new monaco.Range(position.lineNumber, position.column, position.lineNumber, position.column);
        var op = { range: range, text: text, forceMoveMarkers: true };
        this._activeEditor.executeEdits("Docomment", [op]);
    }

    public ReplaceText(selection: monaco.Selection, text: string) {
        console.log("ReplaceText: ", selection, text);
        // this._activeEditor.edit((editBuilder) => {
        //     editBuilder.replace(selection, text);
        // });
        var op = { range: selection, text: text, forceMoveMarkers: true };
        this._activeEditor.executeEdits("Docomment", [op]);
    }

    public ReadLine(line: number): string {
        //return this._activeEditor.document.lineAt(line).text;
        return this._activeEditor.getModel().getLineContent(line);
    }

    public ReadLineAtCurrent(): string {
        // console.log('GetActiveLine:', this.GetActiveLine());
        return this.ReadLine(this.GetActiveLine());
    }

    public ReadCharAtCurrent(): string {
        // console.log("ReadLine = " + this.ReadLineAtCurrent());
        return this.ReadLineAtCurrent().charAt(this.GetActiveCharPosition());
    }

    public ReadNextCodeFromCurrent(eol: string = '\n'): string {
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

    public ReadPreviousCodeFromCurrent(): string {
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

    public ReadPreviousLineFromCurrent(): string {
        const curLine: number = this.GetActiveLine();

        for (let i: number = curLine; 0 < i; i--) {

            // Skip empty line
            const line: string = this.ReadLine(i - 1);
            if (StringUtil.IsNullOrWhiteSpace(line)) continue;

            return line;
        }

        return null;
    }

    public ReadNextLineFromCurrent(): string {
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
}
export class Configuration {

    /*-------------------------------------------------------------------------
     * docomment
     *-----------------------------------------------------------------------*/
    public static KEY_DOCOMMENT = 'docomment';
    public static SYNTAX = 'syntax';
    public static ACTIVATE_ON_ENTER = 'activateOnEnter';
    public static ADVANCED = 'advanced';

    /*-------------------------------------------------------------------------
     * files
     *-----------------------------------------------------------------------*/
    public static KEY_FILES = 'files';
    public static EOL = 'eol';

    /*-------------------------------------------------------------------------
     * editor
     *-----------------------------------------------------------------------*/
    public static KEY_EDITOR = 'editor';
    public static INSERT_SPACES = 'insertSpaces';
    public static DETECT_IDENTATION = 'detectIndentation';

    public syntax: CommentSyntax = CommentSyntax.single;
    public activateOnEnter: boolean = false;
    public advanced: Object;
    public eol: string = "\n";
    public insertSpaces: boolean = true;
    public detectIdentation: boolean = true;

}

export enum CommentSyntax {
    single = 'single', // three slashes ///
    delimited = 'delimited', // start with a slash and two stars /**
}


export default function (monaco) {
    // validation settings
    // monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
    //     noSemanticValidation: true,
    //     noSyntaxValidation: false
    // })

    // compiler options
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
        // target: monaco.languages.typescript.ScriptTarget.ES6,
        allowNonTsExtensions: true,
        experimentalDecorators: true
    })

    // extra libraries
    monaco.languages.typescript.javascriptDefaults.addExtraLib([
        'declare class Cookie {',
        '   get(name:string,options:any | undefined):any;',
        '   set(name:string,value:any,options:any | undefined):string;',
        '   remove(name:string,options:any | undefined):string;',
        '}',
        'declare class Runtime {',
        '   readonly cookie: Cookie;',
        '   isAndroid(): boolean;',
        '   isIpad(): boolean;',
        '   isIphone(): boolean;',
        '   isWechat(): boolean;',
        '   isAlipay(): boolean;',
        '   isDevelopment(): boolean;',
        '   getWxSdk(): Promise<any>;',
        '}',
        'declare class UserInfo {',
        '   readonly id: string;',
        '   readonly name: string;',
        '   readonly account: string;',
        '}',
        'declare class Channel {',
        '   /** 调用业务服务 */',
        '   invoke(service: string, args: any[]): Promise<any>;',
        '   /** 通过用户名密码登录，外部用户需指定外部用户模型标识 */',
        '   login(user: string, pwd: string, external: string | undefined): Promise<UserInfo>;',
        '   /** 通过第三方token验证登录，如: 微信OpenID */',
        '   loginByToken(token: string, validator: string): Promise<UserInfo>;',
        '   /** 退出登录状态 */',
        '   logout(): Promise<void>;',
        '}',
        'declare class Vue {',
        '   readonly $el: HTMLElement;',
        '   readonly $parent: Vue;',
        '   readonly $root: Vue;',
        '   readonly $children: Vue[];',
        '   readonly $refs: { [key: string]: Vue | Element | Vue[] | Element[] };',
        '   readonly $message: Message;',
        '   $emit(event: string, ...args: any[]): this;',
        '   $nextTick(callback: (this: this) => void): void;',
        '}',
        'type MessageType = \'success\' | \'warning\' | \'info\' | \'error\';',
        'declare class MessageComponent extends Vue {',
        '   /** Close the Loading instance */',
        '   close(): void;',
        '}',
        'interface CloseEventHandler {',
        '    /**',
        '     * Triggers when a message is being closed',
        '     *',
        '     * @param instance The message component that is being closed',
        '     */',
        '    (instance: MessageComponent): void;',
        '}',
        'interface MessageOptions {',
        '    /** Message text */',
        '    message: string;',
        '    /** Message type */',
        '    type?: MessageType;',
        '    /** Custom icon class, overrides type */',
        '    iconClass?: string;',
        '    /** Custom class name for Message */',
        '    customClass?: string;',
        '    /** Display duration, millisecond. If set to 0, it will not turn off automatically */',
        '    duration?: number;',
        '    /** Whether to show a close button */',
        '    showClose?: boolean;',
        '    /** Whether to center the text */',
        '    center?: boolean;',
        '    /** Whether message is treated as HTML string */',
        '    dangerouslyUseHTMLString?: boolean;',
        '    /** Callback function when closed with the message instance as the parameter */',
        '    onClose?: CloseEventHandler;',
        '}',
        'interface Message {',
        '    /** Show an info message */',
        '    (text: string): MessageComponent;',
        '    /** Show message */',
        '    (options: MessageOptions): MessageComponent;',
        '    /** Show a success message */',
        '    success (text: string): MessageComponent;',
        '    /** Show a warning message */',
        '    warning (text: string): MessageComponent;',
        '    /** Show an info message */',
        '    info (text: string): MessageComponent;',
        '    /** Show an error message */',
        '    error (text: string): MessageComponent;',
        '}',
    ].join('\n'), 'view.d.ts')
}
/** 模型引用 */
export interface IModelReference {
    /** eg: Service */
    readonly Type: string;
    /** eg: erp.HelloService */
    readonly Model: string;
    /** eg:  [235 - 4]*/
    readonly Location: string;
    readonly Offset: number;
    readonly Length: number;
}
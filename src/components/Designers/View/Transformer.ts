
// 用于视图模型编译为js时转换引用的其他模型（如实体定义、视图异步组件、服务调用）
// https://blog.scottlogic.com/2017/05/02/typescript-compiler-api-revisited.html
// https://blog.scottlogic.com/2015/01/20/typescript-compiler-api.html
// https://github.com/Microsoft/TypeScript/pull/13940

import { ts } from '../../CodeEditor/EditorService'

const transformer = <T extends ts.Node>(context: ts.TransformationContext) =>
    (rootNode: T) => {
        // 先根据文件名通过DesignContext找到相应的设计器's Model，用于记录相关模型的引用位置
        // var fileName: string = (rootNode as ts.SourceFile).fileName;
        // console.log(rootNode.getSourceFile().fileName);

        function visit(node: ts.Node): ts.Node {
            // console.log("Visiting " + ts.SyntaxKind[node.kind]);
            // if (node.kind == ts.SyntaxKind.StringLiteral) {
            //     const stringLiteral = node as ts.StringLiteral;
            //     console.log(stringLiteral.text);
            // }
            if (node.kind == ts.SyntaxKind.CallExpression) {
                // 判断是否服务调用
                const callNode = node as ts.CallExpression;
                var isServiceCall: boolean = false;
                if (callNode.expression.kind == ts.SyntaxKind.PropertyAccessExpression) {
                    const method = callNode.expression as ts.PropertyAccessExpression;
                    if (method.expression.kind == ts.SyntaxKind.PropertyAccessExpression) {
                        const service = method.expression as ts.PropertyAccessExpression;
                        if (service.expression.kind == ts.SyntaxKind.PropertyAccessExpression) {
                            const appServices = service.expression as ts.PropertyAccessExpression;
                            if (appServices.name.text == "Services" && appServices.expression.kind == ts.SyntaxKind.Identifier) {
                                isServiceCall = true; // TODO:检查Application是否存在
                            }
                        }
                    }
                }
                if (isServiceCall) {
                    let identifier = ts.createIdentifier("this"); // TODO:考虑指向$runtime.channel
                    let exp = ts.createPropertyAccess(identifier, "$channel");
                    exp = ts.createPropertyAccess(exp, "invoke");

                    let arg1 = ts.createStringLiteral(callNode.expression.getText().replace(".Services.", "."));
                    let arg2 = ts.createArrayLiteral(callNode.arguments);
                    return ts.createCall(exp, [], [arg1, arg2]);
                }
            }

            return ts.visitEachChild(node, visit, context);
        }
    
        return ts.visitNode(rootNode, visit);
    };

export default { before: [transformer], after: undefined, afterDeclarations: undefined };
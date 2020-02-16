// 用于视图模型编译为js时转换引用的其他模型（如实体定义、视图异步组件、服务调用）
// https://blog.scottlogic.com/2017/05/02/typescript-compiler-api-revisited.html
// https://blog.scottlogic.com/2015/01/20/typescript-compiler-api.html
// https://github.com/Microsoft/TypeScript/pull/13940

//TODO:暂简单实现，待使用TypeChecker检查模型类型

import DesignStore from '@/design/DesignStore'
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
            if (node.kind === ts.SyntaxKind.CallExpression) {
                // 判断是否服务调用
                const callNode = node as ts.CallExpression;
                var isServiceCall: boolean = false;
                if (callNode.expression.kind === ts.SyntaxKind.PropertyAccessExpression) {
                    const method = callNode.expression as ts.PropertyAccessExpression;
                    if (method.expression.kind === ts.SyntaxKind.PropertyAccessExpression) {
                        const service = method.expression as ts.PropertyAccessExpression;
                        if (service.expression.kind === ts.SyntaxKind.PropertyAccessExpression) {
                            const appServices = service.expression as ts.PropertyAccessExpression;
                            if (appServices.name.text === "Services" && appServices.expression.kind === ts.SyntaxKind.Identifier) {
                                isServiceCall = true; // TODO:检查Application是否存在
                            }
                        }
                    }
                }
                if (isServiceCall) {
                    let identifier = ts.createIdentifier("$runtime");
                    let exp = ts.createPropertyAccess(identifier, "channel");
                    exp = ts.createPropertyAccess(exp, "invoke");

                    let arg1 = ts.createStringLiteral(callNode.expression.getText().replace(".Services.", "."));
                    let arg2 = ts.createArrayLiteral(callNode.arguments);
                    return ts.createCall(exp, [], [arg1, arg2]);
                }
            } else if (node.kind === ts.SyntaxKind.PropertyAccessExpression) {
                // 判断是否异步视图组件
                const view = node as ts.PropertyAccessExpression;
                if (view.expression.kind === ts.SyntaxKind.PropertyAccessExpression) {
                    const appViews = view.expression as ts.PropertyAccessExpression;
                    if (appViews.name.text === "Views" && appViews.expression.kind === ts.SyntaxKind.Identifier) {
                        const app = appViews.expression as ts.Identifier; //TODO: 同上检查Application
                        let identifier = ts.createIdentifier("View");
                        let arg = ts.createStringLiteral(app.text + "." + view.name.text);
                        return ts.createCall(identifier, [], [arg]);
                    }
                }
            } else if (node.kind == ts.SyntaxKind.NewExpression) {
                const exp = (node as ts.NewExpression).expression;
                if (exp.kind === ts.SyntaxKind.PropertyAccessExpression) {
                    const entity = exp as ts.PropertyAccessExpression;
                    if (entity.expression && entity.expression.kind === ts.SyntaxKind.PropertyAccessExpression) {
                        const appEntities = entity.expression as ts.PropertyAccessExpression;
                        if (appEntities && appEntities.name.text === "Entities"
                            && appEntities.expression.kind === ts.SyntaxKind.Identifier) {
                            const app = appEntities.expression as ts.Identifier;
                            //查找实体模型标识
                            let modelId = DesignStore.getEntityIdByName(app.text, entity.name.text);
                            let identifier = ts.createIdentifier("$runtime");
                            let exp = ts.createPropertyAccess(identifier, "newEntity");
                            let arg = ts.createStringLiteral(modelId);
                            return ts.createCall(exp, [], [arg]);
                        }
                    }
                }
            }

            return ts.visitEachChild(node, visit, context);
        }

        return ts.visitNode(rootNode, visit);
    };

export default { before: [transformer], after: undefined, afterDeclarations: undefined };
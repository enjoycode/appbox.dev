
// 用于视图模型编译为js时转换引用的其他模型（如实体定义、视图异步组件、服务调用）
// https://blog.scottlogic.com/2017/05/02/typescript-compiler-api-revisited.html
// https://blog.scottlogic.com/2015/01/20/typescript-compiler-api.html
// https://github.com/Microsoft/TypeScript/pull/13940

const transformer = <T extends ts.Node>(context: ts.TransformationContext) =>
    (rootNode: T) => {
        function visit(node: ts.Node): ts.Node {
            // console.log("Visiting " + ts.SyntaxKind[node.kind]);
            return ts.visitEachChild(node, visit, context);
        }
        
        return ts.visitNode(rootNode, visit);
    };

export default { before: [transformer], after: undefined, afterDeclarations: undefined };
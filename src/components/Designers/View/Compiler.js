// 编译模版及脚本
// 1. 预编译vue模版为render函数
// 2. 利用利用typescriptServices编译转换vue的script

import DesignStore from '@/design/DesignStore'
import ModelRefTransformers from './Transformer'
import tempCompiler from './TemplateCompiler/build'
const es2015Compiler = require('vue-template-es2015-compiler')

function toES2015Template(code) {
    return es2015Compiler('function render(){' + code + '}')
}

/**
 * 转换、编译、合并模版及脚本
 * @param {*} ts typescriptServices，从monaco editor中加载
 * @param {*} template
 * @param {*} script
 * @param {*} hashId
 * @param {*} viewModelId
 */
export default function (ts, template, script, hashId, viewModelId) {
    try {
        // 先清除所有错误
        DesignStore.errors.clear(viewModelId)

        // 1.编译template
        // 参考: https://github.com/vuejs/vueify/blob/master/lib/template-compiler.js
        var templateResult = tempCompiler.compile(template)
        if (templateResult.errors.length) {
            var errs = []
            for (var i = 0; i < templateResult.errors.length; i++) {
                var element = templateResult.errors[i]
                errs.push({ Model: viewModelId, Location: 'Template', Info: element }) // todo:暂无法定位行列
            }
            DesignStore.errors.update(viewModelId, errs)
            throw new Error('Template compile error')
        }
        templateResult.render = toES2015Template(templateResult.render)
        templateResult.staticRenderFns = '[' + templateResult.staticRenderFns.map(toES2015Template).join(',') + ']'

        // 2.转换脚本, 注意：sourceMap由typescriptServices的编译选项直接处理
        // https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API
        // http://www.typescriptlang.org/play/playgroud.js内的transpileModule()
        var transpileOptions = {
            compilerOptions: { sourceMap: false },
            fileName: viewModelId + '.ts',
            reportDiagnostics: true,
            moduleName: undefined,
            renamedDependencies: undefined,
            transformers: ModelRefTransformers
        }
        const output = ts.transpileModule(script, transpileOptions)
        if (output.diagnostics.length > 0) {
            errs = []
            for (i = 0; i < output.diagnostics.length; i++) {
                element = output.diagnostics[i]
                errs.push({ Model: viewModelId, Location: 'Script:' + element.start + ',' + element.length, Info: element.messageText })
            }
            DesignStore.errors.update(viewModelId, errs)
            throw new Error('Script compile error')
        }
        // console.log(output.outputText)

        // 3.输出
        var res = output.outputText + '\n//# sourceURL=' + viewModelId + '.js'
        return { code: res, template: templateResult }
    } catch (error) {
        return { error }
    }
}

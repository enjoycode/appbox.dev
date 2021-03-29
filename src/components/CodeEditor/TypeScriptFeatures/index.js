import DesignService from "@/design/DesignService";

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
    DesignService.GetAppSettings(null, 'TSExtraLib').then(res => {
        monaco.languages.typescript.javascriptDefaults.addExtraLib(res, 'view.d.ts')
    }).catch(err => alert('Can\'t load extra lib: ' + err))

}

<template>
    <iframe :src="'/pdf/web/viewer.html?file=' + file" width="100%" height="100%"></iframe>
</template>

<script>
// TODO:暂简单包装pdf.js
// https://github.com/legalthings/pdf.js-viewer
// https://github.com/GabrielBuragev/vue-pdfjs-viewer
// https://stackoverflow.com/questions/51553049/how-to-use-full-pdf-js-viewer-with-toolbar-in-webpack-and-vuejs

export default {
    props: {
        file: { type: String, required: true },
    },
    data() {
        return {}
    },
}
</script>
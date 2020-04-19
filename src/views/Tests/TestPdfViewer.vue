<template>
    <pdf-viewer file="/api/design/report/12456"></pdf-viewer>
</template>

<script>
import PdfViewer from '@/easeui/PdfViewer/PdfViewer'

export default {
    components: {
        PdfViewer: PdfViewer
    },
    data() {
        return {}
    },

    methods: {
    }
}
</script>
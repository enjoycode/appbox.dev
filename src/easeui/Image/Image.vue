<template>
    <img :src="imageSrc">
</template>
<script>
export default {
    name: 'EImage',
    props: {
        src: { type: String, require: true }
    },
    data() {
        return {
            scheme: '',
            port: '',
            hostname: ''
        }

    },
    computed: {
        imageSrc() {
            var source = this.src.split(':')
            var s = this.src.substring(source[0].length + 1)

            if (source[0] === 'resource') {
                return this.getResourceImage(s)
            }

            if (source[0] === 'blob') {
                return this.getBlobImage(s)
            }
            return source
        }
    },
    methods: {
        getResourceImage(src) {
            var source = src.split('.')
            var connectionUrl = this.scheme + '//' + this.hostname + this.port + '/api/Resource/GetResourceValue?appID=' + source[0] + '&name=' + source[1] + '&type=1'
            return connectionUrl
        },
        getBlobImage(src) {
            var source = src.split('.')
            var connectionUrl = this.scheme + '//' + this.hostname + this.port + '/api/Blob/Download?storeName=' + source[0] + '&path=' + src.substring(source[0].length + 1)
            return connectionUrl
        }
    },
    mounted() {
        this.scheme = document.location.protocol
        this.hostname = document.location.hostname
        this.port = document.location.port ? (':' + document.location.port) : ''
    }
}
</script>

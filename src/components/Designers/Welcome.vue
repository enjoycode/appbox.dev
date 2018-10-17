<template>
    <div>
        <p>Welcome</p>
    </div>
</template>

<script>
    export default {
        computed: {
            mainHeight: function() {
                return this.height - 34
            }
        }
    }
</script>


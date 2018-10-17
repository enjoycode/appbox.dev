<template>
    <e-form label-position="right" size="mini" label-width="120px">
        <e-form-item prop="Name" label="Name">
            <e-input :disabled="true" v-model="Name"></e-input>
        </e-form-item>
        <e-form-item label="LocalizedName">
            <e-input v-model="LocalizedName"></e-input>
        </e-form-item>
        <e-form-item label="AllowNull">
            <e-checkbox v-model="AllowNull"></e-checkbox>
        </e-form-item>
    </e-form>
</template>

<script>

export default {
    data() {
        return {
            Name: this.target.Name,
            LocalizedName: this.target.LocalizedName,
            AllowNull: this.target.AllowNull
        }
    },
    props: {
        target: { type: Object, required: true }
    },
    computed: {
    },
    watch: {
        target(value) {
            this.Name = value.Name
            this.LocalizedName = value.LocalizedName
            this.AllowNull = value.AllowNull
        }
    },
    methods: {
    }
}
</script>

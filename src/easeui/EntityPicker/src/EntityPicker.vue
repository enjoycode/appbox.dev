<template>
    <e-popover placement="bottom" visible-arrow v-model="popVisible">
        <component :is="PickerView" ref="view" :currentValue="value" @change="onChange"></component>
        <e-input slot="reference" class="entityPickerInput" ref="reference" :value="text" :placeholder="placeholder" :readonly="true"
            :Popover="false" @focus="handleFocus" @blur="handleClose" @mousedown.native="handleMouseDown" @keydown.native.esc.prevent="visible = false"
            @mouseenter.native="inputHovering = true" @mouseleave.native="inputHovering = false" suffix-icon="el-icon-caret-top">
        </e-input>
    </e-popover>
</template>

<script>
    import { addClass, removeClass, hasClass } from 'element-ui/src/utils/dom';

    export default {
        name: 'EntityPicker',
        data() {
            return {
                popVisible: false,
                visible: false,
                inputHovering: false,
                PickerView: window.View(this.view)
            }
        },
        props: {
            placeholder: String,
            view: String,
            value: String,
            text: String
        },
        watch: {
            visible(val) {
                if (!val) {
                    this.$refs.reference.$el.querySelector('input').blur()
                    this.handleIconHide()
                } else {
                    this.handleIconShow()
                }
            },
            inputHovering(val) {
                if (!val) {
                    this.$refs.reference.$el.querySelector('input').style.cursor = 'default'
                } else {
                    this.$refs.reference.$el.querySelector('input').style.cursor = 'pointer'
                }
            }
        },
        methods: {
            handleIconHide() {
                let icon = this.$el.querySelector('.el-input__icon');
                if (icon) {
                    removeClass(icon, 'is-reverse');
                }
            },
            handleIconShow() {
                let icon = this.$el.querySelector('.el-input__icon');
                if (icon) {
                    addClass(icon, 'is-reverse');
                }
            },
            handleMouseDown(event) {
                if (event.target.tagName !== 'INPUT') return;
                if (this.visible) {
                    this.handleClose()
                    event.preventDefault()
                }
            },
            handleFocus() {
                this.visible = true;
            },
            handleClose() {
                this.visible = false;
            },
            /**PickView改变了选择项*/
            onChange(value, text) {
                this.popVisible = false
                this.handleClose
                this.$emit('update:value', value)
                this.$emit('update:text', text)
            }
        }
    }

</script>
<style>
    .entityPickerInput .el-input__icon {
        color: #bfcbd9;
        font-size: 20px;
        transition: transform .3s;
        transform: rotateZ(180deg);
        top: 50%;
        cursor: pointer;
    }

    .entityPickerInput .el-input__icon.is-reverse {
        transform: rotateZ(0deg);
    }
</style>
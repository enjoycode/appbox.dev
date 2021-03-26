import Vue from 'vue'
import {Message, MessageBox, Loading, Notification} from 'element-ui'

// 基本样式导入
require('element-ui/lib/theme-chalk/message.css')
require('element-ui/lib/theme-chalk/message-box.css')
require('element-ui/lib/theme-chalk/loading.css')
require('element-ui/lib/theme-chalk/notification.css')
require('element-ui/lib/theme-chalk/icon.css')

require('@fortawesome/fontawesome-free/css/fontawesome.min.css')
require('@fortawesome/fontawesome-free/css/solid.min.css')
require('@fortawesome/fontawesome-free/css/regular.min.css')
require('@fortawesome/fontawesome-free/css/brands.min.css')

//TODO: 入参根据客户端类型注册相关组件
export default function (/*bool desktop, bool mobile*/) {
    // 注册全局异步组件
    Vue.component('ElPageHeader', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/page-header.css')
        r(require('element-ui/lib/page-header').default)
    }, 'easeui'))
    Vue.component('ElContainer', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/container.css')
        r(require('element-ui/lib/container').default)
    }, 'easeui'))
    Vue.component('ElAside', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/aside.css')
        r(require('element-ui/lib/aside').default)
    }, 'easeui'))
    Vue.component('ElMain', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/main.css')
        r(require('element-ui/lib/main').default)
    }, 'easeui'))
    Vue.component('ElHeader', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/header.css')
        r(require('element-ui/lib/header').default)
    }, 'easeui'))
    Vue.component('ElFooter', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/footer.css')
        r(require('element-ui/lib/footer').default)
    }, 'easeui'))
    Vue.component('ElPagination', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/pagination.css')
        r(require('element-ui/lib/pagination').default)
    }, 'easeui'))
    Vue.component('ElDialog', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/dialog.css')
        r(require('element-ui/lib/dialog').default)
    }, 'easeui'))
    Vue.component('ElAutocomplete', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/autocomplete.css')
        r(require('element-ui/lib/autocomplete').default)
    }, 'easeui'))
    Vue.component('ElDropdown', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/dropdown.css')
        r(require('element-ui/lib/dropdown').default)
    }, 'easeui'))
    Vue.component('ElDropdownMenu', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/dropdown-menu.css')
        r(require('element-ui/lib/dropdown-menu').default)
    }, 'easeui'))
    Vue.component('ElDropdownItem', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/dropdown-item.css')
        r(require('element-ui/lib/dropdown-item').default)
    }, 'easeui'))
    Vue.component('ElMenu', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/menu.css')
        r(require('element-ui/lib/menu').default)
    }, 'easeui'))
    Vue.component('ElSubmenu', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/submenu.css')
        r(require('element-ui/lib/submenu').default)
    }, 'easeui'))
    Vue.component('ElMenuItem', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/menu-item.css')
        r(require('element-ui/lib/menu-item').default)
    }, 'easeui'))
    Vue.component('ElMenuItemGroup', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/menu-item-group.css')
        r(require('element-ui/lib/menu-item-group').default)
    }, 'easeui'))
    Vue.component('ElInput', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/input.css')
        r(require('element-ui/lib/input').default)
    }, 'easeui-1'))
    Vue.component('ElInputNumber', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/input-number.css')
        r(require('element-ui/lib/input-number').default)
    }, 'easeui'))
    Vue.component('ElRadio', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/radio.css')
        r(require('element-ui/lib/radio').default)
    }, 'easeui'))
    Vue.component('ElRadioGroup', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/radio-group.css')
        r(require('element-ui/lib/radio-group').default)
    }, 'easeui'))
    Vue.component('ElRadioButton', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/radio-button.css')
        r(require('element-ui/lib/radio-button').default)
    }, 'easeui'))
    Vue.component('ElCheckbox', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/checkbox.css')
        r(require('element-ui/lib/checkbox').default)
    }, 'easeui'))
    Vue.component('ElCheckboxButton', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/checkbox-button.css')
        r(require('element-ui/lib/checkbox-button').default)
    }, 'easeui'))
    Vue.component('ElCheckboxGroup', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/checkbox-group.css')
        r(require('element-ui/lib/checkbox-group').default)
    }, 'easeui'))
    Vue.component('ElSwitch', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/switch.css')
        r(require('element-ui/lib/switch').default)
    }, 'easeui'))
    Vue.component('ElSelect', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/select.css')
        r(require('element-ui/lib/select').default)
    }, 'easeui'))
    Vue.component('ElOption', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/option.css')
        r(require('element-ui/lib/option').default)
    }, 'easeui'))
    Vue.component('ElOptionGroup', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/option-group.css')
        r(require('element-ui/lib/option-group').default)
    }, 'easeui'))
    Vue.component('ElButton', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/button.css')
        r(require('element-ui/lib/button').default)
    }, 'easeui-1'))
    Vue.component('ElButtonGroup', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/button-group.css')
        r(require('element-ui/lib/button-group').default)
    }, 'easeui'))
    Vue.component('ElTable', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/table.css')
        r(require('element-ui/lib/table').default)
    }, 'easeui'))
    Vue.component('ElTableColumn', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/table-column.css')
        r(require('element-ui/lib/table-column').default)
    }, 'easeui'))
    Vue.component('ElDatePicker', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/date-picker.css')
        r(require('element-ui/lib/date-picker').default)
    }, 'easeui'))
    Vue.component('ElTimeSelect', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/time-select.css')
        r(require('element-ui/lib/time-select').default)
    }, 'easeui'))
    Vue.component('ElTimePicker', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/time-picker.css')
        r(require('element-ui/lib/time-picker').default)
    }, 'easeui'))
    Vue.component('ElPopover', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/popover.css')
        r(require('element-ui/lib/popover').default)
    }, 'easeui'))
    Vue.component('ElTooltip', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/tooltip.css')
        r(require('element-ui/lib/tooltip').default)
    }, 'easeui'))
    Vue.component('ElBreadcrumb', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/breadcrumb.css')
        r(require('element-ui/lib/breadcrumb').default)
    }, 'easeui'))
    Vue.component('ElBreadcrumbItem', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/breadcrumb-item.css')
        r(require('element-ui/lib/breadcrumb-item').default)
    }, 'easeui'))
    Vue.component('ElForm', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/form.css')
        r(require('element-ui/lib/form').default)
    }, 'easeui-form'))
    Vue.component('ElFormItem', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/form-item.css')
        r(require('element-ui/lib/form-item').default)
    }, 'easeui-form'))
    Vue.component('ElTabs', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/tabs.css')
        r(require('element-ui/lib/tabs').default)
    }, 'easeui'))
    Vue.component('ElTabPane', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/tab-pane.css')
        r(require('element-ui/lib/tab-pane').default)
    }, 'easeui'))
    Vue.component('ElTag', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/tag.css')
        r(require('element-ui/lib/tag').default)
    }, 'easeui'))
    Vue.component('ElAlert', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/alert.css')
        r(require('element-ui/lib/alert').default)
    }, 'easeui'))
    Vue.component('ElSlider', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/slider.css')
        r(require('element-ui/lib/slider').default)
    }, 'easeui'))
    Vue.component('ElRow', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/row.css')
        r(require('element-ui/lib/row').default)
    }, 'easeui'))
    Vue.component('ElCol', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/col.css')
        r(require('element-ui/lib/col').default)
    }, 'easeui'))
    Vue.component('ElUpload', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/upload.css')
        r(require('element-ui/lib/upload').default)
    }, 'easeui'))
    Vue.component('ElProgress', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/progress.css')
        r(require('element-ui/lib/progress').default)
    }, 'easeui'))
    Vue.component('ElSpinner', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/spinner.css')
        r(require('element-ui/lib/spinner').default)
    }, 'easeui'))
    Vue.component('ElBadge', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/badge.css')
        r(require('element-ui/lib/badge').default)
    }, 'easeui'))
    Vue.component('ElCard', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/card.css')
        r(require('element-ui/lib/card').default)
    }, 'easeui-1'))
    Vue.component('ElImage', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/image.css')
        r(require('element-ui/lib/image').default)
    }, 'easeui-1'))
    Vue.component('ElRate', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/rate.css')
        r(require('element-ui/lib/rate').default)
    }, 'easeui'))
    Vue.component('ElSteps', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/steps.css')
        r(require('element-ui/lib/steps').default)
    }, 'easeui'))
    Vue.component('ElStep', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/step.css')
        r(require('element-ui/lib/step').default)
    }, 'easeui'))
    Vue.component('ElCarousel', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/carousel.css')
        r(require('element-ui/lib/carousel').default)
    }, 'easeui'))
    Vue.component('ElScrollbar', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/scrollbar.css')
        r(require('element-ui/lib/scrollbar').default)
    }, 'easeui'))
    Vue.component('ElCarouselItem', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/carousel-item.css')
        r(require('element-ui/lib/carousel-item').default)
    }, 'easeui'))
    Vue.component('ElCollapse', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/collapse.css')
        r(require('element-ui/lib/collapse').default)
    }, 'easeui'))
    Vue.component('ElCollapseItem', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/collapse-item.css')
        r(require('element-ui/lib/collapse-item').default)
    }, 'easeui'))
    Vue.component('ElCascader', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/cascader.css')
        r(require('element-ui/lib/cascader').default)
    }, 'easeui'))
    Vue.component('ElColorPicker', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/color-picker.css')
        r(require('element-ui/lib/color-picker').default)
    }, 'easeui'))
    Vue.component('ElTransfer', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/transfer.css')
        r(require('element-ui/lib/transfer').default)
    }, 'easeui'))
    Vue.component('ElTree', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/checkbox.css')
        require('element-ui/lib/theme-chalk/tree.css')
        r(require('element-ui/lib/tree').default)
    }, 'easeui'))
    Vue.component('ElDivider', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/divider.css')
        r(require('element-ui/lib/divider').default)
    }, 'easeui'))

    // ===================Vue-ECharts========================
    Vue.component('EChart', () => import(/* webpackChunkName: "echarts" */ './easeui/ECharts/ECharts.vue'))

    // ===================以下扩展的===================
    Vue.component('ExRichEditor', r => require.ensure([], () => {
        require('quill/dist/quill.snow.css')
        // require('quill/dist/quill.bubble.css')
        require('quill/dist/quill.core.css')
        if (!window.Quill) {
            let ImageImport = require('./easeui/RichEditor/ImageImport').ImageImport
            let ImageResize = require('./easeui/RichEditor/ImageResize').ImageResize
            window.Quill = require('quill/dist/quill.js')
            window.Quill.register('modules/imageImport', ImageImport)
            window.Quill.register('modules/imageResize', ImageResize)
        }

        r(require('./easeui/RichEditor/RichEditor.vue'))
    }, 'easeui-richeditor'))

    Vue.component('ExEntityPicker', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/input.css')
        r(require('./easeui/EntityPicker').default)
    }, 'easeui-form'))
    Vue.component('ExEnumPicker', r => require.ensure([], () => {
        // require('easeui/lib/theme-chalk/input.css')
        r(require('./easeui/EnumPicker').default)
    }, 'easeui'))
    Vue.component('ExImage', r => require.ensure([], () => {
        r(require('./easeui/Image').default)
    }, 'easeui'))
    Vue.component('ExSplitter', r => require.ensure([], () => {
        r(require('./easeui/Splitter').default)
    }, 'easeui-layout'))
    Vue.component('ExTerminal', r => require.ensure([], () => {
        r(require('./easeui/Terminal').default)
    }, 'easeui-terminal'))

    Vue.component('ExMarkdown', () => import(/* webpackChunkName: "easeui-markdown" */ './easeui/Markdown/Markdown.js'))
    Vue.component('PdfViewer', () => import(/* webpackChunkName: "easeui-pdf" */ './easeui/PdfViewer/PdfViewer.vue'))

    Vue.component("CGridColumnGroup", () => import(/* webpackChunkName: "cgrid" */ 'vue-cheetah-grid/lib/CGridColumnGroup'))
    Vue.component("CGridColumn", () => import(/* webpackChunkName: "cgrid" */ 'vue-cheetah-grid/lib/CGridColumn'))
    Vue.component("CGridButtonColumn", () => import(/* webpackChunkName: "cgrid" */ 'vue-cheetah-grid/lib/CGridButtonColumn'))
    Vue.component("CGridCheckColumn", () => import(/* webpackChunkName: "cgrid" */ 'vue-cheetah-grid/lib/CGridCheckColumn'))
    Vue.component("CGridInputColumn", () => import(/* webpackChunkName: "cgrid" */ 'vue-cheetah-grid/lib/CGridInputColumn'))
    Vue.component("CGrid", () => import(/* webpackChunkName: "cgrid" */ 'vue-cheetah-grid/lib/CGrid'))

    //===================GridLayout===================
    Vue.component('GridLayout', r => require.ensure([], () => {
        r(require('vue-grid-layout').GridLayout)
    }, 'grid-layout'))
    Vue.component('GridItem', r => require.ensure([], () => {
        r(require('vue-grid-layout').GridItem)
    }, 'grid-layout'))

    Vue.use(Loading.directive)

    Vue.prototype.$loading = Loading.service
    Vue.prototype.$msgbox = MessageBox
    Vue.prototype.$alert = MessageBox.alert
    Vue.prototype.$confirm = MessageBox.confirm
    Vue.prototype.$prompt = MessageBox.prompt
    Vue.prototype.$notify = Notification
    Vue.prototype.$message = Message
}

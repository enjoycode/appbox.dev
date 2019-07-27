import Vue from 'vue'
import { Message, MessageBox, Loading, Notification } from 'element-ui'
import { Toast, Indicator, InfiniteScroll, Lazyload } from 'mint-ui'

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
export default function () {
    // 注册全局异步组件
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

    // ===================Vue-ECharts========================
    Vue.component('v-chart', r => require.ensure([], () => {
        // 引入 ECharts 主模块
        // var echarts = require('echarts/lib/echarts')
        // 引入柱状图
        require('echarts/lib/chart/line')
        require('echarts/lib/chart/bar')
        require('echarts/lib/chart/pie')
        // 引入提示框和标题组件
        require('echarts/lib/component/tooltip')
        require('echarts/lib/component/title')

        // r(require('vue-echarts/components/ECharts.vue'))
        r(require('./easeui/ECharts/ECharts.vue'))
    }, 'easeui-chart'))

    // ================== 手机端控件 mint ui ============
    Vue.use(InfiniteScroll) // 当列表即将滚动到底部时，自动加载更多数据
    // Vue.use(Lazyload, merge({
    //     loading: require('mint-ui/src/assets/loading-spin.svg'),
    //     attempt: 3
    //   }, null)) // 延迟加载
    Vue.use(Lazyload, {
        loading: require('mint-ui/src/assets/loading-spin.svg'),
        attempt: 3
    }) // 延迟加载
    Vue.component('MtField', r => require.ensure([], () => {
        require('mint-ui/lib/field/style.css')
        r(require('mint-ui/lib/field')) // 属性
    }, 'mintui'))
    Vue.component('MtHeader', r => require.ensure([], () => {
        require('mint-ui/lib/header/style.css')
        r(require('mint-ui/lib/header')) // header
    }, 'mintui'))
    Vue.component('MtTabbar', r => require.ensure([], () => {
        require('mint-ui/lib/tabbar/style.css')
        r(require('mint-ui/lib/tabbar'))
    }, 'mintui')) // 底部导航条
    Vue.component('MtTabItem', r => require.ensure([], () => {
        require('mint-ui/lib/tab-item/style.css')
        r(require('mint-ui/lib/tab-item'))
    }, 'mintui')) // 底部导航条子项
    Vue.component('MtPopup', r => require.ensure([], () => {
        require('mint-ui/lib/popup/style.css')
        r(require('mint-ui/lib/popup'))
    }, 'mintui')) // 弹出层，可定位
    Vue.component('MtPicker', r => require.ensure([], () => {
        require('mint-ui/lib/picker/style.css')
        r(require('mint-ui/lib/picker'))
    }, 'mintui')) // 可实现地区联动，要依赖popup控件
    Vue.component('MtDatetimePicker', r => require.ensure([], () => {
        require('mint-ui/lib/datetime-picker/style.css')
        r(require('mint-ui/lib/datetime-picker'))
    }, 'mintui')) // 时间选择控件
    Vue.component('MtSwipe', r => require.ensure([], () => {
        require('mint-ui/lib/swipe/style.css')
        r(require('mint-ui/lib/swipe'))
    }, 'mintui')) // 轮播，支持触摸滑动
    Vue.component('MtSwipeItem', r => require.ensure([], () => {
        require('mint-ui/lib/swipe-item/style.css')
        r(require('mint-ui/lib/swipe-item'))
    }, 'mintui')) // 轮播子项
    Vue.component('MtCell', r => require.ensure([], () => {
        require('mint-ui/lib/cell/style.css')
        r(require('mint-ui/lib/cell'))
    }, 'mintui'))
    Vue.component('MtCellSwipe', r => require.ensure([], () => {
        require('mint-ui/lib/cell-swipe/style.css')
        r(require('mint-ui/lib/cell-swipe'))
    }, 'mintui')) // 此控件可支持手左右滑动，实现更多操作，如左滑显示删除按钮
    Vue.component('MtSpinner', r => require.ensure([], () => {
        require('mint-ui/lib/spinner/style.css')
        r(require('mint-ui/lib/spinner'))
    }, 'mintui')) // 加载中动画，上面导入的eSpinner好像没有size以及color属性
    Vue.component('MtLoadmore', r => require.ensure([], () => {
        require('mint-ui/lib/loadmore/style.css')
        r(require('mint-ui/lib/loadmore'))
    }, 'mintui')) // 可实现下拉刷新，上拉加载更多等功能
    // ================== 手机端控件mint ui ==============

    // ===================以下扩展的===================
    // ===================RichTextEditor===============
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
    Vue.component('ExTextboxCell', r => require.ensure([], () => {
        r(require('./easeui/TableCells/TextBoxCell.vue'))
    }, 'easeui-cells'))

    // ===================Markdown========================
    Vue.component('ExMarkdown', () => import(/* webpackChunkName: "easeui-markdown" */ './easeui/Markdown/Markdown.js'))

    Vue.use(Loading.directive)

    Vue.prototype.$loading = Loading.service
    Vue.prototype.$msgbox = MessageBox
    Vue.prototype.$alert = MessageBox.alert
    Vue.prototype.$confirm = MessageBox.confirm
    Vue.prototype.$prompt = MessageBox.prompt
    Vue.prototype.$notify = Notification
    Vue.prototype.$message = Message
    Vue.prototype.$toast = Toast
    Vue.prototype.$indicator = Indicator
}

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

export default function () {
    // 注册全局异步组件
    Vue.component('ePagination', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/pagination.css')
        r(require('element-ui/lib/pagination').default)
    }, 'easeui'))
    Vue.component('eDialog', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/dialog.css')
        r(require('element-ui/lib/dialog').default)
    }, 'easeui'))
    Vue.component('eAutocomplete', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/autocomplete.css')
        r(require('element-ui/lib/autocomplete').default)
    }, 'easeui'))
    Vue.component('eDropdown', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/dropdown.css')
        r(require('element-ui/lib/dropdown').default)
    }, 'easeui'))
    Vue.component('eDropdownMenu', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/dropdown-menu.css')
        r(require('element-ui/lib/dropdown-menu').default)
    }, 'easeui'))
    Vue.component('eDropdownItem', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/dropdown-item.css')
        r(require('element-ui/lib/dropdown-item').default)
    }, 'easeui'))
    Vue.component('eMenu', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/menu.css')
        r(require('element-ui/lib/menu').default)
    }, 'easeui'))
    Vue.component('eSubmenu', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/submenu.css')
        r(require('element-ui/lib/submenu').default)
    }, 'easeui'))
    Vue.component('eMenuItem', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/menu-item.css')
        r(require('element-ui/lib/menu-item').default)
    }, 'easeui'))
    Vue.component('eMenuItemGroup', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/menu-item-group.css')
        r(require('element-ui/lib/menu-item-group').default)
    }, 'easeui'))
    Vue.component('eInput', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/input.css')
        r(require('element-ui/lib/input').default)
    }, 'easeui-1'))
    Vue.component('eInputNumber', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/input-number.css')
        r(require('element-ui/lib/input-number').default)
    }, 'easeui'))
    Vue.component('eRadio', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/radio.css')
        r(require('element-ui/lib/radio').default)
    }, 'easeui'))
    Vue.component('eRadioGroup', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/radio-group.css')
        r(require('element-ui/lib/radio-group').default)
    }, 'easeui'))
    Vue.component('eRadioButton', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/radio-button.css')
        r(require('element-ui/lib/radio-button').default)
    }, 'easeui'))
    Vue.component('eCheckbox', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/checkbox.css')
        r(require('element-ui/lib/checkbox').default)
    }, 'easeui'))
    Vue.component('eCheckboxButton', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/checkbox-button.css')
        r(require('element-ui/lib/checkbox-button').default)
    }, 'easeui'))
    Vue.component('eCheckboxGroup', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/checkbox-group.css')
        r(require('element-ui/lib/checkbox-group').default)
    }, 'easeui'))
    Vue.component('eSwitch', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/switch.css')
        r(require('element-ui/lib/switch').default)
    }, 'easeui'))
    Vue.component('eSelect', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/select.css')
        r(require('element-ui/lib/select').default)
    }, 'easeui'))
    Vue.component('eOption', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/option.css')
        r(require('element-ui/lib/option').default)
    }, 'easeui'))
    Vue.component('eOptionGroup', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/option-group.css')
        r(require('element-ui/lib/option-group').default)
    }, 'easeui'))
    Vue.component('eButton', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/button.css')
        r(require('element-ui/lib/button').default)
    }, 'easeui-1'))
    Vue.component('eButtonGroup', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/button-group.css')
        r(require('element-ui/lib/button-group').default)
    }, 'easeui'))
    Vue.component('eTable', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/table.css')
        r(require('element-ui/lib/table').default)
    }, 'easeui'))
    Vue.component('eTableColumn', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/table-column.css')
        r(require('element-ui/lib/table-column').default)
    }, 'easeui'))
    Vue.component('eDatePicker', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/date-picker.css')
        r(require('element-ui/lib/date-picker').default)
    }, 'easeui'))
    Vue.component('eTimeSelect', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/time-select.css')
        r(require('element-ui/lib/time-select').default)
    }, 'easeui'))
    Vue.component('eTimePicker', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/time-picker.css')
        r(require('element-ui/lib/time-picker').default)
    }, 'easeui'))
    Vue.component('ePopover', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/popover.css')
        r(require('element-ui/lib/popover').default)
    }, 'easeui'))
    Vue.component('eTooltip', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/tooltip.css')
        r(require('element-ui/lib/tooltip').default)
    }, 'easeui'))
    Vue.component('eBreadcrumb', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/breadcrumb.css')
        r(require('element-ui/lib/breadcrumb').default)
    }, 'easeui'))
    Vue.component('eBreadcrumbItem', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/breadcrumb-item.css')
        r(require('element-ui/lib/breadcrumb-item').default)
    }, 'easeui'))
    Vue.component('eForm', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/form.css')
        r(require('element-ui/lib/form').default)
    }, 'easeui-form'))
    Vue.component('eFormItem', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/form-item.css')
        r(require('element-ui/lib/form-item').default)
    }, 'easeui-form'))
    Vue.component('eTabs', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/tabs.css')
        r(require('element-ui/lib/tabs').default)
    }, 'easeui'))
    Vue.component('eTabPane', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/tab-pane.css')
        r(require('element-ui/lib/tab-pane').default)
    }, 'easeui'))
    Vue.component('eTag', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/tag.css')
        r(require('element-ui/lib/tag').default)
    }, 'easeui'))
    Vue.component('eAlert', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/alert.css')
        r(require('element-ui/lib/alert').default)
    }, 'easeui'))
    Vue.component('eSlider', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/slider.css')
        r(require('element-ui/lib/slider').default)
    }, 'easeui'))
    Vue.component('eRow', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/row.css')
        r(require('element-ui/lib/row').default)
    }, 'easeui'))
    Vue.component('eCol', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/col.css')
        r(require('element-ui/lib/col').default)
    }, 'easeui'))
    Vue.component('eUpload', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/upload.css')
        r(require('element-ui/lib/upload').default)
    }, 'easeui'))
    Vue.component('eProgress', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/progress.css')
        r(require('element-ui/lib/progress').default)
    }, 'easeui'))
    Vue.component('eSpinner', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/spinner.css')
        r(require('element-ui/lib/spinner').default)
    }, 'easeui'))
    Vue.component('eBadge', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/badge.css')
        r(require('element-ui/lib/badge').default)
    }, 'easeui'))
    Vue.component('eCard', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/card.css')
        r(require('element-ui/lib/card').default)
    }, 'easeui-1'))
    Vue.component('eRate', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/rate.css')
        r(require('element-ui/lib/rate').default)
    }, 'easeui'))
    Vue.component('eSteps', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/steps.css')
        r(require('element-ui/lib/steps').default)
    }, 'easeui'))
    Vue.component('eStep', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/step.css')
        r(require('element-ui/lib/step').default)
    }, 'easeui'))
    Vue.component('eCarousel', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/carousel.css')
        r(require('element-ui/lib/carousel').default)
    }, 'easeui'))
    Vue.component('eScrollbar', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/scrollbar.css')
        r(require('element-ui/lib/scrollbar').default)
    }, 'easeui'))
    Vue.component('eCarouselItem', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/carousel-item.css')
        r(require('element-ui/lib/carousel-item').default)
    }, 'easeui'))
    Vue.component('eCollapse', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/collapse.css')
        r(require('element-ui/lib/collapse').default)
    }, 'easeui'))
    Vue.component('eCollapseItem', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/collapse-item.css')
        r(require('element-ui/lib/collapse-item').default)
    }, 'easeui'))
    Vue.component('eCascader', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/cascader.css')
        r(require('element-ui/lib/cascader').default)
    }, 'easeui'))
    Vue.component('eColorPicker', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/color-picker.css')
        r(require('element-ui/lib/color-picker').default)
    }, 'easeui'))
    Vue.component('eTransfer', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/transfer.css')
        r(require('element-ui/lib/transfer').default)
    }, 'easeui'))

    // ===================RichTextEditor===============
    Vue.component('eRichEditor', r => require.ensure([], () => {
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

    // ===================图表类========================
    Vue.component('eChartLine', r => require.ensure([], () => {
        r(require('v-charts/lib/line')) // 折线图
    }, 'easeui-chart'))
    Vue.component('eChartBar', r => require.ensure([], () => {
        r(require('v-charts/lib/histogram')) // 柱状图
    }, 'easeui-chart'))
    Vue.component('eChartBarHorizontal', r => require.ensure([], () => {
        r(require('v-charts/lib/bar')) // 条形图
    }, 'easeui-chart'))
    Vue.component('eChartPie', r => require.ensure([], () => {
        r(require('v-charts/lib/pie')) // 饼图
    }, 'easeui-chart'))
    Vue.component('eChartRadar', r => require.ensure([], () => {
        r(require('v-charts/lib/radar')) // 雷达图
    }, 'easeui-chart'))
    Vue.component('eChartRing', r => require.ensure([], () => {
        r(require('v-charts/lib/ring')) // 环图
    }, 'easeui-chart'))
    Vue.component('eChartMap', r => require.ensure([], () => {
        r(require('v-charts/lib/map')) // 地图
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
    Vue.component('emField', r => require.ensure([], () => {
        require('mint-ui/lib/field/style.css')
        r(require('mint-ui/lib/field')) // 属性
    }, 'mintui'))
    Vue.component('emHeader', r => require.ensure([], () => {
        require('mint-ui/lib/header/style.css')
        r(require('mint-ui/lib/header')) // header
    }, 'mintui'))
    Vue.component('emTabbar', r => require.ensure([], () => {
        require('mint-ui/lib/tabbar/style.css')
        r(require('mint-ui/lib/tabbar'))
    }, 'mintui')) // 底部导航条
    Vue.component('emTabItem', r => require.ensure([], () => {
        require('mint-ui/lib/tab-item/style.css')
        r(require('mint-ui/lib/tab-item'))
    }, 'mintui')) // 底部导航条子项
    Vue.component('emPopup', r => require.ensure([], () => {
        require('mint-ui/lib/popup/style.css')
        r(require('mint-ui/lib/popup'))
    }, 'mintui')) // 弹出层，可定位
    Vue.component('emPicker', r => require.ensure([], () => {
        require('mint-ui/lib/picker/style.css')
        r(require('mint-ui/lib/picker'))
    }, 'mintui')) // 可实现地区联动，要依赖popup控件
    Vue.component('emDatetimePicker', r => require.ensure([], () => {
        require('mint-ui/lib/datetime-picker/style.css')
        r(require('mint-ui/lib/datetime-picker'))
    }, 'mintui')) // 时间选择控件
    Vue.component('emSwipe', r => require.ensure([], () => {
        require('mint-ui/lib/swipe/style.css')
        r(require('mint-ui/lib/swipe'))
    }, 'mintui')) // 轮播，支持触摸滑动
    Vue.component('emSwipeItem', r => require.ensure([], () => {
        require('mint-ui/lib/swipe-item/style.css')
        r(require('mint-ui/lib/swipe-item'))
    }, 'mintui')) // 轮播子项
    Vue.component('emCell', r => require.ensure([], () => {
        require('mint-ui/lib/cell/style.css')
        r(require('mint-ui/lib/cell'))
    }, 'mintui'))
    Vue.component('emCellSwipe', r => require.ensure([], () => {
        require('mint-ui/lib/cell-swipe/style.css')
        r(require('mint-ui/lib/cell-swipe'))
    }, 'mintui')) // 此控件可支持手左右滑动，实现更多操作，如左滑显示删除按钮
    Vue.component('emSpinner', r => require.ensure([], () => {
        require('mint-ui/lib/spinner/style.css')
        r(require('mint-ui/lib/spinner'))
    }, 'mintui')) // 加载中动画，上面导入的eSpinner好像没有size以及color属性
    Vue.component('emLoadmore', r => require.ensure([], () => {
        require('mint-ui/lib/loadmore/style.css')
        r(require('mint-ui/lib/loadmore'))
    }, 'mintui')) // 可实现下拉刷新，上拉加载更多等功能
    // ================== 手机端控件mint ui ==============

    // ===================以下修改过的===================
    Vue.component('eTree', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/checkbox.css')
        require('element-ui/lib/theme-chalk/tree.css')
        r(require('./easeui/tree').default)
    }, 'easeui'))
    Vue.component('eEntityPicker', r => require.ensure([], () => {
        require('element-ui/lib/theme-chalk/input.css')
        r(require('./easeui/EntityPicker').default)
    }, 'easeui-form'))
    Vue.component('eEnumPicker', r => require.ensure([], () => {
        // require('easeui/lib/theme-chalk/input.css')
        r(require('./easeui/EnumPicker').default)
    }, 'easeui'))
    Vue.component('eImage', r => require.ensure([], () => {
        r(require('./easeui/Image').default)
    }, 'easeui'))
    Vue.component('eSplitter', r => require.ensure([], () => {
        r(require('./easeui/Splitter').default)
    }, 'easeui-layout'))
    Vue.component('eTerminal', r => require.ensure([], () => {
        r(require('./easeui/Terminal').default)
    }, 'easeui-terminal'))
    Vue.component('eTextboxCell', r => require.ensure([], () => {
        r(require('./easeui/TableCells/TextBoxCell.vue'))
    }, 'easeui-cells'))

    // ===================Markdown========================
    Vue.component('eMarkdown', () => import(/* webpackChunkName: "easeui-markdown" */ './easeui/Markdown/Markdown.js'))

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

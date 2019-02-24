import ToolBoxGroup from './ToolBoxGroup'
import ToolBoxItem from './ToolBoxItem'
import EInput from './ControlToolBox/EInput'
import ERadio from './ControlToolBox/ERadio'
import ECheckbox from './ControlToolBox/ECheckbox'
import EInputNumber from './ControlToolBox/EInputNumber'
import ESelect from './ControlToolBox/ESelect'
import ECascader from './ControlToolBox/ECascader'
import ESwitch from './ControlToolBox/ESwitch'
import ESlider from './ControlToolBox/ESlider'
import ETimePicker from './ControlToolBox/ETimePicker'
import EDatePicker from './ControlToolBox/EDatePicker'
import EDateTimePicker from './ControlToolBox/EDateTimePicker'
import EUpload from './ControlToolBox/EUpload'
import ERate from './ControlToolBox/ERate'
import EColorPicker from './ControlToolBox/EColorPicker'
import ETransfer from './ControlToolBox/ETransfer'
import EForm from './ControlToolBox/EForm'
import ELayout from './ControlToolBox/ELayout'
import EButton from './ControlToolBox/EButton'
import ETable from './ControlToolBox/ETable'
import ETag from './ControlToolBox/ETag'
import EProgress from './ControlToolBox/EProgress'
import ETree from './ControlToolBox/ETree'
import EPagination from './ControlToolBox/EPagination'
import EBadge from './ControlToolBox/EBadge'
import EAlert from './ControlToolBox/EAlert'
import ELoading from './ControlToolBox/ELoading'
import EMessage from './ControlToolBox/EMessage'
import EMessageBox from './ControlToolBox/EMessageBox'
import ENotification from './ControlToolBox/ENotification'
import ENavMenu from './ControlToolBox/ENavMenu'
import ETabs from './ControlToolBox/ETabs'
import EBreadcrumb from './ControlToolBox/EBreadcrumb'
import EDropdown from './ControlToolBox/EDropdown'
import ESteps from './ControlToolBox/ESteps'
import EDialog from './ControlToolBox/EDialog'
import ETooltip from './ControlToolBox/ETooltip'
import EPopover from './ControlToolBox/EPopover'
import ECard from './ControlToolBox/ECard'
import ECarousel from './ControlToolBox/ECarousel'
import ECollapse from './ControlToolBox/ECollapse'

ToolBoxItem.Set('Layout', 'th', ELayout)
ToolBoxItem.Set('Button', 'square', EButton)
const basicItems = ToolBoxItem.Get()

ToolBoxItem.Set('Input', 'pencil-square-o', EInput)
ToolBoxItem.Set('Radio', 'dot-circle-o', ERadio)
ToolBoxItem.Set('Checkbox', 'check-square-o', ECheckbox)
ToolBoxItem.Set('InputNumber', 'sort', EInputNumber)
ToolBoxItem.Set('Select', 'toggle-down', ESelect)
ToolBoxItem.Set('Cascader', 'indent', ECascader)
ToolBoxItem.Set('Switch', 'toggle-on', ESwitch)
ToolBoxItem.Set('Slider', 'sliders', ESlider)
ToolBoxItem.Set('TimePicker', 'clock-o', ETimePicker)
ToolBoxItem.Set('DatePicker', 'calendar', EDatePicker)
ToolBoxItem.Set('DateTimePicker', 'calendar-check-o', EDateTimePicker)
ToolBoxItem.Set('Upload', 'upload', EUpload)
ToolBoxItem.Set('Rate', 'star', ERate)
ToolBoxItem.Set('ColorPicker', 'dashboard', EColorPicker)
ToolBoxItem.Set('Transfer', 'columns', ETransfer)
ToolBoxItem.Set('Form', 'list-alt', EForm)
const formItems = ToolBoxItem.Get()

ToolBoxItem.Set('Table', 'table', ETable)
ToolBoxItem.Set('Tag', 'tag', ETag)
ToolBoxItem.Set('Progress', 'battery-2', EProgress)
ToolBoxItem.Set('Tree', 'indent', ETree)
ToolBoxItem.Set('Pagination', 'ellipsis-h', EPagination)
ToolBoxItem.Set('Badge', 'bookmark', EBadge)
const dataItems = ToolBoxItem.Get()

ToolBoxItem.Set('Alert', 'exclamation-triangle', EAlert)
ToolBoxItem.Set('Loading', 'spinner', ELoading)
ToolBoxItem.Set('Message', 'commenting', EMessage)
ToolBoxItem.Set('MessageBox', 'window-maximize', EMessageBox)
ToolBoxItem.Set('Notification', 'sticky-note', ENotification)
const noticeItems = ToolBoxItem.Get()

ToolBoxItem.Set('NavMenu', 'share-alt', ENavMenu)
ToolBoxItem.Set('Tabs', 'tablet', ETabs)
ToolBoxItem.Set('Breadcrumb', 'text-height', EBreadcrumb)
ToolBoxItem.Set('Dropdown', 'caret-square-o-down', EDropdown)
ToolBoxItem.Set('Steps', 'check-circle', ESteps)
const navigationItems = ToolBoxItem.Get()

ToolBoxItem.Set('Dialog', 'window-maximize', EDialog)
ToolBoxItem.Set('Tooltip', 'info-circle', ETooltip)
ToolBoxItem.Set('Popover', 'comment-o', EPopover)
ToolBoxItem.Set('Card', 'list-alt', ECard)
ToolBoxItem.Set('Carousel', 'window-restore', ECarousel)
ToolBoxItem.Set('Collapse', 'minus-square', ECollapse)
const otherItems = ToolBoxItem.Get()

ToolBoxGroup.Set('Basic', 'bars', basicItems)
ToolBoxGroup.Set('Form', 'list-alt', formItems)
ToolBoxGroup.Set('Data', 'database', dataItems)
ToolBoxGroup.Set('Notice', 'comments', noticeItems)
ToolBoxGroup.Set('Navigation', 'server', navigationItems)
ToolBoxGroup.Set('Others', 'life-ring', otherItems)

const ControlToolBox = ToolBoxGroup.Get()
export default ControlToolBox

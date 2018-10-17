<template>
    <div class="el-tree-node" @click.stop="handleClick" v-show="node.visible" :class="{
        'is-expanded': expanded,
        'is-current': tree.store.currentNode === node,
        'is-hidden': !node.visible,
        'is-focusable': !node.disabled,
        'is-checked': !node.disabled && node.checked
      }" role="treeitem" tabindex="-1" :aria-expanded="expanded" :aria-disabled="node.disabled" :aria-checked="node.checked">
        <div class="el-tree-node__content" :style="{ 'padding-left': (node.level - 1) * tree.indent + 'px' }">
            <span class="el-tree-node__expand-icon el-icon-caret-right" @click.stop="handleExpandIconClick" :class="{ 'is-leaf': node.isLeaf, expanded: !node.isLeaf && expanded }">
            </span>
            <el-checkbox v-if="showCheckbox" v-model="node.checked" :indeterminate="node.indeterminate" :disabled="!!node.disabled" @click.native.stop
                @change="handleCheckChange">
            </el-checkbox>
            <span v-if="node.loading" class="el-tree-node__loading-icon el-icon-loading">
            </span>
            <node-content :node="node"></node-content>
        </div>
        <el-collapse-transition>
            <div class="el-tree-node__children" v-if="!renderAfterExpand || childNodeRendered" v-show="expanded" role="group" :aria-expanded="expanded">
                <el-tree-node :render-content="renderContent" v-for="child in node.childNodes" :render-after-expand="renderAfterExpand" :key="getNodeKey(child)"
                    :node="child" @node-expand="handleChildNodeExpand">
                </el-tree-node>
            </div>
        </el-collapse-transition>
    </div>
</template>

<script type="text/jsx">
/* eslint-disable */

import ElCollapseTransition from 'element-ui/src/transitions/collapse-transition';
import ElCheckbox from 'element-ui/packages/checkbox';
import emitter from 'element-ui/src/mixins/emitter';

export default {
    name: 'ElTreeNode',

    componentName: 'ElTreeNode',

    mixins: [emitter],

    props: {
        node: {
            default() {
                return {};
            }
        },
        props: {},
        renderContent: Function,
        renderAfterExpand: {
            type: Boolean,
            default: true
        }
    },

    components: {
        ElCollapseTransition,
        ElCheckbox,
        NodeContent: {
            props: {
                node: {
                    required: true
                }
            },
            render(h) {
                const parent = this.$parent;
                const node = this.node;
                const data = node.data;
                const store = node.store;
                
                // easeui 修改实现图标
                if (parent.renderContent) {
                    return parent.renderContent.call(parent._renderProxy, h, { _self: parent.tree.$vnode.context, node, data, store })
                } else {
                    if (node.icon) {
                        return <span class="el-tree-node__label"><i class={node.icon}></i> {this.node.label}</span>
                    } else {
                        return <span class="el-tree-node__label">{this.node.label}</span>
                    }
                }
            }
        }
    },

    data() {
        return {
            tree: null,
            expanded: false,
            childNodeRendered: false,
            showCheckbox: false,
            oldChecked: null,
            oldIndeterminate: null
        };
    },

    watch: {
        'node.indeterminate'(val) {
            this.handleSelectChange(this.node.checked, val);
        },

        'node.checked'(val) {
            this.handleSelectChange(val, this.node.indeterminate);
        },

        'node.expanded'(val) {
            this.$nextTick(() => this.expanded = val);
            if (val) {
                this.childNodeRendered = true;
            }
        }
    },

    methods: {
        getNodeKey(node, index) {
            const nodeKey = this.tree.nodeKey;
            if (nodeKey && node) {
                return node.data[nodeKey];
            }
            return index;
        },

        handleSelectChange(checked, indeterminate) {
            if (this.oldChecked !== checked && this.oldIndeterminate !== indeterminate) {
                this.tree.$emit('check-change', this.node.data, checked, indeterminate);
            }
            this.oldChecked = checked;
            this.indeterminate = indeterminate;
        },

        handleClick() {
            const store = this.tree.store;
            store.setCurrentNode(this.node);
            this.tree.$emit('current-change', store.currentNode ? store.currentNode.data : null, store.currentNode);
            this.tree.currentNode = this;
            if (this.tree.expandOnClickNode) {
                this.handleExpandIconClick();
            }
            this.tree.$emit('node-click', this.node.data, this.node, this);
        },

        handleExpandIconClick() {
            if (this.node.isLeaf) return;
            if (this.expanded) {
                this.tree.$emit('node-collapse', this.node.data, this.node, this);
                this.node.collapse();
            } else {
                this.node.expand();
                this.$emit('node-expand', this.node.data, this.node, this);
            }
        },

        handleCheckChange(value, ev) {
            this.node.setChecked(ev.target.checked, !this.tree.checkStrictly);
        },

        handleChildNodeExpand(nodeData, node, instance) {
            this.broadcast('ElTreeNode', 'tree-node-expand', node);
            this.tree.$emit('node-expand', nodeData, node, instance);
        },

        // ==========easeui 处理拖动===============
        handleDragStart(e) {
            // console.log('DragStart: ' + this.node.label, e)
            e.stopPropagation() // 必须阻止向上传播

            this.tree.dragArgs = { source: this, target: null, cancel: false, position: -1 }
            this.tree.$emit('dragStart', this.tree.dragArgs)
            if (this.tree.dragArgs.cancel) {
                e.preventDefault()
                return false
            }
        },
        handleDragOver(e) {
            // console.log('DragOver: ' + this.node.label)
            e.stopPropagation() // 必须阻止向上传播

            let args = this.tree.dragArgs
            let oldTarget = args.target
            let oldPosition = args.position

            // 如果存在之前的drop target，则清除之前的样式
            if (oldTarget && oldTarget !== this) {
                this.clearDropStyle(oldTarget)
            }

            if (args.source === this) { // 源与目标相同不处理
                args.target = null
                return
            }

            args.target = this
            let newPosition = this.getDropPosition(this, e)
            args.position = newPosition

            if (oldTarget !== this || oldPosition !== newPosition) {
                this.clearDropStyle(this)
                this.tree.$emit('dragOver', args) // 开始激发事件
                if (!args.cancel) {
                    this.setDropStyle(this, newPosition) // 重新设置当前实例的drop style
                }
            }
        },
        handleDragEnd(e) {
            // console.log('DragEnd: ' + this.node.label, e)
            e.stopPropagation() // 必须阻止向上传播

            let args = this.tree.dragArgs
            if (!args.target) return // 没有drop目标不处理

            // 清除样式
            this.clearDropStyle(args.target)

            if (args.cancel) return // 已取消不处理

            // 同步数据与界面
            const store = this.tree.store
            let childrenProp = this.tree.props.children
            let targetNode = args.target.node

            // 删除当前拖动的node
            var dropNodeData = null
            if (args.source.node.parent.data[childrenProp] === undefined) {
                let index = args.source.node.parent.data.indexOf(args.source.node.data)
                dropNodeData = args.source.node.parent.data.splice(index, 1)[0]
            } else {
                let index = args.source.node.parent.data[childrenProp].indexOf(args.source.node.data)
                dropNodeData = args.source.node.parent.data[childrenProp].splice(index, 1)[0]
            }
            store.remove(args.source.node.data)

            // 往前插
            if (args.position == 0) {
                if (targetNode.parent.data[childrenProp] === undefined) {
                    var thisIndex = targetNode.parent.data.indexOf(targetNode.data)
                    targetNode.parent.data.splice(thisIndex, 0, dropNodeData)
                } else {
                    var thisIndex = targetNode.parent.data[childrenProp].indexOf(targetNode.data)
                    targetNode.parent.data[childrenProp].splice(thisIndex, 0, dropNodeData)
                }

                store.insertBefore(args.source.node.data, targetNode.data)
            }
            // 往后插
            if (args.position == 1) {
                if (targetNode.parent.data[childrenProp] === undefined) {
                    var thisIndex = targetNode.parent.data.indexOf(targetNode.data)
                    targetNode.parent.data.splice(thisIndex + 1, 0, dropNodeData)
                } else {
                    var thisIndex = targetNode.parent.data[childrenProp].indexOf(targetNode.data)
                    targetNode.parent.data[childrenProp].splice(thisIndex + 1, 0, dropNodeData)
                }
                store.insertAfter(args.source.node.data, targetNode.data)
            }
            // 往子集插
            if (args.position == 2) {
                targetNode.data[childrenProp].push(dropNodeData)
                store.append(args.source.node.data, targetNode.data)
            }

            // 开始激发事件
            this.tree.$emit('dragEnd', args)

            // reset dragArgs = null
            this.tree.dragArgs = null
        },
        clearDropStyle(vm) {
            let el = vm.expanded ? vm.$el.children[0] : vm.$el
            el.style.borderColor = ''
            el.style.borderStyle = ''
            el.style.borderWidth = ''
        },
        setDropStyle(vm, position) {
            let el = vm.expanded ? vm.$el.children[0] : vm.$el
            if (position === 0) {
                el.style.borderTopColor = '#FF0000'
                el.style.borderTopStyle = 'solid'
                el.style.borderTopWidth = '2px'
            } else if (position === 2) {
                el.style.borderColor = '#FF0000'
                el.style.borderStyle = 'solid'
                el.style.borderWidth = '2px'
            } else if (position === 1) {
                el.style.borderBottomColor = '#FF0000'
                el.style.borderBottomStyle = 'solid'
                el.style.borderBottomWidth = '2px'
            }
        },
        // return 0 插入该元素的前面， 1 插入该元素的后面， 2插入该元素的内部
        getDropPosition(vm, e) {
            // 如果当前元素处于展开状态则拖拽至其中间和底部的的元素都插入为其子元素
            let height = vm.expanded ? vm.$el.children[0].clientHeight : vm.$el.clientHeight
            if (0 <= e.offsetY && e.offsetY <= height / 4) {
                return 0
            } else if ((height / 4) < e.offsetY && e.offsetY <= (height - height / 4)) {
                return 2
            } else if (e.offsetY >= (height - height / 4)) {
                return 1
            }
        }
    },

    created() {
        const parent = this.$parent;

        if (parent.isTree) {
            this.tree = parent;
        } else {
            this.tree = parent.tree;
        }

        const tree = this.tree;
        if (!tree) {
            console.warn('Can not find node\'s tree.');
        }

        const props = tree.props || {};
        const childrenKey = props['children'] || 'children';

        this.$watch(`node.data.${childrenKey}`, () => {
            this.node.updateChildren();
        });

        this.showCheckbox = tree.showCheckbox;

        if (this.node.expanded) {
            this.expanded = true;
            this.childNodeRendered = true;
        }

        if (this.tree.accordion) {
            this.$on('tree-node-expand', node => {
                if (this.node !== node) {
                    this.node.collapse();
                }
            });
        }
    },

    // easeui 初始化拖动事件
    mounted() {
        if (this.tree.dragdrop) {
            this.$el.draggable = true
            this.$el.addEventListener('dragstart', this.handleDragStart, false)
            this.$el.addEventListener('dragover', this.handleDragOver, false)
            this.$el.addEventListener('dragend', this.handleDragEnd, false)
        }
    }
};
</script>
import Vue from 'vue';

/**
 * 该实现仅用于设计时异步加载ViewModel的组件，不使用缓存，加载的样式使用App.ViewStyles组件控制
 * @param viewModelID eg: sys.ProductDetail
 */
export default function LoadView(viewModelID: string, root: any): any {
    const name = viewModelID.replace('.', '');
    return Vue.component(name, function(resolve, reject) {
        // 开始Download代码及样式
        $runtime.channel.invoke('sys.DesignService.LoadView', [viewModelID]).then(res => {
            const result = JSON.parse(res);
            if (!result.Code) {
                reject('视图模型尚未编译');
            }

            // 定义需要的样式控制
            let styleMixin = null;
            if (result.Style) {
                styleMixin = {
                    created() {
                        // console.log('织入样式', root.$children[0].$children[0])
                        root.$children[0].$children[0].viewCreated(viewModelID, result.Style);
                    },
                    destroyed() {
                        // console.log('取消织入样式')
                        root.$children[0].$children[0].viewDestroyed(viewModelID);
                    }
                };
            }

            try {
                const vueProfile = new Function(result.Code)() || {}; // eslint-disable-line
                if (result.Style) {
                    // vueProfile.options.mixins.push(styleMixin) // 此种方式无效，注入样式控制
                    if (vueProfile.options.created) {
                        vueProfile.options.created = [styleMixin.created].concat(vueProfile.options.created);
                    } else {
                        vueProfile.options.created = [styleMixin.created];
                    }
                    if (vueProfile.options.destroyed) {
                        vueProfile.options.destroyed = [styleMixin.destroyed].concat(vueProfile.options.destroyed);
                    } else {
                        vueProfile.options.destroyed = [styleMixin.destroyed];
                    }
                }

                resolve(vueProfile);
            } catch (error) {
                reject(error);
            }
        }).catch(err => {
            reject(err);
        });
    });

}

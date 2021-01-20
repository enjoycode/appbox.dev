import router from './router'
import store from '@/design/DesignStore'
// import HttpChannel from '@/assets/js/HttpChannel'
import WebSocketChannel from "@/assets/js/Channel/WebSocketChannel";
import cookie from '@/assets/js/cookie'
import Runtime from '@/assets/js/Runtime'
import Long from '@/assets/js/Long';

export default function () {
    window.Long = Long;

    // 初始化运行时(仅IDE，预览由IDE传入)
    const isPreview = document.location.href.indexOf('/preview') > 0 // todo:暂简单判断
    if (!isPreview) {
        window.$runtime = Runtime
        Runtime._isDevelopment = true
        Runtime.cookie = cookie
        // Runtime.channel = new HttpChannel() // 根据是否预览设置不同的channel
        Runtime.channel = new WebSocketChannel();
        store.router = router // 根据是否预览加载不同的路由表
    }
}

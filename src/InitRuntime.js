import router from './router'
import store from '@/design/DesignStore'
import DebugService from "@/components/Designers/Service/DebugService";
import WebSocketChannel from "@/assets/js/Channel/WebSocketChannel";
import cookie from '@/assets/js/cookie'
import Runtime from '@/assets/js/Runtime'
import Long from '@/assets/js/Long';

/** 初始化IDE运行时(APP运行时不同，不需要导入设计时专用包) */
export default function () {
    window.Long = Long;

    // 初始化运行时(仅IDE，预览由IDE传入)
    const isPreview = document.location.href.indexOf('/preview') > 0 // todo:暂简单判断
    if (!isPreview) {
        window.$runtime = Runtime
        Runtime._isDevelopment = true
        Runtime.cookie = cookie
        let channel = new WebSocketChannel();
        channel.registerEventHandler(DebugService.DEBUG_EVENT, new DebugService()); //注册设计时调试事件处理器
        Runtime.channel = channel;
        store.router = router // 根据是否预览加载不同的路由表
    }
}

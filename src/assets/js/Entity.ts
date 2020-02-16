/** 映射至服务端的实体 */
export class Entity {
    private $T: string;

    constructor(modelId: string) {
        this.$T = "0" + modelId;
    }

    /** 是否新建的实例，另外标为删除的实例接受变更后也会转为新建的 */
    isNew(): boolean {
        return this.$T.charAt(0) === "0";
    }
    /** 是否已标为删除 */
    isDeleted(): boolean {
        return this.$T.charAt(0) === "3";
    }

    /** 标为已删除 */
    markDeleted() {
        if (!this.isNew()) {
            this.$T = "3" + this.$T.substring(1);
        }
    }

    /** 用于调用服务保存后同步状态 */
    acceptChanges() {
        this.$T = "1" + this.$T.substring(1);
        //TODO:继续处理EntityRef及EntitySet
    }

    /** 返回移除所有导航属性的拷贝 */
    detachNavigations() {
        //TODO:
    }
}

/**
 * 用于DesignSurface控制设计时的行为
 */
enum DesignBehavior {
    None = 0,
    /**
     * 允许重新设置设计对象的位置
     */
    CanMove = 1,
    /**
     * 允许改变设计对象的大小
     */
    CanResize = 2
}

export default DesignBehavior
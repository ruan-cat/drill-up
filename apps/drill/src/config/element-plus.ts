/**
 * Element Plus 全局配置
 * 参考：https://element-plus.org/zh-CN/guide/quickstart.html#%E5%85%A8%E5%B1%80%E9%85%8D%E7%BD%AE
 */

export const elementPlusConfig = {
	/**
	 * 全局 zIndex 配置
	 * 统一设置所有弹出组件的层级，确保在 RPGMV 游戏界面之上
	 */
	zIndex: 99999,

	/**
	 * 全局尺寸配置
	 * 可选值：'large' | 'default' | 'small'
	 */
	size: "default" as const,
};

/**
 * 获取 Element Plus 配置
 * 用于在 main.ts 中初始化 Element Plus
 */
export function getElementPlusConfig() {
	return elementPlusConfig;
}

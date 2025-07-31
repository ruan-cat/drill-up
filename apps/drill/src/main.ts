import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { GameBridge } from "./bridge/GameBridge";

import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

// 全量加载数据
// import "./rmmv-code-ts/index";

// 全量加载全部自写mv插件
// import "./mv-plugins/index.ts";

const app = createApp(App);

// 初始化游戏桥接器
const gameBridge = new GameBridge();

// 暴露到全局，供RPGMV插件使用
window.gameBridge = gameBridge;

app.use(ElementPlus);
app.mount("#vue-root-app");

// 监听RPGMV准备就绪事件
window.addEventListener("rpgmv-ready", () => {
	console.log("🎮 RPGMV is ready for communication");

	// 可以在这里执行一些初始化操作
	setTimeout(() => {
		const snapshot = gameBridge.getGameSnapshot();
		if (snapshot) {
			console.log("📊 Initial game state snapshot:", snapshot);
		}
	}, 500);
});

console.log("🚀 Vue app initialized with GameBridge");

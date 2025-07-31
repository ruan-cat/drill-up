<script setup lang="ts">
import { ElConfigProvider, ElNotification } from "element-plus";

import HelloWorld from "./components/HelloWorld.vue";
import RightInfo from "components/right-info/right-info.vue";
import GamePanel from "./components/GamePanel.vue";

// import "@/inform/inform";

/**
 * 全局组件index值
 * 通过 main.ts 中的 ElementPlus 全局配置统一设置
 * 这里主要用于 ElConfigProvider 的备用配置
 */
const globalZIndex = ref(99999);

// ElNotification({
// 	title: "你好，使用了 element-plus 🎉",
// 	message: "这是测试的全局显示内容",
// 	duration: 0,
// 	zIndex: 20,
// });

onMounted(() => {
	console.log(" in $gameScreen ", window!.$gameScreen);
});
</script>

<template>
	<section class="vite-vue-app-root">
		<!-- 
			ElConfigProvider 用于局部配置，但主要依赖 main.ts 中的全局配置
			全局 zIndex 已在 main.ts 中通过 ElementPlus 配置统一设置
		-->
		<ElConfigProvider :z-index="globalZIndex">
			<!-- 隐藏原有的 Vue 应用内容，只显示游戏界面 -->
			<!-- <a href="https://vitejs.dev" target="_blank">
				<img src="/vite.svg" class="logo" alt="Vite logo" />
			</a>
			<a href="https://vuejs.org/" target="_blank">
				<img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
			</a>
			<HelloWorld msg="Vite + Vue" />
			<RightInfo></RightInfo> -->

			<!-- 浮动游戏控制面板 -->
			<GamePanel />
		</ElConfigProvider>
	</section>
</template>

<style lang="scss" scoped>
.vite-vue-app-root {
	/* 让 Vue 应用完全透明，不干扰游戏界面 */
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	pointer-events: none; /* 允许点击穿透到游戏界面 */
	z-index: 9998; /* 确保在游戏界面之上，但低于控制面板 */
}

.logo {
	height: 6em;
	padding: 1.5em;
	will-change: filter;
	transition: filter 300ms;
}
.logo:hover {
	filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
	filter: drop-shadow(0 0 2em #42b883aa);
}
</style>

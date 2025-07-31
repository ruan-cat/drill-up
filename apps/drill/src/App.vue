<script setup lang="ts">
import { ElConfigProvider, ElNotification } from "element-plus";

import HelloWorld from "./components/HelloWorld.vue";
import RightInfo from "components/right-info/right-info.vue";
import GamePanel from "./components/GamePanel.vue";

// import "@/inform/inform";

/**
 * 全局组件index值
 * 默认element-plus的全部组件高于mv的内容
 */
const globalZIndex = ref(2);

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
		<ElConfigProvider :z-index="globalZIndex">
			<a href="https://vitejs.dev" target="_blank">
				<!-- 不使用来自 public 内提供的配置 -->
				<!-- <img src="/vite.svg" class="logo" alt="Vite logo" /> -->
			</a>
			<a href="https://vuejs.org/" target="_blank">
				<img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
			</a>
			<HelloWorld msg="Vite + Vue" />
			<RightInfo></RightInfo>
			<GamePanel />
		</ElConfigProvider>
	</section>
</template>

<style lang="scss" scoped>
.vite-vue-app-root {
	height: 95vh;
	width: 95vw;
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

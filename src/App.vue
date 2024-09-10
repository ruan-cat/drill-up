<script setup lang="ts">
import { ElConfigProvider } from "element-plus";

/**
 * 全局组件index值
 * 默认element-plus的全部组件高于mv的内容
 */
const globalZIndex = ref(2);

import HelloWorld from "./components/HelloWorld.vue";
import "@/inform/inform";
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
		</ElConfigProvider>
	</section>
</template>

<style lang="scss" scoped>
.vite-vue-app-root {
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

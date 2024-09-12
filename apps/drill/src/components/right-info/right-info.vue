<script lang="ts" setup>
// import { ref, computed, watch } from "vue";
const isShowElDrawer = ref(true);
</script>

<template>
	<section class="right-Info-root">
		<ElDrawer v-model="isShowElDrawer">
			<span>Hi there!</span>
		</ElDrawer>
	</section>
</template>

<style lang="scss" scoped>
.right-Info-root {
	// display: none;
	z-index: 2;

	position: absolute;
	right: 0;
	top: 0;

	width: 20vw;
	height: 90vh;

	// background-color: red;
}
</style>

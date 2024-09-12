const Graphics_modifyExistingElements_alias = Graphics._modifyExistingElements;

Graphics._modifyExistingElements = function () {
	// 全量覆盖策略
	// Graphics_modifyExistingElements_alias.call(this);

	// 暂不使用
	// const elements = document.getElementsByTagName("*") as unknown as HTMLElement[];
	// Array.from(elements).forEach((element) => {
	// 	const zIndex = element.style.zIndex as unknown as number;
	// 	console.log(` 我不设置了。傻逼玩意。 `, zIndex);
	// });

	console.warn(` 兄弟，咋们用vite了，都是热更新，就不要手动重设dom了。不做吃力不讨好的事情。 `);
};

const Graphics_createUpperCanvas_alias = Graphics._createUpperCanvas;
Graphics._createUpperCanvas = function () {
	Graphics_createUpperCanvas_alias.call(this);

	// 获取dom不合适，获取不到
	// const upperCanvasDom = document.getElementById("upperCanvas") as HTMLCanvasElement;
	// upperCanvasDom.style.margin = "initial";
	// upperCanvasDom.style.marginLeft = "0px";

	// 重设dom的所在位置
	Graphics._upperCanvas.style.margin = "initial";
	Graphics._upperCanvas.style.marginLeft = "0px";
	console.log(" 完成设置 ");
};

const Graphics_modifyExistingElements_alias = Graphics._modifyExistingElements;

Graphics._modifyExistingElements = function () {
	// 全量覆盖策略
	// Graphics_modifyExistingElements_alias.call(this);

	const elements = document.getElementsByTagName("*") as unknown as HTMLElement[];
	Array.from(elements).forEach((element) => {
		const zIndex = element.style.zIndex as unknown as number;
		console.log(` 我不设置了。傻逼玩意。 `, zIndex);
	});

	// elements.
	// for (var i = 0; i < elements.length; i++) {
	// 	if (elements[i].style.zIndex > 0) {
	// 		elements[i].style.zIndex = 0;
	// 	}
	// }
};

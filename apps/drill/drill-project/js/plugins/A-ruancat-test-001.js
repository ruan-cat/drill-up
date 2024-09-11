// import lodashES from "lodash-es";

(async function main() {
	console.log(" 阮喵喵 IIFE 就绪 ");

	const { uniqueId } = await import("lodash-es");
	const idPrefix = "ruancat-";

	function getId() {
		return uniqueId(idPrefix);
	}

	const id = getId();
	console.log(" show me id = ", id);
})();

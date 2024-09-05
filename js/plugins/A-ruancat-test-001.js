(async function main() {
  console.log(" 阮喵喵 IIFE 就绪 ");

  const lodashES = await import("lodash-es");
  const idPrefix = "ruancat-";

  function getId() {
    return lodashES.uniqueId(idPrefix);
  }

  const id = getId();
  console.log(" show me id = ");
})();

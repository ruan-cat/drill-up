import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";

import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

// 全量加载数据
// import "./rmmv-code-ts/index";

// 全量加载全部自写mv插件
// import "./mv-plugins/index.ts";

const app = createApp(App);

app.use(ElementPlus);
app.mount("#vue-root-app");

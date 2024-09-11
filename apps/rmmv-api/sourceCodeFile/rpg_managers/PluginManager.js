//-----------------------------------------------------------------------------
// PluginManager
// 插件管理器
// The static class that manages the plugins.
// 这个静态的类 管理 插件

function PluginManager() {
	throw new Error("This is a static class");
}
//路径 = 'js/plugins/'
PluginManager._path = "js/plugins/";
//脚本组 = []
PluginManager._scripts = [];
//错误地址组 = []
PluginManager._errorUrls = [];
//参数组 = []
PluginManager._parameters = {};
//安装
PluginManager.setup = function (plugins) {
	//插件组 对每一个 方法(插件)
	plugins.forEach(function (plugin) {
		//如果 (插件 状态 并且 不是 脚本组 包含 (插件 名称) )
		if (plugin.status && !this._scripts.contains(plugin.name)) {
			//设置参数组(插件 名称 , 插件 参数组)
			this.setParameters(plugin.name, plugin.parameters);
			//读取脚本(插件 名称 + ".js") //这里的形参都是字符串，就相当于‘插件名.js’ 一个完整的名称。
			this.loadScript(plugin.name + ".js");
			//脚本组 添加 (插件 名称)
			this._scripts.push(plugin.name);
		}
		//,this)
	}, this);
};
//检查错误
PluginManager.checkErrors = function () {
	//url位置 = 错误地址组 第一个()
	var url = this._errorUrls.shift();
	//如果(url位置)
	if (url) {
		//抛出 新 错误( "Failed to load"//读取失败  + url位置   )
		throw new Error("Failed to load: " + url);
	}
};
//参数
PluginManager.parameters = function (name) {
	//返回 参数组[名称 转换小写()] 或者 {} //name是字符串，调用toLowerCase()方法，将字母变成小写。
	return this._parameters[name.toLowerCase()] || {};
};
//设置参数组 //这个方法的本质就是把小写数据放进去，作为数组下标。
PluginManager.setParameters = function (name, parameters) {
	//参数组[名称 转换小写() ] = 参数组 //此时的parameters本质上就是一个plugins.js文件内$plugins 中的一个parameters变量。
	this._parameters[name.toLowerCase()] = parameters;
};
//读取脚本//此时的name是一个‘脚本名.js’
PluginManager.loadScript = function (name) {
	//url位置 = 路径 + 名称 // 现在的url相当于： js/plugins/脚本名.js
	var url = this._path + name;
	//脚本 = 文档 创建对象("script"//脚本)
	var script = document.createElement("script");
	//脚本 种类 = "text/javascript"
	script.type = "text/javascript";
	//脚本 位置 = url位置
	script.src = url;
	//脚本 异步 = false
	script.async = false;
	//脚本 当错误 = 当错误 绑定(this)
	script.onerror = this.onError.bind(this);
	//脚本 url位置 = url位置
	script._url = url;
	//文档 主体 添加子节点(脚本)
	document.body.appendChild(script);
};
//在错误
PluginManager.onError = function (e) {
	//错误地址组 添加 (错误 目标 url位置)
	this._errorUrls.push(e.target._url);
};

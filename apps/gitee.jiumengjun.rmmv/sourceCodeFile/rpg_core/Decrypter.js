//=============================================================================
// Decrypter.js
//=============================================================================

/**
 * 用于处理文件解密的静态类
 * The static class for handling file decryption.
 *
 * @class Decrypter
 */
function Decrypter() {
	throw new Error("This is a static class");
}

/**
 * 是否有加密图像
 * Whether there are encrypted images.
 * @static
 * @property hasEncryptedImages
 * @type Boolean
 */
Decrypter.hasEncryptedImages = false;

/**
 * 是否有加密音频
 * Whether there are encrypted audio files.
 * @static
 * @property hasEncryptedAudio
 * @type Boolean
 */
Decrypter.hasEncryptedAudio = false;

/**
 * 请求图像文件的数组
 * Array of requested image files.
 * @static
 * @private
 * @property _requestImgFile
 * @type Array
 */
Decrypter._requestImgFile = [];

/**
 * 头部长度
 * Header length.
 * @static
 * @private
 * @property _headerlength
 * @type Number
 */
Decrypter._headerlength = 16;

/**
 * XHR状态码阈值
 * XHR status code threshold.
 * @static
 * @private
 * @property _xhrOk
 * @type Number
 */
Decrypter._xhrOk = 400;

/**
 * 加密密钥
 * Encryption key.
 * @static
 * @private
 * @property _encryptionKey
 * @type String
 */
Decrypter._encryptionKey = "";

/**
 * 忽略列表
 * Ignore list.
 * @static
 * @private
 * @property _ignoreList
 * @type Array
 */
Decrypter._ignoreList = ["img/system/Window.png"];

/**
 * 签名
 * Signature.
 * @static
 * @property SIGNATURE
 * @type String
 */
Decrypter.SIGNATURE = "5250474d56000000";

/**
 * 版本
 * Version.
 * @static
 * @property VER
 * @type String
 */
Decrypter.VER = "000301";

/**
 * 剩余部分
 * Remaining part.
 * @static
 * @property REMAIN
 * @type String
 */
Decrypter.REMAIN = "0000000000";

/**
 * 检查图像是否应在加密时被忽略
 * Checks whether the image should be ignored for encryption.
 *
 * @static
 * @method checkImgIgnore
 * @param {String} url - 要检查的图像URL / The image URL to check
 * @return {Boolean} 如果图像应被忽略则返回true / True if the image should be ignored
 */
Decrypter.checkImgIgnore = function (url) {
	for (var cnt = 0; cnt < this._ignoreList.length; cnt++) {
		if (url === this._ignoreList[cnt]) return true;
	}
	return false;
};

/**
 * 解密加密图像并将其加载到位图中
 * Decrypts an encrypted image and loads it into the bitmap.
 *
 * @static
 * @method decryptImg
 * @param {String} url - 加密图像的URL / The URL of the encrypted image
 * @param {Bitmap} bitmap - 要加载图像的位图对象 / The bitmap object to load the image into
 */
Decrypter.decryptImg = function (url, bitmap) {
	url = this.extToEncryptExt(url);

	var requestFile = new XMLHttpRequest();
	requestFile.open("GET", url);
	requestFile.responseType = "arraybuffer";
	requestFile.send();

	requestFile.onload = function () {
		if (this.status < Decrypter._xhrOk) {
			var arrayBuffer = Decrypter.decryptArrayBuffer(requestFile.response);
			bitmap._image.src = Decrypter.createBlobUrl(arrayBuffer);
			bitmap._image.addEventListener("load", (bitmap._loadListener = Bitmap.prototype._onLoad.bind(bitmap)));
			bitmap._image.addEventListener(
				"error",
				(bitmap._errorListener = bitmap._loader || Bitmap.prototype._onError.bind(bitmap)),
			);
		}
	};

	requestFile.onerror = function () {
		if (bitmap._loader) {
			bitmap._loader();
		} else {
			bitmap._onError();
		}
	};
};

/**
 * 解密HTML5音频文件
 * Decrypts HTML5 audio files.
 *
 * @static
 * @method decryptHTML5Audio
 * @param {String} url - 音频文件URL / The audio file URL
 * @param {Object} bgm - 背景音乐对象 / The background music object
 * @param {Number} pos - 位置 / The position
 */
Decrypter.decryptHTML5Audio = function (url, bgm, pos) {
	var requestFile = new XMLHttpRequest();
	requestFile.open("GET", url);
	requestFile.responseType = "arraybuffer";
	requestFile.send();

	requestFile.onload = function () {
		if (this.status < Decrypter._xhrOk) {
			var arrayBuffer = Decrypter.decryptArrayBuffer(requestFile.response);
			var url = Decrypter.createBlobUrl(arrayBuffer);
			AudioManager.createDecryptBuffer(url, bgm, pos);
		}
	};
};

/**
 * 切除数组缓冲区的头部
 * Cuts the header from the array buffer.
 *
 * @static
 * @method cutArrayHeader
 * @param {ArrayBuffer} arrayBuffer - 要处理的数组缓冲区 / The array buffer to process
 * @param {Number} length - 要切除的长度 / The length to cut
 * @return {ArrayBuffer} 处理后的数组缓冲区 / The processed array buffer
 */
Decrypter.cutArrayHeader = function (arrayBuffer, length) {
	return arrayBuffer.slice(length);
};

/**
 * 解密数组缓冲区
 * Decrypts the array buffer.
 *
 * @static
 * @method decryptArrayBuffer
 * @param {ArrayBuffer} arrayBuffer - 要解密的数组缓冲区 / The array buffer to decrypt
 * @return {ArrayBuffer} 解密后的数组缓冲区 / The decrypted array buffer
 */
Decrypter.decryptArrayBuffer = function (arrayBuffer) {
	if (!arrayBuffer) return null;
	var header = new Uint8Array(arrayBuffer, 0, this._headerlength);

	var i;
	var ref = this.SIGNATURE + this.VER + this.REMAIN;
	var refBytes = new Uint8Array(16);
	for (i = 0; i < this._headerlength; i++) {
		refBytes[i] = parseInt("0x" + ref.substr(i * 2, 2), 16);
	}
	for (i = 0; i < this._headerlength; i++) {
		if (header[i] !== refBytes[i]) {
			throw new Error("Header is wrong");
		}
	}

	arrayBuffer = this.cutArrayHeader(arrayBuffer, Decrypter._headerlength);
	var view = new DataView(arrayBuffer);
	this.readEncryptionkey();
	if (arrayBuffer) {
		var byteArray = new Uint8Array(arrayBuffer);
		for (i = 0; i < this._headerlength; i++) {
			byteArray[i] = byteArray[i] ^ parseInt(Decrypter._encryptionKey[i], 16);
			view.setUint8(i, byteArray[i]);
		}
	}

	return arrayBuffer;
};

/**
 * 从数组缓冲区创建Blob URL
 * Creates a Blob URL from the array buffer.
 *
 * @static
 * @method createBlobUrl
 * @param {ArrayBuffer} arrayBuffer - 数组缓冲区 / The array buffer
 * @return {String} Blob URL
 */
Decrypter.createBlobUrl = function (arrayBuffer) {
	var blob = new Blob([arrayBuffer]);
	return window.URL.createObjectURL(blob);
};

/**
 * 将文件扩展名转换为加密扩展名
 * Converts file extension to encrypted extension.
 *
 * @static
 * @method extToEncryptExt
 * @param {String} url - 文件URL / The file URL
 * @return {String} 带有加密扩展名的URL / The URL with encrypted extension
 */
Decrypter.extToEncryptExt = function (url) {
	var ext = url.split(".").pop();
	var encryptedExt = ext;

	if (ext === "ogg") encryptedExt = ".rpgmvo";
	else if (ext === "m4a") encryptedExt = ".rpgmvm";
	else if (ext === "png") encryptedExt = ".rpgmvp";
	else encryptedExt = ext;

	return url.slice(0, url.lastIndexOf(ext) - 1) + encryptedExt;
};

/**
 * 读取加密密钥
 * Reads the encryption key.
 *
 * @static
 * @method readEncryptionkey
 */
Decrypter.readEncryptionkey = function () {
	this._encryptionKey = $dataSystem.encryptionKey.split(/(.{2})/).filter(Boolean);
};

//-----------------------------------------------------------------------------

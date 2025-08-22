//-----------------------------------------------------------------------------
/**
 * @fileoverview StorageManager
 * @author 阮喵喵（翻译）
 * @classdesc
 * 存储管理器 - 管理保存游戏数据的存储的静态类
 * Storage Manager - The static class that manages storage for saving game data.
 */

/**
 * @class StorageManager
 * @classdesc
 * 管理保存游戏数据的存储的静态类。
 * The static class that manages storage for saving game data.
 * @static
 */
function StorageManager() {
    throw new Error('This is a static class');
}

/**
 * @static
 * @method save
 * @description
 * 保存数据到存储
 * Save data to storage
 * @param {Number} savefileId - The save file ID - 存档文件ID
 * @param {String} json - The JSON data to save - 要保存的JSON数据
 */
StorageManager.save = function(savefileId, json) {
    if (this.isLocalMode()) {
        this.saveToLocalFile(savefileId, json);
    } else {
        this.saveToWebStorage(savefileId, json);
    }
};

/**
 * @static
 * @method load
 * @description
 * 从存储加载数据
 * Load data from storage
 * @param {Number} savefileId - The save file ID - 存档文件ID
 * @returns {String} The loaded JSON data - 加载的JSON数据
 */
StorageManager.load = function(savefileId) {
    if (this.isLocalMode()) {
        return this.loadFromLocalFile(savefileId);
    } else {
        return this.loadFromWebStorage(savefileId);
    }
};

/**
 * @static
 * @method exists
 * @description
 * 检查存档是否存在
 * Check if save file exists
 * @param {Number} savefileId - The save file ID - 存档文件ID
 * @returns {Boolean} True if the save file exists - 存档文件是否存在
 */
StorageManager.exists = function(savefileId) {
    if (this.isLocalMode()) {
        return this.localFileExists(savefileId);
    } else {
        return this.webStorageExists(savefileId);
    }
};

/**
 * @static
 * @method remove
 * @description
 * 移除存档
 * Remove save file
 * @param {Number} savefileId - The save file ID - 存档文件ID
 */
StorageManager.remove = function(savefileId) {
    if (this.isLocalMode()) {
        this.removeLocalFile(savefileId);
    } else {
        this.removeWebStorage(savefileId);
    }
};

/**
 * @static
 * @method backup
 * @description
 * 备份存档
 * Backup save file
 * @param {Number} savefileId - The save file ID - 存档文件ID
 */
StorageManager.backup = function(savefileId) {
    if (this.exists(savefileId)) {
        if (this.isLocalMode()) {
            var data = this.loadFromLocalFile(savefileId);
            var compressed = LZString.compressToBase64(data);
            var fs = require('fs');
            var dirPath = this.localFileDirectoryPath();
            var filePath = this.localFilePath(savefileId) + ".bak";
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath);
            }
            fs.writeFileSync(filePath, compressed);
        } else {
            var data = this.loadFromWebStorage(savefileId);
            var compressed = LZString.compressToBase64(data);
            var key = this.webStorageKey(savefileId) + "bak";
            localStorage.setItem(key, compressed);
        }
    }
};

/**
 * @static
 * @method backupExists
 * @description
 * 检查备份是否存在
 * Check if backup exists
 * @param {Number} savefileId - The save file ID - 存档文件ID
 * @returns {Boolean} True if backup exists - 备份是否存在
 */
StorageManager.backupExists = function(savefileId) {
    if (this.isLocalMode()) {
        return this.localFileBackupExists(savefileId);
    } else {
        return this.webStorageBackupExists(savefileId);
    }
};

/**
 * @static
 * @method cleanBackup
 * @description
 * 清除备份
 * Clean backup
 * @param {Number} savefileId - The save file ID - 存档文件ID
 */
StorageManager.cleanBackup = function(savefileId) {
	if (this.backupExists(savefileId)) {
		if (this.isLocalMode()) {
			var fs = require('fs');
            var dirPath = this.localFileDirectoryPath();
            var filePath = this.localFilePath(savefileId);
            fs.unlinkSync(filePath + ".bak");
		} else {
		    var key = this.webStorageKey(savefileId);
			localStorage.removeItem(key + "bak");
		}
	}
};

/**
 * @static
 * @method restoreBackup
 * @description
 * 还原备份
 * Restore backup
 * @param {Number} savefileId - The save file ID - 存档文件ID
 */
StorageManager.restoreBackup = function(savefileId) {
    if (this.backupExists(savefileId)) {
        if (this.isLocalMode()) {
            var data = this.loadFromLocalBackupFile(savefileId);
            var compressed = LZString.compressToBase64(data);
            var fs = require('fs');
            var dirPath = this.localFileDirectoryPath();
            var filePath = this.localFilePath(savefileId);
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath);
            }
            fs.writeFileSync(filePath, compressed);
            fs.unlinkSync(filePath + ".bak");
        } else {
            var data = this.loadFromWebStorageBackup(savefileId);
            var compressed = LZString.compressToBase64(data);
            var key = this.webStorageKey(savefileId);
            localStorage.setItem(key, compressed);
            localStorage.removeItem(key + "bak");
        }
    }
};

/**
 * @static
 * @method isLocalMode
 * @description
 * 检查是否本地模式
 * 在 PC 平台上使用 NW.js，即为本地模式。
 * Check if in local mode
 * Uses NW.js on PC platform as local mode.
 * @returns {Boolean} True if in local mode - 是否为本地模式
 */
StorageManager.isLocalMode = function() {
    return Utils.isNwjs();
};

/**
 * @static
 * @method saveToLocalFile
 * @description
 * 保存到本地文件
 * Save to local file
 * @param {Number} savefileId - The save file ID - 存档文件ID
 * @param {String} json - The JSON data to save - 要保存的JSON数据
 */
StorageManager.saveToLocalFile = function(savefileId, json) {
    var data = LZString.compressToBase64(json);
    var fs = require('fs');
    var dirPath = this.localFileDirectoryPath();
    var filePath = this.localFilePath(savefileId);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
    }
    fs.writeFileSync(filePath, data);
};

/**
 * @static
 * @method loadFromLocalFile
 * @description
 * 从本地文件加载
 * Load from local file
 * @param {Number} savefileId - The save file ID - 存档文件ID
 * @returns {String} The loaded data - 加载的数据
 */
StorageManager.loadFromLocalFile = function(savefileId) {
    var data = null;
    var fs = require('fs');
    var filePath = this.localFilePath(savefileId);
    if (fs.existsSync(filePath)) {
        data = fs.readFileSync(filePath, { encoding: 'utf8' });
    }
    return LZString.decompressFromBase64(data);
};

/**
 * @static
 * @method loadFromLocalBackupFile
 * @description
 * 从本地备份文件加载
 * Load from local backup file
 * @param {Number} savefileId - The save file ID - 存档文件ID
 * @returns {String} The loaded backup data - 加载的备份数据
 */
StorageManager.loadFromLocalBackupFile = function(savefileId) {
    var data = null;
    var fs = require('fs');
    var filePath = this.localFilePath(savefileId) + ".bak";
    if (fs.existsSync(filePath)) {
        data = fs.readFileSync(filePath, { encoding: 'utf8' });
    }
    return LZString.decompressFromBase64(data);
};

/**
 * @static
 * @method localFileBackupExists
 * @description
 * 检查本地文件备份是否存在
 * Check if local file backup exists
 * @param {Number} savefileId - The save file ID - 存档文件ID
 * @returns {Boolean} True if backup exists - 备份是否存在
 */
StorageManager.localFileBackupExists = function(savefileId) {
    var fs = require('fs');
    return fs.existsSync(this.localFilePath(savefileId) + ".bak");
};

/**
 * @static
 * @method localFileExists
 * @description
 * 检查本地文件是否存在
 * Check if local file exists
 * @param {Number} savefileId - The save file ID - 存档文件ID
 * @returns {Boolean} True if file exists - 文件是否存在
 */
StorageManager.localFileExists = function(savefileId) {
    var fs = require('fs');
    return fs.existsSync(this.localFilePath(savefileId));
};

/**
 * @static
 * @method removeLocalFile
 * @description
 * 移除本地文件
 * Remove local file
 * @param {Number} savefileId - The save file ID - 存档文件ID
 */
StorageManager.removeLocalFile = function(savefileId) {
    var fs = require('fs');
    var filePath = this.localFilePath(savefileId);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
};

/**
 * @static
 * @method saveToWebStorage
 * @description
 * 保存到浏览器存储
 * Save to web storage
 * @param {Number} savefileId - The save file ID - 存档文件ID
 * @param {String} json - The JSON data to save - 要保存的JSON数据
 */
StorageManager.saveToWebStorage = function(savefileId, json) {
    var key = this.webStorageKey(savefileId);
    var data = LZString.compressToBase64(json);
    localStorage.setItem(key, data);
};

/**
 * @static
 * @method loadFromWebStorage
 * @description
 * 从浏览器存储加载
 * Load from web storage
 * @param {Number} savefileId - The save file ID - 存档文件ID
 * @returns {String} The loaded data - 加载的数据
 */
StorageManager.loadFromWebStorage = function(savefileId) {
    var key = this.webStorageKey(savefileId);
    var data = localStorage.getItem(key);
    return LZString.decompressFromBase64(data);
};

/**
 * @static
 * @method loadFromWebStorageBackup
 * @description
 * 从浏览器存储备份加载
 * Load from web storage backup
 * @param {Number} savefileId - The save file ID - 存档文件ID
 * @returns {String} The loaded backup data - 加载的备份数据
 */
StorageManager.loadFromWebStorageBackup = function(savefileId) {
    var key = this.webStorageKey(savefileId) + "bak";
    var data = localStorage.getItem(key);
    return LZString.decompressFromBase64(data);
};

/**
 * @static
 * @method webStorageBackupExists
 * @description
 * 检查浏览器存储备份是否存在
 * Check if web storage backup exists
 * @param {Number} savefileId - The save file ID - 存档文件ID
 * @returns {Boolean} True if backup exists - 备份是否存在
 */
StorageManager.webStorageBackupExists = function(savefileId) {
    var key = this.webStorageKey(savefileId) + "bak";
    return !!localStorage.getItem(key);
};

/**
 * @static
 * @method webStorageExists
 * @description
 * 检查浏览器存储是否存在
 * Check if web storage exists
 * @param {Number} savefileId - The save file ID - 存档文件ID
 * @returns {Boolean} True if storage exists - 存储是否存在
 */
StorageManager.webStorageExists = function(savefileId) {
    var key = this.webStorageKey(savefileId);
    return !!localStorage.getItem(key);
};

/**
 * @static
 * @method removeWebStorage
 * @description
 * 移除浏览器存储
 * Remove web storage
 * @param {Number} savefileId - The save file ID - 存档文件ID
 */
StorageManager.removeWebStorage = function(savefileId) {
    var key = this.webStorageKey(savefileId);
    localStorage.removeItem(key);
};

/**
 * @static
 * @method localFileDirectoryPath
 * @description
 * 获取本地文件目录路径
 * Get local file directory path
 * @returns {String} The directory path - 目录路径
 */
StorageManager.localFileDirectoryPath = function() {
    var path = require('path');
    var base = path.dirname(process.mainModule.filename);
    return path.join(base, 'save/');
};

/**
 * @static
 * @method localFilePath
 * @description
 * 获取本地文件路径
 * Get local file path
 * @param {Number} savefileId - The save file ID - 存档文件ID
 * @returns {String} The file path - 文件路径
 */
StorageManager.localFilePath = function(savefileId) {
    var name;
    if (savefileId < 0) {
        name = 'config.rpgsave';
    } else if (savefileId === 0) {
        name = 'global.rpgsave';
    } else {
        name = 'file%1.rpgsave'.format(savefileId);
    }
    return this.localFileDirectoryPath() + name;
};

/**
 * @static
 * @method webStorageKey
 * @description
 * 获取浏览器存储键名
 * Get web storage key
 * @param {Number} savefileId - The save file ID - 存档文件ID
 * @returns {String} The storage key - 存储键名
 */
StorageManager.webStorageKey = function(savefileId) {
    if (savefileId < 0) {
        return 'RPG Config';
    } else if (savefileId === 0) {
        return 'RPG Global';
    } else {
        return 'RPG File%1'.format(savefileId);
    }
};
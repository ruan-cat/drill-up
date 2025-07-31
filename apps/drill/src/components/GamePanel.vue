<template>
	<div class="game-panel" :class="{ 'panel-collapsed': isCollapsed }">
		<!-- 折叠按钮 -->
		<div class="collapse-button" @click="toggleCollapse">
			<ElIcon :size="20">
				<component :is="isCollapsed ? 'ArrowLeft' : 'ArrowRight'" />
			</ElIcon>
		</div>

		<ElCard class="panel-card" v-show="!isCollapsed">
			<template #header>
				<div class="card-header">
					<h3>🎮 游戏状态控制面板</h3>
					<div class="connection-status">
						<ElTag :type="isConnected ? 'success' : 'danger'">
							{{ isConnected ? "已连接" : "未连接" }}
						</ElTag>
					</div>
				</div>
			</template>

			<!-- 错误显示 -->
			<ElAlert v-if="hasError" :title="lastError || ''" type="error" closable @close="clearError" class="error-alert" />

			<!-- 连接状态和操作 -->
			<ElRow :gutter="20" class="control-section">
				<ElCol :span="12">
					<ElButton @click="refreshGameState" :loading="isLoading" type="primary" :icon="RefreshRight">
						刷新游戏状态
					</ElButton>
				</ElCol>
				<ElCol :span="12">
					<ElButton @click="checkConnection" :icon="Connection"> 检查连接 </ElButton>
				</ElCol>
			</ElRow>

			<!-- 变量控制 -->
			<ElDivider content-position="left">
				<h4>🔢 变量控制</h4>
			</ElDivider>
			<ElRow :gutter="20" class="control-section">
				<ElCol :span="6">
					<ElInputNumber v-model="variableId" :min="1" :max="999" placeholder="变量ID" />
				</ElCol>
				<ElCol :span="10">
					<ElInput v-model="variableValue" placeholder="变量值" />
				</ElCol>
				<ElCol :span="8">
					<ElButton @click="updateVariable" type="primary" :disabled="!isConnected"> 更新变量 </ElButton>
				</ElCol>
			</ElRow>
			<div class="current-value" v-if="gameState.variables[variableId] !== undefined">
				当前值: <ElTag>{{ gameState.variables[variableId] }}</ElTag>
			</div>

			<!-- 开关控制 -->
			<ElDivider content-position="left">
				<h4>🔘 开关控制</h4>
			</ElDivider>
			<ElRow :gutter="20" class="control-section">
				<ElCol :span="8">
					<ElInputNumber v-model="switchId" :min="1" :max="999" placeholder="开关ID" />
				</ElCol>
				<ElCol :span="8">
					<ElButton
						@click="toggleSwitch"
						:type="gameState.switches[switchId] ? 'success' : 'info'"
						:disabled="!isConnected"
					>
						{{ gameState.switches[switchId] ? "ON" : "OFF" }}
					</ElButton>
				</ElCol>
				<ElCol :span="8">
					<ElTag :type="gameState.switches[switchId] ? 'success' : 'info'">
						状态: {{ gameState.switches[switchId] ? "开启" : "关闭" }}
					</ElTag>
				</ElCol>
			</ElRow>

			<!-- 消息发送 -->
			<ElDivider content-position="left">
				<h4>💬 消息控制</h4>
			</ElDivider>
			<ElRow :gutter="20" class="control-section">
				<ElCol :span="16">
					<ElInput v-model="message" placeholder="输入要显示的消息" @keyup.enter="sendMessage" />
				</ElCol>
				<ElCol :span="8">
					<ElButton @click="sendMessage" type="primary" :disabled="!isConnected || !message.trim()">
						发送消息
					</ElButton>
				</ElCol>
			</ElRow>

			<!-- 音效控制 -->
			<ElDivider content-position="left">
				<h4>🔊 音效控制</h4>
			</ElDivider>
			<ElRow :gutter="20" class="control-section">
				<ElCol :span="12">
					<ElSelect v-model="selectedSE" placeholder="选择音效">
						<ElOption v-for="se in commonSEs" :key="se.value" :label="se.label" :value="se.value" />
					</ElSelect>
				</ElCol>
				<ElCol :span="6">
					<ElSlider v-model="seVolume" :min="0" :max="100" />
				</ElCol>
				<ElCol :span="6">
					<ElButton @click="playSelectedSE" type="primary" :disabled="!isConnected || !selectedSE"> 播放 </ElButton>
				</ElCol>
			</ElRow>

			<!-- 场景控制 -->
			<ElDivider content-position="left">
				<h4>🎬 场景控制</h4>
			</ElDivider>
			<ElRow :gutter="20" class="control-section">
				<ElCol :span="12">
					<ElSelect v-model="selectedScene" placeholder="选择场景">
						<ElOption v-for="scene in commonScenes" :key="scene.value" :label="scene.label" :value="scene.value" />
					</ElSelect>
				</ElCol>
				<ElCol :span="12">
					<ElButton @click="changeToSelectedScene" type="warning" :disabled="!isConnected || !selectedScene">
						切换场景
					</ElButton>
				</ElCol>
			</ElRow>

			<!-- 传送控制 -->
			<ElDivider content-position="left">
				<h4>🚀 传送控制</h4>
			</ElDivider>
			<ElRow :gutter="20" class="control-section">
				<ElCol :span="6">
					<ElInputNumber v-model="transferData.mapId" :min="1" placeholder="地图ID" />
				</ElCol>
				<ElCol :span="6">
					<ElInputNumber v-model="transferData.x" :min="0" placeholder="X坐标" />
				</ElCol>
				<ElCol :span="6">
					<ElInputNumber v-model="transferData.y" :min="0" placeholder="Y坐标" />
				</ElCol>
				<ElCol :span="6">
					<ElButton @click="transferPlayer" type="danger" :disabled="!isConnected || !transferData.mapId">
						传送
					</ElButton>
				</ElCol>
			</ElRow>

			<!-- 玩家数据显示 -->
			<ElDivider content-position="left">
				<h4>👤 玩家数据</h4>
			</ElDivider>
			<ElDescriptions :column="2" border>
				<ElDescriptionsItem label="姓名">
					<ElTag type="info">{{ gameState.playerData.name || "未知" }}</ElTag>
				</ElDescriptionsItem>
				<ElDescriptionsItem label="等级">
					<ElTag type="success">{{ gameState.playerData.level }}</ElTag>
				</ElDescriptionsItem>
				<ElDescriptionsItem label="HP">
					<ElProgress :percentage="(gameState.playerData.hp / 1000) * 100" :show-text="false" />
					<span class="progress-text">{{ gameState.playerData.hp }}</span>
				</ElDescriptionsItem>
				<ElDescriptionsItem label="MP">
					<ElProgress :percentage="(gameState.playerData.mp / 500) * 100" :show-text="false" color="#409eff" />
					<span class="progress-text">{{ gameState.playerData.mp }}</span>
				</ElDescriptionsItem>
				<ElDescriptionsItem label="经验值">
					<ElTag type="warning">{{ gameState.playerData.exp }}</ElTag>
				</ElDescriptionsItem>
				<ElDescriptionsItem label="当前场景">
					<ElTag type="primary">{{ gameState.currentScene || "未知" }}</ElTag>
				</ElDescriptionsItem>
				<ElDescriptionsItem label="当前地图">
					<ElTag>地图 {{ gameState.mapId || 0 }}</ElTag>
				</ElDescriptionsItem>
				<ElDescriptionsItem label="连接状态">
					<ElTag :type="isConnected ? 'success' : 'danger'">
						{{ isConnected ? "已连接" : "未连接" }}
					</ElTag>
				</ElDescriptionsItem>
			</ElDescriptions>
		</ElCard>
	</div>
</template>

<script setup lang="ts">
import {
	ElCard,
	ElButton,
	ElRow,
	ElCol,
	ElInputNumber,
	ElInput,
	ElTag,
	ElAlert,
	ElDivider,
	ElDescriptions,
	ElDescriptionsItem,
	ElProgress,
	ElSelect,
	ElOption,
	ElSlider,
	ElMessage,
} from "element-plus";
import { RefreshRight, Connection } from "@element-plus/icons-vue";
import { useGameState } from "@/composables/useGameState";

const {
	gameState,
	isLoading,
	lastError,
	setVariable,
	setSwitch,
	showMessage,
	playSE,
	changeScene,
	transferPlayer: doTransferPlayer,
	refreshGameState,
	setupListeners,
	cleanupListeners,
	checkConnection,
	clearError,
	isConnected,
	hasError,
} = useGameState();

// 表单数据
const variableId = ref(1);
const variableValue = ref("");
const switchId = ref(1);
const message = ref("");
const selectedSE = ref("");
const seVolume = ref(90);
const selectedScene = ref("");

// 面板折叠状态
const isCollapsed = ref(false);

// 折叠/展开面板
const toggleCollapse = () => {
	isCollapsed.value = !isCollapsed.value;
};

const transferData = reactive({
	mapId: 1,
	x: 0,
	y: 0,
});

// 常用音效列表
const commonSEs = [
	{ label: "确认音", value: "Decision1" },
	{ label: "取消音", value: "Cancel1" },
	{ label: "蜂鸣音", value: "Buzzer1" },
	{ label: "光标音", value: "Cursor1" },
	{ label: "物品音", value: "Item1" },
	{ label: "技能音", value: "Skill1" },
	{ label: "装备音", value: "Equip1" },
	{ label: "保存音", value: "Save" },
	{ label: "加载音", value: "Load" },
	{ label: "战斗开始", value: "Battle1" },
];

// 常用场景列表
const commonScenes = [
	{ label: "地图场景", value: "Scene_Map" },
	{ label: "主菜单", value: "Scene_Menu" },
	{ label: "标题画面", value: "Scene_Title" },
	{ label: "游戏结束", value: "Scene_Gameover" },
	{ label: "道具菜单", value: "Scene_Item" },
	{ label: "技能菜单", value: "Scene_Skill" },
	{ label: "装备菜单", value: "Scene_Equip" },
	{ label: "状态菜单", value: "Scene_Status" },
	{ label: "选项菜单", value: "Scene_Options" },
	{ label: "存档菜单", value: "Scene_Save" },
];

// 方法
const updateVariable = () => {
	if (variableId.value && variableValue.value !== "") {
		setVariable(variableId.value, variableValue.value);
		ElMessage.success(`变量 ${variableId.value} 已更新为: ${variableValue.value}`);
	}
};

const toggleSwitch = () => {
	const currentValue = gameState.switches[switchId.value] || false;
	setSwitch(switchId.value, !currentValue);
	ElMessage.success(`开关 ${switchId.value} 已${!currentValue ? "开启" : "关闭"}`);
};

const sendMessage = () => {
	if (message.value.trim()) {
		showMessage(message.value);
		ElMessage.success("消息已发送到游戏");
		message.value = "";
	}
};

const playSelectedSE = () => {
	if (selectedSE.value) {
		playSE(selectedSE.value, seVolume.value);
		ElMessage.success(`播放音效: ${selectedSE.value}`);
	}
};

const changeToSelectedScene = () => {
	if (selectedScene.value) {
		changeScene(selectedScene.value);
		ElMessage.success(`切换到场景: ${selectedScene.value}`);
	}
};

const transferPlayer = () => {
	if (transferData.mapId) {
		doTransferPlayer(transferData.mapId, transferData.x, transferData.y);
		ElMessage.success(`传送到地图 ${transferData.mapId} (${transferData.x}, ${transferData.y})`);
	}
};

// 生命周期
onMounted(() => {
	setupListeners();
	checkConnection();

	// 延迟刷新状态，确保连接已建立
	setTimeout(() => {
		if (isConnected.value) {
			refreshGameState();
		}
	}, 1000);
});

onUnmounted(() => {
	cleanupListeners();
});
</script>

<style lang="scss" scoped>
.game-panel {
	/* 浮动面板样式 */
	position: fixed;
	top: 20px;
	right: 20px;
	width: 400px;
	max-height: calc(100vh - 40px);
	overflow-y: auto;
	background: rgba(255, 255, 255, 0.95);
	backdrop-filter: blur(10px);
	border-radius: 8px;
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
	pointer-events: auto; /* 恢复点击事件 */
	z-index: 1001; /* 确保在游戏界面之上 */
}

.panel-card {
	margin-bottom: 0;
	border: none;
	background: transparent;
}

.card-header {
	display: flex;
	justify-content: space-between;
	align-items: center;

	h3 {
		margin: 0;
		color: #409eff;
	}
}

.connection-status {
	display: flex;
	align-items: center;
	gap: 10px;
}

.error-alert {
	margin-bottom: 20px;
}

.control-section {
	margin-bottom: 15px;
	align-items: center;

	.el-col {
		display: flex;
		align-items: center;
	}
}

.current-value {
	margin-top: 5px;
	font-size: 14px;
	color: #666;
}

.progress-text {
	margin-left: 10px;
	font-size: 14px;
	color: #666;
}

.el-divider {
	margin: 20px 0 15px 0;

	h4 {
		margin: 0;
		color: #333;
	}
}

.el-descriptions {
	margin-top: 10px;
}

:deep(.el-input-number) {
	width: 100%;
}

:deep(.el-select) {
	width: 100%;
}

:deep(.el-slider) {
	margin: 0 10px;
}

/* 浮动面板的滚动条样式 */
.game-panel::-webkit-scrollbar {
	width: 6px;
}

.game-panel::-webkit-scrollbar-track {
	background: rgba(0, 0, 0, 0.1);
	border-radius: 3px;
}

.game-panel::-webkit-scrollbar-thumb {
	background: rgba(64, 158, 255, 0.5);
	border-radius: 3px;
}

.game-panel::-webkit-scrollbar-thumb:hover {
	background: rgba(64, 158, 255, 0.7);
}

/* 折叠按钮样式 */
.collapse-button {
	position: absolute;
	left: -30px;
	top: 50%;
	transform: translateY(-50%);
	width: 30px;
	height: 60px;
	background: rgba(64, 158, 255, 0.9);
	color: white;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 8px 0 0 8px;
	cursor: pointer;
	transition: all 0.3s ease;
	z-index: 1002;
}

.collapse-button:hover {
	background: rgba(64, 158, 255, 1);
	transform: translateY(-50%) scale(1.05);
}

/* 折叠状态样式 */
.panel-collapsed {
	width: 0;
	overflow: hidden;
}

.panel-collapsed .collapse-button {
	left: -30px;
}

/* 响应式设计 */
@media (max-width: 768px) {
	.game-panel {
		width: calc(100vw - 40px);
		right: 20px;
		left: 20px;
	}

	.collapse-button {
		left: -30px;
	}
}
</style>

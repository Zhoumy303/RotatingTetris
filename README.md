# Zhoumetry (俄罗斯方块) - 重构版本

## 项目结构

```
play/tetris/
├── index.html          # 主入口文件（模块化版本）
├── play.html           # 原始单文件版本（保留作为参考）
├── css/
│   └── style.css       # 所有样式
├── js/
│   ├── constants.js    # 游戏常量（方块形状、颜色、踢墙表）
│   ├── levels.js       # 完整的54个关卡数据
│   ├── game-engine.js  # 游戏核心引擎类
│   ├── renderer.js     # 渲染系统类
│   ├── level-data.js   # 每日挑战数据
│   └── level-manager.js # 关卡管理器（工作流创建）
└── lib/
    └── bgm/            # 背景音乐
```

## 主要改进

### 1. 模块化分离
- **GameEngine**: 游戏状态、方块逻辑、碰撞检测
- **Renderer**: 画布渲染、UI更新
- **InputHandler**: 键盘和触摸控制
- **UIController**: UI交互管理

### 2. 状态管理优化
- 使用 `state` 对象集中管理游戏状态
- 减少全局变量
- 事件驱动架构（回调函数）

### 3. 可扩展性
- 易于添加新方块类型（在 `constants.js` 的 `SHAPES` 和 `PALETTE` 中添加）
- 易于添加新游戏模式
- 易于修改关卡数据（在 `levels.js` 中修改）

### 4. 向后兼容
- 保持所有原有功能（54个关卡、每日挑战、设置等）
- 保持 localStorage 存档格式兼容
- 原始 `play.html` 保留作为参考

## 使用方法

1. 打开 `index.html` 开始游戏
2. 所有功能与原版相同：
   - 54个关卡
   - 每日挑战
   - 设置（音量、DAS、键位绑定等）
   - 存档系统

## 文件说明

- **constants.js**: 游戏常量，包括方块形状、颜色、踢墙表、章节信息等
- **levels.js**: 包含所有54个关卡的完整数据
- **game-engine.js**: 游戏核心引擎，处理所有游戏逻辑
- **renderer.js**: 渲染系统，负责绘制游戏画面和UI

## 开发说明

### 添加新方块
在 `constants.js` 中：
1. 在 `SHAPES` 对象中添加新方块的形状定义
2. 在 `PALETTE` 对象中添加新方块的颜色

### 添加新关卡
在 `levels.js` 中添加新的关卡对象，格式：
```javascript
{
  width: 10,
  height: 20,
  board: [...],
  targetMap: [...],
  currentPiece: "T",
  currentRotation: 0,
  currentX: 5,
  currentY: 0,
  hold: null,
  nextQueue: [],
  canHold: true
}
```

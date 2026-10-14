/**
 * Zhoumetry - Constants and Configuration
 * 游戏常量和配置定义
 */

// 游戏配置
const CONFIG = {
  MAX_LEVEL: 54,
  UNLOCK_ALL_LEVELS: 0, // 设置为1可以解锁所有关卡，0为正常模式
  KEY_THRESHOLD: 50, // 按键防抖阈值(ms)
  MAX_CELL_SIZE: 35, // 最大格子尺寸(px)
};

// 方块形状定义
const SHAPES = {
  I: [
    [[0,0],[0,1],[0,2],[0,3]],
    [[0,2],[1,2],[2,2],[3,2]],
    [[2,0],[2,1],[2,2],[2,3]],
    [[0,1],[1,1],[2,1],[3,1]]
  ],
  O: [
    [[0,0],[0,1],[1,0],[1,1]]
  ],
  J: [    
    [[0,0],[1,0],[1,1],[1,2]],       
    [[0,0],[0,1],[1,0],[2,0]],     
    [[0,0],[0,1],[0,2],[1,2]],
    [[0,1],[1,1],[2,1],[2,0]]    
  ],
  L: [ 
    [[0,2],[1,2],[1,1],[1,0]],
    [[0,0],[1,0],[2,0],[2,1]], 
    [[0,0],[0,1],[0,2],[1,0]],
    [[0,0],[0,1],[1,1],[2,1]]
  ],
  Z: [
    [[0,0],[0,1],[1,1],[1,2]], 
    [[0,1],[1,1],[1,0],[2,0]]
  ],
  S: [
    [[0,1],[0,2],[1,0],[1,1]], 
    [[0,0],[1,0],[1,1],[2,1]]
  ],
  T: [
    [[1,0],[1,1],[1,2],[0,1]],
    [[0,1],[1,1],[2,1],[1,2]],
    [[2,1],[1,0],[1,1],[1,2]],
    [[0,1],[1,1],[2,1],[1,0]],
  ]
};

// 方块颜色
const PALETTE = {
  I: '#44EBDF', O: '#DEC843', T: '#A43D9A', S: '#67E634',
  Z: '#ED1C24', J: '#2638B2', L: '#B46332'
};

// 踢墙表（SRS）
const KICK_TESTS = [
  [0, 1], [0, 2], [1, 1], [-1, 1], [1, 2], [-1, 2],
  [0, 0], [0, -1], [0, -2], [1, 0], [-1, 0], [2, 0],
  [-2, 0], [1, -1], [-1, -1], [2, -1], [-2, -1], [2, 1],
  [-2, 1], [1, -2], [-1, -2], [2, -2], [-2, -2]
];

// 180度旋转专用踢墙表（针对L和J方块）
const KICK_TESTS_180 = [
  [0, 0], [0, -1], [0, 1], [1, 0], [-1, 0], [1, -1], [-1, -1],
  [0, -2], [0, 2], [1, 1], [-1, 1], [2, 0], [-2, 0],
  [1, -2], [-1, -2], [2, -1], [-2, -1], [2, 1], [-2, 1]
];

// 默认键位绑定
const DEFAULT_KEY_BINDINGS = {
  left: 'ArrowLeft',
  right: 'ArrowRight',
  rotateCW: 'ArrowUp',
  rotateCCW: 'z',
  rotate180: 'a',
  softDrop: 'ArrowDown',
  hardDrop: ' ',
  hold: 'Shift'
};

// 章节信息
const CHAPTERS = {
  1: {"name": "1.introduction", "levels": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33]},
  2: {"name": "2.journey start", "levels": [34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49]},
  3: {"name": "3.imposible chellenge", "levels": [50, 51, 52, 53, 54]},
};

// 关卡名称
const LEVEL_NAMES = {
  1: "welcome to Zhoumetry",
  2: "try to move",
  3: "spin!",
  4: "lazy spin....",
  5: "wow,crazy J",
  6: "reverse!",
  7: "clear all things",
  8: "O and J On the Journey",
  9: "LOL",
  10: "TO...efl",
  11: "L kill J",
  12: "insert",
  13: "doeble chellenge",
  14: "crazy I",
  15: "how can i get S in",
  16: "almost there",
  17: "Z S love each other",
  18: "S and L cheated",
  19: "LOT ... of blocks!",
  20: "Z found J and L",
  21: "ITS time for end",
  22: "LJTZ...what's this",
  23: "TZSL get pc",
  24: "I kick the wall",
  25: "T is effecient",
  26: "This is amazing",
  27: "why T is called C-spin",
  28: "flying down!",
  29: "they need wall",
  30: "destroy the tower",
  31: "where's my wall",
  32: "can't get down",
  33: "spinning T",
  34: "last Opportunity to rest",
  35: "SoLve that!",
  36: "Too eZ, right",
  37: "Trap!",
  38: "Trip or Test, Ticket To The nexT",
  39: "I think this is hard enough",
  40: "180 jump",
  41: "Super way",
  42: "Zig Zag",
  43: "Jewel power",
  44: "Let the level be harder, so eazy",
  45: "we met some serious problem",
  46: "random garbage",
  47: "The five stars",
  48: "mOnOpOly",
  49: "chaotic rain",
  50: "Oh this is too ez",
  51: "I'm Zhoumy, you can't pass",
  52: "Fallen snow",
  53: "Spider web trap",
  54: "god's hand",
};

// 导出（兼容非模块环境）
if (typeof window !== 'undefined') {
  window.CONFIG = CONFIG;
  window.SHAPES = SHAPES;
  window.PALETTE = PALETTE;
  window.KICK_TESTS = KICK_TESTS;
  window.KICK_TESTS_180 = KICK_TESTS_180;
  window.DEFAULT_KEY_BINDINGS = DEFAULT_KEY_BINDINGS;
  window.CHAPTERS = CHAPTERS;
  window.LEVEL_NAMES = LEVEL_NAMES;
}

/**
 * Zhoumetry - Level Data
 * 关卡数据定义
 * 
 * 注：由于关卡数据量大，这里只包含关卡元数据
 * 实际关卡数据从原始play.html中提取
 */

// 关卡数据将通过单独的JSON文件或内联方式加载
const LEVEL_DATA = {
  // 关卡数据会在main.js中从原始文件加载
};

// 每日挑战数据
const DAILY_CHALLENGES_DATA = {
  'daily_1': {
    'name': 'old 1.spin or try something else',
    'data': {
      "width": 8, "height": 18,
      "board": [[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,"gray"],[0,0,0,0,0,0,0,0],[0,0,0,0,"gray",0,"gray",0],[0,0,0,0,0,0,0,0],[0,0,0,0,"gray",0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],["gray","gray","gray",0,"gray","gray","gray","gray"],["gray",0,0,0,"gray","gray","gray","gray"]],
      "targetMap": [null,null,null,null,null,[null,null,null,null,null,null,null,true],null,null,null,null,null,[null,null,null,null,null,true,null,false],[null,null,null,null,null,null,null,true],[null,null,null,null,null,true,null,true],[null,null,true,null,null,null,true,false],[true,null,false],null,[null,true,null,true]],
      "currentPiece": "L", "currentRotation": 0, "currentX": 2, "currentY": 0,
      "hold": "T", "nextQueue": ["J","I","Z","S","Z","T"],
      "canHold": true, "gameActive": true, "autoRefillNext": true
    }
  },
  'daily_2': {
    'name': 'today.PCO',
    'data': {
      "width": 10, "height": 10,
      "board": [[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],["J","J","J",0,0,0,0,0,"S","S"],["O","O","J",0,0,0,0,"S","S","T"],["O","O","L",0,0,0,"Z","Z","T","T"],["L","L","L",0,0,0,0,"Z","Z","T"]],
      "targetMap": [null,null,null,null,[true,true,true,true,true,true,true,true,true,true],[true,true,true,true,true,true,true,true,true,true],[null,null,null,true,true,true,true,true],[null,null,null,true,true,true,true],[null,null,null,true,true,true],[null,null,null,true,true,true,true]],
      "currentPiece": "O", "currentRotation": 0, "currentX": 4, "currentY": 0,
      "hold": "I", "nextQueue": ["I","T","S","L","Z","J","O"],
      "canHold": true, "gameActive": true, "autoRefillNext": false
    }
  }
};

// 导出
if (typeof window !== 'undefined') {
  window.LEVEL_DATA = LEVEL_DATA;
  window.DAILY_CHALLENGES_DATA = DAILY_CHALLENGES_DATA;
}

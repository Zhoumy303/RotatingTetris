/**
 * Zhoumetry - Game Engine
 * 游戏核心引擎
 */

class GameEngine {
  constructor() {
    // 游戏状态
    this.state = {
      board: [],
      targetMap: [],
      curr: null,
      rot: 0,
      x: 0,
      y: 0,
      hold: null,
      nextQ: [],
      canHold: true,
      gameActive: false,
      isHoldInProgress: false,
      isPieceLocking: false,
      COLS: 4,
      ROWS: 20
    };

    // 统计
    this.stats = {
      playerCombo: 0,
      maxCombo: 0,
      allClearCount: 0
    };

    // 回调函数
    this.onUpdate = null;
    this.onLevelComplete = null;
    this.onGameOver = null;
    this.onCombo = null;
    this.onAllClear = null;
  }

  /**
   * 初始化游戏板
   */
  initBoard(cols, rows) {
    this.state.COLS = cols;
    this.state.ROWS = rows;
    this.state.board = Array(rows).fill(null).map(() => Array(cols).fill(0));
    this.state.targetMap = Array(rows).fill(null);
  }

  /**
   * 加载关卡数据
   */
  loadLevelData(levelData) {
    this.state.COLS = levelData.width;
    this.state.ROWS = levelData.height;
    this.state.board = JSON.parse(JSON.stringify(levelData.board));
    this.state.targetMap = JSON.parse(JSON.stringify(levelData.targetMap || []));
    this.state.curr = levelData.currentPiece !== undefined ? levelData.currentPiece : null;
    this.state.rot = levelData.currentRotation !== undefined ? levelData.currentRotation : 0;
    this.state.x = levelData.currentX !== undefined ? levelData.currentX : Math.floor(this.state.COLS / 2);
    this.state.y = levelData.currentY !== undefined ? levelData.currentY : 0;
    this.state.hold = levelData.hold !== undefined ? levelData.hold : null;
    this.state.nextQ = [...(levelData.nextQueue || [])];
    this.state.canHold = levelData.canHold !== undefined ? levelData.canHold : true;
    this.state.gameActive = true;
    this.state.isHoldInProgress = false;
    this.state.isPieceLocking = false;
    
    // 重置统计
    this.stats.playerCombo = 0;
  }

  /**
   * 获取当前方块的单元格坐标
   */
  getCurrentCells() {
    if (!this.state.curr) return [];
    return SHAPES[this.state.curr][this.state.rot].map(([dy, dx]) => 
      [this.state.y + dy, this.state.x + dx]
    );
  }

  /**
   * 获取指定方块的单元格坐标
   */
  getCurrentCellsForPiece(piece, px, py, prot) {
    return SHAPES[piece][prot].map(([dy, dx]) => [py + dy, px + dx]);
  }

  /**
   * 获取方块宽度
   */
  getShapeWidth() {
    const cells = SHAPES[this.state.curr][this.state.rot];
    const xCoords = cells.map(([_, dx]) => dx);
    return Math.max(...xCoords) - Math.min(...xCoords) + 1;
  }

  /**
   * 检查位置是否有效
   */
  isValidPosition(newX = this.state.x, newY = this.state.y, newRot = this.state.rot) {
    // 安全检查：确保当前方块和棋盘已初始化
    if (!this.state.curr || !this.state.board || this.state.board.length === 0) {
      return false;
    }
    const cells = SHAPES[this.state.curr][newRot].map(([dy, dx]) => [newY + dy, newX + dx]);
    return cells.every(([cy, cx]) => 
      cy >= 0 && cy < this.state.ROWS && cx >= 0 && cx < this.state.COLS && 
      this.state.board[cy] && this.state.board[cy][cx] === 0
    );
  }

  /**
   * 计算幽灵方块Y坐标
   */
  calculateGhostY() {
    // 安全检查：确保当前方块已初始化
    if (!this.state.curr || !this.state.board || this.state.board.length === 0) {
      return this.state.y || 0;
    }
    let ghostY = this.state.y;
    while (this.isValidPosition(this.state.x, ghostY + 1, this.state.rot)) {
      ghostY++;
    }
    return ghostY;
  }

  /**
   * 尝试移动
   */
  tryMove(dx) {
    const newX = this.state.x + dx;
    if (this.isValidPosition(newX, this.state.y, this.state.rot)) {
      this.state.x = newX;
      this.triggerUpdate();
      return true;
    }
    return false;
  }

  /**
   * 移动到边缘
   */
  moveToEdge(direction) {
    while (this.isValidPosition(this.state.x + direction, this.state.y, this.state.rot)) {
      this.state.x += direction;
    }
    this.triggerUpdate();
  }

  /**
   * 降到底部（不锁定）
   */
  dropToBottom() {
    while (this.isValidPosition(this.state.x, this.state.y + 1, this.state.rot)) {
      this.state.y++;
    }
    this.triggerUpdate();
  }

  /**
   * 顺时针旋转
   */
  tryRotateCW() {
    return this.rotateWithKick(1);
  }

  /**
   * 逆时针旋转
   */
  tryRotateCCW() {
    return this.rotateWithKick(-1);
  }

  /**
   * 带踢墙的旋转
   */
  rotateWithKick(dir) {
    const len = SHAPES[this.state.curr].length;
    const newRot = (this.state.rot + dir + len) % len;

    if (this.isValidPosition(this.state.x, this.state.y, newRot)) {
      this.state.rot = newRot;
      this.triggerUpdate();
      return true;
    }
    
    for (const [dx, dy] of KICK_TESTS) {
      if (this.isValidPosition(this.state.x + dx, this.state.y + dy, newRot)) {
        this.state.x += dx;
        this.state.y += dy;
        this.state.rot = newRot;
        this.triggerUpdate();
        return true;
      }
    }
    
    return false;
  }

  /**
   * 180度旋转
   */
  tryRotate180() {
    const len = SHAPES[this.state.curr].length;
    const newRot = (this.state.rot + 2) % len;
    
    const kickTests = (this.state.curr === 'L' || this.state.curr === 'J') ? KICK_TESTS_180 : KICK_TESTS;
    
    if (this.isValidPosition(this.state.x, this.state.y, newRot)) {
      this.state.rot = newRot;
      this.triggerUpdate();
      return true;
    }
    
    for (const [dx, dy] of kickTests) {
      if (this.isValidPosition(this.state.x + dx, this.state.y + dy, newRot)) {
        this.state.x += dx;
        this.state.y += dy;
        this.state.rot = newRot;
        this.triggerUpdate();
        return true;
      }
    }
    
    return false;
  }

  /**
   * 软降
   */
  softDrop() {
    if (this.isValidPosition(this.state.x, this.state.y + 1, this.state.rot)) {
      this.state.y++;
      this.triggerUpdate();
      return true;
    }
    return false;
  }

  /**
   * 硬降
   */
  hardDrop() {
    const ghostY = this.calculateGhostY();
    this.state.y = ghostY;
    this.state.isPieceLocking = true;
    this.triggerUpdate();
    this.lockPiece();
  }

  /**
   * Hold操作
   */
  doHold() {
    if (this.state.isPieceLocking) return false;
    
    // 特殊情况：没有当前方块但有hold时
    if (!this.state.curr && this.state.nextQ.length === 0 && this.state.hold !== null && this.state.gameActive) {
      this.state.curr = this.state.hold;
      this.state.hold = null;
      
      if (this.state.COLS === 3 && this.state.curr === 'I') {
        this.state.rot = 1;
      } else {
        this.state.rot = 0;
      }
      
      this.state.x = Math.floor((this.state.COLS - this.getShapeWidth()) / 2);
      this.state.y = 0;
      this.state.canHold = true;
      
      if (!this.isValidPosition()) {
        this.state.gameActive = false;
        if (this.onGameOver) this.onGameOver();
        return false;
      }
      
      this.triggerUpdate();
      return true;
    }
    
    if (!this.state.curr || !this.state.gameActive || !this.state.canHold || this.state.isHoldInProgress) {
      return false;
    }
    
    if (this.state.nextQ.length === 0 && this.state.hold === null) {
      return false;
    }
    
    this.state.isHoldInProgress = true;
    this.state.canHold = false;
    
    const currentPiece = this.state.curr;
    
    if (this.state.hold === null) {
      this.state.hold = currentPiece;
      this.nextPiece();
    } else {
      const temp = this.state.hold;
      this.state.hold = currentPiece;
      this.state.curr = temp;
      
      if (this.state.COLS === 3 && this.state.curr === 'I') {
        this.state.rot = 1;
      } else {
        this.state.rot = 0;
      }
      
      this.state.x = Math.floor((this.state.COLS - this.getShapeWidth()) / 2);
      this.state.y = 0;
      
      if (!this.isValidPosition()) {
        this.state.hold = currentPiece;
        this.state.curr = temp;
        this.state.canHold = true;
        this.state.gameActive = false;
        this.state.isHoldInProgress = false;
        if (this.onGameOver) this.onGameOver();
        return false;
      }
    }
    
    this.triggerUpdate();
    this.state.isHoldInProgress = false;
    return true;
  }

  /**
   * 锁定方块
   */
  lockPiece() {
    const lockedPiece = this.state.curr;
    this.state.curr = null;
    this.state.canHold = true;
    
    const cells = this.getCurrentCellsForPiece(lockedPiece, this.state.x, this.state.y, this.state.rot);
    for (const [cy, cx] of cells) {
      if (cy >= 0 && cy < this.state.ROWS && cx >= 0 && cx < this.state.COLS) {
        this.state.board[cy][cx] = lockedPiece;
      }
    }
    
    const targetCompleted = this.checkTargetCompletion();
    
    // 消行
    let lines = 0;
    for (let row = this.state.ROWS - 1; row >= 0; row--) {
      let filled = true;
      for (let col = 0; col < this.state.COLS; col++) {
        if (this.state.board[row][col] === 0) {
          filled = false;
          break;
        }
      }
      if (filled) {
        lines++;
        
        this.state.targetMap.splice(row, 1);
        this.state.targetMap.unshift(null);
        
        this.state.board.splice(row, 1);
        this.state.board.unshift(Array(this.state.COLS).fill(0));
        row++;
      }
    }
    
    // Combo处理
    if (lines > 0) {
      this.stats.playerCombo++;
      if (this.stats.playerCombo > this.stats.maxCombo) {
        this.stats.maxCombo = this.stats.playerCombo;
      }
      if (this.stats.playerCombo >= 2 && this.onCombo) {
        this.onCombo(this.stats.playerCombo);
      }
    } else {
      this.stats.playerCombo = 0;
    }
    
    // All Clear检测
    const isAllClear = this.state.board.every(row => row.every(cell => cell === 0));
    if (isAllClear) {
      this.stats.allClearCount++;
      if (this.onAllClear) this.onAllClear();
    }
    
    this.triggerUpdate();
    
    if (targetCompleted) {
      setTimeout(() => {
        this.state.gameActive = false;
        if (this.onLevelComplete) this.onLevelComplete();
      }, 300);
      return;
    }
    
    setTimeout(() => {
      this.nextPiece();
    }, 100);
  }

  /**
   * 下一个方块
   */
  nextPiece() {
    this.state.isPieceLocking = false;
    
    if (this.state.nextQ.length === 0) {
      if (this.state.hold !== null) {
        this.state.curr = this.state.hold;
        this.state.hold = null;
      } else {
        this.state.gameActive = false;
        this.state.curr = null;
        this.triggerUpdate();
        return;
      }
    } else {
      this.state.curr = this.state.nextQ.shift();
    }
    
    if (this.state.COLS === 3 && this.state.curr === 'I') {
      this.state.rot = 1;
    } else {
      this.state.rot = 0;
    }
    
    this.state.x = Math.floor((this.state.COLS - this.getShapeWidth()) / 2);
    this.state.y = 0;
    this.state.canHold = true;
    
    if (!this.isValidPosition()) {
      this.state.gameActive = false;
      if (this.onGameOver) this.onGameOver();
      return;
    }
    
    this.triggerUpdate();
  }

  /**
   * 检查目标完成
   */
  checkTargetCompletion() {
    const { totalTargets, coveredTargets } = this.updateTargetStatus();
    return totalTargets > 0 && coveredTargets === totalTargets;
  }

  /**
   * 更新目标状态
   */
  updateTargetStatus() {
    let totalTargets = 0;
    let coveredTargets = 0;
    
    for (let y = 0; y < this.state.ROWS; y++) {
      for (let x = 0; x < this.state.COLS; x++) {
        if (this.state.targetMap[y] && this.state.targetMap[y][x]) {
          totalTargets++;
          if (this.state.board[y][x] !== 0 && this.state.board[y][x] !== 'gray') {
            coveredTargets++;
          }
        }
      }
    }
    
    return { totalTargets, coveredTargets };
  }

  /**
   * 触发更新回调
   */
  triggerUpdate() {
    if (this.onUpdate) {
      this.onUpdate(this.state, this.stats);
    }
  }

  /**
   * 获取当前状态
   */
  getState() {
    return this.state;
  }

  /**
   * 获取统计信息
   */
  getStats() {
    return this.stats;
  }
}

// 导出
if (typeof window !== 'undefined') {
  window.GameEngine = GameEngine;
}

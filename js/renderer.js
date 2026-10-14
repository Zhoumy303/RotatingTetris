/**
 * Zhoumetry - Renderer
 * 游戏渲染系统
 */

class Renderer {
  constructor() {
    this.boardEl = document.getElementById('board');
    this.cellEls = [];
    this.cellSize = 35;
  }

  /**
   * 初始化游戏板
   */
  initBoard(cols, rows) {
    this.boardEl.innerHTML = '';
    this.cellEls = [];
    
    // 计算格子大小
    const availableWidth = window.innerWidth - 480;
    const availableHeight = window.innerHeight - 80;
    const maxCellWidth = (availableWidth - 20) / cols;
    const maxCellHeight = (availableHeight - 20) / rows;
    this.cellSize = Math.min(maxCellWidth, maxCellHeight, CONFIG.MAX_CELL_SIZE);
    
    const boardWidth = cols * this.cellSize + (cols - 1) * 2 + 16;
    const boardHeight = rows * this.cellSize + (rows - 1) * 2 + 16;
    
    this.boardEl.style.width = boardWidth + 'px';
    this.boardEl.style.height = boardHeight + 'px';
    this.boardEl.style.gridTemplateColumns = `repeat(${cols}, ${this.cellSize}px)`;
    this.boardEl.style.gridTemplateRows = `repeat(${rows}, ${this.cellSize}px)`;
    
    // 创建格子
    for (let y = 0; y < rows; y++) {
      this.cellEls[y] = [];
      for (let x = 0; x < cols; x++) {
        const c = document.createElement('div');
        c.className = 'cell';
        this.boardEl.appendChild(c);
        this.cellEls[y][x] = c;
      }
    }
  }

  /**
   * 绘制游戏板
   */
  drawBoard(state) {
    const { board, targetMap, curr, rot, x, y, gameActive, ROWS, COLS } = state;
    
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const isTarget = targetMap[row] && targetMap[row][col];
        
        // 设置背景色
        if (board[row][col] === 'gray') {
          this.cellEls[row][col].style.background = '#666';
        } else if (board[row][col] && board[row][col] !== 'gray') {
          this.cellEls[row][col].style.background = PALETTE[board[row][col]];
        } else {
          this.cellEls[row][col].style.background = '#222';
        }
        
        // 设置边框
        if (isTarget) {
          if (board[row][col] && board[row][col] !== 'gray') {
            this.cellEls[row][col].style.border = 'none';
          } else {
            this.cellEls[row][col].style.border = '2px dashed #ff0';
            this.cellEls[row][col].style.boxSizing = 'border-box';
          }
        } else {
          this.cellEls[row][col].style.border = 'none';
        }
      }
    }
    
    // 绘制当前方块
    if (curr && gameActive) {
      const cells = SHAPES[curr][rot].map(([dy, dx]) => [y + dy, x + dx]);
      cells.forEach(([cy, cx]) => {
        if (cy >= 0 && cy < ROWS && cx >= 0 && cx < COLS) {
          this.cellEls[cy][cx].style.background = PALETTE[curr];
          
          const isTarget = targetMap[cy] && targetMap[cy][cx];
          if (isTarget) {
            this.cellEls[cy][cx].style.border = '2px dashed #0f0';
            this.cellEls[cy][cx].style.boxSizing = 'border-box';
          }
        }
      });
    }
  }

  /**
   * 绘制幽灵方块
   */
  drawGhost(state, ghostY) {
    // 清除旧的幽灵方块
    document.querySelectorAll('.ghost').forEach(g => g.remove());
    
    const { curr, rot, x, y, gameActive, board, ROWS, COLS } = state;
    
    if (!curr || !gameActive || ghostY === y) return;
    
    const cells = SHAPES[curr][rot].map(([dy, dx]) => [ghostY + dy, x + dx]);
    
    cells.forEach(([cy, cx]) => {
      if (cy >= 0 && cy < ROWS && cx >= 0 && cx < COLS && (!board[cy] || board[cy][cx] === 0)) {
        const g = document.createElement('div');
        g.className = 'ghost';
        g.style.position = 'absolute';
        g.style.left = (8 + cx * (this.cellSize + 2)) + 'px';
        g.style.top = (8 + cy * (this.cellSize + 2)) + 'px';
        g.style.width = this.cellSize + 'px';
        g.style.height = this.cellSize + 'px';
        
        const isTarget = state.targetMap[cy] && state.targetMap[cy][cx];
        g.style.border = isTarget ? '2px dashed #0f0' : '2px dashed #fff';
        
        this.boardEl.appendChild(g);
      }
    });
  }

  /**
   * 更新侧边栏
   */
  drawSide(state) {
    const holdDiv = document.getElementById('hold');
    holdDiv.innerHTML = '';
    if (state.hold) {
      const miniBoard = this.createMiniBoard(state.hold, 0);
      holdDiv.appendChild(miniBoard);
    } else {
      holdDiv.textContent = '-';
    }
    
    const nextDiv = document.getElementById('next');
    nextDiv.innerHTML = '';
    state.nextQ.slice(0, 5).forEach(piece => {
      const miniBoard = this.createMiniBoard(piece, 0);
      nextDiv.appendChild(miniBoard);
    });
  }

  /**
   * 创建迷你预览板
   */
  createMiniBoard(pieceType, rotation) {
    const miniBoard = document.createElement('div');
    miniBoard.className = 'mini-board';
    miniBoard.style.position = 'relative';
    miniBoard.style.width = '50px';
    miniBoard.style.height = '50px';
    miniBoard.style.background = 'transparent';
    
    const cells = SHAPES[pieceType][rotation];
    cells.forEach(([dy, dx]) => {
      const cell = document.createElement('div');
      cell.style.position = 'absolute';
      cell.style.width = '10px';
      cell.style.height = '10px';
      cell.style.left = (dx * 11 + 5) + 'px';
      cell.style.top = (dy * 11 + 5) + 'px';
      cell.style.background = PALETTE[pieceType];
      cell.style.border = '1px solid rgba(0,0,0,0.3)';
      cell.style.borderRadius = '1px';
      miniBoard.appendChild(cell);
    });
    
    return miniBoard;
  }

  /**
   * 更新统计信息
   */
  updateStats(stats) {
    document.getElementById('comboCount').textContent = stats.playerCombo;
    document.getElementById('maxCombo').textContent = stats.maxCombo;
    document.getElementById('allClearCount').textContent = stats.allClearCount;
  }

  /**
   * 更新目标状态
   */
  updateTargetStatus(state) {
    let totalTargets = 0;
    let coveredTargets = 0;
    
    for (let y = 0; y < state.ROWS; y++) {
      for (let x = 0; x < state.COLS; x++) {
        if (state.targetMap[y] && state.targetMap[y][x]) {
          totalTargets++;
          if (state.board[y][x] !== 0 && state.board[y][x] !== 'gray') {
            coveredTargets++;
          }
        }
      }
    }
    
    const statusEl = document.getElementById('target-status');
    if (statusEl) {
      statusEl.textContent = `Targets: ${coveredTargets}/${totalTargets}`;
    }
    
    return { totalTargets, coveredTargets };
  }

  /**
   * 显示Combo特效
   */
  showComboEffect(combo) {
    const existing = document.querySelector('.combo-display');
    if (existing) existing.remove();
    
    const comboEl = document.createElement('div');
    comboEl.className = 'combo-display';
    comboEl.textContent = `${combo} COMBO!`;
    document.body.appendChild(comboEl);
    
    setTimeout(() => comboEl.remove(), 1000);
  }

  /**
   * 显示All Clear特效
   */
  showAllClearEffect() {
    const existing = document.querySelector('.all-clear-effect');
    if (existing) existing.remove();
    
    const acEl = document.createElement('div');
    acEl.className = 'all-clear-effect';
    acEl.textContent = 'ALL CLEAR!';
    document.body.appendChild(acEl);
    
    setTimeout(() => acEl.remove(), 2000);
  }
}

// 导出
if (typeof window !== 'undefined') {
  window.Renderer = Renderer;
}

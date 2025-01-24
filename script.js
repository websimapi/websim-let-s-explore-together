class BubbleGame {
  constructor() {
    this.gameArea = document.getElementById('game-area');
    this.scoreElement = document.getElementById('score');
    this.timerElement = document.getElementById('timer');
    this.menuElement = document.getElementById('menu');
    this.gameOverElement = document.getElementById('game-over');
    this.finalScoreElement = document.getElementById('final-score');
    this.highScoreElement = document.getElementById('high-score');
    this.cursor = document.querySelector('.cursor');
    this.container = document.querySelector('.container');
    
    this.score = 0;
    this.timeLeft = 60;
    this.gameActive = false;
    this.bubbles = new Set();
    this.highScore = parseInt(localStorage.getItem('bubbleGameHighScore')) || 0;
    this.highScoreElement.textContent = this.highScore;
    
    this.cursorPos = { x: 0, y: 0 };
    this.targetPos = { x: 0, y: 0 };
    this.setupEventListeners();
    this.animateCursor();
  }

  setupEventListeners() {
    document.getElementById('start-button').addEventListener('click', () => this.startGame());
    document.getElementById('restart-button').addEventListener('click', () => this.startGame());
    
    // Handle both click and touch events
    this.container.addEventListener('mousemove', (e) => {
      const rect = this.container.getBoundingClientRect();
      this.targetPos = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    });
    
    this.container.addEventListener('mouseleave', () => {
      this.cursor.style.opacity = '0';
    });
    
    this.container.addEventListener('mouseenter', () => {
      this.cursor.style.opacity = '1';
    });
    
    this.container.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const rect = this.container.getBoundingClientRect();
      const touch = e.touches[0];
      this.targetPos = {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      };
    }, { passive: false });
    
    this.gameArea.addEventListener('click', (e) => this.handleInteraction(e));
    this.gameArea.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.handleInteraction(e.touches[0]);
    }, { passive: false });
  }

  startGame() {
    this.score = 0;
    this.timeLeft = 60;
    this.gameActive = true;
    this.scoreElement.textContent = '0';
    this.timerElement.textContent = '60';
    this.menuElement.style.display = 'none';
    this.gameOverElement.style.display = 'none';
    this.clearBubbles();
    this.gameLoop();
    this.timerLoop();
  }

  createBubble() {
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    const size = Math.random() * 30 + 30;
    const hue = Math.random() * 360;
    
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.backgroundColor = `hsla(${hue}, 70%, 50%, 0.8)`;
    bubble.style.left = `${Math.random() * (this.gameArea.clientWidth - size)}px`;
    bubble.style.top = `${this.gameArea.clientHeight}px`;
    
    this.gameArea.appendChild(bubble);
    this.bubbles.add(bubble);
    
    // Animate bubble rising
    const duration = Math.random() * 2 + 3;
    bubble.style.transition = `top ${duration}s linear`;
    
    // Start bubble moving up
    requestAnimationFrame(() => {
      bubble.style.top = `-${size}px`;
    });
    
    // Remove bubble after animation
    setTimeout(() => {
      if (this.bubbles.has(bubble)) {
        bubble.remove();
        this.bubbles.delete(bubble);
      }
    }, duration * 1000);
  }

  handleInteraction(event) {
    if (!this.gameActive) return;
    
    const rect = this.gameArea.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    this.bubbles.forEach(bubble => {
      const bubbleRect = bubble.getBoundingClientRect();
      const bubbleX = bubbleRect.left - rect.left + bubbleRect.width / 2;
      const bubbleY = bubbleRect.top - rect.top + bubbleRect.height / 2;
      const distance = Math.hypot(x - bubbleX, y - bubbleY);
      
      if (distance < bubbleRect.width / 2) {
        this.popBubble(bubble);
      }
    });
  }

  popBubble(bubble) {
    bubble.classList.add('pop-animation');
    this.bubbles.delete(bubble);
    this.score += 10;
    this.scoreElement.textContent = this.score;
    
    setTimeout(() => bubble.remove(), 300);
  }

  clearBubbles() {
    this.bubbles.forEach(bubble => bubble.remove());
    this.bubbles.clear();
  }

  gameLoop() {
    if (!this.gameActive) return;
    
    if (Math.random() < 0.1) {
      this.createBubble();
    }
    
    requestAnimationFrame(() => this.gameLoop());
  }

  timerLoop() {
    if (!this.gameActive) return;
    
    if (this.timeLeft > 0) {
      setTimeout(() => {
        this.timeLeft--;
        this.timerElement.textContent = this.timeLeft;
        this.timerLoop();
      }, 1000);
    } else {
      this.endGame();
    }
  }

  endGame() {
    this.gameActive = false;
    this.clearBubbles();
    
    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem('bubbleGameHighScore', this.score);
      this.highScoreElement.textContent = this.highScore;
    }
    
    this.finalScoreElement.textContent = this.score;
    this.gameOverElement.style.display = 'block';
  }

  animateCursor() {
    // Smoothly interpolate between current and target position
    const ease = 0.1; // Lower number = slower movement
    
    const dx = this.targetPos.x - this.cursorPos.x;
    const dy = this.targetPos.y - this.cursorPos.y;
    
    this.cursorPos.x += dx * ease;
    this.cursorPos.y += dy * ease;
    
    this.cursor.style.left = this.cursorPos.x + 'px';
    this.cursor.style.top = this.cursorPos.y + 'px';
    
    requestAnimationFrame(() => this.animateCursor());
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new BubbleGame();
});
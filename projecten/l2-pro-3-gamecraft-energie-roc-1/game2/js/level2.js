
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const maze = {
  width: 600,
  height: 600,
  walls: [
    // Outer walls
    { x: 0, y: 0, width: 600, height: 10 },
    { x: 0, y: 0, width: 10, height: 600 },
    { x: 600, y: 0, width: 10, height: 600 },
    { x: 0, y: 600, width: 600, height: 10 },

    // Inner walls around
    { x: 15, y: 560, width: 330, height: 5 },
    { x: 390, y: 560, width: 205, height: 5 },
    { x: 15, y: 45, width: 300, height: 5 },
    { x: 300, y: 45, width: 295, height: 5 },
    { x: 15, y: 50, width: 5, height: 510 },
    { x: 590, y: 50, width: 5, height: 510 },

    //inner walls in the middle
        
    { x: 50, y: 140, width: 5, height: 115 },
    { x: 50, y: 305, width: 5, height: 217},
    { x: 15, y: 210, width: 40, height: 5 },
    { x: 50, y: 520, width: 500, height: 5 },
    { x: 550, y: 90, width: 5, height: 120 },
    { x: 550, y: 280, width: 5, height: 245 },
    { x: 50, y: 90, width: 500, height: 5 },
    { x: 55, y: 250, width: 40, height: 5 },
    { x: 95, y: 250, width: 5, height: 230 },
    { x: 95, y: 480, width: 415, height: 5 },
    { x: 510, y: 400, width: 5, height: 120 },
    { x: 95, y: 130, width: 5, height: 80 },
    { x: 95, y: 130, width: 140, height: 5 },
    { x: 290, y: 130, width: 220, height: 5 },
    { x: 510, y: 130, width: 5, height: 20 },
    { x: 510, y: 190, width: 5, height: 160 },
    { x: 510, y: 190, width: 45, height: 5 },
    { x: 140, y: 440, width: 315, height: 5 },
    { x: 140, y: 420, width: 5, height: 25 },
    { x: 140, y: 170, width: 5, height: 200 },
    { x: 140, y: 170, width: 315, height: 5 },
    { x: 450, y: 170, width: 5, height: 100 },
    { x: 450, y: 330, width: 5, height: 110 },
    { x: 200, y: 440, width: 5, height: 40 },  
    { x: 200, y: 90, width: 5, height: 40 },  
    { x: 380, y: 130, width: 5, height: 40 },  
    { x: 410, y: 210, width: 5, height: 20 },  
    { x: 410, y: 280, width: 5, height: 125 },  
    { x: 280, y: 400, width: 60, height: 5 },  
    { x: 390, y: 400, width: 20, height: 5 },  
    { x: 200, y: 400, width: 40, height: 5 },  
    { x: 200, y: 210, width: 5, height: 100 },  
    { x: 200, y: 360, width: 5, height: 40 },  
    { x: 240, y: 400, width: 5, height: 40 },  
    { x: 240, y: 250, width: 5, height: 100 },  
    { x: 280, y: 350, width: 5, height: 55 },  
    { x: 240, y: 350, width: 40, height: 5 },  
    { x: 330, y: 350, width: 40, height: 5 },  
    { x: 200, y: 310, width: 40, height: 5 },  
    { x: 200, y: 210, width: 40, height: 5 },  
    { x: 280, y: 210, width: 130, height: 5 },  
    { x: 240, y: 250, width: 130, height: 5 },  
    { x: 370, y: 250, width: 5, height: 105 },  
    { x: 140, y: 355, width: 65, height: 5 },  
    { x: 370, y: 280, width: 40, height: 5 },  
    { x: 410, y: 330, width: 100, height: 5 },  
    { x: 300, y: 170, width: 5, height: 40 },  


    
    
    
   

  ]
};

const player = {
  x: 360,
  y: 580,
  size: 20,
  speed: 2

};

const playerImage = new Image();
playerImage.src = '/images/char.png'; // Replace with your player image file

const ghostImage = new Image();
ghostImage.src = '/images/ghost1.png';

const ghosts = [
  { x: 300, y: 230, size: 20, speed: 1, direction: 0 },
  { x: 200, y: 150, size: 20, speed: 1, direction: 0 },
  { x: 330, y: 410, size: 20, speed: 1, direction: 0 }
];



let keys = {};
let lives = 3;
let gameOver = false;
let pauseGame = false;

document.addEventListener('keydown', (e) => {
  if (!pauseGame) keys[e.key] = true;
  activateButton(e.key);
});

document.addEventListener('keyup', (e) => {
  keys[e.key] = false;
  deactivateButton(e.key);
});

function activateButton(key) {
  const button = document.getElementById(key.toLowerCase());
  if (button) {
    button.classList.add('active');
  }
}

function deactivateButton(key) {
  const button = document.getElementById(key.toLowerCase());
  if (button) {
    button.classList.remove('active');
  }
}

function drawPlayer() {
  ctx.drawImage(playerImage, player.x, player.y, player.size, player.size);
}

function drawGhosts() {
  ghosts.forEach(ghost => {
    ctx.drawImage(ghostImage, ghost.x, ghost.y, ghost.size, ghost.size);
  });
}

function updatePlayer() {
  if (gameOver || pauseGame) return;
  const futureX = player.x + (keys['d'] ? player.speed : keys['a'] ? -player.speed : 0);
  const futureY = player.y + (keys['s'] ? player.speed : keys['w'] ? -player.speed : 0);

  if (!checkCollision(futureX, futureY, player.size, player.size)) {
    player.x = futureX;
    player.y = futureY;
  }
}

function updateGhosts() {
ghosts.forEach(ghost => {

const dx = player.x - ghost.x;
const dy = player.y - ghost.y;
const distance = Math.sqrt(dx * dx + dy * dy); 


if (distance < 100) { 
  const directionX = dx / distance;
  const directionY = dy / distance;

  
  const futureX = ghost.x + directionX * ghost.speed;
  const futureY = ghost.y + directionY * ghost.speed;

  
  if (!checkCollision(futureX, futureY, ghost.size, ghost.size)) {
    
    ghost.x = futureX;
    ghost.y = futureY;
  } else {
    let adjustedX = ghost.x;
    let adjustedY = ghost.y;

    // Try moving in small steps to the right or left if there's a collision
    if (!checkCollision(ghost.x + directionX * ghost.speed, ghost.y, ghost.size, ghost.size)) {
      adjustedX = ghost.x + directionX * ghost.speed;
    } else if (!checkCollision(ghost.x, ghost.y + directionY * ghost.speed, ghost.size, ghost.size)) {
      adjustedY = ghost.y + directionY * ghost.speed;
    }

    ghost.x = adjustedX;
    ghost.y = adjustedY;
  }
} else {
  // If not close enough, ghosts will move randomly
  if (Math.random() < 0.02) {
    ghost.direction = Math.floor(Math.random() * 4); // Change direction occasionally
  }

  // Calculate future random movement
  const futureX = ghost.x + (ghost.direction === 3 ? ghost.speed : ghost.direction === 2 ? -ghost.speed : 0);
  const futureY = ghost.y + (ghost.direction === 1 ? ghost.speed : ghost.direction === 0 ? -ghost.speed : 0);

  // Check for collision with walls before moving
  if (!checkCollision(futureX, futureY, ghost.size, ghost.size)) {
    // Move the ghost randomly
    ghost.x = futureX;
    ghost.y = futureY;
  }
}

// Check collision with player
if (isColliding(player, ghost)) {
  handleCollision();
}
});
}




function isColliding(obj1, obj2) {
  return obj1.x < obj2.x + obj2.size &&
    obj1.x + obj1.size > obj2.x &&
    obj1.y < obj2.y + obj2.size &&
    obj1.y + obj1.size > obj2.y;
}

function handleCollision() {
  if (gameOver || pauseGame) return;

  lives--;
  document.getElementById('lives').textContent = `Lives: ${lives}`;

  if (lives > 0) {
    showModal('modal');
    pauseGame = true;
  } else {
    showModal('gameOverModal');
    gameOver = true;
  }
}
const winningArea = {
      x: 290, // Top-left corner x-coordinate
      y: 280, // Top-left corner y-coordinate
      width: 40, // Width of the exit
      height: 40 // Height of the exit
      
    };
    function checkWin() {
      if (
        player.x < winningArea.x + winningArea.width &&
        player.x + player.size > winningArea.x &&
        player.y < winningArea.y + winningArea.height &&
        player.y + player.size > winningArea.y
      ) {
        handleWin();
      }
    }
    function handleWin() {
      pauseGame = true; // Pause the game
      showModal('winModal'); // Show a win modal
    }

function resetPlayer() {
  player.x = 300;
  player.y = 580;
  keys = {}; // Reset keys to prevent "stuck" inputs
}

function restartGame() {
  // Reset game variables
  lives = 3;
  timeLeft = 120; // Reset the timer
  gameOver = false;
  pauseGame = false;

  // Reset player position
  player.x = 360;
  player.y = 580;

  // Reset ghost positions
  ghosts.forEach((ghost, index) => {
    if (index === 0) {
      ghost.x = 300;
      ghost.y = 230;
    } else if (index === 1) {
      ghost.x = 200;
      ghost.y = 150;
    } else if (index === 2) {
      ghost.x = 330;
      ghost.y = 410;
    } 
  });

  // Reset UI
  document.getElementById('lives').textContent = `Lives: ${lives}`;
  document.getElementById('timer').textContent = 'Time: 1:30';

  // Hide modals
  hideModal('gameOverModal');
  hideModal('modal');
  hideModal('winModal');

  // Clear keys to avoid "stuck" movement
  keys = {};

  // Start game again
  updateTimer();
  gameLoop();
}

function resumeGame() {
  hideModal('modal');
  pauseGame = false;
  resetPlayer();
  updateTimer();
  gameLoop();
}

function checkCollision(x, y, width, height) {
  return maze.walls.some(wall =>
    x < wall.x + wall.width &&
    x + width > wall.x &&
    y < wall.y + wall.height &&
    y + height > wall.y
  );
}

function drawMaze() {
ctx.fillStyle = 'black';
maze.walls.forEach(wall => {
ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
});

// Highlight the winning area
ctx.fillStyle = 'green';
ctx.fillRect(winningArea.x, winningArea.y, winningArea.width, winningArea.height);
}




let timeLeft = 120  ; // 3 minutes in seconds

function updateTimer() {
  if (gameOver || pauseGame) return;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  document.getElementById('timer').textContent = `Time: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  if (timeLeft > 0) {
    timeLeft--;
    setTimeout(updateTimer, 1000);
  } else {
    showModal('gameOverModal');
    gameOver = true;
  }
}

function showModal(modalId) {
  document.getElementById(modalId).classList.add('show');
}

function hideModal(modalId) {
  document.getElementById(modalId).classList.remove('show');
}

function gameLoop() {
  if (gameOver || pauseGame) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawMaze();
  updatePlayer();
  updateGhosts();
  drawPlayer();
  drawGhosts();

  checkWin(); // Check if the player has won

  requestAnimationFrame(gameLoop);
}

ghostImage.onload = () => {
  updateTimer();
  gameLoop();

};


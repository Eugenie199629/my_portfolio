
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
        { x: 15, y: 560, width: 280, height: 5 },
        { x: 330, y: 560, width: 265, height: 5 },
        { x: 15, y: 45, width: 300, height: 5 },
        { x: 300, y: 45, width: 295, height: 5 },
        { x: 15, y: 50, width: 5, height: 510 },
        { x: 590, y: 50, width: 5, height: 510 },

        //inner walls in the middle
        { x: 15, y: 560, width: 280, height: 5 },
        { x: 330, y: 560, width: 265, height: 5 },
        { x: 15, y: 45, width: 300, height: 5 },
        { x: 300, y: 45, width: 295, height: 5 },
        { x: 50, y: 140, width: 5, height: 380 },
        { x: 50, y: 80, width: 5, height: 20 }, 
        { x: 50, y: 80, width: 490, height: 5 },
        { x: 540, y: 140, width: 5, height: 380 },
        { x: 540, y: 80, width: 5, height: 20 },
        { x: 130, y: 520, width: 415, height: 5 },
        { x: 50, y: 520, width: 40, height: 5 },
        { x: 90, y: 250, width: 5, height: 230 },
        { x: 90, y: 480, width: 120, height: 5 },
        { x: 50, y: 250, width: 40, height: 5 },
        { x: 210, y: 480, width: 5, height: 40 },
        { x: 180, y: 140, width: 310, height: 5 },
        { x: 390, y: 80, width: 5, height: 60 },
        { x: 90, y: 140, width: 5, height: 70 },
        { x: 90, y: 140, width: 40, height: 5 },
        { x: 90, y: 210, width: 40, height: 5 },
        { x: 490, y: 140, width: 5, height: 50 },
        { x: 490, y: 240, width: 5, height: 130 },
        { x: 130, y: 440, width: 320, height: 5 },
        { x: 130, y: 185, width: 320, height: 5 },
        { x: 130, y: 185, width: 5, height: 260 },
        { x: 450, y: 185, width: 5, height: 110 },
        { x: 450, y: 290, width: 40, height: 5 },
        { x: 260, y: 480, width: 235, height: 5 },
        { x: 490, y: 370, width: 50, height: 5 },
        { x: 450, y: 415, width: 40, height: 5 },
        { x: 490, y: 415, width: 5, height: 70 },
        { x: 445, y: 340, width: 5, height: 100 },
        { x: 400, y: 185, width: 5, height: 225 },
        { x: 320, y: 410, width: 85, height: 5 },
        { x: 170, y: 410, width: 85, height: 5 },
        { x: 170, y: 290, width: 5, height: 120 },
        { x: 130, y: 290, width: 45, height: 5 },
        { x: 170, y: 225, width: 5, height: 30 },
        { x: 170, y: 225, width: 180, height: 5 },
        { x: 350, y: 225, width: 5, height: 50 },
        { x: 220, y: 270, width: 135, height: 5 },
        { x: 220, y: 270, width: 5, height: 100 },
        { x: 220, y: 370, width: 135, height: 5 },
        { x: 350, y: 320, width: 5, height: 50 },
        { x: 350, y: 320, width: 50, height: 5 }

      ]
    };

    const player = {
      x: 300,
      y: 580,
      size: 20,
      speed: 2
    
    };

    const playerImage = new Image();
    playerImage.src = '/images/char.png'; // Replace with your player image file

    const ghostImage = new Image();
    ghostImage.src = '/images/ghost1.png';

    const ghosts = [
      { x: 300, y: 300, size: 20, speed: 1, direction: 0 },
      { x: 300, y: 460, size: 20, speed: 1, direction: 0 }
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
          x: 260, // Top-left corner x-coordinate
          y: 300, // Top-left corner y-coordinate
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
      
          const timeElapsed = 90 - timeLeft; // Calculate the time taken (assuming 90 seconds total)
      
          // Generate a unique ID for the new high score
          const newId = Date.now();
          
          // Add the new high score with the time taken
          const newHighscore = new highscore(newId, lives, timeElapsed);
          hs.push(newHighscore); // Add to the high score array
      
          // Sort high scores by time or other criteria
          hs.sort((a, b) => a.time - b.time); // Sort by time (ascending)
      
          // Save updated high scores to a cookie
          maakCookie("hsall", JSON.stringify(hs), 30);
      
          // Set the last added ID for UI highlighting
          lastid = newId;
      
          // Re-render the high score list
          render();
        }

    function resetPlayer() {
      player.x = 300;
      player.y = 580;
      keys = {}; // Reset keys to prevent "stuck" inputs
    }

    function restartGame() {
      // Reset game variables
      lives = 3;
      timeLeft = 90; // Reset the timer
      gameOver = false;
      pauseGame = false;

      // Reset player position
      player.x = 300;
      player.y = 560;

      // Reset ghost positions
      ghosts.forEach((ghost, index) => {
        ghost.x = index === 0 ? 300 : 300; // Reset specific ghost positions
        ghost.y = index === 0 ? 300 : 460;
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


    

    let timeLeft = 90; // 3 minutes in seconds

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
    
    // een array voor de highscores in op te slaan
    let hs = [];
    // een variabele waarmee je het laatst toegevoegde id kan bijhouden    
    let lastid = null;

    // dit is het highscore object (blauwdruk)
    class highscore {
      constructor(id, time) {
          this.id = id; // Highscore ID
          this.time = time; // Time taken to achieve the score
      }
  }

    // stap 1 : lees oude highscores - deserialize
    hs = JSON.parse(leesCookie("hsall"));
    // sorteer array

    // stap 2
    // met de render functie kan je de highscores tonen
    render();


    // de render functie toont de highscores in de browser
    function render() {
      let hsc = document.getElementById("mycontainer");
      hsc.innerHTML = "";
  
      if (hs != null && hs.length > 0) {
          hs.forEach(hse => {
              let d = document.createElement("div");
              d.setAttribute("class", "row");
  
              // Highlight the last added high score
              if (hse.id == lastid) {
                  d.setAttribute("class", "row back");
              }
  
              let d3 = document.createElement("div");
              d3.innerText = `snelsteTijd: ${hse.time}s`; // Display time in seconds
  
              
              d.appendChild(d3);
              hsc.appendChild(d);
          });
  
          // Reset highlighting after 1.5 seconds
          setTimeout(function () {
              document.querySelectorAll(".row").forEach(function (r) {
                  r.classList.remove("back");
              });
          }, 1500);
      } else {
          let d = document.createElement("div");
          d.innerText = "Geen scores aanwezig"; // No scores available
          hsc.appendChild(d);
      }
  }


    // cookie functie om een cookie te maken
    function maakCookie(naam, waarde, dagen) {
        var expires = new Date(Date.now() + dagen * 864e5).toUTCString();
        document.cookie = `${naam}=${waarde};expires=${expires};path=/`;
    }

    // cookie functie om een cookie te lezen
    function leesCookie(naam) {
        const name = naam + "=";
        const cookies = decodeURIComponent(document.cookie).split(';');
        const cookie = cookies.find(function (c) {
            return c.trim().startsWith(name);
        });
        // ternary operator (shorthand if statement)
        return cookie ? cookie.trim().substring(name.length) : null;
    }

    function verwijderCookie(naam) {
        document.cookie = `${naam}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
    }
document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    const canvasWidth = 1200;
    const canvasHeight = 600;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Game Variables
    let spaceship = { x: 100, y: canvasHeight / 2, width: 85, height: 85, speed: 7 };
    let bullets = [];
    let asteroids = [];
    let lives = 3;
    let score = 0;
    let gameOver = false;
    let keys = { up: false, down: false, left: false, right: false };
    let powerUps = [];
    let highScore = getCookie("highScore") || 0;
    let powerUpTimer = 0;
    let imagesLoaded = false;
    let loadedImages = 0;
    let asteroidImagesLoaded = 0;
    let enemies = [];

    // Load Images
    const spaceshipImage = new Image();
    spaceshipImage.src = "images/spaceship.png";
    const bulletImage = new Image();
    bulletImage.src = "images/bullet.png";
    const asteroidImages = [];
    const asteroidImagePaths = [
        "images/asteroid1.png",
        "images/asteroid2.png",
        "images/asteroid3.png",
        "images/asteroid4.png",
        "images/asteroid5.png",
        "images/asteroid6.png",
        "images/asteroid7.png",
        "images/asteroid8.png"
    ];
    const enemyImage = new Image();
    enemyImage.src = "images/enemyspaceship.png";

    // Preload asteroid images
    for (const path of asteroidImagePaths) {
        const img = new Image();
        img.src = path;
        img.onload = () => {
            asteroidImagesLoaded++;
            if (asteroidImagesLoaded === asteroidImagePaths.length) {
                checkAllImagesLoaded();
            }
        };
        img.onerror = () => {
            console.error(`Failed to load image: ${path}`);
        };
        asteroidImages.push(img);
    }

    spaceshipImage.onload = bulletImage.onload = () => {
        loadedImages++;
        checkAllImagesLoaded();
    };

    spaceshipImage.onerror = bulletImage.onerror = () => {
        console.error("Failed to load an image. Check the file paths.");
    };

    function checkAllImagesLoaded() {
        if (loadedImages === 2 && asteroidImagesLoaded === asteroidImagePaths.length) {
            imagesLoaded = true;
            updateGame();
        }
    }

    // Classes
    class Bullet {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.width = 20;
            this.height = 10;
            this.speed = 10;
        }
        update() {
            this.x += this.speed;
        }
        draw() {
            ctx.drawImage(bulletImage, this.x, this.y, this.width * 2, this.height * 2);
        }
    }

    class Asteroid {
        constructor(x, y, size) {
            this.x = x;
            this.y = y;
            this.size = size;
            this.speed = 6;
            this.image = asteroidImages[Math.floor(Math.random() * asteroidImages.length)];
        }
        update() {
            this.x -= this.speed;
        }
        draw() {
            ctx.drawImage(this.image, this.x, this.y, this.size * 2, this.size * 2);
        }
    }

    class PowerUp {
        constructor(x, y, type) {
            this.x = x;
            this.y = y;
            this.width = 40;
            this.height = 40;
            this.speed = 5;
            this.type = type;
            this.image = new Image();
            this.image.src = type === 'shield' ? 'images/powerup_shield.png' : 'images/2x.png';
        }
        update() {
            this.x -= this.speed;
        }
        draw() {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
    }

    class EnemySpaceship {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.width = 60;
            this.height = 60;
            this.speed = Math.random() * 2 + 1;
            this.bullets = [];
        }
        update() {
            this.x -= this.speed;
            if (Math.random() < 0.025) {
                this.shoot();
            }
            for (let i = this.bullets.length - 1; i >= 0; i--) {
                this.bullets[i].update();
                if (this.bullets[i].x < 0) {
                    this.bullets.splice(i, 1);
                }
            }
        }
        draw() {
            ctx.drawImage(enemyImage, this.x, this.y, this.width, this.height);
            for (let bullet of this.bullets) {
                bullet.draw();
            }
        }
        shoot() {
            this.bullets.push(new EnemyBullet(this.x, this.y + this.height / 2 - 5));
        }
    }

    class EnemyBullet extends Bullet {
        constructor(x, y) {
            super(x, y);
            this.speed = -10;
        }
        update() {
            this.x += this.speed;
        }
    }

    // Game Functions
    function drawSpaceship() {
        ctx.drawImage(spaceshipImage, spaceship.x, spaceship.y, spaceship.width, spaceship.height);
    }

    function moveSpaceship() {
        if (keys.up && spaceship.y > 0) spaceship.y -= spaceship.speed;
        if (keys.down && spaceship.y < canvasHeight - spaceship.height) spaceship.y += spaceship.speed;
        if (keys.left && spaceship.x > 0) spaceship.x -= spaceship.speed;
        if (keys.right && spaceship.x < canvasWidth - spaceship.width) spaceship.x += spaceship.speed;
    }

    function shootBullet() {
        if (!gameOver) {
            bullets.push(new Bullet(spaceship.x + spaceship.width, spaceship.y + spaceship.height / 2.4 - 3));
        }
    }

    function updateBullets() {
        for (let i = bullets.length - 1; i >= 0; i--) {
            bullets[i].update();
            bullets[i].draw();
            if (bullets[i].x > canvasWidth) {
                bullets.splice(i, 1);
            }
        }
    }

    function generateAsteroids() {
        let spawnRate = Math.max(0.002, 0.002 + score / 10000); // Lower initial spawn rate
        if (Math.random() < spawnRate) {
            let size = Math.random() * 20 + 20;
            let yPos = Math.random() * (canvasHeight - size);
            asteroids.push(new Asteroid(canvasWidth, yPos, size));
        }
        for (let i = asteroids.length - 1; i >= 0; i--) {
            asteroids[i].update();
            asteroids[i].draw();
            if (asteroids[i].x < 0) {
                asteroids.splice(i, 1);
            }
        }
    }

    function detectCollisions() {
        for (let i = asteroids.length - 1; i >= 0; i--) {
            for (let j = bullets.length - 1; j >= 0; j--) {
                let asteroid = asteroids[i];
                let bullet = bullets[j];
                if (
                    bullet.x < asteroid.x + asteroid.size * 2 &&
                    bullet.x + bullet.width * 2 > asteroid.x &&
                    bullet.y < asteroid.y + asteroid.size * 2 &&
                    bullet.y + bullet.height * 2 > asteroid.y
                ) {
                    asteroids.splice(i, 1);
                    bullets.splice(j, 1);
                    score += (powerUpTimer > 0 ? 20 : 10);
                    break;
                }
            }
        }
        for (let i = enemies.length - 1; i >= 0; i--) {
            for (let j = bullets.length - 1; j >= 0; j--) {
                let enemy = enemies[i];
                let bullet = bullets[j];
                if (
                    bullet.x < enemy.x + enemy.width &&
                    bullet.x + bullet.width * 2 > enemy.x &&
                    bullet.y < enemy.y + enemy.height &&
                    bullet.y + bullet.height * 2 > enemy.y
                ) {
                    enemies.splice(i, 1);
                    bullets.splice(j, 1);
                    score += (powerUpTimer > 0 ? 40 : 20);
                    break;
                }
            }
        }
    }

    function generatePowerUps() {
        if (Math.random() < 0.0025) {
            const yPos = Math.random() * (canvasHeight - 40);
            const type = Math.random() < 0.5 ? 'shield' : 'doublePoints';
            powerUps.push(new PowerUp(canvasWidth, yPos, type));
        }
        for (let i = powerUps.length - 1; i >= 0; i--) {
            powerUps[i].update();
            powerUps[i].draw();
            if (powerUps[i].x < -powerUps[i].width) {
                powerUps.splice(i, 1);
            }
        }
    }

    function detectPowerUpCollisions() {
        for (let i = powerUps.length - 1; i >= 0; i--) {
            const powerUp = powerUps[i];
            if (
                powerUp.x < spaceship.x + spaceship.width &&
                powerUp.x + powerUp.width > spaceship.x &&
                powerUp.y < spaceship.y + spaceship.height &&
                powerUp.y + powerUp.height > spaceship.y
            ) {
                if (powerUp.type === 'shield') {
                    lives += 1;
                } else if (powerUp.type === 'doublePoints') {
                    powerUpTimer = 300; // 300 frames of double points
                }
                powerUps.splice(i, 1);
                break;
            }
        }
    }

    function detectSpaceshipCollisions() {
        for (let i = asteroids.length - 1; i >= 0; i--) {
            let dx = spaceship.x - asteroids[i].x;
            let dy = spaceship.y - asteroids[i].y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < asteroids[i].size + spaceship.width / 2) {
                lives -= 1;
                asteroids.splice(i, 1);
                if (lives <= 0) {
                    gameOver = true;
                }
                break;
            }
        }
    }

    function detectEnemyBulletCollisions() {
        for (let i = enemies.length - 1; i >= 0; i--) {
            for (let j = enemies[i].bullets.length - 1; j >= 0; j--) {
                let bullet = enemies[i].bullets[j];
                if (
                    bullet.x < spaceship.x + spaceship.width &&
                    bullet.x + bullet.width * 2 > spaceship.x &&
                    bullet.y < spaceship.y + spaceship.height &&
                    bullet.y + bullet.height * 2 > spaceship.y
                ) {
                    enemies[i].bullets.splice(j, 1);
                    lives -= 1;
                    if (lives <= 0) {
                        gameOver = true;
                    }
                    break;
                }
            }
        }
    }

    function generateEnemies() {
        let spawnRate = Math.max(0.005, 0.005 + score / 20000); // Increase spawn rate with score
        if (Math.random() < spawnRate) {
            let yPos = Math.random() * (canvasHeight - 60);
            enemies.push(new EnemySpaceship(canvasWidth, yPos));
        }
        for (let i = enemies.length - 1; i >= 0; i--) {
            enemies[i].update();
            enemies[i].draw();
            if (enemies[i].x < -enemies[i].width) {
                enemies.splice(i, 1);
            }
        }
    }

    function updateGame() {
        if (!imagesLoaded) return;
        if (gameOver) {
            ctx.fillStyle = "white";
            ctx.font = "40px Arial";
            ctx.fillText("Game Over", canvasWidth / 2 - 100, canvasHeight / 2);
            ctx.font = "20px Arial";
            ctx.fillText("Final Score: " + score, canvasWidth / 2 - 70, canvasHeight / 2 + 40);
            ctx.fillText("Press Space to Restart", canvasWidth / 2 - 100, canvasHeight / 2 + 80);
            updateHighScore();
            return;
        }
        try {
            console.log("Updating game...");
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            moveSpaceship();
            drawSpaceship();
            updateBullets();
            generateAsteroids();
            generateEnemies();
            generatePowerUps();
            detectCollisions();
            detectSpaceshipCollisions();
            detectEnemyBulletCollisions();
            detectPowerUpCollisions();
            if (powerUpTimer > 0) {
                powerUpTimer--;
                document.getElementById("powerUpTimer").innerText = `Power-Up Time: ${powerUpTimer}`;
            } else {
                document.getElementById("powerUpTimer").innerText = "";
            }
            ctx.fillStyle = "white";
            ctx.font = "20px Arial";
            ctx.fillText("Lives: " + lives, 20, 30);
            ctx.fillText("Score: " + score, canvasWidth - 107, 60);
            ctx.fillText("High Score: " + highScore, canvasWidth - 150, 30);
            requestAnimationFrame(updateGame);
        } catch (error) {
            console.error("Error in updateGame:", error);
        }
    }

    function resetGame() {
        spaceship = { x: 100, y: canvasHeight / 2, width: 85, height: 85, speed: 7 };
        bullets = [];
        asteroids = [];
        enemies = [];
        lives = 3;
        score = 0;
        gameOver = false;
        powerUpTimer = 0;
        updateGame();
    }

    function setCookie(name, value, days) {
        const d = new Date();
        d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + d.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/";
    }

    function getCookie(name) {
        const cname = name + "=";
        const decodedCookie = decodeURIComponent(document.cookie);
        const ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(cname) == 0) {
                return c.substring(cname.length, c.length);
            }
        }
        return "";
    }

    function updateHighScore() {
        if (score > highScore) {
            highScore = score;
            setCookie("highScore", highScore, 365);
        }
    }

    // Event Listeners
    document.addEventListener("keydown", (event) => {
        if (event.key === "w") keys.up = true;
        if (event.key === "s") keys.down = true;
        if (event.key === "a") keys.left = true;
        if (event.key === "d") keys.right = true;
        if (event.key === " " && !gameOver) shootBullet();
        if (event.key === " " && gameOver) {
            resetGame();
        }
    });

    document.addEventListener("keyup", (event) => {
        if (event.key === "w") keys.up = false;
        if (event.key === "s") keys.down = false;
        if (event.key === "a") keys.left = false;
        if (event.key === "d") keys.right = false;
    });

    // Start Game
    updateGame();
});
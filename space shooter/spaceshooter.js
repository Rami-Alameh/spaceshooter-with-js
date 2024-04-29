class Game {
    constructor() {
      this.canvas = document.getElementById("myCanvas");
      this.ctx = this.canvas.getContext("2d");
      this.sprites = [];
      this.score = 130;
      this.lastAlienTime = 0;
      this.soundsPlayed = [];
      this.hearts = 5;
    //  this.heartsElement = document.getElementById("hearts");
      //this.heartsElement.textContent = this.hearts;
      this.paused = false;
      this.introMessage=false;
      this.gameStarted = false;//to check if game started
      this.win=false;
      this.lose=false;
      this.controls = false;
      this.bossMode=false;
      this.backgroundMusic = new Audio("./sounds/back.mp3");
      // loop and play automatically
      this.backgroundMusic.loop = true;
      this.backgroundMusic.autoplay = true;
      // const pauseButton = document.getElementById("pause-button");
      // pauseButton.addEventListener("click", () => {
      //   this.paused = true;
      // });
      
      // const startGame = () => {
      //   this.introMessage = false;
      //   document.removeEventListener('keydown', startGame);
      // };
      // // add event listener for resume button
      // const resumeButton = document.getElementById("resume-button");
      // resumeButton.addEventListener("click", () => {
      //   this.paused = false;
      // });
      // create the jet and add event listeners for moving and shooting
      const jet = new Jet(this.canvas); //i removed them because i couldn't call in the update method so i add it to the game below
      this.addSprite(jet);
      document.addEventListener("keydown", (event) => {
        if (event.keyCode === 37 && this.paused==false && this.gameStarted==true && this.controls === false) {
          jet.moveLeft();
        } else if (event.keyCode === 39 && this.paused==false && this.gameStarted==true && this.controls === false) {
          jet.moveRight();
        } else if (event.keyCode === 32 && this.paused==false && this.gameStarted==true && this.controls === false) {
          jet.shoot();
        }
        if (event.keyCode === 80) { // "p" key to pause the game
          this.paused = true;
        } else if (event.keyCode === 82) { // "r" key to resume the game
          this.paused = false;
          this.controls=false;
        }
        if (event.keyCode === 83 && !this.gameStarted) { // 83 is the key code for 's'
          this.gameStarted = true;
          this.startBackgroundMusic();
        }
        if(event.keyCode ===77){
  
          this.stopBackgroundMusic();
          
        }
        if(event.keyCode ===75){
  
          this.startBackgroundMusic();
          
        }
        if(event.keyCode ===67){
  
          this.controls=true;
          
        }
        if (event.keyCode === 70 && this.paused==false && this.gameStarted==true && this.controls === false) { // check if power-up key is pressed
          jet.powerUp();
        }
      });
    }
    startBackgroundMusic() {
      this.backgroundMusic.play();
    }
    
    stopBackgroundMusic() {
      this.backgroundMusic.pause();
    }
    clearAliens() {
      for (let i = 0; i < this.sprites.length+10; i++) {
        if (this.sprites[i] instanceof Alien) {
          this.removeSprite(this.sprites[i]);
        }
      }
    }
    update() {
      if (this.paused || this.controls) { // if the game is paused, do not update anything
        return;
      }
      if (!this.gameStarted) { // do not update anything until the game has started
        return;
      }
      if(this.win || this.lose){//if the player won or lost stop updating the game
        return;
      }
      const currentTime = Date.now();
  
      for (var i = 0; i < this.sprites.length; i++) {
        this.sprites[i].update();
      }
     
  
     // Check for collisions between the jet and the boss projectiles
     for (let i = 0; i < this.sprites.length; i++) {
      if (this.sprites[i] instanceof Projectile &&
        this.sprites[i].collidesWith(this.sprites.find((s) => s instanceof Jet))) {
        this.hearts--;
        this.removeSprite(this.sprites[i]);
          if (this.hearts === 0 || this.hearts<0) {
            // create an explosion in the center of the bottom of the canvas
            const explosion = new Explosion(this.canvas.width / 2, this.canvas.height - 64, 128, 128);
            this.addSprite(explosion);
            this.removeSprite(this.sprites.find((s) => s instanceof Jet)); // remove the jet from the game
            const sound = new Audio("./sounds/mixkit-8-bit-lose-2031.wav");
            sound.play();
            
            // wait for the explosion to finish and show the end screen
            const startTime = Date.now();
            
            const animate = () => {
              const elapsedTime = Date.now() - startTime;
              if (elapsedTime >= 1000) {
                
              } 
              if(elapsedTime >= 2000){
                this.lose=true;
                } else {
                requestAnimationFrame(animate);
              }
            };
            requestAnimationFrame(animate);
          }
      }
    }//ends 
  
  
      // Check for collisions between bullets and aliens
      for (var i = 0; i < this.sprites.length; i++) {
        if (this.sprites[i] instanceof Bullet) {
          for (var j = 0; j < this.sprites.length; j++) {
            if (
              (this.sprites[j] instanceof Alien || this.sprites[j] instanceof Boss) &&
              this.sprites[j].collidesWith(this.sprites[i])
            ) {
              this.removeSprite(this.sprites[i]);
              if (this.sprites[j] instanceof Alien) {
                this.removeSprite(this.sprites[j]);
                if(this.score<140){
                  this.score++;}
           //     document.getElementById("points").textContent = this.score;
    
                // Play sound if score reaches 50, 100, or 150 
                if (
                  [50, 100, 150].includes(this.score) &&
                  !this.soundsPlayed.includes(this.score)
                ) {
                  const sound = new Audio("./sounds/mixkit-small-win-2020.wav");
                  sound.play();
                  this.soundsPlayed.push(this.score);
                }
                
                // Check if player has reached the score threshold for boss mode
                if (this.score == 140 && this.bossMode==false) {
                  this.clearAliens();
                  
                  this.clearAliens();
                  this.clearAliens();
                  this.clearAliens();
                  this.bossMode = true;
                   this.addSprite(new Boss(this.canvas));
                 }
                if(this.score>=150 ){
                   this.win=true;
                }
              } else if (this.sprites[j] instanceof Boss) {
                if (this.sprites[j].hit()) {
                  this.removeSprite(this.sprites[j]);
                  this.score += 50;
                 // document.getElementById("points").textContent = this.score;
                  this.bossMode = false;
                }
              }
            }
          }
        }
      }
    
  
     
    //collision between the alien and jet removes lives
      for (var i = 0; i < this.sprites.length; i++) {
        if (
          this.sprites[i] instanceof Alien &&
          this.sprites[i].collidesWith(this.sprites.find((s) => s instanceof Jet))
        ) {
          this.removeSprite(this.sprites[i]);
          this.hearts--;
        //  this.heartsElement.textContent = this.hearts;
    
          if (this.hearts === 0 || this.hearts<0) {
            // create an explosion in the center of the bottom of the canvas
            const explosion = new Explosion(this.canvas.width / 2, this.canvas.height - 64, 128, 128);
            this.addSprite(explosion);
            this.removeSprite(this.sprites.find((s) => s instanceof Jet)); // remove the jet from the game
            const sound = new Audio("./sounds/mixkit-8-bit-lose-2031.wav");
            sound.play();
            
            // wait for the explosion to finish and show the end screen
            const startTime = Date.now();
            
            const animate = () => {
              const elapsedTime = Date.now() - startTime;
              if (elapsedTime >= 1000) {
                
              } 
              if(elapsedTime >= 2000){
                this.lose=true;
                } else {
                requestAnimationFrame(animate);
              }
            };
            requestAnimationFrame(animate);
          }}}
      // create a new alien every 1.5 seconds
      if (this.bossMode==false && currentTime - this.lastAlienTime >= 1050 && this.lose==false ) {
        this.createAlien();
        this.lastAlienTime = currentTime;
      }
      
  
      //collision between alien and the bottom of the canvas
      for (var i = 0; i < this.sprites.length; i++) {
        if (
          this.sprites[i] instanceof Alien &&
          (this.sprites[i].y + this.sprites[i].height) >= this.canvas.height
        ) {
          this.removeSprite(this.sprites[i]);
          if(this.hearts>0){this.hearts--;}//so the hearts don't increment below zero 
         // this.heartsElement.textContent = this.hearts;
      
          if (this.hearts === 0 || this.hearts < 0) {
            const explosion = new Explosion(
              this.canvas.width / 2,
              this.canvas.height - 64,
              128,
              128
            );
            this.addSprite(explosion);
            this.removeSprite(this.sprites.find((s) => s instanceof Jet));
            const sound = new Audio("./sounds/mixkit-8-bit-lose-2031.wav");
            sound.play();
      
            const startTime = Date.now();
      
            const animate = () => {
              const elapsedTime = Date.now() - startTime;
              if (elapsedTime >= 1000) {
               this.lose=true;
              }
              if (elapsedTime >= 2000) {
                
              } else {
                requestAnimationFrame(animate);
              }
            };
            requestAnimationFrame(animate);
          }
        }
      }
    
    }//update end
    showintro() {
      this.ctx.fillStyle = "white";
      
      this.ctx.textAlign = "center";
      this.ctx.font= "40px italic";
      this.ctx.fillText("Space Invaders", this.canvas.width / 2, this.canvas.height / 2 - 180);
      this.ctx.font = "22px italic";
      this.ctx.fillText("The main ship is under attack!", this.canvas.width / 2, this.canvas.height / 2 - 120);
      this.ctx.fillText("The alien invasion has begun their forces are closing in.", this.canvas.width / 2, this.canvas.height / 2 - 80);
      this.ctx.fillText("Defend the ship at all cost", this.canvas.width / 2, this.canvas.height / 2 - 40);
      this.ctx.fillText(" Good Luck", this.canvas.width / 2, this.canvas.height / 2);
      this.ctx.fillText("Use the arrow keys to move and the space bar to shoot.", this.canvas.width / 2, this.canvas.height / 2 + 40);
      this.ctx.fillText("Use the 'f' key to activate the special power.", this.canvas.width / 2, this.canvas.height / 2 + 80);
      this.ctx.fillText("Press 'c' to view all the controls in the game", this.canvas.width / 2, this.canvas.height / 2 + 120);
      this.ctx.fillText("Press 's' to start the game.", this.canvas.width / 2, this.canvas.height / 2 + 160);
    }
    showWin() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // clear the canvas
      this.ctx.fillStyle = "#000000";
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height); // fill the canvas with black
      this.ctx.fillStyle = "#FFFFFF";
      this.ctx.font = "40px Arial";
      this.ctx.textAlign = "center";
      this.ctx.fillText("Congrats, Invaders defeated", this.canvas.width / 2, this.canvas.height / 2 - 50); // display "Game Over" message
      this.ctx.font = "20px Arial";
      this.ctx.fillText(`Your score: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2); // display the player's score
      this.ctx.fillText("Press any key to play again", this.canvas.width / 2, this.canvas.height / 2 + 50); // display instructions to play again
      document.addEventListener("keydown", () => {
        location.reload(); // reload the page to start a new game when the player presses a key
      });
    }
    showControls() {
      this.ctx.fillStyle = "#000000";
      this.ctx.fillStyle = "#FFFFFF";
      this.ctx.font = "20px Arial";
      this.ctx.textAlign = "center";
      this.ctx.fillText("Use the arrow keys to move and the space bar to shoot.", this.canvas.width / 2, this.canvas.height / 2 - 120);
      this.ctx.fillText("Press 'M' to mute and K to unmute background music.", this.canvas.width / 2, this.canvas.height / 2 - 80);
      this.ctx.fillText("press 'P' to pause and 'R to resume'.", this.canvas.width / 2, this.canvas.height / 2 - 40);
      this.ctx.fillText("The special ability is available 3 times per game", this.canvas.width / 2, this.canvas.height / 2);
      this.ctx.fillText(" press 'f' to activate the special ability.", this.canvas.width / 2, this.canvas.height / 2 + 40);
      this.ctx.fillText("Press R to resume", this.canvas.width / 2, this.canvas.height / 2 + 80); // display instructions to play again
     
    }
    showLose() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // clear the canvas
      this.ctx.fillStyle = "#000000";
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height); // fill the canvas with black
      this.ctx.fillStyle = "#FFFFFF";
      this.ctx.font = "40px Arial";
      this.ctx.textAlign = "center";
      this.ctx.fillText("Game Over. Invaders won", this.canvas.width / 2, this.canvas.height / 2 - 50); // display "Game Over" message
      this.ctx.font = "20px Arial";
      this.ctx.fillText(`Your score: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2); // display the player's score
      this.ctx.fillText("Press any key to play again", this.canvas.width / 2, this.canvas.height / 2 + 50); // display instructions to play again
      document.addEventListener("keydown", () => {
        location.reload(); // reload the page to start a new game when the player presses a key
      });
    }
    
    draw() {
       this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      if (!this.gameStarted) { // do not draw anything until the game has started
        this.showintro();
        return;
      }
      if(this.win){
        this.showWin();
        return;
      }
      if (this.lose) { // do not draw anything until the game has started
        this.showLose();
        return;
      }
       
      this.ctx.font = "20px Arial";
      this.ctx.fillStyle = "blue";
      this.ctx.textAlign = "left";
      this.ctx.fillText(`Score: ${this.score}`, 10, 30);
      
      this.ctx.font = "20px Arial";
      this.ctx.fillStyle = "red";
      this.ctx.textAlign = "right";
      this.ctx.fillText(`Hearts: ${this.hearts}`, this.canvas.width - 10, 30);
        for (var i = 0; i < this.sprites.length; i++) {
          this.sprites[i].draw(this.ctx);
        }
    
        this.ctx.fillStyle = "red";
        this.ctx.font = "100px Arial";
        
    
        if (this.paused) { // draw message when the game is paused
          this.ctx.textAlign = "center";
          this.ctx.fillText("Paused", this.canvas.width/2, this.canvas.height/2);
        }
        if(this.controls){
          this.showControls();
        }
      if(this.introMessage){
        this.intro();
      }
  
      }
    
  
    addSprite(pSprite) {
      this.sprites.push(pSprite);
    }
  
    removeSprite(pSprite) {
      const index = this.sprites.indexOf(pSprite);
      if (index !== -1) {
        this.sprites.splice(index, 1);
      }
    }
  
    createAlien() {
      const x = Math.floor(Math.random() * (this.canvas.width - 50));
      const y = 0;
      const alien = new Alien(x, y, 50, 50,this.score,this.hearts);
    
      // Increase drop rate based on score
      if (this.score >= 20 && this.score < 60) {
        // Score is between 50 and 100, drop 1 alien every 1.5 seconds
        this.addSprite(alien);
        
        this.lastAlienTime = Date.now()-500;
      } else if (this.score >= 100) {
        // Score is greater than or equal to 100, drop 1 alien every second
        this.addSprite(alien);
        this.lastAlienTime = Date.now() - 500;
      } else {
        // Score is less than 50, drop 1 alien every 2 seconds
        this.addSprite(alien);
        this.lastAlienTime = Date.now();
      }
    }
    
  }
  
  class Sprite {
    constructor(x, y, width, height) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
    }
  
    update() {}
  
    draw(ctx) {}
  }
  class Boss extends Sprite {
    constructor(canvas) {
      super();
      this.canvas=canvas;
      this.image = new Image();
      this.image.src = "./images/Boss.png";
      this.width = 100;
      this.height = 80;
      this.x = (this.canvas.width - this.width) / 2;
      this.y = 30;
      this.health = 20;
    this.direction=1;
    this.speed=3;
    this.balls = []; // projectile array
    this.lastDropTime = 0;
    this.dropInterval = 1000; // 1 sec interval
    }
  
    update() {
      this.x += this.speed * this.direction;
  
      if (this.x <= 0 || this.x + this.width >= this.canvas.width) {
        this.direction *= -1;
      }
      this.dropBalls();
    }
   dropBalls() {
      const currentTime = Date.now();
      if (currentTime - this.lastDropTime >= this.dropInterval) {
        const ball = new Projectile(this.x + this.width / 2, this.y + this.height, "ball.png",this.canvas);
        this.balls.push(ball);
        game.addSprite(ball);
        this.lastDropTime = currentTime;
      }
    }
    draw(ctx) {
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
      ctx.fillStyle = "#ff0000";
      ctx.fillRect(this.x, this.y - 10, this.width * (this.health / 3), 5);
    }
  
    collidesWith(Sprite) {
      return (
        this.x < Sprite.x + Sprite.width &&
        this.x + this.width > Sprite.x &&
        this.y < Sprite.y + Sprite.height &&
        this.y + this.height > Sprite.y
      );
    }
  
    hit() {
      this.health--;
      if (this.health <= 0) {
        return true;
      }
      return false;
    }
  }
  //projectiles from boss 
  class Projectile extends Sprite {
    constructor(x, y, imageSrc,canvas) {
      super(x, y, 32, 32, imageSrc);
      this.speedY = 5;
      this.canvas=canvas;
      this.imh= new Image();
      this.imh.src="./images/ball.png";
      this.color="green";
    }
    collidesWith(sprite) {
      if (sprite === undefined) {
        return false;
      }
      return (
        this.x < sprite.x + sprite.width &&
        this.x + this.width > sprite.x &&
        this.y < sprite.y + sprite.height &&
        this.y + this.height > sprite.y
      );
    }
    update() {
      this.y += this.speedY;
      if (this.y > this.canvas.height) {
        game.removeSprite(this);
      }
    
    }
    draw(ctx) {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, 0, 2 * Math.PI);
      ctx.fill();
    }
  }
  //aliens
  class Alien extends Sprite {
    constructor(x, y, width, height,score) {
      super(x, y, width, height);
      this.score=score;
      this.speed = 1;
      this.image = new Image();
      this.image.src = "./images/alien.png";
       this.losesound = new Audio("./sounds/mixkit-8-bit-lose-2031.wav");
    }
  
    update() {
      this.y += this.speed;
  
      // increase speed at score 20, 50, and 100 and 75
      if (this.score >= 20 && this.score < 50 && this.speed < 4) {
        this.speed = 2;
      } else if (this.score >= 50 && this.score < 75 && this.speed < 5) {
        this.speed = 3;
      } else if (this.score >= 100 && this.score < 135 && this.speed < 6) {
        this.speed = 5;
      }else if (this.score >= 75 && this.score < 100 && this.speed < 5) {
        this.speed = 4;
      } 
      else if (this.score >135 && this.speed < 6) {
        this.speed = 0.4;
      }
  
     
    }
  
    draw(ctx) {
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
  
  
    collidesWith(sprite) {
      if (sprite === undefined) {
        return false;
      }
      return (
        this.x < sprite.x + sprite.width &&
        this.x + this.width > sprite.x &&
        this.y < sprite.y + sprite.height &&
        this.y + this.height > sprite.y
      );
    }
  }
  
  class Jet extends Sprite {
    constructor(canvas) {
      
      super(225, 450, 50, 50);
      this.speed = 10;
      this.canvas=canvas;
      this.bullets = [];
      this.bulletCounter = 0;
      this.maxBullets = 100000;
      this.image = new Image();
      this.image.src = "./images/rocket.png";
      this.shootSound = new Audio("./sounds/sounds_shoot.wav");
      this.hearts = 3;
      this.bulletsp=1;
      this.powerUpCount = 0;
      this.powerUpsound = new Audio("./sounds/power.mp3");
    }
  
    // Move the Jet left or right
    moveLeft() {
      this.x -= this.speed;
      if (this.x < 0) {
        this.x = 0;
      }
    }
  
    moveRight() {
      this.x += this.speed;
      if (this.x + this.width > 500) {
        this.x = 500 - this.width;
      }
    }
    powerUp() {
      if (this.powerUpCount < 3) {
        this.powerUpCount++;
        const bulletXPositions = [];
        const bulletCount = 20;
        const bulletGap = this.canvas.width / bulletCount;
        this.powerUpsound.play();
        for (let i = 0; i < bulletCount; i++) {
          bulletXPositions.push(bulletGap / 2 + bulletGap * i);
        }
        for (let i = 0; i < bulletCount; i++) {
          const bullet = new Bullet(0 + bulletXPositions[i], this.y);
          game.addSprite(bullet);
        }
      }
    }
    // Update the Jet's position and bullets
    update() {
      for (let i = 0; i < this.bullets.length; i++) {
        this.bullets[i].update();
      }
      if (game.score >= 75 && game.score< 135 && this.bulletsp === 1) {
        this.bulletsp++;
      }
      if (game.score >= 135 && this.bulletsp === 2) {
        this.bulletsp--;
      }
      if (Key.isDown(Key.LEFT) && this.x > 0) {
        this.x -= this.speed;
      } else if (Key.isDown(Key.RIGHT) && this.x + this.width < 500) {
        this.x += this.speed;
      }
    }
  
    // Draw the Jet
    draw(ctx) {
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
  
    // Shoot a bullet
    shoot() {
      if(this.bulletsp==1){  if (this.bullets.length < this.maxBullets) {
        const bullet = new Bullet(this.x + this.width / 2, this.y);
        this.bullets.push(bullet);
        game.addSprite(bullet);
        this.bulletCounter++;
        this.shootSound.play();
      }}
      else if(this.bulletsp==2){
        if (this.bullets.length < this.maxBullets) {
          const bullet = new Bullet(this.x + this.width / 2, this.y);
          this.bullets.push(bullet);
          game.addSprite(bullet);
          const bullet2 = new Bullet(this.x +20 + this.width / 2, this.y);
          this.bullets.push(bullet2);
          game.addSprite(bullet2);
          this.bulletCounter++;
          this.shootSound.play();
      }
    
    }
    }
  
  
  
    // Remove a bullet from the bullets array
    removeBullet(bullet) {
      const index = this.bullets.indexOf(bullet);
      if (index !== -1) {
        this.bullets.splice(index, 1);
      }
    }
  }
  
  class Explosion extends Sprite {
    constructor(x, y, width, height) {
      super(x, y, width, height);
      this.frameIndex = 0;
      this.frameWidth = 128;
      this.frameHeight = 128;
      this.frameCount = 20;
      this.image = new Image();
      this.image.src = "./images/explosion.png";
    }
  
    update() {
      this.frameIndex++;
  
      if (this.frameIndex >= this.frameCount) {
        game.removeSprite(this);
      }
    }
  
    draw(ctx) {
      ctx.drawImage(
        this.image,
        this.frameIndex * this.frameWidth,
        0,
        this.frameWidth,
        this.frameHeight,
        this.x,
        this.y,
        this.width,
        this.height
      );
    }
  }
  
  class Bullet extends Sprite {
    constructor(x, y, jet) {
      super(x, y, 5, 10);
      this.speed = 10;
      this.jet = jet;
      this.image=new Image();
      this.image.src = "./images/bullet.png";
      
    }
    update() {
      this.y -= this.speed;
      if (this.y < 0) {
        this.destroy();
      }
    }
  
    draw(ctx) {
      ctx.fillStyle = "blue";
      ctx.fillRect(this.x, this.y, this.width, this.height);
      ctx.shadowBlur = 10;
      ctx.fillStyle = "white";
      ctx.fillRect(this.x + 1, this.y, this.width - 2, this.height - 2);
      ctx.fillStyle = "rgba(0, 255, 255, 0.2)";
      ctx.fillRect(this.x, this.y - 10, this.width, this.height + 20);
      ctx.fillStyle = "rgba(0, 255, 255, 0.1)";
      ctx.fillRect(this.x - 2, this.y - 15, this.width + 4, this.height + 30);
    }
  
    destroy() {
      if (game.sprites.includes(this)) {
        game.removeSprite(this);
      }
      
    }
    shoot() {
      var bullet = new Bullet(this.x + 25, this.y, this);
      game.addSprite(bullet);
      this.bullets.push(bullet);
    }
  }
  var requestAnimFrame = (function(){
      return  window.requestAnimationFrame       ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame    ||
              function( callback ){
                window.setTimeout(callback, 1000 / 60);
              };
    })();
    const Key = {
      _pressed: {},
      LEFT: 37,
      RIGHT: 39,
      SPACE: 32,
    
      isDown: function(keyCode) {
        return this._pressed[keyCode];
      },
    
      onKeyDown: function(event) {
        this._pressed[event.keyCode] = true;
      },
    
      onKeyUp: function(event) {
        delete this._pressed[event.keyCode];
      }
    };
    
    window.addEventListener("keyup", function(event) { Key.onKeyUp(event); }, false);
    window.addEventListener("keydown", function(event) { Key.onKeyDown(event); }, false);
  var game = new Game();
  
  function gameEngineLoop(){
      game.update();
      game.draw();
      requestAnimFrame(gameEngineLoop);
  }
  
  gameEngineLoop();
  
  
  
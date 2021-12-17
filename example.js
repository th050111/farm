const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d')
canvas.width = 900;
canvas.height = 600;


//전역 변수
const cellsize = 100;
const cellGap = 3;
const gamerGrid = [];
const defenders = [];
let numberOfResources = 300;
const enemies = [];
const enemyPositions = [];
let enemiesInterval = 600;
let gameOver = false;
let frame = 0;
const projectiles = [];
let score = 0;
const resources = [];

//마우스
const mouse = {
  x: 10,
  y: 10,
  width: 0.1,
  height: 0.1,
}

//현재 캔버스 위치
let canvasPosition = canvas.getBoundingClientRect();
//mouse 이벤트
canvas.addEventListener('mousemove', (e) => {
  //캔버스 내에서의 위치 저장
  mouse.x = e.x - canvasPosition.left;
  mouse.y = e.y - canvasPosition.top;
})
canvas.addEventListener('mouseleave', () => {
  mouse.x = undefined;
  mouse.y = undefined;
})

//게임 보드
const controlsBar = {
  width: canvas.width,
  height: cellsize,
}

//한 칸 
class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = cellsize;
    this.height = cellsize;
  }
  //칸 그리기
  draw() {
    if (mouse.x && mouse.y && collision(this, mouse)) {
      ctx.strokeStyle = "black";
      ctx.strokeRect(this.x, this.y, this.width, this.width, this.height)
    }
  }
}

//그리드 배열 생성
function createGrid() {
  for (let y = cellsize; y < canvas.height; y += cellsize) {
    for (let x = 0; x < canvas.width; x += cellsize) {
      gamerGrid.push(new Cell(x, y));
    }
  }
}
createGrid();

//그리드 그리기
function handleGameGrid() {
  for (let i = 0; i < gamerGrid.length; i++) {
    gamerGrid[i].draw();
  }
}

//발사체 
class Projectile {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 10;
    this.height = 10;
    this.power = 20;
    this.speed = 5;
  }
  update() {
    this.x += this.speed;
  }
  draw() {
    ctx.fillStyle = "black"
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.width, 0, Math.PI * 2);
    ctx.fill();
  }
}
function handleProjectiles() {
  for (let i = 0; i < projectiles.length; i++) {
    projectiles[i].update();
    projectiles[i].draw();

    for (let j = 0; j < enemies.length; j++) {
      if (enemies[j] && projectiles[i] && collision(projectiles[i], enemies[j])) {
        enemies[j].health -= projectiles[i].power;
        projectiles.splice(i, 1);
        i--;
      }
    }

    if (projectiles[i] && projectiles[i].x > canvas.width - cellsize) {
      projectiles.splice(i, 1);
      i--;
    }
  }
}

//방어물
const defender1 = new Image();
defender1.src = 'image/defender1.png'



function handleDefenders() {
  for (let i = 0; i < defenders.length; i++) {
    defenders[i].draw();
    defenders[i].update();
    if (enemyPositions.indexOf(defenders[i].y - cellGap) !== -1) {
      defenders[i].shooting = true;
    } else {
      defenders[i].shooting = false;
    }
    for (let j = 0; j < enemies.length; j++) {
      if (defenders[i] && collision(defenders[i], enemies[j])) {
        enemies[j].movement = 0;
        defenders[i].health -= 0.2;
      }
      if (defenders[i] && defenders[i].health <= 0) {
        defenders.splice(i, 1);
        i--;
        enemies[j].movement = enemies[j].speed;
      }
    }
  }
}

//플로팅 메시지
const floatingMessages = [];
class FloatingMessage {
  constructor(value, x, y, size, color) {
    this.value = value;
    this.x = x;
    this.y = y;
    this.size = size;
    this.lifeSpan = 0;
    this.color = color;
    this.opacity = 1;
  }
  update() {
    this.y -= 0.3;
    this.lifeSpan += 1;
    if (this.opacity > 0.01)
      this.opacity -= 0.01;
  }
  draw() {
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;
    ctx.font = this.size + "px Arial"
    ctx.fillText(this.value, this.x, this.y)
    ctx.globalAlpha = 1;
  }
}
function handleFloatingMessage() {
  for (let i = 0; i < floatingMessages.length; i++) {
    floatingMessages[i].update();
    floatingMessages[i].draw();
    if (floatingMessages[i].lifeSpan >= 50) {
      floatingMessages.splice(i, 1);
      i--;
    }
  }
}

//적
const enemyTypes = [];
const enemy1 = new Image();
enemy1.src = 'image/enemy1.png'
enemyTypes.push(enemy1);
const enemy2 = new Image();
enemy2.src = 'image/enemy2.png'
enemyTypes.push(enemy2);

class Enemy {
  constructor(verticalPosition) {
    this.x = canvas.width;
    this.y = verticalPosition;
    this.width = cellsize - cellGap * 2;
    this.height = cellsize - cellGap * 2;
    this.speed = Math.random() * 0.2 + 0.4;
    this.movement = this.speed;
    this.health = 100;
    this.maxHealth = this.health;
    this.enemyType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
    this.frameX = 0;
    this.frameY = 0;
    this.minFrame = 0;
    this.maxFrame = 4;
    this.spriteWidth = 256;
    this.spriteHeight = 256;
  }
  update() {
    this.x -= this.movement;
    if (frame % 10 === 0) {
      if (this.frameX < this.maxFrame)
        this.frameX++;
      else
        this.frameX = this.minFrame;
    }
  }
  draw() {
    ctx.fillStyle = "black";
    ctx.font = "30px Arial";
    ctx.fillText(Math.floor(this.health), this.x + 15, this.y + 30)
    ctx.drawImage(this.enemyType, this.frameX * this.spriteWidth, this.frameY, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height)
  }
}

function handleEnemies() {
  for (let i = 0; i < enemies.length; i++) {
    enemies[i].update();
    enemies[i].draw();
    if (enemies[i].x < 0) {
      gameOver = true;
    }
    if (enemies[i].health <= 0) {
      let gainedResources = enemies[i].maxHealth / 10;
      floatingMessages.push(new FloatingMessage("+" + gainedResources, enemies[i].x, enemies[i].y, 30, "black"))
      floatingMessages.push(new FloatingMessage("+" + gainedResources, 250, 50, 30, "gold"))
      numberOfResources += gainedResources;
      score += gainedResources
      const findThisIndex = enemyPositions.indexOf(enemies[i].y)
      enemyPositions.splice(findThisIndex, 1);
      enemies.splice(i, 1);
      i--;

    }
  }
  if (frame % enemiesInterval === 0) {
    let verticalPosition = Math.floor(Math.random() * 5 + 1) * cellsize;
    enemies.push(new Enemy(verticalPosition))
    enemyPositions.push(verticalPosition);
    if (enemiesInterval > 120)
      enemiesInterval -= 100;
    else if(enemiesInterval >40)
      enemiesInterval -= 10;
  }
}




//애니메이션 관리
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = 'blue';
  ctx.fillRect(0, 0, controlsBar.width, controlsBar.height);
  handleGameGrid();
  handleDefenders();
  handleResources();
  handleProjectiles();
  handleEnemies();
  handleGameStatus();
  handleFloatingMessage();
  frame++;

  if (!gameOver)
    requestAnimationFrame(animate);
}
animate();

//충돌감지
function collision(first, second) {
  if (!(first.x > second.x + second.width ||
    first.x + first.width < second.x ||
    first.y > second.y + second.height ||
    first.y + first.height < second.y
  )
  ) {
    return true;
  }
}
window.addEventListener('resize', () => {
  canvasPosition = canvas.getBoundingClientRect();
})
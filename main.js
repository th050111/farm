const cv = document.querySelector("#game");
const coverCv = document.querySelector("#cover");
const ctx = cv.getContext("2d");
const coverCtx = coverCv.getContext("2d");



//전역변수

const cellsize = 50;
const gameGrid = [];
const constructions = [];
const constructionType = "small";
const constructionTitle = "field";

const constkurctionTypes = {
  field: {
    types: {
      small: {
        size: {
          width: 1,
          height: 1,
        },
        cost: 100,
      },
      middle1: {
        size: {
          width: 2,
          height: 1,
        },
        cost: 200,
      },
      middle2: {
        size: {
          width: 1,
          height: 2,
        },
        cost: 200,
      },
      middle3: {
        size: {
          width: 2,
          height: 2,
        },
        cost: 200,
      },
      big1: {
        size: {
          width: 3,
          height: 3,
        },
        cost: 300,
      },
      big2: {
        size: {
          width: 4,
          height: 4,
        },
        cost: 400,
      },
    },
  },
};

// screen value

//캔버스 리스트
const canvasList = {
  game: {
    size: {
      width: 2500,
      height: 2500,
    },
    position: {
      x: 0,
      y: 0,
    },
  },
  cover: {
    size: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
    position: {
      x: 0,
      y: 0,
    },
  },
};

//화면설정
const screen = {
  size: {
    width: 960,
    height: 540,
  },
  position: {},
};

//마우스
const mouse = {
  x: 10,
  y: 10,
  width: 0.1,
  height: 0.1,
};

//mouse 이벤트
coverCv.addEventListener("mousemove", (e) => {
  //캔버스 내에서의 위치 저장
  mouse.x = e.x - canvasList.game.position.x;
  mouse.y = e.y - canvasList.game.position.y;
});
coverCv.addEventListener("mouseleave", () => {
  mouse.x = undefined;
  mouse.y = undefined;
});

//게임화면에서의 한 칸
class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = cellsize;
    this.height = cellsize;
  }
  //칸 그리기
  draw() {
    ctx.strokeStyle = "black";
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    if (mouse.x && mouse.y && collision(this, mouse)) {
      ctx.fillStyle = "grey";
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }
}

//그리드 배열 생성
function createGrid() {
  for (
    let y = cellsize;
    y < canvasList.game.size.height;
    y += cellsize
  ) {
    for (
      let x = 0;
      x < canvasList.game.size.width;
      x += cellsize
    ) {
      gameGrid.push(new Cell(x, y));
    }
  }
}
createGrid();

// 그리드 그리기

function handleGameGrid() {
  for (let i = 0; i < gameGrid.length; i++) {
    gameGrid[i].draw();
  }
}

function init() {
  screen.position = {
    x: window.innerWidth / 2 - screen.size.width / 2,
    y: window.innerHeight / 2 - screen.size.height / 2,
  };
}

init();

//게임화면 그리기
function handleGame() {
  cv.style.top = canvasList.game.position.y + "px";
  cv.style.left = canvasList.game.position.x + "px";
}

//실제 게임화면 그리기
function handleCover() {
  //background-cover
  coverCtx.fillStyle = "black"; // ìƒ‰ìƒ
  coverCtx.fillRect(
    canvasList.cover.position.x,
    canvasList.cover.position.y,
    canvasList.cover.size.width,
    canvasList.cover.size.height
  ); // ë„í˜•
  //screen
  coverCtx.clearRect(
    screen.position.x,
    screen.position.y,
    screen.size.width,
    screen.size.height
  );
}

const currentUi = "constructions";

const uiList = {
  constructions: {
    size: {
      height: screen.size.height * 0.2,
      width: screen.size.width,
    },
    position: {
      x: screen.position.x,
      y: screen.position.y + screen.size.height,
    },
    itemSize: {
      height: screen.size.height * 0.13,
      width: screen.size.width * 0.13,
    },
  },
};

function handleUi() {
  coverCtx.fillStyle = "red";
  coverCtx.fillRect(
    uiList[currentUi].position.x,
    uiList[currentUi].position.y,
    uiList[currentUi].size.width,
    uiList[currentUi].size.height
  );
}

class Construction {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.width = cellsize;
    this.height = cellsize;
    this.type = type;
  }
  draw() {
    if (this.type == "field") ctx.fillStyle = "blue";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

function handleConstructions() {
  for (let i = 0; i < constructions.length; i++) {
    constructions[i].draw();
  }
}

//애니메이션 관리
function animate() {
  ctx.clearRect(
    0,
    0,
    canvasList.game.size.width,
    canvasList.game.size.height
  );
  coverCtx.clearRect(
    0,
    0,
    canvasList.cover.size.width,
    canvasList.cover.size.height
  );
  handleCover();
  handleGame();
  handleGameGrid();
  handleConstructions();
  handleUi();

  requestAnimationFrame(animate);
}
animate();

//화면의 크기가 변경될 시
window.addEventListener("resize", () => {
  screen.position = {
    x: window.innerWidth / 2 - screen.size.width / 2,
    y: window.innerHeight / 2 - screen.size.height / 2,
  };
  canvasList.cover.size = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  uiList.constructions = {
    size: {
      height: screen.height * 0.2,
      width: screen.width,
    },
    position: {
      x: screen.position.x,
      y: screen.position.y + screen.size.height,
    },
  };
});

const howManyCanvasMove = 10;

//키보드에 따라 게임화면(game 캔버스)이동
window.addEventListener("keydown", (key) => {
  let directionX = 0;
  let directionY = 0;
  switch (key.code) {
    case "ArrowUp":
      directionY = -1;
      break;
    case "ArrowDown":
      directionY = 1;
      break;
    case "ArrowLeft":
      directionX = -1;
      break;
    case "ArrowRight":
      directionX = 1;
      break;
    default:
      directionX = directionY = 0;
  }
  canvasList.game.position.x -=
    howManyCanvasMove * directionX;
  canvasList.game.position.y -=
    howManyCanvasMove * directionY;
});

//충돌감지
function collision(first, second) {
  if (
    !(
      first.x > second.x + second.width ||
      first.x + first.width < second.x ||
      first.y > second.y + second.height ||
      first.y + first.height < second.y
    )
  ) {
    return true;
  }
}

function checkMousePos() {
  if (
    mouse.x <= screen.position.x + screen.size.width &&
    mouse.x >= screen.position.x &&
    mouse.y <= screen.position.y + screen.size.height &&
    mouse.y >= screen.position.y
  )
    return true;
}

function setUpField() {}

function clickConstruction(building) {
  switch (building.type) {
    case "field":
      setUpField();
      break;
  }
}

//클릭시 이벤트
coverCv.addEventListener("mousedown", () => {
  if (!checkMousePos()) return;
  //그리드 위치
  const gridPositionX = mouse.x - (mouse.x % cellsize);
  const gridPositionY = mouse.y - (mouse.y % cellsize);
  console.log(gridPositionX, gridPositionY);
  //이미 설치되어있는지 확인
  for (let i = 0; i < constructions.length; i++) {
    if (
      constructions[i].x === gridPositionX &&
      constructions[i].y === gridPositionY
    )
      clickConstruction(constructions[i]);
  }
  constructions.push(
    new Construction(
      gridPositionX,
      gridPositionY,
      constructionTitle
    )
  );
});

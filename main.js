const cv = document.querySelector("#game");
const coverCv = document.querySelector("#cover");
const ctx = cv.getContext("2d");
const coverCtx = coverCv.getContext("2d");

// screen value
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
const screen = {
  size: {
    width: 960,
    height: 540,
  },
  position: {},
};

function init() {
  screen.position = {
    x: window.innerWidth / 2 - screen.size.width / 2,
    y: window.innerHeight / 2 - screen.size.height / 2,
  };
}

init();

function handleGame() {
  cv.style.top = canvasList.game.position.y + "px";
  cv.style.left = canvasList.game.position.x + "px";
  ctx.fillStyle = "blue";
  ctx.fillRect(50, 50, 200, 200);
}

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

  requestAnimationFrame(animate);
}
animate();

window.addEventListener("resize", () => {
  screen.position = {
    x: window.innerWidth / 2 - screen.size.width / 2,
    y: window.innerHeight / 2 - screen.size.height / 2,
  };
  console.log(screen);
});

const howManyCanvasMove = 10;

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

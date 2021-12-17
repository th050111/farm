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
  position: {
    x: 250,
    y: 200,
  },
};

coverCtx.fillStyle = "#cc0000"; // ìƒ‰ìƒ
coverCtx.fillRect(350, 200, 1050, 630); // ë„í˜•

function draw() {
  //background-cover
  coverCtx.fillStyle = "black"; // ìƒ‰ìƒ
  coverCtx.fillRect(
    canvasList.cover.size.width,
    canvasList.cover.size.height,
    canvasList.cover.position.x,
    canvasList.cover.position.y
  ); // ë„í˜•
  //screen
  coverCtx.fillStyle = "#cc0000"; // ìƒ‰ìƒ
  coverCtx.fillRect(
    screen.position.x,
    screen.position.y,
    screen.size.width,
    screen.size.height
  ); // ë„í˜•

  cv.style.top = canvasList.game.position.x + "px";
  cv.style.left = canvasList.game.position.y + "px";
}

draw();

// window.addEventListener("resize", () => {
//   canvasList.cover.size = {
//     width: window.innerWidth,
//     height: window.innerHeight,
//   };
//   coverCv.width = canvasList.cover.size.width;
//   coverCv.height = canvasList.cover.size.height
// });

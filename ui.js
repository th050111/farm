const uiContainer = document.querySelector(".ui-container");
const titleContainer = document.querySelector(
  ".title-container"
);
const titles = document.querySelectorAll(".title");
const elList = document.querySelector("element-list");
const elements = document.querySelectorAll("el-container");

function setUi() {
  uiContainer.style.width = screen.size.width + "px";
  uiContainer.style.height =
    screen.size.height * 0.15 + "px";
}

setUi();

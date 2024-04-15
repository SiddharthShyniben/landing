import { $, $$, classify, style } from "./dime.js";
import { lerp } from "./util.js";

const mainElement = $("#moving");
const toolbar = $(".toolbar");
const tooltip = $("#tooltip");

const nav = $("#moving nav");
const navMain = $("#moving nav .main");
const buttons = $$("#moving button");
const heading = $("#moving h1");
const paras = $$("#moving p");

const fullWidth = window.innerWidth,
  fullHeight = window.innerHeight;

style(mainElement, `width: ${fullWidth}px; height: ${fullHeight}px`);
compute();

window.addEventListener("scroll", compute);
window.addEventListener("resize", compute);

function compute() {
  const frac = window.scrollY / window.innerHeight;
  const scale = frac > 1 ? 0.5 : lerp(1, 0.5, frac);

  if (scale == 0.5) {
    classify(mainElement, "+done");
    $$(".done .boxed").forEach((el) => {
      el.setAttribute("contenteditable", true);
      dragElement(el);
    });
    classify(tooltip, "+visible");
  } else {
    $$("[contenteditable=true]").forEach((el) =>
      el.setAttribute("contenteditable", false),
    );
    classify(mainElement, "-done");
    classify(tooltip, "-visible");
  }

  const aspect = frac > 1 ? 16 / 9 : lerp(fullWidth / fullHeight, 16 / 9, frac);

  let width, height;

  if (fullHeight > fullWidth) {
    width = fullWidth * scale;
    height = width / aspect;
  } else {
    height = fullHeight * scale;
    width = height * aspect;
  }

  const maxTopOffset = (window.innerHeight - height) / 2;
  const maxLeftOffset = (window.innerWidth - width) / 2;
  const top = frac > 1 ? maxTopOffset : lerp(0, maxTopOffset, frac);
  const left = frac > 1 ? maxLeftOffset : lerp(0, maxLeftOffset, frac);

  style(
    mainElement,
    `top: ${top + (frac > 1 ? (1 - frac) * window.innerHeight : 0)}px; left: ${left}px; height: ${height}px; width: ${width}px`,
  );

  style(
    toolbar,
    `width: ${width}px; top: ${top - 40 + (frac > 1 ? (1 - frac) * window.innerHeight : 0)}px; left: ${left}px`,
  );
  style(
    tooltip,
    `top: ${top - 80 + (frac > 1 ? (1 - frac) * window.innerHeight : 0)}px; left: ${left}px`,
  );

  const rem = frac > 1 ? 8 : lerp(16, 8, frac);
  const r = (n) => `${n * rem}px`;

  style(nav, `padding: ${r(3)} ${r(4)}`);
  style(navMain, `font-size: ${r(2)}`);
  for (const button of buttons)
    style(button, `padding: ${r(0.5)} ${r(1)}; font-size: ${r(1)}`);
  style(heading, `font-size: ${r(5)}`);
  for (const para of paras)
    style(para, `font-size: ${r(1.5)}; margin-top: ${r(2)}`);
}

function dragElement(el) {
  let xPos = 0;
  let yPos = 0;

  el.addEventListener("mousedown", dragMouseDown);

  function dragMouseDown(event) {
    if (el !== event.target) return;
    event.preventDefault();
    document.addEventListener("mouseup", closeDragElement);
    document.addEventListener("mousemove", elementDrag);
  }

  function elementDrag(event) {
    event.preventDefault();
    xPos += event.movementX;
    yPos += event.movementY;
    el.style.transform = `translate(${xPos}px, ${yPos}px)`;
  }

  function closeDragElement() {
    document.removeEventListener("mouseup", closeDragElement);
    document.removeEventListener("mousemove", elementDrag);
  }
}

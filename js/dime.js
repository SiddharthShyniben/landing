export const $ = (...x) => document.querySelector(...x);
export const $$ = (...x) => document.querySelectorAll(...x);
export const classify = (a, b) =>
  b.split` `
    .map((c) =>
      c[0] == "-"
        ? ["remove", c.slice(1)]
        : ["add", c[0] == "+" ? c.slice(1) : c],
    )
    .map(([d, e]) => a.classList[d](e));

export const style = (a, b) =>
  b.split`;`
    .map((c) => c.split`:`)
    .map(([x, y]) => (a.style[x.trim()] = y.trim()));

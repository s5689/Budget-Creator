import { loremArray } from "./db";
let k;

export default function lorem() {
  for (k = 0; k < 10; k++) {
    document.body.innerHTML += `${loremArray[k]} `;
  }

  document.querySelector("html").addEventListener("click", setLorem);
  document.querySelector("html").addEventListener("contextmenu", setLorem);
}

function setLorem(e) {
  e.preventDefault();
  document.body.innerHTML += `${loremArray[k]} `;

  k++;

  if (k >= loremArray.length) {
    k = 0;
  }
}

import build from "./js/build";
import events from "./js/events";
import lorem from "./js/lorem";

const bootkey = JSON.parse(localStorage.getItem("budgetCreatorSussyKey"));
document.body.style.opacity = 1;

if (bootkey) {
  build();
  events();
} else {
  document.body.innerHTML = "";
  document.body.style.userSelect = "none";
  document.body.style.fontSize = "xx-large";
  document.body.style.margin = "2rem";

  lorem();

  window.BCSK = () => {
    localStorage.setItem("budgetCreatorSussyKey", "true");
    window.location.reload();
  };
}

/* Pizzen Modal */
let pizzen_open = document.querySelectorAll(".pizzen_open");
let pizzen_close = document.querySelectorAll(".pizzen_close");
let pizzen_container = document.querySelectorAll(".pizzen_container");

for (var i = 0; i < pizzen_close.length; i++) {
  pizzen_open[i].addEventListener("click", () => {
    pizzen_container[i].classList.add("pizza_show");
  });
}

for (var i = 0; i < pizzen_close.length; i++) {}
pizzen_close[i].addEventListener("click", () => {
  pizzen_container[i].classList.remove("pizza_show");
});

for (var i = 0; i < pizzen_close.length; i++) {}
window.addEventListener("mouseup", (event) => {
  if (event.target == pizzen_container[i]) {
    pizzen_container[i].classList.remove("pizza_show");
  }
});

/* Drinks Modal */
const drinks_open = document.querySelector(".drinks_open");
const drinks_close = document.querySelector(".drinks_close");
const drinks_container = document.querySelector(".drinks_container");

drinks_open.addEventListener("click", () => {
  drinks_container.classList.add("drink_show");
});

drinks_close.addEventListener("click", () => {
  drinks_container.classList.remove("drink_show");
});

window.addEventListener("mouseup", (event) => {
  if (event.target == drinks_container) {
    drinks_container.classList.remove("drink_show");
  }
});

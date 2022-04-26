/* Magerita Modal */
const magerita_open = document.querySelector(".Magerita_open");
const magerita_close = document.querySelector(".Magerita_close");
const magerita_container = document.querySelector(".Magerita_container");

magerita_open.addEventListener("click", () => {
  magerita_container.classList.add("pizza_show");
});

magerita_close.addEventListener("click", () => {
  magerita_container.classList.remove("pizza_show");
});

window.addEventListener("mouseup", (event) => {
  if (event.target == magerita_container) {
    magerita_container.classList.remove("pizza_show");
  }
});

/* Salami Modal */
const salami_open = document.querySelector(".Salami_open");
const salami_close = document.querySelector(".Salami_close");
const salami_container = document.querySelector(".Salami_container");

salami_open.addEventListener("click", () => {
  salami_container.classList.add("pizza_show");
});

salami_close.addEventListener("click", () => {
  salami_container.classList.remove("pizza_show");
});

window.addEventListener("mouseup", (event) => {
  if (event.target == salami_container) {
    salami_container.classList.remove("pizza_show");
  }
});

/* Schinken Modal */
const schinken_open = document.querySelector(".Schinken_open");
const schinken_close = document.querySelector(".Schinken_close");
const schinken_container = document.querySelector(".Schinken_container");

schinken_open.addEventListener("click", () => {
  schinken_container.classList.add("pizza_show");
});

schinken_close.addEventListener("click", () => {
  schinken_container.classList.remove("pizza_show");
});

window.addEventListener("mouseup", (event) => {
  if (event.target == schinken_container) {
    schinken_container.classList.remove("pizza_show");
  }
});

/* Thunfisch Modal */
const thunfisch_open = document.querySelector(".Thunfisch_open");
const thunfisch_close = document.querySelector(".Thunfisch_close");
const thunfisch_container = document.querySelector(".Thunfisch_container");

thunfisch_open.addEventListener("click", () => {
  thunfisch_container.classList.add("pizza_show");
});

thunfisch_close.addEventListener("click", () => {
  thunfisch_container.classList.remove("pizza_show");
});

window.addEventListener("mouseup", (event) => {
  if (event.target == thunfisch_container) {
    thunfisch_container.classList.remove("pizza_show");
  }
});

/* Pizzen Modal
for (var i = 0; i < pizzen.length; i++) {
  window[pizzen[i].name + "_open"] = document.querySelector(
    `.${pizzen[i].name}_open`
  );

  console.log(window[pizzen[i].name + "_open"]);
  window[pizzen[i].name + "_close"] = document.querySelector(
    `.${pizzen[i].name}_close`
  );
  window[pizzen[i].name + "_container"] = document.querySelector(
    `.${pizzen[i].name}_container`
  );

  window[pizzen[i].name + "_open"].addEventListener("click", () => {
    window[pizzen[i].name + "_container"].classList.add("pizza_show");
  });

  window[pizzen[i].name + "_close"].addEventListener("click", () => {
    window[pizzen[i].name + "_container"].classList.remove("pizza_show");
  });

  window.addEventListener("mouseup", (event) => {
    if (event.target == window[pizzen[i].name + "_container"]) {
      window[pizzen[i].name + "_container"].classList.remove("pizza_show");
    }
  });
} */

const open = document.querySelector(".open");
const close = document.querySelector(".close");
const modal_container = document.querySelector(".modal-container");

open.addEventListener("click", () => {
  modal_container.classList.add("show");
});

close.addEventListener("click", () => {
  modal_container.classList.remove("show");
});

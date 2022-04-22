// Warenkorb Modal
const warenkorb_open = document.querySelector(".warenkorb_open");
const warenkorb_close = document.querySelector(".warenkorb_close");
const warenkorb_container = document.querySelector(".warenkorb_container");
const warenkorb = document.querySelector(".warenkorb");

warenkorb_open.addEventListener("click", () => {
  warenkorb_container.classList.add("warenkorb_show");
});

warenkorb_close.addEventListener("click", () => {
  warenkorb_container.classList.remove("warenkorb_show");
});

window.addEventListener("mouseup", (event) => {
  if (event.target != warenkorb_container) {
    warenkorb_container.classList.remove("warenkorb_show");
  }
});

// MeinAccount Modal
const mein_account_open = document.querySelector(".mein_account_open");
const mein_account_close = document.querySelector(".mein_account_close");
const mein_account_container = document.querySelector(
  ".mein_account_container"
);
const mein_account = document.querySelector(".mein_account");

mein_account_open.addEventListener("click", () => {
  mein_account_container.classList.add("mein_account_show");
});

mein_account_close.addEventListener("click", () => {
  mein_account_container.classList.remove("mein_account_show");
});

window.addEventListener("mouseup", (event) => {
  if (event.target == mein_account_container) {
    mein_account_container.classList.remove("mein_account_show");
  }
});

// Register Modal
const register_open = document.querySelector(".register_open");
const register_close = document.querySelector(".register_close");
const register_container = document.querySelector(".register_container");
const register = document.querySelector(".register");

register_open.addEventListener("click", () => {
  mein_account_container.classList.remove("mein_account_show");
  register_container.classList.add("register_show");
});

register_close.addEventListener("click", () => {
  register_container.classList.remove("register_show");
});

window.addEventListener("mouseup", (event) => {
  if (event.target == register_container) {
    register_container.classList.remove("register_show");
  }
});

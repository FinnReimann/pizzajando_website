// Warenkorb Modal
const openWarenkorb = document.querySelector(".openWarenkorb");
const closeWarenkorb = document.querySelector(".closeWarenkorb");
const warenkorbContainer = document.querySelector(".warenkorbContainer");

openWarenkorb.addEventListener("click", () => {
  warenkorbContainer.classList.add("showWarenkorb");
});

closeWarenkorb.addEventListener("click", () => {
  warenkorbContainer.classList.remove("showWarenkorb");
});

// MeinAccount Modal
const openMeinAccount = document.querySelector(".openMeinAccount");
const closeMeinAccount = document.querySelector(".closeMeinAccount");
const meinAccountContainer = document.querySelector(".meinAccountContainer");

openMeinAccount.addEventListener("click", () => {
  meinAccountContainer.classList.add("showMeinAccount");
});

closeMeinAccount.addEventListener("click", () => {
  meinAccountContainer.classList.remove("showMeinAccount");
});

/* Register Modal
const openRegister = document.querySelector(".openRegister");
const closeRegister = document.querySelector(".closeRegister");
const registerContainer = document.querySelector(".registerContainer");

openRegister.addEventListener("click", () => {
  registerContainer.classList.add("showRegister");
});

closeRegister.addEventListener("click", () => {
  registerContainer.classList.remove("showRegister");
}); */

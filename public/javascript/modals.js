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

// Ware Modal
const openWare = document.querySelector(".openWare");
const closeWare = document.querySelector(".closeWare");
const wareContainer = document.querySelector(".wareContainer");

openWare.addEventListener("click", () => {
  wareContainer.classList.add("showWare");
});

closeWare.addEventListener("click", () => {
  wareContainer.classList.remove("showWare");
});

// Modals

/* Pizzen Modal */
const pizzen_open = document.querySelectorAll(".pizzen_open");
const pizzen_close = document.querySelectorAll(".pizzen_close");
const pizzen_container = document.querySelectorAll(".pizzen_container");

for (let i = 0; i < pizzen_close.length; i++) {
  pizzen_open[i].addEventListener("click", () => {
    pizzen_container[i].classList.add("pizza_show");
  });
  pizzen_close[i].addEventListener("click", () => {
    pizzen_container[i].classList.remove("pizza_show");
  });
  window.addEventListener("mouseup", (event) => {
    if (event.target == pizzen_container[i]) {
      pizzen_container[i].classList.remove("pizza_show");
    }
  });
}

/* Drinks Modal */
const drinks_open = document.querySelectorAll(".drinks_open");
const drinks_close = document.querySelectorAll(".drinks_close");
const drinks_container = document.querySelectorAll(".drinks_container");

for (let i = 0; i < drinks_close.length; i++) {
  drinks_open[i].addEventListener("click", () => {
    drinks_container[i].classList.add("drink_show");
  });

  drinks_close[i].addEventListener("click", () => {
    drinks_container[i].classList.remove("drink_show");
  });

  window.addEventListener("mouseup", (event) => {
    if (event.target == drinks_container[i]) {
      drinks_container[i].classList.remove("drink_show");
    }
  });
}

// nicht Modals

/* Pizzen Hinzufügen */
const pizzen_param = document.querySelectorAll(".pizzen_add");

console.log(pizzen_param);

for (let i = 0; i < pizzen_param.length; i++) {
  pizzen_param[i].addEventListener("click", () => {
    cartNumbers();
  });
}

function onLoadCartNumbers() {
  let productNumbers = localStorage.getItem("cartNumbers");
  if (productNumbers) {
    document.querySelector(".cart span").textContent = productNumbers;
  }
}

function cartNumbers() {
  let productNumbers = localStorage.getItem("cartNumbers");

  productNumbers = parseInt(productNumbers);

  if (productNumbers) {
    localStorage.setItem("cartNumbers", productNumbers + 1);
    document.querySelector(".warenkorb_open span").textContent =
      productNumbers + 1;
  } else {
    localStorage.setItem("cartNumbers", 1);
    document.querySelector(".cart span").textContent = 1;
  }
}

onLoadCartNumbers();

// Modals

/* Pizzen Modal */
const pizzen_open = document.querySelectorAll(".pizzen_open");
const pizzen_close = document.querySelectorAll(".pizzen_close");
const pizzen_container = document.querySelectorAll(".pizzen_container");
const pizzen = document.querySelectorAll(".pizzen");

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
const drinks = document.querySelectorAll(".drinks");

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

// Warenkorb Modal
const warenkorb_open = document.querySelector(".warenkorb_open");
const warenkorb_close = document.querySelector(".warenkorb_close");
const warenkorb_container = document.querySelector(".warenkorb_container");

warenkorb_open.addEventListener("click", () => {
  warenkorb_container.classList.add("warenkorb_show");
});

warenkorb_close.addEventListener("click", () => {
  warenkorb_container.classList.remove("warenkorb_show");
});

window.addEventListener("mouseup", (event) => {
  if (event.target == warenkorb_container) {
    warenkorb_container.classList.remove("warenkorb_show");
  }
});

// Warenkorb Funktionen

/* Produkte Definieren */
let products = [];

/* Pizzen zu Produkten hinzufügen */
const pizzen_name = document.querySelectorAll(".pizzen_name");
const pizzen_preis = document.querySelectorAll(".pizzen_preis");
const pizzen_zutaten = document.querySelectorAll(".pizzen_zutaten");

for (let i = 0; i < pizzen.length; i++) {
  products[i] = {
    id: i,
    name: pizzen_name[i].textContent,
    zutaten: pizzen_zutaten[i].textContent,
    price: parseFloat(pizzen_preis[i].textContent),
    inCart: 0,
  };
}

/* Drinks zu Produkten hinzufügen */
const drinks_name = document.querySelectorAll(".drinks_name");
const drinks_preis = document.querySelectorAll(".drinks_preis");

for (let i = 0; i < drinks.length; i++) {
  products[i + pizzen.length] = {
    id: i + pizzen.length,
    name: drinks_name[i].textContent,
    price: parseFloat(drinks_preis[i].textContent),
    inCart: 0,
  };
}

/* Produkte zum Warenkorb Hinzufügen */
const product_add = document.querySelectorAll(".product_add");

for (let i = 0; i < product_add.length; i++) {
  product_add[i].addEventListener("click", () => {
    cartNumbers(products[i]);
    totalCost(products[i]);
    displayCart();
  });
}

/* Warenkorb Nummer holen Funktion */
function onLoadCartNumbers() {
  let productNumbers = localStorage.getItem("cartNumbers");
  if (productNumbers) {
    document.querySelector(".cart span").textContent = productNumbers;
  }
}

/* Warenkorb Nummer setzen Funktion */
function cartNumbers(product) {
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

  setItems(product);
}

/* Waren in den Warenkorb Funktion */
function setItems(product) {
  let cartItems = localStorage.getItem("productsInCart");
  cartItems = JSON.parse(cartItems);

  if (cartItems != null) {
    if (cartItems[product.id] == undefined) {
      cartItems = {
        ...cartItems,
        [product.id]: product,
      };
    }
    cartItems[product.id].inCart += 1;
  } else {
    product.inCart = 1;
    cartItems = {
      [product.id]: product,
    };
  }

  localStorage.setItem("productsInCart", JSON.stringify(cartItems));
}

/* Kosten Berechnung Funktion */
function totalCost(product) {
  let cartCost = localStorage.getItem("totalCost");

  if (cartCost != null) {
    cartCost = parseFloat(cartCost);
    localStorage.setItem("totalCost", cartCost + product.price);
  } else {
    localStorage.setItem("totalCost", product.price);
  }
}

/* Display Warenkorb */
function displayCart() {
  let cartItems = localStorage.getItem("productsInCart");
  cartItems = JSON.parse(cartItems);
  let productContainer = document.querySelector(".products");
  let cartCost = localStorage.getItem("totalCost");

  if (cartItems && productContainer) {
    productContainer.innerHTML = "";
    Object.values(cartItems).map((item) => {
      productContainer.innerHTML += `
      <div class="product">
        <span>${item.name}</span>
      </div>
      <div class="price">€${item.price}</div>
      <div class="quantity">
        <span>${item.inCart}</span>
      </div>
      <div class="total">
        €${(item.inCart * item.price).toFixed(2)}
      </div>
      `;
    });

    productContainer.innerHTML += `
      <div class="basket_total_container">
        <h4 class="basket_total_title">
          Basket Total
        </h4>
        <h4 class="basket_total">
          €${(cartCost * 1).toFixed(2)}
        </h4>
      </div>
    `;
  }
}

/* Funktionsaufruf beim Laden der Seite */
onLoadCartNumbers();
displayCart();

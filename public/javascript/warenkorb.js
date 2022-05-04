/* Produkte Definieren */
let products = [];

/* Produkt Variablen */
const drinks = document.querySelectorAll(".drinks");
const pizzen = document.querySelectorAll(".pizzen");

/* Pizzen zu Produkten hinzufügen */
const pizzen_name = document.querySelectorAll(".pizzen_name");
const pizzen_preis = document.querySelectorAll(".pizzen_preis");
const pizzen_zutaten = document.querySelectorAll(".pizzen_zutaten");

// für jede Pizza die im pizzen-div vorhanden ist
for (let i = 0; i < pizzen.length; i++) {
  products[i] = {
    id: i,
    name: pizzen_name[i].textContent,
    ingredients: pizzen_zutaten[i].textContent,
    price: parseFloat(pizzen_preis[i].textContent),
    inCart: 0,
  };
}

/* Drinks zu Produkten hinzufügen */
const drinks_name = document.querySelectorAll(".drinks_name");
const drinks_preis = document.querySelectorAll(".drinks_preis");

// für jedes Getränk die im drinks-div vorhanden ist
for (let i = 0; i < drinks.length; i++) {
  products[i + pizzen.length] = {
    id: i + pizzen.length,
    name: drinks_name[i].textContent,
    ingredients: "",
    price: parseFloat(drinks_preis[i].textContent),
    inCart: 0,
  };
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
    document.querySelector(".cart_items").textContent = productNumbers + 1;
  } else {
    localStorage.setItem("cartNumbers", 1);
    document.querySelector(".cart_items").textContent = 1;
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
        <i class="material-icons" id="product_delete">delete</i>
        <span>${item.name}</span>
      </div>
      <div class="price">€${item.price}</div>
      <div class="quantity">
        <i class="material-icons" id="product_increase">expand_less</i>
        <span>${item.inCart}</span>
        <i class="material-icons" id="product_decrease">expand_more</i>
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

/* Produkte zum Warenkorb Hinzufügen */
const product_add = document.querySelectorAll("#product_add");

// Add Icon für jedes Produkt in der Speisekarte
for (let i = 0; i < product_add.length; i++) {
  // addEventListener "Click"
  product_add[i].addEventListener("click", () => {
    cartNumbers(products[i]); // Warenkorb-Nummer setzten
    totalCost(products[i]); // Gesamtkosten setzten

    // Funktionen aufrufen
    displayCart();
    productIncrease();
    productDecrease();
    productRemove();
  });
}

/* Waren aus Warenkorb löschen */
function productRemove() {
  const product_delete = document.querySelectorAll("#product_delete");

  // Delete Icon für jedes Produkt das im Warenkorb angezeigt wird
  for (let i = 0; i < product_delete.length; i++) {
    let cartItems = localStorage.getItem("productsInCart");
    cartItems = JSON.parse(cartItems);
    let index = Object.values(cartItems)[i].id;

    // addEventListener "Click"
    product_delete[i].addEventListener("click", () => {
      let productNumbers = localStorage.getItem("cartNumbers");
      productNumbers = parseInt(productNumbers);
      localStorage.setItem(
        "cartNumbers",
        productNumbers - cartItems[index].inCart
      );

      let cartCost = localStorage.getItem("totalCost");
      cartCost = parseFloat(cartCost);
      cartCost = cartCost - cartItems[index].price * cartItems[index].inCart;
      if (cartCost < 0) {
        cartCost = 0;
      }
      localStorage.setItem("totalCost", cartCost);

      products[index].inCart = 0;
      cartItems[index].inCart = 0;
      delete cartItems[index];
      localStorage.setItem("productsInCart", JSON.stringify(cartItems));

      // Funktionen aufrufen
      onLoadCartNumbers();
      displayCart();
      productIncrease();
      productDecrease();
      productRemove();
    });
  }
}

/* Ware erhöhen */
function productIncrease() {
  const product_increase = document.querySelectorAll("#product_increase");

  // Increase Icon für jedes Produkt das im Warenkorb angezeigt wird
  for (let i = 0; i < product_increase.length; i++) {
    let cartItems = localStorage.getItem("productsInCart");
    cartItems = JSON.parse(cartItems);
    let index = Object.values(cartItems)[i].id;

    // addEventListener "Click"
    product_increase[i].addEventListener("click", () => {
      cartNumbers(products[index]);
      totalCost(products[index]);

      // Funktionen aufrufen
      onLoadCartNumbers();
      displayCart();
      productIncrease();
      productDecrease();
      productRemove();
    });
  }
}

/* Ware vermindern */
function productDecrease() {
  const product_decrease = document.querySelectorAll("#product_decrease");

  // Decrease Icon für jedes Produkt das im Warenkorb angezeigt wird
  for (let i = 0; i < product_decrease.length; i++) {
    let cartItems = localStorage.getItem("productsInCart");
    cartItems = JSON.parse(cartItems);
    let index = Object.values(cartItems)[i].id;

    // addEventListener "Click"
    product_decrease[i].addEventListener("click", () => {
      let productNumbers = localStorage.getItem("cartNumbers");
      productNumbers = parseInt(productNumbers);

      localStorage.setItem("cartNumbers", productNumbers - 1);

      let cartCost = localStorage.getItem("totalCost");
      cartCost = parseFloat(cartCost);
      cartCost = cartCost - cartItems[index].price;
      if (cartCost < 0) {
        cartCost = 0;
      }
      localStorage.setItem("totalCost", cartCost);

      cartItems[index].inCart -= 1;
      if (cartItems[index].inCart <= 0) {
        products[index].inCart = 0;
        delete cartItems[index];
      }

      localStorage.setItem("productsInCart", JSON.stringify(cartItems));

      // Funktionen aufrufen
      onLoadCartNumbers();
      displayCart();
      productIncrease();
      productDecrease();
      productRemove();
    });
  }
}

function productDecreaseFunc(index, cartItems) {}

/* Funktionsaufruf beim Laden der Seite */
onLoadCartNumbers();
displayCart();
productIncrease();
productDecrease();
productRemove();

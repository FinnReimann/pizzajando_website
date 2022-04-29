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

// Warenkorb Nummer
function onLoadCartNumbers() {
  let productNumbers = localStorage.getItem("cartNumbers");
  if (productNumbers) {
    document.querySelector(".cart span").textContent = productNumbers;
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
        <div class="price">€${item.price},00</div>
        <div class="quantity">
          <span>${item.inCart}</span>
        </div>
        <div class="total">
          €${item.inCart * item.price},00
        </div>
        `;
    });

    productContainer.innerHTML += `
        <div class="basket_total_container">
          <h4 class="basket_total_title">
            Basket Total
          </h4>
          <h4 class="basket_total">
            €${cartCost},00
          </h4>
        </div>
      `;
  }
}

/* Funktionsaufruf beim Laden der Seite */
onLoadCartNumbers();
displayCart();

/* Display Warenkorb */
function displayCheckout() {
  let cartItems = localStorage.getItem("productsInCart");
  cartItems = JSON.parse(cartItems);
  let productContainer = document.querySelector(".kasse_products");
  let cartCost = localStorage.getItem("totalCost");

  if (cartItems && productContainer) {
    productContainer.innerHTML = "";
    Object.values(cartItems).map((item) => {
      productContainer.innerHTML += `
        <div class="kasse_product">
          <span>${item.name}</span>
        </div>
        <div class="kasse_quantity">
          <span>${item.inCart}</span>
        </div>
        <div class="kasse_total">
          €${(item.inCart * item.price).toFixed(2)}
        </div>
        `;
    });

    // Total Cost Anzeige
    productContainer.innerHTML += `
        <div class="basket_total_container">
          <h4 class="basket_total_title">
            Total
          </h4>
          <h4 class="basket_total">
            €${(cartCost * 1).toFixed(2)}
          </h4>
        </div>
      `;
  }
}

/* Produkte Bestellen */
const products_order = document.querySelector(".products_order");

products_order.addEventListener("click", () => {
  let data = localStorage.getItem("productsInCart");
  data = JSON.parse(data);

  if (data != null && session) {
    fetch("/products_ordered", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((res) => {
      console.log("Request complete! response:", res);
      localStorage.clear();
      displayCheckout();
    });
  } else {
    console.log("Nix im Warenkorb");
  }
});

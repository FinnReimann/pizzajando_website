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
        <button class="product_delete">x</button>
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

/* Waren aus Warenkorb löschen */
function productRemove() {
  const product_delete = document.querySelectorAll(".product_delete");

  for (let i = 0; i < product_delete.length; i++) {
    let cartItems = localStorage.getItem("productsInCart");
    cartItems = JSON.parse(cartItems);
    let index = Object.values(cartItems)[i].id;

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

      console.log(products[Object.values(cartItems)[i].id]);
      products[index].inCart = 0;
      cartItems[index].inCart = 0;
      delete cartItems[index];
      localStorage.setItem("productsInCart", JSON.stringify(cartItems));

      onLoadCartNumbers();
      displayCart();
      productRemove();
    });
  }
}

/* Funktionsaufruf beim Laden der Seite */
onLoadCartNumbers();
displayCart();
productRemove();

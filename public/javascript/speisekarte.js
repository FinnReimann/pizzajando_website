/* Produkte Definieren */
let products = [];

/* Produkt Variablen */
const drinks = document.querySelectorAll(".drinks");
const pizzen = document.querySelectorAll(".pizzen");

/* Pizzen zu Produkten hinzufügen */
const pizzen_name = document.querySelectorAll(".pizzen_name");
const pizzen_preis = document.querySelectorAll(".pizzen_preis");
const pizzen_zutaten = document.querySelectorAll(".pizzen_zutaten");

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

for (let i = 0; i < drinks.length; i++) {
  products[i + pizzen.length] = {
    id: i + pizzen.length,
    name: drinks_name[i].textContent,
    ingredients: "",
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
    productRemove();
  });
}

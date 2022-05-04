/* Warenkorb Modal */
if (document.querySelector("#warenkorb_open")) {
  const warenkorb_open = document.querySelector("#warenkorb_open");
  const warenkorb_close = document.querySelector("#warenkorb_close");
  const warenkorb_container = document.querySelector(".warenkorb_container");

  warenkorb_open.addEventListener("click", () => {
    warenkorb_container.classList.add("show");
  });

  warenkorb_close.addEventListener("click", () => {
    warenkorb_container.classList.remove("show");
  });

  window.addEventListener("mouseup", (event) => {
    if (event.target == warenkorb_container) {
      warenkorb_container.classList.remove("show");
    }
  });
}

/* MeinAccount Modal */
if (document.querySelector("#mein_account_open")) {
  const mein_account_open = document.querySelector("#mein_account_open");
  const mein_account_close = document.querySelector("#mein_account_close");
  const mein_account_container = document.querySelector(
    ".mein_account_container"
  );

  mein_account_open.addEventListener("click", () => {
    mein_account_container.classList.add("show");
  });

  mein_account_close.addEventListener("click", () => {
    mein_account_container.classList.remove("show");
  });

  window.addEventListener("mouseup", (event) => {
    if (event.target == mein_account_container) {
      mein_account_container.classList.remove("show");
    }
  });
}

/* Register Modal */
if (document.querySelector(".register_open")) {
  const register_open = document.querySelector(".register_open");
  const register_close = document.querySelector("#register_close");
  const register_container = document.querySelector(".register_container");

  register_open.addEventListener("click", () => {
    mein_account_container.classList.remove("show");
    register_container.classList.add("show");
  });

  register_close.addEventListener("click", () => {
    register_container.classList.remove("show");
  });

  window.addEventListener("mouseup", (event) => {
    if (event.target == register_container) {
      register_container.classList.remove("show");
    }
  });
}

/* Meine Bestellungen Modal */
if (document.querySelector(".meine_bestellungen_open")) {
  const meine_bestellungen_open = document.querySelector(
    ".meine_bestellungen_open"
  );
  const meine_bestellungen_close = document.querySelector(
    "#meine_bestellungen_close"
  );
  const meine_bestellungen_container = document.querySelector(
    ".meine_bestellungen_container"
  );

  meine_bestellungen_open.addEventListener("click", () => {
    mein_account_container.classList.remove("show");
    meine_bestellungen_container.classList.add("show");
  });

  meine_bestellungen_close.addEventListener("click", () => {
    meine_bestellungen_container.classList.remove("show");
  });

  window.addEventListener("mouseup", (event) => {
    if (event.target == meine_bestellungen_container) {
      meine_bestellungen_container.classList.remove("show");
    }
  });
}

/* Pizzen Modal */
if (document.querySelectorAll(".pizzen_open")) {
  const pizzen_open = document.querySelectorAll(".pizzen_open");
  const pizzen_close = document.querySelectorAll("#pizzen_close");
  const pizzen_container = document.querySelectorAll(".pizzen_container");

  for (let i = 0; i < pizzen_open.length; i++) {
    pizzen_open[i].addEventListener("click", () => {
      pizzen_container[i].classList.add("show");
    });
    pizzen_close[i].addEventListener("click", () => {
      pizzen_container[i].classList.remove("show");
    });
    window.addEventListener("mouseup", (event) => {
      if (event.target == pizzen_container[i]) {
        pizzen_container[i].classList.remove("show");
      }
    });
  }
}

/* Drinks Modal */
if (document.querySelectorAll(".drinks_open")) {
  const drinks_open = document.querySelectorAll(".drinks_open");
  const drinks_close = document.querySelectorAll("#drinks_close");
  const drinks_container = document.querySelectorAll(".drinks_container");

  for (let i = 0; i < drinks_open.length; i++) {
    drinks_open[i].addEventListener("click", () => {
      drinks_container[i].classList.add("show");
    });

    drinks_close[i].addEventListener("click", () => {
      drinks_container[i].classList.remove("show");
    });

    window.addEventListener("mouseup", (event) => {
      if (event.target == drinks_container[i]) {
        drinks_container[i].classList.remove("how");
      }
    });
  }
}

/* Bestellinformationen Modal */
if (document.querySelector(".bestellinformationen_open")) {
  const bestellinformationen_open = document.querySelector(
    ".bestellinformationen_open"
  );
  const bestellinformationen_close = document.querySelector(
    "#bestellinformationen_close"
  );
  const bestellinformationen_container = document.querySelector(
    ".bestellinformationen_container"
  );

  bestellinformationen_open.addEventListener("click", () => {
    warenkorb_container.classList.remove("warenkorb_show");
    bestellinformationen_container.classList.add("show");
  });

  bestellinformationen_close.addEventListener("click", () => {
    bestellinformationen_container.classList.remove("show");
  });

  window.addEventListener("mouseup", (event) => {
    if (event.target == bestellinformationen_container) {
      bestellinformationen_container.classList.remove("show");
    }
  });
}

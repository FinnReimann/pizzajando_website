/* Express initialisieren */
const express = require("express");
const app = express();
app.use(express.json());

/* Validator Initialisieren */
const validator = require("email-validator");

/* Datenbank initialisieren */
const DATABASE = "daten.db";
const db = require("better-sqlite3")(DATABASE);

/* Bcrypt initialisieren */
const bcrypt = require("bcrypt");

/* EJS initialisieren */
app.engine("ejs", require("ejs").__express);
app.set("view engine", "ejs");

/* Session initialisieren */
const session = require("express-session");
app.use(
  session({
    cookie: {
      maxAge: 1000 * 60, // 1 Hour
      sameSite: true,
    },
    secret: "p4ssw0rtv3rschlu3ssl3r",
    saveUninitialized: false,
    resave: false,
  })
);

/* Public Freigeben */
app.use(express.static(__dirname + "/public"));

/* Body-Parser initialisieren */
app.use(express.urlencoded({ extended: true }));

/* Server starten  */
app.listen(3000, function () {
  console.log("listening to 3000");
});

/* Variablen */
const pizzen_params = db.prepare("SELECT * FROM pizzen").all();
const drinks_params = db.prepare("SELECT * FROM drinks").all();
let bestellungen_params = db
  .prepare("SELECT * FROM bestellungen WHERE user=?")
  .all("");

/* getRequest startseite */
app.get("/", function (req, res) {
  bestellungen_params = db
    .prepare("SELECT * FROM bestellungen WHERE user=?")
    .all(req.session.user);
  res.render("startseite", {
    message: "",
    session: req.session.authenticated,
    pizzen: pizzen_params,
    drinks: drinks_params,
    bestellungen: bestellungen_params,
  });
});

/* getRequest startseite */
app.post("/", function (req, res) {
  if (req.user.authenticated) {
    bestellungen_params = db
      .prepare("SELECT * FROM bestellungen WHERE user=?")
      .all(req.session.user);
  }
  res.render("startseite", {
    message: "",
    session: req.session.authenticated,
    pizzen: pizzen_params,
    drinks: drinks_params,
    bestellungen: bestellungen_params,
  });
});

/* getRequest admin_main */
app.get("/admin", function (req, res) {
  res.render("admin/admain", { message: "" });
});

/* getRequest admin_kontaktdaten */
app.get("/admin_kontaktdaten", function (req, res) {
  const rows = db.prepare("SELECT * FROM kontaktdaten").all();
  res.render("admin/kontaktdaten", { message: "", kontakte: rows });
});

/* getRequest admin_pizzen */
app.get("/admin_pizzen", function (req, res) {
  const rows = db.prepare("SELECT * FROM pizzen").all();
  res.render("admin/pizzen", { message: "", pizzen: rows });
});

/* getRequest admin_drinks */
app.get("/admin_drinks", function (req, res) {
  const rows = db.prepare("SELECT * FROM drinks").all();
  res.render("admin/drinks", { message: "", drinks: rows });
});

/* getRequest admin_bestellungen */
app.get("/admin_bestellungen", function (req, res) {
  const rows = db.prepare("SELECT * FROM bestellungen").all();
  res.render("admin/bestellungen", { message: "", bestellungen: rows });
});

/* postRequest speisekarte */
app.post("/speisekarte", function (req, res) {
  bestellungen_params = db
    .prepare("SELECT * FROM bestellungen WHERE user=?")
    .all(req.session.user);
  res.render("speisekarte", {
    session: req.session.authenticated,
    pizzen: pizzen_params,
    drinks: drinks_params,
    bestellungen: bestellungen_params,
  });
});

/* postRequest accountdetails */
app.post("/accountdetails", function (req, res) {
  if (req.session.authenticated) {
    param_email = req.session.user;
    bestellungen_params = db
      .prepare("SELECT * FROM bestellungen WHERE user=?")
      .all(param_email);
    const data_params = db
      .prepare("SELECT * FROM kontaktdaten WHERE email=?")
      .all(param_email);
    res.render("accountdetails", {
      message: "",
      data: data_params,
      session: req.session.authenticated,
      pizzen: pizzen_params,
      drinks: drinks_params,
      bestellungen: bestellungen_params,
    });
  } else {
    res.render("startseite", {
      message: "Bitte melden Sie sich an!",
      session: req.session.authenticated,
      pizzen: pizzen_params,
      drinks: drinks_params,
      bestellungen: bestellungen_params,
    });
  }
});

/* User Login */
app.post("/login", function (req, res) {
  const param_email = req.body.login_email;
  const param_password = req.body.login_password;
  const rows = db
    .prepare("SELECT * FROM kontaktdaten WHERE email=?")
    .all(param_email);
  if (param_email == "" || param_password == "") {
    res.render("startseite", {
      message: "Bitte alle Felder ausfüllen!",
      session: req.session.authenticated,
      pizzen: pizzen_params,
      drinks: drinks_params,
      bestellungen: bestellungen_params,
    });
  } else {
    if (rows.length == 1) {
      const hash = rows[0].password;
      const isValid = bcrypt.compareSync(param_password, hash);
      if (isValid == true) {
        req.session.authenticated = true;
        req.session.user = param_email;
        bestellungen_params = db
          .prepare("SELECT * FROM bestellungen WHERE user=?")
          .all(param_email);
        res.render("startseite", {
          message: `Angemeldet mit ${param_email}`,
          session: req.session.authenticated,
          pizzen: pizzen_params,
          drinks: drinks_params,
          bestellungen: bestellungen_params,
        });
      } else {
        res.render("startseite", {
          message: "Passwort Falsch!",
          session: req.session.authenticated,
          pizzen: pizzen_params,
          drinks: drinks_params,
          bestellungen: bestellungen_params,
        });
      }
    } else {
      res.render("startseite", {
        message: "Benutzer nicht vorhanden!",
        session: req.session.authenticated,
        pizzen: pizzen_params,
        drinks: drinks_params,
        bestellungen: bestellungen_params,
      });
    }
  }
});

/* User Register */
app.post("/user_register", function (req, res) {
  const param_email = req.body.register_email;
  const param_firstname = req.body.register_firstname;
  const param_lastname = req.body.register_lastname;
  const param_adress = req.body.register_adress;
  const param_postcode = req.body.register_postcode;
  const param_password = req.body.register_password;
  const param_password_repeat = req.body.register_password_repeat;
  // Prüfen ob Felder ausgefüllt sind
  if (
    param_email == "" ||
    param_firstname == "" ||
    param_lastname == "" ||
    param_adress == "" ||
    param_postcode == "" ||
    param_password == "" ||
    param_password_repeat == ""
  ) {
    res.render("startseite", {
      message: "Bitte alle Felder ausfüllen!",
      session: req.session.authenticated,
      pizzen: pizzen_params,
      drinks: drinks_params,
      bestellungen: bestellungen_params,
    });
  } else {
    if (validator.validate(param_email)) {
      // Prüfen ob die Email bereits genutzt wird
      rows = db
        .prepare("SELECT * FROM kontaktdaten WHERE email=?")
        .all(param_email);
      if (rows.length == 0) {
        // Passwort mit Passwortwiederholung abgleichen
        if (param_password == param_password_repeat) {
          // Passwort verschlüsseln mit bcrypt
          const hash = bcrypt.hashSync(param_password, 10);
          const info = db
            .prepare(
              "INSERT INTO kontaktdaten(email, firstname, lastname, adress, postcode, password) VALUES (?, ?, ?, ?, ?, ?)"
            )
            .run(
              param_email,
              param_firstname,
              param_lastname,
              param_adress,
              param_postcode,
              hash
            );
          // Weiterleiten auf Startseite
          res.render("startseite", {
            message: "Du bist erfolgreich registriert!",
            session: req.session.authenticated,
            pizzen: pizzen_params,
            drinks: drinks_params,
            bestellungen: bestellungen_params,
          });
        } else {
          res.render("startseite", {
            message: "Passworteingabe verschieden!",
            session: req.session.authenticated,
            pizzen: pizzen_params,
            drinks: drinks_params,
            bestellungen: bestellungen_params,
          });
        }
      } else {
        res.render("startseite", {
          message: "Benutzer existiert bereits!",
          session: req.session.authenticated,
          pizzen: pizzen_params,
          drinks: drinks_params,
          bestellungen: bestellungen_params,
        });
      }
    } else {
      res.render("startseite", {
        message: "Kein anerkanntes Email Format!",
        session: req.session.authenticated,
        pizzen: pizzen_params,
        drinks: drinks_params,
        bestellungen: bestellungen_params,
      });
    }
  }
});

/* Logout */
app.post("/logout", function (req, res) {
  req.session.destroy();
  bestellungen_params = db
    .prepare("SELECT * FROM bestellungen WHERE user=?")
    .all("");
  res.redirect("/");
});

/* Update User */
app.post("/update_user", function (req, res) {
  const param_email = req.body.update_email;
  const param_firstname = req.body.update_firstname;
  const param_lastname = req.body.update_lastname;
  const param_adress = req.body.update_adress;
  const param_postcode = req.body.update_postcode;
  const param_user = req.session.user;
  const rows = db
    .prepare("SELECT * FROM kontaktdaten WHERE email=?")
    .all(param_user);
  bestellungen_params = db
    .prepare("SELECT * FROM bestellungen WHERE user=?")
    .all(param_user);
  if (
    param_email == "" ||
    param_firstname == "" ||
    param_lastname == "" ||
    param_adress == "" ||
    param_postcode == ""
  ) {
    res.render("accountdetails", {
      message: "Bitte füllen sie alle Felder aus!",
      data: rows,
      session: req.session.authenticated,
      pizzen: pizzen_params,
      drinks: drinks_params,
      bestellungen: bestellungen_params,
    });
  } else {
    if (validator.validate(param_email)) {
      if (rows.length == 1) {
        const info = db
          .prepare(
            "UPDATE kontaktdaten SET email=?, firstname=?, lastname=?, adress=?, postcode=? WHERE email=?"
          )
          .run(
            param_email,
            param_firstname,
            param_lastname,
            param_adress,
            param_postcode,
            param_user
          );
        rows = db
          .prepare("SELECT * FROM kontaktdaten WHERE email=?")
          .all(param_email);
        req.session.user = param_email;

        res.render("accountdetails", {
          message: "Erfolgreich geupdatet!",
          data: rows,
          session: req.session.authenticated,
          pizzen: pizzen_params,
          drinks: drinks_params,
          bestellungen: bestellungen_params,
        });
      } else {
        res.render("accountdetails", {
          message: "Benutzer nicht vorhanden!",
          data: rows,
          session: req.session.authenticated,
          pizzen: pizzen_params,
          drinks: drinks_params,
          bestellungen: bestellungen_params,
        });
      }
    } else {
      res.render("accountdetails", {
        message: "Kein anerkanntes Email Format!",
        data: rows,
        session: req.session.authenticated,
        pizzen: pizzen_params,
        drinks: drinks_params,
        bestellungen: bestellungen_params,
      });
    }
  }
});

/* Update Password */
app.post("/update_password", function (req, res) {
  const param_password = req.body.update_password;
  const param_password_repeat = req.body.update_password_repeat;
  const param_user = req.session.user;
  const rows = db
    .prepare("SELECT * FROM kontaktdaten WHERE email=?")
    .all(param_user);
  bestellungen_params = db
    .prepare("SELECT * FROM bestellungen WHERE user=?")
    .all(param_user);
  if (param_password == "" || param_password_repeat == "") {
    res.render("accountdetails", {
      message: "Bitte alle Felder ausfüllen!",
      data: rows,
      session: req.session.authenticated,
      pizzen: pizzen_params,
      drinks: drinks_params,
      bestellungen: bestellungen_params,
    });
  } else {
    if (param_password == param_password_repeat) {
      // Passwort verschlüsseln mit bcrypt
      const hash = bcrypt.hashSync(param_password, 10);
      const info = db
        .prepare("UPDATE kontaktdaten SET password=? WHERE email=?")
        .run(hash, param_user);
      rows = db
        .prepare("SELECT * FROM kontaktdaten WHERE email=?")
        .all(param_email);
      res.render("accountdetails", {
        message: "Du bist erfolgreich registriert!",
        data: rows,
        session: req.session.authenticated,
        pizzen: pizzen_params,
        drinks: drinks_params,
        bestellungen: bestellungen_params,
      });
    } else {
      res.render("accountdetails", {
        message: "Passworteingabe verschieden!",
        data: rows,
        session: req.session.authenticated,
        pizzen: pizzen_params,
        drinks: drinks_params,
        bestellungen: bestellungen_params,
      });
    }
  }
});

/* Delete User */
app.post("/delete_user", function (req, res) {
  const param_email = req.body.delete_email;
  const param_password = req.body.delete_password;
  const param_password_repeat = req.body.delete_password_repeat;
  const row = db
    .prepare("SELECT * FROM kontaktdaten WHERE email=?")
    .all(param_email);
  if (
    param_email == "" ||
    param_password == "" ||
    param_password_repeat == ""
  ) {
    res.render("accountdetails", {
      message: "Bitte alle Felder ausfüllen!",
    });
  } else {
    if (param_password != param_password_repeat) {
      res.render("accountdetails", {
        message: "Passworteingabe unterschiedlich!",
        data: row,
        session: req.session.authenticated,
        pizzen: pizzen_params,
        drinks: drinks_params,
        bestellungen: bestellungen_params,
      });
    } else {
      if (row.length == 1) {
        const hash = row[0].password;
        const isValid = bcrypt.compareSync(param_password, hash);
        if (isValid == true) {
          db.prepare("DELETE FROM kontaktdaten WHERE email=?").run(param_email);
          bestellungen_params = db
            .prepare("SELECT * FROM bestellungen WHERE user=?")
            .all("");
          res.render("startseite", {
            message: `${param_email} erfolgreich gelöscht!`,
            data: row,
            session: req.session.authenticated,
            pizzen: pizzen_params,
            drinks: drinks_params,
            bestellungen: bestellungen_params,
          });
        } else {
          res.render("accountdetails", {
            message: "Passwort falsch!",
            data: row,
            session: req.session.authenticated,
            pizzen: pizzen_params,
            drinks: drinks_params,
            bestellungen: bestellungen_params,
          });
        }
      } else {
        res.render("accountdetails", {
          message: "Benutzer nicht vorhanden!",
          data: row,
          session: req.session.authenticated,
          pizzen: pizzen_params,
          drinks: drinks_params,
          bestellungen: bestellungen_params,
        });
      }
    }
  }
});

/* Kasse */
app.post("/products_ordered", function (req, res) {
  let body = req.body;
  let keys = Object.keys(body);
  const param_pizzen = db.prepare("SELECT * FROM pizzen").all();
  const param_drinks = db.prepare("SELECT * FROM drinks").all();
  bestellungen_params = db
    .prepare("SELECT * FROM bestellungen WHERE user=?")
    .all(req.session.user);
  //console.log(body);

  if (keys.length != 0) {
    if (req.session.authenticated) {
      for (index of keys) {
        if (
          db.prepare("SELECT * FROM pizzen WHERE name=?").all(body[index].name)
            .length == 1 ||
          db.prepare("SELECT * FROM drinks WHERE name=?").all(body[index].name)
            .length == 1
        ) {
          console.log(body[index].name, "exists");

          db.prepare(
            "INSERT INTO bestellungen (product, quantity, price, status, user) VALUES (?, ?, ?, ?, ?)"
          ).run(
            body[index].name,
            body[index].inCart,
            body[index].price * body[index].inCart,
            "Eingegangen",
            req.session.user
          );
        } else {
          console.log(body[index].name, "doesnt exists anymore");
        }
      }
      res.render("startseite", {
        message: "Vielen dank für Ihre Bestellung!",
        session: req.session.authenticated,
        pizzen: pizzen_params,
        drinks: drinks_params,
        bestellungen: bestellungen_params,
      });
    } else {
      res.render("startseite", {
        message: "Bitte melden Sie sich an!",
        session: req.session.authenticated,
        pizzen: pizzen_params,
        drinks: drinks_params,
        bestellungen: bestellungen_params,
      });
    }
  } else {
    res.render("startseite", {
      message: "Ihr Warenkorb ist leer!",
      session: req.session.authenticated,
      pizzen: pizzen_params,
      drinks: drinks_params,
      bestellungen: bestellungen_params,
    });
  }
});

/* Admin Befehle */

/* Admin User Delete */
app.post("/user_delete/:id", function (req, res) {
  const info = db
    .prepare("DELETE FROM kontaktdaten WHERE id=?")
    .run(req.params.id);
  const rows = db.prepare("SELECT * FROM kontaktdaten").all();
  res.render("admin/kontaktdaten", {
    message: "Kontakt erfolgreich gelöscht",
    kontakte: rows,
  });
});

/* Admin User Register */
app.post("/admin_user_register", function (req, res) {
  const param_email = req.body.register_email;
  const param_firstname = req.body.register_firstname;
  const param_lastname = req.body.register_lastname;
  const param_adress = req.body.register_adress;
  const param_postcode = req.body.register_postcode;
  const param_password = req.body.register_password;
  const param_password_repeat = req.body.register_password_repeat;
  let rows = db.prepare("SELECT * FROM kontaktdaten").all();
  if (
    param_email == "" ||
    param_firstname == "" ||
    param_lastname == "" ||
    param_adress == "" ||
    param_postcode == "" ||
    param_password == "" ||
    param_password_repeat == ""
  ) {
    res.render("admin/kontaktdaten", {
      message: "Bitte alle Felder ausfüllen!",
      kontakte: rows,
    });
  } else {
    if (validator.validate(param_email)) {
      const row = db
        .prepare("SELECT * FROM kontaktdaten WHERE email=?")
        .all(param_email);
      if (row.length == 0) {
        if (param_password == param_password_repeat) {
          const hash = bcrypt.hashSync(param_password, 10);
          const info = db
            .prepare(
              "INSERT INTO kontaktdaten(email, firstname, lastname, adress, postcode, password) VALUES (?, ?, ?, ?, ?, ?)"
            )
            .run(
              param_email,
              param_firstname,
              param_lastname,
              param_adress,
              param_postcode,
              hash
            );
          rows = db.prepare("SELECT * FROM kontaktdaten").all();
          res.render("admin/kontaktdaten", {
            message: "Erfolgreich registriert!",
            kontakte: rows,
          });
        } else {
          res.render("admin/kontaktdaten", {
            message: "Passworteingabe verschieden!",
            kontakte: rows,
          });
        }
      } else {
        res.render("admin/kontaktdaten", {
          message: "Benutzer existiert bereits!",
          kontakte: rows,
        });
      }
    } else {
      res.render("admin/kontaktdaten", {
        message: "Kein anerkanntes Email Format!",
        kontakte: rows,
      });
    }
  }
});

/* Admin Update User */
app.post("/admin_update_user", function (req, res) {
  const param_email = req.body.update_email;
  const param_firstname = req.body.update_firstname;
  const param_lastname = req.body.update_lastname;
  const param_adress = req.body.update_adress;
  const param_postcode = req.body.update_postcode;
  let rows = db.prepare("SELECT * FROM kontaktdaten").all();
  if (
    param_email == "" ||
    param_firstname == "" ||
    param_lastname == "" ||
    param_adress == "" ||
    param_postcode == ""
  ) {
    res.render("admin/kontaktdaten", {
      message: "Bitte füllen sie alle Felder aus!",
      kontakte: rows,
    });
  } else {
    const row = db
      .prepare("SELECT * FROM kontaktdaten WHERE email=?")
      .all(param_email);
    if (row.length == 1) {
      const info = db
        .prepare(
          "UPDATE kontaktdaten SET firstname=?, lastname=?, adress=?, postcode=? WHERE email=?"
        )
        .run(
          param_firstname,
          param_lastname,
          param_adress,
          param_postcode,
          param_email
        );
      rows = db.prepare("SELECT * FROM kontaktdaten").all();
      res.render("admin/kontaktdaten", {
        message: "Erfolgreich geupdatet!",
        kontakte: rows,
      });
    } else {
      res.render("admin/kontaktdaten", {
        message: "E-Mail nicht verwendet!",
        kontakte: rows,
      });
    }
  }
});

/* Admin Update Password */
app.post("/admin_update_password", function (req, res) {
  const param_email = req.body.update_email;
  const param_password = req.body.update_password;
  const param_password_repeat = req.body.update_password_repeat;
  let rows = db.prepare("SELECT * FROM kontaktdaten").all();
  if (
    param_email == "" ||
    param_password == "" ||
    param_password_repeat == ""
  ) {
    res.render("admin/kontaktdaten", {
      message: "Bitte alle Felder ausfüllen!",
      kontakte: rows,
    });
  } else {
    const row = db
      .prepare("SELECT * FROM kontaktdaten WHERE email=?")
      .all(param_email);
    if (row.length == 1) {
      if (param_password == param_password_repeat) {
        // Passwort verschlüsseln mit bcrypt
        const hash = bcrypt.hashSync(param_password, 10);
        const info = db
          .prepare("UPDATE kontaktdaten SET password=? WHERE email=?")
          .run(hash, param_email);
        rows = db.prepare("SELECT * FROM kontaktdaten").all();
        res.render("admin/kontaktdaten", {
          message: "Passwort erfolgreich geupdatet!",
          kontakte: rows,
        });
      } else {
        res.render("admin/kontaktdaten", {
          message: "Passworteingabe verschieden!",
          kontakte: rows,
        });
      }
    } else {
      res.render("admin/kontaktdaten", {
        message: "E-Mail nicht verwendet!",
        kontakte: rows,
      });
    }
  }
});

/* Admin Pizzen Delete */
app.post("/pizzen_delete/:id", function (req, res) {
  const info = db.prepare("DELETE FROM pizzen WHERE id=?").run(req.params.id);
  const rows = db.prepare("SELECT * FROM pizzen").all();
  res.render("admin/pizzen", {
    message: "Pizza erfolgreich gelöscht!",
    pizzen: rows,
  });
});

/* Admin Pizzen Hinzufügen */
app.post("/pizzen_add", function (req, res) {
  const param_name = req.body.pizzen_name;
  const param_preis = parseFloat(req.body.pizzen_preis);
  const param_zutaten = req.body.pizzen_zutaten;
  let rows = db.prepare("SELECT * FROM pizzen").all();

  if (param_name == "" || param_preis == "" || param_zutaten == "") {
    res.render("admin/pizzen", {
      message: "Bitte alle Felder ausfüllen!",
      pizzen: rows,
    });
  } else {
    const row = db.prepare("SELECT * FROM pizzen WHERE name=?").all(param_name);
    if (row.length == 0) {
      const info = db
        .prepare(
          "INSERT INTO pizzen (name, price, ingredients) VALUES(?, ?, ?)"
        )
        .run(param_name, param_preis, param_zutaten);
      rows = db.prepare("SELECT * FROM pizzen").all();
      res.render("admin/pizzen", {
        message: "Pizza erfolgreich hinzugefügt!",
        pizzen: rows,
      });
    } else {
      res.render("admin/pizzen", {
        message: "Pizza bereits vorhanden!",
        pizzen: rows,
      });
    }
  }
});

/* Admin Pizzen Updaten */
app.post("/pizzen_update", function (req, res) {
  const param_id = req.body.pizzen_id;
  const param_name = req.body.pizzen_name;
  const param_preis = parseFloat(req.body.pizzen_preis);
  const param_zutaten = req.body.pizzen_zutaten;
  let rows = db.prepare("SELECT * FROM pizzen").all();

  if (
    param_id == "" ||
    param_name == "" ||
    param_preis == "" ||
    param_zutaten == ""
  ) {
    res.render("admin/pizzen", {
      message: "Bitte alle Felder ausfüllen!",
      pizzen: rows,
    });
  } else {
    const row = db.prepare("SELECT * FROM pizzen WHERE id=?").all(param_id);
    if (row.length == 1) {
      const info = db
        .prepare("UPDATE pizzen SET name=?, price=?, ingredients=? WHERE id=?")
        .run(param_name, param_preis, param_zutaten, param_id);
      rows = db.prepare("SELECT * FROM pizzen").all();
      res.render("admin/pizzen", {
        message: "Pizza erfolgreich geupdatet!",
        pizzen: rows,
      });
    } else {
      res.render("admin/pizzen", {
        message: "Pizza mit dieser ID nicht vorhanden!",
        pizzen: rows,
      });
    }
  }
});

/* Admin Drinks Delete */
app.post("/drinks_delete/:id", function (req, res) {
  const info = db.prepare("DELETE FROM drinks WHERE id=?").run(req.params.id);
  const rows = db.prepare("SELECT * FROM drinks").all();
  res.render("admin/drinks", {
    message: "Drink erfolgreich gelöscht!",
    drinks: rows,
  });
});

/* Admin Drinks Hinzufügen */
app.post("/drinks_add", function (req, res) {
  const param_name = req.body.drinks_name;
  const param_preis = parseFloat(req.body.drinks_preis);
  let rows = db.prepare("SELECT * FROM drinks").all();

  if (param_name == "" || param_preis == "") {
    res.render("admin/drinks", {
      message: "Bitte alle Felder ausfüllen!",
      drinks: rows,
    });
  } else {
    const row = db.prepare("SELECT * FROM drinks WHERE name=?").all(param_name);
    if (row.length == 0) {
      const info = db
        .prepare("INSERT INTO drinks (name, price) VALUES(?, ?)")
        .run(param_name, param_preis);
      rows = db.prepare("SELECT * FROM drinks").all();
      res.render("admin/drinks", {
        message: "Drink erfolgreich hinzugefügt!",
        drinks: rows,
      });
    } else {
      res.render("admin/drinks", {
        message: "Drink bereits vorhanden!",
        drinks: rows,
      });
    }
  }
});

/* Admin Drinks Updaten */
app.post("/drinks_update", function (req, res) {
  const param_id = req.body.drinks_id;
  const param_name = req.body.drinks_name;
  const param_preis = parseFloat(req.body.drinks_preis);
  let rows = db.prepare("SELECT * FROM drinks").all();

  if (param_id == "" || param_name == "" || param_preis == "") {
    res.render("admin/drinks", {
      message: "Bitte alle Felder ausfüllen!",
      drinks: rows,
    });
  } else {
    const row = db.prepare("SELECT * FROM drinks WHERE id=?").all(param_id);
    if (row.length == 1) {
      const info = db
        .prepare("UPDATE drinks SET name=?, preis=? WHERE id=?")
        .run(param_name, param_preis, param_id);
      rows = db.prepare("SELECT * FROM drinks").all();
      res.render("admin/drinks", {
        message: "Drink erfolgreich geupdatet!",
        drinks: rows,
      });
    } else {
      res.render("admin/drinks", {
        message: "Drink mit dieser ID nicht vorhanden!",
        drinks: rows,
      });
    }
  }
});

/* Admin Bestellung Delete */
app.post("/bestellungen_delete/:id", function (req, res) {
  const info = db
    .prepare("DELETE FROM bestellungen WHERE id=?")
    .run(req.params.id);
  const rows = db.prepare("SELECT * FROM bestellungen").all();
  res.render("admin/bestellungen", {
    message: "Bestellung erfolgreich gelöscht!",
    bestellungen: rows,
  });
});

/* Admin Bestellung Status Updaten */
app.post("/bestellungen_status_update", function (req, res) {
  const param_id = req.body.bestellungen_id;
  const param_status = req.body.bestellungen_status;

  let rows = db.prepare("SELECT * FROM bestellungen").all();

  if (param_id == "" || param_status == "") {
    res.render("admin/bestellungen", {
      message: "Bitte alle Felder ausfüllen!",
      bestellungen: rows,
    });
  } else {
    const row = db
      .prepare("SELECT * FROM bestellungen WHERE id=?")
      .all(param_id);
    if (row.length == 1) {
      const info = db
        .prepare("UPDATE bestellungen SET status=? WHERE id=?")
        .run(param_status, param_id);
      rows = db.prepare("SELECT * FROM bestellungen").all();
      res.render("admin/bestellungen", {
        message: "Bestellung erfolgreich geupdatet!",
        bestellungen: rows,
      });
    } else {
      res.render("admin/bestellungen", {
        message: "Bestellungen mit dieser ID nicht vorhanden!",
        bestellungen: rows,
      });
    }
  }
});

/* Gillis Test Station */

//Layout
app.get("/layout", function (req, res) {
  res.render("layout");
});

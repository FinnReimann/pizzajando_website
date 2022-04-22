// Express initialisieren
const express = require("express");
const { use } = require("express/lib/application");
const res = require("express/lib/response");
const { get } = require("express/lib/response");
const app = express();

// Public Freigeben
app.use(express.static(__dirname + "/public"));

// Body-Parser initialisieren
app.use(express.urlencoded({ extended: true }));

// EJS initialisieren
app.engine("ejs", require("ejs").__express);
app.set("view engine", "ejs");

// Datenbank initialisieren
const DATABASE = "daten.db";
const db = require("better-sqlite3")(DATABASE);

// Session initialisieren
const session = require("express-session");
app.use(
  session({
    secret: "example",
    saveUninitialized: false,
    resave: false,
  })
);

// Bcrypt initialisieren
const bcrypt = require("bcrypt");

// Server starten
app.listen(3000, function () {
  console.log("listening to 3000");
});

// getRequest startseite
app.get("/startseite", function (req, res) {
  res.render("startseite", { message: "", session: req.session.user });
});

// getRequest admin
app.get("/admin", function (req, res) {
  res.render("admin", { message: "" });
});

// getRequest kontaktdaten
app.get("/kontaktdaten_table", function (req, res) {
  const rows = db.prepare("SELECT * FROM kontaktdaten").all();
  //console.log(rows);
  res.render("kontaktdaten_table", { kontakte: rows });
});

// getRequest pizzen
app.get("/pizzen_table", function (req, res) {
  const rows = db.prepare("SELECT * FROM pizzen").all();
  //console.log(rows);
  res.render("pizzen_table", { pizzen: rows });
});

// getRequest drinks
app.get("/drinks_table", function (req, res) {
  const rows = db.prepare("SELECT * FROM drinks").all();
  //console.log(rows);
  res.render("drinks_table", { drinks: rows });
});

// getRequest speisekarte
app.post("/speisekarte", function (req, res) {
  const pizzen_params = db.prepare("SELECT * FROM pizzen").all();
  const drinks_params = db.prepare("SELECT * FROM drinks").all();
  res.render("speisekarte", { pizzen: pizzen_params, drinks: drinks_params });
});

// Register
app.post("/neuer_benutzer", function (req, res) {
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
      session: req.session.user,
    });
  } else {
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
          session: req.session.user,
        });
      } else {
        res.render("startseite", {
          message: "Passworteingabe verschieden!",
          session: req.session.user,
        });
      }
    } else {
      res.render("startseite", {
        message: "Benutzer existiert bereits!",
        session: req.session.user,
      });
    }
  }
});

// Login versuch
app.post("/login", function (req, res) {
  const param_email = req.body.login_email;
  const param_password = req.body.login_password;
  const rows = db
    .prepare("SELECT * FROM kontaktdaten WHERE email=?")
    .all(param_email);
  if (param_email == "" || param_password == "") {
    res.render("startseite", {
      message: "Bitte alle Felder ausfüllen!",
      session: req.session.user,
    });
  } else {
    if (rows && rows.length == 1) {
      const hash = rows[0].password;
      const isValid = bcrypt.compareSync(param_password, hash);
      if (isValid == true) {
        req.session.authenticated = true;
        req.session.user = param_email;
        res.render("startseite", {
          message: `Angemeldet mit ${param_email}`,
          session: req.session.user,
        });
      } else {
        res.render("startseite", {
          message: "Passwort Falsch!",
          session: req.session.user,
        });
      }
    } else {
      res.render("startseite", {
        message: "Benutzer nicht vorhanden!",
        session: req.session.user,
      });
    }
  }
});

// Delete
app.post("/delete", function (req, res) {
  const param_email = req.body.delete_email;
  const param_password = req.body.delete_password;
  const rows = db
    .prepare("SELECT * FROM kontaktdaten WHERE email=?")
    .all(param_email);
  if (param_email == "" || param_password == "") {
    res.render("admin", { message: "Bitte alle Felder ausfüllen!" });
  } else {
    if (rows && rows.length == 1) {
      const hash = rows[0].password;
      const isValid = bcrypt.compareSync(param_password, hash);
      if (isValid == true) {
        db.prepare("DELETE FROM kontaktdaten WHERE email=?").run(param_email);
        res.render("admin", {
          message: `${param_email} erfolgreich gelöscht!`,
        });
      } else {
        res.render("admin", { message: "Passwort falsch!" });
      }
    } else {
      res.render("admin", { message: "Benutzer nicht vorhanden!" });
    }
  }
});

// Logout
app.get("/logout", function (req, res) {
  req.session.destroy();

  // Weiterleiten
  res.redirect("/startseite");
});

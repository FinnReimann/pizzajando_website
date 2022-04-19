// base variables
let loggedIn = false;

// Express initialisieren
const express = require("express");
const { use } = require("express/lib/application");
const res = require("express/lib/response");
const { get } = require("express/lib/response");
const app = express();

// Views Freigeben
app.use(express.static(__dirname + "/public"));

// Body-Parser initialisieren
app.use(express.urlencoded({ extended: true }));

// EJS initialisieren
app.engine("ejs", require("ejs").__express);
app.set("view engine", "ejs");

// Datenbank initialisieren
const DATABASE = "daten.db";
const db = require("better-sqlite3")(DATABASE);

// Server starten
app.listen(3000, function () {
  console.log("listening to 3000");
});

// getRequest Startseite
app.get("/startseite", function (req, res) {
  res.render("startseite", { ausgabetext: "", loggedIn });
});

// getRequest Register
app.get("/register", function (req, res) {
  res.render("register", { ausgabetext: "" });
});

// Login versuch
app.post("/startseite", function (req, res) {
  const param_username = req.body.username;
  const param_password = req.body.password;
  if (param_username == "" || param_password == "") {
    res.render("startseite", {
      ausgabetext: "Bitte alle Felder ausfüllen!",
      loggedIn: false,
    });
  } else {
    if (benutzerExistiert(param_username)) {
      if (anmeldungErfolgreich(param_username, param_password)) {
        loggedIn = true;
        res.render("startseite", {
          benutzer: getUser(param_username),
          ausgabetext: "Willkommen zurück ",
          loggedIn,
        });
      } else {
        res.render("startseite", {
          ausgabetext: "Passwort Falsch!",
          loggedIn: false,
        });
      }
    } else {
      res.render("startseite", {
        ausgabetext: "Benutzer nicht vorhanden!",
        loggedIn: false,
      });
    }
  }
});

// Funktion benutzerExistiert
function benutzerExistiert(benutzerEmail) {
  const rows = db.prepare("SELECT * FROM kontaktdaten").all();
  for (element of rows) {
    if (element.email == benutzerEmail) {
      return true;
    }
  }
  return false;
}

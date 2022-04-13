// Initialisierung Express.js
const express = require("express");
const app = express();

// Initialisierung Body-Parser
app.use(express.urlencoded({ extended: true }));

// Initialisierung EJS
app.engine(".ejs", require("ejs").__express);
app.set("view engine", "ejs");

// die Ordner public und images freigeben
app.use(express.static(__dirname + "/views"));

// Startet Webserver
app.listen(3000, function () {
  console.log("listening on port 3000");
});

// verknüpft die Anfrage mit einer entsprechenden Antwort
app.get("/pizzajando", function (req, res) {
  res.sendFile(__dirname + "/views/startseite.html");
});

/*
app.get("/loginformular", function(req, res){
    res.sendFile(__dirname + "/loginformular.html");
});
*/
app.post("/loginformular", function (req, res) {
  res.render("loginformular");
});

// get Request für benutzerdaten.ejs
app.get("/benutzerdaten", function (req, res) {
  res.render("benutzerdaten", { benutzerdaten: benutzerdaten });
});

// get Request für benutzerzeigen.ejs
app.get("/zeigebenutzer/:id", function (req, res) {
  const index = req.params.id;
  res.render("benutzerzeigen", { benutzer: benutzerdaten[index] });
});

// get Request loginformular
app.get("/loginform", function (req, res) {
  res.render("loginformular", { fehlertext: "" });
});

// get Request registrierung
app.get("/register", function (req, res) {
  res.render("registrierung", { fehlertext: "" });
});

// Benutzer hinzufügen
app.post("/neuerBenutzer", function (req, res) {
  const name = req.body.username;
  const fname = req.body.firstname;
  const lname = req.body.lastname;
  const mail = req.body.email;
  const pwd = req.body.password;
  if (name == "" || fname == "" || lname == "" || mail == "" || pwd == "") {
    res.render("loginFehler", { fehlertext: "Bitte alle Felder ausfüllen!" });
  } else {
    if (emailVergeben(mail)) {
      res.render("loginFehler", {
        fehlertext: "E-Mail adresse bereits vergeben!",
      });
    }
    if (!benutzerExistiert(name)) {
      let user = {
        username: name,
        firstname: fname,
        lastname: lname,
        email: mail,
        password: pwd,
      };
      benutzerdaten.push(user);

      res.render("loginErfolgreich", {
        benutzer: getUser(name),
        text: "Willkommen ",
      });
    } else {
      res.render("loginFehler", { fehlertext: "Benutzername vergeben!" });
    }
  }
});

// Login versuch
app.post("/login", function (req, res) {
  const name = req.body.username;
  const pwd = req.body.password;
  if (name == "" || pwd == "") {
    res.render("loginFehler", { fehlertext: "Bitte alle Felder ausfüllen!" });
  } else {
    if (benutzerExistiert(name)) {
      if (anmeldungErfolgreich(name, pwd)) {
        res.render("loginErfolgreich", {
          benutzer: getUser(name),
          text: "Willkommen zurück ",
        });
      } else {
        res.render("loginFehler", { fehlertext: "Passwort Falsch!" });
      }
    } else {
      res.render("loginFehler", { fehlertext: "Benutzer nicht vorhanden!" });
    }
  }
});

// Benutzer Manuell
let benutzerdaten = [
  {
    username: "Finn",
    firstname: "Finn",
    lastname: "Reimann",
    email: "finn@web.de",
    password: "1234",
  },
  {
    username: "Jorit",
    firstname: "Jorit",
    lastname: "Reimann",
    email: "jorit@web.de",
    password: "4321",
  },
  {
    username: "Apfel",
    firstname: "Apfel",
    lastname: "Kraft",
    email: "apfel@web.de",
    password: "Skyrim",
  },
];

// Funktionen

// benutzerExistiert
function benutzerExistiert(benutzername) {
  for (nutzer of benutzerdaten) {
    if (nutzer.username == benutzername) {
      return true;
    }
  }
  return false;
}

// emailVergeben
function emailVergeben(mail) {
  for (const nutzer of benutzerdaten) {
    if (nutzer.email == mail) {
      return true;
    }
  }
  return false;
}

// anmeldungErfolgreich
function anmeldungErfolgreich(name, pwd) {
  for (const nutzer of benutzerdaten) {
    if (nutzer.username == name && nutzer.password == pwd) {
      return true;
    }
  }
  return false;
}

// getUsername
function getUser(name) {
  for (const nutzer of benutzerdaten) {
    if (nutzer.username == name) {
      return nutzer;
    }
  }
}

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

// Startseite
app.get("/startseite", function (req, res) {
  res.render("startseite");
});

/* Modal 
app.post("/open", function (req, res) {
  const show_modal = !!req.body.modal; // Cast to boolean
  res.render("startseite", { show_modal });
});
*/

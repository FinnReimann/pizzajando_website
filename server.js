// Express initialisieren
const express = require("express");
const app = express();

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

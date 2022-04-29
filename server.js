// Express initialisieren
const express = require("express");
const { use } = require("express/lib/application");
const res = require("express/lib/response");
const { get } = require("express/lib/response");
const app = express();

// Validator Initialisieren
const validator = require("email-validator");

// Datenbank initialisieren
const DATABASE = "daten.db";
const db = require("better-sqlite3")(DATABASE);

// Session initialisieren
const session = require("express-session");

// Bcrypt initialisieren
const bcrypt = require("bcrypt");

// Public Freigeben
app.use(express.static(__dirname + "/public"));

// Body-Parser initialisieren
app.use(express.urlencoded({ extended: true }));

// EJS initialisieren
app.engine("ejs", require("ejs").__express);
app.set("view engine", "ejs");

// Session
app.use(
  session({
    cookie: {
      maxAge: 1000 * 60 * 60, // 1 Hour
      sameSite: true,
    },
    secret: "example",
    saveUninitialized: false,
    resave: false,
  })
);

// Server starten
app.listen(3000, function () {
  console.log("listening to 3000");
});

// getRequest startseite
app.get("/startseite", function (req, res) {
  res.render("startseite", { message: "", session: req.session.authenticated });
});

// getRequest admin
app.get("/admin", function (req, res) {
  res.render("admin_main", { message: "" });
});

// getRequest kontaktdaten
app.get("/admin_kontaktdaten", function (req, res) {
  const rows = db.prepare("SELECT * FROM kontaktdaten").all();
  res.render("admin_kontaktdaten", { kontakte: rows });
});

// getRequest pizzen
app.get("/admin_pizzen", function (req, res) {
  const rows = db.prepare("SELECT * FROM pizzen").all();
  res.render("admin_pizzen", { pizzen: rows });
});

// getRequest drinks
app.get("/admin_drinks", function (req, res) {
  const rows = db.prepare("SELECT * FROM drinks").all();
  res.render("admin_drinks", { drinks: rows });
});

// postRequest speisekarte
app.post("/speisekarte", function (req, res) {
  const pizzen_params = db.prepare("SELECT * FROM pizzen").all();
  const drinks_params = db.prepare("SELECT * FROM drinks").all();
  res.render("speisekarte", { pizzen: pizzen_params, drinks: drinks_params });
});

// postRequest accountdetails
app.post("/accountdetails", function (req, res) {
  if (/*req.session.authenticated*/ true) {
    param_email = req.session.user;
    const rows = db
      .prepare("SELECT * FROM kontaktdaten WHERE email=?")
      .all(param_email);
    res.render("accountdetails", { message: "", data: rows });
  } else {
    res.render("startseite", {
      message: "Bitte melden Sie sich an!",
      session: req.session.authenticated,
    });
  }
});

// User Login
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
          session: req.session.authenticated,
        });
      } else {
        res.render("startseite", {
          message: "Passwort Falsch!",
          session: req.session.authenticated,
        });
      }
    } else {
      res.render("startseite", {
        message: "Benutzer nicht vorhanden!",
        session: req.session.authenticated,
      });
    }
  }
});

// User Register
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
      session: req.session.user,
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
          });
        } else {
          res.render("startseite", {
            message: "Passworteingabe verschieden!",
            session: req.session.authenticated,
          });
        }
      } else {
        res.render("startseite", {
          message: "Benutzer existiert bereits!",
          session: req.session.authenticated,
        });
      }
    } else {
      res.render("startseite", {
        message: "Kein anerkanntes Email Format!",
        session: req.session.authenticated,
      });
    }
  }
});

// Logout
app.post("/logout", function (req, res) {
  req.session.destroy();
  res.redirect("/startseite");
});

// Update User
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
    });
  } else {
    if (validator.validate(param_email)) {
      if (rows && rows.length == 1) {
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
        });
      } else {
        res.render("accountdetails", {
          message: "Benutzer nicht vorhanden!",
          data: rows,
        });
      }
    } else {
      res.render("accountdetails", {
        message: "Kein anerkanntes Email Format!",
        data: rows,
      });
    }
  }
});

// Update Password
app.post("/update_password", function (req, res) {
  const param_password = req.body.update_password;
  const param_password_repeat = req.body.update_password_repeat;
  const param_user = req.session.user;
  const rows = db
    .prepare("SELECT * FROM kontaktdaten WHERE email=?")
    .all(param_user);
  if (param_password == "" || param_password_repeat == "") {
    res.render("accountdetails", {
      message: "Bitte alle Felder ausfüllen!",
      data: rows,
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
      });
    } else {
      res.render("accountdetails", {
        message: "Passworteingabe verschieden!",
        data: rows,
      });
    }
  }
});

// Delete User
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
      });
    } else {
      if (row && row.length == 1) {
        const hash = row[0].password;
        const isValid = bcrypt.compareSync(param_password, hash);
        if (isValid == true) {
          db.prepare("DELETE FROM kontaktdaten WHERE email=?").run(param_email);
          res.render("startseite", {
            message: `${param_email} erfolgreich gelöscht!`,
          });
        } else {
          res.render("accountdetails", { message: "Passwort falsch!" });
        }
      } else {
        res.render("accountdetails", {
          message: "Benutzer nicht vorhanden!",
        });
      }
    }
  }
});

/* Admin */

// Admin User Register
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
    res.render("admin_kontaktdaten", {
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
          res.render("admin_kontaktdaten", {
            message: "Erfolgreich registriert!",
            kontakte: rows,
          });
        } else {
          res.render("admin_kontaktdaten", {
            message: "Passworteingabe verschieden!",
            kontakte: rows,
          });
        }
      } else {
        res.render("admin_kontaktdaten", {
          message: "Benutzer existiert bereits!",
          kontakte: rows,
        });
      }
    } else {
      res.render("admin_kontaktdaten", {
        message: "Kein anerkanntes Email Format!",
        kontakte: rows,
      });
    }
  }
});

// Admin Update User
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
    res.render("admin_kontaktdaten", {
      message: "Bitte füllen sie alle Felder aus!",
      kontakte: rows,
    });
  } else {
    const row = db
      .prepare("SELECT * FROM kontaktdaten WHERE email=?")
      .all(param_email);
    if (row && row.length == 1) {
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
      res.render("admin_kontaktdaten", {
        message: "Erfolgreich geupdatet!",
        kontakte: rows,
      });
    } else {
      res.render("admin_kontaktdaten", {
        message: "E-Mail nicht verwendet!",
        kontakte: rows,
      });
    }
  }
});

// Admin Update Password
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
    res.render("admin_kontaktdaten", {
      message: "Bitte alle Felder ausfüllen!",
      kontakte: rows,
    });
  } else {
    const row = db
      .prepare("SELECT * FROM kontaktdaten WHERE email=?")
      .all(param_email);
    if (row && row.length == 1) {
      if (param_password == param_password_repeat) {
        // Passwort verschlüsseln mit bcrypt
        const hash = bcrypt.hashSync(param_password, 10);
        const info = db
          .prepare("UPDATE kontaktdaten SET password=? WHERE email=?")
          .run(hash, param_email);
        rows = db.prepare("SELECT * FROM kontaktdaten").all();
        res.render("admin_kontaktdaten", {
          message: "Passwort erfolgreich geupdatet!",
          kontakte: rows,
        });
      } else {
        res.render("admin_kontaktdaten", {
          message: "Passworteingabe verschieden!",
          kontakte: rows,
        });
      }
    } else {
      res.render("admin_kontaktdaten", {
        message: "E-Mail nicht verwendet!",
        kontakte: rows,
      });
    }
  }
});

// Admin Delete User
app.post("/admin_user_delete", function (req, res) {
  const param_email = req.body.delete_email;
  const param_password = req.body.delete_password;
  let rows = db.prepare("SELECT * FROM kontaktdaten").all();
  if (param_email == "" || param_password == "") {
    res.render("admin_kontaktdaten", {
      message: "Bitte alle Felder ausfüllen!",
      kontakte: rows,
    });
  } else {
    const row = db
      .prepare("SELECT * FROM kontaktdaten WHERE email=?")
      .all(param_email);
    if (row && row.length == 1) {
      const hash = rows[0].password;
      const isValid = bcrypt.compareSync(param_password, hash);
      if (isValid == true) {
        const info = db
          .prepare("DELETE FROM kontaktdaten WHERE email=?")
          .run(param_email);
        rows = db.prepare("SELECT * FROM kontaktdaten").all();
        res.render("admin_kontaktdaten", {
          message: `${param_email} erfolgreich gelöscht!`,
          kontakte: rows,
        });
      } else {
        res.render("admin_kontaktdaten", {
          message: "Passwort falsch!",
          kontakte: rows,
        });
      }
    } else {
      res.render("admin_kontaktdaten", {
        message: "Benutzer nicht vorhanden!",
        kontakte: rows,
      });
    }
  }
});

/*
// Pizzen Delete
app.post("/delete/:id", function (req, res) {
  const info = db.prepare("DELETE FROM pizzen WHERE id=?").run(req.params.id);
  console.log(info);
  res.redirect("/pizzen_table");
});
*/

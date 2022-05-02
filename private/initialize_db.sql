DROP TABLE kontaktdaten;
DROP TABLE pizzen;
DROP TABLE drinks;

CREATE TABLE IF NOT EXISTS kontaktdaten (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    firstname TEXT NOT NULL,
    lastname TEXT NOT NULL,
    adress TEXT NOT NULL,
    postcode TEXT NOT NULL,
    password TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS pizzen (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price INTEGER NOT NULL,
    ingredients TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS drinks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price INTEGER NOT NULL
);

INSERT INTO pizzen ( name, price, ingredients ) VALUES ( "Margherita", 8.99, "Tomatensauce & Mozzarella");
INSERT INTO pizzen ( name, price, ingredients ) VALUES ( "Salami", 9.99, "Salami, Tomatensauce & Mozzarella");
INSERT INTO pizzen ( name, price, ingredients ) VALUES ( "Schinken", 9.99, "Schinken, Tomatensauce & Mozzarella");

INSERT INTO drinks (name, price) VALUES ("Cola", 5.99);
INSERT INTO drinks (name, price) VALUES ("Fanta", 5.99);
INSERT INTO drinks (name, price) VALUES ("Sprite", 5.99);
DROP TABLE IF EXISTS shopping_list;
CREATE TABLE IF NOT EXISTS shopping_list (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    name TEXT NOT NULL,
    price decimal(5, 2) NOT NULL,
    date_added TIMESTAMP DEFAULT now() NOT NULL,
    checked BOOLEAN DEFAULT false,
    category groceries 
);

DROP TYPE IF EXISTS groceries;
CREATE TYPE IF NOT EXISTS groceries AS ENUM (
    'Main',
    'Snack',
    'Lunch',
    'Breakfast'
);
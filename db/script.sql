CREATE DATABASE aulaback;

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    surname VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    birthday DATE NOT NULL,
    age INTEGER NOT NULL,
    zodiacSign VARCHAR(100) NOT NULL
);




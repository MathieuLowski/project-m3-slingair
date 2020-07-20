"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const { flights } = require("./test-data/flightSeating");
const { reservations } = require("./test-data/reservations");

//console.log(reservations);

const handleFlights = (req, res) => {
  let flightIds = Object.keys(flights);
  console.log("available flight", flightIds);
  //console.log("all info ", flights); //gives the whole object
  res.status(200).json(flightIds);
};

const handleSeatDisplay = (req, res) => {
  const seatInfo = flights[req.params.flightNumber];
  res.status(200).json(seatInfo);
};

const handlePost = (req, res) => {
  const { givenName, surname, email, seat, flight } = req.body; // delete this or the other
  //let values = Object(res.body); // delete this or the other
  //res.redirect("/confirmed");

  let reservation = {
    id: "23",
    flight,
    seat,
    surname,
    givenName,
    email,
  };
  console.log("some", reservation);
  reservations.push(reservation);
  res.status(200).json(reservation); //
};

const handleReservation = (req, res) => {
  const id = req.params.id;
  const reservation = reservations.find((reservation) => {
    console.log("extra stuff", reservation);
    return reservation.id === id;
  });
  if (reservation.id === id) {
    res.status(200).json(reservation);
  }
};

express()
  .use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  })
  .use(morgan("dev"))
  .use(express.static("public"))
  .use(bodyParser.json())
  .use(express.urlencoded({ extended: false }))

  // endpoints
  .get("/flights", handleFlights)
  .get("/flights/:flightNumber", handleSeatDisplay)
  .post("/users", handlePost)
  .get("/reservations/:id", handleReservation)

  .use((req, res) => res.send("Not Found"))
  .listen(8000, () => console.log(`Listening on port 8000`));

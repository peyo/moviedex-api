const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const moviesData = require("./movies-data-small");

const app = express();

app.use(morgan("dev"));
app.use(helmet.hidePoweredBy({ setTo: "PHP 4.2.0" }));
app.use(cors());

const validGenre =
  [
    `Animation`, `Drama`, `Romantic`,
    `Comedy`, `Spy`, `Crime`,
    `Thriller`, `Adventure`, `Horror`,
    `Action`, `History`, `Biography`,
    `Musical`, `Fantasy`, `War`,
    `Grotesque`, `Western`
  ];

const validCountry =
  [
    `United States`, `Italy`, `Great Britain`,
    `France`, `Hungary`, `China`,
    `Canada`, `Germany`
  ];

app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN;
  const authToken = req.get("Authorization");

  if (!authToken || authToken.split(" ")[1] !== apiToken) {
    return res
      .status(401)
      .json({ error: "You made an unauthorized request. Please try again." });
  }
  next();
});

app.get("/genre", (req, res) => {
  res.json(validGenre);
})

app.get("/country", (req, res) => {
  res.json(validCountry);
})

app.get("/movie", (req, res) => {
  const { genre, country, avg_vote } = req.query;
  let response = moviesData;

  if (genre) {
    response = response
      .filter(movieData =>
        movieData
          .genre
          .toLowerCase()
          .includes(genre.toLowerCase())
      );
  };

  if (country) {
    response = response
      .filter(movieData =>
        movieData
          .country
          .toLowerCase()
          .includes(country.toLowerCase())
      );
  };

  if (avg_vote) {
    response = response
      .filter(movieData =>
        movieData
          .avg_vote >= avg_vote
      );
  };

  res.json(response);
});

app.listen(8000, () => {
  console.log("Server started on PORT 8000");
});
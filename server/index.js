const express = require("express");
const request = require("request");
const PORT = 3001;

const app = express();

const mysql = require("mysql");
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "***", // replace with your password
  database: "imdbmovies",
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("mysql connected");
});

// Create DB
app.get("/createdb", (req, res) => {
  let sql = "CREATE DATABASE imdbmovies";
  db.query(sql, (err, result) => {
    if (err) throw err;
    // console.log(result);
    res.send("Database created...");
  });
});

// Create table
app.get("/createmoviestable", (req, res) => {
  let sql =
    "CREATE TABLE movies(id int AUTO_INCREMENT, title VARCHAR(255), director VARCHAR(255), plot VARCHAR(255), poster VARCHAR(255), PRIMARY KEY(id))";
  db.query(sql, (err, result) => {
    if (err) throw err;
    // console.log(result);
    res.send("movies table created...");
  });
});

// will be used in /addmovies, to get the needed information from all the movies we get via /addmovies
const setMoviePromise = (spaceMovie) => {
  return request(
    `http://www.omdbapi.com/?apikey=c9724719&t=${spaceMovie.Title}`,
    (error, response, body) => {
      if (!error && response.statusCode == 200) {
        const movie = JSON.parse(body);
        let newMovie = {
          title: movie.Title,
          director: movie.Director,
          plot: movie.Plot,
          poster: movie.Poster,
        };
        let sql = "INSERT INTO movies SET ?";
        let query = db.query(sql, newMovie, (err, result) => {
          if (err) throw err;
        });
      }
    }
  );
};

// Get all the movies with the wanted parameterd- from 2001 with "Space" in the title
app.get("/addmovies", (req, res) => {
  request(
    "http://www.omdbapi.com/?apikey=c9724719&s=space&y=2001&type=movie",
    (error, response, body) => {
      if (!error && response.statusCode == 200) {
        const allSpaceMovies = JSON.parse(body).Search;
        const moviesPromises = allSpaceMovies.map((spaceMovie) =>
          setMoviePromise(spaceMovie)
        );

        Promise.all(moviesPromises).then(() => {
          res.send("Movies added...");
        });
      }
    }
  );
});



//looking for the searched movie with the parameters sent from the client App.js
app.use(require("body-parser").json());

app.post("/searchedmovies", (req, res) => {
  const searchTitle = `'%${req.body.Title}%'`;
  const searchDirector = `'%${req.body.Director}%'`;
  const searchPlot = `'%${req.body.Plot}%'`;
  const searchResults = [];
  
//to prevent showing results on empty parameters
  if (
    searchTitle === `'%%'` &&
    searchDirector === `'%%'` &&
    searchPlot === `'%%'`
  ) {
    res.json([]);
  } else {
    //searcing the DB and returning the movies to the client
    let sql =
      "SELECT * FROM movies where title like " +
      searchTitle +
      "AND director like " +
      searchDirector +
      "AND plot like " +
      searchPlot;
    let query = db.query(sql, (err, results) => {
      if (err) throw err;

      results.forEach((result) => {
        searchResults.push({
          title: result.title,
          director: result.director,
          plot: result.plot,
          poster: result.poster,
        });
      });

      res.json(searchResults);
    });
  }

});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

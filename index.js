const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const cors = require("cors");

const databasePath = path.join(__dirname, "User.db");

const app = express();

app.use(cors());
app.use(express.json());

let database = null;

const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });
    app.listen(3001, () =>
      console.log("Server Running at http://localhost:3000/")
    );
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

app.get("/data/", async (request, response) => {
  const getMoviesQuery = `
    SELECT
      *
    FROM
      master;`;
  const moviesArray = await database.all(getMoviesQuery);
  response.send(
    moviesArray.map((eachMovie) => ({ movieName: eachMovie.movie_name }))
  );
});

app.post("/newdata/", async (request, response) => {
  try {
    const { id, name, email, gender, status } = request.body;
    const postMovieQuery = `
  INSERT INTO
    master ( id, name, email,gender,status)
  VALUES
    (${id}, '${name}', '${email}','${gender}','${status}');`;
    await database.run(postMovieQuery);
    response.send("Successfully Added");
  } catch (error) {
    console.log(error.message);
  }
});

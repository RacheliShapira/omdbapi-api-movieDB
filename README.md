# omdbapi-api-movieDB
Full stack, client in react.js. movie DB  with omdbapi.com api


Instructions on how to use this repository:
1. Clone this repository to your computer.
2. Run npm install.
3. Set DB on your computer, I used MySQL Workbench.
4. on server/index.js make this changes:
  4.1 Line 11- change the password to your DB password (if needed, change also "user" in line 10).
  4.2 Remove line 12- database: "imdbmovies"
5. Run npm start
6. Create the Database- Navigate to http://localhost:3001/createdb
7. Stop the server and on server/index.js restore the line 12- database: "imdbmovies"
8. Run the server again- npm start
9. Create the table inside the DB- Navigate to http://localhost:3001/createmoviestable
10. Add the movie list (only movies from 2001 with "space" in the title) from the omdbapi api to your DB- Navigate to http://localhost:3001/addmovies

Now you are all set to use the DB and the client as you please!

11. Open a new terminal, cd ./client
12 Run the client with npm start
In the launched web window you can start searching for a movie

const express = require('express')
const app = express();
const port = 5000;

const bcrypt = require('bcrypt');
const saltRounds = 10;

const sqlite3 = require('sqlite3').verbose();

app.use(express.urlencoded({
  extended: true
}))

app.get('/', (req, res) => {
    var index_path = __dirname + '/templates/' + 'index.html';
    res.sendFile(index_path);
})

app.get('/login', (req, res) => {
  var index_path = __dirname + '/templates/' + 'login.html';
  res.sendFile(index_path);
})

app.get('/register', (req, res) => {
  var index_path = __dirname + '/templates/' + 'register.html';
  res.sendFile(index_path);
})

app.post('/register', (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const confirmation = req.body.confirmation;
  if (password !== confirmation) {
    res.redirect("/register")
  };

  bcrypt.hash(password, saltRounds, function(err, hash) {
    // Everything works until now, access hash in the 'hash' variable
    let db = new sqlite3.Database('./database.db', (err) => {
      if (err) {
        console.error(err.message);
      }})
      db.run(`INSERT INTO users (username, email, hash) VALUES(?, ?, ?)`, username, email, hash, function(err) {
        if (err) {
          return console.log(err.message);
        } else {
          console.log("User created!");
        }})
      res.redirect("/profile");
    })
  })

app.get('/profile', (req, res) => {
  var index_path = __dirname + '/templates/' + 'profile.html';
  res.sendFile(index_path);
})


app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})

/*
    let db = new sqlite3.Database('./database.db', (err) => {
      if (err) {
        console.error(err.message);
      }
      db.run(`INSERT INTO users (username, email, hash) VALUES(?, ?, ?)`, username, email, hash, function(err) {
        if (err) {
          return console.log(err.message);
        } else {
          console.log("User created!");
        }
      res.redirect("/profile");
      })
*/
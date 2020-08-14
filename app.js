const express = require('express') // import for express
const app = express();
const port = 5000; // port the app will run on

const bcrypt = require('bcrypt'); // import for password hashing and salting
const saltRounds = 10; // variable for salt length

const sqlite3 = require('sqlite3').verbose(); // import for sqlite3 (database functionality)

const session = require('express-session'); // import for sessions

// Middleware
app.use(session({
  secret: "q_z%?q^;P4HKYnj'U<L$fKZ2%&b//'VCaPDrm*;#q4H",
  saveUninitialized: true,
  resave: true}));
// Change the secret key if you want to use this for production (and move to .env file)

app.use(express.urlencoded({
  extended: true
}))

// GET Routes

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

// POST Routes

app.post('/register', (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const confirmation = req.body.confirmation;

  if (password !== confirmation) {
    res.redirect("/register")
  };

  let sess = req.session;

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

      let idSql = "SELECT id id FROM users WHERE username=(?)";
      db.get(idSql, [username], (err, row) => {
        if (err) {
          return console.error(err.message);
        };
        sess.user_id = row.id;
        // console.log("User session id: " + sess.user_id);
        res.redirect("/");
    })
  })
})
  

app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // console.log("Username: " + username);
  
  var id;
  var hash;

  let sess = req.session;

  /*
  function fetchone(sql, property) {
    db.get(sql, [property], (err, row) => {
      if (err) {
        return "Unsuccessful hash selection!";
      };
      return row.value;
    })
  }
  */

  let db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
      console.log("Unsuccessful database connection!");
    } 

    // Select user id
    let idSql = "SELECT id id FROM users WHERE username=(?)";
    db.get(idSql, [username], (err, row) => {
      if (err) {
        return console.error(err.message);
      };
      id=row.id;
      // console.log("ID: " + id);
          // Selects the hash for the user id
      let hashSql = "SELECT hash FROM users WHERE username=(?)"
      db.get(hashSql, [username], (err, row) => {
        if (err) {
          return console.log("Unsuccessful hash selection!")
        };
        hash = row.hash;
        // console.log("Password hash: " + hash)
                // Compares the password hash to the one in the database
        bcrypt.compare(password, hash, function(err, result) {
          if (result == true) {
            sess.user_id = id;
            // console.log("Id in session: " + sess.user_id);
            res.redirect("/");
          } else {
            res.redirect("/login");
          }
        });
      })
    })
  })
})

// Running the server

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
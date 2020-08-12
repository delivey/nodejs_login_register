const express = require('express')
const app = express()
const port = 5000

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
})
app.get('/profile', (req, res) => {
  var index_path = __dirname + '/templates/' + 'profile.html';
  res.sendFile(index_path);
})



app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
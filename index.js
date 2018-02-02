const express = require('express'),
  bodyParser = require('body-parser'),
  customCors = require('./customCors'),
  axios = require('axios');

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(customCors.allow);

//REFATORAR extractToken
const extractToken = (data) => {
  return data.split('=')[1].split('&')[0];
}

const CLIENT_ID = '2a4d09cfa80c8fdce2b6';
const CLIENT_SECRET = '43de0231e10c595f8310d373f644859112ed900a';

const requestToken = (code, callback) => {
  axios.post('https://github.com/login/oauth/access_token', {
    code,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET
  })
  .then(res => {
    const token = extractToken(res.data);
    callback(token);
  })
  .catch(err => {
    callback(err);
  });
}

const CLIENT_URL = 'https://onluiz.github.io/inv-github-search/docs/#/home';
app.get('/login/github/return', function(req, res) {
  const code = req.param('code');
  res.redirect(`${CLIENT_URL}/${code}`);
});

app.get('/login/github/token', function(req, res) {
  const code = req.param('code');
  requestToken(code, function(token) {
    res.json({ token });
  })
})

console.log('app is running on 3000');
app.listen(3000);
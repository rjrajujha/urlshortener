require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');

// shortUrl Object 
let shortUrl = {};
let keyCount = '1';

//Validate URLs
function isValidHttpUrl(string) {
  try {
    const newUrl = new URL(string);
    return newUrl.protocol === 'http:' || newUrl.protocol === 'https:';
  } catch (err) {
    return false;
  }
}

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
// app.use(bodyParser.json())

app.post('/api/shorturl', (req, res) => {
  const url = req.body.url;
  if (isValidHttpUrl(url)) {
    shortUrl[keyCount] = url;
    res.send({ "original_url": url, "short_url": parseInt(keyCount) });
    console.log(shortUrl);
    keyCount = (parseInt(keyCount) + 1).toString();
  }
  res.send({ error: 'invalid url' })
})

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.get('/api/shorturl/:id', (req, res) => {
  let qid = req.params.id;
  console.log(shortUrl[qid]);
  if(shortUrl[qid] === undefined){
    res.send({ error: 'invalid url' });
  }
  res.redirect(shortUrl[qid]);
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

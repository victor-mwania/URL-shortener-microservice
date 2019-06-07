const express = require('express');
const mongoose = require('mongoose');
const valid_url = require('valid-url');
const Url = require('./models/url');
const bodyParser = require('body-parser')
const cors = require('cors');
const shortid = require('shortid')
const app = express();

// Basic Configuration 
const port = process.env.PORT || 3000

/** this project needs a db !! **/
mongoose.connect('mongodb://victor:victor1234@cluster0-shard-00-00-vfoph.mongodb.net:27017,cluster0-shard-00-01-vfoph.mongodb.net:27017,cluster0-shard-00-02-vfoph.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true', {
  useNewUrlParser: true
});

app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())
app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.get("/:code", function (req, res) {
  let shortCode = req.params.code
  Url.findOne({
    urlCode: shortCode
  }).then(response => {
    if (!response) res.send({
      "error": "The url was not found, please try again"
    })
    res.redirect(response.originalUrl)
  })
})
app.post("/api/shorturl/new", function (req, res) {
  let uri = req.body.url;
  if (valid_url.is_uri(uri)) {
    let code = shortid.generate()
    let shortUrl = 'https://lty-short.herokuapp.com/'+ code

    let url = new Url({
      originalUrl: uri,
      urlCode: code,
      shortUrl: shortUrl
    })

    url.save().then(response => {
      res.json({
        "original_url": response.originalUrl,
        "short_url": response.shortUrl
      })
    })
  } else {
    res.send({
      "error": "invalid URL"
    })
  }
})

app.listen(port, function () {
  console.log('Node.js listening ... ' + port);
});
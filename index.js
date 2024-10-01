require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const dns = require('dns');
const { is } = require('express/lib/request');
app.use("/",bodyParser.urlencoded({extended: false}))
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.post('/api/shorturl',(req,res) => {
  const original_url = req.body.url;

  if(!isURL(original_url.toString)) {
    res.json({"error" : "invalid url"});
  }
  else{
    const urlObject = new URL(original_url);
    dns.lookup(urlObject.hostname, (err, address, family) => {
      if (err) {
        res.json({
          originalURL: originalURL,
          shortenedURL: "Invalid URL"
        });
      } else {
        var shortenedURL = Math.floor(Math.random() * 100000).toString();
        res.json({"original_url": original_url, "short_url": shortenedURL})
      }
    })
  }
})
function isURL(str) {
  var pattern = new RegExp("(http|ftp|https)://[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:/~+#-]*[\w@?^=%&amp;/~+#-])?");
  return pattern.test(str);
}
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

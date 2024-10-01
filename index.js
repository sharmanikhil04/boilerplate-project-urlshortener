require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const dns = require('dns');
mongoose = require('mongoose')
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true ,useCreateIndex: true});

const Schema = mongoose.Schema;

const urlSchema = new Schema({
  original_url: {type: String , required: true},
  shortened_url: String
});
const UrlModel = mongoose.model('UrlModel', urlSchema);
app.use("/",bodyParser.urlencoded({extended: false}))
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.post('/api/shorturl',(req,res) => {
  const original_url = req.body.url;
  console.log(original_url)
  //if(!isURL(original_url)) {
  //res.json({"error" : "invalid url"});
  //}
  //else{
  try{
    const httpRegex = /^(http|https)(:\/\/)/; if (!httpRegex.test(original_url)) {return res.json({ error: 'invalid url' })}
    const urlObject = new URL(original_url);
    dns.lookup(urlObject.hostname, (err, address, family) => {
      if (err) {
        res.json({
          originalURL: original_url,
          shortenedURL: "Invalid URL"
        });
      } else {
        var shortenedURL = Math.floor(Math.random() * 100000);
        var testurl = new UrlModel({"original_url": original_url, "shortened_url": shortenedURL});

        testurl.save(function(err,data){
          if (err) return console.error(err);
          res.json({"original_url": original_url, "short_url": shortenedURL})
          // done(null, data);
        });

      }
    })
  }
  catch(error){

    res.json({"error" : "invalid url"});
  }
  //}
})
app.get('/api/shorturl/:shortUrl',(req,res) =>{
  console.log(req.params)
  const findurl = req.params['shortUrl'];
  UrlModel.find({shortened_url: findurl }, function (err, urlmodelFound) {

    if (err) {
      return console.log(err);
    }
    res.redirect(urlmodelFound[0].original_url);
  });
})
function isURL(str) {
  var pattern = new RegExp("(http|ftp|https)\:\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:/~+#-]*[\w@?^=%&amp;/~+#-])?");
  console.log(pattern.test(str))
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

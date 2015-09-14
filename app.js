var port = 8080;
var express = require('express');
var https = require('https');
var app = express();
var accessToken = null;

app.use(express.static('public'));

app.get('/api/wxshare', function(req, res) {
  getAccessToken();
  res.send({status: 'ok'});
});

app.listen(port);

console.log('Listening on port ', port);

function getAccessToken() {
  var options = {
    hostname: 'api.weixin.qq.com',
    port: 443,
    path: '/cgi-bin/token?grant_type=client_credential&appid=wx89a57ae8fc980ad9&secret=368ca130c61d50cdeea86b9834414181',
    method: 'GET'
  };
  
  https.request(options, function(res) {
    console.log('STATUS: ' + res.statusCode);
    console.log('HEADERS: ' + JSON.stringify(res.headers));
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      console.log('BODY: ' + chunk);
      accessToken = chunk;
    });

    res.on('error', function(e) {
      console.log('request error:',  e);
    });
  }).end();
}

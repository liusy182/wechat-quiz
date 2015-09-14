var port = 8080;
var express = require('express');
var https = require('https');
var crypto = require('crypto');
var app = express();

var accessToken = null;
var jsApiTicket = null;

app.use(express.static('public'));

app.get('/api/wxshare', function(req, res) {
  var now = new Date().getTime();
  if(accessToken === null || jsApiTicket === null
    || now - accessToken.lastUpdateTime > 7100000
    || now - jsApiTicket.lastupdateTime > 7100000){
    getAccessToken(res);  
  } else {
    reply(res);
  }
});

app.listen(port);

console.log('Listening on port ', port);

function getAccessToken(res) {
  var options = {
    hostname: 'api.weixin.qq.com',
    port: 443,
    path: '',
    method: 'GET'
  };
  var dataCallback = function (chunk) {
    console.log('getAccessToken: ' + chunk);
    var chunkObject = JSON.parse(chunk);
    if(chunkObject.access_token){
      accessToken = {
        value: chunkObject.access_token,
        lastUpdateTime: new Date().getTime()
      };
      getJsApiTicket(res);
    } else {
      console.log('getAccessToken failed.');
    }
  };
  httpsRequest(options, dataCallback);
}


function getJsApiTicket(res) {
  var options = {
    hostname: 'api.weixin.qq.com',
    port: 443,
    path: '/cgi-bin/ticket/getticket?access_token=' + accessToken.value + '&type=jsapi',
    method: 'GET'
  };
  var dataCallback = function (chunk) {
    console.log('getJsApiTicket: ' + chunk);
    var chunkObject = JSON.parse(chunk);
    if(chunkObject.ticket){
      jsApiTicket = {
        value: chunkObject.ticket,
        lastupdateTime:  new Date().getTime()
      };
      reply(res);
    } else {
      console.log('getJsApiTicket failed.');
    }
  };

  httpsRequest(options, dataCallback);
}

function httpsRequest(options, dataCallback, errorCallback) {
  https.request(options, function(res) {
    console.log('STATUS: ' + res.statusCode);
    console.log('HEADERS: ' + JSON.stringify(res.headers));
    res.setEncoding('utf8');
    if(dataCallback){
      res.on('data', dataCallback);
    }
    if(errorCallback) {
      res.on('error', errorCallback);
    }
  }).end();
}

function reply (res) {
  var shaOne = crypto.createHash('sha1');
  var noncestr = crypto.randomBytes(24).toString('hex');

  var timestamp = new Date().getTime();
  var url = 'http://localhost:8080/index.html';
  var string1 = 'jsapi_ticket=' + jsApiTicket + 
    '&noncestr=' + noncestr + 
    '&timestamp=' + timestamp + 
    '&url=' + url;
  shaOne.update(string1, 'utf8');
  res.send({
    status: 'ok',
    appId: 'wx89a57ae8fc980ad9',
    nonceStr: noncestr,
    timestamp: timestamp,
    signature: shaOne.digest('hex'),
  });
}

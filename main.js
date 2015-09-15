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

app.set('port', process.env.PORT || 3000);
var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});

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
  var noncestr = crypto.randomBytes(24).toString('base64');
  var timestamp = new Date().getTime();
  var url = 'http://default-environment-zfjyjakfyk.elasticbeanstalk.com/index.html';
  var string1 = 'jsapi_ticket=' + jsApiTicket.value + 
    '&noncestr=' + noncestr + 
    '&timestamp=' + timestamp + 
    '&url=' + url;
  console.log('string1 is: ', string1);
  shaOne.update(string1, 'utf8');
  var signature = shaOne.digest('hex');
  console.log('signature is: ', signature);
  res.send({
    status: 'ok',
    appId: 'wx89a57ae8fc980ad9',
    nonceStr: noncestr,
    timestamp: timestamp,
    signature: signature,
  });
}

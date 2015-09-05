

var gPageIndex = 0;
var gPageCount = 0;
var gTotalScore = 0;
var gCityIndex = 0;
var gPlaceIndex = 0;

var gCharacter = '';
var gPlace = '';
var gShareString = '测一测你是哪类精英！';

var questionData = [
  ["你居住在哪个城市", ["北京", 10], ["上海", 11], ["广州", 12]],
  ["问题1: 你逃过几次课", ["0次", 0], ["10次以内", 1], ["10次以上", 2]],
  ["问题2: 你被爸妈打最多的是什么部位", ["最顺手的掴耳光", 1], ["提着裤子卸皮带抽小腿", 2], ["象征性抬手", 0]],
  ["问题3: 几岁早恋", ["我情商高，学龄前", 2], ["萌动发育时", 1], ["我情商低，没有早恋", 0]],
  ["问题4: 你考过最低几分", ["和马云一样考过1分", 2], ["和小明一样考过40分", 1], ["呵呵，没不及格过", 0]],
  ["问题5: 你现在和谁住", ["我爱爸妈，和父母住", 0], ["土豪自己住", 1], ["人脉王，蹭别人的床", 2]],
  ["问题6: 你吃过蛹吗", ["开玩笑，蛆都吃过", 2], ["开玩笑，那么恶心我怎么会吃", 0], ["嚼过，吐了", 1]],
  ["问题7: 你喜欢以下哪种妆容", ["欧美前端Ladygaga", 2], ["最美韩妆千颂伊", 0], ["男女通吃的金星", 1]],
  ["问题8: 你看什么载体的书", ["装逼用的纸质书", 1], ["Bigger Kindle", 0], ["我是说书的", 2]],
  ["问题9: 早上怎么去公司", ["我soho", 2], ["都行，能到就行", 0], ["睡公司", 1]],
  ["问题10: 你每天睡几觉", ["一天一觉", 0], ["一天两觉", 1], ["两天一觉", 2]]
];

var questionResult = [
  [0, 2, "学霸精英", ["学院路", "松江大学城", "广州大学城"]],
  [3, 5, "IT精英", ["中关村", "张江", "天河区"]],
  [6, 7, "金融精英", ["国贸", "陆家嘴", "西塔"]],
  [8, 10, '美食精英', ['簋街', '定西路', '上下九']],
  [11, 13, '时尚精英', ['王府井', '新天地', '珠江新城']],
  [14, 16, '艺术精英', ['798', 'M50', '二沙岛']],
  [17, 18, '创业精英', ['五道口', '漕河泾开发区', '流窜在广州各处']],
  [19, 20, '装逼精英', ["三里屯", "淮海路", "沙面"]]
];

var questionTemplate = '<div class="page question-page">\
<div class="question-body question-border">\
<div class="question-item question-title">{0}</div>\
<div class="question-item question-answer" onclick="nextPage({4})">{1}</div>\
<div class="question-item question-answer" onclick="nextPage({5})">{2}</div>\
<div class="question-item question-answer" onclick="nextPage({6})">{3}</div>\
</div></div>';

function addFormatFunction() {
  String.prototype.format = function () {
    var formatted = this;
    for (var i = 0; i < arguments.length; i++) {
      var regexp = new RegExp('\\{' + i + '\\}', 'gi');
      formatted = formatted.replace(regexp, arguments[i]);
    }
    return formatted;
  };
}

function loadQuestions() {
  addFormatFunction();
  var questionHTML = '';
  for (var index = 0; index < questionData.length; index++) {
    var e = questionData[index];
    questionHTML += questionTemplate.format(e[0], e[1][0], e[2][0], e[3][0], e[1][1], e[2][1], e[3][1]);
  }
  $("#question-container").html(questionHTML);
}

function judgeWhereYouAre() {
  var index = -1;
  for (var i = 0; i < questionResult.length; ++i) {
    var ele = questionResult[i];
    if (gTotalScore >= ele[0] && gTotalScore <= ele[1]) {
      index = i;
      break;
    }
  }

  gCharacter = questionResult[index][2];
  gPlace = questionResult[index][3][gCityIndex];

  gPlaceIndex = index;
}

function showResult() {
  judgeWhereYouAre();
  $("#result-character").html(gCharacter);
  $("#result-city").html(questionData[0][gCityIndex + 1][0]);
  $("#result-place").html(gPlace);

  var imageX = 198 * gCityIndex;
  var imageY = 142 * gPlaceIndex;
  var resultImageMarginLeft = $(".result").width() / 2 - 198 / 2;
  
  // set place image
  var resultImage = $("#result-image");
  resultImage.css('background-position', "-" + imageX + "px -" + imageY + "px");
  resultImage.css('margin-left', resultImageMarginLeft);
  
  // set place image filter
  var resultImageFilter = $("#result-image-filter");
  resultImageFilter.css("left", resultImage.position().left + 2);
  resultImageFilter.css('top', resultImage.position().top + 2);
  resultImageFilter.css('margin-left', resultImageMarginLeft);
}

function nextPage(score) {
  if (score < 10) gTotalScore += score;
  gPageIndex += 1;

  if (score >= 10) {
    gCityIndex = score - 10;
  }

  if (gPageIndex >= gPageCount) {
    gPageIndex = 0;
  }
  showPage(gPageIndex);

  if (gPageIndex == gPageCount - 2) {
    showResult();

    gShareString = document.title = "我是" + gCharacter + ", 混迹于" + gPlace + ", 测测你在哪混";
    setupWXShare();
    sendData("result", gTotalScore + "|" + document.title);
  }
}

function hideAllPages() {
  $(".page").hide();
};
    
// page index counts from 0
function showPage(pageIndex) {
  hideAllPages();
  var page = $(".page")[pageIndex];
  page.style.display = "block";
}

function sendData(title, detail) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", "http://114.215.201.178:8079/info?title=" + title + "&detail=" + detail + "&app_name=anjuke", true);
  xmlHttp.send(null);
}

function showShareFriend() {
  $(".share-to-friend").show();
}

function closeShareFriend() {
  $(".share-to-friend").hide();
}


$(document).ready(function () {
  $("body").width($(window).width());
  $("body").height($(window).height());

  loadQuestions();
  gPageIndex = gTotalScore = gCityIndex = gPlaceIndex = 0;
  gCharacter = gPlace = '';

  gPageCount = $(".page").length;
  showPage(gPageIndex);

  sendData("enter", "startplay");
  
  setupWXShare();
});

function setupWXShare() {
    // get json
    $.ajax({
    // test url in localhost
    //url: 'http://192.168.31.190:8080/wxjsinfo.php',
    url: 'http://www.miugodigital.com/apps/wxjs/wxjsinfo.php',
    type: 'get',
    cache: true,
    dataType: 'json',

    success: function (data, textStatus) {
      console.log(data);
      initWXJS(data);
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      console.log(textStatus);
    }
    });

    function initWXJS(data) {
    console.log("test data from php");
    console.log(data);
    wx.config({
      debug: false,
      appId: data['appId'],
      timestamp: data['timestamp'],
      nonceStr: data['nonceStr'],
      signature: data['signature'],
      jsApiList: [
      // 所有要调用的 API 都要加到这个列表中
        'checkJsApi',
        'onMenuShareTimeline',
        'onMenuShareAppMessage'
      ]
    });
    wx.ready(function () {
      // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
      console.log('ready');
      // alert('ready');
      
        wx.onMenuShareAppMessage({
          title: '安居客精英地图',
          desc: gShareString,
          link: 'http://www.miugodigital.com/apps/anjuke',
          imgUrl: 'http://www.miugodigital.com/apps/anjuke/resources/images/share-pic.jpg'
        });

      // 2.2 监听“分享到朋友圈”按钮点击、自定义分享内容及分享结果接口
        wx.onMenuShareTimeline({
          title: gShareString,
          link: 'http://www.miugodigital.com/apps/anjuke',
          imgUrl: 'http://www.miugodigital.com/apps/anjuke/resources/images/share-pic.jpg'
        });
    });
    wx.error(function (res) {
      // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
      console.log(res);
    });
    }
}
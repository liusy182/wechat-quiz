'use strict';

var gBaseUrl = 'http://localhost:8080'
var gShareString = '';
var gShareImage = '';

var questionData = [
  [/*1*/"周一早上你走进办公室时发现有位西装笔挺的年轻人坐着，你认为他是来找老总谈工作的客人吗？", 
    ["是", 4], ["不是", 2]
  ],
  [/*2*/"老板临时要你加入帮忙解决一个棘手得到项目，你认为他是什么意图？", 
    ["想测试你的能力，提拔你", 6], ["想给你加活做，刁难你", 4]
  ],
  [/*3*/"组里的新同事跟老板很聊得来很熟络，你会觉得有“猫腻”吗恋", 
    ["有", 5], ["没有", 8]
  ],
  [/*4*/"同事被上司单独叫去办公室开会，你认为上司是不满意他的工作表现吗？", 
    ["是", 11], ["不是", 6]
  ],
  [/*5*/"下班后从洗手间出来，你发现所有人都不在办公室，你会继续留下来加班吗？", 
    ["是", "'A'"], ["不", 9]
  ],
  [/*6*/"老板突然问起你正在负责的工作项目，你会认为他对你不够信任吗？吗", 
    ["会", 7], ["不会", 12]
  ],
  [/*7*/"公司里最近招了不少应届毕业生，是你心目中较为满意的吗？", 
    ["是", 11], ["不是", 9]
  ],
  [/*8*/"你会洞察到办公室的同事每天的心情变化吗？", 
    ["会，我比较敏感", 11], ["不会，我对这些比较迟钝", 12]
  ],
  [/*9*/"有个同事突然成为大家谈话的焦点，你也会有意关注他吗？",
    ["会，好奇", 10], ["不会，专注做自己的", 11]
  ],
  [/*10*/"你会重视那些老板身边的左右手，“心腹”吗？", 
    ["是", 12], ["不是", 11]
  ],
  [/*11*/"公司举办的各种活动你是不是都很乐于参加？",
    ["是", "'B'"], ["不是", 12]
  ],
  [/*12*/"你是不是很重视来到你办公桌前的每一个人？", 
    ["是", "'C'"], ["不是", "'D'"]
  ]
];

var questionResult = {
  A: {
      type: "A型的你", 
      title: "温顺的小绵羊", 
      img: "images/sheep.png", 
      description: "你为人善良简单，喜欢过安定平稳的小日子。由于自己与世不争的平和态度，办公室的同事们其实都跟你相处的舒服融洽。对于工作和职场，虽然你并没有太大的野心，但是工作态度认真，只希望能做好份内的工作。需要注意有时人太好的你，可能会被别有用心的人欺负哦！小绵羊要保护自己哦~"
    },
  B: {
      type: "B型的你", 
      title: "热情乐天的哈士奇", 
      img: "images/dog.png", 
      description: "你是热情乐天的哈士奇。对于你来说，公司同事相处是否开心融洽比做什么更重要。你乐于助人，喜欢神扯，有时也能成为公司里的开心果。有你在公司气氛总不会太差。只是大咧咧的你有时候对办公室里的风吹草动比较后知后觉。切记还是要眼观六路，耳听八方，三思而后言哦。否则哈士奇族人真的被误认为二，岂不是很冤~"
    },
  C: {
      type: "C型的你", 
      title: "智商爆表的猫星人", 
      img: "images/cat.png", 
      description: "猫星人的聪明才智超乎想象。你有敏锐的观察力，又不乏理性的分析能力。面对同样一件工作，你总有最佳的处理方式，所以同事都喜欢向你讨教“锦囊妙方”。你当然也很享受给人出谋划策的成就感，这也使你在公司里小有名气。只是有一套自己的原则的你，不太愿意做违心之事或者像上级妥协，有时可能会因此和同事老板起冲突。喵星人如果愿意适时放下些身段， 可能在职场就所向披靡咯！"
    },
  D: {
      type: "D型的你", 
      title: "披着羊皮的狼", 
      img: "images/wolf.png", 
      description: '在你和善亲切的外表下，可是藏着一颗永不满足的狂野之心哦。你天资聪颖，能够洞察同事的内心和揣摩上司的意图，属于办公室“大师级”人物。你冷静理智又不失热情，总是不动声色地替同事解决工作困难，所以你获得很多好评。别看你表面上一副与世无争的亲和，其实你很清楚自己要的是什么，以及为了目标该牺牲什么或争取什么。于悠哉游哉的工作态度中螺旋式上升，你这只披着羊皮的狼，可以说是“杀人于无形”啊！'
    }
};

var questionTemplate = '<div class="page question-page">\
<div class="question-body question-border">\
<div class="question-item question-title">{0}</div>\
<div class="question-item question-answer" onclick="nextPage({3})">{1}</div>\
<div class="question-item question-answer" onclick="nextPage({4})">{2}</div>\
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
    questionHTML += questionTemplate.format(e[0], e[1][0], e[2][0], e[1][1], e[2][1]);
  }
  $("#question-container").html(questionHTML);
}


function showResult(characterType) {
  var result = questionResult[characterType];
  $("#result-character").html(result.type);
  $("#result-title").html(result.title);
  $("#result-image").html('<img src="' + result.img + '" />');
  $("#result-description").html(result.description);
  
  gShareString = "我是职场中" +  result.title +  "，你呢？";
  gShareImage = result.img;
  hideAllPages();
  $(".page").last().show();
}

function nextPage(index) {
  if(isNaN(index)){
    showResult(index);

    setupWXShare();

  } else {
    showPage(index);
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
  showPage(0);

  setupWXShare();
});

function setupWXShare() {
    // get json
    $.ajax({
    url: gBaseUrl + '/api/wxshare',
    type: 'get',
    cache: true,
    dataType: 'json',

    success: function (data, textStatus) {
      console.log('ajax result: ', data);
      initWXJS(data);
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      console.log('ajax error: ', textStatus);
    }
    });

    function initWXJS(data) {
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
      wx.onMenuShareAppMessage({
        title: '百思拓',
        desc: gShareString,
        link: 'TODO: the link where this website is hosted - to be decided',
        imgUrl: gShareImage
      });

    // 2.2 监听“分享到朋友圈”按钮点击、自定义分享内容及分享结果接口
      wx.onMenuShareTimeline({
        title: gShareString,
        link: 'TODO: the link where this website is hosted - to be decided',
        imgUrl: gShareImage
      });
    });
    wx.error(function (res) {
      // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
      console.log(res);
    });
    }
}
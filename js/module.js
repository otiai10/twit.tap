/**
 * module.js
**/

var _twitter_url = 'http://search.twitter.com/search.json';
var _params = {
  page  :             1,
  q     : '#nowplaying',
  lang  :          'ja',
  rpp   :         '200',
};

var _youtube_url = 'http://gdata.youtube.com/feeds/api/videos';
var _youtube_params = {
  alt         :   'json',
  q           :       '',
  category    :  'Music',
};

var __entry_list = [];
var __index = -1;

var __buffer_twitter = [];
var __buffer_youtube = [];

function getTweet(_params){
  $.ajax({
    type    :   'GET',
    url     :   _twitter_url,
    data    :   _params,
    dataType:   'jsonp',
    success :   function(response){
        //_params.since_id = response.max_id;
        //_params.page   = (parseInt(_params.page) + 1);
        if(response.error === void 0){
            if(response.results.length !== 0){
                __buffer_twitter = response.results;
                for(i=0;i<response.results.length;i++){

                    end_flag = (i == (response.results.length - 1)) ? true : false;
                    searchYoutube(__buffer_twitter[i],i,end_flag);

                }
            }else{
                // console.log('Do Nothing');
            }
/** auto upload false
            setTimeout(function(){
                return getTweet(_params);
            },(60*1000));
**/
        }else{
            if (response.error.match(/limited/g)) {
                alert("Twitterの検索API使い過ぎだって\n叱られてしまったお...\n_(:3 ∠ )_\nこの曲が終わるくらいには回復してるかも");
            }
        }
    },
    error   :   function(err){
        console.log(err);
    },
  });
}

function init(){
  getURLQuery();
  checkBrowser();
  $("ul#twitter_results>li.search>div>span>span#time_detail").html(getTimeStr());
  $("div#social").hide();
  showLaoding();
  var hash_once = getInitialHashAndTitle();
  swfobject.embedSWF(
    "http://www.youtube.com/v/" + hash_once.hash + "?enablejsapi=1&autoplay=1&playerapiid=player",
    "video","420","300","8",null,null,{allowScriptAccess:"always"},{id:"player"    }
  );
  _params.q += '+初音ミク';
  getTweet(_params);
}

function searchYoutube(entry, key_in_buffer, end_flag){
  query = cleanText(entry.text);
  query = urlComponent(query);
  _youtube_params.q = query;
  // to improve query logic
  __buffer_twitter[key_in_buffer].youtube_query = query;
  $.ajax({
    type    :   'GET',
    url     :   _youtube_url,
    data    :   _youtube_params,
    dataType:   'jsonp',
    success :   function(response){
      if(response.feed.entry !== void 0){
        // youtubeの検索結果があった
        for(i=0; i<response.feed.entry.length; i++){
            if(response.feed.entry[i].category[1].term === 'Music' && response.feed.entry[i].media$group.yt$duration.seconds < 480){
                // これはいい感じのyoutubeなので、プレイリストに入れる
                pushGoodVideo(response.feed.entry[i], key_in_buffer);
                // いい感じのyotubeだったので、これ以上youtube検索結果は見ない
                break;
            }else{
                // いい感じのyoutubeじゃなかったので、次のyoutubeを見る
                continue;
            }
        }
      }else{
        // そもそもyoutubeの検索結果が無かった
      }
      // これがtweet検索結果的に最後のエントリなのであれば、showResultしちゃう
      if(end_flag == true){
          showResult();
      }
    },
    error   :   function(err){
        console.log(err);
    },
  });
}

function showResult(){
    // remove loader
    __entry_list = filterEntryByKeywords(__entry_list);
    $("li#loader_wrapper").fadeOut(1000,function(){
        // drawList
        drawList(__entry_list);
        $('ul#twitter_results').append(getLoadMoreArea({}));
    });
}

function pushGoodVideo(entry, key_in_buffer){
    youtube_hash = getHash(entry.id.$t);
    __buffer_twitter[key_in_buffer].youtube_hash  = youtube_hash;
    __buffer_twitter[key_in_buffer].youtube_title = entry.title.$t;
    __entry_list.push(__buffer_twitter[key_in_buffer]);
}

function drawList(list){
    for(var i in list){
        li = document.createElement('li');
        $(li).addClass('entry').addClass('boxy').addClass('results');
        //$(document.createElement('div')).html(list[i].youtube_title).appendTo($(li));
        $(li).appendTo('ul#twitter_results');
        params = {
            user_icon   : list[i].profile_image_url,
            text        : list[i].text,
            uniquelink  : getUniqueLink(list[i].from_user,list[i].id_str),
            ctime       : getTimeStr(list[i].created_at),
            userlink    : getUserLink(list[i].from_user),
            user_name   : list[i].from_user,
            id_str      : list[i].id_str,
            pl_index    : i,
            yt_hash     : list[i].youtube_hash,
            yt_title    : list[i].youtube_title,
            yt_query    : list[i].youtube_query,
        }
        $(li).append(getListContent(params));
    }
    __index = 0; // index is global always
    playByIndex();
}

function cleanText(str){
    query = 
        str.replace(/#\S+/gi,'')
        .replace(/#\S$/gi,'')
        .replace(/@\S+/gi,'')
        .replace(/@\S$/gi,'')
        .replace(/http:.+\ /g,'')
        .replace(/http:.+$/g,'')
        .replace(/\//g,'')
        .replace(/"/g,'')
        .replace(/now/gi,'')
        .replace(/playing/gi,'')
        .replace(/[\ ]rt/gi,'')
        .replace(/^rt/gi,'')
        .replace(/♪/g,'')
        .replace(/♫/g,'')
        .replace(/♬/g,'')
        .replace(/♡/g,'')
        .replace(/♥/g,'');
    return query;
}

function urlComponent(str){
    str =
        str.replace(/\ /g,'+')
        .replace(/\+$/,'')
        .replace(/^\+/,'');
    return str;
}

function getHash(url){
    return url.replace('http://gdata.youtube.com/feeds/api/videos/','');
}

function getUniqueLink(user,id_str){
    return 'https://twitter.com/' + user + '/status/' + id_str;
}

function getTimeStr(time_str){
    if(time_str == void 0){
        time = new Date();
    }else{
        time = new Date(time_str);
    }
    to_str = parseInt(1900+time.getYear())+'/'+('0'+(time.getMonth()+1)).slice(-2)+'/'+('0'+time.getDate()).slice(-2)+'  '+('0'+time.getHours()).slice(-2)+':'+('0'+time.getMinutes()).slice(-2)/** +':'+('0'+time.getSeconds()).slice(-2) **/;
    return to_str;
}

function getUserLink(user){
    return 'https://twitter.com/' + user;
}

window.onscroll = function(){
    if(window.scrollY > 3000){
        $("div#social").fadeIn(300);
    }else{
        $("div#social").fadeOut(300);
    }
}

function openTweet(e){
    option = "width=720,height=280"; //,left=" + e.clientX + ",top=" + e.clientY;
    text = getTweetText();
    window.open('https://twitter.com/intent/tweet?lang=en&text=' + text ,"",option);
}

function getTweetText(){
    console.log(__entry_list[__index]);
    youtube_query = __entry_list[__index].youtube_query;
    text = 'ｺﾚｼﾞｬﾅｲ!!query> ' + youtube_query + ' http://otiai10.com/twit.tap/';
    return text;
}

function checkBrowser(){
    if(navigator.userAgent.indexOf("Chrome") > 0){
        //alert('Chromeっすね');
    }else{
        alert("Chromeじゃないとうごきませんからねっ( ﾟдﾟ )ｸﾜｯ!!");
        if(confirm("Chromeブラウザのインストールはめっちゃかんたんです\nちょっと見に行く？")){
            window.location.href = 'http://www.google.com/intl/ja/chrome/browser/';
        }else{
        }
    }
}

function getURLQuery(){
    query = window.location.search.substring(1);
/**
    if(query.match(/^q=/)){
        console.log(decodeURIComponent(query.replace(/^q=/,'')));
    }
**/
    //console.log(decodeURIComponent(query));
    //TODO: GET値を反映させるなら、tweetボタンのURLは「現在のウェブページのURL」では不適
}

function switchBackgroundImage(vocalo){
    src = './src/vocaloids/' + vocalo + '.png';
    $('body').css({
       backgroundImage : 'url(' + src + ')',
    });
    _params.q = '#nowplaying+';
    target_name = '';
    switch(vocalo){
        case 'gumi':
            _params.q += 'GUMI';
            target_name = 'GUMI';
            break;
        case 'teto':
            _params.q += '重音テト';
            target_name = 'テトさん';
            break;
        case 'miku':
            _params.q += '初音ミク';
            target_name = 'ミクさん';
            break;
        case 'luka':
            _params.q += '巡音ルカ';
            target_name = 'ルカさん';
            break;
        case 'rinlen':
            _params.q += '鏡音リン+OR+#nowplaying+鏡音レン';
            target_name = 'リンちゃんレンちゃん';
            break;
        case 'ia':
            _params.q += 'IA';
            target_name = 'IAさん';
            break;
        default:
            _params.q += '初音ミク';
    }
    __entry_list = [];
    __index      =  0;
    $("ul#twitter_results").html('');
    data = {
        'target' : target_name,
        'now'    : getTimeStr(),
    };
    $("ul#twitter_results").append(getSearchTemplate(data));
    pageScroll('index-1');
    showLaoding();
    getTweet(_params);
}

function switchBlackImage(obj, vocalo){
    $(obj).attr({
        'src' : 'src/vocaloids/' + vocalo + '.png',
    });
}

function recoverImage(obj, vocalo){
    $(obj).attr({
        'src' : 'src/vocaloids/' + vocalo + '-b.png',
    });
}

function showLaoding(){
    $("ul#twitter_results").append('<li id="loader_wrapper" class="entry" ><div id="loader"><!--img id="guruguru" src="src/loading.png"--><img id="hachunemiku" src="src/hachu.gif"><br>loading</div></li>').hide().fadeIn(400);
}

function shareThisVideo(){
    text = __entry_list[__index].youtube_title + ' ' + 'http://youtu.be/' + __entry_list[__index].youtube_hash;
    option = "width=720,height=280";
    window.open('https://twitter.com/intent/tweet?lang=en&hashtags=nowplaying&text=' + text ,"",option);
}

function filterEntryByKeywords(list){
    purified_list = [];
    for(var i in list){
        // ブラックリスト
        if(true){
        }else{
        }
        // ホワイトリスト
        if(list[i].youtube_title.match(/初音|ミク|Hatsune|Miku|巡音|ルカ|Megurine|Luka|重音|テト|Kasane|Teto|鏡音|リン|レン|Kagamine|Rin|Len|グミ|GUMI|Meguppoid|Vocaloid/i)){
            purified_list.push(list[i]);
        }else{
            continue; // キーワードが入ってないので除外
        }
    }
    return purified_list;
}

function showDescription(obj, vocalo, e){
    serif = getSerifOfVocalo(vocalo);
    $(getDescriptionTemplate({'serif':serif})).appendTo('body').hide().css({
        'left' : (e.pageX + 30) + 'px',
        'top'  : (e.pageY - 10) + 'px',
    }).stop().fadeIn(50,function(){
        $(this).animate({
            'top' : (e.pageY - 40) + 'px',
        },200);
    });
}

function removeDescription(obj, vocalo, e){
    $("div.desc_switch").stop().fadeOut(100).remove();
}

function getSerifOfVocalo(vocalo){
    serif = '';
    switch(vocalo){
        case 'gumi':
            serif = 'めぐっぽいど';
            break;
        case 'teto':
            //serif = '重音テトだお';
            serif = '重音テト';
            break;
        case 'miku':
            serif = 'ﾐｸﾀﾞﾖ-';
            break;
        case 'luka':
            //serif = 'ﾅｲﾄﾌｨ-ﾊﾞ-';
            serif = '巡音ルカ';
            break;
        case 'rinlen':
            //serif = 'リンちゃんなう';
            serif = '鏡音リン・レン';
            break;
        case 'ia':
            //serif = 'IAと申します';
            serif = 'IA';
            break;
        default:
            serif = 'SELECT ME!';
   }
    return serif;
}

function botFavorite(id_str){
    $.ajax({
        type : 'POST',
        url  : 'http://twittap.com:4000/fav',
        data : 'id=' + id_str,
        success : function(response){
          console.log(response);
          //TODO: サーバからステータス送って、それを受けてDOM操作する
          alert('favりました。botがね');
        },
        error : function(err){
          setTimeout(function(){
            alert("今ちょっとbotは寝てるようです_(:3 ∠ )_\n自分でfavってください");
          },500);
        }
    });
}

function getInitialHashAndTitle(){
    var initialHashes = [
        { hash:'MGt25mv4-2Q',title:                                              "Tell Your World"},
        { hash:'7jd3D_LA1uI',title:     "【初音ミク】恋なんか知らない（恋愛感染症#1）【オリジナル"},
        { hash:'fJJqyrzXgeI',title:                "初音ミクオリジナル曲 「Breath of mechanical」"},
        { hash:'UwrKHOHIzoU',title:"VOCALOID2: Hatsune Miku Append - Fallin' Fallin' Fallin' [HD]"},
        { hash:'JB3rtmoUY_U',title:    "【初音ミクAppend】ココロカラ -Sweet mix-【with 中文字幕】"}
    ];
    var i = Math.floor(Math.random() * initialHashes.length);
    showInitialHash(initialHashes[i].title);
    return initialHashes[i];
}

function showInitialHash(title){
    $("div#music_title>span")
    .fadeOut(100,function(){
        $(this).html('ツイートのロードが終わるまでこちらの曲をお楽しみくだしあ --' + title)
        .hide().fadeIn(300);
    });
}

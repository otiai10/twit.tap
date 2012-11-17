/**
 * module.js
**/

/****** twitter API const *****/
var _twitter_url  = 'http://search.twitter.com/search.json';
var _bot_favs_url = 'http://api.twitter.com/1/favorites.json?count=5&screen_name=twit_tap';
var _params = {
  page  :             1,
  q     : '#nowplaying',
  lang  :          'ja',
  rpp   :         '200',
};
/******************************/
/****** youtube API const *****/
var _youtube_url = 'http://gdata.youtube.com/feeds/api/videos';
var _youtube_params = {
  alt         :   'json',
  q           :       '',
  category    :  'Music',
};
/******************************/
/****** main contents container ******/
var __entry_list = [];
var __index = -1;
/*************************************/
/****** buffer for async process *****/
var __buffer_twitter = [];
var __buffer_youtube = [];
/**************************************/

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

function showResult(isFav){
    // remove loader
    __entry_list = filterEntryByKeywords(__entry_list);
    $("li#loader_wrapper").fadeOut(1000,function(){
        // drawList
        drawList(__entry_list, isFav);
        $('ul#twitter_results').append(getLoadMoreArea({}));
    });
}

function pushGoodVideo(entry, key_in_buffer){
    youtube_hash = getHash(entry.id.$t);
    __buffer_twitter[key_in_buffer].youtube_hash  = youtube_hash;
    __buffer_twitter[key_in_buffer].youtube_title = entry.title.$t;
    __entry_list.push(__buffer_twitter[key_in_buffer]);
}

function drawList(list, isFav){
    for(var i in list){
        li = document.createElement('li');
        $(li).addClass('entry').addClass('boxy').addClass('results');
        //$(document.createElement('div')).html(list[i].youtube_title).appendTo($(li));
        $(li).appendTo('ul#twitter_results');
        if(isFav){ //getFavs経由のエントリは構造が違う
            params = {
                user_icon   : list[i].user.profile_image_url,
                text        : list[i].text,
                uniquelink  : getUniqueLink(list[i].from_user,list[i].id_str),
                ctime       : getTimeStr(list[i].created_at),
                userlink    : getUserLink(list[i].from_user),
                user_name   : list[i].user.screen_name,
                id_str      : list[i].id_str,
                pl_index    : i,
                yt_hash     : list[i].youtube_hash,
                yt_title    : list[i].youtube_title,
                yt_query    : list[i].youtube_query,
            };
        }else{
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
            };
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
}

function switchBackgroundImage(vocalo){
    src = './src/vocaloids/' + vocalo + '-bg.png';
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
        case 'everyone_faved':
            _params.q = 'everyone_faved';
            target_name = 'みんなのFav';
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
    $("ul#twitter_results").append(getSearchTemplate(data, _params.q));
    pageScroll('index-1');
    showLaoding();
    if(_params.q == 'everyone_faved'){
        getFavs();
    }else{
        getTweet(_params);
    }
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
        case 'pl':
            serif = "your favs";
            break;
        case 'everyone_faved':
            serif = "everyone's\nfavs";
            break;
        default:
            serif = 'SELECT ME!';
   }
    return serif;
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
        $(this).html('ツイートのロードが終わるまでこちらの曲をお楽しみくだしあ- ' + title)
        .hide().fadeIn(300);
    });
}

function changeTabTitle(str){
    $('title').html(' ' + str + '@twit.tap');
}

function removeInitial(jqObj){
    jqObj
    .removeClass('dynamic')
    .addClass('fav_state')
    .children('span.initial').remove()
}
function recoverInitial(jqObj){
    jqObj
    .addClass('dynamic')
    .removeClass('fav_state')
    .html('<span class="initial">botにfavらせる</span>');
}
function showGuruguru(jqObj){
    $('<img src="src/loading.png" class="guruguru alpha tmp">').appendTo(jqObj);
}
function feedbackFav(jqObj){
    $('<img src="src/fav.png" class="fav">').appendTo(jqObj)
    .hide()
    .fadeIn(100);
}
function feedbackRt(jqObj){
    $('<img src="src/rt.png" class="rt">').appendTo(jqObj)
    .hide()
    .fadeIn(100);
}

function proc_ConvertTweetsToYoutube(resource, isFav){
    //_params.since_id = resource.max_id;
    //_params.page   = (parseInt(_params.page) + 1);
    if(resource.length !== 0){
        __buffer_twitter = resource;
        for(i=0;i<resource.length;i++){
            end_flag = (i == (resource.length - 1)) ? true : false;
            searchYoutube(__buffer_twitter[i],i,end_flag, isFav);
        }
    }else{
        // console.log('Do Nothing');
    }
}

function openSoundHook(jqObj){
    var destination = jqObj.attr('hook-url');
    if(window.confirm("SoundHookにログインしていればマイリストに追加します\n\nこのURLを別ウィンドウで開きますか？\n\n" + decodeURIComponent(destination) )){
        window.open(destination);
    }else{
        alert("SoundHookは、お茶目な作業用BGMメーカーです。是非どうぞ!\nhttp://soundhook.net/");
    }
}

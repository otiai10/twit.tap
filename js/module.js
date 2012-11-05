/**
 * module.js
**/

var _twitter_url = 'http://search.twitter.com/search.json';
var _params = {
  page  :             1,
  q     : '#nowplaying',
  lang  :          'ja',
  rpp   :         '100',
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
            alert('twitter api error');
        }
    },
    error   :   function(err){
        console.log(err);
    },
  });
}

function init(){
  $("div#social").hide();
  $("ul#twitter_results").append('<li id="loader_wrapper"><div id="loader"></div></li>').hide().fadeIn(400);
  swfobject.embedSWF(
    "http://www.youtube.com/v/MGt25mv4-2Q?enablejsapi=1&autoplay=1&playerapiid=player",
    "video","480","320","8",null,null,{allowScriptAccess:"always"},{id:"player"    }
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
        for(i=0; i<response.feed.entry.length; i++){

            res = response.feed.entry[i];
            if(res.category[1].term === 'Music'){
                youtube_hash = getHash(res.id.$t);
                __buffer_twitter[key_in_buffer].youtube_hash  = youtube_hash;
                __buffer_twitter[key_in_buffer].youtube_title = res.title.$t;
                __entry_list.push(__buffer_twitter[key_in_buffer]);

                if(end_flag == true){
                    showResult();
                }
              break;
            }else{
                if(end_flag == true){
                    showResult();
                }
            }
        }
      }else{
        //console.log('NOT FOUND ON YOUTUBE');
        if(end_flag == true){
            showResult();
        }
      }
    },
    error   :   function(err){
        console.log(err);
    },
  });
}

function showResult(){
    // remove loader
    $("li#loader_wrapper").fadeOut(1000,function(){
        // drawList
        drawList(__entry_list);
    });
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
            pl_index    : i,
            yt_hash     : list[i].youtube_hash,
            yt_title    : list[i].youtube_title,
            yt_query    : list[i].youtube_query,
        }
        $(li).append(getListContent(params));
    }
    $('ul#twitter_results').append(getLoadMoreArea({}));
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
    time = new Date(time_str);
    to_str = parseInt(1900+time.getYear())+'/'+('0'+(time.getMonth()+1)).slice(-2)+'/'+('0'+time.getDay()).slice(-2)+'  '+time.getHours()+':'+('0'+time.getMinutes()).slice(-2)/** +':'+('0'+time.getSeconds()).slice(-2) **/;
    return to_str;
}

function getUserLink(user){
    return 'https://twitter.com/' + user;
}

window.onscroll = function(){
    if(window.scrollY > 4500){
        $("div#social").fadeIn(300);
    }else{
        $("div#social").fadeOut(300);
    }
};

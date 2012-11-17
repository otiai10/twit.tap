/**
 * ytControler.js
**/
var YT_STSTUS_VIDEO_END     = 0;
var YT_STSTUS_VIDEO_PLAYING = 0;

function setVideoAndLoad(hash,callback){
    if(typeof document.getElementById("player").loadVideoById !== 'undefined'){
       document.getElementById("player").loadVideoById(hash);
    }
    callback();
}

function playByIndex(){
    setVideoAndLoad(__entry_list[__index].youtube_hash,function(){
        $('div.playing_status').removeClass('active');
        $('#index' + __index).addClass('active');
        showNowPlaying();
        changeFavicon();
        changeTabTitle();
    });
    scrolling();
}

function onYouTubePlayerReady(playerid){
  document.getElementById(playerid)
  .addEventListener('onStateChange','statusWatch');
}

function statusWatch(newState){
  console.log('index',__index,'newState',newState);
  switch(newState){
    case YT_STSTUS_VIDEO_END:
      if(__entry_list.length -1 > __index){
        __index++;
        playByIndex();
      }else{
        __index = 0;
        playByIndex();
      }
      break;
    case 1:
      break;
    case 2:
      break;
    default:
  }
}

function playPrev(){
    if(__index == 0){
        __index = __entry_list.length;
    }else{
        __index = __index - 1;
    }
    playByIndex();
}

function playNext(){
    if(__index == (__entry_list.length -1)){
        __index = 0;
    }else{
        __index = __index + 1;
    }
    playByIndex();
}

function scrolling(){
    destination = __index -1;
    pageScroll('index' + destination);
}

function showNowPlaying(){
    twitter = getTwitterShareButton();
    img_fb = getFBShareButton(__entry_list[__index]);
    soundhook = getSoundhook(__entry_list[__index]);
    shareBlock = getShareBlock(twitter, img_fb, soundhook);
    $("div#music_title>span")
    .fadeOut(300,function(){
        $(this).html(__entry_list[__index].youtube_title + ' ' + shareBlock)
        .hide().fadeIn(300);
    });
}

function changeFavicon(){
    if(__index < 0){
        // do nothing
    }else{
        var href = __entry_list[__index].profile_image_url;
        if(!href){
            href = __entry_list[__index].user.profile_image_url;
        }
        $('link#favicon').attr({
            'href' : href,
            'rel'  : 'shorcut icon',
        });
    }
}

function changeTabTitle(){
    if(__index < 0){
        // do nothing
    }else{
        var name = __entry_list[__index].from_user;
        if (!name) {
            name = __entry_list[__index].user.screen_name;
        }
        $('title').html(name +' - EarphoneShare');
    }
}



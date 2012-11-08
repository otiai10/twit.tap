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
    $("div#music_title>span")
    .fadeOut(300,function(){
        $(this).html(__entry_list[__index].youtube_title + '   <img id="twitter_share" src="src/twitter-t.png">')
        .hide().fadeIn(300);
    });
}

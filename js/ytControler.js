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
    });
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
        destination = __index - 1;
        pageScroll('index' + destination);
      }else{
        __index = 0;
        playByIndex();
        pageScroll('index0');
      }
      break;
    case 1:
      break;
    case 2:
      break;
    default:
  }
}

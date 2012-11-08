/**
 * main.js
**/

$(function(){ // jQuery document.ready

    init();

    $("div.playing_status>div").live('click',function(){
        __index = $(this).attr('index_number');
        playByIndex();
        scrolling();
    });

    $("div#controlPannel>div#up>img").on('click',function(){
        playPrev();
    });

    $("div#controlPannel>div#down>img").on('click',function(){
        playNext();
    });

    $("button#korejanai").on('click',function(){
        openTweet();
    });

    $("li#load_more>a#get_more").live('click',function(){
        alert('未実装☆（ゝω・）v');
    });

    $("img.switch").on('click',function(){
        switchBackgroundImage($(this).attr('id'));
    });

    $("img.switch").hover(
        function(){
            switchBlackImage(this,$(this).attr('id'));
        },
        function(){
            recoverImage(this,$(this).attr('id'));
        }
    );

    $("div#music_title").on('click',function(){
        scrolling();
    });

    $("img#twitter_share").live('click',function(){
        shareThisVideo();
    });
}); // END jQuery document.ready

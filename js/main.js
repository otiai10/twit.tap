/**
 * main.js
**/

$(function(){ // jQuery document.ready

    init();

    $("div.playing_status>div").live('click',function(){
        // 注意！attrで取ってきたら文字列！
        __index = parseInt($(this).attr('index_number'));
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
        scrolling();
    });

    $("img.switch").on('click',function(){
        switchBackgroundImage($(this).attr('id'));
    });

    $("img.switch").hover(
        function(e){
            switchBlackImage(this,$(this).attr('id'));
            showDescription(this,$(this).attr('id'),e);
        },
        function(e){
            recoverImage(this,$(this).attr('id'));
            removeDescription(this,$(this).attr('id'),e);
        }
    );

    $("div#music_title").on('click',function(){
        scrolling();
    });

    $("img#twitter_share").live('click',function(){
        shareThisVideo();
    });
}); // END jQuery document.ready

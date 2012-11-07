/**
 * main.js
**/

$(function(){ // jQuery document.ready

    init();

    $("div.playing_status>div").live('click',function(){
        __index = $(this).attr('index_number');
        playByIndex();
    });

    $("#megane").on('click',function(e){
        q = $("#query_input").val();
        _params.q = '#nowplaying+' + q;
        __entry_list = [];
        __index      =  0;
        $("ul#twitter_results").html('');
        $("ul#twitter_results").append(getSearchTemplate(q));
        $("ul#twitter_results").append('<li id="loader_wrapper"><div id="loader"></div></li>').hide().fadeIn(400);
        console.log(_params);
        getTweet(_params);
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

}); // END jQuery document.ready

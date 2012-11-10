/**
 * getListContent()
 *
 * required data {
 *   user_icon
 *   text
 *   uniquelink
 *   ctime
 *   userlink
 *   user_name
 * }
 * 
**/
function getListContent(data){
    var template = ''
    //+ '<div class="boxy tw_left">'
        + '<div class="fix_bottom icon_box">'
            + '<div><a href="{%userlink%}" target="_blank"><img class="tw_icon" src="{%user_icon%}" width="48" height="48"></a></div>'
        + '</div>'
        + '<div class="content_box">'
            + '<div class="tw_text">'
                + '<p>{%text%}</p>'
            + '</div>'
            + '<div class="tw_meta boxy">'
                + '<ul class="default horizon">'
                    + '<li class="lef">'
                        + '<span class="fix_left tw_name">'
                            + '<a class="tw_link clickable" id="" href="{%userlink%}" target="_blank">'
                                + '@{%user_name%}'
                            + '</a>'
                        + '</sapn>'
                    + '</li>'
                    + '<li class="mid">'
                        + '<span class="fix_center">'
                            + '<!-- a class="tw_link clickable dynamic" twitter-data="">botにfavらせる</a -->'
                        + '</span>'
                    + '</li>'
                    + '<li class="rig">'
                        + '<span class="fix_right tw_ctime">'
                            + '<a class="tw_link clickable" id="" href="{%uniquelink%}" target="_blank">'
                                + '{%ctime%}'
                            + '</a>'
                        + '</span>'
                    + '</li>'
            + '</div>'
        + '</div>'
    //+ '</div>'
    + '<div id="index{%pl_index%}" class="playing_status">'
        + '<div class="clickable" index_number="{%pl_index%}" yt_hash="{%yt_hash%}" yt_title="{%yt_title%}" yt_query="{%yt_query%}">'
            + '<img src="src/arrow.png">'
        + '</div>'
    +'</div>';

    for(var i in data){
        template = template.split('{%'+i+'%}').join(data[i]);
    }
    return template;
}

/**
function getQueryDisplay(data){
    var template = ''
        + '<li class="entry">query</li>';

    return template;
}
**/

function getLoadMoreArea(data){
    var template = ''
        + '<li class="entry results" id="load_more"><a id="get_more">load more</a></li>';

    return template;
}

function getSearchTemplate(target){
    var template = ''
+'            <li class="entry fixed_list search" id="index-1">'
+'              <div>'
+'               <span id="rtime"><span id="time_detail">{%now%}</span>なう</span><br>'
+'               <span>今みんなが聞いてる<span id="target">{%target%}曲</span>とか</span>'
+'              </div>'
+'            </li>';

    for(var i in data){
        template = template.split('{%'+i+'%}').join(data[i]);
    }

    return template;
}

function getDescriptionTemplate(data){
    var template = '<div class="desc_switch"><span>{%serif%}</span></div>';
    for(var i in data){
        template = template.split('{%'+i+'%}').join(data[i]);
    }
    return template;
}

function getFBShareButton(data){
    var url   = encodeURIComponent('http://youtu.be/' + data.youtube_hash);
    var title =  data.youtube_title;
    var template = '<a href="http://www.facebook.com/sharer.php?u='+url+'&amp;t='+title+'" rel="nofollow" target="_blank"><img id="fb_share" class="share" src="src/fb.png"></a>';
    return template;
}

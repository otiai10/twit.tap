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
            + '<div><img class="tw_icon" src="{%user_icon%}" width="48" height="48"></div>'
        + '</div>'
        + '<div class="content_box">'
            + '<div class="tw_text">'
                + '<p>{%text%}</p>'
            + '</div>'
            + '<div class="tw_meta">'
                + '<span class="fix_right tw_ctime">'
                    + '<a class="tw_link clickable" id="" href="{%uniquelink%}" target="_blank">'
                        + '{%ctime%}'
                    + '</a>'
                + '</span>'
                + '<span class="fix_left tw_name">'
                    + '<a class="tw_link clickable" id="" href="{%userlink%}" target="_blank">'
                        + '@{%user_name%}'
                    + '</a>'
                + '</sapn>'
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
        + '<li class="entry results" id="load_more"><a href="#" id="get_more">load more</a></li>';

    return template;
}

function getSearchTemplate(query){
    var template = ''
+'            <li class="entry fixed_list search" id="index-1">'
+'              <div>'
+'                <input id="query_input" placeholder="What music do you like?" value="{%query%}">'
+'                <button id="megane"><img tabindex="0" src="src/search.png"></button>'
+'              </div>'
+'            </li>';

    template = template.replace('{%query%}',query);

    return template;
}
   

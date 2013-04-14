/**
 * module for ajax
**/

/***** Const for communicate bot ******/
var FAV_FAILED    = 0;
var FAV_SUCCEEDED = 1;
var FAV_RETWEETED = 2;
var FAV_MENTIONED = 3;
/**************************************/

function getTweet(_params){
  $.ajax({
    type    :   'GET',
    url     :   _twitter_url,
    data    :   _params,
    dataType:   'jsonp',
    success :   function(response){
        if(response.error === void 0){
            var is_fav = false;
            proc_ConvertTweetsToYoutube(response.results, is_fav);
        }else{
            if(response.error.match(/limit/g)){
                alert("Twitterの検索API使い過ぎだって\n叱られてしまったお...\n_(:3 ∠ )_\nこの曲が終わるくらいには回復してるかも");
            }
        }
    },
    error   :   function(err){
        alert('Error');
        console.log(err);
    },
  });
}


function getFavs(){
  $.ajax({
    type : 'POST',
    url  : 'http://otiai10.com:4000/getFavs',
    success : function(response){
        console.log(response);
        var is_fav = true;
        proc_ConvertTweetsToYoutube(response, is_fav);
    },
    err : function(err){
      alert('Error');
      console.log(err);
    },
  });
}

function searchYoutube(entry, key_in_buffer, end_flag, isFav){
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
        // youtubeの検索結果があった
        for(i=0; i<response.feed.entry.length; i++){
            if(response.feed.entry[i].category[1].term === 'Music' && response.feed.entry[i].media$group.yt$duration.seconds < 480){
                // これはいい感じのyoutubeなので、プレイリストに入れる
                pushGoodVideo(response.feed.entry[i], key_in_buffer);
                // いい感じのyotubeだったので、これ以上youtube検索結果は見ない
                break;
            }else{
                // いい感じのyoutubeじゃなかったので、次のyoutubeを見る
                continue;
            }
        }
      }else{
        // そもそもyoutubeの検索結果が無かった
      }
      // これがtweet検索結果的に最後のエントリなのであれば、showResultしちゃう
      if(end_flag == true){
          showResult(isFav);
      }
    },
    error   :   function(err){
        console.log(err);
    },
  });
}

// REMOVE: function botFavorite(jqObj){
function botRetweet(jqObj){
    removeInitial(jqObj);
    showGuruguru(jqObj);
    id_str = jqObj.attr('twitter-data');
    name   = jqObj.attr('twitter-user');
    $.ajax({
        type : 'POST',
        //url  : 'http://twittap.com:4000/fav',
        url  : 'http://twittap.com:4000/retweet',
        data : 'id=' + id_str + '&name=' + name,
        success : function(res){
          setTimeout(function(){
            $('img.tmp').fadeOut(100,function(){
              $('img.tmp').remove();
              feedbackRt(jqObj);
            });
          },900);
        },
        error : function(err){
          setTimeout(function(){
            $('img.tmp').remove();
            feedbackRt(jqObj);
          },900);
        }
    });
}


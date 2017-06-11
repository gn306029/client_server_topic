function get_buttons(video_id,video_name,callback){
    var json = {
          "type": "template",
          "altText": "this is a buttons template",
          "template": {
              "type": "buttons",
              "thumbnailImageUrl": "https://fs.mis.kuas.edu.tw/~s1104137126/LINE/sperate_movie.jpg",
              "title": video_name,
              "text": "請選擇",
              "actions": [
                  {
                    "type": "uri",
                    "label": "更多資訊",
                    "uri": "http://fs.mis.kuas.edu.tw/~s1104137126/IMDB/php/Page_Video.php?VIDEO_ID="+video_id
                  },
                  {
                    "type": "message",
                    "label": "上映影城",
                    "text": "上映影城"
                  }
              ]
          }
    }
    callback && callback(json);
}

/*set_therate_name(['台中新光影城',
  //'台中老虎城威秀',
  '日新大戲院',
  //'親親戲院',
  //'豐源國際影城',
  '台中大遠百威秀影城',
  //'華威台中影城',
  '台中凱擘影城',
  //'台中站前秀泰影城',
  '時代數位3D影城'],function(data){
  var columns = "{\"type\":\"template\",\"altText\":\"thearte\",\"template\":{\"type\":\"carousel\",\"columns\":"+data+"}}";
  console.log((columns));
});*/

function set_Carousel(array_name,title,text,photo_url,callback){
  var columns = "";
  columns ="[{\"thumbnailImageUrl\":\""+photo_url+"\",\"title\":\""+title+"\",\"text\":\""+text+"\",\"actions\":[";
  var group = 0;
  var index = 0;
  if(array_name.length%3 == 0){
    group = parseInt(array_name.length/3);
  }else{
    group = parseInt(array_name.length/3)+1;
  }
  for(var all_row =0;all_row < group ; all_row++){
    for(var i =0;i<3;i++){
        if(i < 2){
            if(all_row < group ){
              columns += "{\"type\":\"message\",\"label\":\""+array_name[index]+"\",\"text\":\""+array_name[index]+"\"},";
            }else{
              columns += "{\"type\":\"message\",\"label\":\""+array_name[index]+"\",\"text\":\""+array_name[index]+"\"}]}]";
            }
        }else{
            if(all_row < group -1){
               columns += "{\"type\":\"message\",\"label\":\""+array_name[index]+"\",\"text\":\""+array_name[index]+"\"}]},{\"thumbnailImageUrl\":\""+photo_url+"\",\"title\":\""+title+"\",\"text\":\""+text+"\",\"actions\":[";
            }else{
               columns += "{\"type\":\"message\",\"label\":\""+array_name[index]+"\",\"text\":\""+array_name[index]+"\"}]}]";
            }
        }
        index ++;
    }
  }
  callback && callback(columns);
}

function set_Carousel_URL(array_name,uri_array,title,text,photo_url,callback){
  var columns = "";
  columns ="[{\"thumbnailImageUrl\":\""+photo_url+"\",\"title\":\""+title+"\",\"text\":\""+text+"\",\"actions\":[";
  var group = 0;
  var index = 0;
  if(array_name.length%3 == 0){
    group = parseInt(array_name.length/3);
  }else{
    group = parseInt(array_name.length/3)+1;
  }
  for(var all_row =0;all_row < group ; all_row++){
    for(var i =0;i<3;i++){
        if(i < 2){
            if(all_row < group ){
              if((typeof uri_array[index]) == "undefined"){
                columns += "{\"type\":\"uri\",\"label\":\""+array_name[index]+"\",\"uri\":\"http://www.atmovies.com.tw\"},";
              }else{
                columns += "{\"type\":\"uri\",\"label\":\""+array_name[index]+"\",\"uri\":\""+uri_array[index]+"\"},";
              }
            }else{
              if((typeof uri_array[index]) == "undefined"){
                columns += "{\"type\":\"uri\",\"label\":\""+array_name[index]+"\",\"uri\":\"http://www.atmovies.com.tw\"}]}]";
              }else{
                columns += "{\"type\":\"uri\",\"label\":\""+array_name[index]+"\",\"uri\":\""+uri_array[index]+"\"}]}]";
              }
            }
        }else{
            if(all_row < group -1){
              if((typeof uri_array[index]) == "undefined"){
                columns += "{\"type\":\"uri\",\"label\":\""+array_name[index]+"\",\"uri\":\"http://www.atmovies.com.tw\"}]},{\"thumbnailImageUrl\":\""+photo_url+"\",\"title\":\""+title+"\",\"text\":\""+text+"\",\"actions\":[";
              }else{
                columns += "{\"type\":\"uri\",\"label\":\""+array_name[index]+"\",\"uri\":\""+uri_array[index]+"\"}]},{\"thumbnailImageUrl\":\""+photo_url+"\",\"title\":\""+title+"\",\"text\":\""+text+"\",\"actions\":[";
              }
            }else{
              if((typeof uri_array[index]) == "undefined"){
                columns += "{\"type\":\"uri\",\"label\":\""+array_name[index]+"\",\"uri\":\"http://www.atmovies.com.tw\"}]}]";
              }else{
                columns += "{\"type\":\"uri\",\"label\":\""+array_name[index]+"\",\"uri\":\""+uri_array[index]+"\"}]}]";
              }
              
            }
        }
        index ++;
    }
  }
  callback && callback(columns);
}

exports.get_buttons = get_buttons;
exports.set_Carousel = set_Carousel;
exports.set_Carousel_URL = set_Carousel_URL;
function get_buttons(video_name,callback){
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
                    "type": "message",
                    "label": "電影簡介",
                    "text": "電影簡介"
                  },
                  {
                    "type": "message",
                    "label": "電影卡司",
                    "text": "電影卡司"
                  },
                  {
                    "type": "message",
                    "label": "其他資訊",
                    "text": "其他資訊"
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

function set_Carousel(array_name,title,text,photo_url,callback){
  var columns = "{\"type\":\"template\",\"altText\":\"thearte\",\"template\":{\"type\":\"carousel\",\"columns\":";
  columns +="[{\"thumbnailImageUrl\":\""+photo_url+"\",\"title\":\""+title+"\",\"text\":\""+text+"\",\"actions\":[";
  var group = 0;
  var index = 0;
  if(array_name.length%3 == 0){
    group = parseInt(array_name.length/3);
  }else{
    group = parseInt(array_name.length/3)+1;
  }
  if(group > 5){
    group = 5;
  }
  for(var all_row =0;all_row < group ; all_row++){
    for(var i =0;i<3;i++){
        var a_n = array_name[index];
        if((typeof a_n) == "undefined"){
          a_n = "X";
        }
        if(i < 2){
            if(all_row < group ){
              columns += "{\"type\":\"message\",\"label\":\""+a_n+"\",\"text\":\""+a_n+"\"},";
            }else{
              columns += "{\"type\":\"message\",\"label\":\""+a_n+"\",\"text\":\""+a_n+"\"}]}]";
            }
        }else{
            if(all_row < group -1){
               columns += "{\"type\":\"message\",\"label\":\""+a_n+"\",\"text\":\""+a_n+"\"}]},{\"thumbnailImageUrl\":\""+photo_url+"\",\"title\":\""+title+"\",\"text\":\""+text+"\",\"actions\":[";
            }else{
               columns += "{\"type\":\"message\",\"label\":\""+a_n+"\",\"text\":\""+a_n+"\"}]}]";
            }
        }
        index ++;
    }
  }
  callback && callback(columns+"}}");
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
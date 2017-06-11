const request = require("request");
const cheerio = require("cheerio");
const base_url = "http://www.atmovies.com.tw";//開眼電影網的網址


function get_movie_id(movie_name,callback){
    request('http://www.atmovies.com.tw/movie/', function (error, response, body) {
      //console.log('error:', error); // Print the error if one occurred
      //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
      //console.log('body:', body); // Print the HTML for the Google homepage.
      var $ = cheerio.load(body);
      var result = "";
      $("[name=film_id] option").each(function(){
          if($(this).text() == movie_name){
              result = $(this).val();
          }
      })
      callback && callback(result);
    });
}

function get_movie_theater(movie_id,user_location,callback){
    request("http://www.atmovies.com.tw/movie/"+movie_id,function(error,response,body){
       var $ = cheerio.load(body);
       var result = "";
       $(".movie_theater [name=FORMS] option").each(function(){
           if($(this).text().replace(/\s+/g, "") == user_location){
               result = $(this).val();
           }
       })
       callback && callback(result);
    });
}

function get_theater_detail(theater_id,callback){
    request(base_url+theater_id,function(error,response,body){
       var $ = cheerio.load(body);
       var book_result = new Array();
       var result = new Array();
       result[0] = new Array();
       var theater_index = 0;
       var theater_detail_index = 0;
       var book_index = 0;
       $("#filmShowtimeBlock ul li").each(function(){
            if($(this).attr('class') == "theaterTitle"){
                theater_index ++;
                book_index ++;
                theater_detail_index = 0;
                result[theater_index] = new Array();
                result[theater_index][theater_detail_index] = $(this).text().replace(/\s+/g, "");
                book_result[book_index] = new Array();
                book_result[book_index].push($(this).text().replace(/\s+/g, ""));
                theater_detail_index ++;
            }else{
                result[theater_index][theater_detail_index] = $(this).text().replace(/\s+/g, "");
                theater_detail_index ++;
            }
            if($(this).attr('class') == "filmVersion"){
                // 電影廳
                book_result[book_index].push($(this).text());
            }
            if($(this).find('a').length > 0){
                // 可訂票場次
                if($(this).find('a').attr('class') == "openbox"){
                    book_result[book_index].push($(this).find('a').text()+" "+base_url+$(this).find('a').attr('href'));
                }
            }
       })
       callback && callback(result,book_result);
    });
}

function week_movie_list(callback){
    request(base_url+"/movie/new/",function(error, response, body) {
        var $ = cheerio.load(body);
        var result = []
        var index = 0;
        $(".filmTitle a").each(function(){
            var movie_title = $(this).text().replace(/\t|\r\n|\n+/g, "");
            var movie_title_chinese = "";
            for(var i =0;i<movie_title.length;i++){
                if(movie_title.charAt(i) != ' '){
                    movie_title_chinese += movie_title.charAt(i);
                }else{
                    break;
                }
            }
            result[index] = movie_title_chinese;
            index ++;
        })
        callback && callback(result);
    })
}

function last_movie_list(score,callback){
    request(base_url+"/movie/now/",function(error, response, body) {
        var $ = cheerio.load(body);
        var result = new Array();
        var score_arr = score.split(/[-]|[ ]/);
        console.log(score_arr);
        var index = 0;
        $(".filmListAll2 li").each(function(){
            if((parseFloat($(this).find(".thisRating").text()) >= parseFloat(score_arr[0]) && parseFloat($(this).find(".thisRating").text()) <= parseFloat(score_arr[1]))){
                result[index] = $(this).children("a").text().replace(/\t|\r\n|\n+/g, "");
                index ++;
            }
        })
        callback && callback(result);
    })
}

function last_second_movie_list(score,callback){
    request(base_url+"/movie/now2/",function(error, response, body) {
        var $ = cheerio.load(body);
        var result = new Array();
        var score_arr = score.split(/[-]|[ ]/);
        console.log(score_arr);
        var index = 0;
        $(".filmListAll2 li").each(function(){
            if((parseFloat($(this).find(".thisRating").text()) >= parseFloat(score_arr[0]) && parseFloat($(this).find(".thisRating").text()) <= parseFloat(score_arr[1]))){
                result[index] = $(this).children("a").text().replace(/\t|\r\n|\n+/g, "");
                index ++;
            }
        })
        callback && callback(result);
    })
}

function last_in_theaters(date,callback){
    request(base_url+"/movie/next/0/",function(error, response, body) {
        var $ = cheerio.load(body);
        var result = new Array();
        var index = 0;
        console.log((typeof date));
        if(date == "get_date"){
            $(".filmNextListAll").each(function(){
                result.push($(this).find(".major").text());
            })
            callback && callback(result);
        }else{
            $(".filmNextListAll").each(function(){
                if($(this).find(".major").text() == date){
                    $(this).children("li").each(function(){
                        result.push($(this).text().replace(/\t|\r\n|\n+/g, ""));
                    })
                    callback && callback(result);
                }
            })
        }
    })
}


function do_find_theater_detail(movie_name,user_location,callback){
    get_movie_id(movie_name,function(movie_id){
        get_movie_theater(movie_id,user_location,function(theater_id){
            get_theater_detail(theater_id,function(array,array2){
                callback && callback(array,array2);
            });
        });
    })
}

exports.do_find_theater_detail = do_find_theater_detail;
exports.week_movie_list = week_movie_list;
exports.last_movie_list = last_movie_list;
exports.last_second_movie_list = last_second_movie_list;
exports.last_in_theaters = last_in_theaters;
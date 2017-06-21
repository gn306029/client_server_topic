"use strict";
const request = require("request");
const cheerio = require("cheerio");
const superagent = require("superagent");
const base_url = "http://www.atmovies.com.tw";//開眼電影網的網址

// 取得電影ID
function get_movie_id(movie_name,callback){
    request('http://www.atmovies.com.tw/movie/', function (error, response, body) {
      var $ = cheerio.load(body);
      var result = "";
      $("[name=film_id] option").each(function(){
          if($(this).text() == movie_name){
              result = $(this).val();
          }
      });
      callback && callback(result);
    });
}

// 取得電影上映戲院
function get_movie_theater(movie_id,user_location,callback){
    request("http://www.atmovies.com.tw/movie/"+movie_id,function(error,response,body){
       var $ = cheerio.load(body);
       var result = "";
       $(".movie_theater [name=FORMS] option").each(function(){
           if($(this).text().replace(/\s+/g, "") == user_location){
               result = $(this).val();
           }
       });
       callback && callback(result);
    });
}

// 取得戲院時刻表資訊
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
       });
       callback && callback(result,book_result);
    });
}

// 取得本周電影
function week_movie_list(callback){
    request(base_url+"/movie/new/",function(error, response, body) {
        var $ = cheerio.load(body);
        var result = [];
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
        });
        callback && callback(result);
    });
}

// 取得本期首輪電影
function last_movie_list(score,callback){
    request(base_url+"/movie/now/",function(error, response, body) {
        var $ = cheerio.load(body);
        var result = new Array();
        var score_arr = score.split(/[-]|[ ]/);
        var index = 0;
        $(".filmListAll2 li").each(function(){
            if((parseFloat($(this).find(".thisRating").text()) >= parseFloat(score_arr[0]) && parseFloat($(this).find(".thisRating").text()) <= parseFloat(score_arr[1]))){
                result[index] = $(this).children("a").text().replace(/\t|\r\n|\n+/g, "");
                index ++;
            }
        });
        callback && callback(result);
    });
}

// 取得本期二輪電影
function last_second_movie_list(score,callback){
    request(base_url+"/movie/now2/",function(error, response, body) {
        var $ = cheerio.load(body);
        var result = new Array();
        var score_arr = score.split(/[-]|[ ]/);
        var index = 0;
        $(".filmListAll2 li").each(function(){
            if((parseFloat($(this).find(".thisRating").text()) >= parseFloat(score_arr[0]) && parseFloat($(this).find(".thisRating").text()) <= parseFloat(score_arr[1]))){
                result[index] = $(this).children("a").text().replace(/\t|\r\n|\n+/g, "");
                index ++;
            }
        });
        callback && callback(result);
    });
}

// 取得近期上映的電影
function last_in_theaters(date,callback){
    request(base_url+"/movie/next/0/",function(error, response, body) {
        var $ = cheerio.load(body);
        var result = new Array();
        if(date == "get_date"){
            $(".filmNextListAll").each(function(){
                result.push($(this).find(".major").text());
            });
            callback && callback(result);
        }else{
            $(".filmNextListAll").each(function(){
                if($(this).find(".major").text() == date){
                    $(this).children("li").each(function(){
                        result.push($(this).text().replace(/\t|\r\n|\n+/g, ""));
                    });
                }
            });
        }
        callback && callback(result);
    });
}

// 搜尋資料
function GetSearch(name,type,callback){
    superagent
        .post("http://search.atmovies.com.tw/search/")
        .send("fr=@movies&enc=UTF-8&type=all&search_term="+encodeURIComponent(name)+"&sa=Search")
        .set("Referer","http://www.atmovies.com.tw/movie/")
        .end(function(err,result){
            if(err) throw err;
            let $ = cheerio.load(result.text);
            let id = [];
            let name = [];
            $("header").each(function(){
                if($(this).find('font').first().text() == type){
                    //取電影ID AND 電影Name
                    var tmp = $(this).find('a').attr('href').split("/");
                    var tmp2 = $(this).find('a').text().trim().split(" ");
                    id.push(tmp[2]);
                    name.push(tmp2[0]);
                }
            })
            callback && callback(id,name);
        })
}

// 取得戲院資訊
function do_find_theater_detail(movie_name,user_location,callback){
    get_movie_id(movie_name,function(movie_id){
        get_movie_theater(movie_id,user_location,function(theater_id){
            get_theater_detail(theater_id,function(array,array2){
                callback && callback(array,array2);
            });
        });
    });
}

// 取得地區ID
function GetTherateID(therate_region,callback){
    request(base_url+"/showtime/",function(error, response, body) {
        let $ = cheerio.load(body);
        let therate_id = [];
        let search = [];
        if(therate_region == "東部、離島地區"){
            search = ["花蓮地區","台東地區","澎湖地區","金門地區"];
        }else if(therate_region.substring(0,2) == "台北" || therate_region == "新北市"){
            therate_id.push(therate_region);
            search = ["台北地區"];
        }else{
            search = [therate_region];
        }
        for(let i in search){
            $("map area").each(function(){
                if($(this).attr("shape") == "rect"){
                    if($(this).attr('alt') == search[i]){
                        therate_id.push($(this).attr("href"));
                    }
                }
            });
        }
        if(therate_id.length > 0){
            callback && callback(therate_id);
        }else{
            callback && callback("not found");
        }
        
    });
}

// 取得該地區戲院清單
function GetTherateList(therate_id,callback){
    let therate_name = [];
    // 全台只有台北地區劇院超過15間 所以要特別處理
    if(typeof therate_id == "object"){
        if(therate_id[0].charAt(0) == '/'){
            for(let i in therate_id){
                request(base_url+therate_id[i],function(error, response, body) {
                    let $ = cheerio.load(body);
                    $("#theaterList li a").each(function(){
                        if($(this).text() != "網站" && $(this).text() != "(地圖)"){
                            therate_name.push($(this).text().trim());
                        }
                    })
                    callback && callback(therate_name);
                })
            }
        }else{
            for(let i = 1;i<therate_id.length;i++){
                request(base_url+therate_id[i],function(error, response, body) {
                    let $ = cheerio.load(body);
                    let t = false;
                    $("#theaterList li").each(function(){
                        if($(this).attr("class") == "type0"){
                            if($(this).text().replace(/▼/g,"").trim() == therate_id[0]){
                                t = true;
                            }else{
                                t = false;
                            }
                        }
                        if(t){
                            if($(this).find('a').first().text().trim() != "網站" && $(this).find('a').first().text().trim() != "(地圖)" && $(this).find('a').first().text().trim() != ""){
                                therate_name.push($(this).find('a').first().text().trim());
                            }
                        }
                    });
                    callback && callback(therate_name);
                });
            }
        }
    }else{
        callback && callback("not found");
    }
}

//取得電影資訊
function Get_Movie_Infor(movie_id,find_type,callback){
    request(base_url+"/movie/"+movie_id,function(error, response, body) {
        let $ = cheerio.load(body);
        let index;
        let data = [];
        switch(find_type){
            case "cast":
                $("#filmCastDataBlock ul:nth-child(1)").children("li").each(function(){
                    if($(this).text().replace(/\t|\r\n|\s/g,"") != "more"){
                        data.push($(this).text().replace(/\t|\r\n|\s/g,""));
                    }
                });
                break;
            case "infor":
                $("#filmCastDataBlock ul:nth-child(2)").children("li").each(function(){
                    if($(this).text().replace(/\t|\r\n|\s/g,"") != "more"){
                        data.push($(this).text().replace(/\t|\r\n|\s/g,""));
                    }
                });
                break;
            case "summary":
                data.push($("#filmTagBlock span:not([class])").clone().children().remove().end().text().trim());
                break;
        }
        
        callback && callback(data);
    });
}

function do_get_therate(therate_region,callback){
    GetTherateID(therate_region,function(id){
        GetTherateList(id,function(tn){
            callback && callback(tn);
        });
    });
}

function GetTherateMovie(therate_name,callback){
    let movie_name = [];
    GetSearch(therate_name,"戲院",function(id){
        let tmp = id[0].split("-");
        let uri = tmp[1]+"/"+tmp[0];
        request(base_url+"/showtime/"+uri,function(error, response, body) {
            let $ = cheerio.load(body);
            $("#theaterShowtimeBlock .filmTitle").each(function(){
                movie_name.push($(this).text().trim().replace(/\t/g));
            });
            callback && callback(movie_name);
        });
    });
}

/*
 * 需要處理例外  國賓新莊影城 沒有 Header 標籤 
 * 
 * 台北信義威秀沒有搜尋結果
 *
 * 
 *
 */

module.exports = {
    do_find_theater_detail: do_find_theater_detail,
    week_movie_list: week_movie_list,
    last_movie_list:last_movie_list,
    last_second_movie_list:last_second_movie_list,
    last_in_theaters:last_in_theaters,
    GetTherateMovie:GetTherateMovie,
    do_get_therate:do_get_therate,
    GetSearch:GetSearch,
    Get_Movie_Infor:Get_Movie_Infor
};
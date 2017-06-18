"use strict";
const linebot = require('./index.js');
const lt = require('./line_template.js');
const parser = require('./parser.js');
const sql = require('./sql.js');
const domain = require('domain');

const bot = linebot({
	channelId: '1489562053',
	channelSecret: '3de8327d6b424f48fd9749d0282f948a',
	channelAccessToken: 'DcO0yomJRiCDhvUKCMnkAbsr4j8QzH2QgwV+hQ+gE1VrR62UfymbT5XvapKkjyRfRPml59E31bvskT3bd87HHRZhEyZ+VQqO7QnsPcgm1pcMffFtVMHM2xPRGEi9aRytnwHddP+dze1iSiS+UtoGegdB04t89/1O/w1cDnyilFU=',
	verify: true // default=true
});

//判斷按下四顆按鈕中的哪一顆
var status = 0;
//判斷按下各個按鈕之後會觸發的動作
var status_action = 0;
var movie_name = "";
var therate_result = [];

var d = domain.create();

d.on('error', function(err) {
    console.log(err);
});

bot.on('message', function (event) {
	d.enter();
	switch (event.message.type) {
		case 'text':
				sql.search_user_status(event.source.userId,function(user_status){
					if(event.message.text == "查詢電影"){
						sql.set_user_status(event.source.userId,"1",function(data){
							event.reply("輸入想查詢的電影名稱");
						});
					}else if(event.message.text == "新片上映"){
						sql.set_user_status(event.source.userId,"1",function(data){
							parser.week_movie_list(function(data){
								lt.set_Carousel(data,"本周新片","選擇電影","https://fs.mis.kuas.edu.tw/~s1104137126/LINE/now_video.jpg",function(result){
									event.reply(JSON.parse(result));
								})
							})
						});
					}else if(event.message.text == "本期新片"){
						sql.set_user_status(event.source.userId,"2",function(data){
							var interval = ["2-4 分","5-6 分","6-7 分","7-8 分","8-9 分","9-10 分"];
							/*
							* 分數區間暫時沒有圖片
							*
							*/
							lt.set_Carousel(interval,"分數區間","電影希望在幾分之間呢？","https://fs.mis.kuas.edu.tw/~s1104137126/LINE/score.jpg",function(result){
								event.reply(JSON.parse(result));
								
							})
						});
					}else if(event.message.text == "本期二輪"){
						sql.set_user_status(event.source.userId,"3",function(data){
							var interval = ["2-4 分","5-6 分","6-7 分","7-8 分","8-9 分","9-10 分"];
							/*
							 * 分數區間暫時沒有圖片
							 *
							 */
							lt.set_Carousel(interval,"分數區間","電影希望在幾分之間呢？","https://fs.mis.kuas.edu.tw/~s1104137126/LINE/score.jpg",function(result){
								event.reply(JSON.parse(result));
								
							})
						});
					}else if(event.message.text == "近期上映"){
						sql.set_user_status(event.source.userId,"4",function(){
							parser.last_in_theaters("get_date",function(date){
								lt.set_Carousel(date,"日期","選擇日期","https://fs.mis.kuas.edu.tw/~s1104137126/LINE/now_video.jpg",function(result){
									event.reply(JSON.parse(result));
								})
							})
						})
					}else if(event.message.text == "劇院"){
						let therate_name = ["台北地區","桃園地區","新竹地區","苗栗地區","台中地區","彰化地區","雲林地區","嘉義地區","台南地區","高雄地區","屏東地區","基隆地區","宜蘭地區","南投地區","東部、離島地區"];
						lt.set_Carousel(therate_name,"地區","選擇地區","https://fs.mis.kuas.edu.tw/~s1104137126/LINE/condition.jpg",function(result){
							event.reply(JSON.parse(result));
							sql.set_user_status(event.source.userId,"5");
						});
					}else if(user_status[0] == "1"){
						if(event.message.text != "undefined"){
							parser.GetSearch(event.message.text,"電影",function(id,name){
								console.log(name.length);
								if(name.length <= 15 && name.length >= 2){
									sql.set_user_status(event.source.userId,"1.1");
									lt.set_Carousel(name,"電影","選擇電影","https://fs.mis.kuas.edu.tw/~s1104137126/LINE/sperate_movie.jpg",function(data){
										event.reply(JSON.parse(data));
										sql.set_user_status(event.source.userId,"1");
									})
								}else if(name.length == 1){
									sql.set_user_want_movie(event.source.userId,event.message.text);
									sql.set_user_status(event.source.userId,"1.1");
									lt.get_buttons(name[0],function(json){
										event.reply(json);
									})
								}else{
									let r = "搜尋到的電影有：\r\n";
									for(let i in name){
										r += name[i]+"\r\n";
									}
									console.log(r.length);
									event.reply(r);
								}
							})
						}else{
							event.reply("幹你媽的 按三小undefind");
						}
					}else if(user_status[0] == "1.1" && event.message.text == "上映影城"){
						sql.set_user_status(event.source.userId,"1.2",function(data){
							event.reply("請輸入你目前所在縣市 , EX:台中,高雄");
						});
					}else if(user_status[0] == "1.1" && event.message.text == "電影卡司"){
						parser.GetSearch(user_status[1],"電影",function(id,name){
							parser.Get_Movie_Infor(id[0],"cast",function(d){
								let r = "";
								for(let i in d){
									r += d[i]+"\r\n";
								}
								event.reply(r);
							})
						});
					}else if(user_status[0] == "1.1" && event.message.text == "其他資訊"){
						parser.GetSearch(user_status[1],"電影",function(id,name){
							parser.Get_Movie_Infor(id[0],"infor",function(d){
								let r = "";
								for(let i in d){
									r += d[i]+"\r\n";
								}
								event.reply(r);
							})
						});
					}else if(user_status[0] == "1.1" && event.message.text == "電影簡介"){
						parser.GetSearch(user_status[1],"電影",function(id){
							parser.Get_Movie_Infor(id[0],"summary",function(d){
								if(d[0].length == 0){
									event.reply("該部電影沒有簡介或是根本沒有該部電影喔~ㄎㄎ");
								}else{
									event.reply(d);
								}
							})
						})
					}else if(user_status[0] == "1.2"){
						sql.set_user_want_location(event.source.userId,event.message.text);
						parser.do_find_theater_detail(user_status[1],event.message.text,function(result){
								if(result.length == 1){
									event.reply("輸入的地區名稱有誤或者是該部電影尚未上映或以下檔喔~");
									sql.set_user_status(event.source.userId,"0");
								}else{
									therate_result = result;
									var Replytext = [];
									for(var i = 1;i<result.length;i++){
										var distince = false;
										for(var j =0;j<Replytext.length;j++){
											if(result[i][0] == Replytext[j]){
												distince = true;
												break;
											}
										}
										if(!distince){
											Replytext.push(result[i][0]);
										}
									}
									if(Replytext.length == 0){
										event.reply("該電影已下檔\r\n請再次選擇欲執行的動作");
										sql.set_user_status(event.source.userId,"0");
									}else{
										lt.set_Carousel(Replytext,"影城","選擇影城","https://fs.mis.kuas.edu.tw/~s1104137126/LINE/theater.jpg",function(data){
											event.reply(JSON.parse(data));
											sql.set_user_status(event.source.userId,"1.3");
										})
									}
								}
							});
					}else if(user_status[0] == "1.3"){
						parser.do_find_theater_detail(user_status[1],user_status[2],function(result){
							sql.sql_query("UPDATE `line_user` SET `therate`='"+event.message.text+"' WHERE `user_mid` = '"+event.source.userId+"'");
							var Replytext = "";
							var room = [];
							var stat = false;
							for(var i = 1;i<result.length;i++){
								if(result[i][0] == event.message.text){
									var Reg = /^[0-9][0-9]/;
									if(!Reg.test(result[i][1])){
										if(!Reg.test(result[i][2])){
											room.push(result[i][1].trim() + " " + result[i][2].trim());
										}else{
											room.push(result[i][1].trim());
										}
									}else if(!stat){
										room.push("一般");
										stat = true;
									}
								}
							}
							lt.set_Carousel(room,"廳","選擇影廳","https://fs.mis.kuas.edu.tw/~s1104137126/LINE/condition.jpg",function(data){
								sql.set_user_status(event.source.userId,"1.4");
								event.reply(JSON.parse(data));
							})
						});
					}else if(user_status[0] == "1.4"){
						/*
						 * 選擇白天或晚上的場次
						 *
						 */
						var json = {
						  "type": "template",
						  "altText": "this is a buttons template",
						  "template": {
						      "type": "buttons",
						      "thumbnailImageUrl": "https://fs.mis.kuas.edu.tw/~s1104137126/LINE/now_video.jpg",
						      "title": "想查詢的東西",
						      "text": "請選擇",
						      "actions": [
				                  {
				                    "type": "message",
				                    "label": "查詢白天可訂票的場次",
				                    "text": "白天訂票"
				                  },
				                  {
				                    "type": "message",
				                    "label": "查詢白天所有場次",
				                    "text": "白天場次"
				                  },
				                  {
				                    "type": "message",
				                    "label": "查詢晚上可訂票的場次",
				                    "text": "晚上訂票"
				                  },
				                  {
				                    "type": "message",
				                    "label": "查詢晚上所有場次",
				                    "text": "晚上場次"
				                  }
				              ]
						  }
						};
            			sql.set_want_room(event.source.userId,event.message.text,function(d){
            				sql.set_user_status(event.source.userId,"1.5",function(d2){
	            				event.reply(json);
	            			});
            			});
					}else if(user_status[0] == "1.5"){
						var Replytext = [];
						sql.sql_query("Select `movie_name`,`location`,`therate`,`want_room` From `line_user` Where `user_mid` = '"+event.source.userId+"'",function(error,result){
							parser.do_find_theater_detail(result[0]['movie_name'],result[0]['location'],function(all,book){
								switch (event.message.text) {
									case '白天訂票':
										var book_array = [];
										var book_uri = [];
										var Reg = /^[0-9][0-9]/;
										for(let i in book){
											for(let j in book[i]){
												if(result[0]['want_room'] == "一般" && result[0]['therate'].trim() == book[i][0] && Reg.test(book[i][1])){
													if(book[i][0] == result[0]['therate'].trim()){
														let tmp = book[i][j].split(' ');
														if(Reg.test(tmp[0]) && tmp[0].substring(0,2) <= 17 && tmp[0].substring(0,2) >= 6){
															book_array.push(tmp[0]);
															book_uri.push(tmp[1]);
														}
													}else{
														break;
													}
												}else{
													if(book[i][0] == result[0]['therate'].trim() && book[i][1] == result[0]['want_room'].trim()){
														let Reg = /^[0-9][0-9]/;
														let tmp = book[i][j].split(' ');
														if(Reg.test(tmp[0]) && tmp[0].substring(0,2) <= 17 && tmp[0].substring(0,2) >= 6){
															book_array.push(tmp[0]);
															book_uri.push(tmp[1]);
														}
													}else{
														break;
													}
												} 
											}
										}
										if(book_array.length > 0){
											lt.set_Carousel_URL(book_array,book_uri,(result[0]['therate']+" "+result[0]['want_room']),"場次","https://fs.mis.kuas.edu.tw/~s1104137126/LINE/now_video.jpg",function(columns){
												let reply = "{\"type\":\"template\",\"altText\":\"thearte\",\"template\":{\"type\":\"carousel\",\"columns\":"+columns+"}}";
												event.reply(JSON.parse(reply));
											});
										}else{
											event.reply("該時段今天沒有可訂票的場次喔");
										}
										break;
									case '白天場次':
										var replytext = "";
										var Reg = /^[0-9][0-9]/;
										for(let i =1;i<all.length;i++){
											if(all[i][0] == result[0]['therate'].trim() && all[i][1] == result[0]['want_room'].trim()){
												replytext += all[i][0]+" "+all[i][1]+"\r\n";
												for(let j = 1;j<all[i].length;j++){
													if(Reg.test(all[i][j]) && all[i][j].substring(0,2) <= 17 && all[i][j].substring(0,2) >= 6){
														replytext += all[i][j]+"\r\n";
													}
												}
											}else if(result[0]['want_room'] == "一般" && result[0]['therate'] == all[i][0] && Reg.test(all[i][1])){
												replytext += all[i][0]+" 一般場次\r\n";
												for(let j = 1;j<all[i].length;j++){
													let Reg = /^[0-9][0-9]/;
													if(Reg.test(all[i][j]) && all[i][j].substring(0,2) <= 17 && all[i][j].substring(0,2) >= 6){
														replytext += all[i][j]+"\r\n";
													}
												}
											}
										}
										if(replytext.length > (result[0]['therate']+" "+result[0]['want_room']+"\r\n").length){
											event.reply(replytext);
										}else{
											event.reply("該時段今天沒有場次喔");
										}
										break;
									case '晚上訂票':
										var book_array = [];
										var book_uri = [];
										var Reg = /^[0-9][0-9]/;
										for(let i in book){
											for(let j in book[i]){
												if(result[0]['want_room'] == "一般" && result[0]['therate'].trim() == book[i][0] && Reg.test(book[i][1])){
													if(book[i][0] == result[0]['therate'].trim()){
														let tmp = book[i][j].split(' ');
														if(Reg.test(tmp[0]) && ((tmp[0].substring(0,2) >= 18 && tmp[0].substring(0,2) <= 23) || (tmp[0].substring(0,2) >= 0 && tmp[0].substring(0,2) <= 5))){
															book_array.push(tmp[0]);
															book_uri.push(tmp[1]);
														}
													}else{
														break;
													}
												}else{
													if(book[i][0] == result[0]['therate'].trim() && book[i][1] == result[0]['want_room'].trim()){
														let Reg = /^[0-9][0-9]/;
														let tmp = book[i][j].split(' ');
														if(Reg.test(tmp[0]) && ((tmp[0].substring(0,2) >= 18 && tmp[0].substring(0,2) <= 23) || (tmp[0].substring(0,2) >= 0 && tmp[0].substring(0,2) <= 5))){
															book_array.push(tmp[0]);
															book_uri.push(tmp[1]);
														}
													}else{
														break;
													}
												} 
											}
										}
										if(book_array.length > 0){
											lt.set_Carousel_URL(book_array,book_uri,(result[0]['therate']+" "+result[0]['want_room']),"場次","https://fs.mis.kuas.edu.tw/~s1104137126/LINE/now_video.jpg",function(columns){
												let reply = "{\"type\":\"template\",\"altText\":\"thearte\",\"template\":{\"type\":\"carousel\",\"columns\":"+columns+"}}";
												event.reply(JSON.parse(reply));
											});
										}else{
											event.reply("該時段今天沒有可訂票的場次喔");
										}
										break;
									case '晚上場次':
										var replytext = "";
										var Reg = /^[0-9][0-9]/;
										for(let i =1;i<all.length;i++){
											if(all[i][0] == result[0]['therate'].trim() && all[i][1] == result[0]['want_room'].trim()){
												replytext += all[i][0]+" "+all[i][1]+"\r\n";
												for(let j = 1;j<all[i].length;j++){
													if(Reg.test(all[i][j]) && ((all[i][j].substring(0,2) >= 18 && all[i][j].substring(0,2) <= 23) || (all[i][j].substring(0,2) >= 0 && all[i][j].substring(0,2) <= 5))){
														replytext += all[i][j]+"\r\n";
													}
												}
											}else if(result[0]['want_room'] == "一般" && result[0]['therate'] == all[i][0] && Reg.test(all[i][1])){
												replytext += all[i][0]+" 一般場次\r\n";
												for(let j = 1;j<all[i].length;j++){
													let Reg = /^[0-9][0-9]/;
													if(Reg.test(all[i][j]) && ((all[i][j].substring(0,2) >= 18 && all[i][j].substring(0,2) <= 23) || (all[i][j].substring(0,2) >= 0 && all[i][j].substring(0,2) <= 5))){
														replytext += all[i][j]+"\r\n";
													}
												}
											}
										}
										if(replytext.length > (result[0]['therate']+" "+result[0]['want_room']+"\r\n").length){
											event.reply(replytext);
										}else{
											event.reply("該時段今天沒有場次喔");
										}
										break;
								}
							});
						});
					}else if(user_status[0] == "2"){
						parser.last_movie_list(event.message.text,function(data){
							lt.set_Carousel(data,"符合條件的電影","選擇電影","https://fs.mis.kuas.edu.tw/~s1104137126/LINE/condition.jpg",function(d){
								event.reply(JSON.parse(d));
								sql.set_user_status(event.source.userId,"1");
							});
						});
					}else if(user_status[0] == "3"){
						parser.last_second_movie_list(event.message.text,function(data){
							lt.set_Carousel(data,"符合條件的電影","選擇電影","https://fs.mis.kuas.edu.tw/~s1104137126/LINE/condition.jpg",function(d){
								event.reply(JSON.parse(d));
								sql.set_user_status(event.source.userId,"1");
							});
						});
					}else if(user_status[0] == "4"){
						sql.set_user_status(event.source.userId,"1",function(){
							parser.last_in_theaters(event.message.text,function(date){
								lt.set_Carousel(date,"符合條件的電影","選擇電影","https://fs.mis.kuas.edu.tw/~s1104137126/LINE/now_video.jpg",function(d){
									event.reply(JSON.parse(d));
								});
							});
						});
					}else if(user_status[0] == "5"){
						if(event.message.text == "台北地區"){
							let Taipei_area = ["台北東區","台北西區","台北南區","台北北區","新北市","台北二輪"];
							lt.set_Carousel(Taipei_area,"地區","選擇地區","https://fs.mis.kuas.edu.tw/~s1104137126/LINE/condition.jpg",function(result){
								event.reply(JSON.parse(result));
							})
						}else{
							parser.do_get_therate(event.message.text,function(therate_name){
								lt.set_Carousel(therate_name,"影城","選擇影城","https://fs.mis.kuas.edu.tw/~s1104137126/LINE/theater.jpg",function(result){
									sql.set_user_status(event.source.userId,"5.1",function(){
										event.reply(JSON.parse(result));
									});
								});
							});
						}
					}else if(user_status[0] == "5.1"){
						if(event.message.text == "府中15"){
							event.reply("最新時刻表以網站連結的官方資料為準。web.fuzhong15.ntpc.gov.tw");
						}else{
							parser.GetTherateMovie(event.message.text,function(therate_movie){
								lt.set_Carousel(therate_movie,"電影","選擇電影","https://fs.mis.kuas.edu.tw/~s1104137126/LINE/sperate_movie.jpg",function(data){
									event.reply(JSON.parse(data));
									sql.set_user_status(event.source.userId,"1");
								})
							})
						}
					}else if(user_status[0] == "0" && event.message.text != "查詢電影" && event.message.text != "新片上映" && event.message.text != "本期新片" && event.message.text != "本期二輪"){
						event.reply("請先選擇動作喔，不然我不會理你");
					}
				});
			break;
		case 'image':
			event.message.content().then(function (data) {
				const s = data.toString('base64').substring(0, 30);
				return event.reply('Nice picture! ' + s);
			}).catch(function (err) {
				return event.reply(err.toString());
			});
			break;
		case 'video':
			event.reply('Nice movie!');
			break;
		case 'audio':
			event.reply('Nice song!');
			break;
		case 'location':
			event.reply(['That\'s a good location!', 'Lat:' + event.message.latitude, 'Long:' + event.message.longitude]);
			break;
		case 'sticker':
			event.reply({
				type: 'sticker',
				packageId: 1,
				stickerId: 1
			});
			break;
		default:
			event.reply('Unknow message: ' + JSON.stringify(event));
			break;
	}
	d.exit();
});

bot.on('follow', function (event) {
	event.reply('follow: ' + event.source.userId);
});

bot.on('unfollow', function (event) {
	event.reply('unfollow: ' + event.source.userId);
});

bot.on('join', function (event) {
	event.reply('join: ' + event.source.groupId);
});

bot.on('leave', function (event) {
	event.reply('leave: ' + event.source.groupId);
});

bot.on('postback', function (event) {
	event.reply('postback: ' + event.postback.data);
});

bot.on('beacon', function (event) {
	event.reply('beacon: ' + event.beacon.hwid);
});

bot.listen('/linewebhook', process.env.PORT || 80, function () {
	console.log('LineBot is running.');
});

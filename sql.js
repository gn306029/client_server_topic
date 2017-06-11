var mysql = require('mysql');

var con = mysql.createConnection({
  host: "db.mis.kuas.edu.tw",
  user: "s1104137130",
  password: "1314520",
  database:"s1104137130"
});

sql_con();

function sql_con(callback){
  con.connect(function(err) {
    if (err){
        callback && callback(false);
    }else{
        callback && callback(true);
    }
  });
}

function set_user_status(user_mid,status,callback){
    /*sql_con(function(err){
        console.log(err);
        if(err){*/
            var sql = "Update `line_user` Set `status` = '"+status+"' Where `user_mid` = '"+user_mid+"'";
            con.query(sql,function(error,result){
                if(error) throw error;
                callback && callback(user_mid);
            })
    /*    }
    })*/
}

function set_user_want_movie(user_mid,movie_name,callback){
    /*sql_con(function(err){
        if(err){*/
            var sql = "Update `line_user` Set `movie_name` = '"+movie_name+"' Where `user_mid` = '"+user_mid+"'";
            con.query(sql,function(error,result){
                if(error) throw error;
                callback && callback(user_mid);
            })
    /*    }
    })*/
}

function set_user_want_location(user_mid,location,callback){
    /*sql_con(function(err){
        if(err){*/
            var sql = "Update `line_user` Set `location` = '"+location+"' Where `user_mid` = '"+user_mid+"'";
            con.query(sql,function(error,result){
                if(error) throw error;
                callback && callback(user_mid);
            })
    /*    }
    })*/
}

function search_user_status(user_mid,callback){
    /*sql_con(function(err){
        if(err){*/
            var sql = "Select `status`,`movie_name`,`location` From `line_user` Where `user_mid` = '"+user_mid+"'";
            con.query(sql,function(error,result){
                if(result.length == 0){
                    var sql = "Insert Into `line_user`(`user_mid`,`status`) VALUES ('"+user_mid+"','0')";
                    con.query(sql,function(err,data){
                        if(err) throw err;
                        callback && callback("0");
                    })
                }else{
                    var Result = [];
                    Result.push(result[0]["status"]);
                    Result.push(result[0]["movie_name"]);
                    Result.push(result[0]["location"]);
                    callback && callback(Result);
                }
            })
    /*    }
    })*/
}

function get_want_room(user_mid,callback){
    var sql = "Select `want_room` From `line_user` Where `user_mid` = '"+user_mid+"'";
    con.query(sql,function(error,result){
        console.log(result[0]['want_time']);
        callback && callback(result[0]['want_room']);
    })
}

function set_want_room(user_mid,room,callback){
    var sql = "UPDATE `line_user` SET `want_room`='"+room+"' WHERE `user_mid` = '"+user_mid+"'";
    con.query(sql,function(error, result) {
        if(error) callback && callback(error);
        callback && callback("OK");
    })
}

function sql_query(sql,callback){
    con.query(sql,function(error, result) {
        callback && callback(error,result);
    })
}
exports.search_user_status = search_user_status;
exports.set_user_status = set_user_status;
exports.set_user_want_movie = set_user_want_movie;
exports.set_user_want_location = set_user_want_location;
exports.set_want_room = set_want_room;
exports.get_want_room = get_want_room;
exports.sql_query = sql_query;
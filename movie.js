var mysql = require('mysql');

var con = mysql.createConnection({
  host: "db.mis.kuas.edu.tw",
  user: "s1104137130",
  password: "1314520",
  database:"s1104137130"
});

function sql_con(){
  con.connect(function(err) {
    if (err) return false;
    else return true;
  });
}

function search_movie(moive_name,callback){
  if(sql_con){
    var sql = "Select `VIDEO_ID`,`VIDEO_NAME` From `video` Where VIDEO_NAME LIKE '%"+moive_name+"%' AND `KIND_ID` = 1";
    con.query(sql, function (err, result) {
      if (err) throw err;
      var arrResult = new Array();
      for(var row in result){
        arrResult[row] = new Array();
        arrResult[row].push(result[row]['VIDEO_ID']);
        var tmp = result[row]['VIDEO_NAME'].split(" ");
        arrResult[row].push(tmp[0]);
      }
      callback && callback(JSON.stringify(arrResult));
    });
  }
}


exports.search_movie = search_movie;

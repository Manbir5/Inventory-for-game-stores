module.exports = function(){
    var express = require('express');
    var router = express.Router();


    router.get('/', function(req, res){
        var context = {};
        res.render('addGames', context);
    });

    router.post('/', function(req, res){
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Games(game_title, game_rating, game_price, game_genre, game_quantity) VALUES (?,?,?,?,?)";
        var inserts = [req.body.game_title, req.body.game_rating, req.body.game_price, req.body.game_genre, req.body.game_quantity];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/games');
            }
        });
    });


    return router;
}();

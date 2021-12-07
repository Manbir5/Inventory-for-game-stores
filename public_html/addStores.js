module.exports = function(){
    var express = require('express');
    var router = express.Router();


    router.get('/', function(req, res){
        var context = {};
        res.render('addStores', context);
    });

    router.post('/', function(req, res){
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Stores(store_city) VALUES (?)";
        var inserts = [req.body.store_city];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.redirect('/errors');
            }else{
                res.redirect('/stores');
            }
        });
    });



    return router;
}();

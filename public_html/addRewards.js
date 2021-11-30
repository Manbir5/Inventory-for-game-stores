module.exports = function(){
    var express = require('express');
    var router = express.Router();


    router.get('/', function(req, res){
        var context = {};
        res.render('addRewards', context);
    });

    router.post('/', function(req, res){
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Customer_Reward_Programs (customer_id, reward_point, order_id, redeemed_item)  VALUES (?,?,?,?)";
        var inserts = [req.body.customer_id, req.body.rewards_points, req.body.order_id, req.body.redeemed_item];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/rewards');
            }
        });
    });



    return router;
}();

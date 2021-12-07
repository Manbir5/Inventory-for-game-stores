module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getCustomers(res, mysql, context, complete){
        mysql.pool.query("SELECT customer_id, customer_first_name, customer_last_name FROM Customers", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.customers = results;
            complete();
        });
    }

    function getOrders(res, mysql, context, complete){
        mysql.pool.query("SELECT order_id FROM Orders", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.orders = results;
            complete();
        });
    }


    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        getCustomers(res, mysql, context, complete);
        getOrders(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
        res.render('addRewards', context);
            }
        }
    });

    router.post('/', function(req, res){
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Customer_Reward_Programs (customer_id, reward_point, order_id, redeemed_item)  VALUES (?,?,?,?)";
        var inserts = [req.body.customers, req.body.rewards_points, req.body.orders, req.body.redeemed_item];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.redirect('/errors');
            }else{
                res.redirect('/rewards');
            }
        });
    });



    return router;
}();

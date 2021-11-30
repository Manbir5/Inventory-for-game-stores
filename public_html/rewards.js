module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getRewards(res, mysql, context, complete){
        mysql.pool.query("SELECT account_number, customer_id, reward_point, order_id, redeemed_item FROM Customer_Reward_Programs", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.rewards = results;
            complete();
        });
    }


    function getRewardsWithAccountNumberLike(req, res, mysql, context, complete) {
        //sanitize the input as well as include the % character
         var query = "SELECT account_number, customer_id, reward_point, order_id, redeemed_item FROM Customer_Reward_Programs WHERE account_number LIKE " + mysql.pool.escape(req.params.s + '%');
        mysql.pool.query(query, function(error, results, fields){
              if(error){
                  res.write(JSON.stringify(error));
                  res.end();
              }
              context.rewards = results;
              complete();
          });
      }

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteperson.js","filterpeople.js","searchRewards.js","deleteRewards.js"];
        var mysql = req.app.get('mysql');
        getRewards(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('rewards', context);
            }

        }
    });

    
    router.get('/search/:s', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteperson.js","filterpeople.js","searchRewards.js","deleteRewards.js"];
        var mysql = req.app.get('mysql');
        getRewardsWithAccountNumberLike(req, res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('rewards', context);
            }
        }
    });

    router.delete('/:account_number', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Customer_Reward_Programs WHERE account_number = ?";
        var inserts = [req.params.account_number];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                console.log(error)
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                res.status(202).end();
            }
        })
    });  
    
    return router;
}();

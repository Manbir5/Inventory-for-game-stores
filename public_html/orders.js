module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getOrders(res, mysql, context, complete){
        mysql.pool.query("SELECT order_id, order_total, game_title, store_id, customer_id, console_id FROM Orders", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.orders = results;
            complete();
        });
    }


    function getOrdersWithOrderIDLike(req, res, mysql, context, complete) {
        //sanitize the input as well as include the % character
         var query = "SELECT order_id, order_total, game_title, store_id, customer_id, console_id FROM Orders WHERE order_id LIKE " + mysql.pool.escape(req.params.s + '%');
        mysql.pool.query(query, function(error, results, fields){
              if(error){
                  res.write(JSON.stringify(error));
                  res.end();
              }
              context.orders = results;
              complete();
          });
      }


      function getOrdersWithCustomerIDLike(req, res, mysql, context, complete) {
        //sanitize the input as well as include the % character
         var query = "SELECT order_id, order_total, game_title, store_id, customer_id, console_id FROM Orders WHERE customer_id LIKE " + mysql.pool.escape(req.params.s + '%');
        mysql.pool.query(query, function(error, results, fields){
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
        context.jsscripts = ["deleteOrders.js","searchOrders.js"];
        var mysql = req.app.get('mysql');
        getOrders(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('orders', context);
            }

        }
    });


    router.get('/search', function(req,res){
        var context ={};
        res.redirect('/orders');
    })


    router.get('/search2', function(req,res){
        var context ={};
        res.redirect('/orders');
    })


        router.get('/search/:s', function(req, res){
            var callbackCount = 0;
            var context = {};
            context.jsscripts = ["deleteOrders.js","searchOrders.js"];
            var mysql = req.app.get('mysql');
            getOrdersWithOrderIDLike(req, res, mysql, context, complete);
            function complete(){
                callbackCount++;
                if(callbackCount >= 1){
                    res.render('orders', context);
                }
            }
        });


        router.get('/search2/:s', function(req, res){
            var callbackCount = 0;
            var context = {};
            context.jsscripts = ["deleteOrders.js","searchOrders.js"];
            var mysql = req.app.get('mysql');
            getOrdersWithCustomerIDLike(req, res, mysql, context, complete);
            function complete(){
                callbackCount++;
                if(callbackCount >= 1){
                    res.render('orders', context);
                }
            }
        });
    

        router.delete('/:order_id', function(req, res){
            var mysql = req.app.get('mysql');
            var sql = "DELETE FROM Orders WHERE order_id = ?";
            var inserts = [req.params.order_id];
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
        })
  
        
    return router;
}();

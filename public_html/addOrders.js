module.exports = function(){
    var express = require('express');
    var router = express.Router();


    function getConsoles(res, mysql, context, complete){
        mysql.pool.query("SELECT console_id as id, console_main_name FROM Consoles", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.consoles = results;
            complete();
        });
    }

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

    function getStores(res, mysql, context, complete){
        mysql.pool.query("SELECT store_id as sid, store_city FROM Stores", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.stores = results;
            complete();
        });
    }

    function getGames(res, mysql, context, complete){
        mysql.pool.query("SELECT game_title FROM Games", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.games = results;
            complete();
        });
    }

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        getConsoles(res, mysql, context, complete);
        getGames(res, mysql, context, complete);
        getStores(res, mysql, context, complete);
        getCustomers(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 4){
        res.render('addOrders', context);
            }
        }
    });

    router.post('/', function(req, res){
        console.log(req.body)
        var mysql = req.app.get('mysql');
        if (req.body.consoles == ""){
            placeholder_for_console = null;
        }
        else {
            placeholder_for_console = req.body.consoles
        }
        if (req.body.games == ""){
            placeholder_for_game = null;
        }
        else{
            placeholder_for_game = req.body.games
        }
        var sql = "INSERT INTO Orders(order_total, game_title, store_id, customer_id, console_id) VALUES (?,?,?,?,?)";
        var inserts = [req.body.order_total, placeholder_for_game, req.body.stores, req.body.customers, placeholder_for_console];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.redirect('/errors');
            }else{
                res.redirect('/orders');
            }
        });
    });


    return router;
}();

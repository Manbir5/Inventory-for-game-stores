module.exports = function(){
    var express = require('express');
    var router = express.Router();


    function getStores(res, mysql, context, complete){
        mysql.pool.query("SELECT store_id, store_city FROM Stores", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.stores = results;
            complete();
        });
    }


    function getConsoles(res, mysql, context, complete){
        mysql.pool.query("SELECT console_id as cid, console_main_name FROM Consoles", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.consoles = results;
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


    function getStoresAndConsoles(res, mysql, context, complete){
        mysql.pool.query("SELECT store_id, console_id, quantity_of_console_at_store FROM Stores_Consoles", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.storesAndConsoles = results;
            complete();
        });
    }


    function getStoresAndGames(res, mysql, context, complete){
        mysql.pool.query("SELECT store_id, game_title, quantity_of_game_at_store FROM Stores_Games", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.storesAndGames = results;
            complete();
        });
    }


    function getConsolesForStoresLike(req, res, mysql, context, complete) {
        //sanitize the input as well as include the % character
         var query = "SELECT store_id, console_id, quantity_of_console_at_store FROM Stores_Consoles WHERE console_id LIKE " + mysql.pool.escape(req.params.s + '%');
        mysql.pool.query(query, function(error, results, fields){
              if(error){
                  res.write(JSON.stringify(error));
                  res.end();
              }
              context.storesAndConsoles = results;
              complete();
          });
      }
  

      function getGamesForStoresLike(req, res, mysql, context, complete) {
        //sanitize the input as well as include the % character
         var query = "SELECT store_id, game_title, quantity_of_game_at_store FROM Stores_Games WHERE game_title LIKE " + mysql.pool.escape(req.params.s + '%');
        mysql.pool.query(query, function(error, results, fields){
              if(error){
                  res.write(JSON.stringify(error));
                  res.end();
              }
              context.storesAndGames = results;
              complete();
          });
      }
  

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteStores.js"]
        var mysql = req.app.get('mysql');
        getStores(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('stores', context);
            }
        }
    });


    router.get('/storesAndConsoles', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["searchStoresAndConsoles.js","deleteStoresAndConsoles.js"];
        var mysql = req.app.get('mysql');
        getStoresAndConsoles(res, mysql, context, complete);
        getStores(res, mysql, context, complete);
        getConsoles(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('storesAndConsoles', context);
            }
        }
    });
    

    router.get('/storesAndGames', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteStoresAndGames.js","searchStoresAndGames.js"];
        var mysql = req.app.get('mysql');
        getStoresAndGames(res, mysql, context, complete);
        getStores(res, mysql, context, complete);
        getGames(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('storesAndGames', context);
            }
        }
    });


    router.post('/storesAndConsoles', function(req, res){
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Stores_Consoles(store_id, console_id, quantity_of_console_at_store) VALUES (?,?,?)";
        var inserts = [req.body.stores, req.body.consoles,req.body.quantity_of_console_at_store];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/stores/storesAndConsoles');
            }
        });
    });

    
    router.post('/storesAndGames', function(req, res){
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Stores_Games(store_id, game_title, quantity_of_game_at_store) VALUES (?,?,?)";
        var inserts = [req.body.stores, req.body.games, req.body.quantity_of_game_at_store];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.redirect('/errors');
            }else{
                res.redirect('/stores/storesAndGames');
            }
        });
    });


    router.get('/storesAndConsoles/search', function(req,res){
        var context ={};
        res.redirect('/stores/storesAndConsoles');
    })


    router.get('/storesAndConsoles/search/:s', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteStoresAndGames.js","searchStoresAndConsoles.js","deleteStoresAndConsoles.js"];
        var mysql = req.app.get('mysql');
        getConsolesForStoresLike(req, res, mysql, context, complete);
        getStores(res, mysql, context, complete);
        getConsoles(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('storesAndConsoles', context);
            }
        }
    });


    router.get('/storesAndGames/search', function(req,res){
        var context ={};
        res.redirect('/stores/storesAndGames');
    })


    router.get('/storesAndGames/search/:s', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteStoresAndGames.js", "searchStoresAndGames.js"];
        var mysql = req.app.get('mysql');
        getGamesForStoresLike(req, res, mysql, context, complete);
        getStores(res, mysql, context, complete);
        getGames(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('storesAndGames', context);
            }
        }
    });


    router.delete('/:store_id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Stores WHERE store_id = ?";
        var inserts = [req.params.store_id];
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


    router.delete('/storesAndGames/:store_id/:game_title', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Stores_Games WHERE store_id = ? AND game_title = ?";
        var inserts = [req.params.store_id,req.params.game_title];
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


    router.delete('/storesAndConsoles/:store_id/:console_id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Stores_Consoles WHERE store_id = ? AND console_id = ?";
        var inserts = [req.params.store_id,req.params.console_id];
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

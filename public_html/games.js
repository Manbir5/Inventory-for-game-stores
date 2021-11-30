module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getGames(res, mysql, context, complete){
        mysql.pool.query("SELECT game_title, game_rating, game_price, game_genre, game_quantity FROM Games", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.games = results;
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

    function getGamesAndConsoles(res, mysql, context, complete){
        mysql.pool.query("SELECT console_id, game_title FROM Consoles_Games", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.gamesAndConsoles = results;
            complete();
        });
    }

    function getGamesWithGameTitleLike(req, res, mysql, context, complete) {
        //sanitize the input as well as include the % character
         var query = "SELECT game_title, game_rating, game_price, game_genre, game_quantity FROM Games WHERE game_title LIKE " + mysql.pool.escape(req.params.s + '%');
        mysql.pool.query(query, function(error, results, fields){
              if(error){
                  res.write(JSON.stringify(error));
                  res.end();
              }
              context.games = results;
              complete();
          });
      }

      function getGamesForConsolesLike(req, res, mysql, context, complete) {
        //sanitize the input as well as include the % character
         var query = "SELECT console_id, game_title FROM Consoles_Games WHERE game_title LIKE " + mysql.pool.escape(req.params.s + '%');
        mysql.pool.query(query, function(error, results, fields){
              if(error){
                  res.write(JSON.stringify(error));
                  res.end();
              }
              context.gamesAndConsoles = results;
              complete();
          });
      };

      function getSingleGameAndConsoleRel(res, mysql, context, console_id, game_title, complete){
        var sql = " SELECT console_id, game_title FROM Consoles_Games WHERE console_id = ? AND game_title = ?";
        var inserts = [console_id,game_title];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.singleGameAndConsoleRel = results[0];
            complete();
        });
    }
  
    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteGames.js","filterpeople.js","searchGames.js","updateGamesAndConsoles.js"];
        var mysql = req.app.get('mysql');
        getGames(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('games', context);
            }

        }
    });

    
        router.get('/search/:s', function(req, res){
            var callbackCount = 0;
            var context = {};
            context.jsscripts = ["deleteGames.js","filterpeople.js","searchGames.js","updateGamesAndConsoles.js"];
            var mysql = req.app.get('mysql');
            getGamesWithGameTitleLike(req, res, mysql, context, complete);
            function complete(){
                callbackCount++;
                if(callbackCount >= 1){
                    res.render('games', context);
                }
            }
        });


        router.get('/gamesAndConsoles', function(req, res){
            var callbackCount = 0;
            var context = {};
            context.jsscripts = ["deleteGamesAndConsoles.js","filterpeople.js","searchGamesAndConsoles.js","updateGamesAndConsoles.js"];
            var mysql = req.app.get('mysql');
            getGames(res, mysql, context, complete);
            getConsoles(res, mysql, context, complete);
            getGamesAndConsoles(res, mysql, context, complete);
            function complete(){
                callbackCount++;
                if(callbackCount >= 3){
                    res.render('gamesAndConsoles', context);
                }
    
            }
        });

        router.delete('/:game_title', function(req, res){
            var mysql = req.app.get('mysql');
            var sql = "DELETE FROM Games WHERE game_title LIKE " + mysql.pool.escape(req.params.game_title + '%');
            sql = mysql.pool.query(sql, function(error, results, fields){
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

        router.post('/gamesAndConsoles', function(req, res){
            console.log(req.body)
            var mysql = req.app.get('mysql');
            var sql = "INSERT INTO Consoles_Games(console_id, game_title) VALUES (?,?)";
            var inserts = [req.body.consoles, req.body.games];
            sql = mysql.pool.query(sql,inserts,function(error, results, fields){
                if(error){
                    console.log(JSON.stringify(error))
                    res.write(JSON.stringify(error));
                    res.end();
                }else{
                    res.redirect('/games/gamesAndConsoles');
                }
            });
        });


        router.get('/gamesAndConsoles/search/:s', function(req, res){
            var callbackCount = 0;
            var context = {};
            context.jsscripts = ["deleteGamesAndConsoles.js","filterpeople.js","searchGamesAndConsoles.js","updateGamesAndConsoles.js"];
            var mysql = req.app.get('mysql');
            getGamesForConsolesLike(req, res, mysql, context, complete);
            function complete(){
                callbackCount++;
                if(callbackCount >= 1){
                    res.render('gamesAndConsoles', context);
                }
            }
        });

        router.get('/gamesAndConsoles/:console_id/:game_title', function(req, res){
            callbackCount = 0;
            var context = {};
            context.jsscripts = ["updateGamesAndConsoles.js"];
            var mysql = req.app.get('mysql');
            getSingleGameAndConsoleRel(res, mysql, context, req.params.console_id, req.params.game_title, complete);
            function complete(){
                callbackCount++;
                if(callbackCount >= 1){
                    res.render('updateGamesAndConsoles', context);
                }
    
            }
        });

        router.put('/gamesAndConsoles/:console_id/:game_title', function(req, res){
            var mysql = req.app.get('mysql');
            var sql = "UPDATE Consoles_Games SET console_id = ?, game_title = ? WHERE console_id = ? AND game_title = ?";
            var inserts = [req.params.console_id,req.params.game_title];
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

        router.delete('/gamesAndConsoles/:console_id/:game_title', function(req, res){
            var mysql = req.app.get('mysql');
            var sql = "DELETE FROM Consoles_Games WHERE console_id = ? AND game_title = ?";
            var inserts = [req.params.console_id,req.params.game_title];
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

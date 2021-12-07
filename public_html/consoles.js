module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getConsoles(res, mysql, context, complete){
        mysql.pool.query("SELECT console_id, console_company, console_main_name, console_version, console_price, console_quantity FROM Consoles", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.consoles = results;
            complete();
        });
    }


    function getSingleConsole(res, mysql, context, id, complete){
        var sql = " SELECT console_id, console_company, console_main_name, console_version, console_price, console_quantity FROM Consoles WHERE console_id = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.singleConsole = results[0];
            complete();
        });
    }


    function getConsolesWithConsoleMainNameLike(req, res, mysql, context, complete) {
        //sanitize the input as well as include the % character
         var query = "SELECT console_id, console_company, console_main_name, console_version, console_price, console_quantity FROM Consoles WHERE console_main_name LIKE " + mysql.pool.escape(req.params.s + '%');
        mysql.pool.query(query, function(error, results, fields){
              if(error){
                  res.write(JSON.stringify(error));
                  res.end();
              }
              context.consoles = results;
              complete();
          });
      }


    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteConsoles.js","searchConsoles.js"];
        var mysql = req.app.get('mysql');
        getConsoles(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('consoles', context);
            }

        }
    });


    router.get('/search', function(req,res){
        var context ={};
        res.redirect('/consoles');
    })

    
        router.get('/search/:s', function(req, res){
            var callbackCount = 0;
            var context = {};
            context.jsscripts = ["deleteConsoles.js","searchConsoles.js"];
            var mysql = req.app.get('mysql');
            getConsolesWithConsoleMainNameLike(req, res, mysql, context, complete);
            function complete(){
                callbackCount++;
                if(callbackCount >= 1){
                    res.render('consoles', context);
                }
            }
        });


        router.get('/:console_id', function(req, res){
            callbackCount = 0;
            var context = {};
            context.jsscripts = ["updateConsoles.js"];
            var mysql = req.app.get('mysql');
            getSingleConsole(res, mysql, context, req.params.console_id, complete);
            function complete(){
                callbackCount++;
                if(callbackCount >= 1){
                    res.render('updateConsoles', context);
                }
    
            }
        });

        router.put('/:console_id', function(req, res){
            var mysql = req.app.get('mysql');
            var sql = "UPDATE Consoles SET console_company = ?, console_main_name = ?, console_version = ?, console_price = ?, console_quantity = ? WHERE console_id = ?";
            var inserts = [req.body.console_company, req.body.console_main_name, req.body.console_version, req.body.console_price, req.body.console_quantity,  req.params.console_id];
            sql = mysql.pool.query(sql,inserts,function(error, results, fields){
                if(error){
                    console.log(error)
                    res.redirect('/errors');
                }else{
                    res.status(200);
                    res.end();
                }
            });
        });


        router.delete('/:console_id', function(req, res){
            var mysql = req.app.get('mysql');
            var sql = "DELETE FROM Consoles WHERE console_id = ?";
            var inserts = [req.params.console_id];
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

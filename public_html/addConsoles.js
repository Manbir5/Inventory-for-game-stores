module.exports = function(){
    var express = require('express');
    var router = express.Router();


    router.get('/', function(req, res){
        var context = {};
        res.render('addConsoles', context);
    });

    router.post('/', function(req, res){
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Consoles (console_company, console_main_name, console_version, console_price, console_quantity)  VALUES (?,?,?,?,?)";
        var inserts = [req.body.console_company, req.body.console_main_name, req.body.console_version, req.body.console_price, req.body.console_quantity];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/consoles');
            }
        });
    });



    return router;
}();

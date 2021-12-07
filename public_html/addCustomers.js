module.exports = function(){
    var express = require('express');
    var router = express.Router();


    router.get('/', function(req, res){
        var context = {};
        res.render('addCustomers', context);
    });

    router.post('/', function(req, res){
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Customers(customer_first_name, customer_last_name, customer_email, customer_phone_number, customer_address_street_number, customer_address_street_address, customer_address_unit, customer_address_city, customer_address_postal_code, customer_address_province, customer_address_country) VALUES (?,?,?,?,?,?,?,?,?,?,?)";
        var inserts = [req.body.first_name, req.body.last_name, req.body.email, req.body.phone_number, req.body.streetnumber, req.body.street_name, req.body.unit, req.body.city, req.body.postal_code, req.body.province, req.body.country];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.redirect('/errors');
            }else{
                res.redirect('/customers');
            }
        });
    });

    return router;
}();

module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getCustomers(res, mysql, context, complete){
        mysql.pool.query("SELECT customer_id, customer_first_name, customer_last_name, customer_email, customer_phone_number, customer_address_street_number, customer_address_street_address, customer_address_unit, customer_address_city, customer_address_postal_code, customer_address_province, customer_address_country FROM Customers", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.customers = results;
            complete();
        });
    }

    function getSingleCustomer(res, mysql, context, id, complete){
        var sql = " SELECT customer_id, customer_first_name, customer_last_name, customer_email, customer_phone_number, customer_address_street_number, customer_address_street_address, customer_address_unit, customer_address_city, customer_address_postal_code, customer_address_province, customer_address_country FROM Customers WHERE customer_id = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.singleCustomer = results[0];
            complete();
        });
    }


    function getCustomersWithFirstNameLike(req, res, mysql, context, complete) {
        //sanitize the input as well as include the % character
         var query = "SELECT customer_id, customer_first_name, customer_last_name, customer_email, customer_phone_number, customer_address_street_number, customer_address_street_address, customer_address_unit, customer_address_city, customer_address_postal_code, customer_address_province, customer_address_country FROM Customers WHERE customer_first_name LIKE " + mysql.pool.escape(req.params.s + '%');
        mysql.pool.query(query, function(error, results, fields){
              if(error){
                  res.write(JSON.stringify(error));
                  res.end();
              }
              context.customers = results;
              complete();
          });
      }
  

    /*Display all people. Requires web based javascript to delete users with AJAX*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteperson.js","filterpeople.js","searchCustomers.js","deleteCustomers.js"];
        var mysql = req.app.get('mysql');
        getCustomers(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('customers', context);
            }

        }
    });

    
        router.get('/search/:s', function(req, res){
            var callbackCount = 0;
            var context = {};
            context.jsscripts = ["filterpeople.js","searchCustomers.js","deleteCustomers.js"];
            var mysql = req.app.get('mysql');
            getCustomersWithFirstNameLike(req, res, mysql, context, complete);
            function complete(){
                callbackCount++;
                if(callbackCount >= 1){
                    res.render('customers', context);
                }
            }
        });

        router.get('/:customer_id', function(req, res){
            callbackCount = 0;
            var context = {};
            context.jsscripts = ["updateCustomer.js"];
            var mysql = req.app.get('mysql');
            getSingleCustomer(res, mysql, context, req.params.customer_id, complete);
            function complete(){
                callbackCount++;
                if(callbackCount >= 1){
                    res.render('updateCustomers', context);
                }
    
            }
        });

        router.put('/:customer_id', function(req, res){
            var mysql = req.app.get('mysql');
            var sql = "UPDATE Customers SET customer_first_name = ?, customer_last_name = ?, customer_email = ?, customer_phone_number = ?, customer_address_street_number = ?, customer_address_street_address = ?, customer_address_unit = ?, customer_address_city = ?, customer_address_postal_code = ?, customer_address_province = ?, customer_address_country = ? WHERE customer_id = ?";
            var inserts = [req.body.first_name, req.body.last_name, req.body.email, req.body.phone_number, req.body.streetnumber, req.body.street_name, req.body.unit, req.body.city, req.body.postal_code, req.body.province, req.body.country,  req.params.customer_id];
            sql = mysql.pool.query(sql,inserts,function(error, results, fields){
                if(error){
                    console.log(error)
                    res.write(JSON.stringify(error));
                    res.end();
                }else{
                    res.status(200);
                    res.end();
                }
            });
        });

        router.delete('/:customer_id', function(req, res){
            var mysql = req.app.get('mysql');
            var sql = "DELETE FROM Customers WHERE customer_id = ?";
            var inserts = [req.params.customer_id];
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

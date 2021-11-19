module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getcustomers(res, mysql, context, complete){
        mysql.pool.query("SELECT customer_id, customer_first_name, customer_last_name, customer_email, customer_phone_number, customer_address_street_number, customer_address_street_address, customer_address_unit, customer_address_city, customer_address_postal_code, customer_address_province, customer_address_country FROM Customers", function(error, results, fields){
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
        var mysql = req.app.get('mysql');
        getcustomers(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('customers', context);
            }

        }
    });

    /* Display one person for the specific purpose of updating people */

    /* Adds a person, redirects to the people page after adding */

    /* The URI that update data is sent to in order to update a person */

    /* Route to delete a person, simply returns a 202 upon success. Ajax will handle this. */

    return router;
}();

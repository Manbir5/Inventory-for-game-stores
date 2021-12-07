/*
    Uses express, dbcon for database connection, body parser to parse form data
    handlebars for HTML templates
*/

var express = require('express');
var mysql = require('./dbcon.js');
var bodyParser = require('body-parser');

var app = express();
var handlebars = require('express-handlebars').create({
        defaultLayout:'main',
        })

app.engine('handlebars', handlebars.engine);
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.urlencoded({extended:true}));
app.use('/static', express.static('public'));
app.set('view engine', 'handlebars');
app.set('port', process.argv[2]);
app.set('mysql', mysql);
app.use('/customers', require('./customers.js'));
app.use('/addCustomers', require('./addCustomers.js'));
app.use('/orders', require('./orders.js'));
app.use('/addOrders', require('./addOrders.js'));
app.use('/games', require('./games.js'));
app.use('/addGames', require('./addGames.js'));
app.use('/consoles', require('./consoles.js'));
app.use('/addConsoles', require('./addConsoles.js'));
app.use('/stores', require('./stores.js'));
app.use('/addStores', require('./addStores.js'));
app.use('/rewards', require('./rewards.js'));
app.use('/addRewards', require('./addRewards.js'));
app.use('/errors', require('./errors.js'));
app.use('/', express.static('public'));

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});

var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_singmanb',
  password        : '2382',
  database        : 'cs340_singmanb'
});
module.exports.pool = pool;

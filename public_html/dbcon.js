var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'enter own',
  user            : 'enter ownb',
  password        : 'enter own',
  database        : 'enter own'
});
module.exports.pool = pool;

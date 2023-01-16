var mysql = require('mysql');
var mysql_config = {
    host: '10.10.1.67',
    user: 'root',
    password: '123456',
    port:'3306',
    database: 'return_goods',
    timezone:'China',
    useConnectionPooling: true,
    connectionLimit:20
};
// 尾缀功能实现同时使用多条查询语句
var connection = mysql.createConnection(mysql_config, {multipleStatements: true});
connection.connect();

// 暴露模块
module.exports = {
    connection
};
// 175.24.120.211   测试端口
var express = require("express");
var router = express.Router();
const {connection} = require('../util/MySQL')

router.get("/", function(req, res, next) {
// res.send("API is working properly");
    var sql = 'select * from demo;'
    connection.query(sql, function (err, result) {
        if (err) {
            console.log('select error!!', err.message)
            return;
        }
        console.log('----------result-----------')
        console.log(result)
        console.log('---------------------------\n\n')
        var dataString=JSON.stringify(result)
        console.log(dataString)
        // connection.end()
        res.end(dataString);
    })
});
// var data=JSON.parse(dataString)
module.exports = router;
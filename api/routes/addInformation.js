var express = require("express");
var router = express.Router();
const {connection} = require('../util/MySQL')
// "SELECT sales_return.id,car_id,goods.code,goods.gname,return_type,return_quantity,return_time FROM sales_return,goods where order_id=goods.id and car_id= "+req.query['storeman_number']+" and storeman_id="+req.query['storeman_number']+" and return_time=curdate() ORDER BY sales_return.id DESC LIMIT 0,50;"

router.get("/", function (req, res, next) {
// res.send("API is working properly");
//     console.log(req.query)
//     console.log(req.query['good_number'],req.query['truck_number'],req.query['storeman_number'])
    // console.log(req.query['good_number'],req.query['truck_number'],req.query['storeman_number'])
    const timeTotal = new Date()
    var date = timeTotal.getFullYear() + '/' + (timeTotal.getMonth() + 1) + '/' + timeTotal.getDate()
    var timeResult = date + ' 23:59:59'
    // console.log(timeResult)
    // console.log(req.query['timeLag'])
    var sql = "SELECT sales_return.id,car_nanfang.car_info,goods.code,goods.gname,return_type,return_quantity,return_time FROM sales_return,goods,car_nanfang where order_id=goods.id and car_nanfang.id=car_id and car_id=" + req.query['truck_number'] + " and storeman_id=" + req.query['storeman_number'] + " and DATE(return_time)=curdate() and return_time BETWEEN '" + req.query['timeLag'] + "' and '" + timeResult + "' ORDER BY sales_return.id DESC LIMIT 0,50;"
    connection.query(sql, function (err, result) {
        if (err) {
            console.log('select error!!', err.message)
            return;
        }
        var dataString = JSON.stringify(result)
        // console.log(dataString)
        res.send(dataString);
    })
    // res.end('from getGoodsFunction finished.')
});

router.post("/update", function (req, res, next) {
    // 更新退货单信息 "+req.query['username']+"
    // console.log(req.query['return_quantity'],req.query['update_operater'],req.query['id'])
    var sql = 'UPDATE sales_return\n' +
        'SET return_quantity=' + req.query['return_quantity'] + ',update_operater=' + req.query['update_operater'] + ',update_time=NOW()\n' +
        'WHERE id=' + req.query['id']
    connection.query(sql, function (err, result) {
        if (err) {
            console.log('Insert error', err.message)
            return;
        }
        res.end('Update success.');
    })
});

router.post("/delete", function (req, res, next) {
    // 删除退货单信息 "+req.query['username']+"
    // console.log(req.query['id'])
    var sql = 'DELETE\n' +
        'from sales_return\n' +
        'where id=' + req.query['id']
    connection.query(sql, function (err, result) {
        if (err) {
            console.log('Insert error', err.message)
            return;
        }
        res.end('Delete success.');
    })
});

router.post("/stub", function (req, res, next) {
    // 插入退货单信息 "+req.query['username']+"
    // console.log(req.query['id'])
    var sql = "INSERT into stub (id,car_info,storeman_id,`code`,gname,return_type,return_quantity,return_time,delete_time)\n" +
        "VALUES(" + req.query['id'] + ",'" + req.query['car_info'] + "'," + req.query['storeman_id'] + "," + req.query['code'] + ",'" + req.query['gname'] + "','" + req.query['return_type'] + "'," + req.query['return_quantity'] + ",'" + req.query['return_time'] + "',NOW())"
    connection.query(sql, function (err, result) {
        if (err) {
            console.log('Insert error', err.message)
            return;
        }
        res.end('Stub Insert success.');
    })
});

router.post("/", function (req, res, next) {
// res.send("API is working properly");
//     console.log(req.body,typeof req.body)
//     console.log(req.body['good_number'],req.body['truck_number'],req.body['storeman_number'],req.body['return_type'])
    var type = "'" + req.body['return_type'] + "'"
    // console.log(type)
    var sql = "insert into sales_return(order_id,return_quantity,car_id,storeman_id,return_type,return_time) value((SELECT id FROM goods where code=" + req.body['good_number'] + ")," + req.body['return_quantity'] + "," + req.body['truck_number'] + "," + req.body['storeman_number'] + "," + type + ",NOW());"
    connection.query(sql, function (err, result) {
        if (err) {
            console.log('select error!!', err.message)
            return;
        }
        var dataString = JSON.stringify(result)
        res.end(dataString);
    })
    // res.end('from addGoodsFunction finished.')
});
router.get("/material", function (req, res, next) {
    console.log(typeof req.query['car_info'])
    var sql = `SELECT real_chassis,real_cargo
        from car_nanfang
        where car_info='${req.query['car_info']}'`
    connection.query(sql, function (err, result) {
        if (err) {
            console.log('select error!!', err.message)
            return;
        }
        var dataString = JSON.stringify(result)
        var dataJson = JSON.parse(dataString)
        // console.log(dataJson)
        res.send(dataJson)
    })
});
router.get("/materialUpdate", function (req, res, next) {
    console.log(typeof req.query['car_info'])
    var sql = `update car_nanfang
        set real_chassis=${req.query['chassis']},real_cargo=${req.query['cargo']}
        where car_info='${req.query['car_info']}'`
    connection.query(sql, function (err, result) {
        if (err) {
            console.log('select error!!', err.message)
            return;
        }
        res.send('materialUpdate Successful!')
    })
});
module.exports = router;
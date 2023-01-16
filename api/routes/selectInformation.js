var express = require("express");
var router = express.Router();
var nodeExcel = require('excel-export');
const {connection} = require('../util/MySQL')
const {log} = require("debug");

router.get("/", function (req, res, next) {
// res.send("API is working properly");
//     console.log(req.query)
//     console.log(req.query['return_time'], req.query['car_id'])
    var sql="SELECT car_info,gname,tname as code,return_type,SUM(return_quantity) as return_quantity,DATE(sales_return.return_time) as return_time\n" +
        "FROM car_nanfang,goods,sales_return,type\n" +
        "WHERE car_nanfang.id = sales_return.car_id AND goods.id = sales_return.order_id AND goods.category_id = type.id AND DATE(sales_return.return_time) =" + req.query['return_time'] + " AND sales_return.car_id = " + req.query['car_id'] + "\n" +
        "GROUP BY gname,car_info,tname,return_type,DATE(sales_return.return_time);"
    connection.query(sql, function (err, result) {
        if (err) {
            console.log('select error!!', err.message)
            return;
        }
        var dataString = JSON.stringify(result)
        // console.log(dataString)
        // connection.end()
        res.send(dataString);
    })
});

router.get("/singleExcel",function (req,res,next){
    var sql = "SELECT car_info as car_id,gname,tname as code,return_type,SUM(return_quantity) as return_quantity,return_time\n" +
        "    FROM car,goods,sales_return,type\n" +
        "    WHERE car.id = sales_return.car_id AND goods.id = sales_return.order_id AND goods.category_id = type.id AND DATE(sales_return.return_time) =" + req.query['return_time'] + " AND sales_return.car_id = " + req.query['car_id'] + "\n" +
        "    GROUP BY gname,car_info,tname,return_type,return_time ;"

    connection.query(sql, function (err, result) {
        if (err) {
            console.log('select error!!', err.message)
            return;
        }
        var dataString = JSON.stringify(result)
        var dataJson =JSON.parse(dataString)
        // console.log(dataString)
        // connection.end()
        // for (i=0;i<dataJson.length;i++){
        //     console.log(dataJson[i])
        //     console.log(dataJson[i]['gname'])
        // }

        // res.send(dataString);

        var name = encodeURI('运送车退单表');
        var conf ={};
        conf.name = req.query['return_time'];//表下面名字，默认不能为中文

        let colsArr = [
            {
                caption:'行',
                type:'number',
            },
            {
                caption:'运送车号',
                type:'string',
            },
            {
                caption:'商品名称',
                type:'string',
            },
            {
                caption:'商品系列',
                type:'string',
            },
            {
                caption:'退货类型',
                type:'string',
            },
            {
                caption:'退货数量',
                type:'number',
            },
            {
                caption:'退货日期',
                type:'string',
            },
        ];
        conf.cols = colsArr;

        /**
         * 表内容数据
         * */
        let data = []
        let sum=0
        for(i=0;i<dataJson.length;i++){
            data.push({
                运送车号:dataJson[i]['car_id'],
                商品名称:dataJson[i]['gname'],
                商品系列:dataJson[i]['code'],
                退货类型:dataJson[i]['return_type'],
                退货数量:dataJson[i]['return_quantity'],
                退货日期:req.query['return_time']
            })
            sum=sum+dataJson[i]['return_quantity']
        }
        data.push({
            运送车号:'配送人员',
            商品名称:'',
            商品系列:'',
            退货类型:'数量总计',
            退货数量:sum,
            退货日期:req.query['return_time']
        })

        let array =[];
        for(var i=0; i<data.length; i++){
            var temp = new Array();
            temp[0] = i+1;
            temp[1] = data[i].运送车号;
            temp[2] = data[i].商品名称;
            temp[3] = data[i].商品系列;
            temp[4] = data[i].退货类型;
            temp[5] = data[i].退货数量;
            temp[6] = data[i].退货日期;

            array.push(temp);
        }
        conf.rows = array
        var result = nodeExcel.execute(conf);
        //
        res.setHeader('Content-Type', 'application/vnd.openxmlformats;charset=utf-8');
        // res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
        res.setHeader("Content-Disposition", "attachment; filename=" + name + ".xlsx");

        res.end(result, 'binary');
        // res.send(dataString);
    })
})

router.get("/excel", function (req, res, next) {
    var sql = "SELECT car_info as car_id,gname,tname as code,return_type,SUM(return_quantity) as return_quantity,return_time\n" +
        "    FROM car,goods,sales_return,type\n" +
        "    WHERE car.id = sales_return.car_id AND goods.id = sales_return.order_id AND goods.category_id = type.id AND DATE(sales_return.return_time) =" + req.query['return_time'] +
        "    GROUP BY gname,car_info,tname,return_type,return_time ;"
    connection.query(sql, function (err, result) {
        if (err) {
            console.log('select error!!', err.message)
            return;
        }
        // console.log(result, typeof result)
        var dataString = JSON.stringify(result)
        var dataJson = JSON.parse(dataString)
        // console.log(dataJson, typeof dataJson)
        // console.log(dataJson[0]['gname'])
        // console.log(dataJson[1]['gname'])
        // console.log(dataJson[2]['gname'])


        var name = encodeURI('退货单总表');
        var conf = {};
        conf.name = req.query['return_time'];//表下面名字，默认不能为中文
        const car_array = ['系列分类', '配送车号', '南方01号车', '南方02号车', '南方03号车', '南方04号车', '南方05号车', '南方06号车', '南方07号车', '南方08号车', '南方09号车', '南方10号车', '南方11号车', '南方12号车', '南方14号车', '南方15号车', '南方16号车', '南方17号车', '南方18号车', '南方19号车', '南方20号车', '南方21号车', '南方22号车', '南方23号车', '南方24号车', '南方26号车', '南方27号车', '南方28号车', '南方29号车', '南方30号车', '安顺车', '白云01号', '白云02号', '白云03号', '白云配送', '百花配送', '长沙车', '大学城配送', '都匀车', '二戈寨配送', '贩卖机二', '服务车', '观山湖配送', '观山湖商超', '贵安配送车', '贵草车', '盒马车', '花果园配送', '花果园商2', '花果园商3', '花果园商超', '花溪车', '怀化车', '惠水车', '金阳配送', '开阳车', '凯里车', '门面10号', '门面03号', '门面04号', '门面05号', '门面07号', '门面08号', '黔西车', '清镇车', '清镇配送', '商超10号', '商超11号', '商超13号', '商超01号', '商超02号', '商超03号', '商超04号', '商超05号', '商超06号', '商超07号', '商超08号', '商超09号', '世纪城配送', '水城车', '送奶到区', '送奶二车', '送奶三车', '特渠配送', '铜仁2号车', '铜仁车', '未来方舟二', '未来方舟配', '乌当配送', '西线车', '息烽车', '习水车', '兴义02号车', '兴义车', '玉屏车', '遵义车', '遵义配送', '遵义外县车', '遵义自提车']
        //列数据设置
        const car_cols = new Array()
        car_cols.push(
            {
                caption: '系列分类',
                type: 'string',
            },
            {
                caption: '配送车号',
                type: 'string',
            }
        )
        for (i = 2; i < car_array.length; i++) {
            var car_col = {
                caption: car_array[i],
                type: 'number'
            }
            car_cols.push(car_col)
        }
        conf.cols = car_cols;
        const car_line = ['爱克林1953纯牛奶', '爱克林1953黑加仑酸奶', '爱克林1953蓝莓酸奶', '爱克林1953酸牛奶', '爱克林菠萝酸奶', '爱克林草莓酸奶', '爱克林淳酸奶', '爱克林淳鲜奶', '爱克林大特浓牛奶', '爱克林富硒鲜牛奶', '爱克林黑牛奶', '爱克林红枣牛奶', '爱克林零蔗糖白桃酸奶', '爱克林零蔗糖车厘子酸奶', '爱克林零蔗糖原味酸奶', '爱克林芦荟酸奶', '爱克林乳钙酸奶', '爱克林特浓酸奶', '爱克林小特浓牛奶', '屋顶365纯奶', '屋顶450有机鲜牛奶', '屋顶950鲜牛奶', '屋顶950益生菌酸奶', '屋顶950有机鲜牛奶', '屋顶冰淇淋酸奶', '屋顶菠萝粒酸奶', '屋顶草莓粒酸奶', '屋顶蓝莓粒酸奶', '屋顶芦荟粒酸奶', '屋顶无糖酸奶', '屋顶鲜牛奶', '屋顶原味酸奶', '八联杯草莓酸奶', '八联杯红枣酸奶', '八联杯芦荟酸奶', '八联杯原味酸奶', '纸杯红枣酸奶', '纸杯原味酸奶', '碧海瓶250ml鲜牛奶', '花溪老酸奶', '椰香优酪酸奶', '塑瓶爆有料百香果爆珠酸奶', '塑瓶爆有料玫瑰爆珠酸奶', '塑瓶刺梨酸奶', '塑瓶回归半糖酸奶', '塑瓶回归原味酸奶', '塑瓶有机鲜奶', '侠客小牛酸酸奶', '玻瓶乳钙酸奶', '玻瓶鲜牛奶', '玻瓶特品鲜牛奶', '维生素AD奶', '巴氏鲜牛奶', '鲜牛奶', '贵草200鲜奶', '贵草125鲜奶', '贵草酸牛奶', '透明袋原味酸奶', '透明袋烧酸奶', '透明纯', '百利包纯牛奶', '百利包麦香奶', '百利包甜牛奶']
        const car_line_type = ['爱克林系列', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '屋顶盒系列', '', '', '', '', '', '', '', '', '', '', '', '', '联杯系列', '', '', '', '纸杯系列', '', '碧海瓶系列', '塑杯系列', '', '塑瓶系列', '', '', '', '', '', '玻瓶系列', '', '', '', '袋装系列', '', '', '', '', '', '透明袋系列', '', '', '百利包系列', '', '']
        const car_lins = new Array()
        for (i = 0; i < car_line.length; i++) {
            var car_lin = new Array()
            car_lin[0] = car_line_type[i]
            car_lin[1] = car_line[i]
            for (j = 2; j < car_array.length; j++)
                for (var row in dataJson) {
                    // console.log(dataJson[row])
                    // console.log(dataJson[row]['car_id'], dataJson[row]['gname'],dataJson[row]['return_quantity'])
                    // console.log(car_cols[j]['caption'],car_line[i])
                    if (dataJson[row]['car_id'] == car_cols[j]['caption'] && dataJson[row]['gname'] == car_line[i]) {
                        car_lin[j] = dataJson[row]['return_quantity']
                        // console.log(car_lin[j],'result')
                        break
                    } else
                        car_lin[j] = ''
                }
            car_lins.push(car_lin)
        }
        conf.rows = car_lins
        var result = nodeExcel.execute(conf);

        res.setHeader('Content-Type', 'application/octet-stream;charset=utf-8');
        res.setHeader("Content-Disposition", "attachment; filename=" + name + ".xlsx");
        res.end(result, 'binary');
        // res.send('finished')
    })
})

router.get("/part", function (req, res, next) {
    console.log(typeof req.query['division'],req.query['division'])
    var sql="SELECT divisions.id,division_name,car_nanfang.id as num,car_info as label\n" +
        "from car_nanfang,divisions\n" +
        "where divisions.id=car_nanfang.bus_division and \n" +
        "division_name = '"+ req.query['division']+"'"
    connection.query(sql, function (err, result) {
        if (err) {
            console.log('select error!!', err.message)
            return;
        }
        var dataString = JSON.stringify(result)
        var dataJson = JSON.parse(dataString)
        // console.log(typeof dataJson,dataJson)
        var datalist=[]
        for(var i=0;i<dataJson.length;i++){
            datalist.push({label:dataJson[i]['label'],id:dataJson[i]['num']})
        }
        // console.log(datalist)
        // connection.end()
        res.send(datalist);
    })
});
router.get("/user", function (req, res, next) {
    console.log(typeof req.query['username'],req.query['username'])
    console.log(typeof req.query['password'],req.query['password'])
    var sql="SELECT user.id,username,password,bus_division,division_name\n" +
        "FROM `user`,divisions\n" +
        "where username="+ req.query['username']+" and password='"+ req.query['password']+"' and divisions.id=`user`.bus_division"
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
router.get("/table", function (req, res, next) {
    console.log(typeof req.query['division'],req.query['division'])
    console.log(typeof req.query['carname'],req.query['carname'])
    console.log(typeof req.query['status'],req.query['status'])
    var sql
    if (req.query['carname']==='undefined'){
        sql="SELECT divisions.id,division_name,car_nanfang.car_info,goods.gname,goods.code,sum(sales_return.return_quantity) as sum,sales_return.return_type,date(sales_return.return_time) as return_time\n" +
            "from divisions,car_nanfang,goods,sales_return\n" +
            "where division_name="+req.query['division']+" and sales_return.order_id=goods.id and sales_return.car_id=car_nanfang.id and car_nanfang.bus_division = divisions.id and date(sales_return.return_time)="+req.query['return_time']+" \n" +
            "GROUP BY divisions.id,division_name,car_nanfang.car_info,goods.gname,goods.code,sales_return.return_type,date(sales_return.return_time)"
    }else if (req.query['status']==='1'){
        sql="SELECT divisions.id,division_name,car_nanfang.car_info,goods.gname,goods.code,sum(sales_return.return_quantity) as sum,sales_return.return_type,date(sales_return.return_time) as return_time\n" +
            "from divisions,car_nanfang,goods,sales_return\n" +
            "where division_name="+req.query['division']+" and sales_return.order_id=goods.id and sales_return.car_id=car_nanfang.id and car_nanfang.bus_division = divisions.id and date(sales_return.return_time) BETWEEN "+req.query['begin_date']+" and "+req.query['end_date']+" \n" +
            "GROUP BY divisions.id,division_name,car_nanfang.car_info,goods.gname,goods.code,sales_return.return_type,date(sales_return.return_time)"
    }else{
        sql="SELECT divisions.id,division_name,car_nanfang.car_info,goods.gname,goods.code,sum(sales_return.return_quantity) as sum,sales_return.return_type,date(sales_return.return_time) as return_time\n" +
            "from divisions,car_nanfang,goods,sales_return\n" +
            "where division_name="+req.query['division']+" and sales_return.order_id=goods.id and sales_return.car_id=car_nanfang.id and car_nanfang.bus_division = divisions.id and date(sales_return.return_time)="+req.query['return_time']+" and car_nanfang.car_info = '"+req.query['carname']+"'\n" +
            "GROUP BY divisions.id,division_name,car_nanfang.car_info,goods.gname,goods.code,sales_return.return_type,date(sales_return.return_time)"
    }

    connection.query(sql, function (err, result) {
        if (err) {
            console.log('select error!!', err.message)
            return;
        }
        var dataString = JSON.stringify(result)
        var dataJson = JSON.parse(dataString)
        var name=encodeURI('商品汇总')
        var conf={}
        conf.name="table"
        conf.cols=[
            {
                caption: '索引',
                type:'number',
                width:6
            },
            {
                caption: '序号',
                type:'number',
                width:4.78
            },
            {
                caption: '销售组织',
                type:'string',
                width:10.89
            },
            {
                caption: '运送车号',
                type:'string',
                width:8.78
            },
            {
                caption: '商品名',
                type:'string',
                width:15.33
            },
            {
                caption: '商品编码',
                type:'string',
                width:14.22
            },
            {
                caption: '退货数量',
                type:'number',
                width:8.79
            },
            {
                caption: '退货类型',
                type:'string',
                width:8.78
            },
            {
                caption: '退货日期',
                type:'string',
                width:24
            }
        ]
        var list=[]
        dataJson.forEach(function (item,index){
            // console.log(index,item)
            list.push([
                index+1,
                item['id'],
                item['division_name'],
                item['car_info'],
                item['gname'],
                item['code'],
                item['sum'],
                item['return_type'],
                item['return_time']
            ])
        })
        // console.log(list)
        conf.rows=list

        var dataResult=nodeExcel.execute(conf)

        res.setHeader('Content-Type', 'application/octet-stream;charset=utf-8');
        res.setHeader("Content-Disposition", "attachment; filename=" + name + ".xlsx");
        res.end(dataResult, 'binary');
    })
});
module.exports = router;
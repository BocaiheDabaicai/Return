import React from 'react';
import './index.css'
import ReactToPrint from 'react-to-print';
import {DesktopDatePicker} from '@mui/x-date-pickers/DesktopDatePicker';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import {
    Box,
    Button,
    Container,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Modal, Select,
    Stack,
    Switch,
    Typography
} from "@mui/material";
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import axios from "axios";
import Divider from '@mui/material/Divider';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Snackbar from '@mui/material/Snackbar';
import Alert from "@mui/material/Alert";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 10,
    mt: 3
};

const messageStyle = {
    position: 'absolute',
    top: '35%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'auto',
    height: 400,
    bgcolor: 'background.paper',
    border: '1px solid #37b7ca',
    borderRadius: 3,
    boxShadow: 6,
    p: 4,
    overflow: 'auto'
};

// const testData = [
//     {
//         "car_info": "01号车",
//         "gname": "爱克林菠萝酸奶",
//         "code": "爱克林系列",
//         "return_type": "临期退货",
//         "return_quantity": 4,
//         "return_time": "2023-01-11"
//     },
//     {
//         "car_info": "01号车",
//         "gname": "屋顶950鲜牛奶",
//         "code": "屋顶盒系列",
//         "return_type": "临期退货",
//         "return_quantity": 1,
//         "return_time": "2023-01-11"
//     },
//     {
//         "car_info": "01号车",
//         "gname": "爱克林红枣牛奶",
//         "code": "爱克林系列",
//         "return_type": "临期退货",
//         "return_quantity": 1,
//         "return_time": "2023-01-11"
//     },
//     {
//         "car_info": "01号车",
//         "gname": "爱克林红枣牛奶",
//         "code": "爱克林系列",
//         "return_type": "正常漏液",
//         "return_quantity": 1,
//         "return_time": "2023-01-11"
//     },
//     {
//         "car_info": "01号车",
//         "gname": "爱克林菠萝酸奶",
//         "code": "爱克林系列",
//         "return_type": "正常漏液",
//         "return_quantity": 1,
//         "return_time": "2023-01-11"
//     },
//     {
//         "car_info": "01号车",
//         "gname": "屋顶鲜牛奶",
//         "code": "屋顶盒系列",
//         "return_type": "非正常漏液",
//         "return_quantity": 1,
//         "return_time": "2023-01-11"
//     },
//     {
//         "car_info": "01号车",
//         "gname": "屋顶950鲜牛奶",
//         "code": "屋顶盒系列",
//         "return_type": "非正常漏液",
//         "return_quantity": 1,
//         "return_time": "2023-01-11"
//     }
// ]
// react setState => diff virture dom => rerender
//   O
// O  O
//O O O 0
function Index(props) {
    const {
        infomation,
        timeLag,
        componentRef,
        addResult,
        addGoodresult,
        goodNumber,
        setGoodNumber,
        goodQuentity,
        setGoodQuentity,
        setControlList,
        setTimeLag,
        setShowList
    } = props
    const [value, setValue] = React.useState(new Date());
    const [modelbool, setModelbool] = React.useState(false);
    const [open, setOpen] = React.useState(false)
    const [modalvalue, setModalvalue] = React.useState({});
    const [returntype, setReturntype] = React.useState('临期退货');
    const [carinfo, setCarinfo] = React.useState([]);
    const [carname, setCarName] = React.useState();
    const [carChoice, setCarChoice] = React.useState(undefined);
    const [messageOpen, setMessageOpen] = React.useState(true)
    const [expanded, setExpanded] = React.useState(false);
    const [beginDate, setBeginDate] = React.useState(new Date())
    const [endDate, setEndDate] = React.useState(new Date())
    const [handAdd, setHandAdd] = React.useState(false)
    const [openMaterial, setOpenMaterial] = React.useState(false)
    const [chassisCount, setChassisCount] = React.useState(0)
    const [cargoCount, setCargoCount] = React.useState(0)
    const [materialModal, setMaterialModal] = React.useState(true)
    const [material, setMaterial] = React.useState({
        cargo: 0,
        chassis: 0
    })
    const [openTip, setOpenTip] = React.useState({
        text: 'success',
        message: '',
        state: false
    })
    const [tableData, setTableData] = React.useState([[
        {car_info:"还没有值",return_time:"请先查询"}
    ],[],[],[],[],[],[],[],[]])
    const [printModal,setPrintModal] = React.useState(false)
    const [storeman,setStoreman] = React.useState();
    const [jugement1,setJugement1] = React.useState(true);
    const [jugement2,setJugement2] = React.useState(true);

    const handleChange = (newValue) => {
        setValue(newValue);
    };

    const handleBeginChange = (newValue) => {
        setBeginDate(newValue);
    };

    const handleEndChange = (newValue) => {
        setEndDate(newValue);
    };

    const handleExpandChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        // console.log({
        //     date: data.get('order_date'),
        //     truck: data.get('truck_number'),
        //     number: data.get('order_number')
        // });
        if (data.get('truck_number') === '') {
            handleOpenTip('warning', '请填写运送车号')
        } else {
            carinfo.forEach(function (item) {
                // console.log(item)
                if (data.get('truck_number') === item['label']) {
                    // setCarName(data.get('truck_number'))
                    addResult({
                        date: data.get('order_date'),
                        truck: item['id'].toString(),
                        number: data.get('order_number')
                    });

                    axios.get("/api1/selectInformation?return_time=" + data.get('order_date') + "&car_id=" + item['id'].toString() + "").then(response => {
                        console.log("response.data",response.data)
                        console.log("response.data[0]",response.data[0])
                        console.log(response.data.length)
                        const tempArray = response.data
                        let temp1 = [{car_info: "还没有值", return_time: "请先查询"}]
                        let temp2 = []
                        let temp3 = []
                        let temp4 = []
                        let temp5 = []
                        let temp6 = []
                        let temp7 = []
                        let temp8 = []
                        let temp9 = []
                        if(response.data[0] !== undefined) {
                            temp1 = []
                            temp2 = []
                            temp3 = []
                            temp4 = []
                            temp5 = []
                            temp6 = []
                            temp7 = []
                            temp8 = []
                            temp9 = []
                            tempArray.forEach((item, index) => {
                                if (index < 6) {
                                    temp1.push(item)
                                } else if (index >= 6 && index < 12) {
                                    temp2.push(item)
                                } else if (index >= 12 && index < 18) {
                                    temp3.push(item)
                                } else if (index >= 18 && index < 24) {
                                    temp4.push(item)
                                } else if (index >= 30 && index < 36) {
                                    temp5.push(item)
                                } else if (index >= 36 && index < 42) {
                                    temp6.push(item)
                                } else if (index >= 42 && index < 48) {
                                    temp7.push(item)
                                } else if (index >= 48 && index < 54) {
                                    temp8.push(item)
                                } else {
                                    temp9.push(item)
                                }
                            })

                            if (temp4[0] === undefined) {
                                setJugement1(false)
                            } else {
                                setJugement1(true)
                            }
                            if (temp7[0] === undefined) {
                                setJugement2(false)
                            } else {
                                setJugement2(true)
                            }

                            console.log(temp1, temp2, temp3, temp4, temp5, temp6, temp7, temp8, temp9)
                        }
                        setTableData([temp1, temp2, temp3, temp4, temp5, temp6, temp7, temp8, temp9]);
                    }).catch(error => {
                        console.log('error: ', error)
                    })

                    axios.get(`/api1/selectInformation/storeman?id=${modalvalue['storeman_number']}`).then(response=>{
                        console.log(response.data[0].name)
                        // let name = response.data
                        setStoreman(response.data[0].name)
                    })

                    setPrintModal(true)
                }
            });
            props.setOperateSearch();
            handleOpenTip('success', data.get('truck_number') + '查询成功')
        }
    };

    const handleInformation = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        if (data.get('good_number').length === 4) {
            const supplement_number = '692777090'
            const concat_data = supplement_number.concat(data.get('good_number'))
            const datas = Object.assign({
                good_number: concat_data,
                return_quantity: Number(data.get('return_quantity'))
            }, modalvalue)
            console.log(datas)
            axios.post("/api1/addInformation", datas).then(res => {
                // console.log('axios使用成功', res)
            }).catch(err => {
                // console.log('axios使用失败', err)
            })
            handleOpenTip('success', '手动添加成功')
            props.setOperateAdd();
            addGoodresult(datas)
        } else if (data.get('good_number').length === 13) {
            const datas = Object.assign({good_number: data.get('good_number'), return_quantity: 1}, modalvalue)
            axios.post("/api1/addInformation", datas).then(res => {
                // console.log('axios使用成功', res)
            }).catch(err => {
                // console.log('axios使用失败', err)
            })
            handleOpenTip('success', '扫描枪添加成功')
            props.setOperateAdd();
            addGoodresult(datas)
        } else {
            handleOpenTip('error', '添加失败，请检查你的输入编码')
        }
        // console.log('Compeleted.')
    };

    const handleOpenModal = (event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget);
        if (data.get('truck_number') === '') {
            console.log('error')
            handleOpenTip('warning', '请填写运送货车')
        } else {
            carinfo.forEach(function (item) {
                // console.log(item)
                if (data.get('truck_number') === item['label']) {
                    setCarName(data.get('truck_number'))
                    // console.log({
                    //     truck_number: item['id'].toString(),
                    //     storeman_number: data.get('storeman_number'),
                    //     return_type: data.get('return_type')
                    // });
                    setModalvalue({
                        truck_number: item['id'].toString(),
                        storeman_number: data.get('storeman_number'),
                        return_type: data.get('return_type')
                    });
                }
                // console.log('down')
            });
            var timeTotal = new Date()
            var date = timeTotal.getFullYear() + '/' + (timeTotal.getMonth() + 1) + '/' + timeTotal.getDate()
            var time = timeTotal.getHours() + ':' + timeTotal.getMinutes() + ':' + timeTotal.getSeconds()
            setTimeLag(date + ' ' + time)


            axios.get(`/api1/addInformation/material?car_info=${data.get('truck_number')}`).then(response => {
                console.log(response.data[0])
                if (response.data[0].real_cargo === null || response.data[0].real_chassis === null) {
                    setMaterial({cargo: 0, chassis: 0})
                } else {
                    setMaterial({cargo: response.data[0].real_cargo, chassis: response.data[0].real_chassis})
                    setChassisCount(response.data[0].real_chassis)
                    setCargoCount(response.data[0].real_cargo)
                }
            }, error => {
                console.log(error.messages)
            })


            handleOpenTip('success', '基本配置成功')
            setMaterialModal(false)
        }
        handleClose()
    }
    const changeReturntype = (event) => {
        // console.log(event.target.value)
        const temdata = event.target.value
        setReturntype(temdata);
        // console.log(temdata, returntype)
    };

    const createExcel = () => {
        if (carChoice === undefined) {
            handleOpenTip('error', '请填写运送车号')
        } else {
            const year = value.getFullYear().toString()
            const month = (value.getMonth() + 1) < 10 ? '0'.concat((value.getMonth() + 1)).toString() : (value.getMonth() + 1).toString()
            const day = value.getDate() < 10 ? '0'.concat(value.getDate().toString()) : value.getDate().toString()
            const data_string = year.concat(month).concat(day)
            console.log(data_string, typeof data_string)
            console.log(carChoice, typeof carChoice)
            console.log(infomation[1], typeof infomation[1])
            axios.get("/api1/selectInformation/table?division='" + infomation[1] + "'&return_time=" + data_string + "&carname=" + carChoice, {responseType: 'blob'}).then(res => {
                const blob = new Blob([res.data]);//处理文档流
                // console.log(res.data)
                const fileName = infomation[1] + "_退货汇总表_" + data_string + ".xlsx";
                const elink = document.createElement('a');
                elink.download = fileName;
                elink.style.display = 'none';
                elink.href = URL.createObjectURL(blob);
                document.body.appendChild(elink);
                elink.click();
                URL.revokeObjectURL(elink.href); // 释放URL 对象
                document.body.removeChild(elink);
                // console.log('finished in download.')
            })
            handleOpenTip('success', carChoice + ' 于 ' + data_string + ' 的数据导出成功')
        }

    }

    const createTimeRangeExcel = () => {
        // console.log(value.getFullYear(), typeof value.getFullYear())
        // console.log(value.getMonth() + 1, typeof value.getMonth())
        // console.log(value.getDate(), typeof value.getDate())
        // console.log(value.getFullYear().toString().concat('0'.concat((value.getMonth() + 1).toString())).concat(value.getDate().toString()))
        if (carChoice === undefined) {
            handleOpenTip('error', '请填写运送车号')
        } else if (beginDate === null || endDate === null) {
            handleOpenTip('error', '请填写起止日期')
        } else {
            const beginYear = beginDate.getFullYear().toString()
            const beginMonth = (beginDate.getMonth() + 1) < 10 ? '0'.concat((beginDate.getMonth() + 1)).toString() : (beginDate.getMonth() + 1).toString()
            const beginDay = beginDate.getDate() < 10 ? '0'.concat(beginDate.getDate().toString()) : beginDate.getDate().toString()
            const begin_date = beginYear.concat(beginMonth).concat(beginDay)

            const endYear = endDate.getFullYear().toString()
            const endMonth = (endDate.getMonth() + 1) < 10 ? '0'.concat((endDate.getMonth() + 1)).toString() : (endDate.getMonth() + 1).toString()
            const endDay = endDate.getDate() < 10 ? '0'.concat(endDate.getDate().toString()) : endDate.getDate().toString()
            const end_date = endYear.concat(endMonth).concat(endDay)
            console.log(begin_date, typeof begin_date)
            console.log(end_date, typeof end_date)
            console.log(infomation[1], typeof infomation[1])
            if ((beginYear > endYear) || (beginYear === endYear && beginMonth > endMonth) || (beginYear === endYear && beginMonth === endMonth && beginDay > endDay)) {
                handleOpenTip('error', '请检查填写的日期逻辑')
            } else {
                axios.get("/api1/selectInformation/table?division='" + infomation[1] + "'&begin_date=" + begin_date + "&end_date=" + end_date + "&status=" + 1, {responseType: 'blob'}).then(res => {
                    const blob = new Blob([res.data]);//处理文档流
                    // console.log(res.data)
                    const fileName = infomation[1] + "_退货汇总表_" + begin_date + " 至 " + end_date + ".xlsx";
                    const elink = document.createElement('a');
                    elink.download = fileName;
                    elink.style.display = 'none';
                    elink.href = URL.createObjectURL(blob);
                    document.body.appendChild(elink);
                    elink.click();
                    URL.revokeObjectURL(elink.href); // 释放URL 对象
                    document.body.removeChild(elink);
                })
            }
        }


    }

    const handleOpen = () => {
        // console.log(infomation)
        setOpen(true)
    }
    const handleClose = () => {
        setOpen(false)
    }
    const handleMessageClose = () => {
        axios.get("/api1/selectInformation/part?division=" + infomation[1]).then(response => {
            // console.log(typeof response.data,response.data)
            // console.log(typeof response.data[0],response.data[0])
            setCarinfo(response.data)
            // console.log(carinfo)
        }).catch(error => {
            console.log(typeof error, error)
        })
        console.log(carinfo)
        setMessageOpen(false)
    }
    const handleChangeCarname = (event) => {
        console.log(event.target.innerText)
        setCarChoice(event.target.innerText)
        // console.log(carChoice)
    }
    const showList = () => {
        //显示之前的添加列表
        handleOpenTip('info', '当前列表已显示')
        setShowList(true)
    }
    const openHandAdd = () => {
        setHandAdd(true)
    }
    const closeHandAdd = () => {
        setHandAdd(false)
    }
    const handleOpenTip = (text, message) => {
        console.log('收到参数', text, '消息', message, '类型', typeof text)
        setOpenTip({text: text, message: message, state: true})
    }
    const handleCloseTip = () => {
        setOpenTip({...openTip, state: false})
    }

    const openMaterialModal = () => {
        setOpenMaterial(true)
    }

    const handleConfirmMaterial = () => {
        console.log('handleConfirmMaterial')
        setMaterial({cargo: cargoCount, chassis: chassisCount})
        axios.get(`/api1/addInformation/materialUpdate?chassis=${chassisCount}&&cargo=${cargoCount}&&car_info=${carname}`).then(response => {
            // console.log(typeof response.data,response.data)
            // console.log(typeof response.data[0],response.data[0])
            console.log(response.data)
            // console.log(carinfo)
            handleOpenTip('success', '退货材料更新成功')
        }).catch(error => {
            console.log(typeof error, error)
            handleOpenTip('error', '退货材料更新失败')
        })
        console.log('carname', carname)
        setOpenMaterial(false)
    }

    const handleChassisCount = (event) => {
        setChassisCount(event.target.value)
    }

    const handleCargoCount = (event) => {
        setCargoCount(event.target.value)
    }

    const handleCloseMaterial = () => {
        setOpenMaterial(false)
    }

    const getTableData = () => {
        // 获取退货材料,需要事先进行基础配置
        try {
            handleOpenTip('success', '打印成功')
        }catch (e){
            handleOpenTip('error', e.messages)
        }

    }

    function handleSwitchChange(event) {
        setModelbool(event.target.checked);
        setControlList(event.target.checked)
        // const a=event.target.checked
        // addSwitchvalue(a)
        // console.log('in select finished')
    }

    return (
        <Container maxWidth="sl">
            <Modal open={messageOpen} onClose={handleMessageClose}>
                <Box sx={messageStyle}>
                    <Typography id="modal-modal-title" variant="h6" component="h2" sx={{textAlign: 'center'}}>
                        退单系统提示
                    </Typography>
                    <Typography id="modal-modal-description" sx={{mt: 6, fontSize: 14}}>
                        系统更新内容如下：
                    </Typography>
                    <Typography id="modal-modal-description" sx={{mt: 2, fontSize: 14}}>
                        1.打印功能重构,一页三张,一张18项
                    </Typography>
                    <Typography id="modal-modal-description" sx={{mt: 2, fontSize: 14}}>
                        2.系统bug修复
                    </Typography>
                    <Typography id="modal-modal-description" sx={{mt: 2, fontSize: 14, textAlign: 'right'}}>
                        2023年4月26日
                    </Typography>
                    <div>
                        <Typography id="modal-modal-title" variant="h6" component="h2" sx={{textAlign: 'center'}}>
                            退单系统提示
                        </Typography>
                        <Typography id="modal-modal-description" sx={{mt: 6, fontSize: 14}}>
                            系统新增内容如下：
                        </Typography>
                        <Typography id="modal-modal-description" sx={{mt: 2, fontSize: 14}}>
                            1.打印功能
                        </Typography>
                        <Typography id="modal-modal-description" sx={{mt: 2, fontSize: 14}}>
                            2.系统逻辑优化
                        </Typography>
                        <Typography id="modal-modal-description" sx={{mt: 2, fontSize: 14}}>
                            对于打印功能的使用说明如下：
                        </Typography>
                        <Typography id="modal-modal-description" sx={{mt: 2, fontSize: 14}}>
                            首先需要进行基础配置，其次对对应车号进行查询，最后进行打印操作
                        </Typography>
                        <Typography id="modal-modal-description" sx={{mt: 2, fontSize: 14}}>
                            打印结构会根据数据的数量进行适时调整
                        </Typography>
                        <Typography id="modal-modal-description" sx={{mt: 2, fontSize: 14, textAlign: 'right'}}>
                            2023年1月13日
                        </Typography>
                        <Typography id="modal-modal-description" sx={{mt: 6, fontSize: 14}}>
                            系统新增内容如下：
                        </Typography>
                        <Typography id="modal-modal-description" sx={{mt: 2, fontSize: 14}}>
                            1.提示消息
                        </Typography>
                        <Typography id="modal-modal-description" sx={{mt: 2, fontSize: 14}}>
                            2.货栏与底盘数据消息
                        </Typography>
                        <Typography id="modal-modal-description" sx={{mt: 2, fontSize: 14}}>
                            3.按钮逻辑更新
                        </Typography>
                        <Typography id="modal-modal-description" sx={{mt: 2, fontSize: 14}}>
                            4.新增退货材料按钮
                        </Typography>
                        <Typography id="modal-modal-description" sx={{mt: 2, fontSize: 14}}>
                            5.框架结构整理
                        </Typography>
                        <Typography id="modal-modal-description" sx={{mt: 2, fontSize: 14, textAlign: 'right'}}>
                            2023年1月9日
                        </Typography>
                        <Typography id="modal-modal-description" sx={{mt: 6, fontSize: 14}}>
                            系统已进入正式使用，更新内容如下：
                        </Typography>
                        <Typography id="modal-modal-description" sx={{mt: 2, fontSize: 14}}>
                            1.数据导出功能
                        </Typography>
                        <Typography id="modal-modal-description" sx={{mt: 2, fontSize: 14}}>
                            2.车辆查询
                        </Typography>
                        <Typography id="modal-modal-description" sx={{mt: 2, fontSize: 14}}>
                            2.数据修改与删除
                        </Typography>
                        <Typography id="modal-modal-description" sx={{mt: 2, fontSize: 14, textAlign: 'right'}}>
                            2022年12月26日
                        </Typography>
                        <Typography id="modal-modal-description" sx={{mt: 6, fontSize: 14}}>
                            当前系统进行了一次小更新，更新内容如下：
                        </Typography>
                        <Typography id="modal-modal-description" sx={{mt: 6, fontSize: 14}}>
                            1.导出功能完善，匹配模式下选择车辆，则导出对应车辆的退货单信息；不选择车辆，则导出所有车辆信息
                        </Typography>
                        <Typography id="modal-modal-description" sx={{mt: 6, fontSize: 14}}>
                            2.数据运行优化，改变些许算法，提高系统运行速度
                        </Typography>
                        <Typography id="modal-modal-description" sx={{mt: 2, fontSize: 14, textAlign: 'right'}}>
                            2022年12月2日
                        </Typography>
                        <Typography id="modal-modal-description" sx={{mt: 2}}>
                            1.首先配置好对应车号，再点击确认
                        </Typography>
                        <Typography id="modal-modal-description" sx={{mt: 2}}>
                            2.根据退单数量的情况，选择 扫描枪添加方式 或者 手动添加方式
                        </Typography>
                        <Typography id="modal-modal-description" sx={{mt: 2}}>
                            3.在查询功能激活后，可以查到 当前车辆的退货信息，导出 车辆退货的当日汇总信息
                        </Typography>
                        <Typography id="modal-modal-description" sx={{mt: 6, fontSize: 14}}>
                            如果在使用过程中不小心加错数据，请及时上报即可。希望系统给大家带来便捷！！
                        </Typography>
                        <Typography id="modal-modal-description" sx={{mt: 2, fontSize: 14, textAlign: 'right'}}>
                            2022年11月15日
                        </Typography>
                    </div>
                </Box>
            </Modal>
            <Typography variant="h3" gutterBottom component="div" align="center">
                退货单核查与匹配
                <Stack
                    direction="column"
                    justifyContent="center"
                    alignItems="flex-start"
                    spacing={1}
                >
                    <Button variant="text" onClick={handleOpen}
                            startIcon={<AssignmentIndIcon/>}>
                        <text style={{fontSize: '20px'}}>退货基础配置</text>
                    </Button>
                    <Stack
                        direction="row"
                        divider={<Divider orientation="vertical" flexItem/>}
                        spacing={2}
                    >
                        <Typography variant="body2" gutterBottom>退货车号:{carname} </Typography>
                        <Typography variant="body2" gutterBottom>操作编号:{modalvalue['storeman_number']} </Typography>
                        <Typography variant="body2" gutterBottom>退回底盘:{material.chassis} 个 </Typography>
                        <Typography variant="body2" gutterBottom>退回货栏:{material.cargo} 个 </Typography>
                        <Typography variant="body2" gutterBottom>退货类型:{modalvalue['return_type']} </Typography>
                    </Stack>
                    <Stack
                        direction="row"
                        divider={<Divider orientation="vertical" flexItem/>}
                        spacing={2}
                    >
                        <Typography variant="body2" gutterBottom>销售组织:{infomation[1]} </Typography>
                        <Typography variant="body2" gutterBottom>时间节点:{timeLag} </Typography>
                    </Stack>


                    <Modal
                        open={open}
                        onClose={handleClose}
                    >
                        <Box component="form" noValidate onSubmit={handleOpenModal} sx={style}>
                            <Grid
                                container
                                spacing={3}
                                direction="row"
                                justifyContent="center"
                                alignItems="center"
                            >
                                <Grid item xs>
                                    <item>
                                        <Autocomplete
                                            disablePortal
                                            id="truck_number"
                                            options={carinfo}
                                            sx={{width: 200}}
                                            renderInput={(params) =>
                                                <TextField {...params} label="货车号码" name="truck_number"
                                                           id="truck_number"/>
                                            }
                                        />
                                    </item>
                                </Grid>
                                <Grid item xs style={{display: 'none'}}>
                                    <item>
                                        <TextField id="storeman_number" name="storeman_number" label="库管编码"
                                                   variant="outlined" value={infomation[2]}
                                                   InputProps={{
                                                       readOnly: true,
                                                   }}
                                                   autoComplete="order_number"/>
                                    </item>
                                </Grid>
                                <Grid item xs>
                                    <item>
                                        <Box sx={{minWidth: 120}}>
                                            <FormControl fullWidth>
                                                <InputLabel id="demo-simple-select-label">退货类型</InputLabel>
                                                <Select
                                                    labelId="return_type"
                                                    id="return_type"
                                                    name="return_type"
                                                    label="退货类型"
                                                    value={returntype}
                                                    onChange={changeReturntype}
                                                >
                                                    <MenuItem value={'临期退货'}>临期退货</MenuItem>
                                                    <MenuItem value={'正常漏液'}>正常漏液</MenuItem>
                                                    <MenuItem value={'非正常漏液'}>非正常漏液</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Box>
                                    </item>
                                </Grid>
                                <Grid item xs>
                                    <item>
                                        <Button variant="outlined" size="large" type="submit">确认</Button>
                                    </item>
                                </Grid>
                            </Grid>
                        </Box>
                    </Modal>
                </Stack>
                {/*退货单核查与匹配*/}
                <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-end">
                    <Typography>更新模式</Typography>
                    <Switch onChange={handleSwitchChange}/>
                    <Typography>匹配模式</Typography>
                </Stack>
            </Typography>
            {
                modelbool ?
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{mt: 3}} style={{display: materialModal ? 'none' : ''}}>
                        <Grid container spacing={2} sx={{height: 80}}>
                            <Grid item xs={2}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DesktopDatePicker
                                        label="表单日期"
                                        inputFormat="yyyyMMdd"
                                        value={value}
                                        onChange={handleChange}
                                        renderInput={(params) => <TextField id="order_date" name="order_date"
                                                                            autoComplete="order_date" {...params} />}
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={2}>
                                <Autocomplete
                                    disablePortal
                                    id="truck_number"
                                    options={carinfo}
                                    sx={{width: 'auto'}}
                                    onChange={handleChangeCarname}
                                    renderInput={(params) =>
                                        <TextField {...params} label="货车号码" name="truck_number" id="truck_number"/>
                                    }
                                />
                            </Grid>
                            {/*<Grid item xs={2}>*/}
                            {/*    <TextField id="order_number" name="order_number" label="订单编码" variant="outlined"*/}
                            {/*               autoComplete="order_number"/>*/}
                            {/*</Grid>*/}
                            <Grid item xs={1}>
                                <Button variant="outlined" size="large" type="submit">查询</Button>
                            </Grid>
                            <Grid item xs={1}>
                                <Button variant="outlined" size="large" onClick={createExcel}>导出
                                    {/*<a target="_blank" href="http://localhost:9000/selectInformation/excel?return_time="+dateValue+"">导出</a>*/}
                                </Button>
                            </Grid>
                            <Grid item xs={1} style={{display: printModal ? '' : 'none'}}>
                                {/*onClick={getTableData}*/}
                                <ReactToPrint
                                    trigger={() =>
                                        <a href="#" style={{fontSize: '13px'}}><Button onClick={getTableData}
                                                                                       variant="outlined"
                                                                                       size="large">打印</Button></a>
                                    }
                                    content={() => componentRef.current}
                                    copyStyles={false}
                                />
                                <div style={{display: "none"}}>
                                    <div style={{
                                        width: "783px",
                                        height: "auto",
                                        border: '1px solid black',
                                    }} ref={componentRef}>
                                        <h2 style={{fontSize:"18px",textAlign:"center"}}>收箱间退货单</h2>
                                        <div style={{
                                            width:"750px",
                                            height:"23px",
                                            fontSize:"14px",
                                            margin:"0 auto"
                                        }}>
                                            <span style={{
                                                float:"left",
                                            }}>
                                                运送车号:{tableData[0][0].car_info}
                                            </span>
                                            <span style={{
                                                float: "right",
                                            }}>
                                                退货日期:{tableData[0][0].return_time}
                                            </span>
                                        </div>

                                        <div style={{
                                            width:"770px",
                                            height:"150px",
                                            margin:"0 auto",
                                            marginTop:"13px",
                                            fontSize:"14px",
                                        }}>
                                            <table style={{
                                                width:"240px",
                                                height:"135px",
                                                fontSize: '14px',
                                                marginLeft:"10px",
                                                float:"left",
                                            }}>
                                                <thead>
                                                <tr>
                                                    <th>商品名</th>
                                                    <th>类型</th>
                                                    <th>数量</th>
                                                </tr>
                                                </thead>
                                                {
                                                    tableData[0].map((row, index) => {
                                                    return (
                                                    <tbody key={index} style={{marginTop:"1px"}}>
                                                    <tr>
                                                    <td style={{height:"18px",fontSize:"12px",textAlign:"center"}}>{row.gname}</td>
                                                    <td style={{height:"18px",fontSize:"12px",textAlign:"center"}}>{row.return_type}</td>
                                                    <td style={{height:"18px",fontSize:"12px",textAlign:"center"}}>{row.return_quantity}</td>
                                                    </tr>
                                                    </tbody>
                                                    )
                                                    })
                                                }
                                            </table>
                                            <table style={{
                                                width:"240px",
                                                height:"135px",
                                                fontSize: '14px',
                                                marginLeft:"10px",
                                                float:"left",
                                            }}>
                                                <thead>
                                                <tr>
                                                    <th>商品名</th>
                                                    <th>类型</th>
                                                    <th>数量</th>
                                                </tr>
                                                </thead>
                                                {
                                                    tableData[1].map((row, index) => {
                                                        return (
                                                            <tbody key={index} style={{marginTop:"1px"}}>
                                                            <tr>
                                                                <td style={{height:"18px",fontSize:"12px",textAlign:"center"}}>{row.gname}</td>
                                                                <td style={{height:"18px",fontSize:"12px",textAlign:"center"}}>{row.return_type}</td>
                                                                <td style={{height:"18px",fontSize:"12px",textAlign:"center"}}>{row.return_quantity}</td>
                                                            </tr>
                                                            </tbody>
                                                        )
                                                    })
                                                }
                                            </table>
                                            <table style={{
                                                width:"240px",
                                                height:"135px",
                                                fontSize: '14px',
                                                marginLeft:"10px",
                                                float:"left",
                                            }}>
                                                <thead>
                                                <tr>
                                                    <th>商品名</th>
                                                    <th>类型</th>
                                                    <th>数量</th>
                                                </tr>
                                                </thead>
                                                {
                                                    tableData[2].map((row, index) => {
                                                        return (
                                                            <tbody key={index} style={{marginTop:"1px"}}>
                                                            <tr>
                                                                <td style={{height:"18px",fontSize:"12px",textAlign:"center"}}>{row.gname}</td>
                                                                <td style={{height:"18px",fontSize:"12px",textAlign:"center"}}>{row.return_type}</td>
                                                                <td style={{height:"18px",fontSize:"12px",textAlign:"center"}}>{row.return_quantity}</td>
                                                            </tr>
                                                            </tbody>
                                                        )
                                                    })
                                                }
                                            </table>
                                        </div>

                                        <div style={{
                                            width:"770px",
                                            height:"150px",
                                            margin:"0 auto",
                                            marginTop:"250px",
                                            fontSize:"14px",
                                            display: jugement1?"block":"none"
                                        }}>
                                            <table style={{
                                                width:"240px",
                                                height:"135px",
                                                fontSize: '14px',
                                                marginLeft:"10px",
                                                float:"left",
                                            }}>
                                                <thead>
                                                <tr>
                                                    <th>商品名</th>
                                                    <th>类型</th>
                                                    <th>数量</th>
                                                </tr>
                                                </thead>
                                                {
                                                    tableData[3].map((row, index) => {
                                                        return (
                                                            <tbody key={index} style={{marginTop:"1px"}}>
                                                            <tr>
                                                                <td style={{height:"18px",fontSize:"12px",textAlign:"center"}}>{row.gname}</td>
                                                                <td style={{height:"18px",fontSize:"12px",textAlign:"center"}}>{row.return_type}</td>
                                                                <td style={{height:"18px",fontSize:"12px",textAlign:"center"}}>{row.return_quantity}</td>
                                                            </tr>
                                                            </tbody>
                                                        )
                                                    })
                                                }
                                            </table>
                                            <table style={{
                                                width:"240px",
                                                height:"135px",
                                                fontSize: '14px',
                                                marginLeft:"10px",
                                                float:"left",
                                            }}>
                                                <thead>
                                                <tr>
                                                    <th>商品名</th>
                                                    <th>类型</th>
                                                    <th>数量</th>
                                                </tr>
                                                </thead>
                                                {
                                                    tableData[4].map((row, index) => {
                                                        return (
                                                            <tbody key={index} style={{marginTop:"1px"}}>
                                                            <tr>
                                                                <td style={{height:"18px",fontSize:"12px",textAlign:"center"}}>{row.gname}</td>
                                                                <td style={{height:"18px",fontSize:"12px",textAlign:"center"}}>{row.return_type}</td>
                                                                <td style={{height:"18px",fontSize:"12px",textAlign:"center"}}>{row.return_quantity}</td>
                                                            </tr>
                                                            </tbody>
                                                        )
                                                    })
                                                }
                                            </table>
                                            <table style={{
                                                width:"240px",
                                                height:"135px",
                                                fontSize: '14px',
                                                marginLeft:"10px",
                                                float:"left",
                                            }}>
                                                <thead>
                                                <tr>
                                                    <th>商品名</th>
                                                    <th>类型</th>
                                                    <th>数量</th>
                                                </tr>
                                                </thead>
                                                {
                                                    tableData[5].map((row, index) => {
                                                        return (
                                                            <tbody key={index} style={{marginTop:"1px"}}>
                                                            <tr>
                                                                <td style={{height:"18px",fontSize:"12px",textAlign:"center"}}>{row.gname}</td>
                                                                <td style={{height:"18px",fontSize:"12px",textAlign:"center"}}>{row.return_type}</td>
                                                                <td style={{height:"18px",fontSize:"12px",textAlign:"center"}}>{row.return_quantity}</td>
                                                            </tr>
                                                            </tbody>
                                                        )
                                                    })
                                                }
                                            </table>
                                        </div>

                                        <div style={{
                                            width:"770px",
                                            height:"150px",
                                            margin:"0 auto",
                                            marginTop:"250px",
                                            fontSize:"14px",
                                            display: jugement2?"block":"none"
                                        }}>
                                            <table style={{
                                                width:"240px",
                                                height:"135px",
                                                fontSize: '14px',
                                                marginLeft:"10px",
                                                float:"left",
                                            }}>
                                                <thead>
                                                <tr>
                                                    <th>商品名</th>
                                                    <th>类型</th>
                                                    <th>数量</th>
                                                </tr>
                                                </thead>
                                                {
                                                    tableData[6].map((row, index) => {
                                                        return (
                                                            <tbody key={index} style={{marginTop:"1px"}}>
                                                            <tr>
                                                                <td style={{height:"18px",fontSize:"12px",textAlign:"center"}}>{row.gname}</td>
                                                                <td style={{height:"18px",fontSize:"12px",textAlign:"center"}}>{row.return_type}</td>
                                                                <td style={{height:"18px",fontSize:"12px",textAlign:"center"}}>{row.return_quantity}</td>
                                                            </tr>
                                                            </tbody>
                                                        )
                                                    })
                                                }
                                            </table>
                                            <table style={{
                                                width:"240px",
                                                height:"135px",
                                                fontSize: '14px',
                                                marginLeft:"10px",
                                                float:"left",
                                            }}>
                                                <thead>
                                                <tr>
                                                    <th>商品名</th>
                                                    <th>类型</th>
                                                    <th>数量</th>
                                                </tr>
                                                </thead>
                                                {
                                                    tableData[7].map((row, index) => {
                                                        return (
                                                            <tbody key={index} style={{marginTop:"1px"}}>
                                                            <tr>
                                                                <td style={{height:"18px",fontSize:"12px",textAlign:"center"}}>{row.gname}</td>
                                                                <td style={{height:"18px",fontSize:"12px",textAlign:"center"}}>{row.return_type}</td>
                                                                <td style={{height:"18px",fontSize:"12px",textAlign:"center"}}>{row.return_quantity}</td>
                                                            </tr>
                                                            </tbody>
                                                        )
                                                    })
                                                }
                                            </table>
                                            <table style={{
                                                width:"240px",
                                                height:"135px",
                                                fontSize: '14px',
                                                marginLeft:"10px",
                                                float:"left",
                                            }}>
                                                <thead>
                                                <tr>
                                                    <th>商品名</th>
                                                    <th>类型</th>
                                                    <th>数量</th>
                                                </tr>
                                                </thead>
                                                {
                                                    tableData[8].map((row, index) => {
                                                        return (
                                                            <tbody key={index} style={{marginTop:"1px"}}>
                                                            <tr>
                                                                <td style={{height:"18px",fontSize:"12px",textAlign:"center"}}>{row.gname}</td>
                                                                <td style={{height:"18px",fontSize:"12px",textAlign:"center"}}>{row.return_type}</td>
                                                                <td style={{height:"18px",fontSize:"12px",textAlign:"center"}}>{row.return_quantity}</td>
                                                            </tr>
                                                            </tbody>
                                                        )
                                                    })
                                                }
                                            </table>
                                        </div>



                                        <div style={{width:"750px",height:"23px",margin:"0 auto",marginTop:"10px",fontSize:"14px"}}>
                                            <span style={{float:"left"}}>
                                                库管编码:{modalvalue['storeman_number']}
                                            </span>
                                            <span style={{float:"left",marginLeft:"28px"}}>
                                                库管名称:{storeman}
                                            </span>
                                            <span style={{float:"right"}}>配送人签名____________</span>
                                        </div>
                                    </div>
                                </div>
                            </Grid>
                        </Grid>
                        <Accordion expanded={expanded === 'panel4'} onChange={handleExpandChange('panel4')}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon/>}
                                aria-controls="panel4bh-content"
                                id="panel4bh-header"
                            >
                                <Typography sx={{width: '33%', flexShrink: 0}}>范围查询</Typography>
                                <Typography sx={{color: 'text.secondary'}}>
                                    点击扩展面板
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid container spacing={3}>
                                    <Grid item xs={2}>
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <DesktopDatePicker
                                                label="起始日期"
                                                inputFormat="yyyyMMdd"
                                                value={beginDate}
                                                onChange={handleBeginChange}
                                                renderInput={(params) => <TextField id="begin_date" name="begin_date"
                                                                                    autoComplete="begin_date" {...params} />}
                                            />
                                        </LocalizationProvider>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <DesktopDatePicker
                                                label="结束日期"
                                                inputFormat="yyyyMMdd"
                                                value={endDate}
                                                onChange={handleEndChange}
                                                renderInput={(params) => <TextField id="end_date" name="end_date"
                                                                                    autoComplete="end_date" {...params} />}
                                            />
                                        </LocalizationProvider>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <Button variant="outlined" size="large"
                                                onClick={createTimeRangeExcel}>导出</Button>
                                    </Grid>
                                </Grid>
                            </AccordionDetails>
                        </Accordion>
                        <Divider Light sx={{height: 8}}/>
                    </Box> :
                    <Box component="form" noValidate onSubmit={handleInformation} sx={{mt: 3}} id='formAdd'>
                        <Grid container spacing={2} style={{display: materialModal ? 'none' : ''}}>
                            <Grid item xs={2}>
                                <TextField id="good_number" name="good_number" label="商品编码" variant="standard"
                                           value={goodNumber}
                                           onChange={(e) => {
                                               setGoodNumber(e.target.value);
                                               if (e.target.value.length >= 13) {
                                                   document.getElementById('goodNumberAdd').click();
                                               }
                                               // console.log('data has changed')
                                           }}
                                />
                            </Grid>
                            <Grid item xs={2} style={{display: handAdd ? 'none' : ''}}>
                                <Button variant="outlined" size="large" onClick={openHandAdd}>打开手动添加</Button>
                            </Grid>
                            <Grid item xs={6} style={{display: handAdd ? 'none' : ''}}>
                                <Button variant="outlined" size="large"
                                        onClick={openMaterialModal}>更新退回材料</Button>
                            </Grid>
                            <Grid item xs={2} style={{display: handAdd ? '' : 'none'}}>
                                <TextField id="return_quantity" name="return_quantity" label="退货数量"
                                           variant="standard" value={goodQuentity}
                                           onChange={(e) => {
                                               setGoodQuentity(e.target.value);
                                               // console.log('return_quantity has changed')
                                           }
                                           }
                                />
                            </Grid>
                            <Grid item xs={2} style={{display: handAdd ? '' : 'none'}}>
                                <Button variant="outlined" size="large" type="submit" id='goodNumberAdd'>添加</Button>
                            </Grid>
                            <Grid item xs={4} style={{display: handAdd ? '' : 'none'}}>
                                <Button variant="outlined" size="large" onClick={closeHandAdd}>关闭手动添加</Button>
                            </Grid>
                            <Grid item xs={2}>
                                <Button variant="text" size="large" id='showList'
                                        onClick={showList}>显示当前列表</Button>
                            </Grid>
                        </Grid>
                    </Box>
            }
            <Snackbar
                open={openTip.state}
                autoHideDuration={2000}
                onClose={handleCloseTip}
                anchorOrigin={{vertical: 'top', horizontal: 'center'}}
            >
                <Alert severity={openTip.text} sx={{width: '100%'}}>
                    {openTip.message}
                </Alert>
            </Snackbar>
            <Dialog open={openMaterial} onClose={handleCloseMaterial}>
                <DialogTitle align="center">退回材料</DialogTitle>
                <DialogContent>
                    <Stack>
                        <DialogContentText>
                            本处收集货车退回时收到的底盘和货栏
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="底盘数量"
                            type="number"
                            sx={{top: 10}}
                            variant="standard"
                            onChange={handleChassisCount}
                            value={chassisCount}
                        />
                    </Stack>
                    <Stack style={{marginTop: 'inherit'}}>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="货栏数量"
                            type="number"
                            sx={{top: 15}}
                            variant="standard"
                            onChange={handleCargoCount}
                            value={cargoCount}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseMaterial}>取消</Button>
                    <Button onClick={handleConfirmMaterial}>确认</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default Index;

import React, {useEffect} from 'react';
import style from '../../assets/style.less'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {
    Button,
    Container,
    Stack,
    ButtonGroup,
} from "@mui/material";
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios';
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

function Index(props) {
    const [tablevalue, setTablevalue] = React.useState([]);
    const [sumCount,setSumCount] = React.useState(0);
    const {result, componentRef, goodresult, isAdd, isSearch, controlList,timeLag,showList,setShowList} = props;
    const [openChange, setOpenChange] = React.useState(false);
    const [openDelete, setOpenDelete] = React.useState(false);
    const [lineData,setLineData] = React.useState()
    const [lineCount,setLineCount] = React.useState(1)
    const [tempList,setTempList] = React.useState()
    const [openTip,setOpenTip] = React.useState({
        text:'success',
        message:'',
        state:false
    })
    // 执行查询
    useEffect(() => {
        if (isSearch) {
            const {value} = result
            // console.log('in order select', value)
            axios.get("/selectInformation?return_time=" + value['date'] + "&car_id=" + value['truck'] + "").then(response => {
                // console.log(response)
                // tablevalue.length=0
                // response.data.map(row => {
                //     tablevalue.push(row)
                // })
                setTablevalue(response.data);
                props.setOperateNode();
            }).catch(error => {
                console.log('error: ', error)
            })
        }
        // console.log('表单查询成功')
    }, [result]);
    // 新增
    useEffect(() => {
        if (isAdd) {
            const {value} = goodresult
            // console.log('in order goodexplore', value, typeof value, value['good_number'])
            axios.get("/addInformation?truck_number=" + value['truck_number'] + "&storeman_number=" + value['storeman_number'] + "&timeLag="+timeLag).then(response => {
                // console.log(response)
                // debugger
                // tablevalue.length=0
                // response.data.map(row => {
                //     tablevalue.push(row)
                // })
                if (response.status === 200 || response.status === 304) {
                    // window.confirm('添加成功！');
                    props.setGoodNumber('');
                } else {
                    // window.confirm('添加失败！');
                    handleOpenTip('error','添加失败')
                }
                setTablevalue(response.data);
                setTempList(response.data)
                props.setOperateNode();
            }).catch(error => {
                console.log('error: ', error)
            })

            // console.log('表单获取成功')
        }
        // if (switchvalue.value){
        //     const {value} = switchvalue
        //     console.log('in order',value)
        // }
        // console.log('后端请求获取的数据:\n',1234)
    }, [goodresult])
    useEffect(()=>{
        var tempData=0
        tablevalue.map(row=>{
            tempData=row.return_quantity+tempData
        })
        setSumCount(tempData)
    })
    useEffect(()=>{
        // console.log(controlList)
        setTablevalue([])
    },[controlList])
    useEffect(()=>{
        if (showList === true && tempList){
            setTablevalue(tempList)
            setShowList(false)
        }
    })
    const handleClickOpenChange = (row) => {
        setLineData(row)
        // console.log(tablevalue)
        setOpenChange(true);
    };

    const handleConfirmChange = () => {
        // console.log(lineData)
        // console.log(lineCount)
        tablevalue.map(row=>{
            if (row['id']===lineData['id']){
                row['return_quantity']=Number(lineCount)
            }
        })
        //暂存当前表单信息
        setTempList(tablevalue)
        //请求后端api，修改数据
        axios.post("/addInformation/update?return_quantity="+lineCount+"&update_operater="+goodresult['value']['storeman_number']+"&id="+lineData['id']).then(res=>{
            console.log(res.data)
            handleOpenTip('success','修改成功')
        }).catch(err=>{
            console.log(err)
            handleOpenTip('error','修改失败')
        })
        setOpenChange(false);
    };

    const handleCloseChange = () => {
        setOpenChange(false);
    };

    const handleCount = (event) => {
        setLineCount(event.target.value)
    };

    const handleClickOpenDelete = (row) => {
        setLineData(row)
        console.log(tablevalue)
        setOpenDelete(true);
    };

    const handleConfirmDelete = () => {
        // console.log(lineData)
        setTablevalue(tablevalue.filter(row=>(row['id']!==lineData['id'])))
        //暂存当前表单信息
        setTempList(tablevalue.filter(row=>(row['id']!==lineData['id'])))
        //请求后端api，先存储，后删除
        axios.post("/addInformation/stub?id="+lineData['id']+"&car_info="+lineData['car_info']+"&storeman_id="+goodresult['value']['storeman_number']+"&code="+lineData['code']+"&gname="+lineData['gname']+"&return_type="+lineData['return_type']+"&return_quantity="+lineData['return_quantity']+"&return_time="+lineData['return_time']).then(res=>{
            console.log(res.data)
            axios.post("/addInformation/delete?id="+lineData['id']).then(res=>{
                console.log(res.data)
                handleOpenTip('success','删除成功')
            }).catch(err=>{
                console.log(err)
                handleOpenTip('error','删除失败')
            })
        }).catch(err=>{
            console.log(err)
            handleOpenTip('error','删除失败')
        })
        setOpenDelete(false);
    };

    const handleCloseDelete = () => {
        setOpenDelete(false);
    };

    const handleOpenTip = (text,message) =>{
        console.log('收到参数',text,'消息',message,'类型',typeof text)
        setOpenTip({text:text ,message:message, state: true})
    }
    const handleCloseTip = () => {
        setOpenTip({...openTip, state: false})
    }

    return (
        <Container maxWidth="xl">
            <TableContainer component={Paper}>
                    <Table sx={{minWidth: 650}} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell style={{display:controlList?'none':''}}>商品标识</TableCell>
                                <TableCell align="right">运送车号&nbsp;</TableCell>
                                <TableCell align="right">商品编码&nbsp;</TableCell>
                                <TableCell align="right">商品名&nbsp;</TableCell>
                                <TableCell align="right">退货类型&nbsp;</TableCell>
                                <TableCell align="right">退货数量&nbsp;</TableCell>
                                <TableCell align="right">退货日期&nbsp;</TableCell>
                                <TableCell align="center"style={{display:controlList?'none':''}}>可选操作&nbsp;</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tablevalue.map((row,index) => (
                                <TableRow
                                    key={index}
                                    sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                >
                                    <TableCell component="th" scope="row" style={{display:controlList?'none':''}}>
                                        {row.id}
                                    </TableCell>
                                    <TableCell align="right">{row.car_info}</TableCell>
                                    <TableCell align="right">{row.code}</TableCell>
                                    <TableCell align="right">{row.gname}</TableCell>
                                    <TableCell align="right">{row.return_type}</TableCell>
                                    <TableCell align="right">{row.return_quantity}</TableCell>
                                    <TableCell align="right">{row.return_time}</TableCell>
                                    <TableCell align="center" >
                                        <ButtonGroup variant="outlined" aria-label="outlined button group" style={{display:controlList?'none':''}}>
                                            <Button disabled={controlList} onClick={()=>handleClickOpenChange(row)}>修改</Button>
                                            <Button disabled={controlList} onClick={()=>handleClickOpenDelete(row)}>删除</Button>
                                            {/*<Button sx={{display:'block'}}>Three</Button>*/}
                                        </ButtonGroup>
                                    </TableCell>
                                </TableRow>
                            ))
                            }
                            <TableRow
                                key={1}
                                sx={{'&:last-child td, &:last-child th': {border: 0}}}
                            >
                                <TableCell component="th" scope="row">
                                    --------
                                </TableCell>
                                <TableCell align="right"></TableCell>
                                <TableCell align="right"></TableCell>
                                <TableCell align="right">商品汇总数目</TableCell>
                                <TableCell align="right"></TableCell>
                                <TableCell align="right">{sumCount}</TableCell>
                                <TableCell align="right"></TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            <Dialog open={openChange} onClose={handleCloseChange}>
                <DialogTitle align="center">修改</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        请在这里输入您要修改的奶品数量：
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="奶品数量"
                        type="number"
                        sx={{top:10}}
                        variant="standard"
                        onChange={handleCount}
                        value={lineCount}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseChange}>取消</Button>
                    <Button onClick={handleConfirmChange}>确认</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openDelete} onClose={handleCloseDelete}>
                <DialogTitle align="center">删除</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        您确定要删除这行数据吗？
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDelete}>取消</Button>
                    <Button onClick={handleConfirmDelete}>确认</Button>
                </DialogActions>
            </Dialog>
            <Stack
                direction="row"
                justifyContent="flex-end"
                alignItems="flex-start"
                spacing={2}
            >
                <Button variant="outlined" style={{display: 'none'}} sx={{bottom: '5 px'}}>系统匹配</Button>
            </Stack>
            <Snackbar
                open={openTip.state}
                autoHideDuration={2000}
                onClose={handleCloseTip}
                anchorOrigin={{ vertical:'top', horizontal:'center' }}
            >
                <Alert severity={openTip.text} sx={{ width: '100%' }}>
                    {openTip.message}
                </Alert>
            </Snackbar>
        </Container>
    );
}

export default Index;
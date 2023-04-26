import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Box from '@mui/material/Box';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from "axios";

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © 南方乳业股份有限公司.'}
        </Typography>
    );
}

const theme = createTheme();

export default function Index(props) {
    const {setSwitchDetail,setInformation}=props
    const [trueModal,setTrueModal]=React.useState(false)
    const [falseModal,setFalseModal]=React.useState(false)
    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        // console.log({
        //     username: data.get('username'),
        //     password: data.get('password'),
        // });
        axios.get("/api1/selectInformation/user?username='"+data.get('username')+"'&password="+data.get('password')).then(response=>
        {
            console.log(typeof response.data,response.data[0])
            setInformation([response.data[0]['bus_division'],response.data[0]['division_name'],response.data[0]['id']])
            setTrueModal(true)
            setFalseModal(false)
            setTimeout(()=>{
                setSwitchDetail(false)
            },500)
        }).catch(error=>{
            console.log(typeof error,error)
            setTimeout(()=>{
                setTrueModal(false)
                setFalseModal(true)
            },500)
        })


    };
    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >

                    <Alert severity="success" style={{display:trueModal?"block":"none"}}>
                        <AlertTitle>Success</AlertTitle>
                        Your login is successful — <strong>Welcome to this System!</strong>
                    </Alert>
                    <Alert severity="error" style={{display:falseModal?"block":"none"}}>
                        <AlertTitle>Error</AlertTitle>
                        Please check out your username or password. — <strong>check it out!</strong>
                    </Alert>
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <AssignmentIndIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        退单管理系统
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="用户名"
                            name="username"
                            autoComplete="username"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="密码"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            登录
                        </Button>
                    </Box>
                </Box>
                <Copyright sx={{ mt: 8, mb: 4 }} />
            </Container>
        </ThemeProvider>
    );
}
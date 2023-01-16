import React from 'react';
// import {Route,Link} from 'react-router-dom'
import Select from './components/select'
import Order from './components/order'
import Login from './components/login'

const operateData = {
    add: Symbol(),
    search: Symbol(),
    none: Symbol()
}
function App() {
    const [result, setResult] = React.useState({});
    const [goodresult, setGoodresult] = React.useState({});
    const [goodNumber, setGoodNumber] = React.useState('');
    const [goodQuentity,setGoodQuentity] = React.useState(1);
    const [operate, setOperate] = React.useState(operateData.none);
    const [switchDetail,setSwitchDetail]=React.useState(true);
    const [infomation,setInformation]=React.useState();
    const [controlList,setControlList]=React.useState();
    const [timeLag,setTimeLag] = React.useState();
    const [showList,setShowList] = React.useState(false)
    const componentRef = React.useRef()
    // hooks
    const addResult = (value) => {
        setResult({value});
        // console.log('in app result',result)
    };
    const addGoodresult = (value) => {
        setGoodresult({value});
        // console.log('in app goods',goodresult)
    };
    return (
        <div>
            {
                switchDetail?
                    <Login
                        setSwitchDetail={setSwitchDetail}
                        setInformation={setInformation}
                    />:
                    <div>
                        <Select
                            infomation={infomation}
                            addResult={addResult}
                            addGoodresult={addGoodresult}
                            goodNumber={goodNumber}
                            goodQuentity={goodQuentity}
                            timeLag={timeLag}
                            componentRef={componentRef}
                            setGoodNumber={setGoodNumber}
                            setGoodQuentity={setGoodQuentity}
                            setControlList={setControlList}
                            setTimeLag={setTimeLag}
                            setShowList={setShowList}
                            setOperateAdd={()=>setOperate(operateData.add)}
                            setOperateSearch={()=>setOperate(operateData.search)}
                        />
                        <Order
                            result={result}
                            goodresult={goodresult}
                            controlList={controlList}
                            timeLag={timeLag}
                            componentRef={componentRef}
                            setGoodNumber={setGoodNumber}
                            showList={showList}
                            isAdd={operateData.add===operate}
                            isSearch={operateData.search===operate}
                            setOperateNode={()=>setOperate(operateData.none)}
                            setShowList={setShowList}
                        />
                    </div>

            }


        </div>
    );
}

export default App;
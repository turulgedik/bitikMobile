import React, { Component } from 'react'
import { connect } from 'react-redux'
import {Router,Scene, Stack} from 'react-native-router-flux'
import Login from '../src/Login'
import Register from '../src/Register'
import Home from '../src/Home'
import Classes from '../src/Classes'
import _Class from '../src/Classes/Class'
import RollCall from '../src/RollCall'
import RollCallReport from './Reports/RollCallReport'
import ATReports from './ATReports'

import AsyncStorage from '@react-native-async-storage/async-storage';
import {loadUser} from './redux/actions/auth'
import Splash from './Splash'


export class MyRouter extends Component {

    state={
        token:''
    }

    constructor(props){
        super(props)
        setTimeout(() => {
            this.getToken()
        }, 3000);
    }

    getToken=async()=>{
        try {
            const value = await AsyncStorage.getItem('token')
            this.setState({token:value},()=>{
                if(value!==null){
                    this.props.loadUser(value)
                }
            })
        } catch(e) {

        }
    }

    render() {
        return (
            <Router>
                <Stack key='root' hideNavBar={true}>
                {
                    this.props.auth.isLoading || this.state.token===''?
                        <Scene component={Splash} key='splash' hideNavBar={true}/>:
                    this.props.auth.isAuth?
                        <Stack hideNavBar={true}>
                            <Scene key='home' component={Home} title='home' hideNavBar={true}/>
                            <Scene key='classes' component={Classes} title='classes' hideNavBar={true}/>
                            <Scene key='_class' component={_Class} title='class' hideNavBar={true}/>
                            <Scene key='rollCall' component={RollCall} title='rollcall' hideNavBar={true}/>
                            <Scene key='rollCallReport' component={RollCallReport} title='rollCallReport' hideNavBar={true}/>
                            <Scene key='atReports' component={ATReports} title='atReport' hideNavBar={true}/>
                        </Stack>
                    :
                        <Stack hideNavBar={true}>
                            <Scene key='login' component={Login} title='login' hideNavBar={true}/>
                            <Scene key='register' component={Register} title='register' hideNavBar={true}/>
                        </Stack>
                }
                </Stack>
            </Router>
        )
    }
}

const mapStateToProps = (state) => ({
    auth:state.User.auth
})

const mapDispatchToProps = {
    loadUser,
}

export default connect(mapStateToProps, mapDispatchToProps)(MyRouter)

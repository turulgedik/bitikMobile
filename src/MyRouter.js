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
import HomeWork from './HomeWork/'
import Course from './Course'
import CourseRollCall from './Course/RollCall'
import CourseHomeWork from './Course/HomeWork'

import AsyncStorage from '@react-native-async-storage/async-storage';
import {loadUser} from './redux/actions/auth'
import Splash from './Splash'

import StudentHome from '../src/StudentMode/Home'
import sRollCallReport from '../src/StudentMode/Reports/RollCallReport'
import sHomeWork from '../src/StudentMode/HomeWork/index'
import sCourse from '../src/StudentMode/Course/index'
import sCourseRollCall from '../src/StudentMode/Course/RollCall/index'


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
        const {user} = this.props
        console.log(user)
        return (
            <Router>
                <Stack key='root' hideNavBar={true}>
                {
                    this.props.auth.isLoading || this.state.token===''?
                        <Scene component={Splash} key='splash' hideNavBar={true}/>:
                    
                    this.props.auth.isAuth && user!==null && user.user_type===5?
                        <Stack hideNavBar={true}>
                            <Scene key='studentHome' component={StudentHome} title='studentHome' hideNavBar={true}/>
                            <Scene key='sRollCall' component={sRollCallReport} title='sRollCall' hideNavBar={true}/>
                            <Scene key='sHomeWork' component={sHomeWork} title='sHomeWork' hideNavBar={true}/>
                            <Scene key='sCourse' component={sCourse} title='sCourse' hideNavBar={true}/>
                            <Scene key='sCourseRollCall' component={sCourseRollCall} title='sCourseRollCall' hideNavBar={true}/>
                        </Stack>:
                    this.props.auth.isAuth?
                        <Stack hideNavBar={true}>
                            <Scene key='home' component={Home} title='home' hideNavBar={true}/>
                            <Scene key='classes' component={Classes} title='classes' hideNavBar={true}/>
                            <Scene key='_class' component={_Class} title='class' hideNavBar={true}/>
                            <Scene key='rollCall' component={RollCall} title='rollcall' hideNavBar={true}/>
                            <Scene key='rollCallReport' component={RollCallReport} title='rollCallReport' hideNavBar={true}/>
                            <Scene key='atReports' component={ATReports} title='atReport' hideNavBar={true}/>
                            <Scene key='homeWork' component={HomeWork} title='homeWork' hideNavBar={true}/>
                            <Scene key='course' component={Course} title='course' hideNavBar={true}/>
                            <Scene key='courseRollCall' component={CourseRollCall} title='courseRollCall' hideNavBar={true}/>
                            <Scene key='courseHomeWork' component={CourseHomeWork} title='courseHomeWork' hideNavBar={true}/>
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
    auth:state.User.auth,
    user:state.User.user
})

const mapDispatchToProps = {
    loadUser,
}

export default connect(mapStateToProps, mapDispatchToProps)(MyRouter)

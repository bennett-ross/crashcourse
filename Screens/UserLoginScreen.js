import * as React from 'react';
import {StyleSheet, Image, View, ScrollView, Text, TextInput, TouchableOpacity, Button, ImageBackground, Dimensions, Row, Col, SafeAreaView} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars'
import { Card, Icon } from 'react-native-elements'
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage'
// import AsyncStorage from '@react-native-community/async-storage'

import Parse from 'parse/react-native';
import '../App/CourseRoster'
// import { Provider } from 'react-redux'
// import { createStore} from 'redux'
// import * as SecureStore from 'expo-secure-store';
import populateClass from   '../ExtraCode'
import { classExtractor } from '../App/CourseRoster';
import SemesterMapper from '../App/Semester';


export default class LoginScreen extends React.Component {

    constructor(props) {
		super(props)

        this.state = {
            username: this.props.username,
            password: this.props.password,
            email: this.props.email,
            firstName: this.props.firstName,
            lastName: this.props.lastName,
            loggedIn: this.props.loggedIn,
            schedule: this.props.schedule,
            retrievedSchedule: this.props.retrievedSchedule,
        }
        this.doUserLogIn = this.doUserLogIn.bind(this)
        this.getSchedule = this.getSchedule.bind(this)
        this.updateSchedule = this.updateSchedule.bind(this)

	}

  // SecureStore.deleteItemAsync('token')
  async getSchedule(){
    const schedules = new Parse.Query(Parse.Object.extend('Schedule'))

        // Update Class Schedule 
    var savedSched = await schedules.get(`${this.state.schedule}`)
    return savedSched;
    // .then((sched) => {
    //     // The object was retrieved successfully and it is ready to update.
    //     // sched.set('Classes', [courses['CS4740'][0],courses['APMA3080'][2],courses['AAS150'][0]])
    //     // populateClass()
    // },
    //  (error) => {
    //     // The object was not retrieved successfully.
    //     console.log('Failed to update ?')
    // });
    // console.log('Schedule Link',savedSched) 
}

async updateSchedule(){
  console.log("updateSchedule was called!")
  const schedules = new Parse.Query(Parse.Object.extend('Schedule'))
  var courses = await classExtractor();
  const {Semester, SemesterDays} = await SemesterMapper(new Date(2021,7,24),new Date(2021,12,7)); // returns a mapping of each date to the day AND a map of empty arrays for each date
  // console.log("semestermapper 1",SemesterDays)

      // Update Class Schedule 
  var savedSched = await schedules.get(`${this.state.schedule}`)
  // .then((sched) => {
  // //     // The object was retrieved successfully and it is ready to update.
  // // var test = [courses['CS4740'][0],courses['APMA3080'][2],courses['AAS150'][0]]
  // var currentSched = this.state.retrievedSchedule
  // // populateClass()
  // console.log("semestermapper ",semesterDays)
  //     sched.set('Classes', semesterDays)
  //     // sched.set('Classes', [courses['CS4740'][0],courses['APMA3080'][2],courses['AAS150'][0]])
  //     sched.save()
  // //     console.log("parse.object",Parse.Object(sched))
  // //     var k = JSON.parse(JSON.stringify(sched))
  // //     console.log("k after parse string",k)
  // //     // populateClass(courses['CS4740'][0],semesterDays,k)
  // //     // populateClass(courses['APMA3080'][2],semesterDays,k)
  // //     // populateClass(courses['CS2150'][0],semesterDays,k)
  // //     console.log("K after populateClass", k)
  // this.setState({retrievedSchedule: semesterDays})
  // },
  //  (error) => {
  //     // The object was not retrieved successfully.
  //     console.log('Failed to update ?')
  // });
  this.setState({retrievedSchedule: SemesterDays})

  console.log("savedSched",savedSched)
  // console.log('Schedule Link',savedSched) 
}
  
    // console.log("Login??",props)
    async doUserLogIn (){
        // console.log("THIS",this)
        // console.log("State",this.props.navigation.getState())
        // console.log("the props",this.props)
      // Note that these values come from state variables that we've declared before
      const {Semester, SemesterDays} = await SemesterMapper(new Date(2021,7,24),new Date(2021,12,7)); // returns a mapping of each date to the day AND a map of empty arrays for each date

      const usernameValue = this.state.username;
      const passwordValue = this.state.password;
      // console.log("Inside of doUserLogIn")
      const loggedInUser = await Parse.User.logIn(usernameValue, passwordValue)
        .then(async (loggedInUser) => {
          // logIn returns the corresponding ParseUser object
        //   Alert.alert(
        //     'Success!',
        //     `User ${loggedInUser.get('username')} has successfully signed in!`,
        //   );
          // To verify that this is in fact the current user, currentAsync can be used
          var currentUser = await Parse.User.currentAsync();
          if(currentUser === loggedInUser){
            // console.log("just firstname",currentUser.firstname);
            var k = JSON.parse(JSON.stringify(currentUser))
            // console.log("k value",k)
            // console.log("2",currentUser.get);
            // console.log("json parse",JSON.parse(currentUser));
            
              this.setState({loggedIn: true})
              this.setState({firstName:k.firstName})
              this.setState({lastName:k.lastName})
              this.setState({username: currentUser.getUsername()})
              this.setState({password:k.password})
              this.setState({email: currentUser.getEmail()})
              this.setState({schedule: k.schedule})
              this.setState({retrievedSchedule: SemesterDays})
              
              // var sched = this.getSchedule;
              // updateSchedule();
              // console.log("after updateSchedule", this.state.retrievedSchedule);
              // this.setState({retrievedSchedule: sched})
              // this.props.buildClasses();
              this.props.updateUser(this.state);
              // console.log("The props", this.props)
          }
          
        //   console.log("Logged In User & Current User are good.",loggedInUser === currentUser);
          return true;
        })
        .catch((error) => {
          console.log("Error trying to login")
          // Error can be caused by wrong parameters or lack of Internet connection
        //   Alert.alert('Error!', error.message);
          return false;
        });
    }

    render(){
        return (
            <ImageBackground source={require('../assets/images/background.jpg')} resizeMode='cover' style={styles.backgroundImage}> 
             <View style={{ flex: 20, justifyContent: 'center', alignItems: 'center'}}>
             <SafeAreaView >
                 <View style={{margin: "0%", padding: "0%", marginTop: "-10%"}}>
                   <Image
                    resizeMode='contain'
                    style={{alignContent: 'center',width: "70%", height: "70%", margin: "0%", marginLeft: "15%", marginTop: "-10%"}}
                    source={require('../assets/images/crash-course-logo.png')}
                   />
                   <Text style={{margin: "0%"}}>
                     <Text >
                       {'Crash Course -'}
                     </Text>
                     {' UVA Course Scheduling'}
                   </Text>
                 </View>
                 <View  style={{margin: "0%", padding: "0%", marginTop: "-20%"}}>
                <View  style={{margin: "0%", padding: "0%", marginTop: "-5%"}}>
                    <TextInput
                    style={styles.input}
                    value={this.state.username}
                    placeholder={'Username'}
                    onChangeText={(text) => this.setState({username: (text)})}
                    autoCapitalize={'none'}
                    // keyboardType={'email-address'}
                    />
                    <TextInput          
                    style={styles.input}
                    value={this.state.password}
                    placeholder={'Password'}
                    secureTextEntry
                    onChangeText={(text) => this.setState({password: (text)})}
                    />
                    <TouchableOpacity style={{borderWidth: 1, borderRadius: 10, width: "30%"}}>
                    <View  style={{borderColor: "white", }}>
                    <Button
                        onPress={this.doUserLogIn}
                        title="Sign In"
                        color="black"
                        backgroundColor="white"            
                        accessibilityLabel="Learn more about this purple button"
                        />

                        {/* <Text>{`Sign In`}</Text> */}
                    </View>
                    </TouchableOpacity>
                </View>
                </View>
               </SafeAreaView>
             </View>
            </ImageBackground>
            )
    }
}

const styles = StyleSheet.create({
    backgroundImage: {
      flex: 1,
      width: '100%',
    },
    input: {
      height: 40,
      margin: 12,
      borderWidth: 1,
      padding: 10,
    //   color: "white",
      backgroundColor: "white",
    },
  });

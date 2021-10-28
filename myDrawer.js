import * as React from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import './App/CourseRoster'
import LoginScreen from './Screens/UserLoginScreen';
import SignUpScreen from './Screens/UserSignupScreen';
import HomeScreen from './Screens/HomeScreen';
import AddScreen from './Screens/AddScreen';
import RemoveScreen from "./Screens/RemoveScreen";
import ProfileScreen from './Screens/ProfileScreen'
import { connect } from 'react-redux'

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

const Drawer = createDrawerNavigator();

class MyDrawer extends React.Component {

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
      departments: this.props.departments,
      professors: this.props.professors,
      classPool: this.props.classPool,
      retrievedSchedule: this.props.retrievedSchedule,
      courses: this.props.courses,
      show: this.props.show,
      classes: this.props.classes,
      selectedDepartment: this.props.selectedDepartment,
      filterResults: this.props.filterResults,
    }
  }

  render() {
    if (this.props.loggedIn) {
      return (

        <Drawer.Navigator screenOptions={{headerTransparent: true, headerTintColor: "white"}} drawerContent={props => CustomDrawerContent(props)} >
          <Drawer.Screen name={`${this.props.firstName}'s Schedule`} children={() => (<HomeScreen />)} />
          <Drawer.Screen name="Add Class" children={() => (<AddScreen />)} />
          <Drawer.Screen name="Drop Class" children={() => (<RemoveScreen />)} />
          <Drawer.Screen name="Profile" children={() => (<ProfileScreen {...this.state} updateUser={this.handler} />)} />
        </Drawer.Navigator>
      )
    }
    else {
      return (
        <Drawer.Navigator >
          <Drawer.Screen name="Login Page" children={() => (<LoginScreen />)} />
          <Drawer.Screen name="Sign Up" children={() => (<SignUpScreen />)} />
        </Drawer.Navigator>
      )
    }

  }
}

function mapStateToProps(state) {
  return {
    username: state.username,
    password: state.password,
    email: state.email,
    firstName: state.firstName,
    lastName: state.lastName,
    loggedIn: state.loggedIn,
    schedule: state.schedule,
    retrievedSchedule: state.retrievedSchedule,
    show: state.show,
    selectedDepartment: state.selectedDepartment,
    classes: state.classes,
    classPool: state.classPool,
    departments: state.departments,
    professors: state.professors,
    courses: state.courses,
    filterResults: state.filterResults,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    LOGIN: (item) => dispatch({ type: 'LOGIN', payload: item }),
    decreaseCounter: () => dispatch({ type: 'DECREASE_COUNTER' }),
    loadClasses: (item) => dispatch({ type: 'LOAD_CLASSES', payload: item }),
    addClasses: (item) => dispatch({ type: 'ADD_CLASSES', payload: item })
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyDrawer);
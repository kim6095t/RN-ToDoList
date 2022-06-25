import React from 'react';
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Splash from './src/screens/Splash';
import Task from './src/screens/Task'
import Camera from './src/screens/Camera';
import ToDo from './src/screens/ToDo'
import Done from './src/screens/Done'

import { Provider } from 'react-redux';
import {Store} from "./src/_reducers/index"


const Tab=createBottomTabNavigator()
const RootStack = createNativeStackNavigator()

function HomeTabs(){
  return(
      <Tab.Navigator
        screenOptions={
          ({route})=>({
            tabBarStyle: { backgroundColor: '#A5937B' },
            tabBarLabelStyle:{fontSize:20, fontFamily:"NanumPenScript-Regular"},
            tabBarIcon:({focused, size, color})=>{
              let iconName;
              if(route.name === 'To-Do'){
                iconName='clipboard-list'
                size=20

              }else if(route.name === 'Done'){
                iconName='clipboard-check'
                size=20
              }
              return(
                <FontAwesome5
                  name={iconName}
                  size={size}
                  color={color}
                />
              )
            },
            tabBarActiveTintColor: '#ffffff',
            tabBarInactiveTintColor: '#777777',
          })}
      >
        <Tab.Screen name={'To-Do'} component={ToDo} options={{ headerShown: false }}/>
        <Tab.Screen name={'Done'} component={Done} options={{ headerShown: false }}/>
      </Tab.Navigator>  
  )
}

export default function App() {
  return (
    <Provider store={Store}>

      <NavigationContainer>
        <RootStack.Navigator 
          initialRouteName="Splash"
          screenOptions={{
            headerTitleAlign:'center',

            headerStyle:{
              backgroundColor:'#A5937B'
            },
            headerTintColor:'#ffffff',
            headerTitleStyle:{
              fontSize:35,
              fontFamily:"NanumPenScript-Regular"
            }
          }}
        >
            <RootStack.Screen 
              name="Splash" 
              component={Splash}
              options={{
                headerShown:false
              }}
            />
            <RootStack.Screen 
              name="My Task" 
              component={HomeTabs} 
            />
            <RootStack.Screen 
              name="Task" 
              component={Task} 
            />                    
            <RootStack.Screen 
              name="Camera" 
              component={Camera} 
            />
        </RootStack.Navigator>
      </NavigationContainer>
    </Provider>  

  )
}

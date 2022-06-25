import AsyncStorage from '@react-native-async-storage/async-storage'
import React, {useState, useEffect} from 'react'
import { 
  View,
  ScrollView,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
  Image,
  Modal
} from 'react-native'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { useDispatch, useSelector } from 'react-redux'
import CheckBox from '@react-native-community/checkbox'
import { setTasks } from '../_actions/task_action'
import RNFS from 'react-native-fs'
import PushNotification from "react-native-push-notification"



function Task({navigation}) {
  const taskID= useSelector(state=>state.taskReducer.taskID)
  const tasks=useSelector(state=>state.taskReducer.tasks)
  const dispatch=useDispatch()

  
  const [title, setTitle]=useState('')
  const [desc, setDesc]=useState('')
  const [color, setColor]=useState('#F2F2F2')
  const [done, setDone]=useState(false)
  const [image, setImage]=useState('')
  const [tmpImage, setTmpImage]=useState('')
  const [returnCamera, setReturnCamera]=useState(false)
  const [showBellModal, setShowBellModal]=useState(false)
  const [bellTime, setBellTime]=useState('1')

  useEffect(()=>{
    if(!returnCamera)
      getTask()
    else
      setReturnCamera(false)
  }, [])


  const getTask=()=>{
    const Task=tasks.find(task=> task.ID===taskID)

    if(Task){
      setTitle(Task.Title)
      setDesc(Task.Desc)
      setDone(Task.Done)
      setColor(Task.Color)
      setImage(Task.Image)
      setTmpImage(Task.Image)
    }
  } 

  const setTask=()=>{
    if(title.length==0){
      Alert.alert("Warning", "Please write your task title.")
    }else{
      try{
        if(image!==tmpImage){
          RNFS.unlink(tmpImage)
        }

        var Task={ 
          ID: taskID,
          Title: title,
          Desc: desc,
          Done: done,
          Color: color,
          Image: image
        }
        const index=tasks.findIndex(task=>task.ID===taskID)
        let newTasks=[]
        if(index > -1){
            newTasks=[...tasks]
            newTasks[index]=Task
        }else{
            newTasks=[...tasks, Task]
        }
        AsyncStorage.setItem('Tasks',JSON.stringify(newTasks))
          .then(()=>{
            dispatch(setTasks(newTasks))
            Alert.alert('Success!', '저장하였습니다.')
            navigation.goBack()
          })

      }catch(error){
        console.log(error)
      }
    }
  }
  const setTaskAlarm=()=>{
    PushNotification.localNotificationSchedule({
        channelId:'task-channel',
        title:title,
        message:desc,
        date: new Date(Date.now()+parseInt(bellTime)*60*1000),
        allowWhileIdle: true,
        largeIcon: "ic_launcher", // (optional) default: "ic_launcher". Use "" for no large icon.
        smallIcon: "ic_launcher",
    })
  }
  const filepath=(path)=>{
    setReturnCamera(true)
    setImage(path)
    setTmpImage(path)
  }
  const deleteImage=()=>{
    setImage('')
  }

  return (
    <ScrollView>
      <View style={styles.body}>
        <Modal
          visible={showBellModal}
          transparent
          onRequestClose={()=>setShowBellModal(false)}
          animationType='slide'
          hardwareAccelerated
        >
          <View style={styles.centered_view}>
            <View style={styles.bell_modal}>
              <View style={styles.bell_body}>
                <Text style={styles.text}>Remind me After</Text>
                <TextInput
                  style={styles.bell_input}
                  keyboardType='numeric'
                  value={bellTime}
                  onChangeText={(value)=>setBellTime(value)}
                />
                <Text style={styles.text}>minute(s)</Text>
              </View>

              <View style={styles.bell_buttons}>
                <TouchableOpacity
                  style={styles.bell_ok_button}
                  onPress={()=>{
                      setShowBellModal(false)
                      setTaskAlarm()
                  }}
                >
                  <Text style={styles.text}>OK</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.bell_cancel_button}
                  onPress={()=>{
                      setShowBellModal(false)
                  }}
                >
                  <Text style={styles.text}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <TextInput
          value={title}
          style={styles.input}
          placeholder='Title'
          onChangeText={(value)=>setTitle(value)}
        />
        <TextInput
          value={desc}
          style={styles.input}
          placeholder='Description'
          multiline
          onChangeText={(value)=>setDesc(value)}
        />
        <View style={styles.color_bar}>
          <TouchableOpacity
            onPress={()=>{setColor('#F2F2F2')}}
            style={styles.color_lv1}
          >
            {color==='#F2F2F2'&&
              <FontAwesome5
                  name={'check'}
                  size={25}
                  color={'#000000'}
              />
            }
          </TouchableOpacity>
          <TouchableOpacity
            onPress={()=>{setColor('#D9BDAD')}}
            style={styles.color_lv2}
          >
            {color==='#D9BDAD'&&
              <FontAwesome5
                  name={'check'}
                  size={25}
                  color={'#000000'}
              />
            }
          </TouchableOpacity>
          <TouchableOpacity
            onPress={()=>{setColor('#8C6954')}}
            style={styles.color_lv3}
          >
            {color==='#8C6954'&&
              <FontAwesome5
                  name={'check'}
                  size={25}
                  color={'#000000'}
              />
            }
          </TouchableOpacity>
          <TouchableOpacity
            onPress={()=>{setColor('#593E2E')}}
            style={styles.color_lv4}
          >
            {color==='#593E2E'&&
              <FontAwesome5
                  name={'check'}
                  size={25}
                  color={'#000000'}
              />
            }
          </TouchableOpacity>
        </View>
        <View style={styles.extra_row}>
          <TouchableOpacity
            style={styles.extra_button}
            onPress={()=>{setShowBellModal(true)}}
          >
            <FontAwesome5
              name={'bell'}
              size={25}
              color={'#ffffff'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.extra_button}
            onPress={()=>{navigation.navigate('Camera',{filepath:filepath})}}
          >
            <FontAwesome5
              name={'camera'}
              size={25}
              color={'#ffffff'}
            />
          </TouchableOpacity>
        </View>

        {image ?
          <View>
            <Image
              style={styles.image}
              source={{uri:image}}
            />
            <TouchableOpacity
              style={styles.delete}
              onPress={()=>{deleteImage()}}
            >
              <FontAwesome5
                name={'trash'}
                size={25}
                color={'#ff3636'}
              />
            </TouchableOpacity>
          </View>
          :
          null
        }
        <View style={styles.checkbox}>
          <CheckBox 
            value={done}
            onValueChange={(newValue)=>setDone(newValue)}
          />
          <Text style={styles.text}>
              Is Done
          </Text>
        </View>
        <View style={styles.extra_row}>
          <TouchableOpacity
            style={styles.button}
            onPress={setTask}
          >
            <Text style={styles.button_text}>Save Task</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}

const styles= StyleSheet.create({
  body:{
    flex: 1,
    alignItems:'center',
    padding: 10,
  },
  input:{
    width:'100%',
    borderWidth: 1,
    borderColor: '#555555',
    borderRadius: 10,
    backgroundColor: '#ffffff',
    textAlign:'left',
    fontSize: 20,
    margin: 10,
    paddingHorizontal: 10,
  },
  color_bar:{
    flexDirection:'row',
    height:50,
    borderWidth:2,
    borderRadius:10,
    borderColor:'#555555',
    marginVertical:10,
  },
  color_lv1:{
    flex:1,
    backgroundColor:'#F2F2F2',
    justifyContent: 'center',
    alignItems:'center',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  color_lv2:{
    flex:1,
    backgroundColor:'#D9BDAD',
    justifyContent: 'center',
    alignItems:'center',
  },
  color_lv3:{
    flex:1,
    backgroundColor:'#8C6954',
    justifyContent: 'center',
    alignItems:'center',
  },
  color_lv4:{
    flex:1,
    backgroundColor:'#593E2E',
    justifyContent: 'center',
    alignItems:'center',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  extra_row:{
    flexDirection: 'row',
    marginVertical: 10,
  },
  extra_button:{
    flex: 1,
    height: 50,
    backgroundColor: '#A5937B',
    borderRadius: 10,
    marginHorizontal: 5,
    justifyContent:'center',
    alignItems:'center'
  },
  checkbox:{
    flexDirection: 'row',
    marginVertical: 10,
  },
  text:{
    fontSize: 30,
    fontFamily:'NanumPenScript-Regular',
    color:'#000000'
  },
  button_text:{
    fontSize: 40,
    fontFamily:'NanumPenScript-Regular',
    color:'#ffffff'    
  },
  button:{
    flex: 1,
    backgroundColor:'#A5937B',
    height: 50,
    borderRadius: 10,
    marginHorizontal: 5,
    justifyContent:'center',
    alignItems:'center'
  },
  image:{
    width:300,
    height:300,
    margin:20
  },
  centered_view:{
    flex: 1,
    backgroundColor:'#00000099',
    justifyContent:'center',
    alignItems:'center'
  },
  bell_modal:{
    width: 300,
    height: 200,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#000000'
  },
  bell_body:{
    height: 150,
    justifyContent: 'center',
    alignItems:'center',
  },
  bell_input: {
    width:50,
    borderWidth: 1,
    borderColor: '#555555',
    borderRadius: 10,
    backgroundColor: '#ffffff',
    textAlign: 'center',
    fontSize: 20,
    margin: 10,
  },
  bell_buttons:{
    flexDirection:'row',
    height:50,
  },
  bell_cancel_button: {
    flex: 1,
    borderWidth: 1,
    borderBottomRightRadius: 20,
    borderColor: '#000000',
    justifyContent:'center',
    alignItems:'center'
  },
  bell_ok_button: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#000000',
    borderBottomLeftRadius: 20,
    justifyContent:'center',
    alignItems:'center'
  },
  delete:{
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems:'center',
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#ffffff80',
    margin: 10,
    borderRadius: 5,
  }
})

export default Task
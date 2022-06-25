import React, {useState, useEffect} from 'react'
import { 
  View, 
  StyleSheet, 
  TouchableOpacity,
  FlatList,
  Text,
  Alert
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { useDispatch, useSelector } from 'react-redux'
import { setTaskID, setTasks } from '../_actions/task_action'
import CheckBox from '@react-native-community/checkbox'
import { useIsFocused } from '@react-navigation/native';



function Done({navigation}) {
  const isFocused = useIsFocused();

  const {tasks}= useSelector(state=>state.taskReducer)
  const dispatch=useDispatch()
  const [filteredTask, setFilteredTask] = useState([]);

  useEffect(()=>{
    getTasks()
  },[isFocused])

  const getTasks=()=>{
    AsyncStorage.getItem('Tasks')
      .then(tasks=>{
        const parsedTasks=JSON.parse(tasks)
        if(parsedTasks && typeof parsedTasks==='object'){
          dispatch(setTasks(parsedTasks))
          setFilteredTask(parsedTasks.filter(task => task.Done === true));
        }
      })
      .catch(err=>console.log(err))
  }

  const checkTask=(id, newValue)=>{
    const index=tasks.findIndex(task=>task.ID===id)
    if(index>-1){
      let newTasks=[...tasks]
      newTasks[index].Done=newValue
      AsyncStorage.setItem('Tasks', JSON.stringify(newTasks))
        .then(()=>{
          dispatch(setTasks(newTasks))
          setFilteredTask(newTasks.filter(task => task.Done === true));
          getTasks()
        })
        .catch(err=>console.log(err))
    }
    
  }

  const deleteTask=(id)=>{
    const filteredTasks= tasks.filter(task=>task.ID !==id)

    AsyncStorage.setItem('Tasks', JSON.stringify(filteredTasks))
      .then(()=>{
        dispatch(setTasks(filteredTasks))
        setFilteredTask(filteredTasks.filter(task => task.Done === true));
        getTasks()
        Alert.alert('Success', '삭제되었습니다')
      })
      .catch(err=>console.log(err))
  }

  return (
    <View style={styles.body}>
      <FlatList
        data={filteredTask}
        renderItem={({item})=>(
          <TouchableOpacity
            style={styles.item}
            onPress={()=>{
              dispatch(setTaskID(item.ID))
              navigation.navigate('Task')
            }}
          >
            <View style={styles.item_row}>
              <View 
                style={[
                  {
                    backgroundColor: 
                      item.Color ==='#F2F2F2'? '#F2F2F2' :
                      item.Color ==='#D9BDAD'? '#D9BDAD' :
                      item.Color ==='#8C6954'? '#8C6954' :'#593E2E'
                  },styles.color]}
              />
              <CheckBox
                value={item.Done}
                onValueChange={(newValue)=>{checkTask(item.ID, newValue)}}
              />
              <View style={styles.item_body}>
                <Text 
                  style={styles.title}
                  numberOfLines={1}
                >
                  {item.Title}
                </Text>
                <Text 
                  style={styles.subtitle}
                  numberOfLines={1}
                >
                  {item.Desc}
                </Text>
              </View>
            <TouchableOpacity
              style={styles.delete}
              onPress={()=>deleteTask(item.ID)}
            >
              <FontAwesome5
                name={'trash'}
                size={25}
                color={'#ff3636'}
              />
            </TouchableOpacity>
            </View>

          </TouchableOpacity>
        )}
        keyExtractor={(item,index)=>index.toString()}
      />
    </View>
  )
}

const styles=StyleSheet.create({
  body:{
    flex: 1
  },
  item:{
    marginHorizontal: 10,
    marginVertical: 7,
    paddingRight:10,
    backgroundColor:'#ffffff',
    justifyContent:'center',
    borderRadius: 10,
    elevation:5
  },
  item_body:{
    flex: 1,
  },
  item_row:{
    flexDirection:'row',
    alignItems:'center'
  },
  title:{
    fontFamily:"NanumPenScript-Regular",
    color:'#000000',
    fontSize: 30,
    margin: 5
  },
  subtitle:{
    fontFamily:"NanumPenScript-Regular",
    color:'#999999',
    fontSize: 20,
    margin: 5
  },
  color:{
    width:20,
    height:100,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10
  }
})

export default Done
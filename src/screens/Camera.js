import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import { useCamera } from 'react-native-camera-hooks';


const Camera = ({navigation, route}) => {
  const [{cameraRef}, {takePicture}]=useCamera(null)

  const captureHandle=async()=>{
    try{
      const data=await takePicture()
      const filePath=data.uri

      navigation.goBack()
      route.params.filepath(filePath)

    } catch(error){
      console.log(error)
    }
  }

  return (
    <View style={styles.body}>
      <RNCamera
        ref={cameraRef}
        type={RNCamera.Constants.Type.back}
        style={styles.preview}
        captureAudio={false}
      />
      <TouchableOpacity
          style={styles.button}
          onPress={()=>captureHandle()}
        >
          <Text style={styles.button_text}>Capture</Text>
        </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  body:{
    flex:1,
  },
  preview:{
    flex:1,
    alignItems:'center',
    justifyContent:'flex-end'
  },
  button_text:{
    fontSize: 40,
    fontFamily:'NanumPenScript-Regular',
    color:'#ffffff'    
  },
  button:{
    backgroundColor:'#A5937B',
    height: 70,
    justifyContent:'center',
    alignItems:'center'
  },
});

export default Camera;

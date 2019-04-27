import React from 'react';
import { StyleSheet, Text, View, TouchableNativeFeedback, Image } from 'react-native';
import { Camera, Permissions, FaceDetector, DangerZone } from 'expo';
import Overlay from "./Overlay";
import postImage from "./Client";
import MyCarousel from "./MyCarousel";
import OkButton from './OkButton';
import CancelButton from './CancelButton';

export default class App extends React.Component {
  static defaultProps = {
    motionInterval: 500, //ms between each device motion reading
    motionTolerance: 1, //allowed variance in acceleration
    cameraType: Camera.Constants.Type.front, //front vs rear facing camera
  }

  state = {
    faceShapes : [],
    hasCameraPermission: null,
    faceDetecting: false, //when true, we look for faces
    faceDetected: false, //when true, we've found a face
    pictureTaken: false, //true when photo has been taken
    motion: null, //captures the device motion object 
    detectMotion: false, //when true we attempt to determine if device is still
    visibleGlasses : [],
    isButtonsVisible : false
  };
  landmarkThreshold = 4;

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  componentDidMount(){
    this.motionListener = DangerZone.DeviceMotion.addListener(this.onDeviceMotion);
    this.detectMotion(true);
    // setTimeout(()=>{ //MH - tempm - wait 5 seconds for now before detecting motion
    // },2000);
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.detectMotion && nextState.motion && this.state.motion){
      if (
        Math.abs(nextState.motion.x - this.state.motion.x) < this.props.motionTolerance
        && Math.abs(nextState.motion.y - this.state.motion.y) < this.props.motionTolerance
        && Math.abs(nextState.motion.z - this.state.motion.z) < this.props.motionTolerance
      ){
        //still
        this.detectFaces(true);
        this.detectMotion(false);
      } else {
        //moving
      }
    }
  }

  detectMotion =(doDetect)=> {
    this.setState({
      detectMotion: doDetect,
    });
    if (doDetect){
      DangerZone.DeviceMotion.setUpdateInterval(this.props.motionInterval);
    } else if (!doDetect && this.state.faceDetecting) {
      this.motionListener.remove();
    } 
  }

  onDeviceMotion = (rotation)=>{
    this.setState({
      motion: rotation.accelerationIncludingGravity
    });
  }

  detectFaces(doDetect){
    this.setState({
      faceDetecting: doDetect,
    });
  }

  handleFaceDetectionError = ()=>{
    //
  }
  handleFacesDetected = ({ faces }) => {
    
    if (faces.length >= 1){

      // console.log(faces);

      this.setState({
        faceDetected: true,
        faceShapes : faces,
        faceValid : true,
        isButtonsVisible : true
      });

    } else {
      this.setState({
        faceDetected: false,
        faceShapes : [],
        faceValid : false,
        isButtonsVisible : false
      });
    }
  }
  takePicture = ()=>{
    this.setState({
      pictureTaken: true
    });
    if (this.camera) {
      this.setState({
        pictureTaken : false,
        visibleGlasses : [0,1,2,3,4]
      });
      // this.camera.takePictureAsync({ base64: true, onPictureSaved: this.onPictureSaved });
    }
  }

  onPictureSaved = (img)=>{    
    // postImage(img);

    this.setState({
      pictureTaken : false,
      visibleGlasses : [0,1,2,3,4]
    });
    this.detectFaces(true);
  }

  onOkPress = () => {
    
    console.log("ok");
    this.setState({

    });
  }
  onCancelPress = () => {
    console.log("cancel");
    
    this.setState({
      visibleGlasses : []
    });
  }

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={styles.container}>
          
          <Camera
            style={{ flex:1 }}
            type={this.props.cameraType}
            onFacesDetected={this.state.faceDetecting ? this.handleFacesDetected : undefined }
            onFaceDetectionError={this.handleFaceDetectionError}
            faceDetectorSettings={{
              mode: FaceDetector.Constants.Mode.accurate,
              detectLandmarks: FaceDetector.Constants.Landmarks.all,
              runClassifications: FaceDetector.Constants.Mode.none,
            }}
            ref={ref => {
              this.camera = ref;
            }}>
            
            <TouchableNativeFeedback
              style={{zIndex : 1}}
              disabled={!this.state.faceValid}
              onPress={this.takePicture}>
              <View style={this.state.faceValid ? styles.button : styles.buttonDisabled}>
                <Text style={this.state.faceValid ? styles.buttonText : styles.buttonTextDisabled}
                  disabled={this.state.faceValid}>
                  SUGGEST GLASSES
                </Text>
              </View>
            </TouchableNativeFeedback>

            <Overlay shapes={this.state.faceShapes} />

            <MyCarousel items={this.state.visibleGlasses} faces={this.state.faceShapes}/>

            <CancelButton handlePress={this.onCancelPress} isEnabled={this.state.isButtonsVisible}/>
            <OkButton handlePress={this.onOkPress} isEnabled={this.state.isButtonsVisible}/>

            <Image
              source={require("./assets/face_t.png")}
              style={styles.faceImage}
              opacity={this.state.faceDetected ? 0 : 1}
              />
            <View
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                flexDirection: 'row',
                position: 'absolute',
                bottom: 0,
              }}>
                <Text
                  style={styles.textStandard}>
                  {this.state.faceDetected ? 'Hi :)' : 'No Face Detected'}
                </Text>
            </View>
          </Camera>
        </View>
      );
    }
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex : 0
  },
  textStandard: {
    fontSize: 18, 
    marginBottom: 10, 
    color: 'white'
  },
  countdown: {
    fontSize: 40,
    color: 'white'
  }, 
  button: {
    elevation: 5,
    // Material design blue from https://material.google.com/style/color.html#color-color-palette
    backgroundColor: '#2196F3',
    bottom: 70,
    position: "absolute",
    width : 220,
    height: 70,
    justifyContent: "center",
    alignItems : "center",
    alignSelf : "center",
    borderRadius : 50,
    zIndex : 1
  },
  buttonText: {
    textAlign: 'center',
    padding: 8,
    color: 'white',
    fontWeight: '500'
  },
  buttonDisabled: {
    elevation: 0,
    backgroundColor: '#dfdfdf',
    bottom: 70,
    position: "absolute",
    width : 220,
    height: 70,
    justifyContent: "center",
    alignItems : "center",
    alignSelf : "center",
    borderRadius : 50,
    zIndex : 1
  },
  buttonTextDisabled: {
    color: '#a1a1a1'
  },
  faceImage: { 
    position:"absolute",
    alignSelf : "center",
    bottom : 300
  }
});
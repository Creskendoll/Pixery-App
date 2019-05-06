import React from 'react';
import { StyleSheet, Text, View, TouchableNativeFeedback, Image } from 'react-native';
import { Camera, Permissions, FaceDetector, DangerZone } from 'expo';
import Overlay from "./Overlay";
import postImage from "./Client";
import MyCarousel from "./MyCarousel";
import OkButton from './OkButton';
import CancelButton from './CancelButton';

export default class MyCamera extends React.Component {
  static defaultProps = {
    motionInterval: 500, //ms between each device motion reading
    motionTolerance: 1, //allowed variance in acceleration
    cameraType: Camera.Constants.Type.front, //front vs rear facing camera
  }
  
  static navigationOptions = {
    title: 'MyCamera',
    tabBarVisible: false,
    header : null
  };

  state = {
    faceShapes : [],
    hasCameraPermission: null,
    faceDetecting: false, //when true, we look for faces
    faceDetected: false, //when true, we've found a face
    motion: null, //captures the device motion object 
    detectMotion: false, //when true we attempt to determine if device is still
    visibleGlasses : null,
    isButtonsVisible : false,
    selectedGlasses : null,
    glassesPrice : "0$",
    loading : false,
    confidence : "%0 Match"
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
        faceValid : true
      });

    } else {
      this.setState({
        faceDetected: false,
        faceShapes : [],
        faceValid : false
      });
    }
  }
  takePicture = ()=>{
    if (this.camera) {
      if(this.state.visibleGlasses != null) {
        this.setState({
          visibleGlasses : Math.floor((Math.random() * (+8 - +0) + +0)),
          isButtonsVisible : true,
          confidence : "%80 Match"
        });
      } else {
        this.setState({
          visibleGlasses : Math.floor((Math.random() * (+8 - +0) + +0)),
          isButtonsVisible : true,
          // loading : true,      
          confidence : "%80 Match"
        });
        // this.camera.takePictureAsync({ base64: true, onPictureSaved: this.onPictureSaved, quality : 0.2 });
      }
    }
  }

  onResponse = (response) => {
    let category = response["category"];
    let confidence = response["confidence"];
    this.setState({
      loading : false,
      // visibleGlasses : Math.floor((Math.random() * (+8 - +0) + +0)),
      visibleGlasses : category,
      isButtonsVisible : true,
      confidence : "%" + (confidence).toString() + " Match"
    });
  }

  onPictureSaved = (img)=>{    
    postImage(img, this.onResponse);

    this.setState({
      pictureTaken : false
    });
    this.detectFaces(true);
  }

  onOkPress = () => {
    const {navigate} = this.props.navigation;

    // console.log("ok");
    navigate('Shop', {image: this.state.selectedGlasses,
        price: this.state.glassesPrice});

    // this.props.navigation.navigate("Shop");

    this.setState({

    });
  }
  onCancelPress = () => {
    // console.log("cancel");
    
    this.setState({
      visibleGlasses : null,
      isButtonsVisible : false
    });
  }

  setSelectedGlasses = (img, price) => {        
    this.setState({
      selectedGlasses : img,
      glassesPrice : price
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

            <MyCarousel selectedCategory={this.state.visibleGlasses} 
              faces={this.state.faceShapes} handleSnap={this.setSelectedGlasses}
              confidence={this.state.confidence}  />

            <CancelButton handlePress={this.onCancelPress} isEnabled={this.state.isButtonsVisible}/>
            <OkButton handlePress={this.onOkPress} isEnabled={this.state.isButtonsVisible}/>

            <Image
              source={require("./assets/loading.gif")}
              style={styles.loadingGIF}
              opacity={this.state.loading ? 1 : 0}
              resizeMode={"contain"}
              />

            <Image
              source={require("./assets/face_t.png")}
              style={styles.faceImage}
              opacity={this.state.faceDetected ? 0 : 1}
              resizeMode={"contain"}
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
    height : 300,
    width : 300,
    bottom : 250
  },
  loadingGIF : {
    position:"absolute",
    alignSelf : "center",
    height : 75,
    width : 75,
    top : 50,
    right : 30
  }
});
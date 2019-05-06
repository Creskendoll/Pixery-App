import React from 'react';
import { StyleSheet, Text, View, TouchableNativeFeedback,
     Image, ToastAndroid, Dimensions, ImageBackground } from 'react-native';

export default class ShopScreen extends React.Component {
    static defaultProps = {
        img : null,
        price : "0$"
    }
    
    static navigationOptions = {
        title: 'Buy Glasses'
    };

    img = 0;
    price = "0$";

    constructor(props) {
        super(props);

        this.img = this.props.navigation.getParam("image");
        this.price = this.props.navigation.getParam("price");
    }

    _showToast() {
        ToastAndroid.showWithGravity(
            'Item Bought!',
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM
          );
    }

    render() {
        let h, w = Dimensions.get("window");
        return (
            <ImageBackground source={require("./assets/shop_bg.jpg")}
            style={styles.shopContainer}>
                <View style={{
                    position : "absolute",
                    alignSelf : "center",
                    width : "100%",
                    height : 200,
                    top : 50,
                    borderRadius: 10,
                    borderWidth : 5,
                    borderColor : "#00aaff",
                    backgroundColor : "#fff"
                }}>

                    <Image style={{
                    position : "absolute",
                    alignSelf : "center",
                    width : 300,
                    height : 200
                    }} 
                    source={this.img} 
                    resizeMode={'contain'} />
                </View>

                <View style={{
                    position: "absolute",
                    alignSelf : "center",
                    top: 270,
                    left : 40,
                    width : 350,
                    height : 150,
                    marginRight: 50
                }}>
                    <Image
                        style={{
                            position: "absolute",
                            width:300,
                            height:100,
                        }}
                        source={require("./assets/price_tag.png")}
                        resizeMode={"contain"}
                    />
                    <Text style={{
                        position: "absolute",
                        fontSize: 40,
                        letterSpacing : 5,
                        color: "#0a0aff",
                        marginLeft : 120,
                        marginTop : 30
                    }}>
                        {this.price}
                    </Text>

                </View>
                <TouchableNativeFeedback
                style={{zIndex : 1}}
                onPress={this._showToast}>
                    <View style={styles.buyButton}>
                        <Image 
                            style={styles.buyImg}
                            source={require("./assets/buy.png")}
                        />
                    </View>
                </TouchableNativeFeedback>
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    shopContainer : {
        flex : 1,
        backgroundColor : "#3e2723",
        width : '100%',
        height: '100%'
    },
    buyImg : { 
        width : 60,
        height: 60,
        position:"absolute",
        alignSelf : "center"
    },
    buyButton: {
        elevation: 5,
        backgroundColor: '#ff8f00',
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
    glassImg : {
        position:"absolute",
        alignSelf : "center"
    }
});
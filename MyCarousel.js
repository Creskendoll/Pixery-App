import Carousel from 'react-native-snap-carousel';
import React from 'react';
import { StyleSheet, Text, View, Image, Dimensions } from 'react-native';

export default class MyCarousel extends React.Component {

    static defaultProps = {
        items : [],
        faces : []
    }

    images = [
        require("./assets/glasses/0.png"),
        require("./assets/glasses/1.png"),
        require("./assets/glasses/2.png"),
        require("./assets/glasses/3.png"),
        require("./assets/glasses/4.png"),
        require("./assets/glasses/5.png"),
        require("./assets/glasses/6.png"),
        require("./assets/glasses/7.png"),
        require("./assets/glasses/8.png")
    ]

    prices = [
        Math.floor((Math.random() * (+1000 - +50) + +50)).toString() + "$",
        Math.floor((Math.random() * (+1000 - +50) + +50)).toString() + "$",
        Math.floor((Math.random() * (+1000 - +50) + +50)).toString() + "$",
        Math.floor((Math.random() * (+1000 - +50) + +50)).toString() + "$",
        Math.floor((Math.random() * (+1000 - +50) + +50)).toString() + "$",
        Math.floor((Math.random() * (+1000 - +50) + +50)).toString() + "$",
        Math.floor((Math.random() * (+1000 - +50) + +50)).toString() + "$",
        Math.floor((Math.random() * (+1000 - +50) + +50)).toString() + "$",
        Math.floor((Math.random() * (+1000 - +50) + +50)).toString() + "$"
    ]


    xPos = 0;
    yPos = 0;
    faceWidth = 0;
    faceHeight = 0;
    faceTopLeftX = 0;
    faceTopLeftY = 0;

    constructor (props) {
        super(props);

        this._renderItem = this._renderItem.bind(this);
    }

    _renderItem ({item, index}) {
        return (
            <View>
                <Image
                    source={this.images[item]}
                    style={{
                        position: "absolute",
                        alignSelf : "center",
                        width : this.faceWidth,
                        height : this.faceHeight/4,
                        top : this.yPos-75/2,
                        left : this.xPos-(this.faceWidth/2)-45,
                        zIndex : 998
                    }}
                    opacity={1}/>
                <Text style={{
                    position: "absolute",
                    alignSelf : "center",
                    top : this.faceTopLeftY+this.faceHeight,
                    left : this.xPos-(this.faceWidth/2)-45,
                    zIndex : 998,
                    fontSize: 25,
                    letterSpacing : 5,
                    color: "#0a0aff"
                }}>
                    {this.prices[item]}
                </Text>
            </View>
        );
    }

    render () {
        let face = this.props.faces[0] || [];
        if("leftEyePosition" in face && "rightEyePosition" in face) {
            this.xPos = Math.abs(face["leftEyePosition"].x + face["rightEyePosition"].x) / 2;
            this.yPos = face["rightEyePosition"].y
        }
        if (face.length != 0) {
            this.faceWidth = face.bounds.size.width;
            this.faceHeight = face.bounds.size.height;
            this.faceTopLeftX = face.bounds.origin.x;
            this.faceTopLeftY = face.bounds.origin.y;
        }

        return (
            <View style={{flex:1}}> 
                <Carousel
                    ref={(c) => { this._carousel = c; }}
                    containerCustomStyle={styles.carousel}
                    inactiveSlideScale={0.9}
                    inactiveSlideOpacity={0.8}
                    enableMomentum={true}
                    activeAnimationType={'spring'}
                    activeAnimationOptions={{
                        friction: 4,
                        tension: 40
                    }}
                    data={this.props.items}
                    renderItem={this._renderItem}
                    sliderWidth={1000}
                    itemWidth={250}
                />

            </View>
        );
    }
}

const styles = StyleSheet.create({
    carouselContainer: {
        flex : 1,
        position : "absolute",
        alignItems : "center"
    },
    slide: {
        position: "absolute",
        alignSelf : "center",
        width : 250,
        height : 150,
        bottom : 350,
        zIndex : 998
    },
    carousel : {
        overflow: "visible",
        backgroundColor : "transparent",
        alignSelf : "center",
        zIndex : 999
    }
});
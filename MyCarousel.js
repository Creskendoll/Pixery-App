import Carousel from 'react-native-snap-carousel';
import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

export default class MyCarousel extends React.Component {

    static defaultProps = {
        selectedCategory : null,
        faces : [],
        handleSnap : (img, price) => {},
        confidence : "%0 Match"
    }

    images = [
        [
            require("./assets/glasses/Kategori1/0.png"),
            require("./assets/glasses/Kategori1/1.png")
        ],
        [
            require("./assets/glasses/Kategori2/0.png"),
            require("./assets/glasses/Kategori2/1.png")
        ],
        [
            require("./assets/glasses/Kategori3/0.png"),
            require("./assets/glasses/Kategori3/1.png")
        ],
        [
            require("./assets/glasses/Kategori4/0.png"),
            require("./assets/glasses/Kategori4/1.png")
        ],
        [
            require("./assets/glasses/Kategori5/0.png"),
            require("./assets/glasses/Kategori5/1.png")
        ],
        [
            require("./assets/glasses/Kategori6/0.png"),
            require("./assets/glasses/Kategori6/1.png"),
            require("./assets/glasses/Kategori6/2.png"),
            require("./assets/glasses/Kategori6/3.png")
        ],
        [
            require("./assets/glasses/Kategori7/0.png"),
            require("./assets/glasses/Kategori7/1.png"),
            require("./assets/glasses/Kategori7/2.png"),
            require("./assets/glasses/Kategori7/3.png"),
            require("./assets/glasses/Kategori7/4.png")
        ],
        [
            require("./assets/glasses/Kategori8/0.png"),
            require("./assets/glasses/Kategori8/1.png"),
            require("./assets/glasses/Kategori8/2.png"),
            require("./assets/glasses/Kategori8/3.png")
        ]
    ]

    prices = []

    xPos = 0;
    yPos = 0;
    faceWidth = 0;
    faceHeight = 0;
    faceTopLeftX = 0;
    faceTopLeftY = 0;

    sliderW = 0;
    itemW = 0;

    constructor (props) {
        super(props);

        this.images.forEach(_ => {
            this.prices.push(Math.floor((Math.random() * (+500 - +50) + +50)).toString() + "$");
        });
        
        this.sliderW = 5 * 300;
        this.itemW = 300;

        this._renderItem = this._renderItem.bind(this);
    }

    componentDidMount() {
        this.props.handleSnap(this.images[0][0],this.prices[0]);
        let face = this.props.faces[0] || [];

        if (face.length != 0) {
            this.faceWidth = face.bounds.size.width;
            this.faceHeight = face.bounds.size.height;
            this.faceTopLeftX = face.bounds.origin.x;
            this.faceTopLeftY = face.bounds.origin.y;
        }

        this.sliderW = this.props.selectedCategory == null ? 1200 : this.faceWidth * this.images[this.props.selectedCategory].length;
        this.itemW = this.props.selectedCategory == null ? 300 : this.faceWidth;
    }

    _renderItem ({item, index}) {
        return (
            <View>
                <Image
                    source={item}
                    style={{
                        position: "absolute",
                        alignSelf : "center",
                        width : this.faceWidth,
                        height : this.faceHeight/4,
                        top : this.yPos-75/2,
                        left : this.xPos-(this.faceWidth/2)-30,
                        zIndex : 998
                    }}
                    opacity={1}
                    resizeMode={"contain"}/>

                    <View style={{
                            position:"absolute",
                            alignSelf : "center",
                            top : this.faceTopLeftY-40,
                            left : this.xPos-(this.faceWidth)+30,
                            zIndex : 998}}>
                        <Text style={{
                            position: "absolute",
                            fontSize: 25,
                            letterSpacing : 5,
                            color: "#0afaaa",
                            marginLeft : 30,
                            marginTop: 15
                        }}>
                            {this.props.confidence}
                        </Text>
                    </View>

                    <View style={{position:"absolute",
                            alignSelf : "center",
                            top : this.faceTopLeftY+this.faceHeight,
                            left : this.xPos-(this.faceWidth)+15,
                            zIndex : 998}}>
                        <Image
                            style={{
                                position: "absolute",
                                width:this.faceWidth,
                                height:70
                            }}
                            source={require("./assets/price_tag.png")}
                            resizeMode={"contain"}
                        />
                        <Text style={{
                            position: "absolute",
                            fontSize: 25,
                            letterSpacing : 5,
                            color: "#0a0aff",
                            marginLeft : 50,
                            marginTop: 15
                        }}>
                        {this.prices[index]}
                        </Text>
                    </View>
            </View>
        );
    }

    _onSnap = (index) => {
        this.props.handleSnap(this.images[this.props.selectedCategory][index], this.prices[index]);
    }

    render () {
        if (this._carousel && !this.props.selectedCategory) {
            this._carousel.currentIndex = 0;
        }
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
                    onSnapToItem={this._onSnap}
                    activeAnimationOptions={{
                        friction: 2,
                        tension: 20
                    }}
                    data={this.props.selectedCategory == null ?
                        [] : this.images[this.props.selectedCategory]}
                    renderItem={this._renderItem}
                    sliderWidth={this.sliderW}
                    itemWidth={this.itemW}
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
    carousel : {
        overflow: "visible",
        backgroundColor : "transparent",
        alignSelf : "center",
        zIndex : 999
    }
});
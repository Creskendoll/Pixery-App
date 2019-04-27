import Carousel from 'react-native-snap-carousel';
import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

export default class MyCarousel extends React.Component {

    static defaultProps = {
        items : [],
        faces : []
    }

    constructor (props) {
        super(props);

        this._renderItem = this._renderItem.bind(this);
    }

    _renderItem ({item, index}) {
        let imgPath = "./assets/glasses/1.jpg";
        return (
            <Image
                source={require(imgPath)}
                style={styles.slide}
                opacity={1}
            />
        );
    }

    render () {
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
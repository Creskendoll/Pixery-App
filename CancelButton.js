import React from 'react';
import { StyleSheet, View, TouchableNativeFeedback, Image } from 'react-native';

export default class CancelButton extends React.Component  {

	static defaultProps = {
        isEnabled : false,
        handlePress : () => {}
	}

	render() {
		return (
			<TouchableNativeFeedback
            style={{zIndex : 2}}
            onPress={this.props.handlePress}>
				<View style={this.props.isEnabled ? styles.cancelButton : styles.disabledCancelButton}>
					<Image
                        source={this.props.isEnabled ? require("./assets/buttons/cancel.png") : require("./assets/buttons/cancel_disabled.png")}
                        style={styles.cancelButtonImg}
					/>
				</View>
		    </TouchableNativeFeedback>
		);
	}
}

const styles = StyleSheet.create({
	cancelButton : {
        elevation: 5,
        bottom: 150,
        position: "absolute",
        width : 80,
        height: 80,
        left : 20
    },
    cancelButtonImg : {
        width : 80,
        height: 80,
        position:"absolute",
        alignSelf : "center"
    },
    disabledCancelButton : {
        elevation: 0,
        bottom: 150,
        position: "absolute",
        width : 80,
        height: 80,
        left : 20
    }
});
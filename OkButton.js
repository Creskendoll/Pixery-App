import React from 'react';
import { StyleSheet, View, TouchableNativeFeedback, Image } from 'react-native';

export default class OkButton extends React.Component  {

	static defaultProps = {
		isEnabled : false,
		handlePress : () => {}
	}

	render() {
		return (
			<TouchableNativeFeedback
			style={{zIndex : 2}}
			onPress={this.props.handlePress}>
				<View style={this.props.isEnabled ? styles.okButton : styles.disabledOkButton}>
					<Image
						source={this.props.isEnabled ? require("./assets/buttons/ok.png") : require("./assets/buttons/ok_disabled.png")}
						style={styles.okButtonImg}
					/>
				</View>
			</TouchableNativeFeedback>
		);
	}
}

const styles = StyleSheet.create({	
  okButton : {
		elevation: 5,
		bottom: 150,
		position: "absolute",
		width : 80,
		height: 80,
		right : 20
	},
	okButtonImg : {
		width : 80,
		height: 80,
		position:"absolute",
    alignSelf : "center"
	},
	disabledOkButton : {
		elevation: 0,
		bottom: 150,
		position: "absolute",
		width : 80,
		height: 80,
		right : 20
},
});
import React from "react";
// Customizable Area Start
import {
  ScrollView,
  SafeAreaView,
  StyleSheet,
  View,
  ImageBackground,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
} from "react-native";

import PostCreationCommonController, { configJSON } from "./PostCreationCommonController";
import { deviceHeight, deviceWidth } from "../../../framework/src/Utilities";

// Customizable Area End

export interface Props {
  navigation: any;
  // Customizable Area Start
  // Customizable Area End
}

export default class PostSelection extends PostCreationCommonController {
  constructor(props: Props) {
    super(props);
  }
  async componentDidMount() {
    this.setState({optionSelected:''})
    this.props.navigation.addListener("willFocus", () => {
      this.setState({optionSelected:''})
    });
  }
  render() {
    // Customizable Area Start
    // Customizable Area End
    return (
      <SafeAreaView style={styles.safeAreaView}>
        <ScrollView>
          {/* Customizable Area Start */}
          <StatusBar
            backgroundColor="#3333CC3B" />
          <ImageBackground
            source={require("../../../mobile/assets/images/post_selection_bg.png")}
            style={styles.backgroundImage} >
            <View style={styles.container}>
              <Text style={styles.selectOption}>{configJSON.selectAnOption}</Text>
              <TouchableOpacity
                testID="showBtn"
                style={[
                  styles.button,
                  this.state.optionSelected === 'show' && styles.activeButton,
                  { marginTop: 30, }
                ]}
                onPress={() => {
                  this.setState({ optionSelected: 'show' });
                }} >
                <Image
                  source={require("../../../mobile/assets/images/post_show.png")}
                  style={{ height: 40, width: 40, marginRight: 15, tintColor: this.state.optionSelected === 'show' ? '#FFFFFF' : '#334155', }} />
                <Text style={[styles.buttonText, this.state.optionSelected === 'show' && styles.activeButtonText]}>
                  {configJSON.postAShow}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                testID="pictureBtn"
                style={[
                  styles.button,
                  this.state.optionSelected === 'picture' && styles.activeButton,
                  { marginTop: 15, },
                ]}
                onPress={() => {
                  this.setState({ optionSelected: 'picture' });
                }} >
                <Image
                  source={require("../../../mobile/assets/images/post_picture.png")}
                  style={{ height: 40, width: 40, marginRight: 15, tintColor: this.state.optionSelected === 'picture' ? '#FFFFFF' : '#334155', }}
                />
                <Text style={[styles.buttonText, this.state.optionSelected === 'picture' && styles.activeButtonText]}>
                  {configJSON.postAPicture}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                testID="continueBtn"
                style={[styles.continueButton, { backgroundColor: '#EDEDFF' }]}
                disabled={this.state.optionSelected === ""}
                onPress={() => {
                    console.log('PostSelection - Navigating with selectedType:', this.state.optionSelected);
                    this.props.navigation.navigate("ImageSelection", {
                      selectedType: this.state.optionSelected
                    })
                }} >
                <Text style={[styles.continueButtonText, { color: '#3333CC' }]}>{configJSON.continue}</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
          {/* Customizable Area End */}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

// Customizable Area Start
const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    alignSelf: "center",
  },
  backgroundImage: {
    width: deviceWidth - 10,
    height: deviceHeight,
    justifyContent: 'center',
  },
  selectOption: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  container: {
    marginHorizontal: 20,
  },
  button: {
    flexDirection: 'row',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 30,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '400',
    textAlignVertical: 'center',
    color: '#334155',
  },
  activeButton: {
    backgroundColor: '#4949EE',
  },
  activeButtonText: {
    color: '#FFFFFF',
  },
  continueButton: {
    borderRadius: 10,
    backgroundColor: '#EDEDFF',
    justifyContent: 'center',
    padding: 15,
    marginTop: 30,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3333CC',
    textAlignVertical: 'center',
    textAlign: 'center',
  },
});
// Customizable Area End

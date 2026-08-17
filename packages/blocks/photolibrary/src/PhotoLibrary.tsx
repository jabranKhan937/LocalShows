import React from "react";
// Customizable Area Start
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  TextInput,
  SafeAreaView,
  StatusBar,
  ActivityIndicator
} from "react-native";
import { colors } from "../../utilities/src/Colors";
// Customizable Area End

import PhotoLibraryController, {
  Props,
  configJSON
} from "./PhotoLibraryController";

export default class PhotoLibrary extends PhotoLibraryController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }

  // Customizable Area Start
  renderHeader = () => {
    return (
      <View style={styles.header}>
        <TouchableOpacity
          testID="backBtn"
          onPress={() => { this.props.navigation.goBack() }}>
          <Image source={require("../../../mobile/assets/images/next.png")} style={styles.backBtn} />
        </TouchableOpacity>
        <Text style={styles.pageTitle}>{configJSON.pictureInformation}</Text>
        <View />
      </View>
    )
  }

  renderDescription = () => {
    return (
      <>
        <Text style={[styles.label, { marginTop: 30, }]}>{configJSON.description}<Text style={styles.normalFont}>{configJSON.max300}</Text></Text>
        <TextInput
          testID="descriptionInputText"
          placeholder="Enter description"
          style={styles.input}
          multiline
          placeholderTextColor="#CBD5E1"
          value={this.state.description}
          maxLength={300}
          onChangeText={(description) => { this.setState({ description }) }}
        />
      </>
    )
  }

  renderAgeDisclaimer = () => {
    return (
      <View style={{ flexDirection: 'row', marginTop: 20, }}>
        <Image source={require("../../../mobile/assets/images/info_icon.png")} style={styles.backBtn} />
        <Text style={[styles.label, styles.normalFont, { marginHorizontal: 10, }]}>{configJSON.under18Age}</Text>
      </View>
    )
  }

  renderError = (errorType: string) => {
    return (
      <>
        {errorType !== "" && <Text style={styles.errorText}>{errorType}</Text>}
      </>
    )
  }

  renderSuccessToast = () => {
    return (
      <>
        {this.state.showSuccessToast && (
          <View style={styles.successToastContainer}>
            <View style={styles.successToastView}>
              <Text style={styles.successToastText}>
                {configJSON.postCreatedAlertMessageDescription}
              </Text>
            </View>
          </View>
        )}
      </>
    )
  }

  // Customizable Area End

  render() {
    // Customizable Area Start
    // Merge Engine - render - Start
    return (
      <SafeAreaView style={styles.safeAreaView}>
        <StatusBar barStyle="dark-content" backgroundColor="#FCFCFF" />
        <TouchableWithoutFeedback
          testID="container"
          onPress={() => {
            this.hideKeyboard();
          }}>
          <View style={{ flex: 1, padding: 20 }}>
            {this.renderHeader()}
            {this.renderSuccessToast()}
            {this.renderDescription()}
            {this.renderError(this.state.descriptionError)}
            {this.renderError(this.state.pictureError)}
            {this.renderAgeDisclaimer()}
          </View>
        </TouchableWithoutFeedback>
        <TouchableOpacity
          testID="btnPostPicture"
          style={styles.postPictureBtn}
          onPress={this.handlePostAPictureAPI}>
          <Text style={[styles.textPostPictureBtn]}>
            {this.state.pictureId ? configJSON.updateThePost : configJSON.postThePicture}
          </Text>
        </TouchableOpacity>
        {this.state.isLoading && <View style={styles.loadingContainer}>
          <ActivityIndicator size={'large'} color="black" />
        </View>}
      </SafeAreaView>
    );
    // Customizable Area End
    // Merge Engine - render - End
  }
}

// Customizable Area Start
const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    width: "100%",
    height: "100%",
    alignSelf: "center",
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  backBtn: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
    tintColor: '#334155',
    transform: [{ rotate: "-180deg" }],
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: "#334155",
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    lineHeight: 22,
  },
  input: {
    fontWeight: '400',
    width: "100%",
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: "#C5C5FF",
    color: colors(false).text,
    fontSize: 16,
    marginTop: 10,
    height: 100,
    textAlignVertical: 'top',
  },
  normalFont: {
    fontWeight: '400',
  },
  postPictureBtn: {
    backgroundColor: "#3333CC",
    padding: 15,
    borderRadius: 10,
    marginTop: 25,
    margin: 16,
  },
  textPostPictureBtn: {
    color: colors(false).white,
    fontWeight: "700",
    fontSize: 18,
    alignSelf: "center",
  },
  errorText: {
    fontFamily: "OpenSans",
    alignSelf: "flex-start",
    color: 'red',
    fontSize: 13,
    paddingTop: 2,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#ffffffdd',
    alignItems: "center",
    justifyContent: "center",
  },
  successToastContainer: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 0,
    zIndex: 1000,
    alignItems: 'center',
  },
  successToastView: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  successToastText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});
// Customizable Area End

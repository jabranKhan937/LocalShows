import React from "react";
// Customizable Area Start
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Modal,
} from "react-native";
import { colors } from "../../utilities/src/Colors";
import FastImage from "../../../components/src/SafeFastImage"
import Svg, { Path } from "react-native-svg";
// Customizable Area End

import PhotoLibraryDetailController, {
  Props,
  configJSON
} from "./PhotoLibraryDetailController";

export default class PhotoLibraryDetail extends PhotoLibraryDetailController {
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
          onPress={this.navigateBack}>
          <Image source={require("../../../mobile/assets/images/next.png")} style={[styles.backBtn, {
            tintColor: '#334155',
            transform: [{ rotate: "-180deg" }],
          }]} />
        </TouchableOpacity>
        <Text style={styles.pageTitle}>{configJSON.pictureInformation}</Text>
        <View />
      </View>
    )
  }

  renderPicture = () => {
    return (
      <View style={{
        backgroundColor: '#EDEDFF',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: 270,
        borderRadius: 10,
        marginVertical: 10,
      }}>
        <FastImage
          source={{
            uri: this.state.pictures.uri,
            priority: FastImage.priority.high
          }}
          resizeMode={FastImage.resizeMode.contain}
          style={{
            width: '100%',
            height: 270,
            marginVertical: 10,
          }} />
      </View>
    )
  }

  renderLikeCount = () => {
    const image = this.state.pictureDetail.like_by_me ? require('../../../mobile/assets/images/favourite_filled.png') : require('../../../mobile/assets/images/image_favorite.png')
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
        <TouchableOpacity testID="likePictureBtn" onPress={this.checkAuthentication}>
          <Image source={image} style={[styles.backBtn, { tintColor: "#4949EE", marginRight: 5, }]} />
        </TouchableOpacity>
         
        <TouchableOpacity testID="likeTextBtn" onPress={() => this.handleLikeTextPress()}>
        <Text style={[styles.text, { fontWeight: '700' }]}>{`${this.state.pictureDetail.likes_count} people`}
          <Text style={styles.text}> like this</Text>
        </Text>
        </TouchableOpacity>
      </View>
    )
  }

  renderSignupLoginPopup = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.loginSignupPopup}>
        <View style={[styles.centeredView, { backgroundColor: '#33415580' }]}>
          <View style={[styles.modalView]}>
            {this.renderCloseModal()}
            <Text style={styles.welcomeToPopupText}>{"Welcome to"}</Text>
            <Text style={styles.localShowsPopupText}>{"Local Shows"}</Text>
            <Text style={styles.loginFirstPopupText}>{"You have to Log in first to access the events."}</Text>
            <TouchableOpacity
              testID="createAccountBtn"
              onPress={() => { this.moveToLoginSignupScreen("signup") }} >
              <Text style={styles.createAccountPopupText}>{"Create new account"}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              testID="loginBtn"
              style={styles.loginBtnPopupText}
              onPress={() => { this.moveToLoginSignupScreen("login") }} >
              <Text style={styles.loginTxtPopupText}>{"Log in"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    )
  }

  renderCloseModal = () => {
    return (
      <TouchableWithoutFeedback
        testID="popupCloseButton"
        onPress={this.handleCloseModal}>
        <Svg
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            width: 20,
            height: 20,
          }}
          width={14}
          height={14}
          viewBox="0 0 14 14"
          fill="#0F172A"
        >
          <Path
            d="M13.3.71a.996.996 0 00-1.41 0L7 5.59 2.11.7A.996.996 0 10.7 2.11L5.59 7 .7 11.89a.996.996 0 101.41 1.41L7 8.41l4.89 4.89a.996.996 0 101.41-1.41L8.41 7l4.89-4.89c.38-.38.38-1.02 0-1.4z"
            fill="#0F172A"
          />
        </Svg>
      </TouchableWithoutFeedback>
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
          onPress={this.hideKeyboardOnScreen}>
          <View style={{ flex: 1, padding: 20 }}>
            {this.renderHeader()}
            {this.renderPicture()}
            {this.renderLikeCount()}
            <Text style={[styles.label, { marginTop: 30, }]}>{configJSON.description}</Text>
            <Text style={[styles.text, { marginTop: 15, }]}>{this.state.description}</Text>
          </View>
        </TouchableWithoutFeedback>
        {this.renderSignupLoginPopup()}
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
  threeDots: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    tintColor: '#334155',
  },
  text: {
    fontSize: 16,
    color: '#334155',
    fontWeight: '400',
  },
  modalParentView: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "#33415580",
  },
  menuContainer: {
    position: 'absolute',
    right: 20,
    top: 60,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    paddingLeft: 30,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.9,
    shadowRadius: 3,
    elevation: 3,
  },
  menuButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  menuButtonText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#0F172A',
    textAlignVertical: 'center',
  },
  modalContainerView: {
    justifyContent: "space-between",
    backgroundColor: "white",
    borderTopEndRadius: 20,
    padding: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 100,
  },
  disablePopupIconContainer: {
    position: "absolute",
    right: 20,
    top: 20,
  },
  txtCancelShowHeading: {
    fontWeight: "700",
    fontSize: 26,
    lineHeight: 28,
    marginBottom: 10,
    marginTop: 25,
    color: "#0F172A",
  },
  txtDelete: {
    fontSize: 18,
  },
  cancelShowButtonContainer: {
    backgroundColor: "#3333CC",
    width: "100%",
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
  },
  textCancelButton: {
    color: colors(false).white,
    fontWeight: "700",
    fontSize: 18,
    alignSelf: "center",
  },
  keepButtonContainer: {
    backgroundColor: "transparent",
  },
  textKeepButton: {
    color: "#3333CC",
  },
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalView: {
    height: '40%',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderTopEndRadius: 20,
    padding: 35,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  welcomeToPopupText: {
    textAlign: 'center',
    fontSize: 20,
    lineHeight: 28,
    marginTop: 10,
    color: "#334166",
  },
  localShowsPopupText: {
    fontWeight: '700',
    fontSize: 28,
    lineHeight: 32,
    bottom: '5%',
    textAlign: 'center',
    color: '#3333CC',
  },
  loginFirstPopupText: {
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: '5%',
    fontWeight: '400',
    fontSize: 16,
    color: '#334166',
  },
  createAccountPopupText: {
    color: '#3333CC',
    fontWeight: '700',
    lineHeight: 24,
    marginBottom: '4%',
    fontSize: 16,
    textAlign: 'center',
  },
  loginBtnPopupText: {
    backgroundColor: '#3333CC',
    borderRadius: 8,
    height: 56,
    justifyContent: 'center',
  },
  loginTxtPopupText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});
// Customizable Area End

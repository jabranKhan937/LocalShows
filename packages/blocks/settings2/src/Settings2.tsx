import React from "react";

// Customizable Area Start
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image,
  TouchableWithoutFeedback,
  SafeAreaView,
  Modal,
  ActivityIndicator,
} from "react-native";

// Merge Engine - import assets - Start
// Merge Engine - import assets - End

// Merge Engine - Artboard Dimension  - Start
// Merge Engine - Artboard Dimension  - End

import { colors } from "../../utilities/src/Colors";
import { leftArrow } from "../../email-account-registration/src/assets";
import Icon from "react-native-vector-icons/Feather";
// Customizable Area End

import Settings2Controller, {
  Props,
  configJSON,
} from "./Settings2Controller";

export default class Settings2 extends Settings2Controller {
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
          testID="navigationBackButton"
          style={styles.backNavButton}
          onPress={() => {
            this.props.navigation.goBack();
          }} >
          <Image source={leftArrow} style={styles.backNavIcon} />
        </TouchableOpacity>
        <Text testID="pageTitle" style={styles.headerTitle}>
          {configJSON.pageTitle}
        </Text>
        <View style={styles.backNavButton} />
      </View>
    )
  }

  renderPrivateAccount = () => {
    return (
      <>
        {this.state.currentUserRole === 'fan' &&
          <>
            <View style={styles.divider} />
            <View
              style={styles.rowView}>
              <Text style={styles.text}>{configJSON.privateAccount}</Text>
              <TouchableWithoutFeedback
                testID="privateAccount"
                onPress={() => {
                  this.putPrivateAccountAPI()
                }}>
                <View style={[styles.switchContainer, { backgroundColor: this.state.isPrivateAccount ? '#4949EE' : '#94A3B8' }]}>
                  <View style={[styles.switchButton, { alignSelf: this.state.isPrivateAccount ? 'flex-end' : 'flex-start' }]} />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </>
        }</>
    )
  }

  renderPushNotification = () => {
    return (
      <View style={styles.rowView}>
        <Text style={styles.text}>{configJSON.pushNotifications}</Text>
        <TouchableWithoutFeedback
          testID="pushNotifications"
          onPress={() => {
            this.setState({ isPushNotificationEnabled: !this.state.isPushNotificationEnabled }, () => {
              this.handlePushNotification()
            })
          }}>
          <View style={[styles.switchContainer, { backgroundColor: this.state.isPushNotificationEnabled ? '#4949EE' : '#94A3B8' }]}>
            <View style={[styles.switchButton, { alignSelf: this.state.isPushNotificationEnabled ? 'flex-end' : 'flex-start' }]} />
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  renderDeleteAccountModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.isDeleteAccountConfirmationModal}>
        <View style={styles.modalParentView}>
          <View style={styles.modalContainerView}>
            <TouchableOpacity
              testID="crossBtn"
              style={styles.disablePopupIconContainer}
              onPress={() => this.setState({ isDeleteAccountConfirmationModal: false })} >
              <Icon name="x" color="#0F172A" size={25} />
            </TouchableOpacity>
            <Text style={styles.txtDeleteHeading}>{configJSON.accountDeletionPopupHeading}</Text>
            <Text style={styles.txtDelete}>{configJSON.accountDeletionPopupMessage}</Text>
            <TouchableOpacity
              testID="noBtn"
              style={[
                styles.deleteBtnContainer,
                styles.keepBtnContainer,
              ]}
              onPress={() => this.setState({ isDeleteAccountConfirmationModal: false })} >
              <Text
                style={[
                  styles.txtDeleteBtn,
                  styles.txtKeepBtn,
                ]} >{configJSON.noButton}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              testID="yesBtn"
              style={styles.deleteBtnContainer}
              onPress={() => this.deleteAccountAPI()} >
              <Text style={styles.txtDeleteBtn}>{configJSON.yesButton}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    )
  }
  // Customizable Area End

  render() {
    // Customizable Area Start
    // Merge Engine - render - Start
    return (
      <TouchableWithoutFeedback
        testID="containerTouchable"
        onPress={() => {
          this.hideKeyboard();
        }} >
        <SafeAreaView style={styles.container}>
          {this.renderHeader()}
          {this.state.isLoading ?
          <View style={styles.loadingContainer}>
            <ActivityIndicator size={'large'} color="black" />
          </View>
          :
          <>
          <View style={styles.bodyContainer}>
          <TouchableOpacity
            testID="personalInformation"
            style={styles.rowView}
            onPress={() => this.handleProfileNavigation()}>
            <Text style={styles.text}>{configJSON.personalInformation}</Text>
            <Image source={leftArrow} style={[styles.backNavIcon, styles.forwardArrow]} />
          </TouchableOpacity>
          {this.renderPrivateAccount()}
          <View style={styles.divider} />
          {this.renderPushNotification()}
          <View style={styles.divider} />
          <Text style={[styles.text, { fontWeight: '700', marginVertical: 20, marginTop: 25, }]}>{configJSON.security}</Text>
          <View style={styles.divider} />
          <TouchableOpacity
            testID="changePassword"
            style={styles.rowView}
            onPress={this.handleChangePasswordNavigation}>
            <Text style={styles.text}>{configJSON.changePassword}</Text>
            <Image source={leftArrow} style={[styles.backNavIcon, styles.forwardArrow]} />
          </TouchableOpacity>
          <View style={styles.divider} />
        </View>
        <TouchableOpacity
          testID="deleteMyAccount"
          style={{ position: 'absolute', bottom: 0, padding: 30, }}
          onPress={() => { this.setState({ isDeleteAccountConfirmationModal: true }) }} >
          <Text style={{ color: '#F87171', fontSize: 14, fontWeight: '400' }}>Delete my account</Text>
        </TouchableOpacity>
        {this.renderDeleteAccountModal()}
          </>
          }
        </SafeAreaView>
      </TouchableWithoutFeedback>
    );
    // Merge Engine - render - End
    // Customizable Area End
  }
}

// Customizable Area Start
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginLeft: "auto",
    marginRight: "auto",
    width: Platform.OS === "web" ? "75%" : "100%",
    maxWidth: 650,
    backgroundColor: "#ffffffff",
    paddingHorizontal:16,
    paddingBottom:16,
    paddingTop:5
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  backNavButton: {
    alignSelf: "center",
    width: 20,

  },
  backNavIcon: {
    width: 12,
    left: 0,
    resizeMode: "contain",
  },
  headerTitle: {
    fontWeight: "700",
    fontSize: 24,
    color: colors(false).text,
   
  },
  hamburgerIcon: {
    width: 25,
    height: 16,
    resizeMode: "contain",
    marginRight: 5,
  },
  bodyContainer: {
    marginHorizontal: 10,
  },
  rowView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 15,
  },
  text: {
    fontWeight: "400",
    fontSize: 16,
    color: colors(false).text,
    lineHeight: 22,
  },
  forwardArrow: {
    width: 7,
    marginRight: 10,
    tintColor: '#4949EE',
    transform: [{ rotate: '180deg' }],
  },
  divider: {
    backgroundColor: '#E2E8F0',
    height: 1,
  },
  switchContainer: {
    width: 45,
    height: 25,
    borderRadius: 25,
  },
  switchButton: {
    width: 23,
    height: 23,
    borderRadius: 23,
    backgroundColor: 'white',
    marginTop: 1,
    marginHorizontal: 1,
  },
  modalParentView: {
    flex: 1,
    backgroundColor: "#33415580",
    justifyContent: "flex-end",
  },
  modalContainerView: {
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 100,
    justifyContent: "space-between",
    backgroundColor: "white",
    borderTopEndRadius: 20,
    padding: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  txtDeleteHeading: {
    marginBottom: 10,
    marginTop: 25,
    color: "#0F172A",
    fontWeight: "700",
    fontSize: 26,
    lineHeight: 28,
  },
  txtDelete: {
    fontSize: 18,
  },
  deleteBtnContainer: {
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
    backgroundColor: "#3333CC",
    width: "100%",
  },
  txtDeleteBtn: {
    color: colors(false).white,
    fontWeight: "700",
    fontSize: 18,
    alignSelf: "center",
  },
  keepBtnContainer: {
    backgroundColor: "transparent",
  },
  txtKeepBtn: {
    color: "#3333CC",
  },
  disablePopupIconContainer: {
    position: "absolute",
    right: 20,
    top: 20,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#ffffffdd',
    alignItems: "center",
    justifyContent: "center",
  },
});
// Customizable Area End

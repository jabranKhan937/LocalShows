import React from "react";

// Customizable Area Start
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StatusBar,
  Modal,
  SafeAreaView,
} from "react-native";

import { colors } from "../../utilities/src/Colors";
import { leftArrow } from "./assets";
// Customizable Area End

import DisputeFormController, {
  Props,
  configJSON,
} from "./DisputeFormController";
import { deviceHeight } from "../../../framework/src/Utilities";

export default class DisputeForm extends DisputeFormController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }

  // Customizable Area Start
  renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <TouchableOpacity
          testID="backButton"
          style={styles.backBtnContainer}
          onPress={() => {
            this.handleBackLoginNavigation();
          }}
        >
          <Image source={leftArrow} style={styles.backArrowImg} />
        </TouchableOpacity>
        <Text style={[styles.textTitle, styles.headerTitle]}>
          {configJSON.disputeForm}
        </Text>
      </View>
    );
  };

  renderName = () => {
    return (
      <>
        <Text style={[styles.textTitle, styles.inputLabel]}>
          {this.state.accountType === "Band" ||
          this.state.accountType === "Artist"
            ? "Band / artist's name"
            : configJSON.locationsName}
        </Text>
        <View style={[styles.inputText, styles.bandInput]}>
          <Text style={styles.bandInputText}>{this.state.bandArtistName}</Text>
        </View>
      </>
    );
  };

  renderAddress = () => {
    return (
      <>
        {this.state.userRole === "venue" && (
          <>
            <Text style={[styles.textTitle, styles.inputLabel]}>
              {configJSON.address}
            </Text>
            <View style={[styles.inputText, styles.bandInput]}>
              <Text style={styles.bandInputText}>{this.state.address}</Text>
            </View>
          </>
        )}
      </>
    );
  };

  renderCountry = () => {
    return (
      <>
        <Text style={[styles.textTitle, styles.inputLabel]}>
          {configJSON.country}
        </Text>
        <View style={[styles.inputText, styles.bandInput]}>
          <Text style={styles.bandInputText}>{this.state.selectedCountry}</Text>
        </View>
      </>
    );
  };

  renderState = () => {
    return (
      <>
        <Text style={[styles.textTitle, styles.inputLabel]}>
          {configJSON.state}
        </Text>
        <View style={[styles.inputText, styles.bandInput]}>
          <Text style={styles.bandInputText}>{this.state.selectedState}</Text>
        </View>
      </>
    );
  };

  renderCity = () => {
    return (
      <>
        <Text style={[styles.textTitle, styles.inputLabel]}>
          {configJSON.city}
        </Text>
        <View style={[styles.inputText, styles.bandInput]}>
          <Text style={styles.bandInputText}>{this.state.selectedCity}</Text>
        </View>
      </>
    );
  };

  renderZipCode = () => {
    return (
      <>
        {this.state.userRole === "venue" && (
          <>
            <Text style={[styles.textTitle, styles.inputLabel]}>
              {configJSON.zip}
            </Text>
            <View style={[styles.inputText, styles.bandInput]}>
              <Text style={styles.bandInputText}>{this.state.zip}</Text>
            </View>
          </>
        )}
      </>
    );
  };

  renderVerificationModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.accountVerificationPopup}
      >
        <TouchableOpacity
          testID="modalClose"
          onPress={() => this.setState({ accountVerificationPopup: false })}
          style={styles.overlaySty}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>
              <Text style={styles.outsideUSText}>
                {configJSON.accountVerification}
              </Text>
              <Text style={[styles.textTitle, styles.onlySupportUSTxt]}>
                {configJSON.followUpAccountVerification}
              </Text>
              <TouchableOpacity
                testID="btnAcceptVerification"
                style={styles.acceptTextBtn}
                onPress={this.handleVerification}
              >
                <Text style={[styles.textTitle, styles.acceptText]}>
                  {configJSON.accept}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };
  // Customizable Area End

  render() {
    return (
      <ScrollView
        keyboardShouldPersistTaps="always"
        style={styles.containerView}
      >
        {/* Customizable Area Start */}
        <TouchableWithoutFeedback
          testID={"disputeFormBackground"}
          onPress={() => {
            this.hideKeyboard();
          }}
        >
          <SafeAreaView>
            <View style={styles.contentContainerView}>
              <StatusBar backgroundColor="white" barStyle="dark-content" />

              {this.renderHeader()}

              <ScrollView
                style={{
                  height: deviceHeight - 0.2 * deviceHeight,
                  marginBottom: this.state.userRole === "venue" ? 50 : 1,
                }}
              >
                <View>
                  {this.renderName()}
                  {this.renderAddress()}
                  {this.renderCountry()}
                  {this.renderState()}
                  {this.renderCity()}
                  {this.renderZipCode()}
                </View>
              </ScrollView>
              <View style={{ position: "absolute", bottom: 0, width: "100%" }}>
                <TouchableOpacity
                  testID="btnDisputeForm"
                  style={styles.disputeButton}
                  onPress={() => {
                    this.handleDisputeFormAPI();
                  }}
                >
                  <Text style={[styles.textTitle, styles.claimPageText]}>
                    {configJSON.disputeForm}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {this.renderVerificationModal()}
          </SafeAreaView>
        </TouchableWithoutFeedback>
        {/* Customizable Area End */}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  // Customizable Area Start
  containerView: {
    flex: 1,
    padding: 16,
    width: "100%",
    maxWidth: 650,
    backgroundColor: "#fff",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  backBtnContainer: {
    position: "absolute",
    left: -10,
    alignSelf: "center",
    padding: 10,
  },
  backArrowImg: {
    width: 12,
    left: 0,
    resizeMode: "contain",
  },
  headerTitle: {
    fontWeight: "bold",
    fontSize: 24,
    marginHorizontal: 30,
    textAlign: "center",
  },
  contentContainerView: {
    flex: 1,
    marginBottom: 30,
    marginHorizontal: 10,
  },
  textTitle: {
    fontFamily: "OpenSans",
    alignSelf: "flex-start",
    color: colors(false).text,
  },
  contentTxt: {
    fontWeight: "400",
    fontSize: 14,
    lineHeight: 22,
  },
  inputLabel: {
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  inputText: {
    width: "100%",
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: "#C5C5FF",
    color: colors(false).text,
    height: 50,
    fontSize: 16,
  },
  downArrowImg: {
    position: "absolute",
    right: 15,
    marginRight: 5,
    width: 8,
    backgroundColor: "white",
    transform: [{ rotate: "-90deg" }],
    resizeMode: "contain",
  },
  modalContainerView: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "#33415580",
  },
  modal: {
    height: "35%",
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
  disputeButton: {
    backgroundColor: "#3333CC",
    padding: 15,
    borderRadius: 10,
    marginTop: 35,
    width: "100%",
  },
  claimPageText: {
    color: colors(false).white,
    fontWeight: "700",
    fontSize: 18,
    alignSelf: "center",
  },
  usText: {
    fontWeight: "700",
    fontSize: 26,
    lineHeight: 28,
    marginVertical: 10,
    color: "#0F172A",
  },
  supportUSTxt: {
    fontSize: 18,
  },
  acceptTextBtn: {
    backgroundColor: "#3333CC",
    width: "100%",
    padding: 15,
    borderRadius: 10,
    marginTop: 25,
  },
  acceptText: {
    color: colors(false).white,
    fontWeight: "700",
    fontSize: 18,
    alignSelf: "center",
  },
  errorTxt: {
    color: "red",
    fontSize: 13,
    paddingTop: 2,
  },
  bandInput: {
    justifyContent: "center",
    backgroundColor: "#FFF",
  },
  bandInputText: {
    color: colors(false).text,
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "#33415580",
  },
  modalView: {
    height: "35%",
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
  outsideUSText: {
    fontWeight: "700",
    fontSize: 26,
    lineHeight: 28,
    marginVertical: 10,
    color: "#0F172A",
  },
  onlySupportUSTxt: {
    fontSize: 18,
  },
  overlaySty: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  // Customizable Area End
});

import React from "react";

// Customizable Area Start
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableWithoutFeedback,
  Dimensions,
  ImageBackground,
  Image,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { colors } from "../../utilities/src/Colors";
import { leftArrow } from "../../email-account-registration/src/assets";
import { loginBg } from "../../email-account-login/src/assets";
// Customizable Area End

import OTPInputAuthController, {
  Props
} from "../../otp-input-confirmation/src/OTPInputAuthController";

export default class ForgotPasswordOTP extends OTPInputAuthController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }

  render() {
    return (
      <ScrollView keyboardShouldPersistTaps="always" style={styles.container}>
        <TouchableWithoutFeedback
          onPress={() => {
            this.hideKeyboard();
          }}
        >
          {/* Customizable Area Start */}
          <ImageBackground source={loginBg} style={styles.imageBg}>
            <View style={styles.headerContainer}>
              <TouchableOpacity
                testID="navigationBackButton"
                style={styles.backArrowContainer}
                onPress={() => {
                  this.props.navigation.goBack();
                }}
              >
                <Image source={leftArrow} style={styles.backArrow} />
              </TouchableOpacity>
              <Text style={[styles.text, styles.headerTitle]}>
                Verification code
              </Text>
            </View>
            <View style={styles.contentContainer}>
              <StatusBar barStyle="dark-content" backgroundColor="white" />
              <Text testID="testLabel" style={[styles.text, styles.HeadingTxt]}>
                Local Shows
              </Text>
              <Text style={[styles.text, styles.textSubHeading]}>
                Verify email address
              </Text>
              <Text style={styles.text}>
                Verification code sent to{" "}
                <Text style={styles.textMail}>{this.state.email}</Text>
              </Text>
              <Text style={styles.text}>
                Please note this OTP could be in your spam folder
              </Text>
              <View style={styles.otpInputView}>
                {this.state.otp.map((digit, itemIdx) => (
                  <TextInput
                    testID={`txtInput-${itemIdx}`}
                    key={itemIdx}
                    style={styles.textInput}
                    value={digit}
                    onChangeText={(value) =>
                      this.handleOTPChange(value, itemIdx)
                    }
                    keyboardType="numeric"
                    maxLength={1}
                    onKeyPress={(e) => this.handleKeyPress(e, itemIdx)}
                    ref={(ref) => (this.otpInputRefs[itemIdx] = ref)}
                    onFocus={() => this.setState({ currentIndex: itemIdx })}
                  />
                ))}
              </View>
              <TouchableOpacity
                testID="btnConfirm"
                style={[
                  styles.confirmButton,
                  {
                    opacity:
                      this.state.otp[0] &&
                      this.state.otp[1] &&
                      this.state.otp[2] &&
                      this.state.otp[3]
                        ? 1
                        : 0.5,
                  },
                ]}
                onPress={() => this.submitOtp()}
                disabled={
                  !(
                    this.state.otp[0] &&
                    this.state.otp[1] &&
                    this.state.otp[2] &&
                    this.state.otp[3]
                  )
                }
              >
                <Text style={[styles.text, styles.ConfirmButtonTxt]}>
                  Confirm code
                </Text>
              </TouchableOpacity>
              <View style={styles.resendView}>
                <Text style={styles.text}>{`${Math.floor(this.state.timer / 60)
                  .toString()
                  .padStart(2, "0")}:${(this.state.timer % 60)
                  .toString()
                  .padStart(2, "0")}`}</Text>
                <TouchableOpacity
                  testID="btnResendCode"
                  style={{
                    opacity: this.state.timer === 0 ? 1 : 0.35,
                  }}
                  disabled={this.state.timer !== 0}
                  onPress={() => this.setState({ timer: 180 })}
                >
                  <Text style={[styles.text, styles.textResendButton]}>
                    Resend Confirmation Code
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            {this.state.isFetching && (
              <View style={styles.activityLoader}>
                <ActivityIndicator size={"large"} color="#4949EE" />
              </View>
            )}
          </ImageBackground>
          {/* Customizable Area End */}
        </TouchableWithoutFeedback>
      </ScrollView>
    );
  }
}

// Customizable Area Start
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors(false).background,
  },
  activityLoader: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#ffffffdd",
    alignItems: "center",
    justifyContent: "center",
  },
  imageBg: {
    flex: 1,
    width: "100%",
    height: Dimensions.get("window").height,
    justifyContent: "center",
  },
  contentContainer: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: "5%",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
    marginHorizontal: "5%",
  },
  backArrowContainer: {
    position: "absolute",
    left: -10,
    alignSelf: "center",
    padding: 10,
  },
  backArrow: {
    width: 12,
    left: 0,
    resizeMode: "contain",
  },
  headerTitle: {
    fontWeight: "bold",
    fontSize: 30,
  },
  text: {
    fontFamily: "OpenSans",
    alignSelf: "flex-start",
    color: colors(false).text,
  },
  HeadingTxt: {
    color: "#4949EE",
    fontSize: 45,
    fontWeight: "bold",
    alignSelf: "center",
    marginBottom: 25,
  },
  textSubHeading: {
    fontWeight: "bold",
    fontSize: 25,
    marginTop: 30,
    marginBottom: 10,
  },
  textMail: {
    color: "#4949EE",
  },
  otpInputView: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "90%",
    marginVertical: 40,
  },
  textInput: {
    borderWidth: 1,
    color: "#334155",
    borderColor: "#4949EE",
    width: "16%",
    aspectRatio: 1,
    borderRadius: 5,
    fontSize: 18,
    textAlign: "center",
  },
  confirmButton: {
    backgroundColor: "#3333CC",
    width: "100%",
    padding: 15,
    borderRadius: 10,
  },
  ConfirmButtonTxt: {
    color: colors(false).white,
    fontWeight: "700",
    fontSize: 18,
    alignSelf: "center",
  },
  resendView: {
    flexDirection: "row",
    marginTop: 20,
  },
  textResendButton: {
    marginLeft: 10,
    color: "#4949EE",
  },
});
// Customizable Area End

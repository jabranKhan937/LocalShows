import React from "react";

// Customizable Area Start
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableWithoutFeedback,
  Image,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  SafeAreaView,
} from "react-native";
import { redesignTheme } from "../../utilities/src/Colors";
import { leftArrow } from "../../email-account-registration/src/assets";
// Customizable Area End

import OTPInputAuthController, {
  Props
} from "../../otp-input-confirmation/src/OTPInputAuthController";

type OtpTheme = typeof redesignTheme;

export default class ForgotPasswordOTP extends OTPInputAuthController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }

  get styles() {
    return createForgotOtpStyles(this.getOtpTheme());
  }

  render() {
    const theme = this.getOtpTheme();
    const styles = this.styles;
    const otpComplete = !!(
      this.state.otp[0] &&
      this.state.otp[1] &&
      this.state.otp[2] &&
      this.state.otp[3]
    );
    return (
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: theme.background }}
        behavior={this.isPlatformiOS() ? "padding" : undefined}
      >
      <ScrollView keyboardShouldPersistTaps="always" style={styles.container}>
        <TouchableWithoutFeedback
          onPress={() => {
            this.hideKeyboard();
          }}
        >
          {/* Customizable Area Start */}
          <SafeAreaView>
          <View style={styles.imageBg}>
            <View pointerEvents="none" style={styles.decorTop} />
            <View pointerEvents="none" style={styles.decorBottom} />
            <View style={styles.headerContainer}>
              <TouchableOpacity
                testID="navigationBackButton"
                style={styles.backArrowContainer}
                onPress={() => {
                  this.props.navigation.goBack();
                }}
              >
                <Image source={leftArrow} style={[styles.backArrow, { tintColor: theme.foreground }]} />
              </TouchableOpacity>
              <Text style={[styles.text, styles.headerTitle]}>
                Verification code
              </Text>
            </View>
            <View style={styles.contentContainer}>
              <StatusBar
                barStyle={this.state.isDarkMode ? "light-content" : "dark-content"}
                backgroundColor={theme.background}
              />
              <Text testID="testLabel" style={[styles.text, styles.HeadingTxt]}>
                Local Shows
              </Text>
              <Text style={[styles.text, styles.textSubHeading]}>
                Verify email address
              </Text>
              <Text style={[styles.text, styles.hintText]}>
                Verification code sent to{" "}
                <Text style={styles.textMail}>{this.state.email}</Text>
              </Text>
              <Text style={[styles.text, styles.hintText]}>
                Please note this OTP could be in your spam folder
              </Text>
              <View style={styles.otpInputView}>
                {this.state.otp.map((digit, itemIdx) => {
                  const isFocused = this.state.currentIndex === itemIdx;
                  const isFilled = !!digit;
                  return (
                  <TextInput
                    testID={`txtInput-${itemIdx}`}
                    key={itemIdx}
                    style={[
                      styles.textInput,
                      isFilled && styles.textInputFilled,
                      isFocused && styles.textInputFocused,
                    ]}
                    value={digit}
                    onChangeText={(value) =>
                      this.handleOTPChange(value, itemIdx)
                    }
                    keyboardType="numeric"
                    maxLength={1}
                    onKeyPress={(e) => this.handleKeyPress(e, itemIdx)}
                    ref={(ref) => (this.otpInputRefs[itemIdx] = ref)}
                    onFocus={() => this.setState({ currentIndex: itemIdx })}
                    placeholder="•"
                    placeholderTextColor={theme.muted}
                    selectionColor={theme.primary}
                  />
                  );
                })}
              </View>
              <TouchableOpacity
                testID="btnConfirm"
                style={[
                  styles.confirmButton,
                  {
                    opacity: otpComplete ? 1 : 0.5,
                  },
                ]}
                onPress={() => this.submitOtp()}
                disabled={!otpComplete}
              >
                <Text style={[styles.text, styles.ConfirmButtonTxt]}>
                  Confirm code
                </Text>
              </TouchableOpacity>
              <View style={styles.resendView}>
                <Text style={[styles.text, styles.timerText]}>{`${Math.floor(this.state.timer / 60)
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
                <ActivityIndicator size={"large"} color={theme.primary} />
              </View>
            )}
          </View>
          </SafeAreaView>
          {/* Customizable Area End */}
        </TouchableWithoutFeedback>
      </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

// Customizable Area Start
const createForgotOtpStyles = (theme: OtpTheme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  activityLoader: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(8, 8, 15, 0.72)",
    alignItems: "center",
    justifyContent: "center",
  },
  imageBg: {
    flex: 1,
    width: "100%",
    minHeight: 640,
    justifyContent: "center",
    backgroundColor: theme.background,
  },
  decorTop: {
    position: "absolute",
    top: -90,
    right: -70,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: theme.primarySoft,
  },
  decorBottom: {
    position: "absolute",
    bottom: -110,
    left: -80,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: theme.primarySoft,
  },
  contentContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: "5%",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
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
    fontSize: 28,
    color: theme.primary,
  },
  text: {
    fontFamily: "OpenSans",
    alignSelf: "flex-start",
    color: theme.foreground,
  },
  HeadingTxt: {
    color: theme.primary,
    fontSize: 42,
    fontWeight: "bold",
    alignSelf: "center",
    marginBottom: 12,
  },
  textSubHeading: {
    fontWeight: "bold",
    fontSize: 24,
    marginTop: 20,
    marginBottom: 10,
    color: theme.foreground,
    alignSelf: "center",
  },
  hintText: {
    color: theme.muted,
    fontSize: 14,
    lineHeight: 20,
    alignSelf: "center",
    textAlign: "center",
  },
  textMail: {
    color: theme.primary,
    fontWeight: "700",
  },
  otpInputView: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "90%",
    marginVertical: 36,
  },
  textInput: {
    borderWidth: 1.5,
    color: theme.foreground,
    borderColor: theme.border,
    backgroundColor: theme.input,
    width: "18%",
    aspectRatio: 1,
    borderRadius: 14,
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
  },
  textInputFilled: {
    borderColor: theme.primary,
  },
  textInputFocused: {
    borderColor: theme.primary,
    backgroundColor: theme.primarySoft,
  },
  confirmButton: {
    backgroundColor: theme.primary,
    width: "100%",
    padding: 15,
    borderRadius: 12,
  },
  ConfirmButtonTxt: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 18,
    alignSelf: "center",
  },
  resendView: {
    flexDirection: "row",
    marginTop: 20,
    alignItems: "center",
  },
  timerText: {
    color: theme.muted,
    fontWeight: "700",
  },
  textResendButton: {
    marginLeft: 10,
    color: theme.primary,
    fontWeight: "700",
  },
});
// Customizable Area End

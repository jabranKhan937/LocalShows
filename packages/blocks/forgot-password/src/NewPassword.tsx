import React from "react";

// Customizable Area Start
import {
  View,
  StyleSheet,
  Platform,
  ScrollView,
  Text,
  TextInput,
  Image,
  KeyboardAvoidingView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ImageBackground,
  Dimensions
} from "react-native";
import { leftArrow } from "../../email-account-registration/src/assets";
import { colors } from "../../utilities/src/Colors";
import { loginBg } from "../../email-account-login/src/assets";
// Customizable Area End

import ForgotPasswordController, { Props } from "./ForgotPasswordController";

export default class NewPassword extends ForgotPasswordController {
  // Customizable Area Start
  // Customizable Area End

  constructor(props: Props) {
    super(props);
    this.isChangePassword = true;
    // Customizable Area Start
    // Customizable Area End
  }

  render() {
    return (
      <KeyboardAvoidingView
        behavior={this.isPlatformiOS() ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          keyboardShouldPersistTaps="always"
          style={
            Platform.OS === "web" ? styles.containerWeb : styles.containerMobile
          }
        >
          {/* ------------------- HEADER ---------------------- */}
          {/* Customizable Area Start */}
          <SafeAreaView style={styles.container}>
            <View style={{ width: "100%" }}>
              <TouchableOpacity
                testID="navigationBackButton"
                style={{
                  position: "absolute",
                  marginLeft: 20,
                  paddingTop: 10
                }}
                onPress={() => {
                  this.props.navigation.goBack();
                }}
              >
                <Image
                  source={leftArrow}
                  style={{
                    width: 12,
                    resizeMode: "contain"
                  }}
                />
              </TouchableOpacity>
              <Text testID="testLabel" style={styles.headerTitle}>
                New Password
              </Text>
            </View>
            <StatusBar barStyle="dark-content" backgroundColor="white" />
            <ImageBackground source={loginBg} style={styles.imageBg}>
              <View style={styles.contentContainer}>
                <Text style={[styles.text, styles.textSubHeading]}>
                  New Password
                </Text>
                <Text style={[styles.text, styles.textInfo]}>
                  Please write your new password.
                </Text>
                <Text style={[styles.text, styles.textInputLabel]}>
                  Password
                </Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    testID="txtInputPassword"
                    placeholder="Enter your password"
                    placeholderTextColor="#CBD5E1"
                    style={styles.passwordInput}
                    value={this.state.newPassword}
                    onChangeText={this.handlePassword}
                    secureTextEntry={!this.state.showPassword}
                    maxLength={16}
                  />
                  <TouchableOpacity
                    testID="passwordIcon"
                    style={styles.passwordIconContainer}
                    onPress={this.showPassword}
                  >
                    <Image
                      source={require("../../../mobile/assets/images/password_eye.png")}
                      style={[
                        styles.passwordIcon,
                        {
                          tintColor: this.state.showPassword
                            ? "#475569"
                            : "#3333CC"
                        }
                      ]}
                    />
                  </TouchableOpacity>
                </View>
                <Text style={[styles.text, styles.errorText]}>
                  {this.state.newPasswordError}
                </Text>
                <Text
                  testID="testLabel"
                  style={[styles.text, styles.textInputLabel]}
                >
                  Confirm Password
                </Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    testID="txtInputConfirmPassword"
                    placeholder="Enter your password again"
                    placeholderTextColor="#CBD5E1"
                    style={styles.passwordInput}
                    value={this.state.confirmNewPassword}
                    onChangeText={this.handleConfirmPassword}
                    secureTextEntry={!this.state.showConfirmPassword}
                    maxLength={16}
                  />
                  <TouchableOpacity
                    testID="confirmPasswordIcon"
                    style={styles.passwordIconContainer}
                    onPress={this.showConfirmPassword}
                  >
                    <Image
                      source={require("../../../mobile/assets/images/password_eye.png")}
                      style={[
                        styles.passwordIcon,
                        {
                          tintColor: this.state.showConfirmPassword
                            ? "#475569"
                            : "#3333CC"
                        }
                      ]}
                    />
                  </TouchableOpacity>
                </View>
                <Text style={[styles.text, styles.errorText]}>
                  {this.state.confirmNewPasswordError}
                </Text>
                <TouchableOpacity
                  testID="confirmPasswordSubmit"
                  style={styles.loginButton}
                  onPress={this.handleConfirmPasswordSubmission}
                >
                  <Text style={[styles.text, styles.textLoginButton]}>
                    Confirm password
                  </Text>
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </SafeAreaView>
          {/* Customizable Area End */}
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

// Customizable Area Start
const styles = StyleSheet.create({
  containerMobile: {
    flex: 1,
    backgroundColor: colors(false).background
  },
  containerWeb: {
    padding: 16,
    width: "50%",
    marginLeft: "auto",
    marginRight: "auto",
    maxWidth: 650
  },
  container: {
    flex: 1,
    backgroundColor: colors(false).background,
    justifyContent: "center",
    alignItems: "center"
  },
  headerContainer: {
    position: "absolute",
    top: 16,
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
    width: "100%",
    marginHorizontal: "5%"
  },
  backArrowContainer: {
    position: "absolute",
    left: 0,
    alignSelf: "center",
    padding: 10
  },
  backArrow: {
    width: 12,
    left: 0,
    resizeMode: "contain"
  },
  headerTitle: {
    fontWeight: "700",
    fontSize: 24,
    color: "#334155",
    textAlign: "center",
    textAlignVertical: "center",
    marginHorizontal: 50,
    alignSelf: "center",
    marginTop: 15
  },
  imageBg: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    height: Dimensions.get("window").height - 150,
    alignItems: "center"
  },
  contentContainer: {
    width: "100%",
    paddingHorizontal: "5%"
  },
  text: {
    fontFamily: "OpenSans",
    alignSelf: "flex-start",
    color: colors(false).text
  },
  errorText: {
    color: "red",
    fontSize: 13,
    paddingTop: 2
  },
  textSubHeading: {
    fontWeight: "bold",
    fontSize: 25,
    marginTop: 30
  },
  textInfo: {
    marginVertical: 15
  },
  textInputLabel: {
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 5
  },
  textInput: {
    width: "100%",
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: "#C5C5FF",
    color: colors(false).text,
    height: 50
  },
  forgotPass: {
    marginTop: 5,
    alignSelf: "flex-end"
  },
  forgotPassText: {
    color: "#4949EE"
  },
  loginButton: {
    backgroundColor: "#3333CC",
    width: "100%",
    padding: 15,
    borderRadius: 10,
    marginTop: 30
  },
  textLoginButton: {
    color: colors(false).white,
    fontWeight: "700",
    fontSize: 18,
    alignSelf: "center"
  },
  passwordContainer: {
    width: "100%",
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: "#C5C5FF",
    height: 50,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  passwordInput: {
    color: colors(false).text,
    fontSize: 16,
    width: '80%',
  },
  passwordIconContainer: {
    justifyContent: "center"
  },
  passwordIcon: {
    height: 20,
    width: 30,
    resizeMode: "contain"
  }
});
// Customizable Area End

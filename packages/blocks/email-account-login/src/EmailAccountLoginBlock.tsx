import React from "react";
// Customizable Area Start
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  StatusBar,
  Platform,
  Image,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from "react-native";

// Merge Engine - import assets - Start
// Merge Engine - import assets - End

// Merge Engine - Artboard Dimension  - Start
// Merge Engine - Artboard Dimension  - End
import { colors } from "../../utilities/src/Colors";
import { loginBg } from "./assets";
// Customizable Area End

import EmailAccountLoginController, {
  Props,
} from "./EmailAccountLoginController";

export default class EmailAccountLoginBlock extends EmailAccountLoginController {
  // Customizable Area Start
  // Customizable Area End

  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }

  render() {
    // Customizable Area Start
    // Merge Engine - render - Start
    return (
      // Required for all blocks
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={this.isPlatformiOS() ? "padding" : undefined}>
        <TouchableWithoutFeedback
          testID={"loginBackground"}
          onPress={() => {
            this.hideKeyboard();
          }}>
          <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="white" />
            <ImageBackground source={loginBg} style={styles.imageBg}>
              <View style={styles.contentContainer}>
                <Text style={[styles.text, styles.textHeading]}>Local Shows</Text>
                <Text style={[styles.text, styles.textSubHeading]}>Log in</Text>
                <Text style={[styles.text, styles.textInputLabel]}>
                  Email address
                </Text>
                <TextInput
                  testID="txtInputEmail"
                  placeholder="Enter your email address"
                  placeholderTextColor="#CBD5E1"
                  style={styles.textInput}
                  value={this.state.email}
                  onChangeText={this.setEmail}
                  autoCapitalize="none"
                  autoCorrect={false}
                  underlineColorAndroid="transparent"
                  textContentType="oneTimeCode"
                />
                <Text style={[styles.text, styles.errorText]}>{this.state.emailError}</Text>
                <Text style={[styles.text, styles.textInputLabel]}>Password</Text>
                <View style={styles.passwordView}>

                  <TextInput
                    testID="txtInputPassword"
                    placeholder="Enter your password"
                    placeholderTextColor="#CBD5E1"
                    style={styles.inputPassword}
                    value={this.state.password}
                    onChangeText={this.setPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    maxLength={16}
                    secureTextEntry={!this.state.showPswrd}
                    textContentType="oneTimeCode"
                  />
                  <TouchableOpacity testID="passwordIcon" style={styles.passwordIconTouchable} onPress={this.handlePasswordIcon}>
                    <Image source={require("../../../mobile/assets/images/password_eye.png")} style={[styles.passwordIconImage, { tintColor: this.state.showPswrd ? "#475569" : "#3333CC" }]} />
                  </TouchableOpacity>
                </View>
                <Text style={[styles.text, styles.errorText]}>{this.state.passwordError}</Text>
                <TouchableOpacity
                  testID="btnForgotPassword"
                  style={styles.forgotPass}
                  onPress={this.handleForgotPassword}
                >
                  <Text style={[styles.text, styles.forgotPassText]}>
                    Forgot Password?
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  testID="btnEmailLogIn"
                  style={styles.loginButton}
                  onPress={() => this.validateLoginForm()}
                >
                  <Text style={[styles.text, styles.textLoginButton]}>Log in</Text>
                </TouchableOpacity>
                <View style={styles.signUpContainer}>
                  <Text style={[styles.text, styles.textSignup]}>
                    {"Don't have any account?"}
                  </Text>
                  <TouchableOpacity
                    testID="btnSignUp"
                    onPress={this.handleSignup}
                  >
                    <Text style={styles.textSignupLink}>{" Sign up"}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ImageBackground>
          </SafeAreaView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
    // Merge Engine - render - End
    // Customizable Area End
  }
}

// Customizable Area Start
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors(false).background,
    justifyContent: "center",
    alignItems: "center",
  },
  imageBg: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    alignItems: "center",
    width: "100%",
    paddingHorizontal: "5%",
  },
  errorText: {
    color: 'red',
    fontSize: 13,
    paddingTop: 2,
  },
  text: {
    fontFamily: "OpenSans",
    alignSelf: "flex-start",
    color: colors(false).text,
  },
  textHeading: {
    color: "#4949EE",
    fontSize: 45,
    fontWeight: "bold",
    alignSelf: "center",
  },
  textSubHeading: {
    fontWeight: "bold",
    fontSize: 25,
    marginTop: 30,
  },
  textInputLabel: {
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 5,
  },
  textInput: {
    width: "100%",
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: "#C5C5FF",
    color: colors(false).text,
    height: 50,
  },
  forgotPass: {
    marginTop: 5,
    alignSelf: "flex-end",
  },
  forgotPassText: {
    color: "#4949EE",
  },
  loginButton: {
    backgroundColor: "#3333CC",
    width: "100%",
    padding: 15,
    borderRadius: 10,
    marginTop: 25,
  },
  textLoginButton: {
    color: colors(false).white,
    fontWeight: "700",
    fontSize: 18,
    alignSelf: "center",
  },
  textSignup: {
    alignSelf: "center",
  },
  textSignupLink: {
    fontWeight: "bold",
    color: "#4949EE",
  },
  signUpContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  passwordView: {
    width: "100%",
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: "#C5C5FF",
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputPassword: {
    color: colors(false).text,
    width: '80%',
  },
  passwordIconTouchable: {
    justifyContent: 'center',
  },
  passwordIconImage: {
    height: 20,
    width: 30,
    resizeMode: 'contain',
  },
});
// Customizable Area End

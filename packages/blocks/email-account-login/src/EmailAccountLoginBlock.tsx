import React from "react";
// Customizable Area Start
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Image,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from "react-native";

// Merge Engine - import assets - Start
// Merge Engine - import assets - End

// Merge Engine - Artboard Dimension  - Start
// Merge Engine - Artboard Dimension  - End
import { redesignTheme } from "../../utilities/src/Colors";
// Customizable Area End

import EmailAccountLoginController, {
  Props,
} from "./EmailAccountLoginController";

type LoginTheme = typeof redesignTheme;

export default class EmailAccountLoginBlock extends EmailAccountLoginController {
  // Customizable Area Start
  get styles() {
    return createLoginStyles(this.getLoginTheme());
  }
  // Customizable Area End

  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }

  render() {
    // Customizable Area Start
    // Merge Engine - render - Start
    const theme = this.getLoginTheme();
    const styles = this.styles;
    return (
      // Required for all blocks
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: theme.background }}
        behavior={this.isPlatformiOS() ? "padding" : undefined}>
        <TouchableWithoutFeedback
          testID={"loginBackground"}
          onPress={() => {
            this.hideKeyboard();
          }}>
          <SafeAreaView style={styles.container}>
            <StatusBar
              barStyle={this.state.isDarkMode ? "light-content" : "dark-content"}
              backgroundColor={theme.background}
            />
            <View style={styles.imageBg}>
              <View pointerEvents="none" style={styles.decorTop} />
              <View pointerEvents="none" style={styles.decorBottom} />
              <View style={styles.contentContainer}>
                <Text style={[styles.text, styles.textHeading]}>Local Shows</Text>
                <Text style={[styles.text, styles.textSubHeading]}>Log in</Text>
                <Text style={[styles.text, styles.textInputLabel]}>
                  Email address
                </Text>
                <TextInput
                  testID="txtInputEmail"
                  placeholder="Enter your email address"
                  placeholderTextColor={theme.muted}
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
                    placeholderTextColor={theme.muted}
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
                    <Image source={require("../../../mobile/assets/images/password_eye.png")} style={[styles.passwordIconImage, { tintColor: this.state.showPswrd ? theme.muted : theme.primary }]} />
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
            </View>
          </SafeAreaView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
    // Merge Engine - render - End
    // Customizable Area End
  }
}

// Customizable Area Start
const createLoginStyles = (theme: LoginTheme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    justifyContent: "center",
    alignItems: "center",
  },
  imageBg: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
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
    alignItems: "center",
    width: "100%",
    paddingHorizontal: "5%",
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 13,
    paddingTop: 2,
  },
  text: {
    fontFamily: "OpenSans",
    alignSelf: "flex-start",
    color: theme.foreground,
  },
  textHeading: {
    color: theme.primary,
    fontSize: 45,
    fontWeight: "bold",
    alignSelf: "center",
  },
  textSubHeading: {
    fontWeight: "bold",
    fontSize: 25,
    marginTop: 30,
    color: theme.foreground,
  },
  textInputLabel: {
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 5,
    color: theme.foreground,
  },
  textInput: {
    width: "100%",
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
    backgroundColor: theme.input,
    color: theme.foreground,
    height: 50,
  },
  forgotPass: {
    marginTop: 5,
    alignSelf: "flex-end",
  },
  forgotPassText: {
    color: theme.primary,
  },
  loginButton: {
    backgroundColor: theme.primary,
    width: "100%",
    padding: 15,
    borderRadius: 12,
    marginTop: 25,
  },
  textLoginButton: {
    color: '#FFFFFF',
    fontWeight: "700",
    fontSize: 18,
    alignSelf: "center",
  },
  textSignup: {
    alignSelf: "center",
    color: theme.muted,
  },
  textSignupLink: {
    fontWeight: "bold",
    color: theme.primary,
  },
  signUpContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  passwordView: {
    width: "100%",
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
    backgroundColor: theme.input,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputPassword: {
    color: theme.foreground,
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

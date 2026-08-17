import React from "react";

//Customizable Area Start
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  StatusBar,
  KeyboardAvoidingView,
  Dimensions,
  Image,
  ImageBackground,
  ScrollView,
  TouchableWithoutFeedback,
  Platform
} from "react-native";
import ForgotPasswordController, { Props } from "./ForgotPasswordController";
import { colors } from "../../utilities/src/Colors";
import { leftArrow } from "../../email-account-registration/src/assets";
import { loginBg } from "../../email-account-login/src/assets";
//Customizable Area End

export default class ForgotPassword extends ForgotPasswordController {
  constructor(props: Props) {
    super(props);
    //Customizable Area Start
    //Customizable Area End
  }

  render() {
    const { navigation } = this.props;

    return (
      <KeyboardAvoidingView
        behavior={this.isPlatformiOS() ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          keyboardShouldPersistTaps="always"
          style={
            this.isPlatformWeb() ? styles.containerWeb : styles.containerMobile
          }
        >
          <TouchableWithoutFeedback onPress={() => this.hideKeyboard()}>
            {/* Customizable Area Start */}
            <SafeAreaView style={styles.parentContainer}>
              <View style={{ width: "100%", }}>
                <TouchableOpacity
                  testID="navigationBackButton"
                  style={{
                    position: 'absolute', marginLeft: 20,
                    paddingTop: 10,
                  }}
                  onPress={() => {
                    this.props.navigation.goBack();
                  }}>
                  <Image
                    source={leftArrow}
                    style={{
                      width: 12,
                      resizeMode: "contain",
                    }}
                  />
                </TouchableOpacity>
                <Text testID="testLabel" style={styles.headerTitle}>Forgot password</Text>
              </View>
              <StatusBar barStyle="dark-content" backgroundColor="white" />
              <ImageBackground source={loginBg} style={styles.pageBgImage}>
                <View style={styles.contentContainer}>
                  <Text style={[styles.text, styles.textHeading]}>
                    Local Shows
                  </Text>
                  <Text
                    testID="testLabel"
                    style={[styles.text, styles.textSubHeading]}
                  >
                    Forgot password?
                  </Text>
                  <Text style={[styles.text, styles.textInfo]}>
                    Please write your email to receive a confirmation code to
                    set a new password.
                  </Text>
                  <Text style={[styles.text, styles.inputFieldLabel]}>
                    Email address
                  </Text>
                  <TextInput
                    testID="txtInputEmail"
                    placeholder="Enter your email address"
                    placeholderTextColor="#CBD5E1"
                    style={styles.inputField}
                    value={this.state.emailValue}
                    onChangeText={emailValue => this.setState({ emailValue: emailValue.replace(" ", "")  })}
                    autoCapitalize="none"
                    autoCorrect={false}
                    underlineColorAndroid="transparent"
                    keyboardType={Platform.OS === "android" ? "visible-password" : "default"}
                  />
                  <Text style={[styles.text, styles.validationsErrorText]}>
                    {this.state.emailError}
                  </Text>
                  <TouchableOpacity
                    testID="btnEmailSubmit"
                    style={styles.emailSubmitButton}
                    onPress={() => this.submitEmail()}
                  >
                    <Text style={[styles.text, styles.textEmailSubmitButton]}>
                      Confirm e-mail
                    </Text>
                  </TouchableOpacity>
                </View>
              </ImageBackground>
            </SafeAreaView>
            {/* Customizable Area End */}
          </TouchableWithoutFeedback>
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
    marginLeft: "auto",
    marginRight: "auto"
  },
  parentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors(false).background
  },
  headerElementContainer: {
    position: "absolute",
    top: 16,
    marginBottom: 10,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    marginHorizontal: "5%"
  },
  backButtonIconContainer: {
    position: "absolute",
    left: 0,
    padding: 10,
    alignSelf: "center"
  },
  navigateBackIcon: {
    width: 12,
    left: 0,
    resizeMode: "contain"
  },
  headerElementText: {
    fontWeight: "bold",
    fontSize: 30
  },
  pageBgImage: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    height: Dimensions.get("window").height - 150
  },
  contentContainer: {
    alignItems: "center",
    width: "100%",
    paddingHorizontal: "5%",
  },
  validationsErrorText: {
    color: "red",
    fontSize: 13,
    paddingTop: 2
  },
  text: {
    fontFamily: "OpenSans",
    alignSelf: "flex-start",
    color: colors(false).text
  },
  textHeading: {
    color: "#4949EE",
    fontSize: 45,
    fontWeight: "bold",
    alignSelf: "center"
  },
  textSubHeading: {
    fontWeight: "bold",
    fontSize: 25,
    marginTop: 30
  },
  textInfo: {
    marginVertical: 15
  },
  inputFieldLabel: {
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 5
  },
  inputField: {
    width: "100%",
    height: 50,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: "#C5C5FF",
    color: colors(false).text
  },
  emailSubmitButton: {
    backgroundColor: "#3333CC",
    width: "100%",
    padding: 15,
    borderRadius: 10,
    marginTop: 30
  },
  textEmailSubmitButton: {
    color: colors(false).white,
    fontWeight: "700",
    fontSize: 18,
    alignSelf: "center"
  },
  headerTitle: {
    fontWeight: "700",
    fontSize: 24,
    color: '#334155',
    textAlign: 'center',
    textAlignVertical: 'center',
    marginHorizontal: 50,
    alignSelf: 'center',
    marginTop: 15,
  },
});

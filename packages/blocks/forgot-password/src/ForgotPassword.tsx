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
  Image,
  ScrollView,
  TouchableWithoutFeedback,
  Platform
} from "react-native";
import ForgotPasswordController, { Props } from "./ForgotPasswordController";
import { redesignTheme } from "../../utilities/src/Colors";
import { leftArrow } from "../../email-account-registration/src/assets";
//Customizable Area End

type ForgotPasswordTheme = typeof redesignTheme;

export default class ForgotPassword extends ForgotPasswordController {
  constructor(props: Props) {
    super(props);
    //Customizable Area Start
    //Customizable Area End
  }

  get styles() {
    return createForgotPasswordStyles(this.getForgotPasswordTheme());
  }

  render() {
    const { navigation } = this.props;
    const theme = this.getForgotPasswordTheme();
    const styles = this.styles;

    return (
      <KeyboardAvoidingView
        behavior={this.isPlatformiOS() ? "padding" : undefined}
        style={{ flex: 1, backgroundColor: theme.background }}
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
              <StatusBar
                barStyle={this.state.isDarkMode ? "light-content" : "dark-content"}
                backgroundColor={theme.background}
              />
              <View pointerEvents="none" style={styles.decorTop} />
              <View pointerEvents="none" style={styles.decorBottom} />
              <View style={styles.headerRow}>
                <TouchableOpacity
                  testID="navigationBackButton"
                  style={styles.backButtonIconContainer}
                  onPress={() => {
                    this.props.navigation.goBack();
                  }}>
                  <Image
                    source={leftArrow}
                    style={[styles.navigateBackIcon, { tintColor: theme.foreground }]}
                  />
                </TouchableOpacity>
                <Text testID="testLabel" style={styles.headerTitle}>Forgot password</Text>
              </View>
              <View style={styles.pageBgImage}>
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
                    placeholderTextColor={theme.muted}
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
const createForgotPasswordStyles = (theme: ForgotPasswordTheme) => StyleSheet.create({
  containerMobile: {
    flex: 1,
    backgroundColor: theme.background
  },
  containerWeb: {
    marginLeft: "auto",
    marginRight: "auto"
  },
  parentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.background
  },
  headerRow: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    marginBottom: 10,
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
    left: 10,
    padding: 10,
    alignSelf: "center",
    zIndex: 2,
  },
  navigateBackIcon: {
    width: 12,
    left: 0,
    resizeMode: "contain"
  },
  headerElementText: {
    fontWeight: "bold",
    fontSize: 30,
    color: theme.primary,
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
  pageBgImage: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    minHeight: 520,
    backgroundColor: theme.background,
  },
  contentContainer: {
    alignItems: "center",
    width: "100%",
    paddingHorizontal: "5%",
  },
  validationsErrorText: {
    color: "#D32F2F",
    fontSize: 13,
    paddingTop: 2
  },
  text: {
    fontFamily: "OpenSans",
    alignSelf: "flex-start",
    color: theme.foreground
  },
  textHeading: {
    color: theme.primary,
    fontSize: 42,
    fontWeight: "bold",
    alignSelf: "center"
  },
  textSubHeading: {
    fontWeight: "bold",
    fontSize: 25,
    marginTop: 30,
    color: theme.foreground,
  },
  textInfo: {
    marginVertical: 15,
    color: theme.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  inputFieldLabel: {
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 5,
    color: theme.foreground,
  },
  inputField: {
    width: "100%",
    height: 50,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
    backgroundColor: theme.input,
    color: theme.foreground
  },
  emailSubmitButton: {
    backgroundColor: theme.primary,
    width: "100%",
    padding: 15,
    borderRadius: 12,
    marginTop: 30
  },
  textEmailSubmitButton: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 18,
    alignSelf: "center"
  },
  headerTitle: {
    fontWeight: "700",
    fontSize: 24,
    color: theme.primary,
    textAlign: "center",
    textAlignVertical: "center",
    marginHorizontal: 50,
    alignSelf: "center",
    marginTop: 15,
  },
});
// Customizable Area End

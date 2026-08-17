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
  TextInput,
} from "react-native";

// Merge Engine - import assets - Start
// Merge Engine - import assets - End

// Merge Engine - Artboard Dimension  - Start
// Merge Engine - Artboard Dimension  - End

import { colors } from "../../utilities/src/Colors";
import { leftArrow } from "../../email-account-registration/src/assets";
// Customizable Area End

import Settings2Controller, {
  Props,
  configJSON,
} from "./Settings2Controller";

export default class ChangePassword extends Settings2Controller {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }

  // Customizable Area Start
  renderHeader = () => {
    return (
      <View style={styles.topBackdrop}>
        <TouchableOpacity
          testID="navigationBackButton"
          style={{ marginLeft: 16,width: 20,}}
          onPress={() => {
            this.props.navigation.goBack();
          }}>
          <Image
            source={leftArrow}
            style={styles.headerIcon}
          />
        </TouchableOpacity>
        <Text testID="changePassword" style={styles.headerTitle}>{configJSON.changePassword}</Text>
        <Text />
      </View>
    )
  }

  renderCurrentPassword = () => {
    return (
      <>
        <Text style={[styles.text, styles.textInputLabel]}>{configJSON.currentPassword}</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            testID="currentPasswordTxt"
            placeholder={"Enter your password"}
            placeholderTextColor="#CBD5E1"
            style={styles.passwordInput}
            value={this.state.currentPassword}
            onChangeText={this.handleCurrentPassword}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={!this.state.showCurrentPassword}
            maxLength={16}
          />
          <TouchableOpacity testID="passwordIcon" style={styles.passwordIconContainer} onPress={() => { this.setState({ showCurrentPassword: !this.state.showCurrentPassword }) }}>
            <Image source={require("../../../mobile/assets/images/password_eye.png")} style={[styles.passwordIcon, { tintColor: this.state.showCurrentPassword ? "#475569" : "#3333CC" }]} />
          </TouchableOpacity>
        </View>
      </>
    )
  }

  renderNewPassword = () => {
    return (
      <>
        <Text style={[styles.text, styles.textInputLabel]}>{configJSON.newPassword}</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            testID="newPasswordTxt"
            placeholder={"Enter your password"}
            placeholderTextColor="#CBD5E1"
            style={styles.passwordInput}
            value={this.state.newPassword}
            onChangeText={this.handleNewPassword}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={!this.state.showNewPassword}
            maxLength={16}
          />
          <TouchableOpacity testID="newPasswordIcon" style={styles.passwordIconContainer} onPress={() => { this.setState({ showNewPassword: !this.state.showNewPassword }) }}>
            <Image source={require("../../../mobile/assets/images/password_eye.png")} style={[styles.passwordIcon, { tintColor: this.state.showNewPassword ? "#475569" : "#3333CC" }]} />
          </TouchableOpacity>
        </View>
      </>
    )
  }

  renderConfirmPassword = () => {
    return (
      <>
        <Text style={[styles.text, styles.textInputLabel]}>{configJSON.confirmNewPassword}</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            testID="confirmNewPasswordTxt"
            placeholder={"Enter your password"}
            placeholderTextColor="#CBD5E1"
            style={styles.passwordInput}
            value={this.state.confirmNewPassword}
            onChangeText={this.handleConfirmPassword}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={!this.state.showConfirmNewPassword}
          />
          <TouchableOpacity testID="confirmPasswordIcon" style={styles.passwordIconContainer} onPress={() => { this.setState({ showConfirmNewPassword: !this.state.showConfirmNewPassword }) }}>
            <Image source={require("../../../mobile/assets/images/password_eye.png")} style={[styles.passwordIcon, { tintColor: this.state.showConfirmNewPassword ? "#475569" : "#3333CC" }]} />
          </TouchableOpacity>
        </View>
      </>
    )
  }
  
  renderError = (errorType: string) => {
    return (
      <>
        {errorType !== "" && (
          <Text style={[styles.text, styles.errorText]}>
            {errorType}
          </Text>
        )}
      </>
    )
  }

  // Customizable Area End

  render() {
    // Customizable Area Start
    // Merge Engine - render - Start
    return (
      <TouchableWithoutFeedback
        testID="container"
        onPress={() => {
          this.hideKeyboard();
        }} >
        <SafeAreaView style={styles.container}>
          {this.renderHeader()}
          <View style={styles.bodyContainer}>
            {this.renderCurrentPassword()}
            {this.renderError(this.state.currentPasswordError)}

            {this.renderNewPassword()}
            {this.renderError(this.state.newPasswordError)}

            {this.renderConfirmPassword()}
            <Text style={[styles.text, styles.errorText]}>{this.state.confirmNewPasswordError}</Text>
          </View>
          <TouchableOpacity testID="btnUpdate" style={styles.updateButton} onPress={this.updatePasswordAPI}>
            <Text style={[styles.text, styles.updateButtonText]}>{configJSON.update}</Text>
          </TouchableOpacity>
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
    padding: 16,
    marginLeft: "auto",
    marginRight: "auto",
    width: "100%",
    maxWidth: 650,
    backgroundColor: "#ffffffff",
  },
  topBackdrop: {
    width: "100%",
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerIcon: {
    width: 12,
    resizeMode: "contain",
  },
  headerTitle: {
    fontWeight: "700",
    fontSize: 24,
    color: '#334155',
    textAlign: 'center',
    textAlignVertical: 'center',
    marginHorizontal: 50,
  },
  bodyContainer: {
    marginHorizontal: 10,
  },
  text: {
    fontFamily: "OpenSans",
    alignSelf: "flex-start",
    color: colors(false).text,
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
  errorText: {
    color: 'red',
    fontSize: 13,
    paddingTop: 2,
  },
  updateButton: {
    backgroundColor: "#3333CC",
    padding: 15,
    borderRadius: 10,
    marginTop: 25,
    margin: 16,
    position: 'absolute',
    bottom: 10,
    width: '95%',
    alignSelf: 'center'
  },
  updateButtonText: {
    color: colors(false).white,
    fontWeight: "700",
    fontSize: 18,
    alignSelf: "center",
  },
  passwordContainer: {
    width: "100%",
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: "#C5C5FF",
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  passwordInput: {
    color: colors(false).text,
    fontSize: 16,
    width: '80%',
  },
  passwordIconContainer: {
    justifyContent: 'center',
  },
  passwordIcon: {
    height: 20,
    width: 30,
    resizeMode: 'contain',
  }
});
// Customizable Area End

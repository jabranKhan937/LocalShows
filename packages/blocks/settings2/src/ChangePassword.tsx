import React from "react";

// Customizable Area Start
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StatusBar,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Feather";
import { lightTheme, redesignTheme } from "../../utilities/src/Colors";
// Customizable Area End

import Settings2Controller, {
  Props,
  configJSON,
} from "./Settings2Controller";

type SettingsTheme = typeof redesignTheme;

export default class ChangePassword extends Settings2Controller {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }

  // Customizable Area Start
  get styles() {
    return this.state.isDarkMode ? darkChangePasswordStyles : lightChangePasswordStyles;
  }

  renderHeader = () => {
    const theme = this.getSettingsTheme();
    return (
      <View style={this.styles.header}>
        <TouchableOpacity
          testID="navigationBackButton"
          style={this.styles.headerCircleBtn}
          onPress={() => {
            this.props.navigation.goBack();
          }}
          activeOpacity={0.8}
        >
          <Icon name="arrow-left" size={18} color={theme.foreground} />
        </TouchableOpacity>
        <Text testID="changePassword" style={this.styles.headerTitle}>
          {configJSON.changePassword}
        </Text>
        <View style={this.styles.headerSideSpacer} />
      </View>
    );
  };

  renderPasswordField = ({
    label,
    testID,
    iconTestID,
    value,
    onChangeText,
    visible,
    onToggleVisible,
    maxLength,
  }: {
    label: string;
    testID: string;
    iconTestID: string;
    value: string;
    onChangeText: (text: string) => void;
    visible: boolean;
    onToggleVisible: () => void;
    maxLength?: number;
  }) => {
    const theme = this.getSettingsTheme();
    return (
      <>
        <Text style={this.styles.textInputLabel}>{label}</Text>
        <View style={this.styles.passwordContainer}>
          <TextInput
            testID={testID}
            placeholder={"Enter your password"}
            placeholderTextColor={theme.muted}
            style={this.styles.passwordInput}
            value={value}
            onChangeText={onChangeText}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={!visible}
            maxLength={maxLength}
          />
          <TouchableOpacity
            testID={iconTestID}
            style={this.styles.passwordIconContainer}
            onPress={onToggleVisible}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Icon
              name={visible ? "eye" : "eye-off"}
              size={18}
              color={visible ? theme.primary : theme.muted}
            />
          </TouchableOpacity>
        </View>
      </>
    );
  };

  renderCurrentPassword = () => {
    return this.renderPasswordField({
      label: configJSON.currentPassword,
      testID: "currentPasswordTxt",
      iconTestID: "passwordIcon",
      value: this.state.currentPassword,
      onChangeText: this.handleCurrentPassword,
      visible: this.state.showCurrentPassword,
      onToggleVisible: () => {
        this.setState({ showCurrentPassword: !this.state.showCurrentPassword });
      },
      maxLength: 16,
    });
  };

  renderNewPassword = () => {
    return this.renderPasswordField({
      label: configJSON.newPassword,
      testID: "newPasswordTxt",
      iconTestID: "newPasswordIcon",
      value: this.state.newPassword,
      onChangeText: this.handleNewPassword,
      visible: this.state.showNewPassword,
      onToggleVisible: () => {
        this.setState({ showNewPassword: !this.state.showNewPassword });
      },
      maxLength: 16,
    });
  };

  renderConfirmPassword = () => {
    return this.renderPasswordField({
      label: configJSON.confirmNewPassword,
      testID: "confirmNewPasswordTxt",
      iconTestID: "confirmPasswordIcon",
      value: this.state.confirmNewPassword,
      onChangeText: this.handleConfirmPassword,
      visible: this.state.showConfirmNewPassword,
      onToggleVisible: () => {
        this.setState({
          showConfirmNewPassword: !this.state.showConfirmNewPassword,
        });
      },
    });
  };

  renderError = (errorType: string) => {
    return (
      <>
        {errorType !== "" && (
          <Text style={this.styles.errorText}>{errorType}</Text>
        )}
      </>
    );
  };

  // Customizable Area End

  render() {
    // Customizable Area Start
    const theme = this.getSettingsTheme();
    return (
      <TouchableWithoutFeedback
        testID="container"
        onPress={() => {
          this.hideKeyboard();
        }}
      >
        <SafeAreaView style={this.styles.container} edges={["top"]}>
          <StatusBar
            barStyle={this.state.isDarkMode ? "light-content" : "dark-content"}
            backgroundColor={theme.background}
          />
          {this.renderHeader()}
          <View style={this.styles.bodyContainer}>
            {this.renderCurrentPassword()}
            {this.renderError(this.state.currentPasswordError)}

            {this.renderNewPassword()}
            {this.renderError(this.state.newPasswordError)}

            {this.renderConfirmPassword()}
            <Text style={this.styles.errorText}>
              {this.state.confirmNewPasswordError}
            </Text>
          </View>
          <TouchableOpacity
            testID="btnUpdate"
            style={this.styles.updateButton}
            onPress={this.updatePasswordAPI}
            activeOpacity={0.85}
          >
            <Text style={this.styles.updateButtonText}>{configJSON.update}</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    );
    // Customizable Area End
  }
}

// Customizable Area Start
const createChangePasswordStyles = (theme: SettingsTheme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      width: "100%",
      maxWidth: 650,
      alignSelf: "center",
      backgroundColor: theme.background,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 16,
      height: 56,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.border,
      backgroundColor: theme.background,
    },
    headerCircleBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.input,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border,
      alignItems: "center",
      justifyContent: "center",
    },
    headerSideSpacer: {
      width: 36,
      height: 36,
    },
    headerTitle: {
      fontWeight: "900",
      fontSize: 18,
      letterSpacing: 0.6,
      color: theme.foreground,
      textTransform: "uppercase",
      textAlign: "center",
    },
    bodyContainer: {
      paddingHorizontal: 16,
      paddingTop: 8,
    },
    textInputLabel: {
      fontWeight: "700",
      fontSize: 14,
      color: theme.foreground,
      marginTop: 20,
      marginBottom: 8,
    },
    errorText: {
      color: "#DC2626",
      fontSize: 13,
      paddingTop: 4,
    },
    updateButton: {
      backgroundColor: theme.primary,
      padding: 16,
      borderRadius: 14,
      marginHorizontal: 16,
      position: "absolute",
      bottom: 24,
      left: 0,
      right: 0,
    },
    updateButtonText: {
      color: "#FFFFFF",
      fontWeight: "700",
      fontSize: 18,
      alignSelf: "center",
    },
    passwordContainer: {
      width: "100%",
      paddingHorizontal: 14,
      borderRadius: 14,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border,
      backgroundColor: theme.input,
      height: 50,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    passwordInput: {
      color: theme.foreground,
      fontSize: 16,
      width: "80%",
    },
    passwordIconContainer: {
      justifyContent: "center",
    },
  });
};

const darkChangePasswordStyles = createChangePasswordStyles(redesignTheme);
const lightChangePasswordStyles = createChangePasswordStyles(lightTheme);
// Customizable Area End

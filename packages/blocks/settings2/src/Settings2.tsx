import React from "react";

// Customizable Area Start
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StatusBar,
  Modal,
  ActivityIndicator,
  Platform,
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

export default class Settings2 extends Settings2Controller {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }

  // Customizable Area Start
  get styles() {
    return this.state.isDarkMode ? darkSettingsStyles : lightSettingsStyles;
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
        <Text testID="pageTitle" style={this.styles.headerTitle}>
          {configJSON.pageTitle}
        </Text>
        <View style={this.styles.headerSideSpacer} />
      </View>
    );
  };

  renderToggle = (enabled: boolean) => {
    return (
      <View
        style={[
          this.styles.switchContainer,
          enabled ? this.styles.switchOn : this.styles.switchOff,
        ]}
      >
        <View
          style={[
            this.styles.switchButton,
            { alignSelf: enabled ? "flex-end" : "flex-start" },
          ]}
        />
      </View>
    );
  };

  renderPrivateAccount = () => {
    if (this.state.currentUserRole !== "fan") {
      return <></>;
    }
    return (
      <>
        <View style={this.styles.rowDivider} />
        <View style={this.styles.rowView}>
          <Text style={this.styles.text}>{configJSON.privateAccount}</Text>
          <TouchableWithoutFeedback
            testID="privateAccount"
            onPress={() => {
              this.putPrivateAccountAPI();
            }}
          >
            {this.renderToggle(this.state.isPrivateAccount)}
          </TouchableWithoutFeedback>
        </View>
      </>
    );
  };

  renderPushNotification = () => {
    return (
      <View style={this.styles.rowView}>
        <Text style={this.styles.text}>{configJSON.pushNotifications}</Text>
        <TouchableWithoutFeedback
          testID="pushNotifications"
          onPress={() => {
            this.setState(
              {
                isPushNotificationEnabled: !this.state.isPushNotificationEnabled,
              },
              () => {
                this.handlePushNotification();
              },
            );
          }}
        >
          {this.renderToggle(this.state.isPushNotificationEnabled)}
        </TouchableWithoutFeedback>
      </View>
    );
  };

  renderDeleteAccountModal = () => {
    const theme = this.getSettingsTheme();
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.isDeleteAccountConfirmationModal}
      >
        <View style={this.styles.modalParentView}>
          <View style={this.styles.modalContainerView}>
            <TouchableOpacity
              testID="crossBtn"
              style={this.styles.disablePopupIconContainer}
              onPress={() =>
                this.setState({ isDeleteAccountConfirmationModal: false })
              }
            >
              <Icon name="x" color={theme.foreground} size={22} />
            </TouchableOpacity>
            <Text style={this.styles.txtDeleteHeading}>
              {configJSON.accountDeletionPopupHeading}
            </Text>
            <Text style={this.styles.txtDelete}>
              {configJSON.accountDeletionPopupMessage}
            </Text>
            <TouchableOpacity
              testID="noBtn"
              style={[this.styles.deleteBtnContainer, this.styles.keepBtnContainer]}
              onPress={() =>
                this.setState({ isDeleteAccountConfirmationModal: false })
              }
              activeOpacity={0.85}
            >
              <Text style={[this.styles.txtDeleteBtn, this.styles.txtKeepBtn]}>
                {configJSON.noButton}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              testID="yesBtn"
              style={this.styles.deleteBtnContainer}
              onPress={() => this.deleteAccountAPI()}
              activeOpacity={0.85}
            >
              <Text style={this.styles.txtDeleteBtn}>{configJSON.yesButton}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };
  // Customizable Area End

  render() {
    // Customizable Area Start
    const theme = this.getSettingsTheme();
    return (
      <TouchableWithoutFeedback
        testID="containerTouchable"
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
          {this.state.isLoading ? (
            <View style={this.styles.loadingContainer}>
              <ActivityIndicator size={"large"} color={theme.primary} />
            </View>
          ) : (
            <>
              <View style={this.styles.bodyContainer}>
                <View style={this.styles.settingsCard}>
                  <TouchableOpacity
                    testID="personalInformation"
                    style={this.styles.rowView}
                    onPress={() => this.handleProfileNavigation()}
                    activeOpacity={0.8}
                  >
                    <Text style={this.styles.text}>
                      {configJSON.personalInformation}
                    </Text>
                    <Icon name="chevron-right" size={18} color={theme.muted} />
                  </TouchableOpacity>
                  {this.renderPrivateAccount()}
                  <View style={this.styles.rowDivider} />
                  {this.renderPushNotification()}
                </View>

                <Text style={this.styles.sectionTitle}>{configJSON.security}</Text>
                <View style={this.styles.settingsCard}>
                  <TouchableOpacity
                    testID="changePassword"
                    style={this.styles.rowView}
                    onPress={this.handleChangePasswordNavigation}
                    activeOpacity={0.8}
                  >
                    <Text style={this.styles.text}>
                      {configJSON.changePassword}
                    </Text>
                    <Icon name="chevron-right" size={18} color={theme.muted} />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  testID="deleteMyAccount"
                  style={this.styles.deleteAccountBtn}
                  onPress={() => {
                    this.setState({ isDeleteAccountConfirmationModal: true });
                  }}
                  activeOpacity={0.85}
                >
                  <Icon name="trash-2" size={16} color="#FFFFFF" />
                  <Text style={this.styles.deleteAccountText}>
                    Delete my account
                  </Text>
                </TouchableOpacity>
              </View>
              {this.renderDeleteAccountModal()}
            </>
          )}
        </SafeAreaView>
      </TouchableWithoutFeedback>
    );
    // Customizable Area End
  }
}

// Customizable Area Start
const createSettingsStyles = (theme: SettingsTheme) => {
  const isLightTheme = theme.background === lightTheme.background;
  return StyleSheet.create({
    container: {
      flex: 1,
      width: Platform.OS === "web" ? "75%" : "100%",
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
    },
    bodyContainer: {
      paddingHorizontal: 16,
      paddingTop: 16,
    },
    settingsCard: {
      backgroundColor: theme.card,
      borderRadius: 16,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border,
      paddingHorizontal: 16,
      paddingVertical: 4,
    },
    rowView: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      minHeight: 52,
    },
    rowDivider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: theme.divider,
    },
    text: {
      fontWeight: "500",
      fontSize: 16,
      color: theme.foreground,
      lineHeight: 22,
      flex: 1,
      paddingRight: 12,
    },
    sectionTitle: {
      fontWeight: "800",
      fontSize: 13,
      letterSpacing: 0.8,
      color: theme.muted,
      textTransform: "uppercase",
      marginTop: 24,
      marginBottom: 10,
      marginLeft: 4,
    },
    switchContainer: {
      width: 48,
      height: 28,
      borderRadius: 14,
      justifyContent: "center",
    },
    switchOn: {
      backgroundColor: theme.primary,
    },
    switchOff: {
      backgroundColor: isLightTheme ? "#D4D4D8" : theme.input,
    },
    switchButton: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: "#FFFFFF",
      marginHorizontal: 2,
    },
    deleteAccountBtn: {
      marginTop: 16,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.primary,
      borderRadius: 14,
      paddingVertical: 16,
      paddingHorizontal: 18,
    },
    deleteAccountText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "700",
      marginLeft: 8,
    },
    modalParentView: {
      flex: 1,
      backgroundColor: "rgba(8, 8, 15, 0.72)",
      justifyContent: "flex-end",
    },
    modalContainerView: {
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 100,
      justifyContent: "space-between",
      backgroundColor: theme.card,
      borderTopEndRadius: 20,
      padding: 35,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
    },
    txtDeleteHeading: {
      marginBottom: 10,
      marginTop: 25,
      color: theme.foreground,
      fontWeight: "700",
      fontSize: 26,
      lineHeight: 28,
    },
    txtDelete: {
      fontSize: 16,
      lineHeight: 24,
      color: theme.muted,
    },
    deleteBtnContainer: {
      padding: 15,
      borderRadius: 12,
      marginTop: 15,
      backgroundColor: theme.primary,
      width: "100%",
    },
    txtDeleteBtn: {
      color: "#FFFFFF",
      fontWeight: "700",
      fontSize: 18,
      alignSelf: "center",
    },
    keepBtnContainer: {
      backgroundColor: "transparent",
    },
    txtKeepBtn: {
      color: theme.primary,
    },
    disablePopupIconContainer: {
      position: "absolute",
      right: 20,
      top: 20,
    },
    loadingContainer: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: isLightTheme
        ? "rgba(255, 255, 255, 0.72)"
        : "rgba(8, 8, 15, 0.72)",
      alignItems: "center",
      justifyContent: "center",
    },
  });
};

const darkSettingsStyles = createSettingsStyles(redesignTheme);
const lightSettingsStyles = createSettingsStyles(lightTheme);
// Customizable Area End

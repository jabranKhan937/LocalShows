import React from "react";
// Customizable Area Start
import {
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  View,
  Image,
  StatusBar,
  TextInput,
  Modal,
  Platform,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Feather";
import { Picker } from "@react-native-picker/picker";
import { lightTheme, redesignTheme } from "../../utilities/src/Colors";
import { usFlag } from "../../email-account-registration/src/assets";
import ContactusController, { configJSON } from "./ContactusController";

type ContactTheme = typeof redesignTheme;
// Customizable Area End

export default class Contactus extends ContactusController {
  // Customizable Area Start
  get styles() {
    return this.state.isDarkMode ? darkContactStyles : lightContactStyles;
  }

  renderHeader = () => {
    const theme = this.getContactTheme();
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
        <Text testID="testLabel" style={this.styles.headerTitle}>
          Contact us
        </Text>
        <View style={this.styles.headerSideSpacer} />
      </View>
    );
  };

  renderSubheading = () => {
    return (
      <Text style={this.styles.subheading}>{configJSON.disclaimer}</Text>
    );
  };

  renderName = () => {
    const theme = this.getContactTheme();
    return (
      <>
        <Text style={this.styles.textInputLabel}>{configJSON.name}</Text>
        <TextInput
          testID="txtInputName"
          placeholder="Enter your name"
          placeholderTextColor={theme.muted}
          style={this.styles.textInput}
          value={this.state.name}
          onChangeText={this.handleName}
        />
      </>
    );
  };

  renderPhoneNumber = () => {
    return (
      <>
        <Text style={this.styles.textInputLabel}>{configJSON.cellphone}</Text>
        {this.state.countryCodeFetched &&
          (Platform.OS === "ios" ? (
            <View>
              <TextInput
                testID="txtInputCellPhone"
                placeholder="Enter your cell phone"
                placeholderTextColor={this.getContactTheme().muted}
                style={[this.styles.textInput, this.styles.textInputPhone]}
                keyboardType="numeric"
                value={this.state.phoneNumber}
                returnKeyType="next"
                onChangeText={this.handlePhoneNumber}
                maxLength={10}
              />
              {this.renderCountryCodeiOSPicker()}
            </View>
          ) : (
            this.renderCountryCodeAndroidPicker()
          ))}
      </>
    );
  };

  renderCountryCodePickerContent = () => {
    const theme = this.getContactTheme();
    const hasFlag =
      this.state.selectedCountryCode &&
      Object.keys(this.state.selectedCountryCode).length > 0;
    const code =
      this.state.selectedCountryCode &&
      Object.keys(this.state.selectedCountryCode).length > 0
        ? `+${this.state.selectedCountryCode.attributes.country_code}`
        : "";
    return (
      <>
        <Image
          source={
            hasFlag
              ? { uri: this.state.selectedCountryCode.attributes.map_url }
              : usFlag
          }
          style={this.styles.usFlagImg}
        />
        <Icon
          name="chevron-down"
          size={14}
          color={theme.muted}
          style={this.styles.countryCodeChevron}
        />
        <Text style={this.styles.textCountryCode}>{code}</Text>
      </>
    );
  };

  renderCountryCodeiOSPicker = () => {
    return (
      <TouchableOpacity
        testID="btnCountryCodeSelect"
        style={this.styles.countryCodeContainer}
        onPress={this.showCountryCodeModal}
      >
        {this.renderCountryCodePickerContent()}
      </TouchableOpacity>
    );
  };

  renderCountryCodeAndroidPicker = () => {
    const theme = this.getContactTheme();
    return (
      <View>
        <TextInput
          testID="txtInputCellPhone"
          placeholder="Enter your cell phone"
          placeholderTextColor={theme.muted}
          style={[this.styles.textInput, this.styles.textInputPhone]}
          keyboardType="numeric"
          value={this.state.phoneNumber}
          returnKeyType="next"
          onChangeText={this.handlePhoneNumber}
          maxLength={10}
        />
        <TouchableOpacity
          testID="btnCountryCodeSelectAndroid"
          style={this.styles.countryCodeContainer}
          onPress={() => {
            this.setState({ countryCodeClickedAndroid: true });
          }}
        >
          {this.renderCountryCodePickerContent()}
        </TouchableOpacity>
      </View>
    );
  };

  renderEmail = () => {
    const theme = this.getContactTheme();
    return (
      <>
        <Text style={this.styles.textInputLabel}>{configJSON.email}</Text>
        <TextInput
          testID="txtInputEmail"
          placeholder="Enter your email address"
          placeholderTextColor={theme.muted}
          style={this.styles.textInput}
          value={this.state.email}
          keyboardType="email-address"
          onChangeText={this.handleEmail}
        />
      </>
    );
  };

  renderSubject = () => {
    const theme = this.getContactTheme();
    return (
      <>
        <Text style={this.styles.textInputLabel}>{configJSON.subject}</Text>
        <TextInput
          testID="txtInputSubject"
          placeholder="What would you like to talk about?"
          placeholderTextColor={theme.muted}
          style={this.styles.textInput}
          value={this.state.subject}
          onChangeText={this.handleSubject}
        />
      </>
    );
  };

  renderMessage = () => {
    const theme = this.getContactTheme();
    return (
      <>
        <Text style={this.styles.textInputLabel}>{configJSON.message}</Text>
        <TextInput
          multiline
          textAlignVertical="top"
          testID="txtInputMessage"
          placeholder="Any details you would like to share?"
          placeholderTextColor={theme.muted}
          style={[this.styles.textInput, this.styles.messageInput]}
          value={this.state.description}
          onChangeText={this.handleMessage}
        />
      </>
    );
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

  renderCountryModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.modalVisible}
      >
        <View style={this.styles.centeredModalView}>
          <View style={this.styles.viewModal}>
            <Text style={this.styles.txtOutsideUS}>Are you outside the US?</Text>
            <Text style={this.styles.txtOnlySupportUS}>
              We only support the United States right now.
            </Text>
            <TouchableOpacity
              testID="btnAccept"
              style={this.styles.continueButton}
              onPress={this.hideModalVisibility}
              activeOpacity={0.85}
            >
              <Text style={this.styles.textContinueButton}>Accept</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  renderCountryCodeModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.countryCodeClicked}
      >
        <TouchableWithoutFeedback
          testID="hideCountryCode"
          onPress={this.hideCountryCode}
        >
          <View style={this.styles.centeredModalView}>
            <TouchableWithoutFeedback>
              <View style={[this.styles.viewModal, this.styles.pickerModal]}>
                <Picker
                  testID="countryCodePickerModal"
                  selectedValue={this.state.selectedCountryCode}
                  onValueChange={this.handleCountryCodeValueiOS}
                >
                  {this.state.countryCodesList?.map((item: any) => (
                    <Picker.Item
                      key={item.id}
                      label={`${item.attributes.name} (+${item.attributes.country_code})`}
                      value={item}
                    />
                  ))}
                </Picker>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };

  renderAndroidCountryCodeModal = () => {
    const theme = this.getContactTheme();
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.countryCodeClickedAndroid}
      >
        <View style={this.styles.androidPickerOverlay}>
          <View style={this.styles.androidPickerCard}>
            <ScrollView>
              {this.state.countryCodesList.map((item: any) => (
                <TouchableOpacity
                  testID="countryCode"
                  key={item.attributes.country_code}
                  style={this.styles.androidPickerRow}
                  onPress={() => this.handleCountryCodeValueAndroid(item)}
                >
                  <Text style={{ color: theme.foreground }}>
                    {`${item.attributes.name} (+${item.attributes.country_code})`}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  render() {
    const theme = this.getContactTheme();
    return (
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: theme.background }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : undefined}
        behavior={this.isPlatformiOS() ? "padding" : undefined}
      >
        <SafeAreaView style={this.styles.container} edges={["top"]}>
          <StatusBar
            animated={true}
            hidden={false}
            barStyle={this.state.isDarkMode ? "light-content" : "dark-content"}
            backgroundColor={theme.background}
          />
          {this.renderHeader()}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={this.styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View>
              <View style={this.styles.introCard}>
                {this.renderSubheading()}
              </View>
              {!this.state.countryCodeFetched ? (
                <View style={this.styles.loadingContainer1}>
                  <ActivityIndicator size={"large"} color={theme.primary} />
                </View>
              ) : (
                <View style={this.styles.formWrap}>
                  {this.renderName()}
                  {this.renderError(this.state.nameError)}

                  {this.renderPhoneNumber()}
                  {this.renderError(this.state.phoneError)}

                  {this.renderEmail()}
                  {this.renderError(this.state.emailError)}

                  {this.renderSubject()}
                  {this.renderError(this.state.subjectError)}

                  {this.renderMessage()}
                  {this.renderError(this.state.messageError)}

                  <TouchableOpacity
                    testID="sendMessageBtn"
                    style={this.styles.button}
                    onPress={this.postContactAPI}
                    activeOpacity={0.85}
                  >
                    <Text style={this.styles.sendButtonText}>Send message</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
            {this.renderCountryModal()}
            {this.renderCountryCodeModal()}
            {this.renderAndroidCountryCodeModal()}
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    );
  }
  // Customizable Area End
}

// Customizable Area Start
const createContactStyles = (theme: ContactTheme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      width: "100%",
      maxWidth: 650,
      alignSelf: "center",
      backgroundColor: theme.background,
    },
    scrollContent: {
      paddingBottom: 32,
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
    introCard: {
      marginHorizontal: 16,
      marginTop: 16,
      marginBottom: 4,
      padding: 16,
      borderRadius: 16,
      backgroundColor: theme.card,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border,
    },
    subheading: {
      lineHeight: 22,
      fontSize: 14,
      color: theme.muted,
    },
    formWrap: {
      marginHorizontal: 16,
      paddingBottom: 20,
    },
    textInputLabel: {
      fontWeight: "700",
      fontSize: 14,
      color: theme.foreground,
      marginTop: 18,
      marginBottom: 8,
    },
    textInput: {
      width: "100%",
      paddingHorizontal: 14,
      borderRadius: 14,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border,
      backgroundColor: theme.input,
      color: theme.foreground,
      height: 50,
      fontSize: 16,
    },
    messageInput: {
      lineHeight: 22,
      minHeight: 110,
      height: 110,
      paddingTop: 12,
    },
    button: {
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
      padding: 16,
      backgroundColor: theme.primary,
      width: "100%",
      marginTop: 28,
    },
    sendButtonText: {
      fontWeight: "700",
      fontSize: 16,
      color: "#FFFFFF",
    },
    errorText: {
      fontFamily: "OpenSans",
      alignSelf: "flex-start",
      color: "#DC2626",
      fontSize: 13,
      paddingTop: 4,
    },
    countryCodeContainer: {
      position: "absolute",
      left: 10,
      top: 5,
      height: 40,
      flexDirection: "row",
      alignItems: "center",
    },
    usFlagImg: {
      height: 22,
      width: 22,
      resizeMode: "contain",
      borderRadius: 11,
    },
    countryCodeChevron: {
      marginLeft: 6,
    },
    textCountryCode: {
      alignSelf: "center",
      marginLeft: 8,
      color: theme.foreground,
      fontWeight: "600",
    },
    centeredModalView: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: "rgba(8, 8, 15, 0.72)",
    },
    viewModal: {
      height: "30%",
      justifyContent: "space-between",
      backgroundColor: theme.card,
      borderTopEndRadius: 20,
      padding: 35,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 100,
    },
    pickerModal: {
      borderTopStartRadius: 20,
      padding: 15,
    },
    txtOutsideUS: {
      fontWeight: "700",
      fontSize: 26,
      lineHeight: 28,
      marginVertical: 10,
      color: theme.foreground,
    },
    txtOnlySupportUS: {
      fontSize: 18,
      color: theme.muted,
    },
    continueButton: {
      backgroundColor: theme.primary,
      width: "100%",
      padding: 15,
      borderRadius: 12,
      marginTop: 25,
    },
    textContinueButton: {
      color: "#FFFFFF",
      fontWeight: "700",
      fontSize: 18,
      alignSelf: "center",
    },
    textInputPhone: {
      paddingLeft: 110,
    },
    loadingContainer1: {
      minHeight: 180,
      alignItems: "center",
      justifyContent: "center",
    },
    androidPickerOverlay: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(8, 8, 15, 0.72)",
    },
    androidPickerCard: {
      width: "90%",
      maxHeight: "95%",
      backgroundColor: theme.card,
      padding: 10,
      borderRadius: 16,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border,
    },
    androidPickerRow: {
      marginVertical: 15,
    },
  });
};

const darkContactStyles = createContactStyles(redesignTheme);
const lightContactStyles = createContactStyles(lightTheme);
// Customizable Area End

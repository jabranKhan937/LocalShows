import React from "react";

// Customizable Area Start
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  StatusBar,
  Modal,
  SafeAreaView,
  Platform,
  ActivityIndicator,
} from "react-native";

import { colors } from "../../utilities/src/Colors";
import { leftArrow, usFlag } from "./assets";
import { getStorageData, removeStorageData } from "../../../framework/src/Utilities";
import { configJSON } from "./EmailAccountRegistrationController";
import { Picker } from '@react-native-picker/picker';
// Customizable Area End

import EmailAccountRegistrationController, {
  Props
} from "./EmailAccountRegistrationController";

export default class EmailAccountRegistration extends EmailAccountRegistrationController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }

  // Customizable Area Start
  renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <TouchableOpacity
          testID="navigationBackButton"
          style={styles.backArrowContainer}
          onPress={() => {
            this.props.navigation.goBack();
          }}
        >
          <Image source={leftArrow} style={styles.backArrow} />
        </TouchableOpacity>
        <Text style={[styles.text, styles.headerTitle]}>Sign up</Text>
      </View>
    )
  }

  renderName = () => {
    return (
      <>
        <Text style={[styles.text, styles.textInputLabel]}>Name</Text>
        <TextInput
          testID="txtInputName"
          placeholder="Enter your name"
          placeholderTextColor="#CBD5E1"
          style={styles.textInput}
          value={this.state.name}
          onChangeText={this.handleName}
        />
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

  renderEmail = () => {
    return (
      <>
        <Text style={[styles.text, styles.textInputLabel]}>
          Email address
        </Text>
        <TextInput
          testID="txtInputEmail"
          placeholder="Enter your email address"
          placeholderTextColor="#CBD5E1"
          style={styles.textInput}
          value={this.state.email}
          onChangeText={this.handleEmail}
          autoCapitalize="none"
          autoCorrect={false}
          underlineColorAndroid="transparent"
          keyboardType={Platform.OS === "android" ? "visible-password" : "default"}
        />
      </>
    )
  }

  renderPassword = () => {
    return (
      <>
        <Text style={[styles.text, styles.textInputLabel]}>
          Password
        </Text>
        <View style={styles.passwordViewContainer}>
          <TextInput
            testID="txtInputPassword"
            placeholder="Enter your password"
            placeholderTextColor="#CBD5E1"
            style={styles.pswrdInput}
            value={this.state.password}
            onChangeText={this.handlePasswordTxt}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={!this.state.showPassword}
            maxLength={16}
            onBlur={this.handlePasswordBlur}
          />
          <TouchableOpacity testID="passwordImage" style={styles.passwordImageContainer} onPress={this.handlePassword}>
            <Image source={require("../../../mobile/assets/images/password_eye.png")} style={[styles.passwordImage, { tintColor: this.state.showPassword ? "#475569" : "#3333CC" }]} />
          </TouchableOpacity>
        </View>
      </>
    )
  }

  renderConfirmPassword = () => {
    return (
      <>
        <Text style={[styles.text, styles.textInputLabel]}>
          Confirm Password
        </Text>
        <View style={styles.passwordViewContainer}>
          <TextInput
            testID="txtInputPasswordConfirm"
            placeholder="Enter your password"
            placeholderTextColor="#CBD5E1"
            style={styles.pswrdInput}
            value={this.state.reTypePassword}
            onChangeText={this.handleConfirmPasswordTxt}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={!this.state.showConfirmPassword}
            maxLength={16}
            onBlur={this.handleConfirmPasswordBlur}
          />
          <TouchableOpacity testID="confirmPasswordImage" style={styles.passwordImageContainer} onPress={this.handleConfirmPassword}>
            <Image source={require("../../../mobile/assets/images/password_eye.png")} style={[styles.passwordImage, { tintColor: this.state.showConfirmPassword ? "#475569" : "#3333CC" }]} />
          </TouchableOpacity>
        </View>
      </>
    )
  }

  renderCountry = () => {
    return (
      <>
        <Text style={[styles.text, styles.textInputLabel]}>
          Country
        </Text>
        {Platform.OS === "ios" ? this.renderCountryiOSDropdown() : this.renderCountryAndroidDropdown()}
      </>
    )
  }

  renderCountryiOSDropdown = () => {
    return (
      <TouchableOpacity
        testID="btnCountrySelect"
        style={[styles.textInput, styles.selector]}
        onPress={this.showCountryModal}
      >
        <Text style={[styles.text, styles.selectorText]}>
          {this.state.countrySelected || "Select a country"}
        </Text>
        <Image source={leftArrow} style={styles.downArrow} />
      </TouchableOpacity>
    )
  }

  renderCountryModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.countryClicked}
      >
        <TouchableWithoutFeedback testID="hideCountryModal" onPress={this.hideModalCountry}>
          <View style={styles.centeredView}>
            <TouchableWithoutFeedback>
              <View style={[styles.modalView, { borderTopStartRadius: 20, padding: 15 }]}>
                <Picker
                  testID="countryPickerModal"
                  selectedValue={this.state.countrySelected}
                  onValueChange={this.handleCountryValueiOS}
                >
                  {this.state.countries?.map(
                    ({ country_code, country_name }: { country_code: string; country_name: string }) => (
                      <Picker.Item key={country_code} label={country_name} value={country_name} />
                    )
                  )}
                </Picker>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    )
  }

  renderCountryAndroidDropdown = () => {
    return (
      <View style={[styles.textInput, styles.selector, {
        paddingHorizontal: 0
      }]}>
        <Picker
          testID="countryPicker"
          style={[styles.textInput, styles.selector]}
          itemStyle={[styles.text, styles.selectorText]}
          selectedValue={this.state.countrySelected}
          onValueChange={(countrySelected) => this.onSelectCountry(countrySelected)}
        >
          <Picker.Item label={this.state.countrySelected || "Select a country"} value={""} />
          {this.state.countries?.map(
            ({ country_code, country_name }: { country_code: string; country_name: string }) => (
              <Picker.Item key={country_code} label={country_name} value={country_name} />
            )
          )}
        </Picker>
        <Image source={leftArrow} style={styles.downArrow} />
      </View>
    )
  }

  renderState = () => {
    return (
      <>
        <Text style={[styles.text, styles.textInputLabel]}>State</Text>
        {Platform.OS === "ios" ? this.renderStateiOS() : this.renderStateAndroid()}
      </>
    )
  }

  renderStateiOS = () => {
    return (
      <TouchableOpacity
        testID="btnStateSelect"
        style={[styles.textInput, styles.selector, { opacity: this.dynamicOpacity(this.state.countrySelected !== "" && this.state.countrySelected === "United States") }]}
        onPress={this.showStateModal}
        disabled={this.state.countrySelected === "" || this.state.countrySelected !== "United States"}
      >
        <Text style={[styles.text, styles.selectorText]}>
          {this.state.selectedState || "Select a state"}
        </Text>
        <Image source={leftArrow} style={styles.downArrow} />
      </TouchableOpacity>
    )
  }

  renderStateModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.stateClicked}
      >
        <TouchableWithoutFeedback testID="hideStateModal" onPress={this.hideModalState}>
          <View style={styles.centeredView}>
            <TouchableWithoutFeedback>
              <View style={[styles.modalView, { borderTopStartRadius: 20, padding: 15 }]}>
                <Picker
                  testID="statePickerModal"
                  selectedValue={this.state.selectedState}
                  onValueChange={this.handleStateValueiOS}
                >
                  {this.state.states.map(
                    ({ key, name }: { key: string; name: string }) => (
                      <Picker.Item key={key} label={name} value={name} />
                    )
                  )}
                </Picker>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    )
  }

  renderStateAndroid = () => {
    return (
      <View
        style={[styles.textInput, styles.selector, {
          paddingHorizontal: 0,
          opacity: this.dynamicOpacity(this.state.countrySelected !== "" && this.state.countrySelected === "United States")
        }]}>
        <Picker
          testID="statePicker"
          style={[styles.textInput, styles.selector]}
          itemStyle={[styles.text, styles.selectorText]}
          selectedValue={this.state.selectedState}
          onValueChange={(selectedState) => this.onSelectState(selectedState)}
          enabled={this.state.countrySelected !== "" && this.state.countrySelected === "United States"}
        >
          <Picker.Item label={this.state.selectedState || "Select a state"} value={""} />
          {this.state.states.map(
            ({ key, name }: { key: string; name: string }) => (
              <Picker.Item key={key} label={name} value={name} />
            )
          )}
        </Picker>
        <Image source={leftArrow} style={styles.downArrow} />
      </View>
    )
  }

  renderCity = () => {
    return (
      <>
        <Text style={[styles.text, styles.textInputLabel]}>City</Text>
        {Platform.OS === "ios" ? this.renderCityiOS() : this.renderCityAndroid()}
      </>
    )
  }

  renderCityiOS = () => {
    return (
      <TouchableOpacity
        testID="btnCitySelect"
        style={[styles.textInput, styles.selector, { opacity: this.dynamicOpacity(this.state.selectedState) }]}
        onPress={this.showCityModal}
        disabled={this.state.selectedState === ""}
      >
        <Text style={[styles.text, styles.selectorText]}>
          {this.state.selectedCity || "Select a city"}
        </Text>
        <Image source={leftArrow} style={styles.downArrow} />
      </TouchableOpacity>
    )
  }

  renderCityModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.cityClicked}
      >
        <TouchableWithoutFeedback testID="hideCityModal" onPress={this.hideModalCity}>
          <View style={styles.centeredView}>
            <TouchableWithoutFeedback>
              <View style={[styles.modalView, { borderTopStartRadius: 20, padding: 15 }]}>
                <Picker
                  testID="cityPickerModal"
                  selectedValue={this.state.selectedCity}
                  onValueChange={this.handleCityValueiOS}
                >
                  {this.state.cities?.map(
                    (name: string) => (
                      <Picker.Item key={name} label={name} value={name} />
                    )
                  )}
                </Picker>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    )
  }

  renderCityAndroid = () => {
    return (
      <View style={[styles.textInput, styles.selector, {
        paddingHorizontal: 0,
        opacity: this.dynamicOpacity(this.state.selectedState)
      }]}>
        <Picker
          testID="cityPicker"
          style={[styles.textInput, styles.selector]}
          itemStyle={[styles.text, styles.selectorText]}
          selectedValue={this.state.selectedCity}
          onValueChange={this.handleCityValueAndroid}
          enabled={this.state.selectedState !== ""}
        >
          <Picker.Item label={"Select a city"} value={""} />
          {this.state.cities?.map(
            (name: string) => (
              <Picker.Item key={name} label={name} value={name} />
            )
          )}
        </Picker>
        <Image source={leftArrow} style={styles.downArrow} />
      </View>
    )
  }

  renderPhone = () => {
    return (
      <>
        <Text style={[styles.text, styles.textInputLabel]}>
          Cell phone
        </Text>
        {Platform.OS === "ios" ?
          <View>
            <TextInput
              style={[styles.textInput, styles.textInputPhone]}
              testID="txtInputPhone"
              keyboardType="numeric"
              value={this.state.phone}
              onChangeText={this.handlePhoneTxtChange}
              maxLength={10}
            />
            {this.renderCountryCodeiOS()}
          </View>
          :
          this.renderCountryCodeAndroid()
        }
      </>
    )
  }

  renderCountryCodeModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.countryCodeClicked}
      >
        <TouchableWithoutFeedback testID="hideCountryCodeModal" onPress={this.hideModalCountryCode}>
          <View style={styles.centeredView}>
            <TouchableWithoutFeedback>
              <View style={[styles.modalView, { borderTopStartRadius: 20, padding: 15 }]}>
                <Picker
                  testID="countryCodePickerModal"
                  selectedValue={this.state.countryCodeSelected}
                  onValueChange={this.handleCountryCodeiOS}
                >
                  {this.state.countryCodes?.map(
                    (item: any) => (
                      <Picker.Item key={item.id}
                        label={`${item.attributes.name} (+${item.attributes.country_code})`}
                        value={item} />
                    )
                  )}
                </Picker>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    )
  }

  renderCountryCodeiOS = () => {
    const hasFlag = this.state.countryCodeSelected && Object.keys(this.state.countryCodeSelected).length > 0
    const code = this.state.countryCodeSelected && Object.keys(this.state.countryCodeSelected).length > 0 ? `+${this.state.countryCodeSelected.attributes.country_code}` : ""
    return (
      <TouchableOpacity
        testID="btnCountryCodeSelect"
        style={styles.countryCodeContainer}
        onPress={this.showCountryCodePicker}
      >
        <Image source={hasFlag ? { uri: this.state.countryCodeSelected.attributes.map_url } : usFlag} style={styles.usFlag} />
        <Image
          source={leftArrow}
          style={[styles.downArrow, styles.countryCodeArrow]}
        />
        <Text
          style={[styles.text, styles.textCountryCode]}
        >{code}</Text>
      </TouchableOpacity>
    )
  }

  renderCountryCodeAndroid = () => {
    const hasFlag = this.state.countryCodeSelected && Object.keys(this.state.countryCodeSelected).length > 0
    const code = this.state.countryCodeSelected && Object.keys(this.state.countryCodeSelected).length > 0 ? `+${this.state.countryCodeSelected.attributes.country_code}` : ""
    return (
      <View>
        <TextInput
          style={[styles.textInput, styles.textInputPhone]}
          testID="txtInputPhone"
          keyboardType="numeric"
          value={this.state.phone}
          onChangeText={this.handlePhoneTxtChange}
          maxLength={10}
        />
        <TouchableOpacity
          testID="btnCountryCodeSelect"
          style={styles.countryCodeContainer}
          onPress={() => { this.setState({ countryCodeClickedAndroid: true }) }}
        >
          <Image source={hasFlag ? { uri: this.state.countryCodeSelected.attributes.map_url } : usFlag} style={styles.usFlag} />
          <Image
            source={leftArrow}
            style={[styles.downArrow, styles.countryCodeArrow]}
          />
          <Text
            style={[styles.text, styles.textCountryCode]}
          >{code}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  renderTAndC = () => {
    return (
      <View style={styles.checkboxContainer}>
        <TouchableOpacity style={styles.checkbox}
          testID="btnAcceptTerms"
          onPress={this.handleTAndC}
        >
          {this.state.acceptTermsConditions && (
            <View style={styles.checkboxSelected} />
          )}
        </TouchableOpacity>
        <View>
          <Text style={styles.text}>I have read and agree to these</Text>
          <TouchableOpacity
            testID="btnLegalTermsAndCondition"
            onPress={() => this.goToTermsAndConditions()}
          >
            <Text style={styles.textLink}>Terms and Conditions.</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  renderOptEmail = () => {
    return (
      <View style={styles.checkboxContainer}>
        <TouchableOpacity
          style={styles.checkbox}
          testID="btnOptIn"
          onPress={this.handleOptEmail}
        >
          {this.state.optInEmails && (
            <View style={styles.checkboxSelected} />
          )}
        </TouchableOpacity>
        <Text style={styles.text}>
          {`I would like to receive emails with the last\nevents (optional).`}
        </Text>
      </View>
    )
  }

  renderAgeLimit = () => {
    return (
      <View style={styles.checkboxContainer}>
        <TouchableOpacity
          style={styles.checkbox}
          testID="btnEighteenPlus"
          onPress={this.handleEighteenPlus}
        >
          {this.state.isEighteenPlus && (
            <View style={styles.checkboxSelected} />
          )}
        </TouchableOpacity>
        <Text style={styles.text}>
          {`Are you 18 or older?`}
        </Text>
      </View>
    )
  }

  renderBottom = () => {
    return (
      <View style={styles.loginPromptContainer}>
        <Text style={[styles.text, styles.textLogin]}>
          {"Already have an account?"}
        </Text>
        <TouchableOpacity
          testID="btnLogin"
          onPress={this.handleLogin}
        >
          <Text style={styles.textLink}>{" Log in"}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  renderCountryAlertModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.modalVisible}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.textOutsideUS}>
              Are you outside the US?
            </Text>
            <Text style={[styles.text, styles.textOnlySupportUS]}>
              We only support the United States right now.
            </Text>
            <TouchableOpacity
              testID="btnAccept"
              style={styles.continueButton}
              onPress={this.closeCountryAlert}
            >
              <Text style={[styles.text, styles.textContinueButton]}>
                Accept
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    )
  }
  // Customizable Area End

  render() {
    return (
      <KeyboardAvoidingView
        behavior={this.isPlatformiOS() ? "padding" : undefined}
        style={styles.keyboardPadding}
      >
        <ScrollView keyboardShouldPersistTaps="always" style={styles.container}>
          <TouchableWithoutFeedback
            testID={"Background"}
            onPress={() => {
              this.hideKeyboard();
            }}
          >
            {/* Customizable Area Start */}
            <SafeAreaView>
              <View style={styles.contentContainer}>
                <StatusBar barStyle="dark-content" backgroundColor="white" />
                {this.renderHeader()}
                {this.renderName()}
                {this.renderError(this.state.nameError)}
                {this.renderEmail()}
                {this.renderError(this.state.emailError)}
                {this.renderPassword()}
                {this.renderError(this.state.passwordError)}
                {this.renderConfirmPassword()}
                {this.renderError(this.state.confirmPasswordError)}
                {this.renderCountry()}
                {this.renderError(this.state.countryError)}
                {this.renderState()}
                {this.renderError(this.state.stateError)}
                {this.renderCity()}
                {this.renderError(this.state.cityError)}
                {this.renderPhone()}
                {this.renderError(this.state.phoneError)}
                {this.renderTAndC()}
                {this.renderOptEmail()}
                {this.renderAgeLimit()}
                <TouchableOpacity
                  testID="btnContinue"
                  style={[
                    styles.continueButton,
                    { opacity: this.dynamicOpacity(this.state.acceptTermsConditions && !this.state.isLoading) },
                  ]}
                  onPress={() => this.createAccount()}
                  disabled={!this.state.acceptTermsConditions || this.state.isLoading}
                >
                  {this.state.isLoading ? (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator size="small" color="#FFFFFF" />
                      <Text style={[styles.text, styles.textContinueButton, { marginLeft: 10 }]}>
                        Creating Account...
                      </Text>
                    </View>
                  ) : (
                    <Text style={[styles.text, styles.textContinueButton]}>
                      Continue
                    </Text>
                  )}
                </TouchableOpacity>
                {this.renderBottom()}
              </View>
              {this.renderCountryModal()}
              {this.renderCountryAlertModal()}
              {this.renderCityModal()}
              {this.renderStateModal()}
              {this.renderCountryCodeModal()}

              <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.countryCodeClickedAndroid}>
                <View style={styles.androidCountryCodeModalView}>
                  <View style={styles.androidCCModal}>
                    <ScrollView>
                      {this.state.countryCodes.map((item: any) => (
                        <TouchableOpacity testID="countryCode" key={item.attributes.country_code} style={{ marginVertical: 15, }} onPress={() => this.handleCountryCodeAndroid(item)}>
                          <Text style={{ color: 'black', }}>{`${item.attributes.name} (+${item.attributes.country_code})`}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                </View>
              </Modal>

            </SafeAreaView>
            {/* Customizable Area End */}
          </TouchableWithoutFeedback>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  async componentDidMount() {
    // Customizable Area Start
    const userRole = await getStorageData("userRole");
    this.setState({ userRole: configJSON[userRole] });
    this.props.navigation.addListener("willFocus", async () => {
      const tAndCAcceptance = await getStorageData("tAndCAcceptance");
      if (tAndCAcceptance) {
        removeStorageData("tAndCAcceptance");
        this.setState({ acceptTermsConditions: tAndCAcceptance })
      }
    });
    // Customizable Area End
  }
}

const styles = StyleSheet.create({
  // Customizable Area Start
  container: {
    flex: 1,
    padding: 16,
    marginLeft: "auto",
    marginRight: "auto",
    width: "100%",
    maxWidth: 650,
    backgroundColor: "#fff",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
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
    fontSize: 30,
  },
  contentContainer: {
    flex: 1,
    marginBottom: 30,
  },
  text: {
    fontFamily: "OpenSans",
    alignSelf: "flex-start",
    color: colors(false).text,
  },
  errorText: {
    color: 'red',
    fontSize: 13,
    paddingTop: 2,
  },
  keyboardPadding: {
    flex: 1,
  },
  textInputLabel: {
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
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
  selector: {
    height: 50,
    justifyContent: "center",
  },
  downArrow: {
    position: "absolute",
    right: 15,
    marginRight: 5,
    width: 8,
    backgroundColor: 'white',
    transform: [{ rotate: "-90deg" }],
    resizeMode: "contain",
  },
  selectorText: {},
  textInputPhone: {
    paddingLeft: 110,
  },
  countryCodeContainer: {
    position: "absolute",
    left: 10,
    top: 12.5,
    flexDirection: "row",
    alignItems: "center",
    height: 25,
    justifyContent: "center",
  },
  usFlag: {
    height: 20,
    width: 20,
    resizeMode: "contain",
    alignSelf: "center",
  },
  countryCodeArrow: {
    position: "relative",
    right: 0,
    marginLeft: 10,
    backgroundColor: 'transparent',
  },
  textCountryCode: {
    alignSelf: "center",
    marginLeft: 8,
    fontSize: 16,
    lineHeight: 20,
  },
  checkboxContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  checkbox: {
    height: 20,
    width: 20,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: colors(false).text,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxSelected: {
    height: 12,
    width: 12,
    backgroundColor: "#3333CC",
    borderRadius: 2.5,
  },
  textLink: {
    fontWeight: "bold",
    color: "#4949EE",
  },
  continueButton: {
    backgroundColor: "#3333CC",
    width: "100%",
    padding: 15,
    borderRadius: 10,
    marginTop: 25,
  },
  textContinueButton: {
    color: colors(false).white,
    fontWeight: "700",
    fontSize: 18,
    alignSelf: "center",
  },
  textLogin: {},
  loginPromptContainer: {
    alignSelf: "center",
    marginTop: 20,
    flexDirection: "row",
  },
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "#33415580",
  },
  modalView: {
    height: "30%",
    justifyContent: "space-between",
    backgroundColor: "white",
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
  textOutsideUS: {
    fontWeight: "700",
    fontSize: 26,
    lineHeight: 28,
    marginVertical: 10,
    color: "#0F172A",
  },
  textOnlySupportUS: {
    fontSize: 18,
  },
  passwordViewContainer: {
    width: "100%",
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: "#C5C5FF",
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pswrdInput: {
    color: colors(false).text,
    width: '80%',
  },
  passwordImageContainer: {
    justifyContent: 'center',
  },
  passwordImage: {
    height: 20,
    width: 30,
    resizeMode: 'contain',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d1d1',
    borderRadius: 8,
    paddingLeft: 10,
  },
  picker: {
    width: 100,
  },
  input: {
    flex: 1,
    height: 40,
    paddingLeft: 10,
  },
  androidCountryCodeModalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000080',
  },
  androidCCModal: {
    width: '90%',
    maxHeight: '95%',
    backgroundColor: '#FFFFFF',
    padding: 10,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Customizable Area End
});

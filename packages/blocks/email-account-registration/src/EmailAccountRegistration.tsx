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

import { redesignTheme } from "../../utilities/src/Colors";
import { leftArrow, usFlag } from "./assets";
import { getStorageData, removeStorageData } from "../../../framework/src/Utilities";
import { configJSON } from "./EmailAccountRegistrationController";
import { Picker } from '@react-native-picker/picker';
// Customizable Area End

import EmailAccountRegistrationController, {
  Props
} from "./EmailAccountRegistrationController";

type SignupTheme = typeof redesignTheme;

export default class EmailAccountRegistration extends EmailAccountRegistrationController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }

  get styles() {
    return createSignupStyles(this.getSignupTheme());
  }

  // Customizable Area Start
  renderHeader = () => {
    const styles = this.styles;
    const theme = this.getSignupTheme();
    return (
      <View style={styles.headerContainer}>
        <TouchableOpacity
          testID="navigationBackButton"
          style={styles.backArrowContainer}
          onPress={() => {
            this.props.navigation.goBack();
          }}
        >
          <Image source={leftArrow} style={[styles.backArrow, { tintColor: theme.foreground }]} />
        </TouchableOpacity>
        <Text style={[styles.text, styles.headerTitle]}>Sign up</Text>
      </View>
    )
  }

  renderName = () => {
    const styles = this.styles;
    const theme = this.getSignupTheme();
    return (
      <>
        <Text style={[styles.text, styles.textInputLabel]}>Name</Text>
        <TextInput
          testID="txtInputName"
          placeholder="Enter your name"
          placeholderTextColor={theme.muted}
          style={styles.textInput}
          value={this.state.name}
          onChangeText={this.handleName}
        />
      </>
    )
  }

  renderError = (errorType: string) => {
    const styles = this.styles;
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
    const styles = this.styles;
    const theme = this.getSignupTheme();
    return (
      <>
        <Text style={[styles.text, styles.textInputLabel]}>
          Email address
        </Text>
        <TextInput
          testID="txtInputEmail"
          placeholder="Enter your email address"
          placeholderTextColor={theme.muted}
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
    const styles = this.styles;
    const theme = this.getSignupTheme();
    return (
      <>
        <Text style={[styles.text, styles.textInputLabel]}>
          Password
        </Text>
        <View style={styles.passwordViewContainer}>
          <TextInput
            testID="txtInputPassword"
            placeholder="Enter your password"
            placeholderTextColor={theme.muted}
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
            <Image source={require("../../../mobile/assets/images/password_eye.png")} style={[styles.passwordImage, { tintColor: this.state.showPassword ? theme.muted : theme.primary }]} />
          </TouchableOpacity>
        </View>
      </>
    )
  }

  renderConfirmPassword = () => {
    const styles = this.styles;
    const theme = this.getSignupTheme();
    return (
      <>
        <Text style={[styles.text, styles.textInputLabel]}>
          Confirm Password
        </Text>
        <View style={styles.passwordViewContainer}>
          <TextInput
            testID="txtInputPasswordConfirm"
            placeholder="Enter your password"
            placeholderTextColor={theme.muted}
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
            <Image source={require("../../../mobile/assets/images/password_eye.png")} style={[styles.passwordImage, { tintColor: this.state.showConfirmPassword ? theme.muted : theme.primary }]} />
          </TouchableOpacity>
        </View>
      </>
    )
  }

  renderCountry = () => {
    const styles = this.styles;
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
    const styles = this.styles;
    const theme = this.getSignupTheme();
    return (
      <TouchableOpacity
        testID="btnCountrySelect"
        style={[styles.textInput, styles.selector]}
        onPress={this.showCountryModal}
      >
        <Text style={[styles.text, styles.selectorText, !this.state.countrySelected && { color: theme.muted }]}>
          {this.state.countrySelected || "Select a country"}
        </Text>
        <Image source={leftArrow} style={[styles.downArrow, { tintColor: theme.muted }]} />
      </TouchableOpacity>
    )
  }

  renderCountryModal = () => {
    const styles = this.styles;
    const theme = this.getSignupTheme();
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
                  itemStyle={{ color: theme.foreground }}
                >
                  {this.state.countries?.map(
                    ({ country_code, country_name }: { country_code: string; country_name: string }) => (
                      <Picker.Item key={country_code} label={country_name} value={country_name} color={theme.foreground} />
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
    const styles = this.styles;
    const theme = this.getSignupTheme();
    return (
      <View style={[styles.textInput, styles.selector, {
        paddingHorizontal: 0
      }]}>
        <Picker
          testID="countryPicker"
          style={[styles.textInput, styles.selector, { color: theme.foreground }]}
          itemStyle={[styles.text, styles.selectorText]}
          selectedValue={this.state.countrySelected}
          onValueChange={(countrySelected) => this.onSelectCountry(countrySelected)}
          dropdownIconColor={theme.muted}
        >
          <Picker.Item label={this.state.countrySelected || "Select a country"} value={""} color={theme.foreground} />
          {this.state.countries?.map(
            ({ country_code, country_name }: { country_code: string; country_name: string }) => (
              <Picker.Item key={country_code} label={country_name} value={country_name} color={theme.foreground} />
            )
          )}
        </Picker>
        <Image source={leftArrow} style={[styles.downArrow, { tintColor: theme.muted }]} />
      </View>
    )
  }

  renderState = () => {
    const styles = this.styles;
    return (
      <>
        <Text style={[styles.text, styles.textInputLabel]}>State</Text>
        {Platform.OS === "ios" ? this.renderStateiOS() : this.renderStateAndroid()}
      </>
    )
  }

  renderStateiOS = () => {
    const styles = this.styles;
    const theme = this.getSignupTheme();
    return (
      <TouchableOpacity
        testID="btnStateSelect"
        style={[styles.textInput, styles.selector, { opacity: this.dynamicOpacity(this.state.countrySelected !== "" && this.state.countrySelected === "United States") }]}
        onPress={this.showStateModal}
        disabled={this.state.countrySelected === "" || this.state.countrySelected !== "United States"}
      >
        <Text style={[styles.text, styles.selectorText, !this.state.selectedState && { color: theme.muted }]}>
          {this.state.selectedState || "Select a state"}
        </Text>
        <Image source={leftArrow} style={[styles.downArrow, { tintColor: theme.muted }]} />
      </TouchableOpacity>
    )
  }

  renderStateModal = () => {
    const styles = this.styles;
    const theme = this.getSignupTheme();
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
                  itemStyle={{ color: theme.foreground }}
                >
                  {this.state.states.map(
                    ({ key, name }: { key: string; name: string }) => (
                      <Picker.Item key={key} label={name} value={name} color={theme.foreground} />
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
    const styles = this.styles;
    const theme = this.getSignupTheme();
    return (
      <View
        style={[styles.textInput, styles.selector, {
          paddingHorizontal: 0,
          opacity: this.dynamicOpacity(this.state.countrySelected !== "" && this.state.countrySelected === "United States")
        }]}>
        <Picker
          testID="statePicker"
          style={[styles.textInput, styles.selector, { color: theme.foreground }]}
          itemStyle={[styles.text, styles.selectorText]}
          selectedValue={this.state.selectedState}
          onValueChange={(selectedState) => this.onSelectState(selectedState)}
          enabled={this.state.countrySelected !== "" && this.state.countrySelected === "United States"}
          dropdownIconColor={theme.muted}
        >
          <Picker.Item label={this.state.selectedState || "Select a state"} value={""} color={theme.foreground} />
          {this.state.states.map(
            ({ key, name }: { key: string; name: string }) => (
              <Picker.Item key={key} label={name} value={name} color={theme.foreground} />
            )
          )}
        </Picker>
        <Image source={leftArrow} style={[styles.downArrow, { tintColor: theme.muted }]} />
      </View>
    )
  }

  renderCity = () => {
    const styles = this.styles;
    return (
      <>
        <Text style={[styles.text, styles.textInputLabel]}>City</Text>
        {Platform.OS === "ios" ? this.renderCityiOS() : this.renderCityAndroid()}
      </>
    )
  }

  renderCityiOS = () => {
    const styles = this.styles;
    const theme = this.getSignupTheme();
    return (
      <TouchableOpacity
        testID="btnCitySelect"
        style={[styles.textInput, styles.selector, { opacity: this.dynamicOpacity(this.state.selectedState) }]}
        onPress={this.showCityModal}
        disabled={this.state.selectedState === ""}
      >
        <Text style={[styles.text, styles.selectorText, !this.state.selectedCity && { color: theme.muted }]}>
          {this.state.selectedCity || "Select a city"}
        </Text>
        <Image source={leftArrow} style={[styles.downArrow, { tintColor: theme.muted }]} />
      </TouchableOpacity>
    )
  }

  renderCityModal = () => {
    const styles = this.styles;
    const theme = this.getSignupTheme();
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
                  itemStyle={{ color: theme.foreground }}
                >
                  {this.state.cities?.map(
                    (name: string) => (
                      <Picker.Item key={name} label={name} value={name} color={theme.foreground} />
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
    const styles = this.styles;
    const theme = this.getSignupTheme();
    return (
      <View style={[styles.textInput, styles.selector, {
        paddingHorizontal: 0,
        opacity: this.dynamicOpacity(this.state.selectedState)
      }]}>
        <Picker
          testID="cityPicker"
          style={[styles.textInput, styles.selector, { color: theme.foreground }]}
          itemStyle={[styles.text, styles.selectorText]}
          selectedValue={this.state.selectedCity}
          onValueChange={this.handleCityValueAndroid}
          enabled={this.state.selectedState !== ""}
          dropdownIconColor={theme.muted}
        >
          <Picker.Item label={"Select a city"} value={""} color={theme.foreground} />
          {this.state.cities?.map(
            (name: string) => (
              <Picker.Item key={name} label={name} value={name} color={theme.foreground} />
            )
          )}
        </Picker>
        <Image source={leftArrow} style={[styles.downArrow, { tintColor: theme.muted }]} />
      </View>
    )
  }

  renderPhone = () => {
    const styles = this.styles;
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
    const styles = this.styles;
    const theme = this.getSignupTheme();
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
                  itemStyle={{ color: theme.foreground }}
                >
                  {this.state.countryCodes?.map(
                    (item: any) => (
                      <Picker.Item key={item.id}
                        label={`${item.attributes.name} (+${item.attributes.country_code})`}
                        value={item}
                        color={theme.foreground} />
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
    const styles = this.styles;
    const theme = this.getSignupTheme();
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
          style={[styles.downArrow, styles.countryCodeArrow, { tintColor: theme.muted }]}
        />
        <Text
          style={[styles.text, styles.textCountryCode]}
        >{code}</Text>
      </TouchableOpacity>
    )
  }

  renderCountryCodeAndroid = () => {
    const styles = this.styles;
    const theme = this.getSignupTheme();
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
            style={[styles.downArrow, styles.countryCodeArrow, { tintColor: theme.muted }]}
          />
          <Text
            style={[styles.text, styles.textCountryCode]}
          >{code}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  renderTAndC = () => {
    const styles = this.styles;
    return (
      <View style={styles.checkboxContainer}>
        <TouchableOpacity style={[
          styles.checkbox,
          this.state.acceptTermsConditions && styles.checkboxChecked,
        ]}
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
    const styles = this.styles;
    return (
      <View style={styles.checkboxContainer}>
        <TouchableOpacity
          style={[
            styles.checkbox,
            this.state.optInEmails && styles.checkboxChecked,
          ]}
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
    const styles = this.styles;
    return (
      <View style={styles.checkboxContainer}>
        <TouchableOpacity
          style={[
            styles.checkbox,
            this.state.isEighteenPlus && styles.checkboxChecked,
          ]}
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
    const styles = this.styles;
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
    const styles = this.styles;
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
    const theme = this.getSignupTheme();
    const styles = this.styles;
    return (
      <KeyboardAvoidingView
        behavior={this.isPlatformiOS() ? "padding" : undefined}
        style={[styles.keyboardPadding, { backgroundColor: theme.background }]}
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
              <View pointerEvents="none" style={styles.decorTop} />
              <View style={styles.contentContainer}>
                <StatusBar
                  barStyle={this.state.isDarkMode ? "light-content" : "dark-content"}
                  backgroundColor={theme.background}
                />
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
                          <Text style={{ color: theme.foreground }}>{`${item.attributes.name} (+${item.attributes.country_code})`}</Text>
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
    this.loadSignupTheme();
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

const createSignupStyles = (theme: SignupTheme) => StyleSheet.create({
  // Customizable Area Start
  container: {
    flex: 1,
    padding: 16,
    marginLeft: "auto",
    marginRight: "auto",
    width: "100%",
    maxWidth: 650,
    backgroundColor: theme.background,
  },
  decorTop: {
    position: "absolute",
    top: -90,
    right: -70,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: theme.primarySoft,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
    alignItems: "center",
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
    color: theme.primary,
  },
  contentContainer: {
    flex: 1,
    marginBottom: 30,
  },
  text: {
    fontFamily: "OpenSans",
    alignSelf: "flex-start",
    color: theme.foreground,
  },
  errorText: {
    color: '#D32F2F',
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
    fontSize: 16,
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
    backgroundColor: "transparent",
    transform: [{ rotate: "-90deg" }],
    resizeMode: "contain",
  },
  selectorText: {
    color: theme.foreground,
  },
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
    backgroundColor: "transparent",
  },
  textCountryCode: {
    alignSelf: "center",
    marginLeft: 8,
    fontSize: 16,
    lineHeight: 20,
    color: theme.foreground,
  },
  checkboxContainer: {
    flexDirection: "row",
    marginTop: 20,
    alignItems: "center",
  },
  checkbox: {
    height: 22,
    width: 22,
    borderWidth: 1.5,
    borderRadius: 6,
    borderColor: theme.muted,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.input,
  },
  checkboxChecked: {
    borderColor: theme.primary,
    backgroundColor: theme.primarySoft,
  },
  checkboxSelected: {
    height: 12,
    width: 12,
    backgroundColor: theme.primary,
    borderRadius: 3,
  },
  textLink: {
    fontWeight: "bold",
    color: theme.primary,
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
  textLogin: {
    color: theme.muted,
  },
  loginPromptContainer: {
    alignSelf: "center",
    marginTop: 20,
    flexDirection: "row",
  },
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(8, 8, 15, 0.72)",
  },
  modalView: {
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
  textOutsideUS: {
    fontWeight: "700",
    fontSize: 26,
    lineHeight: 28,
    marginVertical: 10,
    color: theme.foreground,
  },
  textOnlySupportUS: {
    fontSize: 18,
    color: theme.muted,
  },
  passwordViewContainer: {
    width: "100%",
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
    backgroundColor: theme.input,
    height: 50,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  pswrdInput: {
    color: theme.foreground,
    width: "80%",
  },
  passwordImageContainer: {
    justifyContent: "center",
  },
  passwordImage: {
    height: 20,
    width: 30,
    resizeMode: "contain",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.border,
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(8, 8, 15, 0.72)",
  },
  androidCCModal: {
    width: "90%",
    maxHeight: "95%",
    backgroundColor: theme.card,
    padding: 10,
    borderRadius: 16,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  // Customizable Area End
});

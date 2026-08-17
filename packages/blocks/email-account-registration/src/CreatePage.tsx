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
  Platform
} from "react-native";

import { colors } from "../../utilities/src/Colors";
import { leftArrow, usFlag } from "./assets";
import { Picker } from '@react-native-picker/picker';

// Customizable Area End

import CreatePageController, {
  Props,
  configJSON
} from "./CreatePageController";

export default class CreatePage extends CreatePageController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }

  // Customizable Area Start
  renderType = () => {
    return (
      <>
        <Text style={[styles.text, styles.textInputHeader]}>
          {configJSON.type}
        </Text>
        {
          Platform.OS === "ios" ? this.renderIOSTypePicker() : this.renderAndroidTypePicker()
        }
      </>
    )
  }

  renderIOSTypePicker = () => {
    return (
      <TouchableOpacity
        testID="btnTypeSelect"
        style={[
          styles.textInput,
          styles.selector,
        ]}
        onPress={this.openTypePicker}
      >
        <Text style={[styles.text, { marginHorizontal: 10 }]}>
          {this.state.selectedType ? this.getTypeDisplayLabel(this.state.selectedType) : `${configJSON.selectAType}`}
        </Text>
        <Image source={leftArrow} style={styles.downArrow} />
      </TouchableOpacity>
    )
  }

  renderAndroidTypePicker = () => {
    return (
      <View
        style={[
          styles.textInput,
          styles.selector,
          {
            paddingHorizontal: 0,
          }
        ]}
      >
        <Picker
          testID="typePicker"
          style={[styles.textInput, styles.selector]}
          itemStyle={[styles.text]}
          selectedValue={this.state.selectedType}
          onValueChange={selectedType => this.handleTypeSelection(selectedType)

          }
        >
          <Picker.Item
            label={configJSON.selectAType}
            value={""}
          />
          {this.state.typeList.map((name: string) => (
            <Picker.Item key={name} label={this.getTypeDisplayLabel(name)} value={name} />
          ))}
        </Picker>
        <Image source={leftArrow} style={styles.downArrow} />
      </View>
    )
  }


  renderError = (errorType: string) => {
    return (
      <>
        {errorType !== "" && (
          <Text style={[styles.text, styles.errorTextMsg]}>
            {errorType}
          </Text>
        )}
      </>
    )
  }

  renderNameOrLocationName = () => {
    return (
      <>
        <Text style={[styles.text, styles.textInputHeader]}>
          {this.state.userRole === "band" ? configJSON.name : configJSON.locationsName}
        </Text>
        <TextInput
          testID="txtInputName"
          placeholder={this.state.userRole === "band" ? configJSON.bandPlaceholder : configJSON.locationlaceholder}
          placeholderTextColor="#CBD5E1"
          style={styles.textInput}
          value={this.state.name}
          onChangeText={name => this.handleName(name)}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </>
    )
  }

  renderEmail = () => {
    return (
      <>
        <Text style={[styles.text, styles.textInputHeader]}>
          {configJSON.emailAddress}
        </Text>
        <TextInput
          testID="txtInputEmail"
          placeholder="Enter your email address"
          placeholderTextColor="#CBD5E1"
          style={styles.textInput}
          value={this.state.email}
          onChangeText={email => this.handleEmail(email.replace(" ", ""))}
          autoCapitalize="none"
          autoCorrect={false}
          underlineColorAndroid="transparent"
          keyboardType={
            Platform.OS === "android" ? "visible-password" : "default"
          }
        />
      </>
    )
  }

  renderPassword = () => {
    return (
      <>
        <Text style={[styles.text, styles.textInputHeader]}>
          Password
        </Text>
        <View style={styles.passwordContainer}>
          <TextInput
            testID="txtInputPassword"
            placeholder="Enter your password"
            placeholderTextColor="#CBD5E1"
            style={styles.passwordInput}
            value={this.state.password}
            onChangeText={password => this.handlePassword(password)}
            secureTextEntry={!this.state.showPassword}
            autoCapitalize="none"
            maxLength={16}
            autoCorrect={false}
          />
          <TouchableOpacity testID="passwordIcon" style={styles.passwordIconContainer} onPress={this.handlePasswordVisibility}>
            <Image source={require("../../../mobile/assets/images/password_eye.png")} style={[styles.passwordIcon, { tintColor: this.state.showPassword ? "#475569" : "#3333CC" }]} />
          </TouchableOpacity>
        </View>
      </>
    )
  }

  renderConfirmPassword = () => {
    return (
      <>
        <Text style={[styles.text, styles.textInputHeader]}>
          {configJSON.confirmPassword}
        </Text>
        <View style={styles.passwordContainer}>
          <TextInput
            testID="txtInputConfirmPassword"
            placeholder="Enter your password"
            placeholderTextColor="#CBD5E1"
            style={styles.passwordInput}
            value={this.state.confirmPassword}
            onChangeText={confirmPassword =>
              this.handleConfirmPassword(confirmPassword)
            }
            secureTextEntry={!this.state.showConfirmPassword}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity testID="confirmPasswordIcon" style={styles.passwordIconContainer} onPress={this.handleConfirmPasswordVisibility}>
            <Image source={require("../../../mobile/assets/images/password_eye.png")} style={[styles.passwordIcon, { tintColor: this.state.showConfirmPassword ? "#475569" : "#3333CC" }]} />
          </TouchableOpacity>
        </View>
      </>
    )
  }
 renderCountry = () => {
    return (
      <>
        <Text style={[styles.text, styles.textInputHeader]}>
          {configJSON.country}
        </Text>
        {Platform.OS === "ios"
          ? this.renderIOSCountryPicker()
          : this.renderAndroidCountryPicker()}
      </>
    );
  };

  renderIOSCountryPicker = () => {
    return (
      <TouchableOpacity
        testID="btnCountrySelect"
        style={[styles.textInput, styles.selector]}
        onPress={this.openCountryPicker}
      >
        <Text style={[styles.text, { marginHorizontal: 10 }]}>
          {this.state.selectedCountry || configJSON.selectACountry}
        </Text>
        <Image source={leftArrow} style={styles.downArrow} />
      </TouchableOpacity>
    );
  };

  renderAndroidCountryPicker = () => {
    return (
      <View style={[styles.textInput, styles.selector, { paddingHorizontal: 0 }]}>
        <Picker
          testID="countryPicker"
          style={[styles.textInput, styles.selector]}
          selectedValue={this.state.selectedCountry}
          onValueChange={selectedCountry =>
            this.handleCountryChange(selectedCountry)
          }
        >
          <Picker.Item label={configJSON.selectACountry} value={""} />

          {this.state.countryList
            .filter(
              ({ country_name }) =>
                country_name !== "Aland" &&
                country_name !== "country_name"
            )
            .map(({ country_code, country_name }) => (
              <Picker.Item
                key={country_code}
                label={country_name}
                value={country_name}
              />
            ))}
        </Picker>
        <Image source={leftArrow} style={styles.downArrow} />
      </View>
    );
  };


  
  renderState = () => {
    return (
      <>
        <Text style={[styles.text, styles.textInputHeader]}>
          {configJSON.state}
        </Text>
        {
          Platform.OS === "ios" ? this.renderIOSStatePicker() : this.renderAndroidStatePicker()
        }
      </>
    )
  }

  renderIOSStatePicker = () => {
    return (
      <TouchableOpacity
        testID="btnStateSelect"
        style={[
          styles.textInput,
          styles.selector,
          {
            opacity: this.dynamicOpacity(this.state.selectedCountry !== "" && this.state.selectedCountry === "United States")
          }
        ]}
        disabled={this.state.selectedCountry === "" || this.state.selectedCountry !== "United States"}
        onPress={this.openStatePicker}
      >
        <Text style={[styles.text, { marginHorizontal: 10 }]}>
          {this.state.selectedState || `${configJSON.selectAState}`}
        </Text>
        <Image source={leftArrow} style={styles.downArrow} />
      </TouchableOpacity>
    )
  }

  renderAndroidStatePicker = () => {
    return (
      <View
        style={[
          styles.textInput,
          styles.selector,
          {
            paddingHorizontal: 0,
            opacity: this.dynamicOpacity(this.state.selectedCountry !== "" && this.state.selectedCountry === "United States")
          }
        ]}
      >
        <Picker
          testID="statePicker"
          style={[styles.textInput, styles.selector]}
          itemStyle={[styles.text]}
          selectedValue={this.state.selectedState}
          onValueChange={selectedState => this.handleStateChange(selectedState)}
          enabled={this.state.selectedCountry !== "" && this.state.selectedCountry === "United States"}
        >
          <Picker.Item
            label={configJSON.selectAState}
            value={""}
          />
          {this.state.stateList.map(
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
        <Text style={[styles.text, styles.textInputHeader]}>
          {configJSON.city}
        </Text>
        {Platform.OS === "ios" ? this.renderIOSCityPicker() : this.renderAndroidCityPicker()}
      </>
    )
  }

  renderAddress = () => {
    return (
      <>
        <Text style={[styles.text, styles.textInputHeader]}>
          {configJSON.address || "Address"}
        </Text>
        <TextInput
          testID="txtInputAddress"
          placeholder="Enter your address"
          placeholderTextColor="#CBD5E1"
          style={[styles.textInput]}
          value={this.state.address}
          onChangeText={address => this.handleAddress(address)}
          autoCapitalize="words"
          autoCorrect={false}
        />
      </>
    )
  }

  renderZipCode = () => {
    return (
      <>
        <Text style={[styles.text, styles.textInputHeader,{ marginTop: -3 }]}>
          Zip Code
        </Text>
        <TextInput
          testID="txtInputZipCode"
          placeholder="Enter zip code"
          placeholderTextColor="#CBD5E1"
          style={[styles.textInput]}
          value={this.state.zipCode}
          onChangeText={zipCode => this.handleZipCode(zipCode)}
          keyboardType="numeric"
          maxLength={10}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </>
    )
  }

  renderIOSCityPicker = () => {
    return (
      <TouchableOpacity
        testID="btnCitySelect"
        style={[
          styles.textInput,
          styles.selector,
          {
            opacity: this.dynamicOpacity(this.state.selectedState)
          }
        ]}
        disabled={this.state.selectedState === ""}
        onPress={this.openCityPicker}>
        <Text style={[styles.text, { marginHorizontal: 10 }]}>
          {this.state.selectedCity || `${configJSON.selectACity}`}
        </Text>
        <Image source={leftArrow} style={styles.downArrow} />
      </TouchableOpacity>
    )
  }

  renderAndroidCityPicker = () => {
    return (
      <View style={[
        styles.textInput,
        styles.selector,
        {
          paddingHorizontal: 0,
          opacity: this.dynamicOpacity(this.state.selectedState)
        }
      ]}>
        <Picker
          testID="cityPicker"
          style={[styles.textInput, styles.selector]}
          itemStyle={[styles.text]}
          selectedValue={this.state.selectedCity}
          onValueChange={(selectedCity) => this.handleCityValueChange(selectedCity)}
          enabled={this.state.selectedState !== ""}>
          <Picker.Item label={"Select a city"} value={""} />
          {this.state.cityList?.map(
            (name: string) => (
              <Picker.Item key={name} label={name} value={name} />
            )
          )}
        </Picker>
        <Image source={leftArrow} style={styles.downArrow} />
      </View>
    )
  }

  renderCellPhone = () => {
    return (
      <>
        <Text style={[styles.text, styles.textInputHeader]}>
          {configJSON.cellPhone}
        </Text>
        {Platform.OS === "ios" ?
          <View>
            <TextInput
              style={styles.phoneTextInput}
              testID="txtInputPhone"
              keyboardType="numeric"
              value={this.state.phoneNumber}
              onChangeText={(phoneNumber) => this.handlePhoneNumber(phoneNumber)}
              maxLength={10}
            />
            {this.renderCountryCodePickeriOS()}
          </View>
          :
          this.renderCountryCodePickerAndroid()
        }
      </>
    )
  }

  renderCountryCodePickeriOS = () => {
    const hasFlag = this.state.selectedCountryCode && Object.keys(this.state.selectedCountryCode).length > 0
    const code = this.state.selectedCountryCode && Object.keys(this.state.selectedCountryCode).length > 0 ? `+${this.state.selectedCountryCode.attributes.country_code}` : "1"
    return (
      <TouchableOpacity
        testID="btnCountryCodeSelect"
        style={styles.countryCode}
        onPress={this.toogleCountryCodeModal}
      >
        <Image source={hasFlag ? { uri: this.state.selectedCountryCode.attributes.map_url } : usFlag} style={styles.countryFlag} />
        <Image
          source={leftArrow}
          style={[styles.downArrow, {
            position: "relative",
            right: 0,
            marginLeft: 10,
            backgroundColor: 'transparent',
          }]} />
        <Text
          style={styles.countryCodeText}
        >{code}</Text>
      </TouchableOpacity>
    )
  }

  renderCountryCodePickerAndroid = () => {
    const hasFlag = this.state.selectedCountryCode && Object.keys(this.state.selectedCountryCode).length > 0
    const code = this.state.selectedCountryCode && Object.keys(this.state.selectedCountryCode).length > 0 ? `+${this.state.selectedCountryCode.attributes.country_code}` : "1"
    return (
      <View>
        <TextInput
          style={styles.phoneTextInput}
          testID="txtInputPhone"
          keyboardType="numeric"
          value={this.state.phoneNumber}
          onChangeText={(phoneNumber) => this.handlePhoneNumber(phoneNumber)}
          maxLength={10}
        />
        <TouchableOpacity
          testID="btnCountryCodeSelectAndroid"
          style={styles.countryCode}
          onPress={() => { this.setState({ countryCodeClickedAndroid: true }) }}
        >
          <Image source={hasFlag ? { uri: this.state.selectedCountryCode.attributes.map_url } : usFlag} style={styles.countryFlag} />
          <Image
            source={leftArrow}
            style={[styles.downArrow, {
              position: "relative",
              right: 0,
              marginLeft: 10,
              backgroundColor: 'transparent',
            }]} />
          <Text
            style={styles.countryCodeText}>{code}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  renderTAndC = () => {
    return (
      <View style={styles.tAndCContainer}>
        <TouchableOpacity style={styles.tAndC}
          testID="btnAcceptTermsConditions"
          onPress={this.handleTAndC
          }
        >
          {this.state.acceptTermsConditions && (
            <View style={styles.tAndCSelected} />
          )}
        </TouchableOpacity>
        <View>
          <Text style={styles.text}>I have read and agree to these</Text>
          <TouchableOpacity
            testID="btnLegalTermsAndCondition"
            onPress={() => this.navigateToTermsAndConditions()}
          >
            <Text style={styles.textLink}>Terms and Conditions and Privacy Policy.</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  renderTypeModal = () => {
    return (
      <Modal
        transparent={true}
        visible={this.state.typeClicked}
        animationType="slide"
      >
        <TouchableWithoutFeedback testID="hideTypeModal" onPress={this.hideModalType}>
          <View style={styles.centeredModal}>
            <TouchableWithoutFeedback>
              <View
                style={[
                  styles.modalView,
                  { borderTopStartRadius: 20, padding: 15 }
                ]}
              >
                <Picker
                  selectedValue={this.state.selectedType}
                  testID="typePickerModal"
                  themeVariant="light"
                  itemStyle={styles.pickerItemStyle}
                  onValueChange={selectedType => this.handleTypeSelection(selectedType)} >
                  {this.state.typeList.map((name: string) => (
                    <Picker.Item key={name} label={this.getTypeDisplayLabel(name)} value={name} />
                  ))}
                </Picker>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    )
  }

  renderStateModal = () => {
    return (
      <Modal
        transparent={true}
        visible={this.state.stateClicked}
        animationType="slide"
      >
        <TouchableWithoutFeedback testID="hideStateModal" onPress={this.hideModalState}>
          <View style={styles.centeredModal}>
            <TouchableWithoutFeedback>
              <View
                style={[
                  styles.modalView,
                  { borderTopStartRadius: 20, padding: 15 }
                ]}
              >
                <Picker
                  selectedValue={this.state.selectedState}
                  testID="statePickerModal"
                  themeVariant="light"
                  itemStyle={styles.pickerItemStyle}
                  onValueChange={selectedState => this.handleStateChange(selectedState)}
                >
                  {this.state.stateList.map(
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

  renderCityModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.cityClicked} >
        <TouchableWithoutFeedback testID="hideCityModal" onPress={this.hideModalCity}>
          <View style={styles.centeredModal}>
            <TouchableWithoutFeedback>
              <View style={[
                styles.modalView,
                { borderTopStartRadius: 20, padding: 15 }
              ]}>
                <Picker
                  testID="cityPickerModal"
                  selectedValue={this.state.selectedCity}
                  themeVariant="light"
                  itemStyle={styles.pickerItemStyle}
                  onValueChange={(selectedCity) => this.handleCityValueChange(selectedCity)} >
                  {this.state.cityList?.map(
                    (name: string) => (
                      <Picker.Item key={name} value={name} label={name} />
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

  renderCountryChangeModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.countryModal}
      >
        <View style={styles.centeredModal}>
          <View style={styles.modalView}>
            <Text style={styles.outsideUS}>
              Are you outside the US?
            </Text>
            <Text style={styles.supportUS}>
              We only support the United States right now.
            </Text>
            <TouchableOpacity
              testID="btnAccept"
              style={styles.continueButton}
              onPress={this.hideCountryModal}
            >
              <Text style={styles.acceptText}>
                Accept
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    )
  }

  renderCountryModal = () => {
    return (
      <Modal
        transparent
        visible={this.state.countryClicked}
        animationType="slide"
      >
        <TouchableWithoutFeedback
          testID="hideCountryPickerModal"
          onPress={this.hideModalCountryPicker}
        >
          <View style={styles.centeredModal}>
            <TouchableWithoutFeedback>
              <View
                style={[
                  styles.modalView,
                  { borderTopStartRadius: 20, padding: 15 }
                ]}
              >
                <Picker
                  testID="countryPickerModal"
                  selectedValue={this.state.selectedCountry}
                  themeVariant="light"
                  itemStyle={styles.pickerItemStyle}
                  onValueChange={selectedCountry =>
                    this.handleCountryChange(selectedCountry)
                  }
                >
                  {this.state.countryList
                    .filter(
                      ({ country_name }) =>
                        country_name !== "Aland" &&
                        country_name !== "country_name"
                    )
                    .map(({ country_code, country_name }) => (
                      <Picker.Item
                        key={country_code}
                        label={country_name}
                        value={country_name}
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


  renderCountriesCodeListModal = () => {

    return (
      <Modal
        transparent={true}
        visible={this.state.countryCodeClicked}
        animationType="slide"
      >
        <TouchableWithoutFeedback testID="hideCountryCodePickerModal" onPress={this.toogleCountryCodeModal}>
          <View style={styles.centeredModal}>
            <TouchableWithoutFeedback>
              <View
                style={[
                  styles.modalView,
                  { borderTopStartRadius: 20, padding: 15 }
                ]}
              >
                <Picker
                  selectedValue={this.state.selectedCountryCode}
                  testID="countryCodePickerModal"
                  themeVariant="light"
                  itemStyle={styles.pickerItemStyle}
                  onValueChange={countryCodeSelected => this.handleCountryCodeSelectionIOS(countryCodeSelected)} >
                  {this.state.countryCodesList.map((countryCode) => (
                    <Picker.Item key={countryCode.id} label={countryCode.attributes.name} value={countryCode} />
                  ))}
                </Picker>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    )
  }

  renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <TouchableOpacity
          testID="backButton"
          style={styles.backArrowContainer}
          onPress={() => {
            this.props.navigation.goBack();
          }}>
          <Image source={leftArrow} style={styles.backArrow} />
        </TouchableOpacity>
        <Text testID="pageTitle" style={[styles.text, styles.headerTitle]}>
          {configJSON.createMyPage}
        </Text>
      </View>
    )
  }
  // Customizable Area End

  render() {
    return (
      <KeyboardAvoidingView
        behavior={this.isPlatformiOS() ? "padding" : undefined}
        style={styles.keyboardPadding}
      >
        {/* Customizable Area Start */}
        <ScrollView keyboardShouldPersistTaps="always" style={styles.container}>
          <TouchableWithoutFeedback
            testID={"Background"}
            onPress={() => {
              this.hideKeyboard();
            }} >
            <SafeAreaView>
              <View style={styles.mainContainer}>
                <StatusBar backgroundColor="white" barStyle="dark-content" />
                {this.renderHeader()}
                <View style={{ marginTop: 20 }}>
                  {this.renderType()}
                  {this.renderError(this.state.typeError)}
                  {this.renderNameOrLocationName()}
                  {this.renderError(this.state.nameError)}
                  {this.renderEmail()}
                  {this.renderError(this.state.emailError)}
                  {this.renderPassword()}
                  {this.renderError(this.state.passwordError)}
                  {this.renderConfirmPassword()}
                  {this.renderError(this.state.confirmPswrdError)}
                  {this.renderCountry()}
                  {this.renderError(this.state.countryError)}
                  {this.renderState()}
                  {this.renderError(this.state.stateError)}
                  {this.renderCity()}
                  {this.renderError(this.state.cityError)}
                  {this.shouldShowAddressField() && this.renderAddress()}
                  {this.shouldShowAddressField() && this.renderError(this.state.addressError)}
                  {this.renderZipCode()}
                  {this.renderError(this.state.zipCodeError)}
                  {this.renderCellPhone()}
                  {this.renderError(this.state.phoneError)}

                  {this.renderTAndC()}
                  <TouchableOpacity
                    testID="btnContinue"
                    style={[styles.continueButton, { opacity: this.dynamicOpacity(this.state.acceptTermsConditions) },]}
                    onPress={() => {
                      this.handleCreatePageAPI();
                    }}
                    disabled={!this.state.acceptTermsConditions}
                  >
                    <Text style={[styles.text, styles.continueText]}>
                      {configJSON.continue}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              {this.renderTypeModal()}
              {this.renderStateModal()}
              {this.renderCityModal()}
              {this.renderCountryModal()}
              {this.renderCountryChangeModal()}
              {this.renderCountriesCodeListModal()}

              <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.countryCodeClickedAndroid}>
                <View style={styles.androidCountryCodeModal}>
                  <View style={styles.androidCountryCodeView}>
                    <ScrollView>
                      {this.state.countryCodesList.map((item: any, index) => (
                        <TouchableOpacity testID={`countryCodeModal-${index}`} key={item.attributes.country_code} style={{ marginVertical: 15, }} onPress={() => this.handleCountryCodeValueChangeAndroid(item)}>
                          <Text style={{ color: 'black', }}>{`${item.attributes.name} (+${item.attributes.country_code})`}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                </View>
              </Modal>

            </SafeAreaView>
          </TouchableWithoutFeedback>
        </ScrollView>
        {/* Customizable Area End */}
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  // Customizable Area Start
  container: {
    flex: 1,
    padding: 16,
    width: "100%",
    backgroundColor: "#fff"
  },
  headerContainer: { 
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10
  },
  backArrowContainer: {
    position: "absolute",
    left: -10,
    alignSelf: "center",
    padding: 10
  },
  backArrow: {
    width: 12,
    left: 0,
    resizeMode: "contain"
  },
  headerTitle: {
    fontWeight: "bold",
    fontSize: 24,
    marginHorizontal: 30,
    textAlign: "center"
  },
  mainContainer: {
    flex: 1,
    marginBottom: 30,
    marginHorizontal: 10
  },
  keyboardPadding: {
    flex: 1
  },
  text: {
    fontFamily: "OpenSans",
    alignSelf: "flex-start",
    color: colors(false).text
  },
  textInputHeader: {
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10
  },
  textInput: {
    width: "100%",
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#C5C5FF",
    color: colors(false).text,
    height: 50,
    fontSize: 16
  },
  selector: {
    height: 50,
    justifyContent: "center",
    paddingHorizontal: 0
  },
  pickerItemStyle: {
    fontFamily: "OpenSans",
    color: "#0F172A",
    fontSize: 22,
    fontWeight: "400",
  },
  downArrow: {
    position: "absolute",
    right: 15,
    marginRight: 5,
    width: 8,
    backgroundColor: "white",
    transform: [{ rotate: "-90deg" }],
    resizeMode: "contain"
  },
  centeredModal: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "#33415580"
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
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 100
  },
  continueButton: {
    backgroundColor: "#3333CC",
    padding: 15,
    borderRadius: 10,
    marginTop: 35
  },
  continueText: {
    color: colors(false).white,
    fontWeight: "700",
    fontSize: 18,
    alignSelf: "center"
  },
  errorTextMsg: {
    color: "red",
    fontSize: 13,
    paddingTop: 2
  },
  phoneTextInput: {
    width: "100%",
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    color: colors(false).text,
    height: 50,
    paddingLeft: 115,
    fontSize: 16,
  },
  countryCode: {
    position: "absolute",
    left: 10,
    top: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  countryFlag: {
    height: 25,
    width: 25,
    resizeMode: "contain",
  },
  countryCodeText: {
    fontFamily: "OpenSans",
    color: colors(false).text,
    alignSelf: "center",
    marginLeft: 10,
    fontSize: 16,
  },
  tAndCContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  tAndC: {
    height: 20,
    width: 20,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: colors(false).text,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  tAndCSelected: {
    height: 12,
    width: 12,
    backgroundColor: "#3333CC",
    borderRadius: 2.5,
  },
  textLink: {
    fontWeight: "bold",
    color: "#4949EE",
  },
  passwordContainer: {
    width: "100%",
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
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
  androidCountryCodeModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000080',
  },
  androidCountryCodeView: {
    width: '90%',
    maxHeight: '95%',
    backgroundColor: '#FFFFFF',
    padding: 10,
  },
  outsideUS: {
    fontWeight: "700",
    fontSize: 26,
    lineHeight: 28,
    marginVertical: 10,
    color: "#0F172A",
  },
  supportUS: {
    fontFamily: "OpenSans",
    alignSelf: "flex-start",
    color: colors(false).text,
    fontSize: 18,
  },
  acceptText: {
    fontFamily: "OpenSans",
    color: colors(false).white,
    fontWeight: "700",
    fontSize: 18,
    alignSelf: "center",
  },
  passwordIconContainer: {
    justifyContent: 'center',
  },
  passwordIcon: {
    height: 20,
    width: 30,
    resizeMode: 'contain',
  },
  // Customizable Area End
});

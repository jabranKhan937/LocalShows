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

import { redesignTheme } from "../../utilities/src/Colors";
import { leftArrow, usFlag } from "./assets";
import { Picker } from '@react-native-picker/picker';

// Customizable Area End

import CreatePageController, {
  Props,
  configJSON
} from "./CreatePageController";

type CreatePageTheme = typeof redesignTheme;

export default class CreatePage extends CreatePageController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }

  get styles() {
    return createCreatePageStyles(this.getCreatePageTheme());
  }

  // Customizable Area Start
  renderType = () => {
    const styles = this.styles;
    const theme = this.getCreatePageTheme();
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
    const styles = this.styles;
    const theme = this.getCreatePageTheme();
    return (
      <TouchableOpacity
        testID="btnTypeSelect"
        style={[
          styles.textInput,
          styles.selector,
        ]}
        onPress={this.openTypePicker}
      >
        <Text style={[styles.text, { marginHorizontal: 10 }, !this.state.selectedType && { color: theme.muted }]}>
          {this.state.selectedType ? this.getTypeDisplayLabel(this.state.selectedType) : `${configJSON.selectAType}`}
        </Text>
        <Image source={leftArrow} style={[styles.downArrow, { tintColor: theme.muted }]} />
      </TouchableOpacity>
    )
  }

  renderAndroidTypePicker = () => {
    const styles = this.styles;
    const theme = this.getCreatePageTheme();
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
          style={{ width: "100%", height: 50, color: theme.foreground }}
          itemStyle={[styles.text]}
          dropdownIconColor={theme.muted}
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
        <Image source={leftArrow} style={[styles.downArrow, { tintColor: theme.muted }]} />
      </View>
    )
  }


  renderError = (errorType?: string) => {
    const styles = this.styles;
    if (!errorType) {
      return null;
    }
    return (
      <Text style={[styles.text, styles.errorTextMsg]}>
        {errorType}
      </Text>
    )
  }

  renderNameOrLocationName = () => {
    const styles = this.styles;
    const theme = this.getCreatePageTheme();
    return (
      <>
        <Text style={[styles.text, styles.textInputHeader]}>
          {this.state.userRole === "band" ? configJSON.name : configJSON.locationsName}
        </Text>
        <TextInput
          testID="txtInputName"
          placeholder={this.state.userRole === "band" ? configJSON.bandPlaceholder : configJSON.locationlaceholder}
          placeholderTextColor={theme.muted}
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
    const styles = this.styles;
    const theme = this.getCreatePageTheme();
    return (
      <>
        <Text style={[styles.text, styles.textInputHeader]}>
          {configJSON.emailAddress}
        </Text>
        <TextInput
          testID="txtInputEmail"
          placeholder="Enter your email address"
          placeholderTextColor={theme.muted}
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
    const styles = this.styles;
    const theme = this.getCreatePageTheme();
    return (
      <>
        <Text style={[styles.text, styles.textInputHeader]}>
          Password
        </Text>
        <View style={styles.passwordContainer}>
          <TextInput
            testID="txtInputPassword"
            key={this.state.showPassword ? "password-visible" : "password-hidden"}
            placeholder="Enter your password"
            placeholderTextColor={theme.muted}
            style={styles.passwordInput}
            value={this.state.password}
            onChangeText={password => this.handlePassword(password)}
            secureTextEntry={!this.state.showPassword}
            autoCapitalize="none"
            maxLength={16}
            autoCorrect={false}
            textContentType="newPassword"
            autoComplete="password-new"
          />
          <TouchableOpacity testID="passwordIcon" style={styles.passwordIconContainer} onPress={this.handlePasswordVisibility}>
            <Image source={require("../../../mobile/assets/images/password_eye.png")} style={[styles.passwordIcon, { tintColor: this.state.showPassword ? theme.muted : theme.primary }]} />
          </TouchableOpacity>
        </View>
      </>
    )
  }

  renderConfirmPassword = () => {
    const styles = this.styles;
    const theme = this.getCreatePageTheme();
    return (
      <>
        <Text style={[styles.text, styles.textInputHeader]}>
          {configJSON.confirmPassword}
        </Text>
        <View style={styles.passwordContainer}>
          <TextInput
            testID="txtInputConfirmPassword"
            key={
              this.state.showConfirmPassword
                ? "confirm-password-visible"
                : "confirm-password-hidden"
            }
            placeholder="Enter your password"
            placeholderTextColor={theme.muted}
            style={styles.passwordInput}
            value={this.state.confirmPassword}
            onChangeText={confirmPassword =>
              this.handleConfirmPassword(confirmPassword)
            }
            secureTextEntry={!this.state.showConfirmPassword}
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="newPassword"
            autoComplete="password-new"
          />
          <TouchableOpacity testID="confirmPasswordIcon" style={styles.passwordIconContainer} onPress={this.handleConfirmPasswordVisibility}>
            <Image source={require("../../../mobile/assets/images/password_eye.png")} style={[styles.passwordIcon, { tintColor: this.state.showConfirmPassword ? theme.muted : theme.primary }]} />
          </TouchableOpacity>
        </View>
      </>
    )
  }
  renderCountry = () => {
    const styles = this.styles;
    const theme = this.getCreatePageTheme();
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
    const styles = this.styles;
    const theme = this.getCreatePageTheme();
    return (
      <TouchableOpacity
        testID="btnCountrySelect"
        style={[styles.textInput, styles.selector]}
        onPress={this.openCountryPicker}
      >
        <Text style={[styles.text, { marginHorizontal: 10 }, !this.state.selectedCountry && { color: theme.muted }]}>
          {this.state.selectedCountry || configJSON.selectACountry}
        </Text>
        <Image source={leftArrow} style={[styles.downArrow, { tintColor: theme.muted }]} />
      </TouchableOpacity>
    );
  };

  renderAndroidCountryPicker = () => {
    const styles = this.styles;
    const theme = this.getCreatePageTheme();
    return (
      <View style={[styles.textInput, styles.selector, { paddingHorizontal: 0 }]}>
        <Picker
          testID="countryPicker"
          style={{ width: "100%", height: 50, color: theme.foreground }}
          dropdownIconColor={theme.muted}
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
        <Image source={leftArrow} style={[styles.downArrow, { tintColor: theme.muted }]} />
      </View>
    );
  };


  
  renderState = () => {
    const styles = this.styles;
    const theme = this.getCreatePageTheme();
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
    const styles = this.styles;
    const theme = this.getCreatePageTheme();
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
        <Text style={[styles.text, { marginHorizontal: 10 }, !this.state.selectedState && { color: theme.muted }]}>
          {this.state.selectedState || `${configJSON.selectAState}`}
        </Text>
        <Image source={leftArrow} style={[styles.downArrow, { tintColor: theme.muted }]} />
      </TouchableOpacity>
    )
  }

  renderAndroidStatePicker = () => {
    const styles = this.styles;
    const theme = this.getCreatePageTheme();
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
          style={{ width: "100%", height: 50, color: theme.foreground }}
          itemStyle={[styles.text]}
          dropdownIconColor={theme.muted}
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
        <Image source={leftArrow} style={[styles.downArrow, { tintColor: theme.muted }]} />
      </View>
    )
  }

  renderCity = () => {
    const styles = this.styles;
    const theme = this.getCreatePageTheme();
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
    const styles = this.styles;
    const theme = this.getCreatePageTheme();
    return (
      <>
        <Text style={[styles.text, styles.textInputHeader]}>
          {configJSON.address || "Address"}
        </Text>
        <TextInput
          testID="txtInputAddress"
          placeholder="Enter your address"
          placeholderTextColor={theme.muted}
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
    const styles = this.styles;
    const theme = this.getCreatePageTheme();
    return (
      <>
        <Text style={[styles.text, styles.textInputHeader]}>
          Zip Code
        </Text>
        <TextInput
          testID="txtInputZipCode"
          placeholder="Enter zip code"
          placeholderTextColor={theme.muted}
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
    const styles = this.styles;
    const theme = this.getCreatePageTheme();
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
        <Text style={[styles.text, { marginHorizontal: 10 }, !this.state.selectedCity && { color: theme.muted }]}>
          {this.state.selectedCity || `${configJSON.selectACity}`}
        </Text>
        <Image source={leftArrow} style={[styles.downArrow, { tintColor: theme.muted }]} />
      </TouchableOpacity>
    )
  }

  renderAndroidCityPicker = () => {
    const styles = this.styles;
    const theme = this.getCreatePageTheme();
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
          style={{ width: "100%", height: 50, color: theme.foreground }}
          itemStyle={[styles.text]}
          dropdownIconColor={theme.muted}
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
        <Image source={leftArrow} style={[styles.downArrow, { tintColor: theme.muted }]} />
      </View>
    )
  }

  renderCellPhone = () => {
    const styles = this.styles;
    const theme = this.getCreatePageTheme();
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
    const styles = this.styles;
    const theme = this.getCreatePageTheme();
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
            tintColor: theme.muted,
          }]} />
        <Text
          style={styles.countryCodeText}
        >{code}</Text>
      </TouchableOpacity>
    )
  }

  renderCountryCodePickerAndroid = () => {
    const styles = this.styles;
    const theme = this.getCreatePageTheme();
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
            tintColor: theme.muted,
            }]} />
          <Text
            style={styles.countryCodeText}>{code}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  renderTAndC = () => {
    const styles = this.styles;
    const theme = this.getCreatePageTheme();
    return (
      <View style={styles.tAndCContainer}>
        <TouchableOpacity style={[
          styles.tAndC,
          this.state.acceptTermsConditions && styles.tAndCChecked,
        ]}
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

  isPickerValueSelected = (itemValue: any, selectedValue: any) => {
    if (itemValue === selectedValue) {
      return true;
    }
    if (
      itemValue &&
      selectedValue &&
      typeof itemValue === "object" &&
      itemValue.id &&
      selectedValue.id
    ) {
      return itemValue.id === selectedValue.id;
    }
    return false;
  };

  renderThemedPickerSheet = (props: {
    visible: boolean;
    hideTestID: string;
    pickerTestID: string;
    selectedValue: any;
    onHide: () => void;
    onValueChange: (value: any) => void;
    items: { key: string; label: string; value: any }[];
    title: string;
  }) => {
    const styles = this.styles;
    return (
      <Modal
        transparent={true}
        visible={props.visible}
        animationType="slide"
      >
        <TouchableWithoutFeedback testID={props.hideTestID} onPress={props.onHide}>
          <View style={styles.centeredModal}>
            <TouchableWithoutFeedback>
              <View style={styles.sheetContainer}>
                <View style={styles.sheetHandle} />
                <Text style={styles.sheetTitle}>{props.title}</Text>
                <ScrollView
                  style={styles.sheetList}
                  keyboardShouldPersistTaps="always"
                  showsVerticalScrollIndicator={false}
                >
                  {props.items.map((item) => {
                    const selected = this.isPickerValueSelected(
                      item.value,
                      props.selectedValue,
                    );
                    return (
                      <TouchableOpacity
                        key={item.key}
                        style={[
                          styles.sheetOption,
                          selected && styles.sheetOptionSelected,
                        ]}
                        onPress={() => props.onValueChange(item.value)}
                      >
                        <Text
                          style={[
                            styles.sheetOptionText,
                            selected && styles.sheetOptionTextSelected,
                          ]}
                        >
                          {item.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
                <Picker
                  testID={props.pickerTestID}
                  selectedValue={props.selectedValue}
                  onValueChange={props.onValueChange}
                  style={styles.hiddenPicker}
                >
                  {props.items.map((item) => (
                    <Picker.Item
                      key={item.key}
                      label={item.label}
                      value={item.value}
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

  renderTypeModal = () => {
    return this.renderThemedPickerSheet({
      visible: this.state.typeClicked,
      hideTestID: "hideTypeModal",
      pickerTestID: "typePickerModal",
      selectedValue: this.state.selectedType,
      onHide: this.hideModalType,
      onValueChange: (selectedType) => this.handleTypeSelection(selectedType),
      title: configJSON.type,
      items: this.state.typeList.map((name: string) => ({
        key: name,
        label: this.getTypeDisplayLabel(name),
        value: name,
      })),
    });
  }

  renderStateModal = () => {
    return this.renderThemedPickerSheet({
      visible: this.state.stateClicked,
      hideTestID: "hideStateModal",
      pickerTestID: "statePickerModal",
      selectedValue: this.state.selectedState,
      onHide: this.hideModalState,
      onValueChange: (selectedState) => this.handleStateChange(selectedState),
      title: configJSON.state,
      items: this.state.stateList.map(
        ({ key, name }: { key: string; name: string }) => ({
          key,
          label: name,
          value: name,
        }),
      ),
    });
  }

  renderCityModal = () => {
    return this.renderThemedPickerSheet({
      visible: this.state.cityClicked,
      hideTestID: "hideCityModal",
      pickerTestID: "cityPickerModal",
      selectedValue: this.state.selectedCity,
      onHide: this.hideModalCity,
      onValueChange: (selectedCity) => this.handleCityValueChange(selectedCity),
      title: configJSON.city,
      items: (this.state.cityList || []).map((name: string) => ({
        key: name,
        label: name,
        value: name,
      })),
    });
  }

  renderCountryChangeModal = () => {
    const styles = this.styles;
    const theme = this.getCreatePageTheme();
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
    return this.renderThemedPickerSheet({
      visible: this.state.countryClicked,
      hideTestID: "hideCountryPickerModal",
      pickerTestID: "countryPickerModal",
      selectedValue: this.state.selectedCountry,
      onHide: this.hideModalCountryPicker,
      onValueChange: (selectedCountry) => this.handleCountryChange(selectedCountry),
      title: configJSON.country,
      items: this.state.countryList
        .filter(
          ({ country_name }: { country_name: string }) =>
            country_name !== "Aland" &&
            country_name !== "country_name"
        )
        .map(({ country_code, country_name }: { country_code: string; country_name: string }) => ({
          key: country_code,
          label: country_name,
          value: country_name,
        })),
    });
  };


  renderCountriesCodeListModal = () => {
    return this.renderThemedPickerSheet({
      visible: this.state.countryCodeClicked,
      hideTestID: "hideCountryCodePickerModal",
      pickerTestID: "countryCodePickerModal",
      selectedValue: this.state.selectedCountryCode,
      onHide: this.toogleCountryCodeModal,
      onValueChange: (countryCodeSelected) => this.handleCountryCodeSelectionIOS(countryCodeSelected),
      title: "Country code",
      items: this.state.countryCodesList.map((countryCode: any) => ({
        key: countryCode.id,
        label: `${countryCode.attributes.name} (+${countryCode.attributes.country_code})`,
        value: countryCode,
      })),
    });
  }

  renderHeader = () => {
    const styles = this.styles;
    const theme = this.getCreatePageTheme();
    return (
      <View style={styles.headerContainer}>
        <TouchableOpacity
          testID="backButton"
          style={styles.backArrowContainer}
          onPress={() => {
            this.props.navigation.goBack();
          }}>
          <Image source={leftArrow} style={[styles.backArrow, { tintColor: theme.foreground }]} />
        </TouchableOpacity>
        <Text testID="pageTitle" style={[styles.text, styles.headerTitle]}>
          {configJSON.createMyPage}
        </Text>
      </View>
    )
  }
  // Customizable Area End

  render() {
    const styles = this.styles;
    const theme = this.getCreatePageTheme();
    return (
      <KeyboardAvoidingView
        behavior={this.isPlatformiOS() ? "padding" : undefined}
        style={[styles.keyboardPadding, { backgroundColor: theme.background }]}
      >
        {/* Customizable Area Start */}
        <ScrollView keyboardShouldPersistTaps="always" style={styles.container}>
          <TouchableWithoutFeedback
            testID={"Background"}
            onPress={() => {
              this.hideKeyboard();
            }} >
            <SafeAreaView>
              <View pointerEvents="none" style={styles.decorTop} />
              <View style={styles.mainContainer}>
                <StatusBar
                  backgroundColor={theme.background}
                  barStyle={this.state.isDarkMode ? "light-content" : "dark-content"}
                />
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
                  <View style={styles.sheetContainer}>
                    <View style={styles.sheetHandle} />
                    <Text style={styles.sheetTitle}>Country code</Text>
                    <ScrollView showsVerticalScrollIndicator={false}>
                      {this.state.countryCodesList.map((item: any, index) => {
                        const selected = this.isPickerValueSelected(
                          item,
                          this.state.selectedCountryCode,
                        );
                        return (
                        <TouchableOpacity testID={`countryCodeModal-${index}`} key={item.attributes.country_code} style={[
                          styles.sheetOption,
                          selected && styles.sheetOptionSelected,
                        ]} onPress={() => this.handleCountryCodeValueChangeAndroid(item)}>
                          <Text style={[
                            styles.sheetOptionText,
                            selected && styles.sheetOptionTextSelected,
                          ]}>{`${item.attributes.name} (+${item.attributes.country_code})`}</Text>
                        </TouchableOpacity>
                        );
                      })}
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

const createCreatePageStyles = (theme: CreatePageTheme) => StyleSheet.create({
  // Customizable Area Start
  container: {
    flex: 1,
    padding: 16,
    width: "100%",
    backgroundColor: theme.background
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
    textAlign: "center",
    color: theme.primary,
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
    color: theme.foreground
  },
  textInputHeader: {
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    color: theme.foreground,
  },
  textInput: {
    width: "100%",
    paddingHorizontal: 14,
    paddingVertical: 0,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
    backgroundColor: theme.input,
    color: theme.foreground,
    height: 50,
    fontSize: 16,
    marginTop: 0,
    marginBottom: 0,
  },
  selector: {
    height: 50,
    justifyContent: "center",
    paddingHorizontal: 0,
    overflow: "hidden",
  },
  pickerItemStyle: {
    fontFamily: "OpenSans",
    color: theme.foreground,
    fontSize: 22,
    fontWeight: "400",
  },
  downArrow: {
    position: "absolute",
    right: 15,
    marginRight: 5,
    width: 8,
    backgroundColor: "transparent",
    transform: [{ rotate: "-90deg" }],
    resizeMode: "contain"
  },
  centeredModal: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(8, 8, 15, 0.72)"
  },
  sheetContainer: {
    backgroundColor: theme.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: theme.border,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 28,
    maxHeight: "62%",
  },
  sheetHandle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.muted,
    opacity: 0.5,
    marginBottom: 14,
  },
  sheetTitle: {
    fontFamily: "OpenSans",
    fontWeight: "700",
    fontSize: 18,
    color: theme.primary,
    marginBottom: 12,
    textAlign: "center",
    alignSelf: "center",
  },
  sheetList: {
    maxHeight: 340,
  },
  sheetOption: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginBottom: 8,
    backgroundColor: theme.input,
    borderWidth: 1,
    borderColor: theme.border,
  },
  sheetOptionSelected: {
    backgroundColor: theme.primarySoft,
    borderColor: theme.primary,
  },
  sheetOptionText: {
    fontFamily: "OpenSans",
    fontSize: 16,
    fontWeight: "600",
    color: theme.foreground,
    textAlign: "center",
  },
  sheetOptionTextSelected: {
    color: theme.primary,
  },
  hiddenPicker: {
    height: 0,
    width: 0,
    opacity: 0,
    position: "absolute",
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
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 100
  },
  continueButton: {
    backgroundColor: theme.primary,
    padding: 15,
    borderRadius: 12,
    marginTop: 35
  },
  continueText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 18,
    alignSelf: "center"
  },
  errorTextMsg: {
    color: "#D32F2F",
    fontSize: 13,
    paddingTop: 2
  },
  phoneTextInput: {
    width: "100%",
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
    backgroundColor: theme.input,
    color: theme.foreground,
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
    color: theme.foreground,
    alignSelf: "center",
    marginLeft: 10,
    fontSize: 16,
  },
  tAndCContainer: {
    flexDirection: "row",
    marginTop: 20,
    alignItems: "center",
  },
  tAndC: {
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
  tAndCChecked: {
    borderColor: theme.primary,
    backgroundColor: theme.primarySoft,
  },
  tAndCSelected: {
    height: 12,
    width: 12,
    backgroundColor: theme.primary,
    borderRadius: 3,
  },
  textLink: {
    fontWeight: "bold",
    color: theme.primary,
  },
  passwordContainer: {
    width: "100%",
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
    backgroundColor: theme.input,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'visible',
  },
  passwordInput: {
    flex: 1,
    height: 50,
    color: theme.foreground,
    fontSize: 16,
    paddingVertical: 0,
    margin: 0,
    textAlignVertical: "center",
  },
  androidCountryCodeModal: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(8, 8, 15, 0.72)',
  },
  outsideUS: {
    fontWeight: "700",
    fontSize: 26,
    lineHeight: 28,
    marginVertical: 10,
    color: theme.foreground,
  },
  supportUS: {
    fontFamily: "OpenSans",
    alignSelf: "flex-start",
    color: theme.muted,
    fontSize: 18,
  },
  acceptText: {
    fontFamily: "OpenSans",
    color: "#FFFFFF",
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

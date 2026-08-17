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
import { leftArrow } from "./assets";
import { Picker } from '@react-native-picker/picker';
// Customizable Area End

import ClaimPageController, { Props, configJSON } from "./ClaimPageController";

export default class ClaimPage extends ClaimPageController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }

  // Customizable Area Start
  renderHeader = () => {
    return (
      <View style={styles.headerView}>
        <TouchableOpacity
          testID="backButton"
          style={styles.backBtnContainer}
          onPress={() => {
            this.handleGoBack()
          }}
        >
          <Image source={leftArrow} style={styles.backArrow} />
        </TouchableOpacity>
        <Text style={[styles.text, styles.headerTitle]}>
          {configJSON.claimThePage}
        </Text>
      </View>
    )
  }

  renderType = () => {
    return (
      <>
        <Text style={[styles.text, styles.txtInputLabel]}>
          {configJSON.type}
        </Text>
        {Platform.OS === "ios" ? this.renderTypeiOS() : this.renderTypeAndroid()}
      </>
    )
  }

  renderTypeiOS = () => {
    return (
      <TouchableOpacity
        testID="btnTypeSelect"
        style={[
          styles.txtInput,
          styles.selectorView,
        ]}
        onPress={this.showType}
      >
        <Text style={[styles.text]}>
          {this.state.selectedType || `${configJSON.selectAType}`}
        </Text>
        <Image source={leftArrow} style={styles.downArrowIcon} />
      </TouchableOpacity>
    )
  }

  renderTypeModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.typeClicked}
      >
        <TouchableWithoutFeedback testID="hideTypeModal" onPress={this.hideTypeModal}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
              <View
                style={[
                  styles.modalView,
                  { borderTopStartRadius: 20, padding: 15 }
                ]}
              >
                <Picker
                  testID="typePickerModal"
                  selectedValue={this.state.selectedType}
                  onValueChange={selectedType =>
                    this.handleTypeSelection(selectedType)
                  }
                >
                  {this.state.typeList.map((name: string) => (
                    <Picker.Item key={name} label={name} value={name} />
                  ))}
                </Picker>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    )
  }

  renderTypeAndroid = () => {
    return (
      <View
        style={[
          styles.txtInput,
          styles.selectorView,
        ]}
      >
        <Picker
          testID="typePicker"
          style={[styles.txtInput, styles.selectorView]}
          itemStyle={[styles.text]}
          selectedValue={this.state.selectedType}
          onValueChange={selectedType =>
            this.handleTypeSelection(selectedType)
          }
        >
          <Picker.Item
            label={configJSON.selectAType}
            value={""}
          />
          {this.state.typeList.map((name: string) => (
            <Picker.Item key={name} label={name} value={name} />
          ))}
        </Picker>
        <Image source={leftArrow} style={styles.downArrowIcon} />
      </View>
    )
  }

  renderBandOrLocation = () => {
    return (
      <>
        <Text style={[styles.text, styles.txtInputLabel]}>
          {this.state.userRole === "band"  ? configJSON.bandArtistName : configJSON.locationsName}
        </Text>
        <TextInput
          testID="bandArtistInput"
          placeholder="Enter your title"
          placeholderTextColor="#CBD5E1"
          style={styles.txtInput}
          value={this.state.bandArtist}
          onChangeText={bandArtist => this.handleBandArtist(bandArtist)}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </>
    )
  }

  renderAddress = () => {
    return (
      <>
        {this.state.userRole === "venue" &&
          <>
            <Text style={[styles.text, styles.txtInputLabel]}>
              {configJSON.address}
            </Text>
            <TextInput
              testID="addressInput"
              placeholder="Enter your address"
              placeholderTextColor="#CBD5E1"
              style={styles.txtInput}
              value={this.state.address}
              onChangeText={address => this.handleAddress(address)}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {this.renderError(this.state.addressErrorText)}
          </>
        }
      </>
    )
  }

  renderCountry = () => {
    return (
      <>
        <Text style={[styles.text, styles.txtInputLabel]}>
          {configJSON.country}
        </Text>
        {Platform.OS === "ios" ? this.renderCountryiOS() : this.renderCountryAndroid()}
      </>
    )
  }

  renderCountryiOS = () => {
    return (
      <TouchableOpacity
        testID="btnCountrySelect"
        style={[
          styles.txtInput,
          styles.selectorView,
        ]}
        onPress={this.showCountry}
      >
        <Text style={[styles.text]}>
          {this.state.selectedCountry || `${configJSON.selectACountry}`}
        </Text>
        <Image source={leftArrow} style={styles.downArrowIcon} />
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
        <TouchableWithoutFeedback testID="hideCountryPickerModal" onPress={this.hideCountryPickerModal}>
          <View style={styles.modalContainer}>
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
                  onValueChange={selectedCountry => this.handleCountry(selectedCountry)}
                >
                  {this.state.countryList?.map(
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

  renderCountryAndroid = () => {
    return (
      <View
        style={[
          styles.txtInput,
          styles.selectorView,
        ]}
      >
        <Picker
          testID="countryPicker"
          style={[styles.txtInput, styles.selectorView]}
          itemStyle={[styles.text]}
          selectedValue={this.state.selectedCountry}
          onValueChange={selectedCountry =>
            this.onSelectCountry(selectedCountry)
          }
        >
          <Picker.Item
            label={configJSON.selectACountry}
            value={""}
          />
          {this.state.countryList?.map(
            ({ country_code, country_name }: { country_code: string; country_name: string }) => (
              <Picker.Item key={country_code} label={country_name} value={country_name} />
            )
          )}
        </Picker>
        <Image source={leftArrow} style={styles.downArrowIcon} />
      </View>
    )
  }

  renderState = () => {
    return (
      <>
        <Text style={[styles.text, styles.txtInputLabel]}>
          {configJSON.state}
        </Text>
        {Platform.OS === "ios" ? this.renderStateiOS() : this.renderStateAndroid()}
      </>
    )
  }

  renderStateiOS = () => {
    return (
      <TouchableOpacity
        testID="btnStateSelect"
        style={[
          styles.txtInput,
          styles.selectorView,
          { opacity: this.dynamicOpacity(this.state.selectedCountry !== "" && this.state.selectedCountry === "United States") }
        ]}
        onPress={this.showState}
        disabled={this.state.selectedCountry === "" || this.state.selectedCountry !== "United States"}
      >
        <Text style={[styles.text]}>
          {this.state.selectedState
            ? this.state.stateList.filter(
              ({ key }) => key === this.state.selectedState
            )[0].name
            : `${configJSON.selectAState}`}
        </Text>
        <Image source={leftArrow} style={styles.downArrowIcon} />
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
        <TouchableWithoutFeedback testID="hideStateModal" onPress={this.hideStateModal}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
              <View
                style={[
                  styles.modalView,
                  { borderTopStartRadius: 20, padding: 15 }
                ]}
              >
                <Picker
                  testID="statePickerModal"
                  selectedValue={this.state.selectedState}
                  onValueChange={selectedState => this.handleState(selectedState)}
                >
                  {this.state.stateList.map(
                    ({ key, name }: { key: string; name: string }) => (
                      <Picker.Item key={key} label={name} value={key} />
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
        style={[
          styles.txtInput,
          styles.selectorView,
          {
            opacity: this.dynamicOpacity(this.state.selectedCountry !== "" && this.state.selectedCountry === "United States")
          }
        ]}
      >
        <Picker
          testID="statePicker"
          style={[styles.txtInput, styles.selectorView]}
          itemStyle={[styles.text]}
          selectedValue={this.state.selectedState}
          onValueChange={selectedState =>
            this.onSelectState(selectedState)
          }
          enabled={this.state.selectedCountry !== "" && this.state.selectedCountry === "United States"}
        >
          <Picker.Item
            label={configJSON.selectAState}
            value={""}
          />
          {this.state.stateList.map(
            ({ key, name }: { key: string; name: string }) => (
              <Picker.Item key={key} label={name} value={key} />
            )
          )}
        </Picker>
        <Image source={leftArrow} style={styles.downArrowIcon} />
      </View>
    )
  }

  renderCity = () => {
    return (
      <>
        <Text style={[styles.text, styles.txtInputLabel]}>
          {configJSON.city}
        </Text>
        {Platform.OS === "ios" ? this.renderCityiOS() : this.renderCityAndroid()}
      </>
    )
  }

  renderCityiOS = () => {
    return (
      <TouchableOpacity
        testID="btnCitySelect"
        style={[
          styles.txtInput,
          styles.selectorView,
          {
            opacity: this.dynamicOpacity(this.state.selectedState)
          }
        ]}
        onPress={this.showCity}
        disabled={this.state.selectedState === ""}
      >
        <Text style={[styles.text]}>
          {this.state.selectedCity || `${configJSON.selectACity}`}
        </Text>
        <Image source={leftArrow} style={styles.downArrowIcon} />
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
        <TouchableWithoutFeedback testID="hideCityModal" onPress={this.hideCityModal}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
              <View
                style={[
                  styles.modalView,
                  { borderTopStartRadius: 20, padding: 15 }
                ]}
              >
                <Picker
                  testID="cityPickerModal"
                  selectedValue={this.state.selectedCity}
                  onValueChange={selectedCity => {
                    this.handleCitySelection(selectedCity)
                  }}
                >
                  {this.state.cityList.map((name: string) => (
                    <Picker.Item key={name} label={name} value={name} />
                  ))}
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
      <View
        style={[
          styles.txtInput,
          styles.selectorView,
          {
            paddingHorizontal: 0,
            opacity: this.dynamicOpacity(this.state.selectedState)
          }
        ]}
      >
        <Picker
          testID="cityPicker"
          style={[styles.txtInput, styles.selectorView]}
          itemStyle={[styles.text]}
          selectedValue={this.state.selectedCity}
          onValueChange={selectedCity =>
            this.handleCitySelection(selectedCity)
          }
        >
          <Picker.Item
            label={configJSON.selectACity}
            value={""}
          />
          {this.state.cityList.map((name: string) => (
            <Picker.Item key={name} label={name} value={name} />
          ))}
        </Picker>
        <Image source={leftArrow} style={styles.downArrowIcon} />
      </View>
    )
  }

  renderZipcode = () => {
    return (
      <>
        {this.state.userRole === "venue" &&
          <>
            <Text style={[styles.text, styles.txtInputLabel]}>
              {configJSON.zip}
            </Text>
            <TextInput
              testID="zipInput"
              placeholder="Enter zip"
              placeholderTextColor="#CBD5E1"
              style={styles.txtInput}
              value={this.state.zip}
              onChangeText={this.onZipTextChange}
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={5}
              keyboardType="numeric"
            />
            {this.renderError(this.state.zipErrorText)}
          </>
        }
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

  renderCountryChangeAlert = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.countryModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.outsideUSText}>
              {configJSON.areYouOutsideTheUS}
            </Text>
            <Text style={[styles.text, styles.onlySupportUSTxt]}>
              {configJSON.supportUS}
            </Text>
            <TouchableOpacity
              testID="btnAccept"
              style={styles.acceptTextBtn}
              onPress={this.hideCountryModal}
            >
              <Text style={[styles.text, styles.acceptText]}>
                {configJSON.accept}
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
        style={{ flex: 1 }}
      >
        {/* Customizable Area Start */}
        <ScrollView
          keyboardShouldPersistTaps="always"
          style={styles.containerScrollView}
        >
          <TouchableWithoutFeedback
            testID={"claimPageBackground"}
            onPress={() => {
              this.hideKeyboard();
            }}>
            <SafeAreaView>
              <View style={styles.content}>
                <StatusBar backgroundColor="white" barStyle="dark-content" />
                {this.renderHeader()}
                <View>
                  {this.renderType()}
                  {this.renderError(this.state.typeErrorText)}
                  {this.renderBandOrLocation()}
                  {this.renderError(this.state.bandArtistErrorText)}
                  {this.renderAddress()}
                  {this.renderCountry()}
                  {this.renderError(this.state.countryError)}
                  {this.renderState()}
                  {this.renderError(this.state.stateErrorText)}
                  {this.renderCity()}
                  {this.renderError(this.state.cityErrorText)}
                  {this.renderZipcode()}

                  <TouchableOpacity
                    testID="btnClaimPage"
                    style={styles.claimPageButton}
                    onPress={() => {
                      this.handleClaimPageAPI();
                    }}
                  >
                    <Text style={[styles.text, styles.claimPageText]}>
                      {configJSON.claimThePage}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    testID="btnCreatePage"
                    style={styles.createPage}
                    onPress={this.handleCreatePageNavigation}
                  >
                    <Text style={[styles.text, styles.contentTxt]}>
                      {`${configJSON.isThereNoMatch} `}
                    </Text>
                    <Text
                      style={[
                        styles.text,
                        styles.contentTxt,
                        { color: "#3333CC", fontWeight: "700" }
                      ]}
                    >
                      {configJSON.createYourPage}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {this.renderTypeModal()}
              {this.renderCountryChangeAlert()}
              {this.renderCountryModal()}
              {this.renderStateModal()}
              {this.renderCityModal()}

            </SafeAreaView>
          </TouchableWithoutFeedback>
        </ScrollView>
        {/* Customizable Area End */}
      </KeyboardAvoidingView>
    );
  }

  // Customizable Area Start
  // Customizable Area End
}

const styles = StyleSheet.create({
  // Customizable Area Start
  containerScrollView: {
    flex: 1,
    padding: 16,
    width: "100%",
    maxWidth: 650,
    backgroundColor: "#fff"
  },
  headerView: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10
  },
  backBtnContainer: {
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
  content: {
    flex: 1,
    marginBottom: 30,
    marginHorizontal: 10
  },
  text: {
    fontFamily: "OpenSans",
    alignSelf: "flex-start",
    color: colors(false).text
  },
  contentTxt: {
    fontWeight: "400",
    fontSize: 14,
    lineHeight: 22
  },
  txtInputLabel: {
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10
  },
  txtInput: {
    width: "100%",
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: "#C5C5FF",
    color: colors(false).text,
    height: 50,
    fontSize: 16
  },
  selectorView: {
    height: 50,
    justifyContent: "center"
  },
  downArrowIcon: {
    position: "absolute",
    right: 15,
    marginRight: 5,
    width: 8,
    backgroundColor: "white",
    transform: [{ rotate: "-90deg" }],
    resizeMode: "contain"
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "#33415580"
  },
  modalView: {
    height: "35%",
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
  claimPageButton: {
    backgroundColor: "#3333CC",
    padding: 15,
    borderRadius: 10,
    marginTop: 35,
    width: "100%"
  },
  claimPageText: {
    color: colors(false).white,
    fontWeight: "700",
    fontSize: 18,
    alignSelf: "center"
  },
  outsideUSText: {
    fontWeight: "700",
    fontSize: 26,
    lineHeight: 28,
    marginVertical: 10,
    color: "#0F172A"
  },
  textTitle: {
    fontFamily: "OpenSans",
    alignSelf: "flex-start",
    color: colors(false).text,
  },
  onlySupportUSTxt: {
    fontSize: 18
  },
  acceptTextBtn: {
    backgroundColor: "#3333CC",
    width: "100%",
    padding: 15,
    borderRadius: 10,
    marginTop: 25
  },
  acceptText: {
    color: colors(false).white,
    fontWeight: "700",
    fontSize: 18,
    alignSelf: "center"
  },
  overlaySty: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  errorText: {
    color: "red",
    fontSize: 13,
    paddingTop: 2
  },
  createPage: {
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "center",
  },
  // Customizable Area End
});

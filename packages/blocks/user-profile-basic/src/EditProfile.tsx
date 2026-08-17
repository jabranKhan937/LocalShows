import React from "react";
// Customizable Area Start
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Platform,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  StatusBar,
  SafeAreaView,
  TextInput,
  Modal,
  ActivityIndicator,
} from "react-native";

import {
  leftArrowWhite,
  defaultProfile,
  editIcon,
} from "./assets";
import { usFlag } from "../../email-account-registration/src/assets";

import { colors } from "../../utilities/src/Colors";
import { getStorageData, removeStorageData } from "../../../framework/src/Utilities";
import { Picker } from '@react-native-picker/picker';
import FastImage from "../../../components/src/SafeFastImage"

// Customizable Area End

import UserProfileBasicController, {
  Props
} from "./UserProfileBasicController";

export default class EditProfile extends UserProfileBasicController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }

  // Customizable Area Start
  renderCameraGalleryPopup = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.showCameraGalleryPopup}
      >
        <View style={[styles.centerView, { padding: 10, }]}>
          <View style={styles.cameraGalleryOption}>
            <Text testID="cameraOption" style={styles.takeChoosePhoto} onPress={this.handleCamera}>Take photo</Text>
            <View style={styles.divider} />
            <Text testID="galleryOption" style={styles.takeChoosePhoto} onPress={this.handleGallery}>Choose photo</Text>
          </View>
          <TouchableOpacity testID="cancelOption" style={styles.cancelCameraPopup} onPress={this.handleCameraGalleryCancelPopup}>
            <Text style={styles.cancelCameraText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    )
  }

  renderHeader = () => {
    return (
      <View style={styles.topBackdrop}>
        <TouchableOpacity
          testID="navigationBackButton"
          style={styles.backBtn}
          onPress={() => {
            this.props.navigation.goBack();
          }}>
          <Image
            source={leftArrowWhite}
            style={styles.headerIcon}
          />
        </TouchableOpacity>
        <Text testID="testLabel" style={styles.headerTitle}>Edit Profile</Text>
      </View>
    )
  }

  renderProfile = () => {
    return (
      <View style={styles.profileImageContainer}>
        <FastImage source={this.state.profilePic ?
          {
            uri: this.state.profilePic,
            priority: FastImage.priority.high
          } :
          defaultProfile
        }
          style={styles.profileImage}
          resizeMode={FastImage.resizeMode.cover}
        />
        <TouchableOpacity testID="profilePicButton" style={styles.profilePic}
          onPress={() => {
            this.handleProfilePic("profile")
          }}>
          <Image source={editIcon} style={{ width: 20, height: 20, }} />
        </TouchableOpacity>
      </View>
    )
  }

  renderName = () => {
    return (
      <>
        <Text style={[styles.text, styles.textInputLabel]}>Name</Text>
        <TextInput
          testID="nameTextInput"
          placeholder="Enter your name"
          placeholderTextColor="#CBD5E1"
          style={styles.textInput}
          value={this.state.firstName}
          onChangeText={(name) => this.handleName(name)}
        />
      </>
    )
  }

  renderEmailAddress = () => {
    return (
      <>
        <Text style={[styles.text, styles.textInputLabel]}>
          Email address
        </Text>
        <TextInput
          testID="emailTextInput"
          placeholder="Enter your email address"
          placeholderTextColor="#CBD5E1"
          style={[styles.textInput, styles.disabledInput]}
          value={this.state.email}
          editable={false}
        />
        <Text style={[styles.text, styles.emailSecurityText]}>
          You cannot change the email for security reasons, if you need to change the email, please contact us
        </Text>
      </>
    )
  }

  renderSelectedCountry = () => {
    return (
      <>
        <Text style={[styles.text, styles.textInputLabel]}>Country</Text>
        {Platform.OS === 'ios' ? this.renderCountryDropdowniOS() : this.renderCountryDropdownAndroid()}
      </>
    )
  }

  renderCountryDropdowniOS = () => {
    return (
      <TouchableOpacity
        testID="btnCountrySelectiOS"
        style={[styles.textInput, styles.selector]}
        onPress={this.handleCountryClick} >
        <Text style={[styles.text, { marginHorizontal: 10 }]}>
          {this.state.selectedCountry || "Select a country"}
        </Text>
        <Image source={leftArrowWhite} style={[styles.downArrow, { tintColor: '#3333CC' }]} />
      </TouchableOpacity>
    )
  }

  renderCountryModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.countryClicked} >
        <TouchableWithoutFeedback testID="hideCountryModal" onPress={this.hideModalCountry}>
          <View style={styles.centeredView}>
            <TouchableWithoutFeedback>
              <View style={[styles.modalView, { borderTopStartRadius: 20, padding: 15 }]}>
                <Picker
                  testID="countryPickerModal"
                  selectedValue={this.state.selectedCountry}
                  onValueChange={(selectedCountry: string) => this.handleSelectedCountryiOS(selectedCountry)} >
                  {this.state.countriesList.map(
                    ({ country_code, country_name }: { country_code: string; country_name: string }) => (
                      <Picker.Item key={country_code} value={country_name} label={country_name} />
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

  renderCountryDropdownAndroid = () => {
    return (
      <View style={[styles.textInput, styles.selector, {
        paddingHorizontal: 0
      }]}>
        <Picker
          testID="countryAndroidPicker"
          style={[styles.textInput, styles.selector]}
          itemStyle={styles.text}
          selectedValue={this.state.selectedCountry}
          onValueChange={(selectedCountry: string) => { this.onCountrySelect(selectedCountry) }}
        >
          <Picker.Item label={"Select a country"} value={""} />
          {this.state.countriesList.map(
            ({ country_code, country_name }: { country_code: string; country_name: string }) => (
              <Picker.Item label={country_name} key={country_code} value={country_name} />
            )
          )}
        </Picker>
        <Image source={leftArrowWhite} style={[styles.downArrow, { tintColor: '#3333CC' }]} />
      </View>
    )
  }

  renderSelectedState = () => {
    return (
      <>
        <Text style={[styles.text, styles.textInputLabel]}>State</Text>
        {Platform.OS === 'ios' ? this.renderStateiOS() : this.renderStateAndroid()}
      </>
    )
  }

  renderStateiOS = () => {
    return (
      <TouchableOpacity
        testID="btnStateSelect"
        style={[styles.textInput, styles.selector, { opacity: this.dynamicOpacity(this.state.selectedCountry !== "" && (this.state.selectedCountry === "United States" || this.state.selectedCountry === "US")) }]}
        disabled={this.state.selectedCountry === "" || this.state.selectedCountry !== "United States"}
        onPress={this.handleStateClick} >
        <Text style={[styles.text, { marginHorizontal: 10 }]}>
          {this.state.selectedState ? this.state.states.filter(({ key }) => key === this.state.selectedState)[0]?.name : "Select a state"}
        </Text>
        <Image source={leftArrowWhite} style={[styles.downArrow, { tintColor: '#3333CC' }]} />
      </TouchableOpacity>
    )
  }

  renderStateModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.stateClicked} >
        <TouchableWithoutFeedback testID="hideStateModal" onPress={this.hideModalState}>
          <View style={styles.centeredView}>
            <TouchableWithoutFeedback>
              <View style={[styles.modalView, { borderTopStartRadius: 20, padding: 15 }]}>
                <Picker
                  testID="statePickerModal"
                  selectedValue={this.state.selectedState}
                  onValueChange={(selectedState: string) => this.handleSelectedStateIOS(selectedState)} >
                  {this.state.states.map(
                    ({ key, name }: { key: string; name: string }) => (
                      <Picker.Item key={key} value={key} label={name} />
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
      <View style={[styles.textInput, styles.selector, {
        paddingHorizontal: 0,
        opacity: this.dynamicOpacity(this.state.selectedCountry !== "" && (this.state.selectedCountry === "United States" || this.state.selectedCountry === "US"))
      }]}>
        <Picker
          testID="statePicker"
          style={[styles.textInput, styles.selector]}
          itemStyle={styles.text}
          selectedValue={this.state.selectedState}
          onValueChange={(selectedState: string) => this.onSelectState(selectedState)}
          enabled={this.state.selectedCountry !== "" && (this.state.selectedCountry === "United States" || this.state.selectedCountry === "US")}
        >
          <Picker.Item label={"Select a state"} value={""} />
          {this.state.states.map(
            ({ key, name }: { key: string; name: string }) => (
              <Picker.Item label={name} key={key} value={key} />
            )
          )}
        </Picker>
        <Image source={leftArrowWhite} style={[styles.downArrow, { tintColor: '#3333CC' }]} />
      </View>
    )
  }

  renderSelectedCity = () => {
    return (
      <>
        <Text style={[styles.textInputLabel, styles.text]}>City</Text>
        {Platform.OS === "ios" ? this.renderCityiOS() : this.renderCityAndroid()}
      </>
    )
  }

  renderCityiOS = () => {
    return (
      <TouchableOpacity
        testID="btnCitySelect"
        style={[styles.textInput, styles.selector, { opacity: this.dynamicOpacity(this.state.selectedState) }]}
        onPress={this.handleCityClick}
        disabled={this.state.selectedState === ""} >
        <Text style={[styles.text, { marginHorizontal: 10 }]}>
          {this.state.selectedCity || "Select a city"}
        </Text>
        <Image source={leftArrowWhite} style={[styles.downArrow, { tintColor: '#3333CC' }]} />
      </TouchableOpacity>
    )
  }

  renderCityModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.cityClicked} >
        <TouchableWithoutFeedback testID="hideCityModal" onPress={this.hideModalCity}>
          <View style={[styles.centeredView]}>
            <TouchableWithoutFeedback>
              <View style={[styles.modalView, { borderTopStartRadius: 20, padding: 15 }]}>
                <Picker
                  testID="cityPickerModal"
                  selectedValue={this.state.selectedCity}
                  onValueChange={(selectedCity: string) => this.handleSelectedCityIOS(selectedCity)} >
                  {this.state.cities?.map(
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

  renderCityAndroid = () => {
    return (
      <View style={[styles.selector, styles.textInput, {
        paddingHorizontal: 0,
        opacity: this.state.selectedState ? 1 : 0.5
      }]}>
        <Picker
          testID="cityPickerTag"
          style={[styles.selector, styles.textInput]}
          itemStyle={styles.text}
          selectedValue={this.state.selectedCity}
          onValueChange={(selectedCity: string) => this.handleSelectedCity(selectedCity)}
          enabled={this.state.selectedState !== ""}
        >
          <Picker.Item label={"Select a city"} value={""} />
          {this.state.cities?.map(
            (name: string) => (
              <Picker.Item label={name} key={name} value={name} />
            )
          )}
        </Picker>
        <Image source={leftArrowWhite} style={[styles.downArrow, { tintColor: '#3333CC' }]} />
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
              testID="phoneTextInput"
              style={[styles.textInput, styles.textInputPhone]}
              keyboardType="numeric"
              value={this.state.phoneNumber}
              onChangeText={(phone) => this.handlePhoneNumber(phone)}
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

  renderCountryCodeiOS = () => {
    const hasFlag = this.state.selectedCountryCode && Object.keys(this.state.selectedCountryCode).length > 0
    const code = this.state.selectedCountryCode && Object.keys(this.state.selectedCountryCode).length > 0 ? `+${this.state.selectedCountryCode.attributes.country_code}` : ""
    return (
      <TouchableOpacity
        testID="btnCountryCodeSelect"
        style={styles.countryCodeContainer}
        onPress={this.handleShowCountryCode}
      >
        <Image source={hasFlag ? { uri: this.state.selectedCountryCode.attributes.map_url } : usFlag} style={styles.usFlag} />
        <Image
          source={leftArrowWhite}
          style={[styles.downArrow, styles.countryCodeArrow, { tintColor: '#3333CC' }]} />
        <Text
          style={[styles.text, styles.textCountryCode]}
        >{code}</Text>
      </TouchableOpacity>
    )
  }

  renderCountryCodeModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.countryCodeClicked}
      >
        <TouchableWithoutFeedback testID="hideCountryCodeModal" onPress={this.hideCountryCodeModal}>
          <View style={styles.centeredView}>
            <TouchableWithoutFeedback>
              <View style={[styles.modalView, { borderTopStartRadius: 20, padding: 15 }]}>
                <Picker
                  testID="countryCodePickerModal"
                  selectedValue={this.state.selectedCountryCode}
                  onValueChange={this.handleCountryCodeValueiOS}
                >
                  {this.state.countryCodesList?.map(
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

  renderCountryCodeAndroid = () => {
    const hasFlag = this.state.selectedCountryCode && Object.keys(this.state.selectedCountryCode).length > 0
    const code = this.state.selectedCountryCode && Object.keys(this.state.selectedCountryCode).length > 0 ? `+${this.state.selectedCountryCode.attributes.country_code}` : ""
    return (
      <View>
        <TextInput
          testID="phoneTextInput"
          style={[styles.textInput, styles.textInputPhone]}
          keyboardType="numeric"
          value={this.state.phoneNumber}
          onChangeText={(phone) => this.handlePhoneNumber(phone)}
          maxLength={10}
        />
        <TouchableOpacity
          testID="btnCountryCodeSelectAndroid"
          style={styles.countryCodeContainer}
          onPress={() => { this.setState({ countryCodeClickedAndroid: true }) }}
        >
          <Image source={hasFlag ? { uri: this.state.selectedCountryCode.attributes.map_url } : usFlag} style={styles.usFlag} />
          <Image
            source={leftArrowWhite}
            style={[styles.downArrow, styles.countryCodeArrow, { tintColor: '#3333CC' }]} />
          <Text
            style={[styles.text, styles.textCountryCode]}>{code}</Text>
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
        <View style={styles.centerView}>
          <View style={styles.modalViewContainer}>
            <Text style={styles.textOutsideCountry}>
              Are you outside the US?
            </Text>
            <Text style={[styles.text, styles.textOnlySupportCountry]}>
              We only support the United States right now.
            </Text>
            <TouchableOpacity
              testID="btnAccept"
              style={styles.continueBtn}
              onPress={this.hideCountryCodeDropdown}
            >
              <Text style={[styles.text, styles.textContinueBtn]}>
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
    // Customizable Area Start
    return (
      <KeyboardAvoidingView
        behavior={this.isPlatformiOS() ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            this.hideKeyboard();
          }}
        >
          <SafeAreaView style={styles.container}>
            <ScrollView style={styles.contentContainer}>
              <View style={styles.contentContainer}>
                <StatusBar backgroundColor="#131388" barStyle="light-content" />
                {this.renderHeader()}
                <View style={styles.bottomContainer}>
                  {this.renderProfile()}
                  <View style={{ marginHorizontal: 30, }}>
                    {this.renderName()}
                    <Text style={[styles.text, styles.errorText, {
                      marginBottom: this.state.nameError !== "" ? 10 : 0,
                    }]}>{this.state.nameError}</Text>
                    {this.renderEmailAddress()}
                    <Text style={[styles.text, styles.errorText]}>{this.state.emailError}</Text>
                    {this.renderSelectedCountry()}
                    <Text style={[styles.text, styles.errorText,]}>{this.state.countryError}</Text>
                    {this.renderSelectedState()}
                    <Text style={[styles.text, styles.errorText]}>{this.state.stateError}</Text>
                    {this.renderSelectedCity()}
                    <Text style={[styles.text, styles.errorText]}>{this.state.cityError}</Text>
                    {this.renderPhone()}
                    <Text style={[styles.text, styles.errorText]}>{this.state.phoneError}</Text>
                    <TouchableOpacity
                      testID="cancelButton" onPress={() => {
                        this.props.navigation.goBack()
                      }} >
                      <Text style={styles.cancelEdit}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      testID="saveBtn"
                      style={styles.save}
                      onPress={() => {
                        this.updateProfile()
                      }}>
                      <Text style={styles.textStyle}>Save</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              {this.renderCameraGalleryPopup()}
              {this.renderCountryAlertModal()}
              {this.renderCountryModal()}
              {this.renderStateModal()}
              {this.renderCityModal()}
              {this.renderCountryCodeModal()}
              <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.countryCodeClickedAndroid}>
                <View style={styles.countryCodeAndroidModal}>
                  <View style={styles.countryCodeAndroidModalView}>
                    <ScrollView>
                      {this.state.countryCodesList.map((item: any) => (
                        <TouchableOpacity testID="countryCode" key={item.attributes.country_code} style={{ marginVertical: 15, }} onPress={() => this.handleCountrycodeValueAndroid(item)}>
                          <Text style={{ color: 'black', }}>{`${item.attributes.name} (+${item.attributes.country_code})`}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                </View>
              </Modal>
              {/* {this.state.isLoading && <View style={styles.loadingContainer}>
                <ActivityIndicator size={'large'} color="black" />
              </View>} */}
            </ScrollView>
          </SafeAreaView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
    // Customizable Area End
  }

  async componentDidMount() {
    // Customizable Area Start
    console.log('🔍 EditProfile componentDidMount called');
    this.getUserID(); // Call immediately for initial load
    this.getCountryList();
    this.handleCountryCodeListAPI();

    if (Platform.OS !== 'web') {
      const unsubscribe = this.props.navigation.addListener(
        'focus',
        async () => {
          console.log('🔍 EditProfile focus listener triggered');
          let isOtherUser = this.props.navigation.state?.params?.isOtherUser;
          this.setState({ isOtherUser });
          this.getUserID();
          const commentUserid = await getStorageData('commentUserid');
          let IsFromCommentProfile = await getStorageData(
            'IsFromCommentProfile',
          );
          if (
            IsFromCommentProfile !== null &&
            IsFromCommentProfile &&
            this.state.userID === commentUserid
          ) {
            this.setState({ commentsModalOpen: true });
            removeStorageData('IsFromCommentProfile');
          }
        },
      );

      return unsubscribe;
    }
    // Customizable Area End
  }

  // Customizable Area Start
  // Customizable Area End

}
// Customizable Area Start
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginLeft: "auto",
    marginRight: "auto",
    width: Platform.OS === "web" ? "75%" : "100%",
    maxWidth: 650,
    backgroundColor: "white",
  },
  headerIcon: {
    width: 12,
    resizeMode: "contain",
  },
  headerTitle: {
    fontWeight: "700",
    fontSize: 24,
    color: '#FFFFFF',
    textAlign: 'center',
    textAlignVertical: 'center',
    marginHorizontal: 50,
    alignSelf: 'center',
    marginTop: 15,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  topBackdrop: {
    backgroundColor: "#131388",
    height: 200,
    width: "100%",
  },
  bottomContainer: {
    flex: 1,
    backgroundColor: "#FCFCFF",
    width: "100%",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -40,
    paddingBottom: 20,
  },
  profileImageContainer: {
    backgroundColor: "#FCFCFF",
    width: 160,
    height: 160,
    borderRadius: 80,
    marginTop: -80,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center"
  },
  profileImage: {
    width: 150,
    height: 150,
    resizeMode: "cover",
    borderRadius: 75
  },
  text: {
    fontFamily: "OpenSans",
    alignSelf: "flex-start",
    color: colors(false).text,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 13,
    paddingTop: 2,
  },
  textInputLabel: {
    fontWeight: "bold",
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
    fontSize: 16,
  },
  disabledInput: {
    backgroundColor: "#F1F5F9",
    opacity: 0.8,
  },
  emailSecurityText: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 6,
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
  textInputPhone: {
    paddingLeft: 110,
  },
  countryCodeContainer: {
    position: "absolute",
    left: 10,
    top: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  usFlag: {
    height: 25,
    width: 25,
    resizeMode: "contain",
  },
  countryCodeArrow: {
    position: "relative",
    right: 0,
    marginLeft: 10,
    backgroundColor: 'transparent',
  },
  textCountryCode: {
    alignSelf: "center",
    marginLeft: 10,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  centerView: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "#33415580",
  },
  modalViewContainer: {
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
  textOutsideCountry: {
    fontWeight: "700",
    fontSize: 26,
    lineHeight: 28,
    marginVertical: 10,
    color: "#0F172A",
  },
  textOnlySupportCountry: {
    fontSize: 18,
  },
  continueBtn: {
    backgroundColor: "#3333CC",
    width: "100%",
    padding: 15,
    borderRadius: 10,
    marginTop: 25,
  },
  textContinueBtn: {
    color: colors(false).white,
    fontWeight: "700",
    fontSize: 18,
    alignSelf: "center",
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#ffffffdd',
    alignItems: "center",
    justifyContent: "center",
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
  divider: {
    backgroundColor: '#E2E8F0',
    height: 1,
  },
  cameraGalleryOption: {
    borderRadius: 10,
    backgroundColor: '#EDEDFF',
    alignItems: 'center',
  },
  takeChoosePhoto: {
    fontSize: 14,
    fontWeight: '400',
    color: '#4949EE',
    marginVertical: 15,
  },
  cancelCameraPopup: {
    borderRadius: 10,
    backgroundColor: '#EDEDFF',
    marginTop: 15,
    alignItems: 'center',
  },
  cancelCameraText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4949EE',
    marginVertical: 20,
  },
  backBtn: {
    marginLeft: 16,
    paddingTop: 10,
    width: 20,
    position: 'absolute'
  },
  profilePic: {
    borderRadius: 25,
    backgroundColor: '#4949EE',
    width: 45,
    height: 45,
    position: 'absolute',
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: "center",
  },
  cancelEdit: {
    color: '#3333CC',
    fontWeight: '700',
    lineHeight: 24,
    marginBottom: '4%',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
  save: {
    backgroundColor: '#3333CC',
    borderRadius: 8,
    height: 56,
    justifyContent: 'center',
    marginTop: 10,
  },
  countryCodeAndroidModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000080',
  },
  countryCodeAndroidModalView: {
    width: '90%',
    maxHeight: '95%',
    backgroundColor: '#FFFFFF',
    padding: 10,
  },
});
// Customizable Area End

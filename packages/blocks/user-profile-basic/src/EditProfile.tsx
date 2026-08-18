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
  TextInput,
  Modal,
  ActivityIndicator,
  Dimensions,
} from "react-native";

import {
  leftArrowWhite,
  defaultProfile,
  editIcon,
} from "./assets";
import { usFlag } from "../../email-account-registration/src/assets";

import {
  lightTheme,
  redesignTheme,
} from "../../utilities/src/Colors";
import { getStorageData, removeStorageData } from "../../../framework/src/Utilities";
import { Picker } from '@react-native-picker/picker';
import FastImage from "../../../components/src/SafeFastImage"
import Feather from "react-native-vector-icons/Feather";
import { SafeAreaView } from "react-native-safe-area-context";

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

  get styles() {
    return this.state.isDarkMode ? darkEditStyles : lightEditStyles;
  }

  // Customizable Area Start
  renderCameraGalleryPopup = () => {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.state.showCameraGalleryPopup}
        statusBarTranslucent
        presentationStyle="overFullScreen"
        onRequestClose={this.handleCameraGalleryCancelPopup}
      >
        <View style={this.styles.photoSheetOverlay}>
          <TouchableOpacity
            activeOpacity={1}
            style={this.styles.photoSheetBackdrop}
            onPress={this.handleCameraGalleryCancelPopup}
          />
          <View style={this.styles.photoSheetWrap}>
            <View style={this.styles.cameraGalleryOption}>
              <View style={this.styles.photoSheetHandle} />
              <Text style={this.styles.photoSheetTitle}>Update photo</Text>
              <TouchableOpacity
                testID="cameraOption"
                style={this.styles.photoSheetRow}
                onPress={this.handleCamera}
                activeOpacity={0.8}
              >
                <Feather
                  name="camera"
                  size={18}
                  color={this.getProfileTheme().foreground}
                />
                <Text style={this.styles.takeChoosePhoto}>Take photo</Text>
              </TouchableOpacity>
              <View style={this.styles.divider} />
              <TouchableOpacity
                testID="galleryOption"
                style={this.styles.photoSheetRow}
                onPress={this.handleGallery}
                activeOpacity={0.8}
              >
                <Feather
                  name="image"
                  size={18}
                  color={this.getProfileTheme().foreground}
                />
                <Text style={this.styles.takeChoosePhoto}>Choose photo</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              testID="cancelOption"
              style={this.styles.cancelCameraPopup}
              onPress={this.handleCameraGalleryCancelPopup}
              activeOpacity={0.8}
            >
              <Text style={this.styles.cancelCameraText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    )
  }

  renderHeader = () => {
    return (
      <SafeAreaView
        edges={['top']}
        style={this.styles.bannerOverlay}
        pointerEvents="box-none"
      >
        <View style={this.styles.bannerOverlayInner} pointerEvents="box-none">
          <TouchableOpacity
            testID="navigationBackButton"
            style={this.styles.overlayCircleBtn}
            onPress={() => {
              this.props.navigation.goBack();
            }}
            activeOpacity={0.8}
          >
            <Feather name="chevron-left" size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <Text testID="testLabel" style={this.styles.overlayTitle} numberOfLines={1}>
            Edit Profile
          </Text>
          <View style={this.styles.overlaySideSpacer} />
        </View>
      </SafeAreaView>
    );
  };

  getEditCoverSource = () => {
    const coverUri = (this.state.coverPic || '').trim();
    if (coverUri !== '' && coverUri !== 'null' && coverUri !== 'undefined') {
      return { uri: coverUri, priority: FastImage.priority.high };
    }
    return require('../../../mobile/assets/images/profile_concert_bg.png');
  };

  renderProfile = () => {
    return (
      <View style={this.styles.heroWrap}>
        <View style={this.styles.bannerWrap}>
          <FastImage
            source={this.getEditCoverSource()}
            style={this.styles.bannerImage}
            resizeMode={FastImage.resizeMode.cover}
          />
          {this.renderHeader()}
          <TouchableOpacity
            testID="coverPicButton"
            style={this.styles.coverPicBtn}
            onPress={() => {
              this.handleProfilePic("cover")
            }}
          >
            <Feather name="edit-2" size={14} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <View style={this.styles.avatarRow}>
          <View style={this.styles.avatarWrap}>
            <View style={this.styles.profileImageContainer}>
              <FastImage source={this.state.profilePic ?
                {
                  uri: this.state.profilePic,
                  priority: FastImage.priority.high
                } :
                defaultProfile
              }
                style={this.styles.profileImage}
                resizeMode={FastImage.resizeMode.cover}
              />
            </View>
            <TouchableOpacity testID="profilePicButton" style={this.styles.profilePic}
              onPress={() => {
                this.handleProfilePic("profile")
              }}>
              <Feather name="edit-2" size={14} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }

  renderName = () => {
    return (
      <>
        <Text style={[this.styles.text, this.styles.textInputLabel]}>Name</Text>
        <TextInput
          testID="nameTextInput"
          placeholder="Enter your name"
          placeholderTextColor={this.getProfileTheme().muted}
          style={this.styles.textInput}
          value={this.state.firstName}
          onChangeText={(name) => this.handleName(name)}
        />
      </>
    )
  }

  renderEmailAddress = () => {
    return (
      <>
        <Text style={[this.styles.text, this.styles.textInputLabel]}>
          Email address
        </Text>
        <TextInput
          testID="emailTextInput"
          placeholder="Enter your email address"
          placeholderTextColor={this.getProfileTheme().muted}
          style={[this.styles.textInput, this.styles.disabledInput]}
          value={this.state.email}
          editable={false}
        />
        <Text style={[this.styles.text, this.styles.emailSecurityText]}>
          You cannot change the email for security reasons, if you need to change the email, please contact us
        </Text>
      </>
    )
  }

  renderSelectedCountry = () => {
    return (
      <>
        <Text style={[this.styles.text, this.styles.textInputLabel]}>Country</Text>
        {Platform.OS === 'ios' ? this.renderCountryDropdowniOS() : this.renderCountryDropdownAndroid()}
      </>
    )
  }

  renderCountryDropdowniOS = () => {
    return (
      <TouchableOpacity
        testID="btnCountrySelectiOS"
        style={[this.styles.textInput, this.styles.selector]}
        onPress={this.handleCountryClick} >
        <Text style={[this.styles.text, { marginHorizontal: 10 }]}>
          {this.state.selectedCountry || "Select a country"}
        </Text>
        <Image source={leftArrowWhite} style={[this.styles.downArrow, { tintColor: this.getProfileTheme().primary }]} />
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
          <View style={this.styles.centeredView}>
            <TouchableWithoutFeedback>
              <View style={[this.styles.modalView, { borderTopStartRadius: 20, padding: 15 }]}>
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
      <View style={[this.styles.textInput, this.styles.selector, {
        paddingHorizontal: 0
      }]}>
        <Picker
          testID="countryAndroidPicker"
          style={[this.styles.textInput, this.styles.selector]}
          itemStyle={this.styles.text}
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
        <Image source={leftArrowWhite} style={[this.styles.downArrow, { tintColor: this.getProfileTheme().primary }]} />
      </View>
    )
  }

  renderSelectedState = () => {
    return (
      <>
        <Text style={[this.styles.text, this.styles.textInputLabel]}>State</Text>
        {Platform.OS === 'ios' ? this.renderStateiOS() : this.renderStateAndroid()}
      </>
    )
  }

  renderStateiOS = () => {
    return (
      <TouchableOpacity
        testID="btnStateSelect"
        style={[this.styles.textInput, this.styles.selector, { opacity: this.dynamicOpacity(this.state.selectedCountry !== "" && (this.state.selectedCountry === "United States" || this.state.selectedCountry === "US")) }]}
        disabled={this.state.selectedCountry === "" || this.state.selectedCountry !== "United States"}
        onPress={this.handleStateClick} >
        <Text style={[this.styles.text, { marginHorizontal: 10 }]}>
          {this.state.selectedState ? this.state.states.filter(({ key }) => key === this.state.selectedState)[0]?.name : "Select a state"}
        </Text>
        <Image source={leftArrowWhite} style={[this.styles.downArrow, { tintColor: this.getProfileTheme().primary }]} />
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
          <View style={this.styles.centeredView}>
            <TouchableWithoutFeedback>
              <View style={[this.styles.modalView, { borderTopStartRadius: 20, padding: 15 }]}>
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
      <View style={[this.styles.textInput, this.styles.selector, {
        paddingHorizontal: 0,
        opacity: this.dynamicOpacity(this.state.selectedCountry !== "" && (this.state.selectedCountry === "United States" || this.state.selectedCountry === "US"))
      }]}>
        <Picker
          testID="statePicker"
          style={[this.styles.textInput, this.styles.selector]}
          itemStyle={this.styles.text}
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
        <Image source={leftArrowWhite} style={[this.styles.downArrow, { tintColor: this.getProfileTheme().primary }]} />
      </View>
    )
  }

  renderSelectedCity = () => {
    return (
      <>
        <Text style={[this.styles.textInputLabel, this.styles.text]}>City</Text>
        {Platform.OS === "ios" ? this.renderCityiOS() : this.renderCityAndroid()}
      </>
    )
  }

  renderCityiOS = () => {
    return (
      <TouchableOpacity
        testID="btnCitySelect"
        style={[this.styles.textInput, this.styles.selector, { opacity: this.dynamicOpacity(this.state.selectedState) }]}
        onPress={this.handleCityClick}
        disabled={this.state.selectedState === ""} >
        <Text style={[this.styles.text, { marginHorizontal: 10 }]}>
          {this.state.selectedCity || "Select a city"}
        </Text>
        <Image source={leftArrowWhite} style={[this.styles.downArrow, { tintColor: this.getProfileTheme().primary }]} />
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
          <View style={[this.styles.centeredView]}>
            <TouchableWithoutFeedback>
              <View style={[this.styles.modalView, { borderTopStartRadius: 20, padding: 15 }]}>
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
      <View style={[this.styles.selector, this.styles.textInput, {
        paddingHorizontal: 0,
        opacity: this.state.selectedState ? 1 : 0.5
      }]}>
        <Picker
          testID="cityPickerTag"
          style={[this.styles.selector, this.styles.textInput]}
          itemStyle={this.styles.text}
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
        <Image source={leftArrowWhite} style={[this.styles.downArrow, { tintColor: this.getProfileTheme().primary }]} />
      </View>
    )
  }

  renderPhone = () => {
    return (
      <>
        <Text style={[this.styles.text, this.styles.textInputLabel]}>
          Cell phone
        </Text>
        {Platform.OS === "ios" ?
          <View>
            <TextInput
              testID="phoneTextInput"
              style={[this.styles.textInput, this.styles.textInputPhone]}
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
        style={this.styles.countryCodeContainer}
        onPress={this.handleShowCountryCode}
      >
        <Image source={hasFlag ? { uri: this.state.selectedCountryCode.attributes.map_url } : usFlag} style={this.styles.usFlag} />
        <Image
          source={leftArrowWhite}
          style={[this.styles.downArrow, this.styles.countryCodeArrow, { tintColor: this.getProfileTheme().primary }]} />
        <Text
          style={[this.styles.text, this.styles.textCountryCode]}
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
          <View style={this.styles.centeredView}>
            <TouchableWithoutFeedback>
              <View style={[this.styles.modalView, { borderTopStartRadius: 20, padding: 15 }]}>
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
          style={[this.styles.textInput, this.styles.textInputPhone]}
          keyboardType="numeric"
          value={this.state.phoneNumber}
          onChangeText={(phone) => this.handlePhoneNumber(phone)}
          maxLength={10}
        />
        <TouchableOpacity
          testID="btnCountryCodeSelectAndroid"
          style={this.styles.countryCodeContainer}
          onPress={() => { this.setState({ countryCodeClickedAndroid: true }) }}
        >
          <Image source={hasFlag ? { uri: this.state.selectedCountryCode.attributes.map_url } : usFlag} style={this.styles.usFlag} />
          <Image
            source={leftArrowWhite}
            style={[this.styles.downArrow, this.styles.countryCodeArrow, { tintColor: this.getProfileTheme().primary }]} />
          <Text
            style={[this.styles.text, this.styles.textCountryCode]}>{code}</Text>
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
        <View style={this.styles.centerView}>
          <View style={this.styles.modalViewContainer}>
            <Text style={this.styles.textOutsideCountry}>
              Are you outside the US?
            </Text>
            <Text style={[this.styles.text, this.styles.textOnlySupportCountry]}>
              We only support the United States right now.
            </Text>
            <TouchableOpacity
              testID="btnAccept"
              style={this.styles.continueBtn}
              onPress={this.hideCountryCodeDropdown}
            >
              <Text style={[this.styles.text, this.styles.textContinueBtn]}>
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
        style={{ flex: 1, backgroundColor: this.getProfileTheme().background }}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            this.hideKeyboard();
          }}
        >
          <View style={this.styles.container}>
            <ScrollView
              style={this.styles.contentContainer}
              showsVerticalScrollIndicator={false}
              contentInsetAdjustmentBehavior="never"
              automaticallyAdjustContentInsets={false}
              contentInset={{ top: 0 }}
              contentContainerStyle={{ paddingTop: 0 }}
            >
              <View style={this.styles.contentContainer}>
                <StatusBar
                  translucent
                  backgroundColor="transparent"
                  barStyle="light-content"
                />
                <View style={this.styles.bottomContainer}>
                  {this.renderProfile()}
                  <View style={this.styles.formContent}>
                    {this.renderName()}
                    <Text style={[this.styles.text, this.styles.errorText, {
                      marginBottom: this.state.nameError !== "" ? 10 : 0,
                    }]}>{this.state.nameError}</Text>
                    {this.renderEmailAddress()}
                    <Text style={[this.styles.text, this.styles.errorText]}>{this.state.emailError}</Text>
                    {this.renderSelectedCountry()}
                    <Text style={[this.styles.text, this.styles.errorText,]}>{this.state.countryError}</Text>
                    {this.renderSelectedState()}
                    <Text style={[this.styles.text, this.styles.errorText]}>{this.state.stateError}</Text>
                    {this.renderSelectedCity()}
                    <Text style={[this.styles.text, this.styles.errorText]}>{this.state.cityError}</Text>
                    {this.renderPhone()}
                    <Text style={[this.styles.text, this.styles.errorText]}>{this.state.phoneError}</Text>
                    <TouchableOpacity
                      testID="cancelButton" onPress={() => {
                        this.props.navigation.goBack()
                      }} >
                      <Text style={this.styles.cancelEdit}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      testID="saveBtn"
                      style={this.styles.save}
                      onPress={() => {
                        this.updateProfile()
                      }}>
                      <Text style={this.styles.textStyle}>Save</Text>
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
                <View style={this.styles.countryCodeAndroidModal}>
                  <View style={this.styles.countryCodeAndroidModalView}>
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
              {/* {this.state.isLoading && <View style={this.styles.loadingContainer}>
                <ActivityIndicator size={'large'} color="black" />
              </View>} */}
            </ScrollView>
          </View>
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
    await this.loadProfileTheme();

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
const EDIT_BANNER_HEIGHT = Math.round(Dimensions.get('window').height * 0.28);

const createFanEditStyles = (theme: typeof redesignTheme) =>
  StyleSheet.create({
  container: {
    flex: 1,
    marginLeft: "auto",
    marginRight: "auto",
    width: Platform.OS === "web" ? "75%" : "100%",
    maxWidth: 650,
    backgroundColor: theme.background,
  },
  headerIcon: {
    width: 12,
    resizeMode: "contain",
  },
  headerTitle: {
    fontWeight: "700",
    fontSize: 20,
    color: theme.foreground,
    textAlign: 'center',
  },
  heroWrap: {
    backgroundColor: theme.background,
    marginBottom: 8,
  },
  bannerWrap: {
    width: '100%',
    height: EDIT_BANNER_HEIGHT,
    backgroundColor: theme.input,
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: EDIT_BANNER_HEIGHT,
  },
  bannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  bannerOverlayInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 12,
  },
  overlayCircleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(8, 8, 15, 0.55)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255, 255, 255, 0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  overlaySideSpacer: {
    width: 36,
    height: 36,
  },
  overlayTitle: {
    flex: 1,
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.45)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: -42,
  },
  avatarWrap: {
    width: 92,
    height: 92,
  },
  editProfilePill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.editButtonBorder,
    backgroundColor: theme.editButton,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginBottom: 8,
  },
  editProfilePillText: {
    color: theme.editButtonText,
    fontWeight: '600',
    fontSize: 14,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: theme.background,
  },
  topBackdrop: {
    backgroundColor: theme.input,
    height: EDIT_BANNER_HEIGHT,
    width: "100%",
    overflow: "hidden",
  },
  coverImage: {
    width: "100%",
    height: EDIT_BANNER_HEIGHT,
  },
  coverPicBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    position: "absolute",
    right: 14,
    bottom: 14,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(8, 8, 15, 0.55)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.22)",
  },
  bottomContainer: {
    flex: 1,
    backgroundColor: theme.background,
    width: "100%",
    paddingBottom: 20,
  },
  formContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  profileImageContainer: {
    backgroundColor: theme.background,
    width: 92,
    height: 92,
    borderRadius: 46,
    borderWidth: 3,
    borderColor: theme.primary,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  profileImage: {
    width: 86,
    height: 86,
    resizeMode: "cover",
    borderRadius: 43
  },
  text: {
    fontFamily: "OpenSans",
    alignSelf: "flex-start",
    color: theme.foreground,
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
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
    backgroundColor: theme.card,
    color: theme.foreground,
    height: 50,
    fontSize: 16,
  },
  disabledInput: {
    backgroundColor: theme.input,
    opacity: 0.8,
  },
  emailSecurityText: {
    fontSize: 12,
    color: theme.muted,
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
    backgroundColor: theme.background,
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
    backgroundColor: theme.background,
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
    color: theme.foreground,
  },
  textOnlySupportCountry: {
    fontSize: 18,
  },
  continueBtn: {
    backgroundColor: theme.primary,
    width: "100%",
    padding: 15,
    borderRadius: 10,
    marginTop: 25,
  },
  textContinueBtn: {
    color: '#FFFFFF',
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
    backgroundColor: theme.background,
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
    backgroundColor: theme.border,
    height: 1,
    marginHorizontal: 16,
  },
  cameraGalleryOption: {
    borderRadius: 16,
    backgroundColor: theme.card,
    alignItems: 'stretch',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.border,
  },
  photoSheetOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(8, 8, 15, 0.72)',
    zIndex: 9999,
    elevation: 9999,
  },
  photoSheetBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  photoSheetWrap: {
    paddingHorizontal: 16,
    paddingBottom: 118,
    zIndex: 2,
  },
  photoSheetHandle: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.border,
    marginTop: 10,
    marginBottom: 8,
  },
  photoSheetTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.muted,
    textAlign: 'center',
    marginBottom: 6,
  },
  photoSheetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  takeChoosePhoto: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.foreground,
    marginLeft: 10,
  },
  cancelCameraPopup: {
    borderRadius: 16,
    backgroundColor: theme.card,
    marginTop: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.border,
  },
  cancelCameraText: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.primary,
    marginVertical: 16,
  },
  backBtn: {
    marginLeft: 16,
    paddingTop: 10,
    width: 20,
    position: 'absolute'
  },
  profilePic: {
    borderRadius: 16,
    backgroundColor: theme.primary,
    width: 32,
    height: 32,
    position: 'absolute',
    right: -2,
    bottom: -2,
    justifyContent: 'center',
    alignItems: "center",
    zIndex: 2,
  },
  cancelEdit: {
    color: theme.primary,
    fontWeight: '700',
    lineHeight: 24,
    marginBottom: '4%',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
  save: {
    backgroundColor: theme.primary,
    borderRadius: 24,
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

const darkEditStyles = createFanEditStyles(redesignTheme);
const lightEditStyles = createFanEditStyles(lightTheme);
// Customizable Area End

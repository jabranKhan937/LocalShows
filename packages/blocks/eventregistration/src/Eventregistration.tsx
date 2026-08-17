import React from 'react';

// Customizable Area Start
import {
  Dimensions,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Modal,
  Image,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';

import MergeEngineUtilities from '../../utilities/src/MergeEngineUtilities';
import {colors} from '../../utilities/src/Colors';
import {
  downArrow,
  leftArrow,
  remove,
  upArrow,
  menuIcon,
  notificationIcon,
} from '../../eventregistration/src/assets';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Picker} from '@react-native-picker/picker';
import moment from 'moment';
import Icon from 'react-native-vector-icons/Feather';
const DateRangePicker = require('react-native-daterange-picker').default;
//@ts-ignore
import {ItineraryProps} from './EventregistrationController';
import {Calendar} from 'react-native-calendars';

// Merge Engine - import assets - Start
// Merge Engine - import assets - End

// Merge Engine - Artboard Dimension  - Start
let artBoardHeightOrg = 667;
let artBoardWidthOrg = 375;
// Merge Engine - Artboard Dimension  - End
// Customizable Area End

import EventregistrationController, {
  Props,
  configJSON,
} from './EventregistrationController';

export default class Eventregistration extends EventregistrationController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    Dimensions.addEventListener('change', e => {
      MergeEngineUtilities.init(
        artBoardHeightOrg,
        artBoardWidthOrg,
        Dimensions.get('window').height,
        Dimensions.get('window').width,
      );
      this.forceUpdate();
    });
    // Customizable Area End
  }

  // Customizable Area Start

  ItineraryCard = (card: ItineraryProps, index: number) => {
    const hasMoreCards = this.state.itineraryList.length > 1;
    const {cityName, endDate, showsCount, startDate, hasAcceptButton} = card;
    const cityNameFormatted =
      cityName.charAt(0).toUpperCase() + cityName.slice(1);
    return (
      <TouchableOpacity
        key={index}
        activeOpacity={0.9}
        testID="ItineraryDetailsPress"
        onPress={() => this.handleSelectedItineraryCard(card)}
        style={[
          styles.soldoutContainerSty,
          {marginTop: hasMoreCards ? 0 : 10},
        ]}>
        <View style={styles.soldoutViewSty} />
        <View style={styles.soldoutView2Sty}>
          <View style={styles.itineraryHeader}>
            <Text style={styles.itineraryCardTitle}>
              Shows in{' '}
              <Text style={styles.itineraryCardDescription}>
                {cityNameFormatted}
              </Text>{' '}
              ({showsCount})
            </Text>
            <TouchableOpacity
              style={styles.removeIconBtn}
              testID={`removeCardBtn-${index}`}
              activeOpacity={0.7}
              onPress={() => this.handleToogleModalDeleteItinerary(card)}>
              <Image source={remove} style={styles.removeIcon} />
            </TouchableOpacity>
          </View>
          <Text style={styles.label}>
            From {startDate} to {endDate}
          </Text>
        </View>
        <View style={{position: 'absolute', bottom: -60, left: 0, right: 0}}>
          {hasAcceptButton && this.renderAcceptBtn(card)}
        </View>
      </TouchableOpacity>
    );
  };
  renderErrorMessage = (
    fieldName: 'Date' | 'Country' | 'State' | 'City' | '',
  ) => {
    const isBlank = this.state.fieldNameBlank === fieldName;
    return (
      <>
        {isBlank && (
          <Text style={[styles.text, styles.errorTextMsg]}>
            {fieldName} field cannot be blank
          </Text>
        )}
      </>
    );
  };
  renderNotificationIndicator = () => {
    const count = this.state.unreadNotificationCount || 0;
    if (count > 0) {
      const displayCount = count > 99 ? '99+' : `${count}`;
      return (
        <View style={styles.notificationBadge}>
          <Text style={styles.notificationBadgeText}>{displayCount}</Text>
        </View>
      );
    }

    return this.renderRedDot({ condition: this.state.newNotification });
  };

  renderRedDot = ({ condition }: { condition: boolean }) => {
    if (condition) {
      return <View style={styles.redDot} />;
    }

    return null;
  };

  renderHeader = () => {
    return (
      <View style={styles.headerContainer1}>
        <TouchableOpacity
          testID="navigationBackButton"
          onPress={this.handleBackNavigationPress}
          style={styles.backArrowBtn}>
          <Image source={leftArrow} style={styles.backArrowStyle} />
        </TouchableOpacity>
        <Text style={styles.headerTitleTextSty}>Travel</Text>
        <View style={styles.iconsContainSty}>
          <TouchableOpacity
            testID="notificationIcon"
            style={styles.notificationIconConStyle}
            onPress={this.handleNotificationNavigationPressed}>
            <View style={styles.notificationWrapper}>
              <Image source={notificationIcon} style={styles.notificationIcon} />
              {this.renderNotificationIndicator()}
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            testID="hamburger"
            onPress={() => this.props.navigation.openDrawer()}>
            <Image style={styles.hamburgerIcon} source={menuIcon} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  renderPrivateAccount = () => {
    return (
      <View style={styles.rowViewSty}>
        <View style={styles.subView}>
          <Text style={[styles.text, {fontWeight: 'bold'}]}>
            Match my preferences
          </Text>
          <Image
            source={require('../../../mobile/assets/images/termsAndConditions.png')}
            style={styles.img}
          />
        </View>
        <TouchableWithoutFeedback
          onPress={() =>
            this.setState({isPrivateAccount: !this.state.isPrivateAccount})
          }
          testID="privateAccount">
          <View
            style={[
              styles.switchContainerSty,
              {
                backgroundColor: this.state.isPrivateAccount
                  ? '#4949EE'
                  : '#94A3B8',
              },
            ]}>
            <View
              style={[
                styles.switchButtonSty,
                {
                  alignSelf: this.state.isPrivateAccount
                    ? 'flex-end'
                    : 'flex-start',
                },
              ]}
            />
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  };
  renderCountry = () => {
    return (
      <View>
        <Text style={[styles.text, styles.textInputLabel]}>Country</Text>
        {this.renderCountryiOSDropdown()}
      </View>
    );
  };

  renderCountryiOSDropdown = () => {
    return (
      <TouchableOpacity
        testID="btnCountrySelect"
        activeOpacity={1}
        onPress={this.handleToogleModalCountryField}
        style={[styles.textInputSty, styles.selectorSty]}>
        <Text style={[styles.text, styles.selectorTextSty]}>
          {this.state.selectedCountry}
        </Text>
        <Image source={leftArrow} style={styles.downArrowSty} />
      </TouchableOpacity>
    );
  };

  renderTypeModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.typeFieldClicked}>
        <TouchableWithoutFeedback
          testID="hideTypeModal"
          onPress={this.handleToogleModalTypeField}>
          <View style={styles.centeredView}>
            <TouchableWithoutFeedback>
              <View
                style={[
                  styles.modalView,
                  {borderTopStartRadius: 20, padding: 15},
                ]}>
                <Picker
                  testID="typePickerModal"
                  selectedValue={this.state.selectedType}
                  onValueChange={(selectedType: string) =>
                    this.handleSelectedTypeIos(selectedType)
                  }>
                  {this?.state?.typesList?.map(item => (
                    <Picker.Item
                      key={item.id}
                      value={item.attributes.name}
                      label={item.attributes.name}
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
  renderCountryModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.countryFieldClicked}>
        <TouchableWithoutFeedback
          testID="hideCountryModal"
          onPress={this.handleToogleModalCountryField}>
          <View style={styles.centeredView}>
            <TouchableWithoutFeedback>
              <View
                style={[
                  styles.modalView,
                  {borderTopStartRadius: 20, padding: 15},
                ]}>
                <Picker
                  testID="countryPickerModal"
                  selectedValue={this.state.selectedCountry}
                  onValueChange={(selectedCountry: string) =>
                    this.handleSelectedCountryiOS(selectedCountry)
                  }>
                  {this?.state?.countriesList?.map(
                    ({country_code, country_name}) => (
                      <Picker.Item
                        key={country_code}
                        value={country_name}
                        label={country_name}
                      />
                    ),
                  )}
                </Picker>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };
  renderCountryAlertModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.otherCountrySelectedModal}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.textOutsideCountry}>
              {configJSON.textOutsideCountry}
            </Text>
            <Text style={[styles.text, styles.textOnlySupportCountry]}>
              {configJSON.textOnlySupportCountry}
            </Text>
            <TouchableOpacity
              testID="btnAccept"
              style={styles.continueBtn}
              onPress={this.hideCountryAlert}>
              <Text style={[styles.text, styles.textContinueBtn]}>
                {configJSON.acceptTextButton}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  renderState = () => {
    return (
      <>
        <Text style={[styles.text, styles.textInputLabel]}>State</Text>
        {this.isPlatformiOS()
          ? this.renderStateiOS()
          : this.renderStateAndroid()}
      </>
    );
  };

  renderStateiOS = () => {
    const {selectedState, selectedCountry} = this.state;
    const isCountryFieldInvalid =
      selectedCountry === '' || selectedCountry !== 'United States';
    const stateName =
      this.state.states.find(({name}) => name === selectedState)?.name ??
      'Select a state';
    return (
      <TouchableOpacity
        testID="btnStateSelect"
        disabled={isCountryFieldInvalid}
        onPress={this.handleToogleModalStatesField}
        style={[
          styles.textInputSty,
          styles.selectorSty,
          {opacity: isCountryFieldInvalid ? 0.5 : 1},
        ]}>
        <Text style={[styles.text, styles.selectorTextSty]}>{stateName}</Text>
        <Image source={leftArrow} style={styles.downArrowSty} />
      </TouchableOpacity>
    );
  };

  renderStateAndroid = () => {
    const isCountryFieldInvalid =
      this.state.selectedCountry === '' ||
      this.state.selectedCountry !== 'United States';

    return (
      <View
        style={[
          styles.textInputSty,
          styles.selectorSty,
          {
            paddingHorizontal: 0,
          },
        ]}>
        <Picker
          testID="statePicker"
          style={[
            styles.textInputSty,
            styles.selectorSty,
            {opacity: isCountryFieldInvalid ? 0.5 : 1},
          ]}
          selectedValue={this.state.selectedState}
          onValueChange={(selectedState: string) =>
            this.onSelectState(selectedState)
          }
          itemStyle={[styles.text, styles.selectorTextSty]}
          enabled={!isCountryFieldInvalid}>
          <Picker.Item label={'Select a state'} value={''} />
          {this?.state?.states?.map(({key, name}) => (
            <Picker.Item label={name} key={key} value={key} />
          ))}
        </Picker>
        <Image source={leftArrow} style={styles.downArrowSty} />
      </View>
    );
  };
  renderStateModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.stateFieldClicked}>
        <TouchableWithoutFeedback
          testID="hideStateModal"
          onPress={this.handleToogleModalStatesField}>
          <View style={styles.centeredView}>
            <TouchableWithoutFeedback>
              <View style={[styles.modalView, {borderTopStartRadius: 20}]}>
                <Picker
                  testID="statePickerModal"
                  selectedValue={this.state.selectedState}
                  onValueChange={(selectedState: string) =>
                    this.handleSelectedStateIOS(selectedState)
                  }>
                  {this?.state?.states?.map(({key, name}) => (
                    <Picker.Item key={key} value={name} label={name} />
                  ))}
                </Picker>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };

  renderCity = () => {
    return (
      <>
        <Text style={[styles.text, styles.textInputLabel]}>City</Text>
        {this.isPlatformiOS() ? this.renderCityiOS() : this.renderCityAndroid()}
      </>
    );
  };

  renderCityiOS = () => {
    const hasSelectedState = this.state.selectedState !== '';

    return (
      <TouchableOpacity
        testID="btnCitySelect"
        disabled={!hasSelectedState}
        style={[
          styles.textInputSty,
          styles.selectorSty,
          {opacity: hasSelectedState ? 1 : 0.5},
        ]}
        onPress={this.handleToogleModalCitiesField}>
        <Text style={[styles.text, styles.selectorTextSty]}>
          {this.state.selectedCity || 'Select a city'}
        </Text>
        <Image source={leftArrow} style={styles.downArrowSty} />
      </TouchableOpacity>
    );
  };

  renderCityAndroid = () => {
    const hasSelectedState = this.state.selectedState !== '';
    return (
      <View
        style={[
          styles.textInputSty,
          styles.selectorSty,
          {
            paddingHorizontal: 0,
          },
        ]}>
        <Picker
          testID="cityPicker"
          enabled={hasSelectedState}
          selectedValue={this.state.selectedCity}
          onValueChange={(selectedCity: string) =>
            this.handleSelectedCity(selectedCity)
          }
          style={[
            styles.textInputSty,
            styles.selectorSty,
            {opacity: hasSelectedState ? 1 : 0.5},
          ]}
          itemStyle={[styles.text, styles.selectorTextSty]}>
          <Picker.Item label={'Select a city'} value={''} />
          {this?.state?.cities?.map((name: string) => (
            <Picker.Item label={name} key={name} value={name} />
          ))}
        </Picker>
        <Image source={leftArrow} style={styles.downArrowSty} />
      </View>
    );
  };
  renderCityModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.cityFieldClicked}>
        <TouchableWithoutFeedback
          testID="hideCityModal"
          onPress={this.handleToogleModalCitiesField}>
          <View style={[styles.centeredView]}>
            <TouchableWithoutFeedback>
              <View style={[styles.modalView, {borderTopStartRadius: 20}]}>
                <Picker
                  testID="cityPickerModal"
                  selectedValue={this.state.selectedCity}
                  onValueChange={(selectedCity: string) =>
                    this.handleSelectedCityIOS(selectedCity)
                  }>
                  {this?.state?.cities?.map((name: string) => (
                    <Picker.Item key={name} value={name} label={name} />
                  ))}
                </Picker>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };
  renderType = () => {
    return (
      <>
        <Text style={[styles.text, styles.textInputLabel]}>Type</Text>
        {this.isPlatformiOS() ? this.renderTypeiOS() : this.renderTypeAndroid()}
      </>
    );
  };
  renderTypeiOS = () => {
    const {selectedType} = this.state;
    return (
      <TouchableOpacity
        testID="btnTypeSelect"
        style={[styles.textInputSty, styles.selectorSty]}
        onPress={this.handleToogleModalTypeField}>
        <Text style={[styles.text, styles.selectorTextSty]}>
          {selectedType.length ? selectedType : 'All'}
        </Text>
        <Image source={leftArrow} style={styles.downArrowSty} />
      </TouchableOpacity>
    );
  };

  renderTypeAndroid = () => {
    return (
      <View
        style={[
          styles.textInputSty,
          styles.selectorSty,
          {
            paddingHorizontal: 0,
          },
        ]}>
        <Picker
          testID="typePicker"
          selectedValue={this.state.selectedType}
          onValueChange={this.handleSelectedType}
          style={[styles.textInputSty, styles.selectorSty]}
          itemStyle={[styles.text, styles.selectorTextSty]}>
          {this?.state?.typesList?.map(item => (
            <Picker.Item
              key={item.id}
              label={item.attributes.name}
              value={item.attributes.name}
            />
          ))}
        </Picker>
        <Image source={leftArrow} style={styles.downArrowSty} />
      </View>
    );
  };
  datePicker = () => {
    const {showDateSelector, displayedDate} = this.state;
    const PRIMARY_COLOR = '#3333cc';
    return (
      <>
        {showDateSelector && (
          <View style={styles.datePickerContainer}>
            <TouchableOpacity
              testID="closeCalendar"
              style={styles.cancelDateSelectionButtonSty}
              onPress={() => this.setState({showDateSelector: false})}>
              <Icon name="x" size={30} />
            </TouchableOpacity>
            <Calendar
              testID="DateRangePicker"
              markingType="period"
              markedDates={this.state.markedDates}
              minDate={moment().format('YYYY-MM-DD')}
              onDayPress={this.handleDayPress}
              current={
                displayedDate
                  ? moment(displayedDate, 'DD-MM-YYYY').format('YYYY-MM-DD')
                  : moment().format('YYYY-MM-DD')
              }
              theme={{
                selectedDayBackgroundColor: PRIMARY_COLOR,
                todayTextColor: PRIMARY_COLOR,
                arrowColor: PRIMARY_COLOR,
                textDayFontWeight: '500',
                textMonthFontWeight: 'bold',
                selectedDayTextColor: 'white',
              }}
            />
          </View>
        )}
      </>
    );
  };
  renderAcceptBtn = (itinerary: ItineraryProps) => {
    return (
      <View style={styles.acceptCardView}>
        <Text style={styles.searchItineraryText}>
          Search added to your itinerary
        </Text>
        <TouchableOpacity
          testID="acceptBtn"
          style={styles.acceptBtnView}
          onPress={this.handleAcceptButton.bind(this, itinerary)}>
          <Text style={styles.acceptBtn}>Accept</Text>
        </TouchableOpacity>
      </View>
    );
  };
  renderDeleteItineraryModal = () => {
    let cityName = '';
    if (this.state.selectedItinerary.cityName) {
      cityName = this.state.selectedItinerary.cityName;
    }
    const itineraryName =
      this.state.selectedItinerary &&
      cityName.charAt(0).toUpperCase() + cityName.slice(1);
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.isItineraryModalClicked}>
        <TouchableOpacity
          testID="deleteItineraryModalClose"
          onPress={this.handleCancelDeleteItinerary}
          style={styles.overlayModalStyle}>
          <View style={styles.centeredView}>
            <View style={[styles.modalView, {maxHeight: 250}]}>
              <View style={styles.deleteModalTextContainer}>
                <Text style={styles.textDeleteItineraryModal}>
                  {configJSON.textTitleDeleteItinerary.concat(' ')}
                </Text>
                <Text style={styles.textDeleteItineraryModal}>
                  {itineraryName} ?
                </Text>
              </View>
              <View>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={this.handleCancelDeleteItinerary}>
                  <Text style={[styles.text, styles.textCancelBtn]}>
                    {configJSON.cancelTextButton}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  testID="btnDeleteItinerary"
                  style={styles.continueBtn}
                  onPress={this.handleDeleteItinerary}>
                  <Text style={[styles.text, styles.textContinueBtn]}>
                    {configJSON.confirm}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };
  // Customizable Area End

  render() {
    // Customizable Area Start
    // Merge Engine - render - Start
    return (
      <>
        <ScrollView
          keyboardShouldPersistTaps="always"
          ref={this.scrollRef}
          style={styles.container}
          showsVerticalScrollIndicator={false}>
          <>
            <TouchableWithoutFeedback
              testID="hideKeyboardTouchable"
              onPress={() => {
                this.hideKeyboard();
              }}>
              <View style={styles.content}>
                {this.renderHeader()}
                <Text style={styles.textSty}>
                  {
                    'If you are traveling soon and want to be on \nyour favorite’s band show, find it here.'
                  }
                </Text>
                <Text style={[styles.textDateSty, styles.textInputLabelSty]}>
                  Dates
                </Text>
                <TouchableOpacity
                  testID="btnDateSelector"
                  style={styles.dateSelectorBtn}
                  onPress={() => this.handleShowDateSelector()}>
                  <Text
                    style={[styles.textDate, styles.dateSelectorButtonTextSty]}>
                    {`${this.state.startDate} - ${this.state.endDate}`}
                  </Text>
                  <MaterialCommunityIcons
                    name="calendar-blank"
                    size={24}
                    color="#4949EE"
                  />
                </TouchableOpacity>
                {this.renderErrorMessage('Date')}
                {this.renderCountry()}
                {this.renderErrorMessage('Country')}
                {this.renderState()}
                {this.renderErrorMessage('State')}
                {this.renderCity()}
                {this.renderErrorMessage('City')}
                {this.renderType()}
                {this.renderPrivateAccount()}
                <TouchableOpacity
                  testID="addItineraryBtn"
                  style={[styles.itinerarybtn]}
                  onPress={this.handleAddToMyItinerary}>
                  <Text style={[styles.textStyle, styles.textItinerarybtn]}>
                    Add to my itinerary
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={this.handleNavigationToItineraryScreen}
                  testID="searchBtn"
                  style={[
                    styles.buttonStyle,
                    {backgroundColor: '#EDEDFF', marginTop: 15},
                  ]}>
                  <Text style={styles.serachText}>Search</Text>
                </TouchableOpacity>

                <View style={[styles.itineraryView]}>
                  <Text
                    style={[styles.text, {fontWeight: 'bold', fontSize: 16}]}>
                    Itinerary
                  </Text>
                  <TouchableWithoutFeedback
                    testID="hideCardsBtn"
                    onPress={this.handleToogleArrowIcon}>
                    <Image
                      source={this.state.isClicked ? downArrow : upArrow}
                      style={styles.iconSty}
                    />
                  </TouchableWithoutFeedback>
                </View>
                {this?.state?.itineraryList?.map((cardInfo, index) => {
                  if (!this.state.isClicked)
                    return this.ItineraryCard(cardInfo, index);
                })}
              </View>
            </TouchableWithoutFeedback>
          </>
        </ScrollView>
        {this.renderTypeModal()}
        {this.renderCountryModal()}
        {this.renderCountryAlertModal()}
        {this.renderDeleteItineraryModal()}
        {this.renderStateModal()}
        {this.renderCityModal()}
        {this.datePicker()}
      </>
    );
    // Merge Engine - render - End
    // Customizable Area End
  }
}

// Customizable Area Start
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '100%',
    maxWidth: 650,
    backgroundColor: '#F8FAFC',
  },
  content: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
  },
  headerContainer1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 16,
  },

  rootContainer: {
    flex: 1,
    backgroundColor: '#fcfcff',
  },
  backArrowBtn: {
    width: 20,
    height: 20,
    alignItems: 'center',
  },
  backArrowStyle: {
    width: 16,
    resizeMode: 'contain',
  },
  headerTitleTextSty: {
    fontFamily: 'OpenSans',
    fontWeight: '700',
    fontSize: 24,
    color: '#0F172A',
    paddingLeft: 24,
  },
  text: {
    fontFamily: 'OpenSans',
    alignSelf: 'flex-start',
    color: colors(false).text,
  },
  iconsContainSty: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hamburgerIcon: {
    height: 24,
    width: 24,
  },
  notificationIconConStyle: {
    marginRight: 10,
  },
  notificationIcon: {
    height: 24,
    width: 24,
  },
  notificationWrapper: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -6,
    right: -8,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#F04438',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  notificationBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  redDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F04438',
  },
  textSty: {
    fontFamily: 'OpenSans',
    alignSelf: 'flex-start',
    color: colors(false).text,
  },
  dateSelectorBtn: {
    width: '100%',
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#C5C5FF',
    color: colors(false).text,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    height: 50,
    backgroundColor: '#FFF',
  },
  textStyle: {
    fontFamily: 'OpenSans',
    alignSelf: 'flex-start',
    color: colors(false).white,
    fontWeight: 'bold',
  },
  dateSelectorButtonTextSty: {
    alignSelf: 'center',
  },

  datePickerContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    flex: 1,
    elevation: 2,
  },
  selectedDateSty: {
    backgroundColor: '#3333cc',
  },
  cancelDateSelectionBtn: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 50,
    height: 50,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
  },
  textDate: {
    fontFamily: 'OpenSans',
    color: colors(false).text,
  },
  textDateSty: {
    fontFamily: 'OpenSans',
    color: colors(false).text,
    marginTop: 20,
  },
  textInputLabelSty: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  textInputLabel: {
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  textInputSty: {
    width: '100%',
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#C5C5FF',
    color: colors(false).text,
    height: 50,
  },
  selectorSty: {
    height: 50,
    justifyContent: 'center',
    backgroundColor: '#FFF',
    fontFamily: 'OpenSans',
  },
  downArrowSty: {
    position: 'absolute',
    right: 15,
    marginRight: 5,
    width: 8,
    transform: [{rotate: '-90deg'}],
    resizeMode: 'contain',
    tintColor: '#4949EE',
  },
  modalViewSty: {
    height: '30%',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderTopEndRadius: 20,
    padding: 35,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 100,
  },
  selectorTextSty: {},
  centeredViewSty: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#33415580',
  },
  itinerarybtn: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#3333CC',
    height: 44,
  },
  textItinerarybtn: {
    color: colors(false).white,
    fontWeight: 'bold',
    fontSize: 18,
    alignSelf: 'center',
  },
  buttonStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#EDEDFF',
    height: 44,
  },
  dividerSty: {
    backgroundColor: '#E2E8F0',
    height: 1,
  },
  rowViewSty: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 30,
  },
  switchContainerSty: {
    width: 50,
    height: 30,
    borderRadius: 30,
  },
  switchButtonSty: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'white',
    marginTop: 1,
    marginHorizontal: 1,
  },
  img: {
    marginLeft: 10,
    height: 15,
    width: 15,
    tintColor: '#334155',
  },
  subView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  soldoutViewSty: {
    backgroundColor: '#3333CC',
    width: 4,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  soldoutView2Sty: {
    flex: 1,
    padding: 20,
  },
  soldoutTextSty: {
    color: '#334155',
    fontSize: 16,
    fontWeight: 'bold',
  },
  soldoutContainerSty: {
    flexDirection: 'row',
    borderRadius: 8,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
    elevation: 4,
    margin: 10,
    marginBottom: 30,
    width: '99%',
    alignSelf: 'center',
  },
  container1: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  contentContainer: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  date: {
    fontSize: 16,
    color: '#666',
  },
  imageContainer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  imageWrapper: {
    width: 327,
    height: 80,
    backgroundColor: '#F2F2F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageSize: {
    fontSize: 16,
    color: '#666',
  },
  itineraryView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
    alignItems: 'center',
  },
  itineraryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'relative',
    zIndex: 1,
  },
  itineraryCardTitle: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '700',
  },
  itineraryCardDescription: {
    color: '#4949EE',
    fontSize: 16,
    fontWeight: 'bold',
  },
  serachText: {
    fontWeight: '700',
    fontSize: 16,
    color: '#4949EE',
  },
  label: {
    color: '#6B7280',
    fontSize: 14,
    lineHeight: 22,
    maxWidth: 275,
  },
  removeIconBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    width: 32,
    height: 32,
    right: -15,
    top: -6,
    zIndex: 9,
  },
  removeIcon: {
    height: 20,
    width: 20,
    tintColor: '#334155',
  },
  cancelDateSelectionButtonSty: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 50,
    height: 50,
    backgroundColor: '#ffffff',
    zIndex: 2147483647,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
  },
  acceptCardView: {
    backgroundColor: '#7676FF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 45,
    width: 350,
    alignSelf: 'center',
  },
  acceptBtn: {
    color: '#3333CC',
    fontSize: 14,
    fontWeight: '700',
  },
  acceptBtnView: {
    backgroundColor: '#EDEDFF',
    alignSelf: 'flex-end',
    paddingHorizontal: 10,
    borderRadius: 8,
    paddingVertical: 6,
  },
  searchItineraryText: {
    color: colors(false).white,
    fontSize: 16,
    fontWeight: '400',
  },
  iconSty: {
    height: 28,
    width: 28,
    resizeMode: 'contain',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#33415580',
  },
  modalView: {
    height: 320,
    backgroundColor: 'white',
    borderTopEndRadius: 20,
    justifyContent: 'space-between',
    padding: 35,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 100,
  },
  textOutsideCountry: {
    fontWeight: '700',
    fontSize: 26,
    lineHeight: 28,
    marginVertical: 10,
    color: '#0F172A',
  },
  deleteModalTextContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  textDeleteItineraryModal: {
    fontWeight: '700',
    fontSize: 20,
    lineHeight: 28,
    marginVertical: 10,
    color: '#0F172A',
  },
  textOnlySupportCountry: {
    fontSize: 18,
  },
  continueBtn: {
    backgroundColor: '#3333CC',
    width: '100%',
    padding: 16,
    borderRadius: 10,
    marginVertical: 10,
  },
  textContinueBtn: {
    color: colors(false).white,
    fontWeight: '700',
    fontSize: 18,
    alignSelf: 'center',
  },
  errorTextMsg: {
    color: 'red',
    fontSize: 13,
    paddingTop: 2,
  },
  cancelBtn: {
    marginVertical: 10,
    backgroundColor: 'transparent',
  },
  textCancelBtn: {
    fontWeight: '700',
    fontSize: 18,
    alignSelf: 'center',
    color: '#4949EE',
  },
  overlayModalStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});
// Customizable Area End

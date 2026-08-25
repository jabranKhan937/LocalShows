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
  ImageBackground,
  ScrollView,
  TouchableWithoutFeedback,
  StatusBar,
  SafeAreaView,
} from 'react-native';

import MergeEngineUtilities from '../../utilities/src/MergeEngineUtilities';
import {redesignTheme} from '../../utilities/src/Colors';
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
import {ItineraryProps, TopCityItem} from './EventregistrationController';
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

type TravelTheme = typeof redesignTheme;

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

  get styles() {
    return createTravelStyles(this.getTravelTheme());
  }

  formatTravelDate = (value: string) => {
    if (!value || value === 'MM-DD-YYYY' || value === 'MM/DD/YYYY') {
      return 'Select';
    }
    const parsed = moment(value, ['MM-DD-YYYY', 'MM/DD/YYYY', 'MMM DD YYYY'], true);
    return parsed.isValid() ? parsed.format('MMM D') : value;
  };

  // Customizable Area Start

  ItineraryCard = (card: ItineraryProps, index: number) => {
    const styles = this.styles;
    const theme = this.getTravelTheme();
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
    const styles = this.styles;
    const theme = this.getTravelTheme();
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
    const styles = this.styles;
    const theme = this.getTravelTheme();
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
    const styles = this.styles;
    const theme = this.getTravelTheme();
    if (condition) {
      return <View style={styles.redDot} />;
    }

    return null;
  };

  renderHeader = () => {
    const styles = this.styles;
    const theme = this.getTravelTheme();
    return (
      <View>
        <View style={styles.headerContainer1}>
          <TouchableOpacity
            testID="navigationBackButton"
            onPress={this.handleBackNavigationPress}
            style={styles.backArrowBtn}>
            <Image
              source={leftArrow}
              style={[styles.backArrowStyle, {tintColor: theme.foreground}]}
            />
          </TouchableOpacity>
          <View style={styles.iconsContainSty}>
            <TouchableOpacity
              testID="notificationIcon"
              style={styles.notificationIconConStyle}
              onPress={this.handleNotificationNavigationPressed}>
              <View style={styles.notificationWrapper}>
                <Image
                  source={notificationIcon}
                  style={[styles.notificationIcon, {tintColor: theme.foreground}]}
                />
                {this.renderNotificationIndicator()}
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              testID="hamburger"
              onPress={() => this.props.navigation.openDrawer()}>
              <Image
                style={[styles.hamburgerIcon, {tintColor: theme.foreground}]}
                source={menuIcon}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.plannerTitleRow}>
          <MaterialCommunityIcons
            name="airplane"
            size={22}
            color={theme.primary}
          />
          <Text style={styles.headerTitleTextSty}>TRAVEL PLANNER</Text>
        </View>
      </View>
    );
  };
  renderPrivateAccount = () => {
    const styles = this.styles;
    const theme = this.getTravelTheme();
    return (
      <View style={styles.rowViewSty}>
        <View style={styles.subView}>
          <Text style={[styles.text, styles.preferenceTitle]}>
            Match My Preferences
          </Text>
          <Text style={styles.preferenceSubtitle}>
            Using saved tastes
          </Text>
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
                  ? theme.primary
                  : theme.muted,
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
    const styles = this.styles;
    const theme = this.getTravelTheme();
    return (
      <View>
        <Text style={[styles.text, styles.textInputLabel]}>Country</Text>
        {this.renderCountryiOSDropdown()}
      </View>
    );
  };

  renderCountryiOSDropdown = () => {
    const styles = this.styles;
    const theme = this.getTravelTheme();
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

  renderThemedPickerSheet = (props: {
    visible: boolean;
    hideTestID: string;
    pickerTestID: string;
    selectedValue: any;
    onHide: () => void;
    onValueChange: (value: any) => void;
    items: {key: string; label: string; value: any}[];
    title: string;
  }) => {
    const styles = this.styles;
    return (
      <Modal animationType="slide" transparent={true} visible={props.visible}>
        <TouchableWithoutFeedback
          testID={props.hideTestID}
          onPress={props.onHide}>
          <View style={styles.centeredView}>
            <TouchableWithoutFeedback>
              <View style={styles.sheetContainer}>
                <View style={styles.sheetHandle} />
                <Text style={styles.sheetTitle}>{props.title}</Text>
                <ScrollView
                  style={styles.sheetList}
                  keyboardShouldPersistTaps="always"
                  showsVerticalScrollIndicator={false}>
                  {props.items.map(item => {
                    const selected = item.value === props.selectedValue;
                    return (
                      <TouchableOpacity
                        key={item.key}
                        style={[
                          styles.sheetOption,
                          selected && styles.sheetOptionSelected,
                        ]}
                        onPress={() => props.onValueChange(item.value)}>
                        <Text
                          style={[
                            styles.sheetOptionText,
                            selected && styles.sheetOptionTextSelected,
                          ]}>
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
                  style={styles.hiddenPicker}>
                  {props.items.map(item => (
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
      visible: this.state.typeFieldClicked,
      hideTestID: 'hideTypeModal',
      pickerTestID: 'typePickerModal',
      selectedValue: this.state.selectedType,
      onHide: this.handleToogleModalTypeField,
      onValueChange: (selectedType: string) =>
        this.handleSelectedTypeIos(selectedType),
      title: 'Type',
      items: (this.state.typesList || []).map(item => ({
        key: item.id,
        label: item.attributes.name,
        value: item.attributes.name,
      })),
    });
  };
  renderCountryModal = () => {
    return this.renderThemedPickerSheet({
      visible: this.state.countryFieldClicked,
      hideTestID: 'hideCountryModal',
      pickerTestID: 'countryPickerModal',
      selectedValue: this.state.selectedCountry,
      onHide: this.handleToogleModalCountryField,
      onValueChange: (selectedCountry: string) =>
        this.handleSelectedCountryiOS(selectedCountry),
      title: 'Country',
      items: (this.state.countriesList || []).map(
        ({country_code, country_name}) => ({
          key: country_code,
          label: country_name,
          value: country_name,
        }),
      ),
    });
  };
  renderCountryAlertModal = () => {
    const styles = this.styles;
    const theme = this.getTravelTheme();
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
    const styles = this.styles;
    const theme = this.getTravelTheme();
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
    const styles = this.styles;
    const theme = this.getTravelTheme();
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
    const styles = this.styles;
    const theme = this.getTravelTheme();
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
            {opacity: isCountryFieldInvalid ? 0.5 : 1, color: theme.foreground},
          ]}
          selectedValue={this.state.selectedState}
          onValueChange={(selectedState: string) =>
            this.onSelectState(selectedState)
          }
          itemStyle={[styles.text, styles.selectorTextSty]}
          dropdownIconColor={theme.muted}
          enabled={!isCountryFieldInvalid}>
          <Picker.Item
            label={'Select a state'}
            value={''}
            color={theme.foreground}
          />
          {this?.state?.states?.map(({key, name}) => (
            <Picker.Item
              label={name}
              key={key}
              value={key}
              color={theme.foreground}
            />
          ))}
        </Picker>
        <Image source={leftArrow} style={styles.downArrowSty} />
      </View>
    );
  };
  renderStateModal = () => {
    return this.renderThemedPickerSheet({
      visible: this.state.stateFieldClicked,
      hideTestID: 'hideStateModal',
      pickerTestID: 'statePickerModal',
      selectedValue: this.state.selectedState,
      onHide: this.handleToogleModalStatesField,
      onValueChange: (selectedState: string) =>
        this.handleSelectedStateIOS(selectedState),
      title: 'State',
      items: (this.state.states || []).map(({key, name}) => ({
        key,
        label: name,
        value: name,
      })),
    });
  };

  renderCity = () => {
    const styles = this.styles;
    const theme = this.getTravelTheme();
    return (
      <>
        <Text style={[styles.text, styles.textInputLabel]}>City</Text>
        {this.isPlatformiOS() ? this.renderCityiOS() : this.renderCityAndroid()}
      </>
    );
  };

  renderCityiOS = () => {
    const styles = this.styles;
    const theme = this.getTravelTheme();
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
    const styles = this.styles;
    const theme = this.getTravelTheme();
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
            {opacity: hasSelectedState ? 1 : 0.5, color: theme.foreground},
          ]}
          itemStyle={[styles.text, styles.selectorTextSty]}
          dropdownIconColor={theme.muted}>
          <Picker.Item
            label={'Select a city'}
            value={''}
            color={theme.foreground}
          />
          {this?.state?.cities?.map((name: string) => (
            <Picker.Item
              label={name}
              key={name}
              value={name}
              color={theme.foreground}
            />
          ))}
        </Picker>
        <Image source={leftArrow} style={styles.downArrowSty} />
      </View>
    );
  };
  renderCityModal = () => {
    return this.renderThemedPickerSheet({
      visible: this.state.cityFieldClicked,
      hideTestID: 'hideCityModal',
      pickerTestID: 'cityPickerModal',
      selectedValue: this.state.selectedCity,
      onHide: this.handleToogleModalCitiesField,
      onValueChange: (selectedCity: string) =>
        this.handleSelectedCityIOS(selectedCity),
      title: 'City',
      items: (this.state.cities || []).map((name: string) => ({
        key: name,
        label: name,
        value: name,
      })),
    });
  };
  renderType = () => {
    const styles = this.styles;
    const theme = this.getTravelTheme();
    return (
      <>
        <Text style={[styles.text, styles.textInputLabel]}>Type</Text>
        {this.isPlatformiOS() ? this.renderTypeiOS() : this.renderTypeAndroid()}
      </>
    );
  };
  renderTypeiOS = () => {
    const styles = this.styles;
    const theme = this.getTravelTheme();
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
    const styles = this.styles;
    const theme = this.getTravelTheme();
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
          style={[styles.textInputSty, styles.selectorSty, {color: theme.foreground}]}
          itemStyle={[styles.text, styles.selectorTextSty]}
          dropdownIconColor={theme.muted}>
          {this?.state?.typesList?.map(item => (
            <Picker.Item
              key={item.id}
              label={item.attributes.name}
              value={item.attributes.name}
              color={theme.foreground}
            />
          ))}
        </Picker>
        <Image source={leftArrow} style={styles.downArrowSty} />
      </View>
    );
  };
  datePicker = () => {
    const {showDateSelector, displayedDate} = this.state;
    const styles = this.styles;
    const theme = this.getTravelTheme();
    return (
      <>
        {showDateSelector && (
          <View style={styles.datePickerContainer}>
            <TouchableOpacity
              testID="closeCalendar"
              style={styles.cancelDateSelectionButtonSty}
              onPress={() => this.setState({showDateSelector: false})}>
              <Icon name="x" size={30} color={theme.foreground} />
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
                calendarBackground: theme.card,
                dayTextColor: theme.foreground,
                monthTextColor: theme.foreground,
                textDisabledColor: theme.muted,
                selectedDayBackgroundColor: theme.primary,
                todayTextColor: theme.primary,
                arrowColor: theme.primary,
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
  formatTopCityShowCount = (showCount: number | null) => {
    if (showCount === null) {
      return 'Shows';
    }
    return `${showCount} ${showCount === 1 ? 'show' : 'shows'}`;
  };

  renderTopCitiesThisWeek = () => {
    const styles = this.styles;
    return (
      <View style={styles.topCitiesSection}>
        <Text style={styles.savedTripsTitle}>TOP CITIES THIS WEEK</Text>
        <View style={styles.topCitiesGrid}>
          {this.state.topCities.map(city => this.renderTopCityCard(city))}
        </View>
      </View>
    );
  };

  renderTopCityCard = (city: TopCityItem) => {
    const styles = this.styles;
    return (
      <TouchableOpacity
        key={city.id}
        activeOpacity={0.85}
        onPress={() => this.handleSelectTopCity(city)}
        style={styles.topCityCard}>
        <ImageBackground
          source={{uri: city.imageUri}}
          style={styles.topCityImage}
          imageStyle={styles.topCityImageInner}>
          <View style={styles.topCityOverlay} />
          <View style={styles.topCityTextWrap}>
            <Text style={styles.topCityName}>{city.name.toUpperCase()}</Text>
            <Text style={styles.topCityShows}>
              {this.formatTopCityShowCount(city.showCount)}
            </Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  renderEmptySavedTrips = () => {
    const styles = this.styles;
    const theme = this.getTravelTheme();
    return (
      <View style={styles.emptySavedTrips}>
        <MaterialCommunityIcons
          name="airplane"
          size={28}
          color={theme.muted}
        />
        <Text style={styles.emptySavedTripsText}>No trips planned yet</Text>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={this.handlePlanATripPress}
          style={styles.planTripBtn}>
          <Text style={styles.planTripBtnText}>Plan a Trip</Text>
        </TouchableOpacity>
      </View>
    );
  };

  renderAcceptBtn = (itinerary: ItineraryProps) => {
    const styles = this.styles;
    const theme = this.getTravelTheme();
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
    const styles = this.styles;
    const theme = this.getTravelTheme();
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
    const styles = this.styles;
    const theme = this.getTravelTheme();
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: theme.background}}>
        <StatusBar
          barStyle={this.state.isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={theme.background}
        />
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
                  Discover shows wherever you're headed. Build your trip
                  itinerary.
                </Text>
                <View style={styles.destinationCard}>
                  <View style={styles.destinationHeader}>
                    <MaterialCommunityIcons
                      name="map-marker-outline"
                      size={20}
                      color={theme.primary}
                    />
                    <Text style={styles.destinationTitle}>
                      Where are you headed?
                    </Text>
                    <Icon name="chevron-down" size={18} color={theme.muted} />
                  </View>
                  {this.renderCountry()}
                  {this.renderErrorMessage('Country')}
                  {this.renderState()}
                  {this.renderErrorMessage('State')}
                  {this.renderCity()}
                  {this.renderErrorMessage('City')}
                </View>
                <View style={styles.dateRow}>
                  <TouchableOpacity
                    testID="btnDateSelector"
                    style={styles.dateCard}
                    onPress={() => this.handleShowDateSelector()}>
                    <Text style={styles.dateCardLabel}>Depart</Text>
                    <Text style={styles.dateCardValue}>
                      {this.formatTravelDate(this.state.startDate)}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.dateCard}
                    onPress={() => this.handleShowDateSelector()}>
                    <Text style={styles.dateCardLabel}>Return</Text>
                    <Text style={styles.dateCardValue}>
                      {this.formatTravelDate(this.state.endDate)}
                    </Text>
                  </TouchableOpacity>
                </View>
                {this.renderErrorMessage('Date')}
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
                  style={[styles.buttonStyle, styles.searchBtn]}>
                  <Text style={styles.serachText}>Search</Text>
                </TouchableOpacity>

                {this.renderTopCitiesThisWeek()}

                <View style={[styles.itineraryView]}>
                  <Text style={styles.savedTripsTitle}>MY SAVED TRIPS</Text>
                  <TouchableWithoutFeedback
                    testID="hideCardsBtn"
                    onPress={this.handleToogleArrowIcon}>
                    <Image
                      source={this.state.isClicked ? downArrow : upArrow}
                      style={[styles.iconSty, {tintColor: theme.primary}]}
                    />
                  </TouchableWithoutFeedback>
                </View>
                {this?.state?.itineraryList?.map((cardInfo, index) => {
                  if (!this.state.isClicked)
                    return this.ItineraryCard(cardInfo, index);
                })}
                {(!this.state.itineraryList ||
                  this.state.itineraryList.length === 0) &&
                  this.renderEmptySavedTrips()}
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
      </SafeAreaView>
    );
    // Merge Engine - render - End
    // Customizable Area End
  }
}

const createTravelStyles = (theme: TravelTheme) => StyleSheet.create({
  container: {
    flex: 1,
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '100%',
    maxWidth: 650,
    backgroundColor: theme.background,
  },
  content: {
    backgroundColor: theme.background,
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  headerContainer1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 8,
  },
  plannerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  rootContainer: {
    flex: 1,
    backgroundColor: theme.background,
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
    fontWeight: '800',
    fontSize: 22,
    color: theme.foreground,
    paddingLeft: 10,
    letterSpacing: 0.6,
  },
  text: {
    fontFamily: 'OpenSans',
    alignSelf: 'flex-start',
    color: theme.foreground,
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
    backgroundColor: theme.primary,
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
    backgroundColor: theme.primary,
  },
  textSty: {
    fontFamily: 'OpenSans',
    alignSelf: 'flex-start',
    color: theme.muted,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 18,
  },
  destinationCard: {
    backgroundColor: theme.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.border,
    padding: 14,
    marginBottom: 16,
  },
  destinationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  destinationTitle: {
    fontFamily: 'OpenSans',
    fontWeight: '600',
    fontSize: 16,
    color: theme.muted,
    marginLeft: 8,
    flex: 1,
  },
  emptySavedTrips: {
    minHeight: 168,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: theme.border,
    backgroundColor: theme.card,
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  emptySavedTripsText: {
    color: theme.muted,
    fontSize: 14,
    fontFamily: 'OpenSans',
    marginTop: 10,
    marginBottom: 16,
  },
  planTripBtn: {
    backgroundColor: 'rgba(255, 45, 107, 0.16)',
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  planTripBtnText: {
    color: theme.primary,
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'OpenSans',
  },
  topCitiesSection: {
    marginTop: 8,
  },
  topCitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  topCityCard: {
    width: '48.5%',
    height: 132,
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 12,
    backgroundColor: theme.card,
  },
  topCityImage: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  topCityImageInner: {
    borderRadius: 14,
  },
  topCityOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 76,
    backgroundColor: 'rgba(8, 8, 15, 0.55)',
  },
  topCityTextWrap: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    zIndex: 1,
  },
  topCityName: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    fontFamily: 'OpenSans',
    letterSpacing: 0.4,
  },
  topCityShows: {
    color: theme.primary,
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'OpenSans',
    marginTop: 2,
  },
  sheetContainer: {
    backgroundColor: theme.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 10,
    paddingBottom: 28,
    paddingHorizontal: 16,
    maxHeight: '62%',
    borderWidth: 1,
    borderColor: theme.border,
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.muted,
    opacity: 0.5,
    marginBottom: 14,
  },
  sheetTitle: {
    fontFamily: 'OpenSans',
    fontWeight: '700',
    fontSize: 18,
    color: theme.primary,
    marginBottom: 12,
    textAlign: 'center',
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
    fontFamily: 'OpenSans',
    fontSize: 16,
    fontWeight: '600',
    color: theme.foreground,
    textAlign: 'center',
  },
  sheetOptionTextSelected: {
    color: theme.primary,
  },
  hiddenPicker: {
    height: 0,
    width: 0,
    opacity: 0,
    position: 'absolute',
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dateCard: {
    width: '48%',
    backgroundColor: theme.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.border,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  dateCardLabel: {
    color: theme.muted,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
    fontFamily: 'OpenSans',
  },
  dateCardValue: {
    color: theme.foreground,
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'OpenSans',
  },
  dateSelectorBtn: {
    width: '100%',
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
    color: theme.foreground,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    height: 50,
    backgroundColor: theme.input,
  },
  textStyle: {
    fontFamily: 'OpenSans',
    alignSelf: 'flex-start',
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  dateSelectorButtonTextSty: {
    alignSelf: 'center',
  },
  datePickerContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(8,8,15,0.78)',
    flex: 1,
    elevation: 2,
  },
  selectedDateSty: {
    backgroundColor: theme.primary,
  },
  cancelDateSelectionBtn: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 50,
    height: 50,
    backgroundColor: theme.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
  },
  textDate: {
    fontFamily: 'OpenSans',
    color: theme.foreground,
  },
  textDateSty: {
    fontFamily: 'OpenSans',
    color: theme.foreground,
    marginTop: 20,
  },
  textInputLabelSty: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: theme.foreground,
  },
  textInputLabel: {
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: theme.foreground,
  },
  textInputSty: {
    width: '100%',
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
    backgroundColor: theme.input,
    color: theme.foreground,
    height: 50,
  },
  selectorSty: {
    height: 50,
    justifyContent: 'center',
    backgroundColor: theme.input,
    fontFamily: 'OpenSans',
  },
  downArrowSty: {
    position: 'absolute',
    right: 15,
    marginRight: 5,
    width: 8,
    transform: [{rotate: '-90deg'}],
    resizeMode: 'contain',
    tintColor: theme.muted,
    backgroundColor: 'transparent',
  },
  modalViewSty: {
    height: '30%',
    justifyContent: 'space-between',
    backgroundColor: theme.card,
    borderTopEndRadius: 20,
    padding: 35,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 100,
  },
  selectorTextSty: {
    color: theme.foreground,
  },
  centeredViewSty: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(8, 8, 15, 0.72)',
  },
  itinerarybtn: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: theme.primary,
    height: 48,
    marginTop: 8,
  },
  textItinerarybtn: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
    alignSelf: 'center',
  },
  buttonStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: theme.card,
    height: 44,
  },
  searchBtn: {
    marginTop: 15,
    borderWidth: 1,
    borderColor: theme.border,
  },
  dividerSty: {
    backgroundColor: theme.divider,
    height: 1,
  },
  rowViewSty: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 20,
    backgroundColor: theme.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.border,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  preferenceTitle: {
    fontWeight: '700',
    fontSize: 15,
    color: theme.foreground,
  },
  preferenceSubtitle: {
    color: theme.muted,
    fontSize: 12,
    marginTop: 4,
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
    tintColor: theme.muted,
  },
  subView: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    flex: 1,
    paddingRight: 12,
  },
  soldoutViewSty: {
    backgroundColor: theme.primary,
    width: 4,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  soldoutView2Sty: {
    flex: 1,
    padding: 20,
  },
  soldoutTextSty: {
    color: theme.foreground,
    fontSize: 16,
    fontWeight: 'bold',
  },
  soldoutContainerSty: {
    flexDirection: 'row',
    borderRadius: 14,
    backgroundColor: theme.card,
    borderWidth: 1,
    borderColor: theme.border,
    margin: 10,
    marginBottom: 30,
    width: '99%',
    alignSelf: 'center',
    overflow: 'hidden',
  },
  container1: {
    flexDirection: 'row',
    backgroundColor: theme.card,
    borderRadius: 8,
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
    color: theme.foreground,
  },
  date: {
    fontSize: 16,
    color: theme.muted,
  },
  imageContainer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  imageWrapper: {
    width: 327,
    height: 80,
    backgroundColor: theme.input,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageSize: {
    fontSize: 16,
    color: theme.muted,
  },
  itineraryView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
    alignItems: 'center',
  },
  savedTripsTitle: {
    fontFamily: 'OpenSans',
    fontWeight: '800',
    fontSize: 13,
    color: theme.muted,
    letterSpacing: 1,
  },
  itineraryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'relative',
    zIndex: 1,
  },
  itineraryCardTitle: {
    fontSize: 16,
    color: theme.foreground,
    fontWeight: '700',
  },
  itineraryCardDescription: {
    color: theme.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  serachText: {
    fontWeight: '700',
    fontSize: 16,
    color: theme.primary,
  },
  label: {
    color: theme.muted,
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
    tintColor: theme.muted,
  },
  cancelDateSelectionButtonSty: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 50,
    height: 50,
    backgroundColor: theme.card,
    zIndex: 2147483647,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
  },
  acceptCardView: {
    backgroundColor: theme.primary,
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
    color: theme.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  acceptBtnView: {
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-end',
    paddingHorizontal: 10,
    borderRadius: 8,
    paddingVertical: 6,
  },
  searchItineraryText: {
    color: '#FFFFFF',
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
    backgroundColor: 'rgba(8, 8, 15, 0.72)',
  },
  modalView: {
    maxHeight: '55%',
    backgroundColor: theme.card,
    borderTopEndRadius: 24,
    borderTopStartRadius: 24,
    justifyContent: 'space-between',
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 100,
    borderWidth: 1,
    borderColor: theme.border,
  },
  textOutsideCountry: {
    fontWeight: '700',
    fontSize: 26,
    lineHeight: 28,
    marginVertical: 10,
    color: theme.foreground,
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
    color: theme.foreground,
  },
  textOnlySupportCountry: {
    fontSize: 18,
    color: theme.muted,
  },
  continueBtn: {
    backgroundColor: theme.primary,
    width: '100%',
    padding: 16,
    borderRadius: 12,
    marginVertical: 10,
  },
  textContinueBtn: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 18,
    alignSelf: 'center',
  },
  errorTextMsg: {
    color: theme.primary,
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
    color: theme.primary,
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

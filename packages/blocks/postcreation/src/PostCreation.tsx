import React from 'react';
// Customizable Area Start
import {
  ScrollView,
  Image,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  View,
  StatusBar,
  FlatList,
  Platform,
  Modal,
  ActivityIndicator,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';

import Icon from 'react-native-vector-icons/Feather';
import { Picker } from '@react-native-picker/picker';
import moment from 'moment';
import DateRangePicker from 'react-native-daterange-picker';
import { leftArrowWhite } from '../../user-profile-basic/src/assets';
import { colors } from '../../utilities/src/Colors';
import { leftArrow } from '../../events/src/assets';
import PostCreationController, {
  configJSON,
} from './PostCreationCommonController';

// Customizable Area End

export interface Props {
  navigation: any;
  // Customizable Area Start
  // Customizable Area End
}

export default class PostCreation extends PostCreationController {
  constructor(props: Props) {
    super(props);
  }

  // Customizable Area Start
  LOCATION_DISABLED_ACCOUNT_TYPES = [
    'Venue',
    'Club',
    'Bar',
    'Gallery',
    'Casino',
    'Cabaret',
    'Record_Store',
    'Theater',
    'Museum',
  ];

  getShouldDisableLocationFields = (): boolean => {
    const { userRole, accountType } = this.state;
    const isVenueWithType1 =
      userRole === 'venue' && (accountType === '1' || String(accountType) === '1');
    const isLocationDisabledAccountType =
      accountType &&
      this.LOCATION_DISABLED_ACCOUNT_TYPES.indexOf(accountType) !== -1;
    return !!(isVenueWithType1 || isLocationDisabledAccountType);
  };

  renderEventImage = () => {
    return (
      <>
        {Object.keys(this.state.selectedImageData).length !== 0 && (
          <Image
            source={{ uri: this.state.selectedImageData.uri }}
            style={styles.eventImage}
          />
        )}
      </>
    );
  };

  renderState = () => {
    return (
      <>
        {Platform.OS === 'ios'
          ? this.renderIOSStatePicker()
          : this.renderAndroidStatePicker()}
      </>
    );
  };

  renderIOSStatePicker = () => {
    const selectedStateObj = this.state.statesList.find(
      ({ key }) => key === this.state.selectedState,
    );
    const stateName = selectedStateObj?.name || 'Select a state';
    const disableLocation = this.getShouldDisableLocationFields();
    return (
      <TouchableOpacity
        testID="btnStateSelect"
        style={[
          styles.androidPickerContainer,
          disableLocation && styles.disabledInput,
        ]}
        onPress={this.showStatePicker}
        disabled={disableLocation}
      >
        <Text style={[styles.androidPicker, { paddingTop: 15 }]}>
          {this.state.selectedState ? stateName : 'Select a state'}
        </Text>
        <Image source={leftArrowWhite} style={styles.androidPickerDropdown} />
      </TouchableOpacity>
    );
  };

  renderAndroidStatePicker = () => {
    const disableLocation = this.getShouldDisableLocationFields();
    return (
      <View
        style={[
          styles.androidPickerContainer,
          disableLocation && styles.disabledInput,
        ]}
      >
        <Picker
          testID="statePicker"
          style={styles.androidPicker}
          itemStyle={[styles.androidPickerItemStyle]}
          selectedValue={this.state.selectedState}
          onValueChange={value => this.handleStateValueChange(value)}
          enabled={!disableLocation}
        >
          <Picker.Item label={'Select a state'} value={''} />
          {this.state.statesList.map(
            ({ key, name }: { key: string; name: string }) => (
              <Picker.Item key={key} label={name} value={key} />
            ),
          )}
        </Picker>
        <Image source={leftArrowWhite} style={styles.androidPickerDropdown} />
      </View>
    );
  };

  renderCity = () => {
    return (
      <>
        {Platform.OS === 'ios'
          ? this.renderIOSCityPicker()
          : this.renderAndroidCityPicker()}
      </>
    );
  };

  renderIOSCityPicker = () => {
    const disableLocation = this.getShouldDisableLocationFields();
    return (
      <TouchableOpacity
        testID="btnCitySelect"
        style={[
          styles.androidPickerContainer,
          disableLocation && styles.disabledInput,
        ]}
        onPress={this.showCityPicker}
        disabled={disableLocation}
      >
        <Text style={[styles.androidPicker, { paddingTop: 15 }]}>
          {this.state.selectedCity || 'Select a city'}
        </Text>
        <Image source={leftArrowWhite} style={styles.androidPickerDropdown} />
      </TouchableOpacity>
    );
  };

  renderAndroidCityPicker = () => {
    const disableLocation = this.getShouldDisableLocationFields();
    return (
      <View
        style={[
          styles.androidPickerContainer,
          disableLocation && styles.disabledInput,
        ]}
      >
        <Picker
          testID="cityPicker"
          style={styles.androidPicker}
          itemStyle={styles.androidPickerItemStyle}
          selectedValue={this.state.selectedCity}
          onValueChange={selectedCity =>
            this.handleCityValueChange(selectedCity)
          }
          enabled={!disableLocation}
        >
          <Picker.Item label={'Select a city'} value={''} />
          {this.state.citiesList?.map((name: string) => (
            <Picker.Item key={name} label={name} value={name} />
          ))}
        </Picker>
        <Image source={leftArrowWhite} style={styles.androidPickerDropdown} />
      </View>
    );
  };

  renderTime = () => {
    return (
      <>
        {Platform.OS === 'ios'
          ? this.renderIOSTimePicker()
          : this.renderAndroidTimePicker()}
      </>
    );
  };

  renderIOSTimePicker = () => {
    return (
      <TouchableOpacity
        testID="btnTimeSelect"
        style={styles.androidPickerContainer}
        onPress={this.showTimePicker}
      >
        <Text style={[styles.androidPicker, { paddingTop: 15 }]}>
          {this.state.time || 'Select time'}
        </Text>
        <Image source={leftArrowWhite} style={styles.androidPickerDropdown} />
      </TouchableOpacity>
    );
  };

  renderAndroidTimePicker = () => {
    return (
      <View style={styles.androidPickerContainer}>
        <Picker
          testID="timePicker"
          style={styles.androidPicker}
          itemStyle={styles.androidPickerItemStyle}
          selectedValue={this.state.time}
          onValueChange={time => this.handleTimeValueChange(time)}
        >
          <Picker.Item label={'Select time'} value={''} />
          {this.state.timeList.map((name: string) => (
            <Picker.Item key={name} label={name} value={name} />
          ))}
        </Picker>
        <Image source={leftArrowWhite} style={styles.androidPickerDropdown} />
      </View>
    );
  };

  renderLineUp = () => {
    // Only show roster dropdown if we have roster items from user profile
    const hasRosters =
      this.state.rosterLineUpList && this.state.rosterLineUpList.length > 0;
    const shouldShowSingleLineupInfo =
      !!this.state.accountType &&
      this.LOCATION_DISABLED_ACCOUNT_TYPES.indexOf(this.state.accountType) !== -1;

    return (
      <>
        {hasRosters &&
          (Platform.OS === 'ios'
            ? this.renderIOSLineUpPicker()
            : this.renderAndroidLineUpPicker())}
        <View style={styles.lineUpInputContainer}>
          <TextInput
            testID="lineUpTxtInput"
            placeholder={
              hasRosters
                ? 'Or enter Band / Artist name to add new'
                : 'Enter Band / Artist name & validate'
            }
            style={styles.lineUpInput}
            placeholderTextColor="#CBD5E1"
            value={this.state.lineupText}
            onChangeText={lineupTxt => this.handleLineupTxt(lineupTxt)}
            onSubmitEditing={this.handleLineupSubmit}
          />
          {this.state.lineupText.trim() !== '' && (
            <TouchableOpacity
              testID="lineUpSaveButton"
              style={styles.lineUpSaveButton}
              onPress={this.handleLineupSubmit}
            >
              <Text style={styles.lineUpSaveButtonText}>Save</Text>
            </TouchableOpacity>
          )}
        </View>
          <View style={styles.lineUpInfoContainer}>
            <Text style={styles.lineUpInfoText}>
              Validate ONLY ONE
              Band/Artist name at a time
            </Text>
          </View>
      </>
    );
  };

  renderIOSLineUpPicker = () => {
    return (
      <TouchableOpacity
        testID="btnLineUpSelect"
        style={styles.androidPickerContainer}
        onPress={this.showLineUpPicker}
      >
        <Text style={[styles.androidPicker, { paddingTop: 15 }]}>
          {'Select from roster'}
        </Text>
        <Image source={leftArrowWhite} style={styles.androidPickerDropdown} />
      </TouchableOpacity>
    );
  };

  renderAndroidLineUpPicker = () => {
    return (
      <View style={styles.androidPickerContainer}>
        <Picker
          testID="lineUpPicker"
          style={styles.androidPicker}
          itemStyle={styles.androidPickerItemStyle}
          selectedValue={''}
          onValueChange={value => {
            if (value !== '') {
              this.handleSelectedLineUps(value);
            }
          }}
        >
          <Picker.Item label={'Select from roster'} value={''} />
          {this.state.rosterLineUpList?.map((item: any) => (
            <Picker.Item
              key={item.id || item.first_name}
              label={item.first_name}
              value={item}
            />
          ))}
        </Picker>
        <Image source={leftArrowWhite} style={styles.androidPickerDropdown} />
      </View>
    );
  };

  renderTypeOfShow = () => {
    return (
      <>
        {Platform.OS === 'ios'
          ? this.renderIOSTypeOfShowPicker()
          : this.renderAndroidTypeOfShowPicker()}
      </>
    );
  };

  renderIOSTypeOfShowPicker = () => {
    return (
      <TouchableOpacity
        testID="btnTypeOfShowsSelect"
        style={styles.androidPickerContainer}
        onPress={this.showTypeOfShowPicker}
      >
        <Text style={[styles.androidPicker, { paddingTop: 15 }]}>
          {'Select type of show'}
        </Text>
        <Image source={leftArrowWhite} style={styles.androidPickerDropdown} />
      </TouchableOpacity>
    );
  };

  renderAndroidTypeOfShowPicker = () => {
    return (
      <View style={styles.androidPickerContainer}>
        <Picker
          testID="typeOfShowPicker"
          style={styles.androidPicker}
          itemStyle={styles.androidPickerItemStyle}
          selectedValue={''}
          onValueChange={selectedTypeOfShow => {
            this.handleSelectedTypeOfShow(selectedTypeOfShow);
          }}
        >
          <Picker.Item label={'Select type of shows'} value={''} />
          {this.state.typeOfShowsList?.map((item: any) => (
            <Picker.Item
              key={item.id}
              label={item.attributes ? item.attributes.name : item.name}
              value={item}
            />
          ))}
        </Picker>
        <Image source={leftArrowWhite} style={styles.androidPickerDropdown} />
      </View>
    );
  };

  renderGenre = () => {
    return (
      <>
        {Platform.OS === 'ios'
          ? this.renderIOSGenrePicker()
          : this.renderAndroidGenrePicker()}
      </>
    );
  };

  renderIOSGenrePicker = () => {
    return (
      <TouchableOpacity
        testID="btnGenreSelect"
        style={styles.androidPickerContainer}
        onPress={this.showGenrePicker}
      >
        <Text style={[styles.androidPicker, { paddingTop: 15 }]}>
          {'Select genre'}
        </Text>
        <Image source={leftArrowWhite} style={styles.androidPickerDropdown} />
      </TouchableOpacity>
    );
  };

  renderAndroidGenrePicker = () => {
    return (
      <View style={styles.androidPickerContainer}>
        <Picker
          testID="genrePicker"
          style={styles.androidPicker}
          itemStyle={styles.androidPickerItemStyle}
          onValueChange={selectedGenres => {
            if (this.state.selectedGenres.length < 3)
              this.handleSelectedGenre(selectedGenres);
          }}
          enabled={this.state.selectedTypeOfShows.length !== 0}
        >
          <Picker.Item label={'Select genre'} value={''} />
          {this.state.genreList?.map((item: any) => (
            <Picker.Item
              key={item.id}
              label={item.attributes ? item.attributes.name : item.name}
              value={item}
            />
          ))}
        </Picker>
        <Image source={leftArrowWhite} style={styles.androidPickerDropdown} />
      </View>
    );
  };

  renderError = (errorType: string) => {
    return (
      <>
        {errorType !== '' && <Text style={styles.errorText}>{errorType}</Text>}
      </>
    );
  };

  renderLineUpFlatlist = () => {
    return (
      <FlatList
        testID="lineUpFlatlist"
        data={this.state.selectedLineUp}
        numColumns={20}
        columnWrapperStyle={{ flexWrap: 'wrap' }}
        renderItem={({ item }) => {
          const isDefaultBandLineup = item.isDefaultBandLineup === true;
          return (
            <View style={styles.rowItem}>
              <Text
                style={[
                  styles.label,
                  { fontWeight: '400', color: '#3333CC', marginTop: 1 },
                ]}
              >
                {item.first_name}
              </Text>
              {!isDefaultBandLineup && (
                <TouchableOpacity
                  testID="closeLineUpBtn"
                  onPress={() => {
                    this.handleRemoveLineup(item);
                  }}
                >
                  <Image
                    source={require('../../../mobile/assets/images/close.png')}
                    style={styles.crossBtn}
                  />
                </TouchableOpacity>
              )}
            </View>
          );
        }}
        keyExtractor={(item: any) =>
          item.isDefaultBandLineup ? 'default-band-lineup' : item.id || item.first_name
        }
      />
    );
  };

  renderTypeOfShowFlatlist = () => {
    return (
      <FlatList
        testID="typeOfShowFlatlist"
        data={this.state.selectedTypeOfShows}
        numColumns={20}
        columnWrapperStyle={{ flexWrap: 'wrap' }}
        renderItem={({ item }) => {
          return (
            <View style={styles.rowItem}>
              <Text
                style={[
                  styles.label,
                  { fontWeight: '400', color: '#3333CC', marginTop: 1 },
                ]}
              >
                {item.attributes ? item.attributes.name : item.name}
              </Text>
              <TouchableOpacity
                testID="closeTypeOfShowBtn"
                onPress={() => {
                  this.handleRemoveTypeOfShow(item);
                }}
              >
                <Image
                  source={require('../../../mobile/assets/images/close.png')}
                  style={styles.crossBtn}
                />
              </TouchableOpacity>
            </View>
          );
        }}
        keyExtractor={(item: any) => item.id}
      />
    );
  };

  renderGenreFlatlist = () => {
    return (
      <FlatList
        testID="genreFlatlist"
        data={this.state.selectedGenres}
        numColumns={20}
        columnWrapperStyle={{ flexWrap: 'wrap' }}
        renderItem={({ item }) => {
          return (
            <View style={styles.rowItem}>
              <Text
                style={[
                  styles.label,
                  { fontWeight: '400', color: '#3333CC', marginTop: 1 },
                ]}
              >
                {item.attributes ? item.attributes.name : item.name}
              </Text>
              <TouchableOpacity
                testID="closeGenreBtn"
                onPress={() => {
                  this.handleRemoveGenre(item);
                }}
              >
                <Image
                  source={require('../../../mobile/assets/images/close.png')}
                  style={styles.crossBtn}
                />
              </TouchableOpacity>
            </View>
          );
        }}
        keyExtractor={(item: any) => item.id}
      />
    );
  };

  onZipcodeTextChange = (zipCode: string) => {
    if (zipCode && !/^\d+$/.test(zipCode)) {
      return;
    }
    this.setState({ zipCode });
  };

  renderCancelBtn = () => {
    return (
      <>
        {this.state.eventId !== '' && (
          <TouchableOpacity
            testID="cancelUpdate"
            style={[styles.postShowButton, { backgroundColor: '#FFF' }]}
            onPress={() => {
              this.props.navigation.goBack();
            }}
          >
            <Text style={[styles.postShowButtonText, { color: '#3333CC' }]}>
              {configJSON.cancel}
            </Text>
          </TouchableOpacity>
        )}
      </>
    );
  };

  renderSaveBtn = () => {
    return (
      <TouchableOpacity
        testID="postShowBtn"
        style={[styles.postShowButton, { marginTop: 15 }]}
        onPress={this.handleCreateShowAPI}
      >
        <Text style={styles.postShowButtonText}>
          {this.state.eventId !== '' ? configJSON.save : configJSON.postTheShow}
        </Text>
      </TouchableOpacity>
    );
  };

  renderDate = () => {
    return (
      <TouchableOpacity
        testID="btnDateSelector"
        style={styles.calendarContainer}
        onPress={() => this.showDateSelector()}
      >
        <Text style={styles.dateText}>
          {this.state.dateOfShow !== '' ? this.state.dateOfShow : 'Select date'}
        </Text>
        <Image
          source={require('../../../mobile/assets/images/image_calendar.png')}
          style={[styles.backBtn, { tintColor: '#4949EE' }]}
        />
      </TouchableOpacity>
    );
  };

  renderEndDate = () => {
    return (
      <TouchableOpacity
        testID="btnEndDateSelector"
        style={styles.calendarContainer}
        onPress={() => this.showEndDateSelector()}
      >
        <Text style={styles.dateText}>
          {this.state.endDate !== '' ? this.state.endDate : 'Select end date'}
        </Text>
        <Image
          source={require('../../../mobile/assets/images/image_calendar.png')}
          style={[styles.backBtn, { tintColor: '#4949EE' }]}
        />
      </TouchableOpacity>
    );
  };

  renderRulesRegulation = () => {
  if (
      !this.state.rulesAndRegulationsIcons ||
      this.state.rulesAndRegulationsIcons.length === 0
    ) {
      return null;
    }

    return (
      <View style={styles.rosterInputContainer}>
        <TextInput
          testID="customRuleTextInput"
          placeholder="Enter custom rule or regulation"
          placeholderTextColor="#CBD5E1"
          style={styles.rosterInput}
          value={this.state.customRuleTxt}
          onChangeText={text =>
            this.setState({ customRuleTxt: text.replace(/\s{2,}/g, ' ') })
          }
          onSubmitEditing={this.handleAddCustomRule}
        />
        {this.state.customRuleTxt.trim() !== '' && (
          <TouchableOpacity
            testID="saveCustomRuleBtn"
            style={styles.rosterSaveButton}
            onPress={this.handleAddCustomRule}
          >
            <Text style={styles.rosterSaveButtonText}>Save</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  renderRulesAndRegulationsIcons = () => {
    if (
      !this.state.rulesAndRegulationsIcons ||
      this.state.rulesAndRegulationsIcons.length === 0
    ) {
      return null;
    }

    // Normalize data to handle both string arrays and object arrays
    const normalizedIcons = this.state.rulesAndRegulationsIcons.map((item: any) => {
      if (typeof item === 'string') {
        return { title: item, id: item };
      } else if (item && typeof item === 'object') {
        return {
          title: item.title || item.name || String(item),
          id: item.id || item.title || item.name || String(item),
        };
      }
      return { title: String(item), id: String(item) };
    });

    const selectedIds = this.state.selectedRulesAndRegulationsIds || [];
    const selectedIdStrList = selectedIds.map(id =>
      typeof id === 'string' ? id : String(id),
    );
    const isSelected = (id: string | number) =>
      selectedIdStrList.indexOf(typeof id === 'string' ? id : String(id)) !== -1;

    return (
      <View style={{ marginTop: 0 }}>
        <Text style={styles.label}>Rules and Regulations</Text>
        <FlatList
          testID="rulesAndRegulationsIconsFlatlist"
          data={normalizedIcons}
          contentContainerStyle={{ marginTop: 10 }}
          keyExtractor={(item: any, index: number) => item.id?.toString() || item.title || `icon-${index}`}
          renderItem={({ item }) => {
            const title = item.title || '';
            const itemId = item.id;
            const isChecked = itemId != null && isSelected(itemId);
            return (
              <TouchableOpacity
                testID={isChecked ? 'selectedRulesRegulation' : 'unselectedRulesRegulation'}
                style={styles.rulesIconItem}
                onPress={() => this.handleToggleRulesRegulation(itemId)}
                activeOpacity={0.7}
              >
                <View style={styles.rulesIconRow}>
                  {!isChecked ? (
                    <TouchableOpacity
                      testID="unselectedRulesRegulationCheckbox"
                      style={styles.checkbox}
                      onPress={() => this.handleToggleRulesRegulation(itemId)}
                    />
                  ) : (
                    <TouchableOpacity
                      testID="selectedRulesRegulationCheckbox"
                      onPress={() => this.handleToggleRulesRegulation(itemId)}
                    >
                      <Image
                        source={require('../../../mobile/assets/images/checkbox.png')}
                        style={[styles.backBtn, { marginRight: 10 }]}
                      />
                    </TouchableOpacity>
                  )}
                  <Text style={styles.rulesIconText}>{title}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    );
  };

  renderFeatures = () => {
    return (
      <FlatList
        testID="showFeaturesFlatlist"
        data={this.state.featureList}
        contentContainerStyle={{ marginTop: 20 }}
        numColumns={2}
        keyExtractor={(item: any) => item.id}
        renderItem={({ item }) => {
          const activate_feature =
            item.attributes && item.attributes.activate_feature
              ? item.attributes.activate_feature
              : item.activate_feature;
          const feature_name =
            item.attributes && item.attributes.feature_name
              ? item.attributes.feature_name
              : item.feature_name;
          return (
            <View style={styles.showFeatureItem}>
              {!activate_feature ? (
                <TouchableOpacity
                  testID="unselectedShowFeature"
                  style={styles.checkbox}
                  onPress={() => {}}
                />
              ) : (
                <TouchableOpacity
                  testID="selectedShowFeature"
                  onPress={() => {}}
                >
                  <Image
                    source={require('../../../mobile/assets/images/checkbox.png')}
                    style={[styles.backBtn, { marginRight: 10 }]}
                  />
                </TouchableOpacity>
              )}
              <Text
                style={[
                  styles.label,
                  { fontWeight: '400', marginTop: 1, width: '80%' },
                ]}
              >
                {feature_name}
              </Text>
            </View>
          );
        }}
      />
    );
  };
  // Customizable Area End

  render() {
    // Customizable Area Start
    // Customizable Area End
    return (
      <SafeAreaView style={styles.safeAreaView}>
        {/* Customizable Area Start */}
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : undefined}
          behavior={this.isPlatformiOS() ? 'padding' : undefined}
        >
          <ScrollView>
            <TouchableWithoutFeedback
              testID="containerFeedback"
              onPress={() => {
                this.hideKeyboard();
              }}
            >
              <>
                <View style={styles.container}>
                  <StatusBar backgroundColor="#FFF" />
                  <View style={styles.headerContainer}>
                    <TouchableOpacity
                      testID="backBtn"
                      onPress={() => this.props.navigation.goBack()}
                    >
                      <Image source={leftArrow} style={styles.backBtn} />
                    </TouchableOpacity>
                    <Text style={styles.pageTitle}>
                      {configJSON.showsInformation}
                    </Text>
                    <Text />
                  </View>
                  {this.renderEventImage()}
                  <Text style={styles.label}>Event Title</Text>
                  <TextInput
                    testID="eventTitleInputText"
                    placeholder="Enter event title"
                    style={styles.input}
                    placeholderTextColor="#CBD5E1"
                    value={this.state.eventTitle}
                    onChangeText={eventTitle =>
                      this.handleTitleInput(eventTitle)
                    }
                  />
                  {this.renderError(this.state.eventTitleError)}
                  {console.log(
                    '--this.state.verified---',
                    this.state?.verified,
                  )}

                
                  <Text style={styles.label}>{configJSON.location}</Text>
                  <TextInput
                    testID="locationInputText"
                    placeholder="Enter location"
                       style={[
                      styles.input,
                      this.getShouldDisableLocationFields() &&
                        styles.disabledInput,
                    ]}
                    placeholderTextColor="#CBD5E1"
                    value={this.state.location}
                    onChangeText={location =>
                      this.handleLocationInput(location)
                    }
                    editable={!this.getShouldDisableLocationFields()}
                  />
                  {this.renderError(this.state.locationError)}
                  <Text style={styles.label}>{configJSON.address}</Text>
                  <TextInput
                    testID="addressInputText"
                    placeholder="Enter address"
                    style={[
                      styles.input,
                      this.getShouldDisableLocationFields() &&
                        styles.disabledInput,
                    ]}
                    placeholderTextColor="#CBD5E1"
                    value={this.state.address}
                    onChangeText={address => this.handleAddressInput(address)}
                    maxLength={100}
                    editable={!this.getShouldDisableLocationFields()}
                  />
                  {this.renderError(this.state.addressError)}
                  <Text style={styles.label}>{configJSON.state}</Text>
                  {this.renderState()}
                  {this.renderError(this.state.stateError)}
                  <Text style={styles.label}>{configJSON.city}</Text>
                  {this.renderCity()}
                  {this.renderError(this.state.cityError)}
                  <Text style={styles.label}>{configJSON.zip}</Text>
                  <TextInput
                    testID="zipInputText"
                    placeholder="Enter zip"
                    style={[
                      styles.input,
                      this.getShouldDisableLocationFields() &&
                        styles.disabledInput,
                    ]}
                    placeholderTextColor="#CBD5E1"
                    value={this.state.zipCode}
                    onChangeText={this.onZipcodeTextChange}
                    maxLength={5}
                    keyboardType="numeric"
                    editable={!this.getShouldDisableLocationFields()}
                  />
                  {this.renderError(this.state.zipError)}
                  <Text style={styles.label}>{configJSON.dateOfTheShow}</Text>
                  {this.renderDate()}
                  {this.renderError(this.state.dateOfShowError)}
                  <Text style={styles.label}>{configJSON.endDate}</Text>
                  {this.renderEndDate()}
                  {this.renderError(this.state.endDateError)}
                  <Text style={styles.label}>{configJSON.time}</Text>
                  {this.renderTime()}
                  {this.renderError(this.state.timeError)}
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.label}>{configJSON.lineUp}</Text>
                    <TouchableOpacity
                      testID="infoIcon"
                      onPress={() => {
                        Alert.alert(
                          'Line-up Information',
                          'Enter line-ups and press the save button to save it',
                          [{ text: 'OK' }],
                        );
                      }}
                    >
                      <Image
                        source={require('../../../mobile/assets/images/info_icon.png')}
                        style={[
                          styles.backBtn,
                          { marginLeft: 10, marginTop: 20 },
                        ]}
                      />
                    </TouchableOpacity>
                  </View>
                  {this.renderLineUp()}
                  {this.renderError(this.state.lineUpError)}
                  {this.renderLineUpFlatlist()}
                  <Text style={styles.label}>{configJSON.typeOfShows}</Text>
                  {this.renderTypeOfShow()}
                  {this.renderError(this.state.typeOfShowError)}
                  {this.renderTypeOfShowFlatlist()}
                  <Text style={styles.label}>
                    {configJSON.genre}
                    <Text style={styles.normalFont}>{configJSON.max3}</Text>
                  </Text>
                  {this.renderGenre()}
                  {this.renderError(this.state.genreError)}
                  {this.renderGenreFlatlist()}
                  <Text style={styles.label}>
                    {configJSON.description}
                    <Text style={styles.normalFont}>{configJSON.max300}</Text>
                  </Text>
                  <TextInput
                    testID="descriptionInputText"
                    placeholder="Enter description"
                    style={[
                      styles.input,
                      { height: 100, textAlignVertical: 'top' },
                    ]}
                    multiline
                    placeholderTextColor="#CBD5E1"
                    value={this.state.description}
                    maxLength={300}
                    onChangeText={description =>
                      this.handleDescriptionInput(description)
                    }
                  />
                  {this.renderError(this.state.descriptionError)}
                  {/* {this.state.userRole === "venue" &&
                    <>
                      {this.renderRulesRegulation()}
                      {this.renderError(this.state.rulesRegulationError)}
                      {this.renderFeatures()}
                    </>
                  } */}
                    {(() => {
                    const businessTypesRequiringAddress: string[] = [
                      'Venue',
                      'Club',
                      'Bar',
                      'Gallery',
                      'Casino',
                      'Cabaret',
                      'Record_Store',
                      'Theater',
                      'Museum',
                    ];
                    const isType1Venue = 
                      this.state.userRole === 'venue' &&
                      this.state.accountType &&
                      businessTypesRequiringAddress.includes(this.state.accountType);
                    
                    return isType1Venue ? (
                      <>
                        <Text style={styles.ticketLinkPromoText}>
                          For a limited time, FREE Link to your tickets
                        </Text>
                        {!this.state.verified && (
                          <Text style={styles.ticketLinkVerifyText}>
                            VERIFY YOUR ACCOUNT
                          </Text>
                        )}
                        <TextInput
                          testID="ticketLinkInputText"
                          placeholder="Enter Show Ticket link"
                          style={styles.ticketLinkInput}
                          placeholderTextColor="#3333CC"
                          value={this.state.ticketLink}
                          onChangeText={ticketLink =>
                            this.setState({ ticketLink })
                          }
                        />
                        {!this.state.verified && (
                          <Text style={styles.ticketLinkDisclaimer}>
                            Verification process can take up to 3 days
                          </Text>
                        )}
                      </>
                    ) : null;
                  })()}
                  {this.renderRulesAndRegulationsIcons()}
                  {this.renderRulesRegulation()}

                  {this.renderCancelBtn()}
                  {this.renderSaveBtn()}
                </View>

                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={this.state.openStatePicker}
                >
                  <TouchableWithoutFeedback
                    testID="hideStateModal"
                    onPress={this.hideStateModal}
                  >
                    <View style={styles.modalContainer}>
                      <TouchableWithoutFeedback>
                        <View style={styles.modal}>
                          <Picker
                            testID="statePickerModal"
                            selectedValue={this.state.selectedState}
                            onValueChange={selectedState =>
                              this.handleStateValueChange(selectedState)
                            }
                          >
                            {this.state.statesList.map(
                              ({
                                key,
                                name,
                              }: {
                                key: string;
                                name: string;
                              }) => (
                                <Picker.Item
                                  key={key}
                                  label={name}
                                  value={key}
                                />
                              ),
                            )}
                          </Picker>
                        </View>
                      </TouchableWithoutFeedback>
                    </View>
                  </TouchableWithoutFeedback>
                </Modal>
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={this.state.openCityPicker}
                >
                  <TouchableWithoutFeedback
                    testID="hideCityModal"
                    onPress={this.hideCityModal}
                  >
                    <View style={styles.modalContainer}>
                      <TouchableWithoutFeedback>
                        <View style={styles.modal}>
                          <Picker
                            testID="cityPickerModal"
                            selectedValue={this.state.selectedCity}
                            onValueChange={selectedCity =>
                              this.handleCityValueChange(selectedCity)
                            }
                          >
                            {this.state.citiesList?.map((name: string) => (
                              <Picker.Item
                                key={name}
                                value={name}
                                label={name}
                              />
                            ))}
                          </Picker>
                        </View>
                      </TouchableWithoutFeedback>
                    </View>
                  </TouchableWithoutFeedback>
                </Modal>
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={this.state.openTimePicker}
                >
                  <TouchableWithoutFeedback
                    testID="hideTimeModal"
                    onPress={this.hideTimeModal}
                  >
                    <View style={styles.modalContainer}>
                      <TouchableWithoutFeedback>
                        <View style={styles.modal}>
                          <Picker
                            testID="timePickerModal"
                            selectedValue={this.state.time}
                            onValueChange={value =>
                              this.handleTimeValueChange(value)
                            }
                          >
                            {this.state.timeList.map((name: string) => (
                              <Picker.Item
                                key={name}
                                value={name}
                                label={name}
                              />
                            ))}
                          </Picker>
                        </View>
                      </TouchableWithoutFeedback>
                    </View>
                  </TouchableWithoutFeedback>
                </Modal>
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={this.state.openTyeOfShowsPicker}
                >
                  <TouchableWithoutFeedback
                    testID="hideTypeOfShowModal"
                    onPress={this.hideTypeOfShowModal}
                  >
                    <View style={styles.modalContainer}>
                      <TouchableWithoutFeedback>
                        <View style={styles.modal}>
                          <Picker
                            testID="typeOfShowsPickerModal"
                            onValueChange={(value: string) =>
                              this.handleIosTypeValueChange(value)
                            }
                          >
                            {this.state.typeOfShowsList?.map((item: any) => (
                              <Picker.Item
                                key={item.id}
                                label={
                                  item.attributes
                                    ? item.attributes.name
                                    : item.name
                                }
                                value={item}
                              />
                            ))}
                          </Picker>
                        </View>
                      </TouchableWithoutFeedback>
                    </View>
                  </TouchableWithoutFeedback>
                </Modal>
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={this.state.openGenresPicker}
                >
                  <TouchableWithoutFeedback
                    testID="hideGenreModal"
                    onPress={this.hideGenreModal}
                  >
                    <View style={styles.modalContainer}>
                      <TouchableWithoutFeedback>
                        <View style={styles.modal}>
                          <Picker
                            testID="genrePickerModal"
                            onValueChange={(value: string) =>
                              this.handleIosGenreValueChange(value)
                            }
                          >
                            {this.state.genreList?.map((item: any) => (
                              <Picker.Item
                                key={item.id}
                                label={
                                  item.attributes
                                    ? item.attributes.name
                                    : item.name
                                }
                                value={item}
                              />
                            ))}
                          </Picker>
                        </View>
                      </TouchableWithoutFeedback>
                    </View>
                  </TouchableWithoutFeedback>
                </Modal>
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={this.state.openLineUpPicker}
                >
                  <TouchableWithoutFeedback
                    testID="hideLineUpModal"
                    onPress={this.hideLineUpPicker}
                  >
                    <View style={styles.modalContainer}>
                      <TouchableWithoutFeedback>
                        <View style={styles.modal}>
                          <Picker
                            testID="lineUpPickerModal"
                            onValueChange={(value: any) =>
                              this.handleIosLineUpValueChange(value)
                            }
                          >
                            <Picker.Item
                              label={'Select from roster'}
                              value={''}
                            />
                            {this.state.rosterLineUpList?.map((item: any) => (
                              <Picker.Item
                                key={item.id || item.first_name}
                                label={item.first_name}
                                value={item}
                              />
                            ))}
                          </Picker>
                        </View>
                      </TouchableWithoutFeedback>
                    </View>
                  </TouchableWithoutFeedback>
                </Modal>
              </>
            </TouchableWithoutFeedback>
          </ScrollView>
          {/* {this.state.isLoading && <View style={styles.loadingContainer}>
            <ActivityIndicator size={'large'} color="black" />
          </View>} */}
          {this.state.showDateSelector && (
            <>
              <View style={styles.calendarModal}>
                <DateRangePicker
                  testID="DateRangePicker"
                  open={this.state.showDateSelector}
                  onChange={this.setDates}
                  date={moment(this.state.dateOfShow)}
                  displayedDate={this.state.displayedDate}
                  selectedStyle={{ backgroundColor: '#3333cc' }}
                  minDate={new Date()}
                  range
                >
                  <></>
                </DateRangePicker>
              </View>
              <TouchableOpacity
                testID="hideCalendar"
                style={styles.cancelDateSelectionBtn}
                onPress={this.hideDateSelector}
              >
                <Icon name="x" size={30} />
              </TouchableOpacity>
            </>
          )}
          {this.state.showEndDateSelector && (
            <>
              <View style={styles.calendarModal}>
                <DateRangePicker
                  testID="EndDateRangePicker"
                  open={this.state.showEndDateSelector}
                  onChange={this.setEndDate}
                  date={
                    this.state.endDate !== ''
                      ? moment(this.state.endDate)
                      : moment()
                  }
                  displayedDate={this.state.displayedEndDate}
                  selectedStyle={{ backgroundColor: '#3333cc' }}
                  minDate={new Date()}
                  range
                >
                  <></>
                </DateRangePicker>
              </View>
              <TouchableOpacity
                testID="hideEndCalendar"
                style={styles.cancelDateSelectionBtn}
                onPress={this.hideEndDateSelector}
              >
                <Icon name="x" size={30} />
              </TouchableOpacity>
            </>
          )}
        </KeyboardAvoidingView>
        {/* Customizable Area End */}
      </SafeAreaView>
    );
  }
}

// Customizable Area Start
const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignSelf: 'center',
    backgroundColor: '#FFF',
  },
  container: {
    backgroundColor: '#FFF',
    padding: 25,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backBtn: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#334155',
  },
  eventImage: {
    height: 200,
    width: '100%',
    resizeMode: 'contain',
    marginTop: 30,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    marginTop: 20,
  },
  input: {
    fontWeight: '400',
    width: '100%',
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: '#C5C5FF',
    color: colors(false).text,
    height: 50,
    fontSize: 16,
    marginTop: 10,
  },
  lineUpInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  lineUpInput: {
    flex: 1,
    fontWeight: '400',
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: '#C5C5FF',
    color: colors(false).text,
    height: 50,
    fontSize: 16,
  },
  lineUpSaveButton: {
    marginLeft: 10,
    paddingHorizontal: 20,
    height: 50,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: '#3333CC',
    backgroundColor: '#3333CC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lineUpSaveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  lineUpInfoContainer: {
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#EAF3FF',
  },
  lineUpInfoText: {
    fontFamily: 'OpenSans',
    fontSize: 14,
    color: '#334155',
    fontWeight: '600',
  },
  lineUpInfoStrong: {
    color: '#1D4ED8',
    fontWeight: '700',
  },
  androidPickerContainer: {
    width: '100%',
    paddingHorizontal: 0,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: '#C5C5FF',
    height: 50,
    justifyContent: 'center',
    marginTop: 10,
  },
  androidPicker: {
    width: '100%',
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: '#C5C5FF',
    height: 50,
    justifyContent: 'center',
  },
  androidPickerItemStyle: {
    fontFamily: 'OpenSans',
    alignSelf: 'flex-start',
    color: colors(false).text,
    fontSize: 16,
  },
  androidPickerDropdown: {
    position: 'absolute',
    right: 15,
    marginRight: 5,
    width: 8,
    backgroundColor: 'white',
    transform: [{ rotate: '-90deg' }],
    resizeMode: 'contain',
    tintColor: '#3333CC',
  },
  normalFont: {
    fontWeight: '400',
  },
  checkbox: {
    height: 20,
    width: 20,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: colors(false).text,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  postShowButton: {
    borderRadius: 10,
    backgroundColor: '#3333CC',
    justifyContent: 'center',
    padding: 15,
    marginTop: 30,
  },
  postShowButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
    textAlignVertical: 'center',
    textAlign: 'center',
  },
  rowItem: {
    flexDirection: 'row',
    borderRadius: 15,
    backgroundColor: '#EDEDFF',
    paddingVertical: 5,
    marginRight: 10,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  crossBtn: {
    marginLeft: 10,
    tintColor: '#3333CC',
    width: 10,
    height: 10,
    resizeMode: 'contain',
    marginTop: 5,
  },
  showFeatureItem: {
    flexDirection: 'row',
    width: '50%',
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#33415580',
  },
  modal: {
    borderTopStartRadius: 20,
    padding: 15,
    height: '30%',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderTopEndRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 100,
  },
  calendarContainer: {
    width: '100%',
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: '#C5C5FF',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    height: 50,
    marginTop: 10,
  },
  dateText: {
    fontFamily: 'OpenSans',
    alignSelf: 'center',
    color: colors(false).text,
    fontSize: 16,
  },
  calendarModal: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontFamily: 'OpenSans',
    alignSelf: 'flex-start',
    color: 'red',
    fontSize: 13,
    paddingTop: 2,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#ffffffdd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelDateSelectionBtn: {
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
  rulesIconItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
  },
  rulesIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rulesIconText: {
    fontFamily: 'OpenSans',
    fontSize: 14,
    color: colors(false).text,
    flex: 1,
  },
  disabledInput: {
    opacity: 0.6,
    backgroundColor: '#F1F5F9',
  },
  ticketLinkPromoText: {
    fontFamily: 'OpenSans',
    fontSize: 16,
    fontWeight: '700',
    color: 'red',
    textAlign: 'center',
    marginTop: 24,
  },
  ticketLinkVerifyText: {
    fontFamily: 'OpenSans',
    fontSize: 16,
    fontWeight: '700',
    color: '#334155',
    textAlign: 'center',
    marginTop: 8,
    letterSpacing: 0.5,
  },
  ticketLinkInput: {
    fontWeight: '400',
    width: '100%',
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: '#3333CC',
    color: '#3333CC',
    height: 50,
    fontSize: 16,
    marginTop: 12,
    textAlign: 'center',
  },
  ticketLinkDisclaimer: {
    fontFamily: 'OpenSans',
    fontSize: 14,
    fontWeight: '400',
    color: '#334155',
    textAlign: 'center',
    marginTop: 10,
  },
  rosterInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 16,
  },
  rosterInput: {
    flex: 1,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: '#C5C5FF',
    backgroundColor: '#FFFFFF',
    height: 50,
    fontSize: 16,
    marginRight: 10,
  },
  rosterSaveButton: {
    backgroundColor: '#3333CC',
    borderRadius: 10,
    paddingHorizontal: 20,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rosterSaveButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
// Customizable Area End

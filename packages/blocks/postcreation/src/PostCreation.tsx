import React from 'react';
// Customizable Area Start
import {
  ScrollView,
  Image,
  Text,
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
import { SafeAreaView } from 'react-native-safe-area-context';

import Icon from 'react-native-vector-icons/Feather';
import { Picker } from '@react-native-picker/picker';
import moment from 'moment';
import DateRangePicker from 'react-native-daterange-picker';
import { leftArrowWhite } from '../../user-profile-basic/src/assets';
import { androidPickerItemColor, lightTheme, redesignTheme } from '../../utilities/src/Colors';
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

  get styles() {
    return this.state.isDarkMode ? darkPostCreationStyles : lightPostCreationStyles;
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

  getDarkCalendarPickerProps = () => ({
    backdropStyle: {
      backgroundColor: 'rgba(8, 8, 15, 0.78)',
    },
    containerStyle: {
      backgroundColor: this.getPostTheme().card,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: this.getPostTheme().border,
    },
    headerStyle: {
      borderBottomColor: this.getPostTheme().border,
    },
    headerTextStyle: {
      color: this.getPostTheme().foreground,
      fontWeight: '700' as const,
    },
    monthButtonsStyle: {
      tintColor: this.getPostTheme().primary,
    },
    dayHeaderTextStyle: {
      color: this.getPostTheme().muted,
      fontWeight: '600' as const,
    },
    dayTextStyle: {
      color: this.getPostTheme().foreground,
    },
    selectedStyle: {
      backgroundColor: this.getPostTheme().primary,
    },
    selectedTextStyle: {
      color: '#FFFFFF',
      fontWeight: '700' as const,
    },
    disabledTextStyle: {
      color: this.getPostTheme().muted,
    },
    monthPrevButton: (
      <Icon name="chevron-left" size={22} color={this.getPostTheme().primary} />
    ),
    monthNextButton: (
      <Icon name="chevron-right" size={22} color={this.getPostTheme().primary} />
    ),
  });

  renderEventImage = () => {
    const hasImage =
      Object.keys(this.state.selectedImageData || {}).length !== 0 &&
      !!this.state.selectedImageData?.uri;
    return (
      <TouchableOpacity
        testID="openCameraBtn"
        activeOpacity={0.85}
        style={this.styles.photoPicker}
        onPress={this.handleOpenCameraPopup}
      >
        {hasImage ? (
          <Image
            source={{ uri: this.state.selectedImageData.uri }}
            style={this.styles.photoPreview}
          />
        ) : (
          <>
            <Icon name="image" size={28} color={this.getPostTheme().primary} />
            <Text style={this.styles.photoPickerText}>Tap to select a photo</Text>
          </>
        )}
      </TouchableOpacity>
    );
  };

  renderCameraGalleryPopup = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.showCameraGalleryPopup}
      >
        <View style={this.styles.centerView}>
          <View style={this.styles.cameraGalleryOption}>
            <TouchableOpacity
              testID="takePhotoBtn"
              onPress={this.handleCameraImage}
            >
              <Text style={this.styles.cameraButtonText}>Take photo</Text>
            </TouchableOpacity>
            <View style={this.styles.divider} />
            <TouchableOpacity
              testID="choosePhotoBtn"
              onPress={this.handleGallery}
            >
              <Text style={this.styles.cameraButtonText}>Choose photo</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            testID="cancelCameraOption"
            style={this.styles.cancelCameraPopup}
            onPress={this.handleCameraGalleryCancelPopup}
          >
            <Text style={this.styles.cancelCameraText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
          this.styles.androidPickerContainer,
          disableLocation && this.styles.disabledInput,
        ]}
        onPress={this.showStatePicker}
        disabled={disableLocation}
      >
        <Text style={[this.styles.androidPicker, { paddingTop: 15 }]}>
          {this.state.selectedState ? stateName : 'Select a state'}
        </Text>
        <Image source={leftArrowWhite} style={this.styles.androidPickerDropdown} />
      </TouchableOpacity>
    );
  };

  renderAndroidStatePicker = () => {
    const disableLocation = this.getShouldDisableLocationFields();
    return (
      <View
        style={[
          this.styles.androidPickerContainer,
          disableLocation && this.styles.disabledInput,
        ]}
      >
        <Picker
          testID="statePicker"
          style={this.styles.androidPicker}
          itemStyle={[this.styles.androidPickerItemStyle]}
          selectedValue={this.state.selectedState}
          onValueChange={value => this.handleStateValueChange(value)}
          enabled={!disableLocation}
        >
          <Picker.Item label={'Select a state'} value={''} color={androidPickerItemColor} />
          {this.state.statesList.map(
            ({ key, name }: { key: string; name: string }) => (
              <Picker.Item key={key} label={name} value={key} color={androidPickerItemColor} />
            ),
          )}
        </Picker>
        <Image source={leftArrowWhite} style={this.styles.androidPickerDropdown} />
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
          this.styles.androidPickerContainer,
          disableLocation && this.styles.disabledInput,
        ]}
        onPress={this.showCityPicker}
        disabled={disableLocation}
      >
        <Text style={[this.styles.androidPicker, { paddingTop: 15 }]}>
          {this.state.selectedCity || 'Select a city'}
        </Text>
        <Image source={leftArrowWhite} style={this.styles.androidPickerDropdown} />
      </TouchableOpacity>
    );
  };

  renderAndroidCityPicker = () => {
    const disableLocation = this.getShouldDisableLocationFields();
    return (
      <View
        style={[
          this.styles.androidPickerContainer,
          disableLocation && this.styles.disabledInput,
        ]}
      >
        <Picker
          testID="cityPicker"
          style={this.styles.androidPicker}
          itemStyle={this.styles.androidPickerItemStyle}
          selectedValue={this.state.selectedCity}
          onValueChange={selectedCity =>
            this.handleCityValueChange(selectedCity)
          }
          enabled={!disableLocation}
        >
          <Picker.Item label={'Select a city'} value={''} color={androidPickerItemColor} />
          {this.state.citiesList?.map((name: string) => (
            <Picker.Item key={name} label={name} value={name} color={androidPickerItemColor} />
          ))}
        </Picker>
        <Image source={leftArrowWhite} style={this.styles.androidPickerDropdown} />
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
        style={this.styles.androidPickerContainer}
        onPress={this.showTimePicker}
      >
        <Text
          style={[
            this.styles.androidPicker,
            { paddingTop: 15, color: this.getPostTheme().foreground },
          ]}
        >
          {this.state.time || 'Select time'}
        </Text>
        <Image source={leftArrowWhite} style={this.styles.androidPickerDropdown} />
      </TouchableOpacity>
    );
  };

  renderAndroidTimePicker = () => {
    return (
      <View style={this.styles.androidPickerContainer}>
        <Picker
          testID="timePicker"
          style={this.styles.androidPicker}
          itemStyle={this.styles.androidPickerItemStyle}
          selectedValue={this.state.time}
          onValueChange={time => this.handleTimeValueChange(time)}
        >
          <Picker.Item
            label={'Select time'}
            value={''}
            color={this.getPostTheme().foreground}
          />
          {this.state.timeList.map((name: string) => (
            <Picker.Item
              key={name}
              label={name}
              value={name}
              color={this.getPostTheme().foreground}
            />
          ))}
        </Picker>
        <Image source={leftArrowWhite} style={this.styles.androidPickerDropdown} />
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
        <View style={this.styles.lineUpInputContainer}>
          <TextInput
            testID="lineUpTxtInput"
            placeholder={
              hasRosters
                ? 'Or enter Band / Artist name to add new'
                : 'Enter Band / Artist name & validate'
            }
            style={this.styles.lineUpInput}
            placeholderTextColor={this.getPostTheme().muted}
            value={this.state.lineupText}
            onChangeText={lineupTxt => this.handleLineupTxt(lineupTxt)}
            onSubmitEditing={this.handleLineupSubmit}
          />
          {this.state.lineupText.trim() !== '' && (
            <TouchableOpacity
              testID="lineUpSaveButton"
              style={this.styles.lineUpSaveButton}
              onPress={this.handleLineupSubmit}
            >
              <Text style={this.styles.lineUpSaveButtonText}>Save</Text>
            </TouchableOpacity>
          )}
        </View>
          <View style={this.styles.lineUpInfoContainer}>
            <Text style={this.styles.lineUpInfoText}>
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
        style={this.styles.androidPickerContainer}
        onPress={this.showLineUpPicker}
      >
        <Text style={[this.styles.androidPicker, { paddingTop: 15 }]}>
          {'Select from roster'}
        </Text>
        <Image source={leftArrowWhite} style={this.styles.androidPickerDropdown} />
      </TouchableOpacity>
    );
  };

  renderAndroidLineUpPicker = () => {
    return (
      <View style={this.styles.androidPickerContainer}>
        <Picker
          testID="lineUpPicker"
          style={this.styles.androidPicker}
          itemStyle={this.styles.androidPickerItemStyle}
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
        <Image source={leftArrowWhite} style={this.styles.androidPickerDropdown} />
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
        style={this.styles.androidPickerContainer}
        onPress={this.showTypeOfShowPicker}
      >
        <Text style={[this.styles.androidPicker, { paddingTop: 15 }]}>
          {'Select type of show'}
        </Text>
        <Image source={leftArrowWhite} style={this.styles.androidPickerDropdown} />
      </TouchableOpacity>
    );
  };

  renderAndroidTypeOfShowPicker = () => {
    return (
      <View style={this.styles.androidPickerContainer}>
        <Picker
          testID="typeOfShowPicker"
          style={this.styles.androidPicker}
          itemStyle={this.styles.androidPickerItemStyle}
          selectedValue={''}
          onValueChange={selectedTypeOfShow => {
            if (this.state.selectedTypeOfShows.length < 2) {
              this.handleSelectedTypeOfShow(selectedTypeOfShow);
            }
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
        <Image source={leftArrowWhite} style={this.styles.androidPickerDropdown} />
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
        style={this.styles.androidPickerContainer}
        onPress={this.showGenrePicker}
      >
        <Text style={[this.styles.androidPicker, { paddingTop: 15 }]}>
          {'Select genre'}
        </Text>
        <Image source={leftArrowWhite} style={this.styles.androidPickerDropdown} />
      </TouchableOpacity>
    );
  };

  renderAndroidGenrePicker = () => {
    return (
      <View style={this.styles.androidPickerContainer}>
        <Picker
          testID="genrePicker"
          style={this.styles.androidPicker}
          itemStyle={this.styles.androidPickerItemStyle}
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
        <Image source={leftArrowWhite} style={this.styles.androidPickerDropdown} />
      </View>
    );
  };

  renderError = (errorType: string) => {
    return (
      <>
        {errorType !== '' && <Text style={this.styles.errorText}>{errorType}</Text>}
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
            <View style={this.styles.rowItem}>
              <Text
                style={[
                  this.styles.label,
                  { fontWeight: '400', color: this.getPostTheme().primary, marginTop: 1 },
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
                    style={this.styles.crossBtn}
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
            <View style={this.styles.rowItem}>
              <Text
                style={[
                  this.styles.label,
                  { fontWeight: '400', color: this.getPostTheme().primary, marginTop: 1 },
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
                  style={this.styles.crossBtn}
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
            <View style={this.styles.rowItem}>
              <Text
                style={[
                  this.styles.label,
                  { fontWeight: '400', color: this.getPostTheme().primary, marginTop: 1 },
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
                  style={this.styles.crossBtn}
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
            style={[this.styles.postShowButton, { backgroundColor: this.getPostTheme().card }]}
            onPress={() => {
              this.props.navigation.goBack();
            }}
          >
            <Text style={[this.styles.postShowButtonText, { color: this.getPostTheme().foreground }]}>
              {configJSON.cancel}
            </Text>
          </TouchableOpacity>
        )}
      </>
    );
  };

  canPreviewPost = () => {
    const hasPhoto = !!(
      this.state.selectedImageData && this.state.selectedImageData.uri
    );
    return !!(
      this.state.eventTitle &&
      String(this.state.eventTitle).trim() &&
      this.state.location &&
      String(this.state.location).trim() &&
      this.state.dateOfShow &&
      this.state.selectedLineUp &&
      this.state.selectedLineUp.length > 0 &&
      hasPhoto
    );
  };

  handlePreviewPost = () => {
    if (this.state.eventId !== '') {
      this.handleCreateShowAPI();
      return;
    }
    if (this.checkCreateShowValidation()) {
      this.setState({ isPreviewStep: true });
    }
  };

  handleBackFromPreview = () => {
    this.setState({ isPreviewStep: false });
  };

  getPreviewCategory = () => {
    const item = this.state.selectedTypeOfShows?.[0];
    if (!item) return '';
    return item.attributes ? item.attributes.name : item.name || '';
  };

  getPreviewStateName = () => {
    const selectedStateObj = this.state.statesList.find(
      ({ key }) => key === this.state.selectedState,
    );
    return selectedStateObj?.name || this.state.selectedState || '';
  };

  getPreviewLocationLine = () => {
    const parts = [
      this.state.location,
      this.state.address,
      this.state.selectedCity,
      this.getPreviewStateName(),
    ].filter(part => part && String(part).trim());
    return parts.join(' · ');
  };

  getPreviewTime = () => {
    if (!this.state.time) return '';
    return String(this.state.time).replace('h', ':');
  };

  renderSaveBtn = () => {
    const isEdit = this.state.eventId !== '';
    const isReady = isEdit || this.canPreviewPost();
    return (
      <View style={this.styles.previewCtaWrap}>
        <TouchableOpacity
          testID="postShowBtn"
          style={[
            this.styles.postShowButton,
            isReady ? this.styles.previewBtnActive : this.styles.previewBtnInactive,
          ]}
          onPress={this.handlePreviewPost}
          activeOpacity={isReady ? 0.85 : 1}
        >
          <View style={this.styles.previewBtnInner}>
            <Text
              style={[
                this.styles.postShowButtonText,
                !isReady && !isEdit && this.styles.previewBtnInactiveText,
              ]}
            >
              {isEdit ? configJSON.save : 'PREVIEW POST'}
            </Text>
            {!isEdit && (
              <Icon
                name="chevron-right"
                size={18}
                color={isReady ? '#FFFFFF' : this.getPostTheme().muted}
              />
            )}
          </View>
        </TouchableOpacity>
        {!isEdit && (
          <Text style={this.styles.previewHelp}>
            Fill in title, lineup, venue, date, and add a photo
          </Text>
        )}
      </View>
    );
  };

  renderPreviewScreen = () => {
    const category = this.getPreviewCategory();
    const lineupNames = (this.state.selectedLineUp || [])
      .map((item: any) => item?.first_name)
      .filter(Boolean);
    const rawUri = this.state.selectedImageData?.uri;
    const imageUri = Array.isArray(rawUri) ? rawUri[0] : rawUri;
    return (
      <View style={this.styles.previewScreen}>
        <StatusBar
          barStyle={this.state.isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={this.getPostTheme().background}
        />
        <View style={this.styles.headerContainer}>
          <TouchableOpacity
            testID="previewBackBtn"
            style={this.styles.headerIconBtn}
            onPress={this.handleBackFromPreview}
          >
            <Icon
              name="arrow-left"
              size={18}
              color={this.getPostTheme().foreground}
            />
          </TouchableOpacity>
          <View style={this.styles.previewHeaderCopy}>
            <Text style={this.styles.pageTitle}>PREVIEW</Text>
            <Text style={this.styles.previewStepLabel}>
              Step 2 of 2 — Confirm & Publish
            </Text>
          </View>
          <TouchableOpacity
            testID="previewCloseBtn"
            style={this.styles.headerIconBtn}
            onPress={() => this.props.navigation.goBack()}
          >
            <Icon name="x" size={18} color={this.getPostTheme().muted} />
          </TouchableOpacity>
        </View>
        <View style={this.styles.previewProgressTrack}>
          <View style={this.styles.previewProgressFill} />
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={this.styles.previewScroll}
        >
          <Text style={this.styles.previewIntro}>
            This is how your post will appear in the feed:
          </Text>
          <View style={this.styles.previewCard}>
            <View style={this.styles.previewImageWrap}>
              {imageUri ? (
                <Image
                  source={{ uri: String(imageUri) }}
                  style={this.styles.previewImage}
                />
              ) : (
                <View style={this.styles.previewImagePlaceholder}>
                  <Icon name="image" size={32} color={this.getPostTheme().muted} />
                </View>
              )}
              {!!category && (
                <View style={this.styles.previewCategoryBadge}>
                  <Text style={this.styles.previewCategoryText}>
                    {String(category).toUpperCase()}
                  </Text>
                </View>
              )}
            </View>
            <View style={this.styles.previewCardBody}>
              {!!this.state.eventTitle && (
                <Text style={this.styles.previewEventTitle}>
                  {this.state.eventTitle}
                </Text>
              )}
              {lineupNames.length > 0 && (
                <View style={this.styles.previewLineupRow}>
                  {lineupNames.map((name: string) => (
                    <View key={name} style={this.styles.previewLineupChip}>
                      <Text style={this.styles.previewLineupChipText}>{name}</Text>
                    </View>
                  ))}
                </View>
              )}
              {!!this.getPreviewLocationLine() && (
                <View style={this.styles.previewLocationRow}>
                  <View style={this.styles.previewLocationIconWrap}>
                    <Icon
                      name="map-pin"
                      size={13}
                      color={this.getPostTheme().primary}
                    />
                  </View>
                  <Text style={this.styles.previewLocationText}>
                    {this.getPreviewLocationLine()}
                  </Text>
                </View>
              )}
              <View style={this.styles.previewMetaRow}>
                <Icon name="calendar" size={13} color={this.getPostTheme().muted} />
                {!!this.state.dateOfShow && (
                  <Text style={this.styles.previewMetaText}>
                    {this.state.dateOfShow}
                  </Text>
                )}
                {!!this.getPreviewTime() && (
                  <Text style={this.styles.previewTimeText}>
                    {this.getPreviewTime()}
                  </Text>
                )}
                {lineupNames.length > 0 && (
                  <View style={this.styles.previewCountPill}>
                    <Text style={this.styles.previewCountText}>
                      {lineupNames.length}
                    </Text>
                  </View>
                )}
              </View>
              {!!this.state.description && (
                <Text style={this.styles.previewDescription}>
                  {this.state.description}
                </Text>
              )}
            </View>
          </View>
          <View style={this.styles.visibilityCard}>
            <Text style={this.styles.visibilityTitle}>VISIBILITY</Text>
            {[
              'Visible on local feed',
              'Notified followers',
              'Searchable by genre & city',
              'Reminder sent day-of to saved fans',
            ].map(item => (
              <View key={item} style={this.styles.visibilityRow}>
                <Icon
                  name="check-circle"
                  size={16}
                  color="#22C55E"
                />
                <Text style={this.styles.visibilityText}>{item}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity
            testID="publishShowBtn"
            style={this.styles.publishBtn}
            onPress={this.handleCreateShowAPI}
            activeOpacity={0.85}
          >
            {this.state.isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Icon name="star" size={16} color="#FFFFFF" />
                <Text style={this.styles.publishBtnText}>PUBLISH NOW</Text>
              </>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            testID="editPreviewBtn"
            onPress={this.handleBackFromPreview}
          >
            <Text style={this.styles.editPreviewText}>Go back & edit</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  };

  renderDate = () => {
    return (
      <TouchableOpacity
        testID="btnDateSelector"
        style={this.styles.calendarContainer}
        onPress={() => this.showDateSelector()}
      >
        <Text style={this.styles.dateText}>
          {this.state.dateOfShow !== '' ? this.state.dateOfShow : 'Select date'}
        </Text>
        <Image
          source={require('../../../mobile/assets/images/image_calendar.png')}
          style={[this.styles.backBtn, { tintColor: this.getPostTheme().primary }]}
        />
      </TouchableOpacity>
    );
  };

  renderEndDate = () => {
    return (
      <TouchableOpacity
        testID="btnEndDateSelector"
        style={this.styles.calendarContainer}
        onPress={() => this.showEndDateSelector()}
      >
        <Text style={this.styles.dateText}>
          {this.state.endDate !== '' ? this.state.endDate : 'Select end date'}
        </Text>
        <Image
          source={require('../../../mobile/assets/images/image_calendar.png')}
          style={[this.styles.backBtn, { tintColor: this.getPostTheme().primary }]}
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
      <View style={this.styles.rosterInputContainer}>
        <TextInput
          testID="customRuleTextInput"
          placeholder="Enter custom rule or regulation"
          placeholderTextColor={this.getPostTheme().muted}
          style={this.styles.rosterInput}
          value={this.state.customRuleTxt}
          onChangeText={text =>
            this.setState({ customRuleTxt: text.replace(/\s{2,}/g, ' ') })
          }
          onSubmitEditing={this.handleAddCustomRule}
        />
        {this.state.customRuleTxt.trim() !== '' && (
          <TouchableOpacity
            testID="saveCustomRuleBtn"
            style={this.styles.rosterSaveButton}
            onPress={this.handleAddCustomRule}
          >
            <Text style={this.styles.rosterSaveButtonText}>Save</Text>
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
        <Text style={this.styles.label}>Rules and Regulations</Text>
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
                style={this.styles.rulesIconItem}
                onPress={() => this.handleToggleRulesRegulation(itemId)}
                activeOpacity={0.7}
              >
                <View style={this.styles.rulesIconRow}>
                  <TouchableOpacity
                    testID={
                      isChecked
                        ? 'selectedRulesRegulationCheckbox'
                        : 'unselectedRulesRegulationCheckbox'
                    }
                    style={[
                      this.styles.checkbox,
                      isChecked && this.styles.checkboxChecked,
                    ]}
                    onPress={() => this.handleToggleRulesRegulation(itemId)}
                  >
                    {isChecked && (
                      <Icon name="check" size={14} color="#FFFFFF" />
                    )}
                  </TouchableOpacity>
                  <Text style={this.styles.rulesIconText}>{title}</Text>
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
            <View style={this.styles.showFeatureItem}>
              <TouchableOpacity
                testID={
                  activate_feature
                    ? 'selectedShowFeature'
                    : 'unselectedShowFeature'
                }
                style={[
                  this.styles.checkbox,
                  activate_feature && this.styles.checkboxChecked,
                ]}
                onPress={() => {}}
              >
                {activate_feature && (
                  <Icon name="check" size={14} color="#FFFFFF" />
                )}
              </TouchableOpacity>
              <Text
                style={[
                  this.styles.label,
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
      <SafeAreaView style={this.styles.safeAreaView} edges={['top', 'left', 'right']}>
        {/* Customizable Area Start */}
        {this.state.isPreviewStep ? (
          this.renderPreviewScreen()
        ) : (
        <KeyboardAvoidingView
          style={{ flex: 1, backgroundColor: this.getPostTheme().background }}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : undefined}
          behavior={this.isPlatformiOS() ? 'padding' : undefined}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <TouchableWithoutFeedback
              testID="containerFeedback"
              onPress={() => {
                this.hideKeyboard();
              }}
            >
              <>
                <View style={this.styles.container}>
                  <StatusBar
                    barStyle={this.state.isDarkMode ? 'light-content' : 'dark-content'}
                    backgroundColor={this.getPostTheme().background}
                  />
                  <View style={this.styles.headerContainer}>
                    <TouchableOpacity
                      testID="backBtn"
                      style={this.styles.headerIconBtn}
                      onPress={() => this.props.navigation.goBack()}
                    >
                      <Icon
                        name="arrow-left"
                        size={18}
                        color={this.getPostTheme().foreground}
                      />
                    </TouchableOpacity>
                    <Text style={this.styles.pageTitle}>
                      {configJSON.postAShowCardTitle}
                    </Text>
                    <TouchableOpacity
                      testID="closeCreateShowBtn"
                      style={this.styles.headerIconBtn}
                      onPress={() => this.props.navigation.goBack()}
                    >
                      <Icon name="x" size={18} color={this.getPostTheme().muted} />
                    </TouchableOpacity>
                  </View>
                  <Text style={this.styles.stepLabel}>Step 1 of 2 — Details</Text>
                  <View style={this.styles.progressTrack}>
                    <View style={this.styles.progressFill} />
                  </View>
                  <Text style={this.styles.photoLabel}>EVENT / SHOW PHOTO</Text>
                  {this.renderEventImage()}
                  <Text style={this.styles.label}>Event Title</Text>
                  <TextInput
                    testID="eventTitleInputText"
                    placeholder="Enter event title"
                    style={this.styles.input}
                    placeholderTextColor={this.getPostTheme().muted}
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

                
                  <Text style={this.styles.label}>{configJSON.location}</Text>
                  <TextInput
                    testID="locationInputText"
                    placeholder="Enter location"
                       style={[
                      this.styles.input,
                      this.getShouldDisableLocationFields() &&
                        this.styles.disabledInput,
                    ]}
                    placeholderTextColor={this.getPostTheme().muted}
                    value={this.state.location}
                    onChangeText={location =>
                      this.handleLocationInput(location)
                    }
                    editable={!this.getShouldDisableLocationFields()}
                  />
                  {this.renderError(this.state.locationError)}
                  <Text style={this.styles.label}>{configJSON.address}</Text>
                  <TextInput
                    testID="addressInputText"
                    placeholder="Enter address"
                    style={[
                      this.styles.input,
                      this.getShouldDisableLocationFields() &&
                        this.styles.disabledInput,
                    ]}
                    placeholderTextColor={this.getPostTheme().muted}
                    value={this.state.address}
                    onChangeText={address => this.handleAddressInput(address)}
                    maxLength={100}
                    editable={!this.getShouldDisableLocationFields()}
                  />
                  {this.renderError(this.state.addressError)}
                  <Text style={this.styles.label}>{configJSON.state}</Text>
                  {this.renderState()}
                  {this.renderError(this.state.stateError)}
                  <Text style={this.styles.label}>{configJSON.city}</Text>
                  {this.renderCity()}
                  {this.renderError(this.state.cityError)}
                  <Text style={this.styles.label}>{configJSON.zip}</Text>
                  <TextInput
                    testID="zipInputText"
                    placeholder="Enter zip"
                    style={[
                      this.styles.input,
                      this.getShouldDisableLocationFields() &&
                        this.styles.disabledInput,
                    ]}
                    placeholderTextColor={this.getPostTheme().muted}
                    value={this.state.zipCode}
                    onChangeText={this.onZipcodeTextChange}
                    maxLength={5}
                    keyboardType="numeric"
                    editable={!this.getShouldDisableLocationFields()}
                  />
                  {this.renderError(this.state.zipError)}
                  <Text style={this.styles.label}>{configJSON.dateOfTheShow}</Text>
                  {this.renderDate()}
                  {this.renderError(this.state.dateOfShowError)}
                  <Text style={this.styles.label}>{configJSON.endDate}</Text>
                  {this.renderEndDate()}
                  {this.renderError(this.state.endDateError)}
                  <Text style={this.styles.label}>{configJSON.time}</Text>
                  {this.renderTime()}
                  {this.renderError(this.state.timeError)}
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={this.styles.label}>{configJSON.lineUp}</Text>
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
                          this.styles.backBtn,
                          { marginLeft: 10, marginTop: 20 },
                        ]}
                      />
                    </TouchableOpacity>
                  </View>
                  {this.renderLineUp()}
                  {this.renderError(this.state.lineUpError)}
                  {this.renderLineUpFlatlist()}
                  <Text style={this.styles.label}>
                    {configJSON.typeOfShows}
                    <Text style={this.styles.normalFont}>{configJSON.max2}</Text>
                  </Text>
                  {this.renderTypeOfShow()}
                  {this.renderError(this.state.typeOfShowError)}
                  {this.renderTypeOfShowFlatlist()}
                  <Text style={this.styles.label}>
                    {configJSON.genre}
                    <Text style={this.styles.normalFont}>{configJSON.max3}</Text>
                  </Text>
                  {this.renderGenre()}
                  {this.renderError(this.state.genreError)}
                  {this.renderGenreFlatlist()}
                  <Text style={this.styles.label}>
                    {configJSON.description}
                    <Text style={this.styles.normalFont}>{configJSON.max2000}</Text>
                  </Text>
                  <TextInput
                    testID="descriptionInputText"
                    placeholder="Enter description"
                    style={[
                      this.styles.input,
                      { height: 100, textAlignVertical: 'top' },
                    ]}
                    multiline
                    placeholderTextColor={this.getPostTheme().muted}
                    value={this.state.description}
                    maxLength={2000}
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
                        <Text style={this.styles.ticketLinkPromoText}>
                          For a limited time, FREE Link to your tickets
                        </Text>
                        {!this.state.verified && (
                          <Text style={this.styles.ticketLinkVerifyText}>
                            VERIFY YOUR ACCOUNT
                          </Text>
                        )}
                        <TextInput
                          testID="ticketLinkInputText"
                          placeholder="Enter Show Ticket link"
                          style={this.styles.ticketLinkInput}
                          placeholderTextColor={this.getPostTheme().muted}
                          value={this.state.ticketLink}
                          onChangeText={ticketLink =>
                            this.setState({ ticketLink })
                          }
                        />
                        {!this.state.verified && (
                          <Text style={this.styles.ticketLinkDisclaimer}>
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
                  {this.renderCameraGalleryPopup()}
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
                    <View style={this.styles.modalContainer}>
                      <TouchableWithoutFeedback>
                        <View style={this.styles.modal}>
                          <Picker
                            testID="statePickerModal"
                            selectedValue={this.state.selectedState}
                            onValueChange={selectedState =>
                              this.handleStateValueChange(selectedState)
                            }
                            itemStyle={this.styles.pickerModalItemStyle}
                            themeVariant="dark"
                            style={this.styles.pickerModal}
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
                                  color={this.getPostTheme().foreground}
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
                    <View style={this.styles.modalContainer}>
                      <TouchableWithoutFeedback>
                        <View style={this.styles.modal}>
                          <Picker
                            testID="cityPickerModal"
                            selectedValue={this.state.selectedCity}
                            onValueChange={selectedCity =>
                              this.handleCityValueChange(selectedCity)
                            }
                            itemStyle={this.styles.pickerModalItemStyle}
                            themeVariant="dark"
                            style={this.styles.pickerModal}
                          >
                            {this.state.citiesList?.map((name: string) => (
                              <Picker.Item
                                key={name}
                                value={name}
                                label={name}
                                color={this.getPostTheme().foreground}
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
                  <View style={this.styles.modalContainer}>
                    <TouchableWithoutFeedback
                      testID="hideTimeModal"
                      onPress={this.hideTimeModal}
                    >
                      <View style={StyleSheet.absoluteFill} />
                    </TouchableWithoutFeedback>
                    <View style={this.styles.modal}>
                      <Text style={this.styles.pickerModalTitle}>Select time</Text>
                      <Text style={this.styles.pickerModalSelectedValue}>
                        {this.state.time || '00h00'}
                      </Text>
                      <ScrollView
                        testID="timePickerModal"
                        style={this.styles.timePickerList}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                        {...{
                          onValueChange: (value: string) =>
                            this.handleTimeValueChange(value),
                        }}
                      >
                        {this.state.timeList.map((name: string) => {
                          const selected = name === this.state.time;
                          return (
                            <TouchableOpacity
                              key={name}
                              activeOpacity={0.8}
                              onPress={() =>
                                this.handleTimeValueChange(name)
                              }
                              style={[
                                this.styles.timePickerOption,
                                selected && this.styles.timePickerOptionSelected,
                              ]}
                            >
                              <Text
                                style={[
                                  this.styles.timePickerOptionText,
                                  selected &&
                                    this.styles.timePickerOptionTextSelected,
                                ]}
                              >
                                {name}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </ScrollView>
                    </View>
                  </View>
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
                    <View style={this.styles.modalContainer}>
                      <TouchableWithoutFeedback>
                        <View style={this.styles.modal}>
                          <Picker
                            testID="typeOfShowsPickerModal"
                            onValueChange={(value: string) =>
                              this.handleIosTypeValueChange(value)
                            }
                            itemStyle={this.styles.pickerModalItemStyle}
                            themeVariant="dark"
                            style={this.styles.pickerModal}
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
                                color={this.getPostTheme().foreground}
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
                    <View style={this.styles.modalContainer}>
                      <TouchableWithoutFeedback>
                        <View style={this.styles.modal}>
                          <Picker
                            testID="genrePickerModal"
                            onValueChange={(value: string) =>
                              this.handleIosGenreValueChange(value)
                            }
                            itemStyle={this.styles.pickerModalItemStyle}
                            themeVariant="dark"
                            style={this.styles.pickerModal}
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
                                color={this.getPostTheme().foreground}
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
                    <View style={this.styles.modalContainer}>
                      <TouchableWithoutFeedback>
                        <View style={this.styles.modal}>
                          <Picker
                            testID="lineUpPickerModal"
                            onValueChange={(value: any) =>
                              this.handleIosLineUpValueChange(value)
                            }
                            itemStyle={this.styles.pickerModalItemStyle}
                            themeVariant="dark"
                            style={this.styles.pickerModal}
                          >
                            <Picker.Item
                              label={'Select from roster'}
                              value={''}
                              color={this.getPostTheme().foreground}
                            />
                            {this.state.rosterLineUpList?.map((item: any) => (
                              <Picker.Item
                                key={item.id || item.first_name}
                                label={item.first_name}
                                value={item}
                                color={this.getPostTheme().foreground}
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
          {/* {this.state.isLoading && <View style={this.styles.loadingContainer}>
            <ActivityIndicator size={'large'} color="black" />
          </View>} */}
          {this.state.showDateSelector && (
            <>
              <View style={this.styles.calendarModal}>
                <DateRangePicker
                  testID="DateRangePicker"
                  open={this.state.showDateSelector}
                  onChange={this.setDates}
                  date={moment(this.state.dateOfShow)}
                  displayedDate={this.state.displayedDate}
                  minDate={new Date()}
                  range
                  {...this.getDarkCalendarPickerProps()}
                >
                  <></>
                </DateRangePicker>
              </View>
              <TouchableOpacity
                testID="hideCalendar"
                style={this.styles.cancelDateSelectionBtn}
                onPress={this.hideDateSelector}
              >
                <Icon name="x" size={30} color={this.getPostTheme().foreground} />
              </TouchableOpacity>
            </>
          )}
          {this.state.showEndDateSelector && (
            <>
              <View style={this.styles.calendarModal}>
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
                  minDate={new Date()}
                  range
                  {...this.getDarkCalendarPickerProps()}
                >
                  <></>
                </DateRangePicker>
              </View>
              <TouchableOpacity
                testID="hideEndCalendar"
                style={this.styles.cancelDateSelectionBtn}
                onPress={this.hideEndDateSelector}
              >
                <Icon name="x" size={30} color={this.getPostTheme().foreground} />
              </TouchableOpacity>
            </>
          )}
        </KeyboardAvoidingView>
        )}
        {/* Customizable Area End */}
      </SafeAreaView>
    );
  }
}

// Customizable Area Start
const createPostCreationStyles = (theme: typeof redesignTheme | typeof lightTheme) => StyleSheet.create({
  safeAreaView: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignSelf: 'center',
    backgroundColor: theme.background,
  },
  container: {
    backgroundColor: theme.background,
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
  },
  headerIconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.input,
    borderWidth: 1,
    borderColor: theme.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtn: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  pageTitle: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '900',
    color: theme.foreground,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  stepLabel: {
    color: theme.muted,
    fontSize: 14,
    marginTop: 10,
    marginBottom: 10,
  },
  progressTrack: {
    height: 3,
    borderRadius: 2,
    backgroundColor: theme.border,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    width: '50%',
    height: '100%',
    backgroundColor: theme.primary,
  },
  photoLabel: {
    color: theme.primary,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.6,
    marginTop: 12,
  },
  photoPicker: {
    marginTop: 10,
    minHeight: 150,
    borderRadius: 16,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: theme.border,
    backgroundColor: theme.card,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  photoPreview: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  photoPickerText: {
    color: theme.primary,
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  eventImage: {
    height: 200,
    width: '100%',
    resizeMode: 'contain',
    marginTop: 30,
  },
  label: {
    fontSize: 14,
    fontWeight: '800',
    color: theme.primary,
    marginTop: 20,
    letterSpacing: 0.4,
  },
  input: {
    fontWeight: '400',
    width: '100%',
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
    backgroundColor: theme.input,
    color: theme.foreground,
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
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
    backgroundColor: theme.input,
    color: theme.foreground,
    height: 50,
    fontSize: 16,
  },
  lineUpSaveButton: {
    marginLeft: 10,
    paddingHorizontal: 20,
    height: 50,
    borderRadius: 12,
    backgroundColor: theme.primary,
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
    backgroundColor: 'rgba(255, 45, 107, 0.08)',
    borderRadius: 10,
  },
  lineUpInfoText: {
    fontSize: 14,
    color: theme.muted,
    fontWeight: '600',
  },
  lineUpInfoStrong: {
    color: theme.primary,
    fontWeight: '700',
  },
  androidPickerContainer: {
    width: '100%',
    paddingHorizontal: 0,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
    backgroundColor: theme.input,
    height: 50,
    justifyContent: 'center',
    marginTop: 10,
  },
  androidPicker: {
    width: '100%',
    paddingHorizontal: 10,
    borderRadius: 12,
    color: theme.foreground,
    height: 50,
    justifyContent: 'center',
  },
  androidPickerItemStyle: {
    alignSelf: 'flex-start',
    color: theme.foreground,
    fontSize: 16,
  },
  androidPickerDropdown: {
    position: 'absolute',
    right: 15,
    marginRight: 5,
    width: 8,
    transform: [{ rotate: '-90deg' }],
    resizeMode: 'contain',
    tintColor: theme.primary,
  },
  normalFont: {
    fontWeight: '400',
  },
  checkbox: {
    height: 20,
    width: 20,
    borderWidth: 1.5,
    borderRadius: 5,
    borderColor: theme.muted,
    backgroundColor: 'transparent',
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    borderColor: theme.primary,
    backgroundColor: theme.primary,
  },
  postShowButton: {
    borderRadius: 28,
    justifyContent: 'center',
    paddingVertical: 16,
    marginTop: 30,
  },
  previewCtaWrap: {
    marginTop: 8,
    marginBottom: 8,
  },
  previewBtnInactive: {
    backgroundColor: '#1A1A28',
    borderWidth: 1,
    borderColor: theme.border,
  },
  previewBtnActive: {
    backgroundColor: theme.primary,
    shadowColor: theme.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.55,
    shadowRadius: 12,
    elevation: 8,
  },
  previewBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewBtnInactiveText: {
    color: theme.muted,
  },
  previewHelp: {
    color: theme.muted,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 10,
  },
  postShowButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.6,
    textAlignVertical: 'center',
    textAlign: 'center',
  },
  rowItem: {
    flexDirection: 'row',
    borderRadius: 15,
    backgroundColor: 'rgba(255, 45, 107, 0.12)',
    paddingVertical: 5,
    marginRight: 10,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  crossBtn: {
    marginLeft: 10,
    tintColor: theme.primary,
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
    backgroundColor: '#08080fcc',
  },
  modal: {
    borderTopStartRadius: 20,
    padding: 15,
    height: '38%',
    justifyContent: 'space-between',
    backgroundColor: theme.card,
    borderTopEndRadius: 20,
    zIndex: 2,
  },
  pickerModal: {
    color: theme.foreground,
    backgroundColor: 'transparent',
  },
  pickerModalItemStyle: {
    color: theme.foreground,
    fontSize: 22,
    fontWeight: '600',
  },
  pickerModalTitle: {
    color: theme.muted,
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    marginTop: 4,
  },
  pickerModalSelectedValue: {
    color: theme.foreground,
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 8,
  },
  timePickerList: {
    flex: 1,
    minHeight: 160,
  },
  timePickerOption: {
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
    marginBottom: 6,
  },
  timePickerOptionSelected: {
    backgroundColor: theme.primarySoft,
  },
  timePickerOptionText: {
    color: theme.foreground,
    fontSize: 20,
    fontWeight: '600',
  },
  timePickerOptionTextSelected: {
    color: theme.primary,
    fontWeight: '800',
  },
  calendarContainer: {
    width: '100%',
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
    backgroundColor: theme.input,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    height: 50,
    marginTop: 10,
  },
  dateText: {
    alignSelf: 'center',
    color: theme.foreground,
    fontSize: 16,
  },
  calendarModal: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    alignSelf: 'flex-start',
    color: '#FF5C5C',
    fontSize: 13,
    fontWeight: '600',
    paddingTop: 6,
    lineHeight: 18,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#08080fdd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelDateSelectionBtn: {
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
  rulesIconItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 8,
    backgroundColor: theme.input,
    borderRadius: 8,
  },
  rulesIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rulesIconText: {
    fontSize: 14,
    color: theme.foreground,
    flex: 1,
  },
  disabledInput: {
    opacity: 0.6,
    backgroundColor: theme.input,
  },
  ticketLinkPromoText: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.accent,
    textAlign: 'center',
    marginTop: 24,
  },
  ticketLinkVerifyText: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.foreground,
    textAlign: 'center',
    marginTop: 8,
    letterSpacing: 0.5,
  },
  ticketLinkInput: {
    fontWeight: '400',
    width: '100%',
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
    backgroundColor: theme.input,
    color: theme.foreground,
    height: 50,
    fontSize: 16,
    marginTop: 12,
  },
  ticketLinkDisclaimer: {
    fontSize: 14,
    fontWeight: '400',
    color: theme.muted,
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
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
    backgroundColor: theme.input,
    color: theme.foreground,
    height: 50,
    fontSize: 16,
    marginRight: 10,
  },
  rosterSaveButton: {
    backgroundColor: theme.primary,
    borderRadius: 12,
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
  centerView: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#08080fcc',
    padding: 10,
  },
  cameraGalleryOption: {
    borderRadius: 14,
    backgroundColor: theme.card,
    alignItems: 'center',
  },
  cameraButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.primary,
    marginVertical: 16,
  },
  divider: {
    backgroundColor: theme.border,
    height: 1,
    width: '100%',
  },
  cancelCameraPopup: {
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 14,
    backgroundColor: theme.card,
    alignItems: 'center',
    paddingVertical: 16,
  },
  cancelCameraText: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.foreground,
  },
  previewScreen: {
    flex: 1,
    backgroundColor: theme.background,
    paddingHorizontal: 16,
  },
  previewHeaderCopy: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  previewStepLabel: {
    color: theme.muted,
    fontSize: 12,
    marginTop: 2,
    textAlign: 'center',
  },
  previewProgressTrack: {
    height: 3,
    borderRadius: 2,
    backgroundColor: theme.border,
    overflow: 'hidden',
    marginTop: 12,
  },
  previewProgressFill: {
    width: '100%',
    height: '100%',
    backgroundColor: theme.primary,
  },
  previewScroll: {
    paddingTop: 16,
    paddingBottom: 40,
  },
  previewIntro: {
    color: theme.muted,
    fontSize: 14,
    marginBottom: 14,
  },
  previewCard: {
    backgroundColor: theme.card,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.border,
  },
  previewImageWrap: {
    width: '100%',
    height: 180,
    backgroundColor: theme.input,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  previewImagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewCategoryBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: theme.primary,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  previewCategoryText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  previewCardBody: {
    padding: 14,
  },
  previewEventTitle: {
    color: theme.foreground,
    fontSize: 24,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 8,
  },
  previewLineupRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  previewLineupChip: {
    backgroundColor: theme.primary,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 6,
  },
  previewLineupChipText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  previewMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    flexWrap: 'wrap',
  },
  previewLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  previewLocationIconWrap: {
    width: 14,
    height: 18,
    marginRight: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewLocationText: {
    color: theme.muted,
    fontSize: 13,
    lineHeight: 18,
    flex: 1,
    flexShrink: 1,
  },
  previewMetaText: {
    color: theme.muted,
    fontSize: 13,
    marginLeft: 6,
    flexShrink: 1,
  },
  previewTimeText: {
    color: theme.accent,
    fontSize: 14,
    fontWeight: '800',
    marginLeft: 8,
  },
  previewCountPill: {
    marginLeft: 8,
    backgroundColor: theme.input,
    borderRadius: 10,
    minWidth: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  previewCountText: {
    color: theme.foreground,
    fontSize: 11,
    fontWeight: '700',
  },
  previewDescription: {
    color: theme.muted,
    fontSize: 14,
    marginTop: 10,
  },
  visibilityCard: {
    marginTop: 14,
    backgroundColor: theme.card,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: theme.border,
  },
  visibilityTitle: {
    color: theme.muted,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  visibilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  visibilityText: {
    color: theme.foreground,
    fontSize: 14,
    marginLeft: 8,
  },
  publishBtn: {
    marginTop: 22,
    backgroundColor: theme.primary,
    borderRadius: 16,
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.55,
    shadowRadius: 12,
    elevation: 8,
  },
  publishBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.8,
    marginLeft: 8,
  },
  editPreviewText: {
    color: theme.foreground,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 14,
  },
});

const darkPostCreationStyles = createPostCreationStyles(redesignTheme);
const lightPostCreationStyles = createPostCreationStyles(lightTheme);
// Customizable Area End

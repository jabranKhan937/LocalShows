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
import { redesignTheme } from '../../utilities/src/Colors';
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

  getDarkCalendarPickerProps = () => ({
    backdropStyle: {
      backgroundColor: 'rgba(8, 8, 15, 0.78)',
    },
    containerStyle: {
      backgroundColor: redesignTheme.card,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: redesignTheme.border,
    },
    headerStyle: {
      borderBottomColor: redesignTheme.border,
    },
    headerTextStyle: {
      color: redesignTheme.foreground,
      fontWeight: '700' as const,
    },
    monthButtonsStyle: {
      tintColor: redesignTheme.primary,
    },
    dayHeaderTextStyle: {
      color: redesignTheme.muted,
      fontWeight: '600' as const,
    },
    dayTextStyle: {
      color: redesignTheme.foreground,
    },
    selectedStyle: {
      backgroundColor: redesignTheme.primary,
    },
    selectedTextStyle: {
      color: '#FFFFFF',
      fontWeight: '700' as const,
    },
    disabledTextStyle: {
      color: redesignTheme.muted,
    },
    monthPrevButton: (
      <Icon name="chevron-left" size={22} color={redesignTheme.primary} />
    ),
    monthNextButton: (
      <Icon name="chevron-right" size={22} color={redesignTheme.primary} />
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
        style={styles.photoPicker}
        onPress={this.handleOpenCameraPopup}
      >
        {hasImage ? (
          <Image
            source={{ uri: this.state.selectedImageData.uri }}
            style={styles.photoPreview}
          />
        ) : (
          <>
            <Icon name="image" size={28} color={redesignTheme.primary} />
            <Text style={styles.photoPickerText}>Tap to select a photo</Text>
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
        <View style={styles.centerView}>
          <View style={styles.cameraGalleryOption}>
            <TouchableOpacity
              testID="takePhotoBtn"
              onPress={this.handleCameraImage}
            >
              <Text style={styles.cameraButtonText}>Take photo</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity
              testID="choosePhotoBtn"
              onPress={this.handleGallery}
            >
              <Text style={styles.cameraButtonText}>Choose photo</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            testID="cancelCameraOption"
            style={styles.cancelCameraPopup}
            onPress={this.handleCameraGalleryCancelPopup}
          >
            <Text style={styles.cancelCameraText}>Cancel</Text>
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
        <Text
          style={[
            styles.androidPicker,
            { paddingTop: 15, color: redesignTheme.foreground },
          ]}
        >
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
          <Picker.Item
            label={'Select time'}
            value={''}
            color={redesignTheme.foreground}
          />
          {this.state.timeList.map((name: string) => (
            <Picker.Item
              key={name}
              label={name}
              value={name}
              color={redesignTheme.foreground}
            />
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
            placeholderTextColor={redesignTheme.muted}
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
                  { fontWeight: '400', color: redesignTheme.primary, marginTop: 1 },
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
                  { fontWeight: '400', color: redesignTheme.primary, marginTop: 1 },
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
                  { fontWeight: '400', color: redesignTheme.primary, marginTop: 1 },
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
            style={[styles.postShowButton, { backgroundColor: redesignTheme.card }]}
            onPress={() => {
              this.props.navigation.goBack();
            }}
          >
            <Text style={[styles.postShowButtonText, { color: redesignTheme.foreground }]}>
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
      <View style={styles.previewCtaWrap}>
        <TouchableOpacity
          testID="postShowBtn"
          style={[
            styles.postShowButton,
            isReady ? styles.previewBtnActive : styles.previewBtnInactive,
          ]}
          onPress={this.handlePreviewPost}
          activeOpacity={isReady ? 0.85 : 1}
        >
          <View style={styles.previewBtnInner}>
            <Text
              style={[
                styles.postShowButtonText,
                !isReady && !isEdit && styles.previewBtnInactiveText,
              ]}
            >
              {isEdit ? configJSON.save : 'PREVIEW POST'}
            </Text>
            {!isEdit && (
              <Icon
                name="chevron-right"
                size={18}
                color={isReady ? '#FFFFFF' : redesignTheme.muted}
              />
            )}
          </View>
        </TouchableOpacity>
        {!isEdit && (
          <Text style={styles.previewHelp}>
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
      <View style={styles.previewScreen}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={redesignTheme.background}
        />
        <View style={styles.headerContainer}>
          <TouchableOpacity
            testID="previewBackBtn"
            style={styles.headerIconBtn}
            onPress={this.handleBackFromPreview}
          >
            <Icon
              name="arrow-left"
              size={18}
              color={redesignTheme.foreground}
            />
          </TouchableOpacity>
          <View style={styles.previewHeaderCopy}>
            <Text style={styles.pageTitle}>PREVIEW</Text>
            <Text style={styles.previewStepLabel}>
              Step 2 of 2 — Confirm & Publish
            </Text>
          </View>
          <TouchableOpacity
            testID="previewCloseBtn"
            style={styles.headerIconBtn}
            onPress={() => this.props.navigation.goBack()}
          >
            <Icon name="x" size={18} color={redesignTheme.muted} />
          </TouchableOpacity>
        </View>
        <View style={styles.previewProgressTrack}>
          <View style={styles.previewProgressFill} />
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.previewScroll}
        >
          <Text style={styles.previewIntro}>
            This is how your post will appear in the feed:
          </Text>
          <View style={styles.previewCard}>
            <View style={styles.previewImageWrap}>
              {imageUri ? (
                <Image
                  source={{ uri: String(imageUri) }}
                  style={styles.previewImage}
                />
              ) : (
                <View style={styles.previewImagePlaceholder}>
                  <Icon name="image" size={32} color={redesignTheme.muted} />
                </View>
              )}
              {!!category && (
                <View style={styles.previewCategoryBadge}>
                  <Text style={styles.previewCategoryText}>
                    {String(category).toUpperCase()}
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.previewCardBody}>
              {!!this.state.eventTitle && (
                <Text style={styles.previewEventTitle}>
                  {this.state.eventTitle}
                </Text>
              )}
              {lineupNames.length > 0 && (
                <View style={styles.previewLineupRow}>
                  {lineupNames.map((name: string) => (
                    <View key={name} style={styles.previewLineupChip}>
                      <Text style={styles.previewLineupChipText}>{name}</Text>
                    </View>
                  ))}
                </View>
              )}
              {!!this.getPreviewLocationLine() && (
                <View style={styles.previewLocationRow}>
                  <View style={styles.previewLocationIconWrap}>
                    <Icon
                      name="map-pin"
                      size={13}
                      color={redesignTheme.primary}
                    />
                  </View>
                  <Text style={styles.previewLocationText}>
                    {this.getPreviewLocationLine()}
                  </Text>
                </View>
              )}
              <View style={styles.previewMetaRow}>
                <Icon name="calendar" size={13} color={redesignTheme.muted} />
                {!!this.state.dateOfShow && (
                  <Text style={styles.previewMetaText}>
                    {this.state.dateOfShow}
                  </Text>
                )}
                {!!this.getPreviewTime() && (
                  <Text style={styles.previewTimeText}>
                    {this.getPreviewTime()}
                  </Text>
                )}
                {lineupNames.length > 0 && (
                  <View style={styles.previewCountPill}>
                    <Text style={styles.previewCountText}>
                      {lineupNames.length}
                    </Text>
                  </View>
                )}
              </View>
              {!!this.state.description && (
                <Text style={styles.previewDescription}>
                  {this.state.description}
                </Text>
              )}
            </View>
          </View>
          <View style={styles.visibilityCard}>
            <Text style={styles.visibilityTitle}>VISIBILITY</Text>
            {[
              'Visible on local feed',
              'Notified followers',
              'Searchable by genre & city',
              'Reminder sent day-of to saved fans',
            ].map(item => (
              <View key={item} style={styles.visibilityRow}>
                <Icon
                  name="check-circle"
                  size={16}
                  color="#22C55E"
                />
                <Text style={styles.visibilityText}>{item}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity
            testID="publishShowBtn"
            style={styles.publishBtn}
            onPress={this.handleCreateShowAPI}
            activeOpacity={0.85}
          >
            {this.state.isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Icon name="star" size={16} color="#FFFFFF" />
                <Text style={styles.publishBtnText}>PUBLISH NOW</Text>
              </>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            testID="editPreviewBtn"
            onPress={this.handleBackFromPreview}
          >
            <Text style={styles.editPreviewText}>Go back & edit</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
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
          style={[styles.backBtn, { tintColor: redesignTheme.primary }]}
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
          style={[styles.backBtn, { tintColor: redesignTheme.primary }]}
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
          placeholderTextColor={redesignTheme.muted}
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
                  <TouchableOpacity
                    testID={
                      isChecked
                        ? 'selectedRulesRegulationCheckbox'
                        : 'unselectedRulesRegulationCheckbox'
                    }
                    style={[
                      styles.checkbox,
                      isChecked && styles.checkboxChecked,
                    ]}
                    onPress={() => this.handleToggleRulesRegulation(itemId)}
                  >
                    {isChecked && (
                      <Icon name="check" size={14} color="#FFFFFF" />
                    )}
                  </TouchableOpacity>
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
              <TouchableOpacity
                testID={
                  activate_feature
                    ? 'selectedShowFeature'
                    : 'unselectedShowFeature'
                }
                style={[
                  styles.checkbox,
                  activate_feature && styles.checkboxChecked,
                ]}
                onPress={() => {}}
              >
                {activate_feature && (
                  <Icon name="check" size={14} color="#FFFFFF" />
                )}
              </TouchableOpacity>
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
      <SafeAreaView style={styles.safeAreaView} edges={['top', 'left', 'right']}>
        {/* Customizable Area Start */}
        {this.state.isPreviewStep ? (
          this.renderPreviewScreen()
        ) : (
        <KeyboardAvoidingView
          style={{ flex: 1, backgroundColor: redesignTheme.background }}
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
                <View style={styles.container}>
                  <StatusBar
                    barStyle="light-content"
                    backgroundColor={redesignTheme.background}
                  />
                  <View style={styles.headerContainer}>
                    <TouchableOpacity
                      testID="backBtn"
                      style={styles.headerIconBtn}
                      onPress={() => this.props.navigation.goBack()}
                    >
                      <Icon
                        name="arrow-left"
                        size={18}
                        color={redesignTheme.foreground}
                      />
                    </TouchableOpacity>
                    <Text style={styles.pageTitle}>
                      {configJSON.postAShowCardTitle}
                    </Text>
                    <TouchableOpacity
                      testID="closeCreateShowBtn"
                      style={styles.headerIconBtn}
                      onPress={() => this.props.navigation.goBack()}
                    >
                      <Icon name="x" size={18} color={redesignTheme.muted} />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.stepLabel}>Step 1 of 2 — Details</Text>
                  <View style={styles.progressTrack}>
                    <View style={styles.progressFill} />
                  </View>
                  <Text style={styles.photoLabel}>EVENT / SHOW PHOTO</Text>
                  {this.renderEventImage()}
                  <Text style={styles.label}>Event Title</Text>
                  <TextInput
                    testID="eventTitleInputText"
                    placeholder="Enter event title"
                    style={styles.input}
                    placeholderTextColor={redesignTheme.muted}
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
                    placeholderTextColor={redesignTheme.muted}
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
                    placeholderTextColor={redesignTheme.muted}
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
                    placeholderTextColor={redesignTheme.muted}
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
                    placeholderTextColor={redesignTheme.muted}
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
                          placeholderTextColor={redesignTheme.muted}
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
                    <View style={styles.modalContainer}>
                      <TouchableWithoutFeedback>
                        <View style={styles.modal}>
                          <Picker
                            testID="statePickerModal"
                            selectedValue={this.state.selectedState}
                            onValueChange={selectedState =>
                              this.handleStateValueChange(selectedState)
                            }
                            itemStyle={styles.pickerModalItemStyle}
                            themeVariant="dark"
                            style={styles.pickerModal}
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
                                  color={redesignTheme.foreground}
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
                            itemStyle={styles.pickerModalItemStyle}
                            themeVariant="dark"
                            style={styles.pickerModal}
                          >
                            {this.state.citiesList?.map((name: string) => (
                              <Picker.Item
                                key={name}
                                value={name}
                                label={name}
                                color={redesignTheme.foreground}
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
                  <View style={styles.modalContainer}>
                    <TouchableWithoutFeedback
                      testID="hideTimeModal"
                      onPress={this.hideTimeModal}
                    >
                      <View style={StyleSheet.absoluteFill} />
                    </TouchableWithoutFeedback>
                    <View style={styles.modal}>
                      <Text style={styles.pickerModalTitle}>Select time</Text>
                      <Text style={styles.pickerModalSelectedValue}>
                        {this.state.time || '00h00'}
                      </Text>
                      <ScrollView
                        testID="timePickerModal"
                        style={styles.timePickerList}
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
                                styles.timePickerOption,
                                selected && styles.timePickerOptionSelected,
                              ]}
                            >
                              <Text
                                style={[
                                  styles.timePickerOptionText,
                                  selected &&
                                    styles.timePickerOptionTextSelected,
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
                    <View style={styles.modalContainer}>
                      <TouchableWithoutFeedback>
                        <View style={styles.modal}>
                          <Picker
                            testID="typeOfShowsPickerModal"
                            onValueChange={(value: string) =>
                              this.handleIosTypeValueChange(value)
                            }
                            itemStyle={styles.pickerModalItemStyle}
                            themeVariant="dark"
                            style={styles.pickerModal}
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
                                color={redesignTheme.foreground}
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
                            itemStyle={styles.pickerModalItemStyle}
                            themeVariant="dark"
                            style={styles.pickerModal}
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
                                color={redesignTheme.foreground}
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
                            itemStyle={styles.pickerModalItemStyle}
                            themeVariant="dark"
                            style={styles.pickerModal}
                          >
                            <Picker.Item
                              label={'Select from roster'}
                              value={''}
                              color={redesignTheme.foreground}
                            />
                            {this.state.rosterLineUpList?.map((item: any) => (
                              <Picker.Item
                                key={item.id || item.first_name}
                                label={item.first_name}
                                value={item}
                                color={redesignTheme.foreground}
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
                  minDate={new Date()}
                  range
                  {...this.getDarkCalendarPickerProps()}
                >
                  <></>
                </DateRangePicker>
              </View>
              <TouchableOpacity
                testID="hideCalendar"
                style={styles.cancelDateSelectionBtn}
                onPress={this.hideDateSelector}
              >
                <Icon name="x" size={30} color={redesignTheme.foreground} />
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
                  minDate={new Date()}
                  range
                  {...this.getDarkCalendarPickerProps()}
                >
                  <></>
                </DateRangePicker>
              </View>
              <TouchableOpacity
                testID="hideEndCalendar"
                style={styles.cancelDateSelectionBtn}
                onPress={this.hideEndDateSelector}
              >
                <Icon name="x" size={30} color={redesignTheme.foreground} />
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
const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignSelf: 'center',
    backgroundColor: redesignTheme.background,
  },
  container: {
    backgroundColor: redesignTheme.background,
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
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: redesignTheme.border,
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
    color: redesignTheme.foreground,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  stepLabel: {
    color: redesignTheme.muted,
    fontSize: 14,
    marginTop: 10,
    marginBottom: 10,
  },
  progressTrack: {
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    width: '50%',
    height: '100%',
    backgroundColor: redesignTheme.primary,
  },
  photoLabel: {
    color: redesignTheme.primary,
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
    borderColor: 'rgba(255, 255, 255, 0.16)',
    backgroundColor: redesignTheme.card,
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
    color: redesignTheme.primary,
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
    color: redesignTheme.primary,
    marginTop: 20,
    letterSpacing: 0.4,
  },
  input: {
    fontWeight: '400',
    width: '100%',
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: redesignTheme.border,
    backgroundColor: redesignTheme.input,
    color: redesignTheme.foreground,
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
    borderColor: redesignTheme.border,
    backgroundColor: redesignTheme.input,
    color: redesignTheme.foreground,
    height: 50,
    fontSize: 16,
  },
  lineUpSaveButton: {
    marginLeft: 10,
    paddingHorizontal: 20,
    height: 50,
    borderRadius: 12,
    backgroundColor: redesignTheme.primary,
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
    color: redesignTheme.muted,
    fontWeight: '600',
  },
  lineUpInfoStrong: {
    color: redesignTheme.primary,
    fontWeight: '700',
  },
  androidPickerContainer: {
    width: '100%',
    paddingHorizontal: 0,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: redesignTheme.border,
    backgroundColor: redesignTheme.input,
    height: 50,
    justifyContent: 'center',
    marginTop: 10,
  },
  androidPicker: {
    width: '100%',
    paddingHorizontal: 10,
    borderRadius: 12,
    color: redesignTheme.foreground,
    height: 50,
    justifyContent: 'center',
  },
  androidPickerItemStyle: {
    alignSelf: 'flex-start',
    color: redesignTheme.foreground,
    fontSize: 16,
  },
  androidPickerDropdown: {
    position: 'absolute',
    right: 15,
    marginRight: 5,
    width: 8,
    transform: [{ rotate: '-90deg' }],
    resizeMode: 'contain',
    tintColor: redesignTheme.primary,
  },
  normalFont: {
    fontWeight: '400',
  },
  checkbox: {
    height: 20,
    width: 20,
    borderWidth: 1.5,
    borderRadius: 5,
    borderColor: redesignTheme.muted,
    backgroundColor: 'transparent',
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    borderColor: redesignTheme.primary,
    backgroundColor: redesignTheme.primary,
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
    borderColor: redesignTheme.border,
  },
  previewBtnActive: {
    backgroundColor: redesignTheme.primary,
    shadowColor: redesignTheme.primary,
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
    color: redesignTheme.muted,
  },
  previewHelp: {
    color: redesignTheme.muted,
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
    tintColor: redesignTheme.primary,
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
    backgroundColor: redesignTheme.card,
    borderTopEndRadius: 20,
    zIndex: 2,
  },
  pickerModal: {
    color: redesignTheme.foreground,
    backgroundColor: 'transparent',
  },
  pickerModalItemStyle: {
    color: redesignTheme.foreground,
    fontSize: 22,
    fontWeight: '600',
  },
  pickerModalTitle: {
    color: redesignTheme.muted,
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    marginTop: 4,
  },
  pickerModalSelectedValue: {
    color: redesignTheme.foreground,
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
    backgroundColor: redesignTheme.primarySoft,
  },
  timePickerOptionText: {
    color: redesignTheme.foreground,
    fontSize: 20,
    fontWeight: '600',
  },
  timePickerOptionTextSelected: {
    color: redesignTheme.primary,
    fontWeight: '800',
  },
  calendarContainer: {
    width: '100%',
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: redesignTheme.border,
    backgroundColor: redesignTheme.input,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    height: 50,
    marginTop: 10,
  },
  dateText: {
    alignSelf: 'center',
    color: redesignTheme.foreground,
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
    backgroundColor: redesignTheme.card,
    zIndex: 2147483647,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
  },
  rulesIconItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 8,
    backgroundColor: redesignTheme.input,
    borderRadius: 8,
  },
  rulesIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rulesIconText: {
    fontSize: 14,
    color: redesignTheme.foreground,
    flex: 1,
  },
  disabledInput: {
    opacity: 0.6,
    backgroundColor: redesignTheme.input,
  },
  ticketLinkPromoText: {
    fontSize: 16,
    fontWeight: '700',
    color: redesignTheme.accent,
    textAlign: 'center',
    marginTop: 24,
  },
  ticketLinkVerifyText: {
    fontSize: 16,
    fontWeight: '700',
    color: redesignTheme.foreground,
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
    borderColor: redesignTheme.border,
    backgroundColor: redesignTheme.input,
    color: redesignTheme.foreground,
    height: 50,
    fontSize: 16,
    marginTop: 12,
  },
  ticketLinkDisclaimer: {
    fontSize: 14,
    fontWeight: '400',
    color: redesignTheme.muted,
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
    borderColor: redesignTheme.border,
    backgroundColor: redesignTheme.input,
    color: redesignTheme.foreground,
    height: 50,
    fontSize: 16,
    marginRight: 10,
  },
  rosterSaveButton: {
    backgroundColor: redesignTheme.primary,
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
    backgroundColor: redesignTheme.card,
    alignItems: 'center',
  },
  cameraButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: redesignTheme.primary,
    marginVertical: 16,
  },
  divider: {
    backgroundColor: redesignTheme.border,
    height: 1,
    width: '100%',
  },
  cancelCameraPopup: {
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 14,
    backgroundColor: redesignTheme.card,
    alignItems: 'center',
    paddingVertical: 16,
  },
  cancelCameraText: {
    fontSize: 16,
    fontWeight: '700',
    color: redesignTheme.foreground,
  },
  previewScreen: {
    flex: 1,
    backgroundColor: redesignTheme.background,
    paddingHorizontal: 16,
  },
  previewHeaderCopy: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  previewStepLabel: {
    color: redesignTheme.muted,
    fontSize: 12,
    marginTop: 2,
    textAlign: 'center',
  },
  previewProgressTrack: {
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
    marginTop: 12,
  },
  previewProgressFill: {
    width: '100%',
    height: '100%',
    backgroundColor: redesignTheme.primary,
  },
  previewScroll: {
    paddingTop: 16,
    paddingBottom: 40,
  },
  previewIntro: {
    color: redesignTheme.muted,
    fontSize: 14,
    marginBottom: 14,
  },
  previewCard: {
    backgroundColor: redesignTheme.card,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: redesignTheme.border,
  },
  previewImageWrap: {
    width: '100%',
    height: 180,
    backgroundColor: redesignTheme.input,
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
    backgroundColor: redesignTheme.primary,
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
    color: redesignTheme.foreground,
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
    backgroundColor: redesignTheme.primary,
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
    color: redesignTheme.muted,
    fontSize: 13,
    lineHeight: 18,
    flex: 1,
    flexShrink: 1,
  },
  previewMetaText: {
    color: redesignTheme.muted,
    fontSize: 13,
    marginLeft: 6,
    flexShrink: 1,
  },
  previewTimeText: {
    color: redesignTheme.accent,
    fontSize: 14,
    fontWeight: '800',
    marginLeft: 8,
  },
  previewCountPill: {
    marginLeft: 8,
    backgroundColor: redesignTheme.input,
    borderRadius: 10,
    minWidth: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  previewCountText: {
    color: redesignTheme.foreground,
    fontSize: 11,
    fontWeight: '700',
  },
  previewDescription: {
    color: redesignTheme.muted,
    fontSize: 14,
    marginTop: 10,
  },
  visibilityCard: {
    marginTop: 14,
    backgroundColor: redesignTheme.card,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: redesignTheme.border,
  },
  visibilityTitle: {
    color: redesignTheme.muted,
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
    color: redesignTheme.foreground,
    fontSize: 14,
    marginLeft: 8,
  },
  publishBtn: {
    marginTop: 22,
    backgroundColor: redesignTheme.primary,
    borderRadius: 16,
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: redesignTheme.primary,
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
    color: redesignTheme.foreground,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 14,
  },
});
// Customizable Area End

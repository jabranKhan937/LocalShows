import React from 'react';
// Customizable Area Start
import {
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  SafeAreaView,
  TouchableOpacity,
  View,
  Image,
  Text,
  StatusBar,
  TextInput,
  Platform,
  Modal,
  ActivityIndicator,
  Dimensions,
  FlatList,
} from 'react-native';
// Customizable Area End

// Customizable Area Start
import {lightTheme, redesignTheme} from '../../utilities/src/Colors';
import {Picker} from '@react-native-picker/picker';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import Icon from 'react-native-vector-icons/Feather';
import SvgImage, {Defs, LinearGradient, Path, Rect, Stop} from 'react-native-svg';
import RangeSlider from 'rn-range-slider';
import {DrawerActions} from '@react-navigation/native';
import FastImage from '../../../components/src/SafeFastImage';

type SearchTheme = typeof redesignTheme;

const GENRE_DOT_COLORS = ['#7ec8ff', '#ff2d6b', '#ffe138', '#3dd68c'];
const SCREEN_WIDTH = Dimensions.get('window').width;
const FEED_GUTTER = 16;
const GENRE_GAP = 12;
const GENRE_CARD_WIDTH = (SCREEN_WIDTH - FEED_GUTTER * 2 - GENRE_GAP) / 2;
const NEAR_ME_CARD_GAP = 10;
const NEAR_ME_CARD_WIDTH = Math.round(SCREEN_WIDTH * 0.38);
const NEAR_ME_CARD_HEIGHT = Math.round(NEAR_ME_CARD_WIDTH * 0.78);
const NEAR_ME_FADE_HEIGHT = Math.round(NEAR_ME_CARD_HEIGHT * 0.58);
const STATE_GRID_COLUMNS = 5;
const STATE_GRID_GAP = 8;
const STATE_BOX_WIDTH =
  (SCREEN_WIDTH - FEED_GUTTER * 2 - STATE_GRID_GAP * (STATE_GRID_COLUMNS - 1)) /
  STATE_GRID_COLUMNS;
const CITY_GRID_COLUMNS = 2;
const CITY_BOX_WIDTH =
  (SCREEN_WIDTH - FEED_GUTTER * 2 - STATE_GRID_GAP * (CITY_GRID_COLUMNS - 1)) /
  CITY_GRID_COLUMNS;
// Customizable Area End

import SearchController, {Props} from './SearchController';

export default class Search extends SearchController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }

  // Customizable Area Start

  get styles() {
    return this.state.isDarkMode ? darkSearchStyles : lightSearchStyles;
  }

  renderNotificationIcon = () => {
    const theme = this.getSearchTheme();
    return this.state.authToken ? (
      <TouchableOpacity
        testID="notificationIcon"
        style={this.styles.notificationIconContainer}
        onPress={this.handleNotificationNavigation}>
        <View style={this.styles.notificationWrapper}>
          <Image
            source={require('../../../mobile/assets/images/notifications.png')}
            style={[this.styles.notificationIcon, {tintColor: theme.foreground}]}
          />
          {this.renderNotificationIndicator()}
        </View>
      </TouchableOpacity>
    ) : null;
  };

  renderNotificationIndicator = () => {
    const count = this.state.unreadNotificationCount || 0;
    if (count > 0) {
      const displayCount = count > 99 ? '99+' : `${count}`;
      return (
        <View style={this.styles.notificationBadge}>
          <Text style={this.styles.notificationBadgeText}>{displayCount}</Text>
        </View>
      );
    }

    return this.renderRedDot({condition: this.state.newNotification});
  };

  renderRedDot = ({condition}: {condition: boolean}) => {
    if (condition) {
      return <View style={this.styles.redDot} />;
    }

    return <></>;
  };

  renderHeader = () => {
    const theme = this.getSearchTheme();
    return (
      <View style={this.styles.headerContainer}>
        <View style={this.styles.headerTitleRow}>
          <TouchableOpacity
            testID="navigationBackButton"
            style={this.styles.overlayCircleBtn}
            onPress={this.handleBackNavigation}
            activeOpacity={0.8}
            hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
            <Icon name="arrow-left" size={18} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={this.styles.headerTitleTxt}>SEARCH</Text>
        </View>

        <View style={this.styles.iconsContainer}>
          {this.renderNotificationIcon()}
          <TouchableOpacity
            testID="hamburger"
            onPress={() => {
              let navigator = this.props.navigation;
              let drawerFound = false;

              while (navigator) {
                if (navigator.openDrawer) {
                  navigator.openDrawer();
                  drawerFound = true;
                  break;
                }
                navigator = navigator.getParent?.();
              }

              if (!drawerFound) {
                this.props.navigation.dispatch(DrawerActions.openDrawer());
              }
            }}>
            <Image
              style={[this.styles.hamburgerIcon, {tintColor: theme.foreground}]}
              source={require('../../../mobile/assets/images/Vector.png')}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  renderSearchInput = () => {
    const theme = this.getSearchTheme();
    const isShows = this.state.SelectedTab === 'Shows';
    return (
      <View style={this.styles.inputContainer}>
        <Icon name="search" size={18} color={theme.primary} />
        <TextInput
          testID="searchText"
          style={[
            this.styles.input,
            !this.state.searchText && this.styles.inputPlaceholderSmaller,
          ]}
          placeholderTextColor={theme.muted}
          placeholder={
            isShows
              ? 'Bands, venues, genres, shows...'
              : 'Search venues, bands and people by name'
          }
          value={this.state.searchText}
          onChangeText={searchText => {
            this.handleSearchText(searchText);
          }}
          returnKeyType="search"
          onSubmitEditing={() => {
            if (this.debouncedLiveSearch?.flush) {
              this.debouncedLiveSearch.flush();
            } else {
              this.runLiveSearch();
            }
          }}
        />
        {this.state.searchText ? (
          <TouchableOpacity
            testID="clearSearchBtn"
            hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
            onPress={this.clearSearchText}>
            <Icon name="x" size={16} color={theme.muted} />
          </TouchableOpacity>
        ) : null}
      </View>
    );
  };

  getSelectedStateName = () => {
    if (!this.state.selectedState) {
      return 'Select a state';
    }
    const match = this.state.statesList.find(
      ({key}) => key === this.state.selectedState,
    );
    return match ? match.name : 'Select a state';
  };

  renderStateDropdown = () => {
    return (
      <>
        {Platform.OS === 'ios'
          ? this.renderStateIOSDropdown()
          : this.renderStateAndroidDropdown()}
      </>
    );
  };

  renderStateIOSDropdown = () => {
    const theme = this.getSearchTheme();
    return (
      <TouchableOpacity
        testID="btnStateSelect"
        style={[this.styles.textInput, this.styles.selector]}
        onPress={this.showStateClicked}>
        <Text style={[this.styles.txt, this.styles.selectorText]}>
          {this.getSelectedStateName()}
        </Text>
        <Icon
          name="chevron-down"
          size={16}
          color={theme.muted}
          style={this.styles.selectorChevron}
        />
      </TouchableOpacity>
    );
  };

  renderStateAndroidDropdown = () => {
    const theme = this.getSearchTheme();
    return (
      <View
        style={[
          this.styles.textInput,
          this.styles.selector,
          {
            paddingHorizontal: 0,
          },
        ]}>
        <Picker
          enabled={!this.state.selectRange}
          testID="statePicker"
          style={[this.styles.textInput, this.styles.selector]}
          itemStyle={[this.styles.txt]}
          selectedValue={this.state.selectedState}
          onValueChange={selectedState => this.onSelectState(selectedState)}>
          <Picker.Item label={'Select a state'} value={''} />
          {this.state.statesList.map(
            ({key, name}: {key: string; name: string}) => (
              <Picker.Item key={key} label={name} value={key} />
            ),
          )}
        </Picker>
        <Icon
          name="chevron-down"
          size={16}
          color={theme.muted}
          style={this.styles.selectorChevron}
        />
      </View>
    );
  };

  renderCityDropdown = () => {
    return (
      <>
        {Platform.OS === 'ios'
          ? this.renderCityIOSDropdown()
          : this.renderCityAndroidDropdown()}
      </>
    );
  };

  renderCityIOSDropdown = () => {
    const theme = this.getSearchTheme();
    return (
      <TouchableOpacity
        testID="btnCitySelect"
        style={[
          this.styles.textInput,
          this.styles.selector,
          {opacity: this.dynamicOpacity(this.state.selectedState)},
        ]}
        onPress={this.showCityClicked}
        disabled={this.state.selectedState === ''}>
        <Text style={[this.styles.txt, this.styles.selectorText]}>
          {this.state.selectedCity || 'Select a city'}
        </Text>
        <Icon
          name="chevron-down"
          size={16}
          color={theme.muted}
          style={this.styles.selectorChevron}
        />
      </TouchableOpacity>
    );
  };

  renderCityAndroidDropdown = () => {
    const theme = this.getSearchTheme();
    return (
      <View
        style={[
          this.styles.textInput,
          this.styles.selector,
          {
            paddingHorizontal: 0,
            opacity: this.dynamicOpacity(this.state.selectedState),
          },
        ]}>
        <Picker
          testID="cityPicker"
          style={[this.styles.textInput, this.styles.selector]}
          itemStyle={[this.styles.txt]}
          selectedValue={this.state.selectedCity}
          onValueChange={selectedCity =>
            this.handleSelectedCityAndroid(selectedCity)
          }
          enabled={this.state.selectedState !== '' && !this.state.selectRange}>
          <Picker.Item label={'Select a city'} value={''} />
          {this.state.citiesList.map((name: string) => (
            <Picker.Item key={name} label={name} value={name} />
          ))}
        </Picker>
        <Icon
          name="chevron-down"
          size={16}
          color={theme.muted}
          style={this.styles.selectorChevron}
        />
      </View>
    );
  };

  renderShowsNearMe = () => {
    return (
      <View style={this.styles.hiddenSearchControl}>
        <TouchableOpacity
          testID="showsNearMe"
          style={this.styles.modeCardHeader}
          onPress={this.handleShowsNearMe}>
          <Text testID="showsNearMeTxt">{'Shows near me'}</Text>
        </TouchableOpacity>
        {this.renderMilesRange()}
      </View>
    );
  };

  getNearMeShowTitle = (item: any) => {
    const attrs = item?.attributes || item || {};
    const lineUps = Array.isArray(attrs.line_ups) ? attrs.line_ups : [];
    const firstAct = lineUps.find(
      (name: any) => typeof name === 'string' && name.trim(),
    );
    if (firstAct) {
      return firstAct.trim();
    }
    if (typeof attrs.band_name === 'string' && attrs.band_name.trim()) {
      return attrs.band_name.trim();
    }
    if (typeof attrs.event_title === 'string' && attrs.event_title.trim()) {
      return attrs.event_title.trim();
    }
    return 'Show';
  };

  getNearMeShowVenue = (item: any) => {
    const attrs = item?.attributes || item || {};
    return (
      (typeof attrs.location === 'string' && attrs.location.trim()) ||
      (typeof attrs.city === 'string' && attrs.city.trim()) ||
      ''
    );
  };

  renderNearMeCard = ({item}: {item: any}) => {
    const imageUri = this.getNearMeShowImage(item);
    const title = this.getNearMeShowTitle(item);
    const venue = this.getNearMeShowVenue(item);
    const attrs = item?.attributes || item || {};
    const whenLabel = this.formatNearMeWhen(
      attrs.date_of_the_show,
      attrs.time,
    );
    const metaParts = [venue, whenLabel].filter(Boolean);
    const fadeId = `nearMeFade-${item?.id != null ? item.id : title}`;
    return (
      <TouchableOpacity
        testID="nearMeShowCard"
        activeOpacity={0.92}
        style={this.styles.nearMeCard}
        onPress={() => this.handleNearMeShowPress(item)}>
        {imageUri !== '' ? (
          <FastImage
            style={this.styles.nearMeCardImage}
            source={{uri: imageUri, priority: FastImage.priority.high}}
            resizeMode={FastImage.resizeMode.cover}
          />
        ) : (
          <View style={this.styles.nearMeCardPlaceholder}>
            <Icon name="image" size={32} color={this.getSearchTheme().muted} />
          </View>
        )}
        <View pointerEvents="none" style={this.styles.nearMeCardFade}>
          <SvgImage width={NEAR_ME_CARD_WIDTH} height={NEAR_ME_FADE_HEIGHT}>
            <Defs>
              <LinearGradient id={fadeId} x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#08080f" stopOpacity="0" />
                <Stop offset="0.45" stopColor="#08080f" stopOpacity="0.35" />
                <Stop offset="1" stopColor="#08080f" stopOpacity="0.88" />
              </LinearGradient>
            </Defs>
            <Rect
              x="0"
              y="0"
              width={NEAR_ME_CARD_WIDTH}
              height={NEAR_ME_FADE_HEIGHT}
              fill={`url(#${fadeId})`}
            />
          </SvgImage>
        </View>
        <View style={this.styles.nearMeCardText} pointerEvents="none">
          <Text style={this.styles.nearMeCardTitle} numberOfLines={2}>
            {title.toUpperCase()}
          </Text>
          {metaParts.length > 0 ? (
            <Text style={this.styles.nearMeCardMeta} numberOfLines={1}>
              {metaParts.join(' • ')}
            </Text>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };

  renderNearMeCarousel = () => {
    const theme = this.getSearchTheme();
    const shows = Array.isArray(this.state.nearMeShows)
      ? this.state.nearMeShows
      : [];
    if (this.state.loadingNearMeShows && shows.length === 0) {
      return (
        <View style={this.styles.nearMeCarouselLoading}>
          <ActivityIndicator size="small" color={theme.primary} />
        </View>
      );
    }
    if (shows.length === 0) {
      return null;
    }
    return (
      <FlatList
        testID="nearMeShowsList"
        horizontal
        data={shows}
        keyExtractor={(item, index) =>
          item?.id != null ? String(item.id) : `near-me-${index}`
        }
        renderItem={this.renderNearMeCard}
        showsHorizontalScrollIndicator={false}
        nestedScrollEnabled
        contentContainerStyle={this.styles.nearMeCarouselContent}
        style={this.styles.nearMeCarousel}
      />
    );
  };

  renderMilesRange = () => {
    return (
      <>
        <View style={this.styles.rangeContainer}>
          {this.renderRange('0')}
          <RangeSlider
            testID="milesRangeSlider"
            style={{width: '72%'}}
            min={0}
            max={100}
            step={1}
            disableRange
            disabled={!this.state.selectRange}
            onValueChanged={this.handleMilesRange}
            renderThumb={this.renderThumb}
            renderRail={() => <View style={this.styles.rail} />}
            renderRailSelected={this.renderRailSelected}
            minRange={0}
            high={100}
            low={Number(this.state.maxMiles) || 100}
          />
          {this.renderRange('100')}
        </View>
        {this.state.selectRange ? (
          <Text style={this.styles.rangeValueText}>
            {this.state.maxMiles} miles
          </Text>
        ) : null}
      </>
    );
  };

  renderRange = (miles: string) => {
    const theme = this.getSearchTheme();
    const active = this.state.selectRange;
    return (
      <View style={this.styles.milesView}>
        <Text
          style={{
            color: active ? theme.foreground : theme.muted,
            fontSize: 14,
            fontWeight: '700',
          }}>
          {miles}
        </Text>
        <Text
          style={{
            color: active ? theme.foreground : theme.muted,
            fontSize: 12,
            fontWeight: '400',
          }}>
          Miles
        </Text>
      </View>
    );
  };

  renderThumb = () => {
    const theme = this.getSearchTheme();
    return (
      <View
        style={[
          this.styles.thumb,
          {
            borderColor: '#FFF',
            backgroundColor: this.state.selectRange ? theme.primary : '#FFF',
          },
        ]}
      />
    );
  };

  renderRailSelected = () => {
    const theme = this.getSearchTheme();
    return (
      <View
        style={[
          this.styles.railSelected,
          {
            backgroundColor: !this.state.selectRange
              ? theme.muted
              : theme.primary,
          },
        ]}
      />
    );
  };

  renderHiddenSearchTestControls = () => {
    return (
      <>
        {this.renderShowsNearMe()}
        <View style={this.styles.hiddenSearchControl}>
          <TouchableOpacity
            testID="showsByState"
            style={this.styles.showsByState}
            onPress={this.handleShowsByState}>
            <Text testID="showsByStateTxt">{'Search by State'}</Text>
          </TouchableOpacity>
          <Text testID="stateTxt">State</Text>
          {this.renderStateDropdown()}
          <TouchableOpacity
            testID="btnWholeState"
            onPress={this.handleWholeStateSelection}>
            <Text>Whole State</Text>
          </TouchableOpacity>
          {this.renderCityDropdown()}
        </View>
      </>
    );
  };

  renderShowsByState = () => {
    return (
      <View>
        <View style={this.styles.hiddenSearchControl}>
          <TouchableOpacity
            testID="showsByState"
            style={this.styles.showsByState}
            onPress={this.handleShowsByState}>
            <Text testID="showsByStateTxt">{'Search by State'}</Text>
          </TouchableOpacity>
          <Text testID="stateTxt">State</Text>
          {this.renderStateDropdown()}
          <TouchableOpacity
            testID="btnWholeState"
            onPress={this.handleWholeStateSelection}>
            <Text>Whole State</Text>
          </TouchableOpacity>
          {this.renderCityDropdown()}
        </View>
        {this.state.selectedState
          ? this.renderCityBoxes()
          : this.renderStateBoxes()}
      </View>
    );
  };

  getSortedStatesList = () => {
    const states = Array.isArray(this.state.statesList)
      ? [...this.state.statesList]
      : [];
    return states.sort((left, right) =>
      String(left.key || '').localeCompare(String(right.key || '')),
    );
  };

  renderStateBoxes = () => {
    const states = this.getSortedStatesList();
    if (states.length === 0) {
      return (
        <View style={this.styles.stateGridLoading}>
          <ActivityIndicator size="small" color={this.getSearchTheme().primary} />
        </View>
      );
    }
    return (
      <View style={this.styles.stateGrid}>
        {states.map((state, index) => {
          const abbreviation = String(state.key || '').toUpperCase();
          const isRowEnd = (index + 1) % STATE_GRID_COLUMNS === 0;
          return (
            <TouchableOpacity
              key={state.key}
              testID={`stateBox-${state.key}`}
              activeOpacity={0.8}
              style={[
                this.styles.stateBox,
                isRowEnd ? {marginRight: 0} : null,
              ]}
              onPress={() => this.handleStateBoxPress(state.key)}>
              <Text style={this.styles.stateBoxText}>{abbreviation}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  renderCityBoxes = () => {
    const theme = this.getSearchTheme();
    const cities = Array.isArray(this.state.citiesList)
      ? this.state.citiesList
      : [];
    const selectedStateName = this.getSelectedStateName();
    return (
      <View>
        <View style={this.styles.cityGridHeader}>
          <TouchableOpacity
            testID="backToStatesBtn"
            activeOpacity={0.8}
            style={this.styles.cityGridBackBtn}
            onPress={this.handleBackToStateGrid}>
            <Icon name="chevron-left" size={18} color={theme.foreground} />
            <Text style={this.styles.cityGridBackText}>States</Text>
          </TouchableOpacity>
          <Text style={this.styles.cityGridTitle} numberOfLines={1}>
            {selectedStateName}
          </Text>
        </View>
        <View style={this.styles.cityGrid}>
          <TouchableOpacity
            testID="wholeStateBox"
            activeOpacity={0.8}
            style={[this.styles.cityBox, {marginRight: STATE_GRID_GAP}]}
            onPress={this.handleWholeStateBoxPress}>
            <Text style={this.styles.cityBoxText}>ALL</Text>
          </TouchableOpacity>
          {cities.length === 0 ? (
            <View style={this.styles.cityGridLoading}>
              <ActivityIndicator size="small" color={theme.primary} />
            </View>
          ) : (
            cities.map((cityName, index) => {
              const isRowEnd = (index + 2) % CITY_GRID_COLUMNS === 0;
              return (
                <TouchableOpacity
                  key={cityName}
                  testID={`cityBox-${cityName}`}
                  activeOpacity={0.8}
                  style={[
                    this.styles.cityBox,
                    isRowEnd ? {marginRight: 0} : null,
                  ]}
                  onPress={() => this.handleCityBoxPress(cityName)}>
                  <Text style={this.styles.cityBoxText} numberOfLines={2}>
                    {cityName}
                  </Text>
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </View>
    );
  };

  renderStateModal = () => {
    const theme = this.getSearchTheme();
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.stateClicked}>
        <TouchableWithoutFeedback
          testID="hideStateModal"
          onPress={this.hideModalState}>
          <View style={this.styles.centeredView}>
            <TouchableWithoutFeedback>
              <View
                style={[
                  this.styles.modalView,
                  {borderTopStartRadius: 20, padding: 15},
                ]}>
                <Picker
                  testID="statePickerModal"
                  selectedValue={this.state.selectedState}
                  itemStyle={{color: theme.foreground}}
                  onValueChange={selectedState => {
                    this.hideStateClicked(selectedState);
                  }}>
                  {this.state.statesList.map(
                    ({key, name}: {key: string; name: string}) => (
                      <Picker.Item key={key} label={name} value={key} />
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

  renderCityModal = () => {
    const theme = this.getSearchTheme();
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.cityClicked}>
        <TouchableWithoutFeedback
          testID="hideCityModal"
          onPress={this.hideModalCity}>
          <View style={this.styles.centeredView}>
            <TouchableWithoutFeedback>
              <View
                style={[
                  this.styles.modalView,
                  {borderTopStartRadius: 20, padding: 15},
                ]}>
                <Picker
                  testID="cityPickerModal"
                  selectedValue={this.state.selectedCity}
                  itemStyle={{color: theme.foreground}}
                  onValueChange={selectedCity => {
                    this.hideCityClicked(selectedCity);
                  }}>
                  {this.state.citiesList.map((name: string) => (
                    <Picker.Item key={name} label={name} value={name} />
                  ))}
                </Picker>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };

  renderLoginSignupPopup = () => {
    const theme = this.getSearchTheme();
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.loginPopup}>
        <View style={[this.styles.centeredView, {backgroundColor: '#08080fcc'}]}>
          <View style={[this.styles.modalView]}>
            <TouchableWithoutFeedback
              testID="popupCloseButton"
              onPress={this.handleLoginPopup}>
              <SvgImage
                style={this.styles.svgImage}
                width={14}
                height={14}
                viewBox="0 0 14 14"
                fill={theme.foreground}>
                <Path
                  d="M13.3.71a.996.996 0 00-1.41 0L7 5.59 2.11.7A.996.996 0 10.7 2.11L5.59 7 .7 11.89a.996.996 0 101.41 1.41L7 8.41l4.89 4.89a.996.996 0 101.41-1.41L8.41 7l4.89-4.89c.38-.38.38-1.02 0-1.4z"
                  fill={theme.foreground}
                />
              </SvgImage>
            </TouchableWithoutFeedback>
            <Text style={this.styles.welcomeTo}>{'Welcome to'}</Text>
            <Text style={this.styles.localShows}>{'Local Shows'}</Text>
            <Text style={this.styles.loginFirst}>
              {'You have to Log in first to access the events.'}
            </Text>
            <TouchableOpacity
              testID="createAccountBtn"
              onPress={() => {
                this.moveToLoginSignupScreen('signup');
              }}>
              <Text style={this.styles.createAccount}>{'Create new account'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              testID="loginBtn"
              style={this.styles.loginBtn}
              onPress={() => {
                this.moveToLoginSignupScreen('login');
              }}>
              <Text style={this.styles.loginTxt}>{'Log in'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  isFilterActive = (filter: string) => {
    if (filter === 'Shows') {
      return (
        this.state.SelectedTab === 'Shows' && this.state.searchFilter === 'Shows'
      );
    }
    if (filter === 'People') {
      return (
        this.state.SelectedTab === 'People' &&
        this.state.searchFilter === 'People'
      );
    }
    return this.state.searchFilter === filter;
  };

  renderFilterChip = (
    label: string,
    testID: string,
    onPress: () => void,
  ) => {
    const active = this.isFilterActive(label);
    return (
      <TouchableOpacity
        testID={testID}
        activeOpacity={0.8}
        onPress={onPress}
        style={[
          this.styles.filterChip,
          active && this.styles.filterChipActive,
        ]}>
        <Text
          style={[
            this.styles.filterChipText,
            active && this.styles.filterChipTextActive,
          ]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  renderTopTabView = () => {
    return (
      <View style={this.styles.TopTabView}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={this.styles.filterChipsContent}>
          {this.renderFilterChip('All', 'AllTabBtn', () =>
            this.handleSearchFilter('All'),
          )}
          {this.renderFilterChip('Bands', 'BandsTabBtn', () =>
            this.handleSearchFilter('Bands'),
          )}
          {this.renderFilterChip('Venues', 'VenuesTabBtn', () =>
            this.handleSearchFilter('Venues'),
          )}
          {this.renderFilterChip('Shows', 'ShowTabBtn', () => {
            this.setSelectedTab('Shows');
          })}
          {this.renderFilterChip('People', 'PeopleTabBtn', () => {
            this.setSelectedTab('People');
          })}
        </ScrollView>
      </View>
    );
  };

  renderGenreCard = (item: any, index: number) => {
    const dotColor = GENRE_DOT_COLORS[index % GENRE_DOT_COLORS.length];
    return (
      <TouchableOpacity
        key={item.id || `${item.name}-${index}`}
        testID="genreCard"
        activeOpacity={0.9}
        style={[
          this.styles.genreCard,
          index % 2 === 0 ? {marginRight: GENRE_GAP} : null,
        ]}
        onPress={() => this.handleGenrePress(item.name)}>
        {item.image ? (
          <FastImage
            style={this.styles.genreImage}
            source={{uri: item.image, priority: FastImage.priority.high}}
            resizeMode={FastImage.resizeMode.cover}
          />
        ) : (
          <View
            style={[
              this.styles.genreImagePlaceholder,
              {backgroundColor: `${dotColor}22`},
            ]}
          />
        )}
        <View style={this.styles.genreOverlay} />
        <View style={[this.styles.genreDot, {backgroundColor: dotColor}]} />
        <Text style={this.styles.genreName} numberOfLines={2}>
          {String(item.name || '').toUpperCase()}
        </Text>
      </TouchableOpacity>
    );
  };

  renderBrowseByGenre = () => {
    const genres = Array.isArray(this.state.genreList)
      ? this.state.genreList
      : [];
    if (genres.length === 0) {
      return null;
    }
    const visibleGenres = genres.slice(0, 4);
    const hasMoreGenres = genres.length > 4;
    return (
      <View style={this.styles.sectionBlock}>
        <Text style={this.styles.sectionLabel}>BROWSE BY GENRE</Text>
        <View style={this.styles.genreGrid}>
          {visibleGenres.map((item: any, index: number) =>
            this.renderGenreCard(item, index),
          )}
        </View>
        {hasMoreGenres ? (
          <TouchableOpacity
            testID="showAllGenresBtn"
            activeOpacity={0.8}
            style={this.styles.showAllButton}
            onPress={this.handleShowAllGenres}>
            <Text style={this.styles.showAllButtonText}>Show all</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  };

  renderUserSearchView = () => {
    const theme = this.getSearchTheme();
    if (this.state.LoadingUsers) {
      return (
        <View
          style={{
            height: Dimensions.get('window').height * 0.5,
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <ActivityIndicator size={'large'} color={theme.primary} />
        </View>
      );
    }
    if (this.state.NoUserFound) {
      return (
        <View
          style={{
            height: Dimensions.get('window').height * 0.5,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            source={require('../../../mobile/assets/images/No_Users.png')}
            style={{width: 100, height: 100}}
            resizeMode="contain"
          />
          <Text
            style={{
              color: theme.muted,
              marginTop: 16,
            }}>
            No Results Found
          </Text>
        </View>
      );
    }
    const displayedUsers = this.getDisplayedUserList();
    if (this.state.UserList.length <= 0 || displayedUsers.length <= 0) {
      if ((this.state.searchText || '').trim()) {
        return (
          <View
            style={{
              height: Dimensions.get('window').height * 0.4,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{color: theme.muted, marginTop: 16}}>
              No Results Found
            </Text>
          </View>
        );
      }
      return (
        <View
          style={{
            height: Dimensions.get('window').height * 0.5,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            source={require('../../../mobile/assets/images/Users.png')}
            style={{width: 174}}
            resizeMode="contain"
          />
        </View>
      );
    }
    return (
      <View style={this.styles.sectionBlock}>
        <Text style={this.styles.sectionLabel}>
          {this.getPeopleSectionTitle()}
        </Text>
        <FlatList
          testID="SearchUserList"
          scrollEnabled={false}
          data={displayedUsers}
          renderItem={
            this.state.searchFilter === 'Venues'
              ? this.renderVenueResultItem
              : this.renderUserItem
          }
          keyExtractor={(item: any) => String(item.id)}
        />
      </View>
    );
  };

  renderShowSearchResultsView = () => {
    const theme = this.getSearchTheme();
    const shows = Array.isArray(this.state.catalogShowResults)
      ? this.state.catalogShowResults
      : [];
    if (this.state.loadingCatalogShows && shows.length === 0) {
      return (
        <View>
          {this.renderHiddenSearchTestControls()}
          <View
            style={{
              height: Dimensions.get('window').height * 0.4,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <ActivityIndicator size={'large'} color={theme.primary} />
          </View>
        </View>
      );
    }
    if (shows.length === 0) {
      return (
        <View>
          {this.renderHiddenSearchTestControls()}
          <View
            style={{
              height: Dimensions.get('window').height * 0.35,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{color: theme.muted}}>No Results Found</Text>
          </View>
        </View>
      );
    }
    return (
      <View style={this.styles.sectionBlock}>
        {this.renderHiddenSearchTestControls()}
        <Text style={this.styles.sectionLabel}>SHOWS</Text>
        <FlatList
          testID="SearchShowList"
          scrollEnabled={false}
          data={shows}
          keyExtractor={(item: any, index: number) =>
            String(item?.id ?? item?.attributes?.id ?? index)
          }
          renderItem={this.renderShowResultItem}
        />
      </View>
    );
  };

  renderShowResultItem = ({item}: {item: any}) => {
    const imageUri = this.getNearMeShowImage(item);
    const title = this.getNearMeShowTitle(item);
    const venue = this.getNearMeShowVenue(item);
    const attrs = item?.attributes || item || {};
    const whenLabel = this.formatNearMeWhen(
      attrs.date_of_the_show,
      attrs.time,
    );
    const subtitle = [venue, whenLabel].filter(Boolean).join(' · ');
    const price = this.getShowTicketPriceLabel(item);
    return (
      <TouchableOpacity
        testID="searchShowRow"
        activeOpacity={0.8}
        style={this.styles.userRow}
        onPress={() => this.handleNearMeShowPress(item)}>
        <View style={this.styles.userRowLeft}>
          <View style={this.styles.userAvatarWrap}>
            {imageUri ? (
              <FastImage
                source={{uri: imageUri, priority: FastImage.priority.high}}
                resizeMode={FastImage.resizeMode.cover}
                style={this.styles.userAvatar}
              />
            ) : (
              <View style={[this.styles.userAvatar, this.styles.showAvatarFallback]}>
                <Icon name="image" size={18} color={this.getSearchTheme().muted} />
              </View>
            )}
          </View>
          <View style={this.styles.userTextWrap}>
            <Text numberOfLines={1} style={this.styles.showResultTitle}>
              {title}
            </Text>
            {subtitle ? (
              <Text numberOfLines={1} style={this.styles.userMeta}>
                {subtitle}
              </Text>
            ) : null}
          </View>
        </View>
        {price ? (
          <Text style={this.styles.showResultPrice}>{price}</Text>
        ) : null}
      </TouchableOpacity>
    );
  };

  renderShowSearchView = () => {
    return (
      <View>
        {this.renderBrowseByGenre()}
        <View style={this.styles.sectionBlock}>
          <Text style={this.styles.sectionLabel}>SHOWS NEAR ME</Text>
          {this.renderShowsNearMe()}
          {this.renderNearMeCarousel()}
        </View>
        <View style={this.styles.sectionBlock}>
          <Text style={this.styles.sectionLabel}>SEARCH BY STATE</Text>
          {this.renderShowsByState()}
        </View>
      </View>
    );
  };

  renderSearchTabs = (tab: string) => {
    if (
      this.hasSearchQuery() &&
      (this.isPeopleSearchTab() || tab === 'People')
    ) {
      return this.renderUserSearchView();
    }
    if (this.hasSearchQuery() && this.isShowsSearchTab()) {
      return this.renderShowSearchResultsView();
    }
    if (this.hasSearchQuery() && this.isAllSearchTab()) {
      return this.renderAllSearchResultsView();
    }
    return this.renderShowSearchView();
  };

  renderAllSearchResultsView = () => {
    const theme = this.getSearchTheme();
    const bands = this.getUsersForGroup('bands');
    const venues = this.getUsersForGroup('venues');
    const people = this.getUsersForGroup('people');
    const shows = Array.isArray(this.state.catalogShowResults)
      ? this.state.catalogShowResults
      : [];
    const isLoading =
      (this.state.LoadingUsers || this.state.loadingCatalogShows) &&
      bands.length === 0 &&
      venues.length === 0 &&
      people.length === 0 &&
      shows.length === 0;

    if (isLoading) {
      return (
        <View>
          {this.renderHiddenSearchTestControls()}
          <View
            style={{
              height: Dimensions.get('window').height * 0.4,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <ActivityIndicator size={'large'} color={theme.primary} />
          </View>
        </View>
      );
    }

    const hasResults =
      bands.length > 0 ||
      venues.length > 0 ||
      shows.length > 0 ||
      people.length > 0;
    if (!hasResults) {
      return (
        <View>
          {this.renderHiddenSearchTestControls()}
          <View
            style={{
              height: Dimensions.get('window').height * 0.35,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{color: theme.muted}}>No Results Found</Text>
          </View>
        </View>
      );
    }

    return (
      <View>
        {this.renderHiddenSearchTestControls()}
        {this.renderAllResultSection(
          'BANDS & ARTISTS',
          bands,
          this.renderUserItem,
        )}
        {this.renderAllResultSection(
          'VENUES',
          venues,
          this.renderVenueResultItem,
        )}
        {this.renderAllResultSection(
          'SHOWS',
          shows,
          this.renderShowResultItem,
        )}
        {this.renderAllResultSection(
          'PEOPLE',
          people,
          this.renderPeopleResultItem,
        )}
      </View>
    );
  };

  renderAllResultSection = (
    title: string,
    data: any[],
    renderItem: ({item}: {item: any}) => any,
  ) => {
    if (!Array.isArray(data) || data.length === 0) {
      return null;
    }
    return (
      <View style={this.styles.sectionBlock}>
        <Text style={this.styles.sectionLabel}>{title}</Text>
        <FlatList
          scrollEnabled={false}
          data={data}
          keyExtractor={(item: any, index: number) =>
            String(item?.id ?? item?.attributes?.id ?? `${title}-${index}`)
          }
          renderItem={renderItem}
        />
      </View>
    );
  };

  renderSearchAvatar = (uri?: string) => {
    const theme = this.getSearchTheme();
    if (uri) {
      return (
        <Image
          source={{uri}}
          resizeMode="cover"
          style={this.styles.userAvatar}
        />
      );
    }
    return (
      <View style={[this.styles.userAvatar, this.styles.showAvatarFallback]}>
        <Icon name="user" size={20} color={theme.muted} />
      </View>
    );
  };

  renderVenueThumb = (uri?: string) => {
    const theme = this.getSearchTheme();
    if (uri) {
      return (
        <FastImage
          source={{uri, priority: FastImage.priority.high}}
          resizeMode={FastImage.resizeMode.cover}
          style={this.styles.venueThumb}
        />
      );
    }
    return (
      <View style={[this.styles.venueThumb, this.styles.showAvatarFallback]}>
        <Icon name="map-pin" size={18} color={theme.muted} />
      </View>
    );
  };

  renderVenueResultItem = ({item}: {item: any}) => {
    const theme = this.getSearchTheme();
    const imageUri = this.getVenueImageUrl(item);
    const subtitle = this.getVenueSubtitle(item);
    return (
      <TouchableOpacity
        testID="searchVenueRow"
        activeOpacity={0.8}
        style={this.styles.userRow}
        onPress={() => {
          this.renderProfileUserSearch(
            item.id,
            item.attributes?.account_type,
          );
        }}>
        <View style={this.styles.userRowLeft}>
          <View style={this.styles.venueThumbWrap}>
            {this.renderVenueThumb(imageUri)}
          </View>
          <View style={this.styles.userTextWrap}>
            <Text numberOfLines={1} style={this.styles.userName}>
              {this.getVenueDisplayName(item)}
            </Text>
            {subtitle ? (
              <Text numberOfLines={1} style={this.styles.userMeta}>
                {subtitle}
              </Text>
            ) : null}
          </View>
        </View>
        <TouchableOpacity
          testID="venueMapPin"
          hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
          onPress={() => this.openGoogleMaps(item.attributes || item || {})}>
          <Icon name="map-pin" size={18} color={theme.muted} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  renderPeopleResultItem = ({item}: {item: any}) => {
    const theme = this.getSearchTheme();
    const avatarUri = this.getUserAvatarUrl(item);
    const location = this.getPeopleLocationLabel(item);
    return (
      <View style={this.styles.userRow}>
        <View style={this.styles.userRowLeft}>
          <TouchableOpacity
            testID="userProfileImageBTN"
            activeOpacity={0.7}
            onPress={() => {
              this.renderProfileUserSearch(
                item.id,
                item.attributes?.account_type,
              );
            }}
            style={this.styles.userAvatarWrap}>
            {this.renderSearchAvatar(avatarUri)}
          </TouchableOpacity>
          <View style={this.styles.userTextWrap}>
            <Text numberOfLines={1} style={this.styles.userName}>
              {this.getName(
                item.attributes?.first_name,
                item.attributes?.last_name,
              )}
            </Text>
            {location ? (
              <View style={this.styles.peopleMetaRow}>
                <Icon name="map-pin" size={11} color={theme.muted} />
                <Text numberOfLines={1} style={this.styles.peopleMetaText}>
                  {location}
                </Text>
              </View>
            ) : null}
          </View>
        </View>
        <TouchableOpacity
          testID="followAndUnfollowId"
          onPress={() =>
            this.followAndUnfollowUserAPICall(
              item.id,
              item.attributes?.is_following,
            )
          }
          style={this.styles.followButton}>
          <Text style={this.styles.followButtonText}>
            {item.attributes?.is_following ? 'Unfollow' : 'Follow'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  renderUserItem = ({item}: {item: any}) => {
    const avatarUri = this.getUserAvatarUrl(item);
    const subtitle = this.getUserSubtitle(item);
    return (
      <View key={item.id}>
        <View style={this.styles.userRow}>
          <View style={this.styles.userRowLeft}>
            <TouchableOpacity
              testID="userProfileImageBTN"
              activeOpacity={0.7}
              onPress={() => {
                this.renderProfileUserSearch(
                  item.id,
                  item.attributes?.account_type,
                );
              }}
              style={this.styles.userAvatarWrap}>
              {this.renderSearchAvatar(avatarUri)}
            </TouchableOpacity>
            <View style={this.styles.userTextWrap}>
              <Text numberOfLines={1} style={this.styles.userName}>
                {this.getName(
                  item.attributes?.first_name,
                  item.attributes?.last_name,
                )}
              </Text>
              {subtitle ? (
                <Text numberOfLines={1} style={this.styles.userMeta}>
                  {subtitle}
                </Text>
              ) : null}
            </View>
          </View>
          <TouchableOpacity
            testID="followAndUnfollowId"
            onPress={() =>
              this.followAndUnfollowUserAPICall(
                item.id,
                item.attributes?.is_following,
              )
            }
            style={this.styles.followButton}>
            <Text style={this.styles.followButtonText}>
              {item.attributes?.is_following ? 'Unfollow' : 'Follow'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  renderSearchView = () => {
    return (
      <View style={this.styles.contentContainer}>
        {this.renderSearchInput()}
        {this.renderTopTabView()}
        {this.renderSearchTabs(this.state.SelectedTab)}
      </View>
    );
  };

  // Customizable Area End

  render() {
    // Customizable Area Start
    const theme = this.getSearchTheme();
    return (
      <SafeAreaView style={this.styles.parentContainer}>
        <StatusBar
          barStyle={this.state.isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={theme.background}
        />
        <ScrollView
          keyboardShouldPersistTaps="always"
          style={this.styles.container}
          contentContainerStyle={this.styles.scrollContent}>
          {/* Customizable Area Start */}
          <TouchableWithoutFeedback
            testID={'hideKeyboard'}
            onPress={() => {
              this.hideKeyboard();
            }}>
            <>
              {this.renderHeader()}
              {this.renderSearchView()}
              {this.renderStateModal()}
              {this.renderCityModal()}
            </>
            {/* Customizable End Start */}
          </TouchableWithoutFeedback>
          {this.renderLoginSignupPopup()}
        </ScrollView>
        <View
          pointerEvents="none"
          style={this.styles.hiddenSearchControl}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants">
          <TouchableOpacity
            testID="btnSearch"
            disabled={
              this.state.SelectedTab === 'Shows'
                ? false
                : this.state.searchText === ''
            }
            style={this.styles.searchButton}
            onPress={this.handleEventSearchAPICall}>
            <Text style={[this.styles.txt, this.styles.textSearchButton]}>
              Search
            </Text>
          </TouchableOpacity>
        </View>
        {this.state.isLoading && (
          <View style={this.styles.loadingContainer}>
            <ActivityIndicator size={'large'} color={theme.primary} />
          </View>
        )}
      </SafeAreaView>
      //Merge Engine End DefaultContainer
    );
    // Customizable Area End
  }
}

// Customizable Area Start
const createSearchStyles = (theme: SearchTheme) =>
  StyleSheet.create({
    parentContainer: {
      flex: 1,
      backgroundColor: theme.background,
    },
    container: {
      flex: 1,
      paddingHorizontal: FEED_GUTTER,
      paddingTop: 5,
    },
    scrollContent: {
      paddingBottom: 24,
    },
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingBottom: 12,
      paddingTop: 4,
    },
    headerTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      paddingRight: 8,
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
      marginRight: 10,
    },
    headerTitleTxt: {
      fontWeight: '900',
      fontSize: 28,
      letterSpacing: 0.8,
      color: theme.foreground,
      textTransform: 'uppercase',
    },
    txt: {
      fontFamily: 'OpenSans',
      alignSelf: 'flex-start',
      color: theme.foreground,
    },
    errorTxt: {
      color: '#F04438',
      fontSize: 13,
      paddingTop: 2,
    },
    iconsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    notificationIconContainer: {
      marginRight: 10,
    },
    notificationIcon: {
      resizeMode: 'contain',
      height: 22,
      width: 22,
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
    contentContainer: {},
    input: {
      flex: 1,
      height: 47,
      fontSize: 16,
      marginLeft: 10,
      color: theme.foreground,
    },
    inputPlaceholderSmaller: {
      fontSize: 14,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 16,
      paddingVertical: 2,
      paddingHorizontal: 14,
      marginTop: 4,
      marginBottom: 16,
      backgroundColor: theme.input,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border,
    },
    textInputLabel: {
      fontWeight: 'bold',
      marginBottom: 5,
      color: theme.foreground,
    },
    textInput: {
      width: '100%',
      paddingHorizontal: 10,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
      color: theme.foreground,
      height: 50,
      backgroundColor: theme.input,
    },
    selector: {
      height: 50,
      justifyContent: 'center',
      paddingHorizontal: 0,
    },
    selectorText: {
      marginHorizontal: 10,
      color: theme.foreground,
    },
    selectorChevron: {
      position: 'absolute',
      right: 14,
    },
    checkboxContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    checkbox: {
      height: 20,
      width: 20,
      borderWidth: 1,
      borderRadius: 5,
      borderColor: theme.muted,
      marginRight: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkboxSelected: {
      height: 12,
      width: 12,
      backgroundColor: theme.primary,
      borderRadius: 2.5,
    },
    searchButton: {
      backgroundColor: theme.primary,
      padding: 15,
      borderRadius: 14,
      marginTop: 8,
      marginHorizontal: 16,
      marginBottom: 8,
    },
    textSearchButton: {
      color: '#FFFFFF',
      fontWeight: '700',
      fontSize: 18,
      alignSelf: 'center',
    },
    centeredView: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: '#08080f99',
    },
    modalView: {
      height: '40%',
      justifyContent: 'space-between',
      backgroundColor: theme.card,
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
    rangeContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 20,
      marginBottom: 6,
    },
    milesView: {
      justifyContent: 'center',
      alignItems: 'center',
      minWidth: 40,
    },
    rangeValueText: {
      color: theme.primary,
      fontSize: 12,
      fontWeight: '700',
      textAlign: 'center',
      marginBottom: 4,
    },
    thumb: {
      width: 15 * 2,
      height: 15 * 2,
      borderRadius: 15,
      borderWidth: 2,
      borderColor: '#ffffff',
      backgroundColor: theme.primary,
      shadowColor: theme.primary,
      shadowOffset: {width: 0, height: 0},
      shadowOpacity: 0.4,
      shadowRadius: 8,
      elevation: 5,
    },
    rail: {
      flex: 1,
      height: 5,
      borderRadius: 2,
      backgroundColor: theme.border,
    },
    railSelected: {
      height: 5,
      backgroundColor: theme.primary,
      borderRadius: 2,
    },
    welcomeTo: {
      textAlign: 'center',
      fontSize: 20,
      lineHeight: 28,
      marginTop: 10,
      color: theme.muted,
    },
    localShows: {
      fontWeight: '700',
      fontSize: 28,
      lineHeight: 32,
      bottom: '5%',
      textAlign: 'center',
      color: theme.primary,
    },
    loginFirst: {
      textAlign: 'center',
      lineHeight: 24,
      marginBottom: '5%',
      fontWeight: '400',
      fontSize: 16,
      color: theme.foreground,
    },
    createAccount: {
      color: theme.primary,
      fontWeight: '700',
      lineHeight: 24,
      marginBottom: '4%',
      fontSize: 16,
      textAlign: 'center',
    },
    loginBtn: {
      backgroundColor: theme.primary,
      borderRadius: 8,
      height: 56,
      justifyContent: 'center',
    },
    loginTxt: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
      fontSize: 16,
    },
    svgImage: {
      position: 'absolute',
      top: 20,
      right: 20,
      width: 20,
      height: 20,
    },
    hamburgerIcon: {
      height: 18,
      width: 18,
      resizeMode: 'contain',
    },
    hiddenSearchControl: {
      position: 'absolute',
      width: 0,
      height: 0,
      overflow: 'hidden',
      opacity: 0,
    },
    showsNearMeView: {
      borderRadius: 16,
      padding: 14,
    },
    showsByStateView: {
      borderRadius: 16,
      padding: 14,
    },
    modeCardActive: {
      backgroundColor: theme.primarySoft,
      borderWidth: 1,
      borderColor: theme.primary,
    },
    modeCardInactive: {
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
    },
    modeCardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    showsByState: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    TopTabView: {
      width: '100%',
      marginBottom: 8,
      flexGrow: 0,
    },
    filterChipsContent: {
      paddingRight: 8,
      alignItems: 'center',
    },
    filterChip: {
      backgroundColor: theme.input,
      borderWidth: 1,
      borderColor: 'transparent',
      borderRadius: 999,
      paddingHorizontal: 16,
      paddingVertical: 8,
      marginRight: 8,
    },
    filterChipActive: {
      backgroundColor: theme.primarySoft,
      borderColor: theme.primary,
    },
    filterChipText: {
      color: theme.foreground,
      fontSize: 13,
      fontWeight: '600',
    },
    filterChipTextActive: {
      color: theme.primary,
      fontWeight: '700',
    },
    sectionBlock: {
      marginTop: 18,
    },
    sectionLabel: {
      color: theme.muted,
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 1.4,
      textTransform: 'uppercase',
      marginBottom: 12,
    },
    stateGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    stateGridLoading: {
      minHeight: 80,
      alignItems: 'center',
      justifyContent: 'center',
    },
    stateBox: {
      width: STATE_BOX_WIDTH,
      height: 44,
      marginRight: STATE_GRID_GAP,
      marginBottom: STATE_GRID_GAP,
      borderRadius: 10,
      backgroundColor: theme.input,
      borderWidth: 1,
      borderColor: theme.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    stateBoxText: {
      color: theme.muted,
      fontSize: 13,
      fontWeight: '700',
      letterSpacing: 0.4,
    },
    cityGridHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    cityGridBackBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 10,
    },
    cityGridBackText: {
      color: theme.foreground,
      fontSize: 13,
      fontWeight: '600',
    },
    cityGridTitle: {
      flex: 1,
      color: theme.muted,
      fontSize: 13,
      fontWeight: '700',
      letterSpacing: 0.6,
      textTransform: 'uppercase',
    },
    cityGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    cityGridLoading: {
      width: CITY_BOX_WIDTH,
      height: 44,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cityBox: {
      width: CITY_BOX_WIDTH,
      minHeight: 44,
      paddingHorizontal: 8,
      paddingVertical: 10,
      marginRight: STATE_GRID_GAP,
      marginBottom: STATE_GRID_GAP,
      borderRadius: 10,
      backgroundColor: theme.input,
      borderWidth: 1,
      borderColor: theme.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cityBoxText: {
      color: theme.muted,
      fontSize: 12,
      fontWeight: '600',
      textAlign: 'center',
    },
    genreGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    showAllButton: {
      alignSelf: 'center',
      marginTop: 4,
      marginBottom: 4,
      paddingHorizontal: 22,
      paddingVertical: 10,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: theme.primary,
      backgroundColor: theme.primarySoft,
    },
    showAllButtonText: {
      color: theme.primary,
      fontSize: 13,
      fontWeight: '700',
      letterSpacing: 0.4,
      textTransform: 'uppercase',
    },
    genreCard: {
      width: GENRE_CARD_WIDTH,
      height: 110,
      borderRadius: 14,
      overflow: 'hidden',
      backgroundColor: theme.input,
      marginBottom: GENRE_GAP,
      justifyContent: 'flex-end',
    },
    genreImage: {
      ...StyleSheet.absoluteFillObject,
    },
    genreImagePlaceholder: {
      ...StyleSheet.absoluteFillObject,
    },
    genreOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(8, 8, 15, 0.28)',
    },
    genreDot: {
      position: 'absolute',
      top: 10,
      right: 10,
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    genreName: {
      color: '#FFFFFF',
      fontSize: 13,
      fontWeight: '800',
      letterSpacing: 0.4,
      paddingHorizontal: 12,
      paddingBottom: 12,
    },
    nearMeCarousel: {
      marginTop: 2,
      marginHorizontal: -FEED_GUTTER,
      height: NEAR_ME_CARD_HEIGHT,
    },
    nearMeCarouselContent: {
      paddingHorizontal: FEED_GUTTER,
    },
    nearMeCarouselLoading: {
      height: NEAR_ME_CARD_HEIGHT,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 2,
    },
    nearMeCard: {
      width: NEAR_ME_CARD_WIDTH,
      height: NEAR_ME_CARD_HEIGHT,
      borderRadius: 16,
      overflow: 'hidden',
      backgroundColor: theme.input,
      marginRight: NEAR_ME_CARD_GAP,
    },
    nearMeCardImage: {
      width: '100%',
      height: '100%',
    },
    nearMeCardPlaceholder: {
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.input,
    },
    nearMeCardFade: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height: NEAR_ME_FADE_HEIGHT,
    },
    nearMeCardText: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      paddingHorizontal: 10,
      paddingBottom: 10,
    },
    nearMeCardTitle: {
      color: '#FFFFFF',
      fontSize: 13,
      fontWeight: '800',
      letterSpacing: 0.3,
      lineHeight: 16,
    },
    nearMeCardMeta: {
      color: theme.accent,
      fontSize: 10,
      fontWeight: '500',
      marginTop: 3,
      letterSpacing: 0.2,
      fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    },
    userRow: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 12,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.divider,
    },
    userRowLeft: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 12,
    },
    userAvatarWrap: {
      height: 44,
      width: 44,
      borderRadius: 99,
      overflow: 'hidden',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.input,
    },
    userAvatar: {
      height: 44,
      width: 44,
      borderRadius: 22,
      backgroundColor: theme.input,
    },
    venueThumbWrap: {
      height: 48,
      width: 48,
      borderRadius: 10,
      overflow: 'hidden',
      backgroundColor: theme.input,
    },
    venueThumb: {
      height: 48,
      width: 48,
      borderRadius: 10,
      backgroundColor: theme.input,
    },
    userTextWrap: {
      flex: 1,
      minWidth: 0,
      paddingLeft: 12,
    },
    userName: {
      color: theme.foreground,
      fontWeight: '700',
      fontSize: 15,
    },
    userMeta: {
      color: theme.muted,
      fontSize: 12,
      fontWeight: '500',
      marginTop: 3,
    },
    showResultTitle: {
      color: theme.foreground,
      fontWeight: '700',
      fontSize: 15,
      textTransform: 'uppercase',
    },
    showResultPrice: {
      color: theme.accent,
      fontWeight: '700',
      fontSize: 16,
      marginLeft: 8,
    },
    showAvatarFallback: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    peopleMetaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 3,
    },
    peopleMetaText: {
      color: theme.muted,
      fontSize: 12,
      fontWeight: '500',
      marginLeft: 4,
      flex: 1,
    },
    followButton: {
      backgroundColor: theme.primarySoft,
      paddingVertical: 8,
      paddingHorizontal: 18,
      borderRadius: 10,
    },
    followButtonText: {
      color: theme.primary,
      fontWeight: '700',
      fontSize: 13,
    },
    loadingContainer: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(8, 8, 15, 0.72)',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

const darkSearchStyles = createSearchStyles(redesignTheme);
const lightSearchStyles = createSearchStyles(lightTheme);
// Customizable Area End

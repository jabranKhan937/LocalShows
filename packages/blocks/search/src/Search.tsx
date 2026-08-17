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
import {leftArrow} from '../../events/src/assets';
import {colors} from '../../utilities/src/Colors';
import {searchIcon} from './assets';
import {Picker} from '@react-native-picker/picker';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import SvgImage, {Path} from 'react-native-svg';
import RangeSlider from 'rn-range-slider';
import {DrawerActions} from '@react-navigation/native';

// Customizable Area End

import SearchController, {Props} from './SearchController';

export default class Search extends SearchController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }

  // Customizable Area Start

  renderNotificationIcon = () => {
    return this.state.authToken ? (
      <TouchableOpacity
        testID="notificationIcon"
        style={styles.notificationIconContainer}
        onPress={this.handleNotificationNavigation}>
        <View style={styles.notificationWrapper}>
          <Image
            source={require('../../../mobile/assets/images/notifications.png')}
            style={styles.notificationIcon}
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
        <View style={styles.notificationBadge}>
          <Text style={styles.notificationBadgeText}>{displayCount}</Text>
        </View>
      );
    }

    return this.renderRedDot({condition: this.state.newNotification});
  };

  renderRedDot = ({condition}: {condition: boolean}) => {
    if (condition) {
      return <View style={styles.redDot} />;
    }

    return <></>;
  };
  renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <Text style={[styles.txt, styles.headerTitleTxt]}>Search</Text>
        <TouchableOpacity
          testID="navigationBackButton"
          style={styles.backArrowIconContainer}
          onPress={this.handleBackNavigation}>
          <Image source={leftArrow} style={styles.backArrowIcon} />
        </TouchableOpacity>

        <View style={styles.iconsContainer}>
          {this.renderNotificationIcon()}
          <TouchableOpacity
            testID="hamburger"
            onPress={() => {
              // Traverse up the navigation tree to find the drawer navigator
              let navigator = this.props.navigation;
              let drawerFound = false;

              // Keep going up through parent navigators until we find one with openDrawer
              while (navigator) {
                if (navigator.openDrawer) {
                  navigator.openDrawer();
                  drawerFound = true;
                  break;
                }
                navigator = navigator.getParent?.();
              }

              // If no drawer found, dispatch the action directly
              if (!drawerFound) {
                this.props.navigation.dispatch(DrawerActions.openDrawer());
              }
            }}>
            <Image
              style={styles.hamburgerIcon}
              source={require('../../../mobile/assets/images/Vector.png')}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  renderSearchInput = () => {
    const isShows = this.state.SelectedTab === 'Shows';
    return (
      <View style={styles.inputContainer}>
        <Image source={searchIcon} style={styles.searchIcon} />
        <TextInput
          testID="searchText"
          style={[
            styles.input,
            !this.state.searchText && styles.inputPlaceholderSmaller,
          ]}
          placeholderTextColor="#94A3B8"
          placeholder={
            isShows
              ? 'Search shows by name or line up'
              : 'Search venues, bands and people by name'
          }
          value={this.state.searchText}
          onChangeText={searchText => {
            this.handleSearchText(searchText);
          }}
        />
      </View>
    );
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
    return (
      <TouchableOpacity
        testID="btnStateSelect"
        style={[styles.textInput, styles.selector]}
        onPress={this.showStateClicked}>
        <Text style={[styles.txt, {marginHorizontal: 10}]}>
          {this.state.selectedState
            ? this.state.statesList.filter(
                ({key}) => key === this.state.selectedState,
              )[0].name
            : 'Select a state'}
        </Text>
        <Image
          source={leftArrow}
          style={[
            styles.downArrow,
            {backgroundColor: this.state.selectRange ? '#F1F5F9' : '#E0E7FF'},
          ]}
        />
      </TouchableOpacity>
    );
  };

  renderStateAndroidDropdown = () => {
    return (
      <View
        style={[
          styles.textInput,
          styles.selector,
          {
            paddingHorizontal: 0,
          },
        ]}>
        <Picker
          enabled={!this.state.selectRange}
          testID="statePicker"
          style={[styles.textInput, styles.selector]}
          itemStyle={[styles.txt]}
          selectedValue={this.state.selectedState}
          onValueChange={selectedState => this.onSelectState(selectedState)}>
          <Picker.Item label={'Select a state'} value={''} />
          {this.state.statesList.map(
            ({key, name}: {key: string; name: string}) => (
              <Picker.Item key={key} label={name} value={key} />
            ),
          )}
        </Picker>
        <Image
          source={leftArrow}
          style={[
            [
              styles.downArrow,
              {backgroundColor: this.state.selectRange ? '#F1F5F9' : '#E0E7FF'},
            ],
            {backgroundColor: this.state.selectRange ? '#F1F5F9' : '#E0E7FF'},
          ]}
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
    return (
      <TouchableOpacity
        testID="btnCitySelect"
        style={[
          styles.textInput,
          styles.selector,
          {opacity: this.dynamicOpacity(this.state.selectedState)},
        ]}
        onPress={this.showCityClicked}
        disabled={this.state.selectedState === ''}>
        <Text style={[styles.txt, {marginHorizontal: 10}]}>
          {this.state.selectedCity || 'Select a city'}
        </Text>
        <Image
          source={leftArrow}
          style={[
            styles.downArrow,
            {backgroundColor: this.state.selectRange ? '#F1F5F9' : '#E0E7FF'},
          ]}
        />
      </TouchableOpacity>
    );
  };

  renderCityAndroidDropdown = () => {
    return (
      <View
        style={[
          styles.textInput,
          styles.selector,
          {
            paddingHorizontal: 0,
            opacity: this.dynamicOpacity(this.state.selectedState),
          },
        ]}>
        <Picker
          testID="cityPicker"
          style={[styles.textInput, styles.selector]}
          itemStyle={[styles.txt]}
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
        <Image
          source={leftArrow}
          style={[
            styles.downArrow,
            {backgroundColor: this.state.selectRange ? '#F1F5F9' : '#E0E7FF'},
          ]}
        />
      </View>
    );
  };

  renderShowsNearMe = () => {
    return (
      <View
        style={[
          styles.showsNearMeView,
          {backgroundColor: this.state.selectRange ? '#E0E7FF' : '#F1F5F9'},
        ]}>
        <TouchableOpacity
          testID="showsNearMe"
          style={{flexDirection: 'row'}}
          onPress={this.handleShowsNearMe}>
          <EntypoIcon
            name={this.state.selectRange ? 'vinyl' : 'circle'}
            size={20}
            color={this.state.selectRange ? '#4949EE' : '#CBD5E1'}
          />
          <Text
            testID="showsNearMeTxt"
            style={[styles.txt, styles.textInputLabel, {marginLeft: 10}]}>
            {'Shows near me'}
          </Text>
        </TouchableOpacity>
        {this.renderMilesRange()}
      </View>
    );
  };

  renderMilesRange = () => {
    return (
      <View style={styles.rangeContainer}>
        {this.renderRange('0')}
        <RangeSlider
          testID="milesRangeSlider"
          style={{width: '80%'}}
          min={0}
          max={100}
          step={1}
          disableRange
          disabled={!this.state.selectRange}
          onValueChanged={this.handleMilesRange}
          renderThumb={this.renderThumb}
          renderRail={() => <View style={styles.rail} />}
          renderRailSelected={this.renderRailSelected}
          {...(this.state.maxMiles === '50'
            ? {
                minRange: 0,
                high: 100,
                low: 50,
              }
            : {})}
        />
        {this.renderRange(this.state.maxMiles)}
      </View>
    );
  };

  renderRange = (miles: string) => {
    return (
      <View style={styles.milesView}>
        <Text
          style={{
            color: !this.state.selectRange ? '#64748B' : '#334155',
            fontSize: 14,
            fontWeight: '700',
          }}>
          {miles}
        </Text>
        <Text
          style={{
            color: !this.state.selectRange ? '#64748B' : '#334155',
            fontSize: 14,
            fontWeight: '400',
          }}>
          Miles
        </Text>
      </View>
    );
  };

  renderThumb = () => {
    return (
      <View
        style={[styles.thumb, {borderColor: '#FFF', backgroundColor: '#FFF'}]}
      />
    );
  };

  renderRailSelected = () => {
    return (
      <View
        style={[
          styles.railSelected,
          {backgroundColor: !this.state.selectRange ? '#64748B' : '#4949EE'},
        ]}
      />
    );
  };

  renderShowsByState = () => {
    return (
      <View
        style={[
          styles.showsByStateView,
          {backgroundColor: this.state.selectRange ? '#F1F5F9' : '#E0E7FF'},
        ]}>
        <TouchableOpacity
          testID="showsByState"
          style={styles.showsByState}
          onPress={this.handleShowsByState}>
          <EntypoIcon
            name={this.state.selectRange ? 'circle' : 'vinyl'}
            size={20}
            color={this.state.selectRange ? '#CBD5E1' : '#4949EE'}
          />
          <Text
            testID="showsByStateTxt"
            style={[styles.txt, styles.textInputLabel, {marginLeft: 10}]}>
            {'Search by State'}
          </Text>
        </TouchableOpacity>
        <Text testID="stateTxt" style={[styles.txt, styles.textInputLabel]}>
          State
        </Text>
        {this.renderStateDropdown()}
        <Text style={[styles.txt, styles.errorTxt, {marginBottom: 5}]}>
          {this.state.stateError}
        </Text>
        <View style={[styles.checkboxContainer, {marginBottom: 25}]}>
          <TouchableOpacity
            style={styles.checkbox}
            disabled={this.state.selectRange}
            testID="btnWholeState"
            onPress={this.handleWholeStateSelection}>
            {this.state.wholeStateSelected && !this.state.selectRange && (
              <View style={styles.checkboxSelected} />
            )}
          </TouchableOpacity>
          <View>
            <Text
              style={[
                styles.txt,
                {color: this.state.selectRange ? '#94A3B8' : '#000'},
              ]}>
              Whole State
            </Text>
          </View>
        </View>
        <Text style={[styles.txt, styles.textInputLabel]}>City</Text>
        {this.renderCityDropdown()}
        <Text style={[styles.txt, styles.errorTxt, {marginBottom: 5}]}>
          {this.state.cityError}
        </Text>
      </View>
    );
  };

  renderStateModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.stateClicked}>
        <TouchableWithoutFeedback
          testID="hideStateModal"
          onPress={this.hideModalState}>
          <View style={styles.centeredView}>
            <TouchableWithoutFeedback>
              <View
                style={[
                  styles.modalView,
                  {borderTopStartRadius: 20, padding: 15},
                ]}>
                <Picker
                  testID="statePickerModal"
                  selectedValue={this.state.selectedState}
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
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.cityClicked}>
        <TouchableWithoutFeedback
          testID="hideCityModal"
          onPress={this.hideModalCity}>
          <View style={styles.centeredView}>
            <TouchableWithoutFeedback>
              <View
                style={[
                  styles.modalView,
                  {borderTopStartRadius: 20, padding: 15},
                ]}>
                <Picker
                  testID="cityPickerModal"
                  selectedValue={this.state.selectedCity}
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
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.loginPopup}>
        <View style={[styles.centeredView, {backgroundColor: '#33415580'}]}>
          <View style={[styles.modalView]}>
            <TouchableWithoutFeedback
              testID="popupCloseButton"
              onPress={this.handleLoginPopup}>
              <SvgImage
                style={styles.svgImage}
                width={14}
                height={14}
                viewBox="0 0 14 14"
                fill="#0F172A">
                <Path
                  d="M13.3.71a.996.996 0 00-1.41 0L7 5.59 2.11.7A.996.996 0 10.7 2.11L5.59 7 .7 11.89a.996.996 0 101.41 1.41L7 8.41l4.89 4.89a.996.996 0 101.41-1.41L8.41 7l4.89-4.89c.38-.38.38-1.02 0-1.4z"
                  fill="#0F172A"
                />
              </SvgImage>
            </TouchableWithoutFeedback>
            <Text style={styles.welcomeTo}>{'Welcome to'}</Text>
            <Text style={styles.localShows}>{'Local Shows'}</Text>
            <Text style={styles.loginFirst}>
              {'You have to Log in first to access the events.'}
            </Text>
            <TouchableOpacity
              testID="createAccountBtn"
              onPress={() => {
                this.moveToLoginSignupScreen('signup');
              }}>
              <Text style={styles.createAccount}>{'Create new account'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              testID="loginBtn"
              style={styles.loginBtn}
              onPress={() => {
                this.moveToLoginSignupScreen('login');
              }}>
              <Text style={styles.loginTxt}>{'Log in'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  renderTopTabView = () => {
    return (
      <View style={styles.TopTabView}>
        <TouchableOpacity
          testID="ShowTabBtn"
          activeOpacity={0.7}
          onPress={() => {
            this.setSelectedTab('Shows');
          }}
          style={[
            styles.SingleTab,
            this.state.SelectedTab === 'Shows' && styles.selectedTab,
          ]}>
          <Text
            style={
              this.state.SelectedTab === 'Shows'
                ? styles.selectedTabTitle
                : styles.SingleTabTitle
            }>
            Shows
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          testID="PeopleTabBtn"
          activeOpacity={0.7}
          onPress={() => {
            this.setSelectedTab('People');
          }}
          style={[
            styles.SingleTab,
            this.state.SelectedTab === 'People' && styles.selectedTab,
          ]}>
          <Text
            style={
              this.state.SelectedTab === 'People'
                ? styles.selectedTabTitle
                : styles.SingleTabTitle
            }>
            People
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  renderUserSearchView = () => {
    if (this.state.LoadingUsers) {
      return (
        <View
          style={{
            height: Dimensions.get('window').height * 0.5,
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <ActivityIndicator size={'large'} color="black" />
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
              color: '#334155',
              marginTop: 16,
            }}>
            No Results Found
          </Text>
        </View>
      );
    }
    if (this.state.UserList.length <= 0) {
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
      <FlatList
        testID="SearchUserList"
        scrollEnabled={false}
        data={this.state.UserList}
        renderItem={this.renderUserItem}
      />
    );
  };

  renderShowSearchView = () => {
    return (
      <View>
        {this.renderShowsNearMe()}
        <View style={{marginVertical: 15}}>
          <Text
            style={[
              styles.txt,
              styles.textInputLabel,
              {textAlign: 'center', flex: 1, width: '100%'},
            ]}>
            OR
          </Text>
        </View>
        {this.renderShowsByState()}
      </View>
    );
  };

  renderSearchTabs = (tab: string) => {
    switch (tab) {
      case 'Shows':
        return this.renderShowSearchView();
      case 'People':
        return this.renderUserSearchView();
      default:
        return null;
    }
  };

  renderUserItem = ({item}: {item: any}) => {
    return (
      <View key={item.id}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 11,
          }}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              testID="userProfileImageBTN"
              activeOpacity={0.7}
              onPress={() => {
                this.renderProfileUserSearch(
                  item.id,
                  item.attributes?.account_type,
                );
              }}
              style={{
                borderRadius: 99,
                overflow: 'hidden',
                borderWidth: 2,
                borderColor: '#C5C5FF',
              }}>
              <Image
                source={
                  item.attributes?.profile_image !== ''
                    ? {uri: item.attributes?.profile_image}
                    : require('../../../mobile/assets/images/default_profile.png')
                }
                resizeMode="cover"
                style={{
                  height: 44,
                  width: 44,
                }}
              />
            </TouchableOpacity>
            <Text
              numberOfLines={1}
              style={{
                paddingLeft: 15,
                color: '#334155',
                fontWeight: '700',
                maxWidth: 150,
              }}>
              {this.getName(
                item.attributes?.first_name,
                item.attributes?.last_name,
              )}
            </Text>
          </View>
          <TouchableOpacity
            testID="followAndUnfollowId"
            onPress={() =>
              this.followAndUnfollowUserAPICall(
                item.id,
                item.attributes?.is_following,
              )
            }
            style={{
              backgroundColor: '#EDEDFF',
              paddingVertical: 11,
              paddingHorizontal: 24,
              borderRadius: 8,
            }}>
            <Text
              style={{
                color: '#3333CC',
                fontWeight: '700',
              }}>
              {item.attributes?.is_following ? 'Unfollow' : 'Follow'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  renderSearchView = () => {
    return (
      <View style={styles.contentContainer}>
        <Text style={styles.txt}>
          Look for shows, venues, genres or bands that you are interested in.
        </Text>
        {this.renderSearchInput()}
        {this.renderTopTabView()}
        {this.renderSearchTabs(this.state.SelectedTab)}
      </View>
    );
  };

  // Customizable Area End

  render() {
    // Customizable Area Start
    return (
      <SafeAreaView style={styles.parentContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#FCFCFF" />
        <ScrollView keyboardShouldPersistTaps="always" style={styles.container}>
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
        <TouchableOpacity
          testID="btnSearch"
          disabled={
            this.state.SelectedTab === 'Shows'
              ? false
              : this.state.searchText === ''
          }
          style={[styles.searchButton, {opacity: this.getOpacity()}]}
          onPress={this.handleEventSearchAPICall}>
          <Text style={[styles.txt, styles.textSearchButton]}>Search</Text>
        </TouchableOpacity>
        {this.state.isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size={'large'} color="black" />
          </View>
        )}
      </SafeAreaView>
      //Merge Engine End DefaultContainer
    );
    // Customizable Area End
  }
}

// Customizable Area Start
const styles = StyleSheet.create({
  parentContainer: {
    flex: 1,
    backgroundColor: '#fcfcff',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 5,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 7,
  },
  backArrowIconContainer: {
    width: 20,
  },
  backArrowIcon: {
    width: 12,
    left: 0,
    resizeMode: 'contain',
  },
  headerTitleTxt: {
    fontWeight: '700',
    fontSize: 24,
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
    color: '#0F172A',
  },
  txt: {
    fontFamily: 'OpenSans',
    alignSelf: 'flex-start',
    color: colors(false).text,
  },
  errorTxt: {
    color: 'red',
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
    height: 25,
    width: 25,
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
  contentContainer: {},
  input: {
    flex: 1,
    height: 47,
    fontSize: 17,
    marginLeft: 10,
    color: '#334166',
  },
  inputPlaceholderSmaller: {
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 15,
    paddingVertical: 2,
    paddingHorizontal: 10,
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: '#E2E8F0',
  },
  searchIcon: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
  },
  textInputLabel: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  textInput: {
    width: '100%',
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: '#C5C5FF',
    color: colors(false).text,
    height: 50,
  },
  selector: {
    height: 50,
    justifyContent: 'center',
    paddingHorizontal: 0,
  },
  downArrow: {
    position: 'absolute',
    right: 15,
    marginRight: 5,
    width: 8,
    backgroundColor: 'transparent',
    transform: [{rotate: '-90deg'}],
    resizeMode: 'contain',
  },
  checkboxContainer: {
    flexDirection: 'row',
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
  checkboxSelected: {
    height: 12,
    width: 12,
    backgroundColor: '#3333CC',
    borderRadius: 2.5,
  },
  searchButton: {
    backgroundColor: '#3333CC',
    padding: 15,
    borderRadius: 10,
    marginTop: 25,
    margin: 16,
  },
  textSearchButton: {
    color: colors(false).white,
    fontWeight: '700',
    fontSize: 18,
    alignSelf: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#33415580',
  },
  modalView: {
    height: '40%',
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
  rangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 10,
  },
  milesView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumb: {
    width: 15 * 2,
    height: 15 * 2,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ffffff',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: -1},
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  rail: {
    flex: 1,
    height: 5,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
  },
  railSelected: {
    height: 5,
    backgroundColor: '#4949EE',
    borderRadius: 2,
  },
  welcomeTo: {
    textAlign: 'center',
    fontSize: 20,
    lineHeight: 28,
    marginTop: 10,
    color: '#334166',
  },
  localShows: {
    fontWeight: '700',
    fontSize: 28,
    lineHeight: 32,
    bottom: '5%',
    textAlign: 'center',
    color: '#3333CC',
  },
  loginFirst: {
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: '5%',
    fontWeight: '400',
    fontSize: 16,
    color: '#334166',
  },
  createAccount: {
    color: '#3333CC',
    fontWeight: '700',
    lineHeight: 24,
    marginBottom: '4%',
    fontSize: 16,
    textAlign: 'center',
  },
  loginBtn: {
    backgroundColor: '#3333CC',
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
    height: 20,
    width: 20,
    resizeMode: 'contain',
  },
  showsNearMeView: {
    borderRadius: 10,
    padding: 10,
    marginTop:20
  },
  showsByStateView: {
    borderRadius: 10,
    padding: 10,
  },
  showsByState: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  SingleTab: {
    width: '50%',
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 8,
  },
  selectedTab: {
    backgroundColor: '#4949EE',
  },
  SingleTabTitle: {
    color: '#334155',
    fontSize: 12,
    fontWeight: '400',
  },
  selectedTabTitle: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  TopTabView: {
    width: '100%',
    backgroundColor: '#E2E8F0',
    flexDirection: 'row',
    borderRadius: 8,
    marginBottom: 0,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#ffffffdd',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
// Customizable Area End

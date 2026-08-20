import React from 'react';
// Customizable Area Start
import {
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
  StatusBar,
  FlatList,
  ActivityIndicator,
  Platform,
  Modal,
  TextInput,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { lightTheme, redesignTheme } from '../../utilities/src/Colors';
import { noEventsIcon } from './assets';
import moment from 'moment';
import Icon from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FastImage from '../../../components/src/SafeFastImage';
import { DrawerActions } from '@react-navigation/native';
// Customizable Area End

import FilteritemsController, { configJSON } from './FilteritemsController';
import DateRangePicker from 'react-native-daterange-picker';
import Svg, { Path } from 'react-native-svg';

type FilterTheme = typeof redesignTheme;

export default class Filteritems extends FilteritemsController {
  get styles() {
    return this.state.isDarkMode ? darkFilterStyles : lightFilterStyles;
  }

  handleScreenPress = () => {
    this.closePostOptionsMenu();
    this.hideKeyboard();
  };

  openDrawerMenu = () => {
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

    return this.renderRedDot({ condition: this.state.newNotification });
  };

  renderRedDot = ({ condition }: { condition: boolean }) => {
    if (condition) {
      return <View style={this.styles.redDot} />;
    }

    return <></>;
  };

  renderShowCard = ({ item, index }: { item: any; index: number }) => {
    const image =
      this.state.activeTab === 'post'
        ? item.attributes.profile_image
        : item.attributes.images_and_videos[0].url;
    const handlePress = () => this.handleEventNavigation(item);
    const isPictureTab = this.state.activeTab === 'picture';
    const isOptionsMenuVisible = this.state.activeOptionsMenuId === item.id;
    return (
      <TouchableOpacity
        testID="showCard"
        style={this.styles.showCard}
        onPress={handlePress}
      >
        <FastImage
          source={{
            uri: image,
            priority: FastImage.priority.high,
          }}
          style={[
            this.styles.showCardImage,
            { marginLeft: index % 2 === 0 ? 0 : '5%' },
          ]}
          resizeMode={FastImage.resizeMode.cover}
        />
        <TouchableOpacity
          testID="btnDeleteEvent"
          style={this.styles.deleteIconContainer}
          onPress={() => this.togglePostOptionsMenu(item.id)}
        >
          <Icon name="more-vertical" color="#ffffff" size={20} />
        </TouchableOpacity>
        {isOptionsMenuVisible && (
          <View style={this.styles.postOptionsMenu}>
            {isPictureTab ? (
              <>
                <TouchableOpacity
                  testID="editPicturePost"
                  style={this.styles.postOptionsMenuItem}
                  onPress={() => this.handleEditPicturePost(item.id)}
                >
                  <Text style={this.styles.postOptionsMenuText}>Edit Post</Text>
                </TouchableOpacity>
                <View style={this.styles.postOptionsDivider} />
                <TouchableOpacity
                  testID="deletePicturePost"
                  style={this.styles.postOptionsMenuItem}
                  onPress={() =>
                    this.handleDeletePicturePost(
                      item.id,
                      item.attributes.account_id,
                    )
                  }
                >
                  <Text style={this.styles.postOptionsMenuText}>Delete Post</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                {item?.attributes?.account_id?.toString() ===
                  this.state.userId && (
                  <>
                    <TouchableOpacity
                      testID="editShow"
                      style={this.styles.postOptionsMenuItem}
                      onPress={() => this.handleEditShow(item)}
                    >
                      <Text style={this.styles.postOptionsMenuText}>Edit Show</Text>
                    </TouchableOpacity>
                    <View style={this.styles.postOptionsDivider} />
                  </>
                )}
                <TouchableOpacity
                  testID="deleteShow"
                  style={this.styles.postOptionsMenuItem}
                  onPress={() =>
                    this.handleDeleteShow(item.id, item.attributes.account_id)
                  }
                >
                  <Text style={this.styles.postOptionsMenuText}>
                    {item?.attributes?.account_id?.toString() === this.state.userId
                      ? 'Delete Show'
                      : 'Remove Show'}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  renderGroupedEvents = ({
    item,
    elements,
  }: {
    item: string;
    elements: [];
  }) => {
    const text =
      item === '2999-12-31'
        ? 'Undefined Date'
        : moment(item).utc().format('dddd - MMM DD YYYY');
    return (
      <View style={this.styles.showGroupContainer}>
        <Text style={[this.styles.text, this.styles.showGroupDate]}>
          {this.state.selectedFilter === '2' ? `Shows in ${item}` : text}
        </Text>
        <FlatList
          testID="showCardFlatlist"
          data={elements}
          renderItem={this.renderShowCard}
          scrollEnabled={false}
          numColumns={2}
          keyExtractor={item => item.id}
        />
      </View>
    );
  };

  getPostsButtonStyle = (activeTab: string) =>
    activeTab === 'post'
      ? [this.styles.button, this.styles.tabButtonActive]
      : [this.styles.button, this.styles.tabButtonInactive];

  getPostsTextStyle = (activeTab: string) =>
    activeTab === 'post'
      ? this.styles.tabTextActive
      : this.styles.tabTextInactive;

  getPicturesButtonStyle = (activeTab: string) =>
    activeTab === 'picture'
      ? [this.styles.button, this.styles.tabButtonActive]
      : [this.styles.button, this.styles.tabButtonInactive];

  getPicturesTextStyle = (activeTab: string) =>
    activeTab === 'picture'
      ? this.styles.tabTextActive
      : this.styles.tabTextInactive;

  renderLoginModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.showLoginPopup}
      >
        <View style={this.styles.centeredView}>
          <View style={[this.styles.modalView]}>
            {this.renderCloseBtn()}
            <Text style={this.styles.welcomeToPopupText}>
              {configJSON.welcomeTo}
            </Text>
            <Text style={this.styles.localShowsPopupText}>
              {configJSON.localShows}
            </Text>
            <Text style={this.styles.loginFirstPopupText}>
              {configJSON.loginFirst}
            </Text>
            <TouchableOpacity
              testID="createAccountBtn"
              onPress={() =>
                this.moveToSignupLoginScreen('Rolesandpermissions')
              }
            >
              <Text style={this.styles.createAccountPopupText}>
                {configJSON.createNewAccount}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              testID="loginBtn"
              style={this.styles.loginBtnPopupText}
              onPress={() =>
                this.moveToSignupLoginScreen('EmailAccountLoginBlock')
              }
            >
              <Text style={this.styles.loginTxtPopupText}>{configJSON.login}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };
  renderCloseBtn = () => {
    const theme = this.getCalendarTheme();
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        style={this.styles.closeBtnSty}
        testID="popupCloseBtn"
        onPress={this.handleCloseBtn}
      >
        <Svg width={14} height={14} viewBox="0 0 14 14" fill={theme.foreground}>
          <Path
            d="M13.3.71a.996.996 0 00-1.41 0L7 5.59 2.11.7A.996.996 0 10.7 2.11L5.59 7 .7 11.89a.996.996 0 101.41 1.41L7 8.41l4.89 4.89a.996.996 0 101.41-1.41L8.41 7l4.89-4.89c.38-.38.38-1.02 0-1.4z"
            fill={theme.foreground}
          />
        </Svg>
      </TouchableOpacity>
    );
  };
  renderDeleteEventModal = () => {
    const { userRole, eventAccountId, userId, activeTab } = this.state;
    const theme = this.getCalendarTheme();

    const isDeletingPost = activeTab === 'picture';

    let headingText;
    let confirmationText;

    if (isDeletingPost) {
      headingText = configJSON.deletePostTitle;
      confirmationText = configJSON.deletePostConfirmation;
    } else {
      const isFan = userRole === 'fan';
      const isEventOwner = eventAccountId === userId;

      if (isFan) {
        headingText = configJSON.removeEvent;
        confirmationText = configJSON.removeEventFromCalendarConfirmation;
      } else if (isEventOwner) {
        headingText = configJSON.cancelEvent;
        confirmationText = configJSON.removeEventConfirmation;
      } else {
        headingText = configJSON.removeEvent;
        confirmationText = configJSON.removeEventFromCalendarConfirmation;
      }
    }

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.deleteEventModalVisible}
      >
        <View style={this.styles.modalParentView}>
          <View style={this.styles.modalContainerView}>
            <TouchableOpacity
              testID="btnHideModal"
              style={this.styles.disablePopupIconContainer}
              onPress={this.hideDeleteModal}
            >
              <Icon name="x" color={theme.foreground} size={25} />
            </TouchableOpacity>
            <Text style={this.styles.textDeleteHeading}>{headingText}</Text>
            <Text style={[this.styles.text, this.styles.textDelete]}>
              {confirmationText}
            </Text>
            <TouchableOpacity
              testID="btnKeepEventModal"
              style={[this.styles.deleteButtonContainer, this.styles.keepButtonContainer]}
              onPress={this.hideDeleteModal}
            >
              <Text
                style={[
                  this.styles.text,
                  this.styles.textDeleteButton,
                  this.styles.textKeepButton,
                ]}
              >
                {configJSON.noKeepIt}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              testID="btnDeleteEventModal"
              style={this.styles.deleteButtonContainer}
              onPress={this.handlePostPictureDelete}
            >
              <Text style={[this.styles.text, this.styles.textDeleteButton]}>
                {configJSON.yesRemoveIt}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  renderHeader = () => {
    const theme = this.getCalendarTheme();
    return (
      <View style={this.styles.header}>
        <View style={this.styles.headerTitleRow}>
          <TouchableOpacity
            testID="backButton"
            style={this.styles.headerCircleBtn}
            onPress={this.handleBack}
            activeOpacity={0.8}
          >
            <Icon name="arrow-left" size={18} color={theme.foreground} />
          </TouchableOpacity>
          <Text testID="pageTitle" style={this.styles.screenTitle}>
            Calendar
          </Text>
        </View>

        <View style={this.styles.iconsContainer}>
          <TouchableOpacity
            testID="notificationIcon"
            style={this.styles.headerCircleBtn}
            onPress={() => {
              this.navigateToNotifications();
            }}
            activeOpacity={0.8}
          >
            <View style={this.styles.notificationWrapper}>
              <Icon name="bell" size={16} color={theme.foreground} />
              {this.renderNotificationIndicator()}
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            testID="hamburgerIcon"
            style={[this.styles.headerCircleBtn, this.styles.headerCircleBtnGap]}
            onPress={this.openDrawerMenu}
            activeOpacity={0.8}
          >
            <Icon name="menu" size={16} color={theme.foreground} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  render() {
    const theme = this.getCalendarTheme();

    return (
      <>
        {/* Customizable Area Start */}
        <SafeAreaView style={this.styles.rootContainer} edges={['top']}>
          <ScrollView
            style={this.styles.rootContainer}
            contentContainerStyle={this.styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <StatusBar
              barStyle={this.state.isDarkMode ? 'light-content' : 'dark-content'}
              backgroundColor={theme.background}
            />
            {this.state.token ? (
              <TouchableWithoutFeedback
                testID={'hideKeyboardTouchable'}
                style={this.styles.container}
                onPress={this.handleScreenPress}
              >
                <View style={this.styles.secondaryContainer}>
                  {this.renderHeader()}
                  {this.state.userRole !== 'fan' && (
                    <>
                      <View style={this.styles.inputContainer}>
                        <Icon name="search" size={16} color={theme.muted} />
                        <TextInput
                          testID="searchText"
                          style={this.styles.input}
                          placeholderTextColor={theme.muted}
                          placeholder="Search"
                          value={this.state.searchText}
                          onChangeText={searchText =>
                            this.handleSearch(searchText)
                          }
                        />
                      </View>
                      <View style={this.styles.tabs}>
                        <TouchableOpacity
                          testID="postsTab"
                          style={this.getPostsButtonStyle(this.state.activeTab)}
                          onPress={() => this.handleTabSwitch('post')}
                          activeOpacity={0.85}
                        >
                          <Text
                            style={this.getPostsTextStyle(this.state.activeTab)}
                          >{`${configJSON.shows}(${this.state.postsCount})`}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          testID="picturesTab"
                          style={this.getPicturesButtonStyle(
                            this.state.activeTab,
                          )}
                          onPress={() => this.handleTabSwitch('picture')}
                          activeOpacity={0.85}
                        >
                          <Text
                            style={this.getPicturesTextStyle(
                              this.state.activeTab,
                            )}
                          >{`${configJSON.posts}(${this.state.picturesCount})`}</Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  )}
                  <Text style={[this.styles.text, this.styles.textInputLabel]}>Date</Text>
                  <TouchableOpacity
                    testID="btnDateSelector"
                    style={this.styles.dateSelectorButton}
                    onPress={() => this.showDateSelector()}
                    activeOpacity={0.85}
                  >
                    <Text
                      style={[
                        this.styles.text,
                        this.styles.dateSelectorButtonText,
                        this.state.startDate !== 'MM DD YYYY' && {
                          color: theme.foreground,
                        },
                      ]}
                    >
                      {`${this.state.startDate} - ${this.state.endDate}`}
                    </Text>
                    <MaterialCommunityIcons
                      name="calendar-blank"
                      size={22}
                      color={theme.primary}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    testID="btnFilterPopup"
                    style={this.styles.filterContainer}
                    onPress={this.showFilterPopup}
                    activeOpacity={0.85}
                  >
                    <Text style={this.styles.filterValueText}>
                      {configJSON.filterValues[this.state.selectedFilter]}
                    </Text>
                    <Icon
                      name="chevron-down"
                      size={16}
                      color={theme.muted}
                      style={this.styles.downArrow}
                    />
                  </TouchableOpacity>
                  {this.state.showFilterPopup ? (
                    <View style={this.styles.filterPopupContainer}>
                      <View style={this.styles.filterPopup}>
                        <TouchableOpacity
                          testID="btnFilterMostRecent"
                          style={[
                            this.styles.filterContainer,
                            { backgroundColor: this.dynamicBg('0') },
                          ]}
                          onPress={() =>
                            this.filterEvents('0', this.state.events)
                          }
                        >
                          <Text style={this.styles.filterValueText}>
                            {configJSON.filterValues[0]}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          testID="btnFilterLeastRecent"
                          style={[
                            this.styles.filterContainer,
                            { backgroundColor: this.dynamicBg('1') },
                          ]}
                          onPress={() =>
                            this.filterEvents('1', this.state.events)
                          }
                        >
                          <Text style={this.styles.filterValueText}>
                            {configJSON.filterValues[1]}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          testID="btnFilterByState"
                          style={[
                            this.styles.filterContainer,
                            { backgroundColor: this.dynamicBg('2') },
                          ]}
                          onPress={() =>
                            this.filterEvents('2', this.state.events)
                          }
                        >
                          <Text style={this.styles.filterValueText}>
                            {configJSON.filterValues[2]}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : null}
                  <View style={this.styles.contentView}>
                    {Object.keys(this.state.events).length ? (
                      <FlatList
                        testID="filteredEvents"
                        style={{ flex: 1 }}
                        data={this.state.filteredEvents}
                        scrollEnabled={false}
                        renderItem={({ item }: { item: string }) =>
                          this.renderGroupedEvents({
                            item,
                            elements: this.state.events[item],
                          })
                        }
                        keyExtractor={item => item}
                      />
                    ) : (
                      <View style={this.styles.noEventsContainer}>
                        <Image
                          source={noEventsIcon}
                          style={this.styles.noEventsIcon}
                        />
                        <Text style={[this.styles.text, this.styles.textNoEvents]}>
                          {`Unfortunately, there are no events\nfor this date range.`}
                        </Text>
                        <TouchableOpacity
                          testID="btnBackHome"
                          style={this.styles.backHomeButton}
                          onPress={this.handleBack}
                          activeOpacity={0.85}
                        >
                          <Text
                            style={[this.styles.text, this.styles.textBackHomeButton]}
                          >
                            Back Home
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </View>
              </TouchableWithoutFeedback>
            ) : (
              this.renderLoginModal()
            )}
          </ScrollView>
        </SafeAreaView>
        {this.state.showDateSelector && (
          <>
            <View style={this.styles.datePickerContainer}>
              <DateRangePicker
                open={this.state.showDateSelector}
                onChange={this.setDates}
                endDate={moment(Number(moment(this.state.endDate)) + 86400000)}
                startDate={moment(this.state.startDate)}
                displayedDate={this.state.displayedDate}
                selectedStyle={this.styles.selectedDate}
                range
              >
                <></>
              </DateRangePicker>
            </View>
            <TouchableOpacity
              testID="closeCalendar"
              style={this.styles.cancelDateSelectionButton}
              onPress={() => this.setState({ showDateSelector: false })}
            >
              <Icon name="x" size={22} color={theme.foreground} />
            </TouchableOpacity>
          </>
        )}
        {this.state.isFetching && (
          <View style={this.styles.activityIndicator}>
            <ActivityIndicator size={'large'} color={theme.primary} />
          </View>
        )}

        {this.renderDeleteEventModal()}
        {/* Customizable Area End */}
      </>
    );
  }
}

// Customizable Area Start
const createFilterStyles = (theme: FilterTheme) => {
  const isLightTheme = theme.background === lightTheme.background;
  return StyleSheet.create({
    rootContainer: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollContent: {
      paddingBottom: 24,
    },
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    secondaryContainer: {
      flex: 1,
      paddingBottom: 16,
      paddingHorizontal: 16,
      paddingTop: 4,
      overflow: 'visible',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
      overflow: 'visible',
    },
    headerTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      paddingRight: 8,
    },
    headerCircleBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.input,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerCircleBtnGap: {
      marginLeft: 8,
    },
    screenTitle: {
      fontWeight: '900',
      fontSize: 18,
      letterSpacing: 0.6,
      color: theme.foreground,
      textTransform: 'uppercase',
      marginLeft: 10,
    },
    text: {
      fontFamily: 'OpenSans',
      color: theme.foreground,
    },
    textNoEvents: {
      alignSelf: 'center',
      fontSize: 15,
      textAlign: 'center',
      marginVertical: 15,
      color: theme.muted,
    },
    iconsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      overflow: 'visible',
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
    contentView: {
      flex: 1,
    },
    datePickerContainer: {
      ...StyleSheet.absoluteFillObject,
      alignItems: 'center',
      justifyContent: 'center',
    },
    selectedDate: {
      backgroundColor: theme.primary,
    },
    dateSelectorButton: {
      width: '100%',
      paddingHorizontal: 14,
      borderRadius: 14,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border,
      backgroundColor: theme.input,
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'row',
      height: 50,
      marginBottom: 10,
    },
    dateSelectorButtonText: {
      alignSelf: 'center',
      color: theme.muted,
    },
    noEventsContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 32,
    },
    noEventsIcon: {
      height: 100,
      width: 100,
      alignSelf: 'center',
      resizeMode: 'contain',
    },
    backHomeButton: {
      width: '100%',
      backgroundColor: theme.primary,
      padding: 15,
      borderRadius: 12,
      marginTop: 25,
      margin: 16,
    },
    textBackHomeButton: {
      color: '#FFFFFF',
      fontWeight: '700',
      fontSize: 18,
      alignSelf: 'center',
    },
    activityIndicator: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: isLightTheme
        ? 'rgba(255, 255, 255, 0.72)'
        : 'rgba(8, 8, 15, 0.72)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    showGroupContainer: {
      marginVertical: 10,
    },
    showGroupDate: {
      fontSize: 16,
      fontWeight: '800',
      letterSpacing: 0.3,
      color: theme.foreground,
      marginBottom: 8,
    },
    showCard: {
      width: '50%',
      aspectRatio: 154 / 218,
      marginVertical: 10,
    },
    showCardImage: {
      width: '95%',
      height: '100%',
      borderRadius: 14,
      backgroundColor: theme.input,
    },
    filterContainer: {
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 10,
      flexDirection: 'row',
      alignItems: 'center',
    },
    filterValueText: {
      fontFamily: 'OpenSans',
      color: theme.foreground,
      fontWeight: '600',
      fontSize: 14,
    },
    downArrow: {
      marginLeft: 8,
    },
    filterPopupContainer: {
      zIndex: Platform.OS === 'ios' ? 100 : undefined,
    },
    filterPopup: {
      position: 'absolute',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      zIndex: 100,
      backgroundColor: theme.card,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border,
      alignSelf: 'flex-start',
      padding: 3,
      borderRadius: 12,
    },
    deleteIconContainer: {
      position: 'absolute',
      backgroundColor: 'rgba(8, 8, 15, 0.55)',
      width: 30,
      aspectRatio: 1,
      borderRadius: 15,
      right: 20,
      top: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    postOptionsMenu: {
      position: 'absolute',
      right: 10,
      top: 45,
      backgroundColor: theme.card,
      borderRadius: 12,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border,
      paddingVertical: 6,
      width: 170,
      shadowColor: '#000',
      shadowOpacity: 0.15,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      elevation: 6,
      zIndex: 100,
    },
    postOptionsMenuItem: {
      paddingVertical: 10,
      paddingHorizontal: 16,
    },
    postOptionsMenuText: {
      color: theme.foreground,
      fontWeight: '600',
    },
    postOptionsDivider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: theme.divider,
      marginHorizontal: 10,
    },
    modalParentView: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: '#08080fcc',
    },
    modalContainerView: {
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
    textDeleteHeading: {
      fontWeight: '700',
      fontSize: 26,
      lineHeight: 28,
      marginBottom: 10,
      marginTop: 25,
      color: theme.foreground,
    },
    textDelete: {
      fontSize: 18,
      color: theme.muted,
    },
    deleteButtonContainer: {
      backgroundColor: theme.primary,
      width: '100%',
      padding: 15,
      borderRadius: 12,
      marginTop: 15,
    },
    textDeleteButton: {
      color: '#FFFFFF',
      fontWeight: '700',
      fontSize: 18,
      alignSelf: 'center',
    },
    keepButtonContainer: {
      backgroundColor: 'transparent',
    },
    textKeepButton: {
      color: theme.primary,
    },
    disablePopupIconContainer: {
      position: 'absolute',
      right: 20,
      top: 20,
    },
    button: {
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 10,
      width: '50%',
    },
    tabButtonActive: {
      backgroundColor: theme.primary,
    },
    tabButtonInactive: {
      backgroundColor: 'transparent',
    },
    tabTextActive: {
      fontSize: 13,
      fontWeight: '700',
      color: '#FFFFFF',
      textAlign: 'center',
    },
    tabTextInactive: {
      fontSize: 13,
      fontWeight: '600',
      color: theme.muted,
      textAlign: 'center',
    },
    input: {
      flex: 1,
      height: 44,
      fontSize: 16,
      marginLeft: 10,
      color: theme.foreground,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 16,
      paddingVertical: 4,
      paddingHorizontal: 12,
      marginVertical: 10,
      backgroundColor: theme.input,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border,
    },
    textInputLabel: {
      fontWeight: '700',
      marginBottom: 8,
      color: theme.foreground,
    },
    centeredView: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: '#08080fcc',
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
      elevation: 5,
    },
    welcomeToPopupText: {
      textAlign: 'center',
      fontSize: 20,
      lineHeight: 28,
      marginTop: 10,
      color: theme.muted,
    },
    localShowsPopupText: {
      fontWeight: '700',
      fontSize: 28,
      lineHeight: 32,
      bottom: '5%',
      textAlign: 'center',
      color: theme.primary,
      marginTop: 10,
    },
    loginFirstPopupText: {
      textAlign: 'center',
      lineHeight: 24,
      marginBottom: '5%',
      fontWeight: '400',
      fontSize: 16,
      color: theme.foreground,
    },
    createAccountPopupText: {
      color: theme.primary,
      fontWeight: '700',
      lineHeight: 24,
      marginBottom: '4%',
      fontSize: 16,
      textAlign: 'center',
    },
    loginBtnPopupText: {
      backgroundColor: theme.primary,
      borderRadius: 8,
      height: 56,
      justifyContent: 'center',
    },
    loginTxtPopupText: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
      fontSize: 16,
    },
    cancelDateSelectionButton: {
      position: 'absolute',
      top: 20,
      right: 20,
      width: 44,
      height: 44,
      backgroundColor: theme.input,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border,
      zIndex: 2147483647,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 22,
    },
    tabs: {
      flexDirection: 'row',
      justifyContent: 'center',
      borderRadius: 14,
      alignSelf: 'stretch',
      backgroundColor: theme.input,
      marginVertical: 12,
      padding: 4,
    },
    closeBtnSty: {
      padding: 8,
      position: 'absolute',
      top: 20,
      right: 20,
      width: 20,
      height: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
};

const darkFilterStyles = createFilterStyles(redesignTheme);
const lightFilterStyles = createFilterStyles(lightTheme);
// Customizable Area End

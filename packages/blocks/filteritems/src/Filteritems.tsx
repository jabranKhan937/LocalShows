import React from 'react';
// Customizable Area Start
import {
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
  SafeAreaView,
  StatusBar,
  FlatList,
  ActivityIndicator,
  Platform,
  Modal,
  TextStyle,
  ViewStyle,
  TextInput,
  ScrollView,
} from 'react-native';
import { colors } from '../../utilities/src/Colors';
import { leftArrow } from '../../events/src/assets';
import { downArrow, noEventsIcon, notificationIcon } from './assets';
import moment from 'moment';
import Icon from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FastImage from '../../../components/src/SafeFastImage';
import { DrawerActions } from '@react-navigation/native';
// Customizable Area End

import FilteritemsController, { configJSON } from './FilteritemsController';
import DateRangePicker from 'react-native-daterange-picker';
import Svg, { Path } from 'react-native-svg';
export default class Filteritems extends FilteritemsController {
  handleScreenPress = () => {
    this.closePostOptionsMenu();
    this.hideKeyboard();
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
        style={styles.showCard}
        onPress={handlePress}
      >
        <FastImage
          source={{
            uri: image,
            priority: FastImage.priority.high,
          }}
          style={[
            styles.showCardImage,
            { marginLeft: index % 2 === 0 ? 0 : '5%' },
          ]}
          resizeMode={FastImage.resizeMode.cover}
        />
        <TouchableOpacity
          testID="btnDeleteEvent"
          style={styles.deleteIconContainer}
          onPress={() => this.togglePostOptionsMenu(item.id)}
        >
          <Icon name="more-vertical" color="#ffffff" size={20} />
        </TouchableOpacity>
        {isOptionsMenuVisible && (
          <View style={styles.postOptionsMenu}>
            {isPictureTab ? (
              <>
                <TouchableOpacity
                  testID="editPicturePost"
                  style={styles.postOptionsMenuItem}
                  onPress={() => this.handleEditPicturePost(item.id)}
                >
                  <Text style={styles.postOptionsMenuText}>Edit Post</Text>
                </TouchableOpacity>
                <View style={styles.postOptionsDivider} />
                <TouchableOpacity
                  testID="deletePicturePost"
                  style={styles.postOptionsMenuItem}
                  onPress={() =>
                    this.handleDeletePicturePost(
                      item.id,
                      item.attributes.account_id,
                    )
                  }
                >
                  <Text style={styles.postOptionsMenuText}>Delete Post</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                {item?.attributes?.account_id?.toString() ===
                  this.state.userId && (
                  <>
                    <TouchableOpacity
                      testID="editShow"
                      style={styles.postOptionsMenuItem}
                      onPress={() => this.handleEditShow(item)}
                    >
                      <Text style={styles.postOptionsMenuText}>Edit Show</Text>
                    </TouchableOpacity>
                    <View style={styles.postOptionsDivider} />
                  </>
                )}
                <TouchableOpacity
                  testID="deleteShow"
                  style={styles.postOptionsMenuItem}
                  onPress={() =>
                    this.handleDeleteShow(item.id, item.attributes.account_id)
                  }
                >
                  <Text style={styles.postOptionsMenuText}>
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
      <View style={styles.showGroupContainer}>
        <Text style={[styles.text, styles.showGroupDate]}>
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

  getPostsButtonStyle = (activeTab: string) => ({
    ...styles.button,
    borderRadius: 10,
    backgroundColor: activeTab === 'post' ? '#4949EE' : 'transparent',
  });

  getPostsTextStyle = (activeTab: string) =>
    ({
      fontSize: 12,
      fontWeight: activeTab === 'post' ? '700' : '400',
      color: activeTab === 'post' ? 'white' : '#334155',
    } as TextStyle);

  getPicturesButtonStyle = (activeTab: string) =>
    ({
      ...styles.button,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: activeTab === 'picture' ? '#4949EE' : 'transparent',
    } as ViewStyle);

  getPicturesTextStyle = (activeTab: string) =>
    ({
      fontSize: 12,
      textAlign: 'center',
      fontWeight: activeTab === 'picture' ? '700' : '400',
      color: activeTab === 'picture' ? 'white' : '#334155',
    } as TextStyle);

  renderLoginModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.showLoginPopup}
      >
        <View style={styles.centeredView}>
          <View style={[styles.modalView]}>
            {this.renderCloseBtn()}
            <Text style={styles.welcomeToPopupText}>
              {configJSON.welcomeTo}
            </Text>
            <Text style={styles.localShowsPopupText}>
              {configJSON.localShows}
            </Text>
            <Text style={styles.loginFirstPopupText}>
              {configJSON.loginFirst}
            </Text>
            <TouchableOpacity
              testID="createAccountBtn"
              onPress={() =>
                this.moveToSignupLoginScreen('Rolesandpermissions')
              }
            >
              <Text style={styles.createAccountPopupText}>
                {configJSON.createNewAccount}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              testID="loginBtn"
              style={styles.loginBtnPopupText}
              onPress={() =>
                this.moveToSignupLoginScreen('EmailAccountLoginBlock')
              }
            >
              <Text style={styles.loginTxtPopupText}>{configJSON.login}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };
  renderCloseBtn = () => {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.closeBtnSty}
        testID="popupCloseBtn"
        onPress={this.handleCloseBtn}
      >
        <Svg width={14} height={14} viewBox="0 0 14 14" fill="#0F172A">
          <Path
            d="M13.3.71a.996.996 0 00-1.41 0L7 5.59 2.11.7A.996.996 0 10.7 2.11L5.59 7 .7 11.89a.996.996 0 101.41 1.41L7 8.41l4.89 4.89a.996.996 0 101.41-1.41L8.41 7l4.89-4.89c.38-.38.38-1.02 0-1.4z"
            fill="#0F172A"
          />
        </Svg>
      </TouchableOpacity>
    );
  };
  renderDeleteEventModal = () => {
    const { userRole, eventAccountId, userId, activeTab } = this.state;

    // Check if we're deleting a post (picture tab) or an event (post tab)
    const isDeletingPost = activeTab === 'picture';

    let headingText;
    let confirmationText;

    if (isDeletingPost) {
      // Delete post modal text
      headingText = configJSON.deletePostTitle;
      confirmationText = configJSON.deletePostConfirmation;
    } else {
      // Delete event modal text (existing logic)
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
        <View style={styles.modalParentView}>
          <View style={styles.modalContainerView}>
            <TouchableOpacity
              testID="btnHideModal"
              style={styles.disablePopupIconContainer}
              onPress={this.hideDeleteModal}
            >
              <Icon name="x" color="#0F172A" size={25} />
            </TouchableOpacity>
            <Text style={styles.textDeleteHeading}>{headingText}</Text>
            <Text style={[styles.text, styles.textDelete]}>
              {confirmationText}
            </Text>
            <TouchableOpacity
              testID="btnKeepEventModal"
              style={[styles.deleteButtonContainer, styles.keepButtonContainer]}
              onPress={this.hideDeleteModal}
            >
              <Text
                style={[
                  styles.text,
                  styles.textDeleteButton,
                  styles.textKeepButton,
                ]}
              >
                {configJSON.noKeepIt}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              testID="btnDeleteEventModal"
              style={styles.deleteButtonContainer}
              onPress={this.handlePostPictureDelete}
            >
              <Text style={[styles.text, styles.textDeleteButton]}>
                {configJSON.yesRemoveIt}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  render() {
    // return(<>

    // </>)

    return (
      <>
        {/* Customizable Area Start */}
        <SafeAreaView style={styles.rootContainer}>
          <ScrollView style={styles.rootContainer}>
            <StatusBar barStyle="dark-content" backgroundColor="#FCFCFF" />
            {this.state.token ? (
              <TouchableWithoutFeedback
                testID={'hideKeyboardTouchable'}
                style={styles.container}
                onPress={this.handleScreenPress}
              >
                <View style={styles.secondaryContainer}>
                  <View style={styles.header}>
                    <Text
                      testID="pageTitle"
                      style={[styles.text, styles.screenTitle]}
                    >
                      Calendar
                    </Text>
                    <TouchableOpacity
                      testID="backButton"
                      style={styles.backArrowContainer}
                      onPress={this.handleBack}
                    >
                      <Image source={leftArrow} style={styles.backArrow} />
                    </TouchableOpacity>

                    <View style={styles.iconsContainer}>
                      <TouchableOpacity
                        testID="notificationIcon"
                        style={styles.notificationIconContainer}
                        onPress={() => {
                          this.navigateToNotifications();
                        }}
                      >
                        <View style={styles.notificationWrapper}>
                          <Image
                            source={notificationIcon}
                            style={styles.notificationIcon}
                          />
                          {this.renderNotificationIndicator()}
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        testID="hamburgerIcon"
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
                        }}
                      >
                        <Image
                          style={styles.hamburger}
                          source={require('../../../mobile/assets/images/Vector.png')}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                  {this.state.userRole !== 'fan' && (
                    <>
                      <View style={styles.inputContainer}>
                        <Image
                          source={require('../../../mobile/assets/images/image_search.png')}
                          style={styles.searchIcon}
                        />
                        <TextInput
                          testID="searchText"
                          style={styles.input}
                          placeholderTextColor="#334166"
                          placeholder="Search"
                          value={this.state.searchText}
                          onChangeText={searchText =>
                            this.handleSearch(searchText)
                          }
                        />
                      </View>
                      <View style={styles.tabs}>
                        <TouchableOpacity
                          testID="postsTab"
                          style={this.getPostsButtonStyle(this.state.activeTab)}
                          onPress={() => this.handleTabSwitch('post')}
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
                  <Text style={[styles.text, styles.textInputLabel]}>Date</Text>
                  <TouchableOpacity
                    testID="btnDateSelector"
                    style={styles.dateSelectorButton}
                    onPress={() => this.showDateSelector()}
                  >
                    <Text style={[styles.text, styles.dateSelectorButtonText]}>
                      {`${this.state.startDate} - ${this.state.endDate}`}
                    </Text>
                    <MaterialCommunityIcons
                      name="calendar-blank"
                      size={24}
                      color="#4949EE"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    testID="btnFilterPopup"
                    style={styles.filterContainer}
                    onPress={this.showFilterPopup}
                  >
                    <Text style={styles.text}>
                      {configJSON.filterValues[this.state.selectedFilter]}
                    </Text>
                    <Image source={downArrow} style={styles.downArrow} />
                  </TouchableOpacity>
                  {this.state.showFilterPopup ? (
                    <View style={styles.filterPopupContainer}>
                      <View style={styles.filterPopup}>
                        <TouchableOpacity
                          testID="btnFilterMostRecent"
                          style={[
                            styles.filterContainer,
                            { backgroundColor: this.dynamicBg('0') },
                          ]}
                          onPress={() =>
                            this.filterEvents('0', this.state.events)
                          }
                        >
                          <Text style={styles.text}>
                            {configJSON.filterValues[0]}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          testID="btnFilterLeastRecent"
                          style={[
                            styles.filterContainer,
                            { backgroundColor: this.dynamicBg('1') },
                          ]}
                          onPress={() =>
                            this.filterEvents('1', this.state.events)
                          }
                        >
                          <Text style={styles.text}>
                            {configJSON.filterValues[1]}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          testID="btnFilterByState"
                          style={[
                            styles.filterContainer,
                            { backgroundColor: this.dynamicBg('2') },
                          ]}
                          onPress={() =>
                            this.filterEvents('2', this.state.events)
                          }
                        >
                          <Text style={styles.text}>
                            {configJSON.filterValues[2]}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : null}
                  <View style={styles.contentView}>
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
                      <View style={styles.noEventsContainer}>
                        <Image
                          source={noEventsIcon}
                          style={styles.noEventsIcon}
                        />
                        <Text style={[styles.text, styles.textNoEvents]}>
                          {`Unfortunately, there are no events\nfor this date range.`}
                        </Text>
                        <TouchableOpacity
                          testID="btnBackHome"
                          style={styles.backHomeButton}
                          onPress={this.handleBack}
                        >
                          <Text
                            style={[styles.text, styles.textBackHomeButton]}
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
            <View style={styles.datePickerContainer}>
              <DateRangePicker
                open={this.state.showDateSelector}
                onChange={this.setDates}
                endDate={moment(Number(moment(this.state.endDate)) + 86400000)}
                startDate={moment(this.state.startDate)}
                displayedDate={this.state.displayedDate}
                selectedStyle={styles.selectedDate}
                range
              >
                <></>
              </DateRangePicker>
            </View>
            <TouchableOpacity
              testID="closeCalendar"
              style={styles.cancelDateSelectionButton}
              onPress={() => this.setState({ showDateSelector: false })}
            >
              <Icon name="x" size={30} />
            </TouchableOpacity>
          </>
        )}
        {this.state.isFetching && (
          <View style={styles.activityIndicator}>
            <ActivityIndicator size={'large'} color="#4949EE" />
          </View>
        )}

        {this.renderDeleteEventModal()}
        {/* Customizable Area End */}
      </>
      //Merge Engine End DefaultContainer
    );
  }
}

// Customizable Area Start
const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: '#fcfcff',
  },
  container: {
    flex: 1,
    backgroundColor: '#FCFCFF',
  },
  secondaryContainer: {
    flex: 1,
    paddingBottom: 16,
    paddingHorizontal: 16,
    paddingTop: 10,
    overflow: 'visible',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    overflow: 'visible',
  },
  backArrowContainer: {
    width: 20,
  },
  backArrow: {
    width: 12,
    left: 0,
    resizeMode: 'contain',
  },
  screenTitle: {
    fontWeight: '700',
    fontSize: 24,
    color: '#0F172A',
    position: 'absolute',
    textAlign: 'center',
    width: '100%',
  },
  text: {
    fontFamily: 'OpenSans',
    color: colors(false).text,
  },
  textNoEvents: {
    alignSelf: 'center',
    fontSize: 15,
    textAlign: 'center',
    marginVertical: 15,
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'visible',
  },
  notificationIconContainer: {
    width: 25,
    height: 25,
    marginRight: 10,
    justifyContent: 'center',
    overflow: 'visible',
  },
  notificationIcon: {
    width: '100%',
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  notificationWrapper: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 2,
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
  hamburger: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
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
    backgroundColor: '#3333cc',
  },
  dateSelectorButton: {
    width: '100%',
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: '#C5C5FF',
    color: colors(false).text,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    height: 50,
    marginBottom: 10,
  },
  dateSelectorButtonText: {
    alignSelf: 'center',
  },
  calendarIcon: {
    width: 20,
    resizeMode: 'contain',
  },
  noEventsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noEventsIcon: {
    height: 100,
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  backHomeButton: {
    width: '100%',
    backgroundColor: '#3333CC',
    padding: 15,
    borderRadius: 10,
    marginTop: 25,
    margin: 16,
  },
  textBackHomeButton: {
    color: colors(false).white,
    fontWeight: '700',
    fontSize: 18,
    alignSelf: 'center',
  },
  activityIndicator: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#ffffffdd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  showGroupContainer: {
    marginVertical: 10,
  },
  showGroupDate: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  showCard: {
    width: '50%',
    aspectRatio: 154 / 218,
    marginVertical: 10,
  },
  showCardImage: {
    width: '95%',
    height: '100%',
    borderRadius: 5,
  },
  filterContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flexDirection: 'row',
  },
  downArrow: {
    alignSelf: 'center',
    marginLeft: 15,
    width: 12,
    aspectRatio: 38 / 23,
    backgroundColor: 'white',
    resizeMode: 'contain',
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
    backgroundColor: colors(false).background,
    alignSelf: 'flex-start',
    padding: 3,
    borderRadius: 5,
  },
  deleteIconContainer: {
    position: 'absolute',
    backgroundColor: '#0F172A66',
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
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
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
    color: '#0F172A',
    fontWeight: '600',
  },
  postOptionsDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 10,
  },
  modalParentView: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#33415580',
  },
  modalContainerView: {
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
  textDeleteHeading: {
    fontWeight: '700',
    fontSize: 26,
    lineHeight: 28,
    marginBottom: 10,
    marginTop: 25,
    color: '#0F172A',
  },
  textDelete: {
    fontSize: 18,
  },
  deleteButtonContainer: {
    backgroundColor: '#3333CC',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
  },
  textDeleteButton: {
    color: colors(false).white,
    fontWeight: '700',
    fontSize: 18,
    alignSelf: 'center',
  },
  keepButtonContainer: {
    backgroundColor: 'transparent',
  },
  textKeepButton: {
    color: '#3333CC',
  },
  disablePopupIconContainer: {
    position: 'absolute',
    right: 20,
    top: 20,
  },
  button: {
    borderRadius: 10,
    alignItems: 'center',
    padding: 10,
    width: '50%',
  },
  input: {
    flex: 1,
    height: 47,
    fontSize: 17,
    marginLeft: 10,
    color: '#334166',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 15,
    paddingVertical: 2,
    paddingHorizontal: 10,
    marginVertical: 10,
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
    elevation: 5,
  },
  welcomeToPopupText: {
    textAlign: 'center',
    fontSize: 20,
    lineHeight: 28,
    marginTop: 10,
    color: '#334166',
  },
  localShowsPopupText: {
    fontWeight: '700',
    fontSize: 28,
    lineHeight: 32,
    bottom: '5%',
    textAlign: 'center',
    color: '#3333CC',
    marginTop: 10,
  },
  loginFirstPopupText: {
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: '5%',
    fontWeight: '400',
    fontSize: 16,
    color: '#334166',
  },
  createAccountPopupText: {
    color: '#3333CC',
    fontWeight: '700',
    lineHeight: 24,
    marginBottom: '4%',
    fontSize: 16,
    textAlign: 'center',
  },
  loginBtnPopupText: {
    backgroundColor: '#3333CC',
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
    width: 50,
    height: 50,
    backgroundColor: '#ffffff',
    zIndex: 2147483647,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 10,
    alignSelf: 'center',
    backgroundColor: '#E2E8F0',
    marginVertical: 20,
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
// Customizable Area End

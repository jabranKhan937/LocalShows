import React from 'react';

// Customizable Area Start
import {
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  View,
  ScrollView,
  FlatList,
  TextInput,
  ActivityIndicator,
  TouchableWithoutFeedback,
  TextStyle,
  ViewStyle,
} from 'react-native';

import {colors} from '../../utilities/src/Colors';
import {leftArrow} from '../../email-account-registration/src/assets';
import {defaultProfile} from './assets';
import {deviceHeight} from '../../../framework/src/Utilities';
import FastImage from '../../../components/src/SafeFastImage';
import {DrawerActions} from '@react-navigation/native';

// Customizable Area End

import NotificationsController, {
  Props,
  configJSON,
} from './NotificationsController';

export default class Notifications extends NotificationsController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }

  // Customizable Area Start
  renderHeader = () => {
    return (
      <View style={styles.pageHeader}>
        <TouchableOpacity
          testID="backButton"
          style={styles.backButton}
          onPress={() => {
            this.props.navigation.goBack();
          }}>
          <Image source={leftArrow} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={[styles.heading, styles.titleHeader]}>
          {configJSON.notifications}
        </Text>
        <TouchableOpacity
          testID="hamburgerButton"
          onPress={() => {
            // Notifications screen is now inside Drawer navigator, so openDrawer is available
            if (this.props.navigation.openDrawer) {
              this.props.navigation.openDrawer();
            } else {
              this.props.navigation.dispatch(DrawerActions.openDrawer());
            }
          }}
          style={styles.backButton}>
          <Image
            style={{height: 20, width: 20, resizeMode: 'contain'}}
            source={require('../../../mobile/assets/images/Vector.png')}
          />
        </TouchableOpacity>
      </View>
    );
  };

  renderSearch = () => {
    return (
      <View style={styles.inputContainer}>
        <Image
          source={require('../../../mobile/assets/images/image_search.png')}
          style={{height: 20, width: 20, resizeMode: 'contain'}}
        />
        <TextInput
          testID="searchTextInput"
          style={styles.input}
          placeholderTextColor="#334166"
          placeholder="Search"
          value={this.state.searchInput}
          onChangeText={this.filterData}
        />
      </View>
    );
  };

  renderTabs = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          width: '95%',
          borderRadius: 10,
          alignSelf: 'center',
          backgroundColor: '#E2E8F0',
          marginVertical: 20,
        }}>
        <TouchableOpacity
          testID="youTab"
          style={this.getYouButtonStyle(this.state.activeTab)}
          onPress={() => this.handleTabSwitch('you')}>
          <Text style={this.getYouTextStyle(this.state.activeTab)}>
            {configJSON.youText}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          testID="yourFriendTab"
          style={this.getYourFriendButtonStyle(this.state.activeTab)}
          onPress={() => this.handleTabSwitch('your')}>
          <Text style={this.getYourFriendTextStyle(this.state.activeTab)}>
            {configJSON.yourFriendsText}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  getYouButtonStyle = (activeTab: string) => ({
    ...styles.button,
    borderRadius: 10,
    backgroundColor: activeTab === 'you' ? '#4949EE' : 'transparent',
  });

  getYouTextStyle = (activeTab: string) =>
    ({
      fontSize: 12,
      fontWeight: activeTab === 'you' ? '700' : '400',
      color: activeTab === 'you' ? 'white' : '#334155',
    } as TextStyle);

  getYourFriendButtonStyle = (activeTab: string) =>
    ({
      ...styles.button,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: activeTab === 'your' ? '#4949EE' : 'transparent',
    } as ViewStyle);

  getYourFriendTextStyle = (activeTab: string) =>
    ({
      fontSize: 12,
      textAlign: 'center',
      fontWeight: activeTab === 'your' ? '700' : '400',
      color: activeTab === 'your' ? 'white' : '#334155',
    } as TextStyle);

  renderNotificationItem = ({item}: {item: any}) => {
    const data = item.attributes;
    const isFollowNotification =
      data.notification_type === 'follow' ||
      data.notification_type === 'follow_back';

    const showConfirmRemoveBtn =
      isFollowNotification &&
      !data.is_confirm &&
      (data.follow_back === null || data.follow_back === '');

    const showFollowBackBtn =
      isFollowNotification && data.is_confirm && data.follow_back === 'true';

    const showPendingBtn =
      isFollowNotification && data.is_confirm && data.follow_back === 'pending';

    const removeAllBtn =
      isFollowNotification &&
      data.is_confirm &&
      data.follow_back === 'following';

    return (
      <TouchableWithoutFeedback
        testID="notificationItem"
        onPress={() => this.handleNotificationPress(data, item)}>
        <View style={styles.youRenderItem}>
          {this.renderProfileImage(
            isFollowNotification,
            data.profile_image,
            item,
          )}
          <View style={{flex: 0.7, justifyContent: 'center'}}>
            {this.renderNotificationTitle(data)}
            {!removeAllBtn && (
              <>
                {showConfirmRemoveBtn &&
                  this.renderFollowUnconfirmedActions(item)}
                {(showFollowBackBtn || showPendingBtn) &&
                  this.renderFollowConfirmedActions(item, showPendingBtn)}
              </>
            )}
          </View>
          {this.renderDateTime(data.created_at, data.is_read)}
        </View>
      </TouchableWithoutFeedback>
    );
  };

  renderProfileImage = (
    isFollowNotification: boolean,
    profile_image: string,
    item: any,
  ) => {
    return (
      <TouchableOpacity
        onPress={() => {
          if (item?.attributes?.user_id) {
            this.handleUserProfileNav(
              item.attributes.user_id,
              item.attributes.account_type,
            );
          } else {
            this.handleUserProfileNav(
              item.attributes.account_id,
              item.attributes.account_type,
            );
          }
        }}
        style={styles.profileView}>
        <FastImage
          source={
            isFollowNotification && profile_image !== ''
              ? {
                  uri: profile_image,
                  priority: FastImage.priority.high,
                }
              : defaultProfile
          }
          style={styles.profileImage}
          resizeMode={FastImage.resizeMode.cover}
        />
      </TouchableOpacity>
    );
  };

  renderDateTime = (created_at: string, is_read: boolean) => {
    return (
      <View style={styles.dateView}>
        <Text style={styles.date}>{this.timeSince(created_at)}</Text>
        {!is_read && <View style={styles.dot} />}
      </View>
    );
  };

  renderNotificationTitle = (data: any) => {
    const {user_name, message} = data;
    return (
      <Text style={styles.youNotificationTitle}>
        {user_name !== null
          ? this.renderMessageWithUserName(message, user_name)
          : message.trim()}
      </Text>
    );
  };

  renderMessageWithUserName = (message: string, userName: string) => {
    return message.split(userName).map((part, index) => (
      <Text key={index}>
        {index > 0 && (
          <Text style={{fontWeight: '700'}}>
            {userName.replace(/ +/g, ' ').trim()}
          </Text>
        )}
        {part}
      </Text>
    ));
  };

  renderFollowUnconfirmedActions = (item: any) => {
    return (
      <View style={{flexDirection: 'row', marginTop: 20}}>
        <TouchableOpacity
          testID="positiveButton"
          style={styles.confirmRemoveBtn}
          onPress={() => this.confirmRemoveRequestAPI(item, false, true)}>
          <Text style={styles.confirmTxt}>{configJSON.confirmText}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          testID="negativeButton"
          style={[
            styles.confirmRemoveBtn,
            {marginLeft: 15, backgroundColor: '#EDEDFF'},
          ]}
          onPress={() => this.confirmRemoveRequestAPI(item, true, false)}>
          <Text style={[styles.confirmTxt, {color: '#4949EE'}]}>
            {configJSON.removeText}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  renderFollowConfirmedActions = (item: any, showPendingBtn: boolean) => {
    return (
      <TouchableOpacity
        testID="followBackButton"
        style={[styles.confirmRemoveBtn, {marginTop: 20, width: '60%'}]}
        onPress={() =>
          !showPendingBtn && this.followBackRequestAPI(item.attributes.user_id)
        }>
        <Text style={[styles.confirmTxt, {textAlign: 'center'}]}>
          {showPendingBtn ? configJSON.pendingText : configJSON.followBackText}
        </Text>
      </TouchableOpacity>
    );
  };

  renderEmptyListComponent = () => {
    return (
      <View style={styles.emptyView}>
        <Text style={styles.noRecordFound}>{configJSON.noRecordFoundText}</Text>
      </View>
    );
  };
  // Customizable Area End

  render() {
    return (
      // Customizable Area Start
      <View style={styles.container}>
        {/* Customizable Area Start */}
        {/* Merge Engine UI Engine Code */}
        <>
          {this.renderHeader()}
          {this.renderSearch()}
          {this.renderTabs()}
          <FlatList
            testID="youNotificationList"
            data={
              this.state.searchInput === ''
                ? this.state.notificationList
                : this.state.filteredNotificationList
            }
            style={styles.youFlatlist}
            renderItem={this.renderNotificationItem}
            keyExtractor={item => item.id}
            ListEmptyComponent={this.renderEmptyListComponent}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.flatListContent}
          />
          {this.state.isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size={'large'} color="#4949EE" />
            </View>
          )}
        </>
        {/* Merge Engine UI Engine Code */}
        {/* Customizable Area End */}
      </View>
      // Customizable Area End
    );
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
    backgroundColor: '#ffffffff',
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 5,
  },
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  backButton: {},
  backIcon: {
    width: 12,
    left: 0,
    resizeMode: 'contain',
  },
  titleHeader: {
    fontWeight: '700',
    fontSize: 24,
  },
  drawerIcon: {
    width: 25,
    height: 16,
    resizeMode: 'contain',
    marginRight: 5,
  },
  heading: {
    color: colors(false).text,
    fontSize: 14,
    fontWeight: '400',
    marginHorizontal: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 15,
    paddingVertical: 2,
    paddingHorizontal: 8,
    margin: 10,
    backgroundColor: '#E2E8F0',
  },
  input: {
    flex: 1,
    height: 47,
    fontSize: 18,
    marginLeft: 10,
    color: '#334166',
  },
  button: {
    borderRadius: 10,
    alignItems: 'center',
    padding: 10,
    width: '50%',
  },
  profileView: {
    width: 44,
    height: 44,
    borderRadius: 50,
    overflow: 'hidden',
    borderColor: '#C5C5FF',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 44,
    height: 44,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 10,
    backgroundColor: '#34D399',
    alignSelf: 'flex-end',
    marginTop: 10,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#ffffffdd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  youFlatlist: {
    marginHorizontal: 10,
    flex: 1,
  },
  youRenderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  youNotificationTitle: {
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 22,
    color: '#334155',
  },
  confirmRemoveBtn: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#4949EE',
    borderRadius: 10,
  },
  confirmTxt: {
    fontWeight: '700',
    fontSize: 16,
    color: 'white',
  },
  date: {
    textAlign: 'right',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 22,
    color: '#334155',
  },
  emptyView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  noRecordFound: {
    fontSize: 14,
    fontWeight: '400',
    color: '#334155',
  },
  dateView: {
    flex: 0.2,
    justifyContent: 'flex-start',
  },
  flatListContent: {
    paddingBottom: 20,
  },
});
// Customizable Area End

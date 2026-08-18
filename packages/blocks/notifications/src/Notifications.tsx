import React from 'react';

// Customizable Area Start
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  TextInput,
  ActivityIndicator,
  TouchableWithoutFeedback,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';

import { lightTheme, redesignTheme } from '../../utilities/src/Colors';
import FastImage from '../../../components/src/SafeFastImage';
import { DrawerActions } from '@react-navigation/native';

// Customizable Area End

import NotificationsController, {
  Props,
  configJSON,
} from './NotificationsController';

type NotificationsTheme = typeof redesignTheme;

export default class Notifications extends NotificationsController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }

  // Customizable Area Start
  get styles() {
    return this.state.isDarkMode
      ? darkNotificationStyles
      : lightNotificationStyles;
  }

  renderHeader = () => {
    const theme = this.getNotificationsTheme();
    return (
      <View style={this.styles.pageHeader}>
        <TouchableOpacity
          testID="backButton"
          style={this.styles.headerCircleBtn}
          onPress={() => {
            this.props.navigation.goBack();
          }}
          activeOpacity={0.8}
        >
          <Icon name="arrow-left" size={18} color={theme.foreground} />
        </TouchableOpacity>
        <Text style={this.styles.titleHeader}>{configJSON.notifications}</Text>
        <TouchableOpacity
          testID="hamburgerButton"
          onPress={() => {
            if (this.props.navigation.openDrawer) {
              this.props.navigation.openDrawer();
            } else {
              this.props.navigation.dispatch(DrawerActions.openDrawer());
            }
          }}
          style={this.styles.headerCircleBtn}
          activeOpacity={0.8}
        >
          <Icon name="menu" size={18} color={theme.foreground} />
        </TouchableOpacity>
      </View>
    );
  };

  renderSearch = () => {
    const theme = this.getNotificationsTheme();
    return (
      <View style={this.styles.inputContainer}>
        <Icon name="search" size={16} color={theme.muted} />
        <TextInput
          testID="searchTextInput"
          style={this.styles.input}
          placeholderTextColor={theme.muted}
          placeholder="Search"
          value={this.state.searchInput}
          onChangeText={this.filterData}
        />
      </View>
    );
  };

  renderTabs = () => {
    return (
      <View style={this.styles.tabsWrap}>
        <TouchableOpacity
          testID="youTab"
          style={this.getYouButtonStyle(this.state.activeTab)}
          onPress={() => this.handleTabSwitch('you')}
          activeOpacity={0.85}
        >
          <Text style={this.getYouTextStyle(this.state.activeTab)}>
            {configJSON.youText}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          testID="yourFriendTab"
          style={this.getYourFriendButtonStyle(this.state.activeTab)}
          onPress={() => this.handleTabSwitch('your')}
          activeOpacity={0.85}
        >
          <Text style={this.getYourFriendTextStyle(this.state.activeTab)}>
            {configJSON.yourFriendsText}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  getYouButtonStyle = (activeTab: string) =>
    activeTab === 'you'
      ? [this.styles.button, this.styles.tabButtonActive]
      : [this.styles.button, this.styles.tabButtonInactive];

  getYouTextStyle = (activeTab: string) =>
    activeTab === 'you' ? this.styles.tabTextActive : this.styles.tabTextInactive;

  getYourFriendButtonStyle = (activeTab: string) =>
    activeTab === 'your'
      ? [this.styles.button, this.styles.tabButtonActive]
      : [this.styles.button, this.styles.tabButtonInactive];

  getYourFriendTextStyle = (activeTab: string) =>
    activeTab === 'your'
      ? this.styles.tabTextActive
      : this.styles.tabTextInactive;

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
        <View style={this.styles.youRenderItem}>
          {this.renderProfileImage(
            isFollowNotification,
            data.profile_image,
            item,
          )}
          <View style={this.styles.itemBody}>
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
    const theme = this.getNotificationsTheme();
    const photoUri =
      typeof profile_image === 'string' ? profile_image.trim() : '';
    const hasPhoto = Boolean(photoUri);
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
        style={this.styles.profileView}>
        {hasPhoto ? (
          <FastImage
            source={{
              uri: photoUri,
              priority: FastImage.priority.high,
            }}
            style={this.styles.profileImage}
            resizeMode={FastImage.resizeMode.cover}
          />
        ) : (
          <Icon name="user" size={20} color={theme.muted} />
        )}
      </TouchableOpacity>
    );
  };

  renderDateTime = (created_at: string, is_read: boolean) => {
    return (
      <View style={this.styles.dateView}>
        <Text style={this.styles.date}>{this.timeSince(created_at)}</Text>
        {!is_read && <View style={this.styles.dot} />}
      </View>
    );
  };

  renderNotificationTitle = (data: any) => {
    const {user_name, message} = data;
    return (
      <Text style={this.styles.youNotificationTitle}>
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
          <Text style={this.styles.userNameHighlight}>
            {userName.replace(/ +/g, ' ').trim()}
          </Text>
        )}
        {part}
      </Text>
    ));
  };

  renderFollowUnconfirmedActions = (item: any) => {
    return (
      <View style={this.styles.followActionsRow}>
        <TouchableOpacity
          testID="positiveButton"
          style={this.styles.confirmRemoveBtn}
          onPress={() => this.confirmRemoveRequestAPI(item, false, true)}>
          <Text style={this.styles.confirmTxt}>{configJSON.confirmText}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          testID="negativeButton"
          style={[this.styles.confirmRemoveBtn, this.styles.removeBtn]}
          onPress={() => this.confirmRemoveRequestAPI(item, true, false)}>
          <Text style={[this.styles.confirmTxt, this.styles.removeTxt]}>
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
        style={[this.styles.confirmRemoveBtn, this.styles.followBackBtn]}
        onPress={() =>
          !showPendingBtn && this.followBackRequestAPI(item.attributes.user_id)
        }>
        <Text style={[this.styles.confirmTxt, {textAlign: 'center'}]}>
          {showPendingBtn ? configJSON.pendingText : configJSON.followBackText}
        </Text>
      </TouchableOpacity>
    );
  };

  renderEmptyListComponent = () => {
    return (
      <View style={this.styles.emptyView}>
        <Text style={this.styles.noRecordFound}>{configJSON.noRecordFoundText}</Text>
      </View>
    );
  };
  // Customizable Area End

  render() {
    const theme = this.getNotificationsTheme();
    return (
      // Customizable Area Start
      <SafeAreaView style={this.styles.container} edges={['top']}>
        {/* Customizable Area Start */}
        <StatusBar
          barStyle={this.state.isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={theme.background}
        />
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
          style={this.styles.youFlatlist}
          renderItem={this.renderNotificationItem}
          keyExtractor={item => item.id}
          ListEmptyComponent={this.renderEmptyListComponent}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={this.styles.flatListContent}
        />
        {this.state.isLoading && (
          <View style={this.styles.loadingContainer}>
            <ActivityIndicator size={'large'} color={theme.primary} />
          </View>
        )}
        {/* Customizable Area End */}
      </SafeAreaView>
      // Customizable Area End
    );
  }
}

// Customizable Area Start
const createNotificationStyles = (theme: NotificationsTheme) => {
  const isLightTheme = theme.background === lightTheme.background;
  return StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
      maxWidth: 650,
      alignSelf: 'center',
      backgroundColor: theme.background,
    },
    pageHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      height: 56,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.border,
      backgroundColor: theme.background,
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
    titleHeader: {
      fontWeight: '900',
      fontSize: 18,
      letterSpacing: 0.6,
      color: theme.foreground,
      textTransform: 'uppercase',
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 16,
      paddingVertical: 4,
      paddingHorizontal: 12,
      marginHorizontal: 16,
      marginTop: 16,
      backgroundColor: theme.input,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border,
    },
    input: {
      flex: 1,
      height: 44,
      fontSize: 16,
      marginLeft: 10,
      color: theme.foreground,
    },
    tabsWrap: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginHorizontal: 16,
      borderRadius: 14,
      alignSelf: 'stretch',
      backgroundColor: theme.input,
      marginTop: 16,
      marginBottom: 12,
      padding: 4,
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
    profileView: {
      width: 44,
      height: 44,
      borderRadius: 22,
      overflow: 'hidden',
      borderColor: theme.primary,
      borderWidth: 2,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: isLightTheme ? theme.input : theme.card,
    },
    profileImage: {
      width: 44,
      height: 44,
    },
    dot: {
      width: 10,
      height: 10,
      borderRadius: 10,
      backgroundColor: theme.primary,
      alignSelf: 'flex-end',
      marginTop: 10,
    },
    loadingContainer: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: isLightTheme
        ? 'rgba(255, 255, 255, 0.72)'
        : 'rgba(8, 8, 15, 0.72)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    youFlatlist: {
      flex: 1,
    },
    youRenderItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      backgroundColor: theme.card,
      borderRadius: 16,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border,
      padding: 14,
      marginBottom: 12,
      ...Platform.select({
        ios: {
          shadowColor: isLightTheme ? '#000000' : '#FFFFFF',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: isLightTheme ? 0.1 : 0.08,
          shadowRadius: 12,
        },
        android: {
          elevation: isLightTheme ? 4 : 3,
        },
      }),
    },
    itemBody: {
      flex: 0.7,
      justifyContent: 'center',
      paddingHorizontal: 10,
    },
    youNotificationTitle: {
      fontWeight: '400',
      fontSize: 14,
      lineHeight: 22,
      color: theme.foreground,
    },
    userNameHighlight: {
      fontWeight: '700',
      color: theme.foreground,
    },
    confirmRemoveBtn: {
      paddingVertical: 10,
      paddingHorizontal: 15,
      backgroundColor: theme.primary,
      borderRadius: 10,
    },
    removeBtn: {
      marginLeft: 12,
      backgroundColor: theme.primarySoft,
    },
    followBackBtn: {
      marginTop: 16,
      width: '60%',
    },
    followActionsRow: {
      flexDirection: 'row',
      marginTop: 16,
    },
    confirmTxt: {
      fontWeight: '700',
      fontSize: 16,
      color: '#FFFFFF',
    },
    removeTxt: {
      color: theme.primary,
    },
    date: {
      textAlign: 'right',
      fontWeight: '400',
      fontSize: 12,
      lineHeight: 22,
      color: theme.muted,
    },
    emptyView: {
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 48,
    },
    noRecordFound: {
      fontSize: 14,
      fontWeight: '400',
      color: theme.muted,
    },
    dateView: {
      flex: 0.2,
      justifyContent: 'flex-start',
    },
    flatListContent: {
      paddingHorizontal: 16,
      paddingBottom: 36,
      paddingTop: 4,
    },
  });
};

const darkNotificationStyles = createNotificationStyles(redesignTheme);
const lightNotificationStyles = createNotificationStyles(lightTheme);
// Customizable Area End

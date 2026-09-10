import React from "react";

// Customizable Area Start
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  StatusBar,
  ActivityIndicator,
  Modal,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Feather";
import { DrawerActions } from "@react-navigation/native";
import { lightTheme, redesignTheme } from "../../utilities/src/Colors";
import Svg, { Path } from "react-native-svg";
import FastImage from "../../../components/src/SafeFastImage"

// Merge Engine - import assets - Start
// Merge Engine - import assets - End

// Merge Engine - Artboard Dimension  - Start
// Merge Engine - Artboard Dimension  - End
// Customizable Area End

import Likeapost2Controller, {
  Props,
  configJSON,
} from "./Likeapost2Controller";

type LikesTheme = typeof redesignTheme;

export default class Likeapost2 extends Likeapost2Controller {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }

  // Customizable Area Start
  get styles() {
    return this.state.isDarkMode ? darkLikesStyles : lightLikesStyles;
  }

  renderLoading = () => {
    const theme = this.getLikesTheme();
    return (
      <View style={this.styles.loadingContainer}>
        <ActivityIndicator size={'large'} color={theme.primary} />
      </View>
    )
  }

  renderContent() {
    return (
      <View style={this.styles.content}>
        {this.renderHeader()}
        {this.renderSearch()}
        <FlatList
          testID="likesList"
          data={this.filterList(this.state.likedUsersList)}
          renderItem={this.renderListItem}
          keyExtractor={item => item.id}
          ListEmptyComponent={this.renderEmptyListComponent}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={this.styles.listContent}
        />
      </View>
    );
  }

  getListToRender() {
    return this.state.searchUserText === "" ? this.state.likedUsersList : this.state.filteredUserList;
  }

  renderListItem = ({ item }: { item: any }) => {
    const name = item.attributes.first_name || item.attributes.name || "";
    const { follow, profile_image, account_type, photo } = item.attributes;
    const img = (account_type === 'Band' || account_type === 'Artist' ? photo : profile_image) || "";
    const followFollowingText = follow === true ? configJSON.unfollow : configJSON.follow;

    return (
      <View style={this.styles.item}>
        <View style={this.styles.profileRow}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              this.handleNavigationUserProfile(item)
            }}
            testID="profile"
            style={this.styles.profileView}>
            {img.trim() ? (
              <FastImage
                source={{
                  uri: img,
                  priority: FastImage.priority.high
                }}
                style={this.styles.profileImage}
                resizeMode={FastImage.resizeMode.cover}
              />
            ) : (
              <Icon name="user" size={20} color={this.getLikesTheme().muted} />
            )}
          </TouchableOpacity>
          <Text style={this.styles.nameTxt}>{name}</Text>
        </View>
        {item.id !== this.state.userID && this.renderFollowButton(item, followFollowingText, follow)}
      </View>
    );
  }

  renderFollowButton(item: any, followFollowingText: any, follow: boolean) {
    return (
      <TouchableOpacity
        testID="followBtn"
        style={[
          this.styles.followButton,
          follow ? this.styles.unfollowButton : this.styles.followButtonActive,
        ]}
        onPress={() => this.handleFollowPress(item)}
      >
        <Text
          style={[
            this.styles.followButtonText,
            follow ? this.styles.unfollowButtonText : this.styles.followButtonActiveText,
          ]}
        >
          {followFollowingText}
        </Text>
      </TouchableOpacity>
    );
  }

  renderHeader() {
    const theme = this.getLikesTheme();
    return (
      <View style={this.styles.headerView}>
        <TouchableOpacity
          testID="backBtn"
          style={this.styles.headerCircleBtn}
          onPress={() => this.props.navigation.goBack()}
          activeOpacity={0.8}
        >
          <Icon name="arrow-left" size={18} color={theme.foreground} />
        </TouchableOpacity>
        <Text style={this.styles.likeTitle}>{configJSON.likesTitle}</Text>
        <TouchableOpacity
          testID="hamburgerBtn"
          style={this.styles.headerCircleBtn}
          onPress={() => {
            if (this.props.navigation.openDrawer) {
              this.props.navigation.openDrawer();
            } else {
              this.props.navigation.dispatch(DrawerActions.openDrawer());
            }
          }}
          activeOpacity={0.8}
        >
          <Icon name="menu" size={18} color={theme.foreground} />
        </TouchableOpacity>
      </View>
    );
  }

  renderSearch() {
    const { searchUserText } = this.state;
    const theme = this.getLikesTheme();

    return (
      <View style={this.styles.searchContainer}>
        <Icon name="search" size={16} color={theme.muted} />
        <TextInput
          testID="searchTxt"
          style={this.styles.searchInput}
          placeholderTextColor={theme.muted}
          placeholder="Search"
          value={searchUserText}
          onChangeText={(searchUserText) => this.handleSearchTextChange(searchUserText)} />
      </View>
    );
  }

  renderEmptyListComponent = () => {
    return (
      <View style={this.styles.emptyComponentView}>
        <Text style={this.styles.emptyComponentText}>
          {configJSON.noRecordFoundText}
        </Text>
      </View>
    );
  }

  renderLoginPopup() {
    const { loginPopup } = this.state;

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={loginPopup}
        onRequestClose={this.hideLoginPopup}>
        <View style={this.styles.centeredViewModal}>
          <TouchableWithoutFeedback onPress={this.hideLoginPopup}>
            <View style={{ flex: 1 }} />
          </TouchableWithoutFeedback>
          <View style={this.styles.viewModal}>
            {this.renderCloseButton()}
            <Text style={this.styles.welcomeToModal}>{configJSON.welcomeTo}</Text>
            <Text style={this.styles.localShowsModal}>{configJSON.localShows}</Text>
            <Text style={this.styles.loginFirstModal}>{configJSON.loginFirst}</Text>
            <TouchableOpacity
              testID="createAccountBtn"
              onPress={() => { this.navigateToLoginScreen("signup") }} >
              <Text style={this.styles.createAccountModal}>{configJSON.createAccount}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              testID="loginBtn"
              style={this.styles.loginBtnModal}
              onPress={() => { this.navigateToLoginScreen("login") }} >
              <Text style={this.styles.loginTxtModal}>{configJSON.login}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  renderCloseButton() {
    const theme = this.getLikesTheme();
    return (
      <TouchableWithoutFeedback
        testID="popupCloseButton"
        onPress={this.hideLoginPopup}>
        <Svg
          style={this.styles.closeBtn}
          width={14}
          height={14}
          viewBox="0 0 14 14"
          fill={theme.foreground}
        >
          <Path
            d="M13.3.71a.996.996 0 00-1.41 0L7 5.59 2.11.7A.996.996 0 10.7 2.11L5.59 7 .7 11.89a.996.996 0 101.41 1.41L7 8.41l4.89 4.89a.996.996 0 101.41-1.41L8.41 7l4.89-4.89c.38-.38.38-1.02 0-1.4z"
            fill={theme.foreground}
          />
        </Svg>
      </TouchableWithoutFeedback>
    );
  }
  // Customizable Area End

  render() {
    // Customizable Area Start
    // Merge Engine - render - Start
    const { isLoading } = this.state;
    const theme = this.getLikesTheme();

    return (
      <TouchableWithoutFeedback
        testID="containerBtn"
        disabled={true}
        onPress={this.hideKeyboard}>
        <SafeAreaView style={this.styles.container} edges={["top"]}>
          <StatusBar
            backgroundColor={theme.background}
            barStyle={this.state.isDarkMode ? "light-content" : "dark-content"}
          />
          {isLoading ? this.renderLoading() : this.renderContent()}
          {this.renderLoginPopup()}
        </SafeAreaView>
      </TouchableWithoutFeedback>
    );
    // Merge Engine - render - End
    // Customizable Area End
  }
}

// Customizable Area Start
const createLikesStyles = (theme: LikesTheme) => {
  const isLightTheme = theme.background === lightTheme.background;
  return StyleSheet.create({
    container: {
      flex: 1,
      width: "100%",
      maxWidth: 650,
      alignSelf: "center",
      backgroundColor: theme.background,
    },
    content: {
      flex: 1,
    },
    headerView: {
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
      alignItems: "center",
      justifyContent: "center",
    },
    likeTitle: {
      fontWeight: '900',
      fontSize: 16,
      letterSpacing: 0.5,
      color: theme.foreground,
      textTransform: 'uppercase',
      flex: 1,
      textAlign: 'center',
      paddingHorizontal: 8,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 16,
      paddingVertical: 4,
      paddingHorizontal: 12,
      marginHorizontal: 16,
      marginTop: 16,
      marginBottom: 8,
      backgroundColor: theme.input,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border,
    },
    searchInput: {
      flex: 1,
      height: 44,
      fontSize: 16,
      marginLeft: 10,
      color: theme.foreground,
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
    profileRow: {
      flexDirection: "row",
      flex: 1,
      alignItems: "center",
      paddingRight: 12,
    },
    nameTxt: {
      fontSize: 14,
      fontWeight: '700',
      color: theme.foreground,
      marginLeft: 12,
      flexShrink: 1,
    },
    item: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: theme.card,
      borderRadius: 16,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border,
      padding: 14,
      marginBottom: 12,
      ...Platform.select({
        ios: {
          shadowColor: isLightTheme ? "#000000" : "#FFFFFF",
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: isLightTheme ? 0.1 : 0.08,
          shadowRadius: 12,
        },
        android: {
          elevation: isLightTheme ? 4 : 3,
        },
      }),
    },
    listContent: {
      paddingHorizontal: 16,
      paddingBottom: 36,
      paddingTop: 8,
    },
    emptyComponentView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 48,
    },
    emptyComponentText: {
      fontSize: 14,
      fontWeight: '400',
      color: theme.muted,
    },
    followButton: {
      paddingVertical: 8,
      paddingHorizontal: 14,
      borderRadius: 10,
      minWidth: 96,
      height: 40,
      alignSelf: 'center',
      justifyContent: 'center',
    },
    followButtonActive: {
      backgroundColor: theme.primary,
    },
    unfollowButton: {
      backgroundColor: theme.primarySoft,
    },
    followButtonText: {
      fontWeight: '700',
      fontSize: 14,
      textAlign: 'center',
    },
    followButtonActiveText: {
      color: '#FFFFFF',
    },
    unfollowButtonText: {
      color: theme.primary,
    },
    loadingContainer: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: isLightTheme
        ? "rgba(255, 255, 255, 0.72)"
        : "rgba(8, 8, 15, 0.72)",
      alignItems: "center",
      justifyContent: "center",
    },
    centeredViewModal: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(8, 8, 15, 0.72)',
    },
    viewModal: {
      justifyContent: 'flex-start',
      backgroundColor: theme.card,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border,
      paddingTop: 20,
      paddingHorizontal: 24,
      paddingBottom: 32,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: -2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 8,
    },
    closeBtn: {
      position: 'absolute',
      top: 20,
      right: 20,
      width: 20,
      height: 20,
    },
    welcomeToModal: {
      textAlign: 'center',
      fontSize: 16,
      lineHeight: 22,
      marginTop: 28,
      color: theme.muted,
    },
    localShowsModal: {
      fontWeight: '800',
      fontSize: 32,
      lineHeight: 38,
      textAlign: 'center',
      color: theme.primary,
      marginTop: 4,
      marginBottom: 12,
    },
    loginFirstModal: {
      textAlign: 'center',
      lineHeight: 22,
      marginBottom: 20,
      fontWeight: '400',
      fontSize: 15,
      color: theme.muted,
      paddingHorizontal: 12,
    },
    createAccountModal: {
      color: theme.primary,
      fontWeight: '700',
      lineHeight: 24,
      marginBottom: 20,
      fontSize: 16,
      textAlign: 'center',
    },
    loginBtnModal: {
      backgroundColor: theme.primary,
      borderRadius: 10,
      height: 56,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loginTxtModal: {
      color: '#FFFFFF',
      fontWeight: '700',
      textAlign: 'center',
      fontSize: 16,
    },
  });
};

const darkLikesStyles = createLikesStyles(redesignTheme);
const lightLikesStyles = createLikesStyles(lightTheme);
// Customizable Area End

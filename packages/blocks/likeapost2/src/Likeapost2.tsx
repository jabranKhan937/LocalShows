import React from "react";

// Customizable Area Start
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  TouchableWithoutFeedback,
  StatusBar,
  ActivityIndicator,
  Modal,
} from "react-native";
import { hamburger, leftArrow } from "../../events/src/assets";
import { colors } from "../../utilities/src/Colors";
import { defaultProfile } from "../../notifications/src/assets";
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

export default class Likeapost2 extends Likeapost2Controller {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }

  // Customizable Area Start
  renderLoading = () => {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={'large'} color="black" />
      </View>
    )
  }

  renderContent() {
    const list = this.getListToRender();

    return (
      <View style={{ paddingHorizontal: 16, flex: 1 }}>
        {this.renderHeader()}
        {this.renderSearch()}
        <FlatList
          testID="likesList"
          data={this.filterList(this.state.likedUsersList)}
          renderItem={this.renderListItem}
          keyExtractor={item => item.id}
          ListEmptyComponent={this.renderEmptyListComponent}
        />
      </View>
    );
  }

  getListToRender() {
    return this.state.searchUserText === "" ? this.state.likedUsersList : this.state.filteredUserList;
  }

  renderListItem = ({ item }: { item: any }) => {
    const name = item.attributes.first_name || "";
    const { follow, profile_image, account_type, photo } = item.attributes;
    const img = account_type === 'Band' || account_type === 'Artist' ? photo : profile_image
    const followFollowingText = follow === true ? configJSON.unfollow : configJSON.follow;
    const followBgColor = follow ? '#EDEDFF' : '#3333CC';
    const followTxtColor = follow ? "#3333CC" : '#EDEDFF';

    return (
      <View style={{ flexDirection: "row", justifyContent: 'space-between', marginBottom: 15, padding: 7 }}>
        <View
          style={{ flexDirection: "row", alignItems: 'center' }}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              this.handleNavigationUserProfile(item)
            }}
            testID="profile"
            style={styles.profileView}>
            <FastImage
              source={img.trim() ? {
                uri: img,
                priority: FastImage.priority.high
              } :
                defaultProfile
              }
              style={styles.profileImage}
              resizeMode={FastImage.resizeMode.cover}
            />
          </TouchableOpacity>
          <Text style={{ fontSize: 14, fontWeight: '700', color: colors(false).text, marginLeft: 15, }}>{name}</Text>
        </View>
        {item.id !== this.state.userID && this.renderFollowButton(item, followBgColor, followTxtColor, followFollowingText)}
      </View>
    );
  }

  renderFollowButton(item: any, followBgColor: any, followTxtColor: any, followFollowingText: any) {
    return (
      <TouchableOpacity
        testID="followBtn"
        style={[styles.followButton, { backgroundColor: followBgColor }]}
        onPress={() => this.handleFollowPress(item)}
      >
        <Text style={[styles.followButtonText, { color: followTxtColor }]}>
          {followFollowingText}
        </Text>
      </TouchableOpacity>
    );
  }

  renderHeader() {
    return (
      <View style={styles.headerView}>
        <Text style={styles.likeTitle}>{configJSON.likesTitle}</Text>
        <TouchableOpacity
          testID="backBtn"
          onPress={() => this.props.navigation.goBack()}>
          <Image source={leftArrow} style={{ width: 12, resizeMode: 'contain' }} />
        </TouchableOpacity>

        <TouchableOpacity
          testID="hamburgerBtn"
          onPress={() => this.props.navigation.openDrawer()}>
          <Image style={{ height: 20, width: 20, resizeMode: 'contain' }}
            source={require('../../../mobile/assets/images/Vector.png')} />
        </TouchableOpacity>
      </View>
    );
  }

  renderSearch() {
    const { searchUserText } = this.state;

    return (
      <View style={styles.searchContainer}>
        <Image
          source={require('../../../mobile/assets/images/image_search.png')}
          style={styles.backORHamburgerBtn} />
        <TextInput
          testID="searchTxt"
          style={styles.searchInput}
          placeholderTextColor="#334166"
          placeholder="Search"
          value={searchUserText}
          onChangeText={(searchUserText) => this.handleSearchTextChange(searchUserText)} />
      </View>
    );
  }

  renderEmptyListComponent() {
    return (
      <View style={styles.emptyComponentView}>
        <Text style={styles.emptyComponentText}>
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
        visible={loginPopup}>
        <View style={styles.centeredViewModal}>
          <View style={styles.viewModal}>
            {this.renderCloseButton()}
            <Text style={styles.welcomeToModal}>{configJSON.welcomeTo}</Text>
            <Text style={styles.localShowsModal}>{configJSON.localShows}</Text>
            <Text style={styles.loginFirstModal}>{configJSON.loginFirst}</Text>
            <TouchableOpacity
              testID="createAccountBtn"
              onPress={() => { this.navigateToLoginScreen("signup") }} >
              <Text style={styles.createAccountModal}>{configJSON.createAccount}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              testID="loginBtn"
              style={styles.loginBtnModal}
              onPress={() => { this.navigateToLoginScreen("login") }} >
              <Text style={styles.loginTxtModal}>{configJSON.login}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  renderCloseButton() {
    return (
      <TouchableWithoutFeedback
        testID="popupCloseButton"
        onPress={this.hideLoginPopup}>
        <Svg
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            width: 20,
            height: 20,
          }}
          width={14}
          height={14}
          viewBox="0 0 14 14"
          fill="#0F172A"
        >
          <Path
            d="M13.3.71a.996.996 0 00-1.41 0L7 5.59 2.11.7A.996.996 0 10.7 2.11L5.59 7 .7 11.89a.996.996 0 101.41 1.41L7 8.41l4.89 4.89a.996.996 0 101.41-1.41L8.41 7l4.89-4.89c.38-.38.38-1.02 0-1.4z"
            fill="#0F172A"
          />
        </Svg>
      </TouchableWithoutFeedback>
    );
  }
  // Customizable Area End

  render() {
    // Customizable Area Start
    // Merge Engine - render - Start
    const { isLoading, loginPopup } = this.state;
    const statusBarColor = loginPopup ? "#33415580" : "white";

    return (
      <TouchableWithoutFeedback
        testID="containerBtn"
        disabled={true}
        onPress={this.hideKeyboard}>
        <SafeAreaView style={styles.container}>
          <StatusBar backgroundColor={statusBarColor} barStyle="light-content" />
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
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffffff",
    paddingBottom: 16,
    paddingTop: 5
  },
  headerView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backORHamburgerBtn: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
  },
  likeTitle: {
    fontWeight: '700',
    fontSize: 24,
    color: '#334155',
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 15,
    paddingVertical: 2,
    paddingHorizontal: 8,
    marginVertical: 20,
    backgroundColor: '#E2E8F0',
  },
  searchInput: {
    flex: 1,
    height: 47,
    fontSize: 18,
    marginLeft: 10,
    color: '#334166',
  },
  profileView: {
    width: 50,
    height: 50,
    borderRadius: 50,
    overflow: 'hidden',
    borderColor: '#C5C5FF',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
  },
  emptyComponentView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 200,
  },
  emptyComponentText: {
    fontSize: 14,
    fontWeight: '400',
    color: "#334155",
  },
  followButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    width: '32%',
    height: 40,
    alignSelf: 'center',
  },
  followButtonText: {
    fontWeight: '700',
    fontSize: 14,
    textAlign: 'center'
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#ffffffdd',
    alignItems: "center",
    justifyContent: "center",
  },
  centeredViewModal: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingTop: 22,
    backgroundColor: '#33415580',
  },
  viewModal: {
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
  welcomeToModal: {
    textAlign: 'center',
    fontSize: 20,
    lineHeight: 28,
    marginTop: 10,
    color: "#334166",
  },
  localShowsModal: {
    fontWeight: '700',
    fontSize: 28,
    lineHeight: 32,
    bottom: '5%',
    textAlign: 'center',
    color: '#3333CC',
  },
  loginFirstModal: {
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: '5%',
    fontWeight: '400',
    fontSize: 16,
    color: '#334166',
  },
  createAccountModal: {
    color: '#3333CC',
    fontWeight: '700',
    lineHeight: 24,
    marginBottom: '4%',
    fontSize: 16,
    textAlign: 'center',
  },
  loginBtnModal: {
    backgroundColor: '#3333CC',
    borderRadius: 8,
    height: 56,
    justifyContent: 'center',
  },
  loginTxtModal: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});
// Customizable Area End

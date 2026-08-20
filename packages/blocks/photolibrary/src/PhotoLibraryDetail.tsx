import React from "react";
// Customizable Area Start
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StatusBar,
  ActivityIndicator,
  Modal,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Feather";
import Svg, { Path } from "react-native-svg";
import FastImage from "../../../components/src/SafeFastImage";
import { redesignTheme } from "../../utilities/src/Colors";
// Customizable Area End

import PhotoLibraryDetailController, {
  Props,
  configJSON
} from "./PhotoLibraryDetailController";

export default class PhotoLibraryDetail extends PhotoLibraryDetailController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }

  // Customizable Area Start
  renderHeader = () => {
    return (
      <View style={styles.header}>
        <TouchableOpacity
          testID="backBtn"
          style={styles.headerIconBtn}
          onPress={this.navigateBack}>
          <Icon name="arrow-left" size={18} color={redesignTheme.foreground} />
        </TouchableOpacity>
        <Text style={styles.pageTitle}>{configJSON.pictureInformation}</Text>
        <View style={styles.headerIconBtnPlaceholder} />
      </View>
    )
  }

  renderPicture = () => {
    const imageUri = this.state.pictures?.uri;
    const isExplicit = !!this.state.pictureDetail?.is_explicit;
    return (
      <View style={styles.imageCard}>
        {imageUri ? (
          <FastImage
            source={{
              uri: imageUri,
              priority: FastImage.priority.high
            }}
            resizeMode={FastImage.resizeMode.cover}
            style={styles.image}
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Icon name="image" size={32} color={redesignTheme.muted} />
          </View>
        )}
        {isExplicit && (
          <View style={styles.lockBadge}>
            <Icon name="lock" size={12} color="#FFFFFF" />
          </View>
        )}
      </View>
    )
  }

  renderLikeCount = () => {
    const liked = this.state.pictureDetail.like_by_me;
    const likesCount = this.state.pictureDetail.likes_count ?? 0;
    return (
      <View style={styles.likeRow}>
        <TouchableOpacity testID="likePictureBtn" onPress={this.checkAuthentication}>
          <Icon
            name="heart"
            size={20}
            color={liked ? redesignTheme.primary : redesignTheme.muted}
          />
        </TouchableOpacity>
        <TouchableOpacity testID="likeTextBtn" onPress={() => this.handleLikeTextPress()}>
          <Text style={styles.likeCountText}>{`${likesCount} people`}</Text>
          <Text style={styles.likeLabelText}> like this</Text>
        </TouchableOpacity>
      </View>
    )
  }

  renderSignupLoginPopup = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.loginSignupPopup}>
        <View style={[styles.centeredView, { backgroundColor: '#08080fcc' }]}>
          <View style={[styles.modalView]}>
            {this.renderCloseModal()}
            <Text style={styles.welcomeToPopupText}>{"Welcome to"}</Text>
            <Text style={styles.localShowsPopupText}>{"Local Shows"}</Text>
            <Text style={styles.loginFirstPopupText}>{"You have to Log in first to access the events."}</Text>
            <TouchableOpacity
              testID="createAccountBtn"
              onPress={() => { this.moveToLoginSignupScreen("signup") }} >
              <Text style={styles.createAccountPopupText}>{"Create new account"}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              testID="loginBtn"
              style={styles.loginBtnPopupText}
              onPress={() => { this.moveToLoginSignupScreen("login") }} >
              <Text style={styles.loginTxtPopupText}>{"Log in"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    )
  }

  renderCloseModal = () => {
    return (
      <TouchableWithoutFeedback
        testID="popupCloseButton"
        onPress={this.handleCloseModal}>
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
          fill={redesignTheme.foreground}
        >
          <Path
            d="M13.3.71a.996.996 0 00-1.41 0L7 5.59 2.11.7A.996.996 0 10.7 2.11L5.59 7 .7 11.89a.996.996 0 101.41 1.41L7 8.41l4.89 4.89a.996.996 0 101.41-1.41L8.41 7l4.89-4.89c.38-.38.38-1.02 0-1.4z"
            fill={redesignTheme.foreground}
          />
        </Svg>
      </TouchableWithoutFeedback>
    )
  }

  // Customizable Area End

  render() {
    // Customizable Area Start
    // Merge Engine - render - Start
    return (
      <SafeAreaView style={styles.safeAreaView} edges={["top", "left", "right"]}>
        <StatusBar barStyle="light-content" backgroundColor={redesignTheme.background} />
        <TouchableWithoutFeedback
          testID="container"
          onPress={this.hideKeyboardOnScreen}>
          <View style={{ flex: 1 }}>
            <View style={styles.container}>
              {this.renderHeader()}
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
              >
                {this.renderPicture()}
                {this.renderLikeCount()}
                <Text style={styles.label}>{configJSON.description}</Text>
                <Text style={styles.descriptionText}>{this.state.description}</Text>
              </ScrollView>
            </View>
          </View>
        </TouchableWithoutFeedback>
        {this.renderSignupLoginPopup()}
        {this.state.isLoading && <View style={styles.loadingContainer}>
          <ActivityIndicator size={'large'} color={redesignTheme.primary} />
        </View>}
      </SafeAreaView>
    );
    // Customizable Area End
    // Merge Engine - render - End
  }
}

// Customizable Area Start
const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    width: "100%",
    height: "100%",
    alignSelf: "center",
    backgroundColor: redesignTheme.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 12,
  },
  headerIconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: redesignTheme.border,
    alignItems: "center",
    justifyContent: "center",
  },
  headerIconBtnPlaceholder: {
    width: 32,
    height: 32,
  },
  pageTitle: {
    flex: 1,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '900',
    color: redesignTheme.foreground,
    textTransform: "uppercase",
    letterSpacing: 0.3,
    textAlign: "center",
    paddingHorizontal: 8,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  imageCard: {
    width: "100%",
    height: 270,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: redesignTheme.card,
    borderWidth: 1,
    borderColor: redesignTheme.border,
    marginTop: 8,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  lockBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: redesignTheme.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  likeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  likeCountText: {
    fontSize: 16,
    fontWeight: '700',
    color: redesignTheme.primary,
    marginLeft: 8,
  },
  likeLabelText: {
    fontSize: 16,
    fontWeight: '400',
    color: redesignTheme.foreground,
  },
  label: {
    fontSize: 13,
    fontWeight: '800',
    color: redesignTheme.primary,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginTop: 24,
  },
  descriptionText: {
    fontSize: 16,
    color: redesignTheme.foreground,
    fontWeight: '400',
    lineHeight: 22,
    marginTop: 10,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#08080fdd',
    alignItems: "center",
    justifyContent: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalView: {
    height: '40%',
    justifyContent: 'space-between',
    backgroundColor: redesignTheme.card,
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
    padding: 35,
    borderWidth: 1,
    borderColor: redesignTheme.border,
  },
  welcomeToPopupText: {
    textAlign: 'center',
    fontSize: 20,
    lineHeight: 28,
    marginTop: 10,
    color: redesignTheme.muted,
  },
  localShowsPopupText: {
    fontWeight: '700',
    fontSize: 28,
    lineHeight: 32,
    bottom: '5%',
    textAlign: 'center',
    color: redesignTheme.primary,
  },
  loginFirstPopupText: {
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: '5%',
    fontWeight: '400',
    fontSize: 16,
    color: redesignTheme.foreground,
  },
  createAccountPopupText: {
    color: redesignTheme.primary,
    fontWeight: '700',
    lineHeight: 24,
    marginBottom: '4%',
    fontSize: 16,
    textAlign: 'center',
  },
  loginBtnPopupText: {
    backgroundColor: redesignTheme.primary,
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
  },
  loginTxtPopupText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});
// Customizable Area End

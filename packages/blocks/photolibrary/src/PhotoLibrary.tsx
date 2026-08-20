import React from "react";
// Customizable Area Start
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  TextInput,
  StatusBar,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Feather";
import { redesignTheme } from "../../utilities/src/Colors";
// Customizable Area End

import PhotoLibraryController, {
  Props,
  configJSON
} from "./PhotoLibraryController";

export default class PhotoLibrary extends PhotoLibraryController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }

  // Customizable Area Start
  getPictureUri = () => {
    const rawUri = this.state.pictures?.uri;
    if (!rawUri) {
      return "";
    }
    return Array.isArray(rawUri) ? String(rawUri[0]) : String(rawUri);
  };

  renderError = (errorType: string) => {
    return (
      <>
        {errorType !== "" && <Text style={styles.errorText}>{errorType}</Text>}
      </>
    )
  }

  renderSuccessToast = () => {
    return (
      <>
        {this.state.showSuccessToast && (
          <View style={styles.successToastContainer}>
            <View style={styles.successToastView}>
              <Text style={styles.successToastText}>
                {configJSON.postCreatedAlertMessageDescription}
              </Text>
            </View>
          </View>
        )}
      </>
    )
  }

  renderPreviewScreen = () => {
    const imageUri = this.getPictureUri();
    const isEdit = !!this.state.pictureId;
    return (
      <View style={styles.previewScreen}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={redesignTheme.background}
        />
        <View style={styles.header}>
          <TouchableOpacity
            testID="backBtn"
            style={styles.headerIconBtn}
            onPress={this.handleBackFromPreview}
          >
            <Icon
              name="arrow-left"
              size={18}
              color={redesignTheme.foreground}
            />
          </TouchableOpacity>
          <View style={styles.headerCopy}>
            <Text style={styles.pageTitle}>PREVIEW</Text>
            <Text style={styles.stepLabel}>
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
          keyboardShouldPersistTaps="handled"
        >
          {this.renderSuccessToast()}
          <Text style={styles.previewIntro}>
            This is how your post will appear in the feed:
          </Text>
          <View style={styles.previewCard}>
            <View style={styles.previewImageWrap}>
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.previewImage} />
              ) : (
                <View style={styles.previewImagePlaceholder}>
                  <Icon name="image" size={32} color={redesignTheme.muted} />
                </View>
              )}
              {this.state.isPictureExplicit && (
                <View style={styles.lockBadge}>
                  <Icon name="lock" size={12} color="#FFFFFF" />
                </View>
              )}
              <View style={styles.previewUserOverlay}>
                {this.state.previewProfileImage ? (
                  <Image
                    source={{ uri: this.state.previewProfileImage }}
                    style={styles.previewAvatar}
                  />
                ) : (
                  <View style={styles.previewAvatarFallback}>
                    <Icon name="user" size={14} color={redesignTheme.muted} />
                  </View>
                )}
                <View style={{ flex: 1 }}>
                  {!!this.state.previewUserName && (
                    <Text style={styles.previewUserName}>
                      {this.state.previewUserName}
                    </Text>
                  )}
                  <Text style={styles.previewTimestamp}>Just now</Text>
                </View>
              </View>
            </View>
            {!!this.state.description && (
              <View style={styles.previewCardBody}>
                <Text style={styles.previewCaptionText}>
                  {this.state.description}
                </Text>
              </View>
            )}
          </View>
          {this.renderError(this.state.descriptionError)}
          {this.renderError(this.state.pictureError)}
          <View style={styles.visibilityCard}>
            <Text style={styles.visibilityTitle}>VISIBILITY</Text>
            {[
              { label: "Visible on local feed", active: true },
              { label: "Notified followers", active: true },
              { label: "Searchable by genre & city", active: true },
              { label: "Reminder sent day-of to saved fans", active: false },
            ].map(item => (
              <View key={item.label} style={styles.visibilityRow}>
                <Icon
                  name={item.active ? "check-circle" : "circle"}
                  size={16}
                  color={item.active ? "#22C55E" : redesignTheme.muted}
                />
                <Text style={styles.visibilityText}>{item.label}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity
            testID="btnPostPicture"
            style={styles.publishBtn}
            onPress={this.handlePostAPictureAPI}
            activeOpacity={0.85}
          >
            {this.state.isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Icon name="star" size={16} color="#FFFFFF" />
                <Text style={styles.publishBtnText}>
                  {isEdit ? configJSON.updateThePost : "PUBLISH NOW"}
                </Text>
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

  renderEditForm = () => {
    const imageUri = this.getPictureUri();
    return (
      <>
        <StatusBar
          barStyle="light-content"
          backgroundColor={redesignTheme.background}
        />
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.formWrap}>
            <View style={styles.header}>
              <TouchableOpacity
                testID="backBtn"
                style={styles.headerIconBtn}
                onPress={() => { this.props.navigation.goBack() }}
              >
                <Icon
                  name="arrow-left"
                  size={18}
                  color={redesignTheme.foreground}
                />
              </TouchableOpacity>
              <Text style={styles.pageTitle}>{configJSON.pictureInformation}</Text>
              <View style={styles.headerIconBtnPlaceholder} />
            </View>
            {this.renderSuccessToast()}
            {!!imageUri && (
              <Image source={{ uri: imageUri }} style={styles.editImage} />
            )}
            <Text style={styles.fieldLabel}>
              {configJSON.description}
              <Text style={styles.normalFont}>{configJSON.max300}</Text>
            </Text>
            <TextInput
              testID="descriptionInputText"
              placeholder="Enter description"
              style={styles.input}
              multiline
              placeholderTextColor={redesignTheme.muted}
              value={this.state.description}
              maxLength={300}
              onChangeText={(description) => { this.setState({ description }) }}
            />
            {this.renderError(this.state.descriptionError)}
            {this.renderError(this.state.pictureError)}
            <View style={styles.disclaimerRow}>
              <Icon name="info" size={14} color={redesignTheme.muted} />
              <Text style={styles.disclaimerText}>{configJSON.under18Age}</Text>
            </View>
          </View>
        </KeyboardAvoidingView>
        <TouchableOpacity
          testID="btnPostPicture"
          style={styles.publishBtnForm}
          onPress={this.handlePostAPictureAPI}>
          <Text style={styles.publishBtnText}>
            {this.state.pictureId ? configJSON.updateThePost : configJSON.postThePicture}
          </Text>
        </TouchableOpacity>
      </>
    );
  }

  // Customizable Area End

  render() {
    // Customizable Area Start
    // Merge Engine - render - Start
    return (
      <SafeAreaView style={styles.safeAreaView} edges={["top", "left", "right"]}>
        <TouchableWithoutFeedback
          testID="container"
          onPress={() => {
            this.hideKeyboard();
          }}>
          <View style={{ flex: 1 }}>
            {this.state.isPreviewStep
              ? this.renderPreviewScreen()
              : this.renderEditForm()}
          </View>
        </TouchableWithoutFeedback>
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
  formWrap: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
  },
  headerCopy: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
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
  headerIconBtnPlaceholder: {
    width: 32,
    height: 32,
  },
  pageTitle: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '900',
    color: redesignTheme.foreground,
    textTransform: "uppercase",
    letterSpacing: 0.3,
    textAlign: "center",
  },
  stepLabel: {
    color: redesignTheme.muted,
    fontSize: 12,
    marginTop: 2,
    textAlign: "center",
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: redesignTheme.primary,
    letterSpacing: 0.6,
    marginTop: 22,
  },
  input: {
    fontWeight: '400',
    width: "100%",
    paddingHorizontal: 14,
    paddingTop: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: redesignTheme.border,
    backgroundColor: redesignTheme.input,
    color: redesignTheme.foreground,
    fontSize: 16,
    marginTop: 10,
    height: 110,
    textAlignVertical: 'top',
  },
  normalFont: {
    fontWeight: '400',
  },
  disclaimerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 16,
  },
  disclaimerText: {
    flex: 1,
    color: redesignTheme.muted,
    fontSize: 13,
    lineHeight: 18,
    marginLeft: 8,
  },
  publishBtnForm: {
    backgroundColor: redesignTheme.primary,
    borderRadius: 16,
    minHeight: 52,
    marginHorizontal: 16,
    marginBottom: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: redesignTheme.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.55,
    shadowRadius: 12,
    elevation: 8,
  },
  errorText: {
    alignSelf: "flex-start",
    color: redesignTheme.primary,
    fontSize: 13,
    paddingTop: 8,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#08080fdd',
    alignItems: "center",
    justifyContent: "center",
  },
  successToastContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 8,
    zIndex: 1000,
    alignItems: 'center',
  },
  successToastView: {
    backgroundColor: redesignTheme.card,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: redesignTheme.border,
  },
  successToastText: {
    color: redesignTheme.foreground,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  previewScreen: {
    flex: 1,
    backgroundColor: redesignTheme.background,
    paddingHorizontal: 16,
  },
  previewProgressTrack: {
    height: 3,
    borderRadius: 2,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    overflow: "hidden",
    marginTop: 12,
  },
  previewProgressFill: {
    width: "100%",
    height: "100%",
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
    overflow: "hidden",
    borderWidth: 1,
    borderColor: redesignTheme.border,
  },
  previewImageWrap: {
    width: "100%",
    height: 220,
    backgroundColor: redesignTheme.input,
  },
  previewImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  previewImagePlaceholder: {
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
  previewUserOverlay: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  previewAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  previewAvatarFallback: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: "rgba(8, 8, 15, 0.7)",
    alignItems: "center",
    justifyContent: "center",
  },
  previewUserName: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
  previewTimestamp: {
    color: redesignTheme.muted,
    fontSize: 12,
  },
  previewCardBody: {
    padding: 14,
  },
  previewCaptionText: {
    color: redesignTheme.foreground,
    fontSize: 14,
    lineHeight: 20,
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
    fontWeight: "800",
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  visibilityRow: {
    flexDirection: "row",
    alignItems: "center",
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: redesignTheme.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.55,
    shadowRadius: 12,
    elevation: 8,
  },
  publishBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 0.8,
    marginLeft: 8,
  },
  editPreviewText: {
    color: redesignTheme.foreground,
    fontSize: 14,
    textAlign: "center",
    marginTop: 14,
    textDecorationLine: "underline",
  },
  editImage: {
    width: "100%",
    height: 180,
    borderRadius: 16,
    marginTop: 16,
    resizeMode: "cover",
  },
});
// Customizable Area End

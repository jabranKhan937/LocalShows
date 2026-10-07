import React from 'react';
// Customizable Area Start
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import PostCreationCommonController, {
  configJSON,
} from './PostCreationCommonController';
import Icon from 'react-native-vector-icons/Feather';
import { leftArrow } from '../../email-account-registration/src/assets';
import { lightTheme, redesignTheme } from '../../utilities/src/Colors';

// Customizable Area End

export interface Props {
  navigation: any;
  route?: any;
  // Customizable Area Start
  // Customizable Area End
}

export default class ImageSelection extends PostCreationCommonController {
  constructor(props: Props) {
    super(props);
  }

  get styles() {
    return this.state.isDarkMode ? darkImageSelectionStyles : lightImageSelectionStyles;
  }

  async componentDidMount() {
    await this.loadPostTheme();
    const selectedType =
      this.props.route?.params?.selectedType ||
      this.props.navigation.state?.params?.selectedType;
    console.log('ImageSelection - selectedType from params:', selectedType);
    console.log('ImageSelection - route.params:', this.props.route?.params);
    console.log(
      'ImageSelection - navigation.state.params:',
      this.props.navigation.state?.params,
    );
    console.log(
      'ImageSelection - Current selectedImageData:',
      this.state.selectedImageData,
    );
    console.log(
      'ImageSelection - Gallery images count:',
      this.state.galleryImages?.length || 0,
    );
  }

  // Customizable Area Start
  getSelectedType = () => {
    return (
      this.props.route?.params?.selectedType ||
      this.props.navigation.state?.params?.selectedType
    );
  };

  hasSelectedImage = () => {
    return (
      Object.keys(this.state.selectedImageData || {}).length !== 0 &&
      !!this.state.selectedImageData?.uri
    );
  };

  handleContinue = (selectedType: string) => {
    if (Object.keys(this?.state?.selectedImageData || {})?.length === 0) {
      return;
    }

    if (selectedType === 'show') {
      this.props.navigation.navigate('PostCreation', {
        event_image: this.state.selectedImageData,
        from: 'show',
      });
      return;
    }

    if (selectedType === 'picture') {
      this.props.navigation.navigate('PhotoLibrary', {
        event_image: this.state.selectedImageData,
        isPictureExplicit: this.state.isPictureExplicit,
        description: this.state.description,
      });
    }
  };

  renderHeader = (selectedType: string) => {
    const isPicture = selectedType === 'picture';
    return (
      <View style={this.styles.headerContainer}>
        {isPicture ? (
          <TouchableOpacity
            testID="backBtn"
            style={this.styles.headerIconBtn}
            onPress={() => this.props?.navigation?.goBack()}
          >
            <Icon
              name="arrow-left"
              size={18}
              color={this.getPostTheme().foreground}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            testID="crossBtn"
            style={this.styles.headerIconBtn}
            onPress={() => this.props?.navigation?.goBack()}
          >
            <Icon name="x" size={18} color={this.getPostTheme().muted} />
          </TouchableOpacity>
        )}
        <View style={this.styles.headerCopy}>
          <Text style={this.styles.titleHeader}>
            {isPicture
              ? configJSON.shareAPhotoCardTitle
              : configJSON.postAShowCardTitle}
          </Text>
          {isPicture && (
            <Text style={this.styles.stepLabel}>Step 1 of 2 — Details</Text>
          )}
        </View>
        {isPicture ? (
          <TouchableOpacity
            testID="crossBtn"
            style={this.styles.headerIconBtn}
            onPress={() => this.props?.navigation?.goBack()}
          >
            <Icon name="x" size={18} color={this.getPostTheme().muted} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            testID="forwardArrow"
            style={this.styles.headerIconBtn}
            onPress={() => this.handleContinue(selectedType)}
          >
            <Image source={leftArrow} style={this.styles.forwardArrow} />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  renderCameraRoll = () => {
    const hasImage = this.hasSelectedImage();
    const imageUri = hasImage
      ? String(this.state.selectedImageData.uri)
      : '';
    return (
      <TouchableOpacity
        testID="openCameraBtn"
        activeOpacity={0.85}
        onPress={this.handleOpenCameraPopup}
        style={[this.styles.photoPicker, hasImage && this.styles.photoPickerFilled]}
      >
        {hasImage ? (
          <>
            <Image source={{ uri: imageUri }} style={this.styles.photoPreview} />
            {this.state.isPictureExplicit && (
              <View style={this.styles.lockBadge}>
                <Icon name="lock" size={12} color="#FFFFFF" />
              </View>
            )}
            <View style={this.styles.changePhotoPill}>
              <Icon name="camera" size={14} color="#FFFFFF" />
              <Text style={this.styles.changePhotoText}>Change Photo</Text>
            </View>
          </>
        ) : (
          <>
            <Icon name="image" size={28} color={this.getPostTheme().muted} />
            <Text style={this.styles.photoPickerText}>Tap to select a photo</Text>
          </>
        )}
      </TouchableOpacity>
    );
  };

  renderPictureExplicit = (selectedType: string) => {
    if (selectedType !== 'picture') {
      return null;
    }
    const isOn = this.state.isPictureExplicit;
    return (
      <TouchableOpacity
        style={this.styles.protectRow}
        testID="pictureExplicitBtn"
        activeOpacity={0.85}
        onPress={() =>
          this.setState({
            isPictureExplicit: !this.state.isPictureExplicit,
          })
        }
      >
        <View style={this.styles.protectCopy}>
          <Icon name="shield" size={18} color={this.getPostTheme().primary} />
          <Text style={this.styles.protectTitle}>{configJSON.pictureIsExplicit}</Text>
          <Icon name="info" size={14} color={this.getPostTheme().muted} />
        </View>
        <View style={[this.styles.toggleTrack, isOn && this.styles.toggleTrackOn]}>
          <View style={this.styles.toggleThumb} />
        </View>
      </TouchableOpacity>
    );
  };

  renderCaption = (selectedType: string) => {
    if (selectedType !== 'picture') {
      return null;
    }
    return (
      <View>
        <View style={this.styles.disclaimerRow}>
          <Icon name="info" size={14} color={this.getPostTheme().muted} />
          <Text style={this.styles.disclaimerText}>
            Users under the age of 18 will not see any explicit content.
          </Text>
        </View>
        <View style={this.styles.fieldLabelRow}>
          <Icon name="align-left" size={14} color={this.getPostTheme().primary} />
          <Text style={this.styles.fieldLabel}>
            DESCRIPTION
            <Text style={this.styles.fieldLabelMuted}>{configJSON.max2000}</Text>
          </Text>
        </View>
        <TextInput
          testID="descriptionInputText"
          placeholder="Enter description"
          placeholderTextColor={this.getPostTheme().muted}
          style={this.styles.captionInput}
          multiline
          value={this.state.description}
          maxLength={2000}
          onChangeText={description => this.setState({ description })}
        />
        <Text style={this.styles.charCount}>
          {this.state.description.length}/2000
        </Text>
      </View>
    );
  };

  renderPreviewButton = (selectedType: string) => {
    if (selectedType !== 'picture') {
      return null;
    }
    const isReady = this.hasSelectedImage();
    return (
      <View style={this.styles.previewCtaWrap}>
        <TouchableOpacity
          testID="forwardArrow"
          style={[
            this.styles.previewBtn,
            isReady ? this.styles.previewBtnActive : this.styles.previewBtnInactive,
          ]}
          onPress={() => this.handleContinue(selectedType)}
          activeOpacity={isReady ? 0.85 : 1}
        >
          <Text
            style={[
              this.styles.previewBtnText,
              !isReady && this.styles.previewBtnInactiveText,
            ]}
          >
            PREVIEW POST
          </Text>
          <Icon
            name="chevron-right"
            size={18}
            color={isReady ? '#FFFFFF' : this.getPostTheme().muted}
          />
        </TouchableOpacity>
      </View>
    );
  };

  renderGallery = () => {
    return (
      <FlatList
        testID="galleryFlatlist"
        data={this.state.galleryImages}
        horizontal
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              testID="galleryImage"
              style={{ marginRight: 10 }}
              onPress={() => {
                this.handleSelectedGalleryItem(item);
              }}
            >
              <Image source={{ uri: item }} style={this.styles.galleryImage} />
            </TouchableOpacity>
          );
        }}
        keyExtractor={item => item.id}
      />
    );
  };
  renderCameraGalleryPopup = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.showCameraGalleryPopup}
      >
        <View style={[this.styles.centerView, { padding: 10 }]}>
          <View style={this.styles.cameraGalleryOption}>
            <TouchableOpacity
              testID="takePhotoBtn"
              onPress={this.handleCameraImage}
            >
              <Text style={this.styles.cameraButtonText}>Take photo</Text>
            </TouchableOpacity>
            <View style={this.styles.divider} />
            <TouchableOpacity
              testID="choosePhotoBtn"
              onPress={this.handleGallery}
            >
              <Text style={this.styles.cameraButtonText}>Choose photo</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            testID="cancelCameraOption"
            style={this.styles.cancelCameraPopup}
            onPress={this.handleCameraGalleryCancelPopup}
          >
            <Text style={this.styles.cancelCameraText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  };
  // Customizable Area End

  render() {
    // Customizable Area Start
    const selectedType = this.getSelectedType();
    console.log('ImageSelection render - selectedType:', selectedType);
    // Customizable Area End
    return (
      <SafeAreaView style={this.styles.safeAreaView} edges={['top', 'left', 'right']}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Customizable Area Start */}
            <View style={this.styles.container}>
              <StatusBar
                barStyle={this.state.isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor={this.getPostTheme().background}
              />
              {this.renderHeader(selectedType)}
              {selectedType === 'picture' && (
                <View style={this.styles.progressTrack}>
                  <View style={this.styles.progressFill} />
                </View>
              )}
              {selectedType === 'picture' && (
                <View style={this.styles.fieldLabelRow}>
                  <Icon name="image" size={14} color={this.getPostTheme().primary} />
                  <Text style={this.styles.fieldLabel}>EVENT / SHOW PHOTO</Text>
                </View>
              )}
              {selectedType !== 'picture' && (
                <Text style={this.styles.photoLabel}>EVENT / SHOW PHOTO</Text>
              )}
              {this.renderCameraRoll()}
              {this.renderPictureExplicit(selectedType)}
              {this.renderCaption(selectedType)}
              {this.state.galleryImages.length !== 0 && (
                <TouchableOpacity
                  testID="galleryDropdown"
                  style={this.styles.galleryHeader}
                >
                  <Text style={this.styles.galleryLabel}>{configJSON.gallery}</Text>
                  <Image source={leftArrow} style={this.styles.galleryDropdown} />
                </TouchableOpacity>
              )}
              {this.renderGallery()}
              {this.renderPreviewButton(selectedType)}
              {this.renderCameraGalleryPopup()}
            </View>
            {/* Customizable Area End */}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

// Customizable Area Start
const createImageSelectionStyles = (theme: typeof redesignTheme | typeof lightTheme) => StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: theme.background,
  },
  container: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  headerContainer: {
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
    backgroundColor: theme.input,
    borderWidth: 1,
    borderColor: theme.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleHeader: {
    color: theme.foreground,
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  stepLabel: {
    color: theme.muted,
    fontSize: 12,
    marginTop: 2,
    textAlign: 'center',
  },
  progressTrack: {
    height: 3,
    borderRadius: 2,
    backgroundColor: theme.border,
    overflow: 'hidden',
    marginTop: 12,
    marginBottom: 8,
  },
  progressFill: {
    width: '50%',
    height: '100%',
    backgroundColor: theme.primary,
  },
  photoLabel: {
    color: theme.primary,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.6,
    marginTop: 12,
  },
  photoPicker: {
    marginTop: 10,
    minHeight: 180,
    borderRadius: 16,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: theme.border,
    backgroundColor: theme.card,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  photoPickerFilled: {
    borderStyle: 'solid',
    borderColor: theme.border,
    minHeight: 220,
  },
  photoPreview: {
    width: '100%',
    height: 220,
    resizeMode: 'cover',
  },
  photoPickerText: {
    color: theme.muted,
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  lockBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  changePhotoPill: {
    position: 'absolute',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(8, 8, 15, 0.72)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  changePhotoText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 6,
  },
  protectRow: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.border,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  protectCopy: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  protectTitle: {
    color: theme.foreground,
    fontSize: 15,
    fontWeight: '700',
    marginHorizontal: 8,
  },
  toggleTrack: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.divider,
    justifyContent: 'flex-start',
    paddingHorizontal: 2,
  },
  toggleTrackOn: {
    backgroundColor: theme.primary,
    justifyContent: 'flex-end',
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  fieldLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 22,
  },
  fieldLabel: {
    color: theme.primary,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.6,
    marginLeft: 6,
  },
  fieldLabelMuted: {
    color: theme.muted,
    fontWeight: '600',
    letterSpacing: 0,
  },
  captionInput: {
    marginTop: 10,
    minHeight: 110,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.border,
    backgroundColor: theme.input,
    color: theme.foreground,
    fontSize: 16,
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 14,
    textAlignVertical: 'top',
  },
  charCount: {
    color: theme.muted,
    fontSize: 12,
    textAlign: 'right',
    marginTop: 6,
  },
  disclaimerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 12,
  },
  disclaimerText: {
    flex: 1,
    color: theme.muted,
    fontSize: 13,
    lineHeight: 18,
    marginLeft: 8,
  },
  previewCtaWrap: {
    marginTop: 24,
  },
  previewBtn: {
    borderRadius: 16,
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewBtnActive: {
    backgroundColor: theme.primary,
    shadowColor: theme.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.55,
    shadowRadius: 12,
    elevation: 8,
  },
  previewBtnInactive: {
    backgroundColor: '#1A1A28',
    borderWidth: 1,
    borderColor: theme.border,
  },
  previewBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.6,
    marginRight: 4,
  },
  previewBtnInactiveText: {
    color: theme.muted,
  },
  forwardArrow: {
    height: 14,
    width: 14,
    resizeMode: 'contain',
    transform: [{ rotate: '180deg' }],
    tintColor: theme.foreground,
  },
  galleryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  galleryLabel: {
    color: theme.muted,
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  galleryImage: {
    height: 90,
    width: 72,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  galleryDropdown: {
    height: 12,
    width: 12,
    resizeMode: 'contain',
    transform: [{ rotate: '270deg' }],
    marginLeft: 15,
    tintColor: theme.muted,
  },
  centerView: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#08080fcc',
  },
  cameraGalleryOption: {
    borderRadius: 14,
    backgroundColor: theme.card,
    alignItems: 'center',
  },
  cameraButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.primary,
    marginVertical: 16,
  },
  divider: {
    backgroundColor: theme.border,
    height: 1,
    width: '100%',
  },
  cancelCameraPopup: {
    borderRadius: 14,
    backgroundColor: theme.card,
    marginTop: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  cancelCameraText: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.foreground,
    marginVertical: 16,
  },
});

const darkImageSelectionStyles = createImageSelectionStyles(redesignTheme);
const lightImageSelectionStyles = createImageSelectionStyles(lightTheme);
// Customizable Area End

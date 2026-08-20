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
import { redesignTheme } from '../../utilities/src/Colors';

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

  async componentDidMount() {
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
      <View style={styles.headerContainer}>
        {isPicture ? (
          <TouchableOpacity
            testID="backBtn"
            style={styles.headerIconBtn}
            onPress={() => this.props?.navigation?.goBack()}
          >
            <Icon
              name="arrow-left"
              size={18}
              color={redesignTheme.foreground}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            testID="crossBtn"
            style={styles.headerIconBtn}
            onPress={() => this.props?.navigation?.goBack()}
          >
            <Icon name="x" size={18} color={redesignTheme.muted} />
          </TouchableOpacity>
        )}
        <View style={styles.headerCopy}>
          <Text style={styles.titleHeader}>
            {isPicture
              ? configJSON.shareAPhotoCardTitle
              : configJSON.postAShowCardTitle}
          </Text>
          {isPicture && (
            <Text style={styles.stepLabel}>Step 1 of 2 — Details</Text>
          )}
        </View>
        {isPicture ? (
          <TouchableOpacity
            testID="crossBtn"
            style={styles.headerIconBtn}
            onPress={() => this.props?.navigation?.goBack()}
          >
            <Icon name="x" size={18} color={redesignTheme.muted} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            testID="forwardArrow"
            style={styles.headerIconBtn}
            onPress={() => this.handleContinue(selectedType)}
          >
            <Image source={leftArrow} style={styles.forwardArrow} />
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
        style={[styles.photoPicker, hasImage && styles.photoPickerFilled]}
      >
        {hasImage ? (
          <>
            <Image source={{ uri: imageUri }} style={styles.photoPreview} />
            {this.state.isPictureExplicit && (
              <View style={styles.lockBadge}>
                <Icon name="lock" size={12} color="#FFFFFF" />
              </View>
            )}
            <View style={styles.changePhotoPill}>
              <Icon name="camera" size={14} color="#FFFFFF" />
              <Text style={styles.changePhotoText}>Change Photo</Text>
            </View>
          </>
        ) : (
          <>
            <Icon name="image" size={28} color={redesignTheme.muted} />
            <Text style={styles.photoPickerText}>Tap to select a photo</Text>
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
        style={styles.protectRow}
        testID="pictureExplicitBtn"
        activeOpacity={0.85}
        onPress={() =>
          this.setState({
            isPictureExplicit: !this.state.isPictureExplicit,
          })
        }
      >
        <View style={styles.protectCopy}>
          <Icon name="shield" size={18} color={redesignTheme.primary} />
          <Text style={styles.protectTitle}>{configJSON.pictureIsExplicit}</Text>
          <Icon name="info" size={14} color={redesignTheme.muted} />
        </View>
        <View style={[styles.toggleTrack, isOn && styles.toggleTrackOn]}>
          <View style={styles.toggleThumb} />
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
        <View style={styles.disclaimerRow}>
          <Icon name="info" size={14} color={redesignTheme.muted} />
          <Text style={styles.disclaimerText}>
            Users under the age of 18 will not see any explicit content.
          </Text>
        </View>
        <View style={styles.fieldLabelRow}>
          <Icon name="align-left" size={14} color={redesignTheme.primary} />
          <Text style={styles.fieldLabel}>
            DESCRIPTION
            <Text style={styles.fieldLabelMuted}>{configJSON.max300}</Text>
          </Text>
        </View>
        <TextInput
          testID="descriptionInputText"
          placeholder="Enter description"
          placeholderTextColor={redesignTheme.muted}
          style={styles.captionInput}
          multiline
          value={this.state.description}
          maxLength={300}
          onChangeText={description => this.setState({ description })}
        />
        <Text style={styles.charCount}>
          {this.state.description.length}/300
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
      <View style={styles.previewCtaWrap}>
        <TouchableOpacity
          testID="forwardArrow"
          style={[
            styles.previewBtn,
            isReady ? styles.previewBtnActive : styles.previewBtnInactive,
          ]}
          onPress={() => this.handleContinue(selectedType)}
          activeOpacity={isReady ? 0.85 : 1}
        >
          <Text
            style={[
              styles.previewBtnText,
              !isReady && styles.previewBtnInactiveText,
            ]}
          >
            PREVIEW POST
          </Text>
          <Icon
            name="chevron-right"
            size={18}
            color={isReady ? '#FFFFFF' : redesignTheme.muted}
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
              <Image source={{ uri: item }} style={styles.galleryImage} />
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
        <View style={[styles.centerView, { padding: 10 }]}>
          <View style={styles.cameraGalleryOption}>
            <TouchableOpacity
              testID="takePhotoBtn"
              onPress={this.handleCameraImage}
            >
              <Text style={styles.cameraButtonText}>Take photo</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity
              testID="choosePhotoBtn"
              onPress={this.handleGallery}
            >
              <Text style={styles.cameraButtonText}>Choose photo</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            testID="cancelCameraOption"
            style={styles.cancelCameraPopup}
            onPress={this.handleCameraGalleryCancelPopup}
          >
            <Text style={styles.cancelCameraText}>Cancel</Text>
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
      <SafeAreaView style={styles.safeAreaView} edges={['top', 'left', 'right']}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Customizable Area Start */}
            <View style={styles.container}>
              <StatusBar
                barStyle="light-content"
                backgroundColor={redesignTheme.background}
              />
              {this.renderHeader(selectedType)}
              {selectedType === 'picture' && (
                <View style={styles.progressTrack}>
                  <View style={styles.progressFill} />
                </View>
              )}
              {selectedType === 'picture' && (
                <View style={styles.fieldLabelRow}>
                  <Icon name="image" size={14} color={redesignTheme.primary} />
                  <Text style={styles.fieldLabel}>EVENT / SHOW PHOTO</Text>
                </View>
              )}
              {selectedType !== 'picture' && (
                <Text style={styles.photoLabel}>EVENT / SHOW PHOTO</Text>
              )}
              {this.renderCameraRoll()}
              {this.renderPictureExplicit(selectedType)}
              {this.renderCaption(selectedType)}
              {this.state.galleryImages.length !== 0 && (
                <TouchableOpacity
                  testID="galleryDropdown"
                  style={styles.galleryHeader}
                >
                  <Text style={styles.galleryLabel}>{configJSON.gallery}</Text>
                  <Image source={leftArrow} style={styles.galleryDropdown} />
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
const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: redesignTheme.background,
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
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: redesignTheme.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleHeader: {
    color: redesignTheme.foreground,
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  stepLabel: {
    color: redesignTheme.muted,
    fontSize: 12,
    marginTop: 2,
    textAlign: 'center',
  },
  progressTrack: {
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
    marginTop: 12,
    marginBottom: 8,
  },
  progressFill: {
    width: '50%',
    height: '100%',
    backgroundColor: redesignTheme.primary,
  },
  photoLabel: {
    color: redesignTheme.primary,
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
    borderColor: 'rgba(255, 255, 255, 0.16)',
    backgroundColor: redesignTheme.card,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  photoPickerFilled: {
    borderStyle: 'solid',
    borderColor: redesignTheme.border,
    minHeight: 220,
  },
  photoPreview: {
    width: '100%',
    height: 220,
    resizeMode: 'cover',
  },
  photoPickerText: {
    color: redesignTheme.muted,
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
    backgroundColor: redesignTheme.primary,
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
    backgroundColor: redesignTheme.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: redesignTheme.border,
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
    color: redesignTheme.foreground,
    fontSize: 15,
    fontWeight: '700',
    marginHorizontal: 8,
  },
  toggleTrack: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    justifyContent: 'flex-start',
    paddingHorizontal: 2,
  },
  toggleTrackOn: {
    backgroundColor: redesignTheme.primary,
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
    color: redesignTheme.primary,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.6,
    marginLeft: 6,
  },
  fieldLabelMuted: {
    color: redesignTheme.muted,
    fontWeight: '600',
    letterSpacing: 0,
  },
  captionInput: {
    marginTop: 10,
    minHeight: 110,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: redesignTheme.border,
    backgroundColor: redesignTheme.input,
    color: redesignTheme.foreground,
    fontSize: 16,
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 14,
    textAlignVertical: 'top',
  },
  charCount: {
    color: redesignTheme.muted,
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
    color: redesignTheme.muted,
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
    backgroundColor: redesignTheme.primary,
    shadowColor: redesignTheme.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.55,
    shadowRadius: 12,
    elevation: 8,
  },
  previewBtnInactive: {
    backgroundColor: '#1A1A28',
    borderWidth: 1,
    borderColor: redesignTheme.border,
  },
  previewBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.6,
    marginRight: 4,
  },
  previewBtnInactiveText: {
    color: redesignTheme.muted,
  },
  forwardArrow: {
    height: 14,
    width: 14,
    resizeMode: 'contain',
    transform: [{ rotate: '180deg' }],
    tintColor: redesignTheme.foreground,
  },
  galleryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  galleryLabel: {
    color: redesignTheme.muted,
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
    tintColor: redesignTheme.muted,
  },
  centerView: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#08080fcc',
  },
  cameraGalleryOption: {
    borderRadius: 14,
    backgroundColor: redesignTheme.card,
    alignItems: 'center',
  },
  cameraButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: redesignTheme.primary,
    marginVertical: 16,
  },
  divider: {
    backgroundColor: redesignTheme.border,
    height: 1,
    width: '100%',
  },
  cancelCameraPopup: {
    borderRadius: 14,
    backgroundColor: redesignTheme.card,
    marginTop: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  cancelCameraText: {
    fontSize: 16,
    fontWeight: '700',
    color: redesignTheme.foreground,
    marginVertical: 16,
  },
});
// Customizable Area End

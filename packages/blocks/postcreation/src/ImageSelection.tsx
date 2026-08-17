import React from 'react';
// Customizable Area Start
import {
  ScrollView,
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
  FlatList,
  Modal,
} from 'react-native';

import PostCreationCommonController, {
  configJSON,
} from './PostCreationCommonController';
import Icon from 'react-native-vector-icons/Feather';
import { leftArrow } from '../../email-account-registration/src/assets';
import { colors } from '../../utilities/src/Colors';

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
  renderHeader = (selectedType: string) => {
    return (
      <View style={styles.header}>
        <TouchableOpacity
          testID="crossBtn"
          style={styles.crossBtn}
          onPress={() => {
            this.props?.navigation?.goBack();
          }}
        >
          <Icon name="x" color="#0F172A" size={25} />
        </TouchableOpacity>
        <Text style={styles.titleHeader}>
          {selectedType === 'show'
            ? configJSON.postAShow
            : configJSON.postAPicture}
        </Text>
        <TouchableOpacity
          testID="forwardArrow"
          style={[styles.crossBtn, { marginTop: 5 }]}
          onPress={() => {
            console.log('yes i presses ');

            if (Object.keys(this?.state?.selectedImageData)?.length !== 0) {
              console.log('yes i presses in if', selectedType);

              if (selectedType === 'show') {
                console.log('yes i presses in if if');
                console.log(
                  'ImageSelection - Navigating to PostCreation with event_image:',
                  this.state.selectedImageData,
                );
                console.log(
                  'ImageSelection - Image URI:',
                  this.state.selectedImageData?.uri,
                );
                console.log(
                  'ImageSelection - Using navigation.navigate to PostCreation',
                );

                this.props.navigation.navigate('PostCreation', {
                  event_image: this.state.selectedImageData,
                  from: 'show',
                });
              } else if (selectedType === 'picture') {
                console.log('yes i presses in if else');
                console.log(
                  'ImageSelection - Navigating to PhotoLibrary with event_image:',
                  this.state.selectedImageData,
                );
                this.props.navigation.navigate('PhotoLibrary', {
                  event_image: this.state.selectedImageData,
                  isPictureExplicit: this.state.isPictureExplicit,
                });
              }
            }
          }}
        >
          <Image source={leftArrow} style={styles.forwardArrow} />
        </TouchableOpacity>
      </View>
    );
  };

  renderCameraRoll = () => {
    const maxImageHeight = 500;
    const imageHeight =
      this.state.selectedImageData?.height < maxImageHeight
        ? this.state.selectedImageData.height
        : maxImageHeight;
    return (
      <>
        {Object.keys(this.state.selectedImageData).length !== 0 ? (
          <Image
            source={{ uri: this.state.selectedImageData.uri.toString() }}
            style={[styles.selectedImage, { height: imageHeight }]}
          />
        ) : (
          <TouchableOpacity
            testID="openCameraBtn"
            onPress={this.handleOpenCameraPopup}
            style={styles.selectedImage}
          >
            <Image
              source={require('../../../mobile/assets/images/gallery.png')}
              style={styles.camera}
            />
          </TouchableOpacity>
        )}
      </>
    );
  };

  renderPictureExplicit = (selectedType: string) => {
    return (
      <>
        {selectedType === 'picture' && (
          <View style={{ flexDirection: 'row', marginTop: 20 }}>
            <TouchableOpacity
              style={styles.pictureExplicitContainer}
              testID="pictureExplicitBtn"
              onPress={() =>
                this.setState({
                  isPictureExplicit: !this.state.isPictureExplicit,
                })
              }
            >
              {this.state.isPictureExplicit && (
                <View style={styles.pictureExplicitSelected} />
              )}
            </TouchableOpacity>
            <Text style={styles.text}>{configJSON.pictureIsExplicit}</Text>
          </View>
        )}
      </>
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
    const selectedType =
      this.props.route?.params?.selectedType ||
      this.props.navigation.state?.params?.selectedType;
    console.log('ImageSelection render - selectedType:', selectedType);
    // Customizable Area End
    return (
      <SafeAreaView style={styles.safeAreaView}>
        <ScrollView>
          {/* Customizable Area Start */}
          <StatusBar backgroundColor="#FFF" />
          <View style={styles.container}>
            {this.renderHeader(selectedType)}
            <View style={[styles.header, { marginVertical: 10 }]}>
              <Text style={styles.text}>{`${configJSON.posts}`}</Text>
            </View>
            {this.renderCameraRoll()}
            {this.renderPictureExplicit(selectedType)}
            {this.state.galleryImages.length !== 0 && (
              <TouchableOpacity
                testID="galleryDropdown"
                style={[
                  styles.header,
                  {
                    marginTop: 20,
                    justifyContent: 'flex-start',
                    marginBottom: 10,
                  },
                ]}
              >
                <Text style={styles.text}>{configJSON.gallery}</Text>
                <Image source={leftArrow} style={styles.galleryDropdown} />
              </TouchableOpacity>
            )}
            {this.renderGallery()}
            {this.renderCameraGalleryPopup()}
          </View>
          {/* Customizable Area End */}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

// Customizable Area Start
const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  container: {
    padding: 25,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  crossBtn: {
    height: 20,
    width: 20,
  },
  titleHeader: {
    color: '#334155',
    fontSize: 24,
    fontWeight: '700',
  },
  forwardArrow: {
    height: 20,
    width: 15,
    resizeMode: 'contain',
    transform: [{ rotate: '180deg' }],
  },
  selectedImage: {
    height: 500,
    width: '100%',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EDEDFF',
  },
  camera: {
    height: 40,
    width: 40,
    resizeMode: 'contain',
    tintColor: '#00000050',
  },
  galleryImage: {
    height: 170,
    width: 120,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  text: {
    color: '#334155',
    fontSize: 14,
    fontWeight: '400',
  },
  cameraIcon: {
    height: 22,
    width: 22,
  },
  galleryDropdown: {
    height: 12,
    width: 12,
    resizeMode: 'contain',
    transform: [{ rotate: '270deg' }],
    marginLeft: 15,
  },
  pictureExplicitContainer: {
    height: 20,
    width: 20,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: colors(false).text,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pictureExplicitSelected: {
    height: 12,
    width: 12,
    backgroundColor: '#3333CC',
    borderRadius: 2.5,
  },
  centerView: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#33415580',
  },
  cameraGalleryOption: {
    borderRadius: 10,
    backgroundColor: '#EDEDFF',
    alignItems: 'center',
  },
  cameraButtonText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#4949EE',
    marginVertical: 15,
  },
  divider: {
    backgroundColor: '#E2E8F0',
    height: 1,
  },
  cancelCameraPopup: {
    borderRadius: 10,
    backgroundColor: '#EDEDFF',
    marginTop: 15,
    alignItems: 'center',
  },
  cancelCameraText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4949EE',
    marginVertical: 20,
  },
});
// Customizable Area End

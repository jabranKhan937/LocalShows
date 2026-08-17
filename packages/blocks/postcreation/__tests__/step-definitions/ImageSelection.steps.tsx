import { defineFeature, loadFeature } from "jest-cucumber";
import { shallow, ShallowWrapper } from "enzyme";
import * as helpers from "../../../../framework/src/Helpers";
export const configJSON = require("../../config.json");
import React from "react";
import * as cameraFunc  from 'react-native-image-picker'
import ImageSelection from "../../src/ImageSelection";

jest.useFakeTimers()

const pictureScreenProps = {
  navigation: {
    goBack: jest.fn(),
    navigate: jest.fn(),
    replace: jest.fn(),
    state: {
      params: {
        selectedType: 'picture',
      }
    }
  },
  id: 'ImageSelection'
}

const showScreenProps = {
  navigation: {
    goBack: jest.fn(),
    navigate: jest.fn(),
    replace: jest.fn(),
    state: {
      params: {
        selectedType: 'show',
      }
    }
  },
  id: 'ImageSelection'
}

jest.mock('react-native-image-picker', () => {
  return {
    launchCamera: jest.fn((options, callback) => ({
      assets: [{ height: 500, uri: 'mocked_camera_image.jpg' }],
    })
      
    ),
    launchImageLibrary: jest.fn((options, callback) => ({
      assets: [{ height: 500, uri: 'mocked_camera_image_from_library.jpg' }],
    })
      
    ),
  };
});


const feature = loadFeature("./__tests__/features/ImageSelection-scenario.feature");

defineFeature(feature, test => {
  beforeEach(() => {
    jest.resetModules();
    jest.doMock('react-native', () => ({ Platform: { OS: 'android' } }))
    jest.spyOn(helpers, 'getOS').mockImplementation(() => 'android')
  })
  test("User navigates to ImageSelection for Post a Show", ({ given, when, then }) => {
    let imageSelectionWrapper: ShallowWrapper;
    let instance: ImageSelection;

    given("I am a User loading ImageSelection", () => {
      imageSelectionWrapper = shallow(<ImageSelection {...showScreenProps} />);
    });

    when("I navigate to the ImageSelection", () => {
      instance = imageSelectionWrapper.instance() as ImageSelection;
    });

    then("User interacts with UI", () => {
      const galleryImagesList = [["1", "2", "3", "4"]]
      imageSelectionWrapper.findWhere(node => node.prop("testID") === "crossBtn").simulate("press")
      imageSelectionWrapper.findWhere(node => node.prop("testID") === "forwardArrow").simulate("press")
      imageSelectionWrapper.findWhere(node => node.prop("testID") === "openCameraBtn").simulate("press")
      const galleryFlatlist = imageSelectionWrapper.findWhere(node => node.prop("testID") === "galleryFlatlist");
      galleryImagesList.forEach((item, index) => {
        const innerWrapper = galleryFlatlist.renderProp("renderItem")({
          item: item,
          index: index,
        });
        galleryFlatlist.renderProp("keyExtractor")({
          item: item,
        });
        innerWrapper.findWhere(
          (node) => node.prop("testID") === "galleryImage"
        ).simulate("press");
      })
      expect(showScreenProps.navigation.goBack).toHaveBeenCalled();
    });

    when("User clicks from camera", () => {
      instance.setState({
        selectedImageData: {
          uri: "image_path"
        }
      })
    })

    then("Render the camera image on UI", () => {
      imageSelectionWrapper.findWhere(node => node.prop("testID") === "forwardArrow").simulate("press")
      expect(instance.state.selectedImageData.uri).toBe("image_path")
    })

    when("User gets gallery images", () => {
      instance.setState({ galleryImages: ["1", "2"] })
    })

    then("Render gallery images", () => {
      imageSelectionWrapper.findWhere(node => node.prop("testID") === "galleryDropdown").simulate("press")
      expect(instance.state.galleryImages).toStrictEqual(["1", "2"])
    })
  });

  test("User navigates to ImageSelection for Post a Picture", ({ given, when, then }) => {
    let imageSelectionWrapper: ShallowWrapper;
    let instance: ImageSelection;

    given("I am a User loading ImageSelection", () => {
      jest.doMock('react-native/Libraries/Utilities/Platform.ios.js', () => ({
        OS: 'android',
        select: jest.fn(),
      }))
      imageSelectionWrapper = shallow(<ImageSelection {...pictureScreenProps} />);
    });

    when("I navigate to the ImageSelection", () => {
      instance = imageSelectionWrapper.instance() as ImageSelection;
      jest.spyOn(instance.props.navigation, 'goBack')
    });

    then("User interacts with UI", () => {
      const galleryImagesList = [["content://com.localshows.eventsApp.provider/root/storage/emulated/0/DCIM/Camera/123.png"]]
      imageSelectionWrapper.findWhere(node => node.prop("testID") === "crossBtn").simulate("press")
      expect(instance.props.navigation.goBack).toHaveBeenCalled();
      imageSelectionWrapper.findWhere(node => node.prop("testID") === "forwardArrow").simulate("press")
      imageSelectionWrapper.findWhere(node => node.prop("testID") === "pictureExplicitBtn").simulate("press")
      const galleryFlatlist = imageSelectionWrapper.findWhere(node => node.prop("testID") === "galleryFlatlist");
      galleryImagesList.forEach((item, index) => {
        const innerWrapper = galleryFlatlist.renderProp("renderItem")({
          item: item,
          index: index,
        });
        galleryFlatlist.renderProp("keyExtractor")({
          item: item,
        }); innerWrapper.findWhere(
          (node) => node.prop("testID") === "galleryImage"
        ).simulate("press");
      })
      
    });

    when("User clicks from camera", () => {
      imageSelectionWrapper.findWhere(node => node.prop("testID") === "forwardArrow").simulate("press")
      instance.setState({
        selectedImageData: {
          uri: "image_path"
        }
      })
    })

    then("Render the camera image on UI", () => {
      expect(instance.state.selectedImageData.uri).toBe("image_path")
    })

    when("User gets gallery images", () => {
      instance.setState({ galleryImages: ["content://com.localshows.eventsApp.provider/root/storage/emulated/0/DCIM/Camera/123.png"] })
    })

    then("Render gallery images", () => {
      imageSelectionWrapper.findWhere(node => node.prop("testID") === "galleryDropdown").simulate("press")
      expect(instance.state.galleryImages).toStrictEqual(["content://com.localshows.eventsApp.provider/root/storage/emulated/0/DCIM/Camera/123.png"])
    })
  });
  test("Camera Access", ({ given, when, then }) => {
    let imageSelectionWrapper: ShallowWrapper;
    let instance: ImageSelection;
    let cameraButton : ShallowWrapper;
    let cancelModalButton : ShallowWrapper;
    let photoButton : ShallowWrapper;

    


    given("I am a User loading ImageSelection", () => { 
      imageSelectionWrapper = shallow(<ImageSelection {...pictureScreenProps} />);
      jest.doMock("react-native", () => ({ Platform: { OS: "android" } }));
      jest.spyOn(helpers, "getOS").mockImplementation(() => "android");
  
    });

    when("I press select photo button", () => {
      instance = imageSelectionWrapper.instance() as ImageSelection;
      cameraButton = imageSelectionWrapper.findWhere(node => node.prop("testID") === "openCameraBtn")
      cameraButton.simulate('press')
      
    });
    then("User interacts with the camera modal", () => {
      expect(instance.state.showCameraGalleryPopup).toBe(true)
      expect(cameraButton).toBeDefined()
      
    });

    when("I press cancel button", () => {
      instance = imageSelectionWrapper.instance() as ImageSelection;
      cancelModalButton = imageSelectionWrapper.findWhere(node => node.prop("testID") === "cancelCameraOption")
      cancelModalButton.simulate('press')
    });
    then("The camera modal is closed", () => {
      expect(instance.state.showCameraGalleryPopup).toBe(false)
    });
    
    
    when("I open the modal and select take a photo", () => {
      instance = imageSelectionWrapper.instance() as ImageSelection;
      jest.spyOn(instance, 'handleCameraImage');
      jest.clearAllMocks()
      
      
      cameraButton = imageSelectionWrapper.findWhere(node => node.prop("testID") === "openCameraBtn")
      cameraButton.simulate('press')

      photoButton = imageSelectionWrapper.findWhere(node => node.prop("testID") === "takePhotoBtn")
      photoButton.simulate('press')

    });
    then("I expect the camera should be opened", () => {
      expect(instance.handleCameraImage).toBeCalled();
      
    });
    when("I open the modal and select choose a photo", () => {
      instance = imageSelectionWrapper.instance() as ImageSelection;
      jest.spyOn(instance, 'handleGallery')
      

      instance.setState({showCameraGalleryPopup : false})
      cameraButton = imageSelectionWrapper.findWhere(node => node.prop("testID") === "openCameraBtn")
      cameraButton.simulate('press')

      photoButton = imageSelectionWrapper.findWhere(node => node.prop("testID") === "choosePhotoBtn")
      photoButton.simulate('press')
      
    });
    then("I expect the photos library should be opened", () => {
      expect(instance.handleGallery).toBeCalled()
      
    });

  })
  test('Camera access declined by the user', ({given, when , then}) => {
    let imageSelectionWrapper: ShallowWrapper;
    let instance: ImageSelection;
    let cameraButton : ShallowWrapper;
    let cancelModalButton : ShallowWrapper;
    let photoButton : ShallowWrapper;
  
    given("I am a User loading ImageSelection", () => { 
      imageSelectionWrapper = shallow(<ImageSelection {...pictureScreenProps} />);

  
    });
    when('A user declines camera permission', async() => {
      instance = imageSelectionWrapper.instance() as ImageSelection;
      jest.spyOn(instance, 'ensureCameraAccessGranted').mockResolvedValue(false);
      jest.spyOn(instance, 'showCameraAccessDisabledAlert');
      instance.setState({showCameraGalleryPopup : false})
      cameraButton = imageSelectionWrapper.findWhere(node => node.prop("testID") === "openCameraBtn")
      cameraButton.simulate('press')

      photoButton = imageSelectionWrapper.findWhere(node => node.prop("testID") === "choosePhotoBtn")
      photoButton.simulate('press')
      instance.setState({showCameraGalleryPopup : false})
      cameraButton = imageSelectionWrapper.findWhere(node => node.prop("testID") === "openCameraBtn")
      cameraButton.simulate('press')

      photoButton = imageSelectionWrapper.findWhere(node => node.prop("testID") === "takePhotoBtn")
      photoButton.simulate('press')
      
      
    })
    then('I expect to show an error message', () => {
      expect(instance.ensureCameraAccessGranted).toBeCalled();
      expect(instance.showCameraAccessDisabledAlert).toBeCalled();
    })
  })
  test('Camera access on IOS device', ({given, when, then}) => {
    let imageSelectionWrapper: ShallowWrapper;
    let instance: ImageSelection;
    let cameraButton : ShallowWrapper;
    let takePhotoButton : ShallowWrapper;

    
    given("I am a User loading ImageSelection on IOS device", () => { 
      imageSelectionWrapper = shallow(<ImageSelection {...pictureScreenProps} />);
      jest.doMock("react-native", () => ({ Platform: { OS: "ios" } }));
      jest.spyOn(helpers, "getOS").mockImplementation(() => "ios");

        
    });

    when("I press select photo button and select take a photo button", () => {
      instance = imageSelectionWrapper.instance() as ImageSelection;
      instance.setState({showCameraGalleryPopup : false})
      jest.spyOn(instance, 'handleCameraImage');
      cameraButton = imageSelectionWrapper.findWhere(node => node.prop("testID") === "openCameraBtn")
      cameraButton.simulate('press')
      takePhotoButton = imageSelectionWrapper.findWhere(node => node.prop("testID") === "takePhotoBtn")
      takePhotoButton.simulate('press');
      instance.setState({
        selectedImageData: {
          height: 400,
          uri: 'url-example'
        }
      })
      
    });
    then("User interacts with the camera screen", () => {
      expect(instance.handleCameraImage).toBeCalled()
      
    });
    when('I press select photo button and press choose photos button', ()=> {
      instance = imageSelectionWrapper.instance() as ImageSelection;
      jest.spyOn(instance, 'handleGallery');
      instance.setState({showCameraGalleryPopup : false, selectedImageData: {}})
      
      cameraButton = imageSelectionWrapper.findWhere(node => node.prop("testID") === "openCameraBtn")
      cameraButton.simulate('press')

      takePhotoButton = imageSelectionWrapper.findWhere(node => node.prop("testID") === "choosePhotoBtn")
      takePhotoButton.simulate('press')
    })
    then("User interacts with the library", () => {
      expect(instance.handleGallery).toBeCalled()
      
    });
  })
  
  test('Camera Access with errors', ({given, when, then}) => {
    let imageSelectionWrapper: ShallowWrapper;
    let instance: ImageSelection;
    let cameraButton : ShallowWrapper;
    let takePhotoButton : ShallowWrapper;

    
    given("I am a User loading ImageSelection", () => { 
      imageSelectionWrapper = shallow(<ImageSelection {...pictureScreenProps} />);
      jest.doMock("react-native", () => ({ Platform: { OS: "ios" } }));
      jest.spyOn(helpers, "getOS").mockImplementation(() => "ios");

    });
    when("I open the modal and select take a photo", () => {
      instance = imageSelectionWrapper.instance() as ImageSelection;
      instance.setState({showCameraGalleryPopup : false})
      jest.spyOn(instance, 'handleCameraImage');
      jest.spyOn(cameraFunc, "launchCamera").mockImplementation(async() => ({ assets: []}));

      cameraButton = imageSelectionWrapper.findWhere(node => node.prop("testID") === "openCameraBtn")
      cameraButton.simulate('press')
      takePhotoButton = imageSelectionWrapper.findWhere(node => node.prop("testID") === "takePhotoBtn")
      takePhotoButton.simulate('press');
      
      
    });
    then("I expect the camera should not be opened", () => {
      expect(instance.handleCameraImage).toBeCalled()
      
    });
    when("I open the modal and select choose a photo", () => {
      instance = imageSelectionWrapper.instance() as ImageSelection;
      instance.setState({showCameraGalleryPopup : false, selectedImageData: {}})
      jest.spyOn(instance, 'handleGallery');
      jest.spyOn(cameraFunc, "launchImageLibrary").mockImplementation(async() => ({ assets: []}));

      cameraButton = imageSelectionWrapper.findWhere(node => node.prop("testID") === "openCameraBtn")
      cameraButton.simulate('press')
      takePhotoButton = imageSelectionWrapper.findWhere(node => node.prop("testID") === "choosePhotoBtn")
      takePhotoButton.simulate('press');
      
      
    });
    then("I expect the library should not be opened", () => {
      expect(instance.handleGallery).toBeCalled()
      
    });

   
  })

});
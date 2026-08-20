import { IBlock } from '../../../framework/src/IBlock';
import { Message } from '../../../framework/src/Message';
import { BlockComponent } from '../../../framework/src/BlockComponent';
import MessageEnum, {
  getName,
} from '../../../framework/src/Messages/MessageEnum';
import { runEngine } from '../../../framework/src/RunEngine';

// Customizable Area Start
import { Image, ImageListType, SelectedImage } from './types';
import { getStorageData, isEmpty } from '../../../framework/src/Utilities';
import { Keyboard } from 'react-native';
import { CommonActions } from '@react-navigation/native';
// Customizable Area End

export const configJSON = require('./config');

// Customizable Area Start
// Customizable Area End

export interface Props {
  navigation: any;
  route?: any;
  id: string;
  // Customizable Area Start
  // Customizable Area End
}

interface S {
  // Customizable Area Start
  token: string;
  isAddImageModalVisible: boolean;
  isViewImageModalVisible: boolean;
  isVisibleDeleteCheckbox: boolean;
  isShareModalVisible: boolean;
  imageData: ImageListType[];
  selectedImage: SelectedImage;
  viewSelectedImage: SelectedImage;
  selectedImageId: string | undefined;
  addImageError: boolean;
  photoLibraryId: string;
  inputAccountId: string;
  inputAccountIdError: boolean;
  description: string;
  pictures: any;
  isPictureExplicit: boolean;
  descriptionError: string;
  pictureError: string;
  isLoading: boolean;
  pictureId: string;
  showMenu: boolean;
  cancelPopup: boolean;
  showSuccessToast: boolean;
  previewUserName: string;
  previewProfileImage: string;
  isPreviewStep: boolean;
  // Customizable Area End
}

interface SS {
  id: string;
  // Customizable Area Start
  // Customizable Area End
}

export default class PhotoLibraryController extends BlockComponent<
  Props,
  S,
  SS
> {
  // Customizable Area Start
  getPhotoLibraryApiCallId = '';
  addImageToPhotoLibraryApiCallId = '';
  deletePhotoLibraryApiCallId = '';
  sharePhotoLibraryApiCallId = '';
  postAPictureApiCallId: any;
  getPictureDetailApiCallId: any;
  isRetryingPostPicture: boolean = false;
  // Customizable Area End

  constructor(props: Props) {
    super(props);
    this.receive = this.receive.bind(this);

    this.subScribedMessages = [
      getName(MessageEnum.SessionResponseMessage),
      getName(MessageEnum.RestAPIResponceMessage),
      getName(MessageEnum.RestAPIResponceDataMessage),
      getName(MessageEnum.RestAPIResponceSuccessMessage),
      getName(MessageEnum.RestAPIResponceErrorMessage),
      // Customizable Area Start
      // Customizable Area End
    ];

    this.state = {
      // Customizable Area Start
      token: '',
      isAddImageModalVisible: false,
      isViewImageModalVisible: false,
      isVisibleDeleteCheckbox: false,
      isShareModalVisible: false,
      selectedImage: { uri: '' },
      viewSelectedImage: { uri: '' },
      selectedImageId: '',
      addImageError: false,
      imageData: [],
      photoLibraryId: '',
      inputAccountId: '',
      inputAccountIdError: false,
      description: '',
      pictures: {},
      isPictureExplicit: false,
      descriptionError: '',
      pictureError: '',
      isLoading: false,
      pictureId: '',
      showMenu: false,
      cancelPopup: false,
      showSuccessToast: false,
      previewUserName: '',
      previewProfileImage: '',
      isPreviewStep: !(
        props.route?.params?.eventId ||
        props.navigation?.state?.params?.eventId
      ),
      // Customizable Area End
    };
    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);

    // Customizable Area Start
    this.isStringNullOrBlank = this.isStringNullOrBlank.bind(this);
    // Customizable Area End
  }

  async receive(from: string, message: Message) {
    runEngine.debugLog('Message Recived', message);

    if (getName(MessageEnum.SessionResponseMessage) === message.id) {
      // console.log('PhotoLibrary - SessionResponseMessage received');
      let token: string = message.getData(
        getName(MessageEnum.SessionResponseToken),
      );
      // console.log('PhotoLibrary - Token received:', token ? 'Present' : 'Missing');
      runEngine.debugLog('TOKEN', token);
      if (token) {
        this.setState({ token });
        // console.log('PhotoLibrary - Token set in state, calling getPhotoLibrary');
        this.getPhotoLibrary(token);
      }
    }

    if (
      getName(MessageEnum.RestAPIResponceMessage) === message.id &&
      this.getPhotoLibraryApiCallId != null &&
      this.getPhotoLibraryApiCallId ===
        message.getData(getName(MessageEnum.RestAPIResponceDataMessage))
    ) {
      const responseJson = message.getData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
      );

      if (!responseJson.errors && responseJson && responseJson.data) {
        let newPhotoArr = [];
        newPhotoArr = responseJson.data.attributes.photos.map(
          (imgData: ImageListType, index: number) => {
            return {
              ...imgData,
              id: (index + 1).toString(),
              isSelected: false,
            };
          },
        );
        this.setState({
          imageData: newPhotoArr,
          photoLibraryId: responseJson.data.id,
        });
      } else if (responseJson && responseJson.errors) {
        this.showAlert('Alert', 'Something went wrong.');
      }
    }

    if (
      getName(MessageEnum.RestAPIResponceMessage) === message.id &&
      this.addImageToPhotoLibraryApiCallId != null &&
      this.addImageToPhotoLibraryApiCallId ===
        message.getData(getName(MessageEnum.RestAPIResponceDataMessage))
    ) {
      const responseJson = message.getData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
      );

      if (!responseJson.errors && responseJson && responseJson.data) {
        alert('Image added successfully');
        this.getPhotoLibrary(this.state.token);
      } else if (responseJson && responseJson.errors) {
        this.showAlert('Alert', 'Something went wrong.');
      }
    }

    if (
      getName(MessageEnum.RestAPIResponceMessage) === message.id &&
      this.deletePhotoLibraryApiCallId != null &&
      this.deletePhotoLibraryApiCallId ===
        message.getData(getName(MessageEnum.RestAPIResponceDataMessage))
    ) {
      const responseJson = message.getData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
      );

      if (!responseJson.errors && responseJson.message) {
        alert(responseJson.message);
      } else {
        const errorResponse = message.getData(
          getName(MessageEnum.RestAPIResponceErrorMessage),
        );
        this.parseApiCatchErrorResponse(errorResponse);
      }
    }

    if (
      getName(MessageEnum.RestAPIResponceMessage) === message.id &&
      this.sharePhotoLibraryApiCallId != null &&
      this.sharePhotoLibraryApiCallId ===
        message.getData(getName(MessageEnum.RestAPIResponceDataMessage))
    ) {
      const responseJson = message.getData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
      );

      if (!responseJson.errors && responseJson.message) {
        this.setState({ isShareModalVisible: false });
        alert(responseJson.message);
      } else {
        const errorResponse = message.getData(
          getName(MessageEnum.RestAPIResponceErrorMessage),
        );
        this.parseApiCatchErrorResponse(errorResponse);
      }
    }

    // Customizable Area Start
    if (getName(MessageEnum.RestAPIResponceMessage) === message.id) {
      this.handleRestAPIResponse(message);
    }
    // Customizable Area End
  }

  async componentDidMount() {
    // console.log('PhotoLibrary - componentDidMount called');
    super.componentDidMount();
    // Customizable Area Start
    // console.log('PhotoLibrary - Calling getToken');
    this.getToken();
    if (this.isPlatformWeb()) this.getPhotoLibrary(this.state.token);
    // console.log('PhotoLibrary - Calling getImageSelectionData');
    this.getImageSelectionData();
    this.loadPreviewUser();

    // Add navigation listener to handle params when screen comes into focus
    if (!this.isPlatformWeb()) {
      this.props.navigation.addListener('willFocus', () => {
        // console.log('PhotoLibrary - Screen will focus, checking params again');
        this.getImageSelectionData();
      });
    }
    // Customizable Area End
  }

  // Customizable Area Start

  handleRestAPIResponse = (message: Message) => {
    // console.log('PhotoLibrary - handleRestAPIResponse called');
    const apiRequestCallId = message.getData(
      getName(MessageEnum.RestAPIResponceDataMessage),
    );
    // console.log('PhotoLibrary - API Request Call ID from message:', apiRequestCallId);

    const responseJson = message.getData(
      getName(MessageEnum.RestAPIResponceSuccessMessage),
    );
    const errorResponse = message.getData(
      getName(MessageEnum.RestAPIResponceErrorMessage),
    );
    // console.log('PhotoLibrary - Response JSON:', responseJson);
    // console.log('PhotoLibrary - Error Response:', errorResponse);

    // Stop loader for post picture API call or get picture details API call
    if (
      apiRequestCallId === this.postAPictureApiCallId ||
      apiRequestCallId === this.getPictureDetailApiCallId
    ) {
      // console.log('PhotoLibrary - This is post picture or get picture details API response, stopping loader');
      this.setState({ isLoading: false });
    }

    if (responseJson && responseJson.errors) {
      // console.log('PhotoLibrary - Response has errors, calling handleAPIErrors');
      // Ensure loader stops for post picture API or get picture details API on error
      if (
        apiRequestCallId === this.postAPictureApiCallId ||
        apiRequestCallId === this.getPictureDetailApiCallId
      ) {
        this.setState({ isLoading: false });
      }
      this.handleAPIErrors(responseJson);
    } else if (
      errorResponse &&
      (apiRequestCallId === this.postAPictureApiCallId ||
        apiRequestCallId === this.getPictureDetailApiCallId)
    ) {
      // console.log('PhotoLibrary - Error response for post picture or get picture details API');
      this.setState({ isLoading: false });
      this.parseApiCatchErrorResponse(errorResponse);
    } else if (responseJson) {
      // console.log('PhotoLibrary - Response successful, calling handleRestAPISuccessResponse');
      this.handleRestAPISuccessResponse(apiRequestCallId, responseJson);
    } else if (
      apiRequestCallId === this.postAPictureApiCallId ||
      apiRequestCallId === this.getPictureDetailApiCallId
    ) {
      // console.log('PhotoLibrary - No response JSON found for post picture or get picture details API, stopping loader');
      this.setState({ isLoading: false });
    }
  };

  handleAPIErrors = (responseJson: any) => {
    // console.log('PhotoLibrary - handleAPIErrors called');
    // console.log('PhotoLibrary - Error response:', responseJson);
    this.parseApiErrorResponse(responseJson.errors);
    this.parseApiCatchErrorResponse(responseJson.errors);
  };

  handleRestAPISuccessResponse = (apiRequestCallId: any, responseJson: any) => {
    // console.log('PhotoLibrary - handleRestAPISuccessResponse called');
    // console.log('PhotoLibrary - API Request Call ID:', apiRequestCallId);
    // console.log('PhotoLibrary - postAPictureApiCallId:', this.postAPictureApiCallId);
    // console.log('PhotoLibrary - getPictureDetailApiCallId:', this.getPictureDetailApiCallId);

    if (apiRequestCallId === this.postAPictureApiCallId) {
      // console.log('PhotoLibrary - Routing to handlePostAPictureAPIResponse');
      this.handlePostAPictureAPIResponse(responseJson);
    } else if (apiRequestCallId === this.getPictureDetailApiCallId) {
      // console.log('PhotoLibrary - Routing to handleGetPictureDetailAPIResponse');
      this.handleGetPictureDetailAPIResponse(responseJson);
    } else {
      // console.log('PhotoLibrary - No matching API call ID found');
    }
  };

  handleGetPictureDetailAPIResponse = (responseJson: any) => {
    // Always stop the loader when picture details response is received
    this.setState({ isLoading: false });

    if (responseJson != null && !responseJson.errors) {
      this.handleGetPictureDetailAPISuccessResponse(responseJson.data);
    } else {
      this.parseApiErrorResponse(responseJson);
    }
  };

  handleGetPictureDetailAPISuccessResponse = (responseData: any) => {
    this.setState({
      description: responseData.attributes.description,
      pictures: {
        uri: responseData.attributes.images_and_videos[0].url,
      },
      isPictureExplicit: responseData.attributes.is_explicit,
    });
  };

  handlePostAPictureAPIResponse = (responseJson: any) => {
    // console.log('PhotoLibrary - handlePostAPictureAPIResponse called');
    // console.log('PhotoLibrary - Response data:', responseJson);
    // console.log('PhotoLibrary - Setting isLoading: false');
    // Always stop the loader first
    this.setState({ isLoading: false });

    if (responseJson != null && !responseJson.errors) {
      // console.log('PhotoLibrary - API call successful, navigating...');

      if (this.state.pictureId === '') {
        this.setState({ showSuccessToast: true }, () => {
          setTimeout(() => {
            this.setState({ showSuccessToast: false });
            this.navigateToHomeAfterPost();
          }, 2000);
        });
      } else {
        // Editing post - navigate to calendar screen
        this.setState({ showSuccessToast: true }, () => {
          setTimeout(() => {
            this.setState({ showSuccessToast: false });
            this.props.navigation.navigate('Filteritems');
          }, 2000);
        });
      }
    } else {
      // console.log('PhotoLibrary - API call failed:', responseJson?.errors);
      // Ensure loader is stopped on error
      this.setState({ isLoading: false });
      if (responseJson) {
        this.parseApiErrorResponse(responseJson);
      }
    }
  };

  sendHomeNavigationMessage = () => {
    const msg: Message = new Message(getName(MessageEnum.NavigationMessage));
    msg.addData(getName(MessageEnum.NavigationPropsMessage), this.props);
    msg.addData(getName(MessageEnum.NavigationTargetMessage), 'Home');

    const info = {
      isPostPictureSuccessfullyCreated: true,
      successMessage: {
        title: configJSON.postCreatedAlertMessageTitle,
        description: configJSON.postCreatedAlertMessageDescription,
      },
    };
    const raiseMessage: Message = new Message(
      getName(MessageEnum.NavigationPayLoadMessage),
    );
    raiseMessage.addData(getName(MessageEnum.HelpCentreMessageData), info);

    msg.addData(getName(MessageEnum.NavigationRaiseMessage), raiseMessage);
    this.send(msg);
  };

  navigateToHomeAfterPost = () => {
    // Pop back to the first screen in the Post stack, then navigate to HomeTab
    // This ensures when user comes back to Post tab, it starts fresh from PostSelection
    if (this.props.navigation) {
      this.props.navigation.popToTop();
      this.props.navigation.navigate('HomeTab');
    }
  };

  loadPreviewUser = async () => {
    try {
      const previewUserName = (await getStorageData('user_name')) || '';
      const previewProfileImage = (await getStorageData('profile_image')) || '';
      this.setState({ previewUserName, previewProfileImage });
    } catch (error) {
      console.log('PhotoLibrary - loadPreviewUser error:', error);
    }
  };

  handleBackFromPreview = () => {
    if (this.state.pictureId) {
      this.setState({ isPreviewStep: false });
      return;
    }
    this.props.navigation.goBack();
  };

  getImageSelectionData = () => {
    // console.log('PhotoLibrary - getImageSelectionData called - START');
    // console.log('PhotoLibrary - this.props.route:', this.props.route);
    // console.log('PhotoLibrary - this.props.navigation:', this.props.navigation);
    // console.log('PhotoLibrary - this.props.navigation.state:', this.props.navigation?.state);

    // Try multiple ways to access params for React Navigation compatibility
    const routeParams = this.props.route?.params;
    const navParams = this.props.navigation?.state?.params;
    const params = routeParams || navParams;

    const eventId = params?.eventId;
    const pictures = params?.event_image;
    const isPictureExplicit = params?.isPictureExplicit;
    const description = params?.description;

    // console.log('PhotoLibrary - Route params:', routeParams);
    // console.log('PhotoLibrary - Navigation params:', navParams);
    // console.log('PhotoLibrary - Combined params:', params);
    // console.log('PhotoLibrary - eventId:', eventId);
    // console.log('PhotoLibrary - pictures:', pictures);
    // console.log('PhotoLibrary - pictures type:', typeof pictures);
    // console.log('PhotoLibrary - pictures.uri:', pictures?.uri);
    // console.log('PhotoLibrary - isPictureExplicit:', isPictureExplicit);

    if (eventId) {
      // console.log('PhotoLibrary - Setting pictureId and getting picture details');
      this.setState({ pictureId: eventId, isPreviewStep: false }, () => {
        this.getPictureDetails();
      });
    } else if (pictures) {
      // console.log('PhotoLibrary - Setting pictures and isPictureExplicit from params');
      // console.log('PhotoLibrary - Pictures object before setState:', JSON.stringify(pictures, null, 2));
      this.setState(
        {
          pictures,
          isPictureExplicit:
            isPictureExplicit !== undefined ? isPictureExplicit : false,
          description:
            description !== undefined ? description : this.state.description,
          isPreviewStep: !eventId,
        },
        () => {
          // console.log('PhotoLibrary - State updated, pictures in state:', this.state.pictures);
          // console.log('PhotoLibrary - pictures.uri in state:', this.state.pictures?.uri);
        },
      );
    } else {
      // console.log('PhotoLibrary - No eventId or pictures found in params');
      // console.log('PhotoLibrary - Pictures will need to be selected before posting');
    }
  };

  getToken = () => {
    const msg: Message = new Message(
      getName(MessageEnum.SessionRequestMessage),
    );
    this.send(msg);
  };

  handlebtnAddImage = () => {
    this.setState({
      selectedImage: { uri: '' },
      isAddImageModalVisible: true,
      addImageError: false,
    });
  };

  handlebtnViewImage = (item: ImageListType) => {
    this.setState({
      selectedImageId: item.id,
      viewSelectedImage: { uri: item.file_url },
      isViewImageModalVisible: true,
    });
  };

  handleAnputAccountID = (accountId: string) => {
    this.setState({ inputAccountId: accountId, inputAccountIdError: false });
  };

  closeViewImageModal = () => {
    this.setState({ isViewImageModalVisible: false });
  };

  closeShareModal = () => {
    this.setState({ isShareModalVisible: false });
  };

  openShareModal = () => {
    this.setState({
      isShareModalVisible: true,
      inputAccountIdError: false,
      inputAccountId: '',
    });
  };

  closeAddImageModal = () => {
    this.setState({ isAddImageModalVisible: false });
  };

  handleDeleteGallery = () => {
    this.setState({ imageData: [] });
    this.deletePhotoLibrary(this.state.photoLibraryId);
  };

  toggleDeleteMultipleImages = () => {
    this.setState({
      isVisibleDeleteCheckbox: !this.state.isVisibleDeleteCheckbox,
    });
  };

  deleteSelectedImages = () => {
    this.setState({
      imageData: this.state.imageData.filter(
        (image: ImageListType) => !image.isSelected,
      ),
      isVisibleDeleteCheckbox: false,
    });
  };

  handleDeleteImage = () => {
    this.setState({
      imageData: this.state.imageData.filter(
        (image: ImageListType) => image.id !== this.state.selectedImageId,
      ),
      isViewImageModalVisible: false,
    });
  };

  toggleImageChecked = (imageData: ImageListType) => {
    let newData = this.state.imageData.map((account: ImageListType) => {
      if (account.id === imageData.id) {
        return { ...account, isSelected: !account.isSelected };
      }
      return account;
    });
    this.setState({ imageData: newData });
  };

  openImagePicker = async (event?: React.ChangeEvent<HTMLInputElement>) => {
    if (this.isPlatformWeb()) {
      if (event && event.target.files && event.target.files.length > 0) {
        const reader = new FileReader();
        reader.addEventListener('load', () =>
          this.setState({
            selectedImage: { uri: reader.result?.toString() || '' },
            addImageError: false,
          }),
        );
        reader.readAsDataURL(event.target.files[0]);
      }
      return;
    }
  };

  isStringNullOrBlank = (str: string) => {
    return str === null || str.length === 0;
  };

  handleAddnewImage = async () => {
    const ImagePicker = require('react-native-image-crop-picker');
    const imageData: Image = await ImagePicker.openPicker({
      cropping: true,
      includeBase64: true,
      includeExif: true,
    });

    const source = { uri: `data:${imageData.mime};base64,` + imageData.data };
    this.setState({
      selectedImage: source,
      addImageError: false,
    });
  };

  handleSaveImage = () => {
    if (this.state.selectedImage.uri !== '') {
      const data = this.state.imageData;
      let imgObj = {
        id: (data.length + 3).toString(),
        isSelected: false,
        file_name: 'abc',
        file_url: this.state.selectedImage.uri,
      };
      data.push(imgObj);
      this.setState({
        imageData: data,
        isAddImageModalVisible: false,
        addImageError: false,
      });
    } else {
      this.setState({ addImageError: true });
    }
    this.addImageToPhotoLibrary('');
  };

  getPhotoLibrary = (token: string) => {
    // console.log('PhotoLibrary - getPhotoLibrary called');
    // console.log('PhotoLibrary - isPlatformWeb:', this.isPlatformWeb());
    if (this.isPlatformWeb() === true) {
      // console.log('PhotoLibrary - Platform is web, making API call');
      const header = {
        'Content-Type': configJSON.apiContentType,
        token,
      };
      const requestMessage = new Message(
        getName(MessageEnum.RestAPIRequestMessage),
      );

      this.getPhotoLibraryApiCallId = requestMessage.messageId;

      requestMessage.addData(
        getName(MessageEnum.RestAPIResponceEndPointMessage),
        `${configJSON.photoLibraryApiEndpoint}`,
      );
      requestMessage.addData(
        getName(MessageEnum.RestAPIRequestHeaderMessage),
        JSON.stringify(header),
      );
      requestMessage.addData(
        getName(MessageEnum.RestAPIRequestMethodMessage),
        configJSON.getApiMethod,
      );

      runEngine.sendMessage(requestMessage.id, requestMessage);
    } else {
      // console.log('PhotoLibrary - Platform is not web, skipping getPhotoLibrary API call');
    }
  };

  addImageToPhotoLibrary = (token: string) => {
    if (this.state.selectedImage.uri === '') {
      this.setState({ addImageError: true });
    }
    const header = {
      'Content-Type': configJSON.apiContentType,
      token,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );

    this.addImageToPhotoLibraryApiCallId = requestMessage.messageId;

    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      `${configJSON.photoLibraryApiEndpoint}`,
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header),
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.postApiMethod,
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);
  };

  deletePhotoLibrary = (galleryId: string) => {
    const header = {
      'Content-Type': configJSON.apiContentType,
      token: this.state.token,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );
    this.deletePhotoLibraryApiCallId = requestMessage.messageId;

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.deleteApiMethod,
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.photoLibraryApiEndpoint + '/' + `${galleryId}`,
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header),
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);
  };

  sharePhotoLibrary = () => {
    if (this.isStringNullOrBlank(this.state.inputAccountId)) {
      this.setState({ inputAccountIdError: true });
    } else {
      const header = {
        'Content-Type': configJSON.apiContentType,
        token: this.state.token,
      };
      const requestMessage = new Message(
        getName(MessageEnum.RestAPIRequestMessage),
      );
      this.sharePhotoLibraryApiCallId = requestMessage.messageId;

      requestMessage.addData(
        getName(MessageEnum.RestAPIRequestMethodMessage),
        configJSON.postApiMethod,
      );
      requestMessage.addData(
        getName(MessageEnum.RestAPIResponceEndPointMessage),
        configJSON.photoLibraryApiEndpoint +
          '/' +
          `${this.state.photoLibraryId}` +
          '/share',
      );
      requestMessage.addData(
        getName(MessageEnum.RestAPIRequestHeaderMessage),
        JSON.stringify(header),
      );

      runEngine.sendMessage(requestMessage.id, requestMessage);
    }
  };

  checkValidation = () => {
    let error = false;

    this.setState({
      descriptionError: '',
      pictureError: '',
    });

    if (isEmpty(this.state.description)) {
      this.setState({ descriptionError: configJSON.emptyDescription });
      error = true;
    }

    if (!this.state.pictures || !this.state.pictures.uri) {
      this.setState({ pictureError: configJSON.noImageErrorMsg });
      error = true;
    }

    if (error) {
      return false;
    }
    Keyboard.dismiss();
    return true;
  };

  handlePostAPictureAPI = async () => {
    // console.log('PhotoLibrary - handlePostAPictureAPI called');
    // console.log('PhotoLibrary - Current state pictures:', this.state.pictures);
    // console.log('PhotoLibrary - Pictures type:', typeof this.state.pictures);
    // console.log('PhotoLibrary - Pictures URI:', this.state.pictures?.uri);
    // console.log('PhotoLibrary - Pictures keys:', this.state.pictures ? Object.keys(this.state.pictures) : 'pictures is null/undefined');

    // Try to get pictures from params again if state is empty
    if (!this.state.pictures || !this.state.pictures.uri) {
      // Prevent infinite recursion
      if (this.isRetryingPostPicture) {
        // console.log('PhotoLibrary - Already retrying, preventing infinite loop');
        this.setState({
          isLoading: false,
          pictureError: configJSON.noImageErrorMsg,
        });
        this.isRetryingPostPicture = false;
        return;
      }

      // console.log('PhotoLibrary - Pictures not in state, checking params again');
      const routeParams = this.props.route?.params;
      const navParams = this.props.navigation?.state?.params;
      const params = routeParams || navParams;
      const picturesFromParams = params?.event_image;

      // console.log('PhotoLibrary - Pictures from params:', picturesFromParams);
      // console.log('PhotoLibrary - Pictures from params URI:', picturesFromParams?.uri);

      if (picturesFromParams && picturesFromParams.uri) {
        // console.log('PhotoLibrary - Found pictures in params, updating state');
        this.isRetryingPostPicture = true;
        this.setState({ pictures: picturesFromParams }, () => {
          // console.log('PhotoLibrary - State updated with pictures from params');
          // console.log('PhotoLibrary - pictures.uri after update:', this.state.pictures?.uri);
          this.isRetryingPostPicture = false;
          // Retry the API call after state is updated

          this.handlePostAPictureAPI();
        });
        return;
      } else {
        // console.log('PhotoLibrary - No pictures found in params either');
        this.setState({
          isLoading: false,
          pictureError: configJSON.noImageErrorMsg,
        });
        return;
      }
    }

    if (this.checkValidation()) {
      // console.log('PhotoLibrary - Validation passed, setting isLoading: true');
      this.setState({ isLoading: true });
      const authToken = await getStorageData('authToken');
      // console.log('PhotoLibrary - Auth token:', authToken ? 'Present' : 'Missing');
      const header = {
        'Content-Type': configJSON.contentTypeFormData,
        token: authToken,
      };

      // console.log('PhotoLibrary - Current state pictures:', this.state.pictures);
      // console.log('PhotoLibrary - Pictures URI:', this.state.pictures?.uri);

      // Validate that pictures.uri exists
      if (!this.state.pictures || !this.state.pictures.uri) {
        // console.log('PhotoLibrary - No picture URI found, cannot post');
        this.setState({
          isLoading: false,
          pictureError: configJSON.noImageErrorMsg,
        });
        return;
      }

      const formData = new FormData();
      formData.append(
        'data[attributes][description]',
        this.state.description.trim(),
      );
      formData.append(
        'data[attributes][is_explicit]',
        this.state.isPictureExplicit.toString(),
      );
      const showPictures = {
        uri: this.state.pictures.uri,
        type: 'image/jpeg',
        name: 'eventImage.jpg',
      };
      // console.log('PhotoLibrary - showPictures object:', showPictures);
      formData.append('data[attributes][images][]', showPictures as any);

      const endpoint =
        this.state.pictureId === ''
          ? configJSON.postAPictureEndPoint
          : `${configJSON.postAPictureEndPoint}/${this.state.pictureId}`;
      const methodType =
        this.state.pictureId === ''
          ? configJSON.postApiMethod
          : configJSON.patchApiMethod;
      const requestMessage = new Message(
        getName(MessageEnum.RestAPIRequestMessage),
      );

      this.postAPictureApiCallId = requestMessage.messageId;

      //   setTimeout(() => {
      //   if (this.state.isLoading) {
      //     // console.log('PhotoLibrary - API call timeout! No response received after 10 seconds');
      //     // console.log('PhotoLibrary - Setting isLoading: false due to timeout');
      //     this.setState({ isLoading: false });
      //   }
      // }, 10000);
      //   return

      requestMessage.addData(
        getName(MessageEnum.RestAPIResponceEndPointMessage),
        endpoint,
      );

      requestMessage.addData(
        getName(MessageEnum.RestAPIRequestHeaderMessage),
        JSON.stringify(header),
      );

      requestMessage.addData(
        getName(MessageEnum.RestAPIRequestBodyMessage),
        formData,
      );

      requestMessage.addData(
        getName(MessageEnum.RestAPIRequestMethodMessage),
        methodType,
      );

      // console.log('PhotoLibrary - Sending API request');
      // console.log('PhotoLibrary - API Call ID:', this.postAPictureApiCallId);
      runEngine.sendMessage(requestMessage.id, requestMessage);
      // this.setState({ isLoading: false });

      // Add timeout to detect if API call hangs
      setTimeout(() => {
        if (this.state.isLoading) {
          // console.log('PhotoLibrary - API call timeout! No response received after 10 seconds');
          // console.log('PhotoLibrary - Setting isLoading: false due to timeout');
          this.setState({ isLoading: false });
        }
      }, 10000);
    } else {
      // console.log('PhotoLibrary - Validation failed, not making API call');
    }
  };

  getPictureDetails = async () => {
    this.setState({ isLoading: true });
    const authToken = await getStorageData('authToken');
    const header = {
      'Content-Type': configJSON.contentTypeFormData,
      token: authToken,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );

    this.getPictureDetailApiCallId = requestMessage.messageId;

    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      `${configJSON.postAPictureEndPoint}/${this.state.pictureId}`,
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header),
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.validationApiMethodType,
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);
  };
  // Customizable Area End
}

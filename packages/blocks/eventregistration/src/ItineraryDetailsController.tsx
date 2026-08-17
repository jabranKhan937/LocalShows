// Customizable Area Start
import {IBlock} from '../../../framework/src/IBlock';
import {Message} from '../../../framework/src/Message';
import {BlockComponent} from '../../../framework/src/BlockComponent';
import MessageEnum, {
  getName,
} from '../../../framework/src/Messages/MessageEnum';
import {runEngine} from '../../../framework/src/RunEngine';
import {CommonActions} from '@react-navigation/native';
import {getStorageData, setStorageData} from '../../../framework/src/Utilities';
import moment from 'moment';
import {Linking} from 'react-native';
interface Types {
  id: string;
  type: string;
  attributes: {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
  };
}
export interface EventData {
  id: string;
  type: string;
  date: string;
  avatar: string;
  name: string;
  location: string;
  image: string;
  title: string;
  description: string;
  post: Post;
  added_in_calendar: boolean;
}
type Comments = {
  title: string;
  description: string;
};
type Post = {
  likes: number;
  comments?: Comments[];
  likeByMe: boolean;
};
type SearchParams = {
  selectedCity: string;
  selectedState: string;
  startDate: string;
  endDate: string;
  selectedCountryCode: string;
  selectedType?: Types;
};

export interface ResponseEventData {
  id: string;
  type: string;
  attributes: Attributes;
}

export interface Attributes {
  id: number;
  event_title: string;
  date_of_the_show: Date;
  time: string;
  description: string;
  rules_and_regulations: null;
  city: string;
  state: string;
  country: string;
  zip_code: number;
  address: string;
  location: string;
  account_id: number;
  sold_out: boolean;
  postpone_show: boolean;
  type: string;
  likes_count: number;
  comment_count: number;
  band_name: string;
  band_profile_image: string;
  profile_image: string;
  like_by_me: boolean;
  added_in_calendar: boolean;
}
interface Category {
  id: string;
  type: string;
  attributes: {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
  };
}
type Reply = {
  reply: string;
  likes_count: number;
  account_id: number;
  account_name: string;
  profile_image: string;
};
export interface CommentProps {
  id: string;
  type: string;
  attributes: {
    account_id: number;
    commentable_id: number;
    commentable_type: string;
    comment: string;
    replies: Reply[];
    created_at?: string;
    account: {
      id: number;
      account_type: string;
      profile_image_url: string;
      first_name: string;
    };
  };
}
interface UserInfo {
  id: string;
  token: string;
  avatar?: string;
}

// Customizable Area End

export const configJSON = require('./config');

export interface Props {
  navigation: any;
  id: string;
  // Customizable Area Start
  // Customizable Area End
}

interface S {
  // Customizable Area Start
  showAcceptBtn: boolean;
  isLoading: boolean;
  showComments: boolean;
  commentedText: string;
  eventsData: EventData[];
  selectedParams: SearchParams;
  categories: Category[];
  selectedEvent: EventData;
  addedEvents: string;
  isReplying: boolean;
  userInfo: UserInfo;
  isCommentsLoading: boolean;
  isEditing: boolean;
  showReplies: boolean;
  commentId: string;
  replyId: string;
  commentWithReply: any;
  commentsList: CommentProps[];
  // Customizable Area End
}

interface SS {
  id: any;
  // Customizable Area Start
  // Customizable Area End
}

export default class ItineraryDetailsController extends BlockComponent<
  Props,
  S,
  SS
> {
  // Customizable Area Start
  getShowsApiCallId: string = '';
  getTravelsParamsApiCallId: string = '';
  getCategoriesApiCallId: string = '';
  postToogleLikeEventApiCallId: string = '';
  defaultEmojisForSelectionBar: string[] = [
    '️💖',
    '🙌',
    '🔥',
    '👏',
    '😢',
    '😍',
    '😲',
    '😂',
  ];
  commentTextInput: any;
  createEditLikeCommentAPICallID: string = '';
  getCommentsAPICallID: string = '';
  calanderAddApiCallID: string = '';
  // Customizable Area End

  constructor(props: Props) {
    super(props);
    this.receive = this.receive.bind(this);

    // Customizable Area Start

    this.subScribedMessages = [
      // Customizable Area Start
      getName(MessageEnum.NavigationPayLoadMessage),
      getName(MessageEnum.RestAPIResponceMessage),
      // Customizable Area End
    ];

    this.state = {
      // Customizable Area Start
      showAcceptBtn: false,
      eventsData: [],
      addedEvents: '',
      showComments: false,
      commentedText: '',
      userInfo: {} as UserInfo,
      isReplying: false,
      selectedEvent: {} as EventData,
      isLoading: true,
      categories: [],
      isEditing: false,
      commentsList: [],
      selectedParams: {
        endDate: '',
        selectedCity: '',
        selectedState: '',
        startDate: '',
        selectedCountryCode: '',
        selectedType: {} as Types,
      },
      isCommentsLoading: false,
      showReplies: false,
      commentId: '',
      replyId: '',
      commentWithReply: undefined,

      // Customizable Area End
    };
    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);

    // Customizable Area Start
    // Customizable Area End
  }

  async receive(from: string, message: Message) {
    runEngine.debugLog('Message Recived', message);
    // Customizable Area Start
    if (getName(MessageEnum.NavigationPayLoadMessage) === message.id) {
      this.handlePayload(message);
    }
    this.handleRestAPIResponseMessage(message);
    const apiRequestCallId = message.getData(
      getName(MessageEnum.RestAPIResponceDataMessage),
    );
    if (apiRequestCallId === this.calanderAddApiCallID) {
      this.handleAddCalanderResponse(message);
    }
    // Customizable Area End
  }

  // Customizable Area Start
  async componentDidMount(): Promise<void> {
    await this.handleGetUserInformation().then(() => {
      this.handleGetCategories();
    });
  }
  handleGetUserInformation = async () => {
    const id = await getStorageData('user_id');
    const token = await getStorageData('authToken');
    const avatar = await getStorageData('user_profile_pic');

    this.setState({
      userInfo: {
        id,
        token,
        avatar,
      },
    });
  };
  handlePayload = (message: Message) => {
    const params = message.getData(getName(MessageEnum.HelpCentreMessageData));
    if (params) {
      const {
        selectedCity,
        selectedState,
        startDate,
        endDate,
        selectedCountryCode,
        selectedType,
        itineraryId,
      } = params;
      const selectedParams = {
        selectedCity,
        selectedState,
        startDate,
        endDate,
        selectedCountryCode,
        selectedType,
      };
      this.setState({
        selectedParams,
      });
      if (itineraryId) {
        return this.handleGetTravelsSearchParams(itineraryId);
      }

      this.handleGetTravelsList(selectedParams);
    }
  };
  handleRestAPIResponseMessage = (message: Message) => {
    const errorResponse = message.getData(
      getName(MessageEnum.RestAPIResponceErrorMessage),
    );
    const successResponse = message.getData(
      getName(MessageEnum.RestAPIResponceSuccessMessage),
    );

    const apiRequestCallId = message.getData(
      getName(MessageEnum.RestAPIResponceDataMessage),
    );
    if (apiRequestCallId && successResponse) {
      this.handleSuccessfulAPIResponse(apiRequestCallId, successResponse);
    } else {
      if (apiRequestCallId === this.getShowsApiCallId && errorResponse) {
        console.log('[Eventregistration Search API] Error response', {
          apiRequestCallId,
          errorResponse,
        });
      }
      this.handleErrorResponse(errorResponse);
    }
  };
  handleSuccessfulAPIResponse = (
    apiRequestCallID: string,
    responseJson: any,
  ) => {
    if (apiRequestCallID === this.getShowsApiCallId) {
      console.log('[Eventregistration Search API] Success response', {
        apiRequestCallID,
        responseJson,
      });
      this.handleGetShowsResponse(responseJson);
    } else if (apiRequestCallID === this.getCategoriesApiCallId) {
      this.handleGetCategoriesResponse(responseJson);
    } else if (apiRequestCallID === this.getTravelsParamsApiCallId) {
      this.handleGetTravelsSearchParamsResponse(responseJson);
    } else if (apiRequestCallID === this.postToogleLikeEventApiCallId) {
      this.handlePostToogleLikeResponse(responseJson);
    } else if (apiRequestCallID === this.createEditLikeCommentAPICallID) {
      this.handleCreateCommentAPIResponse();
    } else if (apiRequestCallID === this.getCommentsAPICallID) {
      this.handleGetCommentsApiResponse(responseJson);
    }
  };
  handleErrorResponse = (errorResponse: any) => {
    this.parseApiErrorResponse(errorResponse);
  };
  handleGetCategoriesResponse = (responseJson: any) => {
    const {data} = responseJson;

    this.setState({categories: data});
  };
  handleGetTravelsSearchParamsResponse = (responseJson: any) => {
    const {start_date, end_date, city, country, category_id} =
      responseJson.travel.data.attributes;
    const {selectedState} = this.state.selectedParams;
    if (!responseJson.errors) {
      const categoryData = this.handleGetCategoryData(category_id);
      const travelsParams = {
        selectedState,
        startDate: moment(start_date).format('MMM DD YYYY'),
        endDate: moment(end_date).format('MMM DD YYYY'),
        selectedCity: city,
        selectedCountryCode: country,
        selectedType: categoryData,
      };
      this.setState({
        selectedParams: {
          ...travelsParams,
        },
      });
      this.handleGetTravelsList(travelsParams);
    }
  };
  handleGetCommentsApiResponse = (responseJson: any) => {
    this.setState({isCommentsLoading: false});

    if (responseJson.data.length) {
      responseJson.data.forEach((responseItem: any) => {
        responseItem.key = responseItem.id;
        if (
          responseItem.attributes.replies &&
          responseItem.attributes.replies.length > 0
        ) {
          responseItem.attributes.replies.forEach((reply: any) => {
            reply.key = reply.id;
          });
        }
        if (this.state.selectedEvent.id === responseItem.id) {
          this.setState({commentWithReply: responseItem});
        }
      });
      this.setState({commentsList: responseJson.data});
    }
  };
  handleGetShowsResponse = (responseJson: any) => {
    if (!responseJson.errors) {
      const eventsData: EventData[] = responseJson.data.map(
        (event: ResponseEventData) => ({
          id: event.id,
          type: event.type,
          date: moment(event.attributes.date_of_the_show).format(
            'dddd [,] DD MMM[,] YYYY',
          ),
          avatar: event.attributes.band_profile_image.trim(),
          name: event.attributes.event_title,
          location: event.attributes.location,
          image: event.attributes.profile_image,
          title: event.attributes.event_title,
          description: event.attributes.description,
          added_in_calendar: event.attributes.added_in_calendar,
          post: {
            likes: event.attributes.likes_count,
            likeByMe: event.attributes.like_by_me,
          },
        }),
      );
      this.setState({
        eventsData,
        isLoading: false,
      });
    } else {
      this.parseApiErrorResponse(responseJson);
    }
  };
  handleCreateCommentAPIResponse = () => {
    this.setState({isEditing: false, commentedText: ''}, () => {
      this.handleGetCommentsAPI();
      this.handleGetTravelsList();
    });
  };
  handlePostToogleLikeResponse = (responseJson: any) => {
    const {selectedEvent, eventsData} = this.state;
    let currentEventList: EventData[];
    if (responseJson.message) {
      currentEventList = eventsData.map(event => {
        if (event.id === selectedEvent.id) {
          return {
            ...event,
            post: {
              likeByMe: !event.post.likeByMe,
              likes: event.post.likes - 1,
            },
          };
        }

        return event;
      });
    } else {
      currentEventList = eventsData.map(event => {
        if (event.id === selectedEvent.id) {
          return {
            ...event,
            post: {
              likeByMe: !event.post.likeByMe,
              likes: event.post.likes + 1,
            },
          };
        }

        return event;
      });
    }
    this.setState({
      eventsData: currentEventList,
    });
  };
  handleBackNavigationPress = () => {
    const backMsg: Message = new Message(
      getName(MessageEnum.NavigationMessage),
    );
    backMsg.addData(getName(MessageEnum.NavigationPropsMessage), this.props);
    backMsg.addData(
      getName(MessageEnum.NavigationTargetMessage),
      'Eventregistration',
    );
    this.send(backMsg);
  };
  handleNotificationNavigationPressed = () => {
    const nestedNotificationRoute = {
      name: 'Home',
      params: {
        screen: 'HomeTab',
        params: {
          screen: 'Travel',
          params: {
            screen: 'Notifications',
          },
        },
      },
    };

    if (typeof this.props.navigation?.dispatch === 'function') {
      this.props.navigation.dispatch(
        CommonActions.navigate(nestedNotificationRoute),
      );
    } else if (typeof this.props.navigation?.navigate === 'function') {
      this.props.navigation.navigate('Home', {
        screen: 'HomeTab',
        params: {
          screen: 'Travel',
          params: {
            screen: 'Notifications',
          },
        },
      });
    }
  };
  showProfile = async (accountId: string, accountType: string) => {
    if (this.state.userInfo.token) {
      this.setState({showComments: false, showReplies: false});

      await setStorageData('profileIdToLoad', `${accountId}`);
      await setStorageData('IsFromComment', JSON.stringify(true));

      const screen =
        accountType === 'Band' || accountType === 'Artist'
          ? 'UserProfileBasicBlockArtist2'
          : 'UserProfileBasicBlock2';
      if (this.state.userInfo.id === accountId.toString()) {
        this.props.navigation.navigate('Profile', {
          isOtherUser: false,
        });
      } else {
        this.props.navigation.push(screen, {
          isOtherUser: true,
        });
      }
    }
  };
  handleGetCommentsAPI = () => {
    const eventId = this.state.selectedEvent.id;
    const type = 'Show';
    this.setState({isCommentsLoading: true});
    const message = new Message(getName(MessageEnum.RestAPIRequestMessage));

    this.getCommentsAPICallID = message.messageId;

    message.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      `${configJSON.getCommentsEndpoint}?commentable_id=${eventId}&commentable_type=${type}`,
    );

    message.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify({
        'Content-Type': configJSON.validationApiContentType,
        token: this.state.userInfo.token,
      }),
    );

    message.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.validationApiMethodType,
    );

    runEngine.sendMessage(message.id, message);
  };
  handleGetCategories = async () => {
    const getCategoriesListMsg = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );

    this.getCategoriesApiCallId = getCategoriesListMsg.messageId;

    getCategoriesListMsg.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.allCategoriesEndPoint,
    );

    getCategoriesListMsg.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify({
        'Content-Type': configJSON.validationApiContentType,
      }),
    );

    getCategoriesListMsg.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.validationApiMethodType,
    );

    runEngine.sendMessage(getCategoriesListMsg.id, getCategoriesListMsg);
  };
  handleToogleLikeEvent = async (selectedEvent: EventData) => {
    const {id: eventId} = selectedEvent;
    this.setState({
      selectedEvent,
    });

    const likeShowData = {
      like: {
        show_id: eventId,
        likeable: 'show',
      },
    };

    const postToogleLikeEventMsg = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );

    const body = JSON.stringify(likeShowData);
    this.postToogleLikeEventApiCallId = postToogleLikeEventMsg.messageId;

    postToogleLikeEventMsg.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.likeToogleEventEndPoint,
    );

    postToogleLikeEventMsg.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify({
        'Content-Type': configJSON.validationApiContentType,
        token: this.state.userInfo.token,
      }),
    );

    postToogleLikeEventMsg.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      body,
    );

    postToogleLikeEventMsg.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.postApiMethodType,
    );

    runEngine.sendMessage(postToogleLikeEventMsg.id, postToogleLikeEventMsg);
  };

  handleGetTravelsSearchParams = async (itineraryId: number) => {
    const token = await getStorageData('authToken');
    const header = {
      'Content-Type': configJSON.validationApiContentType,
      token,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );

    this.getTravelsParamsApiCallId = requestMessage.messageId;

    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.getMyTravelsItinerariesEndPoint + `/${itineraryId}`,
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
  handleGetCategoryData = (id?: number) => {
    let categoryId = id ? id.toString() : '0';
    const categoryData = this.state.categories.find(
      category => category.id === categoryId,
    );
    return categoryData;
  };
  handleGetTravelsList = async (paramsOverride?: {
    selectedCity: string;
    selectedState: string;
    startDate: string;
    endDate: string;
    selectedCountryCode: string;
    selectedType: any;
  }) => {
    const token = await getStorageData('authToken');
    const params = paramsOverride ?? this.state.selectedParams;
    const {
      selectedCity,
      selectedState,
      startDate,
      endDate,
      selectedCountryCode,
      selectedType,
    } = params;

    const header = {
      'Content-Type': configJSON.validationApiContentType,
      token: token,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );
    const selectedTypeValue = selectedType?.id ? selectedType.id : '';

    this.getShowsApiCallId = requestMessage.messageId;

    const selectedStartDate = startDate !== 'DD-MM-YYYY' ? startDate : '';
    const selectedEndtDate = endDate !== 'DD-MM-YYYY' ? endDate : '';
    const endPointParams = `start_date=${selectedStartDate}&end_date=${selectedEndtDate}&country=${selectedCountryCode}&state=${selectedState}&city=${selectedCity}&category_id=${selectedTypeValue}`;
    const endpoint = configJSON.getShowsEndPoint + endPointParams;
    const payload = {
      start_date: selectedStartDate,
      end_date: selectedEndtDate,
      country: selectedCountryCode,
      state: selectedState,
      city: selectedCity,
      category_id: selectedTypeValue,
    };

    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      endpoint,
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header),
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.validationApiMethodType,
    );

    console.log('[Eventregistration Search API] Request', {
      apiRequestCallId: this.getShowsApiCallId,
      method: configJSON.validationApiMethodType,
      endpoint,
      payload,
    });

    runEngine.sendMessage(requestMessage.id, requestMessage);
  };
  handleEditSearchBtn = () => {
    const navigationMsg: Message = new Message(
      getName(MessageEnum.NavigationMessage),
    );
    navigationMsg.addData(
      getName(MessageEnum.NavigationPropsMessage),
      this.props,
    );
    navigationMsg.addData(
      getName(MessageEnum.NavigationTargetMessage),
      'Eventregistration',
    );
    this.send(navigationMsg);
  };
  replyToComment = () => {
    this.setState({isCommentsLoading: true, isReplying: false});

    const replyToCommentRequestMsg = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );

    this.createEditLikeCommentAPICallID = replyToCommentRequestMsg.messageId;

    let endpoint;
    if (this.state.isEditing) {
      endpoint = `${configJSON.createCommentEndpoint}/${this.state.replyId}`;
    } else {
      endpoint = configJSON.createCommentEndpoint;
    }

    const methodType = this.state.isEditing
      ? `${configJSON.putApiMethodType}`
      : configJSON.postApiMethodType;

    const dataToSend = {
      comment: {
        commentable_id: this.state.commentId,
        commentable_type: 'BxBlockComments::Comment',
        comment: this.state.commentedText.trim(),
      },
    };

    replyToCommentRequestMsg.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      endpoint,
    );

    replyToCommentRequestMsg.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify({
        'Content-Type': configJSON.validationApiContentType,
        token: this.state.userInfo.token,
      }),
    );

    replyToCommentRequestMsg.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      methodType,
    );

    replyToCommentRequestMsg.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      JSON.stringify(dataToSend),
    );

    runEngine.sendMessage(
      replyToCommentRequestMsg.id,
      replyToCommentRequestMsg,
    );
  };
  handleCreateComment = () => {
    this.setState({isCommentsLoading: true});
    const message = new Message(getName(MessageEnum.RestAPIRequestMessage));
    const postType =
      this.state.selectedEvent.type === 'show' ? 'Show' : 'BxBlockPosts::Post';
    this.createEditLikeCommentAPICallID = message.messageId;

    let endpoint;
    if (this.state.isEditing) {
      if (this.state.showReplies) {
        endpoint = `${configJSON.createCommentEndpoint}/${this.state.replyId}`;
      } else {
        endpoint = `${configJSON.createCommentEndpoint}/${this.state.selectedEvent.id}`;
      }
    } else {
      endpoint = configJSON.createCommentEndpoint;
    }
    const methodType = this.state.isEditing
      ? `${configJSON.putApiMethodType}`
      : configJSON.postApiMethodType;

    const dataToSend = {
      comment: {
        commentable_id: this.state.selectedEvent.id,
        commentable_type: postType,
        comment: this.state.commentedText.trim(),
      },
    };
    message.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      endpoint,
    );

    message.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify({
        'Content-Type': configJSON.validationApiContentType,
        token: this.state.userInfo.token,
      }),
    );

    message.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      methodType,
    );

    message.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      JSON.stringify(dataToSend),
    );

    runEngine.sendMessage(message.id, message);
  };
  handleCommentTextChange = (commentedText: string) => {
    this.setState({commentedText});
  };
  handleReplyBackNav = () => {
    this.setState({
      showReplies: false,
      isReplying: false,
      commentId: '',
      showComments: true,
      commentedText: '',
    });
  };

  closeReplyPopup = () => {
    this.setState({showComments: true, showReplies: false, isReplying: false}); //showRepliesFor: [],
  };
  handleToogleModalShowComments = (event: EventData) => {
    this.setState(
      prevState => ({
        showComments: !prevState.showComments,
        selectedEvent: event,
      }),
      () => {
        this.handleGetCommentsAPI();
      },
    );
  };
  handleCloseCommentPopup = () => {
    this.setState({
      showComments: false,
      isReplying: false,
    });
  };
  handleReply = (commentId: string) => {
    this.setState({isReplying: true, commentId});
    this.commentTextInput?.focus();
  };
  handleReplyButton = (item: any) => {
    this.setState({
      isReplying: true,
      commentId: item.id,
      commentWithReply: item,
      showReplies: true,
      showComments: false,
      commentedText: '',
    });
  };
  handleEmojiSelected = (emoji: string) => {
    this.setState(prev => ({commentedText: prev.commentedText + emoji}));
  };
  handleSubmitEditing = () => {
    if (this.state.commentedText.trim() !== '') {
      this.hideKeyboard();
      if (this.state.isReplying || this.state.showReplies) {
        this.replyToComment();
      } else {
        this.handleCreateComment();
      }
    }
  };
  timeAgo(timestamp: string): string {
    const date = new Date(timestamp);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    const intervals = [
      {label: 'y', seconds: 31536000},
      {label: 'm', seconds: 2592000},
      {label: 'w', seconds: 604800},
      {label: 'd', seconds: 86400},
      {label: 'h', seconds: 3600},
      {label: 'm', seconds: 60},
      {label: 's', seconds: 1},
    ];

    const result = intervals.find(interval => seconds >= interval.seconds);

    if (result) {
      const count = Math.floor(seconds / result.seconds);
      return `${count}${result.label}`;
    }

    return 'just now';
  }
  likeComment = (comment_id: string) => {
    const likeCommentRequestMsg = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );

    this.createEditLikeCommentAPICallID = likeCommentRequestMsg.messageId;

    const dataToSend = {
      like: {
        comment_id,
      },
    };

    likeCommentRequestMsg.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.likeCommentEndpoint,
    );

    likeCommentRequestMsg.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify({
        'Content-Type': configJSON.validationApiContentType,
        token: this.state.userInfo.token,
      }),
    );

    likeCommentRequestMsg.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.postApiMethodType,
    );

    likeCommentRequestMsg.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      JSON.stringify(dataToSend),
    );

    runEngine.sendMessage(likeCommentRequestMsg.id, likeCommentRequestMsg);
  };

  handleShare = async (shareId: string, eventType?: string) => {
    const message: Message = new Message(
      getName(MessageEnum.NavigationMessage),
    );
    message.addData(getName(MessageEnum.NavigationPropsMessage), this.props);

    message.addData(getName(MessageEnum.NavigationTargetMessage), 'Share');
    const info = {
      eventId: shareId,
      eventType,
    };

    const raiseMessage: Message = new Message(
      getName(MessageEnum.NavigationPayLoadMessage),
    );

    raiseMessage.addData(getName(MessageEnum.HelpCentreMessageData), info);
    message.addData(getName(MessageEnum.NavigationRaiseMessage), raiseMessage);
    this.send(message);
  };

  openGoogleMaps = (data: any) => {
    if (data) {
      console.log(data, 'data inlocation:::--');
      // const location = `${data.address} ${data.city} ${data.state} ${data.zip_code}`
      const locationUrl = `https://www.google.com/maps?q=${encodeURIComponent(
        data,
      )}`;

      Linking.canOpenURL(locationUrl)
        .then(supported => {
          if (!supported) {
            alert('Google Maps is not installed on your device.');
          } else {
            return Linking.openURL(locationUrl);
          }
        })
        .catch(error => console.error('An error occurred', error));
    }
  };

  handleEventLaunch = async (show: any, stateName: string) => {




console.log("this is show",stateName);





// return


    try {
      const userId = await getStorageData('user_id');

      if (`${show.account_id}` === userId) {
        console.log('yes data in if');
        this.props.navigation.navigate('PostDetails', {
          eventId: show?.id,
          eventState: stateName,
        });
      } else {
        console.log('yes data in 1', show.id);
        console.log('yes data in 2', stateName);
        console.log('yes data in 3', show.type);

        const info = {
          eventId: show.id,
          eventState: stateName,
        };
        const screen =
          show.type === 'show' ? 'AllEventDetailScreen' : 'PhotoLibraryDetail';
        const msgData =
          show.type === 'show'
            ? MessageEnum.HelpCentreMessageData
            : MessageEnum.PostDetailDataMessage;
        this.handleNavigation(screen, info, msgData);
      }
    } catch (error) {}
  };
  handleNavigation = (
    screenToNavigate: string,
    infoToSend: {},
    msgData: any,
  ) => {
    this.props.navigation.navigate(screenToNavigate, infoToSend);
  };

  addToCalanderApi = (eventID: string) => {
    const addEventToCalendarMsg = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );

    this.calanderAddApiCallID = addEventToCalendarMsg.messageId;

    addEventToCalendarMsg.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      `${configJSON.addEventToCalendarEndPoint}${eventID}`,
    );

    addEventToCalendarMsg.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify({
        'Content-Type': configJSON.validationApiContentType,
        token: this.state.userInfo.token,
      }),
    );

    addEventToCalendarMsg.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.postApiMethodType,
    );

    runEngine.sendMessage(addEventToCalendarMsg.id, addEventToCalendarMsg);
  };

  handleAddCalanderResponse = (message: Message) => {
    const responseJson = message.getData(
      getName(MessageEnum.RestAPIResponceSuccessMessage),
    );

    if (responseJson != null && !responseJson.errors) {
      this.handleGetTravelsList();
    }
  };
  // Customizable Area End
}

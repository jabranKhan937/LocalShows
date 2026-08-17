import { IBlock } from "../../../framework/src/IBlock";
import { Message } from "../../../framework/src/Message";
import { BlockComponent } from "../../../framework/src/BlockComponent";
import MessageEnum, {
  getName,
} from "../../../framework/src/Messages/MessageEnum";
import { runEngine } from "../../../framework/src/RunEngine";
import { CommonActions } from '@react-navigation/native';

// Customizable Area Start
import { getStorageData } from "../../../framework/src/Utilities";
import { imgPasswordInVisible, imgPasswordVisible } from "./assets";
import moment from "moment";
import { ScrollView } from "react-native";
import { createRef } from "react";
export interface ItineraryProps {
    id ?: string;
    cityName: string;
    showsCount?: number;
    startDate : string;
    endDate: string;
    state?: string;
    countryCode ?: string;
    matchPreference ?: boolean;
    categoryId?: string;
    hasAcceptButton ?: boolean
}
interface Category {
  
  id: string,
  type: string,
  attributes: {
    id: number,
    name: string,
    created_at: string,
    updated_at: string
  }

}
type ItineraryResponseData = {
  id: number;
  city: string;
  start_date: string;
  end_date: string;
  show_count: number;
  country : string;
  state: string;
  match_preference: boolean;
  category_id : number;
}
// Customizable Area End

export const configJSON = require("./config");

export interface Props {
  navigation: any;
  id: string;
  // Customizable Area Start
  // Customizable Area End
}

interface S {
  txtInputValue: string;
  txtSavedValue: string;
  enableField: boolean;
  // Customizable Area Start
  startDate: string;
  endDate: string;
  displayedDate: any;
  showDateSelector: boolean;
  isPrivateAccount: boolean;
  markedDates: any;
  isClicked:boolean
  typeFieldClicked: boolean;
  isItineraryModalClicked: boolean;
  countryFieldClicked: boolean
  stateFieldClicked: boolean
  cityFieldClicked: boolean
  typesList: Category[]
  countriesList: {
    country_code: string,
    country_name: string
  }[],
  selectedType: string
  isLoading: boolean,
  states: {
    key: string,
    name: string
  }[],
  fieldNameBlank : 'Date' | 'Country' | 'State' | 'City' | '',
  selectedStartDateFormatted: string,
  selectedEndDateFormatted : string,
  cities: string[],
  selectedItinerary : ItineraryProps,
  selectedCountry: string,
  selectedState: string,
  selectedCity: string,
  otherCountrySelectedModal: boolean,
  itineraryList: ItineraryProps[]
  unreadNotificationCount: number;
  newNotification: boolean;
  // Customizable Area End
}

interface SS {
  id: any;
  // Customizable Area Start
  // Customizable Area End
}

export default class EventregistrationController extends BlockComponent<
  Props,
  S,
  SS
> {
  // Customizable Area Start
  getCountriesListAPICallID: string = "";
  postNewItineraryAPICallID: string = "";
  deleteItineraryAPICallID : string = "";
  getCityApiCallId: any;
  getStatesApiCallId: any;
  getShowsApiCallId: string = "";
  getCategoriesListAPICallID: string = "";
  getTravelsItineraryListAPICallID: string = "";
  checkUnreadNotificationsApiCallId: string = "";
  scrollRef: React.RefObject<ScrollView> = createRef<ScrollView>();
  // Customizable Area End

  constructor(props: Props) {
    super(props);
    this.receive = this.receive.bind(this);

    // Customizable Area Start
    this.subScribedMessages = [
      getName(MessageEnum.AccoutLoginSuccess),
      // Customizable Area Start
      getName(MessageEnum.RestAPIResponceMessage),
      // Customizable Area End
    ];

    this.state = {
      txtInputValue: "",
      txtSavedValue: "A",
      enableField: false,
      // Customizable Area Start
      startDate: "MM-DD-YYYY",
      endDate: "MM-DD-YYYY",
      markedDates: {},
      selectedType: '',
      selectedItinerary: {} as ItineraryProps,
      typesList: [],
      typeFieldClicked: false,
      isItineraryModalClicked: false,
      displayedDate: moment(),
      fieldNameBlank: '',
      selectedStartDateFormatted: '',
      selectedEndDateFormatted: '',
      showDateSelector: false,
      isPrivateAccount: false,
      isClicked:false,
      countryFieldClicked: false,
      stateFieldClicked: false,
      cityFieldClicked: false,
      otherCountrySelectedModal: false,
      countriesList : [{"country_code":"US",country_name:"United States"}],
      states: [],
      cities: [],
      isLoading: false,
      selectedCountry: "United States",
      selectedState: "",
      selectedCity: "",
      itineraryList: [],
      unreadNotificationCount: 0,
      newNotification: false,

      // Customizable Area End
    };
    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);

    // Customizable Area Start
    // Customizable Area End
  }

  async receive(from: string, message: Message) {
    runEngine.debugLog("Message Recived", message);

    if (message.id === getName(MessageEnum.AccoutLoginSuccess)) {
      let value = message.getData(getName(MessageEnum.AuthTokenDataMessage));

      this.showAlert(
        "Change Value",
        "From: " + this.state.txtSavedValue + " To: " + value
      );

      this.setState({ txtSavedValue: value });
    }

    // Customizable Area Start
    this.handleRestAPIResponseMessage(message);
    // Customizable Area End
  }

  txtInputWebProps = {
    onChangeText: (text: string) => {
      this.setState({ txtInputValue: text });
    },
    secureTextEntry: false,
  };

  txtInputMobileProps = {
    ...this.txtInputWebProps,
    autoCompleteType: "email",
    keyboardType: "email-address",
  };

  txtInputProps = this.isPlatformWeb()
    ? this.txtInputWebProps
    : this.txtInputMobileProps;

  btnShowHideProps = {
    onPress: () => {
      this.setState({ enableField: !this.state.enableField });
      this.txtInputProps.secureTextEntry = !this.state.enableField;
      this.btnShowHideImageProps.source = this.txtInputProps.secureTextEntry
        ? imgPasswordVisible
        : imgPasswordInVisible;
    },
  };

  btnShowHideImageProps = {
    source: this.txtInputProps.secureTextEntry
      ? imgPasswordVisible
      : imgPasswordInVisible,
  };

  btnExampleProps = {
    onPress: () => this.doButtonPressed(),
  };

  doButtonPressed() {
    let msg = new Message(getName(MessageEnum.AccoutLoginSuccess));
    msg.addData(
      getName(MessageEnum.AuthTokenDataMessage),
      this.state.txtInputValue
    );
    this.send(msg);
  }

  // web events
  setInputValue = (text: string) => {
    this.setState({ txtInputValue: text });
  };

  setEnableField = () => {
    this.setState({ enableField: !this.state.enableField });
  };

  // Customizable Area Start
  async componentDidMount(){
    this.handleComponentDidMount();
    
    if (this.isPlatformWeb() === false) {
      const unsubscribe = this.props.navigation.addListener('focus', () => {
        this.handleComponentDidMount();
        this.getUnreadNotificationsCount();
      });

      return unsubscribe;
    }
  }
  async handleComponentDidMount(){
    this.getCategoriesListAPI();
    this.getCountryList();
    this.getItineraryList();
    this.getUnreadNotificationsCount();
  }
  handleRestAPIResponseMessage = (message: Message) => {
    const errorResponse = message.getData(getName(MessageEnum.RestAPIResponceErrorMessage));
    const successResponse = message.getData(getName(MessageEnum.RestAPIResponceSuccessMessage));

    const apiRequestCallId = message.getData(getName(MessageEnum.RestAPIResponceDataMessage)); 
    if (apiRequestCallId && successResponse) {
      this.handleSuccessfulAPIResponse(apiRequestCallId, successResponse);
    } else {
      this.handleErrorResponse(errorResponse);
    }
  };
  handleSuccessfulAPIResponse = (apiRequestCallID: string, responseJson: any) => {
    switch (apiRequestCallID) {
      case this.getTravelsItineraryListAPICallID:
          return this.handleAllTravelsItinerariesAPIResponse(responseJson);
      case this.getCategoriesListAPICallID:
          return this.handleAllCategoriesAPIResponse(responseJson);
      case this.getCountriesListAPICallID:
        return this.handleCountryAPIResponse(responseJson);
      case this.getStatesApiCallId:
        return this.handleStateAPIResponse(responseJson);
      case this.getCityApiCallId:
        return this.handleCitiesResponse(responseJson);
      case this.postNewItineraryAPICallID:
        return this.handleItineraryPostResponse(responseJson);
      case this.deleteItineraryAPICallID:
        return this.handleItineraryDeleteResponse(responseJson);
      case this.checkUnreadNotificationsApiCallId:
        return this.handleUnreadNotificationsApiResponse(responseJson);
    }
  }
  handleItineraryDeleteResponse = (responseJson: any) => {
    if(!responseJson.errors) {
      const currentItinerariesList = this.state.itineraryList.filter(itinerary => itinerary.id !== responseJson.data.attributes.id)
      return this.setState({
        itineraryList: currentItinerariesList,
        selectedItinerary: {} as ItineraryProps,
        isItineraryModalClicked: false
      })
    }

    this.parseApiErrorResponse(responseJson);
   }
  handleItineraryPostResponse = async(responseJson: any) => {
    if (!responseJson.errors) {
      await this.getItineraryList();
      const {data} = responseJson
      const newItinerary : ItineraryProps = {
        id: data.id,
        cityName: data.attributes.city,
        startDate: moment(data.attributes.start_date).format('MMM DD YYYY'),
        endDate:  moment(data.attributes.end_date).format('MMM DD YYYY'),
        countryCode: data.attributes.country,
        state: data.attributes.state,
        matchPreference: data.attributes.match_preference,
        hasAcceptButton: false,
        categoryId: data.attributes.category_id
      }
      const newItineraryList = this.state.itineraryList.map(item => item.hasAcceptButton  ? {...newItinerary } : item)
      this.setState({itineraryList: newItineraryList})
      const {city} = responseJson.data.attributes;
      const cityNameFormatted = city.charAt(0).toUpperCase()+city.slice(1);
      this.clearAllFieldsStates()
      return this.showAlert('Success', `${cityNameFormatted} itinerary created`)
    }
   
     this.parseApiErrorResponse(responseJson);
  }
  handleAllTravelsItinerariesAPIResponse = (responseJson: any) => {
    if (!responseJson.errors) {
      const itineraryList  = responseJson.data.map((item : ItineraryResponseData) => ({
        id: item.id,
        cityName: item.city,
        showsCount: item.show_count,
        startDate : moment(item.start_date).format('MMM DD YYYY'),
        endDate: moment(item.end_date).format('MMM DD YYYY'),
        countryCode: item.country,
        state: item.state,
        matchPreference: item.match_preference,
        categoryId: item.category_id

      }))
     return this.setState({ itineraryList })
    }
   
     this.parseApiErrorResponse(responseJson);
 }

  handleAllCategoriesAPIResponse = (responseJson: any) => {
    if (!responseJson.errors) {
      const firstCategory : Category = {
        id: "",
        type: "category",
        attributes: {
          id: 0,
          name: "All",
          created_at: "2023-11-09T07:04:18.294Z",
          updated_at: "2023-11-09T07:29:26.573Z"
        }
      };

      let typesList = [firstCategory, ...responseJson.data];
      return this.setState({ typesList })
    }
   
     this.parseApiErrorResponse(responseJson);
}

  handleCountryAPIResponse = (responseJson: any) => {
      if (!responseJson.errors) {
        if(this.state.selectedCountry === 'United States'){
          this.getStateList('US')
        }

        const countriesList = responseJson.countries.filter((country : {country_code: string}) => country.country_code !== "COUNTRY_ISO_CODE")
        return this.setState({ countriesList  });
      }
     
       return this.parseApiErrorResponse(responseJson);
  }
  handleStateAPIResponse = (responseJson: any) => {
    if (!responseJson.errors) {
      const { state } = responseJson;
      const states = Object.keys(state).map(key => ({
        key:state[key],
        name: state[key]
      }))

      return this.setState({ states });
    } 
      this.parseApiErrorResponse(responseJson);
    
  }
  handleCitiesResponse = (responseJson: any) => {
    if (!responseJson.errors) {
      const { city } = responseJson;
      this.setState({ cities: city });
    } else {
      this.parseApiErrorResponse(responseJson);
    }
  } 
  handleErrorResponse = (errorResponse: any) => {
    this.setState({ isLoading: false });
    this.parseApiErrorResponse(errorResponse);
  };

  handleDeleteItinerary = async () => {
    const {selectedItinerary} = this.state
    const token = await getStorageData('authToken');
    if(selectedItinerary){
      const headers = {
        "Content-Type": configJSON.validationApiContentType,
        token
      };
  
      const deleteItineraryRequestMsg = new Message(
        getName(MessageEnum.RestAPIRequestMessage)
      );
  
      this.deleteItineraryAPICallID = deleteItineraryRequestMsg.messageId;
  
      deleteItineraryRequestMsg.addData(
        getName(MessageEnum.RestAPIResponceEndPointMessage),
        configJSON.deleteItineraryEndPoint + selectedItinerary.id
      );
  
      deleteItineraryRequestMsg.addData(
        getName(MessageEnum.RestAPIRequestHeaderMessage),
        JSON.stringify(headers)
      );
  
      deleteItineraryRequestMsg.addData(
        getName(MessageEnum.RestAPIRequestMethodMessage),
        configJSON.deleteApiMethodType
      );
  
      runEngine.sendMessage(deleteItineraryRequestMsg.id, deleteItineraryRequestMsg);
    }

  }
  handleNavigationToItineraryScreen = () => {
 
      const message: Message = new Message(getName(MessageEnum.NavigationMessage));
      const {
         selectedCity,
         selectedCountry,
         selectedState,
         selectedEndDateFormatted,
         selectedStartDateFormatted,
         countriesList,
         selectedType,
         typesList,
         states
        } = this.state

        if(this.handleSearchFieldsBlank()) return
        
      const selectedCountryCode = countriesList.find(country => country.country_name === selectedCountry)?.country_code
      if(selectedCountryCode !== 'US') return

      const selectedTypeObj = typesList.find(item => item.attributes.name === selectedType)
      
      const selectStateObj = states.find(item => item.key === selectedState)
      const params = {
        selectedType: selectedTypeObj,
        selectedCity: selectedCity.length > 0 ? selectedCity : '',
        selectedState : selectStateObj?.name ?? '',
        startDate : selectedStartDateFormatted,
        endDate : selectedEndDateFormatted,
        selectedCountryCode
      }
      message.addData(getName(MessageEnum.NavigationPropsMessage), this.props);
      message.addData(getName(MessageEnum.NavigationTargetMessage), "ItineraryDetails");
      const raiseMessage: Message = new Message(
        getName(MessageEnum.NavigationPayLoadMessage)
      );
      raiseMessage.addData(getName(MessageEnum.HelpCentreMessageData), params);
      
      message.addData(getName(MessageEnum.NavigationRaiseMessage), raiseMessage);
      this.send(message);  
  }
  handleBackNavigationPress = () => {
    const msg: Message = new Message(getName(MessageEnum.NavigationMessage));
    msg.addData(getName(MessageEnum.NavigationPropsMessage), this.props);
    msg.addData(getName(MessageEnum.NavigationTargetMessage), "Home");
    this.send(msg);
  }
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
    this.setState({ newNotification: false });
  }

  getUnreadNotificationsCount = async () => {
    const authToken = await getStorageData('authToken');
    if (!authToken) {
      return;
    }

    const header = {
      'Content-Type': configJSON.validationApiContentType,
      token: authToken,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );
    this.checkUnreadNotificationsApiCallId = requestMessage.messageId;

    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.checkUnreadNotificationsEndpoint,
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

  handleUnreadNotificationsApiResponse = (responseJson: any) => {
    if (!responseJson) {
      return;
    }

    if (responseJson.errors) {
      this.setState({
        unreadNotificationCount: 0,
        newNotification: false,
      });
      return;
    }

    let unreadCount = 0;
    let hasUnread = false;

    if (responseJson.unread_count !== undefined) {
      unreadCount = responseJson.unread_count;
      hasUnread = !!responseJson.has_unread_notifications;
    } else if (
      responseJson.data &&
      typeof responseJson.data === 'object' &&
      !Array.isArray(responseJson.data)
    ) {
      unreadCount = responseJson.data.unread_count || 0;
      hasUnread = !!responseJson.data.has_unread_notifications;
    } else if (Array.isArray(responseJson.data) && responseJson.data.length > 0) {
      const firstItem = responseJson.data[0];
      unreadCount = firstItem.unread_count || 0;
      hasUnread = !!firstItem.has_unread_notifications;
    }

    const count =
      typeof unreadCount === 'number'
        ? unreadCount
        : parseInt(unreadCount, 10) || 0;

    this.setState({
      unreadNotificationCount: count,
      newNotification: hasUnread && count > 0,
    });
  };

  handleAddToMyItinerary = () => {
    const {
      selectedCity,
      selectedCountry,
      selectedState,
      selectedEndDateFormatted,
      selectedStartDateFormatted,
      countriesList,
      selectedType,
      isPrivateAccount,
      typesList
     } = this.state
     const categoryId = typesList.find(typeItem => typeItem.attributes.name === selectedType)?.id ?? undefined

     const newItineraryCard :ItineraryProps = {
        startDate : selectedStartDateFormatted,
        endDate: selectedEndDateFormatted,
        cityName: selectedCity,
        countryCode: countriesList.find(country => country.country_name === selectedCountry)?.country_code ?? 'US',
        matchPreference: isPrivateAccount,
        state: selectedState,
        categoryId,
        hasAcceptButton: true
     }
     if(this.handleHasPendingItineraryCard()){
      return this.showAlert(configJSON.alertTitle,configJSON.pendingCardAlertDescription)
     }
     if(this.handleAddItineraryFieldsBlank()){
      return;
    }
     this.setState((prev) => ({
      itineraryList : [  ...prev.itineraryList, newItineraryCard],
      fieldNameBlank: '',
      markedDates:{}
     }))
     if (this.scrollRef.current) {
      this.scrollRef.current.scrollToEnd({ animated: true });
    }
  
  }
  handleHasPendingItineraryCard(){
    return this.state.itineraryList.some(item => item.hasAcceptButton)
  }
  handleAddItineraryFieldsBlank = () => {
    let hasError = true;

    if(this.state.startDate === 'MM/DD/YYYY'){
      this.setState({fieldNameBlank: 'Date'})
      return hasError
    }
    if(this.state.selectedCountry === ''){
      this.setState({fieldNameBlank: 'Country'})
      return hasError
    }
    if(this.state.selectedState === ''){
      this.setState({fieldNameBlank: 'State'})
      return hasError
    }
    if(this.state.selectedCity === ''){
      this.setState({fieldNameBlank: 'City'})
      return hasError
    }
    hasError = false;
    return hasError
  }
  handleAcceptButton = (itineraryCard : ItineraryProps) =>{
  
     const {
      cityName,
      countryCode,
      endDate : endDateFormatted,
      matchPreference,
      startDate : startDateFormatted,
      state

     } = itineraryCard

    const itineraryData = {
      travel: { 
        start_date:startDateFormatted,
        end_date:endDateFormatted,
        country: countryCode ?? 'US',
        state,
        city: cityName,
        category_id : this.state.selectedType,
        match_preference: matchPreference
    }
  }
  this.createNewItinerary(itineraryData)

  }
  handleShowDateSelector = () => {
     this.setState({
           showDateSelector: true,
           displayedDate: moment(),
         });
    };
    handleSearchFieldsBlank = () => {
      let hasError = true;
  
      if(this.state.startDate === 'MM/DD/YYYY'){
        this.setState({fieldNameBlank: 'Date'})
        return hasError
      }
      if(this.state.selectedCountry === ''){
        this.setState({fieldNameBlank: 'Country'})
        return hasError
      }

      this.setState({
        fieldNameBlank: ''
      })
      hasError = false;
      return hasError
    }

    handleSetDates = (dates: any) => {
        if (dates.startDate) {
          this.setState({
            startDate: moment(dates.startDate).format("MM/DD/YYYY"),
            selectedStartDateFormatted: moment(dates.startDate).format('MMM DD YYYY')
          });
        }
        if (dates.endDate) {
          this.setState({
            endDate: moment(dates.endDate).format("MM/DD/YYYY"),
            showDateSelector: false,
            selectedEndDateFormatted: moment(dates.endDate).format('MMM DD YYYY'),
          });
        }
        if (dates.displayedDate) {
          this.setState({
            displayedDate: dates.displayedDate,
          });
        }
      };
      getItineraryList = async() => {
        const getItineraryListMsg = new Message(getName(MessageEnum.RestAPIRequestMessage));
    
        this.getTravelsItineraryListAPICallID = getItineraryListMsg.messageId;
    
        getItineraryListMsg.addData(
          getName(MessageEnum.RestAPIResponceEndPointMessage),
          configJSON.getMyTravelsItinerariesEndPoint
        );
        const token = await getStorageData('authToken');

        getItineraryListMsg.addData(
          getName(MessageEnum.RestAPIRequestHeaderMessage),
          JSON.stringify({
            "Content-Type": configJSON.validationApiContentType,
            token
          })
        );
    
        getItineraryListMsg.addData(
          getName(MessageEnum.RestAPIRequestMethodMessage),
          configJSON.validationApiMethodType
        );
    
        runEngine.sendMessage(getItineraryListMsg.id, getItineraryListMsg);
      }
      getCategoriesListAPI = () => {
        const getCategoriesListMsg = new Message(getName(MessageEnum.RestAPIRequestMessage));
    
        this.getCategoriesListAPICallID = getCategoriesListMsg.messageId;
    
        getCategoriesListMsg.addData(
          getName(MessageEnum.RestAPIResponceEndPointMessage),
          configJSON.allCategoriesEndPoint
        );
    
        getCategoriesListMsg.addData(
          getName(MessageEnum.RestAPIRequestHeaderMessage),
          JSON.stringify({
            "Content-Type": configJSON.validationApiContentType,
          })
        );
    
        getCategoriesListMsg.addData(
          getName(MessageEnum.RestAPIRequestMethodMessage),
          configJSON.validationApiMethodType
        );
    
        runEngine.sendMessage(getCategoriesListMsg.id, getCategoriesListMsg);
      }
      getCityList(stateSelected: string) {

        const headers = {
          "Content-Type": configJSON.validationApiContentType,
        };
    
        const getCityListRequestMsg = new Message(
          getName(MessageEnum.RestAPIRequestMessage)
        );
    
        this.getCityApiCallId = getCityListRequestMsg.messageId;
    
        getCityListRequestMsg.addData(
          getName(MessageEnum.RestAPIResponceEndPointMessage),
          configJSON.getCitiesEndpoint + stateSelected
        );
    
        getCityListRequestMsg.addData(
          getName(MessageEnum.RestAPIRequestHeaderMessage),
          JSON.stringify(headers)
        );
    
        getCityListRequestMsg.addData(
          getName(MessageEnum.RestAPIRequestMethodMessage),
          configJSON.validationApiMethodType
        );
    
        runEngine.sendMessage(getCityListRequestMsg.id, getCityListRequestMsg);
      }
      getStateList(country: string) {

        const header = {
          "Content-Type": configJSON.validationApiContentType,
        };
        const requestMessage = new Message(
          getName(MessageEnum.RestAPIRequestMessage)
        );
    
        this.getStatesApiCallId = requestMessage.messageId;
        
        requestMessage.addData(
          getName(MessageEnum.RestAPIResponceEndPointMessage),
          configJSON.getStatesEndpoint + country
        );
    
        requestMessage.addData(
          getName(MessageEnum.RestAPIRequestHeaderMessage),
          JSON.stringify(header)
        );
    
        requestMessage.addData(
          getName(MessageEnum.RestAPIRequestMethodMessage),
          configJSON.validationApiMethodType
        );
    
        runEngine.sendMessage(requestMessage.id, requestMessage);
      }
      getCountryList = () => {
        const header = {
          "Content-Type": configJSON.validationApiContentType,
        };
        const requestMessage = new Message(
          getName(MessageEnum.RestAPIRequestMessage)
        );
    
        this.getCountriesListAPICallID = requestMessage.messageId;
    
        requestMessage.addData(
          getName(MessageEnum.RestAPIResponceEndPointMessage),
          configJSON.countriesList
        );
    
        requestMessage.addData(
          getName(MessageEnum.RestAPIRequestHeaderMessage),
          JSON.stringify(header)
        );
    
        requestMessage.addData(
          getName(MessageEnum.RestAPIRequestMethodMessage),
          configJSON.validationApiMethodType
        );
    
        runEngine.sendMessage(requestMessage.id, requestMessage);
      }
 
      createNewItinerary = async(data : any) => {
        const token = await getStorageData('authToken')

        const header = {
            "Content-Type": configJSON.validationApiContentType,
            token 
        };
        
        const requestMessage = new Message(
          getName(MessageEnum.RestAPIRequestMessage)
        );
    
        this.postNewItineraryAPICallID = requestMessage.messageId;
    
        requestMessage.addData(
          getName(MessageEnum.RestAPIResponceEndPointMessage),
          configJSON.postNewItinerary
        );
    
        requestMessage.addData(
          getName(MessageEnum.RestAPIRequestHeaderMessage),
          JSON.stringify(header)
        );
    
        requestMessage.addData(
          getName(MessageEnum.RestAPIRequestMethodMessage),
          configJSON.exampleAPiMethod
        );
        requestMessage.addData(
          getName(MessageEnum.RestAPIRequestBodyMessage),
          JSON.stringify(data)
        );
    
        runEngine.sendMessage(requestMessage.id, requestMessage);
      }
      handleToogleModalDeleteItinerary = (itineraryCardSelected : ItineraryProps) => {

        if(itineraryCardSelected.hasAcceptButton === true) {
          const currentItinerariesList = this.state.itineraryList.filter(itinerary => !itinerary.hasAcceptButton)
          return this.setState({
            itineraryList: currentItinerariesList
          })
        }

        this.setState((prev) => ({ isItineraryModalClicked: !prev.isItineraryModalClicked ,selectedItinerary : itineraryCardSelected }))
      }
      handleCancelDeleteItinerary = () => {
        this.setState((prev) => ({ isItineraryModalClicked: false ,selectedItinerary : {} as ItineraryProps }))
      }
      handleToogleArrowIcon = () => {
        this.setState((prev) => ({ isClicked: !prev.isClicked }))
      }
      handleToogleModalTypeField = () => {
        this.setState((prev) => ({ typeFieldClicked: !prev.typeFieldClicked }))
      }

      handleToogleModalCountryField = () => {
        this.setState((prev) => ({ countryFieldClicked: !prev.countryFieldClicked }))
      }
      handleToogleModalStatesField = () => {
        this.setState((prev) => ({ stateFieldClicked: !prev.stateFieldClicked }))
      }
      handleToogleModalCitiesField = () => {
        this.setState((prev) => ({ cityFieldClicked: !prev.cityFieldClicked }))
      }
      hideCountryAlert = () => {
        this.setState({ otherCountrySelectedModal: false })
      }
      handleSelectedTypeIos = (selectedType : string) => {
        this.setState({typeFieldClicked: false, selectedType})
      }
      handleSelectedCountryiOS = (selectedCountry: string) => {
        const {fieldNameBlank} = this.state
        this.setState((prevState) => ({ countryFieldClicked: false , fieldNameBlank : fieldNameBlank === 'Country' ? '' : prevState.fieldNameBlank }))
        this.onCountrySelect(selectedCountry)
      
      }
      onCountrySelect = (selectedCountry: string) => {
        const selectedCountryObj = this.state.countriesList.find(item => item.country_code === selectedCountry || item.country_name === selectedCountry);
        const selectedCountryCode = selectedCountryObj?.country_code
        this.setState({ countryFieldClicked: false, selectedCountry})

        if(selectedCountryCode !== 'US'){
         return this.setState({  otherCountrySelectedModal: true })
        }
     
        this.getStateList(selectedCountryCode)

      }
      onSelectState = (selectedState: string) => {
        this.setState({ selectedState, selectedCity: "", cities: [] }, () => {
          this.getCityList(selectedState);
        });
      }
      handleSelectedCity = (selectedCity: string) => {
        this.setState({ selectedCity })
      }
      handleSelectedStateIOS = (selectedState: string) => {

        this.setState({ stateFieldClicked: false, selectedState, selectedCity: "", cities: [] }, () => {
          this.getCityList(selectedState);
        })

      }
      handleSelectedType = (selectedType : string) => {
        this.setState({selectedType})
      }
      handleSelectedCityIOS = (selectedCity: string) => {
        this.setState({ cityFieldClicked: false, selectedCity });
      }
      handleSelectedItineraryCard = (card : ItineraryProps) => {
        const message: Message = new Message(getName(MessageEnum.NavigationMessage));

        const {
           typesList,
           states
          } = this.state

        const {
          cityName,
          countryCode,
          state,
          endDate,
          startDate,
          categoryId,
          id
        } = card
        
        const selectedType = typesList.find(item => item.id === String(categoryId))
        const params = {
          itineraryId: id,
          startDate : startDate,
          endDate : endDate,
          selectedCountryCode: countryCode,
          selectedState : state,
          selectedCity : cityName,
          selectedType,
        }
        message.addData(getName(MessageEnum.NavigationPropsMessage), this.props);
        message.addData(getName(MessageEnum.NavigationTargetMessage), "ItineraryDetails");
        const raiseMessage: Message = new Message(
          getName(MessageEnum.NavigationPayLoadMessage)
        );
        raiseMessage.addData(getName(MessageEnum.HelpCentreMessageData), params);
        
        message.addData(getName(MessageEnum.NavigationRaiseMessage), raiseMessage);
        this.send(message); 
    
      }
      clearAllFieldsStates = () => {
        this.setState({
          startDate: "MM/DD/YYYY",
          endDate: "MM/DD/YYYY",
          selectedType: '',
          selectedStartDateFormatted: '',
          selectedEndDateFormatted: '',
          selectedCountry: "United States",
          selectedState: "",
          selectedCity: "",
          isPrivateAccount: false
        })
      }
      getDateRange = (start:any, end:any) => {
        const PRIMARY_COLOR = '#3333cc';
        const range:any = {};
        const startMoment = moment(start, 'MM/DD/YYYY');
        const endMoment = moment(end, 'MM/DD/YYYY');
        let current = startMoment.clone();
    
        while (current.isSameOrBefore(endMoment)) {
          const formatted = current.format('YYYY-MM-DD');
          if (formatted === startMoment.format('YYYY-MM-DD')) {
            range[formatted] = {
              startingDay: true,
              color: PRIMARY_COLOR,
              textColor: 'white',
            };
          } else if (formatted === endMoment.format('YYYY-MM-DD')) {
            range[formatted] = {
              endingDay: true,
              color: PRIMARY_COLOR,
              textColor: 'white',
            };
          } else {
            range[formatted] = {
              color: `${PRIMARY_COLOR}55`,
              textColor: 'white',
            };
          }
          current.add(1, 'day');
        }
    
        return range;
      };
    
      handleDayPress = (day:any) => {
    const {startDate, endDate} = this.state;
        const selectedDate = moment(day.dateString).format('MM/DD/YYYY');
    
        if (!startDate || (startDate && endDate)) {
          this.setState({
            startDate: selectedDate,
            endDate: "",
            markedDates: {
              [day.dateString]: {
                startingDay: true,
                endingDay: true,
                color: '#3333cc',
                textColor: 'white',
              },
            },
          });
        } else {
          const startMoment = moment(startDate, 'MM/DD/YYYY');
          const endMoment = moment(selectedDate, 'MM/DD/YYYY');
          const from = moment.min(startMoment, endMoment);
          const to = moment.max(startMoment, endMoment);
          const range = this.getDateRange(from.format('MM/DD/YYYY'), to.format('MM/DD/YYYY'));
    
          this.setState({
            endDate: to.format('MM/DD/YYYY'),
            markedDates: range,
          });
    
          this.handleSetDates({
            startDate: from.toDate(),
            endDate: to.toDate(),
            displayedDate: moment().format('YYYY-MM-DD'),
          });
        }
      };
  // Customizable Area End
}

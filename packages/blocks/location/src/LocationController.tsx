import { IBlock } from "../../../framework/src/IBlock";
import { Message } from "../../../framework/src/Message";
import { BlockComponent } from "../../../framework/src/BlockComponent";
import RestClientBlock from "../../../framework/src/Blocks/RestApiClientBlock";
import MessageEnum, {
  getName,
} from "../../../framework/src/Messages/MessageEnum";
import { runEngine } from "../../../framework/src/RunEngine";

// Customizable Area Start
import { Platform, PermissionsAndroid } from "react-native";
import Geolocation from "react-native-geolocation-service";
// RNAndroidLocationEnabler is Android-only, imported conditionally in checkGPS()
// Customizable Area End

export const configJSON = require("./config");

export interface Props {
  navigation: any;
  id: string;
  // Customizable Area Start
  // Customizable Area End
}

interface S {
  allowAccess: boolean;
  gpsLocation: string;
  isSpinnerShowing: boolean;
  // Customizable Area Start
  // Customizable Area End
}

interface SS {
  id: any;
  // Customizable Area Start
  // Customizable Area End
}

export default class LocationController extends BlockComponent<Props, S, SS> {
  getCityApiCallId: any;
  updateDefaultCityApiCallId: any;
  googleMapAPIId: any;
  // Customizable Area Start
  // Customizable Area End

  constructor(props: Props) {
    super(props);
    this.receive = this.receive.bind(this);

    this.subScribedMessages = [
      getName(MessageEnum.RestAPIResponceMessage),
      // Customizable Area Start
      // Customizable Area End
    ];

    // Customizable Area Start
    this.state = {
      allowAccess: true,
      gpsLocation: "",
      isSpinnerShowing: false,
    };
    // Customizable Area End
    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);
  }

  async receive(from: string, message: Message) {
    // Customizable Area Start
    runEngine.debugLog("Message Recived", message);

    if (message.id === getName(MessageEnum.RestAPIResponceMessage)) {
      const apiRequestCallId = message.getData(
        getName(MessageEnum.RestAPIResponceDataMessage)
      );

      var responseJson = message.getData(
        getName(MessageEnum.RestAPIResponceSuccessMessage)
      );

      var errorReponse = message.getData(
        getName(MessageEnum.RestAPIResponceErrorMessage)
      );

      if (apiRequestCallId === this.googleMapAPIId) {
        if (responseJson !== null && responseJson) {
          let latLocation = "";
          this.setState({ isSpinnerShowing: false });

          responseJson.results[0].address_components.forEach((rs: any) => {
            if (rs.types.includes("locality")) {
              latLocation = rs.long_name;
              console.log(rs.long_name);
            }
          });
          console.log(latLocation.toLowerCase(), "result");
          this.setState({ gpsLocation: latLocation });
        }
      }
    }
    // Customizable Area End
  }

  // Customizable Area Start
  allowLoactionAccess = (value: boolean) => {
    this.setState({ allowAccess: value });
  };

  isStringNullOrBlank(str: string) {
    return str === null || str.length === 0;
  }

  hasLocationPermissionIOS = async () => {
    // Location is disabled on iOS for this app.
    return false;
  };

  hasLocationPermission = async () => {
    if (Platform.OS === "web") {
      if (navigator.geolocation) {
        return true;
      } else {
        alert("Sorry Not available!");
        return false;
      }
    }

    if (Platform.OS === "ios") {
      const hasPermission = await this.hasLocationPermissionIOS();
      return hasPermission;
    }

    if (Platform.OS === "android" && Platform.Version < 23) {
      return true;
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );

    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }

    if (status === PermissionsAndroid.RESULTS.DENIED) {
      console.log("denied");
      this.allowLoactionAccess(false);
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      console.log("never ask");
      this.allowLoactionAccess(false);
    }

    return false;
  };

  checkGPS = () => {
    if (Platform.OS === 'android') {
      const RNAndroidLocationEnabler = require('react-native-android-location-enabler').default;
      RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
        interval: 10000,
        fastInterval: 5000,
      })
        .then((data: any) => {
          console.log(data, "USER_ALLOA");
          this.getLocation();
          // The user has accepted to enable the location services
          // data can be :
          //  - "already-enabled" if the location services has been already enabled
          //  - "enabled" if user has clicked on OK button in the popup
        })
        .catch((err: any) => {
          console.log(err, "USER_NO_ALLOW");
          this.allowLoactionAccess(false);
          // The user has not accepted to enable the location services or something went wrong during the process
          // "err" : { "code" : "ERR00|ERR01|ERR02|ERR03", "message" : "message"}
          // codes :
          //  - ERR00 : The user has clicked on Cancel button in the popup
          //  - ERR01 : If the Settings change are unavailable
          //  - ERR02 : If the popup has failed to open
          //  - ERR03 : Internal error
        });
    } else {
      this.allowLoactionAccess(false);
    }
  };

  callGetLocationAPI = (url: string) => {
    const header = {
      "Content-Type": configJSON.validationApiContentType,
    };

    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.googleMapAPIId = requestMessage.messageId;

    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      url
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.getApiMethodType
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);
  };

  getLocation = async () => {
    if (Platform.OS === "ios") {
      this.setState({ isSpinnerShowing: false });
      this.allowLoactionAccess(false);
      return;
    }

    const hasLocationPermission = await this.hasLocationPermission();
    console.log(hasLocationPermission, "hasLocationPermission");

    const googleAPIkey = "AIzaSyDS3lSh1DVsIjUheUfsyk7UdUBKNKJkEVg";
    this.setState({ isSpinnerShowing: true });

    if (!hasLocationPermission) {
      this.setState({ isSpinnerShowing: false });
      this.allowLoactionAccess(false);
    }

    Geolocation.getCurrentPosition(
      async (position: any) => {
        let googleMapApi = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&key=${googleAPIkey}`;
        console.log(googleMapApi);
        this.callGetLocationAPI(googleMapApi);
      },
      (error: any) => {
        console.log(error);
        this.setState({ isSpinnerShowing: false });
      },
      {
        enableHighAccuracy: false,
        timeout: 15000,
        distanceFilter: 0,
        forceRequestLocation: true,
        showLocationDialog: false,
      }
    );
  };
  // Customizable Area End
}

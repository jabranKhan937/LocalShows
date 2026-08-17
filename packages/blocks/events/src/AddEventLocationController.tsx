import { IBlock } from "../../../framework/src/IBlock";
import { Message } from "../../../framework/src/Message";
import { BlockComponent } from "../../../framework/src/BlockComponent";
import MessageEnum, {
  getName,
} from "../../../framework/src/Messages/MessageEnum";
import { runEngine } from "../../../framework/src/RunEngine";
export const configJSON = require("./config");

import Geocoder from "react-native-geocoding";
import Geolocation from "react-native-geolocation-service";

// RNAndroidLocationEnabler is Android-only, imported conditionally in checkGPS()
// Customizable Area Start
import {
  Platform,
  PermissionsAndroid,
} from "react-native";
// Customizable Area End

export interface Props {
  navigation: any;
  id: string;
  // Customizable Area Start
  // Customizable Area End
}

interface S {
  // Customizable Area Start
  loading: boolean;
  searchLocation: string;
  lat: string;
  lng: string;
  searchedLocationData: [];
  from: string;
  makeAPi: boolean;
  gotLocation: boolean;
  updateLatLng: boolean;
  // Customizable Area End
}

interface SS {
  id: any;
  // Customizable Area Start
  // Customizable Area End
}

export default class AddEventLocationController extends BlockComponent<
  Props,
  S,
  SS
> {
  // Customizable Area Start
  private readonly errorTitle = "Error";
  // Customizable Area End

  constructor(props: Props) {
    super(props);

    runEngine.attachBuildingBlock(this as IBlock, [
      // Customizable Area Start
      getName(MessageEnum.RestAPIResponceMessage),
      // Customizable Area End
    ]);
    this.receive = this.receive.bind(this);

    this.state = {
      // Customizable Area Start
      loading: false,
      lat: "17.34536",
      lng: "78.43464",
      searchLocation: "",
      searchedLocationData: [],
      from: "",
      makeAPi: true,
      gotLocation: false,
      updateLatLng: false,
      // Customizable Area End
    };

    // Customizable Area Start
    // Customizable Area End
  }

  async receive(from: string, message: Message) {
    // Customizable Area Start
    // Customizable Area End
  }

  // Customizable Area Start
  _saveLocationClicked = () => {
    if (this.state.searchLocation.length > 0) {
      this.props.navigation.navigate("AddEventDetailScreen", {
        lat: this.state.lat,
        lng: this.state.lng,
        location: this.state.searchLocation,
      });
    } else {
      this.showAlert(this.errorTitle, "Please specify location");
    }
  };

  onChangeText = async (text: any) => {
    await this.setState({ searchLocation: text });
    if (text == "") {
      await this.setState({ searchedLocationData: [] });
      return;
    }
    if (text.length > 3 && this.state.makeAPi) {
      setTimeout(async () => {
        //make api call to get searched locations
        const apiUrl = `${configJSON.GOOGLE_PACES_API_BASE_URL}/autocomplete/json?key=${configJSON.GOOGLE_API_KEY}&input=${text}`;
        console.log("json.features.url", apiUrl);
        try {
          // Log API call details
          console.log('=== API Call ===');
          console.log('URL:', apiUrl);
          console.log('Method: GET');
          console.log('Body: [No body]');
          console.log('================');
          let response = await fetch(apiUrl);
          let json = await response.json();
          if (json?.status == "OK") {
            console.log("json", json);
            this.setState({ searchedLocationData: json?.predictions });
          }
          // console.log("json.features", json.features);
        } catch (error) {
          console.error(error);
        }
      }, 200);
    }
  };
  // Token request function

  getLatlongFromSelectedPlace = async (placeId: string) => {
    const apiUrl = `${configJSON.GOOGLE_PACES_API_BASE_URL}/details/json?key=${configJSON.GOOGLE_API_KEY}&place_id=${placeId}`;
    try {
      this.setState({ loading: true });
      // Log API call details
      console.log('=== API Call ===');
      console.log('URL:', apiUrl);
      console.log('Method: GET');
      console.log('Body: [No body]');
      console.log('================');
      let response = await fetch(apiUrl);
      let json = await response.json();
      console.log("json", json);
      this.setState({ loading: false });
      if (json?.status == "OK") {
        this.setState({
          lat: json?.result?.geometry?.location?.lat,
          lng: json?.result?.geometry?.location?.lng,
        });
      }
    } catch (error) {
      this.setState({ loading: false });
      console.error(error);
    }
  };


  // Customizable Area Start
  checkGPS = async () => {
    if (Platform.OS === 'android') {
      const RNAndroidLocationEnabler = require('react-native-android-location-enabler').default;
      RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
        interval: 10000,
        fastInterval: 5000,
      })
        .then(async (data: any) => {
          console.log(data, "USER_ALLOA");
          if (await this.hasLocationPermission()) {
            this.getOneTimeLocation();
          }
          // The user has accepted to enable the location services
          // data can be :
          //  - "already-enabled" if the location services has been already enabled
          //  - "enabled" if user has clicked on OK button in the popup
        })
        .catch(async (err: any) => {
          console.log(err, "USER_NO_ALLOW");
          this.props.navigation.goBack();
          // The user has not accepted to enable the location services or something went wrong during the process
          // "err" : { "code" : "ERR00|ERR01|ERR02|ERR03", "message" : "message"}
          // codes :
          //  - ERR00 : The user has clicked on Cancel button in the popup
          //  - ERR01 : If the Settings change are unavailable
          //  - ERR02 : If the popup has failed to open
          //  - ERR03 : Internal error
        });
    } else {
      // iOS doesn't need Android Location Enabler
      if (await this.hasLocationPermission()) {
        this.getOneTimeLocation();
      }
    }
  };

  hasLocationPermissionIOS = async () => {
    // Location is disabled on iOS for this app.
    this.props.navigation.goBack();
    return false;
  };

  hasLocationPermission = async () => {
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
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      console.log("never ask");
    }
    return false;
  };

  _refreshData = async () => {
    if (Platform.OS === "android") {
      this.checkGPS();
    } else {
      if (await this.hasLocationPermission()) {
        this.getOneTimeLocation();
      }
    }
  };

  // Current Location //
  requestLocationPermission = async () => {
    if (Platform.OS === "android") {
      this.checkGPS();
    } else {
      if (await this.hasLocationPermission()) {
        this.getOneTimeLocation();
      }
    }
  };
  getOneTimeLocation = () => {
    this.setState({ loading: true });
    console.log("getOneTimeLocation:==>");
    Geolocation.getCurrentPosition(
      //Will give you the current location
      (position) => {
        //getting the Longitude from the location json
        const currentLongitude = JSON.stringify(position.coords.longitude);
        //getting the Latitude from the location json
        const currentLatitude = JSON.stringify(position.coords.latitude);

        console.log("Lat:==>", currentLatitude);
        console.log("Lng:==>", currentLongitude);
        this.setState({ loading: false });
        this.setState({
          lat: currentLatitude,
          lng: currentLongitude,
        });

        // ADD code to get address from lat lng
        this.getAddress(currentLatitude, currentLongitude);
      },
      (error:any) => {
        // setLocationStatus(error.message);
        this.setState({ loading: false });
        console.log("error.message:==>", error.message);
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 1000,
      }
    );
  };

  getAddress = (lat: string, lng: string) => {
    Geocoder.init("AIzaSyAQu429K52drmir9450TvUYcy82ZL3QQ9I");
    Geocoder.from(Number(lat), Number(lng))
      .then((json) => {
        this.setState({ loading: false });
        console.log("---jsonAddress----", JSON.stringify(json));
        if (json.results && json.results.length > 0) {
          var addressComponent = json.results[0].formatted_address;
          this.setState({ searchLocation: addressComponent });
          console.log("---addressComponent----", addressComponent);
          console.log("---this.state.address----", this.state.searchLocation);
        }
      })
      .catch((error) => {
        console.log("---error---", error);
        this.setState({ loading: false });
      });
  };

  onRegionChanged = async() =>{
    //   console.log('onRegionChanged==>',region);
    //   console.log("Lat:==>", region?.latitude);
    //   console.log("Lng:==>", region?.longitude);
    //  // this.setState({ loading: false });
    //  if(this.state.updateLatLng){
  
    //  }else{
    //   this.setState({
    //     lat: region?.latitude,
    //     lng: region?.longitude,
    //   });
    // }
  
    //   // ADD code to get address from lat lng
    //   this.getAddress(region?.latitude,region?.longitude);
  
    this.getOneTimeLocation();
  
    }
  // Customizable Area End
}

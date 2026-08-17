import { IBlock } from "../../../framework/src/IBlock";
import { Message } from "../../../framework/src/Message";
import { BlockComponent } from "../../../framework/src/BlockComponent";
import MessageEnum, {
  getName,
} from "../../../framework/src/Messages/MessageEnum";
import { runEngine } from "../../../framework/src/RunEngine";
import { navigateToNotificationsScreen } from "../../../framework/src/navigateToNotifications";
// Customizable Area Start
import Radar from "react-native-radar";
import { getStorageData } from "../../../framework/src/Utilities";
// Customizable Area End

export const configJSON = require("./config");

export interface Props {
  navigation: any;
  id: string;
  // Customizable Area Start
  // Customizable Area End
}

interface S {
  // Customizable Area Start
  radarLog: string;
  clientLocation: string;
  location: string;
  events: string;
  userAuthToken: string;
  // Customizable Area End
}

interface SS {
  id: any;
  // Customizable Area Start
  // Customizable Area End
}

// Customizable Area Start
interface ILocation {
  accuracy: number;
  altitude: number;
  course: number;
  courseAccuracy: number;
  latitude: number;
  longitude: number;
  mocked: boolean;
  speed: number;
  speedAccuracy: number;
  verticalAccuracy: number;
}

interface IDetailedLocation {
  location: ILocation;
  user: {
    source: string;
  };
}
interface IClientLocationResult {
  stopped: string;
  location: ILocation;
  source: string;
}

interface IRadarEvent { }

interface IRadarError { }

// Customizable Area End
export default class GeofenceController extends BlockComponent<Props, S, SS> {
  // Customizable Area Start
  // Customizable Area End

  constructor(props: Props) {
    super(props);
    this.receive = this.receive.bind(this);

    this.subScribedMessages = [
      // Customizable Area Start
      // Customizable Area End
    ];

    this.state = {
      // Customizable Area Start
      radarLog: "",
      clientLocation: "",
      location: "",
      events: "",
      userAuthToken: ""
      // Customizable Area End
    };
    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);

    // Customizable Area Start
    // Customizable Area End
  }

  async componentDidMount() {
    super.componentDidMount();
    // Customizable Area Start
    if (this.isPlatformWeb() === true)
      this.initializeRadar();
    else {
      this.props.navigation.addListener("willFocus", async () => {
        const token = await getStorageData("authToken")
        this.setState({ userAuthToken: token, })
      });
    }
    // Customizable Area End
  }

  async receive(from: string, message: Message) {
    // Customizable Area Start
    // Customizable Area End
  }

  // Customizable Area Start
  stringify(subject: object) {
    return JSON.stringify(subject, null, 2);
  }

  initializeRadar = async () => {
    await Radar.on("events", (result: IRadarEvent) => {
      this.setState({ events: this.stringify(result) });
    });

    await Radar.on("location", (result: IDetailedLocation) => {
      this.setState({ location: this.stringify(result) });
    });

    await Radar.on("clientLocation", (result: IClientLocationResult) => {
      this.setState({ clientLocation: this.stringify(result) });
    });

    await Radar.on("error", (error: IRadarError) => {
      console.log({ error });
    });

    await Radar.on("log", (result: string) => {
      this.setState({ radarLog: result });
    });

    await Radar.setLogLevel("info");

    await Radar.setUserId("foo");

    await Radar.setMetadata({
      foo: "bar",
      baz: true,
      qux: 1,
    });

    await this.requestPermissions();

    this.getLocation();

    this.startTracking();

    this.search();

    this.autoComplete();

    this.handleGeocodes();

    this.getDistance();

    this.getMatrix();

    this.makeTrip();
  };

  getLocation = async () => {
    try {
      const result = await Radar.getLocation();
      console.log("getLocation result:", result);
    } catch (error) {
      console.log("getLocation error: ", error);
    }
  };

  requestPermissions = async () => {
    try {
      const requestResult = await Radar.requestPermissions(false);
      console.log("requestPermissions result:", requestResult);
      const permissionStatusResult = await Radar.getPermissionsStatus();
    } catch (error) {
      console.log("permission error:", error);
    }
  };

  startTracking = async () => {
    try {
      const result = await Radar.trackOnce();
      console.log("trackOnce result: ", result);
    } catch (error) {
      console.log("trackOnce error: ", error);
    }

    try {
      const result = await Radar.startTrackingContinuous();
      console.log("startTrackingContinuous result: ", result);
    } catch (error) {
      console.log("startTrackingContinuous error: ", error);
    }
  };

  search = async () => {
    try {
      const result = await Radar.searchPlaces({
        near: {
          latitude: 40.783826,
          longitude: -73.975363,
        },
        radius: 1000,
        chains: ["starbucks"],
        limit: 10,
      });
      console.log("searchPlaces result: ", result);
    } catch (error) {
      console.log("searchPlaces error: ", error);
    }

    try {
      const result = await Radar.searchGeofences({
        radius: 1000,
        tags: ["venue"],
        limit: 10,
      });
      console.log("searchGeofences result: ", result);
    } catch (error) {
      console.log("searchGeofences error: ", error);
    }
  };

  autoComplete = async () => {
    try {
      const result = await Radar.autocomplete({
        query: "brooklyn roasting",
        near: {
          latitude: 40.783826,
          longitude: -73.975363,
        },
        limit: 10,
      });
      console.log("autocomplete result: ", result);
    } catch (error) {
      console.log("autocomplete error: ", error);
    }
  };

  handleGeocodes = async () => {
    try {
      const geoCodeResult = await Radar.geocode("20 jay st brooklyn");
      console.log("geocode result: ", geoCodeResult);

      const reverseGeocodeResult = await Radar.reverseGeocode({
        latitude: 40.783826,
        longitude: -73.975363,
      });
      console.log("reverseGeocode result: ", reverseGeocodeResult);

      const ipGeocodeResult = await Radar.ipGeocode();
      console.log("ipGeocode result: ", ipGeocodeResult);

    } catch (error) {
      console.log("geocode error: ", error);
    }
  };

  getDistance = async () => {
    try {
      const result = await Radar.getDistance({
        origin: {
          latitude: 40.78382,
          longitude: -73.97536,
        },
        destination: {
          latitude: 40.7039,
          longitude: -73.9867,
        },
        modes: ["foot", "car"],
        units: "imperial",
      });
      console.log("getDistance result: ", result);
    } catch (error) {
      console.log("getDistance error: ", error);
    }
  };

  getMatrix = async () => {
    try {
      const result = await Radar.getMatrix({
        origins: [
          {
            latitude: 40.78382,
            longitude: -73.97536,
          },
          {
            latitude: 40.7039,
            longitude: -73.9867,
          },
        ],
        destinations: [
          {
            latitude: 40.64189,
            longitude: -73.78779,
          },
          {
            latitude: 35.99801,
            longitude: -78.94294,
          },
        ],
        mode: "car",
        units: "imperial",
      });
      console.log("getMatrix result: ", result);
    } catch (error) {
      console.log("getMatrix error: ", error);
    }
  };

  makeTrip = async () => {
    try {
      const result = await Radar.startTrip({
        externalId: "299",
        destinationGeofenceTag: "store",
        destinationGeofenceExternalId: "123",
        mode: "car",
      });

      await Radar.mockTracking({
        origin: {
          latitude: 40.78382,
          longitude: -73.97536,
        },
        destination: {
          latitude: 40.7039,
          longitude: -73.9867,
        },
        mode: "car",
        steps: 3,
        interval: 3,
      });

      await Radar.completeTrip();
    } catch (error) {
      console.log("trip error: ", error);
    }
  };

  handleNavigation = (screen: string) => {
    if (screen === "Notifications") {
      navigateToNotificationsScreen(this.props.navigation);
      return;
    }
    const message: Message = new Message(getName(MessageEnum.NavigationMessage));
    message.addData(getName(MessageEnum.NavigationPropsMessage), this.props);
    message.addData(getName(MessageEnum.NavigationTargetMessage), screen);
    this.send(message);
  }

  // Customizable Area End
}

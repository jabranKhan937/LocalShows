import { IBlock } from "../../../framework/src/IBlock";
import { Message } from "../../../framework/src/Message";
import { BlockComponent } from "../../../framework/src/BlockComponent";
import MessageEnum, {
  getName,
} from "../../../framework/src/Messages/MessageEnum";
import { runEngine } from "../../../framework/src/RunEngine";

// Customizable Area Start
import Radar from "radar-sdk-js";
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
  location: string;
  // Customizable Area End
}

interface SS {
  id: any;
  // Customizable Area Start
  // Customizable Area End
}
// Customizable Area Start
interface ILogResult {
  location: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
  user: {
    location: {
      type: string;
      coordinates: number[];
    };
    live: boolean;
  };
}

interface ILocationResult {
  location: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
  status: string;
}
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
      location: "",
      // Customizable Area End
    };
    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);

    // Customizable Area Start
    // Customizable Area End
  }

  async componentDidMount() {
    super.componentDidMount();
    // Customizable Area Start
    this.initializeWebRadar();
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

  initializeWebRadar = () => {
    // Radar.initialize(configJSON.radarKey);
    Radar.setUserId("foo");
    Radar.getLocation((error: string, result: ILocationResult) => {
      if (error) {
        this.setState({ location: error });
      } else {
        this.setState({ location: this.stringify(result) });
      }
    });
    Radar.trackOnce(
      {
        latitude: 39.2904,
        longitude: -76.6122,
        accuracy: 65,
      },
      (error: string, result: ILogResult) => {
        if (!error) {
          this.setState({ radarLog: this.stringify(result) });
        }
      }
    );
  };
  // Customizable Area End
}

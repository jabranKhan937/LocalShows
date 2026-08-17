import { IBlock } from "../../../framework/src/IBlock";
import { Message } from "../../../framework/src/Message";
import { BlockComponent } from "../../../framework/src/BlockComponent";
import MessageEnum, {
  getName
} from "../../../framework/src/Messages/MessageEnum";
import { runEngine } from "../../../framework/src/RunEngine";

// Customizable Area Start
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
  timeout: any;
  spin: number;
  // Customizable Area End
}

interface SS {
  id: any;
  // Customizable Area Start
  // Customizable Area End
}

export default class SplashscreenController extends BlockComponent<
  Props,
  S,
  SS
> {
  // Customizable Area Start
  interval: any = null;
  // Customizable Area End

  constructor(props: Props) {
    super(props);

    this.receive = this.receive.bind(this);

    this.state = {
      // Customizable Area Start
      timeout: configJSON.timeout,
      spin: 0
      // Customizable Area End
    };

    // Customizable Area Start
    this.subScribedMessages = [];
    // Customizable Area End

    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);
  }

  async receive(from: string, message: Message) {
    // Customizable Area Start
    // Customizable Area End
  }

  async componentDidMount() {
    super.componentDidMount();
    // Customizable Area Start
    setTimeout(() => {
      this.goToHome();
    }, this.state.timeout);

    this.interval = setInterval(() => {
      if (this.state.spin === 360) {
        this.setState({ spin: 0 });
      } else {
        this.setState({ spin: this.state.spin + 5 });
      }
    }, 1);
    // Customizable Area End
  }

  // Customizable Area Start
  async componentWillUnmount() {
    clearInterval(this.interval);
    super.componentWillUnmount();
  }

  goToHome() {
    if (this.state.timeout > 0) {
      this.props.navigation.replace("Home");
    }
  }
  // Customizable Area End
}

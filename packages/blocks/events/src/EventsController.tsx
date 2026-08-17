import { IBlock } from "../../../framework/src/IBlock";
import { BlockComponent } from "../../../framework/src/BlockComponent";
import MessageEnum, {
  getName,
} from "../../../framework/src/Messages/MessageEnum";
import { runEngine } from "../../../framework/src/RunEngine";
// Customizable Area Start
import {
  cakeIcon,
  schooldropIcon,
  schoolpickIcon,
  VetIcon,
  RentIcon,
  GetTogetherIcon,
  MeetingIcon,
  DoctorIcon,
  GymIcon,
  FlightIcon,
  OutforCoffeeIcon,
  CustomIcon,
  ActivityIcon,
  FeesIcon,
} from "./assets";
import scale from "../../../components/src/Scale";
// Customizable Area End

export interface Props {
  navigation: any;
  id: string;
  // Customizable Area Start
  // Customizable Area End
}

interface S {
  // Customizable Area Start
  flatlistdata: any;
  isShowMap: boolean;
  // Customizable Area End
}

interface SS {
  id: any;
}
export default class EventsController extends BlockComponent<Props, S, SS> {
  // Customizable Area Start
  apiPhoneLoginCallId: any;
  private readonly errorTitle = "Error";
  // Customizable Area End
  constructor(props: Props) {
    super(props);
    this.receive = this.receive.bind(this);

    runEngine.attachBuildingBlock(this as IBlock, [
      // Customizable Area Start
      getName(MessageEnum.CountryCodeMessage),
      // Customizable Area End
    ]);

    this.state = {
      // Customizable Area Start
      isShowMap: false,
      flatlistdata: [
        {
          leftMargin: scale(7),
          image: cakeIcon,
          buttonTitle: "Birthday",
        },
        {
          leftMargin: scale(11),
          image: schooldropIcon,
          buttonTitle: "School Drop Off",
        },
        {
          leftMargin: scale(12),
          image: schoolpickIcon,
          buttonTitle: "School Pick Up",
        },
        {
          leftMargin: scale(9),
          image: GetTogetherIcon,
          buttonTitle: "Get Together",
        },
        {
          leftMargin: scale(8),
          image: MeetingIcon,
          buttonTitle: "Meeting",
        },
        {
          leftMargin: scale(7),
          image: OutforCoffeeIcon,
          buttonTitle: "Out for Coffee",
        },
        {
          leftMargin: scale(9),
          image: GymIcon,
          buttonTitle: "Gym",
        },
        {
          leftMargin: scale(11),
          image: FlightIcon,
          buttonTitle: "Flight",
        },
        {
          leftMargin: scale(9),
          image: DoctorIcon,
          buttonTitle: "Doctor",
        },
        {
          leftMargin: scale(8),
          image: VetIcon,
          buttonTitle: "Vet",
        },
        {
          leftMargin: scale(8),
          image: RentIcon,
          buttonTitle: "Rent",
        },
        {
          leftMargin: scale(5),
          image: FeesIcon,
          buttonTitle: "Fees",
        },
        {
          leftMargin: scale(9),
          image: ActivityIcon,
          buttonTitle: "Activity",
        },
        {
          leftMargin: scale(10),
          image: CustomIcon,
          buttonTitle: "Custom",
        },
      ],
      // Customizable Area End
    };
  }
  // Customizable Area Start
  // Customizable Area End
}

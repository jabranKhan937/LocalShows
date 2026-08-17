import { IBlock } from "../../../framework/src/IBlock";
import { Message } from "../../../framework/src/Message";
import { BlockComponent } from "../../../framework/src/BlockComponent";
import MessageEnum, {
  getName,
} from "../../../framework/src/Messages/MessageEnum";
import { runEngine } from "../../../framework/src/RunEngine";

// Customizable Area Start
// Customizable Area End

export const configJSON = require("./config.js");

export interface Props {
  navigation: any;
  id: string;
  // Customizable Area Start
  // Customizable Area End
}
interface S {
  // Customizable Area Start
  commentData: any;
  token: string;
  errorMsg: string;
  loading: boolean;
  comment: string;
  commentsArray: any;
  replyCommentId: any;
  // Customizable Area End
}
interface SS {
  id: any;
}

export default class CommentController extends BlockComponent<Props, S, SS> {
  apiCommentItemCallId: string = "";
  commentApiCallId: string = "";
  createCommentId: string = "";
  likeCommentId: string = "";

  constructor(props: Props) {
    super(props);
    this.receive = this.receive.bind(this);
    console.disableYellowBox = true;
    // Customizable Area Start
    this.subScribedMessages = [
      getName(MessageEnum.RestAPIResponceMessage),
      getName(MessageEnum.SessionResponseMessage),
    ];

    this.state = {
      commentData: [],
      errorMsg: "",
      token: "",
      loading: false,
      comment: "",
      commentsArray: [],
      replyCommentId: null,
    };
    // Customizable Area End
    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);
  }

  async componentDidMount() {
    super.componentDidMount();
    if (this.isPlatformWeb() === false) {
      this.props.navigation.addListener("willFocus", () => {
        this.getToken();
      });
    } else {
      this.getToken();
    }
    // Customizable Area Start
    // Customizable Area End
  }

  getToken = () => {
    const msg: Message = new Message(
      getName(MessageEnum.SessionRequestMessage)
    );
    this.send(msg);
  };

  async receive(from: string, message: Message) {
    // Customizable Area Start
    runEngine.debugLog("Message Recived", message);
    if (getName(MessageEnum.SessionResponseMessage) === message.id) {
      let token = message.getData(getName(MessageEnum.SessionResponseToken));
      this.setState({ token: token, loading: true }, () => {
        this.getCommentData();
      });
    } else if (getName(MessageEnum.RestAPIResponceMessage) === message.id) {
      const apiRequestCallId = message.getData(
        getName(MessageEnum.RestAPIResponceDataMessage)
      );

      var responseJson = message.getData(
        getName(MessageEnum.RestAPIResponceSuccessMessage)
      );

      if (responseJson && !responseJson.errors && responseJson.data) {
        if (responseJson.data.length === 0) {
          this.setState({
            errorMsg: "Data Not Found",
            loading: false,
          });
        } else {
          this.setState({
            commentData: responseJson.data,
            errorMsg: "",
            loading: false,
          });
        }
      } else {
        var errorReponse = message.getData(
          getName(MessageEnum.RestAPIResponceErrorMessage)
        );
        console.log("error resp", errorReponse);
        if (errorReponse === undefined) {
          this.setState({
            errorMsg: "Something went wrong",
            loading: false,
          });
        } else {
          this.setState({
            errorMsg: errorReponse,
            loading: false,
          });
        }
      }
      if (apiRequestCallId === this.createCommentId) {
        if (responseJson != null) {
          if (!responseJson.errors) {
            this.props.navigation.goBack();
          } else {
            //Check Error Response
            this.parseApiErrorResponse(responseJson);
          }
        }
        this.parseApiCatchErrorResponse(errorReponse);
      } else if (apiRequestCallId === this.likeCommentId) {
        if (responseJson != null) {
          if (!responseJson.errors) {
            this.getCommentData();
          } else {
            //Check Error Response
            this.parseApiErrorResponse(responseJson);
          }
        }
        this.parseApiCatchErrorResponse(errorReponse);
      }
    }
    // Customizable Area End
  }

  // Customizable Area Start
  getCommentData(): boolean {
    const header = {
      "Content-Type": configJSON.commentsContentType,
      token: this.state.token,
    };
    console.log("header  ", JSON.stringify(header));
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    console.log("requestMessage, ", requestMessage);

    this.apiCommentItemCallId = requestMessage.messageId;

    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.commentEndPoint
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.commentsApiMethodType
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);

    return true;
  }

  setComment = (comment: string) => {
    this.setState({ comment });
  };

  createComment = (id?: any, postId?: any) => {
    const header = {
      "Content-Type": configJSON.commentsContentType,
      token: this.state.token,
    };

    const data = {
      attributes: {
        post_id: postId ? postId : 1,
        comment: this.state.comment,
      },
    };
    const httpBody = {
      data: data,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.createCommentId = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.commentEndPoint
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      JSON.stringify(httpBody)
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.commentPOSTAPiMethod
    );
    runEngine.sendMessage(requestMessage.id, requestMessage);
  };

  likeChildComments = (commentId: any) => {
    const header = {
      "Content-Type": configJSON.commentsContentType,
      token: this.state.token,
    };
    const data = {
      attributes: {
        comment_id: commentId,
      },
    };
    const httpBody = {
      data: data,
    };

    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.likeCommentId = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.likeCommentEndPoint
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      JSON.stringify(httpBody)
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.commentPOSTAPiMethod
    );
    runEngine.sendMessage(requestMessage.id, requestMessage);
  };

  getCommentText(comment: any) {
    try {
      return JSON.parse(comment.replace("=>", ":"))?.text;
    } catch {
      return comment;
    }
  }
  // Customizable Area End
}

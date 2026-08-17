import SocialMediaAccountWebController from "../../src/SocialMediaAccountWebController";
import { runEngine } from "../../../../framework/src/RunEngine";
import { Message } from "../../../../framework/src/Message";
import MessageEnum, {
  getName,
} from "../../../../framework/src/Messages/MessageEnum";

jest.mock("../../../social-media-account/src/GoogleWebController", () => {
  return {
    googleLogIn: jest.fn().mockImplementation(() => ({
      then: (cb1: Function, cb2: Function) => {
        cb1();
        cb2({ error: "" });
      },
    })),
    GoogleWebDelegate: jest.fn(),
  };
});

describe("SocialMediaAccountWebController", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    jest.spyOn(runEngine, "debugLog");
    jest.spyOn(runEngine, "sendMessage");
  });

  test("Should be get success response with user log in with google", async () => {
    const socialMediaAccountWebController = new SocialMediaAccountWebController(
      { navigation: {}, id: "id" }
    );
    socialMediaAccountWebController.setState = jest.fn();
    socialMediaAccountWebController.googleLogIn(false, "");
    expect(runEngine.debugLog).toBeCalledWith("User SIGNED IN.");
  });

  test("should be called network api when user get facebook success response", async () => {
    const socialMediaAccountWebController = new SocialMediaAccountWebController(
      { navigation: {}, id: "id" }
    );
    socialMediaAccountWebController.setState = jest.fn();
    const response = {
      email: "test@gmail.com",
      id: "123456",
    };
    socialMediaAccountWebController.responseFacebook(response);
    expect(runEngine.sendMessage).toBeCalledWith(
      "RestAPIRequestMessage",
      expect.objectContaining({
        id: "RestAPIRequestMessage",
        initializeFromObject: expect.any(Function),
        messageId: expect.any(String),
        properties: {
          RestAPIRequestMethodMessage: "POST",
          RestAPIResponceEndPointMessage: "login/login",
          RestAPIRequestHeaderMessage: expect.any(String),
          RestAPIRequestBodyMessage: expect.any(String),
          NavigationPropsMessage: expect.any(Object),
        },
      })
    );
  });

  test("Should be changed google user status", async () => {
    const socialMediaAccountWebController = new SocialMediaAccountWebController(
      { navigation: {}, id: "id" }
    );
    socialMediaAccountWebController.setState = jest.fn();
    socialMediaAccountWebController.googleUserStatusChanged({});
    expect(runEngine.debugLog).toBeCalledWith(
      "createAccountFromSocial empty info"
    );
  });

  test("should be called network api when user created profile", async () => {
    const socialMediaAccountWebController = new SocialMediaAccountWebController(
      { navigation: {}, id: "id" }
    );
    socialMediaAccountWebController.setState = jest.fn();
    socialMediaAccountWebController.createAccountFromSocial(
      "test@gmail.com",
      "123456",
      {} as any
    );
    expect(runEngine.sendMessage).toBeCalledWith(
      "RestAPIRequestMessage",
      expect.objectContaining({
        id: "RestAPIRequestMessage",
        initializeFromObject: expect.any(Function),
        messageId: expect.any(String),
        properties: {
          RestAPIRequestMethodMessage: "POST",
          RestAPIResponceEndPointMessage: "account/accounts",
          RestAPIRequestHeaderMessage: expect.any(String),
          RestAPIRequestBodyMessage: expect.any(String),
          NavigationPropsMessage: expect.any(Object),
        },
      })
    );
  });

  test("should be get network response when api is called", async () => {
    const socialMediaAccountWebController = new SocialMediaAccountWebController(
      { navigation: {}, id: "id" }
    );
    socialMediaAccountWebController.setState = jest.fn();

    const response = {
      meta: {
        token: "token-string",
      },
    };
    const responseMsg = new Message(
      getName(MessageEnum.RestAPIResponceMessage)
    );
    responseMsg.addData(
      getName(MessageEnum.RestAPIResponceDataMessage),
      responseMsg.messageId
    );
    responseMsg.addData(
      getName(MessageEnum.RestAPIResponceSuccessMessage),
      response
    );
    socialMediaAccountWebController.createAccountAPICallId =
      responseMsg.messageId;
    runEngine.sendMessage("Unit Test", responseMsg);
  });

  test("should be get network response as error", async () => {
    const socialMediaAccountWebController = new SocialMediaAccountWebController(
      { navigation: {}, id: "id" }
    );
    socialMediaAccountWebController.setState = jest.fn();

    const response = {
      errors: {},
    };
    const responseMsg = new Message(
      getName(MessageEnum.RestAPIResponceMessage)
    );
    responseMsg.addData(
      getName(MessageEnum.RestAPIResponceDataMessage),
      responseMsg.messageId
    );
    responseMsg.addData(
      getName(MessageEnum.RestAPIResponceSuccessMessage),
      response
    );
    socialMediaAccountWebController.createAccountAPICallId =
      responseMsg.messageId;
    runEngine.sendMessage("Unit Test", responseMsg);
  });

  test("should be called function without error", async () => {
    const socialMediaAccountWebController = new SocialMediaAccountWebController(
      { navigation: {}, id: "id" }
    );
    socialMediaAccountWebController.setState = jest.fn();
    socialMediaAccountWebController.navigate();
    socialMediaAccountWebController.navigateToSignup();
    socialMediaAccountWebController.responseInfoCallback({}, {});
  });
});

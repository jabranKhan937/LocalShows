import SocialMediaAccountMobileController from "../../src/SocialMediaAccountMobileController";
import { runEngine } from "../../../../framework/src/RunEngine";
import { Message } from "../../../../framework/src/Message";
import MessageEnum, {
  getName,
} from "../../../../framework/src/Messages/MessageEnum";

jest.mock("@react-native-google-signin/google-signin", () => ({
  GoogleSignin: {
    configure: jest.fn(),
    hasPlayServices: jest.fn().mockImplementation(() => true),
    // .mockImplementationOnce(() => Promise.reject({code : 2})),
    signIn: jest.fn().mockImplementation(() => ({
      user: {
        email: "test@gmail.com",
        id: "id",
      },
    })),
  },
  statusCodes: {
    PLAY_SERVICES_NOT_AVAILABLE: 1,
    SIGN_IN_CANCELLED: 2,
    IN_PROGRESS: 3,
  },
}));

describe("SocialMediaAccountMobileController", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    jest.spyOn(runEngine, "debugLog");
    jest.spyOn(runEngine, "sendMessage");
  });

  test("Should be get success response with user log in with google", async () => {
    const socialMediaAccountMobileController =
      new SocialMediaAccountMobileController({ navigation: {}, id: "id" });
    socialMediaAccountMobileController.setState = jest.fn();
    await socialMediaAccountMobileController.btnGoogleLogInProps.onPress();
  });

  test("should be called network api when user get facebook success response", async () => {
    const socialMediaAccountMobileController =
      new SocialMediaAccountMobileController({ navigation: {}, id: "id" });
    socialMediaAccountMobileController.setState = jest.fn();
    const response = {
      email: "test@gmail.com",
      id: "123456",
    };
    socialMediaAccountMobileController.facebookUserStatusChanged(response);
    socialMediaAccountMobileController.logInWithSocial(
      "test@gmail.com",
      "password",
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

  test("Should be changed google user status", async () => {
    const socialMediaAccountMobileController =
      new SocialMediaAccountMobileController({ navigation: {}, id: "id" });
    socialMediaAccountMobileController.setState = jest.fn();
    socialMediaAccountMobileController.googleMobileUserStatusChanged({});
    expect(runEngine.debugLog).toBeCalledWith(
      "createAccountFromSocial empty info"
    );
  });

  test("should be called network api when user created profile", async () => {
    const socialMediaAccountMobileController =
      new SocialMediaAccountMobileController({ navigation: {}, id: "id" });
    socialMediaAccountMobileController.setState = jest.fn();
    socialMediaAccountMobileController.createAccountFromSocial(
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
    const socialMediaAccountMobileController =
      new SocialMediaAccountMobileController({ navigation: {}, id: "id" });
    socialMediaAccountMobileController.setState = jest.fn();

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
    socialMediaAccountMobileController.createAccountAPICallId =
      responseMsg.messageId;
    runEngine.sendMessage("Unit Test", responseMsg);
  });

  test("should be get network response as error", async () => {
    const socialMediaAccountMobileController =
      new SocialMediaAccountMobileController({ navigation: {}, id: "id" });
    socialMediaAccountMobileController.setState = jest.fn();

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
    socialMediaAccountMobileController.createAccountAPICallId =
      responseMsg.messageId;
    runEngine.sendMessage("Unit Test", responseMsg);
  });

  test("should be called function without error", async () => {
    const socialMediaAccountMobileController =
      new SocialMediaAccountMobileController({ navigation: {}, id: "id" });
    socialMediaAccountMobileController.setState = jest.fn();
    socialMediaAccountMobileController.btnNavigateProps.onPress();
    socialMediaAccountMobileController.navigateToSignup();
    socialMediaAccountMobileController.navigateToLogin();
  });
});

import FacebookController, {
  FacebookDelegate,
} from "../../src/FacebookController";
import { runEngine } from "../../../../framework/src/RunEngine";

jest.mock("react-native-fbsdk", () => ({
  LoginManager: {
    logInWithPermissions: jest
      .fn()
      .mockImplementationOnce(() => Promise.resolve({ isCancelled: true }))
      .mockImplementationOnce(() => Promise.resolve(true))
      .mockImplementation(() => ({
        then: (successCallback: any, failedCallback: any) => {
          failedCallback("error");
        },
      })),
  },
  AccessToken: {
    getCurrentAccessToken: jest
      .fn()
      .mockImplementation(() => Promise.resolve("facebook-auth-token")),
  },
}));

global.fetch = jest.fn().mockImplementation(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        email: "test@gmail.com",
        id: "123456",
      }),
  })
);

describe("FacebookController", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    jest.spyOn(runEngine, "debugLog");
  });

  test("should be get cancelled response when user cancel facebook login", async () => {
    await FacebookController.handleFacebookLogin({}, false);
    expect(runEngine.debugLog).toBeCalledWith("Login cancelled");
  });

  test("should be get success response when user successfully login", async () => {
    await FacebookController.handleFacebookLogin(new FacebookDelegate(), false);
    expect(runEngine.debugLog).toBeCalledWith("Login DONE");
  });

  test("should be get error response when error occur", async () => {
    await FacebookController.handleFacebookLogin(new FacebookDelegate(), false);
    expect(runEngine.debugLog).toBeCalledWith("Login fail with error: error");
  });
});

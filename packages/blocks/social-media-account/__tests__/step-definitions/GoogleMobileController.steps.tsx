import GoogleMobileController from "../../src/GoogleMobileController";

jest.mock("@react-native-google-signin/google-signin", () => ({
  GoogleSignin: {
    configure: jest.fn(),
    hasPlayServices: jest.fn()
      .mockImplementation(() => true),
    signIn: jest.fn().mockImplementation(() => ({
      user: {
        email: "test@gmail.com",
        id: "id"
      }
    }))
  },
  statusCodes: {
    PLAY_SERVICES_NOT_AVAILABLE: 1,
    SIGN_IN_CANCELLED: 2,
    IN_PROGRESS: 3
  },
}));

describe("GoogleMobileController", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  test("should be get true response when user try to login with google", async () => {
    const response = await GoogleMobileController.signIn(false);
    expect(response).toBeTruthy();
  });

  test("should be get true response when user already login", async () => {
    const response = await GoogleMobileController.handleGoogleSignIn({googleMobileUserStatusChanged: jest.fn()}, false);
    expect(response).toBeTruthy();
  });
});

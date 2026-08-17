import React from "react";
import { fireEvent, render } from "@testing-library/react-native";
import SocialMediaAccountLoginScreen from "../../src/SocialMediaAccountLoginScreen";

const screenProps = {
  id: "SocialMediaAccountLoginScreen",
  navigation: {},
};

jest.mock("@react-native-google-signin/google-signin", () => ({
  GoogleSignin: {
    configure: jest.fn(),
  },
  statusCodes: "",
}));
jest.mock("react-native-fbsdk", () => ({
  LoginManager: {
    logInWithPermissions: jest
      .fn()
      .mockImplementation(() => Promise.resolve("")),
  },
}));

describe("SocialMediaAccountLoginScreen", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  test("should render without crashes", () => {
    const { container } = render(
      <SocialMediaAccountLoginScreen {...screenProps} />
    );
    expect(container).toBeTruthy();
  });

  test("social login with facebook button should be define inside render", () => {
    const { getByTestId } = render(
      <SocialMediaAccountLoginScreen {...screenProps} />
    );
    const facebookLoginBtn = getByTestId("btnFacebookLogIn");
    fireEvent.press(facebookLoginBtn);
    expect(facebookLoginBtn).toBeDefined();
  });

  test("social login with google button should be define inside render", () => {
    const { getByTestId } = render(
      <SocialMediaAccountLoginScreen {...screenProps} />
    );
    const googleLoginBtn = getByTestId("btnGoogleLogIn");
    fireEvent.press(googleLoginBtn);
    expect(googleLoginBtn).toBeDefined();
  });

  test("user press button to navigate to login with email password", () => {
    const { getByTestId } = render(
      <SocialMediaAccountLoginScreen {...screenProps} />
    );
    const btnNavigate = getByTestId("btnNavigate");
    fireEvent.press(btnNavigate);
    expect(btnNavigate).toBeDefined();
  });
});

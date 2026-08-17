import React from "react";
import { fireEvent, render } from "@testing-library/react-native";
import { View } from "react-native";
import SocialMediaAccountLoginScreen from "../../src/SocialMediaAccountLoginScreen.web";

const screenProps = {
  id: "SocialMediaAccountLoginScreen",
  navigation: {},
};

jest.mock(
  "../../../social-media-account/src/CustomFacebookLogInButton",
  () => (props: any) => <View {...props} onPress={jest.fn()} />
);
jest.mock(
  "../../../social-media-account/src/CustomGoogleLogInButton",
  () => (props: any) => <View {...props} onResponse={jest.fn()} />
);

jest.mock("../../../social-media-account/src/GoogleWebController", () => {
  return class GoogleWebController {};
});

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
    expect(facebookLoginBtn.props.onPress).toBeCalled();
    expect(facebookLoginBtn).toBeDefined();
  });

  test("social login with google button should be define inside render", () => {
    const { getByTestId } = render(
      <SocialMediaAccountLoginScreen {...screenProps} />
    );
    const googleLoginBtn = getByTestId("btnGoogleLogIn");
    googleLoginBtn.props.onResponse("google-credential")
    expect(googleLoginBtn.props.onResponse).toBeCalledWith("google-credential");
    expect(googleLoginBtn).toBeDefined();
  });
});

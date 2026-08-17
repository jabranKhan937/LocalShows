import React from "react";
import { fireEvent, render } from "@testing-library/react-native";

import SocialMediaAccountRegistration from "../../src/SocialMediaAccountRegistrationScreen.web";
import { View } from "react-native";

jest.mock("../../../social-media-account/src/GoogleWebController", () => {
  return class GoogleWebController {};
});
jest.mock(
  "../../../social-media-account/src/CustomFacebookLogInButton",
  () => (props: any) => <View {...props} />
);
jest.mock(
  "../../../social-media-account/src/CustomGoogleLogInButton",
  () => (props: any) => <View {...props} />
);

const screenProps = {
  id: "SocialMediaAccountRegistration",
  navigation: {},
};

describe("SocialMediaAccountRegistration", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  test("should render without crashes", () => {
    const { container } = render(
      <SocialMediaAccountRegistration {...screenProps} />
    );
    expect(container).toBeTruthy();
  });

  test("social login with facebook button should be define inside render", () => {
    const { getByTestId } = render(
      <SocialMediaAccountRegistration {...screenProps} />
    );
    const facebookLoginBtn = getByTestId("btnFacebookLogIn");
    fireEvent.press(facebookLoginBtn);
    expect(facebookLoginBtn).toBeDefined();
  });

  test("social login with google button should be define inside render", () => {
    const { getByTestId } = render(
      <SocialMediaAccountRegistration {...screenProps} />
    );
    const googleLoginBtn = getByTestId("btnGoogleLogIn");
    fireEvent.press(googleLoginBtn);
    expect(googleLoginBtn).toBeDefined();
  });
});

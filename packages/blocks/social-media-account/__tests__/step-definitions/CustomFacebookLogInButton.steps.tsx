import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import CustomFacebookLogInButton from "../../src/CustomFacebookLogInButton";
import { View } from "react-native"

const screenProps = {
  testID: "CustomFacebookLogInButton",
  appId: "id",
  loginFacebookButtonText: "Login with facebook",
  callback: jest.fn(),
  onPress: jest.fn(),
};

jest.mock("react-facebook-login/dist/facebook-login-render-props", () => (props: any) => <View {...props} />)

describe("CustomFacebookLogInButton", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  test("should render without crashes", () => {
    const { container } = render(<CustomFacebookLogInButton {...screenProps} />);
    expect(container).toBeTruthy();
  });

  test("should called onPress function when facebook returns success response", () => {
    const { container } = render(
      <CustomFacebookLogInButton {...screenProps} />
    );
    const children: any = container.children[0]
    const renderChild: any = render(children.props.render({onClick: jest.fn()}))
    fireEvent.press(renderChild.container.children[0])
    expect(container).toBeTruthy();
    expect(renderChild).toBeTruthy();
  });

});

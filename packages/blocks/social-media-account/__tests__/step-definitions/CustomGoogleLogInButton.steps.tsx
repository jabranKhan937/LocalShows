import React from "react";
import { render } from "@testing-library/react-native";
import CustomGoogleLogInButton from "../../src/CustomGoogleLogInButton";

const screenProps = {
  testID: "CustomGoogleLogInButton",
  style: {},
  onResponse: jest.fn(),
  onError: jest.fn(),
  useOneTap: true,
};

describe("CustomGoogleLogInButton", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  test("should render without crashes", () => {
    const { container } = render(<CustomGoogleLogInButton {...screenProps} />);
    expect(container).toBeTruthy();
  });

  test("should called onResponse function when google returns success response", () => {
    const { getByTestId } = render(
      <CustomGoogleLogInButton {...screenProps} />
    );
    const googleLoginWrapper = getByTestId("googleLogin");
    const googleLogin: any = googleLoginWrapper.children[0];
    const response = {
      credential: "crendetial-token-string",
      clientId: "test-client-id",
      select_by: "user",
    };
    googleLogin.props.onSuccess(response);
    expect(screenProps.onResponse).toBeCalledWith(response.credential);
  });

  test("should called onError function when google returns failed response", () => {
    const { getByTestId } = render(
      <CustomGoogleLogInButton {...screenProps} />
    );
    const googleLoginWrapper = getByTestId("googleLogin");
    const googleLogin: any = googleLoginWrapper.children[0];
    googleLogin.props.onError();
    expect(screenProps.onError).toBeCalledWith("Something went wrong!");
  });
});

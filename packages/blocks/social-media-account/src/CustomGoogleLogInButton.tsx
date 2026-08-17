import PropTypes from "prop-types";
import React, { Component } from "react";
import { Text, Image, TouchableOpacity, View } from "react-native";

import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
const configJSON = require("./config");

type Props = {
  testID: string;
  style: any;
  onResponse: (credential: string) => void;
  onError: (error: string) => void;
  useOneTap: boolean;
  // Customizable Area Start
  // Customizable Area End
};

export default class CustomGoogleLogInButton extends Component<Props> {
  static propTypes = {
    testID: PropTypes.string,
    style: PropTypes.any,
    onResponse: PropTypes.func.isRequired,
    onError: PropTypes.func.isRequired,
    useOneTap: PropTypes.bool
    // Customizable Area Start
    // Customizable Area End
  };

  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <GoogleOAuthProvider clientId={configJSON.clientID}>
        <View style={this.props.style} testID="googleLogin">
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              credentialResponse.credential && this.props.onResponse(credentialResponse.credential)
            }}
            onError={() => this.props.onError(configJSON.loginFailed)}
            useOneTap={true}
          />
        </View>
      </GoogleOAuthProvider>
    );
  }
}

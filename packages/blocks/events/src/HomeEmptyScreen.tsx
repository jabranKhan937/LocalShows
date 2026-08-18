import React from "react";
// Customizable Area Start
import { SafeAreaView, StatusBar, View, ActivityIndicator } from "react-native";
import {
  darkAllEventStyles,
  lightAllEventStyles,
} from "./AllEventStyle";
// Customizable Area End

import AllEventController, { Props } from "./AllEventController";

export default class HomeEmptyScreen extends AllEventController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }

  get styles() {
    return this.state.isDarkMode ? darkAllEventStyles : lightAllEventStyles;
  }

  async componentDidMount() {
    // Customizable Area Start
    this.loadHomeTheme();
    this.props.navigation.addListener("willFocus", () => {
      this.handleEventNavigation()
    });
    // Customizable Area End
  }

  // Customizable Area Start
  // Customizable Area Start

  render() {
    // Customizable Area Start
    const theme = this.getHomeTheme();
    return (
      <SafeAreaView style={this.styles.container}>
        <StatusBar
          animated={true}
          hidden={false}
          backgroundColor={theme.background}
          barStyle={this.state.isDarkMode ? "light-content" : "dark-content"}
        />
        <View style={this.styles.loadingContainer}>
          <ActivityIndicator size={'large'} color={theme.primary} />
        </View>
      </SafeAreaView>
    );
    // Customizable Area End
  }

  // Customizable Area Start
  // Customizable Area End
}

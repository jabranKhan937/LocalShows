import React from "react";
// Customizable Area Start
import { SafeAreaView, StatusBar, View, ActivityIndicator } from "react-native";
import styles from "./AllEventStyle";
// Customizable Area End

import AllEventController, { Props } from "./AllEventController";

export default class HomeEmptyScreen extends AllEventController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }

  async componentDidMount() {
    // Customizable Area Start
    this.props.navigation.addListener("willFocus", () => {
      this.handleEventNavigation()
    });
    // Customizable Area End
  }

  // Customizable Area Start
  // Customizable Area Start

  render() {
    // Customizable Area Start
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          animated={true}
          hidden={false}
          backgroundColor="white"
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size={'large'} color="black" />
        </View>
      </SafeAreaView>
    );
    // Customizable Area End
  }

  // Customizable Area Start
  // Customizable Area End
}

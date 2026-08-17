import React from "react";
// Customizable Area Start
import {
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  View,
  ScrollView,
  TouchableWithoutFeedback,
  Platform
} from "react-native";

import { backIcon } from "./assets";
// Customizable Area End

import CustomisableusersubscriptionsController, {
  Props,
  configJSON
} from "./CustomisableusersubscriptionsController";

import { SubscriptionListView } from "./SubscriptionList";

export default class Customisableusersubscriptions extends CustomisableusersubscriptionsController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }

  // Customizable Area Start
  // Customizable Area End

  render() {
    return (
      // Customizable Area Start
      <ScrollView keyboardShouldPersistTaps="always" style={styles.container}>
        <TouchableWithoutFeedback
          onPress={() => {
            this.hideKeyboard();
          }}
        >
          <>
            <View style={styles.header}>
              <View style={styles.leftHeaderView}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.iconView}
                  onPress={() => this.props.navigation.goBack()}
                >
                  <Image source={backIcon} style={styles.backIcon} />
                </TouchableOpacity>
                <Text style={styles.myAdsText}>{configJSON.subscriptions}</Text>
                <Text />
              </View>
            </View>
            <Text style={styles.description}>
              {configJSON.chooseSubscription}
            </Text>
            <SubscriptionListView
              {...this.props}
              data={this.state.subscriptions}
            />
          </>
        </TouchableWithoutFeedback>
      </ScrollView>
      // Customizable Area End
    );
  }
}

const styles = StyleSheet.create({
  // Customizable Area Start
  container: {
    flex: 1,
    padding: 16,
    marginLeft: "auto",
    marginRight: "auto",
    width: Platform.OS === "web" ? "75%" : "100%",
    maxWidth: 650,
    backgroundColor: "#ffffffff"
  },
  myAdsText: {
    fontSize: 22,
    fontWeight: "600",
    marginLeft: 10
  },
  description: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 15
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 20
  },
  leftHeaderView: {
    flexDirection: "row",
    alignItems: "center"
  },
  iconView: {
    paddingHorizontal: 5
  },
  backIcon: {
    width: 7,
    height: 14
  },
  title: {
    marginBottom: 32,
    fontSize: 16,
    textAlign: "left",
    marginVertical: 8
  },
  body: {
    marginBottom: 32,
    fontSize: 16,
    textAlign: "left",
    marginVertical: 8
  }
  // Customizable Area End
});

// Customizable Area Start
// Customizable Area End

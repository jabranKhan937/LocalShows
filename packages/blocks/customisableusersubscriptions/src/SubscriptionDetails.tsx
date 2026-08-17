import React from "react";
  // Customizable Area Start
import {
  View,
  Text,
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from "react-native";
// Customizable Area End

import CustomisableusersubscriptionsController, {
  configJSON
} from "./CustomisableusersubscriptionsController";

export default class SubscriptionDetails extends CustomisableusersubscriptionsController {
  render() {
    return (
      // Customizable Area Start
      <View style={styles.container}>
        <ImageBackground
          style={styles.banner}
          source={{
            uri: configJSON.goldCoinImageUrl
          }}
        >
          <View style={styles.bannerContent}>
            <Text style={styles.bannerHeading}>
              {configJSON.subscriptionDetails}
            </Text>
          </View>
        </ImageBackground>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.detailsContainer}
        >
          <View style={styles.planHeadingView}>
            <Text style={styles.planName} numberOfLines={1}>
              {this.state.data?.attributes?.name}
            </Text>
            <Text style={styles.price}>
              {this.state.data?.attributes?.currencySymbol ??
                configJSON.currencySymbol}
              {this.state.data?.attributes?.price ?? configJSON.zero}
            </Text>
          </View>
          <Text style={styles.dateHeading}>
              Valid Upto: {this.state.data?.attributes?.valid_up_to}
          </Text>
          <Text style={styles.detailsHeading}>
            {configJSON.subscriptionDetails}
          </Text>
          <Text style={styles.details}>
              {this.state.data?.attributes?.description}
          </Text>
          <TouchableOpacity style={styles.btnView} activeOpacity={0.7}>
            <Text style={styles.btnText}>{configJSON.confirmSubscription}</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      // Customizable Area End
    );
  }
}

const styles = StyleSheet.create({
  // Customizable Area Start
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  banner: {
    height: 206,
    width: "100%"
  },
  bannerContent: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginLeft: 15
  },
  bannerHeading: {
    fontWeight: "600",
    color: "white",
    fontSize: 22
  },
  planHeadingView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20
  },
  planName: {
    fontSize: 26,
    fontWeight: "700",
    maxWidth: "70%"
  },
  price: {
    fontSize: 20,
    fontWeight: "600"
  },
  detailsContainer: {
    paddingHorizontal: 15
  },
  dateHeading: {
    fontSize: 14,
    fontWeight: "700",
    marginTop: 25
  },
  detailsHeading: {
    fontSize: 14,
    fontWeight: "700",
    marginTop: 25,
    marginBottom: 20
  },
  details: {
    fontSize: 14,
    fontWeight: "500"
  },
  btnText: {
    fontWeight: "500",
    color: "#fff",
    alignSelf: "center",
    fontSize: 16
  },
  btnView: {
    height: 50,
    backgroundColor: "#cd960c",
    justifyContent: "center",
    marginTop: 50,
    marginBottom: 40
  }
  // Customizable Area End
});

// Customizable Area Start
// Customizable Area End
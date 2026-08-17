import React from "react";
// Customizable Area Start
import {
  StyleSheet,
  Text,
  Image,
  View,
  ScrollView,
  TouchableWithoutFeedback,
  Platform,
  TouchableOpacity,
} from "react-native";

import { imgLocation, imgLogo } from "./assets";
import Loader from "../../../components/src/Loader";
// Customizable Area End

import LocationController, { Props, configJSON } from "./LocationController";

export default class Location extends LocationController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }

  // Customizable Area Start
  // Customizable Area End
  render() {
    return (
      //Merge Engine DefaultContainer
      <View style={styles.container}>
        <ScrollView
          keyboardShouldPersistTaps="always"
          style={styles.scrollContainer}
        >
          <TouchableWithoutFeedback
            testID={"button-view-pad"}
            onPress={() => {
              this.hideKeyboard();
            }}
          >
            {/* Customizable Area Start */}
            {/* Merge Engine UI Engine Code */}
            <View>
              {this.state.allowAccess ? (
                <View style={styles.locationGroupContainer}>
                  <Image style={styles.imageLocation} source={imgLocation} />
                  {this.state.gpsLocation.length > 0 ? (
                    <Text style={styles.titleText}>
                      Current City: {this.state.gpsLocation}
                    </Text>
                  ) : (
                    <Text style={styles.titleText}>
                      {configJSON.labelTitleText}
                    </Text>
                  )}
                  <View style={styles.locationButtonContent}>
                    <TouchableOpacity
                      testID="btnAllowLocation"
                      activeOpacity={0.7}
                      style={styles.customButton}
                      onPress={() =>
                        Platform.OS === "android"
                          ? this.checkGPS()
                          : this.getLocation()
                      }
                    >
                      <Text style={styles.customButtonText}>
                        {configJSON.btnGetLocationTitle}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={styles.locationGroupContainer} />
              )}
              <Loader loading={this.state.isSpinnerShowing} />
              {this.state.isSpinnerShowing && (
                <View style={styles.loadingContainer}>
                  <Image style={styles.loadingLogo} source={imgLogo} />
                </View>
              )}
            </View>
            {/* Merge Engine UI Engine Code */}
            {/* Customizable Area End */}
          </TouchableWithoutFeedback>
        </ScrollView>
      </View>
      //Merge Engine End DefaultContainer
    );
  }
}

// Customizable Area Start
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
    marginLeft: "auto",
    marginRight: "auto",
    width: Platform.OS === "web" ? "75%" : "100%",
    maxWidth: 650,
    backgroundColor: "#ffffffff",
  },
  title: {
    marginBottom: 32,
    fontSize: 16,
    textAlign: "left",
    marginVertical: 8,
  },
  body: {
    marginBottom: 32,
    fontSize: 16,
    textAlign: "left",
    marginVertical: 8,
  },
  bgPasswordContainer: {
    flexDirection: "row",
    backgroundColor: "#00000000",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderColor: "#767676",
    borderRadius: 2,
    padding: 10,
    borderWidth: Platform.OS === "web" ? 0 : 1,
  },
  bgMobileInput: {
    flex: 1,
  },
  titleText: {
    marginTop: 14,
    fontSize: 16,
    color: "#000",
  },
  bodyText: {
    marginTop: 5,
    fontSize: 12,
    color: "#000",
  },

  // new styles
  locationGroupContainer: {
    flex: 1,
    alignItems: "center",
    marginTop: "50%",
    paddingHorizontal: 36,
  },
  imageLocation: {
    height: 90,
    width: 64,
  },
  locationButtonContent: {
    width: "100%",
    marginTop: 25,
  },

  // custom button
  customButton: {
    backgroundColor: "#4b419f",
    borderRadius: 20,
    padding: 10,
    height: 38,
    elevation: 2,
  },

  customButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 13,
  },

  // custom loading
  loadingContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: "50%",
    backgroundColor: "#ffffffdb",
    zIndex: 10,
  },
  loadingLogo: {
    height: 150,
    width: 300,
  },
});
// Customizable Area End

import React from "react";

// Customizable Area Start
import {
  StyleSheet,
  Dimensions,
  Text,
  Image,
  TouchableOpacity,
  View,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from "react-native";

const windowWidth = Dimensions.get("window").width;

import { colors } from "../../utilities/src/Colors";
import { leftArrow } from "../../email-account-registration/src/assets";
import HelpCentreController from "./HelpCentreController";
import WebView from "react-native-webview";

const {baseURL} = require("../../../framework/src/config.js");
// Customizable Area End

export default class AboutUs extends HelpCentreController {
  // Customizable Area Start
  // Customizable Area End

  render() {
    // Customizable Area Start
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={colors(false).background}
        />
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainerStyle}
        >
          <View style={styles.headerContainer}>
            <TouchableOpacity
              testID="navigationBackButton"
              style={styles.backNavButton}
              onPress={() => {
                this.props.navigation.goBack();
              }}
            >
              <Image source={leftArrow} style={styles.backButtonIcon} />
            </TouchableOpacity>
            <Text testID="testLabel" style={styles.pageTitle}>
              About us
            </Text>
            <View style={styles.backNavButton} />
          </View>
          {/* <View style={styles.coverContainer}>
            <Image source={{uri: `${baseURL}${this.state.aboutUsImage}`}} style={styles.coverImage} />
            <Text style={styles.coverLabel}>Local Shows</Text>
          </View> */}
          <WebView
            style={styles.webView}
            source={{ html: this.state.aboutUs }}
            textZoom={100}
            javaScriptEnabled={true}
            injectedJavaScriptBeforeContentLoaded={
              `var element = document.getElementsByTagName('body');
              element[0].style.fontSize = '2.5em';`
            }
          />
        </ScrollView>
      </SafeAreaView>
    );
    // Customizable Area End
  }
}

// Customizable Area Start
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors(false).background,
  },
  contentContainerStyle: {
    flex: 1,
    paddingHorizontal:16,
    paddingBottom:16,
    paddingTop:5
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
    backgroundColor:'white'
  },
  backNavButton: {
    width: 20,
  },
  backButtonIcon: {
    width: 12,
    left: 0,
    resizeMode: "contain",
  },
  pageTitle: {
    color: colors(false).text,
    fontWeight: "700",
    fontSize: 24,
  },
  hamburgerIcon: {
    width: 25,
    height: 16,
    resizeMode: "contain",
  },
  coverContainer: {},
  coverImage: {
    width: windowWidth,
    height: (windowWidth * 237) / 375,
    marginLeft: -16,
    resizeMode: "cover",
    marginBottom: 10,
  },
  coverLabel: {
    color: colors(false).white,
    zIndex: 100,
    position: "absolute",
    bottom: 10,
    fontSize: 40,
    width: "100%",
    paddingVertical: 5,
  },
  text: {
    color: colors(false).text,
    fontSize: 16,
    marginVertical: 8,
  },
  webView: {
    width: "100%",
  },
});
// Customizable Area End

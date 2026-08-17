import React from "react";
import {
  Dimensions,
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  StatusBar
} from "react-native";
import MergeEngineUtilities from "../../utilities/src/MergeEngineUtilities";

// Import assets (make sure these are valid!)
import { imgSplash, imgloader } from "./assets";

// Artboard original dimensions
let artBoardHeightOrg = 667;
let artBoardWidthOrg = 375;

import SplashscreenController, { Props } from "./SplashscreenController";

export default class Splashscreen extends SplashscreenController {
  private dimSubscription: any;

  constructor(props: Props) {
    super(props);

    // Ensure spin is defined to avoid crashes
    this.state = {
      ...this.state,
      spin: this.state?.spin ?? 0
    };

    // Listen for orientation/size changes
    this.dimSubscription = Dimensions.addEventListener("change", () => {
      try {
        MergeEngineUtilities.init(
          artBoardHeightOrg,
          artBoardWidthOrg,
          Dimensions.get("window").height,
          Dimensions.get("window").width
        );
        this.forceUpdate();
      } catch (err) {
        console.error("MergeEngine init error:", err);
      }
    });
  }

  componentWillUnmount() {
    // Remove Dimensions listener
    if (this.dimSubscription?.remove) {
      this.dimSubscription?.remove();
    } else {
      Dimensions?.removeEventListener?.("change", this.dimSubscription);
    }
  }

  render() {
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
      },
      image_loaderImage: {
        width: 60,
        height: 60,
        resizeMode: "contain",
        marginTop: 40
      },
      text: {
        fontFamily: "OpenSans",
        textAlign: "center",
        color: "rgba(255, 255, 255, 1)"
      },
      text_greeting: {
        fontSize: 28
      },
      text_title: {
        fontSize: 60,
        fontWeight: "bold"
      },
      text_subtitle: {
        fontSize: 16,
        marginTop: 20
      }
    });

    return (
      <ImageBackground
        source={imgSplash || { uri: "https://via.placeholder.com/375x667" }}
        style={{ width: "100%", height: "100%" }}
      >
        <StatusBar
          backgroundColor="#00000000"
          translucent={true}
          barStyle="light-content"
        />
        <View style={styles.container}>
          <Text style={[styles.text, styles.text_greeting]}>Welcome to</Text>
          <Text style={[styles.text, styles.text_title]}>
            {"Local\nShows"}
          </Text>
          <Text style={[styles.text, styles.text_subtitle]}>
            {"Taking you to find the last events\nof your favorite artists ..."}
          </Text>
          <Image
            style={[
              styles.image_loaderImage,
              { transform: [{ rotate: `${this.state?.spin ?? 0}deg` }] }
            ]}
            source={imgloader || { uri: "https://via.placeholder.com/60" }}
          />
        </View>
      </ImageBackground>
    );
  }
}

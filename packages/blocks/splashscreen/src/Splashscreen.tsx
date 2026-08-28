import React from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import MergeEngineUtilities from "../../utilities/src/MergeEngineUtilities";
import Icon from "react-native-vector-icons/Feather";
import { lightTheme, redesignTheme } from "../../utilities/src/Colors";

let artBoardHeightOrg = 667;
let artBoardWidthOrg = 375;

import SplashscreenController, { Props } from "./SplashscreenController";

type SplashTheme = typeof redesignTheme;

export default class Splashscreen extends SplashscreenController {
  private dimSubscription: any;

  constructor(props: Props) {
    super(props);

    this.state = {
      ...this.state,
      spin: this.state?.spin ?? 0,
    };

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

  async componentWillUnmount() {
    if (this.dimSubscription?.remove) {
      this.dimSubscription.remove();
    } else {
      Dimensions.removeEventListener?.("change", this.dimSubscription);
    }
    await super.componentWillUnmount();
  }

  get styles() {
    return this.state.isDarkMode ? darkSplashStyles : lightSplashStyles;
  }

  render() {
    const theme = this.getSplashTheme();
    const styles = this.styles;

    return (
      <View style={styles.screen}>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle={this.state.isDarkMode ? "light-content" : "dark-content"}
        />
        <View pointerEvents="none" style={styles.glowPink} />
        <View pointerEvents="none" style={styles.glowCyan} />
        <View pointerEvents="none" style={styles.glowYellow} />

        <View style={styles.center}>
          <View style={styles.logoGlow}>
            <View style={styles.logoMark}>
              <Icon name="music" size={34} color="#FFFFFF" />
            </View>
          </View>
          <Text style={styles.wordmarkLocal}>LOCAL</Text>
          <Text style={styles.wordmarkShows}>SHOWS</Text>
          <Text style={styles.tagline}>Live music, art & culture near you</Text>
          <ActivityIndicator
            style={styles.loader}
            size="small"
            color={theme.primary}
          />
        </View>

        <Text style={styles.footer}>FIND YOUR NEXT NIGHT OUT</Text>
      </View>
    );
  }
}

const createSplashStyles = (theme: SplashTheme) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: theme.background,
      alignItems: "center",
      justifyContent: "center",
    },
    glowPink: {
      position: "absolute",
      top: -80,
      right: -60,
      width: 260,
      height: 260,
      borderRadius: 130,
      backgroundColor: theme.primary,
      opacity: 0.18,
    },
    glowCyan: {
      position: "absolute",
      left: -90,
      top: 180,
      width: 220,
      height: 220,
      borderRadius: 110,
      backgroundColor: theme.featuredTime,
      opacity: 0.12,
    },
    glowYellow: {
      position: "absolute",
      bottom: 40,
      right: -40,
      width: 180,
      height: 180,
      borderRadius: 90,
      backgroundColor: theme.accent,
      opacity: 0.1,
    },
    center: {
      alignItems: "center",
      paddingHorizontal: 32,
    },
    logoGlow: {
      marginBottom: 28,
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.7,
      shadowRadius: 18,
      elevation: 12,
    },
    logoMark: {
      width: 88,
      height: 88,
      borderRadius: 24,
      backgroundColor: theme.primary,
      alignItems: "center",
      justifyContent: "center",
    },
    wordmarkLocal: {
      fontFamily: "OpenSans",
      fontSize: 18,
      fontWeight: "800",
      letterSpacing: 8,
      color: theme.foreground,
    },
    wordmarkShows: {
      fontFamily: "OpenSans",
      fontSize: 44,
      fontWeight: "900",
      letterSpacing: 4,
      color: theme.primary,
      marginTop: 2,
    },
    tagline: {
      fontFamily: "OpenSans",
      fontSize: 14,
      fontWeight: "500",
      color: theme.muted,
      marginTop: 12,
      textAlign: "center",
    },
    loader: {
      marginTop: 36,
    },
    footer: {
      position: "absolute",
      bottom: 48,
      fontFamily: "OpenSans",
      fontSize: 11,
      fontWeight: "700",
      letterSpacing: 2.4,
      color: theme.muted,
    },
  });

const darkSplashStyles = createSplashStyles(redesignTheme);
const lightSplashStyles = createSplashStyles(lightTheme);

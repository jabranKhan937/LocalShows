import React from "react";

// Customizable Area Start
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Feather";
import { lightTheme, redesignTheme } from "../../utilities/src/Colors";
import HelpCentreController from "./HelpCentreController";
import WebView from "react-native-webview";

type AboutUsTheme = typeof redesignTheme;
// Customizable Area End

export default class AboutUs extends HelpCentreController {
  // Customizable Area Start
  get styles() {
    return this.state.isDarkMode ? darkAboutUsStyles : lightAboutUsStyles;
  }

  getThemedAboutUsHtml = () => {
    const theme = this.getHelpCentreTheme();
    const htmlBody = this.state.aboutUs || "";
    return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
    <style>
      html, body {
        margin: 0;
        padding: 0;
        background-color: ${theme.card};
        color: ${theme.foreground};
        font-family: -apple-system, BlinkMacSystemFont, "OpenSans", "Segoe UI", sans-serif;
        font-size: 16px;
        line-height: 1.65;
        -webkit-text-size-adjust: 100%;
      }
      body {
        padding: 4px 2px 8px;
      }
      p {
        margin: 0 0 18px;
        color: ${theme.foreground};
      }
      p:last-child {
        margin-bottom: 0;
      }
      strong, b {
        color: ${theme.foreground};
        font-weight: 800;
      }
      em, i {
        font-style: italic;
      }
      u {
        text-decoration: underline;
      }
      a {
        color: ${theme.primary};
        text-decoration: none;
        font-weight: 700;
      }
    </style>
  </head>
  <body>${htmlBody}</body>
</html>`;
  };

  renderHeader = () => {
    const theme = this.getHelpCentreTheme();
    return (
      <View style={this.styles.pageHeader}>
        <TouchableOpacity
          testID="navigationBackButton"
          style={this.styles.headerCircleBtn}
          onPress={() => {
            this.props.navigation.goBack();
          }}
          activeOpacity={0.8}
        >
          <Icon name="arrow-left" size={18} color={theme.foreground} />
        </TouchableOpacity>
        <Text testID="testLabel" style={this.styles.pageTitle}>
          About us
        </Text>
        <View style={this.styles.headerSideSpacer} />
      </View>
    );
  };
  // Customizable Area End

  render() {
    // Customizable Area Start
    const theme = this.getHelpCentreTheme();
    return (
      <SafeAreaView style={this.styles.container} edges={["top"]}>
        <StatusBar
          barStyle={this.state.isDarkMode ? "light-content" : "dark-content"}
          backgroundColor={theme.background}
        />
        {this.renderHeader()}
        <View style={this.styles.contentWrap}>
          <View style={this.styles.contentCard}>
            <View style={this.styles.brandRow}>
              <View style={this.styles.brandMark}>
                <Icon name="music" size={14} color="#FFFFFF" />
              </View>
              <Text style={this.styles.brandLabel}>Local Shows</Text>
            </View>
            <WebView
              style={this.styles.webView}
              source={{ html: this.getThemedAboutUsHtml() }}
              originWhitelist={["*"]}
              textZoom={100}
              javaScriptEnabled={true}
              showsVerticalScrollIndicator={false}
              scalesPageToFit={false}
              automaticallyAdjustContentInsets={false}
            />
          </View>
        </View>
      </SafeAreaView>
    );
    // Customizable Area End
  }
}

// Customizable Area Start
const createAboutUsStyles = (theme: AboutUsTheme) => {
  const isLightTheme = theme.background === lightTheme.background;
  return StyleSheet.create({
    container: {
      flex: 1,
      width: "100%",
      maxWidth: 650,
      alignSelf: "center",
      backgroundColor: theme.background,
    },
    pageHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 16,
      height: 56,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.border,
      backgroundColor: theme.background,
    },
    headerCircleBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.input,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border,
      alignItems: "center",
      justifyContent: "center",
    },
    headerSideSpacer: {
      width: 36,
      height: 36,
    },
    pageTitle: {
      fontWeight: "900",
      fontSize: 18,
      letterSpacing: 0.6,
      color: theme.foreground,
      textTransform: "uppercase",
    },
    contentWrap: {
      flex: 1,
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 24,
    },
    contentCard: {
      flex: 1,
      backgroundColor: theme.card,
      borderRadius: 16,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border,
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 8,
      ...Platform.select({
        ios: {
          shadowColor: isLightTheme ? "#000000" : "#FFFFFF",
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: isLightTheme ? 0.08 : 0.06,
          shadowRadius: 12,
        },
        android: {
          elevation: isLightTheme ? 3 : 2,
        },
      }),
    },
    brandRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 16,
    },
    brandMark: {
      width: 28,
      height: 28,
      borderRadius: 8,
      backgroundColor: theme.primary,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 8,
    },
    brandLabel: {
      fontWeight: "900",
      fontSize: 16,
      letterSpacing: 0.4,
      color: theme.foreground,
      textTransform: "uppercase",
    },
    webView: {
      flex: 1,
      width: "100%",
      backgroundColor: "transparent",
    },
  });
};

const darkAboutUsStyles = createAboutUsStyles(redesignTheme);
const lightAboutUsStyles = createAboutUsStyles(lightTheme);
// Customizable Area End

import React from "react";

// Customizable Area Start
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Linking,
  StatusBar,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Feather";
import { lightTheme, redesignTheme } from "../../utilities/src/Colors";
import { WebView } from "react-native-webview";
import { TERMS_AND_CONDITIONS_HTML } from "./termsAndConditionsHtml";
import { PRIVACY_POLICY_HTML } from "./privacyPolicyHtml";
// Customizable Area End

import TermsConditionsController, {
  Props,
  configJSON,
  ITermsConds,
} from "./TermsConditionsController";

type TermsTheme = typeof redesignTheme;

export default class TermsConditions extends TermsConditionsController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }

  // Customizable Area Start
  get styles() {
    return this.state.isDarkMode ? darkTermsStyles : lightTermsStyles;
  }

  isPrivacyPolicyScreen = () => false;

  getLegalTitle = () =>
    this.isPrivacyPolicyScreen() ? "Privacy Policy" : "Terms & Conditions";

  getThemedTermsHtml = () => {
    const theme = this.getTermsTheme();
    const htmlBody = this.isPrivacyPolicyScreen()
      ? PRIVACY_POLICY_HTML
      : TERMS_AND_CONDITIONS_HTML;
    return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
    <style>
      html, body {
        margin: 0;
        padding: 0;
        background-color: ${theme.card} !important;
        color: ${theme.foreground} !important;
        font-family: -apple-system, BlinkMacSystemFont, "OpenSans", "Segoe UI", sans-serif;
        font-size: 16px;
        line-height: 1.65;
        -webkit-text-size-adjust: 100%;
      }
      body {
        padding: 4px 2px 24px;
      }
      * {
        color: ${theme.foreground} !important;
        background-color: transparent !important;
      }
      p {
        margin: 0 0 18px;
      }
      p:last-child {
        margin-bottom: 0;
      }
      h1, h2, h3, h4, h5, h6, strong, b {
        color: ${theme.foreground} !important;
        font-weight: 800;
      }
      h2 {
        font-size: 18px;
        margin: 28px 0 12px;
      }
      h3 {
        font-size: 16px;
        margin: 22px 0 10px;
      }
      ul, ol {
        margin: 0 0 18px;
        padding-left: 20px;
      }
      li {
        margin-bottom: 8px;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin: 8px 0 18px;
      }
      table, thead, tbody, tfoot, tr, th, td {
        display: block;
        width: 100%;
        box-sizing: border-box;
      }
      tr {
        margin-bottom: 12px;
      }
      th, td {
        border: 1px solid ${theme.border} !important;
        padding: 12px;
        text-align: left;
        vertical-align: top;
        font-size: 14px;
        line-height: 1.55;
        word-break: normal;
        overflow-wrap: break-word;
        white-space: normal;
      }
      th {
        font-weight: 800;
      }
      td ul, td ol {
        margin: 8px 0 0;
        padding-left: 18px;
      }
      td li {
        margin-bottom: 6px;
      }
      em, i {
        font-style: italic;
      }
      u {
        text-decoration: underline;
      }
      a, a * {
        color: ${theme.primary} !important;
        text-decoration: underline;
        font-weight: 700;
      }
    </style>
  </head>
  <body>${htmlBody}</body>
</html>`;
  };

  renderHeader = () => {
    const theme = this.getTermsTheme();
    return (
      <View style={this.styles.header}>
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
        <Text testID="testLabel" style={this.styles.headerTitle}>
          {this.getLegalTitle()}
        </Text>
        <View style={this.styles.headerSideSpacer} />
      </View>
    );
  };

  renderAgreement = () => {
    const theme = this.getTermsTheme();
    return (
      <View style={this.styles.agreementContainer}>
        <TouchableOpacity
          style={this.styles.checkbox}
          testID="btnAcceptTerms"
          onPress={() => this.handleSetAcceptanceOfTermsCondsAPIResponse()}
          activeOpacity={0.8}
        >
          {this.state.isChecked && (
            <Icon name="check" size={14} color={theme.primary} />
          )}
        </TouchableOpacity>
        <Text style={this.styles.agreementText}>
          I have read and agree to these Terms and Conditions.
        </Text>
      </View>
    );
  };

  renderCancel = () => {
    return (
      <TouchableOpacity
        testID="btnCancel"
        style={this.styles.cancelButton}
        onPress={() => this.props.navigation.goBack()}
        activeOpacity={0.8}
      >
        <Text style={this.styles.textCancelButton}>Cancel</Text>
      </TouchableOpacity>
    );
  };

  renderAgree = () => {
    return (
      <TouchableOpacity
        testID="btnAgree"
        style={[
          this.styles.agreeButton,
          { opacity: this.state.isChecked ? 1 : 0.5 },
        ]}
        disabled={!this.state.isChecked}
        onPress={this.handleAccept}
        activeOpacity={0.8}
      >
        <Text style={this.styles.textAgreeButton}>Agree</Text>
      </TouchableOpacity>
    );
  };

  renderTncContent = () => {
    return (
      <WebView
        originWhitelist={["*"]}
        source={{ html: this.getThemedTermsHtml() }}
        javaScriptEnabled={true}
        showsVerticalScrollIndicator={false}
        style={[
          this.styles.webView,
          {
            height: this.state.WebViewHeight,
          },
        ]}
        onMessage={(event) => {
          this.setState({ WebViewHeight: parseInt(event.nativeEvent.data) });
        }}
        scalesPageToFit={false}
        scrollEnabled={false}
        limitsNavigationsToAppBoundDomains={true}
        automaticallyAdjustContentInsets={false}
        onShouldStartLoadWithRequest={(request) => {
          if (request.url.startsWith("http")) {
            Linking.openURL(request.url);
            return false;
          }
          return true;
        }}
        injectedJavaScript={`
       setTimeout(function() {
         window.ReactNativeWebView.postMessage(
           Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight)
         );
       }, 800);
     `}
        domStorageEnabled={true}
        useWebKit={true}
      />
    );
  };

  // Customizable Area End

  render() {
    // Customizable Area Start
    const theme = this.getTermsTheme();
    return (
      <SafeAreaView style={this.styles.container} edges={["top"]}>
        <StatusBar
          barStyle={this.state.isDarkMode ? "light-content" : "dark-content"}
          backgroundColor={theme.background}
        />
        {this.renderHeader()}
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={this.styles.scroll}
          contentContainerStyle={this.styles.scrollContent}
        >
          <View style={this.styles.contentCard}>
            <View style={this.styles.brandRow}>
              <View style={this.styles.brandMark}>
                <Icon name="file-text" size={14} color="#FFFFFF" />
              </View>
              <Text style={this.styles.brandLabel}>Local Shows</Text>
            </View>
            {this.renderTncContent()}
          </View>
          {this.state.isTermsCondsAccepted === "false" &&
            !this.isPrivacyPolicyScreen() && (
            <View style={this.styles.actionsCard}>
              {this.renderAgreement()}
              {this.renderCancel()}
              {this.renderAgree()}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    );
    // Customizable Area End
  }
}

// Customizable Area Start
const createTermsStyles = (theme: TermsTheme) => {
  const isLightTheme = theme.background === lightTheme.background;
  return StyleSheet.create({
    container: {
      flex: 1,
      width: "100%",
      maxWidth: 650,
      alignSelf: "center",
      backgroundColor: theme.background,
    },
    scroll: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 32,
    },
    header: {
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
    headerTitle: {
      fontWeight: "900",
      fontSize: 18,
      letterSpacing: 0.6,
      color: theme.foreground,
      textTransform: "uppercase",
    },
    contentCard: {
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
      width: "100%",
      backgroundColor: "transparent",
    },
    actionsCard: {
      marginTop: 16,
      backgroundColor: theme.card,
      borderRadius: 16,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border,
      padding: 16,
    },
    agreementContainer: {
      flexDirection: "row",
      alignItems: "flex-start",
    },
    checkbox: {
      height: 22,
      width: 22,
      borderWidth: 1,
      borderRadius: 6,
      borderColor: theme.border,
      backgroundColor: theme.input,
      marginRight: 10,
      marginTop: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    agreementText: {
      flex: 1,
      color: theme.foreground,
      fontSize: 14,
      lineHeight: 22,
      fontWeight: "500",
    },
    agreeButton: {
      backgroundColor: theme.primary,
      width: "100%",
      paddingVertical: 14,
      borderRadius: 14,
      marginTop: 10,
      alignItems: "center",
      justifyContent: "center",
    },
    textAgreeButton: {
      color: "#FFFFFF",
      fontWeight: "800",
      fontSize: 16,
      letterSpacing: 0.3,
    },
    cancelButton: {
      backgroundColor: "transparent",
      marginVertical: 10,
      paddingVertical: 8,
      alignItems: "center",
    },
    textCancelButton: {
      color: theme.primary,
      fontWeight: "700",
      fontSize: 16,
    },
  });
};

const darkTermsStyles = createTermsStyles(redesignTheme);
const lightTermsStyles = createTermsStyles(lightTheme);
// Customizable Area End

import React from "react";

// Customizable Area Start
import {
  StyleSheet,
  SafeAreaView,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Image,
  Linking,
} from "react-native";
import { colors } from "../../utilities/src/Colors";
import { leftArrow } from "../../email-account-registration/src/assets";
import { WebView } from 'react-native-webview';
// Customizable Area End

import TermsConditionsController, {
  Props,
  configJSON,
  ITermsConds,
} from "./TermsConditionsController";

export default class TermsConditions extends TermsConditionsController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }

  // Customizable Area Start
  renderHeader = () => {
    return (
      <View style={styles.header}>
        <TouchableOpacity
          testID="navigationBackButton"
          style={styles.backNavButton}
          onPress={() => {
            this.props.navigation.goBack();
          }}
        >
          <Image source={leftArrow} style={styles.backNavIcon} />
        </TouchableOpacity>
        <Text testID="testLabel" style={[styles.text, styles.headerTitle]}>
          Terms & Conditions
        </Text>
        <View style={styles.backNavButton} />
      </View>
    )
  }

  renderAgreement = () => {
    return (
      <View style={styles.agreementContainer}>
        <TouchableOpacity
          style={styles.checkbox}
          testID="btnAcceptTerms"
          onPress={() =>
            this.handleSetAcceptanceOfTermsCondsAPIResponse()
          }
        >
          {this.state.isChecked && (
            <View style={styles.checked} />
          )}
        </TouchableOpacity>
        <Text style={[styles.text, styles.agreementText]}>
          I have read and agree to these Terms and Conditions.
        </Text>
      </View>
    )
  }

  renderCancel = () => {
    return (
      <TouchableOpacity
        testID="btnCancel"
        style={styles.cancelButton}
        onPress={() => this.props.navigation.goBack()}
      >
        <Text
          style={[
            styles.text,
            styles.textAgreeButton,
            styles.textCancelButton,
          ]}
        >
          Cancel
        </Text>
      </TouchableOpacity>
    )
  }

  renderAgree = () => {
    return (
      <TouchableOpacity
        testID="btnAgree"
        style={[
          styles.agreeButton,
          { opacity: this.state.isChecked ? 1 : 0.5 },
        ]}
        disabled={!this.state.isChecked}
        onPress={this.handleAccept}
      >
        <Text style={[styles.text, styles.textAgreeButton]}>Agree</Text>
      </TouchableOpacity>
    )
  }

  

  renderTncContent = () => {
    return  <WebView
       originWhitelist={['*']}
       source={{ html: this.state.tAndCAPIData }}
       javaScriptEnabled={true}
       showsVerticalScrollIndicator={false}
       style={{
         height:this.state.WebViewHeight,
       }}
       onMessage={event => {
         this.setState({WebViewHeight:parseInt(event.nativeEvent.data)})
       }}        
       scalesPageToFit={false}  
       scrollEnabled={false}
       limitsNavigationsToAppBoundDomains={true}
       automaticallyAdjustContentInsets={false}
       onShouldStartLoadWithRequest={(request) => {
        if (request.url.startsWith('http')) {
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
       }, 500);
     `}
       domStorageEnabled={true}
       useWebKit={true}
   
     />


  }
  
  // Customizable Area End

  render() {
    // Customizable Area Start
    return (
      <SafeAreaView style={styles.container}>
        {this.renderHeader()}
        <ScrollView showsVerticalScrollIndicator={false}>
        {this.renderTncContent()}
        {this.state.isTermsCondsAccepted === 'false' && (
          <View style={{
            paddingBottom:16,
            paddingHorizontal:16,
          }}>
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
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors(false).white,
  },
  contentContainer: {
    paddingTop:5,
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal:16,
  },
  backNavButton: {
    alignSelf: "center",
    width: 20,

  },
  backNavIcon: {
    width: 12,
    left: 0,
    resizeMode: "contain",
  },
  headerTitle: {
    fontWeight: "700",
    fontSize: 24,
  },
  hamburgerIcon: {
    width: 25,
    height: 16,
    resizeMode: "contain",
  },
  text: {
    color: colors(false).text,
    fontSize: 16,
  },
  enumeration: {
    width: "5%",
    marginLeft: "1%",
  },
  termsContent: {
    width: "94%",
  },
  termsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  agreementContainer: {
    flexDirection: "row",
  },
  checkbox: {
    height: 20,
    width: 20,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: colors(false).text,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  checked: {
    height: 12,
    width: 12,
    backgroundColor: "#3333CC",
    borderRadius: 2.5,
  },
  agreementText: {
    width: "90%",
    marginLeft: 5,
  },
  agreeButton: {
    backgroundColor: "#3333CC",
    width: "100%",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  textAgreeButton: {
    color: colors(false).white,
    fontWeight: "700",
    fontSize: 18,
    alignSelf: "center",
  },
  cancelButton: {
    backgroundColor: colors(false).white,
    marginVertical:7
  },
  textCancelButton: {
    color: "#3333CC",
  },
});
// Customizable Area End

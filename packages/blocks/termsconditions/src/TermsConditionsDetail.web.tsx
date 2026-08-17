import React from "react";

// Customizable Area Start
import {
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import MarkdownPreview from "@uiw/react-markdown-preview";
import moment from "moment";
// Customizable Area End

import TermsConditionsDetailController, {
  Props,
  configJSON,
} from "./TermsConditionsDetailController";

export default class TermsConditionsDetail extends TermsConditionsDetailController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }

  // Customizable Area Start
  // Customizable Area End

  render() {
    // Customizable Area Start
    return this.state.isLoading ? (
      <View style={styles.spinnerContainer}>
        <ActivityIndicator color="#000" size={30} />
      </View>
    ) : (
      <View style={styles.container}>
        <Text style={styles.title}>{configJSON.termsConds}</Text>
        <Text style={styles.dateTitle}>
          {configJSON.created +
            ": " +
            moment(this.state.termsConds?.attributes?.created_at).format(
              configJSON.dateFormat
            )}
        </Text>
        <ScrollView>
          <View style={styles.markdownContainer}>
            <MarkdownPreview
              source={this.state.termsConds?.attributes?.description}
            />
          </View>
        </ScrollView>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            testID="btnNavigateEdit"
            onPress={() => this.navigateToTermsCondsEdit()}
            style={styles.button}
          >
            <Text style={styles.buttonLabel}>
              {configJSON.updateTermsConds}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            testID="btnNavigateUsers"
            onPress={() =>
              this.state.termsConds &&
              this.navigateToTermsCondsUsers(this.state.termsConds)
            }
            style={styles.button}
          >
            <Text style={styles.buttonLabel}>{configJSON.acceptedUsers}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
    // Customizable Area End
  }
}

// Customizable Area Start
const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
  },
  spinnerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontWeight: "600",
    fontSize: 22,
    marginBottom: 10,
  },
  dateTitle: {
    fontSize: 18,
    marginBottom: 20,
  },
  markdownContainer: {
    borderWidth: 1,
    padding: 10,
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    marginVertical: 20,
  },
  sendButton: {
    backgroundColor: "blue",
    marginLeft: 10,
    width: 80,
    height: 40,
    display: "flex",
    justifyContent: "center",
    borderRadius: 4,
    alignSelf: "flex-end",
  },
  button: {
    backgroundColor: "blue",
    marginLeft: 10,
    width: 120,
    height: 40,
    display: "flex",
    justifyContent: "center",
    borderRadius: 4,
    alignSelf: "flex-end",
  },
  buttonLabel: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
  },
});
// Customizable Area End

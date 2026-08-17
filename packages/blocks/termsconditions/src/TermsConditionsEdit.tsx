import React from "react";

// Customizable Area Start
import {
  StyleSheet,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Markdown from "react-native-markdown-display";
// Customizable Area End

import TermsConditionsEditController, {
  Props,
  configJSON,
} from "./TermsConditionsEditController";

export default class TermsConditionsEdit extends TermsConditionsEditController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }

  // Customizable Area Start
  // Customizable Area End

  render() {
    // Customizable Area Start
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{configJSON.termsConds}</Text>
        <View style={styles.textInputContainer}>
          <TextInput
            testID="termsCondsInput"
            style={styles.textInput}
            placeholder={!this.state.termsConds ? "Write Markdown..." : ""}
            value={this.state.termsConds}
            onChangeText={this.handleTextChange}
            multiline
          />
        </View>
        <ScrollView style={styles.scrollView}>
          <Markdown>{this.state.termsConds}</Markdown>
        </ScrollView>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            testID="btnSendTermsConds"
            onPress={() => this.sendTermsConds(this.state.termsConds)}
            style={styles.button}
          >
            <Text style={styles.buttonLabel}>{configJSON.saveTermsConds}</Text>
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
  title: {
    fontWeight: "600",
    fontSize: 22,
    marginBottom: 20,
  },
  textInputContainer: {
    flex: 1,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderColor: "gray",
  },
  textInput: {
    borderWidth: 1,
    padding: 10,
    borderColor: "gray",
  },
  scrollView: {
    flex: 1,
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
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    margin: 20,
  },
});
// Customizable Area End

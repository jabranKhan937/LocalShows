import React from "react";

// Customizable Area Start
import {
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ActivityIndicator,
} from "react-native";
import CheckBox from "../../../components/src/CustomCheckBox";
import MarkdownPreview from "@uiw/react-markdown-preview";
import { FlatList } from "react-native-gesture-handler";
import moment from "moment";
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
  // Customizable Area End

  render() {
    // Customizable Area Start
    return this.state.isLoading ? (
      <View style={styles.spinnerContainer}>
        <ActivityIndicator color="#000" size={30} />
      </View>
    ) : !this.state.isAdminUser && this.state.termsConds ? (
      <View style={styles.container}>
        <Text style={styles.termsCondsTitle}>{configJSON.termsConds}</Text>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}
        >
          <MarkdownPreview source={this.state.termsConds.description} />
        </ScrollView>
        <View style={styles.checkboxContainer}>
          <Text>{configJSON.tickAccept}</Text>
          <CheckBox
            testID="checkbox"
            isChecked={this.state.isTermsCondsAccepted}
            onChangeValue={this.handleCheckBoxChange}
          />
        </View>
      </View>
    ) : (
      <FlatList
        testID="termsCondsList"
        data={this.state.termsCondsList}
        renderItem={({ item }: { item: ITermsConds }) => (
          <TouchableWithoutFeedback
            testID="navigateDetailBtn"
            onPress={() => this.navigateToTermsCondsDetail(item.id)}
          >
            <View style={styles.termsCondsContainer}>
              <Text>{item.id}</Text>
              <Text>
                {moment(item.created_at).format(configJSON.dateFormat)}
              </Text>
              <Text>{"->"}</Text>
            </View>
          </TouchableWithoutFeedback>
        )}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <Text style={styles.title}>{configJSON.termsCondsList}</Text>
        }
        ListFooterComponent={
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              testID="navigateEditBtn"
              onPress={() => this.navigateToTermsCondsEdit()}
              style={styles.button}
            >
              <Text style={styles.buttonLabel}>
                {configJSON.createTermsConds}
              </Text>
            </TouchableOpacity>
          </View>
        }
      />
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
    flex: 1,
    padding: 20,
    fontWeight: "600",
    fontSize: 22,
  },
  termsCondsTitle: {
    fontWeight: "600",
    marginBottom: 20,
    fontSize: 22,
  },
  scrollView: {
    height: "100%",
  },
  checkboxContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: "auto",
    marginBottom: 40,
    marginRight: 20,
  },
  termsCondsContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    padding: 20,
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

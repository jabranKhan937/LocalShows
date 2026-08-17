import React from "react";

// Customizable Area Start
import { StyleSheet, Text, View } from "react-native";
import moment from "moment";
import { FlatList } from "react-native-gesture-handler";
// Customizable Area End

import TermsConditionsUsersController, {
  Props,
  configJSON,
} from "./TermsConditionsUsersController";

export default class TermsConditionsUsers extends TermsConditionsUsersController {
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
      <FlatList
        testID="termsCondsUserList"
        data={this.state.termsCondsUserList}
        renderItem={({ item }) => (
          <View style={styles.textContainer}>
            <Text style={styles.text}>{item.email}</Text>
            <Text style={styles.centralText}>
              {moment(item.accepted_on).format(configJSON.dateFormat)}
            </Text>
            <Text style={styles.text}></Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <Text style={styles.title}>{configJSON.termsCondsUserList}</Text>
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
    padding: 16,
    marginLeft: "auto",
    marginRight: "auto",
    width: "100%",
    maxWidth: 650,
    backgroundColor: "#ffffffff",
  },
  title: {
    padding: 20,
    fontWeight: "600",
    fontSize: 22,
  },
  textContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    padding: 20,
  },
  text: {
    flex: 1,
  },
  centralText: {
    flex: 1,
    marginHorizontal: 10,
    textAlign: "center",
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

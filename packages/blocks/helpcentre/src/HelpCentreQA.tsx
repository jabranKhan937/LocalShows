import React from "react";

import {
  StyleSheet,
  Dimensions,
  // Customizable Area Start
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  TouchableWithoutFeedback
  // Customizable Area End
} from "react-native";




const Height = Dimensions.get("window").height;

import HelpCentreController, { Props } from "./HelpCentreController";

import { FlatList } from "react-native-gesture-handler";

// Customizable Area Star 
// Customizable Area End

export default class HelpCentreQA extends HelpCentreController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }

  // Customizable Area Start
  renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.header} testID="testButton">
      <Text style={styles.listItem}>
        {item && item.attributes && item.attributes.que_type
          ? item.attributes.que_type
          : ""}
      </Text>
      <Text style={styles.answerItem}>
        {item && item.attributes && item.attributes.answer
          ? item.attributes.answer
          : ""}
      </Text>
    </TouchableOpacity>
  )
  // Customizable Area End

  render() {
    return (
      //Merge Engine DefaultContainer
      <ScrollView keyboardShouldPersistTaps="always" style={styles.containerQA}>
        <TouchableWithoutFeedback
          testID="hideKeyboardButton"
          onPress={() => {
            this.hideKeyboard();
          }}
        >
          {/* Customizable Area Start */}
          {/* Merge Engine UI Engine Code */}
          <View style={{ height: Height }}>
            <View testID="testView">
              <FlatList
                data={this.state.dataQA}
                renderItem={this.renderItem}
              />
            </View>
          </View>
          {/* Merge Engine UI Engine Code */}
          {/* Customizable Area End */}
        </TouchableWithoutFeedback>
      </ScrollView>
      //Merge Engine End DefaultContainer
    );
  }
}

// Customizable Area Start
const styles = StyleSheet.create({
  containerQA: {
    flex: 1,
    paddingVertical: 16,
    marginLeft: "auto",
    marginRight: "auto",
    width: "100%",
    maxWidth: 650,
    backgroundColor: "#FFF",
    height: "100%"
  },
  listItem: {
    color: "#252837",
    fontSize: 17,
    fontWeight: "700"
  },
  answerItem: {
    fontWeight: "500",
    color: "#252837",
    fontSize: 15,
    opacity: 0.6,
    marginTop: 3,
    textAlign: "justify"
  },
  header: {
    paddingHorizontal: 25,
    paddingVertical: 15
  }
});
// Customizable Area End

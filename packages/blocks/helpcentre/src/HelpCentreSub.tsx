import React from "react";
// Customizable Area Start
import {
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  View,
  ScrollView,
  TouchableWithoutFeedback,
  Dimensions
} from "react-native";

const Height = Dimensions.get("window").height;

// Customizable Area End

import HelpCentreController, { Props } from "./HelpCentreController";
import { FlatList } from "react-native-gesture-handler";
import { triangle } from "./assets";

export default class HelpCentreSub extends HelpCentreController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }

  // Customizable Area Start
  renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      testID="testButton"
      style={styles.touchableOpacity}
      onPress={() =>
        this.gotoHelpCentreQA(
          item && item.attributes && item.attributes.que_type
            ? item.attributes.que_type
            : "",
          item &&
            item.attributes &&
            item.attributes.question_answers &&
            item.attributes.question_answers.data
            ? item.attributes.question_answers.data
            : null
        )
      }
    >
      <Text style={styles.textStyle}>
        {item && item.attributes && item.attributes.sub_type
          ? item.attributes.sub_type
          : ""}
      </Text>
      <Image style={styles.imageStyle} source={triangle} />
    </TouchableOpacity>
  )
  // Customizable Area End

  render() {
    return (
      //Merge Engine DefaultContainer
      <ScrollView keyboardShouldPersistTaps="always" style={styles.containerSub}>
        <TouchableWithoutFeedback
          testID="hideKeyboard"
          onPress={() => {
            this.hideKeyboard();
          }}
        >
          {/* Customizable Area Start */}
          <View style={{ height: Height }} testID="testView">
            <View>
              <FlatList
                // keyExtractor={item => item.id}
                data={this.state.dataSub}
                renderItem={this.renderItem}
              />
            </View>
          </View>
          {/* Customizable Area End */}
        </TouchableWithoutFeedback>
      </ScrollView>
      //Merge Engine End DefaultContainer
    );
  }
}

// Customizable Area Start
const styles = StyleSheet.create({
  containerSub: {
    flex: 1,
    paddingVertical: 16,
    marginLeft: "auto",
    marginRight: "auto",
    width: "100%",
    maxWidth: 650,
    backgroundColor: "#FFF",
    height: "100%"
  },
  textStyle: {
    fontWeight: "500",
    color: "#252837",
    fontSize: 17
  },
  imageStyle: {
    width: 9,
    height: 15
  },
  touchableOpacity: {
    paddingHorizontal: 25,
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
});
// Customizable Area End

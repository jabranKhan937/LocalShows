/* eslint-disable prettier/prettier */
import React from "react";
// Customizable Area Start
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableWithoutFeedback,
  Platform,
  Dimensions,
  Button
} from "react-native";

const Height  = Dimensions.get("window").height;
// Customizable Area End

import CommentController, {
  Props,
  configJSON
} from "./CommentsController";

export default class CreateComment extends CommentController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }

  render() {
    // Customizable Area Start
    return (
      //Merge Engine DefaultContainer
      <ScrollView keyboardShouldPersistTaps="always" style={styles.container}>
        <TouchableWithoutFeedback
          onPress={() => {
            this.hideKeyboard();
          }}
        >
          {/* Customizable Area Start */}
          {/* Merge Engine UI Engine Code */}
          <View style={{height: Height - 200}}>
            {this.isPlatformWeb() ? (
              <Text
                testID="labelTitle" //Merge Engine::From BDS
                style={styles.title} //UI Engine::From Sketch
              >
                {configJSON.labelTitleText}
              </Text> //UI Engine::From Sketch
            ) : null}
          <View style={{height: Height - 260}}>

            <TextInput
              style={[styles.input, styles.border]}
              placeholder={'Write a comment...'}
              multiline={true}
              placeholderTextColor= {'#ddd'}
              // value={props.value}
              onChangeText={(text: string) => {this.setComment(text);}}
            />
            <View style={{position: 'absolute', width: '100%', bottom: 0}}>
              <Button onPress={() => {this.createComment();}} title={'Comment'} />
            </View>
          </View>


          </View>
          {/* Merge Engine UI Engine Code */}
          {/* Customizable Area End */}
        </TouchableWithoutFeedback>
      </ScrollView>
      //Merge Engine End DefaultContainer
    );
    // Customizable Area End
  }
}

// Customizable Area Start
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 19,
    marginLeft: "auto",
    marginRight: "auto",
    width: Platform.OS === "web" ? "75%" : "100%",
    maxWidth: 650,
    backgroundColor: "#ffffffff"
  },
  title: {
    marginBottom: 32,
    fontSize: 16,
    textAlign: "left",
    marginVertical: 8
  },
  images: {
    width: 90,
    height: 90,
    borderRadius: 10,
     marginBottom: '5%',
  },
  input: {
    width: '100%',
    paddingVertical: 10,
    borderBottomWidth: 1,
    color: '#252837',
    fontSize: 16,
    marginTop: 10
  },
  border: {
    borderBottomColor: '#eee',
  },
});
// Customizable Area End

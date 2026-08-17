import React from "react";
// Customizable Area Start
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  TouchableWithoutFeedback,
  FlatList,
  Platform,
} from "react-native";
// Customizable Area End

import CommentController, { Props, configJSON } from "./CommentsController";

export default class Comments extends CommentController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }

  // Customizable Area Start
  _renderComment = ({ item }: any) => (
    <View>
      <Text>Commet : {this.getCommentText(item.attributes.comment)}</Text>
      <Text>Created: {item.attributes.created_at}</Text>
      <Text>Updaed : {item.attributes.created_at}</Text>
      <Text>By User: {item.attributes.account.email}</Text>
      <Text>Liked : {item.attributes.liked ? "true" : "false"}</Text>
    </View>
  );
  // Customizable Area End

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
          <View>
            {this.isPlatformWeb() ? (
              <Text
                testID="labelTitle" //Merge Engine::From BDS
                style={styles.title} //UI Engine::From Sketch
              >
                {configJSON.labelTitleText}
              </Text> //UI Engine::From Sketch
            ) : null}

            <View>
              <TouchableOpacity
                testID={"btnCommentTxt"}
                style={styles.viewBtn}
                onPress={async () => {
                  this.props.navigation.navigate("CreateComment");
                }}
              >
                <Text style={styles.viewBtnText}>Add Comment</Text>
              </TouchableOpacity>

              {this.state.commentData && this.state.commentData.length > 0 ? (
                <FlatList
                  style={styles.list}
                  data={this.state.commentData}
                  keyExtractor={(item: any) => item.id}
                  ItemSeparatorComponent={() => {
                    return <View style={styles.separator} />;
                  }}
                  renderItem={(item) => this._renderComment(item)}
                />
              ) : null}
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
    backgroundColor: "#ffffffff",
  },
  title: {
    fontSize: 15,
    textAlign: "left",
    flexWrap: "wrap",
    width: "97%",
  },
  comment: {
    fontSize: 14,
    color: "#252837",
    paddingLeft: 5,
  },
  viewBtn: {
    backgroundColor: "blue",
    paddingVertical: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "blue",
  },
  viewBtnText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
  list: {
    marginTop: 15,
    marginBottom: 20,
    backgroundColor: "#FFFFFF",
  },
  separator: {
    marginTop: 10,
    marginBottom: 10,
  },
});
// Customizable Area End

import React from "react";
// Customizable Area Start
import {
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  View,
  ScrollView,
  FlatList,
  Platform,
  ActivityIndicator
} from "react-native";
import scale, { verticalScale } from "../../../components/src/Scale";
import PostCreationController from "./PostCreationController";
import { Props } from "./PostCreationCommonController";

export default class Posts extends PostCreationController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }

  renderListItem = (item: any) => {
    return (
      <View style={styles.listView}>
        <TouchableOpacity
          testID={"clickDetailsPost"}
          onPress={() => this.navigateToDetails(item.item)}
        >
          <View style={styles.CardContainer}>
            <View style={styles.imageOuterView}>
              <Image
                testID={"emailIconImage"}
                source={{ uri: item.item.data.attributes.product_image }}
                // source={IMG_CONST.bookImage}
                style={styles.ImageStyle}
              />
              <View style={styles.innerView}>
                <Text style={styles.nameText}>
                  {item.item.data.attributes.name}
                </Text>
                <Text style={styles.priceText}>
                  {item.item.data.attributes.currency}
                  {item.item.data.attributes.price}
                </Text>

                <Text style={styles.dateText}>
                  {item.item.data.attributes.created_at}
                </Text>
                <View style={styles.activeOuterView}>
                  <View style={styles.editDeleteView}>
                    <TouchableOpacity
                      testID={"clickEditPost"}
                      onPress={() => this.editNavigation(item.item)}
                    >
                      <Text style={styles.editText}> Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      testID={"clickDeletePost"}
                      onPress={() => {
                        this.deleteRecord(item.item.data.attributes.id);
                      }}
                    >
                      <Text>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };
  // Customizable Area End
  renderViewAll = () => {
    return (
      <View>
        <FlatList
          data={this.state.PostData}
          extraData={this.state}
          // refreshing={this.state.refresh}
          renderItem={(item: any) => this.renderListItem(item)}
        />
      </View>
    );
  };
  render() {
    if (this.state.refresh) {
      return <ActivityIndicator animating={true} size="large" />;
    } else {
      return (
        //Merge Engine DefaultContainer
        <ScrollView keyboardShouldPersistTaps="always" style={styles.container}>
          <TouchableOpacity
            testID={"clickAddPostCreation"}
            onPress={() => {
              this.getAllCategory();
            }}
            style={styles.buttonStyle}
          >
            <Text style={styles.buttonTextStyle}>Add new Post</Text>
          </TouchableOpacity>
          {this.renderViewAll()}
        </ScrollView>
        //Merge Engine End DefaultContainer
      );
    }
  }
}

// Customizable Area Start
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginLeft: "auto",
    marginRight: "auto",
    width: Platform.OS === "web" ? "75%" : "100%",
    maxWidth: 650,
    backgroundColor: "#f7f7f7"
  },
  CardContainer: {
    width: scale(381),
    backgroundColor: "white"
  },
  ImageStyle: {
    width: scale(86.3),
    height: verticalScale(86.2),
    marginTop: verticalScale(14.7),
    marginBottom: verticalScale(14.5),
    marginLeft: scale(12.2),
    resizeMode: "cover"
  },
  buttonStyle: {
    width: "100%",
    height: scale(50),
    backgroundColor: "#6200EE",
    marginBottom: verticalScale(15),
    borderRadius: 20
  },
  buttonTextStyle: {
    fontSize: scale(20),
    color: "white",
    alignSelf: "center",
    marginTop: verticalScale(10)
  },
  listView: {
    marginBottom: verticalScale(15)
  },
  imageOuterView: {
    flexDirection: "row"
  },
  innerView: {
    marginLeft: scale(14)
  },
  nameText: {
    fontSize: scale(14.7),
    color: "black",
    textAlign: "left",
    marginTop: verticalScale(16),
    marginBottom: verticalScale(9)
  },
  priceText: {
    fontSize: scale(14.2),
    color: "#366ef9",
    textAlign: "left",
    marginBottom: verticalScale(10.7)
  },
  dateText: {
    marginBottom: verticalScale(10.7),
    opacity: 0.8
  },
  activeView: {
    height: scale(17.7),
    width: scale(58),
    borderRadius: 10,
    backgroundColor: "#e3ebff"
  },
  activeText: {
    alignSelf: "center",
    fontSize: scale(10.5),
    marginVertical: scale(2)
  },
  editText: {
    marginRight: scale(13.7),
    color: "black"
  },
  editDeleteView: {
    flexDirection: "row"
  },
  activeOuterView: {
    flexDirection: "row",
    justifyContent: "space-between"
  }
});
// Customizable Area End

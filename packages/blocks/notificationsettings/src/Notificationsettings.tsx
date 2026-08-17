import React from "react";
// Customizable Area Start
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableWithoutFeedback,
  Platform
} from "react-native";
//@ts-ignore
import CustomCheckBox from "../../../components/src/CustomCheckBox";
// Customizable Area End

import NotificationsettingsController, {
  Props
} from "./NotificationsettingsController";

export default class Notificationsettings extends NotificationsettingsController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }

  // Customizable Area Start
  // Customizable Area End

  render() {
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
            {this.state.notificationData.map((item: any, index: number) => {
              return (
                <View key={index}>
                  <View style={styles.innerView}>
                    <Text
                      testID={"notification" + index} //Merge Engine::From BDS
                      style={styles.title} //UI Engine::From Sketch
                    >
                      {item.attributes.title}
                    </Text>
                    <CustomCheckBox
                      testID={"CustomCheckBox" + index} //Merge Engine::From BDS
                      isChecked={
                        item.attributes.state === "active" ? true : false
                      }
                      onChangeValue={() => {
                        this.setMainCheckBox(item);
                      }}
                    />
                  </View>
                  {item.attributes.state === "active" &&
                    item.attributes.notification_groups.data.map(
                      (groupitem: any, groupindex: number) => {
                        return (
                          <View key={groupindex}>
                            <View style={styles.innerView}>
                              <Text
                                testID={"notificationGroup1" + groupindex} //Merge Engine::From BDS
                                style={styles.title} //UI Engine::From Sketch
                              >
                                {groupitem.attributes.group_name}
                              </Text>
                              <CustomCheckBox
                                testID={"CustomCheckBox" + groupindex} //Merge Engine::From BDS
                                isChecked={
                                  groupitem.attributes.state === "active"
                                    ? true
                                    : false
                                }
                                onChangeValue={() => {
                                  this.setGroupCheckBox(
                                    index,
                                    groupindex,
                                    groupitem
                                  );
                                }}
                              />
                            </View>
                            {groupitem.attributes.state === "active" &&
                              groupitem.attributes.notification_subgroups.data.map(
                                (subgroupitem: any, subgroupindex: number) => {
                                  return (
                                    <View
                                      key={subgroupindex}
                                      style={styles.subInnerView}
                                    >
                                      <Text
                                        testID={
                                          "notificationSubGroup" + subgroupindex
                                        } //Merge Engine::From BDS
                                        style={styles.subTitle} //UI Engine::From Sketch
                                      >
                                        {subgroupitem.attributes.subgroup_name}
                                      </Text>
                                      <CustomCheckBox
                                        testID={
                                          "CustomCheckBox" + subgroupindex
                                        }
                                        isChecked={
                                          subgroupitem.attributes.state ===
                                          "active"
                                            ? true
                                            : false
                                        }
                                        onChangeValue={() => {
                                          this.setSubGroupCheckBox(
                                            subgroupitem
                                          );
                                        }}
                                      />
                                    </View>
                                  );
                                }
                              )}
                          </View>
                        );
                      }
                    )}
                </View>
              );
            })}
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
  container: {
    flex: 1,
    padding: 16,
    marginLeft: "auto",
    marginRight: "auto",
    width: Platform.OS === "web" ? "75%" : "100%",
    maxWidth: 650,
    backgroundColor: "#f7f9fa"
  },
  innerView: {
    flex: 1,
    padding: 16,
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 5,
    width: Platform.OS === "web" ? "75%" : "100%",
    maxWidth: 650,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#ffffffff"
  },
  subInnerView: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginLeft: "auto",
    marginRight: "auto",
    width: Platform.OS === "web" ? "75%" : "100%",
    maxWidth: 650,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#ffffffff"
  },
  title: {
    // marginBottom: 32,
    fontSize: 16,
    textAlign: "left",
    marginVertical: 4
  },
  subTitle: {
    // marginBottom: 32,
    fontSize: 14,
    textAlign: "left",
    marginVertical: 4
  },
  body: {
    marginBottom: 32,
    fontSize: 16,
    textAlign: "left",
    marginVertical: 8
  },
  bgPasswordContainer: {
    flexDirection: "row",
    backgroundColor: "#00000000",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderColor: "#767676",
    borderRadius: 2,
    padding: 10,
    borderWidth: Platform.OS === "web" ? 0 : 1
  },
  bgMobileInput: {
    flex: 1
  },
  showHide: {
    alignSelf: "center"
  },
  imgShowhide: Platform.OS === "web" ? { height: 30, width: 30 } : {}
});
// Customizable Area End

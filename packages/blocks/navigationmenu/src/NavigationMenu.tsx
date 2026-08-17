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
  Platform,
} from "react-native";
// Customizable Area End

import NavigationMenuController, {
  Props,
  configJSON,
} from "./NavigationMenuController";

export default class NavigationMenu extends NavigationMenuController {
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
      <ScrollView keyboardShouldPersistTaps="always" style={styles.container}>
        <TouchableWithoutFeedback
          onPress={() => {
            this.hideKeyboard();
          }}
        >
          {/* Customizable Area Start */}
          {/* Merge Engine UI Engine Code */}
          {this.props.drawerContent ? (
            <View>
              <View style={styles.userProfileWrapper}>
                <Image {...this.userProfileProps} style={styles.userProfile} />
                <Text style={styles.username}>{configJSON.userName}</Text>
                <Text style={styles.userDesignation}>
                  {configJSON.userDesignation}
                </Text>
                <TouchableOpacity>
                  <Text style={styles.logout}>{configJSON.logout}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.drawerItems}>
                {this.state.drawerItems?.length > 0 &&
                  this.state.drawerItems?.map((item: any) => {
                    let data = item?.data?.attributes;
                    if (data?.position !== "left") {
                      return null;
                    }
                    return (
                      <React.Fragment key={data?.id}>
                        {data?.items?.map((mItem: any) => {
                          return (
                            <TouchableOpacity
                              key={mItem?.id?.toString()}
                              style={styles.drawerItem}
                              onPress={() => this.onPressMenuItem(mItem)}
                            >
                              {/* <Image source={item.icon} style={styles.drawerItemIcon} /> */}
                              <Text style={styles.drawerItemTitle}>
                                {mItem?.name}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </React.Fragment>
                    );
                  })}
              </View>
            </View>
          ) : (
            <View style={styles.buttonWrapper}>
              <TouchableOpacity
                testID="btnOpenDrawer"
                onPress={() => this.props.navigation.openDrawer()}
              >
                <Text>{configJSON.openDrawerText}</Text>
              </TouchableOpacity>
            </View>
          )}
          {/* Merge Engine UI Engine Code */}
          {/* Customizable Area End */}
        </TouchableWithoutFeedback>
      </ScrollView>
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
    width: Platform.OS === "web" ? "75%" : "100%",
    maxWidth: 650,
    backgroundColor: "#ffffffff",
  },
  buttonWrapper: {
    flex: 1,
    alignItems: "center",
  },
  userProfileWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  userProfile: {
    height: 80,
    width: 80,
  },
  username: {
    fontSize: 18,
  },
  userDesignation: {
    fontSize: 14,
    color: "#ccc",
  },
  logout: {
    color: "#2196F3",
    marginTop: 10,
    fontWeight: "700",
  },
  drawerItems: {
    borderColor: "#ccc",
    borderTopWidth: 1,
    marginTop: 15,
    paddingTop: 10,
  },
  drawerItem: {
    flex: 1,
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  drawerItemIcon: {
    height: 20,
    width: 20,
    marginRight: 20,
  },
  drawerItemTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
});
// Customizable Area End

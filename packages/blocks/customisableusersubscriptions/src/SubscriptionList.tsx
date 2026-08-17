import React from "react";
// Customizable Area Start
// Customizable Area End
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ImageBackground
} from "react-native";
import CustomisableusersubscriptionsController, {
  Props,
  configJSON
} from "./CustomisableusersubscriptionsController";

export class SubscriptionListView extends CustomisableusersubscriptionsController {
  constructor(props: Props) {
    super(props);
  }

  // Customizable Area Start
  SubscriptionListItem = ({
    item,
    navigate
  }: {
    item: any;
    navigate: Function;
  }) => {
    return (
      <TouchableOpacity
        style={styles.subscriptionItemContainer}
        onPress={() =>
          navigate(configJSON.subscriptionDetailsScreenName, { data: item })
        }
        activeOpacity={0.7}
      >
        <ImageBackground
          style={styles.banner}
          source={{
            uri: configJSON.goldCoinImageUrl
          }}
        >
          <View style={styles.wrapperView}>
            <View style={styles.detailsView}>
              <View>
                <Text style={styles.nameText} numberOfLines={1}>
                  {item.attributes.name}
                </Text>
                <Text style={styles.dateText}>
                  Valid upto: {item.attributes.valid_up_to}
                </Text>
              </View>
              <Text style={styles.priceText}>
                {item.attributes.currencySymbol ?? configJSON.currencySymbol}
                {item.attributes.price ?? configJSON.zero}
              </Text>
            </View>
            {item.attributes.subscribed ? (
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.subscribedBtnView}
              >
                <Text style={styles.subscribeBtnText}>
                  {configJSON.subscribed}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.subscribeBtnView}
                onPress={() =>
                  this.gotoSubDetailScreen(item)
                }
              >
                <Text style={styles.subscribeBtnText}>
                  {configJSON.subscribe}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  };
  // Customizable Area End

  render() {
    return (
      // Customizable Area Start
      <View>
        {this.props.data && this.props.data.length > 0 ? (
          <FlatList
            style={{ marginTop: 20, paddingHorizontal: 10 }}
            data={this.props.data}
            showsVerticalScrollIndicator={false}
            //@ts-ignore
            renderItem={({ item }) => {
              return (
                <this.SubscriptionListItem
                  item={item}
                  navigate={this.props.navigation.navigate}
                />
              );
            }}
            keyExtractor={(item, index) => index.toString()}
          />
        ) : (
          <View>
            <Text>{configJSON.noSubscriptionAvailable}</Text>
          </View>
        )}
      </View>
      // Customizable Area End
    );
  }
}

const styles = StyleSheet.create({
  // Customizable Area Start
  container: {
    flex: 1,
    backgroundColor: "#f3f3f3"
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 20
  },
  leftHeaderView: {
    flexDirection: "row",
    alignItems: "center"
  },
  iconView: {
    paddingHorizontal: 5
  },
  backIcon: {
    width: 7,
    height: 14
  },
  myAdsText: {
    fontSize: 22,
    fontWeight: "600",
    marginLeft: 10
  },
  description: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 15
  },

  itemContainer: {
    flex: 1
  },
  banner: {
    width: "100%",
    height: 200,
    borderRadius: 10
  },
  wrapperView: {
    width: "100%",
    height: 200,
    justifyContent: "space-between",
    padding: 15
  },
  detailsView: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  priceText: {
    fontWeight: "600",
    color: "#fff",
    fontSize: 16
  },
  statusView: {
    borderRadius: 5,
    width: 61,
    justifyContent: "center",
    alignItems: "center",
    height: 20
  },
  approvedView: {
    backgroundColor: "#50cf54",
    borderRadius: 6
  },
  rejectedView: {
    backgroundColor: "#bd3e40",
    borderRadius: 6
  },
  pendingView: {
    backgroundColor: "#e89e16"
  },
  subscriptionItemContainer: {
    width: "100%",
    marginBottom: 15
  },
  statusText: {
    fontSize: 10,
    color: "#fff"
  },
  nameText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
    marginVertical: 5,
    width: 240
  },
  dateText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "600"
  },
  subscribeBtnView: {
    alignSelf: "flex-end",
    borderColor: "#fff",
    borderWidth: 1,
    paddingHorizontal: 30,
    paddingVertical: 12
  },
  subscribeBtnText: {
    color: "#fff",
    fontWeight: "600"
  },
  subscribedBtnView: {
    alignSelf: "flex-end",
    backgroundColor: "#e89e16",
    paddingHorizontal: 30,
    paddingVertical: 12
  }
  // Customizable Area End
});

// Customizable Area Start
// Customizable Area End

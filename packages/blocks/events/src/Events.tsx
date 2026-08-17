import React from "react";
// Customizable Area Start
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StatusBar,
  ImageBackground,
  SafeAreaView,
} from "react-native";

import styles from "./EventsStyle";
import { forwardIcon } from "./assets";
import scale, { verticalScale } from "../../../components/src/Scale";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
// Customizable Area End

import EventsController, { Props } from "./EventsController";

export default class Events extends EventsController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }

  // Customizable Area Start
  renderMaps = () => {
    return (
      <View
        style={{
          marginTop: verticalScale(27),
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <MapView
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={{ height: scale(200), width: scale(300) }}
          region={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}
        >
          <Marker
            draggable
            coordinate={{
              latitude: 37.78825,
              longitude: -122.4324,
            }}
            // onDragEnd={(e) => this.setState({ x: e.nativeEvent.coordinate })}
          />
        </MapView>
      </View>
    );
  };

  renderEventCellContainer = (item: any) => {
    return (
      <TouchableOpacity
        testID={"btnEventItem"}
        style={styles.eventCellView}
        onPress={() =>
          this.setState({ isShowMap: false }, () =>
            this.props.navigation.navigate("AddEventDetailScreen", {
              event: item.buttonTitle,
            })
          )
        }
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image
            style={styles.eventCellImage}
            source={item.image}
            resizeMode="contain"
          />
          <Text
            style={[
              styles.eventCellText,
              { marginLeft: scale(item.leftMargin) },
            ]}
          >
            {item.buttonTitle}
          </Text>
        </View>
        <Image style={styles.forwardBtn} source={forwardIcon} />
      </TouchableOpacity>
    );
  };

  renderEventListContainer = () => {
    return (
      <View
        style={{
          flex: 1,
          marginTop: verticalScale(10),
          marginBottom: verticalScale(20),
        }}
      >
        <FlatList
          data={this.state.flatlistdata}
          renderItem={({ item }) => this.renderEventCellContainer(item)}
        />
      </View>
    );
  };
  // Customizable Area End

  render() {
    // Customizable Area Start
    return (
      <View style={styles.container}>
        <SafeAreaView style={{ flex: 1 }}>
          {/* <StatusBar hidden /> */}
          {this.state.isShowMap ? this.renderMaps() : null}
          {this.renderEventListContainer()}
        </SafeAreaView>
      </View>
    );
    // Customizable Area End
  }
  // Customizable Area Start
  // Customizable Area End
}

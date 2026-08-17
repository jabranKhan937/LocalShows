import React from "react";
// Customizable Area Start
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollViewBase,
} from "react-native";

import { locationTarget } from "./assets";
import { StyleSheet } from "react-native";
import scale, { verticalScale } from "../../../components/src/Scale";
import Loader from "../../../components/src/Loader";
import { clear } from "./assets";
//@ts-ignore
import _ from "lodash";

import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
// Customizable Area End

import AddEventLocationController, {
  Props,
} from "./AddEventLocationController";

export default class AddEventLocation extends AddEventLocationController {
  // Customizable Area Start
  onChangeTextDelayed: _.DebouncedFunc<(text: any) => void>;
  // Customizable Area End
  constructor(props: Props) {
    super(props);
    this.onChangeTextDelayed = _.debounce(this.onChangeText, 2000);
    // Customizable Area Start
    // Customizable Area End
  }

  // Customizable Area Start
  // Customizable Area End

  async componentDidMount() {
    // Customizable Area Start
    this.requestLocationPermission();
    const { params } = this.props.navigation.state;
    if (params != null && params.from != null) {
      this.setState({ from: params.from });
    }
    // Customizable Area End
  }

  renderMap = () => {
    return (
      <MapView
        style={{ flex: 0.9, margin: scale(18)}}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        followsUserLocation={true}
        showsPointsOfInterest={true}
        showsCompass={true}
        region={{
          latitude: Number(this.state.lat),
          longitude: Number(this.state.lng),
          latitudeDelta: 0.04864195044303443,
          longitudeDelta: 0.040142817690068,
        }}
      >
        {!!this.state.lat && !!this.state.lng && (
          <Marker
            coordinate={{
              latitude: Number(this.state.lat),
              longitude: Number(this.state.lng),
            }}
            title={this.state.searchLocation}
            pinColor={"#FF8C00"}
          />
        )}
      </MapView>
    );
  };

  renderSearchedLocations = () => {
    if (this.state.searchedLocationData.length > 0) {
      return (
        <View
          style={{
            position: "absolute",
            top: 80,
            left: 0,
            right: 0,
            backgroundColor: "rgba(0,0,0,0.9)",
            height: 200,
            borderRadius: 20,
            marginHorizontal: 20,
          }}
        >
          <FlatList
            style={{ marginVertical: 10 }}
            data={this.state.searchedLocationData}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => this.renderSearchedLocationList(item)}
          />
        </View>
      );
    } else {
      <View style={{ height: 0, width: 0 }} />;
    }
  };

  _onLocationClicked = async (item: any) => {
    this.setState({
      searchLocation: item.description,
      searchedLocationData: [],
    });

    console.log(item.place_id);

    await this.getLatlongFromSelectedPlace(item.place_id);
  };

  renderSearchedLocationList = (item: any) => {
    return (
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: 15,
        }}
        onPress={() => this._onLocationClicked(item)}
      >
        <Text
          style={{ marginLeft: 10, fontSize: 14, color: "white", padding: 5 }}
        >
          {item.description}
        </Text>
      </TouchableOpacity>
    );
  };

  clearAddress = () => {
    this.setState({ searchLocation: "", searchedLocationData: [] });
  };

  render() {
    // Customizable Area Start
    return (
      <View
        style={{ flex: 1 }}
      >
        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#1a1a1a",
              width: "85%",
              marginLeft: 20,
              marginTop: 30,
              borderRadius: scale(20),
            }}
          >
            <TextInput
              style={styles.titleinput}
              placeholderTextColor="#ffffff"
              placeholder="Search"
              value={this.state.searchLocation}
              onChangeText={(text) => this.onChangeText(text)}
            />
            {this.state.searchLocation ? (
              <TouchableOpacity
                style={{
                  width: 20,
                  height: 20,
                  position: "absolute",
                  right: 10,
                }}
                onPress={() => this.clearAddress()}
              >
                <Image source={clear} style={{ width: 20, height: 20 }} />
              </TouchableOpacity>
            ) : null}
          </View>
          <TouchableOpacity
            style={{
              marginTop: 30,
              justifyContent: "center",
              marginLeft: scale(5),
            }}
            onPress={() => this.onRegionChanged()}
          >
            <Image source={locationTarget} style={{ width: 20, height: 20 }} />
          </TouchableOpacity>
        </View>
        {this.renderMap()}
        {this.renderSearchedLocations()}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => this._saveLocationClicked()}
        >
          {this.state.loading ? (
            <Loader loading={this.state.loading} />
          ) : (
            <Text style={styles.saveText}>SAVE</Text>
          )}
        </TouchableOpacity>
      </View>
    );
    // Customizable Area End
  }
}

// Customizable Area Start
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000000",
    flex: 1,
  },
  header: {
    marginTop: verticalScale(59),
    paddingHorizontal: scale(23),
    justifyContent: "space-between",
    flexDirection: "row",
  },
  backBtn: {
    marginTop: verticalScale(3),
    width: scale(17),
    height: scale(24),
  },
  addEventText: {
    color: "#ffffff",
    fontSize: scale(20),
    alignSelf: "center",
    fontWeight: "700",
  },
  logoImage: {
    width: scale(29),
    height: scale(21),
    marginTop: verticalScale(4),
  },
  eventCellView: {
    width: scale(329),
    height: scale(41),
    borderRadius: scale(21),
    backgroundColor: "#1a1a1a",
    marginTop: verticalScale(15),
    marginLeft: scale(23),
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  eventCellText: {
    fontSize: scale(14),
    color: "#ffffff",
    textAlign: "left",
  },
  eventCellImage: {
    width: scale(24),
    height: scale(20),
    marginLeft: scale(19),
  },
  forwardBtn: {
    width: scale(11),
    height: scale(15),
    marginRight: scale(20),
  },

  titleinput: {
    fontSize: scale(14),
    color: "#ffffff",
    paddingLeft: scale(8),
    width: "90%",
    height: scale(41),
    borderRadius: scale(21),
    flexDirection: "row",
  },
  saveButton: {
    width: "80%",
    height: scale(42),
    borderRadius: scale(21),
    backgroundColor: "#45ebe1",
    marginBottom: verticalScale(15),
    marginTop: verticalScale(10),
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },

  saveText: {
    color: "#000000",
    fontWeight: "bold",
    fontSize: scale(16),
  },
});
// Customizable Area Emd

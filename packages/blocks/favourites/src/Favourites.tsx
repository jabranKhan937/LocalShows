import React from "react";
// Customizable Area Start
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Modal,
  Platform,
} from "react-native";
// Customizable Area End

import { Props, configJSON } from "./FavouritesController";

import FavouritesController from "./FavouritesController";

export default class Favourites extends FavouritesController {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      //Merge Engine DefaultContainer
      <ScrollView style={styles.container}>
        {/* Customizable Area Start */}
        <View
          style={this.state.isVisible ? styles.modalBox : styles.modalBoxHidden}
        >
          <Modal
            animationType={"fade"}
            transparent={false}
            visible={this.state.isVisible}
          >
            <View style={styles.modal}>
              <ScrollView>
                <Text style={styles.infoText}>
                  <Text style={styles.labelText}>Id:{"  "}</Text>
                  {this.state.activeId}
                </Text>
                <Text numberOfLines={2} style={styles.infoText}>
                  <Text style={styles.labelText}>Type:{"  "}</Text>
                  {this.state.favouriteType}
                </Text>
                <Text numberOfLines={2} style={styles.infoText}>
                  <Text style={styles.labelText}>Value:{"  "}</Text>
                  {this.state.favouriteId}
                </Text>
                <Text style={styles.infoText}>
                  <Text style={styles.labelText}>Created At:{"  "}</Text>
                  {this.state.activeCreatedAt}
                </Text>
                <Text style={styles.infoText}>
                  <Text style={styles.labelText}>Updated At:{"  "}</Text>
                  {this.state.activeUpdatedAt}
                </Text>
              </ScrollView>
              <View style={styles.buttonBox}>
                <TouchableOpacity
                  testID={"btnDeleteFavorite"}
                  style={[styles.viewBtn, styles.viewBtnWidth]}
                  onPress={() => {
                    this.deleteFavorite(this.state.activeId);
                  }}
                >
                  <Text style={styles.viewBtnText}>delete</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  testID={"btnCloseFavorite"}
                  style={[styles.viewBtnWidth, styles.closeBtn]}
                  onPress={() => {
                    this.hideModal();
                  }}
                >
                  <Text style={styles.closeBtnText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
        <View style={{ display: this.state.isVisible ? "none" : "flex" }}>
          <TouchableOpacity
            testID={"btnAddFavouritesTxt"}
            style={styles.addBtn}
            onPress={() => {
              this.addFavourites();
            }}
          >
            <Text style={styles.addtext}>Add Favorite</Text>
          </TouchableOpacity>

          {this.state.favourites.map((item: any, index: number) => {
            return (
              <View key={index} style={styles.tableBox}>
                <Text style={styles.infoText}>
                  <Text style={styles.labelText}>Id:{"  "}</Text>
                  {item.id}
                </Text>
                <Text style={styles.infoText}>
                  <Text style={styles.labelText}>Favorite Id:{"  "}</Text>
                  {item.attributes.favouriteable_id}
                </Text>
                <Text style={styles.infoText}>
                  <Text style={styles.labelText}>Value:{"  "}</Text>
                  {item.attributes.favouriteable_id}
                </Text>
                <TouchableOpacity
                  testID={"btnViewFavouritesTxt"}
                  style={styles.viewBtn}
                  onPress={() => {
                    this.setModal(item);
                  }}
                >
                  <Text style={styles.viewBtnText}>View</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
        {/* Customizable Area End */}
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
    backgroundColor: "#ffffffff",
  },
  tableBox: {
    borderWidth: 1,
    borderRadius: 4,
    borderColor: "#ccc",
    padding: 15,
    marginVertical: 10,
    marginBottom: 30,
  },
  webviewStyle: {
    height: 200,
  },
  infoText: {
    fontSize: 16,
    marginVertical: 4,
  },
  labelText: {
    fontWeight: "bold",
  },
  viewBtn: {
    backgroundColor: "blue",
    paddingVertical: 8,
    borderRadius: 4,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "blue",
  },
  viewBtnText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
  addBtn: {
    backgroundColor: "blue",
    marginBottom: 10,
    width: 80,
    height: 40,
    display: "flex",
    justifyContent: "center",
    borderRadius: 4,
    alignSelf: "flex-end",
  },
  addtext: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
  },
  buttonTop: {
    display: "flex",
    alignSelf: "flex-end",
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
  closeBtn: {
    backgroundColor: "#fff",
    paddingVertical: 8,
    borderRadius: 4,
    marginTop: 10,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  buttonBox: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalBoxHidden: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    display: "none",
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
  },
  modalBox: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    display: "flex",
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
  },
  modal: {
    width: "80%",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ccc",
    marginTop: 80,
    marginLeft: 40,
    padding: 15,
  },
  viewBtnWidth: {
    width: "48%",
  },
  closeBtnText: {
    color: "#000",
    textAlign: "center",
    fontSize: 16,
  },
});
// Customizable Area End

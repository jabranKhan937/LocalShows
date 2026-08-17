import React from "react";

import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableWithoutFeedback,
  Button,
  Platform
  // Customizable Area Start
  ,TouchableOpacity,
  FlatList,
  Image,
  TextInput,
  SafeAreaView,
  ActivityIndicator,
  // Customizable Area End
} from "react-native";

// Customizable Area Start
import { leftArrow, hamburger } from "../../events/src/assets";
import { defaultProfile } from "../../notifications/src/assets";
import { colors } from "../../utilities/src/Colors";
import { deviceHeight } from "../../../framework/src/Utilities";
import FastImage from "../../../components/src/SafeFastImage"
// Customizable Area End

import ShareController, { Props, configJSON } from "./ShareController";

export default class Share extends ShareController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }

  // Customizable Area Start
  renderUsersList = ({ item }: { item: any }) => {
    return (
      <View
       style={{ flexDirection: "row", marginBottom: 15, margin: 10 }} 
      >
          <TouchableOpacity 
          testID="ProfileNavBtn"
          onPress={() => {
            this.handleUserNavToProfile(item.attributes.current_user_id,item.attributes.account_type)
          }} style={styles.profileImgView}>
            <FastImage
              style={styles.profileImg}
              resizeMode={FastImage.resizeMode.cover}
              source={
                item.attributes.profile_image_url
                  ? {
                    uri: item.attributes.profile_image_url,
                    priority: FastImage.priority.high
                  } :
                  defaultProfile
              }
            />
          </TouchableOpacity>
        <TouchableOpacity
        style={{ flexDirection: "row", alignItems: "center",flex:1 }}
        testID="profile"
        onPress={() => {
          this.handleUserSelection(item.attributes.id);
        }}
        >
            <Text
            style={{
              fontSize: 14,
              fontWeight: "700",
              color: colors(false).text,
              marginLeft: 15,
            }}
          >
            {item.attributes.name}{" "}
          </Text>
 {item.attributes.is_selected && (
          <Image
            source={require("../../../mobile/assets/images/check_green_circle.png")}
            style={{
              marginLeft: 5,
              height: 15,
              width: 15,
              alignSelf: "center",
            }}
          />
        )}
        </TouchableOpacity>
       
      </View>
    );
  };

  renderEmptyComponent = () => {
    return (
      <View style={styles.emptyView}>
        <Text style={styles.emptyText}>{configJSON.noRecordFoundText}</Text>
      </View>
    );
  };
  // Customizable Area End

  render() {
    return (
      // Customizable Area Start

        <TouchableWithoutFeedback
          testID="KeaboardDismissBtn"
          onPress={() => {
            this.hideKeyboard();
          }}
        >
          {/* Customizable Area Start */}
          {/* Merge Engine UI Engine Code */}
      
           <SafeAreaView style={{flex:1, justifyContent:'space-between',  backgroundColor: "#ffffffff",}}>
          <View style={{
            paddingHorizontal:16
          }}>
          <View style={styles.header}>
                <TouchableOpacity
                  testID="backBtn"
                  onPress={() => this.props.navigation.goBack()}
                  style={{  }}
                >
                  <Image source={leftArrow} style={styles.backBtn} />
                </TouchableOpacity>
                <Text
                  style={styles.headerTitle}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {configJSON.shareEvent}
                </Text>
                <TouchableOpacity
                  testID="hamburgerBtn"
                  onPress={() => {this.props.navigation.openDrawer()}}
                  style={{ flex: 0.1 }}
                >
                    <Image style={{ height: 20, width: 20, resizeMode: 'contain' }}
                  source={require('../../../mobile/assets/images/Vector.png')} />
                </TouchableOpacity>
              </View>
              <View style={styles.inputContainer}>
                <Image
                  source={require("../../../mobile/assets/images/image_search.png")}
                  style={{ height: 20, width: 20, resizeMode: "contain" }}
                />
                <TextInput
                  testID="searchTxt"
                  style={styles.input}
                  placeholderTextColor="#334166"
                  placeholder="Search"
                  value={this.state.searchInput}
                  onChangeText={(value: string) => this.handleSearch(value)}
                />
              </View>
          </View>
          <FlatList
                testID="usersList"
                data={
                  "" === this.state.searchInput
                    ? this.state.userList
                    : this.state.filteredList
                }
                renderItem={this.renderUsersList}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={this.renderEmptyComponent}
                contentContainerStyle={{
                  paddingHorizontal:16
                }}
              />
            <TouchableOpacity
              testID="btnShare"
              style={[styles.shareBtn, {opacity: this.state.userList.filter(item => item.attributes.is_selected === true).length ? 1 : 0.5}]}
              disabled={!this.state.userList.filter(item => item.attributes.is_selected === true).length}
              onPress={() => {
                this.shareEvent();
              }}
            >
              <Text style={[styles.text, styles.shareTxt]}>
                {configJSON.share}
              </Text>
            </TouchableOpacity>
            {this.state.fetching &&
              <View style={styles.fetchContainer}>
                <ActivityIndicator size={'large'} color="#4949EE"/>
              </View>
            }
           </SafeAreaView>
          {/* Merge Engine UI Engine Code */}
          {/* Customizable Area End */}
        </TouchableWithoutFeedback>
      
      // Customizable Area End
    );
  }
}

// Customizable Area Start
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffffff",
  },
  containerView: {
    width: "100%",
    maxWidth: 650,
    backgroundColor: "#ffffffff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop:5
  },
  backBtn: {
    width: 12,
    resizeMode: "contain",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#334155",
    paddingHorizontal: 10,
    textAlign: "center",
  },
  hamburger: {
    width: 25,
    height: 16,
    resizeMode: "contain",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 15,
    paddingVertical: 2,
    paddingHorizontal: 8,
    margin: 10,
    marginVertical: 20,
    backgroundColor: "#E2E8F0",
  },
  input: {
    flex: 1,
    height: 47,
    fontSize: 18,
    marginLeft: 10,
    color: "#334166",
  },
  profileImgView: {
    width: 50,
    height: 50,
    borderRadius: 50,
    overflow: "hidden",
    borderColor: "#C5C5FF",
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  profileImg: {
    width: 50,
    height: 50,
  },
  emptyView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 200,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: "400",
    color: "#334155",
  },
  shareBtn: {
    backgroundColor: "#3333CC",
    padding: 15,
    borderRadius: 10,
    margin: 16,
    width: "95%",
    alignSelf: "center",
  },
  shareTxt: {
    color: colors(false).white,
    fontWeight: "700",
    fontSize: 18,
    alignSelf: "center",
  },
  text: {
    fontFamily: "OpenSans",
    alignSelf: "flex-start",
    color: colors(false).text,
  },
  fetchContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#ffffffdd',
    alignItems: "center",
    justifyContent: "center",
  },
});
// Customizable Area End

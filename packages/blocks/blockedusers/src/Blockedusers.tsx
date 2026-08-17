import React from "react";
// Customizable Area Start
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Platform,
  Image,
  TextInput,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  FlatList
} from "react-native";
import { colors } from "../../utilities/src/Colors";
import FastImage from "../../../components/src/SafeFastImage";
import { defaultProfile,leftArrow, search, Vector } from "./assets";
// Customizable Area End

import{
  Props,
  configJSON
} from "./BlockedusersController";

import BlockedusersController from "./BlockedusersController";

export default class Blockedusers extends BlockedusersController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }

  // Customizable Area Start
  renderBlockHeader = () => {
    return (
      <View style={styles.header1}>
        <TouchableOpacity
          testID="backBtn"
          style={styles.backButton1}
          onPress={() => {
            this.props.navigation.goBack();
          }}
        >
          <Image source={leftArrow} style={styles.backIcon1} />
        </TouchableOpacity>
        <Text style={styles.titleHeader1}>blocked ({this.state.Blockeduser?.length ?? 0})</Text>
        <TouchableOpacity testID="hamburgerBtn" onPress={() => { this.props.navigation.openDrawer() }}>
          <Image style={styles.iconSty} source={Vector} />
        </TouchableOpacity>
      </View>
    )
  }
  renderSearchUser= () => {
    return (
      <View style={styles.TextinputContainer}>
        <Image
          source={search}
          style={styles.iconSty} />
        <TextInput
          testID="searchBlockUserTxt"
          style={styles.inputSty}
          placeholderTextColor="#334166"
          placeholder="Search"
          value={this.state.searchText}
          onChangeText={(text) => this.handleBlockUserSearch(text)} 
          />
      </View>
    )
  }
  renderUnblockBtn = (id: string) => {
    return (
      <TouchableOpacity
        testID="unblockBtn"
        style={styles.unBlockBtn}
        activeOpacity={1}
        onPress={() => this.deleteBlockeduser(id)}
        >
        <Text style={styles.removeBlock}>{configJSON.unblockLabel}</Text>
      </TouchableOpacity>
    )
  }
  renderListEmptyComponent = () => {
    return (
      <View style={styles.emptyComponentView1}>
        <Text style={styles.emptyComponentText1}>
          {configJSON.noblockRecordFoundText}
        </Text>
      </View>
    )
  }
  renderProfile = (item: any) => {
    return (
      <TouchableOpacity
        testID="profile"
        style={styles.blockedProfile}
        activeOpacity={1}
        onPress={() => {
        }}>
        <View style={styles.blockedProfileView}>
          <FastImage
            source={item.attributes.block_user.attributes.profile_image ?
              {
                uri: item.attributes.block_user.attributes.profile_image,
                priority: FastImage.priority.high
              } :
              defaultProfile
            }
            style={styles.blockedProfileImage}
            resizeMode={FastImage.resizeMode.cover}
          />
        </View>
        <Text style={styles.blockedNameTxt}>{item.attributes.block_user.attributes?.first_name } </Text>
      </TouchableOpacity>
    )
  }
  // Customizable Area End

  render() {
    return (
      //Merge Engine DefaultContainer
      <ScrollView style={styles.container}>
      {/* Customizable Area Start */}
        <SafeAreaView style={styles.safeareaContainer}>
        <StatusBar backgroundColor="white" barStyle="light-content" />
        {
        this.state.isLoading ?
          <View style={styles.loadingContainer1}>
            <ActivityIndicator size={'large'} color="black" />
          </View>
          :
          <View style={{}}>
            {this.renderBlockHeader()}
            {this.renderSearchUser()}

            <FlatList
              testID="blockedList"
              data={this.state.searchText === "" ? this.state.Blockeduser : this.state.filteredList}
              renderItem={({ item }) => {
                return (
                  <View style={styles.itemList}>
                    {this.renderProfile(item)}
                    {this.renderUnblockBtn(item.id)}
                  </View>
                )
              }}
              keyExtractor={item => item.id}
              ListEmptyComponent={this.renderListEmptyComponent}
            />
          </View>
        }
      </SafeAreaView>
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
     backgroundColor: "#ffffffff"
  },
  safeareaContainer: {
    flex: 1,
    marginLeft: "auto",
    marginRight: "auto",
    width: "100%",
    maxWidth: 650,
    backgroundColor: "#ffffffff",
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 5
  },
  header1: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  backButton1: {
    width:20
  },
  backIcon1: {
    width: 12,
    left: 0,
    resizeMode: "contain",
  },
  titleHeader1: {
    fontWeight: "700",
    fontSize: 24,
    color: colors(false).text,
  },
  iconSty: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
  },
  TextinputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 15,
    paddingVertical: 2,
    paddingHorizontal: 8,
    margin: 10,
    backgroundColor: '#E2E8F0',
  },
  inputSty: {
    flex: 1,
    height: 47,
    fontSize: 18,
    marginLeft: 10,
    color: '#334166',
  },
  loadingContainer1: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#ffffffdd',
    alignItems: "center",
    justifyContent: "center",
  },
  unBlockBtn: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#EDEDFF',
    borderRadius: 10,
    width: '30%',
    height: 40,
    alignSelf: 'center',
  },
  removeBlock: {
    fontWeight: '700',
    fontSize: 14,
    color: "#3333CC",
    textAlign: 'center',
  },
  blockedProfile: {
    flexDirection: "row",
    flex: 0.5,
    alignItems: 'center',
  },
  blockedNameTxt: {
    fontSize: 14,
    fontWeight: '700',
    color: colors(false).text,
    marginLeft: 15,
  },
  blockedProfileView: {
    width: 50,
    height: 50,
    borderRadius: 50,
    overflow: 'hidden',
    borderColor: '#C5C5FF',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blockedProfileImage: {
    width: 50,
    height: 50,
  },
  itemList: {
    flexDirection: "row",
    justifyContent: 'space-between',
    marginBottom: 15,
    margin: 10,
  },
  emptyComponentView1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 200,
  },
  emptyComponentText1: {
    fontSize: 14,
    fontWeight: '400',
    color: "#334155",
  },
});
// Customizable Area End

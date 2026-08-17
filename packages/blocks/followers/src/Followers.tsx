import React from "react";

// Customizable Area Start
import {
  StyleSheet,
  StatusBar,
  SafeAreaView,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Text,
  TextInput,
  FlatList,
} from "react-native";
import { leftArrow } from "../../events/src/assets";
import { colors } from "../../utilities/src/Colors";
import { defaultProfile } from "../../notifications/src/assets";
import FastImage from "../../../components/src/SafeFastImage"
// Customizable Area End

import FollowersController, { Props, configJSON } from "./FollowersController";
import { hamburgerIcon } from "./assets";

export default class Followers extends FollowersController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }

  // Customizable Area Start
  renderHeader = () => {
    return (
      <View style={styles.header}>
        <TouchableOpacity
          testID="backBtn"
          style={styles.backButton}
          onPress={() => {
            this.props.navigation.goBack();
          }}
        >
          <Image source={leftArrow} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.titleHeader}>{this.state.type === 'following' ? configJSON.labelTitleTextFollowing : configJSON.labelTitleTextFollowers} ({this.state.followerFollowingList?.length ?? 0})</Text>
        <TouchableOpacity testID="hamburgerBtn" onPress={() => { this.props.navigation.openDrawer() }}>
          <Image style={styles.icon} source={require('../../../mobile/assets/images/Vector.png')} />
        </TouchableOpacity>
      </View>
    )
  }

  renderSearch = () => {
    return (
      <View style={styles.inputContainer}>
        <Image
          source={require('../../../mobile/assets/images/image_search.png')}
          style={styles.icon} />
        <TextInput
          testID="searchTxt"
          style={styles.input}
          placeholderTextColor="#334166"
          placeholder="Search"
          value={this.state.searchText}
          onChangeText={(text) => this.handleSearch(text)} />
      </View>
    )
  }

  renderListEmptyComponent = () => {
    return (
      <View style={styles.emptyComponentView}>
        <Text style={styles.emptyComponentText}>
          {configJSON.noRecordFoundText}
        </Text>
      </View>
    )
  }

  renderRemoveBtn = (id: string) => {
    return this.state.loginUserId === this.state.accountId ? (
      <TouchableOpacity
        testID="removeBtn"
        style={styles.removeBtn}
        activeOpacity={this.state.type === 'followers' ? 0 : 1}
        onPress={() => this.handleRemoveButton(id)}>
        <Text style={styles.removeFollowingTxt}>{this.state.type === 'following' ? configJSON.labelTitleTextFollowing : configJSON.remove}</Text>
      </TouchableOpacity>
    ) : null
  }

  renderProfile = (item: any) => {
    return (
      <TouchableOpacity
        testID="profile"
        style={styles.profile}
        activeOpacity={1}
        onPress={ () => {
          this.handleProfileNav(item)
        }}>
        <View style={styles.profileView}>
          <FastImage
            source={item.attributes.profile_image_url ?
              {
                uri: item.attributes.profile_image_url,
                priority: FastImage.priority.high
              } :
              defaultProfile
            }
            style={styles.profileImage}
            resizeMode={FastImage.resizeMode.cover}
          />
        </View>
        <Text style={styles.nameTxt}>{item.attributes.name ? item.attributes.name : ""} </Text>
      </TouchableOpacity>
    )
  }
  // Customizable Area End

  render() {
    // Customizable Area Start
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="white" barStyle="light-content" />
        {this.state.isLoading ?
          <View style={styles.loadingContainer}>
            <ActivityIndicator size={'large'} color="black" />
          </View>
          :
          <View style={{}}>
            {this.renderHeader()}
            {this.state.followerFollowingList && this.renderSearch()}

            <FlatList
              testID="followerFollowingList"
              data={this.state.searchText === "" ? this.state.followerFollowingList : this.state.filteredList}
              renderItem={({ item }) => {
                return (
                  <View style={styles.item}>
                    {this.renderProfile(item)}
                    {this.renderRemoveBtn(item.id)}
                  </View>
                )
              }}
              keyExtractor={item => item.id}
              ListEmptyComponent={this.renderListEmptyComponent}
            />
          </View>
        }
      </SafeAreaView>
    );
    // Customizable Area End
  }
}

// Customizable Area Start
const styles = StyleSheet.create({
  container: {
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
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#ffffffdd',
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  backButton: {
    width:20
  },
  backIcon: {
    width: 12,
    left: 0,
    resizeMode: "contain",
  },
  titleHeader: {
    fontWeight: "700",
    fontSize: 24,
    color: colors(false).text,
  },
  drawerIcon: {
    width: 25,
    height: 16,
    resizeMode: "contain",
    marginRight: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 15,
    paddingVertical: 2,
    paddingHorizontal: 8,
    margin: 10,
    backgroundColor: '#E2E8F0',
  },
  input: {
    flex: 1,
    height: 47,
    fontSize: 18,
    marginLeft: 10,
    color: '#334166',
  },
  profileView: {
    width: 50,
    height: 50,
    borderRadius: 50,
    overflow: 'hidden',
    borderColor: '#C5C5FF',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
  },
  emptyComponentView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 200,
  },
  emptyComponentText: {
    fontSize: 14,
    fontWeight: '400',
    color: "#334155",
  },
  removeBtn: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#EDEDFF',
    borderRadius: 10,
    width: '30%',
    height: 40,
    alignSelf: 'center',
  },
  icon: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
  },
  removeFollowingTxt: {
    fontWeight: '700',
    fontSize: 14,
    color: "#3333CC",
    textAlign: 'center',
  },
  profile: {
    flexDirection: "row",
    flex: 0.5,
    alignItems: 'center',
  },
  nameTxt: {
    fontSize: 14,
    fontWeight: '700',
    color: colors(false).text,
    marginLeft: 15,
  },
  item: {
    flexDirection: "row",
    justifyContent: 'space-between',
    marginBottom: 15,
    margin: 10,
  },
});
// Customizable Area End

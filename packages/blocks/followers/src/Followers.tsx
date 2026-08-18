import React from "react";

// Customizable Area Start
import {
  StyleSheet,
  StatusBar,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Text,
  TextInput,
  FlatList,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Feather";
import { DrawerActions } from "@react-navigation/native";
import {
  lightTheme,
  redesignTheme,
} from "../../utilities/src/Colors";
import FastImage from "../../../components/src/SafeFastImage";
// Customizable Area End

import FollowersController, { Props, configJSON } from "./FollowersController";

type FollowersTheme = typeof redesignTheme;

export default class Followers extends FollowersController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }

  // Customizable Area Start
  get styles() {
    return this.state.isDarkMode
      ? darkFollowersStyles
      : lightFollowersStyles;
  }

  renderHeader = () => {
    const theme = this.getFollowersTheme();
    const title =
      this.state.type === "following"
        ? configJSON.labelTitleTextFollowing
        : configJSON.labelTitleTextFollowers;
    return (
      <View style={this.styles.header}>
        <TouchableOpacity
          testID="backBtn"
          style={this.styles.headerCircleBtn}
          onPress={() => {
            this.props.navigation.goBack();
          }}
          activeOpacity={0.8}
        >
          <Icon name="arrow-left" size={18} color={theme.foreground} />
        </TouchableOpacity>
        <Text style={this.styles.titleHeader}>
          {`${title} (${this.state.followerFollowingList?.length ?? 0})`}
        </Text>
        <TouchableOpacity
          testID="hamburgerBtn"
          style={this.styles.headerCircleBtn}
          onPress={() => {
            if (this.props.navigation.openDrawer) {
              this.props.navigation.openDrawer();
            } else {
              this.props.navigation.dispatch(DrawerActions.openDrawer());
            }
          }}
          activeOpacity={0.8}
        >
          <Icon name="menu" size={18} color={theme.foreground} />
        </TouchableOpacity>
      </View>
    );
  };

  renderSearch = () => {
    const theme = this.getFollowersTheme();
    return (
      <View style={this.styles.inputContainer}>
        <Icon name="search" size={16} color={theme.muted} />
        <TextInput
          testID="searchTxt"
          style={this.styles.input}
          placeholderTextColor={theme.muted}
          placeholder="Search"
          value={this.state.searchText}
          onChangeText={(text) => this.handleSearch(text)}
        />
      </View>
    );
  };

  renderListEmptyComponent = () => {
    return (
      <View style={this.styles.emptyComponentView}>
        <Text style={this.styles.emptyComponentText}>
          {configJSON.noRecordFoundText}
        </Text>
      </View>
    );
  };

  renderRemoveBtn = (id: string) => {
    return this.state.loginUserId === this.state.accountId ? (
      <TouchableOpacity
        testID="removeBtn"
        style={this.styles.removeBtn}
        activeOpacity={this.state.type === "followers" ? 0 : 1}
        onPress={() => this.handleRemoveButton(id)}
      >
        <Text style={this.styles.removeFollowingTxt}>
          {this.state.type === "following"
            ? configJSON.labelTitleTextFollowing
            : configJSON.remove}
        </Text>
      </TouchableOpacity>
    ) : null;
  };

  renderProfile = (item: any) => {
    const theme = this.getFollowersTheme();
    const photoUri = (item.attributes.profile_image_url || "").trim();
    return (
      <TouchableOpacity
        testID="profile"
        style={this.styles.profile}
        activeOpacity={1}
        onPress={() => {
          this.handleProfileNav(item);
        }}
      >
        <View style={this.styles.profileView}>
          {photoUri ? (
            <FastImage
              source={{
                uri: photoUri,
                priority: FastImage.priority.high,
              }}
              style={this.styles.profileImage}
              resizeMode={FastImage.resizeMode.cover}
            />
          ) : (
            <Icon name="user" size={20} color={theme.muted} />
          )}
        </View>
        <Text style={this.styles.nameTxt}>
          {item.attributes.name ? item.attributes.name : ""}{" "}
        </Text>
      </TouchableOpacity>
    );
  };
  // Customizable Area End

  render() {
    // Customizable Area Start
    const theme = this.getFollowersTheme();
    return (
      <SafeAreaView style={this.styles.container} edges={["top"]}>
        <StatusBar
          backgroundColor={theme.background}
          barStyle={this.state.isDarkMode ? "light-content" : "dark-content"}
        />
        {this.state.isLoading ? (
          <View style={this.styles.loadingContainer}>
            <ActivityIndicator size={"large"} color={theme.primary} />
          </View>
        ) : (
          <View style={this.styles.content}>
            {this.renderHeader()}
            {this.state.followerFollowingList && this.renderSearch()}

            <FlatList
              testID="followerFollowingList"
              data={
                this.state.searchText === ""
                  ? this.state.followerFollowingList
                  : this.state.filteredList
              }
              renderItem={({ item }) => {
                return (
                  <View style={this.styles.item}>
                    {this.renderProfile(item)}
                    {this.renderRemoveBtn(item.id)}
                  </View>
                );
              }}
              keyExtractor={(item) => item.id}
              ListEmptyComponent={this.renderListEmptyComponent}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={this.styles.listContent}
            />
          </View>
        )}
      </SafeAreaView>
    );
    // Customizable Area End
  }
}

// Customizable Area Start
const createFollowersStyles = (theme: FollowersTheme) => {
  const isLightTheme = theme.background === lightTheme.background;
  return StyleSheet.create({
    container: {
      flex: 1,
      width: "100%",
      maxWidth: 650,
      alignSelf: "center",
      backgroundColor: theme.background,
    },
    content: {
      flex: 1,
    },
    loadingContainer: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: isLightTheme
        ? "rgba(255, 255, 255, 0.72)"
        : "rgba(8, 8, 15, 0.72)",
      alignItems: "center",
      justifyContent: "center",
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 16,
      height: 56,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.border,
      backgroundColor: theme.background,
    },
    headerCircleBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.input,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border,
      alignItems: "center",
      justifyContent: "center",
    },
    titleHeader: {
      fontWeight: "900",
      fontSize: 16,
      letterSpacing: 0.5,
      color: theme.foreground,
      textTransform: "uppercase",
      flex: 1,
      textAlign: "center",
      paddingHorizontal: 8,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 16,
      paddingVertical: 4,
      paddingHorizontal: 12,
      marginHorizontal: 16,
      marginTop: 16,
      marginBottom: 8,
      backgroundColor: theme.input,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border,
    },
    input: {
      flex: 1,
      height: 44,
      fontSize: 16,
      marginLeft: 10,
      color: theme.foreground,
    },
    profileView: {
      width: 44,
      height: 44,
      borderRadius: 22,
      overflow: "hidden",
      borderColor: theme.primary,
      borderWidth: 2,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: isLightTheme ? theme.input : theme.card,
    },
    profileImage: {
      width: 44,
      height: 44,
    },
    emptyComponentView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingTop: 48,
    },
    emptyComponentText: {
      fontSize: 14,
      fontWeight: "400",
      color: theme.muted,
    },
    removeBtn: {
      paddingVertical: 8,
      paddingHorizontal: 14,
      backgroundColor: theme.primarySoft,
      borderRadius: 10,
      minWidth: 96,
      height: 40,
      alignSelf: "center",
      justifyContent: "center",
    },
    removeFollowingTxt: {
      fontWeight: "700",
      fontSize: 14,
      color: theme.primary,
      textAlign: "center",
    },
    profile: {
      flexDirection: "row",
      flex: 1,
      alignItems: "center",
      paddingRight: 12,
    },
    nameTxt: {
      fontSize: 14,
      fontWeight: "700",
      color: theme.foreground,
      marginLeft: 12,
      flexShrink: 1,
    },
    item: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: theme.card,
      borderRadius: 16,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border,
      padding: 14,
      marginBottom: 12,
      ...Platform.select({
        ios: {
          shadowColor: isLightTheme ? "#000000" : "#FFFFFF",
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: isLightTheme ? 0.1 : 0.08,
          shadowRadius: 12,
        },
        android: {
          elevation: isLightTheme ? 4 : 3,
        },
      }),
    },
    listContent: {
      paddingHorizontal: 16,
      paddingBottom: 36,
      paddingTop: 8,
    },
  });
};

const darkFollowersStyles = createFollowersStyles(redesignTheme);
const lightFollowersStyles = createFollowersStyles(lightTheme);
// Customizable Area End

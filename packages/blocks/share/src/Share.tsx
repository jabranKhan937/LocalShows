import React from "react";

import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  // Customizable Area Start
  TouchableOpacity,
  FlatList,
  TextInput,
  StatusBar,
  ActivityIndicator,
  // Customizable Area End
} from "react-native";

// Customizable Area Start
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Feather";
import { defaultProfile } from "../../notifications/src/assets";
import { lightTheme, redesignTheme } from "../../utilities/src/Colors";
import FastImage from "../../../components/src/SafeFastImage";
// Customizable Area End

import ShareController, { Props, configJSON } from "./ShareController";

type ShareTheme = typeof redesignTheme;

export default class Share extends ShareController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }

  // Customizable Area Start
  get styles() {
    return this.state.isDarkMode ? darkShareStyles : lightShareStyles;
  }

  renderUsersList = ({ item }: { item: any }) => {
    const theme = this.getShareTheme();
    const selected = Boolean(item.attributes.is_selected);
    const photoUri =
      typeof item.attributes.profile_image_url === "string"
        ? item.attributes.profile_image_url.trim()
        : "";

    return (
      <View style={[this.styles.userRow, selected && this.styles.userRowSelected]}>
        <TouchableOpacity
          testID="ProfileNavBtn"
          onPress={() => {
            this.handleUserNavToProfile(
              item.attributes.current_user_id,
              item.attributes.account_type,
            );
          }}
          style={this.styles.profileImgView}
          activeOpacity={0.8}
        >
          {photoUri ? (
            <FastImage
              style={this.styles.profileImg}
              resizeMode={FastImage.resizeMode.cover}
              source={{
                uri: photoUri,
                priority: FastImage.priority.high,
              }}
            />
          ) : (
            <FastImage
              style={this.styles.profileImg}
              resizeMode={FastImage.resizeMode.cover}
              source={defaultProfile}
            />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={this.styles.userSelectBtn}
          testID="profile"
          onPress={() => {
            this.handleUserSelection(item.attributes.id);
          }}
          activeOpacity={0.8}
        >
          <Text style={this.styles.userName} numberOfLines={1}>
            {item.attributes.name}{" "}
          </Text>
          {selected && (
            <Icon name="check-circle" size={18} color={theme.primary} />
          )}
        </TouchableOpacity>
      </View>
    );
  };

  renderEmptyComponent = () => {
    return (
      <View style={this.styles.emptyView}>
        <Text style={this.styles.emptyText}>{configJSON.noRecordFoundText}</Text>
      </View>
    );
  };
  // Customizable Area End

  render() {
    const theme = this.getShareTheme();
    const hasSelection = this.state.userList.some(
      item => item.attributes.is_selected === true,
    );
    return (
      // Customizable Area Start
      <TouchableWithoutFeedback
        testID="KeaboardDismissBtn"
        onPress={() => {
          this.hideKeyboard();
        }}
      >
        <SafeAreaView style={this.styles.container} edges={["top"]}>
          <StatusBar
            barStyle={this.state.isDarkMode ? "light-content" : "dark-content"}
            backgroundColor={theme.background}
          />
          <View style={this.styles.header}>
            <TouchableOpacity
              testID="backBtn"
              onPress={() => this.props.navigation.goBack()}
              style={this.styles.headerCircleBtn}
              activeOpacity={0.8}
            >
              <Icon name="arrow-left" size={18} color={theme.foreground} />
            </TouchableOpacity>
            <Text
              style={this.styles.headerTitle}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {configJSON.shareEvent}
            </Text>
            <TouchableOpacity
              testID="hamburgerBtn"
              onPress={() => {
                this.props.navigation.openDrawer();
              }}
              style={this.styles.headerCircleBtn}
              activeOpacity={0.8}
            >
              <Icon name="menu" size={18} color={theme.foreground} />
            </TouchableOpacity>
          </View>
          <View style={this.styles.inputContainer}>
            <Icon name="search" size={16} color={theme.muted} />
            <TextInput
              testID="searchTxt"
              style={this.styles.input}
              placeholderTextColor={theme.muted}
              placeholder="Search"
              value={this.state.searchInput}
              onChangeText={(value: string) => this.handleSearch(value)}
            />
          </View>
          <FlatList
            testID="usersList"
            data={
              "" === this.state.searchInput
                ? this.state.userList
                : this.state.filteredList
            }
            extraData={`${this.state.isDarkMode}-${hasSelection}`}
            renderItem={this.renderUsersList}
            keyExtractor={item => item.id}
            ListEmptyComponent={this.renderEmptyComponent}
            contentContainerStyle={this.styles.listContent}
          />
          <TouchableOpacity
            testID="btnShare"
            style={[this.styles.shareBtn, { opacity: hasSelection ? 1 : 0.5 }]}
            disabled={!hasSelection}
            onPress={() => {
              this.shareEvent();
            }}
            activeOpacity={0.85}
          >
            <Text style={[this.styles.text, this.styles.shareTxt]}>
              {configJSON.share}
            </Text>
          </TouchableOpacity>
          {this.state.fetching && (
            <View style={this.styles.fetchContainer}>
              <ActivityIndicator size={"large"} color={theme.primary} />
            </View>
          )}
        </SafeAreaView>
      </TouchableWithoutFeedback>
      // Customizable Area End
    );
  }
}

// Customizable Area Start
const createShareStyles = (theme: ShareTheme) => {
  const isLightTheme = theme.background === lightTheme.background;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
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
    headerTitle: {
      flex: 1,
      fontSize: 18,
      fontWeight: "900",
      letterSpacing: 0.6,
      color: theme.foreground,
      textTransform: "uppercase",
      textAlign: "center",
      paddingHorizontal: 10,
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
    listContent: {
      paddingHorizontal: 16,
      paddingTop: 8,
      paddingBottom: 16,
      flexGrow: 1,
    },
    userRow: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.card,
      borderRadius: 16,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border,
      padding: 12,
      marginBottom: 12,
    },
    userRowSelected: {
      borderColor: theme.primary,
      backgroundColor: theme.primarySoft,
    },
    userSelectBtn: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    profileImgView: {
      width: 48,
      height: 48,
      borderRadius: 24,
      overflow: "hidden",
      borderColor: theme.primary,
      borderWidth: 2,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: isLightTheme ? theme.input : theme.card,
    },
    profileImg: {
      width: 48,
      height: 48,
    },
    userName: {
      flex: 1,
      fontSize: 15,
      fontWeight: "700",
      fontFamily: "OpenSans",
      color: theme.foreground,
      marginLeft: 12,
      marginRight: 8,
    },
    emptyView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingTop: 80,
    },
    emptyText: {
      fontSize: 14,
      fontWeight: "400",
      color: theme.muted,
    },
    shareBtn: {
      backgroundColor: theme.primary,
      padding: 16,
      borderRadius: 16,
      marginHorizontal: 16,
      marginBottom: 16,
      alignSelf: "stretch",
    },
    shareTxt: {
      color: "#FFFFFF",
      fontWeight: "700",
      fontSize: 18,
      alignSelf: "center",
    },
    text: {
      fontFamily: "OpenSans",
      alignSelf: "flex-start",
      color: theme.foreground,
    },
    fetchContainer: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: isLightTheme
        ? "rgba(255, 255, 255, 0.72)"
        : "rgba(8, 8, 15, 0.72)",
      alignItems: "center",
      justifyContent: "center",
    },
  });
};

const darkShareStyles = createShareStyles(redesignTheme);
const lightShareStyles = createShareStyles(lightTheme);
// Customizable Area End

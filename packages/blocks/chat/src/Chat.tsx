import React from "react";

// Customizable Area Start
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  Image,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  ActivityIndicator,
  Dimensions,
  Modal,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SwipeListView } from "react-native-swipe-list-view";
import Icon from "react-native-vector-icons/Feather";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FastImage from "../../../components/src/SafeFastImage";
import { lightTheme, redesignTheme } from "../../utilities/src/Colors";
import { getStorageData } from "../../../framework/src/Utilities";
// Customizable Area End

import ChatController from "./ChatController";

type ChatTheme = typeof redesignTheme;

export default class Chat extends ChatController {
  // Customizable Area Start
  get styles() {
    return this.state.isDarkMode ? darkChatStyles : lightChatStyles;
  }

  renderUserAvatar = (imageUri?: string | null, size?: number) => {
    const theme = this.getChatTheme();
    const photoUri = typeof imageUri === "string" ? imageUri.trim() : "";
    const avatarSize = size || 48;
    if (photoUri) {
      return (
        <FastImage
          source={{
            uri: photoUri,
            priority: FastImage.priority.high,
          }}
          resizeMode={FastImage.resizeMode.cover}
          style={[
            this.styles.userAvatar,
            { height: avatarSize, width: avatarSize, borderRadius: avatarSize / 2 },
          ]}
        />
      );
    }
    return (
      <View
        style={[
          this.styles.userAvatarPlaceholder,
          { height: avatarSize, width: avatarSize, borderRadius: avatarSize / 2 },
        ]}
      >
        <Icon name="user" size={Math.round(avatarSize * 0.42)} color={theme.muted} />
      </View>
    );
  };

  renderArchivedText = () => {
    const theme = this.getChatTheme();
    return (
      <>
        {!this.state.archiveSelected &&
          this.state.archiveList.length !== 0 && (
            <TouchableOpacity
              testID="archivedTxt"
              style={this.styles.archivedRow}
              onPress={() => this.setState({ archiveSelected: true })}
            >
              <View style={this.styles.archivedIconWrap}>
                <Icon name="archive" size={18} color={theme.primary} />
              </View>
              <Text style={this.styles.archivedLabel}>Archived</Text>
              <Icon name="chevron-right" size={18} color={theme.muted} />
            </TouchableOpacity>
          )}
      </>
    );
  };

  renderLastMessage = (message: any) => {
    if (message.eventable && message.message_type === "event") {
      return (
        <View style={this.styles.lastMessageRow}>
          <FastImage
            source={{ uri: message.eventable.image }}
            resizeMode="contain"
            style={this.styles.lastMessageThumb}
          />
          <Text style={this.styles.mostRecentText} numberOfLines={1}>
            {message.show_title + " " + message.eventable.date?.substring(0, 4)}
          </Text>
        </View>
      );
    }
    if (message.message_type === "image") {
      return (
        <View style={this.styles.lastMessageRow}>
          <FastImage
            source={{ uri: message.attachments }}
            style={this.styles.lastMessageThumb}
          />
          <Text style={this.styles.mostRecentText} numberOfLines={1}>
            Photo
          </Text>
        </View>
      );
    }
    return (
      <Text style={this.styles.mostRecentText} numberOfLines={1}>
        {message.message}
      </Text>
    );
  };
  renderBlockModal = () => {
    return (
      <Modal
        data-testID="Press"
        animationType="none"
        transparent={true}
        visible={this.state.showBlockList}
      >
        <TouchableOpacity
          testID="modalClose"
          onPress={() => this.setState({ showBlockList: false })}
          style={this.styles.overlay}
        >
          <View style={[this.styles.centeredView1, this.styles.commentsParentView1]}>
            <View style={[this.styles.modalViewCon, this.styles.commentsView1]}>
              <TouchableOpacity
                testID="blockBtn"
                activeOpacity={0.7}
                onPress={() => this.addBlockeduserCall()}
              >
                <Text style={this.styles.blockTest}>Block</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };
  dotBtn = (id: string) => {
    const theme = this.getChatTheme();
    return (
      <TouchableOpacity
        testID="dotBtn"
        activeOpacity={0.7}
        onPress={() => this.dotBtnPress(id)}
      >
        <MaterialCommunityIcons
          size={20}
          name={"dots-vertical"}
          color={theme.muted}
        />
      </TouchableOpacity>
    );
  };
  renderConversationItem = ({ item }: { item: any }) => {
    return (
      <View style={this.styles.chatItemContainer}>
        <View style={this.styles.conversationItem}>
          <TouchableOpacity
            testID="ChatListUserProfileNav"
            onPress={() => {
              this.NavToUserProfile(item.user_id, item.account_type);
            }}
            style={this.styles.userAvatarContainer}
          >
            {this.renderUserAvatar(item.profile_image)}
          </TouchableOpacity>
          <TouchableOpacity
            testID="chatItem"
            onPress={() => {
              this.setState({
                profileImage: item.profile_image,
                userName: item.user_name,
                chatId: `${item.id}`,
                userId: item.user_id,
                userAccountType: item.account_type,
              });
              this.navigateToChatView(`${item.id}`);
            }}
            style={this.styles.conversationPressArea}
          >
            <View style={this.styles.conversationItemContent}>
              <Text style={this.styles.name}>{`${item.user_name}`}</Text>
              <View>{this.renderLastMessage(item.lastMessage)}</View>
            </View>
            <View style={this.styles.rightContainer}>
              {item.online && <View style={this.styles.activeMarker} />}
              {item.unreadCount > 0 && (
                <View style={this.styles.unreadMessageCountContainer}>
                  <Text style={this.styles.unreadMessageCount}>
                    {item.unreadCount}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>
        {this.dotBtn(item.user_id)}
      </View>
    );
  };

  renderHiddenItem = (data: any, rowMap: any) => (
    <View style={this.styles.hiddenItemContainer}>
      <TouchableOpacity
        testID="archiveChat"
        style={[this.styles.hiddenItemButton, this.styles.archiveBtn]}
        onPress={() => {
          this.archiveChat(
            data.item.id,
            this.state.archiveSelected ? "unarchived" : "archived",
          );
        }}
      >
        <Icon name="archive" size={22} color="#FFFFFF" />
      </TouchableOpacity>
      <TouchableOpacity
        testID="deleteChat"
        style={[this.styles.hiddenItemButton, this.styles.deleteBtn]}
        onPress={() => {
          this.deleteChat(data.item.id);
        }}
      >
        <Icon name="trash-2" size={22} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );

  renderCameraGalleryPopup = () => {
    const theme = this.getChatTheme();
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.showCameraGalleryPopup}
        statusBarTranslucent={true}
      >
        <View style={this.styles.photoSheetOverlay}>
          <View style={this.styles.photoSheetWrap}>
            <View style={this.styles.galleryOptions}>
              <View style={this.styles.photoSheetHandle} />
              <Text style={this.styles.photoSheetTitle}>Add photo</Text>
              <TouchableOpacity
                testID="cameraOption"
                style={this.styles.photoSheetRow}
                onPress={this.handleCamera}
                activeOpacity={0.8}
              >
                <Icon name="camera" size={18} color={theme.foreground} />
                <Text style={this.styles.takeChoosePhoto}>Take photo</Text>
              </TouchableOpacity>
              <View style={this.styles.photoSheetDivider} />
              <TouchableOpacity
                testID="galleryOption"
                style={this.styles.photoSheetRow}
                onPress={this.handleGallery}
                activeOpacity={0.8}
              >
                <Icon name="image" size={18} color={theme.foreground} />
                <Text style={this.styles.takeChoosePhoto}>Choose photo</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              testID="cancelOption"
              style={this.styles.cancelPhotoOption}
              onPress={this.handleCancelPopup}
              activeOpacity={0.8}
            >
              <Text style={this.styles.cancelPhotoText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  renderChat = ({ item }: any) => {
    return (
      <>
        {item.attributes.message_type === "text" ||
        item.attributes.message_type === "image" ? (
          <>{this.renderMessage(item)}</>
        ) : (
          <>{this.renderEvent(item)}</>
        )}
      </>
    );
  };

  renderMessage = (item: any) => {
    const theme = this.getChatTheme();
    return (
      <View
        testID="testView"
        style={[
          item.attributes.message_type === "text"
            ? this.styles.message
            : this.styles.messageImg,
          item.attributes.from_other_party ? {} : this.styles.fromOtherParty,
        ]}
      >
        {item.attributes.message_type === "text" ? (
          <Text style={this.styles.messageText}>{item.attributes.message}</Text>
        ) : (
          <View>
            <FastImage
              source={{ uri: item.attributes.attachments }}
              resizeMode={FastImage.resizeMode.contain}
              style={{ height: 100, width: 150 }}
            />
            <Text style={this.styles.messageText}>{item.attributes.message}</Text>
          </View>
        )}
        {!item.attributes.from_other_party && (
          <View style={this.styles.readMarkContainer}>
            <MaterialCommunityIcons
              size={14}
              name={item.attributes.is_mark_read ? "check-all" : "check"}
              color={item.attributes.is_mark_read ? theme.primary : theme.muted}
            />
          </View>
        )}
      </View>
    );
  };

  renderEvent = (item: any) => {
    const { attributes } = item;
    const theme = this.getChatTheme();
    return (
      <View
        style={[
          this.styles.message,
          attributes.from_other_party ? {} : this.styles.fromOtherParty,
          this.styles.eventMessage,
        ]}
      >
        {attributes.eventable && (
          <View style={{ flexDirection: "row", marginRight: 20 }}>
            <View style={this.styles.eventThumbWrap}>
              <FastImage
                source={{
                  uri: attributes.eventable.image,
                  priority: FastImage.priority.high,
                }}
                style={{ borderRadius: 10, height: "100%", width: "100%" }}
                resizeMode={FastImage.resizeMode.contain}
              />
            </View>
            <View>
              <Text style={this.styles.eventTitle}>
                {attributes.eventable.title ?? attributes.eventable.description}
              </Text>
              {attributes.eventable.date && (
                <View style={this.styles.eventMetaRow}>
                  <Icon name="calendar" size={14} color={theme.primary} />
                  <Text style={this.styles.eventMetaText}>
                    {this.getDateFormatted(attributes.eventable.date)}
                  </Text>
                </View>
              )}
              {attributes.eventable.time && (
                <View style={this.styles.eventMetaRow}>
                  <Icon name="clock" size={14} color={theme.primary} />
                  <Text style={this.styles.eventMetaText}>
                    {`${new Date(attributes.eventable.time).getHours()}h${new Date(
                      attributes.eventable.time,
                    ).getMinutes()}m`}
                  </Text>
                </View>
              )}
              {attributes.eventable.location && (
                <View style={this.styles.eventMetaRow}>
                  <Icon name="map-pin" size={14} color={theme.primary} />
                  <Text style={this.styles.eventMetaText}>
                    {attributes.eventable.location}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}
        {!item.attributes.from_other_party && (
          <View style={this.styles.readMarkContainer}>
            <MaterialCommunityIcons
              size={14}
              name={item.attributes.is_mark_read ? "check-all" : "check"}
              color={item.attributes.is_mark_read ? theme.primary : theme.muted}
            />
          </View>
        )}
      </View>
    );
  };

  renderListHeader = () => {
    const theme = this.getChatTheme();
    return (
      <View style={this.styles.header}>
        <TouchableOpacity
          testID="navigationBackButton"
          style={this.styles.headerCircleBtn}
          onPress={() => {
            if (this.state.archiveSelected) {
              this.setState({ archiveSelected: false });
            } else this.props.navigation.goBack();
          }}
          activeOpacity={0.8}
        >
          <Icon name="arrow-left" size={18} color={theme.foreground} />
        </TouchableOpacity>
        <Text style={this.styles.headerText}>
          {this.state.archiveSelected ? "Archived" : "Chat"}
        </Text>
        <View style={this.styles.headerSideSpacer} />
      </View>
    );
  };

  renderChatList = () => {
    const renderingList = this.state.archiveSelected
      ? this.state.archiveList
      : this.state.chatList;
    const theme = this.getChatTheme();
    return (
      <>
        {this.renderListHeader()}
        <View style={this.styles.conversationsContainer}>
          {this.renderArchivedText()}
          <SwipeListView
            testID="swipeListView"
            data={renderingList}
            renderItem={this.renderConversationItem}
            renderHiddenItem={this.renderHiddenItem}
            rightOpenValue={-140}
            previewOpenValue={-40}
            previewOpenDelay={3000}
            disableRightSwipe
          />
        </View>
        {renderingList.length === 0 && (
          <View style={this.styles.noChatsContainer}>
            <View style={this.styles.emptyIconWrap}>
              <Icon name="message-square" size={36} color={theme.primary} />
            </View>
            <Text style={this.styles.chatsHeadingText}>No chats yet</Text>
          </View>
        )}
      </>
    );
  };
  renderChatInputType = (selectedPic: string) => {
    const theme = this.getChatTheme();
    return selectedPic !== "" ? (
      <View style={{ width: 110 }}>
        <Image
          style={{
            width: 100,
            height: 100,
            borderRadius: 12,
          }}
          resizeMode="cover"
          source={{ uri: selectedPic }}
        />
        <TouchableOpacity
          testID="cancelSendImage"
          onPress={() => {
            this.setState({ selectedPic: "" });
          }}
          style={this.styles.cancelSendImageBtn}
        >
          <MaterialCommunityIcons name="close" size={16} color="#fff" />
        </TouchableOpacity>

        <TextInput
          testID="txtMsg"
          style={this.styles.msgInput}
          placeholder="Type your message"
          placeholderTextColor={theme.muted}
          value={this.state.textMessage}
          multiline={true}
          onChangeText={(text) =>
            this.setState({ textMessage: text.replace("  ", " ").trimStart() })
          }
        />
      </View>
    ) : (
      <TextInput
        testID="txtMsgInput"
        style={this.styles.msgInput}
        placeholder="Type your message"
        placeholderTextColor={theme.muted}
        value={this.state.textMessage}
        multiline={true}
        onChangeText={(text) =>
          this.setState({ textMessage: text.replace("  ", " ").trimStart() })
        }
      />
    );
  };
  loadStoredChatData = async () => {
    try {
      const storedUserName = await getStorageData("chat_user_name");
      const storedProfileImage = await getStorageData("profile_image");

      console.log("Loading from storage:", { storedUserName, storedProfileImage });

      if (storedUserName) {
        this.setState({ userName: storedUserName });
      }
      if (storedProfileImage) {
        this.setState({ profileImage: storedProfileImage });
      }
    } catch (error) {
      console.log("Error loading stored chat data:", error);
    }
  };

  renderChatDetail = () => {
    // Load stored data when chat detail is rendered
    this.loadStoredChatData();

    console.log("Chat detail render - Current state:", {
      userName: this.state.userName,
      profileImage: this.state.profileImage,
    });

    const theme = this.getChatTheme();
    const canSend =
      this.state.selectedPic === ""
        ? this.state.sending || !this.state.textMessage.trim()
        : this.state.sending;

    return (
      <View style={{ flex: 1 }}>
        <View style={this.styles.header}>
          <TouchableOpacity
            testID="navigationBackButton"
            style={this.styles.headerCircleBtn}
            onPress={this.onPressBackFromDetails}
            activeOpacity={0.8}
          >
            <Icon name="arrow-left" size={18} color={theme.foreground} />
          </TouchableOpacity>
          <View style={this.styles.userInfo}>
            <TouchableOpacity
              testID="ChatDetailsUserProfileNav"
              onPress={() => {
                this.NavToUserProfile(this.state.userId, this.state.userAccountType);
              }}
            >
              {this.renderUserAvatar(this.state.profileImage, 40)}
            </TouchableOpacity>
            <View style={this.styles.userInfoContainer}>
              <Text style={this.styles.name} numberOfLines={1}>
                {this.state.userName}
              </Text>
            </View>
          </View>
          <View style={this.styles.headerSideSpacer} />
        </View>
        <View style={this.styles.conversationParentView}>
          <View style={this.styles.conversationView}>
            <FlatList
              data={this.state.chatHistory}
              renderItem={this.renderChat}
              inverted={true}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
        <View testID="msgInputContainer" style={this.styles.msgInputContainer}>
          {this.renderChatInputType(this.state.selectedPic)}
          <View style={this.styles.actionButtons}>
            <TouchableOpacity
              testID="btnShowPicSelector"
              style={[
                this.styles.cameraButton,
                { opacity: this.state.sending ? 0.5 : 1 },
              ]}
              onPress={this.handleSelectPic}
              disabled={this.state.sending}
            >
              <Icon name="camera" size={20} color={theme.muted} />
            </TouchableOpacity>
            <TouchableOpacity
              testID="btnSend"
              style={[this.styles.sendButton, { opacity: this.state.sending ? 0.5 : 1 }]}
              onPress={this.handleSendMessage}
              disabled={canSend}
            >
              <MaterialIcons
                name="send"
                size={22}
                color={canSend ? theme.muted : theme.primary}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };
  // Customizable Area End

  render() {
    // Customizable Area Start
    const theme = this.getChatTheme();
    return (
      <SafeAreaView style={this.styles.container} edges={["top"]}>
        <StatusBar
          barStyle={this.state.isDarkMode ? "light-content" : "dark-content"}
          backgroundColor={theme.background}
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? 45 : 0}
          style={{ flex: 1 }}
        >
          {this.state.showDetails ? this.renderChatDetail() : this.renderChatList()}
          {this.state.isLoading && (
            <View style={this.styles.loadingContainer}>
              <ActivityIndicator size={"large"} color={theme.primary} />
            </View>
          )}
        </KeyboardAvoidingView>
        {this.renderCameraGalleryPopup()}
        {this.renderBlockModal()}
      </SafeAreaView>
    );
    // Customizable Area End
  }
}

// Customizable Area Start
const createChatStyles = (theme: ChatTheme) => {
  const isLightTheme = theme.background === lightTheme.background;
  return StyleSheet.create({
    container: {
      flex: 1,
      width: "100%",
      maxWidth: 650,
      alignSelf: "center",
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
    headerSideSpacer: {
      width: 36,
      height: 36,
    },
    headerText: {
      fontWeight: "900",
      fontSize: 18,
      letterSpacing: 0.6,
      color: theme.foreground,
      textTransform: "uppercase",
    },
    conversationsContainer: {
      paddingHorizontal: 16,
      paddingTop: 12,
    },
    archivedRow: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.card,
      borderRadius: 14,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border,
      paddingVertical: 12,
      paddingHorizontal: 14,
      marginBottom: 12,
    },
    archivedIconWrap: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.primarySoft,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },
    archivedLabel: {
      flex: 1,
      fontWeight: "700",
      fontSize: 16,
      color: theme.foreground,
    },
    conversationItem: {
      flexDirection: "row",
      paddingVertical: 4,
      alignItems: "center",
      flex: 1,
    },
    conversationPressArea: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    userAvatarContainer: {
      width: 50,
      marginRight: 10,
    },
    userAvatar: {
      height: 48,
      width: 48,
      borderRadius: 24,
      borderWidth: 2,
      borderColor: theme.primary,
    },
    userAvatarPlaceholder: {
      height: 48,
      width: 48,
      borderRadius: 24,
      borderWidth: 2,
      borderColor: theme.primary,
      backgroundColor: isLightTheme ? theme.input : theme.card,
      alignItems: "center",
      justifyContent: "center",
    },
    conversationItemContent: {
      flex: 1,
      paddingRight: 36,
    },
    name: {
      textAlignVertical: "center",
      fontWeight: "700",
      fontSize: 16,
      color: theme.foreground,
    },
    mostRecentText: {
      color: theme.muted,
      fontSize: 13,
      marginTop: 2,
    },
    lastMessageRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 2,
    },
    lastMessageThumb: {
      height: 21,
      width: 16,
      borderRadius: 2,
    },
    hiddenItemContainer: {
      alignItems: "center",
      flex: 1,
      flexDirection: "row",
      justifyContent: "flex-end",
      marginBottom: 12,
      borderRadius: 16,
      overflow: "hidden",
    },
    hiddenItemButton: {
      alignItems: "center",
      justifyContent: "center",
    },
    archiveBtn: {
      backgroundColor: theme.primary,
      width: 70,
      height: "100%",
    },
    deleteBtn: {
      backgroundColor: "#DC2626",
      width: 70,
      height: "100%",
    },
    chatItemContainer: {
      alignItems: "center",
      backgroundColor: theme.card,
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-between",
      paddingRight: 10,
      paddingLeft: 10,
      paddingVertical: 8,
      marginBottom: 12,
      borderRadius: 16,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border,
    },
    conversationParentView: {
      flex: 1,
      backgroundColor: theme.background,
    },
    conversationView: {
      paddingHorizontal: 16,
    },
    message: {
      flexDirection: "row",
      justifyContent: "space-between",
      padding: 12,
      alignSelf: "flex-start",
      maxWidth: "80%",
      borderRadius: 16,
      backgroundColor: theme.input,
      marginVertical: 8,
      borderBottomLeftRadius: 4,
    },
    fromOtherParty: {
      alignSelf: "flex-end",
      backgroundColor: theme.primarySoft,
      borderBottomLeftRadius: 16,
      borderBottomRightRadius: 4,
    },
    eventMessage: {
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
      borderStartColor: theme.primary,
      borderLeftWidth: 7,
      padding: 10,
      overflow: "scroll",
      maxWidth: "100%",
    },
    eventThumbWrap: {
      borderRadius: 10,
      height: 100,
      width: 75,
      marginRight: 10,
      overflow: "hidden",
      backgroundColor: theme.input,
    },
    eventTitle: {
      color: theme.foreground,
      fontSize: 16,
      fontWeight: "700",
    },
    eventMetaRow: {
      flexDirection: "row",
      marginTop: 5,
      alignItems: "center",
    },
    eventMetaText: {
      marginLeft: 5,
      textAlignVertical: "center",
      color: theme.muted,
      fontSize: 12,
      fontWeight: "400",
    },
    userInfo: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 6,
      paddingHorizontal: 10,
    },
    userInfoContainer: {
      flex: 1,
      alignSelf: "center",
      marginLeft: 10,
    },
    messageText: {
      color: theme.foreground,
      fontSize: 15,
      lineHeight: 22,
    },
    msgInputContainer: {
      position: "relative",
      paddingVertical: 10,
      paddingHorizontal: 12,
      backgroundColor: theme.card,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: theme.border,
    },
    msgInput: {
      minHeight: 44,
      fontSize: 16,
      width: Dimensions.get("window").width - 100,
      color: theme.foreground,
      backgroundColor: theme.input,
      borderRadius: 16,
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border,
    },
    actionButtons: {
      top: 0,
      bottom: 0,
      right: 10,
      position: "absolute",
      alignSelf: "center",
      flexDirection: "row",
      alignItems: "center",
    },
    sendButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: "center",
      justifyContent: "center",
    },
    cameraButton: {
      marginRight: 6,
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: "center",
      justifyContent: "center",
    },
    cancelSendImageBtn: {
      position: "absolute",
      backgroundColor: theme.primary,
      borderRadius: 99,
      padding: 3,
      right: 0,
      top: -10,
    },
    readMarkContainer: {
      marginLeft: 5,
      alignSelf: "flex-end",
    },
    unreadMessageCountContainer: {
      minWidth: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: theme.primary,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 5,
    },
    unreadMessageCount: {
      color: "#ffffff",
      fontWeight: "700",
      fontSize: 11,
    },
    loadingContainer: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: isLightTheme
        ? "rgba(255, 255, 255, 0.72)"
        : "rgba(8, 8, 15, 0.72)",
      alignItems: "center",
      justifyContent: "center",
    },
    noChatsContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 16,
    },
    emptyIconWrap: {
      width: 84,
      height: 84,
      borderRadius: 42,
      backgroundColor: theme.primarySoft,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 16,
    },
    chatsHeadingText: {
      fontSize: 22,
      fontWeight: "800",
      color: theme.foreground,
    },
    rightContainer: {
      position: "absolute",
      right: 5,
      height: "100%",
      alignSelf: "center",
      justifyContent: "space-evenly",
      alignItems: "center",
    },
    activeMarker: {
      width: 10,
      aspectRatio: 1,
      borderRadius: 5,
      backgroundColor: "#34D399",
    },
    photoSheetOverlay: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: "rgba(8, 8, 15, 0.72)",
    },
    photoSheetWrap: {
      paddingHorizontal: 16,
      paddingBottom: 36,
    },
    galleryOptions: {
      borderRadius: 16,
      backgroundColor: theme.card,
      alignItems: "stretch",
      overflow: "hidden",
      borderWidth: 1,
      borderColor: theme.border,
    },
    photoSheetHandle: {
      alignSelf: "center",
      width: 36,
      height: 4,
      borderRadius: 2,
      backgroundColor: theme.border,
      marginTop: 10,
      marginBottom: 8,
    },
    photoSheetTitle: {
      fontSize: 13,
      fontWeight: "600",
      color: theme.muted,
      textAlign: "center",
      marginBottom: 6,
    },
    photoSheetRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 16,
      paddingHorizontal: 20,
    },
    photoSheetDivider: {
      backgroundColor: theme.border,
      height: 1,
      marginHorizontal: 16,
    },
    takeChoosePhoto: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.foreground,
      marginLeft: 10,
    },
    cancelPhotoOption: {
      borderRadius: 16,
      backgroundColor: theme.card,
      marginTop: 10,
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.border,
    },
    cancelPhotoText: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.primary,
      marginVertical: 16,
    },
    messageImg: {
      flexDirection: "row",
      justifyContent: "space-between",
      padding: 10,
      alignSelf: "flex-start",
      maxWidth: "80%",
      borderRadius: 16,
      backgroundColor: theme.input,
      marginVertical: 8,
      borderBottomLeftRadius: 4,
    },
    centeredView1: {
      flex: 1,
      justifyContent: "flex-end",
    },
    modalViewCon: {
      height: "10%",
      justifyContent: "space-between",
      backgroundColor: theme.card,
      borderTopEndRadius: 20,
      padding: 35,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    commentsParentView1: {
      backgroundColor: "rgba(8, 8, 15, 0.72)",
    },
    commentsView1: {
      height: "15%",
      padding: 20,
      justifyContent: "flex-start",
    },
    blockTest: {
      color: "#DC2626",
      fontFamily: "OpenSans",
      fontWeight: "bold",
      fontSize: 18,
      textAlign: "center",
      marginTop: 20,
    },
    overlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
  });
};

const darkChatStyles = createChatStyles(redesignTheme);
const lightChatStyles = createChatStyles(lightTheme);
// Customizable Area End

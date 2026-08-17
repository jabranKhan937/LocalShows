import React from "react";

// Customizable Area Start
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
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
import { SwipeListView } from "react-native-swipe-list-view";
import Icon from "react-native-vector-icons/Feather";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { IChatItem } from "./ChatController";
import FastImage from "../../../components/src/SafeFastImage"
// Customizable Area End

import ChatController from "./ChatController";
import { colors } from "../../utilities/src/Colors";
import { leftArrow } from "../../events/src/assets";
import { userProfile } from "../../navigationmenu/src/assets";
import { archiveIcon, cameraIcon, deleteIcon } from "./assets";
import { getStorageData, removeStorageData, setStorageData } from "../../../framework/src/Utilities";

export default class Chat extends ChatController {
  // Customizable Area Start

  renderArchivedText = () => {
    return (
      <>
        {!this.state.archiveSelected &&
          this.state.archiveList.length !== 0 && (
            <TouchableOpacity
              testID="archivedTxt"
              style={[styles.conversationItem, { flex: undefined, minHeight: 60, flexDirection: "row", alignItems: "center", justifyContent: "center", borderBottomWidth: 1 }]}
              onPress={() => this.setState({ archiveSelected: true })}
            >
              <View
                style={{ flex: 0.1, alignItems: "center", marginRight: 10 }}
              >
                <Icon name="archive" size={25} color={"#7676FF"} />
              </View>
              <Text
                style={[
                  styles.name,
                  { flex: 0.9, textAlignVertical: "center" },
                ]}
              >
                Archived
              </Text>
            </TouchableOpacity>
          )}
      </>
    );
  };

  renderLastMessage = (message:any) => {
    if (message.eventable && message.message_type === 'event') {
     return <View style={{
      flexDirection:'row',
      alignItems:'center'
     }}>
      <FastImage source={{uri:message.eventable.image}} resizeMode="contain" style={{height:21,width:16,borderRadius:2}} />
      <Text style={{
        paddingLeft:8,
      }}>{message.show_title + " " + message.eventable.date?.substring(0, 4)}</Text>
     </View>
    }
    if (message.message_type === 'image') {
     return <View style={{
      flexDirection:'row',
      alignItems:'center',
     }}>
      <FastImage source={{uri:message.attachments}} style={{height:21,width:16,borderRadius:2}} />
      <Text style={{
        paddingLeft:8,
      }}>Photo</Text>
     </View>
    }
    return <Text style={styles.mostRecentText}>{message.message}</Text>
  }
  renderBlockModal = () => {
    return (
     <Modal data-testID='Press'
        animationType="none"
        transparent={true}
        visible={this.state.showBlockList}>
        <TouchableOpacity testID="modalClose" onPress={() => this.setState({ showBlockList: false })} style={styles.overlay}>
          <View style={[styles.centeredView1, styles.commentsParentView1]}>
            <View style={[styles.modalViewCon, styles.commentsView1]}>
              <TouchableOpacity testID="blockBtn" activeOpacity={0.7} onPress={() => this.addBlockeduserCall()}>
                <Text style={styles.blockTest}>Block</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    )
  }
  dotBtn=(id:string)=>{
    return(
      <TouchableOpacity testID="dotBtn" activeOpacity={0.7}onPress={()=>this.dotBtnPress(id)}>
          <MaterialCommunityIcons 
              size={20}
              name={"dots-vertical"}
              color={"#334155"}
            />
          </TouchableOpacity>
    )
  }
  renderConversationItem = ({ item }: { item: any }) => {
    return (
      <View style={styles.chatItemContainer}>
        <View
            style={styles.conversationItem}
        >
          <TouchableOpacity
          testID="ChatListUserProfileNav"
          onPress={() => {
            this.NavToUserProfile(item.user_id,item.account_type)
          }}
           style={styles.userAvatarContainer}>
            <FastImage
              source={item.profile_image?.trim() ?
                {
                  uri: item.profile_image,
                  priority: FastImage.priority.high
                } :
                userProfile
              }
              resizeMode={FastImage.resizeMode.cover}
              style={styles.userAvatar}
            />
          </TouchableOpacity>
         <TouchableOpacity
          testID="chatItem"
          onPress={() => {
            this.setState({ profileImage: item.profile_image, userName: item.user_name, chatId: `${item.id}`, userId:item.user_id, userAccountType:item.account_type })
            this.navigateToChatView(`${item.id}`);
            
          }}
          style={{
          flex:1,
          flexDirection:"row",
          alignItems:"center",justifyContent:"space-between"
         }}>
         <View style={styles.conversationItemContent}>
            <Text style={styles.name}>{`${item.user_name}`}</Text>
            <View>
              {this.renderLastMessage(item.lastMessage)}
            </View>
          </View>
          <View style={styles.rightContainer}>
            {item.online &&
              <View style={styles.activeMarker} />
            }
            {item.unreadCount > 0 &&
              <View style={styles.unreadMessageCountContainer}>
                <Text style={styles.unreadMessageCount}>{item.unreadCount}</Text>
              </View>
            }
          </View>
         </TouchableOpacity>
        </View>
           {this.dotBtn(item.user_id)}
      </View>
    );
  };

  renderHiddenItem = (data: any, rowMap: any) => (
    <View style={styles.hiddenItemContainer}>
      <TouchableOpacity
        testID="archiveChat"
        style={[styles.hiddenItemButton, styles.archiveBtn]}
        onPress={() => {
          this.archiveChat(data.item.id, this.state.archiveSelected ? "unarchived" : 'archived');
        }}
      >
        <Image source={archiveIcon} style={{ height: 25, width: 25 }} />
      </TouchableOpacity>
      <TouchableOpacity
        testID="deleteChat"
        style={[styles.hiddenItemButton, styles.deleteBtn]}
        onPress={() => {
          this.deleteChat(data.item.id);
        }}
      >
        <Image source={deleteIcon} style={{ height: 25, width: 25 }} />
      </TouchableOpacity>
    </View>
  );

  renderCameraGalleryPopup = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.showCameraGalleryPopup}
        statusBarTranslucent={true}
      >
        <View style={[styles.centerView, { padding: 10, }]}>
          <View style={{ borderRadius: 10, backgroundColor: '#EDEDFF', alignItems: 'center' }}>
            <Text testID="cameraOption" style={{ fontSize: 14, fontWeight: '400', color: '#4949EE', marginVertical: 15, }} onPress={this.handleCamera}>Take photo</Text>
            <View style={styles.divider} />
            <Text testID="galleryOption" style={{ fontSize: 14, fontWeight: '400', color: '#4949EE', marginVertical: 15, }} onPress={this.handleGallery}>Choose photo</Text>
          </View>
          <TouchableOpacity testID="cancelOption" style={{ borderRadius: 10, backgroundColor: '#EDEDFF', marginTop: 15, alignItems: 'center', }} onPress={this.handleCancelPopup}>
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#4949EE', marginVertical: 20, }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    )
  }

  renderChat = ({item}:any) => {
    return (
      <>
        {
          item.attributes.message_type === 'text' || item.attributes.message_type === 'image' ? <>{this.renderMessage(item)}</> :
            <>{this.renderEvent(item)}</>
        }
      </>
    );
  };

  renderMessage = (item: any) => {
    return (
      <View
        testID="testView"
        style={[
          item.attributes.message_type === 'text' ? styles.message : styles.messageImg,
          item.attributes.from_other_party ? {} : styles.fromOtherParty,
        ]}
      >
        {item.attributes.message_type === 'text' ? (
          <Text style={styles.messageText}>{item.attributes.message}</Text>
        ) : 
        (
          <View>
          <FastImage
            source={{ uri: item.attributes.attachments }}
            resizeMode={FastImage.resizeMode.contain}
            style={{ height: 100, width: 150 }} />
             <Text style={styles.messageText}>{item.attributes.message}</Text>
            </View>
        )}
        {!item.attributes.from_other_party &&
          <View style={styles.readMarkContainer}>
            <MaterialCommunityIcons
              size={14}
              name={item.attributes.is_mark_read ? "check-all" : "check"}
              color={item.attributes.is_mark_read ? "#4949EE" : "#334155"}
            />
          </View>
        }
      </View>
    )
  }


  renderEvent = (item: any) => {
    const {attributes} = item
    return (
      <View
        style={[
          styles.message,
          attributes.from_other_party ? {} : styles.fromOtherParty,
          { borderBottomLeftRadius: 10, borderBottomRightRadius: 10, borderStartColor: '#4949EE',borderLeftWidth:7, padding: 10,overflow:"scroll", maxWidth: '100%' }
        ]}
      >
        
          {attributes.eventable && ( 
          <View style={{ flexDirection: 'row', marginRight: 20, }}>
              <View style={{ borderRadius: 10, height: 100, width: 75, marginRight: 10 }}>
              <FastImage
                source={{
                  uri: attributes.eventable.image,
                  priority: FastImage.priority.high
                }}
                style={{ borderRadius: 10, height: '100%', width: '100%' }}
                resizeMode={FastImage.resizeMode.contain}
              />
            </View>
            <View>
              <Text style={[styles.messageText, { color: '#334155', fontSize: 16, fontWeight: '700', }]}>{attributes.eventable.title ?? attributes.eventable.description}</Text>
              {attributes.eventable.date && (
              <View style={{ flexDirection: 'row', marginTop: 5, }}>
                <Image source={require('../../../mobile/assets/images/image_calendar.png')} style={{ height: 20, width: 20, resizeMode: 'contain' }} />
                <Text style={[styles.messageText, { marginLeft: 5, textAlignVertical: 'center', color: '#334155', fontSize: 12, fontWeight: '400', }]}>{this.getDateFormatted(attributes.eventable.date)}</Text>
              </View>
              )}
              {attributes.eventable.time && (
              <View style={{ flexDirection: 'row', marginTop: 5, }}>
                <Image source={require('../../../mobile/assets/images/time.png')} style={{ height: 20, width: 20, resizeMode: 'contain' }} />
                <Text style={[styles.messageText, { marginLeft: 5, textAlignVertical: 'center', color: '#334155', fontSize: 12, fontWeight: '400', }]}>{`${new Date(attributes.eventable.time).getHours()}h${new Date(attributes.eventable.time).getMinutes()}m`}</Text>
              </View>
              )}
              {attributes.eventable.location && (
              <View style={{ flexDirection: 'row', marginTop: 5, }}>
                <Image source={require('../../../mobile/assets/images/location_on.png')} style={{ height: 20, width: 20, resizeMode: 'contain' }} />
                <Text style={[styles.messageText, { marginLeft: 5, textAlignVertical: 'center', color: '#334155', fontSize: 12, fontWeight: '400', }]}>{attributes.eventable.location}</Text>
              </View>
              )}
            </View>
          </View>
        )}
          {!item.attributes.from_other_party &&
            <View style={styles.readMarkContainer}>
              <MaterialCommunityIcons
                size={14}
                name={item.attributes.is_mark_read ? "check-all" : "check"}
                color={item.attributes.is_mark_read ? "#4949EE" : "#334155"}
              />
            </View>
          }
      </View>
    );
  }

  renderChatList = () => {
    const renderingList = this.state.archiveSelected
      ? this.state.archiveList
      : this.state.chatList;
    return (
      <>
        <View style={styles.header}>
        <Text style={[styles.text, styles.headerText]}>
            {this.state.archiveSelected ? "Archived" : "Chat"}
          </Text>
          <TouchableOpacity
            testID="navigationBackButton"
            style={styles.backButtonContainer}
            onPress={() => {
              if (this.state.archiveSelected){
                this.setState({ archiveSelected: false });
              }
              else this.props.navigation.goBack();
            }}
          >
            <Image source={leftArrow} style={styles.backButtonIcon} />
          </TouchableOpacity>
         
          <View style={{ width: 20, marginRight: 16 }} />
        </View>
        <View style={styles.conversationsContainer}>
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
        {renderingList.length === 0 &&
          <View style={styles.noChatsContainer}>
            <Icon name="message-square" size={60} color="#0F172A" />
            <Text style={styles.chatsHeadingText}>No chats yet</Text>
          </View>
        }
      </>
    )
  }
  renderChatInputType = (selectedPic:string) => {
    return selectedPic !== '' ? <View style={{
      width:110
    }} >
      <Image style={{
        width:100,
        height:100
      }} resizeMode="cover" source={{uri:selectedPic}} />
      <TouchableOpacity
       testID="cancelSendImage"
      onPress={() => {
        this.setState({selectedPic:''})
      }}
       style={{
        position:'absolute',
        backgroundColor:'#3333CC',
        borderRadius:99,
        padding:3,
        right:0,
        top:-10
      }}>
      <MaterialCommunityIcons name="close" size={20} color="#fff" />
      </TouchableOpacity>


      <TextInput
     testID="txtMsg"
      style={styles.msgInput}
      placeholder="Type your message"
      value={this.state.textMessage}
      multiline={true}
      onChangeText={(text) => this.setState({ textMessage: text.replace("  ", " ").trimStart() })}
    />
    </View> : <TextInput
      testID="txtMsgInput"
      style={styles.msgInput}
      placeholder="Type your message"
      value={this.state.textMessage}
      multiline={true}
      onChangeText={(text) => this.setState({ textMessage: text.replace("  ", " ").trimStart() })}
    />
  }
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
      profileImage: this.state.profileImage
    });
    
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity
            testID="navigationBackButton"
            style={styles.backButtonView}
            onPress={this.onPressBackFromDetails}
          >
            <MaterialIcons 
              name="arrow-back" 
              size={24} 
              color="#000" 
            />
          </TouchableOpacity>
          <View style={styles.userInfo}>
            <TouchableOpacity
            testID="ChatDetailsUserProfileNav"
            onPress={()=>{this.NavToUserProfile(this.state.userId, this.state.userAccountType)}}
            >
            <FastImage
              source={this.state.profileImage ?
                {
                  uri: this.state.profileImage,
                  priority: FastImage.priority.high
                } :
                userProfile
              }
              resizeMode={FastImage.resizeMode.cover}
              style={styles.userAvatar} />
            </TouchableOpacity>
            <View style={styles.userInfoContainer}>
              <Text style={styles.name}>{this.state.userName}</Text>
              {/* <Text style={styles.userStatusText}></Text> */}
            </View>
          </View>
          <View style={{ width: 20, marginRight: 16 }} />
        </View>
        <View style={styles.conversationParentView}>
          <View style={styles.conversationView}>
            <FlatList
              data={this.state.chatHistory}
              renderItem={this.renderChat}
              inverted={true}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
        <View testID="msgInputContainer" style={styles.msgInputContainer}>
          {this.renderChatInputType(this.state.selectedPic)}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              testID="btnShowPicSelector"
              style={[styles.cameraButton, { opacity: this.state.sending ? 0.5 : 1 }]}
              onPress={this.handleSelectPic}
              disabled={this.state.sending}
            >
              <Image resizeMode="contain" source={cameraIcon} style={{ height: 25, width: 25 }} />
            </TouchableOpacity>
            <TouchableOpacity
              testID="btnSend"
              style={[styles.sendButton, { opacity: this.state.sending ? 0.5 : 1 }]}
              onPress={this.handleSendMessage}
              disabled={this.state.selectedPic === '' ? this.state.sending || !this.state.textMessage.trim() : this.state.sending}
            >
              <MaterialIcons name="send" size={25} color="#64748B" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }
  // Customizable Area End

  render() {
    // Customizable Area Start
    // Merge Engine - render - Start
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={colors(false).background}
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 45 : 0}
          style={{ flex: 1 }}
        >
          {this.state.showDetails ? this.renderChatDetail() : this.renderChatList()}
          {this.state.isLoading &&
            <View style={styles.loadingContainer}>
              <ActivityIndicator size={'large'} color="#4949EE" />
            </View>
          }
        </KeyboardAvoidingView>
        {this.renderCameraGalleryPopup()}
        {this.renderBlockModal()}
      </SafeAreaView>
    );
    // Merge Engine - render - End
    // Customizable Area End
  }
}

// Customizable Area Start
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors(false).background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 7,
    
  },
  backButtonContainer: {
    marginLeft:16,
    width: 20,
  },
  backButtonIcon: {
    width: 12,
    left: 0,
    resizeMode: "contain",
  },
  headerText: {
    fontWeight: "700",
    fontSize: 24,
    position:'absolute',
    width:'100%',
    textAlign:'center',
    alignSelf:'center',
  },
  text: {
    fontFamily: "OpenSans",
    color: colors(false).text,
  },
  hamburgerButton: {
   
  },
  hamburgerIcon: {
    width: 25,
    height: 16,
    resizeMode: "contain",
    marginRight: 5,
  },
  conversationsContainer: {
    paddingHorizontal: 16,
  },
  conversationItem: {
    flexDirection: "row",
    paddingVertical: 10,
    alignItems: "center",
    flex: 1,
  },
  userAvatarContainer: {
    width: 50,
    marginRight: 10
  },
  userAvatar: {
    height: 48,
    width: 48,
    borderRadius: 25,
  },
  conversationItemContent: {},
  name: {
    textAlignVertical: "center",
    fontWeight: "bold",
    fontSize: 17,
  },
  mostRecentText: {},
  hiddenItemContainer: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",

  },
  hiddenItemButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  archiveBtn: {
    borderWidth: 1,
    borderColor: '#3333CC',
    width: 70,
    height: '100%'
  },
  deleteBtn: {
    backgroundColor: "#DC2626",
    width: 70,
    height: '100%'
  },
  chatItemContainer: {
    alignItems: "center",
    backgroundColor: "#FFF",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: 5,
    borderBottomWidth: 2,
    borderBottomColor: '#E2E8F0'
  },
  backButtonView: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  conversationParentView: {
    flex: 1,
    backgroundColor: "#F1F5F9",
  },
  conversationView: {
    paddingHorizontal: 16,
  },
  message: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    alignSelf: "flex-start",
    maxWidth: "80%",
    borderRadius: 10,
    backgroundColor: "#E2E8F0",
    marginVertical: 8,
    borderBottomLeftRadius: 0,
  },
  fromOtherParty: {
    alignSelf: "flex-end",
    backgroundColor: "#EDEDFF",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 0,
  },
  userInfo: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  userInfoContainer: {
    flex: 1,
    alignSelf: "center",
    marginLeft: 10,
  },
  messageText: {},
  msgInputContainer: {
    position: "relative",
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  msgInput: {
    minHeight: 40,
    fontSize: 16,
    width: Dimensions.get("window").width - 100
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
  sendButton: {},
  cameraButton:{
    marginRight:10
  },
  userStatusText: {},
  readMarkContainer: {
    marginLeft: 5,
    alignSelf: "flex-end",
  },
  unreadMessageCountContainer: {
    height: 20,
    width: 20,
    borderRadius: 10,
    backgroundColor: "#4949EE",
    justifyContent: "center",
    alignItems: "center",
  },
  unreadMessageCount: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#ffffffdd',
    alignItems: "center",
    justifyContent: "center",
  },
  noChatsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  chatsHeadingText: {
    fontSize: 24,
    fontWeight: 'bold',
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
    backgroundColor: "#34D399"
  },
  centerView: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "#33415580",
  },
  divider: {
    backgroundColor: '#E2E8F0',
    height: 1,
  },
  messageImg: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    alignSelf: "flex-start",
    maxWidth: "80%",
    borderRadius: 10,
    backgroundColor: "#E2E8F0",
    marginVertical: 8,
    borderBottomLeftRadius: 0,
  },
  centeredView1: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalViewCon: {
    height: '10%',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderTopEndRadius: 20,
    padding: 35,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  commentsParentView1: {
    backgroundColor: '#33415580',
  },
  commentsView1: {
    height: '15%',
    padding: 20,
    justifyContent: 'flex-start',
  },
  blockTest:{
    color:"red" ,fontFamily: "OpenSans",fontWeight: "bold",fontSize: 18,textAlign:"center", marginTop:20
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  }
});
// Customizable Area End

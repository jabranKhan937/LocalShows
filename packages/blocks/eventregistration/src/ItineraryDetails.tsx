// Customizable Area Start
import React from "react";
import ItineraryDetailsController, {
  Props,
  EventData,
  configJSON
} from "./ItineraryDetailsController";
import Icon from "react-native-vector-icons/Feather";
import { SwipeListView } from 'react-native-swipe-list-view';
import {  ActivityIndicator,TouchableOpacity,  View, Text, Image,  StyleSheet, FlatList, RefreshControl, SafeAreaView, Pressable, Modal, KeyboardAvoidingView, TextInput, TouchableWithoutFeedback } from "react-native";
import { colors } from "../../utilities/src/Colors";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { 
  calendarIcon,
  chat,
  defaultProfile,
  favoriteOutfilled,
  favoriteFilled,
  leftArrow,
  menuIcon,
  location,
  share,
  Theater } from "./assets";
  import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
  import FastImage from "../../../components/src/SafeFastImage"
import { deviceHeight } from "../../../framework/src/Utilities";

// Customizable Area End


export default class ItineraryDetails extends ItineraryDetailsController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }

  // Customizable Area Start
  renderAcceptBtn = () => {
      return (
        <View style={styles.acceptCardView}>
          <Text style={styles.searchItineraryText}>{configJSON.acceptButtonDescription}</Text>
          <TouchableOpacity testID="acceptBtn" style={styles.acceptBtnView} onPress={() => this.setState({ showAcceptBtn: false})}>
            <Text style={styles.acceptBtn}>{configJSON.acceptTextButton}</Text>
          </TouchableOpacity>
        </View>
      )
    }
  renderHeader = () => {
    return (
      <View style={styles.headerContainer1}>
        <TouchableOpacity
          testID="navigationBackButton"
          style={styles.backArrowIconSty}
          onPress={this.handleBackNavigationPress}>
          <Image source={leftArrow} style={styles.backArrowSty} />
        </TouchableOpacity>
        <Text style={[styles.text, styles.headerTitleText]}>{configJSON.headerTitle}</Text>
        <View style={styles.iconsContain}>
        
          <TouchableOpacity testID="hamburgerBtn" onPress={() => this.props.navigation.openDrawer()}>
            <Image style={styles.hamburgerIconSty}
              source={menuIcon} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }
  renderShow = () => {
    const {startDate, endDate , selectedCity, selectedState , selectedCountryCode, selectedType} = this.state.selectedParams
    const cityValue = selectedCity ? `${selectedCity}, ` : '';
    const stateValue = selectedState ? `${selectedState}, ` : '';

    return (
      <View>
        <Text style={styles.countShows}>{this.state.eventsData.length} {configJSON.searchShowsTitle}</Text>
        <View style={styles.cardView}>
          <View style={styles.row}>
          <Image source={calendarIcon} style={styles.image} />
            <Text style={styles.date}>{`${startDate} - ${endDate}`}</Text>
          </View>

          <View style={styles.row}>
            <Image source={location} style={styles.image} />
            <Text style={styles.date}>{`${cityValue}${stateValue}${selectedCountryCode}`}</Text>
          </View>

          <View style={styles.row}>
            <Image source={Theater} style={styles.image} />
            <Text style={styles.date}>{selectedType ? `Show type : ${selectedType.attributes.name}` : 'Show type : All'}</Text>
          </View>
        </View>
      </View>
    )
  }
  editBtn = () => {
    return (
      <TouchableOpacity testID="searchBtn" onPress={this.handleEditSearchBtn} activeOpacity={0.7} style={styles.editBtn}>
        <Text style={styles.editTextSty}>{configJSON.editTextButton}</Text>
      </TouchableOpacity>
    )
  }
  renderEventList = (item : EventData) => {
    return (
      <View style={styles.flex1}>
        <Text style={styles.countShows}>{item.date} </Text>
          <TouchableWithoutFeedback testID="postBtn" onPress={this.handleEventLaunch.bind(this,item,this.state.selectedParams.selectedState)}>
        <View style={styles.viewContain}>
          <View style={styles.subView}>
            <TouchableOpacity testID="profileBtn" activeOpacity={0.7}>
              <Image source={item.avatar ? {uri: item.avatar } : defaultProfile}
                style={styles.profileImg} />
            </TouchableOpacity>

            <View style={styles.eventDescription}>

              <Text style={styles.nameText}>{item.name}</Text>

              <TouchableOpacity testID="locationBtn" onPress={this.openGoogleMaps.bind(this,item.location)} style={styles.locationContainer}>
                <Image source={location} style={styles.location} />
                <Text style={styles.eventLocationTitle}>{item.location} </Text>
                <Text style={styles.locationLinkText}>location</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View >
            <Image style={styles.gallerySty} source={{uri: item.image}} />
          </View>
          
          <View style={styles.viewSty}>
            <View style={styles.subViewSty}>
              <TouchableOpacity
                testID="likeBtn"
                onPress={() => this.handleToogleLikeEvent(item)}
                >

                  <Image source={item.post.likeByMe ? favoriteFilled : favoriteOutfilled} style={[styles.imageSty, {tintColor: '#4949EE'}]} />


              </TouchableOpacity>

              <TouchableOpacity testID="commentIcon" style={{marginHorizontal: 7}} onPress={() => this.handleToogleModalShowComments(item)}>
                <Image source={chat} style={styles.imageSty} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={this.handleShare.bind(this,item.id,item.type)}
                testID="share">
                <Image source={share} style={styles.imageSty} />
              </TouchableOpacity>

            </View>
            {null !== item.added_in_calendar && !item.added_in_calendar && (

            <TouchableOpacity onPress={this.addToCalanderApi.bind(this,item.id)} testID="addEventToCalendarBtn">
              <Text style={styles.calendar}>Add it to my calendar</Text>
            </TouchableOpacity>
            )}
          </View>

          {item.post.likes > 0 && (
            <TouchableOpacity testID="likeThisTxt">
              <Text style={styles.countSty}>{item.post.likes} people
                <Text
                  style={styles.likeText}> like this</Text>
              </Text>
          </TouchableOpacity>
          )}
            <View style={styles.commentContainer}>
              <Text style={styles.eventTitle}>{item.title}</Text>
              <Text style={styles.eventTitle}> - </Text>
              <Text style={styles.description} >{item.description}</Text>
            </View>
          {item.post.comments && (
            <View style={styles.commentContainer}>
             <Text testID="commentsCount" style={styles.commentCount}>
                {item.post.comments.length} comment{item.post.comments.length >1 && 's'}
             </Text>
              <TouchableOpacity>
                <Text testID="commentsCountBtn" style={styles.commentSty} onPress={() => this.handleToogleModalShowComments(item)}>
                  See the comments
                </Text>
              </TouchableOpacity>
            </View>
          )}
         
        </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  handleCommentsRendering = () => {
      return (
        <>
          {
            this.state.commentsList.length ?
              <View style={styles.flex1}>
                <SwipeListView
                  bounces={false}
                  alwaysBounceVertical={false}
                  alwaysBounceHorizontal={false}
                  testID="swipeListView"
                  data={this.state.commentsList}
                  showsVerticalScrollIndicator={false}
                  renderItem={({item} ) => (
                    <View>
                      {this.state.userInfo.id === (item.attributes.account_id).toString() ? (
                        <SwipeListView
                          data={[item]}
                          bounces={false}
                          testID="swipeSubListView"
                          alwaysBounceVertical={false}
                          alwaysBounceHorizontal={false}
                          renderItem={this.renderCommentItem}
                          renderHiddenItem={(this.renderCommentsHiddenItem)}
                          rightOpenValue={-120}
                          disableRightSwipe
                          listKey={`swipe-${item.id}`}
                        />
                      ) : (
                        <SwipeListView
                          data={[item]}
                          bounces={false}
                          alwaysBounceVertical={false}
                          alwaysBounceHorizontal={false}
                          renderItem={this.renderCommentItem}
                          renderHiddenItem={(this.renderCommentsHiddenItem)}
                          rightOpenValue={-120}
                          disableRightSwipe
                          disableLeftSwipe
                          listKey={`swipe-${item.id}`}
                        />
                      )}
                    </View>
                  )}
                  renderHiddenItem={(data, rowMap) => null}
                  rightOpenValue={0}
                  disableRightSwipe
                  disableLeftSwipe
                  listKey="main"
                />
              </View>
              :
              <View style={styles.noCommentsContainer}>
                <Icon name="message-square" size={60} color="#0F172A" />
                <Text style={styles.commentsHeadingText}>No comments yet</Text>
                <Text style={styles.startConversationTextMargin}>Start the conversation</Text>
              </View>
          }
          {
            this.state.isCommentsLoading && <View style={{
              height: '100%',
              width: '100%',
              position: 'absolute',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ActivityIndicator size="large" color="#4949EE" />
            </View>
          }
        </>
      )
    }
    renderCommentItem = ({ item }: { item: any }) => {
      return (
        <View style={styles.rowFront}>
          <TouchableOpacity
            testID="imageShowProfile"
            style={styles.userAvatarContainer}
            onPress={() => this.showProfile(item.attributes.account.id, item.attributes.account.account_type)}
          >
            <FastImage source={item.attributes.profile_image_url ?
              {
                uri: item.attributes.profile_image_url,
                priority: FastImage.priority.high,
              } :
              defaultProfile
            }
              style={styles.userAvatar}
              resizeMode={FastImage.resizeMode.cover} />
          </TouchableOpacity>
          <View style={styles.flex1}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.commenterName}>
                {`${item.attributes.account.first_name}`}
              </Text>
              <Text style={[styles.commenterName, { fontWeight: '400', marginLeft: 5 }]}>
              {this.timeAgo(item.attributes.created_at)}
              </Text>
            </View>
            <Text style={styles.commentText}>{item.attributes.comment}</Text>
            <TouchableOpacity
              testID="replyButton"
              style={styles.replyButton}
             onPress={() => this.handleReply(item.id)}
            >
              <Text style={styles.replyButtonText}>Reply</Text>
            </TouchableOpacity>
            {
              item.attributes.replies.length !== 0 &&
              <TouchableOpacity
                testID="showReplyButton"
                style={styles.showReplyButton}
                onPress={() => this.handleReplyButton(item)}
              >
                <View style={styles.horizontalBar} />
                <Text style={styles.showReplyButtonText}>
                  {`View ${item.attributes.replies.length} more replies`}
                </Text>
              </TouchableOpacity>
            }
          </View>
          <View style={styles.likeContainer}>
            <TouchableOpacity
              testID="likeCommentButton"
              onPress={() => this.likeComment(item.id)}
            >
              <FontAwesome
                name={item.attributes.like_by_me ? "heart" : "heart-o"}
                size={15}
                color={item.attributes.like_by_me ? "#DC2626" : "#94A3B8"}
              />
            </TouchableOpacity>
            <Text style={styles.likesCountText}>{item.attributes.likes_count}</Text>
          </View>
        </View>
      )
    }
  renderCommentsHiddenItem = (data: any, rowMap: any) => (
      <>
        {this.state.userInfo.id === (data.item.attributes.account_id).toString() && <View style={styles.rowBack}>
          <TouchableOpacity
            testID="editComment"
            style={[styles.backRightBtn, styles.backRightBtnLeft]}
            //onPress={() => this.handleEditComments(data.item, rowMap)} 
            >
            <Icon name="corner-up-left" size={25} color={"white"} />
          </TouchableOpacity>
          <TouchableOpacity
            testID="deleteComment"
            style={[styles.backRightBtn, styles.backRightBtnRight]}
            onPress={() => {
             // this.deleteCommentAPI(data.item.id)
            }}
          >
            <Icon name="trash" size={25} color={"white"} />
  
          </TouchableOpacity>
        </View>}
      </>
    )

  renderCommentsModal = () => {
    return (
          <Modal
            animationType="none"
            transparent={true}
            visible={this.state.showComments}
          >
            <KeyboardAvoidingView
              behavior={this.isPlatformiOS() ? "padding" : undefined}
              style={{ flex: 1 }}
            >
              <View style={[styles.centeredView, styles.commentsParentView]}>
                <View style={[styles.modalView, styles.commentsView]}>
                  <Pressable style={{ flex: 1 }} testID="commentsModalClick" onPress={() => this.hideKeyboard()} >
                    <View style={styles.commentsHeader}>
                      <Text style={styles.commentsHeadingText}>Comments</Text>
                      <TouchableOpacity
                        testID="closeCommentsPopupButton"
                        onPress={this.handleCloseCommentPopup}
                      >
                        <Icon name="x" size={25} />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.horizontalRuler} />
                    {
                      this.handleCommentsRendering()
                        
                    }
                  </Pressable>
                  {this.renderEmojiFormInput('Comment')}
                  {this.renderCommentFormSection('Comment')}

                </View>
              </View>
            </KeyboardAvoidingView>
          </Modal>
    )
  }
  renderRepliesModal = () => {
    return (
      <Modal
        animationType="none"
        transparent={true}
        visible={this.state.showReplies}
      >
        <KeyboardAvoidingView
          behavior={this.isPlatformiOS() ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <View style={[styles.centeredView, styles.commentsParentView]}>
            <View style={[styles.modalView, styles.commentsView]}>
              <Pressable style={{
                flex: 1
              }} testID="repliesModalClick" onPress={() => this.hideKeyboard()} >
                <View style={styles.commentsHeader}>
                  <TouchableOpacity testID="replyModalBackBtn" onPress={this.handleReplyBackNav}>
                    <Image source={leftArrow} style={{ width: 12, left: 0, resizeMode: "contain", tintColor: "#94A3B8" }} />
                  </TouchableOpacity>
                  <Text style={styles.commentsHeadingText}>Replies</Text>
                  <TouchableOpacity
                    testID="closeReplyPopupButton"
                    onPress={this.closeReplyPopup}
                  >
                    <Icon name="x" size={25} />
                  </TouchableOpacity>
                </View>
                <View style={styles.horizontalRuler} />
                {

                  this.renderReplies()
                }
              </Pressable>

              {this.renderEmojiFormInput('Reply')}
              {this.renderCommentFormSection('Reply')}
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    )
  }
  renderEmojiFormInput = (type : string) => {
    return (
    <View style={styles.emojiSelectionBar}>
      {this.defaultEmojisForSelectionBar.map((emoji: string, index) => (
        <TouchableOpacity testID={`emoji${type}-${index}`} key={emoji} onPress={() => this.handleEmojiSelected(emoji)}>
          <Text style={styles.emojiSelectionBarIcon}>{emoji}</Text>
        </TouchableOpacity>
      ))}
    </View>)
  }
  renderCommentFormSection = (type : string) => {
    const replyProps = {
      textInput : {
        testIdValue : 'replyTextInput',
        placeHolder : 'Add a reply...',
       },
       submitButton : {
        testIdValue : 'emojiReplyBtn',
       }

    }
    const commentSectionProps = {
       textInput : {
        testIdValue : 'commentTextInput',
        placeHolder : 'Add a comment...',
       },
       submitButton : {
        testIdValue : 'submitCommentBtn', 
       }
       
    }
    let formProps = type === 'Reply'? replyProps : commentSectionProps

    return (
        <View style={styles.commentInputArea}>
          <View style={styles.userAvatarContainer}>
            <FastImage
              source={this.state.userInfo.avatar ?
                {
                  uri: this.state.userInfo.avatar,
                  priority: FastImage.priority.high,
                } :
                defaultProfile
              }
              style={styles.userAvatar}
              resizeMode={FastImage.resizeMode.cover}
            />
          </View>
          <TextInput
            testID={formProps.textInput.testIdValue}
            value={this.state.commentedText}
            ref={(input) => { this.commentTextInput = input; }}
            onChangeText={(commentText) => this.handleCommentTextChange(commentText)}
            style={styles.commentTextInput}
            placeholder={formProps.textInput.placeHolder}
            multiline={true}
          />
          <TouchableOpacity
            testID={formProps.submitButton.testIdValue}
            style={styles.emojiButton}
            onPress={this.handleSubmitEditing}
          >
            <MaterialCommunityIcons name="send" color="#64748B" size={30} />
          </TouchableOpacity>
      </View>
    )
  }
  renderReplies = () => {
    const {commentWithReply} = this.state
    if(commentWithReply)
    return (
      <>
        <View style={[styles.rowFront]}>
          <TouchableOpacity testID="replies-avatar" style={styles.userAvatarContainer}
            onPress={() => this.showProfile(this.state.commentWithReply.attributes.account.id, this.state.commentWithReply.attributes.account.account_type)}
          >
            <FastImage
              source={commentWithReply?.attributes?.profile_image_url ? {
                uri: commentWithReply.attributes?.profile_image_url,
                priority: FastImage.priority.high,
              } :
                defaultProfile
              }
              style={styles.userAvatar}
              resizeMode={FastImage.resizeMode.cover}
            />
          </TouchableOpacity>
          
            {commentWithReply.attributes && (
              <View style={styles.flex1}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.commenterName}>
                    {commentWithReply.attributes.account.first_name}
                  </Text>
                  <Text style={[styles.commenterName, { fontWeight: '400', marginLeft: 5 }]}>{this.timeAgo(commentWithReply.attributes.created_at)}</Text>
                </View>
                <Text style={styles.replyText}>
                  {commentWithReply.attributes.comment}
                </Text>
            </View>
            )}
            
        </View>
        <SwipeListView
          bounces={false}
          alwaysBounceVertical={false}
          alwaysBounceHorizontal={false}
          data={this.state.commentWithReply.attributes?.replies}
          showsVerticalScrollIndicator={false}
          testID="swipeRepliesView"
          renderItem={(data: any) => (
            <View>
              {this.state.userInfo.id === (data.item.account_id).toString() ? (
                <SwipeListView
                  bounces={false}
                  alwaysBounceVertical={false}
                  alwaysBounceHorizontal={false}
                  data={[data.item]}
                  renderItem={this.renderRepliesItem}
                  renderHiddenItem={this.renderRepliesHiddenItem}
                  rightOpenValue={-120}
                  disableRightSwipe
                  listKey={`swipe-${data.item.id}`}
                />
              ) : (
                <SwipeListView
                  bounces={false}
                  alwaysBounceVertical={false}
                  alwaysBounceHorizontal={false}
                  data={[data.item]}
                  renderItem={this.renderRepliesItem}
                  renderHiddenItem={this.renderRepliesHiddenItem}
                  rightOpenValue={-120}
                  disableRightSwipe
                  disableLeftSwipe
                  listKey={`swipe-${data.item.id}`}
                />
              )}
            </View>
          )}
          renderHiddenItem={(data, rowMap) => null}
          rightOpenValue={0}
          disableRightSwipe
          disableLeftSwipe
          listKey="main"
        />
        {
          this.state.isCommentsLoading && <View style={{
            height: '100%',
            width: '100%',
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ActivityIndicator size="large" color="#4949EE" />
          </View>
        }
      </>
    )
  }
  renderRepliesHiddenItem = (data: any, rowMap: any) => (
      <>
        {this.state.userInfo.id === (data.item.account_id).toString() && <View style={styles.rowBack}>
          <TouchableOpacity
            testID="editReply"
            style={[styles.backRightBtn, styles.backRightBtnLeft]}
            //onPress={() => this.handleEditReply(data.item, rowMap)} 
            >
            <Icon name="corner-up-left" size={25} color={"white"} />
          </TouchableOpacity>
          <TouchableOpacity
            testID="deleteReply"
            style={[styles.backRightBtn, styles.backRightBtnRight]}
            //onPress={() =>  this.deleteCommentAPI(data.item.id)}
          >
            <Icon name="trash" size={25} color={"white"} />
          </TouchableOpacity>
        </View>}
      </>
    )

  renderRepliesItem = ({ item }: { item: any }) => {
    return (
      <View style={[styles.rowFront, {
        width: "95%",
        alignSelf: "flex-end",
      }]}
      >
        <TouchableOpacity
          style={styles.userAvatarContainer}
          onPress={() => this.showProfile(item.account_id, item.account_type)}
        >

          <FastImage
            source={item.profile_image ? {
              uri: item.profile_image,
              priority: FastImage.priority.high,
            } :
              defaultProfile
            }
            style={styles.userAvatar}
            resizeMode={FastImage.resizeMode.cover}
          />
        </TouchableOpacity>
        <View style={styles.flex1}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.commenterName}>
              {item.account_name}
            </Text>
            <Text style={[styles.commenterName, { fontWeight: '400', marginLeft: 5 }]}>{item.created_at ? this.timeAgo(item.created_at) : ""}</Text>
          </View>
          <Text style={styles.replyText}>
            {item.reply}
          </Text>
        </View>
      </View>
    )
  }
  // Customizable Area End

  render() {
    // Customizable Area Start
   if(this.state.isLoading){
    return(
      <View style={styles.loadingContainer}>
          <ActivityIndicator size={'large'} color="black" />
      </View>
    )
   }
    // Merge Engine - render - Start
    return (
      <SafeAreaView style={styles.container} >
          <View>
            {this.renderHeader()}
            {this.renderShow()}
            {this.editBtn()}
          </View>
          <FlatList
              data={this.state.eventsData}
              testID="eventsList"
              keyExtractor={(item) => item.id}
              renderItem={({item}) => this.renderEventList(item)}
              showsVerticalScrollIndicator={false}
              scrollEnabled
              contentContainerStyle={{ marginBottom:30}}
              refreshControl={
                <RefreshControl
                  refreshing={false}
                  tintColor="#4285f4"
                />
              }
              ListEmptyComponent={() => {
                return (
                  <View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', paddingTop: 50, height: deviceHeight - 400}}>
                    <Text style={{ fontSize: 14, fontWeight: '400', color: "#334155" }}>{"No record(s) found"}</Text>
                  </View>
                )
              }}
            />   
            {this.state.showAcceptBtn && this.renderAcceptBtn()}
            {this.renderCommentsModal()}
            {this.renderRepliesModal()}
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
    paddingHorizontal: 24,
    paddingVertical: 16,
    maxWidth: 650,
    backgroundColor: "#ffffffff",
  },
  headerContainer1: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 10,
  },
  backArrowIconSty: {
    width: 20
  },
  backArrowSty: {
    width: 12,
    left: 0,
    resizeMode: "contain",
  },
  headerTitleText: {
    fontWeight: "700",
    fontSize: 24,
    color: '#334155',
  },
  text: {
    fontFamily: "OpenSans",
    color: colors(false).text,
  },
  iconsContain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  hamburgerIconSty: {
    height: 24,
    width: 24,
 
  },

  date: {
    fontSize: 14, lineHeight: 22, color: "#334155", fontFamily: "OpenSans",
  },
  countShows: {
    fontSize: 16,
     lineHeight: 26,
     fontWeight: "bold",
     color: "black",
     fontFamily: "OpenSans",
     paddingVertical: 10,
     
  },
  row: {
    flexDirection: "row", alignItems: "center", marginBottom: 8
  },
  cardView: {
    padding: 10, backgroundColor: "#F1F5F9", borderRadius: 8
  },
  image: {
    marginRight: 10, width: 20, height: 20
  },
  editTextSty: {
    fontSize: 14,
     lineHeight: 22,
     fontWeight: "400",
     color: "#4949EE",
     fontFamily: "OpenSans"

  },
  editBtn: {
    alignSelf: "flex-end", paddingVertical: 8,
  },
  commentCount: {
    fontWeight: '700',
    fontSize: 12,
    lineHeight: 18,
    color: '#334155',
   
  },
  commentSty: {
    color: '#4949EE',
    fontWeight: '400',
    lineHeight: 18,
    fontSize: 12,
    marginLeft: 7
  },
  description: {
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 18,
    color: '#334155',
    
  },
  eventTitle: {
    fontWeight: '700',
    fontSize: 14,
    lineHeight: 18,
    color: '#334155',
    
  },
  likeText: {
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 22,
    color: '#334155',
  },
  commentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  countSty: {
    fontWeight: '700',
    color: '#4949EE'
  },
  calendar: {
    color: "#4949EE",
    fontWeight: '400',
    lineHeight: 18,
  },
  imageSty: {
    height: 24, width: 24,
  },
  subViewSty: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  viewSty: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8
  },
  
  gallerySty: {
    height: 178,
    width: '100%',
    resizeMode: 'contain',
    borderRadius: 8
    
  },
  viewContain: {
    flexDirection: 'column',
    paddingVertical: 10,
  },
  subView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    marginBottom: 18
    
  },
  location: {
    marginRight: 5,
    width: 20,
    height: 20,
    resizeMode: 'contain'
  },
  locationLinkText: {
    color: "#4949EE",
    fontSize: 12,
    fontWeight: "400"
  },
  nameText: {
    fontWeight: '700', fontSize: 14, lineHeight: 22, color: '#334155'
  },
  profileImg: {
     width: 44,
     height: 44 ,
     borderRadius: 99,
     resizeMode: 'contain'
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#ffffffdd',
    alignItems: "center",
    justifyContent: "center",
  },
  locationContainer: {
    flexDirection: 'row', alignItems: 'center' 
  },
  eventDescription: {
    marginLeft: 16 
  },
  eventLocationTitle: {
    color: colors(false).text
  },
  flex1: {
    flexGrow: 1
  },
  acceptCardView: {
    backgroundColor: "#7676FF",
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 8,
    marginBottom: 45,
    width:350,
    alignSelf:"center",
    position: 'absolute',
    bottom: -35,

  },
  acceptBtn: {
    color: '#3333CC', fontSize: 14, fontWeight: '700'
  },
  acceptBtnView: {
    backgroundColor: "#EDEDFF", alignSelf: "flex-end", paddingHorizontal: 10, borderRadius: 8, paddingVertical: 6
  },
  searchItineraryText: {
    color: colors(false).white, fontSize: 16, fontWeight: '400'
  },
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  commentsParentView: {
    backgroundColor: '#33415580',
  },
  modalView: {
    height: '40%',
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
  commentsView: {
    height: '75%',
    padding: 20,
    justifyContent: 'flex-start',
  },
  commentsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  commentsHeadingText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  horizontalRuler: {
    width: '100%',
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 15,
  },
  noCommentsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  emojiSelectionBar: {
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  emojiSelectionBarIcon: {
    fontSize: 20,
  },
  commentInputArea: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  userAvatarContainer: {
    backgroundColor: "#FCFCFF",
    width: 42,
    height: 42,
    borderRadius: 80,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: '#C5C5FF',
    marginRight: 10,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 75,
  },
  commentTextInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#C5C5FF",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingRight: 50,
    paddingTop: 12,
    height: '100%',
    fontSize: 16,
    textAlignVertical: 'center'
  },
  commentText: {
    fontSize: 14
  },
  emojiButton: {
    position: 'absolute',
    right: 10,
    height: 30,
    width: 30,
  },
  startConversationTextMargin: {
    marginTop: 5
  },
  rowBack: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 60,
  },
  backRightBtnLeft: {
    backgroundColor: '#33415580',
    right: 60,
  },
  backRightBtnRight: {
    backgroundColor: '#DC2626',
    right: 0,
  },
  rowFront: {
    alignItems: 'center',
    backgroundColor: '#FFF',
    width: '100%',
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
    paddingRight: 5,
  },
  commenterName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  replyButton: {
    alignSelf: "flex-start",
  },
  replyButtonText: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#94A3B8",
  },
  showReplyButton: {
    flexDirection: "row",
    alignSelf: "flex-start",
    alignItems: "center",
  },
  horizontalBar: {
    height: 1,
    width: 20,
    marginRight: 10,
    backgroundColor: "#94A3B8",
  },
  showReplyButtonText: {
    fontSize: 14,
    color: "#94A3B8"
  },
  likeContainer: {
    alignSelf: "flex-start",
    alignItems: "center",
    justifyContent: "center",
  },
  likesCountText: {
    color: "#94A3B8",
    textAlign: "center",
  },
  replyText: {
    marginTop: 10,
  },
});
// Customizable Area End

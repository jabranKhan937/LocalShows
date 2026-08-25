// Customizable Area Start
import React from "react";
import ItineraryDetailsController, {
  Props,
  EventData,
  configJSON
} from "./ItineraryDetailsController";
import Icon from "react-native-vector-icons/Feather";
import { SwipeListView } from 'react-native-swipe-list-view';
import {  ActivityIndicator,TouchableOpacity,  View, Text, Image,  StyleSheet, FlatList, RefreshControl, Pressable, Modal, KeyboardAvoidingView, TextInput, TouchableWithoutFeedback, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { redesignTheme } from "../../utilities/src/Colors";
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

  get styles() {
    return createItineraryDetailsStyles(this.getTravelResultsTheme());
  }

  // Customizable Area Start
  renderAcceptBtn = () => {
    const styles = this.styles;
    const theme = this.getTravelResultsTheme();
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
    const styles = this.styles;
    const theme = this.getTravelResultsTheme();
    return (
      <View style={styles.headerContainer1}>
        <View style={styles.headerTitleRow}>
          <TouchableOpacity
            testID="navigationBackButton"
            style={styles.backCircleBtn}
            onPress={this.handleBackNavigationPress}
            activeOpacity={0.8}
            hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
            <Icon name="arrow-left" size={18} color={theme.foreground} />
          </TouchableOpacity>
          <Text style={[styles.text, styles.headerTitleText]} numberOfLines={1}>
            {configJSON.headerTitle}
          </Text>
        </View>
        <View style={styles.iconsContain}>
          <TouchableOpacity
            testID="hamburgerBtn"
            onPress={() => this.props.navigation.openDrawer()}
            hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
            <Image
              style={[styles.hamburgerIconSty, {tintColor: theme.foreground}]}
              source={menuIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
    )
  }
  renderShow = () => {
    const styles = this.styles;
    const theme = this.getTravelResultsTheme();
    const {startDate, endDate , selectedCity, selectedState , selectedCountryCode, selectedType} = this.state.selectedParams
    const cityValue = selectedCity ? `${selectedCity}, ` : '';
    const stateValue = selectedState ? `${selectedState}, ` : '';

    return (
      <View>
        <Text style={styles.countShows}>{this.state.eventsData.length} {configJSON.searchShowsTitle}</Text>
        <View style={styles.cardView}>
          <View style={styles.row}>
          <Image source={calendarIcon} style={[styles.image, {tintColor: theme.primary}]} />
            <Text style={styles.date}>{`${startDate} - ${endDate}`}</Text>
          </View>

          <View style={styles.row}>
            <Image source={location} style={[styles.image, {tintColor: theme.primary}]} />
            <Text style={styles.date}>{`${cityValue}${stateValue}${selectedCountryCode}`}</Text>
          </View>

          <View style={styles.row}>
            <Image source={Theater} style={[styles.image, {tintColor: theme.primary}]} />
            <Text style={styles.date}>{selectedType ? `Show type : ${selectedType.attributes.name}` : 'Show type : All'}</Text>
          </View>
        </View>
      </View>
    )
  }
  editBtn = () => {
    const styles = this.styles;
    const theme = this.getTravelResultsTheme();
    return (
      <TouchableOpacity testID="searchBtn" onPress={this.handleEditSearchBtn} activeOpacity={0.7} style={styles.editBtn}>
        <Text style={styles.editTextSty}>{configJSON.editTextButton}</Text>
      </TouchableOpacity>
    )
  }
  renderEventList = (item : EventData) => {
    const styles = this.styles;
    const theme = this.getTravelResultsTheme();
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
                <Image source={location} style={[styles.location, {tintColor: theme.primary}]} />
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

                  <Image source={item.post.likeByMe ? favoriteFilled : favoriteOutfilled} style={[styles.imageSty, {tintColor: theme.primary}]} />


              </TouchableOpacity>

              <TouchableOpacity testID="commentIcon" style={{marginHorizontal: 7}} onPress={() => this.handleToogleModalShowComments(item)}>
                <Image source={chat} style={[styles.imageSty, {tintColor: theme.foreground}]} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={this.handleShare.bind(this,item.id,item.type)}
                testID="share">
                <Image source={share} style={[styles.imageSty, {tintColor: theme.foreground}]} />
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
    const styles = this.styles;
    const theme = this.getTravelResultsTheme();
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
                <Icon name="message-square" size={60} color={theme.foreground} />
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
              <ActivityIndicator size="large" color={theme.primary} />
            </View>
          }
        </>
      )
    }
    renderCommentItem = ({ item }: { item: any }) => {
    const styles = this.styles;
    const theme = this.getTravelResultsTheme();
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
                color={item.attributes.like_by_me ? theme.primary : theme.muted}
              />
            </TouchableOpacity>
            <Text style={styles.likesCountText}>{item.attributes.likes_count}</Text>
          </View>
        </View>
      )
    }
  renderCommentsHiddenItem = (data: any, rowMap: any) => {
    const styles = this.styles;
    const theme = this.getTravelResultsTheme();
    return (
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
    );
  }

  renderCommentsModal = () => {
    const styles = this.styles;
    const theme = this.getTravelResultsTheme();
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
                        <Icon name="x" size={25} color={theme.foreground} />
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
    const styles = this.styles;
    const theme = this.getTravelResultsTheme();
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
                    <Image source={leftArrow} style={{ width: 12, left: 0, resizeMode: "contain", tintColor: theme.muted }} />
                  </TouchableOpacity>
                  <Text style={styles.commentsHeadingText}>Replies</Text>
                  <TouchableOpacity
                    testID="closeReplyPopupButton"
                    onPress={this.closeReplyPopup}
                  >
                    <Icon name="x" size={25} color={theme.foreground} />
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
    const styles = this.styles;
    const theme = this.getTravelResultsTheme();
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
    const styles = this.styles;
    const theme = this.getTravelResultsTheme();
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
            placeholderTextColor={theme.muted}
            multiline={true}
          />
          <TouchableOpacity
            testID={formProps.submitButton.testIdValue}
            style={styles.emojiButton}
            onPress={this.handleSubmitEditing}
          >
            <MaterialCommunityIcons name="send" color={theme.primary} size={30} />
          </TouchableOpacity>
      </View>
    )
  }
  renderReplies = () => {
    const styles = this.styles;
    const theme = this.getTravelResultsTheme();
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
            <ActivityIndicator size="large" color={theme.primary} />
          </View>
        }
      </>
    )
  }
  renderRepliesHiddenItem = (data: any, rowMap: any) => {
    const styles = this.styles;
    const theme = this.getTravelResultsTheme();
    return (
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
    );
  }

  renderRepliesItem = ({ item }: { item: any }) => {
    const styles = this.styles;
    const theme = this.getTravelResultsTheme();
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
    const styles = this.styles;
    const theme = this.getTravelResultsTheme();
   if(this.state.isLoading){
    return(
      <View style={[styles.screen, {backgroundColor: theme.background}]}>
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <StatusBar
            barStyle={this.state.isDarkMode ? 'light-content' : 'dark-content'}
            backgroundColor={theme.background}
          />
          <View style={styles.loadingContainer}>
            <ActivityIndicator size={'large'} color={theme.primary} />
          </View>
        </SafeAreaView>
      </View>
    )
   }
    // Merge Engine - render - Start
    return (
      <View style={[styles.screen, {backgroundColor: theme.background}]}>
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <StatusBar
            barStyle={this.state.isDarkMode ? 'light-content' : 'dark-content'}
            backgroundColor={theme.background}
          />
          {this.renderHeader()}
          <View style={styles.content}>
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
              style={styles.list}
              contentContainerStyle={styles.listContent}
              refreshControl={
                <RefreshControl
                  refreshing={false}
                  tintColor={theme.primary}
                />
              }
              ListEmptyComponent={() => {
                return (
                  <View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background, paddingTop: 50, height: deviceHeight - 400}}>
                    <Text style={{ fontSize: 14, fontWeight: '400', color: theme.muted }}>{"No record(s) found"}</Text>
                  </View>
                )
              }}
            />   
            {this.state.showAcceptBtn && this.renderAcceptBtn()}
            {this.renderCommentsModal()}
            {this.renderRepliesModal()}
        </SafeAreaView>
      </View>
    );
    // Merge Engine - render - End
    // Customizable Area End
  }
}

type TravelResultsTheme = typeof redesignTheme;

const createItineraryDetailsStyles = (theme: TravelResultsTheme) => StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.background,
  },
  safeArea: {
    flex: 1,
    width: '100%',
    maxWidth: 650,
    alignSelf: 'center',
    backgroundColor: theme.background,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  list: {
    flex: 1,
    paddingHorizontal: 16,
  },
  listContent: {
    paddingBottom: 40,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    maxWidth: 650,
    backgroundColor: theme.background,
  },
  headerContainer1: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    height: 56,
    backgroundColor: theme.background,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.border,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 8,
  },
  backCircleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.input,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  backArrowIconSty: {
    width: 20
  },
  backArrowSty: {
    width: 16,
    left: 0,
    resizeMode: "contain",
  },
  headerTitleText: {
    fontWeight: "900",
    fontSize: 18,
    letterSpacing: 0.6,
    color: theme.foreground,
    textTransform: 'uppercase',
    flexShrink: 1,
  },
  text: {
    fontFamily: "OpenSans",
    color: theme.foreground,
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
    fontSize: 14, lineHeight: 22, color: theme.foreground, fontFamily: "OpenSans",
  },
  countShows: {
    fontSize: 16,
     lineHeight: 26,
     fontWeight: "bold",
     color: theme.foreground,
     fontFamily: "OpenSans",
     paddingVertical: 10,
     
  },
  row: {
    flexDirection: "row", alignItems: "center", marginBottom: 8
  },
  cardView: {
    padding: 12,
    backgroundColor: theme.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
  },
  image: {
    marginRight: 10, width: 20, height: 20
  },
  editTextSty: {
    fontSize: 14,
     lineHeight: 22,
     fontWeight: "400",
     color: theme.primary,
     fontFamily: "OpenSans"

  },
  editBtn: {
    alignSelf: "flex-end", paddingVertical: 8,
  },
  commentCount: {
    fontWeight: '700',
    fontSize: 12,
    lineHeight: 18,
    color: theme.foreground,
   
  },
  commentSty: {
    color: theme.primary,
    fontWeight: '400',
    lineHeight: 18,
    fontSize: 12,
    marginLeft: 7
  },
  description: {
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 18,
    color: theme.foreground,
    
  },
  eventTitle: {
    fontWeight: '700',
    fontSize: 14,
    lineHeight: 18,
    color: theme.foreground,
    
  },
  likeText: {
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 22,
    color: theme.foreground,
  },
  commentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  countSty: {
    fontWeight: '700',
    color: theme.primary
  },
  calendar: {
    color: theme.primary,
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
    color: theme.primary,
    fontSize: 12,
    fontWeight: "400"
  },
  nameText: {
    fontWeight: '700', fontSize: 14, lineHeight: 22, color: theme.foreground
  },
  profileImg: {
     width: 44,
     height: 44 ,
     borderRadius: 99,
     resizeMode: 'contain'
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.background,
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
    color: theme.foreground
  },
  flex1: {
    flexGrow: 1
  },
  acceptCardView: {
    backgroundColor: theme.primary,
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
    color: theme.primary, fontSize: 14, fontWeight: '700'
  },
  acceptBtnView: {
    backgroundColor: "#FFFFFF", alignSelf: "flex-end", paddingHorizontal: 10, borderRadius: 8, paddingVertical: 6
  },
  searchItineraryText: {
    color: '#FFFFFF', fontSize: 16, fontWeight: '400'
  },
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  commentsParentView: {
    backgroundColor: "rgba(8, 8, 15, 0.72)",
  },
  modalView: {
    height: '40%',
    justifyContent: 'space-between',
    backgroundColor: theme.card,
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
    color: theme.foreground,
  },
  horizontalRuler: {
    width: '100%',
    height: 1,
    backgroundColor: theme.divider,
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
    backgroundColor: theme.input,
    width: 42,
    height: 42,
    borderRadius: 80,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theme.border,
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
    borderColor: theme.border,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingRight: 50,
    paddingTop: 12,
    height: '100%',
    fontSize: 16,
    textAlignVertical: 'center',
    color: theme.foreground,
    backgroundColor: theme.input,
  },
  commentText: {
    fontSize: 14,
    color: theme.foreground,
  },
  emojiButton: {
    position: 'absolute',
    right: 10,
    height: 30,
    width: 30,
  },
  startConversationTextMargin: {
    marginTop: 5,
    color: theme.muted,
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
    backgroundColor: "rgba(8, 8, 15, 0.72)",
    right: 60,
  },
  backRightBtnRight: {
    backgroundColor: '#DC2626',
    right: 0,
  },
  rowFront: {
    alignItems: 'center',
    backgroundColor: theme.card,
    width: '100%',
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
    paddingRight: 5,
  },
  commenterName: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.foreground,
  },
  replyButton: {
    alignSelf: "flex-start",
  },
  replyButtonText: {
    fontWeight: "bold",
    fontSize: 14,
    color: theme.muted,
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
    backgroundColor: theme.muted,
  },
  showReplyButtonText: {
    fontSize: 14,
    color: theme.muted
  },
  likeContainer: {
    alignSelf: "flex-start",
    alignItems: "center",
    justifyContent: "center",
  },
  likesCountText: {
    color: theme.muted,
    textAlign: "center",
  },
  replyText: {
    marginTop: 10,
    color: theme.foreground,
  },
});
// Customizable Area End

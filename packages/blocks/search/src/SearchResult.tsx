import React from "react";
// Customizable Area Start
import {
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  SafeAreaView,
  TouchableOpacity,
  View,
  Image,
  Text,
  StatusBar,
  FlatList,
  Modal,
  KeyboardAvoidingView,
  TextInput,
  ActivityIndicator,
} from "react-native";
// Customizable Area End

// Customizable Area Start
import Icon from "react-native-vector-icons/Feather";
import { SwipeListView } from 'react-native-swipe-list-view';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { leftArrow, backIcon } from "../../events/src/assets";
import Svg, { Path } from "react-native-svg";
import { defaultProfile } from "../../user-profile-basic/src/assets";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FastImage from "../../../components/src/SafeFastImage"

// Customizable Area End

import SearchController, { Props, configJSON } from "./SearchController";

export default class SearchResult extends SearchController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }

  // Customizable Area Start
  defaultEmojisForSelectionBar = ["️💖", "🙌", "🔥", "👏", "😢", "😍", "😲", "😂"];

  renderPageHeader = () => {
    return (
      <View style={styles.header}>
        <TouchableOpacity
          testID="backBtn"
          style={styles.backContainer}
          onPress={() => { this.props.navigation.goBack(); }} >
          <Image source={leftArrow} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Search results</Text>
        <TouchableOpacity
          testID="hamburgerIcon"
          onPress={() => { this.props.navigation.openDrawer() }}>
          <Image style={styles.hamburgerIcon}
            source={require('../../../mobile/assets/images/Vector.png')} />
        </TouchableOpacity>
      </View>
    )
  }

  renderComments = () => {
    return (
      <>
        {
          this.state.commentsList.length ?
            <View style={styles.commentsListContainer}>
              {this.renderCommentsSwipeList()}
            </View>
            :
            <View style={styles.noComments}>
              <Icon name="message-square" size={60} color="#0F172A" />
              <Text style={styles.commentHeading}>No comments yet</Text>
              <Text style={styles.startConversation}>Start the conversation</Text>
            </View>
        }
      </>
    )
  }

  renderCommentsSwipeList = () => {
    return (
      <SwipeListView
        bounces={false}
        alwaysBounceVertical={false}
        alwaysBounceHorizontal={false}
        testID="mainSwipeListView"
        data={this.state.commentsList}
        renderItem={(data) => (
          <View>
            {this.state.userId === (data.item.attributes.account_id).toString() ? (
              <SwipeListView
                bounces={false}
                alwaysBounceVertical={false}
                alwaysBounceHorizontal={false}
                testID="commentsSwipableListView"
                data={[data.item]}
                renderItem={this.renderCommentItem}
                renderHiddenItem={this.renderHiddenComments}
                rightOpenValue={-120}
                disableRightSwipe
                listKey={`swipe-${data.item.id}`}
              />
            ) : (
              <SwipeListView
                bounces={false}
                alwaysBounceVertical={false}
                alwaysBounceHorizontal={false}
                testID="commentsNonSwipableListView"
                data={[data.item]}
                renderItem={this.renderCommentItem}
                renderHiddenItem={this.renderHiddenComments}
                rightOpenValue={-120}
                disableRightSwipe
                disableLeftSwipe
                listKey={`swipe-${data.item.id}`}
              />
            )}
          </View>
        )}
        extraData={this.state.showRepliesFor}
        renderHiddenItem={(data, rowMap) => null}
        rightOpenValue={0}
        disableRightSwipe
        disableLeftSwipe
        listKey="main"
      />
    )
  }

  renderHiddenComments = (data: any, rowMap: any) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        testID="editComment"
        style={[styles.backRightBtn, styles.backBtnLeft]}
        onPress={() => this.handleEditCommentSwipe(data, rowMap)} >
        <Icon name="corner-up-left" size={25} color={"white"} />
      </TouchableOpacity>
      <TouchableOpacity
        testID="deleteComment"
        style={[styles.backRightBtn, styles.backBtnRight]}
        onPress={() => {
          this.handleDeleteCommentAPI(data.item.id)
        }}
      >
        <Icon name="trash" size={25} color={"white"} />

      </TouchableOpacity>
    </View>
  )

  renderCommentItem = ({ item }: { item: any }) => {
    return (
      <View style={styles.rowFront}>
        <TouchableOpacity
          testID="imageShowProfile"
          style={styles.userAvatarView}
          onPress={() => this.handleProfileNavigation(item.attributes.account.id, item.attributes.account.account_type)}
        >
          <FastImage
            source={item.attributes.profile_image_url ?
              {
                uri: item.attributes.profile_image_url,
                priority: FastImage.priority.high
              } :
              defaultProfile
            }
            style={styles.userAvatarImg}
            resizeMode={FastImage.resizeMode.cover}
          />
        </TouchableOpacity>
        <View style={styles.commentContent}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.commenterName}>
              {`${item.attributes.account.first_name}`}
            </Text>
            <Text style={[styles.commenterName, { fontWeight: '400', marginLeft: 5 }]}>{this.timeAgo(item.attributes.updated_at)}</Text>
          </View>
          <Text style={styles.commentInput}>{item.attributes.comment}</Text>
          <TouchableOpacity
            testID="replyButton"
            style={styles.replyButton}
            onPress={() => this.handleReplyClick(item.id)}
          >
            <Text style={styles.replyButtonText}>Reply</Text>
          </TouchableOpacity>
          {
            item.attributes.replies.length !== 0 &&
            <TouchableOpacity
              testID="showReplyButton"
              style={styles.showReplyButton}
              onPress={() => this.handleViewMoreReplies(item)}
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
            onPress={() => this.handleLikeAComment(item.id)}
          >
            <FontAwesome
              name={item.attributes.like_by_me ? "heart" : "heart-o"}
              size={15}
              color={item.attributes.like_by_me ? "#DC2626" : "#94A3B8"}
            />
          </TouchableOpacity>
          <Text style={styles.likesCountTxt}>{item.attributes.likes_count}</Text>
        </View>
      </View>
    )
  }

  renderHiddenReplies = (data: any, rowMap: any) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        testID="editReply"
        style={[styles.backRightBtn, styles.backBtnLeft]}
        onPress={() => this.handleEditReplySwipe(data, rowMap)} >
        <Icon name="corner-up-left" size={25} color={"white"} />
      </TouchableOpacity>
      <TouchableOpacity
        testID="deleteReply"
        style={[styles.backRightBtn, styles.backBtnRight]}
        onPress={() => {
          this.handleDeleteCommentAPI(data.item.id)
        }}
      >
        <Icon name="trash" size={25} color={"white"} />
      </TouchableOpacity>
    </View>
  )

  renderModalReplies = () => {
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
            <TouchableOpacity activeOpacity={1} testID="repliesModal" onPress={() => this.hideKeyboard()} style={[styles.modalView, styles.commentView]}>
              <View style={styles.commentHeader}>
                <TouchableOpacity testID="replyModalBackBtn" onPress={this.handleReplyBackModal}>
                  <Image source={leftArrow} style={{ width: 12, left: 0, resizeMode: "contain", tintColor: "#94A3B8" }} />
                </TouchableOpacity>
                <Text style={styles.commentHeading}>Replies</Text>
                <TouchableOpacity
                  testID="closeReplyPopupButton"
                  onPress={this.handleReplyCloseModal}
                >
                  <Icon name="x" size={25} />
                </TouchableOpacity>
              </View>
              <View style={styles.horizontalRuler} />
              {
                this.state.commentsLoading ?
                  <View style={styles.noComments}>
                    <ActivityIndicator size="large" color="#4949EE" />
                  </View>
                  :
                  this.renderReplies()
              }
              <View style={styles.emojiSelection}>
                {this.defaultEmojisForSelectionBar.map((emoji: string) => (
                  <TouchableOpacity testID="emojiReply" key={emoji} onPress={() => this.handleEmojiSelected(emoji)}>
                    <Text style={styles.emojiSelectionBarIcon}>{emoji}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.commentInputArea}>
                <View style={styles.userAvatarView}>
                  <FastImage source={this.state.userProfilePic ?
                    {
                      uri: this.state.userProfilePic,
                      priority: FastImage.priority.high
                    } :
                    defaultProfile
                  }
                    style={styles.userAvatarImg}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                </View>
                <TextInput
                  testID="replyTextInput"
                  value={this.state.commentText}
                  ref={(input) => { this.commentTextInput = input; }}
                  onChangeText={(commentText) => this.handleCommentTxtChange(commentText)}
                  style={styles.commentReplyTextInput}
                  multiline
                />
                <TouchableOpacity
                  testID="emojiReplyBtn"
                  style={styles.emojiButtons}
                  onPress={this.handleCommentSubmitEditing}
                >
                  <MaterialCommunityIcons name="send" color="#64748B" size={30} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    )
  }

  renderReplies = () => {
    return (
      <>
        <View style={[styles.rowFront]}>
          <TouchableOpacity testID="repliesProfile" style={styles.userAvatarView}
            onPress={() => this.handleProfileNavigation(this.state.commentWithReply.attributes.account.id, this.state.commentWithReply.attributes.account.account_type)}
          >
            <FastImage
              source={this.state.commentWithReply.attributes?.profile_image_url ?
                {
                  uri: this.state.commentWithReply.attributes?.profile_image_url,
                  priority: FastImage.priority.high
                } :
                defaultProfile
              }
              style={styles.userAvatarImg}
              resizeMode={FastImage.resizeMode.cover}
            />
          </TouchableOpacity>
          <View style={styles.commentContent}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.commenterName}>
                {this.state.commentWithReply.attributes?.account.first_name}
              </Text>
              <Text style={[styles.commenterName, { fontWeight: '400', marginLeft: 5 }]}>{this.timeAgo(this.state.commentWithReply.attributes?.updated_at)}</Text>
            </View>
            <Text style={styles.replyInput}>
              {this.state.commentWithReply.attributes?.comment}
            </Text>
          </View>
        </View>
        {this.renderRepliesSwipeList()}
      </>
    )
  }

  renderRepliesSwipeList = () => {
    return (
      <SwipeListView
        bounces={false}
        alwaysBounceVertical={false}
        alwaysBounceHorizontal={false}
        testID="mainReplySwipeList"
        data={this.state.commentWithReply.attributes?.replies}
        renderItem={(data: any) => (
          <View>
            {this.state.userId === (data.item.account_id).toString() ? (
              <SwipeListView
                bounces={false}
                alwaysBounceVertical={false}
                alwaysBounceHorizontal={false}
                testID="replySwipableListView"
                data={[data.item]}
                renderItem={this.renderRepliesItem}
                renderHiddenItem={this.renderHiddenReplies}
                rightOpenValue={-120}
                disableRightSwipe
                listKey={`swipe-${data.item.id}`}
              />
            ) : (
              <SwipeListView
                bounces={false}
                alwaysBounceVertical={false}
                alwaysBounceHorizontal={false}
                testID="replyNonSwipableListView"
                data={[data.item]}
                renderItem={this.renderRepliesItem}
                renderHiddenItem={this.renderHiddenReplies}
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
    )
  }

  renderRepliesItem = ({ item }: { item: any }) => {
    return (
      <View style={[styles.rowFront, {
        width: "95%",
        alignSelf: "flex-end",
      }]}
      >
        <TouchableOpacity
          testID="imageShowProfileReply"
          style={styles.userAvatarView}
          onPress={() => this.handleProfileNavigation(item.account_id, item.account_type)}
        >
          <FastImage
            source={item.profile_image ?
              {
                uri: item.profile_image,
                priority: FastImage.priority.high
              } :
              defaultProfile
            }
            style={styles.userAvatarImg}
            resizeMode={FastImage.resizeMode.cover}
          />
        </TouchableOpacity>
        <View style={styles.commentContent}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.commenterName}>
              {item.account_name}
            </Text>
            <Text style={[styles.commenterName, { fontWeight: '400', marginLeft: 5 }]}>{item.updated_at ? this.timeAgo(item.updated_at) : ""}</Text>
          </View>
          <Text style={styles.replyInput}>
            {item.reply}
          </Text>
        </View>
      </View>
    )
  }

  renderLoginSignupPopup = () => {
    return (
      <>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.loginPopup}
        >
          <View style={[styles.centeredView, { backgroundColor: '#33415580' }]}>
            <View style={[styles.modalView]}>
              <View style={styles.crossLoginPopup}>
                <TouchableWithoutFeedback
                  testID="popupCloseButton"
                  style={styles.svgImage}
                  onPress={this.handleLoginPopup}
                >
                  <Icon name="x" color="#000" size={18} />
                </TouchableWithoutFeedback>
              </View>
              <Text style={styles.welcomeTo}>{configJSON.welcomeToPopupText}</Text>
              <Text style={styles.localShows}>{configJSON.localShowsPopupText}</Text>
              <Text style={styles.loginFirst}>{configJSON.loginFirstPopupText}</Text>
              <TouchableOpacity
                testID="createAccountBtn"
                onPress={() => { this.moveToLoginSignupScreen("signup") }}
              >
                <Text style={styles.createAccount}>{configJSON.createAccountPopupText}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                testID="loginBtn"
                style={styles.loginBtn}
                onPress={() => { this.moveToLoginSignupScreen("login") }}
              >
                <Text style={styles.loginTxt}>{configJSON.loginPopupText}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </>
    )
  }

  renderLikesCount = (item: any) => {
    return (
      <>

        {(item.attributes.likes_count) !== 0 &&
          <TouchableOpacity
            testID="likeThisTxt"
            onPress={() => this.handleLikeCountOnPress(item.id, item.type)}>
            <Text style={styles.likePeople}>{item.attributes.likes_count} people <Text
              style={styles.likeThis}
            >like this</Text>
            </Text>
          </TouchableOpacity>
        }

      </>
    )
  }

  renderLikeCommentsRow = (item: any) => {
    return (
      <View style={styles.actionButtonsRow}
      >
        <View style={styles.actionButtons}>
          <TouchableOpacity testID="likeBtn" onPress={() => this.handleLikeOnPress(item.id)}>
            <Image source={item.attributes.like_by_me ? require('../../../mobile/assets/images/favourite_filled.png') : require('../../../mobile/assets/images/image_favorite.png')} style={styles.likeIcon} />
          </TouchableOpacity>
          <TouchableOpacity
            testID="cmmentIcon"
            onPress={() => this.handleShowCommentClicked(item.id)}>
            <Image source={require('../../../mobile/assets/images/image_chat_bubble_outline_24px.png')} style={{
              marginLeft: 5,
            }} />
          </TouchableOpacity>
          {!item.attributes.added_in_calendar &&
            <TouchableOpacity testID="addToCalendarIcon" onPress={() => this.handleCalendarOnPress(item.id)}>
              <Image source={require('../../../mobile/assets/images/image_calendar.png')} style={styles.calendarIcon} />
            </TouchableOpacity>
          }
        </View>

        {!item.attributes.added_in_calendar && <TouchableOpacity testID="addToCalendar" onPress={() => this.handleCalendarOnPress(item.id)}>
          <Text style={styles.addToCalendar}>Add it to my calendar</Text>
        </TouchableOpacity>}
      </View>
    )
  }

  renderImageSection = (item: any) => {
    return (
      <TouchableWithoutFeedback
        testID="navigateToDetail"
        onPress={() => {
          const info = {
            eventId: item.id,
            eventState: item.attributes.state,
          }
          this.handleNavigationSearch("AllEventDetailScreen", info)
        }}>

        <View style={{
          marginTop: 10,
        }}>
          <FastImage
            style={styles.eventImg}
            source={{
              uri: item.attributes.profile_image,
              priority: FastImage.priority.high
            }}
            resizeMode={FastImage.resizeMode.contain}
          />
          {item.attributes.date_of_the_show !== "2999-12-31" && <View style={styles.dateBanner} >
            <Text style={styles.dateText} >
              {this.formatMonth(item.attributes.date_of_the_show)}
            </Text>
            <Text style={[styles.dateText, {
              fontWeight: '700',
            }]} >
              {this.formatDate(item.attributes.date_of_the_show)}
            </Text>
          </View>}
        </View>
      </TouchableWithoutFeedback>
    )
  }

  renderHeader = (item: any) => {
    return (
      <View style={styles.listHeader}>
        <TouchableOpacity testID="bandProfileImage" onPress={() => this.redirectToBandProfile(item.attributes.account_id)}>
          <FastImage
            style={styles.listIcon}
            source={item.attributes.band_profile_image?.trim() ? {
              uri: item.attributes.band_profile_image,
              priority: FastImage.priority.high
            } : require("../../../mobile/assets/images/default_profile.png")}
          />
        </TouchableOpacity>

        <View style={{
          marginLeft: 10,
        }}>
          <Text style={styles.listTitle}
            testID="bandName"
            onPress={() => this.redirectToBandProfile(item.attributes.account_id)}>
            {item.attributes.band_name}
          </Text>
          <TouchableOpacity
            testID="openMaps"
            onPress={() => { this.openGoogleMaps(item.attributes) }}
            style={styles.locationContainer}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image source={require('../../../mobile/assets/images/location-pin.png')} style={styles.locationIcon} />
              <Text style={{ color: "#334166" }}>{item.attributes.location} </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  renderEmptyComponent = () => {
    return (
      <View style={styles.emptyComponent}>
        <Text style={styles.noRecord}>{"No record(s) found"}</Text>
      </View>
    )
  }

  renderDescription = (item: any) => {
    return (
      <Text style={styles.eventTitle}
      >{item.attributes.event_title}' {item.type !== null ? item.type : ""}
        <Text style={styles.eventDescription}> - {item.attributes.description}</Text>
      </Text>
    )
  }

  renderCommentsCount = (item: any) => {
    return (
      <Text
        testID="commentsCount"
        style={{
          fontWeight: '700',
          fontSize: 14,
          lineHeight: 18,
          color: '#334155',
          marginTop: 6,
        }}
      >{item.attributes.comment_count ? item.attributes.comment_count : 0} comments  <Text testID="comments" style={styles.seeComments}
        onPress={() => this.handleShowCommentClicked(item.id)}
      >See the comments</Text>
      </Text>
    )
  }

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
            <TouchableOpacity activeOpacity={1} testID="commentsModal" onPress={() => this.hideKeyboard()} style={[styles.modalView, styles.commentView]}>
              <View style={styles.commentHeader}>
                <Text style={styles.commentHeading}>Comments</Text>
                <TouchableOpacity
                  testID="closeCommentsPopupButton"
                  onPress={this.handleCloseCommentModal}
                >
                  <Icon name="x" size={25} />
                </TouchableOpacity>
              </View>
              <View style={styles.horizontalRuler} />
              {this.renderComments()}
              <View style={styles.emojiSelection}>
                {this.defaultEmojisForSelectionBar.map((emoji: string) => (
                  <TouchableOpacity testID="emoji" key={emoji} onPress={() => this.handleEmojiSelected(emoji)}>
                    <Text style={styles.emojiSelectionBarIcon}>{emoji}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.commentInputArea}>
                <View style={styles.userAvatarView}>
                  <FastImage
                    source={this.state.userProfilePic ?
                      {
                        uri: this.state.userProfilePic,
                        priority: FastImage.priority.high
                      } :
                      defaultProfile
                    }
                    resizeMode={FastImage.resizeMode.cover}
                    style={styles.userAvatarImg}
                  />
                </View>
                <TextInput
                  testID="commentTextInput"
                  ref={(input) => { this.commentTextInput = input; }}
                  style={styles.commentReplyTextInput}
                  placeholder={this.state.replying ? "Add a reply..." : "Add a comment..."}
                  value={this.state.commentText}
                  onChangeText={(commentText) => this.handleCommentTxtChange(commentText)}
                  multiline
                />
                <TouchableOpacity
                  testID="emojiCommentBtn"
                  style={styles.emojiButtons}
                  onPress={this.handleCommentSubmitEditing}
                >
                  <MaterialCommunityIcons name="send" color="#64748B" size={30} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    )
  }

  getEventListForFlatList = () => {
    const el = this.state.eventList as any;
    if (el == null) {
      return [];
    }
    if (Array.isArray(el)) {
      return el;
    }
    if (typeof el === 'object') {
      return Object.values(el);
    }
    return [];
  };

  renderSearchData = () => {
    return (
      <FlatList
        testID="eventFlatlist"
        data={this.getEventListForFlatList()}
        renderItem={({ item }: { item: any }) => {
          return (
            <View style={styles.listContainer}>
              {this.renderHeader(item)}
              {this.renderImageSection(item)}
              {this.renderLikeCommentsRow(item)}
              {this.renderLikesCount(item)}
              {this.renderDescription(item)}
              {this.renderCommentsCount(item)}
            </View>
          )
        }}
        keyExtractor={(item:any) => item.id}
        ListEmptyComponent={this.renderEmptyComponent}
      />
    )
  }

  // Customizable Area End

  render() {
    // Customizable Area Start
    return (
      <SafeAreaView style={styles.parentContainer}>
        <StatusBar
          animated={true}
          hidden={false}
          backgroundColor="white"
        />
        <ScrollView keyboardShouldPersistTaps="always" style={styles.container} bounces={false}>
          {/* Customizable Area Start */}
          <TouchableWithoutFeedback
            testID={"hideKeyboard"}
            onPress={() => {
              this.hideKeyboard();
            }}>
            <>
              {this.renderPageHeader()}
              {this.renderSearchData()}
            </>

            {/* Customizable End Start */}
          </TouchableWithoutFeedback>
          {this.renderLoginSignupPopup()}
          {this.renderCommentsModal()}
          {this.renderModalReplies()}

        </ScrollView>
      </SafeAreaView>
      //Merge Engine End DefaultContainer
    );
    // Customizable Area End
  }
}

// Customizable Area Start

const styles = StyleSheet.create({
  parentContainer: {
    flex: 1,
    backgroundColor: "#fcfcff",
  },
  container: {
    flex: 1,
    marginLeft: "auto",
    marginRight: "auto",
    width: "100%",
    maxWidth: 650,
    backgroundColor: "#FFF",
  },
  hamburgerIcon: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
  },
  dateBanner: {
    position: 'absolute',
    top: 20,
    right: 20,
    paddingVertical: 7,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: '#4949EE',
    flexWrap: 'wrap',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    height: 50,
    paddingHorizontal: 16,
  },
  backContainer: {
    width:20
  },
  backIcon: {
    width: 12,
    left: 0,
    resizeMode: "contain",
  },
  headerTitle: {
    fontWeight: '700',
    fontSize: 24,
    color: '#0F172A',
    textAlign: 'center'
  },
  listContainer: {
    flexDirection: 'column',
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 2,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
  },
  listIcon: {
    borderRadius: 50,
    width: 50,
    height: 50,
  },
  listTitle: {
    fontWeight: '700',
    fontSize: 14,
    lineHeight: 22,
    color: '#334155'
  },
  locationContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  locationIcon: {
    marginRight: 5,
    width: 20,
    height: 20,
    resizeMode: 'contain'
  },
  eventImg: {
    width: '100%',
    height: 200,
  },
  imageOverlay: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 10,
    left: 10,
    padding: 5,
    width: '90%',
    justifyContent: 'space-between'
  },
  eventTypeText: {
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 18,
    color: '#FFFFFF',
  },
  eventTitleText: {
    fontWeight: '700',
    fontSize: 24,
    color: '#FFFFFF',
    paddingTop: 5,
    marginTop: 2,
    letterSpacing: -0.5,
  },
  dateText: {
    fontWeight: '400',
    fontSize: 20,
    color: "#FFFFFF",
    textAlign: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingTop: 22,
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
  welcomeTo: {
    textAlign: 'center',
    fontSize: 20,
    lineHeight: 32,
    marginTop: 10,
    color: "#334166",
  },
  localShows: {
    fontWeight: '700',
    fontSize: 28,
    lineHeight: 32,
    bottom: '5%',
    textAlign: 'center',
    color: '#3333CC',
    marginVertical: 10,
  },
  loginFirst: {
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: '5%',
    fontWeight: '400',
    fontSize: 16,
    color: '#334166',
  },
  createAccount: {
    color: '#3333CC',
    fontWeight: '700',
    lineHeight: 24,
    marginBottom: '4%',
    fontSize: 16,
    textAlign: 'center',
  },
  loginBtn: {
    backgroundColor: '#3333CC',
    borderRadius: 8,
    height: 56,
    justifyContent: 'center',
  },
  loginTxt: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  svgImage: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 20,
    height: 20,
  },
  commentsParentView: {
    backgroundColor: '#33415580',
  },
  commentView: {
    height: '75%',
    padding: 20,
    justifyContent: 'flex-start',
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  commentHeading: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  horizontalRuler: {
    width: '100%',
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 15,
  },
  commentsListContainer: {
    flex: 1,
  },
  emojiSelection: {
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
    justifyContent: 'center',
  },
  userAvatarImg: {
    width: 40,
    height: 40,
    borderRadius: 75,
  },
  userAvatarView: {
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
  commentReplyTextInput: {
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
  emojiButtons: {
    position: 'absolute',
    right: 10,
    height: 30,
    width: 30,
  },
  noComments: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  startConversation: {
    marginTop: 5,
  },
  commentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  commentContent: {
    flex: 1
  },
  commenterName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  commentInput: {
    fontSize: 14
  },
  likeContainer: {
    alignSelf: "flex-start",
    alignItems: "center",
    justifyContent: "center",
  },
  likesCountTxt: {
    color: "#94A3B8",
    textAlign: "center",
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
  replyInput: {
    marginTop: 10,
  },
  rowBack: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
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
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 60,
  },
  backBtnLeft: {
    backgroundColor: '#33415580',
    right: 60,
  },
  backBtnRight: {
    backgroundColor: '#DC2626',
    right: 0,
  },
  crossLoginPopup: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  likePeople: {
    fontWeight: '700',
    color: '#4949EE',
  },
  likeThis: {
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 22,
    color: '#334155',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  likeIcon: {
    tintColor: "#4949EE",
    height: 20,
    width: 22,
  },
  calendarIcon: {
    marginLeft: 5,
    tintColor: '#4949EE',
    height: 20, width: 19,
  },
  addToCalendar: {
    color: "#4949EE",
    fontWeight: '400',
    lineHeight: 18,
  },
  emptyComponent: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingTop: 50,
  },
  noRecord: {
    fontSize: 14,
    fontWeight: '400',
    color: "#334155",
  },
  eventTitle: {
    fontWeight: '700',
    fontSize: 14,
    lineHeight: 22,
    color: '#334155',
    marginTop: 6,
  },
  eventDescription: {
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 22,
    color: '#334155',
  },
  seeComments: {
    color: '#4949EE',
    fontWeight: '400',
    lineHeight: 18,
    fontSize: 14,
  },
});
// Customizable Area End

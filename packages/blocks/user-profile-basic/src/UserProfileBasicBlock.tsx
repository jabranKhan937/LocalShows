import React from 'react';
// Customizable Area Start
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  StatusBar,
  SafeAreaView,
  FlatList,
  Dimensions,
  ActivityIndicator,
  Modal,
  TextInput,
  Platform,
  Alert,
  Linking,
} from 'react-native';

import {
  hamburgerWhite,
  leftArrowWhite,
  location,
  defaultProfile,
} from './assets';
import {
  lightTheme,
  redesignTheme,
} from '../../utilities/src/Colors';
import Feather from 'react-native-vector-icons/Feather';
import MCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FntAwesome from 'react-native-vector-icons/FontAwesome';
import { RowMap, SwipeListView } from 'react-native-swipe-list-view';
import {
  ICommentItem,
  IReplyItem,
  configJSON,
} from './UserProfileBasicController';
import { IEvent } from './UserProfileBasicController';
import { leftArrow } from '../../events/src/assets';
import FastImage from '../../../components/src/SafeFastImage';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import {
  getStorageData,
  removeStorageData,
  deviceWidth,
} from '../../../framework/src/Utilities';
// Customizable Area End

import UserProfileBasicController, {
  Props,
} from './UserProfileBasicController';

export default class UserProfileBasicBlock extends UserProfileBasicController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }

  get styles() {
    return this.state.isDarkMode ? darkProfileStyles : lightProfileStyles;
  }

  // Customizable Area Start

  renderEvents = ({ item }: { item: IEvent }) => {
    const title = (item.event_title || item.band_name || '').toString();
    const month = this.getFormattedFullMonth(item.date_of_the_show);
    const day = this.getFullDate(item.date_of_the_show);
    const dateLabel = `${month} ${day}`.trim();
    const subtitle = [item.location, dateLabel].filter(Boolean).join(' · ');
    const thumbUri = (item.profile_image || item.band_profile_image || '').trim();
    return (
      <View style={this.styles.eventContainer}>
        <View style={this.styles.compactCard}>
          <TouchableWithoutFeedback
            testID="navigateToDetail"
            onPress={() => this.handleShowDetailsNav(item, item.state)}
          >
            <View style={this.styles.compactCardMain}>
              <TouchableOpacity
                testID="bandPicture"
                onPress={() => this.handleProfileNavigation(item.account_id)}
              >
                <FastImage
                  style={this.styles.compactThumb}
                  source={
                    thumbUri
                      ? {
                          uri: thumbUri,
                          priority: FastImage.priority.high,
                        }
                      : require('../../../mobile/assets/images/default_profile.png')
                  }
                  resizeMode={FastImage.resizeMode.cover}
                />
              </TouchableOpacity>
              <View style={this.styles.compactCardCopy}>
                <TouchableOpacity
                  testID="bandName"
                  onPress={() => this.handleProfileNavigation(item.account_id)}
                >
                  <Text style={this.styles.compactCardTitle} numberOfLines={1}>
                    {title.toUpperCase()}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  testID="openLocation"
                  onPress={() => this.openGoogleMaps(item)}
                >
                  <Text style={this.styles.compactCardSubtitle} numberOfLines={1}>
                    {subtitle}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
          <TouchableOpacity
            testID="likeEventBtn"
            style={this.styles.compactLikeBtn}
            onPress={() => this.toggleLikeApi(`${item.id}`)}
          >
            {item.like_by_me ? (
              <Image
                style={this.styles.compactLikeIconFilled}
                source={require('../../../mobile/assets/images/favourite_filled.png')}
              />
            ) : (
              <Image
                style={this.styles.compactLikeIcon}
                source={require('../../../mobile/assets/images/image_favorite.png')}
              />
            )}
          </TouchableOpacity>
        </View>
        <View style={this.styles.likeCommentShareIcon}>
          <View style={this.styles.flexRow}>
            <TouchableOpacity
              testID="commentBubble"
              onPress={() => this.handleShowComments(item.id.toString())}
            >
              <Image
                source={require('../../../mobile/assets/images/image_chat_bubble_outline_24px.png')}
                style={this.styles.actionIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              testID="shareEventBtn"
              onPress={() => this.handleShareEvent(`${item.id}`, item.type)}
            >
              <Image
                source={require('../../../mobile/assets/images/image_share_24px.png')}
                style={this.styles.actionIcon}
              />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          testID="likeThisTxt"
          onPress={() => this.handleLikeNav(item)}
          style={this.styles.flexRow}
        >
          <Text style={this.styles.people}>
            {item.likes_count}
            {' people '}
          </Text>
          <Text style={this.styles.likeThisText}>like this</Text>
        </TouchableOpacity>
        <View style={this.styles.flexRow}>
          <Text
            style={[
              this.styles.boldText,
              {
                marginTop: 6,
              },
            ]}
          >
            {item.event_title}' {'Concert'}
            <Text style={this.styles.descriptionText}>
              {` - ${item.description}`}
            </Text>
          </Text>
        </View>
        <View
          style={[
            this.styles.flexRow,
            {
              marginTop: 6,
            },
          ]}
        >
          <Text
            style={[
              this.styles.boldText,
              {
                lineHeight: 18,
              },
            ]}
          >
            {`${item.comment_count} comments `}
          </Text>
          <TouchableOpacity
            testID="showCommentsBtn"
            onPress={() => this.handleShowComments(`${item.id}`)}
          >
            <Text style={this.styles.seeCommentsText}>See the comments</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  renderCategories = ({ item }: { item: any }) => {
    return (
      <View style={this.styles.categoryContainer}>
        <Text style={[this.styles.text, this.styles.categoryName]}>
          {item.name ? item.name : item.attributes.name}
        </Text>
        {item.user_sub_categories ? (
          <Text style={[this.styles.text, this.styles.categoryElems]}>
            {item.user_sub_categories
              .map((subcat: any) => subcat.name)
              .join(', ')}
          </Text>
        ) : (
          <Text style={[this.styles.text, this.styles.categoryElems]}>
            {'No data available'}
          </Text>
        )}
      </View>
    );
  };

  renderComment = ({ item }: { item: ICommentItem }) => {
    return (
      <View style={this.styles.frontRow}>
        <TouchableOpacity
          testID="imgShowProfile"
          style={this.styles.userAvatarView}
          onPress={() =>
            this.showProfile(
              `${item.attributes.account.id}`,
              item.attributes.account.account_type,
            )
          }
        >
          <FastImage
            source={
              item.attributes.profile_image_url
                ? {
                    uri: item.attributes.profile_image_url,
                    priority: FastImage.priority.high,
                  }
                : defaultProfile
            }
            resizeMode={FastImage.resizeMode.cover}
            style={this.styles.userAvatarImage}
          />
        </TouchableOpacity>
        <View style={this.styles.commentContentContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={this.styles.commenterNameText}>
              {`${item.attributes.account.first_name}`}
            </Text>
            <Text
              style={[
                this.styles.commenterNameText,
                { fontWeight: '400', marginLeft: 5 },
              ]}
            >
              {this.timeSince(item.attributes.created_at)}
            </Text>
          </View>
          <Text style={this.styles.commentText}>{item.attributes.comment}</Text>
          <TouchableOpacity
            testID="replyButton"
            style={this.styles.replyBtn}
            onPress={() => this.handleReplyPressed(`${item.id}`)}
          >
            <Text style={this.styles.replyBtnText}>Reply</Text>
          </TouchableOpacity>
          {item.attributes.replies.length !== 0 && (
            <TouchableOpacity
              testID="showReplyButton"
              style={this.styles.showReplyBtn}
              onPress={() => this.handleShowReplies(item)}
            >
              <View style={this.styles.horizontalBar} />
              <Text style={this.styles.showReplyBtnText}>
                {`View ${item.attributes.replies.length} more replies`}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={this.styles.likeView}>
          <TouchableOpacity
            testID="likeCommentButton"
            onPress={() => this.likeComments(item.id.toString())}
          >
            <FntAwesome
              name={item.attributes.like_by_me ? 'heart' : 'heart-o'}
              size={15}
              color={item.attributes.like_by_me ? '#DC2626' : '#94A3B8'}
            />
          </TouchableOpacity>
          <Text style={this.styles.likeCountText}>
            {item.attributes.likes_count}
          </Text>
        </View>
      </View>
    );
  };

  renderHiddenComment = (
    data: { item: ICommentItem },
    rowMap: RowMap<ICommentItem>,
  ) => (
    <>
      {this.state.userID === data.item?.attributes?.account_id?.toString() && (
        <View style={this.styles.backRow}>
          <TouchableOpacity
            testID="editComment"
            style={[this.styles.backBtn, this.styles.backBtnLeft]}
            onPress={() => this.handleEditComment(data.item, rowMap)}
          >
            <Feather name="corner-up-left" size={25} color={'white'} />
          </TouchableOpacity>
          <TouchableOpacity
            testID="deleteComment"
            style={[this.styles.backBtn, this.styles.backBtnRight]}
            onPress={() => {
              this.deleteComment(`${data.item.id}`);
            }}
          >
            <Feather name="trash" size={25} color={'white'} />
          </TouchableOpacity>
        </View>
      )}
    </>
  );

  renderComments = () => {
    return (
      <>
        {this.state.comments.length ? (
          <View style={this.styles.commentsListView}>
            <SwipeListView
              bounces={false}
              alwaysBounceVertical={false}
              alwaysBounceHorizontal={false}
              testID="commentMainSwipeList"
              data={this.state.comments}
              renderItem={data => (
                <View>
                  {this.state.userID ===
                  data.item?.attributes?.account_id?.toString() ? (
                    <SwipeListView
                      bounces={false}
                      alwaysBounceVertical={false}
                      alwaysBounceHorizontal={false}
                      testID="commentSwipeList"
                      data={[data.item]}
                      renderItem={this.renderComment}
                      renderHiddenItem={this.renderHiddenComment}
                      rightOpenValue={-120}
                      disableRightSwipe
                      listKey={`swipe-${data.item.id}`}
                    />
                  ) : (
                    <SwipeListView
                      bounces={false}
                      alwaysBounceVertical={false}
                      alwaysBounceHorizontal={false}
                      testID="commentNonSwipeList"
                      data={[data.item]}
                      renderItem={this.renderComment}
                      renderHiddenItem={this.renderHiddenComment}
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
          </View>
        ) : (
          <View style={this.styles.noCommentsView}>
            <Feather name="message-square" size={60} color="#0F172A" />
            <Text style={this.styles.commentsHeaderText}>No comments yet</Text>
            <Text style={this.styles.startConversation}>Start the conversation</Text>
          </View>
        )}
        {this.state.commentsLoading && (
          <View
            style={{
              height: '100%',
              width: '100%',
              position: 'absolute',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ActivityIndicator size="large" color={this.getProfileTheme().primary} />
          </View>
        )}
      </>
    );
  };

  renderRepliesModal = () => {
    return (
      <Modal
        animationType="none"
        transparent={true}
        visible={this.state.showReplies}
      >
        <KeyboardAvoidingView
          behavior={this.isPlatformiOS() ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          <View style={this.styles.commentsModalParentView}>
            <TouchableOpacity
              activeOpacity={1}
              testID="repliesModal"
              onPress={() => this.hideKeyboard()}
              style={this.styles.commentsContainer}
            >
              <View style={this.styles.commentsHeading}>
                <TouchableOpacity
                  testID="replyModalBackBtn"
                  onPress={this.handleReplyBack}
                >
                  <Image
                    source={leftArrow}
                    style={{
                      width: 12,
                      left: 0,
                      resizeMode: 'contain',
                      tintColor: '#94A3B8',
                    }}
                  />
                </TouchableOpacity>
                <Text style={this.styles.commentsHeaderText}>Replies</Text>
                <TouchableOpacity
                  testID="closeReplyPopupButton"
                  onPress={this.closeReplyModal}
                >
                  <Feather name="x" size={25} />
                </TouchableOpacity>
              </View>
              <View style={this.styles.separator} />
              {this.renderReplies()}
              <View style={this.styles.emojiSelectionStrip}>
                {this.defaultEmojisForSelectionStrip.map(
                  (emoji: string, index: number) => (
                    <TouchableOpacity
                      testID={`emojiReply${index}`}
                      key={emoji}
                      onPress={() => this.handleEmojiSelection(emoji)}
                    >
                      <Text style={this.styles.emojiSelectionStripIcon}>
                        {emoji}
                      </Text>
                    </TouchableOpacity>
                  ),
                )}
              </View>
              <View style={this.styles.commentInputContainer}>
                <View style={this.styles.userAvatarView}>
                  <FastImage
                    source={
                      this.state.profilePic
                        ? {
                            uri: this.state.profilePic,
                            priority: FastImage.priority.high,
                          }
                        : defaultProfile
                    }
                    style={this.styles.userAvatarImage}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                </View>
                <TextInput
                  testID="replyTextInput"
                  value={this.state.comment}
                  ref={input => {
                    this.commentTextInput = input;
                  }}
                  onChangeText={commentText =>
                    this.handleCommentChange(commentText)
                  }
                  style={this.styles.commentInput}
                  placeholder={'Add a reply...'}
                  multiline
                />
                <TouchableOpacity
                  testID="emojiReplyBtn"
                  style={this.styles.emojiBtn}
                  onPress={this.handleSubmit}
                >
                  <MCommunityIcons name="send" color="#64748B" size={30} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    );
  };

  renderTnCUpdateModalPopup = () => {
    return (
      <Modal
        animationType="none"
        statusBarTranslucent={true}
        transparent={true}
        visible={this.state.showTncPopup}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(51, 65, 85, 0.5)',
            justifyContent: 'flex-end',
          }}
        >
          <View style={this.styles.tncModal}>
            <View
              style={{
                padding: 20,
                width: '100%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-end',
                // backgroundColor:'red'
              }}
            >
              <TouchableWithoutFeedback
                testID="TnCPopupCloseBtn"
                onPress={() => {
                  this.closeTnCModalPopup();
                }}
              >
                <Feather name="x" size={25} />
              </TouchableWithoutFeedback>
            </View>
            <View
              style={{
                flex: 1,
              }}
            >
              <Text
                style={{
                  color: '#0F172A',
                  fontSize: 24,
                  fontWeight: '700',
                  paddingLeft: 24,
                }}
              >
                Terms And Conditions Update
              </Text>
              <Text
                style={{
                  paddingHorizontal: 24,
                  color: '#0F172A',
                  fontWeight: '400',
                  marginTop: 8,
                  fontSize: 16,
                }}
              >
                We have just updated our terms and conditions. please check them
                out
              </Text>
              <View
                style={{
                  flex: 1,
                  paddingHorizontal: 25,
                  paddingBottom: 32,
                  justifyContent: 'flex-end',
                }}
              >
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <TouchableOpacity
                    testID="TnCPopupCloseBtn2"
                    onPress={() => {
                      this.closeTnCModalPopup();
                    }}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={{
                        color: '#3333CC',
                        fontSize: 16,
                        fontWeight: '700',
                      }}
                    >
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <TouchableOpacity
                    testID="checkoutTnCbtn"
                    onPress={() => {
                      this.handleTnCUpdateCheckOutModal();
                    }}
                    activeOpacity={0.7}
                    style={{
                      paddingVertical: 16,
                      backgroundColor: '#3333CC',
                      width: '100%',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 8,
                      marginTop: 24,
                    }}
                  >
                    <Text
                      style={{
                        color: '#FFFFFF',
                        fontSize: 16,
                        fontWeight: '700',
                      }}
                    >
                      Check Out
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  renderReplies = () => {
    return (
      <>
        <View style={[this.styles.frontRow, { paddingHorizontal: 20 }]}>
          <TouchableOpacity
            testID="userProfileImage"
            style={this.styles.userAvatarView}
            onPress={() =>
              this.showProfile(
                `${this.state.commentWithReply.attributes.account.id}`,
                this.state.commentWithReply.attributes.account.account_type,
              )
            }
          >
            <FastImage
              source={
                this.state.commentWithReply.attributes.profile_image_url
                  ? {
                      uri: this.state.commentWithReply.attributes
                        .profile_image_url,
                      priority: FastImage.priority.high,
                    }
                  : defaultProfile
              }
              style={this.styles.userAvatarImage}
              resizeMode={FastImage.resizeMode.cover}
            />
          </TouchableOpacity>
          <View style={this.styles.commentContentContainer}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={this.styles.commenterNameText}>
                {this.state.commentWithReply.attributes?.account.first_name}
              </Text>
              <Text
                style={[
                  this.styles.commenterNameText,
                  { fontWeight: '400', marginLeft: 5 },
                ]}
              >
                {this.timeSince(
                  this.state.commentWithReply.attributes?.created_at,
                )}
              </Text>
            </View>
            <Text style={this.styles.replyText}>
              {this.state.commentWithReply.attributes?.comment}
            </Text>
          </View>
        </View>
        <SwipeListView
          bounces={false}
          alwaysBounceVertical={false}
          alwaysBounceHorizontal={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
          }}
          testID="replyMainSwipeList"
          data={this.state.commentWithReply.attributes?.replies}
          renderItem={(data: any) => (
            <View>
              {this.state.userID === data.item.account_id.toString() ? (
                <SwipeListView
                  bounces={false}
                  alwaysBounceVertical={false}
                  alwaysBounceHorizontal={false}
                  testID="replySwipeList"
                  data={[data.item]}
                  renderItem={this.renderReplyItem}
                  renderHiddenItem={this.renderHiddenReplyItem}
                  rightOpenValue={-120}
                  disableRightSwipe
                  listKey={`swipe-${data.item.id}`}
                />
              ) : (
                <SwipeListView
                  bounces={false}
                  alwaysBounceVertical={false}
                  alwaysBounceHorizontal={false}
                  testID="replyNonSwipeList"
                  data={[data.item]}
                  renderItem={this.renderReplyItem}
                  renderHiddenItem={this.renderHiddenReplyItem}
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
        {this.state.commentsLoading && (
          <View
            style={{
              height: '100%',
              width: '100%',
              position: 'absolute',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ActivityIndicator size="large" color={this.getProfileTheme().primary} />
          </View>
        )}
      </>
    );
  };

  renderReplyItem = ({ item }: { item: IReplyItem }) => {
    return (
      <View
        style={[
          this.styles.frontRow,
          {
            width: '95%',
            alignSelf: 'flex-end',
          },
        ]}
      >
        <TouchableOpacity
          testID="showProfileBtn"
          style={this.styles.userAvatarView}
          onPress={() =>
            this.showProfile(`${item.account_id}`, item.account_type)
          }
        >
          <FastImage
            source={
              item.profile_image
                ? {
                    uri: item.profile_image,
                    priority: FastImage.priority.high,
                  }
                : defaultProfile
            }
            style={this.styles.userAvatarImage}
            resizeMode={FastImage.resizeMode.cover}
          />
        </TouchableOpacity>
        <View style={this.styles.commentContentContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={this.styles.commenterNameText}>{item.account_name}</Text>
            <Text
              style={[
                this.styles.commenterNameText,
                { fontWeight: '400', marginLeft: 5 },
              ]}
            >
              {item.created_at ? this.timeSince(item.created_at) : ''}
            </Text>
          </View>
          <Text style={this.styles.replyText}>{item.reply}</Text>
        </View>
      </View>
    );
  };

  renderHiddenReplyItem = (
    data: { item: IReplyItem },
    rowMap: RowMap<IReplyItem>,
  ) => (
    <>
      {this.state.userID === data.item.account_id.toString() && (
        <View style={this.styles.backRow}>
          <TouchableOpacity
            testID="editReply"
            style={[this.styles.backBtn, this.styles.backBtnRight]}
            onPress={() => this.handleEditReply(data.item, rowMap)}
          >
            <Feather name="corner-up-left" size={25} color={'white'} />
          </TouchableOpacity>
          <TouchableOpacity
            testID="deleteReply"
            style={[this.styles.backBtn, this.styles.backBtnLeft]}
            onPress={() => {
              this.deleteComment(`${data.item.id}`);
            }}
          >
            <Feather name="trash" size={25} color={'white'} />
          </TouchableOpacity>
        </View>
      )}
    </>
  );

  renderPreferences = () => {
    const categories =
      this.state.profileData.data?.attributes?.user_selection?.data === null ||
      this.state.profileData.data?.attributes?.user_selection?.data?.attributes
        .user_categories.length === 0
        ? this.state.categoriesList
        : this.state.profileData.data?.attributes?.user_selection?.data
            ?.attributes?.user_categories;

    return (
      <>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Text
            style={[this.styles.preferenceHeading, { justifyContent: 'flex-start' }]}
          >
            Categories I like
          </Text>
          {this.isMyProfile() && (
            <TouchableOpacity
              testID="editPrefsBtn"
              onPress={this.handleEditPreferences}
            >
              <Text
                style={[
                  this.styles.preferenceHeading,
                  {
                    justifyContent: 'flex-end',
                    fontWeight: '400',
                    fontSize: 14,
                    textAlignVertical: 'center',
                  },
                ]}
              >
                Edit
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <View>
          <FlatList
            testID="categoriesFlatList"
            data={categories}
            renderItem={this.renderCategories}
            scrollEnabled={false}
          />
        </View>
      </>
    );
  };

  renderActionButtons = () => {
    return (
      <>
        {this.state.profileData.data?.attributes?.role_id === 1 &&
          this.isViewingOwnProfile() && (
            <TouchableOpacity
              style={this.styles.editProfilePill}
              onPress={this.goToEditProfile}
            >
              <Feather
                name="edit-2"
                size={13}
                color={this.getProfileTheme().editButtonText}
              />
              <Text style={[this.styles.editProfilePillText, { marginLeft: 6 }]}>
                Edit Profile
              </Text>
            </TouchableOpacity>
          )}
      </>
    );
  };

  renderNotificationIndicator = () => {
    const count = this.state.unreadNotificationCount || 0;
    if (count > 0) {
      const displayCount = count > 99 ? '99+' : `${count}`;
      return (
        <View style={this.styles.notificationBadge}>
          <Text style={this.styles.notificationBadgeText}>{displayCount}</Text>
        </View>
      );
    }

    return this.renderRedDot({ condition: this.state.newNotification });
  };

  renderRedDot = ({ condition }: { condition: boolean }) => {
    if (condition) {
      return <View style={this.styles.redDot} />;
    }

    return null;
  };

  renderHeader = () => {
    return (
      <View style={this.styles.bannerOverlay} pointerEvents="box-none">
        <View style={this.styles.bannerOverlayInner} pointerEvents="box-none">
          <TouchableOpacity
            testID="navigationBackButton"
            style={this.styles.overlayCircleBtn}
            onPress={this.handleBack}
            activeOpacity={0.8}
          >
            <Image
              source={leftArrow}
              style={[this.styles.headerIcon, { tintColor: '#FFFFFF' }]}
            />
          </TouchableOpacity>
          <View style={this.styles.overlayRightActions}>
            {this.renderThemeToggle()}
            <TouchableOpacity
              testID="notificationButton"
              style={this.styles.overlayCircleBtn}
              onPress={() => this.handleNavigateToNotifications()}
              activeOpacity={0.8}
            >
              <View style={this.styles.notificationWrapper}>
                <Image
                  source={require('../../../mobile/assets/images/notifications.png')}
                  style={this.styles.overlayNotificationIcon}
                />
                {this.renderNotificationIndicator()}
              </View>
            </TouchableOpacity>
            {this.isViewingOwnProfile() && (
              <TouchableOpacity
                testID="logoutBtn"
                style={[this.styles.overlayCircleBtn, this.styles.overlayCircleBtnGap]}
                onPress={this.handleFanLogoutPress}
                activeOpacity={0.8}
              >
                <Feather name="log-out" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              testID="hamburgerIcon"
              onPress={() =>
                this.props.navigation?.openDrawer &&
                this.props.navigation.openDrawer()
              }
              style={[this.styles.overlayCircleBtn, this.styles.overlayCircleBtnGap]}
              activeOpacity={0.8}
            >
              <Feather name="menu" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  handleFanLogoutPress = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          const { clearAllUserData } = require('../../../framework/src/Utilities');
          await clearAllUserData();
          this.props.navigation?.navigate('EmailAccountLoginBlock');
        },
      },
    ]);
  };

  getFanLocationLabel = () => {
    const attrs = this.state.profileData.data?.attributes;
    if (!attrs) {
      return '';
    }
    if (attrs.city) {
      return attrs.state ? `${attrs.city}, ${attrs.state}` : attrs.city;
    }
    return attrs.country || '';
  };

  getFanAccountTypeLabel = () => {
      const accountType =
      this.state.profileData.data?.attributes?.account_type ||
      this.state.accountType ||
      'Fan';
    return this.getAccountTypeDisplayLabel(accountType);
  };

  renderThemeToggle = () => {
    const isDark = this.state.isDarkMode;
    return (
      <TouchableOpacity
        testID="themeToggle"
        style={this.styles.themeTogglePill}
        onPress={this.toggleProfileTheme}
        activeOpacity={0.85}
        accessibilityRole="switch"
        accessibilityState={{ checked: isDark }}
        accessibilityLabel="Toggle dark mode"
      >
        <Feather
          name="sun"
          size={13}
          color={isDark ? 'rgba(255,255,255,0.55)' : '#FFD60A'}
        />
        <View
          style={[
            this.styles.themeSwitchTrack,
            { backgroundColor: this.getProfileTheme().toggleTrack },
          ]}
        >
          <View
            style={[
              this.styles.themeSwitchKnob,
              isDark
                ? this.styles.themeSwitchKnobDark
                : this.styles.themeSwitchKnobLight,
            ]}
          />
        </View>
        <Feather
          name="moon"
          size={13}
          color={isDark ? '#C4B5FD' : 'rgba(255,255,255,0.45)'}
        />
      </TouchableOpacity>
    );
  };

  renderBannerFade = () => {
    const fadeColor = this.getProfileTheme().background;
    const width = Dimensions.get('window').width;
    return (
      <View style={this.styles.bannerBottomFade} pointerEvents="none">
        <Svg width={width} height={FAN_BANNER_FADE_HEIGHT}>
          <Defs>
            <LinearGradient
              id="fanProfileBannerFade"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <Stop offset="0" stopColor={fadeColor} stopOpacity="0" />
              <Stop offset="0.6" stopColor={fadeColor} stopOpacity="0.55" />
              <Stop offset="1" stopColor={fadeColor} stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <Rect
            x="0"
            y="0"
            width={width}
            height={FAN_BANNER_FADE_HEIGHT}
            fill="url(#fanProfileBannerFade)"
          />
        </Svg>
      </View>
    );
  };

  getProfileBannerSource = () => {
    const attrs = this.state.profileData.data?.attributes;
    const coverPhoto = this.state.coverPic || attrs?.cover_photo;
    const coverUri =
      typeof coverPhoto === 'string'
        ? coverPhoto.trim()
        : coverPhoto?.url
          ? String(coverPhoto.url).trim()
          : '';
    if (coverUri !== '' && coverUri !== 'null' && coverUri !== 'undefined') {
      return {
        uri: coverUri,
        priority: FastImage.priority.high,
      };
    }
    return require('../../../mobile/assets/images/profile_concert_bg.png');
  };

  renderCoverAndProfilePhoto = () => {
    const attrs = this.state.profileData.data?.attributes;
    return (
      <View style={this.styles.heroWrap}>
        <View style={this.styles.bannerWrap}>
          <FastImage
            source={this.getProfileBannerSource()}
            style={this.styles.bannerImage}
            resizeMode={FastImage.resizeMode.cover}
          />
          {this.renderBannerFade()}
          {this.renderHeader()}
        </View>
        <View style={this.styles.avatarRow}>
          <View style={this.styles.profileImageContainer}>
            <FastImage
              source={
                attrs?.profile_image
                  ? {
                      uri: attrs.profile_image,
                      priority: FastImage.priority.high,
                    }
                  : defaultProfile
              }
              style={this.styles.profileImage}
              resizeMode={FastImage.resizeMode.cover}
            />
          </View>
          {this.isViewingOwnProfile() ? (
            this.renderActionButtons()
          ) : (
            <View style={this.styles.actionButtonsContainer}>
              <TouchableOpacity
                testID="follow"
                style={this.styles.actionBtn}
                onPress={() => this.handleFollow(this.state.profileData.data?.id)}
              >
                <Text style={[this.styles.text, this.styles.actionBtnText]}>
                  {attrs?.follow ? 'Unfollow' : 'Follow'}
                </Text>
              </TouchableOpacity>
              {this.state.canShowAccountInfo && (
                <TouchableOpacity
                  testID="message"
                  style={[this.styles.actionBtn, this.styles.msgBtn]}
                  onPress={this.navigateToStartChat}
                >
                  <Text style={[this.styles.text, this.styles.msgBtnText]}>Message</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </View>
    );
  };

  renderFanIdentity = () => {
    const attrs = this.state.profileData.data?.attributes;
    const name = attrs?.first_name || '';
    const headlineParts = [
      this.getFanAccountTypeLabel(),
      this.getFanLocationLabel(),
    ].filter(Boolean);
    const bio = attrs?.bio;
    return (
      <View style={this.styles.identityBlock}>
        <View style={this.styles.nameRow}>
          <Text style={this.styles.profileName} numberOfLines={2}>
            {String(name).toUpperCase()}
          </Text>
          {attrs?.is_verified_user && (
            <Image
              source={require('../../../mobile/assets/images/check_green_circle.png')}
              style={this.styles.verifiedBadge}
            />
          )}
        </View>
        {headlineParts.length > 0 && (
          <Text style={this.styles.profileHeadline}>
            {headlineParts.join(' · ')}
          </Text>
        )}
        {!!bio && bio !== '' && <Text style={this.styles.profileBio}>{bio}</Text>}
        {this.renderWebsiteSocialMedia()}
      </View>
    );
  };

  renderPostsFollowersFollowings = () => {
    return (
      <View style={this.styles.statsContainer}>
        <TouchableOpacity
          testID="followers"
          style={this.styles.statCell}
          activeOpacity={1}
          onPress={() => this.goToFollowerFollowingScreen('followers')}
        >
          <Text style={this.styles.statValue}>
            {this.state.profileData.data?.attributes?.followers ?? 0}
          </Text>
          <Text style={this.styles.statLabel}>Followers</Text>
        </TouchableOpacity>
        <View style={this.styles.divider} />
        <TouchableOpacity
          testID="following"
          style={this.styles.statCell}
          activeOpacity={1}
          onPress={() => this.goToFollowerFollowingScreen('following')}
        >
          <Text style={this.styles.statValue}>
            {this.state.profileData.data?.attributes?.following ?? 0}
          </Text>
          <Text style={this.styles.statLabel}>Following</Text>
        </TouchableOpacity>
        {this.state.userID === this.state.profileData.data?.id && (
          <>
            <View style={this.styles.divider} />
            <TouchableOpacity
              testID="blocked"
              style={this.styles.statCell}
              onPress={this.goToBlockedUserScreen}
            >
              <Text style={this.styles.statValue}>
                {this.state.profileData.data?.attributes?.blocked_user ?? 0}
              </Text>
              <Text style={this.styles.statLabel}>Blocked</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    );
  };

  renderCategory = () => {
    const categorySubcat =
      this.state.profileData.data?.attributes?.user_selection?.data?.attributes
        ?.user_categories || [];

    return (
      <>
        {categorySubcat.length > 0 && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginVertical: 5,
            }}
          >
            <Text
              style={{
                flex: 0.4,
                fontSize: 16,
                fontWeight: '700',
                color: this.getProfileTheme().foreground,
              }}
            >
              Category
            </Text>
            <View style={{ flex: 0.5 }}>
              <FlatList
                testID="categoriesList"
                data={categorySubcat}
                numColumns={20}
                columnWrapperStyle={{ flexWrap: 'wrap' }}
                keyExtractor={(item: any) => item.id?.toString() || item.name}
                renderItem={({ item, index }) => {
                  return (
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: '400',
                        color: this.getProfileTheme().foreground,
                      }}
                    >
                      {index === categorySubcat.length - 1
                        ? `${item.name}`
                        : `${item.name}, `}
                    </Text>
                  );
                }}
              />
            </View>
          </View>
        )}
      </>
    );
  };

  renderMusicType = () => {
    const categorySubcat =
      this.state.profileData.data?.attributes?.user_selection?.data?.attributes
        ?.user_categories || [];

    return (
      <>
        {categorySubcat.length > 0 && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginVertical: 5,
            }}
          >
            <Text
              style={{
                flex: 0.4,
                fontSize: 16,
                fontWeight: '700',
                color: this.getProfileTheme().foreground,
              }}
            >
              Type
            </Text>
            <View style={{ flex: 0.5 }}>
              <FlatList
                testID="categorySubCategoriesList"
                data={categorySubcat}
                keyExtractor={item => item.id?.toString() || item.name}
                renderItem={({ item }) => (
                  <FlatList
                    testID="subCategoriesList"
                    data={item.subcategories || []}
                    numColumns={20}
                    columnWrapperStyle={{ flexWrap: 'wrap' }}
                    keyExtractor={sub_item =>
                      sub_item.id?.toString() || sub_item.name
                    }
                    renderItem={({ item: sub_item, index }) => (
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: '400',
                          color: this.getProfileTheme().foreground,
                        }}
                      >
                        {index === (item.subcategories?.length || 0) - 1
                          ? `${sub_item.name}`
                          : `${sub_item.name}, `}
                      </Text>
                    )}
                  />
                )}
              />
            </View>
          </View>
        )}
      </>
    );
  };

  renderWebsiteSocialMedia = () => {
    const website =
      this.state.profileData.data?.attributes?.official_website || '';
    const instagram =
      this.state.profileData.data?.attributes?.social_media?.instagram || '';
    const facebook =
      this.state.profileData.data?.attributes?.social_media?.facebook || '';
    const linkedin =
      this.state.profileData.data?.attributes?.social_media?.linkedin || '';

    return (
      <>
        {website !== '' && website !== 'undefined' && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginVertical: 5,
            }}
          >
            <Text
              style={{
                flex: 0.4,
                fontSize: 16,
                fontWeight: '700',
                color: this.getProfileTheme().foreground,
              }}
            >
              Official Website
            </Text>
            <Text
              testID="websiteURL"
              style={{
                flex: 0.5,
                fontSize: 16,
                fontWeight: '400',
                color: this.getProfileTheme().primary,
              }}
              onPress={() => {
                if (website) {
                  const url = website.startsWith('http')
                    ? website
                    : `https://${website}`;
                  Linking.openURL(url).catch((err: any) =>
                    console.error('Error opening URL:', err),
                  );
                }
              }}
            >
              {website}
            </Text>
          </View>
        )}
        {(instagram !== '' || facebook !== '' || linkedin !== '') && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginVertical: 5,
            }}
          >
            {(instagram !== '' || facebook !== '' || linkedin !== '') && (
              <Text
                style={{
                  flex: 0.4,
                  fontSize: 16,
                  fontWeight: '700',
                  color: this.getProfileTheme().foreground,
                }}
              >
                Social Media
              </Text>
            )}
            <View
              style={{ flex: 0.5, flexDirection: 'row', alignItems: 'center' }}
            >
              {instagram !== '' && instagram !== 'undefined' && (
                <TouchableOpacity
                  testID="instagramURL"
                  onPress={() => {
                    const url = instagram.startsWith('http')
                      ? instagram
                      : `https://instagram.com/${instagram}`;
                    Linking.openURL(url).catch((err: any) =>
                      console.error('Error opening URL:', err),
                    );
                  }}
                  style={{ marginRight: 25 }}
                >
                  <Feather name="instagram" size={20} color={this.getProfileTheme().primary} />
                </TouchableOpacity>
              )}
              {facebook !== '' && facebook !== 'undefined' && (
                <TouchableOpacity
                  testID="facebookURL"
                  onPress={() => {
                    const url = facebook.startsWith('http')
                      ? facebook
                      : `https://facebook.com/${facebook}`;
                    Linking.openURL(url).catch((err: any) =>
                      console.error('Error opening URL:', err),
                    );
                  }}
                  style={{ marginRight: 25 }}
                >
                  <FntAwesome name="facebook" size={20} color={this.getProfileTheme().primary} />
                </TouchableOpacity>
              )}
              {linkedin !== '' && linkedin !== 'undefined' && (
                <TouchableOpacity
                  testID="linkedinURL"
                  onPress={() => {
                    const url = linkedin.startsWith('http')
                      ? linkedin
                      : `https://linkedin.com/in/${linkedin}`;
                    Linking.openURL(url).catch((err: any) =>
                      console.error('Error opening URL:', err),
                    );
                  }}
                >
                  <FntAwesome
                    name="linkedin-square"
                    size={20}
                    color={this.getProfileTheme().primary}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      </>
    );
  };

  renderBio = () => {
    const bio = this.state.profileData.data?.attributes?.bio || '';
    const email = this.state.profileData.data?.attributes?.email || '';

    return (
      <>
        {(bio !== '' || email !== '') && (
          <>
            {bio !== '' && (
              <View style={{ marginVertical: 5 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '700',
                    color: this.getProfileTheme().foreground,
                    marginBottom: 10,
                  }}
                >
                  Bio / About us
                </Text>
                <Text
                  testID="bioTxt"
                  style={{
                    fontSize: 16,
                    fontWeight: '400',
                    color: this.getProfileTheme().foreground,
                    lineHeight: 22,
                  }}
                >
                  {bio}
                </Text>
              </View>
            )}
            {email !== '' && (
              <View style={{ marginVertical: 5 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '700',
                    color: this.getProfileTheme().foreground,
                    marginBottom: 10,
                  }}
                >
                  Email Address
                </Text>
                <Text
                  testID="emailTxt"
                  style={{
                    fontSize: 16,
                    fontWeight: '400',
                    color: this.getProfileTheme().foreground,
                    lineHeight: 22,
                  }}
                >
                  {email}
                </Text>
              </View>
            )}
          </>
        )}
      </>
    );
  };

  renderInfluences = () => {
    const influences =
      this.state.profileData.data?.attributes?.user_selection?.data?.attributes
        ?.influences || [];

    return (
      <>
        {influences.length > 0 && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginVertical: 5,
            }}
          >
            <Text
              style={{
                flex: 0.4,
                fontSize: 16,
                fontWeight: '700',
                color: this.getProfileTheme().foreground,
              }}
            >
              Influences
            </Text>
            <View style={{ flex: 0.5 }}>
              <FlatList
                testID="influencesFlatlist"
                numColumns={20}
                columnWrapperStyle={{ flexWrap: 'wrap' }}
                data={influences}
                keyExtractor={(item: any, index: number) => `${item}-${index}`}
                renderItem={({ item, index }) => {
                  return (
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: '400',
                        color: this.getProfileTheme().foreground,
                      }}
                    >
                      {index === influences.length - 1
                        ? `${item}`
                        : `${item}, `}
                    </Text>
                  );
                }}
              />
            </View>
          </View>
        )}
      </>
    );
  };

  renderAffiliates = () => {
    const affiliates =
      this.state.profileData.data?.attributes?.user_selection?.data?.attributes
        ?.affiliates || [];

    return (
      <>
        {affiliates.length > 0 && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginVertical: 5,
            }}
          >
            <Text
              style={{
                flex: 0.4,
                fontSize: 16,
                fontWeight: '700',
                color: this.getProfileTheme().foreground,
              }}
            >
              Affiliates
            </Text>
            <View style={{ flex: 0.5 }}>
              <FlatList
                testID="affiliatesFlatlist"
                numColumns={20}
                columnWrapperStyle={{ flexWrap: 'wrap' }}
                data={affiliates}
                keyExtractor={(item: any, index: number) => `${item}-${index}`}
                renderItem={({ item, index }) => {
                  return (
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: '400',
                        color: this.getProfileTheme().foreground,
                      }}
                    >
                      {index === affiliates.length - 1
                        ? `${item}`
                        : `${item}, `}
                    </Text>
                  );
                }}
              />
            </View>
          </View>
        )}
      </>
    );
  };

  renderBandArtists = () => {
    return (
      <>
        {this.state.profileData.data?.attributes?.user_selection?.data !== null &&
          this.state.profileData.data?.attributes?.user_selection?.data?.attributes
            .band_artists.length !== 0 && (
            <View style={{ marginTop: 20 }}>
              <Text style={[this.styles.preferenceHeading, { marginTop: 0 }]}>
                Bands/Artists I like
              </Text>
              <Text style={this.styles.preferenceText}>
                {(this.state.profileData.data?.attributes?.band_artists ?? [])
                  .map((band_name: any) => band_name)
                  .join(', ')}
              </Text>
            </View>
          )}
      </>
    );
  };

  // Customizable Area End

  render() {
    // Customizable Area Start
    console.log(
      '🎨 UserProfileBasicBlock render() - profileData:',
      this.state.profileData,
    );
    console.log(
      '🎨 UserProfileBasicBlock render() - firstName:',
      this.state.profileData?.data?.attributes?.first_name,
    );
    console.log(
      '🎨 UserProfileBasicBlock render() - followers:',
      this.state.profileData?.data?.attributes?.followers,
    );

    return (
      <KeyboardAvoidingView
        behavior={this.isPlatformiOS() ? 'padding' : undefined}
        style={{ flex: 1, backgroundColor: this.getProfileTheme().background }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={this.styles.scollContent}
          contentInsetAdjustmentBehavior="never"
        >
          <StatusBar
            backgroundColor={this.getProfileTheme().background}
            barStyle="light-content"
          />
          <View style={this.styles.container}>
            <TouchableWithoutFeedback
              onPress={() => {
                this.hideKeyboard();
              }}
            >
              <View style={{ flex: 1, backgroundColor: this.getProfileTheme().background }}>
                <View style={this.styles.contentContainer}>
                  {this.renderCoverAndProfilePhoto()}
                  <View style={this.styles.bottomContainer}>
                    <View
                      style={{
                        paddingHorizontal: 16,
                        paddingBottom: 30,
                      }}
                    >
                      {this.renderFanIdentity()}
                      {this.renderPostsFollowersFollowings()}
                      {/* {this.state.profileData.data?.attributes?.user_selection?.data?.attributes?.user_categories &&
                      this.renderCategory()}
                    {this.state.profileData.data?.attributes?.user_selection?.data?.attributes?.user_categories &&
                      this.renderMusicType()}
                    {this.renderWebsiteSocialMedia()}
                    {this.state.profileData.data?.attributes?.bio &&
                      this.state.profileData.data?.attributes?.bio !== "" &&
                      this.renderBio()}
                    {this.state.profileData.data?.attributes?.user_selection?.data?.attributes?.influences && 
                      this.renderInfluences()}
                    {this.state.profileData.data?.attributes?.user_selection?.data?.attributes?.affiliates && 
                      this.renderAffiliates()} */}

                      {this.state.canShowAccountInfo ? (
                        <>
                          {<this.renderPreferences />}
                          {this.renderBandArtists()}

                          {this.getCalendarEventsLength() ? (
                            <View>
                              <Text
                                style={[
                                  this.styles.preferenceHeading,
                                  {
                                    marginTop: 40,
                                    color: this.getProfileTheme().foreground,
                                    marginBottom: 5,
                                  },
                                ]}
                              >
                                Calendar{' '}
                                <Text
                                  style={[
                                    this.styles.preferenceText,
                                    { fontWeight: '400' },
                                  ]}
                                >
                                  {`(${this.getCalendarEventsLength()} shows)`}
                                </Text>
                              </Text>
                              <View style={this.styles.horizontalView} />
                              <FlatList
                                testID="calendarEventFlatList"
                                data={this.calendarEventsData()}
                                renderItem={this.renderEvents}
                                scrollEnabled={false}
                                style={{ flexGrow: 0 }}
                              />
                              {this.getCalendarEventsLength() !== 1 && (
                                <TouchableOpacity
                                  testID="toggleCalendarEventsExpand"
                                  onPress={this.toggleCalendarEventsExpand}
                                >
                                  <Text
                                    style={[
                                      this.styles.preferenceHeading,
                                      {
                                        fontWeight: '400',
                                        fontSize: 14,
                                        textAlignVertical: 'center',
                                        marginVertical: 10,
                                        textAlign: 'right',
                                      },
                                    ]}
                                  >
                                    {this.getCalendarEventsLabel()}
                                  </Text>
                                </TouchableOpacity>
                              )}
                            </View>
                          ) : null}

                          {this.getLikedEventLength() ? (
                            <View>
                              <Text
                                style={[
                                  this.styles.preferenceHeading,
                                  {
                                    marginTop: 40,
                                    color: this.getProfileTheme().foreground,
                                    marginBottom: 5,
                                  },
                                ]}
                              >
                                Liked events
                              </Text>
                              <View style={this.styles.horizontalView} />
                              <FlatList
                                testID="likedEventFlatList"
                                data={this.likedEventsData()}
                                renderItem={this.renderEvents}
                                scrollEnabled={false}
                                style={{ flexGrow: 0 }}
                              />
                              {this.getLikedEventLength() !== 1 && (
                                <TouchableOpacity
                                  testID="toggleLikedEventsExpand"
                                  onPress={this.toggleLikedEventsExpand}
                                >
                                  <Text
                                    style={[
                                      this.styles.preferenceHeading,
                                      {
                                        fontWeight: '400',
                                        fontSize: 14,
                                        textAlignVertical: 'center',
                                        marginVertical: 10,
                                        textAlign: 'right',
                                      },
                                    ]}
                                  >
                                    {this.getLikedEventsLabel()}
                                  </Text>
                                </TouchableOpacity>
                              )}
                            </View>
                          ) : null}
                        </>
                      ) : (
                        <View style={this.styles.privateAccountContainer}>
                          <MCommunityIcons
                            name="lock-outline"
                            color={this.getProfileTheme().foreground}
                            size={100}
                          />
                          <Text style={this.styles.privateAccountText}>
                            {configJSON.privateAccount}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
                <Modal
                  animationType="none"
                  transparent={true}
                  visible={this.state.commentsModalOpen}
                >
                  <KeyboardAvoidingView
                    behavior={this.isPlatformiOS() ? 'padding' : undefined}
                    style={{ flex: 1 }}
                  >
                    <View style={this.styles.commentsModalParentView}>
                      <TouchableOpacity
                        activeOpacity={1}
                        testID="commentModal"
                        onPress={() => this.hideKeyboard()}
                        style={this.styles.commentsContainer}
                      >
                        <View style={this.styles.commentsHeading}>
                          <Text style={this.styles.commentsHeaderText}>
                            Comments
                          </Text>
                          <TouchableOpacity
                            testID="closeCommentsModalButton"
                            onPress={this.handleCloseCommentsModal}
                          >
                            <Feather name="x" size={25} />
                          </TouchableOpacity>
                        </View>
                        <View style={this.styles.separator} />
                        {this.state.isLoadingComments ? (
                          <View style={this.styles.noCommentsView}>
                            <ActivityIndicator size="large" color={this.getProfileTheme().primary} />
                          </View>
                        ) : (
                          <this.renderComments />
                        )}
                        <View style={this.styles.emojiSelectionStrip}>
                          {this.defaultEmojisForSelectionStrip.map(
                            (emoji: string, index) => (
                              <TouchableOpacity
                                testID={`emojiReply${index}c`}
                                key={emoji}
                                onPress={() => this.handleEmojiSelection(emoji)}
                              >
                                <Text style={this.styles.emojiSelectionStripIcon}>
                                  {emoji}
                                </Text>
                              </TouchableOpacity>
                            ),
                          )}
                        </View>
                        <View style={this.styles.commentInputContainer}>
                          <View style={this.styles.userAvatarView}>
                            <FastImage
                              source={
                                this.state.profilePic
                                  ? {
                                      uri: this.state.profilePic,
                                      priority: FastImage.priority.high,
                                    }
                                  : defaultProfile
                              }
                              style={this.styles.userAvatarImage}
                              resizeMode={FastImage.resizeMode.cover}
                            />
                          </View>
                          <TextInput
                            testID="commentTextInput"
                            ref={input => {
                              this.commentTextInput = input;
                            }}
                            style={this.styles.commentInput}
                            placeholder={
                              this.state.replying
                                ? 'Add a reply...'
                                : 'Add a comment...'
                            }
                            value={this.state.comment}
                            onChangeText={commentText =>
                              this.handleCommentChange(commentText)
                            }
                            multiline
                          />
                          <TouchableOpacity
                            testID="emojiCommentBtn"
                            style={this.styles.emojiBtn}
                            onPress={this.handleSubmit}
                          >
                            <MCommunityIcons
                              name="send"
                              color="#64748B"
                              size={30}
                            />
                          </TouchableOpacity>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </KeyboardAvoidingView>
                </Modal>
                <this.renderRepliesModal />
                {this.renderTnCUpdateModalPopup()}
                {this.state.isLoading && (
                  <View style={this.styles.loadingContainer}>
                    <ActivityIndicator size={'large'} color={this.getProfileTheme().primary} />
                  </View>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
    // Customizable Area End
  }

  async componentDidMount() {
    // Customizable Area Start
    if (Platform.OS !== 'web') {
      this.focusListener = this.props.navigation.addListener(
        'focus',
        async () => {
          await this.loadProfileData();
          this.getUnreadNotificationsCount();

          const commentUserid = await getStorageData('commentUserid');
          let IsFromCommentProfile = await getStorageData(
            'IsFromCommentProfile',
          );
          if (
            IsFromCommentProfile !== null &&
            IsFromCommentProfile &&
            this.state.userID === commentUserid
          ) {
            this.setState({ commentsModalOpen: true });
            removeStorageData('IsFromCommentProfile');
          }
        },
      );
    }

    await this.loadProfileTheme();
    await this.loadProfileData(true);
    this.getUnreadNotificationsCount();

    this.handleComponentDidMount();
  }

  componentWillUnmount() {
    if (this.focusListener) {
      this.focusListener();
    }
  }
}
// Customizable Area Start
const FAN_BANNER_HEIGHT = Math.round(Dimensions.get('window').height * 0.28);
const FAN_BANNER_FADE_HEIGHT = 96;

const createProfileStyles = (theme: typeof redesignTheme) =>
  StyleSheet.create({
  container: {
    flex: 1,
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '100%',
    maxWidth: 650,
    backgroundColor: theme.background,
  },
  scollContent: { flexGrow: 1, backgroundColor: theme.background },
  heroWrap: {
    backgroundColor: theme.background,
    marginBottom: 8,
  },
  bannerWrap: {
    width: '100%',
    height: FAN_BANNER_HEIGHT,
    backgroundColor: theme.input,
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: FAN_BANNER_HEIGHT,
  },
  bannerBottomFade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: FAN_BANNER_FADE_HEIGHT,
  },
  bannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: Platform.OS === 'ios' ? 48 : 16,
  },
  bannerOverlayInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: Platform.OS === 'ios' ? 12 : 8,
    paddingBottom: 12,
  },
  overlayCircleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(8, 8, 15, 0.55)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255, 255, 255, 0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayCircleBtnGap: {
    marginLeft: 8,
  },
  overlayRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeTogglePill: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 36,
    paddingHorizontal: 8,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255, 255, 255, 0.22)',
    marginRight: 8,
  },
  themeSwitchTrack: {
    width: 36,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.toggleTrack,
    marginHorizontal: 6,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  themeSwitchKnob: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  themeSwitchKnobLight: {
    marginRight: 'auto',
  },
  themeSwitchKnobDark: {
    marginLeft: 'auto',
  },
  overlayNotificationIcon: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
    tintColor: '#FFFFFF',
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: -42,
  },
  identityBlock: {
    marginTop: 16,
    marginBottom: 8,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  profileName: {
    color: theme.foreground,
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 0.4,
    marginRight: 8,
    flexShrink: 1,
  },
  verifiedBadge: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
  profileHeadline: {
    color: theme.muted,
    fontSize: 14,
    marginTop: 6,
  },
  profileBio: {
    color: theme.muted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 10,
  },
  editProfilePill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.editButtonBorder,
    backgroundColor: theme.editButton,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginBottom: 8,
  },
  editProfilePillText: {
    color: theme.editButtonText,
    fontWeight: '600',
    fontSize: 14,
  },
  statCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    color: theme.foreground,
    fontSize: 22,
    fontWeight: '700',
  },
  statLabel: {
    color: theme.muted,
    fontSize: 13,
    fontWeight: '400',
    marginTop: 4,
  },
  msgBtnText: {
    color: theme.foreground,
    fontWeight: '700',
    fontSize: 13,
    textAlign: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
    width: '100%',
    paddingTop: 5,
    backgroundColor: '#FCFCFF',
  },
  headerLeftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerRightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#131388',
    textAlign: 'center',
    flex: 1,
  },
  headerTimeText: {
    fontSize: 16,
    color: theme.foreground,
    marginLeft: 8,
    marginRight: 8,
  },
  headerIconBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
  },
  headerIcon: {
    resizeMode: 'contain',
    width: 20,
    height: 20,
  },
  headerSignalIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginLeft: 8,
  },
  hamburgerIcon: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
    tintColor: theme.foreground,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: theme.background,
  },
  topBackdrop: {
    backgroundColor: theme.background,
    width: '100%',
    paddingTop: 10,
    paddingBottom: 10,
  },
  headerContainer2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
    width: '100%',
    paddingTop: 5,
  },
  bottomContainer: {
    flex: 1,
    backgroundColor: theme.background,
    width: '100%',
    paddingBottom: 20,
    minHeight: Dimensions.get('screen').height - 250,
  },
  profileImageContainer: {
    backgroundColor: theme.background,
    width: 92,
    height: 92,
    borderRadius: 46,
    borderWidth: 3,
    borderColor: theme.primary,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  profileImage: {
    width: 86,
    height: 86,
    resizeMode: 'cover',
    borderRadius: 43,
  },
  text: {
    fontFamily: 'OpenSans',
    color: theme.foreground,
  },
  nameText: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 5,
  },
  locationIcon: {
    width: 20,
    resizeMode: 'contain',
    marginRight: 10,
  },
  locationText: {
    fontSize: 18,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'stretch',
    marginVertical: 18,
    backgroundColor: theme.statsBg,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: theme.statsBorder,
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  statsText: {
    textAlign: 'center',
  },
  divider: {
    width: 1,
    alignSelf: 'stretch',
    backgroundColor: theme.divider,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
    marginLeft: 12,
    margin: 10,
  },
  actionButton: {
    width: '42.5%',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 10,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
  editProfileButton: {
    backgroundColor: '#3333CC',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  editProfileButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  actionBtn: {
    backgroundColor: theme.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    minWidth: 88,
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  msgBtn: {
    backgroundColor: theme.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.border,
  },
  messageButton: {
    backgroundColor: '#EDEDFF',
    color: '#3333CC',
    fontWeight: 'bold',
    fontSize: 18,
  },
  preferenceHeading: {
    fontSize: 18,
    fontFamily: 'OpenSans',
    color: theme.primary,
    fontWeight: 'bold',
    marginHorizontal: '5%',
    marginVertical: 20,
  },
  preferenceText: {
    fontSize: 16,
    marginHorizontal: '5%',
    color: theme.foreground,
  },
  categoryContainer: {
    flexDirection: 'row',
    paddingHorizontal: '5%',
    marginTop: 10,
  },
  categoryName: {
    width: '40%',
    fontWeight: 'bold',
    fontSize: 16,
  },
  categoryElems: {
    width: '60%',
    fontSize: 16,
  },
  dateBanner: {
    position: 'absolute',
    top: 20,
    right: 20,
    paddingVertical: 7,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: theme.primary,
    flexWrap: 'wrap',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#ffffffdd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  commentsModalParentView: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#33415580',
  },
  commentsContainer: {
    backgroundColor: 'white',
    borderTopEndRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    height: '75%',
    justifyContent: 'flex-start',
  },
  commentsHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  commentsHeaderText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 15,
  },
  noCommentsView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  startConversation: {
    marginTop: 5,
  },
  commentsListView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emojiSelectionStrip: {
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  emojiSelectionStripIcon: {
    fontSize: 20,
  },
  commentInputContainer: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    marginHorizontal: 20,
  },
  userAvatarImage: {
    width: 40,
    height: 40,
    borderRadius: 75,
  },
  userAvatarView: {
    backgroundColor: '#FCFCFF',
    width: 42,
    height: 42,
    borderRadius: 80,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#C5C5FF',
    marginRight: 10,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#C5C5FF',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingRight: 50,
    paddingTop: 12,
    height: '100%',
    fontSize: 16,
    textAlignVertical: 'center',
  },
  emojiBtn: {
    position: 'absolute',
    right: 10,
    height: 30,
    width: 30,
  },
  emojiButtonIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  backRow: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  frontRow: {
    alignItems: 'center',
    backgroundColor: '#FFF',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    paddingRight: 5,
  },
  backBtn: {
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
  commentContentContainer: {
    flex: 1,
  },
  commenterNameText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  commentText: {
    fontSize: 14,
  },
  likeView: {
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
  likeCountText: {
    color: '#94A3B8',
    textAlign: 'center',
  },
  replyBtn: {
    alignSelf: 'flex-start',
  },
  replyBtnText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#94A3B8',
  },
  showReplyBtn: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    alignItems: 'center',
  },
  horizontalBar: {
    height: 1,
    width: 20,
    marginRight: 10,
    backgroundColor: '#94A3B8',
  },
  showReplyBtnText: {
    fontSize: 14,
    color: '#94A3B8',
  },
  replyText: {
    marginTop: 10,
  },
  eventContainer: {
    flexDirection: 'column',
    width: '100%',
    padding: 0,
    paddingVertical: 8,
  },
  compactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.card,
    borderRadius: 14,
    padding: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.border,
  },
  compactCardMain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  compactThumb: {
    width: 56,
    height: 56,
    borderRadius: 10,
    backgroundColor: theme.input,
  },
  compactCardCopy: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  compactCardTitle: {
    color: theme.foreground,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  compactCardSubtitle: {
    color: theme.muted,
    fontSize: 12,
    marginTop: 4,
  },
  compactLikeBtn: {
    padding: 6,
  },
  compactLikeIcon: {
    width: 18,
    height: 16,
    tintColor: theme.primary,
    resizeMode: 'contain',
  },
  compactLikeIconFilled: {
    width: 18,
    height: 16,
    tintColor: theme.primary,
    resizeMode: 'contain',
  },
  actionIcon: {
    marginLeft: 8,
    tintColor: theme.muted,
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  bandImage: {
    borderRadius: 50,
    width: 50,
    height: 50,
  },
  boldText: {
    fontWeight: '700',
    fontSize: 14,
    lineHeight: 22,
    color: theme.foreground,
  },
  locationPin: {
    marginRight: 5,
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  eventImageContainer: {
    marginTop: 10,
    position: 'relative',
  },
  eventImage: {
    width: '100%',
    height: 200,
  },
  monthText: {
    fontWeight: '400',
    fontSize: 20,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  likeCommentShareIcon: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  likeIcon: {
    tintColor: theme.primary,
    height: 20,
    width: 22,
  },
  likeThisText: {
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 22,
    color: theme.foreground,
  },
  descriptionText: {
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 22,
    color: theme.foreground,
  },
  seeCommentsText: {
    color: theme.primary,
    fontWeight: '400',
    lineHeight: 18,
    fontSize: 14,
    marginLeft: 5,
  },
  notificationIcon: {
    tintColor: theme.foreground,
    width: 25,
    resizeMode: 'contain',
  },
  notificationWrapper: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -6,
    right: -8,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#F04438',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  notificationBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  redDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F04438',
  },
  horizontalView: {
    height: 1,
    width: '90%',
    backgroundColor: '#E2E8F0',
    alignSelf: 'center',
  },
  month: {
    fontWeight: '700',
    color: theme.foreground,
    fontSize: 18,
    marginBottom: 20,
  },
  date: {
    fontWeight: '400',
    fontSize: 16,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  people: {
    fontWeight: '700',
    color: theme.primary,
  },
  tncModal: {
    backgroundColor: 'white',
    height: '40%',
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  privateAccountContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  privateAccountText: {
    color: theme.foreground,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

const darkProfileStyles = createProfileStyles(redesignTheme);
const lightProfileStyles = createProfileStyles(lightTheme);
// Customizable Area End

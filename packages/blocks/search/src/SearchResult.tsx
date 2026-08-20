import React from "react";
// Customizable Area Start
import {
  StyleSheet,
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
  Share,
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
import {lightTheme, redesignTheme} from "../../utilities/src/Colors";

// Customizable Area End

import SearchController, { Props, configJSON } from "./SearchController";

type SearchResultTheme = typeof redesignTheme;

export default class SearchResult extends SearchController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }

  // Customizable Area Start
  defaultEmojisForSelectionBar = ["️💖", "🙌", "🔥", "👏", "😢", "😍", "😲", "😂"];

  get styles() {
    return this.state.isDarkMode ? darkSearchResultStyles : lightSearchResultStyles;
  }

  formatResultTime = (timeValue: any): string => {
    if (typeof timeValue !== 'string' || !timeValue.trim()) {
      return '';
    }
    const raw = timeValue.trim();
    if (/[ap]m/i.test(raw) && !raw.includes('T')) {
      return raw;
    }
    if (raw.includes('T') || /^\d{4}-\d{2}-\d{2}/.test(raw)) {
      const parsed = new Date(raw);
      if (!Number.isNaN(parsed.getTime())) {
        let hours = parsed.getUTCHours();
        const minutes = String(parsed.getUTCMinutes()).padStart(2, '0');
        const suffix = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        if (hours === 0) {
          hours = 12;
        }
        return `${hours}:${minutes} ${suffix}`;
      }
    }
    const match = raw.match(/^(\d{1,2}):(\d{2})/);
    if (!match) {
      return raw;
    }
    let hours = parseInt(match[1], 10);
    const minutes = match[2];
    const suffix = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    if (hours === 0) {
      hours = 12;
    }
    return `${hours}:${minutes} ${suffix}`;
  };

  formatResultGenreLabel = (genre: any): string => {
    if (Array.isArray(genre)) {
      return genre
        .filter((item: any) => typeof item === 'string' && item.trim())
        .join(' / ');
    }
    if (typeof genre === 'string') {
      return genre.trim();
    }
    return '';
  };

  formatResultLineupLabel = (lineUps: any): string => {
    if (!Array.isArray(lineUps)) {
      return '';
    }
    const names = lineUps.filter(
      (item: any) => typeof item === 'string' && item.trim(),
    );
    if (names.length === 0) {
      return '';
    }
    if (names.length <= 3) {
      return names.join(', ');
    }
    return `${names.slice(0, 3).join(', ')} +${names.length - 3}`;
  };

  formatResultCategoryLabel = (name: string): string => {
    const trimmed = name.trim();
    if (trimmed === '') {
      return '';
    }
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  };

  getResultShowTitle = (attrs: any): string => {
    if (typeof attrs?.event_title === 'string' && attrs.event_title.trim()) {
      return attrs.event_title.trim();
    }
    if (typeof attrs?.band_name === 'string' && attrs.band_name.trim()) {
      return attrs.band_name.trim();
    }
    return '';
  };

  getResultCategoryLabel = (attrs: any): string => {
    const typeOfShow = attrs?.type_of_show;
    if (Array.isArray(typeOfShow)) {
      const named = typeOfShow.find(
        (item: any) =>
          (item &&
            typeof item === 'object' &&
            typeof item.name === 'string' &&
            item.name.trim()) ||
          (typeof item === 'string' && item.trim()),
      );
      if (named) {
        const rawName = typeof named === 'string' ? named : named.name;
        return this.formatResultCategoryLabel(rawName);
      }
    } else if (typeof typeOfShow === 'string' && typeOfShow.trim()) {
      return this.formatResultCategoryLabel(typeOfShow);
    }
    return '';
  };

  formatResultFooterDate = (eventDate: string): string => {
    if (!eventDate || eventDate === '2999-12-31') {
      return '';
    }
    const inputDate = new Date(eventDate);
    if (Number.isNaN(inputDate.getTime())) {
      return '';
    }
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weekday = weekdays[inputDate.getUTCDay()];
    const month = this.formatMonth(eventDate);
    const day = this.formatDate(eventDate);
    if (!weekday || !month || day == null || day === '') {
      return '';
    }
    return `${weekday}, ${month} ${day}`;
  };

  getResultAreaLabel = (): string => {
    const fromParams =
      this.props.route?.params?.searchAreaLabel ||
      this.props.navigation.state?.params?.searchAreaLabel;
    if (typeof fromParams === 'string' && fromParams.trim()) {
      return fromParams.trim();
    }
    const list = this.getEventListForFlatList();
    const cities = Array.from(
      new Set(
        list
          .map((item: any) =>
            typeof item?.attributes?.city === 'string'
              ? item.attributes.city.trim()
              : '',
          )
          .filter((value: string) => value !== ''),
      ),
    );
    if (cities.length === 1) {
      return cities[0];
    }
    const states = Array.from(
      new Set(
        list
          .map((item: any) =>
            typeof item?.attributes?.state === 'string'
              ? item.attributes.state.trim()
              : '',
          )
          .filter((value: string) => value !== ''),
      ),
    );
    if (states.length === 1) {
      return states[0];
    }
    return 'All areas';
  };

  getResultShowImage = (attrs: any): string => {
    return (
      this.normalizeMediaUrl(attrs?.profile_image) ||
      this.normalizeMediaUrl(attrs?.band_profile_image) ||
      this.normalizeMediaUrl(
        Array.isArray(attrs?.images_and_videos)
          ? attrs.images_and_videos[0]
          : '',
      )
    );
  };

  handleResultShare = (item: any) => {
    const attrs = item?.attributes || {};
    const title = this.getResultShowTitle(attrs);
    const venue =
      (typeof attrs.location === 'string' && attrs.location.trim()) ||
      (typeof attrs.city === 'string' && attrs.city.trim()) ||
      '';
    const message = [title, venue].filter(Boolean).join(' at ');
    if (!message) {
      return;
    }
    Share.share({ message, title: title || 'LocalShows' }).catch(() => {});
  };

  renderPageHeader = () => {
    const theme = this.getSearchTheme();
    return (
      <View style={this.styles.header}>
        <TouchableOpacity
          testID="backBtn"
          style={this.styles.overlayCircleBtn}
          onPress={() => { this.props.navigation.goBack(); }}
          activeOpacity={0.8}>
          <Icon name="arrow-left" size={18} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={this.styles.headerTitle}>Search results</Text>
        <TouchableOpacity
          testID="hamburgerIcon"
          style={this.styles.headerSideBtn}
          onPress={() => { this.props.navigation.openDrawer() }}>
          <Image
            style={[this.styles.hamburgerIcon, { tintColor: theme.foreground }]}
            source={require('../../../mobile/assets/images/Vector.png')}
          />
        </TouchableOpacity>
      </View>
    )
  }

  renderShowsCountHeader = () => {
    const count = this.getEventListForFlatList().length;
    if (count === 0) {
      return null;
    }
    return (
      <View style={this.styles.showsCountRow}>
        <View style={this.styles.showsCountLabelWrap}>
          <View style={this.styles.showsCountDot} />
          <Text style={this.styles.showsCountText}>{count} SHOWS</Text>
        </View>
        <View style={this.styles.showsCountLine} />
        <Text style={this.styles.showsCountArea}>{this.getResultAreaLabel()}</Text>
      </View>
    );
  }

  renderComments = () => {
    return (
      <>
        {
          this.state.commentsList.length ?
            <View style={this.styles.commentsListContainer}>
              {this.renderCommentsSwipeList()}
            </View>
            :
            <View style={this.styles.noComments}>
              <Icon name="message-square" size={60} color={this.getSearchTheme().muted} />
              <Text style={this.styles.commentHeading}>No comments yet</Text>
              <Text style={this.styles.startConversation}>Start the conversation</Text>
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
    <View style={this.styles.rowBack}>
      <TouchableOpacity
        testID="editComment"
        style={[this.styles.backRightBtn, this.styles.backBtnLeft]}
        onPress={() => this.handleEditCommentSwipe(data, rowMap)} >
        <Icon name="corner-up-left" size={25} color={"white"} />
      </TouchableOpacity>
      <TouchableOpacity
        testID="deleteComment"
        style={[this.styles.backRightBtn, this.styles.backBtnRight]}
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
      <View style={this.styles.rowFront}>
        <TouchableOpacity
          testID="imageShowProfile"
          style={this.styles.userAvatarView}
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
            style={this.styles.userAvatarImg}
            resizeMode={FastImage.resizeMode.cover}
          />
        </TouchableOpacity>
        <View style={this.styles.commentContent}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={this.styles.commenterName}>
              {`${item.attributes.account.first_name}`}
            </Text>
            <Text style={[this.styles.commenterName, { fontWeight: '400', marginLeft: 5 }]}>{this.timeAgo(item.attributes.updated_at)}</Text>
          </View>
          <Text style={this.styles.commentInput}>{item.attributes.comment}</Text>
          <TouchableOpacity
            testID="replyButton"
            style={this.styles.replyButton}
            onPress={() => this.handleReplyClick(item.id)}
          >
            <Text style={this.styles.replyButtonText}>Reply</Text>
          </TouchableOpacity>
          {
            item.attributes.replies.length !== 0 &&
            <TouchableOpacity
              testID="showReplyButton"
              style={this.styles.showReplyButton}
              onPress={() => this.handleViewMoreReplies(item)}
            >
              <View style={this.styles.horizontalBar} />
              <Text style={this.styles.showReplyButtonText}>
                {`View ${item.attributes.replies.length} more replies`}
              </Text>
            </TouchableOpacity>
          }
        </View>
        <View style={this.styles.likeContainer}>
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
          <Text style={this.styles.likesCountTxt}>{item.attributes.likes_count}</Text>
        </View>
      </View>
    )
  }

  renderHiddenReplies = (data: any, rowMap: any) => (
    <View style={this.styles.rowBack}>
      <TouchableOpacity
        testID="editReply"
        style={[this.styles.backRightBtn, this.styles.backBtnLeft]}
        onPress={() => this.handleEditReplySwipe(data, rowMap)} >
        <Icon name="corner-up-left" size={25} color={"white"} />
      </TouchableOpacity>
      <TouchableOpacity
        testID="deleteReply"
        style={[this.styles.backRightBtn, this.styles.backBtnRight]}
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
          <View style={[this.styles.centeredView, this.styles.commentsParentView]}>
            <TouchableOpacity activeOpacity={1} testID="repliesModal" onPress={() => this.hideKeyboard()} style={[this.styles.modalView, this.styles.commentView]}>
              <View style={this.styles.commentHeader}>
                <TouchableOpacity testID="replyModalBackBtn" onPress={this.handleReplyBackModal}>
                  <Image source={leftArrow} style={{ width: 12, left: 0, resizeMode: "contain", tintColor: "#94A3B8" }} />
                </TouchableOpacity>
                <Text style={this.styles.commentHeading}>Replies</Text>
                <TouchableOpacity
                  testID="closeReplyPopupButton"
                  onPress={this.handleReplyCloseModal}
                >
                  <Icon name="x" size={25} />
                </TouchableOpacity>
              </View>
              <View style={this.styles.horizontalRuler} />
              {
                this.state.commentsLoading ?
                  <View style={this.styles.noComments}>
                    <ActivityIndicator size="large" color="#4949EE" />
                  </View>
                  :
                  this.renderReplies()
              }
              <View style={this.styles.emojiSelection}>
                {this.defaultEmojisForSelectionBar.map((emoji: string) => (
                  <TouchableOpacity testID="emojiReply" key={emoji} onPress={() => this.handleEmojiSelected(emoji)}>
                    <Text style={this.styles.emojiSelectionBarIcon}>{emoji}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={this.styles.commentInputArea}>
                <View style={this.styles.userAvatarView}>
                  <FastImage source={this.state.userProfilePic ?
                    {
                      uri: this.state.userProfilePic,
                      priority: FastImage.priority.high
                    } :
                    defaultProfile
                  }
                    style={this.styles.userAvatarImg}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                </View>
                <TextInput
                  testID="replyTextInput"
                  value={this.state.commentText}
                  ref={(input) => { this.commentTextInput = input; }}
                  onChangeText={(commentText) => this.handleCommentTxtChange(commentText)}
                  style={this.styles.commentReplyTextInput}
                  multiline
                />
                <TouchableOpacity
                  testID="emojiReplyBtn"
                  style={this.styles.emojiButtons}
                  onPress={this.handleCommentSubmitEditing}
                >
                  <MaterialCommunityIcons name="send" color={this.getSearchTheme().primary} size={30} />
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
        <View style={[this.styles.rowFront]}>
          <TouchableOpacity testID="repliesProfile" style={this.styles.userAvatarView}
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
              style={this.styles.userAvatarImg}
              resizeMode={FastImage.resizeMode.cover}
            />
          </TouchableOpacity>
          <View style={this.styles.commentContent}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={this.styles.commenterName}>
                {this.state.commentWithReply.attributes?.account.first_name}
              </Text>
              <Text style={[this.styles.commenterName, { fontWeight: '400', marginLeft: 5 }]}>{this.timeAgo(this.state.commentWithReply.attributes?.updated_at)}</Text>
            </View>
            <Text style={this.styles.replyInput}>
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
      <View style={[this.styles.rowFront, {
        width: "95%",
        alignSelf: "flex-end",
      }]}
      >
        <TouchableOpacity
          testID="imageShowProfileReply"
          style={this.styles.userAvatarView}
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
            style={this.styles.userAvatarImg}
            resizeMode={FastImage.resizeMode.cover}
          />
        </TouchableOpacity>
        <View style={this.styles.commentContent}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={this.styles.commenterName}>
              {item.account_name}
            </Text>
            <Text style={[this.styles.commenterName, { fontWeight: '400', marginLeft: 5 }]}>{item.updated_at ? this.timeAgo(item.updated_at) : ""}</Text>
          </View>
          <Text style={this.styles.replyInput}>
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
          <View style={[this.styles.centeredView, { backgroundColor: '#33415580' }]}>
            <View style={[this.styles.modalView]}>
              <View style={this.styles.crossLoginPopup}>
                <TouchableWithoutFeedback
                  testID="popupCloseButton"
                  style={this.styles.svgImage}
                  onPress={this.handleLoginPopup}
                >
                  <Icon name="x" color={this.getSearchTheme().foreground} size={18} />
                </TouchableWithoutFeedback>
              </View>
              <Text style={this.styles.welcomeTo}>{configJSON.welcomeToPopupText}</Text>
              <Text style={this.styles.localShows}>{configJSON.localShowsPopupText}</Text>
              <Text style={this.styles.loginFirst}>{configJSON.loginFirstPopupText}</Text>
              <TouchableOpacity
                testID="createAccountBtn"
                onPress={() => { this.moveToLoginSignupScreen("signup") }}
              >
                <Text style={this.styles.createAccount}>{configJSON.createAccountPopupText}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                testID="loginBtn"
                style={this.styles.loginBtn}
                onPress={() => { this.moveToLoginSignupScreen("login") }}
              >
                <Text style={this.styles.loginTxt}>{configJSON.loginPopupText}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </>
    )
  }

  renderLikesCount = (item: any) => {
    const theme = this.getSearchTheme();
    return (
      <>

        {(item.attributes.likes_count) !== 0 &&
          <TouchableOpacity
            testID="likeThisTxt"
            onPress={() => this.handleLikeCountOnPress(item.id, item.type)}>
            <Text style={this.styles.compactShowSocialText}>
              <Text style={{ fontWeight: '700', color: theme.primary }}>
                {item.attributes.likes_count} people{' '}
              </Text>
              like this
            </Text>
          </TouchableOpacity>
        }

      </>
    )
  }

  renderLikeCommentsRow = (item: any) => {
    return (
      <View style={this.styles.compactShowActions}>
        <View style={this.styles.compactShowActionIcons}>
          <TouchableOpacity
            testID="cmmentIcon"
            onPress={() => this.handleShowCommentClicked(item.id)}>
            <Image
              source={require('../../../mobile/assets/images/image_chat_bubble_outline_24px.png')}
              style={this.styles.compactShowActionIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.handleResultShare(item)}>
            <Image
              source={require('../../../mobile/assets/images/image_share_24px.png')}
              style={this.styles.compactShowActionIcon}
            />
          </TouchableOpacity>
          {!item.attributes.added_in_calendar && (
            <TouchableOpacity
              testID="addToCalendarIcon"
              onPress={() => this.handleCalendarOnPress(item.id)}
              style={this.styles.hiddenSearchControl}>
              <Image
                source={require('../../../mobile/assets/images/image_calendar.png')}
                style={this.styles.calendarIcon}
              />
            </TouchableOpacity>
          )}
        </View>

        {!item.attributes.added_in_calendar && (
          <TouchableOpacity
            testID="addToCalendar"
            onPress={() => this.handleCalendarOnPress(item.id)}>
            <Text style={this.styles.compactShowCalendarText}>Add it to my calendar</Text>
          </TouchableOpacity>
        )}
      </View>
    )
  }

  renderCompactShowThumb = (item: any) => {
    const imageUri = this.getResultShowImage(item.attributes);
    if (imageUri) {
      return (
        <FastImage
          style={this.styles.compactShowThumb}
          source={{
            uri: imageUri,
            priority: FastImage.priority.high,
          }}
          resizeMode={FastImage.resizeMode.cover}
        />
      );
    }
    return (
      <View style={this.styles.compactShowThumbPlaceholder}>
        <Icon name="image" size={32} color={this.getSearchTheme().muted} />
      </View>
    );
  };

  renderImageSection = (item: any) => {
    return (
      <View style={this.styles.compactShowThumbWrap}>
        {this.renderCompactShowThumb(item)}
      </View>
    )
  }

  renderHeader = (item: any) => {
    const attrs = item.attributes || {};
    const title = this.getResultShowTitle(attrs);
    const bandDisplayName =
      typeof attrs.band_name === 'string' ? attrs.band_name : '';
    return (
      <View style={this.styles.compactShowTitleRow}>
        <TouchableOpacity
          testID="bandProfileImage"
          onPress={() => this.redirectToBandProfile(attrs.account_id)}
          style={this.styles.hiddenSearchControl}
        />
        <Text
          style={this.styles.compactShowTitle}
          numberOfLines={2}
          testID="bandName"
          onPress={() => this.redirectToBandProfile(attrs.account_id)}>
          {title !== '' ? title : bandDisplayName}
        </Text>
        <TouchableOpacity
          testID="likeBtn"
          onPress={() => this.handleLikeOnPress(item.id)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={{ flexShrink: 0 }}>
          <Image
            source={
              attrs.like_by_me
                ? require('../../../mobile/assets/images/favourite_filled.png')
                : require('../../../mobile/assets/images/image_favorite.png')
            }
            style={this.styles.compactShowLikeIcon}
          />
        </TouchableOpacity>
      </View>
    )
  }

  renderEmptyComponent = () => {
    return (
      <View style={this.styles.emptyComponent}>
        <Text style={this.styles.noRecord}>{"No record(s) found"}</Text>
      </View>
    )
  }

  renderDescription = (item: any) => {
    const attrs = item.attributes || {};
    const genreLabel = this.formatResultGenreLabel(attrs.genre);
    const lineupLabel = this.formatResultLineupLabel(attrs.line_ups);
    return (
      <>
        {genreLabel !== '' && (
          <Text style={this.styles.compactShowGenre} numberOfLines={1}>
            {genreLabel}
          </Text>
        )}
        {lineupLabel !== '' && (
          <Text style={this.styles.compactShowLineup} numberOfLines={1}>
            {lineupLabel}
          </Text>
        )}
      </>
    )
  }

  renderVenueTimeRow = (item: any) => {
    const theme = this.getSearchTheme();
    const attrs = item.attributes || {};
    const venue =
      (typeof attrs.location === 'string' && attrs.location.trim()) ||
      (typeof attrs.city === 'string' && attrs.city.trim()) ||
      '';
    const timeLabel = this.formatResultTime(attrs.time || '');
    return (
      <View style={this.styles.compactShowMetaRow}>
        <TouchableOpacity
          testID="openMaps"
          onPress={() => { this.openGoogleMaps(attrs) }}
          style={this.styles.locationContainer}>
          <Icon name="map-pin" size={11} color={theme.primary} />
          <Text style={this.styles.compactShowVenue} numberOfLines={1}>
            {venue}
            {venue !== '' ? ' ' : ''}
          </Text>
        </TouchableOpacity>
        {timeLabel !== '' && (
          <Text style={this.styles.compactShowTime}>{timeLabel}</Text>
        )}
      </View>
    );
  };

  renderCommentsCount = (item: any) => {
    return (
      <Text
        testID="commentsCount"
        style={this.styles.compactShowSocialText}
      >{item.attributes.comment_count ? item.attributes.comment_count : item.attributes.comments_count ? item.attributes.comments_count : 0} comments  <Text testID="comments" style={this.styles.compactShowSocialLink}
        onPress={() => this.handleShowCommentClicked(item.id)}
      >See the comments</Text>
      </Text>
    )
  }

  renderCompactShowFooter = (item: any) => {
    const attrs = item.attributes || {};
    const categoryLabel = this.getResultCategoryLabel(attrs);
    const showDate =
      typeof attrs.date_of_the_show === 'string' ? attrs.date_of_the_show : '';
    const dateLabel =
      item.type !== 'post' && showDate !== ''
        ? this.formatResultFooterDate(showDate)
        : '';
    if (categoryLabel === '' && dateLabel === '') {
      return null;
    }
    return (
      <View style={this.styles.compactShowFooter}>
        {categoryLabel !== '' ? (
          <View style={this.styles.compactShowCategoryPill}>
            <Text style={this.styles.compactShowCategoryText}>{categoryLabel}</Text>
          </View>
        ) : (
          <View />
        )}
        {dateLabel !== '' ? (
          <Text style={this.styles.compactShowFooterDate}>{dateLabel}</Text>
        ) : null}
      </View>
    );
  };

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
          <View style={[this.styles.centeredView, this.styles.commentsParentView]}>
            <TouchableOpacity activeOpacity={1} testID="commentsModal" onPress={() => this.hideKeyboard()} style={[this.styles.modalView, this.styles.commentView]}>
              <View style={this.styles.commentHeader}>
                <Text style={this.styles.commentHeading}>Comments</Text>
                <TouchableOpacity
                  testID="closeCommentsPopupButton"
                  onPress={this.handleCloseCommentModal}
                >
                  <Icon name="x" size={25} color={this.getSearchTheme().foreground} />
                </TouchableOpacity>
              </View>
              <View style={this.styles.horizontalRuler} />
              {this.renderComments()}
              <View style={this.styles.emojiSelection}>
                {this.defaultEmojisForSelectionBar.map((emoji: string) => (
                  <TouchableOpacity testID="emoji" key={emoji} onPress={() => this.handleEmojiSelected(emoji)}>
                    <Text style={this.styles.emojiSelectionBarIcon}>{emoji}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={this.styles.commentInputArea}>
                <View style={this.styles.userAvatarView}>
                  <FastImage
                    source={this.state.userProfilePic ?
                      {
                        uri: this.state.userProfilePic,
                        priority: FastImage.priority.high
                      } :
                      defaultProfile
                    }
                    resizeMode={FastImage.resizeMode.cover}
                    style={this.styles.userAvatarImg}
                  />
                </View>
                <TextInput
                  testID="commentTextInput"
                  ref={(input) => { this.commentTextInput = input; }}
                  style={this.styles.commentReplyTextInput}
                  placeholderTextColor={this.getSearchTheme().muted}
                  placeholder={this.state.replying ? "Add a reply..." : "Add a comment..."}
                  value={this.state.commentText}
                  onChangeText={(commentText) => this.handleCommentTxtChange(commentText)}
                  multiline
                />
                <TouchableOpacity
                  testID="emojiCommentBtn"
                  style={this.styles.emojiButtons}
                  onPress={this.handleCommentSubmitEditing}
                >
                  <MaterialCommunityIcons name="send" color={this.getSearchTheme().primary} size={30} />
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
            <TouchableOpacity
              testID="navigateToDetail"
              activeOpacity={0.92}
              onPress={() => {
                const info = {
                  eventId: item.id,
                  eventState: item.attributes.state,
                }
                this.handleNavigationSearch("AllEventDetailScreen", info)
              }}>
              <View style={this.styles.compactShowCard}>
                <View style={this.styles.compactShowMainRow}>
                  {this.renderImageSection(item)}
                  <View style={this.styles.compactShowBody}>
                    {this.renderHeader(item)}
                    {this.renderDescription(item)}
                    {this.renderVenueTimeRow(item)}
                    {this.renderLikeCommentsRow(item)}
                    {this.renderLikesCount(item)}
                    {this.renderCommentsCount(item)}
                  </View>
                </View>
                {this.renderCompactShowFooter(item)}
              </View>
            </TouchableOpacity>
          )
        }}
        keyExtractor={(item:any) => item.id}
        ListHeaderComponent={this.renderShowsCountHeader}
        ListEmptyComponent={this.renderEmptyComponent}
        contentContainerStyle={this.styles.listContent}
        style={this.styles.resultsList}
        keyboardShouldPersistTaps="always"
        bounces={false}
      />
    )
  }

  // Customizable Area End

  render() {
    // Customizable Area Start
    return (
      <SafeAreaView style={this.styles.parentContainer}>
        <StatusBar
          animated={true}
          hidden={false}
          backgroundColor={this.getSearchTheme().background}
          barStyle={this.state.isDarkMode ? 'light-content' : 'dark-content'}
        />
        <View style={this.styles.container}>
          {/* Customizable Area Start */}
          <TouchableWithoutFeedback
            testID={"hideKeyboard"}
            onPress={() => {
              this.hideKeyboard();
            }}>
            <View style={this.styles.resultsWrap}>
              {this.renderPageHeader()}
              {this.renderSearchData()}
            </View>

            {/* Customizable End Start */}
          </TouchableWithoutFeedback>
          {this.renderLoginSignupPopup()}
          {this.renderCommentsModal()}
          {this.renderModalReplies()}

        </View>
      </SafeAreaView>
      //Merge Engine End DefaultContainer
    );
    // Customizable Area End
  }
}

// Customizable Area Start

const FEED_GUTTER = 16;
const FEED_CARD_GAP = 12;
const FEED_CARD_PAD = 12;

const createSearchResultStyles = (theme: SearchResultTheme) =>
  StyleSheet.create({
    parentContainer: {
      flex: 1,
      backgroundColor: theme.background,
    },
    container: {
      flex: 1,
      marginLeft: 'auto',
      marginRight: 'auto',
      width: '100%',
      maxWidth: 650,
      backgroundColor: theme.background,
    },
    resultsList: {
      flex: 1,
    },
    resultsWrap: {
      flex: 1,
    },
    hamburgerIcon: {
      height: 20,
      width: 20,
      resizeMode: 'contain',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: theme.background,
      height: 56,
      paddingHorizontal: FEED_GUTTER,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.border,
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
    headerSideBtn: {
      width: 36,
      height: 36,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: {
      fontWeight: '900',
      fontSize: 20,
      letterSpacing: 0.4,
      color: theme.foreground,
      textAlign: 'center',
      textTransform: 'uppercase',
    },
    listContent: {
      paddingBottom: 24,
      flexGrow: 1,
    },
    showsCountRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: FEED_GUTTER,
      marginTop: 16,
      marginBottom: 16,
    },
    showsCountLabelWrap: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 10,
    },
    showsCountDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: theme.primary,
      marginRight: 6,
    },
    showsCountText: {
      color: theme.primary,
      fontSize: 12,
      fontWeight: '800',
      letterSpacing: 0.8,
    },
    showsCountLine: {
      flex: 1,
      height: StyleSheet.hairlineWidth,
      backgroundColor: theme.divider,
      marginRight: 10,
    },
    showsCountArea: {
      color: theme.muted,
      fontSize: 12,
      fontWeight: '600',
    },
    compactShowCard: {
      flexDirection: 'column',
      marginHorizontal: FEED_GUTTER,
      marginBottom: FEED_CARD_GAP,
      padding: FEED_CARD_PAD,
      borderRadius: 16,
      backgroundColor: theme.card,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border,
    },
    compactShowMainRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    compactShowThumbWrap: {
      width: 108,
      height: 108,
      borderRadius: 14,
      overflow: 'hidden',
      backgroundColor: theme.input,
    },
    compactShowThumb: {
      width: 108,
      height: 108,
    },
    compactShowThumbPlaceholder: {
      width: 108,
      height: 108,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.input,
    },
    compactShowBody: {
      flex: 1,
      marginLeft: FEED_CARD_PAD,
      minWidth: 0,
      minHeight: 108,
    },
    compactShowTitleRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
    },
    compactShowTitle: {
      flex: 1,
      color: theme.foreground,
      fontSize: 16,
      fontWeight: '800',
      letterSpacing: 0.2,
      textTransform: 'uppercase',
      paddingRight: 8,
    },
    compactShowGenre: {
      color: theme.muted,
      fontSize: 12,
      fontWeight: '500',
      marginTop: 2,
    },
    compactShowLineup: {
      color: theme.muted,
      fontSize: 11,
      fontWeight: '500',
      marginTop: 2,
    },
    compactShowMetaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
      marginTop: 8,
    },
    compactShowVenue: {
      color: theme.foreground,
      fontSize: 12,
      fontWeight: '600',
      marginLeft: 4,
      flexShrink: 1,
    },
    compactShowTime: {
      color: theme.accent,
      fontSize: 12,
      fontWeight: '700',
      marginLeft: 8,
    },
    compactShowActions: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 8,
    },
    compactShowActionIcons: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    compactShowActionIcon: {
      height: 18,
      width: 18,
      resizeMode: 'contain',
      tintColor: theme.muted,
      marginRight: 10,
    },
    compactShowLikeIcon: {
      height: 18,
      width: 20,
      resizeMode: 'contain',
      tintColor: theme.primary,
    },
    compactShowCalendarText: {
      color: theme.primary,
      fontWeight: '500',
      fontSize: 12,
    },
    compactShowSocialText: {
      color: theme.muted,
      fontSize: 12,
      fontWeight: '600',
      marginTop: 6,
    },
    compactShowSocialLink: {
      color: theme.primary,
      fontWeight: '400',
    },
    compactShowFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: FEED_CARD_PAD,
      paddingTop: FEED_CARD_PAD,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: theme.divider,
    },
    compactShowCategoryPill: {
      borderRadius: 999,
      paddingHorizontal: 14,
      paddingVertical: 6,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.primary,
      backgroundColor: theme.primarySoft,
    },
    compactShowCategoryText: {
      color: theme.primary,
      fontSize: 13,
      fontWeight: '800',
      letterSpacing: 0.2,
    },
    compactShowFooterDate: {
      color: theme.muted,
      fontSize: 12,
      fontWeight: '500',
    },
    hiddenSearchControl: {
      position: 'absolute',
      width: 0,
      height: 0,
      overflow: 'hidden',
      opacity: 0,
    },
    locationContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      flexShrink: 1,
    },
    centeredView: {
      flex: 1,
      justifyContent: 'flex-end',
      paddingTop: 22,
      backgroundColor: '#08080f99',
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
    welcomeTo: {
      textAlign: 'center',
      fontSize: 20,
      lineHeight: 32,
      marginTop: 10,
      color: theme.muted,
    },
    localShows: {
      fontWeight: '700',
      fontSize: 28,
      lineHeight: 32,
      bottom: '5%',
      textAlign: 'center',
      color: theme.primary,
      marginVertical: 10,
    },
    loginFirst: {
      textAlign: 'center',
      lineHeight: 24,
      marginBottom: '5%',
      fontWeight: '400',
      fontSize: 16,
      color: theme.foreground,
    },
    createAccount: {
      color: theme.primary,
      fontWeight: '700',
      lineHeight: 24,
      marginBottom: '4%',
      fontSize: 16,
      textAlign: 'center',
    },
    loginBtn: {
      backgroundColor: theme.primary,
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
      backgroundColor: '#08080f99',
    },
    commentView: {
      height: '75%',
      padding: 20,
      justifyContent: 'flex-start',
    },
    commentHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    commentHeading: {
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
      backgroundColor: theme.input,
      width: 42,
      height: 42,
      borderRadius: 80,
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: theme.border,
      marginRight: 10,
    },
    commentReplyTextInput: {
      flex: 1,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.input,
      color: theme.foreground,
      borderRadius: 10,
      paddingHorizontal: 10,
      paddingRight: 50,
      paddingTop: 12,
      height: '100%',
      fontSize: 16,
      textAlignVertical: 'center',
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
      color: theme.muted,
    },
    commentItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 10,
    },
    commentContent: {
      flex: 1,
    },
    commenterName: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.foreground,
    },
    commentInput: {
      fontSize: 14,
      color: theme.foreground,
    },
    likeContainer: {
      alignSelf: 'flex-start',
      alignItems: 'center',
      justifyContent: 'center',
    },
    likesCountTxt: {
      color: theme.muted,
      textAlign: 'center',
    },
    replyButton: {
      alignSelf: 'flex-start',
    },
    replyButtonText: {
      fontWeight: 'bold',
      fontSize: 14,
      color: theme.muted,
    },
    showReplyButton: {
      flexDirection: 'row',
      alignSelf: 'flex-start',
      alignItems: 'center',
    },
    horizontalBar: {
      height: 1,
      width: 20,
      marginRight: 10,
      backgroundColor: theme.muted,
    },
    showReplyButtonText: {
      fontSize: 14,
      color: theme.muted,
    },
    replyInput: {
      marginTop: 10,
      color: theme.foreground,
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
      backgroundColor: theme.card,
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
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
    calendarIcon: {
      marginLeft: 5,
      tintColor: theme.primary,
      height: 20,
      width: 19,
    },
    emptyComponent: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.background,
      paddingTop: 50,
    },
    noRecord: {
      fontSize: 14,
      fontWeight: '400',
      color: theme.muted,
    },
  });

const darkSearchResultStyles = createSearchResultStyles(redesignTheme);
const lightSearchResultStyles = createSearchResultStyles(lightTheme);
// Customizable Area End

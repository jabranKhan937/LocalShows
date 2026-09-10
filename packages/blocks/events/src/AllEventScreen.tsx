import React from 'react';
// Customizable Area Start.                             
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  FlatList,
  StatusBar,
  TextInput,
  Image,
  ActivityIndicator,
  RefreshControl,
  Platform,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  darkAllEventStyles,
  lightAllEventStyles,
} from './AllEventStyle';
import { leftArrow } from './assets';
import Svg, { Path } from 'react-native-svg';
import Icon from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { defaultProfile } from '../../user-profile-basic/src/assets';
import { SwipeListView } from 'react-native-swipe-list-view';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Picker } from '@react-native-picker/picker';
import FastImage from '../../../components/src/SafeFastImage';
import {
  deviceHeight,
  deviceWidth,
  getStorageData,
  removeStorageData,
  setStorageData,
} from '../../../framework/src/Utilities';

// Customizable Area End

import AllEventController, { Props, baseURL } from './AllEventController';

export default class AllEventScreen extends AllEventController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }

  get styles() {
    return this.state.isDarkMode ? darkAllEventStyles : lightAllEventStyles;
  }

  failedArtistImageIds = new Set<string>();
                                                      
  async componentDidMount() {
    try {
      // Customizable Area Start
      await super.componentDidMount();
      this.attachHomeFeedNavigationListeners();

      this.handleNotification();
      this.showPopup();

      this.getAuthToken();
      this.getAllBandsList();
      this.initialiseLocation();
      this.refreshUserSelectionStateList();
      this.getUnreadNotificationsCount();
      await this.checkForceUpdateRequirement();
      await this.maybeShowTncModal();
      this.connectGlobalSocket();

      setTimeout(() => this.syncSelectedStateIfInvalid(), 0);

      // Customizable Area End
    } catch (error) {
      // Error in componentDidMount
    }
  }

  onHomeFeedScreenFocus = async () => {
    await this.checkForceUpdateRequirement();
    this.refreshUserSelectionStateList();
    await this.maybeShowTncModal();
  };

  maybeShowTncModal = async () => {
    const authToken =
      this.state.authToken ?? (await getStorageData('authToken'));
    const termsIsAccept = await getStorageData('tAndCAcceptance');
    if (
      termsIsAccept !== 'true' &&
      authToken !== null &&
      termsIsAccept !== null
    ) {
      this.setState({ showTncModal: true });
    }
  };

  /**
   * Android Picker throws if selectedValue is not exactly one of the Item values.
   * Keep `selectedState` aligned with `getStateDropdownList()` after location/API updates.
   */
  syncSelectedStateIfInvalid = () => {
    const list = this.getStateDropdownList();
    if (list.length === 0) {
      return;
    }
    const { selectedState } = this.state;
    const ok =
      typeof selectedState === 'string' &&
      selectedState !== '' &&
      list.includes(selectedState);
    if (ok) {
      return;
    }
    const fallback = list.includes('All') ? 'All' : list[0];
    if (fallback != null && fallback !== selectedState) {
      this.setState({ selectedState: fallback });
    }
  };

  componentDidUpdate(_prevProps: Props, prevState: Record<string, unknown>) {
    const listRelevant =
      prevState.selectedState !== this.state.selectedState ||
      prevState.currentLocationState !== this.state.currentLocationState ||
      prevState.stateNameList !== this.state.stateNameList ||
      prevState.authenticatedEventsList !==
        this.state.authenticatedEventsList ||
      prevState.authToken !== this.state.authToken;
    if (listRelevant) {
      this.syncSelectedStateIfInvalid();
    }
  }

  // Customizable Area Start
  defaultEmojisForSelectionBar = [
    '️💖',
    '🙌',
    '🔥',
    '👏',
    '😢',
    '😍',
    '😲',
    '😂',
  ];
                                
  renderEventItem = ({
    item,
    index = 0,
    totalItems,
  }: {
    item: any;
    index?: number;
    totalItems?: number;
  }) => {
    const allShows = this.state.expandedItems.includes(item.state_name);
    const showsRaw = Array.isArray(item.shows) ? item.shows : [];
    const showsListForGuestUsers = showsRaw.filter(
      (card: { type?: string }) => card && card.type === 'show',
    );
    const seeMoreButton = showsListForGuestUsers.length > 4;
    const isLoggedIn = !!this.state.authToken;
    const isLastItem =
      totalItems !== undefined ? index === totalItems - 1 : false;
    const stateKey = String(item?.state_name ?? 'unknown');
    return (
      <View
        style={{
          backgroundColor: this.getHomeTheme().background,
          paddingBottom: 8,
        }}
        key={`guest-state-${stateKey}-${index}`}
      >
        {showsListForGuestUsers
          .slice(0, allShows ? 10 : 4)
          .map((show: any, showIndex: number) => {
            const showKey =
              show?.id != null && show.id !== ''
                ? `g-${show.id}`
                : `g-${stateKey}-${showIndex}`;
            const title = this.getCompactShowTitle(show);
            const venue =
              (typeof show?.location === 'string' && show.location.trim()) ||
              (typeof show?.city === 'string' && show.city.trim()) ||
              '';
            const timeLabel = this.formatFeaturedTime(show?.time || '');
            return (
              <TouchableWithoutFeedback
                key={showKey}
                testID="eventLaunch"
                onPress={() =>
                  this.handleEventLaunch(show, item.state_name)
                }
              >
                <View style={this.styles.compactShowCard}>
                  <View style={this.styles.compactShowMainRow}>
                    <View style={this.styles.compactShowThumbWrap}>
                      {this.renderCompactShowThumb(show)}
                    </View>
                    <View style={this.styles.compactShowBody}>
                      {title !== '' && (
                        <Text style={this.styles.compactShowTitle} numberOfLines={2}>
                          {title}
                        </Text>
                      )}
                      {(venue !== '' || timeLabel !== '') && (
                        <View style={this.styles.compactShowMetaRow}>
                          {venue !== '' && (
                            <>
                              <Icon
                                name="map-pin"
                                size={11}
                                color={this.getHomeTheme().primary}
                              />
                              <Text
                                style={this.styles.compactShowVenue}
                                numberOfLines={1}
                              >
                                {venue}
                              </Text>
                            </>
                          )}
                          {timeLabel !== '' && (
                            <Text style={this.styles.compactShowTime}>
                              {timeLabel}
                            </Text>
                          )}
                        </View>
                      )}
                    </View>
                  </View>
                  {this.renderCompactShowFooter(show, 'show')}
                </View>
              </TouchableWithoutFeedback>
            );
          })}
        {((isLoggedIn && !allShows && seeMoreButton) ||
          (!isLoggedIn && isLastItem)) && (
          <View>
            <Text
              style={this.styles.compactSeeMoreText}
              testID="toggleSeeMore"
              onPress={() => {
                if (isLoggedIn) {
                  this.toggleSeeMore(item.state_name);
                } else {
                  this.moveToLoginScreen('signup');
                }
              }}
            >
              {isLoggedIn ? 'See more' : 'Sign Up For Free'}
            </Text>
          </View>
        )}
      </View>
    );
  };

  renderShowMoreFooter = (hasMoreShows: boolean) => {
    if (!hasMoreShows) {
      return null;
    }
    return (
      <TouchableOpacity
        testID="toggleSeeMore"
        onPress={this.handleShowMore}
        activeOpacity={0.7}
        style={this.styles.compactShowMoreFooterButton}
      >
        <Text style={this.styles.compactShowMoreFooter}>Show more</Text>
      </TouchableOpacity>
    );
  };

  renderHomeFeedFooter = (hasMoreShows: boolean) => {
    const artists = this.getArtistsToWatch();
    const venues = this.getHotVenues();
    if (!hasMoreShows && artists.length === 0 && venues.length === 0) {
      return null;
    }
    return (
      <View testID="homeFeedDiscoveryFooter" style={this.styles.discoveryFooter}>
        {this.renderShowMoreFooter(hasMoreShows)}
        {this.renderArtistsToWatchSection(artists)}
        {this.renderHotVenuesSection(venues)}
      </View>
    );
  };

  renderArtistWatchAvatar = (artist: {
    id: string;
    image?: string;
  }) => {
    const uri = this.resolveHomeFeedImageUrl(artist.image);
    if (!uri || this.failedArtistImageIds.has(artist.id)) {
      return this.renderThemedArtistPlaceholder();
    }
    return (
      <FastImage
        style={this.styles.artistWatchAvatar}
        source={{ uri, priority: FastImage.priority.high }}
        resizeMode={FastImage.resizeMode.cover}
        onError={() => {
          this.failedArtistImageIds.add(artist.id);
          this.forceUpdate();
        }}
      />
    );
  };

  renderThemedArtistPlaceholder = () => {
    return (
      <View
        testID="artistWatchPlaceholder"
        style={this.styles.artistWatchAvatarPlaceholder}
      >
        <Icon name="music" size={26} color={this.getHomeTheme().primary} />
      </View>
    );
  };

  resolveHomeFeedImageUrl = (value: any): string => {
    if (!value) {
      return '';
    }
    if (typeof value === 'object') {
      return this.resolveHomeFeedImageUrl(
        value.url || value.uri || value.image,
      );
    }
    if (typeof value !== 'string') {
      return '';
    }
    let trimmed = value.trim();
    if (!trimmed || trimmed === 'null' || trimmed === 'undefined') {
      return '';
    }
    if (
      /default[_-]?profile|placeholder|missing\.png|person\.png/i.test(trimmed)
    ) {
      return '';
    }
    if (trimmed.startsWith('//')) {
      trimmed = `https:${trimmed}`;
    } else if (trimmed.startsWith('/') || trimmed.startsWith('rails/')) {
      const origin = String(baseURL || '').replace(/\/$/, '');
      trimmed = `${origin}/${trimmed.replace(/^\//, '')}`;
    }
    return trimmed.replace(/^(https?:\/\/[^/]+)\/\//, '$1/');
  };

  renderArtistsToWatchSection = (
    artists = this.getArtistsToWatch(),
  ) => {
    if (!artists.length) {
      return null;
    }
    return (
      <View testID="artistsToWatchSection" style={this.styles.discoverySection}>
        <View style={this.styles.discoverySectionHeader}>
          <Text style={this.styles.discoverySectionTitle}>ARTISTS TO WATCH</Text>
          <TouchableOpacity
            testID="seeAllArtists"
            style={this.styles.discoverySectionLink}
            onPress={this.handleSeeAllArtists}
            activeOpacity={0.7}
          >
            <Text style={this.styles.discoverySectionLinkText}>See all</Text>
            <Icon
              name="chevron-right"
              size={14}
              color={this.getHomeTheme().primary}
            />
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          nestedScrollEnabled
          directionalLockEnabled
          keyboardShouldPersistTaps="handled"
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={this.styles.discoveryRowContent}
        >
          {artists.map(artist => (
            <Pressable
              key={artist.id}
              testID={`artistToWatch-${artist.id}`}
              style={this.styles.artistWatchItem}
              onPress={() => {
                this.handleArtistToWatchPress(artist);
              }}
            >
              <View
                pointerEvents="none"
                style={this.styles.artistWatchAvatarWrap}
              >
                {this.renderArtistWatchAvatar(artist)}
                <View style={this.styles.artistWatchBadge}>
                  <Icon name="plus" size={12} color="#FFFFFF" />
                </View>
              </View>
              <Text
                pointerEvents="none"
                style={this.styles.artistWatchName}
                numberOfLines={1}
              >
                {artist.name}
              </Text>
              <Text
                pointerEvents="none"
                style={this.styles.artistWatchMeta}
                numberOfLines={1}
              >
                {artist.upcomingCount > 0
                  ? `${artist.upcomingCount} upcoming`
                  : ''}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    );
  };

  renderHotVenuesSection = (venues = this.getHotVenues()) => {
    if (!venues.length) {
      return null;
    }
    return (
      <View testID="hotVenuesSection" style={this.styles.discoverySection}>
        <View style={this.styles.discoverySectionHeader}>
          <Text style={this.styles.discoverySectionTitle}>HOT VENUES</Text>
          <TouchableOpacity
            testID="viewVenuesMap"
            style={this.styles.discoverySectionLink}
            onPress={this.handleViewHotVenuesMap}
            activeOpacity={0.7}
          >
            <Text style={this.styles.discoverySectionLinkText}>View map</Text>
            <Icon
              name="chevron-right"
              size={14}
              color={this.getHomeTheme().primary}
            />
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={this.styles.discoveryRowContent}
        >
          {venues.map(venue => {
            const showLabel =
              venue.showCount === 1
                ? '1 show'
                : `${venue.showCount} shows`;
            return (
              <TouchableOpacity
                key={venue.id}
                testID={`hotVenue-${venue.id}`}
                style={this.styles.hotVenueCard}
                activeOpacity={0.9}
                onPress={() => this.openGoogleMaps(venue)}
              >
                {venue.image ? (
                  <FastImage
                    style={this.styles.hotVenueImage}
                    source={{
                      uri: venue.image,
                      priority: FastImage.priority.high,
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                ) : (
                  <View
                    style={[
                      this.styles.hotVenueImage,
                      this.styles.compactShowThumbPlaceholder,
                    ]}
                  />
                )}
                <View style={this.styles.hotVenueScrim} />
                <View style={this.styles.hotVenueTextWrap}>
                  <Text style={this.styles.hotVenueName} numberOfLines={1}>
                    {venue.name}
                  </Text>
                  <Text style={this.styles.hotVenueMeta} numberOfLines={1}>
                    {venue.city ? `${venue.city} • ` : ''}
                    <Text style={this.styles.hotVenueCount}>{showLabel}</Text>
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  renderShowItem = (show: any, item: any) => {
    if (!show || typeof show !== 'object') {
      return null;
    }
    const showType = typeof show.type === 'string' ? show.type : '';
    if (showType !== 'show' && showType !== 'post') {
      return null;
    }
    const showId = show?.id;
    const hasShowId = showId !== null && showId !== undefined && showId !== '';
    const showDate =
      typeof show.date_of_the_show === 'string' ? show.date_of_the_show : '';
    const title = this.getCompactShowTitle(show);
    const genreLabel = this.formatGenreLabel(show.genre);
    const lineupLabel = this.formatLineupLabel(show.line_ups);
    const venue =
      (typeof show.location === 'string' && show.location.trim()) || '';
    const timeLabel = this.formatFeaturedTime(show.time || '');
    const dateLabel =
      showDate !== '' && showDate !== '2999-12-31' && showType !== 'post'
        ? `${this.formatEventMonth(showDate)} ${this.formatEventDate(showDate)}`.trim()
        : '';
    const metaTime = timeLabel !== '' ? timeLabel : dateLabel;
    const bandDisplayName =
      typeof show.band_name === 'string' ? show.band_name : '';

    return (
      <TouchableOpacity
        testID="navigateToDetail"
        activeOpacity={0.92}
        onPress={() => this.handleEventLaunch(show, item.state_name)}
      >
      <View style={this.styles.compactShowCard}>
        <View style={this.styles.compactShowMainRow}>
        <View style={this.styles.compactShowThumbWrap}>
          {this.renderCompactShowThumb(show)}
        </View>

        <View style={this.styles.compactShowBody}>
          <View style={this.styles.compactShowTitleRow}>
            <TouchableOpacity
              testID="bandProfile"
              onPress={async () =>
                await this.navigateToBandProfile(show.account_id)
              }
              style={{ flex: 1 }}
            >
              <Text
                style={this.styles.compactShowTitle}
                numberOfLines={2}
                testID="bandName"
              >
                {title !== '' ? title : bandDisplayName}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              testID="likeBtn"
              onPress={() => {
                if (hasShowId) {
                  this.handleLike(showId, showType);
                }
              }}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={{ flexShrink: 0 }}
            >
              <Image
                source={
                  show.like_by_me
                    ? require('../../../mobile/assets/images/favourite_filled.png')
                    : require('../../../mobile/assets/images/image_favorite.png')
                }
                style={this.styles.compactShowLikeIcon}
              />
            </TouchableOpacity>
          </View>

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

          {(showType === 'show' || metaTime !== '') && (
            <View style={this.styles.compactShowMetaRow}>
              {showType === 'show' && (
                <TouchableOpacity
                  testID="openMaps"
                  onPress={() => {
                    this.openGoogleMaps(show);
                  }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    flexShrink: 1,
                  }}
                >
                  <Icon
                    name="map-pin"
                    size={11}
                    color={this.getHomeTheme().primary}
                  />
                  <Text style={this.styles.compactShowVenue} numberOfLines={1}>
                    {venue}
                    {venue !== '' ? ' ' : ''}
                  </Text>
                </TouchableOpacity>
              )}
              {metaTime !== '' && (
                <Text style={this.styles.compactShowTime}>{metaTime}</Text>
              )}
            </View>
          )}

          <View style={this.styles.compactShowActions}>
            <View style={this.styles.compactShowActionIcons}>
              <TouchableOpacity
                testID="commentIcon"
                onPress={() => {
                  if (hasShowId) {
                    this.handleShowCommentClicked(showId, showType);
                  }
                }}
              >
                <Image
                  source={require('../../../mobile/assets/images/image_chat_bubble_outline_24px.png')}
                  style={this.styles.compactShowActionIcon}
                />
              </TouchableOpacity>
              <TouchableOpacity
                testID="share"
                onPress={() => {
                  if (hasShowId) {
                    this.handleShareNavigation(showId, showType);
                  }
                }}
              >
                <Image
                  source={require('../../../mobile/assets/images/image_share_24px.png')}
                  style={this.styles.compactShowActionIcon}
                />
              </TouchableOpacity>
            </View>

            {showType === 'show' &&
              null !== show.added_in_calendar &&
              !show.added_in_calendar && (
                <TouchableOpacity
                  testID="addEventToCalendarBtn"
                  onPress={() => {
                    if (hasShowId) {
                      this.handleAddEventToCalendar(showId);
                    }
                  }}
                >
                  <Text style={this.styles.compactShowCalendarText}>
                    Add it to my calendar
                  </Text>
                </TouchableOpacity>
              )}
          </View>

          {0 !== show.likes_count && (
            <TouchableOpacity
              testID="likeThisTxt"
              onPress={() => {
                if (hasShowId) {
                  this.handleLikeNavigation(String(showId), showType);
                }
              }}
            >
              <Text style={this.styles.compactShowSocialText}>
                <Text style={{ fontWeight: '700', color: this.getHomeTheme().primary }}>
                  {show.likes_count === 1
                    ? '1 person '
                    : `${show.likes_count} people `}
                </Text>
                like this
              </Text>
            </TouchableOpacity>
          )}

          <Text testID="commentsCount" style={this.styles.compactShowSocialText}>
            {show.comments_count ? show.comments_count : 0} comments{' '}
            <Text
              testID="commentsCountBtn"
              style={this.styles.compactShowSocialLink}
              onPress={() => {
                if (hasShowId) {
                  this.handleShowCommentClicked(showId, showType);
                }
                this.setState({
                  showId: showId,
                  showType: showType,
                });
              }}
            >
              See the comments
            </Text>
          </Text>
        </View>
        </View>
        {this.renderCompactShowFooter(show, showType)}
      </View>
      </TouchableOpacity>
    );
  };

  renderItems = (item: any, index: number) => {
    const rowKey = String(item?.state_name ?? `row-${index}`);
    const shows = Array.isArray(item.shows) ? item.shows : [];
    const normalizedShows = shows.filter(
      (show: any) =>
        show &&
        typeof show === 'object' &&
        (show.type === 'show' || show.type === 'post'),
    );
    return (
      <View key={`auth-state-${rowKey}-${index}`}>
        {normalizedShows.map((show: any, showIndex: number) => (
          <React.Fragment
            key={
              show?.id != null && show.id !== ''
                ? `auth-show-${show.id}`
                : `auth-show-${rowKey}-${showIndex}`
            }
          >
            {this.renderShowItem(show, item)}
          </React.Fragment>
        ))}
      </View>
    );
  };

  filterEventList() {
    const areAllStatesSelected =
      this.state.selectedState === 'All' || this.state.selectedState === '';
    const filteredList = areAllStatesSelected
      ? this.state.authenticatedEventsList
      : this.state.filteredEventList;
    return this.state.expandedItems.length === 0
      ? filteredList
      : filteredList.filter(item =>
          this.state.expandedItems.includes(item.state_name),
        );
  }

  renderRedDot = ({ condition }: { condition: boolean }) => {
    if (condition) {
      return <View style={this.styles.redDot} />;
    }

    return <></>;
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

  renderTnCModal = () => {
    return (
      <Modal
        animationType="none"
        statusBarTranslucent={true}
        transparent={true}
        visible={this.state.showTncModal}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(51, 65, 85, 0.5)',
            justifyContent: 'flex-end',
          }}
        >
          <View
            style={{
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
            }}
          >
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
                  this.closeTnCModal();
                }}
              >
                <Svg
                  style={{
                    width: 20,
                    height: 20,
                  }}
                  width={14}
                  height={14}
                  viewBox="0 0 14 14"
                  fill="#0F172A"
                >
                  <Path
                    d="M13.3.71a.996.996 0 00-1.41 0L7 5.59 2.11.7A.996.996 0 10.7 2.11L5.59 7 .7 11.89a.996.996 0 101.41 1.41L7 8.41l4.89 4.89a.996.996 0 101.41-1.41L8.41 7l4.89-4.89c.38-.38.38-1.02 0-1.4z"
                    fill="#0F172A"
                  />
                </Svg>
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
                We have just updated our terms and conditions please check them
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
                      this.closeTnCModal();
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
                      this.handleTncUpdateCheckOut();
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

  renderLocationPopup = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.modalVisible}
      >
        <View style={this.styles.centeredView}>
          <View style={this.styles.modalView}>
            <TouchableWithoutFeedback
              testID="popupCloseButton"
              onPress={this.handlePopupCloseButton}
            >
              <Svg
                style={{
                  position: 'absolute',
                  top: 20,
                  right: 20,
                  width: 20,
                  height: 20,
                }}
                width={14}
                height={14}
                viewBox="0 0 14 14"
                fill="#0F172A"
              >
                <Path
                  d="M13.3.71a.996.996 0 00-1.41 0L7 5.59 2.11.7A.996.996 0 10.7 2.11L5.59 7 .7 11.89a.996.996 0 101.41 1.41L7 8.41l4.89 4.89a.996.996 0 101.41-1.41L8.41 7l4.89-4.89c.38-.38.38-1.02 0-1.4z"
                  fill="#0F172A"
                />
              </Svg>
            </TouchableWithoutFeedback>

            <Text
              style={{
                textAlign: 'center',
                fontSize: 20,
                lineHeight: 28,
                marginTop: 10,
                color: '#334166',
              }}
            >
              Welcome to
            </Text>
            <Text
              style={{
                fontWeight: '700',
                fontSize: 28,
                lineHeight: 32,
                bottom: '5%',
                textAlign: 'center',
                color: '#3333CC',
              }}
            >
              Local Shows
            </Text>
            <Text
              style={{
                textAlign: 'center',
                lineHeight: 24,
                marginBottom: '5%',
                fontWeight: '400',
                fontSize: 16,
                color: '#334166',
              }}
            >
              Do you want to see shows near your Geo Location?
            </Text>

            <TouchableOpacity
              testID="noThanksButton"
              onPress={this.handlePopupCloseButton}
            >
              <Text
                style={{
                  color: '#3333CC',
                  fontWeight: '700',
                  lineHeight: 24,
                  marginBottom: '4%',
                  fontSize: 16,
                  textAlign: 'center',
                }}
              >
                No, thanks
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              testID="allowLocationPermissionButton"
              style={{
                backgroundColor: '#3333CC',
                borderRadius: 8,
                height: 56,
                justifyContent: 'center',
              }}
              onPress={this.modalYesClicked}
            >
              <Text style={this.styles.textStyle}>Yes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  renderLoginModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.loginPopup}
        onRequestClose={this.handleCloseBtn}
      >
        <View
          style={[
            this.styles.centeredView,
            { backgroundColor: 'rgba(8, 8, 15, 0.72)' },
          ]}
        >
          <TouchableWithoutFeedback onPress={this.handleCloseBtn}>
            <View style={{ flex: 1 }} />
          </TouchableWithoutFeedback>
          <View style={this.styles.loginSheet}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={this.styles.closeBtn}
              testID="loginPopupCloseButton"
              onPress={this.handleCloseBtn}
            >
              <Svg
                width={14}
                height={14}
                viewBox="0 0 14 14"
                fill={this.getHomeTheme().foreground}
              >
                <Path
                  d="M13.3.71a.996.996 0 00-1.41 0L7 5.59 2.11.7A.996.996 0 10.7 2.11L5.59 7 .7 11.89a.996.996 0 101.41 1.41L7 8.41l4.89 4.89a.996.996 0 101.41-1.41L8.41 7l4.89-4.89c.38-.38.38-1.02 0-1.4z"
                  fill={this.getHomeTheme().foreground}
                />
              </Svg>
            </TouchableOpacity>
            <SafeAreaView edges={['bottom']}>
              <Text style={this.styles.welcomeToPopupText}>Welcome to</Text>
              <Text style={this.styles.localShowsPopupText}>Local Shows</Text>
              <Text style={this.styles.loginFirstPopupText}>
                You have to Log in first to access the events.
              </Text>
              <TouchableOpacity
                testID="createAccountBtn"
                onPress={() => this.moveToLoginScreen('signup')}
              >
                <Text style={this.styles.createAccountPopupText}>
                  Create new account
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                testID="loginBtn"
                style={this.styles.loginBtnPopupText}
                onPress={() => this.moveToLoginScreen('login')}
              >
                <Text style={this.styles.loginTxtPopupText}>Log in</Text>
              </TouchableOpacity>
            </SafeAreaView>
          </View>
        </View>
      </Modal>
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
          behavior={this.isPlatformiOS() ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          <View style={[this.styles.centeredView, this.styles.commentsParentView]}>
            <View style={[this.styles.modalView, this.styles.commentsView]}>
              <Pressable
                style={{ flex: 1 }}
                testID="commentsModalClick"
                onPress={() => this.hideKeyboard()}
              >
                <View style={this.styles.commentsHeader}>
                  <Text style={this.styles.commentsHeadingText}>Comments</Text>
                  <TouchableOpacity
                    testID="closeCommentsPopupButton"
                    onPress={this.handleCloseCommentPopup}
                  >
                    <Icon name="x" size={25} color={this.getHomeTheme().foreground} />
                  </TouchableOpacity>
                </View>
                <View style={this.styles.horizontalRuler} />
                {this.state.isLoadingComments ? (
                  <View style={this.styles.noCommentsContainer}>
                    <ActivityIndicator size="large" color="#4949EE" />
                  </View>
                ) : (
                  this.handleCommentsRendering()
                )}
              </Pressable>
              <View style={this.styles.emojiSelectionBar}>
                {this.defaultEmojisForSelectionBar.map((emoji: string, i: number) => (
                  <TouchableOpacity
                    key={`comment-emoji-${i}`}
                    onPress={() => this.handleEmojiSelected(emoji)}
                  >
                    <Text style={this.styles.emojiSelectionBarIcon}>{emoji}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={this.styles.commentInputArea}>
                <View style={this.styles.userAvatarContainer}>
                  <FastImage
                    source={
                      this.state.userProfilePic
                        ? {
                            uri: this.state.userProfilePic,
                            priority: FastImage.priority.high,
                          }
                        : defaultProfile
                    }
                    style={this.styles.userAvatar}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                </View>
                <TextInput
                  testID="commentTextInput"
                  ref={input => {
                    this.commentTextInput = input;
                  }}
                  style={this.styles.commentTextInput}
                  placeholder={
                    this.state.replying ? 'Add a reply...' : 'Add a comment...'
                  }
                  placeholderTextColor={this.getHomeTheme().muted}
                  value={this.state.commentText}
                  onChangeText={commentText =>
                    this.handleCommentTextChange(commentText)
                  }
                  multiline
                />
                <TouchableOpacity
                  testID="emojiComment"
                  style={this.styles.emojiButton}
                  onPress={this.handleSubmitEditing}
                  activeOpacity={0.7}
                >
                  <View style={{ width: 30, height: 30, justifyContent: 'center', alignItems: 'center' }}>
                    <MaterialIcons
                      name="send"
                      color="#64748B"
                      size={28}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    );
  };

  renderSearch = () => {
    return (
      <View style={this.styles.inputContainer}>
        <Icon name="search" size={16} color={this.getHomeTheme().muted} />
        <TextInput
          testID="searchText"
          style={this.styles.input}
          placeholderTextColor={this.getHomeTheme().muted}
          placeholder="Bands, venues, genres..."
          value={this.state.searchText}
          onChangeText={this.handleSearchTxtChange}
          returnKeyType="search"
          autoCorrect={false}
          autoCapitalize="none"
        />
        <TouchableOpacity
          testID="nearMeButton"
          style={this.styles.nearMeButton}
          onPress={this.modalYesClicked}
          activeOpacity={0.75}
        >
          <Text style={this.styles.nearMeButtonText}>Near Me</Text>
        </TouchableOpacity>
      </View>
    );
  };

  /** First real show from the current filtered feed — used for the redesign featured card. */
  getFeaturedShow = (): { show: any; stateName: string } | null => {
    const eventList = this.filterEventList();
    if (!Array.isArray(eventList)) {
      return null;
    }
    for (let i = 0; i < eventList.length; i += 1) {
      const item = eventList[i];
      const showsRaw = Array.isArray(item?.shows) ? item.shows : [];
      const show = showsRaw.find(
        (card: any) => card && typeof card === 'object' && card.type === 'show',
      );
      if (show) {
        return {
          show,
          stateName: String(item?.state_name ?? ''),
        };
      }
    }
    return null;
  };

  formatFeaturedTime = (timeValue: any): string => {
    if (typeof timeValue !== 'string' || !timeValue.trim()) {
      return '';
    }
    const raw = timeValue.trim();
    // Already friendly (e.g. "8:30 PM")
    if (/[ap]m/i.test(raw) && !raw.includes('T')) {
      return raw;
    }
    // ISO datetime → local/UTC display time
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
    // HH:mm or HH:mm:ss → 12h
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

  getFeedShowCount = (): number => {
    const isLoggedIn = !!this.state.authToken;
    const eventList = this.filterEventList();
    if (!Array.isArray(eventList)) {
      return 0;
    }
    let count = 0;
    for (let i = 0; i < eventList.length; i += 1) {
      const showsRaw = Array.isArray(eventList[i]?.shows)
        ? eventList[i].shows
        : [];
      for (let j = 0; j < showsRaw.length; j += 1) {
        const card = showsRaw[j];
        if (!card || typeof card !== 'object') {
          continue;
        }
        if (isLoggedIn) {
          if (card.type === 'show' || card.type === 'post') {
            count += 1;
          }
        } else if (card.type === 'show') {
          count += 1;
        }
      }
    }
    return count;
  };

  getFeedAreaLabel = (): string => {
    const stateList = this.getStateDropdownList();
    const locationLabel = this.getPickerSafeSelectedState(
      stateList.length > 0 ? stateList : ['All'],
    );
    if (locationLabel === 'All' || locationLabel === '') {
      return 'All areas';
    }
    return `${locationLabel} area`;
  };

  getDiscoveryShows = (): any[] => {
    const eventList = this.filterEventList();
    if (!Array.isArray(eventList)) {
      return [];
    }
    const shows: any[] = [];
    eventList.forEach((group: any) => {
      const raw = Array.isArray(group?.shows) ? group.shows : [];
      raw.forEach((show: any) => {
        if (show && typeof show === 'object' && show.type === 'show') {
          shows.push(show);
        }
      });
    });
    return shows;
  };

  getArtistsToWatch = (limit: number | null = 12) => {
    const byKey = new Map<
      string,
      {
        id: string;
        accountId: any;
        accountType: string;
        name: string;
        image: string;
        upcomingCount: number;
      }
    >();

    const addArtist = ({
      name,
      accountId,
      image,
      accountType,
      upcomingCount = 1,
    }: {
      name: string;
      accountId: any;
      image?: string;
      accountType?: string;
      upcomingCount?: number;
    }) => {
      const trimmedName = typeof name === 'string' ? name.trim() : '';
      const band = this.findBandArtistRecord(trimmedName, accountId);
      const resolvedId =
        accountId != null && accountId !== '' ? accountId : band?.id;
      const resolvedName =
        trimmedName ||
        (typeof band?.first_name === 'string' ? band.first_name.trim() : '');
      if (!resolvedName || resolvedId == null || resolvedId === '') {
        return;
      }
      const key = `id:${resolvedId}`;
      const resolvedImage =
        (typeof image === 'string' && image) ||
        (typeof band?.profile_image === 'string' && band.profile_image) ||
        '';
      const resolvedType =
        accountType || band?.account_type || band?.role || 'Artist';
      const existing = byKey.get(key);
      if (existing) {
        existing.upcomingCount += upcomingCount;
        if (!existing.image && resolvedImage) {
          existing.image = resolvedImage;
        }
        return;
      }
      byKey.set(key, {
        id: key,
        accountId: resolvedId,
        accountType: resolvedType,
        name: resolvedName,
        image: resolvedImage,
        upcomingCount,
      });
    };

    const eventList = this.filterEventList();
    if (Array.isArray(eventList)) {
      eventList.forEach((group: any) => {
        const raw = Array.isArray(group?.shows) ? group.shows : [];
        raw.forEach((show: any) => {
          if (!show || typeof show !== 'object' || show.type !== 'show') {
            return;
          }
          const image =
            (typeof show.band_profile_image === 'string' &&
              show.band_profile_image) ||
            (typeof show.profile_image === 'string' && show.profile_image) ||
            '';
          const bandName =
            typeof show.band_name === 'string' ? show.band_name.trim() : '';
          if (bandName) {
            addArtist({
              name: bandName,
              accountId: show.account_id,
              image,
              accountType: show.account_type || 'Band',
            });
          } else if (show.account_id != null && show.account_id !== '') {
            addArtist({
              name:
                (typeof show.event_title === 'string' &&
                  show.event_title.trim()) ||
                '',
              accountId: show.account_id,
              image,
              accountType: show.account_type || 'Band',
            });
          }
          const lineups = Array.isArray(show.line_ups) ? show.line_ups : [];
          lineups.forEach((entry: any) => {
            if (typeof entry === 'string') {
              addArtist({
                name: entry,
                accountId: null,
                image: '',
                accountType: 'Artist',
              });
              return;
            }
            if (!entry || typeof entry !== 'object') {
              return;
            }
            addArtist({
              name: entry.first_name || entry.name || '',
              accountId: entry.id || entry.account_id,
              image: entry.profile_image || '',
              accountType: entry.account_type || 'Artist',
            });
          });
        });
      });
    }

    const bands = this.getAllBandsListRecords();
    bands.forEach((band: any) => {
      const mapped = this.mapBandRecordToArtist(band);
      if (!mapped) {
        return;
      }
      const key = `id:${mapped.accountId}`;
      const existing = byKey.get(key);
      if (existing) {
        if (!existing.image && mapped.image) {
          existing.image = mapped.image;
        }
        if (mapped.accountType && existing.accountType === 'Artist') {
          existing.accountType = mapped.accountType;
        }
        return;
      }
      byKey.set(key, {
        id: key,
        accountId: mapped.accountId,
        accountType: mapped.accountType,
        name: mapped.name,
        image: mapped.image,
        upcomingCount: 0,
      });
    });

    const sorted = Array.from(byKey.values()).sort((a, b) => {
      if (b.upcomingCount !== a.upcomingCount) {
        return b.upcomingCount - a.upcomingCount;
      }
      return a.name.localeCompare(b.name);
    });
    if (limit == null || limit <= 0) {
      return sorted;
    }
    return sorted.slice(0, limit);
  };

  mapBandRecordToArtist = (band: any) => {
    if (!band || typeof band !== 'object') {
      return null;
    }
    const attrs =
      band.attributes && typeof band.attributes === 'object'
        ? band.attributes
        : band;
    const accountId = band.id ?? attrs.id ?? attrs.account_id;
    const name = String(
      attrs.first_name || attrs.name || band.first_name || band.name || '',
    ).trim();
    const imageValue =
      attrs.profile_image ||
      attrs.profile_image_url ||
      band.profile_image ||
      '';
    const image = typeof imageValue === 'string' ? imageValue : '';
    const accountType =
      attrs.account_type ||
      attrs.role ||
      band.account_type ||
      band.role ||
      'Artist';
    if (!name || accountId == null || accountId === '') {
      return null;
    }
    return { accountId, name, image, accountType };
  };

  findBandArtistRecord = (name: string, accountId?: any) => {
    const list = this.getAllBandsListRecords();
    if (accountId != null && accountId !== '') {
      const byId = list.find(
        (item: any) => String(item?.id) === String(accountId),
      );
      if (byId) {
        return byId;
      }
    }
    const lower = String(name || '')
      .trim()
      .toLowerCase();
    if (!lower) {
      return null;
    }
    return (
      list.find((item: any) => {
        const bandName = String(item?.first_name || item?.name || '')
          .trim()
          .toLowerCase();
        return bandName !== '' && bandName === lower;
      }) || null
    );
  };

  resolveArtistAccountId = (artist: {
    accountId?: any;
    name?: string;
  }) => {
    if (artist.accountId != null && artist.accountId !== '') {
      return artist.accountId;
    }
    return this.findBandArtistRecord(String(artist.name || ''))?.id ?? null;
  };

  getSearchStyleProfileScreen = (accountType?: string) => {
    const typeName = String(accountType || 'Artist');
    const artistOrBandTypes = [
      'Band',
      'Artist',
      'Venue',
      'Club',
      'Theater',
      'Museum',
      'Record_Label',
      'Promoter',
      'Bar',
      'Gallery',
      'Casino',
      'Booking_Agent',
      'Agency',
      'Record_Store',
    ];
    const isArtistOrBand = artistOrBandTypes.some(
      item => item.toLowerCase() === typeName.toLowerCase(),
    );
    return isArtistOrBand
      ? 'UserProfileBasicBlockArtist3'
      : 'UserProfileBasicBlock3';
  };

  handleArtistToWatchPress = async (artist: {
    accountId?: any;
    accountType?: string;
    name?: string;
  }) => {
    if (this.isForceUpdateBlocking()) {
      return;
    }
    const accountId = this.resolveArtistAccountId(artist);
    if (accountId == null || accountId === '') {
      return;
    }

    const authToken =
      this.state.authToken || (await getStorageData('authToken'));
    if (!authToken) {
      this.setState({ loginPopup: true });
      return;
    }

    await setStorageData('profileIdToLoad', `${accountId}`);
    const screen = this.getSearchStyleProfileScreen(artist.accountType);
    if (this.state.userId === `${accountId}`) {
      this.props.navigation.navigate('Profile', {
        isOtherUser: false,
      });
      return;
    }
    this.props.navigation.push(screen, {
      isOtherUser: true,
    });
  };

  getHotVenues = () => {
    const byKey = new Map<
      string,
      {
        id: string;
        name: string;
        city: string;
        image: string;
        showCount: number;
        address: string;
        state: string;
        zip_code: any;
      }
    >();
    this.getDiscoveryShows().forEach(show => {
      const name =
        (typeof show.location === 'string' && show.location.trim()) ||
        (typeof show.address === 'string' && show.address.trim()) ||
        '';
      if (!name) {
        return;
      }
      const key = name.toLowerCase();
      const image =
        typeof show.profile_image === 'string' ? show.profile_image : '';
      const existing = byKey.get(key);
      if (existing) {
        existing.showCount += 1;
        if (!existing.image && image) {
          existing.image = image;
        }
      } else {
        byKey.set(key, {
          id: key,
          name,
          city:
            (typeof show.city === 'string' && show.city.trim()) ||
            (typeof show.state === 'string' && show.state.trim()) ||
            '',
          image,
          showCount: 1,
          address: typeof show.address === 'string' ? show.address : '',
          state: typeof show.state === 'string' ? show.state : '',
          zip_code: show.zip_code,
        });
      }
    });
    return Array.from(byKey.values())
      .sort((a, b) => b.showCount - a.showCount)
      .slice(0, 8);
  };

  handleSeeAllArtists = () => {
    if (this.isForceUpdateBlocking()) {
      return;
    }
    this.props.navigation.navigate('ArtistsToWatchAllScreen');
  };

  handleViewHotVenuesMap = () => {
    const venues = this.getHotVenues();
    if (venues.length === 0) {
      return;
    }
    this.openGoogleMaps(venues[0]);
  };

  formatGenreLabel = (genre: any): string => {
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

  formatLineupLabel = (lineUps: any): string => {
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

  getCompactShowTitle = (show: any): string => {
    if (typeof show?.event_title === 'string' && show.event_title.trim()) {
      return show.event_title.trim();
    }
    if (typeof show?.band_name === 'string' && show.band_name.trim()) {
      return show.band_name.trim();
    }
    return '';
  };

  formatCategoryLabel = (name: string): string => {
    const trimmed = name.trim();
    if (trimmed === '') {
      return '';
    }
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  };

  findCategoryNameById = (categoryId: any): string => {
    const list = Array.isArray(this.state.categoriesList)
      ? this.state.categoriesList
      : [];
    const match = list.find((item: any) => {
      if (!item || typeof item !== 'object') {
        return false;
      }
      const id = item.id ?? item.attributes?.id;
      return String(id) === String(categoryId) && String(id) !== '0';
    });
    const name = match?.attributes?.name;
    if (typeof name === 'string' && name.trim() && name.trim().toLowerCase() !== 'all') {
      return this.formatCategoryLabel(name);
    }
    return '';
  };

  findCategoryNameByName = (value: string): string => {
    const list = Array.isArray(this.state.categoriesList)
      ? this.state.categoriesList
      : [];
    const needle = value.trim().toLowerCase();
    if (needle === '' || needle === 'all') {
      return '';
    }
    const match = list.find((item: any) => {
      const name = item?.attributes?.name;
      return typeof name === 'string' && name.trim().toLowerCase() === needle;
    });
    const name = match?.attributes?.name;
    if (typeof name === 'string' && name.trim()) {
      return this.formatCategoryLabel(name);
    }
    return '';
  };

  getShowCategoryLabel = (show: any): string => {
    const typeOfShow = show?.type_of_show;
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
        const rawName =
          typeof named === 'string' ? named : named.name;
        return this.formatCategoryLabel(rawName);
      }
    } else if (typeof typeOfShow === 'string' && typeOfShow.trim()) {
      const fromList = this.findCategoryNameById(typeOfShow);
      if (fromList) {
        return fromList;
      }
      const byName = this.findCategoryNameByName(typeOfShow);
      if (byName) {
        return byName;
      }
    }

    if (show?.category_id != null && show.category_id !== '') {
      const fromId = this.findCategoryNameById(show.category_id);
      if (fromId) {
        return fromId;
      }
    }

    const selectedId = this.state.selectedCategoryID;
    if (selectedId != null && String(selectedId) !== '' && String(selectedId) !== '0') {
      const fromSelected = this.findCategoryNameById(selectedId);
      if (fromSelected) {
        return fromSelected;
      }
    }
    return '';
  };

  formatCompactFooterDate = (eventDate: string): string => {
    if (!eventDate || eventDate === '2999-12-31') {
      return '';
    }
    const inputDate = new Date(eventDate);
    if (Number.isNaN(inputDate.getTime())) {
      return '';
    }
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weekday = weekdays[inputDate.getUTCDay()];
    const month = this.formatEventMonth(eventDate);
    const day = this.formatEventDate(eventDate);
    if (!weekday || month === '' || day === '' || day == null) {
      return '';
    }
    return `${weekday}, ${month} ${day}`;
  };

  renderCompactShowFooter = (show: any, showType: string) => {
    const categoryLabel = this.getShowCategoryLabel(show);
    const showDate =
      typeof show?.date_of_the_show === 'string' ? show.date_of_the_show : '';
    const dateLabel =
      showType !== 'post' && showDate !== ''
        ? this.formatCompactFooterDate(showDate)
        : '';
    if (categoryLabel === '' && dateLabel === '') {
      return null;
    }
    return (
      <View style={this.styles.compactShowFooter} testID="compactShowFooter">
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

  renderShowsSectionHeader = () => {
    const count = this.getFeedShowCount();
    if (count === 0) {
      return null;
    }
    return (
      <View style={this.styles.showsCountRow} testID="showsCountHeader">
        <View style={this.styles.showsCountLabelWrap}>
          <View style={this.styles.showsCountDot} />
          <Text style={this.styles.showsCountText}>{count} SHOWS</Text>
        </View>
        <View style={this.styles.showsCountLine} />
        <Text style={this.styles.showsCountArea}>{this.getFeedAreaLabel()}</Text>
      </View>
    );
  };

  renderCompactShowThumb = (show: any) => {
    if (show?.profile_image) {
      return (
        <FastImage
          style={this.styles.compactShowThumb}
          source={{
            uri: show.profile_image,
            priority: FastImage.priority.high,
          }}
          resizeMode={FastImage.resizeMode.cover}
        />
      );
    }
    return (
      <View style={this.styles.compactShowThumbPlaceholder}>
        <Image
          style={[this.styles.gallery, { tintColor: '#8880aa' }]}
          source={require('../../../mobile/assets/images/gallery.png')}
        />
      </View>
    );
  };

  renderFeaturedCard = () => {
    const featured = this.getFeaturedShow();
    if (!featured) {
      return null;
    }
    const { show, stateName } = featured;
    const title =
      (typeof show.event_title === 'string' && show.event_title.trim()) ||
      (typeof show.band_name === 'string' && show.band_name.trim()) ||
      'Featured show';
    const venue =
      (typeof show.location === 'string' && show.location.trim()) ||
      (typeof show.city === 'string' && show.city.trim()) ||
      '';
    const area =
      (typeof show.city === 'string' &&
        show.city.trim() &&
        show.city.trim() !== venue &&
        show.city.trim()) ||
      (typeof stateName === 'string' && stateName.trim()) ||
      '';
    const timeLabel = this.formatFeaturedTime(
      show.time || show.date_of_the_show || '',
    );
    const openFeatured = () => this.handleEventLaunch(show, stateName);

    return (
      <TouchableOpacity
        testID="featuredShowCard"
        style={this.styles.featuredCard}
        activeOpacity={0.92}
        onPress={openFeatured}
      >
        {show.profile_image ? (
          <FastImage
            style={this.styles.featuredImage}
            source={{
              uri: show.profile_image,
              priority: FastImage.priority.high,
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
        ) : (
          <View style={this.styles.featuredImagePlaceholder}>
            <Image
              style={this.styles.gallery}
              source={require('../../../mobile/assets/images/gallery.png')}
            />
          </View>
        )}
        <View pointerEvents="none" style={this.styles.featuredOverlay} />
        <View pointerEvents="none" style={this.styles.featuredBottomFade} />
        <View style={this.styles.featuredBadge} pointerEvents="none">
          <Text style={this.styles.featuredBadgeText}>FEATURED TONIGHT</Text>
        </View>
        <View style={this.styles.featuredContentRow}>
          <View style={this.styles.featuredTextBlock} pointerEvents="none">
            <Text style={this.styles.featuredTitle} numberOfLines={2}>
              {title}
            </Text>
            <View style={this.styles.featuredMetaRow}>
              {(venue !== '' || area !== '') && (
                <Icon name="map-pin" size={11} color={this.getHomeTheme().muted} />
              )}
              <Text style={this.styles.featuredMetaText} numberOfLines={1}>
                {[venue, area].filter(Boolean).join(' · ')}
                {timeLabel !== '' ? ' · ' : ''}
              </Text>
              {timeLabel !== '' && (
                <Text style={this.styles.featuredTimeText}>{timeLabel}</Text>
              )}
            </View>
          </View>
          <TouchableOpacity
            testID="featuredTicketButton"
            style={this.styles.featuredTicketButton}
            onPress={openFeatured}
            activeOpacity={0.85}
          >
            <MaterialCommunityIcons
              name="ticket-confirmation-outline"
              size={20}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  renderCategories = () => {
    const list = Array.isArray(this.state.categoriesList)
      ? this.state.categoriesList.filter(
          (item: any) =>
            item &&
            typeof item === 'object' &&
            item.id != null &&
            item.attributes &&
            typeof item.attributes === 'object',
        )
      : [];

    const iconForCategory = (name: string): string => {
      const lower = (name || '').toLowerCase();
      if (lower === 'all') return 'grid';
      if (lower.includes('music')) return 'music';
      if (lower.includes('art')) return 'image';
      if (lower.includes('fun') || lower.includes('enjoy')) return 'star';
      if (lower.includes('other')) return 'radio';
      return 'tag';
    };

    return (
      <View style={this.styles.filterPillsRow}>
        <ScrollView
          testID="categoryList"
          horizontal
          showsHorizontalScrollIndicator={false}
          nestedScrollEnabled
          contentContainerStyle={this.styles.filterPillsContent}
        >
          {list.map((item: any, index: number) => {
            const isSelected = this.state.selectedFilterIndex === index;
            const name = item?.attributes?.name ?? 'Category';
            const key =
              item?.id != null && item.id !== ''
                ? `cat-${item.id}`
                : `cat-${index}`;
            return (
              <TouchableOpacity
                key={key}
                testID="filterButton"
                style={[
                  this.styles.filterButton,
                  isSelected && this.styles.filterButtonActive,
                ]}
                onPress={() => this.handleCategoryFilter(item.id, index)}
                activeOpacity={0.8}
              >
                <Icon
                  name={iconForCategory(name)}
                  size={12}
                  color={isSelected ? '#FFFFFF' : this.getHomeTheme().muted}
                  style={{ marginRight: 6 }}
                />
                <Text
                  style={[
                    this.styles.filterButtonText,
                    isSelected && this.styles.filterButtonTextActive,
                  ]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  renderGuestSignupBanner = () => {
    if (this.state.authToken || this.state.guestSignupBannerDismissed) {
      return null;
    }
    return (
      <View testID="guestSignupBanner" style={this.styles.guestSignupBanner}>
        <View style={this.styles.guestSignupStarWrap}>
          <Icon name="star" size={16} color={this.getHomeTheme().primary} />
        </View>
        <Text style={this.styles.guestSignupBannerText} numberOfLines={1}>
          Sign up free to unlock more shows
        </Text>
        <TouchableOpacity
          testID="guestSignupJoinButton"
          style={this.styles.guestSignupJoinButton}
          onPress={() => this.moveToLoginScreen('signup')}
          activeOpacity={0.85}
        >
          <Text style={this.styles.guestSignupJoinText}>Join</Text>
        </TouchableOpacity>
        <TouchableOpacity
          testID="guestSignupCloseButton"
          style={this.styles.guestSignupCloseButton}
          onPress={() => this.setState({ guestSignupBannerDismissed: true })}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Icon name="x" size={14} color={this.getHomeTheme().muted} />
        </TouchableOpacity>
      </View>
    );
  };

  getSortDisplayName = (apiValue: string): string => {
    const sortMap: { [key: string]: string } = {
      today: 'Tonight',
      tonight: 'Tonight',
      this_week: 'This Week',
      next_week: 'Next Week',
      following: 'Following',
      discover: 'Discover',
      popular: 'Popular',
      nearest: 'Nearest',
    };
    return sortMap[apiValue] || apiValue;
  };

  getSortOptions = () => {
    return [
      { label: 'Newest', value: '' },
      { label: 'Tonight', value: 'tonight' },
      { label: 'This Week', value: 'this_week' },
      { label: 'Next Week', value: 'next_week' },
      { label: 'Following', value: 'following' },
      { label: 'Discover', value: 'discover' },
      { label: 'Popular', value: 'popular' },
      { label: 'Nearest', value: 'nearest' },
    ];
  };

  handleSortPillPress = (value: string) => {
    if (Platform.OS === 'ios') {
      this.handleSortValueChangeIOS(value);
    } else {
      this.handleSortValueChangeAndroid(value);
    }
  };

  renderSortPills = () => {
    const options = this.getSortOptions();
    return (
      <View style={this.styles.filterPillsRowLast}>
        <ScrollView
          testID="sortPillsList"
          horizontal
          showsHorizontalScrollIndicator={false}
          nestedScrollEnabled
          contentContainerStyle={this.styles.filterPillsContent}
        >
          {options.map((option: { label: string; value: string }) => {
            const isSelected = this.state.selectedSortBy === option.value;
            return (
              <TouchableOpacity
                key={`sort-${option.value || 'newest'}`}
                testID="sortPill"
                style={[this.styles.sortPill, isSelected && this.styles.sortPillActive]}
                onPress={() => this.handleSortPillPress(option.value)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    this.styles.sortPillText,
                    isSelected && this.styles.sortPillTextActive,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  renderSortBy = () => {
    return (
      <>
        {Platform.OS === 'ios'
          ? this.renderSortByInIOS()
          : this.renderSortByInAndroid()}
      </>
    );
  };

  renderSortByInIOS = () => {
    const displayText = this.state.selectedSortBy
      ? this.getSortDisplayName(this.state.selectedSortBy)
      : 'Sort by';
    return (
      <TouchableOpacity
        testID="btnSortSelect"
        style={[this.styles.textInput, this.styles.selector, this.styles.sortByTouchable]}
        onPress={this.showSort}
      >
        <Text
          style={[this.styles.txt, this.styles.sortByLabel]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {displayText}
        </Text>
        <Image source={leftArrow} style={[this.styles.downArrow]} />
      </TouchableOpacity>
    );
  };

  renderSortByInAndroid = () => {
    const sortOptions = this.getSortOptions();
    const displayText = this.state.selectedSortBy
      ? this.getSortDisplayName(this.state.selectedSortBy)
      : 'Sort by';
    return (
      <View
        style={[
          this.styles.textInput,
          this.styles.selector,
          this.styles.sortByContainerAndroid,
        ]}
      >
        <View style={this.styles.sortByAndroidLabelRow} pointerEvents="none">
          <Text
            style={[
              this.styles.txt,
              this.styles.sortByLabelAndroid,
              { marginTop: 10, marginRight: 15 },
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {displayText}
          </Text>
          <Image source={leftArrow} style={this.styles.downArrowAndroid} />
        </View>
        <View style={this.styles.sortByPickerOverlay}>
          <Picker
            testID="sortPicker"
            style={this.styles.sortByPickerInvisible}
            itemStyle={[this.styles.txt]}
            selectedValue={this.state.selectedSortBy}
            onValueChange={selectedSortBy =>
              this.handleSortValueChangeAndroid(selectedSortBy)
            }
            mode="dropdown"
          >
            {sortOptions.map((option: { label: string; value: string }) => (
              <Picker.Item
                key={option.value}
                label={option.label}
                value={option.value}
              />
            ))}
          </Picker>
        </View>
      </View>
    );
  };

  renderSortModal = () => {
    const sortOptions = this.getSortOptions();
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.sortClicked}
      >
        <TouchableWithoutFeedback
          testID="hideSortModal"
          onPress={this.hideModalSort}
        >
          <View style={this.styles.centeredView}>
            <TouchableWithoutFeedback>
              <View
                style={[
                  this.styles.modalView,
                  { borderTopStartRadius: 20, padding: 15, height: '30%' },
                ]}
              >
                <Picker
                  testID="sortPickerModal"
                  selectedValue={this.state.selectedSortBy}
                  onValueChange={selectedSortBy =>
                    this.handleSortValueChangeIOS(selectedSortBy)
                  }
                  mode="dropdown"
                >
                  {sortOptions.map(
                    (option: { label: string; value: string }) => (
                      <Picker.Item
                        key={option.value}
                        label={option.label}
                        value={option.value}
                      />
                    ),
                  )}
                </Picker>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };

  private normalizeStateDropdownEntry = (value: unknown): string | null => {
    if (typeof value !== 'string') {
      return null;
    }
    const t = value.trim();
    return t.length > 0 ? t : null;
  };

  private dedupeStateListPreserveOrder = (names: string[]): string[] => {
    const out: string[] = [];
    for (const n of names) {
      if (out.indexOf(n) === -1) {
        out.push(n);
      }
    }
    return out;
  };

  /** Picker selectedValue must exist in the list or Android native code can crash. */
  getPickerSafeSelectedState = (dropdownList: string[]): string => {
    const sel = this.state.selectedState;
    if (typeof sel === 'string' && sel !== '' && dropdownList.includes(sel)) {
      return sel;
    }
    if (dropdownList.includes('All')) {
      return 'All';
    }
    return dropdownList[0] ?? 'All';
  };

  // When logged out, only show states that have at least one show in the dropdown.
  // When logged in, stateNameList comes from the API; profile/fan extras are merged in the controller.
  // Always merge: selectedState, and currentLocationState (GPS reverse-geocode) when not already listed.
  getStateDropdownList = (): string[] => {
    const withCurrentLocation = (list: string[]): string[] => {
      const loc = this.normalizeStateDropdownEntry(this.state.currentLocationState);
      if (!loc || loc === 'All' || list.includes(loc)) {
        return list;
      }
      return this.dedupeStateListPreserveOrder(this.sortStateName([...list, loc]));
    };

    const mergeSelectedIfMissing = (list: string[]): string[] => {
      const sel = this.normalizeStateDropdownEntry(this.state.selectedState);
      if (!sel || sel === 'All' || list.includes(sel)) {
        return list;
      }
      return this.dedupeStateListPreserveOrder(this.sortStateName([...list, sel]));
    };

    if (this.state.authToken) {
      const raw = Array.isArray(this.state.stateNameList)
        ? this.state.stateNameList
        : [];
      const list = this.dedupeStateListPreserveOrder(
        raw
          .map((x: unknown) => this.normalizeStateDropdownEntry(x))
          .filter((x): x is string => x != null),
      );
      const base = list.length > 0 ? list : ['All'];
      return withCurrentLocation(mergeSelectedIfMissing(base));
    }

    const statesWithShows = this.state.authenticatedEventsList
      .filter((item: any) =>
        item.shows?.some((s: any) => s && s.type === 'show'),
      )
      .map((item: any) => this.normalizeStateDropdownEntry(item?.state_name))
      .filter((x): x is string => x != null)
      .sort((a, b) => a.localeCompare(b));

    const guestList = this.dedupeStateListPreserveOrder(['All', ...statesWithShows]);
    return withCurrentLocation(mergeSelectedIfMissing(guestList));
  };

  renderStates = () => {
    const stateDropdownListRaw = this.getStateDropdownList();
    const stateDropdownList =
      stateDropdownListRaw.length > 0 ? stateDropdownListRaw : ['All'];
    console.log('[renderStates] dropdown list shown in UI:', {
      authToken: !!this.state.authToken,
      stateNameList: this.state.stateNameList,
      authenticatedEventsListStates: this.state.authenticatedEventsList.map(
        (item: any) => item?.state_name,
      ),
      currentLocationState: this.state.currentLocationState,
      selectedState: this.state.selectedState,
      finalDropdown: stateDropdownList,
    });
    return (
      <>
        {Platform.OS === 'ios'
          ? this.renderStatesTrigger(stateDropdownList)
          : this.renderStatesInAndroid(stateDropdownList)}
      </>
    );
  };

  /** Opens `renderStateModal` (iOS + Android). */
  renderStatesTrigger = (stateDropdownList?: string[]) => {
    const list = stateDropdownList ?? this.getStateDropdownList();
    const display = this.getPickerSafeSelectedState(list);
    const rowStyle =
      Platform.OS === 'android'
        ? [
            this.styles.textInput,
            this.styles.selector,
            this.styles.sortByContainerAndroid,
            this.styles.sortByTouchable,
          ]
        : [this.styles.textInput, this.styles.selector, this.styles.sortByTouchable];
    return (
      <TouchableOpacity
        testID="btnStateSelect"
        style={rowStyle}
        onPress={this.showState}
        activeOpacity={0.7}
      >
        <Text
          style={[
            this.styles.txt,
            Platform.OS === 'android'
              ? this.styles.sortByLabelAndroid
              : this.styles.sortByLabel,
            Platform.OS === 'android' ? { marginTop: 10, marginRight: 15 } : {},
          ]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {display}
        </Text>
        <Image
          source={leftArrow}
          style={
            Platform.OS === 'android' ? this.styles.downArrowAndroid : this.styles.downArrow
          }
        />
      </TouchableOpacity>
    );
  };

  renderStatesInAndroid = (stateDropdownList?: string[]) => {
    const listRaw = stateDropdownList ?? this.getStateDropdownList();
    const list = listRaw.length > 0 ? listRaw : ['All'];
    const display = this.getPickerSafeSelectedState(list);

    return (
      <View
        style={[
          this.styles.textInput,
          this.styles.selector,
          this.styles.sortByContainerAndroid,
        ]}
      >
        <View style={this.styles.sortByAndroidLabelRow} pointerEvents="none">
          <Text
            style={[
              this.styles.txt,
              this.styles.sortByLabelAndroid,
              { marginTop: 10, marginRight: 15 },
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {display}
          </Text>
          <Image source={leftArrow} style={this.styles.downArrowAndroid} />
        </View>
        <View style={this.styles.sortByPickerOverlay}>
          <Picker
            testID="statePicker"
            style={this.styles.sortByPickerInvisible}
            itemStyle={[this.styles.txt]}
            selectedValue={display}
            onValueChange={selectedState =>
              this.handleStateValueChangeAndroid(selectedState)
            }
            mode="dropdown"
          >
            {list.map((name: string) => (
              <Picker.Item key={`state-android-${name}`} label={name} value={name} />
            ))}
          </Picker>
        </View>
      </View>
    );
  };

  renderStateModal = () => {
    const listRaw = this.getStateDropdownList();
    const list = listRaw.length > 0 ? listRaw : ['All'];
    const pickerSelected = this.getPickerSafeSelectedState(list);
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.stateClicked}
      >
        <TouchableWithoutFeedback
          testID="hideStateModal"
          onPress={this.hideModalState}
        >
          <View style={this.styles.pickerSheetOverlay}>
            <TouchableWithoutFeedback>
              <View style={this.styles.pickerSheetContainer}>
                <View style={this.styles.pickerSheetHandle} />
                <Text style={this.styles.pickerSheetTitle}>Select area</Text>
                <ScrollView
                  style={this.styles.pickerSheetList}
                  keyboardShouldPersistTaps="always"
                  showsVerticalScrollIndicator={false}
                >
                  {list.map((name: string, i: number) => {
                    const selected = name === pickerSelected;
                    const label = name === 'All' ? 'All areas' : name;
                    return (
                      <TouchableOpacity
                        key={`state-option-${i}-${name}`}
                        style={[
                          this.styles.pickerSheetOption,
                          selected && this.styles.pickerSheetOptionSelected,
                        ]}
                        onPress={() => this.handleStateValueChangeIOS(name)}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={[
                            this.styles.pickerSheetOptionText,
                            selected && this.styles.pickerSheetOptionTextSelected,
                          ]}
                        >
                          {label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
                <Picker
                  testID="statePickerModal"
                  selectedValue={pickerSelected}
                  onValueChange={selectedState =>
                    /* Closes modal and refreshes feed (same flow on iOS and Android). */
                    this.handleStateValueChangeIOS(selectedState)
                  }
                  mode="dropdown"
                  style={this.styles.hiddenPicker}
                >
                  {list.map((name: string, i: number) => (
                    <Picker.Item
                      key={`state-modal-${i}-${name}`}
                      label={name === 'All' ? 'All areas' : name}
                      value={name}
                    />
                  ))}
                </Picker>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };

  /** Toolbar + filters live in the list header so one vertical FlatList owns scrolling (avoids nested VirtualizedList warnings). */
  renderFeedListHeader = () => {
    const stateList = this.getStateDropdownList();
    const locationLabel = this.getPickerSafeSelectedState(
      stateList.length > 0 ? stateList : ['All'],
    );

    return (
      <View>
        <View style={this.styles.feedHeaderBar}>
          <View style={this.styles.feedHeaderBrandRow}>
            {this.state.expandedItems.length !== 0 && (
              <TouchableOpacity
                testID="navigationBackButton"
                style={{ width: 12, marginRight: 8 }}
                onPress={this.handleBackNav}
              >
                <Image source={leftArrow} style={this.styles.feedHeaderBackIcon} />
              </TouchableOpacity>
            )}
            <View style={this.styles.feedHeaderLogo} pointerEvents="none">
              <Icon name="music" size={14} color="#FFFFFF" />
            </View>
            <Text
              testID="localShowsTitle"
              pointerEvents="none"
              style={this.styles.feedHeaderTitle}
            >
              Shows In
            </Text>
            <TouchableOpacity
              testID="headerLocationPill"
              style={this.styles.feedHeaderLocationPill}
              onPress={this.showState}
              activeOpacity={0.7}
            >
              <Icon name="map-pin" size={10} color={this.getHomeTheme().muted} />
              <Text
                style={this.styles.feedHeaderLocationText}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {locationLabel === 'All' ? 'All areas' : locationLabel}
              </Text>
              <Icon
                name="chevron-down"
                size={12}
                color={this.getHomeTheme().muted}
              />
            </TouchableOpacity>
          </View>
          <View style={this.styles.feedHeaderActions}>
            {null !== this.state.authToken ? (
              <TouchableOpacity
                testID="bellIcon"
                hitSlop={{ top: 12, bottom: 12, left: 8, right: 8 }}
                onPress={this.handleNotificationNavigation}
              >
                <View style={this.styles.notificationWrapper}>
                  <Image
                    source={require('../../../mobile/assets/images/notifications.png')}
                    style={this.styles.feedHeaderIcon}
                  />
                  {this.renderNotificationIndicator()}
                </View>
              </TouchableOpacity>
            ) : (
              <View style={{ height: 25, width: 25 }} />
            )}
            <TouchableOpacity
              testID="drawerImage"
              onPress={this.onPressDrawer}
            >
              <Image
                style={this.styles.feedHeaderMenuIcon}
                source={require('../../../mobile/assets/images/Vector.png')}
              />
            </TouchableOpacity>
            {this.renderRedDot({ condition: this.state.newMessage })}
          </View>
        </View>

        <View style={this.styles.feedToolbarSurface}>
          {this.renderSearch()}
          {!!this.state.authToken && this.renderFeaturedCard()}
          {this.renderCategories()}
          {this.renderGuestSignupBanner()}
          {!!this.state.authToken && this.renderSortPills()}
          {!!this.state.authToken && this.renderShowsSectionHeader()}
        </View>
      </View>
    );
  };

  renderEventsList = () => {
    const eventList = this.filterEventList();
    const isLoggedIn = !!this.state.authToken;
    const guestEventList = isLoggedIn
      ? eventList
      : eventList.filter((item: any) => {
          const showsRaw = Array.isArray(item.shows) ? item.shows : [];
          return showsRaw.some(
            (card: { type?: string }) => card && card.type === 'show',
          );
        });
    const { groups: visibleEventList, hasMoreShows } = isLoggedIn
      ? this.getVisibleHomeFeedGroups(guestEventList, isLoggedIn)
      : { groups: guestEventList, hasMoreShows: false };
    const hasEvents = visibleEventList.length > 0;
    const eventListWithShows = visibleEventList;

    const showFeedLoader =
      this.state.isLoading &&
      eventList.length === 0 &&
      !this.hasCachedHomeFeedEvents();

    const listEmptyGuest = showFeedLoader ? (
      <View
        testID="eventsFeedLoading"
        style={this.styles.feedListLoadingEmpty}
        accessibilityLabel="Loading shows"
      >
        <ActivityIndicator size="large" color={this.getHomeTheme().primary} />
      </View>
    ) : (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: this.getHomeTheme().background,
          paddingTop: 50,
          minHeight: 200,
        }}
      >
        <Text
          style={{
            fontSize: 14,
            fontWeight: '400',
            color: this.getHomeTheme().muted,
          }}
        >
          No shows found
        </Text>
      </View>
    );

    const listEmptyAuth = showFeedLoader ? (
      <View
        testID="eventsFeedLoading"
        style={this.styles.feedListLoadingEmpty}
        accessibilityLabel="Loading shows"
      >
        <ActivityIndicator size="large" color={this.getHomeTheme().primary} />
      </View>
    ) : (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: this.getHomeTheme().background,
          paddingTop: 50,
          minHeight: 200,
        }}
      >
        <Text
          style={{
            fontSize: 14,
            fontWeight: '400',
            color: this.getHomeTheme().muted,
          }}
        >
          No record(s) found
        </Text>
      </View>
    );

    return (
      <>
        {!isLoggedIn ? (
          <FlatList
            ref={this.eventsFeedListRef}
            testID="eventsList"
            style={{ flex: 1, backgroundColor: this.getHomeTheme().background }}
            data={eventListWithShows}
            ListHeaderComponent={this.renderFeedListHeader}
            renderItem={({ item, index }) =>
              this.renderEventItem({
                item,
                index,
                totalItems: eventListWithShows.length,
              })
            }
            keyExtractor={(item, idx) =>
              `${String(item?.state_name ?? 'state')}-${idx}`
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              this.styles.feedListContent,
              { paddingBottom: hasEvents ? 20 : 0 },
            ]}
            scrollEnabled
            bounces={hasEvents}
            nestedScrollEnabled
            keyboardShouldPersistTaps="handled"
            removeClippedSubviews={false}
            refreshControl={
              <RefreshControl
                refreshing={false}
                onRefresh={this.handleRefresh}
                tintColor={this.getHomeTheme().primary}
              />
            }
            ListEmptyComponent={listEmptyGuest}
          />
        ) : (
          <FlatList
            ref={this.eventsFeedListRef}
            testID="authenticatedEventsList"
            style={{ flex: 1, backgroundColor: this.getHomeTheme().background }}
            data={visibleEventList}
            ListHeaderComponent={this.renderFeedListHeader}
            renderItem={({ item, index }: any) => this.renderItems(item, index)}
            contentContainerStyle={[
              this.styles.feedListContent,
              { paddingBottom: hasEvents ? 20 : 0 },
            ]}
            keyExtractor={(item, idx) =>
              `${String(item?.state_name ?? 'state')}-${idx}`
            }
            scrollEnabled
            bounces={hasEvents}
            nestedScrollEnabled
            keyboardShouldPersistTaps="handled"
            removeClippedSubviews={false}
            refreshControl={
              <RefreshControl
                refreshing={false}
                onRefresh={this.handleRefresh}
                tintColor={this.getHomeTheme().primary}
              />
            }
            ListEmptyComponent={listEmptyAuth}
            ListFooterComponent={() => this.renderHomeFeedFooter(hasMoreShows)}
          />
        )}
      </>
    );
  };

  // Customizable Area Start

  render() {
    // Customizable Area Start
    if (this.state.forceUpdateRequired) {
      return (
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.92)',
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 24,
          }}
        >
          <StatusBar barStyle="light-content" backgroundColor="#000000" />
          <View
            style={{
              width: '100%',
              maxWidth: 420,
              backgroundColor: '#FFFFFF',
              borderRadius: 12,
              paddingHorizontal: 22,
              paddingVertical: 28,
            }}
          >
            <Text
              style={{
                fontSize: 22,
                fontWeight: '700',
                color: '#111111',
                textAlign: 'center',
                marginBottom: 12,
              }}
            >
              Update required
            </Text>
            <Text
              style={{
                fontSize: 15,
                color: '#444444',
                textAlign: 'center',
                lineHeight: 22,
                marginBottom: 24,
              }}
            >
              A newer version of Local Shows is available on the store. Please
              update now to continue using the app.
            </Text>
            <TouchableOpacity
              testID="forceUpdateButton"
              style={{
                backgroundColor: '#3333CC',
                borderRadius: 8,
                height: 52,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              activeOpacity={0.85}
              onPress={this.openForceUpdateStore}
            >
              <Text
                style={{
                  color: '#FFFFFF',
                  fontSize: 16,
                  fontWeight: '700',
                }}
              >
                Update from store
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      );
    }

    return (
      <SafeAreaView style={this.styles.container} edges={['left', 'right']}>
        <StatusBar
          barStyle={this.state.isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={this.getHomeTheme().background}
        />
        {this.renderLocationPopup()}
        {this.renderLoginModal()}
        {this.renderCommentsModal()}
        {this.renderEventsList()}

        {this.renderStateModal()}
        {this.renderSortModal()}
        {this.renderRepliesModal()}
        {this.renderTnCModal()}
      </SafeAreaView>
    );
    // Customizable Area End
  }

  // Customizable Area Start
  handleCommentsRendering = () => {
    return (
      <>
        {this.state.commentsList.length ? (
          <View style={this.styles.commentsListContainer}>
            <SwipeListView
              bounces={false}
              alwaysBounceVertical={false}
              alwaysBounceHorizontal={false}
              testID="swipeListView"
              data={this.state.commentsList}
              keyExtractor={(row: any, rowIndex: number) =>
                row?.id != null && row.id !== ''
                  ? String(row.id)
                  : `comment-${rowIndex}`
              }
              showsVerticalScrollIndicator={false}
              renderItem={this.renderCommentItem}
              renderHiddenItem={this.renderCommentsHiddenItem}
              rightOpenValue={-120}
              extraData={this.state.showRepliesFor}
              listKey="main-comments"
            />
          </View>
        ) : (
          <View style={this.styles.noCommentsContainer}>
            <Icon name="message-square" size={60} color="#0F172A" />
            <Text style={this.styles.commentsHeadingText}>No comments yet</Text>
            <Text style={this.styles.startConversationText}>
              Start the conversation
            </Text>
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
            <ActivityIndicator size="large" color="#4949EE" />
          </View>
        )}
      </>
    );
  };

  renderCommentsHiddenItem = (data: any, rowMap: any) => (
    <>
      {this.state.userId === data.item?.attributes?.account_id?.toString() && (
        <View style={this.styles.rowBack}>
          <TouchableOpacity
            testID="editComment"
            style={[this.styles.backRightBtn, this.styles.backRightBtnLeft]}
            onPress={() => this.handleEditComments(data.item, rowMap)}
          >
            <Icon name="corner-up-left" size={25} color={'white'} />
          </TouchableOpacity>
          <TouchableOpacity
            testID="deleteComment"
            style={[this.styles.backRightBtn, this.styles.backRightBtnRight]}
            onPress={() => {
              this.deleteCommentAPI(data.item.id);
            }}
          >
            <Icon name="trash" size={25} color={'white'} />
          </TouchableOpacity>
        </View>
      )}
    </>
  );

  renderCommentItem = ({ item }: { item: any }) => {
    return (
      <View style={this.styles.rowFront}>
        <TouchableOpacity
          testID="imageShowProfile"
          style={this.styles.userAvatarContainer}
          onPress={() =>
            this.showProfile(
              item.attributes.account.id,
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
            style={this.styles.userAvatar}
            resizeMode={FastImage.resizeMode.cover}
          />
        </TouchableOpacity>
        <View style={this.styles.commentContent}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={this.styles.commenterName}>
              {`${item.attributes.account.first_name}`}
            </Text>
            <Text
              style={[
                this.styles.commenterName,
                { fontWeight: '400', marginLeft: 5 },
              ]}
            >
              {this.timeAgo(item.attributes.created_at)}
            </Text>
          </View>
          <Text style={this.styles.commentText}>{item.attributes.comment}</Text>
          <TouchableOpacity
            testID="replyButton"
            style={this.styles.replyButton}
            onPress={() => this.handleReply(item.id)}
          >
            <Text style={this.styles.replyButtonText}>Reply</Text>
          </TouchableOpacity>
          {item.attributes.replies.length !== 0 && (
            <TouchableOpacity
              testID="showReplyButton"
              style={this.styles.showReplyButton}
              onPress={() => this.handleReplyButton(item)}
            >
              <View style={this.styles.horizontalBar} />
              <Text style={this.styles.showReplyButtonText}>
                {`View ${item.attributes.replies.length} more replies`}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={this.styles.likeContainer}>
          <TouchableOpacity
            testID="likeCommentButton"
            onPress={() => this.likeComment(item.id)}
          >
            <FontAwesome
              name={item.attributes.like_by_me ? 'heart' : 'heart-o'}
              size={15}
              color={item.attributes.like_by_me ? '#DC2626' : '#94A3B8'}
            />
          </TouchableOpacity>
          <Text style={this.styles.likesCountText}>
            {item.attributes.likes_count}
          </Text>
        </View>
      </View>
    );
  };

  renderRepliesHiddenItem = (data: any, rowMap: any) => (
    <>
      {this.state.userId === data.item.account_id.toString() && (
        <View style={this.styles.rowBack}>
          <TouchableOpacity
            testID="editReply"
            style={[this.styles.backRightBtn, this.styles.backRightBtnLeft]}
            onPress={() => this.handleEditReply(data.item, rowMap)}
          >
            <Icon name="corner-up-left" size={25} color={'white'} />
          </TouchableOpacity>
          <TouchableOpacity
            testID="deleteReply"
            style={[this.styles.backRightBtn, this.styles.backRightBtnRight]}
            onPress={() => {
              this.deleteCommentAPI(data.item.id);
            }}
          >
            <Icon name="trash" size={25} color={'white'} />
          </TouchableOpacity>
        </View>
      )}
    </>
  );

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
          <View style={[this.styles.centeredView, this.styles.commentsParentView]}>
            <View style={[this.styles.modalView, this.styles.commentsView]}>
              <Pressable
                style={{
                  flex: 1,
                }}
                testID="repliesModalClick"
                onPress={() => this.hideKeyboard()}
              >
                <View style={this.styles.commentsHeader}>
                  <TouchableOpacity
                    testID="replyModalBackBtn"
                    onPress={this.handleReplyBackNav}
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
                  <Text style={this.styles.commentsHeadingText}>Replies</Text>
                  <TouchableOpacity
                    testID="closeReplyPopupButton"
                    onPress={this.closeReplyPopup}
                  >
                    <Icon name="x" size={25} color={this.getHomeTheme().foreground} />
                  </TouchableOpacity>
                </View>
                <View style={this.styles.horizontalRuler} />
                {this.renderReplies()}
              </Pressable>

              <View style={this.styles.emojiSelectionBar}>
                {this.defaultEmojisForSelectionBar.map((emoji: string, i: number) => (
                  <TouchableOpacity
                    testID="emojiReply"
                    key={`reply-emoji-${i}`}
                    onPress={() => this.handleEmojiSelected(emoji)}
                  >
                    <Text style={this.styles.emojiSelectionBarIcon}>{emoji}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={this.styles.commentInputArea}>
                <View style={this.styles.userAvatarContainer}>
                  <FastImage
                    source={
                      this.state.userProfilePic
                        ? {
                            uri: this.state.userProfilePic,
                            priority: FastImage.priority.high,
                          }
                        : defaultProfile
                    }
                    style={this.styles.userAvatar}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                </View>
                <TextInput
                  testID="replyTextInput"
                  value={this.state.commentText}
                  ref={input => {
                    this.commentTextInput = input;
                  }}
                  onChangeText={commentText =>
                    this.handleCommentTextChange(commentText)
                  }
                  style={this.styles.commentTextInput}
                  placeholder={'Add a reply...'}
                  placeholderTextColor={this.getHomeTheme().muted}
                  multiline={true}
                />
                <TouchableOpacity
                  testID="emojiReplyBtn"
                  style={this.styles.emojiButton}
                  onPress={this.handleSubmitEditing}
                  activeOpacity={0.7}
                >
                  <View style={{ width: 30, height: 30, justifyContent: 'center', alignItems: 'center' }}>
                    <MaterialIcons
                      name="send"
                      color="#64748B"
                      size={28}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    );
  };

  renderReplies = () => {
    return (
      <>
        <View style={[this.styles.rowFront]}>
          <TouchableOpacity
            testID="replies"
            style={this.styles.userAvatarContainer}
            onPress={() =>
              this.showProfile(
                this.state.commentWithReply.attributes.account.id,
                this.state.commentWithReply.attributes.account.account_type,
              )
            }
          >
            <FastImage
              source={
                this.state.commentWithReply.attributes?.profile_image_url
                  ? {
                      uri: this.state.commentWithReply.attributes
                        ?.profile_image_url,
                      priority: FastImage.priority.high,
                    }
                  : defaultProfile
              }
              style={this.styles.userAvatar}
              resizeMode={FastImage.resizeMode.cover}
            />
          </TouchableOpacity>
          <View style={this.styles.commentContent}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={this.styles.commenterName}>
                {this.state.commentWithReply.attributes?.account.first_name}
              </Text>
              <Text
                style={[
                  this.styles.commenterName,
                  { fontWeight: '400', marginLeft: 5 },
                ]}
              >
                {this.timeAgo(
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
          data={
            Array.isArray(this.state.commentWithReply.attributes?.replies)
              ? this.state.commentWithReply.attributes.replies
              : []
          }
          keyExtractor={(row: any, rowIndex: number) =>
            row?.id != null && row.id !== ''
              ? String(row.id)
              : `reply-${rowIndex}`
          }
          showsVerticalScrollIndicator={false}
          renderItem={this.renderRepliesItem}
          renderHiddenItem={this.renderRepliesHiddenItem}
          rightOpenValue={-120}
          disableRightSwipe
          listKey="replies-thread"
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
            <ActivityIndicator size="large" color="#4949EE" />
          </View>
        )}
      </>
    );
  };

  renderRepliesItem = ({ item }: { item: any }) => {
    return (
      <View
        style={[
          this.styles.rowFront,
          {
            width: '95%',
            alignSelf: 'flex-end',
          },
        ]}
      >
        <TouchableOpacity
          style={this.styles.userAvatarContainer}
          onPress={() => this.showProfile(item.account_id, item.account_type)}
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
            style={this.styles.userAvatar}
            resizeMode={FastImage.resizeMode.cover}
          />
        </TouchableOpacity>
        <View style={this.styles.commentContent}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={this.styles.commenterName}>{item.account_name}</Text>
            <Text
              style={[
                this.styles.commenterName,
                { fontWeight: '400', marginLeft: 5 },
              ]}
            >
              {item.created_at ? this.timeAgo(item.created_at) : ''}
            </Text>
          </View>
          <Text style={this.styles.replyText}>{item.reply}</Text>
        </View>
      </View>
    );
  };
  // Customizable Area End
}

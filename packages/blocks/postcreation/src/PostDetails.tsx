import React from 'react';

// Customizable Area Start
import Svg, { Path } from 'react-native-svg';
import {
  ScrollView,
  StatusBar,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
  FlatList,
  Modal,
  ActivityIndicator,
  Linking,
  TextInput,
  Dimensions,
  DeviceEventEmitter,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import FastImage from '../../../components/src/SafeFastImage';
import {
  darkAllEventStyles,
  lightAllEventStyles,
} from '../../events/src/AllEventStyle';
import {
  lightTheme,
  redesignTheme,
  PROFILE_THEME_CHANGED_EVENT,
  PROFILE_THEME_STORAGE_KEY,
} from '../../utilities/src/Colors';
// Customizable Area End

import PostCreationController from './PostCreationController';
import { Props } from './PostCreationCommonController';
import { Message } from '../../../framework/src/Message';
import MessageEnum, {
  getName,
} from '../../../framework/src/Messages/MessageEnum';
import { runEngine } from '../../../framework/src/RunEngine';
import { getStorageData } from '../../../framework/src/Utilities';

export default class PostDetails extends PostCreationController {
  profileThemeListener: { remove: () => void } | null = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      ...this.state,
      showReportModal: false,
      reportReason: '',
      reportComment: '',
      reportError: '',
      showRulesMoreModal: false,
      showRulesExpanded: true,
      isDarkMode: true,
    };
  }

  get eventStyles() {
    return this.state.isDarkMode ? darkAllEventStyles : lightAllEventStyles;
  }

  get localStyles() {
    return this.state.isDarkMode ? darkPostDetailStyles : lightPostDetailStyles;
  }

  getDetailTheme = () => {
    return this.state.isDarkMode ? redesignTheme : lightTheme;
  };

  loadDetailTheme = async () => {
    const savedTheme = await getStorageData(PROFILE_THEME_STORAGE_KEY);
    this.setState({ isDarkMode: savedTheme !== 'false' });
    if (!this.profileThemeListener) {
      this.profileThemeListener = DeviceEventEmitter.addListener(
        PROFILE_THEME_CHANGED_EVENT,
        (isDarkMode: boolean) => {
          this.setState({ isDarkMode });
        },
      );
    }
  };

  async componentDidMount() {
    await this.loadDetailTheme();
    await super.componentDidMount();
  }

  async componentWillUnmount() {
    if (this.profileThemeListener) {
      this.profileThemeListener.remove();
      this.profileThemeListener = null;
    }
    await super.componentWillUnmount();
  }

  reportReasons = [
    'Inappropriate Content',
    'Spam',
    'Harassment',
    'False Information',
    'Other',
  ];

  // Customizable Area Start
  isPicturePost = () => {
    const { eventDetail } = this.state;
    return (
      eventDetail?.type === 'post' ||
      eventDetail?.attributes?.model_name === 'BxBlockPosts::Post'
    );
  };

  getHeaderTitle = () => {
    return this.isPicturePost()
      ? "Picture's information"
      : `Shows in ${this.state.selectedState || ''}`;
  };

  getItemName = (item: any) => {
    if (!item) return '';
    if (typeof item === 'string') return item;
    return item.name || item.attributes?.name || item.first_name || '';
  };

  getGenreDisplay = () => {
    const genres = this.state.selectedGenres || [];
    const names = genres
      .map((item: any) => this.getItemName(item))
      .filter((name: string) => name);
    if (names.length > 0) return names.join(' - ');
    const types = this.state.selectedTypeOfShows || [];
    return types
      .map((item: any) => this.getItemName(item))
      .filter((name: string) => name)
      .join(' - ');
  };

  getImageUri = () => {
    const raw = this.state.selectedImageData?.uri;
    if (Array.isArray(raw)) return raw[0];
    if (raw) return raw;
    return this.state.eventDetail?.attributes?.profile_image || '';
  };

  getFullAddress = () => {
    if (!this.state.address) return '';
    return `${this.state.address}, ${this.state.selectedCity}, ${this.state.selectedState} ${this.state.zipCode}, US`;
  };

  isShowTonight = () => {
    const date = this.state.eventDetail?.attributes?.date_of_the_show;
    if (!date || date === '2999-12-31' || this.state.undefinedDateSelected) {
      return false;
    }
    return moment.utc(date).isSame(moment(), 'day');
  };

  formatInfoCardDate = () => {
    if (this.state.undefinedDateSelected) return 'TBD';
    const iso = this.state.eventDetail?.attributes?.date_of_the_show;
    if (iso === '2999-12-31') return 'TBD';
    if (this.isShowTonight()) return 'Tonight';
    if (iso) return moment.utc(iso).format('MMM D');
    if (!this.state.dateOfShow) return '';
    const parsed = moment(this.state.dateOfShow, ['MM-DD-YYYY', 'YYYY-MM-DD']);
    return parsed.isValid() ? parsed.format('MMM D') : this.state.dateOfShow;
  };

  formatInfoCardTime = () => {
    if (this.state.undefinedDateSelected) return 'TBD';
    const iso = this.state.eventDetail?.attributes?.date_of_the_show;
    if (iso === '2999-12-31') return 'TBD';
    const time = this.state.time;
    if (!time) return '';
    const parsed = moment(time, ['HH[h]mm', 'HH:mm:ss', 'HH:mm', 'hh:mm A'], true);
    if (parsed.isValid()) return parsed.format('h:mm A');
    return this.changeTimeFormat(time);
  };

  getTicketPriceLabel = () => {
    const attributes = this.state.eventDetail?.attributes || {};
    const raw =
      attributes.ticket_price ??
      attributes.price ??
      attributes.cost ??
      attributes.ticket_cost;
    if (raw === null || raw === undefined || raw === '') return '';
    const numeric = Number(raw);
    if (!Number.isNaN(numeric)) {
      return `$${Number.isInteger(numeric) ? numeric : numeric.toFixed(2)}`;
    }
    const text = String(raw).trim();
    if (!text) return '';
    return text.startsWith('$') ? text : `$${text}`;
  };

  renderHeader = () => {
    const liked = this.state.eventDetail?.attributes?.like_by_me;
    return (
      <View style={this.eventStyles.detailHeroTopBar} pointerEvents="box-none">
        <SafeAreaView edges={['top']} pointerEvents="box-none">
          <View style={this.eventStyles.detailHeroTopBarInner}>
            <TouchableOpacity
              testID="backBtn"
              style={this.eventStyles.detailCircleBtn}
              onPress={() => this.props.navigation.goBack()}
              activeOpacity={0.8}
            >
              <Icon name="arrow-left" size={18} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={this.eventStyles.detailHeaderRight}>
              <TouchableOpacity
                testID="likeBtn"
                style={this.eventStyles.detailCircleBtn}
                onPress={this.likeDislikeEventAPI}
                activeOpacity={0.8}
              >
                <Icon
                  name="heart"
                  size={16}
                  color={liked ? this.getDetailTheme().primary : '#FFFFFF'}
                />
              </TouchableOpacity>
              <TouchableOpacity
                testID="threeDotsBtn"
                style={[
                  this.eventStyles.detailCircleBtn,
                  this.eventStyles.detailCircleBtnGap,
                ]}
                onPress={() =>
                  this.setState({ showMenu: !this.state.showMenu })
                }
                activeOpacity={0.8}
              >
                <Icon name="more-vertical" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </View>
    );
  };

  renderHeroFade = () => null;

  renderEventImage = () => {
    const imageUri = this.getImageUri();
    const genre = this.getGenreDisplay();
    const priceLabel = this.getTicketPriceLabel();
    return (
      <View
        style={
          this.state.showMenu ? { zIndex: 50, elevation: 50 } : undefined
        }
      >
        <View style={this.eventStyles.detailHeroWrap}>
          {imageUri ? (
            <FastImage
              source={{
                uri: String(imageUri),
                priority: FastImage.priority.high,
              }}
              style={this.eventStyles.detailHeroImage}
              resizeMode={FastImage.resizeMode.cover}
            />
          ) : (
            <View style={this.eventStyles.detailHeroPlaceholder}>
              <Image
                source={require('../../../mobile/assets/images/gallery.png')}
                style={[this.localStyles.backButton, { tintColor: this.getDetailTheme().muted }]}
              />
            </View>
          )}
          <View pointerEvents="none" style={this.eventStyles.detailHeroScrim} />
          {this.renderHeroFade()}
          {this.renderHeader()}
          <View style={this.eventStyles.detailHeroMeta} pointerEvents="box-none">
            {this.isShowTonight() ? (
              <View style={this.eventStyles.detailHotBadge}>
                <MaterialCommunityIcons name="fire" size={13} color="#FFFFFF" />
                <Text style={this.eventStyles.detailHotBadgeText}>HOT TONIGHT</Text>
              </View>
            ) : null}
            <Text
              testID="titleTxt"
              style={this.eventStyles.detailStateCaption}
              numberOfLines={1}
            >
              {this.getHeaderTitle()}
            </Text>
            <Text style={this.eventStyles.detailHeroTitle} numberOfLines={4}>
              {this.state.eventTitle || ''}
            </Text>
            <View style={this.eventStyles.detailHeroMetaRow}>
              {genre ? (
                <View style={this.eventStyles.detailGenrePill}>
                  <Text style={this.eventStyles.detailGenrePillText} numberOfLines={1}>
                    {genre}
                  </Text>
                </View>
              ) : null}
              {priceLabel ? (
                <Text style={this.eventStyles.detailPriceText}>{priceLabel}</Text>
              ) : null}
            </View>
          </View>
        </View>
        {this.renderMenuPopup()}
      </View>
    );
  };

  renderStatusBadges = () => {
    const postponed =
      this.state.eventDetail?.attributes?.postpone_show ||
      this.state.undefinedDateSelected;
    const canceled = this.state.eventDetail?.attributes?.is_canceled;
    const soldOut = this.state.sold_out;
    if (!postponed && !canceled && !soldOut) {
      return null;
    }
    return (
      <View style={[this.eventStyles.detailSection, this.eventStyles.detailBadgeRow]}>
        {canceled ? (
          <Text style={this.localStyles.canceledBadge}>Show Canceled</Text>
        ) : null}
        {postponed ? (
          <Image
            source={require('../../../mobile/assets/images/postponed.png')}
            style={this.eventStyles.detailStatusBadge}
          />
        ) : null}
        {soldOut ? (
          <Image
            source={require('../../../mobile/assets/images/sold_out.png')}
            style={this.eventStyles.detailSoldOutBadge}
          />
        ) : null}
      </View>
    );
  };

  renderLikes = () => {
    const { eventDetail } = this.state;
    const liked = eventDetail?.attributes?.like_by_me;
    const likesCount = eventDetail?.attributes?.likes_count ?? 0;
    const commentsCount =
      parseInt(eventDetail?.attributes?.comments_count, 10) || 0;
    const sharesCount =
      eventDetail?.attributes?.shares_count ??
      eventDetail?.attributes?.share_count ??
      eventDetail?.attributes?.reposts_count ??
      0;
    const addedInCalendar = eventDetail?.attributes?.added_in_calendar;
    const iconColor = this.getDetailTheme().muted;

    return (
      <View style={this.eventStyles.detailSection}>
        <View style={this.eventStyles.detailStatsBar}>
          <View style={this.eventStyles.detailStatItem}>
            <TouchableOpacity
              onPress={this.likeDislikeEventAPI}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
            >
              <Icon
                name="heart"
                size={18}
                color={liked ? this.getDetailTheme().primary : iconColor}
              />
            </TouchableOpacity>
            <TouchableOpacity
              testID="likeNavBtn"
              onPress={() => {
                if (eventDetail?.id && eventDetail?.type) {
                  this.handleLikeListScreenNav(eventDetail.id, eventDetail.type);
                }
              }}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
            >
              <Text style={this.eventStyles.detailStatCount}>{likesCount}</Text>
            </TouchableOpacity>
          </View>
          <View style={this.eventStyles.detailStatItem}>
            <Icon name="message-circle" size={18} color={iconColor} />
            <Text style={this.eventStyles.detailStatCount}>{commentsCount}</Text>
          </View>
          <View style={this.eventStyles.detailStatItem}>
            <Icon name="repeat" size={18} color={iconColor} />
            <Text style={this.eventStyles.detailStatCount}>{sharesCount}</Text>
          </View>
          <View style={this.eventStyles.detailStatItem}>
            <Icon
              name="calendar"
              size={18}
              color={addedInCalendar ? this.getDetailTheme().primary : iconColor}
            />
          </View>
        </View>
      </View>
    );
  };

  renderLocation = () => {
    return this.renderVenueCard();
  };

  renderAddress = () => {
    const fullAddress = this.getFullAddress();
    if (!this.state.address) return null;
    return this.renderMetaRow('home', 'Address', fullAddress);
  };

  renderDate = () => {
    return this.renderMetaRow('calendar', 'Date', this.state.dateOfShow);
  };

  renderEndDate = () => {
    if (!this.state.endDate) return null;
    return this.renderMetaRow('calendar', 'End Date', this.state.endDate);
  };

  renderTime = () => {
    const value =
      this.state.time !== null && this.state.time !== ''
        ? this.changeTimeFormat(this.state.time)
        : 'To Be Determined';
    return this.renderMetaRow('clock', 'Time', value);
  };

  renderMetaRow = (icon: string, label: string, value: string) => {
    if (!value) return null;
    return (
      <View style={this.eventStyles.detailWebsiteRow}>
        <View
          style={[
            this.eventStyles.eventDetails,
            { alignItems: 'flex-start', flex: 0, paddingTop: 2 },
          ]}
        >
          <Icon name={icon} size={16} color={this.getDetailTheme().primary} />
          <Text style={[this.eventStyles.detailMetaLabel, { marginLeft: 8 }]}>
            {label}
          </Text>
        </View>
        <Text
          style={[
            this.eventStyles.detailMetaValue,
            { color: this.getDetailTheme().foreground, flex: 1 },
          ]}
        >
          {value}
        </Text>
      </View>
    );
  };

  formatEventCreatorAccountTypeLabel = (accountType: string) => {
    const map: Record<string, string> = {
      'Record Label': 'Record Label',
      Record_Label: 'Record Label',
      Promoter: 'Promoter',
      Booking_Agent: 'Booking Agent',
      Agency: 'Agency',
    };
    if (map[accountType]) return map[accountType];
    return accountType.replace(/_/g, ' ');
  };

  renderEventCreatorCategoryRow = () => {
    const creator = this.state.eventDetail?.attributes?.event_creator;
    if (!creator) {
      return null;
    }
    const accountTypeLabel = this.formatEventCreatorAccountTypeLabel(
      creator.account_type || '',
    );
    const canNavigate = Boolean(creator.id);

    return (
      <View style={this.eventStyles.detailWebsiteRow}>
        <View
          style={[
            this.eventStyles.eventDetails,
            { alignItems: 'center', flex: 0 },
          ]}
        >
          <Icon name="tag" size={16} color={this.getDetailTheme().primary} />
          <Text style={[this.eventStyles.detailMetaLabel, { marginLeft: 8 }]}>
            Category
          </Text>
        </View>
        {canNavigate ? (
          <TouchableOpacity
            testID="eventCreatorCategoryType"
            style={{ flex: 1 }}
            onPress={() =>
              this.openEventCreatorProfileForCategoryRow(
                String(creator.id),
                creator.account_type,
              )
            }
            activeOpacity={0.7}
          >
            <Text style={this.eventStyles.detailMetaValue}>{accountTypeLabel}</Text>
          </TouchableOpacity>
        ) : (
          <Text style={[this.eventStyles.detailMetaValue, { color: this.getDetailTheme().foreground }]}>
            {accountTypeLabel}
          </Text>
        )}
      </View>
    );
  };

  renderInfoCards = () => {
    return (
      <View style={this.eventStyles.detailInfoCardsRow}>
        <View
          style={[this.eventStyles.detailInfoCard, this.eventStyles.detailInfoCardFirst]}
        >
          <Icon name="calendar" size={16} color={this.getDetailTheme().primary} />
          <Text style={this.eventStyles.detailInfoCardLabel}>Date</Text>
          <Text style={this.eventStyles.detailInfoCardValue} numberOfLines={1}>
            {this.formatInfoCardDate() || '—'}
          </Text>
        </View>
        <View style={this.eventStyles.detailInfoCard}>
          <Icon name="clock" size={16} color={this.getDetailTheme().primary} />
          <Text style={this.eventStyles.detailInfoCardLabel}>Doors</Text>
          <Text style={this.eventStyles.detailInfoCardValue} numberOfLines={1}>
            {this.formatInfoCardTime() || '—'}
          </Text>
        </View>
        <View
          style={[this.eventStyles.detailInfoCard, this.eventStyles.detailInfoCardLast]}
        >
          <Icon name="map-pin" size={16} color={this.getDetailTheme().primary} />
          <Text style={this.eventStyles.detailInfoCardLabel}>City</Text>
          <Text style={this.eventStyles.detailInfoCardValue} numberOfLines={1}>
            {this.state.selectedCity || '—'}
          </Text>
        </View>
      </View>
    );
  };

  renderLineup = () => {
    if (
      this.state.selectedLineUp === null ||
      this.state.selectedLineUp.length === 0
    ) {
      return null;
    }
    return (
      <View>
        <Text style={this.eventStyles.detailSectionLabel}>LINEUP</Text>
        <FlatList
          testID="lineupFlatlist"
          data={this.state.selectedLineUp}
          scrollEnabled={false}
          renderItem={({ item, index }) => {
            const isHeadliner = index === 0;
            return (
              <TouchableOpacity
                testID="lineup"
                style={this.eventStyles.detailLineupRow}
                onPress={() => item.id !== '' && this.showProfile(item.id)}
                activeOpacity={item.id === '' ? 1 : 0.8}
              >
                <View
                  style={[
                    this.eventStyles.detailLineupIndex,
                    isHeadliner && this.eventStyles.detailLineupIndexActive,
                  ]}
                >
                  <Text
                    style={[
                      this.eventStyles.detailLineupIndexText,
                      isHeadliner && this.eventStyles.detailLineupIndexTextActive,
                    ]}
                  >
                    {index + 1}
                  </Text>
                </View>
                <Text style={this.eventStyles.detailLineupName}>
                  {item.first_name ? item.first_name.trim() : ''}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    );
  };

  renderShowType = () => {
    if (
      this.state.selectedTypeOfShows === null ||
      this.state.selectedTypeOfShows.length === 0
    ) {
      return null;
    }
    return (
      <View style={this.eventStyles.detailWebsiteRow}>
        <View
          style={[
            this.eventStyles.eventDetails,
            { alignItems: 'flex-start', flex: 0, paddingTop: 2 },
          ]}
        >
          <Icon name="music" size={16} color={this.getDetailTheme().primary} />
          <Text style={[this.eventStyles.detailMetaLabel, { marginLeft: 8 }]}>
            Show type
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <FlatList
            testID="typeOfShowFlatlist"
            numColumns={20}
            columnWrapperStyle={{ flexWrap: 'wrap' }}
            data={this.state.selectedTypeOfShows}
            contentContainerStyle={this.localStyles.showTypeFlatlist}
            keyExtractor={(item: any) => item.id}
            renderItem={({ item, index }) => {
              const name = this.getItemName(item);
              return (
                <Text
                  style={[this.eventStyles.detailMetaValue, { color: this.getDetailTheme().foreground }]}
                >
                  {index === this.state.selectedTypeOfShows.length - 1
                    ? `${name}`
                    : `${name}, `}
                </Text>
              );
            }}
          />
        </View>
      </View>
    );
  };

  renderGenre = () => {
    if (
      this.state.selectedGenres === null ||
      this.state.selectedGenres.length === 0
    ) {
      return null;
    }
    return (
      <View style={this.eventStyles.detailWebsiteRow}>
        <View
          style={[
            this.eventStyles.eventDetails,
            { alignItems: 'flex-start', flex: 0, paddingTop: 2 },
          ]}
        >
          <Icon name="music" size={16} color={this.getDetailTheme().primary} />
          <Text style={[this.eventStyles.detailMetaLabel, { marginLeft: 8 }]}>
            Genre
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <FlatList
            testID="genreFlatlist"
            numColumns={20}
            columnWrapperStyle={{ flexWrap: 'wrap' }}
            data={this.state.selectedGenres}
            contentContainerStyle={this.localStyles.showTypeFlatlist}
            keyExtractor={(item: any) => item.id}
            renderItem={({ item, index }) => {
              const name = this.getItemName(item);
              return (
                <Text
                  style={[this.eventStyles.detailMetaValue, { color: this.getDetailTheme().foreground }]}
                >
                  {index === this.state.selectedGenres.length - 1
                    ? `${name}`
                    : `${name}, `}
                </Text>
              );
            }}
          />
        </View>
      </View>
    );
  };

  renderDescription = () => {
    if (!this.state.description) return null;
    return (
      <View style={{ marginTop: 8, marginBottom: 8 }}>
        <Text style={this.eventStyles.detailSectionLabel}>ABOUT</Text>
        <Text style={this.eventStyles.detailAboutText}>{this.state.description}</Text>
      </View>
    );
  };

  renderVenueCard = () => {
    if (!this.state.location && !this.state.address) return null;
    const fullAddress = this.getFullAddress();
    return (
      <View>
        <Text style={this.eventStyles.detailSectionLabel}>VENUE</Text>
        <TouchableOpacity
          testID="openMap"
          style={this.eventStyles.detailVenueCard}
          onPress={() => this.openGoogleMaps()}
          activeOpacity={0.8}
        >
          <View style={this.eventStyles.detailVenueIconWrap}>
            <MaterialCommunityIcons
              name="office-building"
              size={22}
              color={this.getDetailTheme().foreground}
            />
          </View>
          <View style={this.eventStyles.detailVenueTextWrap}>
            <Text style={this.eventStyles.detailVenueName} numberOfLines={1}>
              {this.state.location || 'Venue'}
            </Text>
            {fullAddress ? (
              <Text style={this.eventStyles.detailVenueAddress}>{fullAddress}</Text>
            ) : null}
          </View>
          <Icon name="external-link" size={16} color={this.getDetailTheme().muted} />
        </TouchableOpacity>
      </View>
    );
  };

  getPostRules = () => {
    let rulesAndRegulationsIcons =
      this.state.rulesAndRegulationsIcons ||
      this.state.eventDetail?.attributes?.rules_and_regulations_icons ||
      [];

    if (!Array.isArray(rulesAndRegulationsIcons)) {
      if (
        rulesAndRegulationsIcons &&
        typeof rulesAndRegulationsIcons === 'object'
      ) {
        rulesAndRegulationsIcons = [rulesAndRegulationsIcons];
      } else if (typeof rulesAndRegulationsIcons === 'string') {
        rulesAndRegulationsIcons = [{ title: rulesAndRegulationsIcons }];
      } else {
        rulesAndRegulationsIcons = [];
      }
    }

    return rulesAndRegulationsIcons
      .map((item: any) => {
        let title = '';
        if (typeof item === 'string') {
          title = item;
        } else if (item && typeof item === 'object') {
          title = item.title || item.name || item.text || '';
        }
        return { ...(typeof item === 'object' ? item : {}), title };
      })
      .filter((item: any) => item.title);
  };

  splitKnownAndOtherRules = (postRules: any[]) => {
    const officialList = this.state.officialRulesAndRegulationsIconsList || [];
    const officialTitlesSet = new Set(
      officialList.map((i: any) => (i.title || '').trim().toLowerCase()),
    );
    const knownRules: any[] = [];
    const otherRules: any[] = [];
    postRules.forEach((item: any) => {
      const titleNorm = (item.title || '').trim().toLowerCase();
      if (officialTitlesSet.size === 0 || officialTitlesSet.has(titleNorm)) {
        knownRules.push(item);
      } else {
        otherRules.push(item);
      }
    });
    return { knownRules, otherRules };
  };

  renderRulesAndRegulations = () => {
    const postRules = this.getPostRules();
    const expanded = (this.state as any).showRulesExpanded;
    const { knownRules, otherRules } =
      postRules.length > 0
        ? this.splitKnownAndOtherRules(postRules)
        : { knownRules: [], otherRules: [] };
    const hasRules = knownRules.length > 0 || otherRules.length > 0;

    return (
      <View style={{ marginTop: 8 }}>
        <TouchableOpacity
          style={[
            this.eventStyles.detailRulesHeader,
            expanded ? this.eventStyles.detailRulesHeaderOpen : null,
          ]}
          onPress={() =>
            this.setState({
              showRulesExpanded: !expanded,
            } as any)
          }
          activeOpacity={0.8}
        >
          <Text style={this.eventStyles.detailRulesHeaderText}>
            Venue Rules & Regulations
          </Text>
          <Icon
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={18}
            color={this.getDetailTheme().foreground}
          />
        </TouchableOpacity>
        {expanded ? (
          <View style={this.eventStyles.detailRulesBody}>
            {hasRules ? (
              <>
                {knownRules.map((item: any, index: number) => (
                  <View
                    key={item.id?.toString() || item.title || index.toString()}
                    style={this.eventStyles.detailRuleRow}
                  >
                    <Icon
                      name="check-circle"
                      size={16}
                      color={this.getDetailTheme().primary}
                      style={this.eventStyles.detailRuleIcon}
                    />
                    <Text style={this.eventStyles.detailRuleTitle}>{item.title}</Text>
                  </View>
                ))}
                {otherRules.length > 0 && (
                  <TouchableOpacity
                    testID="showMoreRulesBtn"
                    onPress={() => this.setState({ showRulesMoreModal: true })}
                    style={{ marginTop: 8 }}
                  >
                    <Text
                      style={[
                        this.eventStyles.detailRuleTitle,
                        { color: this.getDetailTheme().primary, fontWeight: '700' },
                      ]}
                    >
                      More info
                    </Text>
                  </TouchableOpacity>
                )}
              </>
            ) : (
              <Text style={[this.eventStyles.detailRuleText, { marginTop: 8 }]}>
                No rules specified.
              </Text>
            )}
          </View>
        ) : otherRules.length > 0 ? (
          <TouchableOpacity
            testID="showMoreRulesBtn"
            onPress={() => this.setState({ showRulesMoreModal: true })}
            style={{ height: 0, overflow: 'hidden' }}
          />
        ) : null}
      </View>
    );
  };

  closeRulesMoreModal = () => {
    this.setState({ showRulesMoreModal: false });
  };

  renderRulesMoreModal = () => {
    const showRulesMoreModal = this.state.showRulesMoreModal;
    const postRules = this.getPostRules();
    const { otherRules } = this.splitKnownAndOtherRules(postRules);

    if (otherRules.length === 0) {
      return null;
    }

    const windowHeight = Dimensions.get('window').height;
    const modalMaxHeight = Math.min(windowHeight * 0.75, 500);

    return (
      <Modal
        transparent
        animationType="slide"
        visible={showRulesMoreModal}
        onRequestClose={this.closeRulesMoreModal}
      >
        <View style={[this.localStyles.centeredView, { backgroundColor: 'rgba(8, 8, 15, 0.72)' }]}>
          <TouchableWithoutFeedback onPress={this.closeRulesMoreModal}>
            <View style={StyleSheet.absoluteFill} />
          </TouchableWithoutFeedback>
          <View
            style={[
              this.localStyles.modalView,
              this.localStyles.reportModalContent,
              { height: modalMaxHeight },
            ]}
          >
            <View style={this.localStyles.reportHeader}>
              <Text style={this.localStyles.reportTitle}>Rules and Regulations</Text>
              <TouchableOpacity
                testID="closeRulesMoreModal"
                onPress={this.closeRulesMoreModal}
              >
                <Svg width={20} height={20} viewBox="0 0 14 14" fill={this.getDetailTheme().foreground}>
                  <Path
                    d="M13.3.71a.996.996 0 00-1.41 0L7 5.59 2.11.7A.996.996 0 10.7 2.11L5.59 7 .7 11.89a.996.996 0 101.41 1.41L7 8.41l4.89 4.89a.996.996 0 101.41-1.41L8.41 7l4.89-4.89c.38-.38.38-1.02 0-1.4z"
                    fill={this.getDetailTheme().foreground}
                  />
                </Svg>
              </TouchableOpacity>
            </View>
            <ScrollView
              style={this.localStyles.rulesModalScroll}
              contentContainerStyle={{ paddingBottom: 24 }}
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled={true}
              bounces={true}
            >
              {otherRules.map((item: any, index: number) => (
                <View key={item.id?.toString() || index} style={{ marginBottom: 12 }}>
                  <Text style={[this.localStyles.text, { lineHeight: 22 }]}>
                    {item.title}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  handleBuyTicket = (link: string) => {
    this.setState({
      showDisclaimer: true,
      pendingTicketLink: link,
    });
  };

  handleOpenLink = async () => {
    const { pendingTicketLink } = this.state;
    this.setState({ showDisclaimer: false });

    if (!pendingTicketLink) {
      console.log('No ticket link to open');
      return;
    }

    let urlToOpen = pendingTicketLink.trim();
    if (!/^https?:\/\//i.test(urlToOpen)) {
      urlToOpen = `https://${urlToOpen}`;
    }

    try {
      const supported = await Linking.canOpenURL(urlToOpen);
      if (supported) {
        await Linking.openURL(urlToOpen);
      } else {
        console.log(`Don't know how to open this URL: ${urlToOpen}`);
        await Linking.openURL(urlToOpen);
      }
    } catch (error) {
      console.error('An error occurred while opening the link:', error);
    }
  };

  handleReportIssue = () => {
    (this as any).setState({ showDisclaimer: false, showReportModal: true });
  };

  closeReportModal = () => {
    (this as any).setState({
      showReportModal: false,
      reportReason: '',
      reportComment: '',
      reportError: '',
    });
  };

  selectReportReason = (reason: string) => {
    (this as any).setState({ reportReason: reason, reportError: '' });
  };

  handleReportCommentChange = (text: string) => {
    (this as any).setState({ reportComment: text });
  };

  submitReport = async () => {
    const { reportReason, reportComment } = this.state as any;

    if (!reportReason) {
      (this as any).setState({
        reportError: 'Please select a reason for reporting.',
      });
      return;
    }

    const reportPayload = {
      event_id: this.state.eventId,
      reason: reportReason,
      comment: reportComment || '',
    };

    const endpoint = `/reports`;
    const baseURL = 'https://api.localshows.com';
    const fullURL = `${baseURL}${endpoint}`;

    console.log('=== Report Show API Call ===');
    console.log('URL:', fullURL);
    console.log('Payload:', JSON.stringify(reportPayload, null, 2));

    try {
      const authToken = await getStorageData('authToken');

      const requestMessage = new Message(
        getName(MessageEnum.RestAPIRequestMessage),
      );

      (this as any).reportShowApiCallID = requestMessage.messageId;

      requestMessage.addData(
        getName(MessageEnum.RestAPIResponceEndPointMessage),
        endpoint,
      );

      const header = {
        'Content-Type': 'application/json',
        token: authToken,
      };

      requestMessage.addData(
        getName(MessageEnum.RestAPIRequestHeaderMessage),
        JSON.stringify(header),
      );

      requestMessage.addData(
        getName(MessageEnum.RestAPIRequestBodyMessage),
        JSON.stringify(reportPayload),
      );

      requestMessage.addData(
        getName(MessageEnum.RestAPIRequestMethodMessage),
        'POST',
      );

      runEngine.sendMessage(requestMessage.id, requestMessage);

      this.closeReportModal();
    } catch (error) {
      console.error('Error submitting report:', error);
      (this as any).setState({
        reportError: 'Failed to submit report. Please try again.',
      });
    }
  };

  renderReportModal = () => {
    const {
      showReportModal,
      reportReason,
      reportComment,
      reportError,
    } = this.state as any;

    return (
      <Modal
        transparent
        animationType="slide"
        visible={showReportModal}
        onRequestClose={this.closeReportModal}
      >
        <TouchableWithoutFeedback onPress={this.closeReportModal}>
          <View style={[this.localStyles.centeredView, { backgroundColor: 'rgba(8, 8, 15, 0.72)' }]}>
            <TouchableWithoutFeedback>
              <View style={[this.localStyles.modalView, this.localStyles.reportModalContent]}>
                <View style={this.localStyles.reportHeader}>
                  <Text style={this.localStyles.reportTitle}>{'Report Show'}</Text>
                  <TouchableOpacity
                    testID="closeReportModal"
                    onPress={this.closeReportModal}
                  >
                    <Svg
                      width={20}
                      height={20}
                      viewBox="0 0 14 14"
                      fill={this.getDetailTheme().foreground}
                    >
                      <Path
                        d="M13.3.71a.996.996 0 00-1.41 0L7 5.59 2.11.7A.996.996 0 10.7 2.11L5.59 7 .7 11.89a.996.996 0 101.41 1.41L7 8.41l4.89 4.89a.996.996 0 101.41-1.41L8.41 7l4.89-4.89c.38-.38.38-1.02 0-1.4z"
                        fill={this.getDetailTheme().foreground}
                      />
                    </Svg>
                  </TouchableOpacity>
                </View>
                <Text style={this.localStyles.reportSubtitle}>
                  {'Select a reason for reporting this show:'}
                </Text>
                <ScrollView
                  style={this.localStyles.reportReasonsContainer}
                  contentContainerStyle={{ paddingBottom: 8 }}
                  showsVerticalScrollIndicator={false}
                >
                  {this.reportReasons.map(reason => {
                    const isSelected = reportReason === reason;
                    return (
                      <TouchableOpacity
                        key={reason}
                        style={[
                          this.localStyles.reportReasonButton,
                          isSelected && this.localStyles.reportReasonButtonSelected,
                        ]}
                        onPress={() => this.selectReportReason(reason)}
                      >
                        <View
                          style={[
                            this.localStyles.reportRadioOuter,
                            isSelected && this.localStyles.reportRadioOuterSelected,
                          ]}
                        >
                          {isSelected && <View style={this.localStyles.reportRadioInner} />}
                        </View>
                        <Text
                          style={[
                            this.localStyles.reportReasonText,
                            isSelected && this.localStyles.reportReasonTextSelected,
                          ]}
                        >
                          {reason}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
                {reportError ? (
                  <Text style={this.localStyles.reportErrorText}>{reportError}</Text>
                ) : null}
                <Text style={this.localStyles.reportSubtitle}>
                  {'Additional details (optional)'}
                </Text>
                <TextInput
                  testID="reportCommentInput"
                  style={this.localStyles.reportCommentInput}
                  placeholder={'Add any additional information...'}
                  placeholderTextColor={this.getDetailTheme().muted}
                  multiline
                  numberOfLines={4}
                  value={reportComment}
                  onChangeText={this.handleReportCommentChange}
                />
                <View style={this.localStyles.reportActions}>
                  <TouchableOpacity
                    testID="cancelReport"
                    style={[this.localStyles.reportButton, this.localStyles.reportCancelButton]}
                    onPress={this.closeReportModal}
                  >
                    <Text style={this.localStyles.reportCancelText}>{'Cancel'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    testID="submitReport"
                    style={[this.localStyles.reportButton, this.localStyles.reportSubmitButton]}
                    onPress={this.submitReport}
                  >
                    <Text style={this.localStyles.reportSubmitText}>
                      {'Submit Report'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };

  renderDisclaimerModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.showDisclaimer}
        onRequestClose={() => this.setState({ showDisclaimer: false })}
      >
        <View style={this.localStyles.modalParentView}>
          <View style={this.localStyles.modalContainerView}>
            <TouchableOpacity
              testID="closeDisclaimerBtn"
              style={this.localStyles.disablePopupIconContainer}
              onPress={() => this.setState({ showDisclaimer: false })}
            >
              <Icon name="x" color={this.getDetailTheme().foreground} size={25} />
            </TouchableOpacity>
            <Text style={this.localStyles.txtCancelShowHeading}>Disclaimer</Text>
            <View>
              <Text style={this.localStyles.txtDelete}>
                You're about to open an external web-site. Be cautious and keep
                your personal information safe. This is a third-party website,
                over which Local Shows doesn't have responsibility or control. If
                a weblink brings you to a website which you believe contains
                illegal content or violates our community guidelines, please{' '}
                <Text
                  testID="reportItLink"
                  style={{
                    fontWeight: 'bold',
                    textDecorationLine: 'underline',
                    color: this.getDetailTheme().primary,
                  }}
                  onPress={this.handleReportIssue}
                  suppressHighlighting={false}
                >
                  report it
                </Text>{' '}
                immediately.
              </Text>
              <Text style={[this.localStyles.txtDelete, { marginTop: 10 }]}>
                Are you sure you want to continue?
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 20,
              }}
            >
              <TouchableOpacity
                testID="cancelDisclaimerBtn"
                style={[
                  this.localStyles.cancelShowButtonContainer,
                  this.localStyles.keepButtonContainer,
                  { width: '45%' },
                ]}
                onPress={() => this.setState({ showDisclaimer: false })}
              >
                <Text style={[this.localStyles.textCancelButton, this.localStyles.textKeepButton]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                testID="confirmDisclaimerBtn"
                style={[this.localStyles.cancelShowButtonContainer, { width: '45%' }]}
                onPress={this.handleOpenLink}
              >
                <Text style={this.localStyles.textCancelButton}>Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  renderMenuPopup = () => {
    const isPost = this.isPicturePost();

    return (
      <>
        {this.state.showMenu && (
          <View style={[this.eventStyles.detailMenuContainer, this.localStyles.menuContainer]}>
            {isPost ? (
              <>
                <TouchableOpacity
                  testID="editPost"
                  style={this.eventStyles.menuButton}
                  onPress={() => {
                    this.setState({ showMenu: false }, () => {
                      this.props.navigation.navigate('PhotoLibrary', {
                        eventId: this.state.eventId,
                      });
                    });
                  }}
                >
                  <Text style={this.eventStyles.detailMenuButtonText}>
                    {'Edit the picture'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  testID="deletePost"
                  style={[this.eventStyles.menuButton, { marginTop: 5 }]}
                  onPress={() => {
                    this.setState({ cancelPopup: true, showMenu: false });
                  }}
                >
                  <Text style={this.eventStyles.detailMenuButtonText}>
                    {'Delete picture'}
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity
                  testID="editShow"
                  style={this.eventStyles.menuButton}
                  onPress={() => {
                    this.setState({ showMenu: false }, () => {
                      this.props.navigation.navigate('PostCreation', {
                        eventId: this.state.eventId,
                        from: 'show',
                      });
                    });
                  }}
                >
                  <Text style={this.eventStyles.detailMenuButtonText}>
                    {'Edit the show'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  testID="postponeShow"
                  style={[this.eventStyles.menuButton, { marginTop: 5 }]}
                  onPress={() => {
                    this.setState({ showMenu: false }, () => {
                      this.props.navigation.navigate('PostPostpone', {
                        eventId: this.state.eventId,
                        eventTitle: this.state.eventTitle,
                        from: 'show',
                      });
                    });
                  }}
                >
                  <Text style={this.eventStyles.detailMenuButtonText}>
                    {'Postpone the show'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  testID="cancelShow"
                  disabled={this.state.eventDetail?.attributes?.is_canceled}
                  style={[
                    this.eventStyles.menuButton,
                    {
                      marginTop: 5,
                      opacity: this.state.eventDetail?.attributes?.is_canceled
                        ? 0.5
                        : 1,
                    },
                  ]}
                  onPress={() => {
                    this.setState({ cancelPopup: true, showMenu: false });
                  }}
                >
                  <Text style={this.eventStyles.detailMenuButtonText}>
                    {'Cancel show'}
                  </Text>
                </TouchableOpacity>
                {!this.state.sold_out && (
                  <TouchableOpacity
                    testID="markAsSoldOut"
                    style={[this.eventStyles.menuButton, { marginTop: 5 }]}
                    onPress={() => {
                      this.setState({ showMenu: false }, () => {
                        this.handleMarkAsSoldOut(this.state.eventId);
                      });
                    }}
                  >
                    <Text style={this.eventStyles.detailMenuButtonText}>
                      {'Mark as sold out'}
                    </Text>
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        )}
      </>
    );
  };

  renderBuyTicketButton = () => {
    const isVerified = this.state.eventDetail?.attributes?.verified;
    const ticketLink = this.state.eventDetail?.attributes?.ticket_link;
    if (!ticketLink || !isVerified) return null;
    const priceLabel = this.getTicketPriceLabel();
    const ticketLabel = priceLabel
      ? `GET TICKETS — ${priceLabel}`
      : 'GET TICKETS';

    return (
      <TouchableOpacity
        testID="buyTicketBtn"
        style={this.eventStyles.detailPrimaryBtn}
        onPress={() => this.handleBuyTicket(ticketLink)}
        activeOpacity={0.85}
      >
        <MaterialCommunityIcons
          name="ticket-confirmation-outline"
          size={18}
          color="#FFFFFF"
        />
        <Text style={this.eventStyles.detailPrimaryBtnText}>{ticketLabel}</Text>
      </TouchableOpacity>
    );
  };

  renderDirectionsButton = () => {
    const isVerified = this.state.eventDetail?.attributes?.verified;
    const ticketLink = this.state.eventDetail?.attributes?.ticket_link;
    const isPrimary = !(ticketLink && isVerified);
    return (
      <TouchableOpacity
        testID="directionsBtn"
        style={
          isPrimary
            ? this.eventStyles.detailPrimaryBtn
            : this.eventStyles.detailSecondaryBtn
        }
        onPress={() => this.openGoogleMaps()}
        activeOpacity={0.85}
      >
        <Text
          style={
            isPrimary
              ? this.eventStyles.detailPrimaryBtnText
              : this.eventStyles.detailSecondaryBtnText
          }
        >
          Directions
        </Text>
      </TouchableOpacity>
    );
  };

  renderShowBody = () => {
    return (
      <View>
        {this.renderStatusBadges()}
        {this.renderLikes()}
        <View style={this.eventStyles.detailSection}>
          {this.renderInfoCards()}
          {this.renderLineup()}
          {this.renderDescription()}
          {this.renderVenueCard()}
          {this.renderAddress()}
          {this.renderEndDate()}
          {this.renderEventCreatorCategoryRow()}
          {this.renderShowType()}
          {this.renderGenre()}
          {this.renderRulesAndRegulations()}
          <View style={this.eventStyles.detailTicketsWrap}>
            {this.renderBuyTicketButton()}
            {this.renderDirectionsButton()}
          </View>
        </View>
      </View>
    );
  };

  renderPictureBody = () => {
    return (
      <View style={this.eventStyles.detailSection}>
        {this.renderLikes()}
        {this.renderDescription()}
      </View>
    );
  };
  // Customizable Area End

  render() {
    // Customizable Area Start
    const isPost = this.isPicturePost();
    // Customizable Area End
    return (
      <SafeAreaView style={this.eventStyles.detailScreen} edges={['bottom']}>
        {/* Customizable Area Start */}
        <StatusBar
          barStyle={this.state.isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={this.getDetailTheme().background}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={this.eventStyles.detailListContent}
        >
          <TouchableWithoutFeedback
            testID="containerFeedback"
            onPress={() => {
              this.setState({ showMenu: false });
            }}
          >
            <View>
              {this.state.sold_out && (
                <View style={this.localStyles.soldoutContainer}>
                  <View style={this.localStyles.soldoutView}>
                    <View style={this.localStyles.soldoutView2}>
                      <Text style={this.localStyles.soldoutText}>
                        Unfortunately, the event tickets are SOLD OUT.
                      </Text>
                    </View>
                  </View>
                </View>
              )}
              {this.renderEventImage()}
              {isPost ? this.renderPictureBody() : this.renderShowBody()}
              {this.renderDisclaimerModal()}
              {this.renderReportModal()}
              {this.renderRulesMoreModal()}
              <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.cancelPopup}
              >
                <View style={this.localStyles.modalParentView}>
                  <View style={this.localStyles.modalContainerView}>
                    <TouchableOpacity
                      testID="crossBtn"
                      style={this.localStyles.disablePopupIconContainer}
                      onPress={() => this.setState({ cancelPopup: false })}
                    >
                      <Icon name="x" color={this.getDetailTheme().foreground} size={25} />
                    </TouchableOpacity>
                    <Text style={this.localStyles.txtCancelShowHeading}>
                      {isPost
                        ? 'Do you want to delete the picture ?'
                        : 'Do you want to delete the show ?'}
                    </Text>
                    <Text style={this.localStyles.txtDelete}>
                      {isPost
                        ? 'If you delete the picture, you will not be able to restore it again.'
                        : 'If you delete the show, you will not be able to restore the show again.'}
                    </Text>
                    <TouchableOpacity
                      testID="cancelBtn"
                      style={[
                        this.localStyles.cancelShowButtonContainer,
                        this.localStyles.keepButtonContainer,
                      ]}
                      onPress={() => this.setState({ cancelPopup: false })}
                    >
                      <Text
                        style={[
                          this.localStyles.textCancelButton,
                          this.localStyles.textKeepButton,
                        ]}
                      >
                        Cancel
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      testID="confirmBtn"
                      style={this.localStyles.cancelShowButtonContainer}
                      onPress={() => {
                        this.setState({ cancelPopup: false }, () => {
                          if (isPost) {
                            this.deletePostDetail(this.state.eventId);
                          } else {
                            this.handleCancelShowAPI();
                          }
                        });
                      }}
                    >
                      <Text style={this.localStyles.textCancelButton}>Confirm</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
        {this.state.isLoading && (
          <View style={this.eventStyles.detailLoadingContainer}>
            <ActivityIndicator size={'large'} color={this.getDetailTheme().primary} />
          </View>
        )}
        {/* Customizable Area End */}
      </SafeAreaView>
    );
  }
}

// Customizable Area Start
type DetailTheme = typeof redesignTheme;

const createPostDetailStyles = (theme: DetailTheme) =>
  StyleSheet.create({
    backButton: {
      width: 20,
      height: 20,
      resizeMode: 'contain',
    },
    canceledBadge: {
      color: theme.primary,
      fontSize: 14,
      fontWeight: '700',
      marginRight: 10,
    },
    text: {
      fontSize: 16,
      color: theme.foreground,
      fontWeight: '400',
    },
    menuContainer: {
      right: 16,
      top: 96,
    },
    showTypeFlatlist: {
      flex: 1,
      flexWrap: 'wrap',
    },
    modalParentView: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(8, 8, 15, 0.72)',
    },
    modalContainerView: {
      justifyContent: 'space-between',
      backgroundColor: theme.card,
      borderTopEndRadius: 20,
      borderTopStartRadius: 20,
      padding: 35,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 100,
    },
    disablePopupIconContainer: {
      position: 'absolute',
      right: 20,
      top: 20,
    },
    txtCancelShowHeading: {
      fontWeight: '700',
      fontSize: 26,
      lineHeight: 28,
      marginBottom: 10,
      marginTop: 25,
      color: theme.foreground,
    },
    txtDelete: {
      fontSize: 18,
      color: theme.muted,
    },
    cancelShowButtonContainer: {
      backgroundColor: theme.primary,
      width: '100%',
      padding: 15,
      borderRadius: 10,
      marginTop: 15,
    },
    textCancelButton: {
      color: '#FFFFFF',
      fontWeight: '700',
      fontSize: 18,
      alignSelf: 'center',
    },
    keepButtonContainer: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: theme.divider,
    },
    textKeepButton: {
      color: theme.foreground,
    },
    soldoutView: {
      flex: 1,
      backgroundColor: theme.primary,
      paddingLeft: 8,
      borderRadius: 4,
      overflow: 'hidden',
    },
    soldoutView2: {
      backgroundColor: theme.primarySoft,
      flex: 1,
      paddingVertical: 12,
      paddingLeft: 12,
    },
    soldoutText: {
      color: theme.primary,
      fontSize: 12,
    },
    soldoutContainer: {
      paddingVertical: 16,
      position: 'absolute',
      alignSelf: 'center',
      width: '100%',
      top: 50,
      zIndex: 1,
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalView: {
      margin: 20,
      backgroundColor: theme.card,
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      width: '90%',
    },
    reportModalContent: {
      alignItems: 'stretch',
      padding: 24,
    },
    reportHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    reportTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.foreground,
    },
    reportSubtitle: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.muted,
      marginBottom: 12,
    },
    reportReasonsContainer: {
      maxHeight: 200,
      marginBottom: 20,
    },
    rulesModalScroll: {
      flex: 1,
      minHeight: 0,
      marginBottom: 0,
    },
    reportReasonButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 8,
      marginBottom: 8,
      backgroundColor: theme.input,
    },
    reportReasonButtonSelected: {
      borderColor: theme.primary,
      backgroundColor: theme.primarySoft,
    },
    reportRadioOuter: {
      height: 20,
      width: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: theme.muted,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    reportRadioOuterSelected: {
      borderColor: theme.primary,
    },
    reportRadioInner: {
      height: 10,
      width: 10,
      borderRadius: 5,
      backgroundColor: theme.primary,
    },
    reportReasonText: {
      fontSize: 14,
      color: theme.muted,
    },
    reportReasonTextSelected: {
      color: theme.foreground,
      fontWeight: '600',
    },
    reportErrorText: {
      color: theme.primary,
      fontSize: 12,
      marginBottom: 16,
      marginTop: -10,
    },
    reportCommentInput: {
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 8,
      padding: 12,
      height: 100,
      textAlignVertical: 'top',
      fontSize: 14,
      color: theme.foreground,
      marginBottom: 24,
      backgroundColor: theme.input,
    },
    reportActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    reportButton: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    reportCancelButton: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: theme.divider,
      marginRight: 12,
    },
    reportSubmitButton: {
      backgroundColor: theme.primary,
    },
    reportCancelText: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.muted,
    },
    reportSubmitText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFFFFF',
    },
  });

const darkPostDetailStyles = createPostDetailStyles(redesignTheme);
const lightPostDetailStyles = createPostDetailStyles(lightTheme);
// Customizable Area End
                                                                                 
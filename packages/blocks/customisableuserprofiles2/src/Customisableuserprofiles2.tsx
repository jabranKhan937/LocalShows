import React from 'react';

// Customizable Area Start 03406650508

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  TouchableWithoutFeedback,
  ActivityIndicator,
  FlatList,
  StatusBar,
  Modal,
  KeyboardAvoidingView,
  TextInput,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { notificationIcon } from '../../search/src/assets';
import {
  lightTheme,
  redesignTheme,
} from '../../utilities/src/Colors';
import { backButtonIcon, leftArrow } from '../../events/src/assets';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FastImage from '../../../components/src/SafeFastImage';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import Feather from 'react-native-vector-icons/Feather';
import MCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { RowMap, SwipeListView } from 'react-native-swipe-list-view';
import {
  ICommentItem,
  IReplyItem,
} from './Customisableuserprofiles2Controller';
// Merge Engine - import assets - Start
// Merge Engine - import assets - End

// Merge Engine - Artboard Dimension  - Start
let artBoardHeightOrg = 667;
let artBoardWidthOrg = 375;
// Merge Engine - Artboard Dimension  - End
// Customizable Area End

import Customisableuserprofiles2Controller, {
  Props,
  configJSON,
} from './Customisableuserprofiles2Controller';

export default class Customisableuserprofiles2 extends Customisableuserprofiles2Controller {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }

  get styles() {
    return this.state.isDarkMode ? darkProfileStyles : lightProfileStyles;
  }

  // Customizable Area Start
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

    return <></>;
  };

  getProfileLocationLabel = () => {
    const city = this.state.userProfileData.city || '';
    const state = this.state.userProfileData.state || '';
    if (state !== '') {
      return `${city}, ${state}`;
    }
    return this.state.userProfileData.country || '';
  };

  getAccountTypeLabel = () => {
    const accountType = this.state.userProfileData.account_type || '';
    return accountType.replace(/_/g, ' ');
  };

  getSocialHandle = (value: string) => {
    if (!value || value === 'undefined') {
      return '';
    }
    const cleaned = value.trim().replace(/\/+$/, '');
    if (!cleaned) {
      return '';
    }
    const withoutProtocol = cleaned.replace(/^https?:\/\//i, '');
    const withoutWww = withoutProtocol.replace(/^www\./i, '');
    const parts = withoutWww.split('/').filter(Boolean);
    if (parts.length <= 1) {
      return withoutWww;
    }
    return parts[parts.length - 1];
  };

  getWebsiteLabel = (value: string) => {
    if (!value || value === 'undefined') {
      return '';
    }
    return value
      .trim()
      .replace(/^https?:\/\//i, '')
      .replace(/\/+$/, '');
  };

  getShowCardSubtitle = (item: any) => {
    const location = item.location || '';
    if (!item.date_of_the_show || item.date_of_the_show === '2999-12-31') {
      return location ? `${location} · TBD` : 'TBD';
    }
    const month = this.formatMonth(item.date_of_the_show);
    const day = this.formatDate(item.date_of_the_show);
    const dateLabel = `${month} ${day}`;
    return location ? `${location} · ${dateLabel}` : dateLabel;
  };

  renderHeader = () => {
    return (
      <SafeAreaView
        edges={['top']}
        style={this.styles.bannerOverlay}
        pointerEvents="box-none"
      >
        <View style={this.styles.bannerOverlayInner} pointerEvents="box-none">
          <TouchableOpacity
            testID="navigationBackButton"
            style={this.styles.overlayCircleBtn}
            onPress={this.handleBackButton}
            activeOpacity={0.8}
          >
            <Image source={backButtonIcon} style={this.styles.overlayBackIcon} />
          </TouchableOpacity>
          <View style={this.styles.overlayRightActions}>
            {this.renderThemeToggle()}
            <TouchableOpacity
              testID="notificationIcon"
              style={this.styles.overlayCircleBtn}
              onPress={this.navigateToNotifications}
              activeOpacity={0.8}
            >
              <View style={this.styles.notificationWrapper}>
                <Image
                  source={notificationIcon}
                  style={this.styles.overlayNotificationIcon}
                />
                {this.renderNotificationIndicator()}
              </View>
            </TouchableOpacity>
            {this.isViewingOwnProfile() && (
              <TouchableOpacity
                testID="logoutBtn"
                style={[this.styles.overlayCircleBtn, this.styles.overlayCircleBtnGap]}
                onPress={this.handleLogoutPress}
                activeOpacity={0.8}
              >
                <Feather name="log-out" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              testID="hamburgerMenu"
              style={[this.styles.overlayCircleBtn, this.styles.overlayCircleBtnGap]}
              onPress={this.openProfileDrawer}
              activeOpacity={0.8}
            >
              <Feather name="menu" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
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
        <Svg width={width} height={BANNER_FADE_HEIGHT}>
          <Defs>
            <LinearGradient
              id="artistProfileBannerFade"
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
            height={BANNER_FADE_HEIGHT}
            fill="url(#artistProfileBannerFade)"
          />
        </Svg>
      </View>
    );
  };

  getProfileBannerSource = () => {
    const coverPhoto = this.state.userProfileData?.cover_photo;
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
                this.state.userProfileData.profile_image
                  ? {
                      uri: this.state.userProfileData.profile_image,
                      priority: FastImage.priority.high,
                    }
                  : require('../../../mobile/assets/images/default_profile.png')
              }
              style={this.styles.profileImage}
              resizeMode={FastImage.resizeMode.cover}
            />
          </View>
          {this.isViewingOwnProfile() ? (
            <TouchableOpacity
              testID="editProfileBtn"
              style={this.styles.editProfilePill}
              onPress={this.navigateToBandEditProfile}
              activeOpacity={0.8}
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
          ) : (
            <View style={this.styles.actionButtonsContainer}>
              <TouchableOpacity
                testID="follow"
                style={this.styles.actionBtn}
                onPress={this.handleFollowUserApi}
              >
                <Text style={[this.styles.txt, this.styles.actionBtnText]}>
                  {this.state.userProfileData.follow ? 'Unfollow' : 'Follow'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                testID="message"
                style={[this.styles.actionBtn, this.styles.msgBtn]}
                onPress={this.navigateToChatScreen}
              >
                <Text style={[this.styles.txt, this.styles.msgBtnText]}>Message</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

  renderProfileIdentity = () => {
    const name = this.state.userProfileData.first_name || '';
    const accountType = this.getAccountTypeLabel();
    const location = this.getProfileLocationLabel();
    const headlineParts = [accountType, location].filter(Boolean);
    return (
      <View style={this.styles.identityBlock}>
        <View style={this.styles.nameRow}>
          <Text style={this.styles.profileName} numberOfLines={2}>
            {name.toUpperCase()}
          </Text>
          {this.state.userProfileData.is_verified_user && (
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
        {!!this.state.userProfileData.bio &&
          this.state.userProfileData.bio !== '' && (
            <Text testID="bioTxt" style={this.styles.profileBio}>
              {this.state.userProfileData.bio}
            </Text>
          )}
        {this.renderSocialLinksRow()}
      </View>
    );
  };

  renderSocialLinksRow = () => {
    const social = this.state.userProfileData.social_media || {};
    const instagram = social.instagram;
    const facebook = social.facebook;
    const linkedin = social.linkedin;
    const website = this.state.userProfileData.official_website;
    const hasInstagram =
      instagram && instagram !== '' && instagram !== 'undefined';
    const hasFacebook =
      facebook && facebook !== '' && facebook !== 'undefined';
    const hasLinkedin =
      linkedin && linkedin !== '' && linkedin !== 'undefined';
    const hasWebsite = website && website !== '' && website !== 'undefined';

    if (!hasInstagram && !hasFacebook && !hasLinkedin && !hasWebsite) {
      return null;
    }

    return (
      <View style={this.styles.socialRow}>
        {hasInstagram && (
          <TouchableOpacity
            testID="instagramURL"
            style={this.styles.socialChip}
            onPress={() => this.handleInstagramLink(instagram)}
          >
            <Feather name="instagram" size={14} color={this.getProfileTheme().muted} />
            <Text style={this.styles.socialChipText} numberOfLines={1}>
              {`@${this.getSocialHandle(instagram)}`}
            </Text>
          </TouchableOpacity>
        )}
        {hasFacebook && (
          <TouchableOpacity
            testID="facebookURL"
            style={this.styles.socialChip}
            onPress={() => this.handleFacebookLink(facebook)}
          >
            <FontAwesome
              name="facebook"
              size={14}
              color={this.getProfileTheme().muted}
            />
            <Text style={this.styles.socialChipText} numberOfLines={1}>
              {this.getSocialHandle(facebook)}
            </Text>
          </TouchableOpacity>
        )}
        {hasLinkedin && (
          <TouchableOpacity
            testID="linkedinURL"
            style={this.styles.socialChip}
            onPress={() => this.handleLinkedInLink(linkedin)}
          >
            <FontAwesome
              name="linkedin-square"
              size={14}
              color={this.getProfileTheme().muted}
            />
            <Text style={this.styles.socialChipText} numberOfLines={1}>
              {this.getSocialHandle(linkedin)}
            </Text>
          </TouchableOpacity>
        )}
        {hasWebsite && (
          <TouchableOpacity
            testID="websiteURL"
            style={this.styles.socialChip}
            onPress={() => this.handleOfficialWebsite(website)}
          >
            <Feather name="globe" size={14} color={this.getProfileTheme().muted} />
            <Text style={this.styles.socialChipText} numberOfLines={1}>
              {this.getWebsiteLabel(website)}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  renderStatCell = (
    testID: string,
    value: string | number | undefined,
    label: string,
    onPress: () => void,
  ) => {
    return (
      <TouchableOpacity
        testID={testID}
        style={this.styles.statCell}
        activeOpacity={1}
        onPress={onPress}
      >
        <Text style={this.styles.statValue}>{value ?? 0}</Text>
        <Text style={this.styles.statLabel}>{label}</Text>
      </TouchableOpacity>
    );
  };

  renderPostsFollowersFollowings = () => {
    return (
      <View style={this.styles.statsContainer}>
        {this.renderStatCell(
          'postsCount',
          this.state.userProfileData.shows_count,
          'Shows',
          () => {
            this.setProfileContentTab('shows');
            this.scrollToContentSection();
          },
        )}
        <View style={this.styles.divider} />
        {this.renderStatCell(
          'postsCount',
          this.state.userProfileData?.post_list?.length,
          'Posts',
          () => {
            this.scrollToPosts();
          },
        )}
        <View style={this.styles.divider} />
        {this.renderStatCell(
          'followersCount',
          this.state.userProfileData.followers,
          'Followers',
          () => this.handleFollowerFollowingsNavigation('followers'),
        )}
        <View style={this.styles.divider} />
        {this.renderStatCell(
          'followingCount',
          this.state.userProfileData.following,
          'Following',
          () => this.handleFollowerFollowingsNavigation('following'),
        )}
      </View>
    );
  };

  renderCategory = () => {
    return (
      <>
        {this.state.userProfileData.category_subcat.length > 0 && (
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
            <View
              style={{
                flex: 0.5,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <FlatList
                testID="categoriesList"
                data={this.state.userProfileData.category_subcat}
                numColumns={20}
                columnWrapperStyle={{ flexWrap: 'wrap' }}
                keyExtractor={(item: any) => item.id}
                style={{ flex: 1 }}
                renderItem={({ item, index }) => {
                  return (
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: '400',
                        color: this.getProfileTheme().foreground,
                      }}
                    >
                      {index ===
                      this.state.userProfileData.category_subcat.length - 1
                        ? `${item.name}`
                        : `${item.name}, `}
                    </Text>
                  );
                }}
              />
              {this.isViewingOwnProfile() && (
                <TouchableOpacity
                  testID="editButton"
                  style={this.styles.editButton}
                  onPress={this.navigateToCategoriesSubCategories}
                >
                  <Text style={this.styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      </>
    );
  };

  renderMusicType = () => {
    return (
      <>
        {this.state.userProfileData.category_subcat.length > 0 && (
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
                data={this.state.userProfileData.category_subcat}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <FlatList
                    testID="subCategoriesList"
                    data={item.subcategories}
                    numColumns={20}
                    columnWrapperStyle={{ flexWrap: 'wrap' }}
                    keyExtractor={sub_item => sub_item.id}
                    renderItem={({ item: sub_item, index }) => (
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: '400',
                          color: this.getProfileTheme().foreground,
                        }}
                      >
                        {index === item.subcategories?.length - 1
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

  renderOfficialWebsite = () => {
    return (
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
            this.handleOfficialWebsite(
              this.state.userProfileData.official_website,
            );
          }}
        >
          {this.state.userProfileData.official_website}
        </Text>
      </View>
    );
  };

  renderSocialMedia = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginVertical: 5,
        }}
      >
        {(this.state.userProfileData.social_media.instagram !== '' ||
          this.state.userProfileData.social_media.facebook !== '' ||
          this.state.userProfileData.social_media.linkedin !== '') && (
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
        <View style={{ flex: 0.5, flexDirection: 'row', alignItems: 'center' }}>
          {this.state.userProfileData.social_media.instagram !== '' &&
            this.state.userProfileData.social_media.instagram !==
              'undefined' && (
              <TouchableOpacity
                testID="instagramURL"
                onPress={() => {
                  this.handleInstagramLink(
                    this.state.userProfileData.social_media.instagram,
                  );
                }}
                style={{ marginRight: 25 }}
              >
                <Feather name="instagram" size={20} color={this.getProfileTheme().primary} />
              </TouchableOpacity>
            )}
          {this.state.userProfileData.social_media.facebook !== '' &&
            this.state.userProfileData.social_media.facebook !==
              'undefined' && (
              <TouchableOpacity
                testID="facebookURL"
                onPress={() => {
                  this.handleFacebookLink(
                    this.state.userProfileData.social_media.facebook,
                  );
                }}
                style={{ marginRight: 25 }}
              >
                <FontAwesome name="facebook" size={20} color={this.getProfileTheme().primary} />
              </TouchableOpacity>
            )}
          {this.state.userProfileData.social_media.linkedin !== '' &&
            this.state.userProfileData.social_media.linkedin !==
              'undefined' && (
              <TouchableOpacity
                testID="linkedinURL"
                onPress={() => {
                  this.handleLinkedInLink(
                    this.state.userProfileData.social_media.linkedin,
                  );
                }}
              >
                <FontAwesome
                  name="linkedin-square"
                  size={20}
                  color={this.getProfileTheme().primary}
                />
              </TouchableOpacity>
            )}
        </View>
      </View>
    );
  };

  renderBio = () => {
    const hasEmail =
      this.state.userProfileData.email && this.isViewingOwnProfile();
    return (
      <>
        {hasEmail && (
          <View style={this.styles.infoBlock}>
            <Text style={this.styles.infoLabel}>Email Address</Text>
            <Text testID="emailTxt" style={this.styles.infoValue}>
              {this.state.userProfileData.email}
            </Text>
          </View>
        )}
        {this.renderBusinessHours()}
      </>
    );
  };

  renderInfluences = () => {
    return (
      <>
        {this.state.userProfileData.influences.length > 0 && (
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
                data={this.state.userProfileData.influences}
                contentContainerStyle={this.styles.influencesFlatlist}
                keyExtractor={(item: any) => item}
                renderItem={({ item, index }) => {
                  return (
                    <>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: '400',
                          color: this.getProfileTheme().foreground,
                        }}
                      >
                        {index ===
                        this.state.userProfileData.influences.length - 1
                          ? `${item}`
                          : `${item}, `}
                      </Text>
                    </>
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
    return (
      <>
        {this.state.userProfileData.affiliates.length > 0 && (
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
                data={this.state.userProfileData.affiliates}
                contentContainerStyle={this.styles.influencesFlatlist}
                keyExtractor={(item: any) => item}
                renderItem={({ item, index }) => {
                  return (
                    <>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: '400',
                          color: this.getProfileTheme().foreground,
                        }}
                      >
                        {index ===
                        this.state.userProfileData.affiliates.length - 1
                          ? `${item}`
                          : `${item}, `}
                      </Text>
                    </>
                  );
                }}
              />
            </View>
          </View>
        )}
      </>
    );
  };

  shouldShowRosterForAccountType = () => {
    const hiddenAccountTypes = [
      'Record Label',
      'Record_Label',
      'Promoter',
      'Booking_Agent',
      'Agency',
    ];
    return (
      hiddenAccountTypes.indexOf(this.state.userProfileData.account_type) !== -1
    );
  };

  /** Account types that collect street address and zip on signup; show on profile. */
  venueStyleAccountTypesWithAddress = [
    'Venue',
    'Club',
    'Bar',
    'Gallery',
    'Casino',
    'Cabaret',
    'Record_Store',
    'Theater',
    'Museum',
  ];

  shouldShowVenueAddressAndZip = () => {
    const accountType = this.state.userProfileData?.account_type;
    return this.venueStyleAccountTypesWithAddress.indexOf(accountType) !== -1;
  };

  renderVenueAddressAndZip = () => {
    if (!this.shouldShowVenueAddressAndZip()) {
      return null;
    }

    const address = (this.state.userProfileData.address || '')
      .toString()
      .trim();
    const zipRaw = this.state.userProfileData.zip_code;
    const zip =
      zipRaw !== undefined && zipRaw !== null && String(zipRaw).trim() !== ''
        ? String(zipRaw).trim()
        : '';

    const rowLabelStyle = {
      flex: 0.4,
      fontSize: 16,
      fontWeight: '700' as const,
      color: this.getProfileTheme().foreground,
    };
    const rowValueStyle = {
      flex: 0.5,
      fontSize: 16,
      fontWeight: '400' as const,
      color: this.getProfileTheme().foreground,
    };
    const rowContainerStyle = {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      marginVertical: 5,
    };

    return (
      <>
        <View style={rowContainerStyle}>
          <Text style={rowLabelStyle}>Address</Text>
          <Text testID="venueProfileAddress" style={rowValueStyle}>
            {address}
          </Text>
        </View>
        <View style={rowContainerStyle}>
          <Text style={rowLabelStyle}>Zip Code</Text>
          <Text testID="venueProfileZipCode" style={rowValueStyle}>
            {zip}
          </Text>
        </View>
      </>
    );
  };

  getNormalizedRosters = (): string[] => {
    const rostersRaw = this.state.userProfileData.rosters || [];
    if (!Array.isArray(rostersRaw)) {
      return [];
    }

    return rostersRaw
      .map((item: any) => {
        if (typeof item === 'string') {
          return item.trim();
        }
        if (item && typeof item === 'object') {
          return (item.name || '').toString().trim();
        }
        return '';
      })
      .filter((name: string) => name !== '');
  };

  renderRosters = () => {
    if (!this.shouldShowRosterForAccountType()) {
      return null;
    }

    const rosters = this.getNormalizedRosters();
    if (rosters.length === 0) {
      return null;
    }

    return (
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
          Roster
        </Text>
        <View style={{ flex: 0.5 }}>
          <FlatList
            testID="rostersFlatlist"
            numColumns={20}
            columnWrapperStyle={{ flexWrap: 'wrap' }}
            data={rosters}
            contentContainerStyle={this.styles.influencesFlatlist}
            keyExtractor={(item: string, index: number) =>
              `roster-${index}-${item}`
            }
            renderItem={({ item, index }) => (
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '400',
                  color: this.getProfileTheme().foreground,
                }}
              >
                {index === rosters.length - 1 ? `${item}` : `${item}, `}
              </Text>
            )}
          />
        </View>
      </View>
    );
  };

  renderRulesAndRegulations = () => {
    const rulesAndRegulations =
      this.state.userProfileData.rules_and_regulations_icons || [];
    let list: any[] = Array.isArray(rulesAndRegulations)
      ? rulesAndRegulations
      : rulesAndRegulations
        ? [rulesAndRegulations]
        : [];

    // Normalize to postRules (same as PostDetails): array of { title, ... }
    const postRules = list.map((item: any) => {
      const title =
        typeof item === 'string'
          ? item
          : item?.title || item?.name || item?.text || '';
      return { ...(typeof item === 'object' ? item : {}), title };
    }).filter((item: any) => item.title);

    if (!postRules || postRules.length === 0) {
      return null;
    }

    // Official titles from API (compare by trimmed lowercase) - same as PostDetails
    const officialList = this.state.officialRulesAndRegulationsIconsList || [];
    const officialTitlesMap: Record<string, boolean> = {};
    officialList.forEach((i: any) => {
      officialTitlesMap[(i.title || '').trim().toLowerCase()] = true;
    });
    const officialCount = officialList.length;

    const knownRules: any[] = [];
    const otherRules: any[] = [];
    postRules.forEach((item: any) => {
      const titleNorm = (item.title || '').trim().toLowerCase();
      if (officialCount === 0 || officialTitlesMap[titleNorm]) {
        knownRules.push(item);
      } else {
        otherRules.push(item);
      }
    });

    return (
      <View style={{ marginTop: 20 }}>
        <View style={{ flexDirection: 'row', flex: 0.4, marginBottom: 10 }}>
          <Text style={[this.styles.text, { fontWeight: '700' }]}>
            Rules and Regulations
          </Text>
        </View>
        <View style={{ marginTop: 5 }}>
          {knownRules.map((item: any, index: number) => (
            <React.Fragment key={item.id?.toString() || item.title || index.toString()}>
              <View style={{ marginBottom: 8 }}>
                <Text style={[this.styles.text, { lineHeight: 22 }]}>{item.title}</Text>
              </View>
            </React.Fragment>
          ))}
          {otherRules.length > 0 && (
            <>
              <TouchableOpacity
                testID="showMoreRulesBtn"
                onPress={() => this.setState({ showRulesMoreModal: true })}
                style={{ marginTop: 4, marginBottom: 8 }}
              >
                <Text style={[this.styles.text, { color: this.getProfileTheme().primary, fontWeight: '600' }]}>
                  More info
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    );
  };

  closeRulesMoreModal = () => {
    this.setState({ showRulesMoreModal: false });
  };

  renderRulesMoreModal = () => {
    const showRulesMoreModal = this.state.showRulesMoreModal;
    const rulesAndRegulations =
      this.state.userProfileData.rules_and_regulations_icons || [];
    let list: any[] = Array.isArray(rulesAndRegulations)
      ? rulesAndRegulations
      : rulesAndRegulations
        ? [rulesAndRegulations]
        : [];

    const postRules = list.map((item: any) => {
      const title =
        typeof item === 'string'
          ? item
          : item?.title || item?.name || item?.text || '';
      return { ...(typeof item === 'object' ? item : {}), title };
    }).filter((item: any) => item.title);

    const officialList = this.state.officialRulesAndRegulationsIconsList || [];
    const officialTitlesMap: Record<string, boolean> = {};
    officialList.forEach((i: any) => {
      officialTitlesMap[(i.title || '').trim().toLowerCase()] = true;
    });

    const otherRules = postRules.filter(
      (item: any) =>
        !officialTitlesMap[(item.title || '').trim().toLowerCase()],
    );

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
        <View style={[this.styles.rulesModalCenteredView, { backgroundColor: '#33415580' }]}>
          <TouchableWithoutFeedback onPress={this.closeRulesMoreModal}>
            <View style={StyleSheet.absoluteFill} />
          </TouchableWithoutFeedback>
          <View
            style={[
              this.styles.rulesModalView,
              this.styles.rulesModalContent,
              { height: modalMaxHeight },
            ]}
          >
            <View style={this.styles.rulesModalHeader}>
              <Text style={this.styles.rulesModalTitle}>Rules and Regulations</Text>
              <TouchableOpacity
                testID="closeRulesMoreModal"
                onPress={this.closeRulesMoreModal}
              >
                <Feather name="x" size={20} color="#0F172A" />
              </TouchableOpacity>
            </View>
            <ScrollView
              style={this.styles.rulesModalScroll}
              contentContainerStyle={{ paddingBottom: 24 }}
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled={true}
              bounces={true}
            >
              {otherRules.map((item: any, index: number) => (
                <React.Fragment key={item.id?.toString() || index}>
                  <View style={{ marginBottom: 12 }}>
                    <Text style={[this.styles.text, { lineHeight: 22 }]}>
                      {item.title}
                    </Text>
                  </View>
                </React.Fragment>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  renderShowsList = () => {
    return (
      <View testID="showsView">
        <View style={{ marginBottom: 10 }}>
          <FlatList
            testID="showsFlatList"
            data={this.showsData()}
            renderItem={this.renderShows}
            scrollEnabled={false}
            style={{ flexGrow: 0 }}
          />
          {this.getShowsLength() !== 1 && (
            <TouchableOpacity
              testID="toggleShowsExpand"
              onPress={this.toggleShowsExpand}
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
                {this.getShowsLabel()}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  renderPostsList = () => {
    return (
      <>
        <View style={{ marginBottom: 10 }}>
          <FlatList
            testID="postsFlatList"
            data={this.postsData()}
            renderItem={this.renderPosts}
            scrollEnabled={false}
            style={{ flexGrow: 0 }}
          />
          {this.getPostsLength() !== 1 && (
            <TouchableOpacity
              testID="togglePostsExpand"
              onPress={this.togglePostsExpand}
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
                {this.getPostsLabel()}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </>
    );
  };

  renderShows = ({ item }: { item: any }) => {
    const title = (item.event_title || item.band_name || '').toString();
    return (
      <View style={this.styles.eventContainer}>
        <View style={this.styles.compactCard}>
          <TouchableWithoutFeedback
            testID="showDetail"
            onPress={() => this.handleShowDetails(item, item.state)}
          >
            <View style={this.styles.compactCardMain}>
              <FastImage
                style={this.styles.compactThumb}
                source={
                  item.profile_image
                    ? {
                        uri: item.profile_image,
                        priority: FastImage.priority.high,
                      }
                    : require('../../../mobile/assets/images/default_profile.png')
                }
                resizeMode={FastImage.resizeMode.cover}
              />
              <View style={this.styles.compactCardCopy}>
                <Text style={this.styles.compactCardTitle} numberOfLines={1}>
                  {title.toUpperCase()}
                </Text>
                <TouchableOpacity
                  testID="openGoogleMap"
                  style={this.styles.rowFlex}
                  onPress={() => this.openGoogleMaps(item)}
                >
                  <Text style={this.styles.compactCardSubtitle} numberOfLines={1}>
                    {this.getShowCardSubtitle(item)}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
          <TouchableOpacity
            testID="likeShowBtn"
            style={this.styles.compactLikeBtn}
            onPress={() => this.toggleLikeApi(`${item.id}`, 'show')}
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
        <View style={this.styles.likeCommentShare}>
          <View style={this.styles.rowFlex}>
            <TouchableOpacity
              testID="showCommentBubble"
              onPress={() => this.handleShowComments(item.id.toString())}
            >
              <Image
                source={require('../../../mobile/assets/images/image_chat_bubble_outline_24px.png')}
                style={this.styles.actionIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              testID="shareShowBtn"
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
          testID="likeThisShowText"
          onPress={() => {
            this.handleLikeNav(item, 'show');
          }}
          style={this.styles.rowFlex}
        >
          <Text style={this.styles.peopleTxt}>
            {item.likes_count}
            {' people '}
          </Text>
          <Text style={this.styles.likeThisTxt}>like this</Text>
        </TouchableOpacity>
        <View style={this.styles.rowFlex}>
          <Text style={[this.styles.boldTxt, { marginTop: 6 }]}>
            {item.event_title}' {'Concert'}
            <Text style={this.styles.descriptionTxt}>
              {` - ${item.description}`}
            </Text>
          </Text>
        </View>
        <View style={[this.styles.rowFlex, { marginTop: 6 }]}>
          <Text style={[this.styles.boldTxt, { lineHeight: 18 }]}>
            {`${item.comment_count} comments `}
          </Text>
          <TouchableOpacity
            testID="showCommentsBtn"
            onPress={() => {
              this.handleShowComments(`${item.id}`);
            }}
          >
            <Text style={this.styles.seeCommentsTxt}>See the comments</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  renderPosts = ({ item }: { item: any }) => {
    const imageUri = item.images_and_videos?.[0]?.url;
    const title = (item.description || item.band_name || 'Post').toString();
    return (
      <View style={this.styles.eventContainer}>
        <View style={this.styles.compactCard}>
          <TouchableWithoutFeedback
            testID="navigateToPostsDetail"
            onPress={() => this.handlePostDetail(item.id)}
          >
            <View style={this.styles.compactCardMain}>
              <FastImage
                style={this.styles.compactThumb}
                source={
                  imageUri
                    ? {
                        uri: imageUri,
                        priority: FastImage.priority.high,
                      }
                    : require('../../../mobile/assets/images/default_profile.png')
                }
                resizeMode={FastImage.resizeMode.cover}
              />
              <View style={this.styles.compactCardCopy}>
                <Text style={this.styles.compactCardTitle} numberOfLines={1}>
                  {title.toUpperCase()}
                </Text>
                <Text style={this.styles.compactCardSubtitle} numberOfLines={1}>
                  {item.band_name || ''}
                </Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
          <TouchableOpacity
            testID="likePostBtn"
            style={this.styles.compactLikeBtn}
            onPress={() => this.toggleLikeApi(`${item.id}`, 'post')}
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
        <View style={this.styles.likeCommentShare}>
          <View style={this.styles.rowFlex}>
            <TouchableOpacity
              testID="postCommentBubble"
              onPress={() => this.handleShowComments(item.id.toString())}
            >
              <Image
                source={require('../../../mobile/assets/images/image_chat_bubble_outline_24px.png')}
                style={this.styles.actionIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              testID="sharePostBtn"
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
          testID="likeThisPostText"
          onPress={() => {
            this.handleLikeNav(item, 'post');
          }}
          style={this.styles.rowFlex}
        >
          <Text style={this.styles.peopleTxt}>
            {item.likes_count}
            {' people '}
          </Text>
          <Text style={this.styles.likeThisTxt}>like this</Text>
        </TouchableOpacity>
        <View style={this.styles.rowFlex}>
          <Text style={[this.styles.boldTxt, { marginTop: 6 }]}>
            {item.description}
          </Text>
        </View>
        <View style={[this.styles.rowFlex, { marginTop: 6 }]}>
          <Text style={[this.styles.boldTxt, { lineHeight: 18 }]}>
            {`${item.comment_count} comments `}
          </Text>
          <TouchableOpacity
            testID="postCommentsBtn"
            onPress={() => {
              this.handleShowComments(`${item.id}`);
            }}
          >
            <Text style={this.styles.seeCommentsTxt}>See the comments</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  renderShowsPostsComment = ({ item }: { item: ICommentItem }) => {
    return (
      <View style={this.styles.rowFront}>
        <TouchableOpacity
          testID="commentUserProfile"
          style={this.styles.userAvatar}
          onPress={() => {
            this.showProfile(
              `${item.attributes.account.id}`,
              item.attributes.account.account_type,
            );
          }}
        >
          <FastImage
            resizeMode={FastImage.resizeMode.cover}
            style={this.styles.userAvatarImge}
            source={
              item.attributes.profile_image_url
                ? {
                    uri: item.attributes.profile_image_url,
                    priority: FastImage.priority.high,
                  }
                : require('../../../mobile/assets/images/default_profile.png')
            }
          />
        </TouchableOpacity>
        <View style={this.styles.commentContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={this.styles.commenterNameTxt}>
              {`${item.attributes.account.first_name}`}
            </Text>
            <Text
              style={[
                this.styles.commenterNameTxt,
                { fontWeight: '400', marginLeft: 5 },
              ]}
            >
              {this.timeSince(item.attributes.created_at)}
            </Text>
          </View>
          <Text style={this.styles.commentText}>{item.attributes.comment}</Text>
          <TouchableOpacity
            testID="commentReplyButton"
            style={this.styles.replyBtn}
            onPress={() => {
              this.handleReplyPressed(`${item.id}`);
            }}
          >
            <Text style={this.styles.replyBtnText}>Reply</Text>
          </TouchableOpacity>
          {item.attributes.replies.length !== 0 && (
            <TouchableOpacity
              testID="showReplyButton"
              style={this.styles.showReplyButton}
              onPress={() => {
                this.handleShowReplies(item);
              }}
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
            testID="likeCommentsButton"
            onPress={() => {
              this.likeCommentsAPI(item.id.toString());
            }}
          >
            <FontAwesome
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

  renderHiddenShowsPostsComment = (
    data: { item: ICommentItem },
    rowMap: RowMap<ICommentItem>,
  ) => (
    <>
      {this.state.userID === data.item?.attributes?.account_id?.toString() && (
        <View style={this.styles.rowBack}>
          <TouchableOpacity
            testID="editAComment"
            style={[this.styles.backButton, this.styles.backButtonLeft]}
            onPress={() => this.handleEditComment(data.item, rowMap)}
          >
            <Feather name="corner-up-left" size={25} color={'white'} />
          </TouchableOpacity>
          <TouchableOpacity
            testID="deleteAComment"
            style={[this.styles.backButton, this.styles.backButtonRight]}
            onPress={() => {
              this.deleteACommentAPI(`${data.item.id}`);
            }}
          >
            <Feather name="trash" size={25} color={'white'} />
          </TouchableOpacity>
        </View>
      )}
    </>
  );

  renderShowsPostsComments = () => {
    return (
      <>
        {this.state.comments.length ? (
          <View style={this.styles.commentsListsView}>
            <SwipeListView
              alwaysBounceVertical={false}
              testID="commentMainSwipeList"
              alwaysBounceHorizontal={false}
              data={this.state.comments}
              bounces={false}
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
                      renderItem={this.renderShowsPostsComment}
                      renderHiddenItem={this.renderHiddenShowsPostsComment}
                      rightOpenValue={-120}
                      disableRightSwipe
                      listKey={`swipe-${data.item.id}`}
                    />
                  ) : (
                    <SwipeListView
                      bounces={false}
                      alwaysBounceHorizontal={false}
                      testID="commentNonSwipeList"
                      data={[data.item]}
                      alwaysBounceVertical={false}
                      renderHiddenItem={this.renderHiddenShowsPostsComment}
                      renderItem={this.renderShowsPostsComment}
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
              listKey="main"
              rightOpenValue={0}
              disableRightSwipe
              disableLeftSwipe
            />
          </View>
        ) : (
          this.renderNoComments()
        )}
        {this.state.commentsLoading && (
          <View style={this.styles.loadingComments}>
            <ActivityIndicator size="large" color={this.getProfileTheme().primary} />
          </View>
        )}
      </>
    );
  };

  renderNoComments = () => {
    return (
      <View style={this.styles.noComments}>
        <Feather name="message-square" size={60} color="#0F172A" />
        <Text style={this.styles.commentsHeaderTxt}>No comments yet</Text>
        <Text style={this.styles.startComment}>Start the conversation</Text>
      </View>
    );
  };

  renderShowsPostsRepliesModal = () => {
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
              testID="replyModal"
              onPress={() => {
                this.hideKeyboard();
              }}
              style={this.styles.commentsContainer}
            >
              <View style={this.styles.commentsHeadingTxt}>
                <TouchableOpacity
                  testID="replyModalBackButton"
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
                <Text style={this.styles.commentsHeaderTxt}>Replies</Text>
                <TouchableOpacity
                  testID="closeReplyPopupBtn"
                  onPress={this.closeReplyModal}
                >
                  <Feather name="x" size={25} />
                </TouchableOpacity>
              </View>
              <View style={this.styles.separatorView} />
              {this.renderShowsPostsReplies()}
              <View style={this.styles.emojiSelection}>
                {this.defaultEmojisForSelectionStrip.map(
                  (emoji: string, index: number) => (
                    <TouchableOpacity
                      testID={`emojiReply${index}`}
                      key={emoji}
                      onPress={() => {
                        this.handleEmojiSelection(emoji);
                      }}
                    >
                      <Text style={this.styles.emojiSelectionIcon}>{emoji}</Text>
                    </TouchableOpacity>
                  ),
                )}
              </View>
              <View style={this.styles.commentInptContainer}>
                <View style={this.styles.userAvatar}>
                  <FastImage
                    source={
                      this.state.userProfileData.profile_image
                        ? {
                            uri: this.state.userProfileData.profile_image,
                            priority: FastImage.priority.high,
                          }
                        : require('../../../mobile/assets/images/default_profile.png')
                    }
                    style={this.styles.userAvatarImge}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                </View>
                <TextInput
                  testID="replyInput"
                  value={this.state.comment}
                  ref={input => {
                    this.commentTextInput = input;
                  }}
                  onChangeText={commentText =>
                    this.handleCommentChange(commentText)
                  }
                  style={this.styles.commentInpt}
                  placeholder={'Add a reply...'}
                  multiline
                />
                <TouchableOpacity
                  testID="emojiReplyButton"
                  style={this.styles.emojiButton}
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

  renderTAndCUpdateModalPopup = () => {
    return (
      <Modal
        animationType="none"
        statusBarTranslucent={true}
        transparent={true}
        visible={this.state.showTncPopup}
      >
        <View style={this.styles.tNCModalView}>
          <View style={this.styles.tncModal}>
            <View style={this.styles.tNCView}>
              <TouchableWithoutFeedback
                testID="TAndCPopupCloseBtn"
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
              <Text style={this.styles.tNCUpdate}>Terms And Conditions Update</Text>
              <Text style={this.styles.checkThem}>
                We have just updated our terms and conditions. please check them
                out 
              </Text>
              <View style={this.styles.tNCActionButtons}>
                <View style={this.styles.cancelView}>
                  <TouchableOpacity
                    testID="TnCPopupCloseBtn2"
                    onPress={() => {
                      this.closeTnCModalPopup();
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={this.styles.cancelTxt}>Cancel</Text>
                  </TouchableOpacity>
                </View>
                <View style={this.styles.checkoutView}>
                  <TouchableOpacity
                    testID="checkoutTnCbtn"
                    onPress={() => {
                      this.handleTnCUpdateCheckOutModal();
                    }}
                    activeOpacity={0.7}
                    style={this.styles.checkout}
                  >
                    <Text style={this.styles.checkoutTxt}>Check Out</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  renderShowsPostsReplies = () => {
    return (
      <>
        <View style={[this.styles.rowFront, { paddingHorizontal: 20 }]}>
          <TouchableOpacity
            testID="userProfileImage"
            style={this.styles.userAvatar}
            onPress={() =>
              this.showProfile(
                `${this.state.commentWithReply.attributes.account.id}`,
                this.state.commentWithReply.attributes.account.account_type,
              )
            }
          >
            <FastImage
              resizeMode={FastImage.resizeMode.cover}
              source={
                this.state.commentWithReply.attributes.profile_image_url
                  ? {
                      uri: this.state.commentWithReply.attributes
                        .profile_image_url,
                      priority: FastImage.priority.high,
                    }
                  : require('../../../mobile/assets/images/default_profile.png')
              }
              style={this.styles.userAvatarImge}
            />
          </TouchableOpacity>
          <View style={this.styles.commentContainer}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={this.styles.commenterNameTxt}>
                {' '}
                {this.state.commentWithReply.attributes?.account.first_name}
              </Text>
              <Text
                style={[
                  this.styles.commenterNameTxt,
                  { fontWeight: '400', marginLeft: 5 },
                ]}
              >
                {this.timeSince(
                  this.state.commentWithReply.attributes?.created_at,
                )}
              </Text>
            </View>
            <Text style={this.styles.replyTxt}>
              {this.state.commentWithReply.attributes?.comment}
            </Text>
          </View>
        </View>
        <SwipeListView
          bounces={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
          }}
          alwaysBounceVertical={false}
          alwaysBounceHorizontal={false}
          testID="replyMainSwipeList"
          data={this.state.commentWithReply.attributes?.replies}
          renderItem={(data: any) => (
            <View>
              {this.state.userID === data.item.account_id.toString() ? (
                <SwipeListView
                  bounces={false}
                  testID="replySwipeList"
                  data={[data.item]}
                  renderItem={this.renderShowsPostsReplyItem}
                  renderHiddenItem={this.renderHiddenShowsPostsReplyItem}
                  rightOpenValue={-120}
                  alwaysBounceVertical={false}
                  alwaysBounceHorizontal={false}
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
                  renderItem={this.renderShowsPostsReplyItem}
                  renderHiddenItem={this.renderHiddenShowsPostsReplyItem}
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
          <View style={this.styles.loadingComments}>
            <ActivityIndicator size="large" color={this.getProfileTheme().primary} />
          </View>
        )}
      </>
    );
  };

  renderShowsPostsReplyItem = ({ item }: { item: IReplyItem }) => {
    return (
      <View
        style={[
          this.styles.rowFront,
          {
            alignSelf: 'flex-end',
            width: '95%',
          },
        ]}
      >
        <TouchableOpacity
          testID="showProfileBtn"
          style={this.styles.userAvatar}
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
                : require('../../../mobile/assets/images/default_profile.png')
            }
            resizeMode={FastImage.resizeMode.cover}
            style={this.styles.userAvatarImge}
          />
        </TouchableOpacity>
        <View style={this.styles.commentContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={this.styles.commenterNameTxt}> {item.account_name} </Text>
            <Text
              style={[
                this.styles.commenterNameTxt,
                { fontWeight: '400', marginLeft: 5 },
              ]}
            >
              {item.created_at ? this.timeSince(item.created_at) : ''}
            </Text>
          </View>
          <Text style={this.styles.replyTxt}> {item.reply} </Text>
        </View>
      </View>
    );
  };

  renderHiddenShowsPostsReplyItem = (
    data: { item: IReplyItem },
    rowMap: RowMap<IReplyItem>,
  ) => (
    <>
      {this.state.userID === data.item.account_id.toString() && (
        <View style={this.styles.rowBack}>
          <TouchableOpacity
            style={[this.styles.backButton, this.styles.backButtonRight]}
            testID="editReply"
            onPress={() => this.handleEditAReply(data.item, rowMap)}
          >
            <Feather name="corner-up-left" size={25} color={'white'} />
          </TouchableOpacity>
          <TouchableOpacity
            testID="deleteReply"
            onPress={() => {
              this.deleteACommentAPI(`${data.item.id}`);
            }}
            style={[this.styles.backButton, this.styles.backButtonLeft]}
          >
            <Feather name="trash" color={'white'} size={25} />
          </TouchableOpacity>
        </View>
      )}
    </>
  );

  renderContentTabs = () => {
    const active = this.state.profileContentTab;
    return (
      <View style={this.styles.tabsRow}>
        <TouchableOpacity
          testID="showsTab"
          style={[this.styles.tabPill, active === 'shows' && this.styles.tabPillActive]}
          onPress={() => this.setProfileContentTab('shows')}
        >
          <Text
            style={[
              this.styles.tabPillText,
              active === 'shows' && this.styles.tabPillTextActive,
            ]}
          >
            Shows
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          testID="postsTab"
          style={[this.styles.tabPill, active === 'posts' && this.styles.tabPillActive]}
          onPress={() => this.setProfileContentTab('posts')}
        >
          <Text
            style={[
              this.styles.tabPillText,
              active === 'posts' && this.styles.tabPillTextActive,
            ]}
          >
            Posts
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  renderShowsPosts = () => {
    const hasShows =
      this.state.userProfileData.show_list &&
      this.state.userProfileData.show_list.length !== 0;
    const hasPosts =
      this.state.userProfileData.post_list &&
      this.state.userProfileData.post_list.length !== 0;
    if (!hasShows && !hasPosts) {
      return null;
    }
    const active = this.state.profileContentTab;
    return (
      <View ref={this.postViewRef} style={this.styles.contentSection}>
        {this.renderContentTabs()}
        {active === 'posts'
          ? hasPosts
            ? this.renderPostsList()
            : this.renderEmptyTabMessage('No posts yet')
          : hasShows
            ? this.renderShowsList()
            : this.renderEmptyTabMessage('No shows yet')}
      </View>
    );
  };

  renderEmptyTabMessage = (message: string) => {
    return (
      <Text style={this.styles.emptyTabText}>{message}</Text>
    );
  };

  formatBusinessTime = (time: string) => {
    if (!time || typeof time !== 'string') return '';
    const normalized = time.trim();
    if (normalized === '') return '';
    if (/[AaPp][Mm]/.test(normalized)) return normalized.toUpperCase();

    const formatFromHoursAndMinutes = (
      hoursRaw: string,
      minutesRaw: string,
    ) => {
      const hours24 = parseInt(hoursRaw, 10);
      if (isNaN(hours24)) return normalized;
      const suffix = hours24 >= 12 ? 'PM' : 'AM';
      const hours12 = hours24 % 12 || 12;
      return `${hours12}:${minutesRaw} ${suffix}`;
    };

    // Handles plain times like "23:00" or "23:00:00"
    const plainTimeMatch = normalized.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
    if (plainTimeMatch) {
      return formatFromHoursAndMinutes(plainTimeMatch[1], plainTimeMatch[2]);
    }

    // Handles ISO datetime like "2000-01-01T23:00:00.000+00:00"
    const isoTimeMatch = normalized.match(/T(\d{2}):(\d{2})(?::\d{2})?/);
    if (isoTimeMatch) {
      return formatFromHoursAndMinutes(isoTimeMatch[1], isoTimeMatch[2]);
    }

    return normalized;
  };

  renderBusinessHours = () => {
    const businessDaysRaw = this.state.userProfileData.business_days;
    const businessDays = Array.isArray(businessDaysRaw)
      ? businessDaysRaw
          .filter((day: string) => typeof day === 'string' && day.trim() !== '')
          .map((day: string) => day.charAt(0).toUpperCase() + day.slice(1))
      : [];
    const openTime = this.formatBusinessTime(this.state.userProfileData.open_time);
    const closeTime = this.formatBusinessTime(
      this.state.userProfileData.close_time,
    );

    if (businessDays.length === 0 && !openTime && !closeTime) {
      return null;
    }

    return (
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
          Business Hours
        </Text>
        <View style={{ flex: 0.5 }}>
          {businessDays.length > 0 && (
            <Text style={{ fontSize: 16, fontWeight: '400', color: this.getProfileTheme().foreground }}>
              {businessDays.join(', ')}
            </Text>
          )}
          {(openTime || closeTime) && (
            <Text style={{ fontSize: 16, fontWeight: '400', color: this.getProfileTheme().foreground }}>
              {openTime && closeTime
                ? `${openTime} - ${closeTime}`
                : openTime || closeTime}
            </Text>
          )}
        </View>
      </View>
    );
  };

  renderWebsiteSocialMedia = () => {
    return (
      <>
        {this.state.userProfileData.hasOwnProperty('official_website') &&
          this.state.userProfileData.official_website !== 'undefined' &&
          this.state.userProfileData.official_website !== '' &&
          this.renderOfficialWebsite()}
        {this.state.userProfileData.social_media &&
          (this.state.userProfileData.social_media.instagram !== 'undefined' ||
            this.state.userProfileData.social_media.facebook !== 'undefined' ||
            this.state.userProfileData.social_media.linkedin !== 'undefined') &&
          this.renderSocialMedia()}
      </>
    );
  };

  renderEmoji = () => {
    return (
      <View style={this.styles.emojiSelection}>
        {this.defaultEmojisForSelectionStrip.map((emoji: string, index) => (
          <TouchableOpacity
            testID={`emojiReply${index}c`}
            key={emoji}
            onPress={() => this.handleEmojiSelection(emoji)}
          >
            <Text style={this.styles.emojiSelectionIcon}>{emoji}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  renderCommentsInput = () => {
    return (
      <View style={this.styles.commentInptContainer}>
        <View style={this.styles.userAvatar}>
          <FastImage
            source={
              this.state.userProfileData.profile_image
                ? {
                    uri: this.state.userProfileData.profile_image,
                    priority: FastImage.priority.high,
                  }
                : require('../../../mobile/assets/images/default_profile.png')
            }
            style={this.styles.userAvatarImge}
            resizeMode={FastImage.resizeMode.cover}
          />
        </View>
        <TextInput
          testID="commentTextInput"
          ref={input => (this.commentTextInput = input)}
          placeholder={
            this.state.replying ? 'Add a reply...' : 'Add a comment...'
          }
          value={this.state.comment}
          multiline
          style={this.styles.commentInpt}
          onChangeText={commentText => {
            this.handleCommentChange(commentText);
          }}
        />
        <TouchableOpacity
          testID="emojiCommentBtn"
          style={this.styles.emojiButton}
          onPress={() => {
            this.handleSubmit();
          }}
        >
          <MCommunityIcons name="send" color="#64748B" size={30} />
        </TouchableOpacity>
      </View>
    );
  };

  renderCommentsHeading = () => {
    return (
      <View style={this.styles.commentsHeadingTxt}>
        <Text style={this.styles.commentsHeaderTxt}>Comments</Text>
        <TouchableOpacity
          onPress={this.handleCloseCommentsModal}
          testID="closeCommentsModalButton"
        >
          <Feather name="x" size={25} />
        </TouchableOpacity>
      </View>
    );
  };
  // Customizable Area End

  render() {
    // Customizable Area Start
    // Merge Engine - render - Start
    return (
      <ScrollView
        testID="scrollView"
        keyboardShouldPersistTaps="always"
        style={this.styles.container}
        ref={this.scrollViewRef}
        contentInsetAdjustmentBehavior="never"
      >
        <StatusBar
          backgroundColor={this.getProfileTheme().background}
          barStyle="light-content"
        />
        <TouchableWithoutFeedback
          testID="containerView"
          onPress={() => this.hideKeyboard()}
        >
          <View>
            {this.renderCoverAndProfilePhoto()}
            <View style={this.styles.profileBody}>
              {this.renderProfileIdentity()}
              {this.renderPostsFollowersFollowings()}
              {this.state.userProfileData.category_subcat &&
                this.renderCategory()}
              {this.state.userProfileData.category_subcat &&
                this.renderMusicType()}
              {this.renderVenueAddressAndZip()}
              {this.renderBio()}
              {this.state.userProfileData.influences && this.renderInfluences()}
              {this.state.userProfileData.affiliates && this.renderAffiliates()}
              {this.renderRosters()}
              {this.state.userProfileData.rules_and_regulations_icons &&
                this.state.userProfileData.rules_and_regulations_icons.length >
                  0 &&
                this.renderRulesAndRegulations()}

              {!this.isViewingOwnProfile() && (
                <TouchableOpacity
                  testID="editProfileBtn"
                  style={this.styles.contactUsButton}
                  onPress={this.navigateToChatScreen}
                >
                  <Text style={this.styles.editProfileButtonText}>Contact us</Text>
                </TouchableOpacity>
              )}

              {this.renderShowsPosts()}
            </View>
            <Modal
              animationType="none"
              visible={this.state.commentModalOpen}
              transparent={true}
            >
              <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={this.isPlatformiOS() ? 'padding' : undefined}
              >
                <View style={this.styles.commentsModalParentView}>
                  <TouchableOpacity
                    testID="commentModal"
                    activeOpacity={1}
                    onPress={() => this.hideKeyboard()}
                    style={this.styles.commentsContainer}
                  >
                    {this.renderCommentsHeading()}
                    <View style={this.styles.separatorView} />
                    {this.state.isLoadingComments ? (
                      <View style={this.styles.noComments}>
                        <ActivityIndicator size="large" color={this.getProfileTheme().primary} />
                      </View>
                    ) : (
                      <this.renderShowsPostsComments />
                    )}
                    {this.renderEmoji()}
                    {this.renderCommentsInput()}
                  </TouchableOpacity>
                </View>
              </KeyboardAvoidingView>
            </Modal>
            {this.renderShowsPostsRepliesModal}
            {this.renderTAndCUpdateModalPopup()}
            {this.renderRulesMoreModal()}
          </View>
        </TouchableWithoutFeedback>
        {this.state.isPageLoading && (
          <View style={this.styles.loadingContainer}>
            <ActivityIndicator size={'large'} color={this.getProfileTheme().primary} />
          </View>
        )}
      </ScrollView>
    );
    // Merge Engine - render - End
    // Customizable Area End
  }
}

// Customizable Area Start
const BANNER_HEIGHT = Math.round(Dimensions.get('window').height * 0.28);
const BANNER_FADE_HEIGHT = 96;

const createProfileStyles = (theme: typeof redesignTheme) =>
  StyleSheet.create({
  container: {
    flex: 1,
    maxWidth: 650,
    backgroundColor: theme.background,
  },
  profileBody: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    backgroundColor: theme.background,
  },
  heroWrap: {
    backgroundColor: theme.background,
    marginBottom: 8,
  },
  bannerWrap: {
    width: '100%',
    height: BANNER_HEIGHT,
    backgroundColor: theme.input,
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: BANNER_HEIGHT,
  },
  bannerBottomFade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: BANNER_FADE_HEIGHT,
  },
  bannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  bannerOverlayInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 8,
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
  overlayBackIcon: {
    width: 12,
    height: 12,
    resizeMode: 'contain',
    tintColor: '#FFFFFF',
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
  socialRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: 12,
  },
  socialChip: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 14,
    marginBottom: 8,
    maxWidth: '100%',
  },
  socialChipText: {
    color: theme.muted,
    fontSize: 13,
    marginLeft: 6,
    flexShrink: 1,
  },
  infoBlock: {
    marginVertical: 8,
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.foreground,
    marginBottom: 6,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '400',
    color: theme.muted,
    lineHeight: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
    width: '100%',
    paddingTop: 5,
  },
  headerSideSpacer: {
    width: 40,
    height: 40,
    marginLeft: 16,
  },
  backArrowIconContainer: {
    marginLeft: 16,
  },
  headerIconBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
  },
  backArrowIcon: {
    width: 12,
    left: 0,
    resizeMode: 'contain',
  },
  headerTitleTxt: {
    fontWeight: '700',
    fontSize: 24,
    color: theme.foreground,
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
  },
  txt: {
    fontFamily: 'OpenSans',
    color: theme.foreground,
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  notificationIconContainer: {
    width: 25,
    height: 25,
    marginRight: 10,
    justifyContent: 'center',
  },
  notificationIcon: {
    width: 25,
    height: 25,
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
    backgroundColor: theme.primary,
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
    backgroundColor: theme.primary,
  },
  hamburgerIcon: {
    width: 22,
    aspectRatio: 1,
    resizeMode: 'contain',
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
    borderRadius: 43,
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
  statsText: {
    textAlign: 'center',
  },
  divider: {
    width: 1,
    alignSelf: 'stretch',
    backgroundColor: theme.divider,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(8, 8, 15, 0.72)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  influencesFlatlist: {
    flex: 1,
    flexWrap: 'wrap',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
    marginLeft: 12,
  },
  actionBtn: {
    backgroundColor: theme.primary,
    minWidth: 88,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginLeft: 8,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
    textAlign: 'center',
  },
  msgBtn: {
    backgroundColor: theme.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.border,
  },
  msgBtnText: {
    color: theme.foreground,
    fontWeight: '700',
    fontSize: 13,
    textAlign: 'center',
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
  contactUsButton: {
    backgroundColor: theme.primary,
    paddingVertical: 14,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 8,
    marginBottom: 16,
  },
  tabsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 12,
  },
  tabPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: theme.tabInactive,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.border,
    marginRight: 8,
  },
  tabPillActive: {
    backgroundColor: theme.tabActive,
    borderColor: theme.tabActive,
  },
  tabPillText: {
    color: theme.tabInactiveText,
    fontSize: 13,
    fontWeight: '700',
  },
  tabPillTextActive: {
    color: theme.tabActiveText,
  },
  hiddenTabPanel: {
    height: 0,
    overflow: 'hidden',
    opacity: 0,
  },
  emptyTabText: {
    color: theme.muted,
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 24,
  },
  contentSection: {
    marginTop: 8,
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
  horizontalView: {
    height: 1,
    width: '100%',
    backgroundColor: theme.card,
    alignSelf: 'center',
  },
  preferenceHeading: {
    fontSize: 18,
    fontFamily: 'OpenSans',
    color: theme.primary,
    fontWeight: 'bold',
    marginHorizontal: '5%',
    marginVertical: 20,
  },
  eventContainer: {
    flexDirection: 'column',
    width: '100%',
    padding: 0,
    paddingVertical: 8,
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
  peopleTxt: {
    fontWeight: '700',
    color: theme.primary,
  },
  rowFlex: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  bandProfileImage: {
    borderRadius: 50,
    width: 50,
    height: 50,
  },
  boldTxt: {
    fontWeight: '700',
    fontSize: 14,
    lineHeight: 22,
    color: theme.foreground,
  },
  locationPinIcon: {
    tintColor: theme.primary,
    marginRight: 5,
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  eventImgContainer: {
    marginTop: 10,
    position: 'relative',
  },
  eventImg: {
    width: '100%',
    height: 200,
  },
  monthTxt: {
    fontWeight: '400',
    fontSize: 20,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  likeCommentShare: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  like: {
    tintColor: theme.primary,
    height: 20,
    width: 22,
  },
  likeThisTxt: {
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 22,
    color: theme.foreground,
  },
  descriptionTxt: {
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 22,
    color: theme.foreground,
  },
  seeCommentsTxt: {
    color: theme.primary,
    fontWeight: '400',
    lineHeight: 18,
    fontSize: 14,
    marginLeft: 5,
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
  commentsModalParentView: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#33415580',
  },
  commentsContainer: {
    height: '75%',
    justifyContent: 'flex-start',
    backgroundColor: theme.card,
    borderTopLeftRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  commentsHeadingTxt: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  commentsHeaderTxt: {
    fontWeight: 'bold',
    fontSize: 24,
    color: theme.foreground,
  },
  separatorView: {
    height: 1,
    width: '100%',
    backgroundColor: theme.card,
    marginVertical: 15,
  },
  noComments: {
    alignItems: 'center',
    paddingVertical: 16,
    flex: 1,
    justifyContent: 'center',
  },
  startComment: {
    marginTop: 5,
  },
  commentsListsView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emojiSelection: {
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 40,
    flexDirection: 'row',
  },
  emojiSelectionIcon: {
    fontSize: 20,
  },
  commentInptContainer: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    marginHorizontal: 20,
  },
  userAvatarImge: {
    width: 40,
    height: 40,
    borderRadius: 75,
  },
  userAvatar: {
    backgroundColor: theme.card,
    width: 42,
    borderWidth: 1,
    borderColor: theme.border,
    marginRight: 10,
    height: 42,
    borderRadius: 80,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  commentInpt: {
    flex: 1,
    borderWidth: 1,
    paddingRight: 50,
    paddingTop: 12,
    height: '100%',
    fontSize: 16,
    borderColor: theme.border,
    borderRadius: 10,
    paddingHorizontal: 10,
    textAlignVertical: 'center',
    color: theme.foreground,
    backgroundColor: theme.input,
  },
  emojiButton: {
    height: 30,
    width: 30,
    position: 'absolute',
    right: 10,
  },
  emojiButtonIcon: {
    resizeMode: 'contain',
    width: 30,
    height: 30,
  },
  rowBack: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
    flexDirection: 'row',
  },
  rowFront: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: theme.card,
    flexDirection: 'row',
    marginVertical: 10,
    justifyContent: 'space-between',
    paddingRight: 5,
  },
  backButton: {
    position: 'absolute',
    top: 0,
    width: 60,
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
  },
  backButtonLeft: {
    right: 60,
    backgroundColor: '#33415580',
  },
  backButtonRight: {
    right: 0,
    backgroundColor: '#DC2626',
  },
  commentContainer: {
    flex: 1,
  },
  commenterNameTxt: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.foreground,
  },
  commentText: {
    fontSize: 14,
    color: theme.foreground,
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
  showReplyButton: {
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
  replyTxt: {
    marginTop: 10,
  },
  tncModal: {
    backgroundColor: theme.card,
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
  loadingComments: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tNCModalView: {
    flex: 1,
    backgroundColor: 'rgba(51, 65, 85, 0.5)',
    justifyContent: 'flex-end',
  },
  tNCView: {
    padding: 20,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  rulesModalCenteredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rulesModalView: {
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
  rulesModalContent: {
    alignItems: 'stretch',
    padding: 24,
  },
  rulesModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  rulesModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.foreground,
  },
  rulesModalScroll: {
    flex: 1,
    minHeight: 0,
    marginBottom: 0,
  },
  tNCUpdate: {
    color: theme.foreground,
    fontSize: 24,
    fontWeight: '700',
    paddingLeft: 24,
  },
  checkThem: {
    paddingHorizontal: 24,
    color: theme.foreground,
    fontWeight: '400',
    marginTop: 8,
    fontSize: 16,
  },
  tNCActionButtons: {
    flex: 1,
    paddingHorizontal: 25,
    paddingBottom: 32,
    justifyContent: 'flex-end',
  },
  cancelView: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelTxt: {
    color: '#3333CC',
    fontSize: 16,
    fontWeight: '700',
  },
  checkoutView: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkout: {
    paddingVertical: 16,
    backgroundColor: '#3333CC',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginTop: 24,
  },
  checkoutTxt: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  text: {
    fontFamily: 'OpenSans',
    color: theme.foreground,
  },
  editProfileButton: {
    backgroundColor: '#3333CC',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 0,
    marginBottom: 20,
  },
  editProfileButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  editButton: {
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  editButtonText: {
    color: theme.primary,
    fontWeight: '400',
    fontSize: 16,
  },
});

const darkProfileStyles = createProfileStyles(redesignTheme);
const lightProfileStyles = createProfileStyles(lightTheme);
// Customizable Area End

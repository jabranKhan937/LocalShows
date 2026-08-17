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
import { notificationIcon } from '../../search/src/assets';
import { colors } from '../../utilities/src/Colors';
import { backButtonIcon, leftArrow } from '../../events/src/assets';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FastImage from '../../../components/src/SafeFastImage';
import Feather from 'react-native-vector-icons/Feather';
import MCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { RowMap, SwipeListView } from 'react-native-swipe-list-view';
import { DrawerActions } from '@react-navigation/native';
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
import { deviceWidth } from '../../../framework/src/Utilities';
import { defaultProfile } from '../../../blocks/user-profile-basic/src/assets';

export default class Customisableuserprofiles2 extends Customisableuserprofiles2Controller {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }

  // Customizable Area Start
  renderNotificationIndicator = () => {
    const count = this.state.unreadNotificationCount || 0;
    if (count > 0) {
      const displayCount = count > 99 ? '99+' : `${count}`;
      return (
        <View style={styles.notificationBadge}>
          <Text style={styles.notificationBadgeText}>{displayCount}</Text>
        </View>
      );
    }

    return this.renderRedDot({ condition: this.state.newNotification });
  };

  renderRedDot = ({ condition }: { condition: boolean }) => {
    if (condition) {
      return <View style={styles.redDot} />;
    }

    return <></>;
  };

  renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <Text style={[styles.txt, styles.headerTitleTxt]} pointerEvents="none">
          Profile
        </Text>
        <TouchableOpacity
          testID="navigationBackButton"
          style={styles.headerIconBtn}
          onPress={this.handleBackButton}
        >
          <Image source={backButtonIcon} />
        </TouchableOpacity>

        <View style={styles.iconsContainer}>
          <TouchableOpacity
            testID="notificationIcon"
            style={styles.notificationIconContainer}
            onPress={this.navigateToNotifications}
          >
            <View style={styles.notificationWrapper}>
              <Image
                source={notificationIcon}
                style={styles.notificationIcon}
              />
              {this.renderNotificationIndicator()}
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            testID="hamburgerMenu"
            onPress={() => {
              // Traverse up the navigation tree to find the drawer navigator
              let navigator = this.props.navigation;
              let drawerFound = false;

              // Keep going up through parent navigators until we find one with openDrawer
              while (navigator) {
                if (navigator.openDrawer) {
                  navigator.openDrawer();
                  drawerFound = true;
                  break;
                }
                navigator = navigator.getParent?.();
              }

              // If no drawer found, dispatch the action directly
              if (!drawerFound) {
                this.props.navigation.dispatch(DrawerActions.openDrawer());
              }
            }}
          >
            <Image
              style={{ height: 20, width: 20, resizeMode: 'contain' }}
              source={require('../../../mobile/assets/images/Vector.png')}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  renderCoverAndProfilePhoto = () => {
    return (
      <View
        style={{
          borderBottomRightRadius: 40,
          backgroundColor: '#090966',
          height: deviceWidth - 20,
          width: '100%',
          marginTop: 10,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View
          style={{
            flex: 1,
            height: deviceWidth - 20,
            width: '100%',
          }}
        >
          <FastImage
            source={{
              uri: this.state.userProfileData.cover_photo,
              priority: FastImage.priority.high,
            }}
            style={{
              borderBottomRightRadius: 40,
              backgroundColor: '#090966',
              height: deviceWidth - 20,
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          />
        </View>
        <View style={{ position: 'absolute' }}>
          <View style={styles.profileImageContainer}>
            <FastImage
              source={
                this.state.userProfileData.profile_image
                  ? {
                      uri: this.state.userProfileData.profile_image,
                      priority: FastImage.priority.high,
                    }
                  : require('../../../mobile/assets/images/default_profile.png')
              }
              style={styles.profileImage}
              resizeMode={FastImage.resizeMode.cover}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                marginVertical: 16,
                textAlign: 'center',
                textAlignVertical: 'center',
                color: '#FFFFFF',
                fontSize: 30,
                fontWeight: '700',
                marginRight: 10,
              }}
            >
              {this.state.userProfileData.first_name}
            </Text>
            {this.state.userProfileData.is_verified_user && (
              <Image
                source={require('../../../mobile/assets/images/check_green_circle.png')}
                style={{ width: 20, height: 20, resizeMode: 'contain' }}
              />
            )}
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Image
              source={require('../../../mobile/assets/images/location_on.png')}
              style={{
                width: 20,
                height: 20,
                marginRight: 10,
                resizeMode: 'contain',
                tintColor: '#FFFFFF',
              }}
            />
            <Text
              style={{
                textAlign: 'center',
                textAlignVertical: 'center',
                color: '#FFFFFF',
                fontSize: 16,
                fontWeight: '400',
              }}
            >
              {this.state.userProfileData.state !== ''
                ? `${this.state.userProfileData.city}, ${this.state.userProfileData.state}`
                : `${this.state.userProfileData.country}`}
            </Text>
          </View>

          {this.isViewingOwnProfile() === false && (
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity
                testID="follow"
                style={styles.actionBtn}
                onPress={this.handleFollowUserApi}
              >
                <Text style={[styles.txt, styles.actionBtnText]}>
                  {this.state.userProfileData.follow ? 'Unfollow' : 'Follow'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                testID="message"
                style={[styles.actionBtn, styles.msgBtn]}
                onPress={this.navigateToChatScreen}
              >
                <Text style={[styles.txt, styles.msgBtn, { width: '100%' }]}>
                  Message
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

  renderPostsFollowersFollowings = () => {
    return (
      <View style={styles.statsContainer}>
        <TouchableOpacity
          testID="postsCount"
          activeOpacity={1}
          onPress={() =>
            this.state.userProfileData.show_list &&
            this.state.userProfileData.show_list.length !== 0 &&
            this.scrollToPosts()
          }
        >
          <Text style={[styles.txt, styles.statsText]}>
            {`${this.state.userProfileData.shows_count}\nShows`}
          </Text>
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity
          testID="postsCount"
          activeOpacity={1}
          onPress={() =>
            this.state.userProfileData.show_list &&
            this.state.userProfileData.show_list.length !== 0 &&
            this.scrollToPosts()
          }
        >
          <Text style={[styles.txt, styles.statsText]}>
            {`${this.state.userProfileData?.post_list?.length}\nPosts`}
          </Text>
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity
          testID="followersCount"
          activeOpacity={1}
          onPress={() => this.handleFollowerFollowingsNavigation('followers')}
        >
          <Text style={[styles.txt, styles.statsText]}>
            {`${this.state.userProfileData.followers}\nFollowers`}
          </Text>
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity
          testID="followingCount"
          activeOpacity={1}
          onPress={() => this.handleFollowerFollowingsNavigation('following')}
        >
          <Text style={[styles.txt, styles.statsText]}>
            {`${this.state.userProfileData.following}\nFollowing`}
          </Text>
        </TouchableOpacity>
        {/* {this.state.loadedProfileID !== null &&
          this.state.loadedProfileID == this.state.userID && (
            <>
              <View style={styles.divider} />
              <TouchableOpacity
                testID="blocked"
                onPress={this.goToBlockedUserScreen}
              >
                <Text style={[styles.text, styles.statsText]}>
                  {`${this.state.userProfileData.blocked_user}\nBlocked`}
                </Text>
              </TouchableOpacity>
            </>
          )} */}
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
                color: '#334155',
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
                        color: '#334155',
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
                  style={styles.editButton}
                  onPress={this.navigateToCategoriesSubCategories}
                >
                  <Text style={styles.editButtonText}>Edit</Text>
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
                color: '#334155',
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
                          color: '#334155',
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
            color: '#334155',
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
            color: '#4949EE',
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
              color: '#334155',
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
                <Feather name="instagram" size={20} color={'#4949EE'} />
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
                <FontAwesome name="facebook" size={20} color={'#4949EE'} />
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
                  color={'#4949EE'}
                />
              </TouchableOpacity>
            )}
        </View>
      </View>
    );
  };

  renderBio = () => {
    return (
      <>
        {(this.state.userProfileData.bio !== '' ||
          this.state.userProfileData.email) && (
          <>
            {this.state.userProfileData.bio !== '' && (
              <View style={{ marginVertical: 5 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '700',
                    color: '#334155',
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
                    color: '#334155',
                    lineHeight: 22,
                  }}
                >
                  {this.state.userProfileData.bio}
                </Text>
              </View>
            )}

            {this.state.userProfileData.email && this.isViewingOwnProfile() && (
              <View style={{ marginVertical: 5 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '700',
                    color: '#334155',
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
                    color: '#334155',
                    lineHeight: 22,
                  }}
                >
                  {this.state.userProfileData.email}
                </Text>
              </View>
            )}
            {this.renderBusinessHours()}
          </>
        )}
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
                color: '#334155',
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
                contentContainerStyle={styles.influencesFlatlist}
                keyExtractor={(item: any) => item}
                renderItem={({ item, index }) => {
                  return (
                    <>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: '400',
                          color: '#334155',
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
                color: '#334155',
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
                contentContainerStyle={styles.influencesFlatlist}
                keyExtractor={(item: any) => item}
                renderItem={({ item, index }) => {
                  return (
                    <>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: '400',
                          color: '#334155',
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
      color: '#334155',
    };
    const rowValueStyle = {
      flex: 0.5,
      fontSize: 16,
      fontWeight: '400' as const,
      color: '#334155',
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
            color: '#334155',
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
            contentContainerStyle={styles.influencesFlatlist}
            keyExtractor={(item: string, index: number) =>
              `roster-${index}-${item}`
            }
            renderItem={({ item, index }) => (
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '400',
                  color: '#334155',
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
          <Text style={[styles.text, { fontWeight: '700' }]}>
            Rules and Regulations
          </Text>
        </View>
        <View style={{ marginTop: 5 }}>
          {knownRules.map((item: any, index: number) => (
            <React.Fragment key={item.id?.toString() || item.title || index.toString()}>
              <View style={{ marginBottom: 8 }}>
                <Text style={[styles.text, { lineHeight: 22 }]}>{item.title}</Text>
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
                <Text style={[styles.text, { color: '#4949EE', fontWeight: '600' }]}>
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
        <View style={[styles.rulesModalCenteredView, { backgroundColor: '#33415580' }]}>
          <TouchableWithoutFeedback onPress={this.closeRulesMoreModal}>
            <View style={StyleSheet.absoluteFill} />
          </TouchableWithoutFeedback>
          <View
            style={[
              styles.rulesModalView,
              styles.rulesModalContent,
              { height: modalMaxHeight },
            ]}
          >
            <View style={styles.rulesModalHeader}>
              <Text style={styles.rulesModalTitle}>Rules and Regulations</Text>
              <TouchableOpacity
                testID="closeRulesMoreModal"
                onPress={this.closeRulesMoreModal}
              >
                <Feather name="x" size={20} color="#0F172A" />
              </TouchableOpacity>
            </View>
            <ScrollView
              style={styles.rulesModalScroll}
              contentContainerStyle={{ paddingBottom: 24 }}
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled={true}
              bounces={true}
            >
              {otherRules.map((item: any, index: number) => (
                <React.Fragment key={item.id?.toString() || index}>
                  <View style={{ marginBottom: 12 }}>
                    <Text style={[styles.text, { lineHeight: 22 }]}>
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
      <View testID="showsView" ref={this.postViewRef}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: '700',
            color: '#334155',
            marginVertical: 5,
          }}
        >
          Shows
        </Text>
        <View style={styles.horizontalView} />
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
                  styles.preferenceHeading,
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
        <Text
          style={{
            fontSize: 16,
            fontWeight: '700',
            color: '#334155',
            marginVertical: 5,
          }}
        >
          Posts
        </Text>
        <View style={styles.horizontalView} />
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
                  styles.preferenceHeading,
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
    return (
      <View style={styles.eventContainer}>
        {item.date_of_the_show === '2999-12-31' ? (
          <Text style={styles.month}>{'Undefined Date'}</Text>
        ) : (
          <Text style={styles.month}>
            {this.getFormattedFullMonth(item.date_of_the_show)}
            <Text style={styles.date}>
              {' '}
              {this.getFullDate(item.date_of_the_show)}
            </Text>
          </Text>
        )}
        <View
          style={[
            styles.rowFlex,
            {
              width: '100%',
            },
          ]}
        >
          <FastImage
            style={styles.bandProfileImage}
            source={
              item.band_profile_image
                ? {
                    uri: item.band_profile_image,
                    priority: FastImage.priority.high,
                  }
                : require('../../../mobile/assets/images/default_profile.png')
            }
          />
          <View
            style={{
              marginLeft: 10,
            }}
          >
            <Text style={styles.boldTxt}>{item.band_name}</Text>
            <TouchableOpacity
              testID="openGoogleMap"
              style={styles.rowFlex}
              onPress={() => this.openGoogleMaps(item)}
            >
              <View style={styles.location}>
                <Image
                  source={require('../../../mobile/assets/images/location-pin.png')}
                  style={styles.locationPinIcon}
                />
                <Text style={{ color: '#334166' }}>{item.location} </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableWithoutFeedback
          testID="showDetail"
          onPress={() => this.handleShowDetails(item, item.state)}
        >
          <View style={styles.eventImgContainer}>
            <FastImage
              style={styles.eventImg}
              source={{
                uri: item.profile_image,
                priority: FastImage.priority.high,
              }}
              resizeMode={FastImage.resizeMode.contain}
            />

            <View style={styles.dateBanner}>
              <Text style={styles.monthTxt}>
                {this.formatMonth(item.date_of_the_show)}
              </Text>
              <Text
                style={[
                  styles.monthTxt,
                  {
                    fontWeight: '700',
                  },
                ]}
              >
                {this.formatDate(item.date_of_the_show)}
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
        <View style={styles.likeCommentShare}>
          <View style={styles.rowFlex}>
            <TouchableOpacity
              testID="likeShowBtn"
              onPress={() => this.toggleLikeApi(`${item.id}`, 'show')}
            >
              {item.like_by_me ? (
                <Image
                  style={styles.like}
                  source={require('../../../mobile/assets/images/favourite_filled.png')}
                />
              ) : (
                <Image
                  style={styles.like}
                  source={require('../../../mobile/assets/images/image_favorite.png')}
                />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              testID="showCommentBubble"
              onPress={() => this.handleShowComments(item.id.toString())}
            >
              <Image
                source={require('../../../mobile/assets/images/image_chat_bubble_outline_24px.png')}
                style={{
                  marginLeft: 5,
                }}
              />
            </TouchableOpacity>

            <TouchableOpacity
              testID="shareShowBtn"
              onPress={() => this.handleShareEvent(`${item.id}`, item.type)}
            >
              <Image
                source={require('../../../mobile/assets/images/image_share_24px.png')}
                style={{
                  marginLeft: 5,
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          testID="likeThisShowText"
          onPress={() => {
            this.handleLikeNav(item, 'show');
          }}
          style={styles.rowFlex}
        >
          <Text style={styles.peopleTxt}>
            {item.likes_count}
            {' people '}
          </Text>
          <Text style={styles.likeThisTxt}>like this</Text>
        </TouchableOpacity>
        <View style={styles.rowFlex}>
          <Text style={[styles.boldTxt, { marginTop: 6 }]}>
            {item.event_title}' {'Concert'}
            <Text style={styles.descriptionTxt}>
              {` - ${item.description}`}
            </Text>
          </Text>
        </View>
        <View style={[styles.rowFlex, { marginTop: 6 }]}>
          <Text style={[styles.boldTxt, { lineHeight: 18 }]}>
            {`${item.comment_count} comments `}
          </Text>
          <TouchableOpacity
            testID="showCommentsBtn"
            onPress={() => {
              this.handleShowComments(`${item.id}`);
            }}
          >
            <Text style={styles.seeCommentsTxt}>See the comments</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  renderPosts = ({ item }: { item: any }) => {
    return (
      <View style={styles.eventContainer}>
        <Text style={styles.month}>
          {this.getFormattedFullMonth(item.created_at)}
          <Text style={styles.date}> {this.getFullDate(item.created_at)}</Text>
        </Text>
        <View
          style={[
            styles.rowFlex,
            {
              width: '100%',
            },
          ]}
        >
          <FastImage
            style={styles.bandProfileImage}
            source={
              item.band_profile_image
                ? {
                    uri: item.band_profile_image,
                    priority: FastImage.priority.high,
                  }
                : require('../../../mobile/assets/images/default_profile.png')
            }
          />
          <View
            style={{
              marginLeft: 10,
            }}
          >
            <Text style={styles.boldTxt}>{item.band_name}</Text>
          </View>
        </View>
        <TouchableWithoutFeedback
          testID="navigateToPostsDetail"
          onPress={() => this.handlePostDetail(item.id)}
        >
          <View style={styles.eventImgContainer}>
            <FastImage
              style={styles.eventImg}
              source={{
                uri: item.images_and_videos[0].url,
                priority: FastImage.priority.high,
              }}
              resizeMode={FastImage.resizeMode.contain}
            />
            {/* <View style={styles.dateBanner}>
              <Text style={styles.monthTxt}>
                {this.formatMonth(item.created_at)}
              </Text>
              <Text
                style={[
                  styles.monthTxt,
                  {
                    fontWeight: "700",
                  },
                ]}
              >
                {this.formatDate(item.created_at)}
              </Text>
            </View> */}
          </View>
        </TouchableWithoutFeedback>
        <View style={styles.likeCommentShare}>
          <View style={styles.rowFlex}>
            <TouchableOpacity
              testID="likePostBtn"
              onPress={() => this.toggleLikeApi(`${item.id}`, 'post')}
            >
              {item.like_by_me ? (
                <Image
                  style={styles.like}
                  source={require('../../../mobile/assets/images/favourite_filled.png')}
                />
              ) : (
                <Image
                  style={styles.like}
                  source={require('../../../mobile/assets/images/image_favorite.png')}
                />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              testID="postCommentBubble"
              onPress={() => this.handleShowComments(item.id.toString())}
            >
              <Image
                source={require('../../../mobile/assets/images/image_chat_bubble_outline_24px.png')}
                style={{
                  marginLeft: 5,
                }}
              />
            </TouchableOpacity>

            <TouchableOpacity
              testID="sharePostBtn"
              onPress={() => this.handleShareEvent(`${item.id}`, item.type)}
            >
              <Image
                source={require('../../../mobile/assets/images/image_share_24px.png')}
                style={{
                  marginLeft: 5,
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          testID="likeThisPostText"
          onPress={() => {
            this.handleLikeNav(item, 'post');
          }}
          style={styles.rowFlex}
        >
          <Text style={styles.peopleTxt}>
            {item.likes_count}
            {' people '}
          </Text>
          <Text style={styles.likeThisTxt}>like this</Text>
        </TouchableOpacity>
        <View style={styles.rowFlex}>
          <Text style={[styles.boldTxt, { marginTop: 6 }]}>
            {item.description}
          </Text>
        </View>
        <View style={[styles.rowFlex, { marginTop: 6 }]}>
          <Text style={[styles.boldTxt, { lineHeight: 18 }]}>
            {`${item.comment_count} comments `}
          </Text>
          <TouchableOpacity
            testID="postCommentsBtn"
            onPress={() => {
              this.handleShowComments(`${item.id}`);
            }}
          >
            <Text style={styles.seeCommentsTxt}>See the comments</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  renderShowsPostsComment = ({ item }: { item: ICommentItem }) => {
    return (
      <View style={styles.rowFront}>
        <TouchableOpacity
          testID="commentUserProfile"
          style={styles.userAvatar}
          onPress={() => {
            this.showProfile(
              `${item.attributes.account.id}`,
              item.attributes.account.account_type,
            );
          }}
        >
          <FastImage
            resizeMode={FastImage.resizeMode.cover}
            style={styles.userAvatarImge}
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
        <View style={styles.commentContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.commenterNameTxt}>
              {`${item.attributes.account.first_name}`}
            </Text>
            <Text
              style={[
                styles.commenterNameTxt,
                { fontWeight: '400', marginLeft: 5 },
              ]}
            >
              {this.timeSince(item.attributes.created_at)}
            </Text>
          </View>
          <Text style={styles.commentText}>{item.attributes.comment}</Text>
          <TouchableOpacity
            testID="commentReplyButton"
            style={styles.replyBtn}
            onPress={() => {
              this.handleReplyPressed(`${item.id}`);
            }}
          >
            <Text style={styles.replyBtnText}>Reply</Text>
          </TouchableOpacity>
          {item.attributes.replies.length !== 0 && (
            <TouchableOpacity
              testID="showReplyButton"
              style={styles.showReplyButton}
              onPress={() => {
                this.handleShowReplies(item);
              }}
            >
              <View style={styles.horizontalBar} />
              <Text style={styles.showReplyBtnText}>
                {`View ${item.attributes.replies.length} more replies`}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.likeView}>
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
          <Text style={styles.likeCountText}>
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
        <View style={styles.rowBack}>
          <TouchableOpacity
            testID="editAComment"
            style={[styles.backButton, styles.backButtonLeft]}
            onPress={() => this.handleEditComment(data.item, rowMap)}
          >
            <Feather name="corner-up-left" size={25} color={'white'} />
          </TouchableOpacity>
          <TouchableOpacity
            testID="deleteAComment"
            style={[styles.backButton, styles.backButtonRight]}
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
          <View style={styles.commentsListsView}>
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
          <View style={styles.loadingComments}>
            <ActivityIndicator size="large" color="#4949EE" />
          </View>
        )}
      </>
    );
  };

  renderNoComments = () => {
    return (
      <View style={styles.noComments}>
        <Feather name="message-square" size={60} color="#0F172A" />
        <Text style={styles.commentsHeaderTxt}>No comments yet</Text>
        <Text style={styles.startComment}>Start the conversation</Text>
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
          <View style={styles.commentsModalParentView}>
            <TouchableOpacity
              activeOpacity={1}
              testID="replyModal"
              onPress={() => {
                this.hideKeyboard();
              }}
              style={styles.commentsContainer}
            >
              <View style={styles.commentsHeadingTxt}>
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
                <Text style={styles.commentsHeaderTxt}>Replies</Text>
                <TouchableOpacity
                  testID="closeReplyPopupBtn"
                  onPress={this.closeReplyModal}
                >
                  <Feather name="x" size={25} />
                </TouchableOpacity>
              </View>
              <View style={styles.separatorView} />
              {this.renderShowsPostsReplies()}
              <View style={styles.emojiSelection}>
                {this.defaultEmojisForSelectionStrip.map(
                  (emoji: string, index: number) => (
                    <TouchableOpacity
                      testID={`emojiReply${index}`}
                      key={emoji}
                      onPress={() => {
                        this.handleEmojiSelection(emoji);
                      }}
                    >
                      <Text style={styles.emojiSelectionIcon}>{emoji}</Text>
                    </TouchableOpacity>
                  ),
                )}
              </View>
              <View style={styles.commentInptContainer}>
                <View style={styles.userAvatar}>
                  <FastImage
                    source={
                      this.state.userProfileData.profile_image
                        ? {
                            uri: this.state.userProfileData.profile_image,
                            priority: FastImage.priority.high,
                          }
                        : require('../../../mobile/assets/images/default_profile.png')
                    }
                    style={styles.userAvatarImge}
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
                  style={styles.commentInpt}
                  placeholder={'Add a reply...'}
                  multiline
                />
                <TouchableOpacity
                  testID="emojiReplyButton"
                  style={styles.emojiButton}
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
        <View style={styles.tNCModalView}>
          <View style={styles.tncModal}>
            <View style={styles.tNCView}>
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
              <Text style={styles.tNCUpdate}>Terms And Conditions Update</Text>
              <Text style={styles.checkThem}>
                We have just updated our terms and conditions. please check them
                out 
              </Text>
              <View style={styles.tNCActionButtons}>
                <View style={styles.cancelView}>
                  <TouchableOpacity
                    testID="TnCPopupCloseBtn2"
                    onPress={() => {
                      this.closeTnCModalPopup();
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.cancelTxt}>Cancel</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.checkoutView}>
                  <TouchableOpacity
                    testID="checkoutTnCbtn"
                    onPress={() => {
                      this.handleTnCUpdateCheckOutModal();
                    }}
                    activeOpacity={0.7}
                    style={styles.checkout}
                  >
                    <Text style={styles.checkoutTxt}>Check Out</Text>
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
        <View style={[styles.rowFront, { paddingHorizontal: 20 }]}>
          <TouchableOpacity
            testID="userProfileImage"
            style={styles.userAvatar}
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
              style={styles.userAvatarImge}
            />
          </TouchableOpacity>
          <View style={styles.commentContainer}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.commenterNameTxt}>
                {' '}
                {this.state.commentWithReply.attributes?.account.first_name}
              </Text>
              <Text
                style={[
                  styles.commenterNameTxt,
                  { fontWeight: '400', marginLeft: 5 },
                ]}
              >
                {this.timeSince(
                  this.state.commentWithReply.attributes?.created_at,
                )}
              </Text>
            </View>
            <Text style={styles.replyTxt}>
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
          <View style={styles.loadingComments}>
            <ActivityIndicator size="large" color="#4949EE" />
          </View>
        )}
      </>
    );
  };

  renderShowsPostsReplyItem = ({ item }: { item: IReplyItem }) => {
    return (
      <View
        style={[
          styles.rowFront,
          {
            alignSelf: 'flex-end',
            width: '95%',
          },
        ]}
      >
        <TouchableOpacity
          testID="showProfileBtn"
          style={styles.userAvatar}
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
            style={styles.userAvatarImge}
          />
        </TouchableOpacity>
        <View style={styles.commentContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.commenterNameTxt}> {item.account_name} </Text>
            <Text
              style={[
                styles.commenterNameTxt,
                { fontWeight: '400', marginLeft: 5 },
              ]}
            >
              {item.created_at ? this.timeSince(item.created_at) : ''}
            </Text>
          </View>
          <Text style={styles.replyTxt}> {item.reply} </Text>
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
        <View style={styles.rowBack}>
          <TouchableOpacity
            style={[styles.backButton, styles.backButtonRight]}
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
            style={[styles.backButton, styles.backButtonLeft]}
          >
            <Feather name="trash" color={'white'} size={25} />
          </TouchableOpacity>
        </View>
      )}
    </>
  );

  renderShowsPosts = () => {
    return (
      <>
        {this.state.userProfileData.show_list &&
          this.state.userProfileData.show_list.length !== 0 &&
          this.renderShowsList()}
        {this.state.userProfileData.post_list &&
          this.state.userProfileData.post_list.length !== 0 &&
          this.renderPostsList()}
      </>
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
            color: '#334155',
          }}
        >
          Business Hours
        </Text>
        <View style={{ flex: 0.5 }}>
          {businessDays.length > 0 && (
            <Text style={{ fontSize: 16, fontWeight: '400', color: '#334155' }}>
              {businessDays.join(', ')}
            </Text>
          )}
          {(openTime || closeTime) && (
            <Text style={{ fontSize: 16, fontWeight: '400', color: '#334155' }}>
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
      <View style={styles.emojiSelection}>
        {this.defaultEmojisForSelectionStrip.map((emoji: string, index) => (
          <TouchableOpacity
            testID={`emojiReply${index}c`}
            key={emoji}
            onPress={() => this.handleEmojiSelection(emoji)}
          >
            <Text style={styles.emojiSelectionIcon}>{emoji}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  renderCommentsInput = () => {
    return (
      <View style={styles.commentInptContainer}>
        <View style={styles.userAvatar}>
          <FastImage
            source={
              this.state.userProfileData.profile_image
                ? {
                    uri: this.state.userProfileData.profile_image,
                    priority: FastImage.priority.high,
                  }
                : require('../../../mobile/assets/images/default_profile.png')
            }
            style={styles.userAvatarImge}
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
          style={styles.commentInpt}
          onChangeText={commentText => {
            this.handleCommentChange(commentText);
          }}
        />
        <TouchableOpacity
          testID="emojiCommentBtn"
          style={styles.emojiButton}
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
      <View style={styles.commentsHeadingTxt}>
        <Text style={styles.commentsHeaderTxt}>Comments</Text>
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
        style={styles.container}
        ref={this.scrollViewRef}
      >
        <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
        <TouchableWithoutFeedback
          testID="containerView"
          onPress={() => this.hideKeyboard()}
        >
          <View>
            {this.renderHeader()}
            {this.renderCoverAndProfilePhoto()}
            <View
              style={{
                paddingHorizontal: 16,
                paddingBottom: 30,
              }}
            >
              {this.renderPostsFollowersFollowings()}
              {this.isViewingOwnProfile() && (
                <TouchableOpacity
                  testID="editProfileBtn"
                  style={styles.editProfileButton}
                  onPress={this.navigateToBandEditProfile}
                >
                  <Text style={styles.editProfileButtonText}>Edit Profile</Text>
                </TouchableOpacity>
              )}
              {this.state.userProfileData.category_subcat &&
                this.renderCategory()}
              {this.state.userProfileData.category_subcat &&
                this.renderMusicType()}
              {this.renderWebsiteSocialMedia()}
              {this.renderVenueAddressAndZip()}
              {(this.state.userProfileData.bio !== '' ||
                this.state.userProfileData.email) &&
                this.renderBio()}
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
                  style={styles.editProfileButton}
                  onPress={this.navigateToChatScreen}
                >
                  <Text style={styles.editProfileButtonText}>Contact us</Text>
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
                <View style={styles.commentsModalParentView}>
                  <TouchableOpacity
                    testID="commentModal"
                    activeOpacity={1}
                    onPress={() => this.hideKeyboard()}
                    style={styles.commentsContainer}
                  >
                    {this.renderCommentsHeading()}
                    <View style={styles.separatorView} />
                    {this.state.isLoadingComments ? (
                      <View style={styles.noComments}>
                        <ActivityIndicator size="large" color="#4949EE" />
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
          <View style={styles.loadingContainer}>
            <ActivityIndicator size={'large'} color="black" />
          </View>
        )}
      </ScrollView>
    );
    // Merge Engine - render - End
    // Customizable Area End
  }
}

// Customizable Area Start
const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxWidth: 650,
    backgroundColor: '#ffffffff',
    // paddingHorizontal:16,
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
    color: '#0F172A',
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
  },
  txt: {
    fontFamily: 'OpenSans',
    color: colors(false).text,
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
  hamburgerIcon: {
    width: 22,
    aspectRatio: 1,
    resizeMode: 'contain',
  },
  profileImageContainer: {
    backgroundColor: '#FCFCFF',
    width: 160,
    height: 160,
    borderRadius: 80,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: 30,
  },
  statsText: {
    textAlign: 'center',
  },
  divider: {
    height: '100%',
    width: 1,
    backgroundColor: '#CBD5E1',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#ffffffdd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  influencesFlatlist: {
    flex: 1,
    flexWrap: 'wrap',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 20,
  },
  actionBtn: {
    backgroundColor: '#3333CC',
    width: '42.5%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 10,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
    width: '100%',
    textAlign: 'center',
  },
  msgBtn: {
    backgroundColor: '#EDEDFF',
    color: '#3333CC',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
  horizontalView: {
    height: 1,
    width: '100%',
    backgroundColor: '#E2E8F0',
    alignSelf: 'center',
  },
  preferenceHeading: {
    fontSize: 18,
    fontFamily: 'OpenSans',
    color: '#4949EE',
    fontWeight: 'bold',
    marginHorizontal: '5%',
    marginVertical: 20,
  },
  eventContainer: {
    flexDirection: 'column',
    width: '100%',
    padding: 20,
    marginTop: 2,
  },
  month: {
    fontWeight: '700',
    color: '#334155',
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
    color: '#4949EE',
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
    color: '#334155',
  },
  locationPinIcon: {
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
    tintColor: '#4949EE',
    height: 20,
    width: 22,
  },
  likeThisTxt: {
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 22,
    color: '#334155',
  },
  descriptionTxt: {
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 22,
    color: '#334155',
  },
  seeCommentsTxt: {
    color: '#4949EE',
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
    backgroundColor: '#4949EE',
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
  },
  separatorView: {
    height: 1,
    width: '100%',
    backgroundColor: '#E2E8F0',
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
    backgroundColor: '#FCFCFF',
    width: 42,
    borderWidth: 1,
    borderColor: '#C5C5FF',
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
    borderColor: '#C5C5FF',
    borderRadius: 10,
    paddingHorizontal: 10,
    textAlignVertical: 'center',
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
    backgroundColor: '#FFF',
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
    backgroundColor: 'white',
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
    color: '#0F172A',
  },
  rulesModalScroll: {
    flex: 1,
    minHeight: 0,
    marginBottom: 0,
  },
  tNCUpdate: {
    color: '#0F172A',
    fontSize: 24,
    fontWeight: '700',
    paddingLeft: 24,
  },
  checkThem: {
    paddingHorizontal: 24,
    color: '#0F172A',
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
    color: colors(false).text,
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
    color: '#4949EE',
    fontWeight: '400',
    fontSize: 16,
  },
});
// Customizable Area End

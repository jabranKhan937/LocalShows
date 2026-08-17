import React from 'react';

// Customizable Area Start
import Svg, { Path } from 'react-native-svg';
import {
  ScrollView,
  StatusBar,
  View,
  Text,
  SafeAreaView,
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
} from 'react-native';
import { leftArrow } from '../../events/src/assets';
import Icon from 'react-native-vector-icons/Feather';
import { colors } from '../../utilities/src/Colors';
import FastImage from '../../../components/src/SafeFastImage';
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
  constructor(props: Props) {
    super(props);
    this.state = {
      ...this.state,
      showReportModal: false,
      reportReason: '',
      reportComment: '',
      reportError: '',
      showRulesMoreModal: false,
    };
  }

  reportReasons = [
    'Inappropriate Content',
    'Spam',
    'Harassment',
    'False Information',
    'Other',
  ];

  // Customizable Area Start
  renderHeader = () => {
    const { eventDetail } = this.state;
    // Check if it's a post/picture or a show
    const isPost =
      eventDetail?.type === 'post' ||
      eventDetail?.attributes?.model_name === 'BxBlockPosts::Post';
    const headerTitle = isPost
      ? "Picture's information"
      : `Shows in ${this.state.selectedState || ''}`;

    return (
      <View style={styles.headerView}>
        <TouchableOpacity
          testID="backBtn"
          onPress={() => this.props.navigation.goBack()}>
          <Image source={leftArrow} style={styles.backButton} />
        </TouchableOpacity>
        <Text
          testID="titleTxt"
          style={styles.pageTitle}
          numberOfLines={1}
          ellipsizeMode="tail">
          {headerTitle}
        </Text>
        <TouchableOpacity
          testID="threeDotsBtn"
          onPress={() => this.setState({ showMenu: !this.state.showMenu })}>
          <Image
            source={require('../../../mobile/assets/images/3_dots.png')}
            style={[styles.threeDots, { tintColor: '#000' }]}
          />
        </TouchableOpacity>
      </View>
    );
  };

  renderLikes = () => {
    const { eventDetail } = this.state;
    const likeIcon = eventDetail?.attributes?.like_by_me
      ? require('../../../mobile/assets/images/favourite_filled.png')
      : require('../../../mobile/assets/images/image_favorite.png');
    const likesCount = eventDetail?.attributes?.likes_count ?? 0;
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
        <TouchableOpacity testID="likeBtn" onPress={this.likeDislikeEventAPI}>
          <Image
            source={likeIcon}
            style={[styles.backButton, { tintColor: '#4949EE' }]}
          />
        </TouchableOpacity>
        <TouchableOpacity
          testID="likeNavBtn"
          onPress={() => {
            if (eventDetail?.id && eventDetail?.type) {
              this.handleLikeListScreenNav(eventDetail.id, eventDetail.type);
            }
          }}>
          <Text style={[styles.text, { fontWeight: '700' }]}>
            {` ${likesCount} people`}
            <Text style={styles.text}> like this</Text>
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  renderLocation = () => {
    return (
      <>
        {this.state.location !== null && this.state.location !== '' && (
          <View style={{ flexDirection: 'row', marginTop: 20 }}>
            <View style={{ flexDirection: 'row', flex: 0.4 }}>
              <Image
                source={require('../../../mobile/assets/images/location_on.png')}
                style={styles.backButton}
              />
              <Text style={[styles.text, { fontWeight: '700', marginLeft: 10 }]}>
                Location
              </Text>
            </View>
            <TouchableOpacity
              testID="openMap"
              style={{ flex: 0.6 }}
              onPress={() => {
                this.openGoogleMaps();
              }}>
              <Text style={[styles.text]}>
                At <Text style={{ color: '#4949EE' }}>{this.state.location}</Text>
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </>
    );
  };

  renderAddress = () => {
    const fullAddress = `${this.state.address}, ${this.state.selectedCity}, ${this.state.selectedState} ${this.state.zipCode}, US`;
    return (
      <>
        {this.state.address !== null && this.state.address !== '' && (
          <View style={{ flexDirection: 'row', marginTop: 20 }}>
            <View style={{ flexDirection: 'row', flex: 0.4 }}>
              <Image
                source={require('../../../mobile/assets/images/home.png')}
                style={styles.backButton}
              />
              <Text style={[styles.text, { fontWeight: '700', marginLeft: 10 }]}>
                Address
              </Text>
            </View>
            <Text style={[styles.text, { flex: 0.6 }]}>{fullAddress}</Text>
          </View>
        )}
      </>
    );
  };

  renderDate = () => {
    console.log('here is date to show', this.state.dateOfShow);
    return (
      <>
        <View style={{ flexDirection: 'row', marginTop: 20 }}>
          <View style={{ flexDirection: 'row', flex: 0.4 }}>
            <Image
              source={require('../../../mobile/assets/images/image_calendar.png')}
              style={[styles.backButton, { tintColor: '#4949EE' }]}
            />
            <Text style={[styles.text, { fontWeight: '700', marginLeft: 10 }]}>
              Date
            </Text>
          </View>
          <Text style={[styles.text, { flex: 0.6 }]}>
            {this.state.dateOfShow}
          </Text>
        </View>
      </>
    );
  };

  renderEndDate = () => {
    if (!this.state.endDate) {
      return null;
    }
    return (
      <View style={{ flexDirection: 'row', marginTop: 20 }}>
        <View style={{ flexDirection: 'row', flex: 0.4 }}>
          <Image
            source={require('../../../mobile/assets/images/image_calendar.png')}
            style={[styles.backButton, { tintColor: '#4949EE' }]}
          />
          <Text style={[styles.text, { fontWeight: '700', marginLeft: 10 }]}>
            End Date
          </Text>
        </View>
        <Text style={[styles.text, { flex: 0.6 }]}>{this.state.endDate}</Text>
      </View>
    );
  };

  renderTime = () => {
    return (
      <>
        {
          <View style={{ flexDirection: 'row', marginTop: 20 }}>
            <View style={{ flexDirection: 'row', flex: 0.4 }}>
              <Image
                source={require('../../../mobile/assets/images/time.png')}
                style={[styles.backButton, { tintColor: '#4949EE' }]}
              />
              <Text style={[styles.text, { fontWeight: '700', marginLeft: 10 }]}>
                Time
              </Text>
            </View>
            <Text style={[styles.text, { flex: 0.6 }]}>
              {this.state.time !== null && this.state.time !== ''
                ? this.changeTimeFormat(this.state.time)
                : 'To Be Determined'}
            </Text>
          </View>
        }
      </>
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
      <View style={{ flexDirection: 'row', marginTop: 20, alignItems: 'flex-start' }}>
        <View style={{ flexDirection: 'row', flex: 0.4, alignItems: 'center' }}>
          <View
            style={{
              width: 20,
              height: 20,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            accessible={false}>
            <Icon name="tag" size={18} color="#4949EE" />
          </View>
          <Text style={[styles.text, { fontWeight: '700', marginLeft: 10 }]}>
            Category
          </Text>
        </View>
        {canNavigate ? (
          <TouchableOpacity
            testID="eventCreatorCategoryType"
            style={{ flex: 0.6 }}
            onPress={() =>
              this.openEventCreatorProfileForCategoryRow(
                String(creator.id),
                creator.account_type,
              )
            }
            activeOpacity={0.7}>
            <Text style={[styles.text, { color: '#4949EE' }]}>
              {accountTypeLabel}
            </Text>
          </TouchableOpacity>
        ) : (
          <Text style={[styles.text, { flex: 0.6 }]}>{accountTypeLabel}</Text>
        )}
      </View>
    );
  };

  renderLineup = () => {
    return (
      <>
        {this.state.selectedLineUp !== null &&
          this.state.selectedLineUp.length !== 0 && (
            <View style={{ flexDirection: 'row', marginTop: 20 }}>
              <View style={{ flexDirection: 'row', flex: 0.4 }}>
                <Image
                  source={require('../../../mobile/assets/images/headphones.png')}
                  style={[styles.backButton, { tintColor: '#4949EE' }]}
                />
                <Text
                  style={[styles.text, { fontWeight: '700', marginLeft: 10 }]}>
                  Line up
                </Text>
              </View>
              <View style={{ flex: 0.6 }}>
                <FlatList
                  testID="lineupFlatlist"
                  data={this.state.selectedLineUp}
                  renderItem={({ item }) => {
                    return (
                      <TouchableOpacity
                        testID="lineup"
                        onPress={() =>
                          item.id !== '' && this.showProfile(item.id)
                        }
                        activeOpacity={item.id === '' ? 1 : 0}>
                        <Text
                          style={[
                            styles.text,
                            { color: item.id !== '' ? '#4949EE' : '#334155' },
                          ]}>
                          {item.first_name.trim()}
                        </Text>
                      </TouchableOpacity>
                    );
                  }}
                />
              </View>
            </View>
          )}
      </>
    );
  };

  renderShowType = () => {
    return (
      <>
        {this.state.selectedTypeOfShows !== null &&
          this.state.selectedTypeOfShows.length !== 0 && (
            <View style={{ flexDirection: 'row', marginTop: 20 }}>
              <View style={{ flexDirection: 'row', flex: 0.4 }}>
                <Image
                  source={require('../../../mobile/assets/images/music.png')}
                  style={[styles.backButton, { tintColor: '#4949EE' }]}
                />
                <Text
                  style={[styles.text, { fontWeight: '700', marginLeft: 10 }]}>
                  Show type
                </Text>
              </View>
              <View style={{ flex: 0.6 }}>
                <FlatList
                  testID="typeOfShowFlatlist"
                  numColumns={20}
                  columnWrapperStyle={{ flexWrap: 'wrap' }}
                  data={this.state.selectedTypeOfShows}
                  contentContainerStyle={styles.showTypeFlatlist}
                  keyExtractor={(item: any) => item.id}
                  renderItem={({ item, index }) => {
                    return (
                      <>
                        <Text style={[styles.text]}>
                          {index === this.state.selectedTypeOfShows.length - 1
                            ? `${item.name}`
                            : `${item.name}, `}
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

  renderGenre = () => {
    return (
      <>
        {this.state.selectedGenres !== null &&
          this.state.selectedGenres.length !== 0 && (
            <View style={{ flexDirection: 'row', marginTop: 20 }}>
              <View style={{ flexDirection: 'row', flex: 0.4 }}>
                <Image
                  source={require('../../../mobile/assets/images/music.png')}
                  style={[styles.backButton, { tintColor: '#4949EE' }]}
                />
                <Text
                  style={[styles.text, { fontWeight: '700', marginLeft: 10 }]}>
                  Genre
                </Text>
              </View>
              <View style={{ flex: 0.6 }}>
                <FlatList
                  testID="genreFlatlist"
                  numColumns={20}
                  columnWrapperStyle={{ flexWrap: 'wrap' }}
                  data={this.state.selectedGenres}
                  contentContainerStyle={styles.showTypeFlatlist}
                  keyExtractor={(item: any) => item.id}
                  renderItem={({ item, index }) => {
                    return (
                      <>
                        <Text style={[styles.text]}>
                          {index === this.state.selectedGenres.length - 1
                            ? `${item.name}`
                            : `${item.name}, `}
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

  renderDescription = () => {
    return (
      <>
        {this.state.description !== null && this.state.description !== '' && (
          <View style={{ marginTop: 20 }}>
            <Text style={[styles.text, { fontWeight: '700', marginBottom: 5 }]}>
              Description
            </Text>
            <Text style={[styles.text, { lineHeight: 22 }]}>
              {this.state.description}
            </Text>
          </View>
        )}
      </>
    );
  };

  renderRulesAndRegulations = () => {
    // Check both state and eventDetail.attributes as fallback
    let rulesAndRegulationsIcons =
      this.state.rulesAndRegulationsIcons ||
      this.state.eventDetail?.attributes?.rules_and_regulations_icons ||
      [];

    // Handle case where it might be a single object or string
    if (!Array.isArray(rulesAndRegulationsIcons)) {
      if (rulesAndRegulationsIcons && typeof rulesAndRegulationsIcons === 'object') {
        rulesAndRegulationsIcons = [rulesAndRegulationsIcons];
      } else if (typeof rulesAndRegulationsIcons === 'string') {
        rulesAndRegulationsIcons = [{ title: rulesAndRegulationsIcons }];
      } else {
        rulesAndRegulationsIcons = [];
      }
    }

    // Normalize post rules to { title }[]
    const postRules = rulesAndRegulationsIcons.map((item: any) => {
      let title = '';
      if (typeof item === 'string') {
        title = item;
      } else if (item && typeof item === 'object') {
        title = item.title || item.name || item.text || '';
      }
      return { ...(typeof item === 'object' ? item : {}), title };
    }).filter((item: any) => item.title);

    if (!postRules || postRules.length === 0) {
      return null;
    }

    // Official titles from API (compare by trimmed lowercase)
    const officialList = this.state.officialRulesAndRegulationsIconsList || [];
    const officialTitlesSet = new Set(
      officialList.map((i: any) => (i.title || '').trim().toLowerCase()),
    );

    const knownRules: any[] = [];
    const otherRules: any[] = [];
    postRules.forEach((item: any) => {
      const titleNorm = (item.title || '').trim().toLowerCase();
      // If official list not loaded yet, treat all as known (show inline)
      if (officialTitlesSet.size === 0 || officialTitlesSet.has(titleNorm)) {
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
                style={{ marginTop: 4, marginBottom: 8 }}>
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
    let otherRules: any[] = [];
    const rulesAndRegulationsIcons =
      this.state.rulesAndRegulationsIcons ||
      this.state.eventDetail?.attributes?.rules_and_regulations_icons ||
      [];
    let list: any[] = Array.isArray(rulesAndRegulationsIcons)
      ? rulesAndRegulationsIcons
      : rulesAndRegulationsIcons
        ? [rulesAndRegulationsIcons]
        : [];
    const postRules = list.map((item: any) => {
      const title = typeof item === 'string' ? item : (item?.title || item?.name || item?.text || '');
      return { ...(typeof item === 'object' ? item : {}), title };
    }).filter((item: any) => item.title);
    const officialList = this.state.officialRulesAndRegulationsIconsList || [];
    const officialTitlesSet = new Set(
      officialList.map((i: any) => (i.title || '').trim().toLowerCase()),
    );
    otherRules = postRules.filter(
      (item: any) => !officialTitlesSet.has((item.title || '').trim().toLowerCase()),
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
        <View style={[styles.centeredView, { backgroundColor: '#33415580' }]}>
          <TouchableWithoutFeedback onPress={this.closeRulesMoreModal}>
            <View style={StyleSheet.absoluteFill} />
          </TouchableWithoutFeedback>
          <View
            style={[
              styles.modalView,
              styles.reportModalContent,
              { height: modalMaxHeight },
            ]}
          >
            <View style={styles.reportHeader}>
              <Text style={styles.reportTitle}>Rules and Regulations</Text>
              <TouchableOpacity
                testID="closeRulesMoreModal"
                onPress={this.closeRulesMoreModal}
              >
                <Svg width={20} height={20} viewBox="0 0 14 14" fill="#0F172A">
                  <Path
                    d="M13.3.71a.996.996 0 00-1.41 0L7 5.59 2.11.7A.996.996 0 10.7 2.11L5.59 7 .7 11.89a.996.996 0 101.41 1.41L7 8.41l4.89 4.89a.996.996 0 101.41-1.41L8.41 7l4.89-4.89c.38-.38.38-1.02 0-1.4z"
                    fill="#0F172A"
                  />
                </Svg>
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
                    <Text style={[styles.text, { lineHeight: 22 }]}>{item.title}</Text>
                  </View>
                </React.Fragment>
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
        // Fallback: try opening it anyway as some schemes might not return true for canOpenURL on Android
        await Linking.openURL(urlToOpen);
      }
    } catch (error) {
      console.error('An error occurred while opening the link:', error);
    }
  };

  handleReportIssue = () => {
    // Close the disclaimer modal first, then show the report modal
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

    // Prepare report payload
    const reportPayload = {
      event_id: this.state.eventId,
      reason: reportReason,
      comment: reportComment || '',
    };

    // Construct the API endpoint
    const endpoint = `/reports`;
    const baseURL = 'https://api.localshows.com';
    const fullURL = `${baseURL}${endpoint}`;

    // Log URL and payload
    console.log('=== Report Show API Call ===');
    console.log('URL:', fullURL);
    console.log('Payload:', JSON.stringify(reportPayload, null, 2));

    // Make API call
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

      // Reset and close
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
        onRequestClose={this.closeReportModal}>
        <TouchableWithoutFeedback onPress={this.closeReportModal}>
          <View style={[styles.centeredView, { backgroundColor: '#33415580' }]}>
            <TouchableWithoutFeedback>
              <View style={[styles.modalView, styles.reportModalContent]}>
                <View style={styles.reportHeader}>
                  <Text style={styles.reportTitle}>{'Report Show'}</Text>
                  <TouchableOpacity
                    testID="closeReportModal"
                    onPress={this.closeReportModal}>
                    <Svg
                      width={20}
                      height={20}
                      viewBox="0 0 14 14"
                      fill="#0F172A">
                      <Path
                        d="M13.3.71a.996.996 0 00-1.41 0L7 5.59 2.11.7A.996.996 0 10.7 2.11L5.59 7 .7 11.89a.996.996 0 101.41 1.41L7 8.41l4.89 4.89a.996.996 0 101.41-1.41L8.41 7l4.89-4.89c.38-.38.38-1.02 0-1.4z"
                        fill="#0F172A"
                      />
                    </Svg>
                  </TouchableOpacity>
                </View>
                <Text style={styles.reportSubtitle}>
                  {'Select a reason for reporting this show:'}
                </Text>
                <ScrollView
                  style={styles.reportReasonsContainer}
                  contentContainerStyle={{ paddingBottom: 8 }}
                  showsVerticalScrollIndicator={false}>
                  {this.reportReasons.map((reason) => {
                    const isSelected = reportReason === reason;
                    return (
                      <TouchableOpacity
                        key={reason}
                        style={[
                          styles.reportReasonButton,
                          isSelected && styles.reportReasonButtonSelected,
                        ]}
                        onPress={() => this.selectReportReason(reason)}>
                        <View
                          style={[
                            styles.reportRadioOuter,
                            isSelected && styles.reportRadioOuterSelected,
                          ]}>
                          {isSelected && (
                            <View style={styles.reportRadioInner} />
                          )}
                        </View>
                        <Text
                          style={[
                            styles.reportReasonText,
                            isSelected && styles.reportReasonTextSelected,
                          ]}>
                          {reason}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
                {reportError ? (
                  <Text style={styles.reportErrorText}>{reportError}</Text>
                ) : null}
                <Text style={styles.reportSubtitle}>
                  {'Additional details (optional)'}
                </Text>
                <TextInput
                  testID="reportCommentInput"
                  style={styles.reportCommentInput}
                  placeholder={'Add any additional information...'}
                  placeholderTextColor="#94A3B8"
                  multiline
                  numberOfLines={4}
                  value={reportComment}
                  onChangeText={this.handleReportCommentChange}
                />
                <View style={styles.reportActions}>
                  <TouchableOpacity
                    testID="cancelReport"
                    style={[styles.reportButton, styles.reportCancelButton]}
                    onPress={this.closeReportModal}>
                    <Text style={styles.reportCancelText}>{'Cancel'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    testID="submitReport"
                    style={[styles.reportButton, styles.reportSubmitButton]}
                    onPress={this.submitReport}>
                    <Text style={styles.reportSubmitText}>
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
        onRequestClose={() => this.setState({ showDisclaimer: false })}>
        <View style={styles.modalParentView}>
          <View style={styles.modalContainerView}>
            <TouchableOpacity
              testID="closeDisclaimerBtn"
              style={styles.disablePopupIconContainer}
              onPress={() => this.setState({ showDisclaimer: false })}>
              <Icon name="x" color="#0F172A" size={25} />
            </TouchableOpacity>
            <Text style={styles.txtCancelShowHeading}>Disclaimer</Text>
            <View>
              <Text style={styles.txtDelete}>
                You're about to open an external web-site. Be cautious and keep
                your personal information safe. This is a third-party website,
                over which Local Shows doesn't have responsibility or control. If
                a weblink brings you to a website which you believe contains
                illegal content or violates our community guidelines, please{' '}
                <Text
                  testID="reportItLink"
                  style={{ fontWeight: 'bold', textDecorationLine: 'underline', color: '#3333CC' }}
                  onPress={this.handleReportIssue}
                  suppressHighlighting={false}>
                  report it
                </Text>{' '}
                immediately.
              </Text>
              <Text style={[styles.txtDelete, { marginTop: 10 }]}>
                Are you sure you want to continue?
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 20,
              }}>
              <TouchableOpacity
                testID="cancelDisclaimerBtn"
                style={[
                  styles.cancelShowButtonContainer,
                  styles.keepButtonContainer,
                  { width: '45%' },
                ]}
                onPress={() => this.setState({ showDisclaimer: false })}>
                <Text style={[styles.textCancelButton, styles.textKeepButton]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                testID="confirmDisclaimerBtn"
                style={[styles.cancelShowButtonContainer, { width: '45%' }]}
                onPress={this.handleOpenLink}>
                <Text style={styles.textCancelButton}>Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };
  
  renderMenuPopup = () => {
    const isPost =
      this.state.eventDetail?.type === 'post' ||
      this.state.eventDetail?.attributes?.model_name === 'BxBlockPosts::Post';

    return (
      <>
        {this.state.showMenu && (
          <View style={styles.menuContainer}>
            {isPost ? (
              // Post/Picture menu options
              <>
                <TouchableOpacity
                  testID="editPost"
                  style={styles.menuButton}
                  onPress={() => {
                    this.setState({ showMenu: false }, () => {
                      this.props.navigation.navigate('PhotoLibrary', {
                        eventId: this.state.eventId,
                      });
                    });
                  }}>
                  <Text style={styles.menuButtonText}>
                    {'Edit the picture'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  testID="deletePost"
                  style={[styles.menuButton, { marginTop: 5 }]}
                  onPress={() => {
                    this.setState({ cancelPopup: true, showMenu: false });
                  }}>
                  <Text style={styles.menuButtonText}>{'Delete picture'}</Text>
                </TouchableOpacity>
              </>
            ) : (
              // Show menu options
              <>
                <TouchableOpacity
                  testID="editShow"
                  style={styles.menuButton}
                  onPress={() => {
                    this.setState({ showMenu: false }, () => {
                      this.props.navigation.navigate('PostCreation', {
                        eventId: this.state.eventId,
                        from: 'show',
                      });
                    });
                  }}>
                  <Text style={styles.menuButtonText}>{'Edit the show'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  testID="postponeShow"
                  style={[styles.menuButton, { marginTop: 5 }]}
                  onPress={() => {
                    this.setState({ showMenu: false }, () => {
                      this.props.navigation.navigate('PostPostpone', {
                        eventId: this.state.eventId,
                        eventTitle: this.state.eventTitle,
                        from: 'show',
                      });
                    });
                  }}>
                  <Text style={styles.menuButtonText}>
                    {'Postpone the show'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  testID="cancelShow"
                  disabled={this.state.eventDetail?.attributes?.is_canceled}
                  style={[
                    styles.menuButton,
                    {
                      marginTop: 5,
                      opacity: this.state.eventDetail?.attributes?.is_canceled
                        ? 0.5
                        : 1,
                    },
                  ]}
                  onPress={() => {
                    this.setState({ cancelPopup: true, showMenu: false });
                  }}>
                  <Text style={styles.menuButtonText}>{'Cancel show'}</Text>
                </TouchableOpacity>
                {!this.state.sold_out && (
                  <TouchableOpacity
                    testID="markAsSoldOut"
                    style={[styles.menuButton, { marginTop: 5 }]}
                    onPress={() => {
                      this.setState({ showMenu: false }, () => {
                        this.handleMarkAsSoldOut(this.state.eventId);
                      });
                    }}>
                    <Text style={styles.menuButtonText}>
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
    console.log(
      '--this.state.eventDetail?.attributes--',
      this.state.eventDetail?.attributes,
    );
    const isVerified = this.state.eventDetail?.attributes?.verified;
    const ticketLink = this.state.eventDetail?.attributes?.ticket_link;

    console.log('--ticketLink--', ticketLink);

    if (!ticketLink || !isVerified) return null;

    return (
      <View style={{}}>
        <TouchableOpacity
          testID="buyTicketBtn"
          style={[styles.button, { backgroundColor: '#4949EE', marginTop: 15 }]}
          onPress={() => this.handleBuyTicket(ticketLink)}>
          <Text style={{ fontWeight: '700', fontSize: 16, color: '#FFF' }}>
            Buy Ticket
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  // Customizable Area End

  render() {
    // Customizable Area Start
    const isPost =
      this.state.eventDetail?.type === 'post' ||
      this.state.eventDetail?.attributes?.model_name === 'BxBlockPosts::Post';
    // Customizable Area End
    return (
      <SafeAreaView style={styles.container}>
        {/* Customizable Area Start */}
        <StatusBar barStyle="light-content" backgroundColor="#FFF" />
        <ScrollView>
          <TouchableWithoutFeedback
            testID="containerFeedback"
            onPress={() => {
              this.setState({ showMenu: false });
            }}>
            <View style={styles.containerView}>
              {this.renderHeader()}
              {this.state.sold_out && (
                <View style={styles.soldoutContainer}>
                  <View style={styles.soldoutView}>
                    <View style={styles.soldoutView2}>
                      <Text style={styles.soldoutText}>
                        Unfortunately, the event tickets are SOLD OUT.
                      </Text>
                    </View>
                  </View>
                </View>
              )}

              {Object.keys(this.state.selectedImageData).length !== 0 && (
                <FastImage
                  source={{
                    uri: this.state.selectedImageData.uri,
                    priority: FastImage.priority.high,
                  }}
                  style={styles.eventImageContainer}
                  resizeMode={FastImage.resizeMode.contain}
                />
              )}
              <View style={{ marginTop: 20 }}>
                {(() => {
                  if (isPost) {
                    // For posts/pictures, only show likes and description
                    return (
                      <>
                        {this.renderLikes()}
                        {this.renderDescription()}
                      </>
                    );
                  } else {
                    // For shows, show all fields
                    return (
                      <>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}>
                          <Text
                            style={
                              styles.eventTitleText
                            }>{`${this.state.eventTitle}`}</Text>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            {this.state.eventDetail?.attributes
                              ?.is_canceled && (
                                <Text
                                  style={{
                                    color: '#DC2626',
                                    fontSize: 14,
                                    fontWeight: '700',
                                    marginRight: 10,
                                  }}>
                                  Show Canceled
                                </Text>
                              )}
                            {this.state.eventDetail?.attributes
                              ?.postpone_show && (
                                <Image
                                  source={require('../../../mobile/assets/images/postponed.png')}
                                  style={{
                                    width: 87,
                                    height: 28,
                                    borderRadius: 5,
                                    marginRight: 10,
                                  }}
                                />
                              )}
                            {this.state.sold_out && (
                              <Image
                                source={require('../../../mobile/assets/images/sold_out.png')}
                                style={{ width: 75, height: 28, borderRadius: 5 }}
                              />
                            )}
                          </View>
                        </View>
                        {this.renderLikes()}
                        <View>
                          {this.renderLocation()}
                          {this.renderAddress()}
                          {this.renderDate()}
                          {this.renderEndDate()}
                          {this.renderTime()}
                          {this.renderEventCreatorCategoryRow()}
                          {this.renderLineup()}
                          {this.renderShowType()}
                          {this.renderGenre()}
                        </View>
                        {this.renderDescription()}
                        {this.renderRulesAndRegulations()}
                        {this.renderBuyTicketButton()}
                      </>
                    );
                  }
                })()}
              </View>
              {this.renderMenuPopup()}
              {this.renderDisclaimerModal()}
              {this.renderReportModal()}
              {this.renderRulesMoreModal()}

              {(() => {
                const isPost =
                  this.state.eventDetail?.type === 'post' ||
                  this.state.eventDetail?.attributes?.model_name ===
                  'BxBlockPosts::Post';
                if (!isPost) {
                  // Only show Directions button for shows
                  return (
                    <View style={{ marginVertical: 10 }}>
                      <TouchableOpacity
                        testID="directionsBtn"
                        style={[
                          styles.button,
                          {
                            backgroundColor: '#EDEDFF',
                            marginTop: 0,
                          },
                        ]}
                        onPress={() => this.openGoogleMaps()}>
                        <Text
                          style={{
                            fontWeight: '700',
                            fontSize: 16,
                            color: '#4949EE',
                          }}>
                          Directions
                        </Text>
                      </TouchableOpacity>
                    </View>
                  );
                }
                return null;
              })()}
              <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.cancelPopup}>
                <View style={styles.modalParentView}>
                  <View style={styles.modalContainerView}>
                    <TouchableOpacity
                      testID="crossBtn"
                      style={styles.disablePopupIconContainer}
                      onPress={() => this.setState({ cancelPopup: false })}>
                      <Icon name="x" color="#0F172A" size={25} />
                    </TouchableOpacity>
                    <Text style={styles.txtCancelShowHeading}>
                      {isPost
                        ? 'Do you want to delete the picture ?'
                        : 'Do you want to delete the show ?'}
                    </Text>
                    <Text style={styles.txtDelete}>
                      {isPost
                        ? 'If you delete the picture, you will not be able to restore it again.'
                        : 'If you delete the show, you will not be able to restore the show again.'}
                    </Text>
                    <TouchableOpacity
                      testID="cancelBtn"
                      style={[
                        styles.cancelShowButtonContainer,
                        styles.keepButtonContainer,
                      ]}
                      onPress={() => this.setState({ cancelPopup: false })}>
                      <Text
                        style={[
                          styles.textCancelButton,
                          styles.textKeepButton,
                        ]}>
                        Cancel
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      testID="confirmBtn"
                      style={styles.cancelShowButtonContainer}
                      onPress={() => {
                        this.setState({ cancelPopup: false }, () => {
                          if (isPost) {
                            this.deletePostDetail(this.state.eventId);
                          } else {
                            this.handleCancelShowAPI();
                          }
                        });
                      }}>
                      <Text style={styles.textCancelButton}>Confirm</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
        {this.state.isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size={'large'} color="black" />
          </View>
        )}
        {/* Customizable Area End */}
      </SafeAreaView>
    );
  }
}

// Customizable Area Start
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignSelf: 'center',
    backgroundColor: '#FFF',
  },
  containerView: {
    backgroundColor: '#FFF',
    padding: 25,
  },
  headerView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#334155',
    width: '80%',
    paddingHorizontal: 10,
    textAlign: 'center',
  },
  threeDots: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    tintColor: '#334155',
  },
  eventImageContainer: {
    height: 200,
    width: '100%',
    marginTop: 30,
    borderRadius: 8,
  },
  eventTitleText: {
    fontSize: 20,
    color: '#334155',
    fontWeight: '700',
    flex: 2,
  },
  text: {
    fontSize: 16,
    color: '#334155',
    fontWeight: '400',
  },
  showFeatureItems: {
    flexDirection: 'row',
    width: '49%',
    marginRight: 10,
    marginBottom: 5,
  },
  menuContainer: {
    position: 'absolute',
    right: 20,
    top: 60,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    paddingLeft: 30,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.9,
    shadowRadius: 3,
    elevation: 3,
  },
  menuButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  menuButtonText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#0F172A',
    textAlignVertical: 'center',
  },
  modalParentView: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#33415580',
  },
  modalContainerView: {
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
    color: '#0F172A',
  },
  txtDelete: {
    fontSize: 18,
  },
  cancelShowButtonContainer: {
    backgroundColor: '#3333CC',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
  },
  textCancelButton: {
    color: colors(false).white,
    fontWeight: '700',
    fontSize: 18,
    alignSelf: 'center',
  },
  keepButtonContainer: {
    backgroundColor: 'transparent',
  },
  textKeepButton: {
    color: '#3333CC',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#ffffffdd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#4949EE',
    width: '100%',
    padding: 15,
  },
  showTypeFlatlist: {
    flex: 1,
    flexWrap: 'wrap',
  },
  soldoutView: {
    flex: 1,
    backgroundColor: '#DC2626',
    paddingLeft: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  soldoutView2: {
    backgroundColor: '#FEE2E2',
    flex: 1,
    paddingVertical: 12,
    paddingLeft: 12,
  },
  soldoutText: {
    color: '#DC2626',
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
    color: '#0F172A',
  },
  reportSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#334155',
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
    borderColor: '#E2E8F0',
    borderRadius: 8,
    marginBottom: 8,
  },
  reportReasonButtonSelected: {
    borderColor: '#4949EE',
    backgroundColor: '#F8FAFC',
  },
  reportRadioOuter: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  reportRadioOuterSelected: {
    borderColor: '#4949EE',
  },
  reportRadioInner: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#4949EE',
  },
  reportReasonText: {
    fontSize: 14,
    color: '#64748B',
  },
  reportReasonTextSelected: {
    color: '#0F172A',
    fontWeight: '600',
  },
  reportErrorText: {
    color: '#EF4444',
    fontSize: 12,
    marginBottom: 16,
    marginTop: -10,
  },
  reportCommentInput: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    height: 100,
    textAlignVertical: 'top',
    fontSize: 14,
    color: '#0F172A',
    marginBottom: 24,
  },
  reportActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
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
    borderColor: '#CBD5E1',
  },
  reportSubmitButton: {
    backgroundColor: '#4949EE',
  },
  reportCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
  },
  reportSubmitText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
// Customizable Area End

import React, { Component } from "react";
// Customizable Area Start
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StatusBar,
  FlatList,
  ActivityIndicator,
  Modal,
  TouchableWithoutFeedback,
  TextInput,
  ScrollView,
  Dimensions,
  StyleSheet,
  KeyboardAvoidingView,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  darkAllEventStyles,
  lightAllEventStyles,
} from "./AllEventStyle";
import {
  tick_circle_black,
  leftArrow,
} from "./assets";
import Svg, { Path } from "react-native-svg";
import FastImage from "../../../components/src/SafeFastImage";
import Icon from "react-native-vector-icons/Feather";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { defaultProfile } from "../../user-profile-basic/src/assets";
import { SwipeListView } from "react-native-swipe-list-view";
import moment from "moment-timezone";
// Customizable Area End

import AllEventController, { Props } from "./AllEventController";

export default class AllEventDetailScreen extends AllEventController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }

  get styles() {
    return this.state.isDarkMode ? darkAllEventStyles : lightAllEventStyles;
  }

  isEventDetailScreen = () => true;

  async componentDidMount() {
    await super.componentDidMount();

    if (this.isPlatformWeb() === false && this.props.navigation?.addListener) {
      const focusListener = this.props.navigation.addListener("focus", () => {
        if (this.isComponentMounted) {
          this.handlePayloadFromNav();
          this.confirmEventDetailParamsOrError();
        }
      });
      this.navigationListeners.push(focusListener);
    }
    this.setState({ showFullText: true });
  }

  // Customizable Area Start
  defaultEmojisForSelectionBar = [
    "️💖",
    "🙌",
    "🔥",
    "👏",
    "😢",
    "😍",
    "😲",
    "😂",
  ];

  reportReasons = [
    "Incorrect Date/Time",
    "Offensive Content",
    "Duplicate Listing",
    "Spam",
    "Other",
  ];

  screenData = [
    { type: "image" },
    { type: "title" },
    { type: "like" },
    { type: "clickableItems" },
    { type: "description" },
    { type: "rulesRegulations" },
    { type: "showFeatures" },
    { type: "ticketsAndDirectionsButtons" },
  ];

  getDetailAttributes = () => this.state.eventDetail?.attributes || {};

  formatGenreLabel = (genre: any): string => {
    if (!genre) return "";
    if (typeof genre === "string") return genre.trim();
    if (!Array.isArray(genre) || genre.length === 0) return "";
    const names = genre
      .map((item: any) => {
        if (typeof item === "string") return item.trim();
        return String(item?.name ?? item?.title ?? item?.genre ?? "").trim();
      })
      .filter((name: string) => name);
    return names.join(" - ");
  };

  getGenreDisplay = () => {
    const attributes = this.getDetailAttributes();
    const genre = this.formatGenreLabel(attributes?.genre);
    if (genre) return genre;
    return this.formatGenreLabel(attributes?.type_of_show);
  };

  getTicketPriceLabel = () => {
    const attributes = this.getDetailAttributes();
    const raw =
      attributes?.ticket_price ??
      attributes?.price ??
      attributes?.cost ??
      attributes?.ticket_cost;
    if (raw === null || raw === undefined || raw === "") return "";
    const numeric = Number(raw);
    if (!Number.isNaN(numeric)) {
      return `$${Number.isInteger(numeric) ? numeric : numeric.toFixed(2)}`;
    }
    const text = String(raw).trim();
    if (!text) return "";
    return text.startsWith("$") ? text : `$${text}`;
  };

  isShowTonight = () => {
    const date = this.getDetailAttributes()?.date_of_the_show;
    if (!date || date === "2999-12-31") return false;
    return moment.utc(date).isSame(moment(), "day");
  };

  formatInfoCardDate = () => {
    const date = this.getDetailAttributes()?.date_of_the_show;
    if (!date) return "";
    if (date === "2999-12-31") return "TBD";
    if (this.isShowTonight()) return "Tonight";
    return moment.utc(date).format("MMM D");
  };

  formatInfoCardTime = () => {
    const attributes = this.getDetailAttributes();
    if (attributes?.date_of_the_show === "2999-12-31") return "TBD";
    const time = attributes?.time;
    if (!time) return "";
    const parsed = moment(time, ["HH:mm:ss", "HH:mm", "hh:mm A"], true);
    if (parsed.isValid()) return parsed.format("h:mm A");
    return this.convertTime(time);
  };

  getFullAddress = () => {
    const attributes = this.getDetailAttributes();
    const cityStateZip = [attributes?.city, attributes?.state, attributes?.zip_code]
      .filter((part) => part !== null && part !== undefined && String(part).trim())
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
    return [attributes?.address, cityStateZip, attributes?.country]
      .map((part) => (part === null || part === undefined ? "" : String(part).trim()))
      .filter((part) => part && part !== ",")
      .join(", ");
  };

  getMoreShowsAtVenue = () => {
    const attributes = this.getDetailAttributes();
    const venue = attributes?.location;
    const currentId = String(attributes?.id || this.state.selectedEventId || "");
    if (!venue) return [];
    const list = this.state.authenticatedEventsList || [];
    return list
      .filter((show: any) => {
        const data = show?.attributes || show;
        const id = String(show?.id || data?.id || "");
        const showVenue = data?.location || data?.city;
        return (
          id &&
          id !== currentId &&
          showVenue &&
          String(showVenue).toLowerCase() === String(venue).toLowerCase()
        );
      })
      .slice(0, 8);
  };

  getLineupName = (item: any) => {
    if (!item) return "";
    if (typeof item === "string") return item;
    return item?.first_name || item?.name || "";
  };

  toggleRulesAccordion = () => {
    this.setState({ showFullText: !this.state.showFullText });
  };

  renderItem = ({ item }: { item: any }) => {
    return (
      <TouchableWithoutFeedback
        testID="wholeUI"
        onPress={this.handleEntireScreen}
      >
        {this.renderSwitchItems(item.type)}
      </TouchableWithoutFeedback>
    );
  };

  renderSwitchItems = (type: string) => {
    switch (type) {
      case "image":
        return this.renderEventImage();
      case "title":
        return this.renderTitle();
      case "like":
        return this.renderLike();
      case "clickableItems":
        return this.renderClickableItems();
      case "description":
        return this.renderDescription();
      case "rulesRegulations":
        return this.renderRulesRegulations();
      case "showFeatures":
        return this.renderShowFeatures();
      case "ticketsAndDirectionsButtons":
        return this.renderTicketsAndDirectionsButtons();
      default:
        return null;
    }
  };

  renderHeader = () => {
    return (
      <View
        style={this.styles.detailOverlayHeaderWrap}
        pointerEvents="box-none"
      >
        <TouchableOpacity
          testID="backBtn"
          onPress={this.goBack}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        />
        <TouchableOpacity
          testID="hamburgerIcon"
          onPress={this.onPressDrawer}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        />
      </View>
    );
  };

  renderHeroHeader = () => {
    const liked = this.getDetailAttributes()?.like_by_me;
    return (
      <View style={this.styles.detailHeroTopBar} pointerEvents="box-none">
        <SafeAreaView edges={["top"]} pointerEvents="box-none">
          <View style={this.styles.detailHeroTopBarInner}>
            <TouchableOpacity
              style={this.styles.detailCircleBtn}
              onPress={this.goBack}
              activeOpacity={0.8}
            >
              <Icon name="arrow-left" size={18} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={this.styles.detailHeaderRight}>
              <TouchableOpacity
                style={this.styles.detailCircleBtn}
                onPress={this.handleShareWithFriends}
                activeOpacity={0.8}
              >
                <Icon name="share-2" size={16} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[this.styles.detailCircleBtn, this.styles.detailCircleBtnGap]}
                onPress={this.handleLikeDislikePress}
                activeOpacity={0.8}
              >
                <Icon
                  name="heart"
                  size={16}
                  color={liked ? this.getHomeTheme().primary : "#FFFFFF"}
                />
              </TouchableOpacity>
              <TouchableOpacity
                testID="threeDotIcon"
                style={[this.styles.detailCircleBtn, this.styles.detailCircleBtnGap]}
                onPress={this.handleThreeDots}
                activeOpacity={0.8}
              >
                <Icon name="more-vertical" size={16} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[this.styles.detailCircleBtn, this.styles.detailCircleBtnGap]}
                onPress={this.onPressDrawer}
                activeOpacity={0.8}
              >
                <Icon name="menu" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </View>
    );
  };

  renderHeroFade = () => null;

  renderEventImage = () => {
    const attributes = this.getDetailAttributes();
    return (
      <View style={this.state.showMenu ? { zIndex: 50, elevation: 50 } : undefined}>
        <View style={this.styles.detailHeroWrap}>
          {attributes?.profile_image
            ? this.renderEventImageWithData()
            : this.renderEventImageWithoutData()}
          <View pointerEvents="none" style={this.styles.detailHeroScrim} />
          {this.renderHeroFade()}
          {this.renderHeroHeader()}
          <View style={this.styles.detailHeroMeta} pointerEvents="box-none">
            {this.isShowTonight() ? (
              <View style={this.styles.detailHotBadge}>
                <MaterialCommunityIcons
                  name="fire"
                  size={13}
                  color="#FFFFFF"
                />
                <Text style={this.styles.detailHotBadgeText}>HOT TONIGHT</Text>
              </View>
            ) : null}
            {attributes?.state ? (
              <Text style={this.styles.detailStateCaption} numberOfLines={1}>
                {`Shows in ${attributes.state}`}
              </Text>
            ) : null}
            <Text style={this.styles.detailHeroTitle} numberOfLines={4}>
              {attributes?.event_title || ""}
            </Text>
            <View style={this.styles.detailHeroMetaRow}>
              {this.getGenreDisplay() ? (
                <View style={this.styles.detailGenrePill}>
                  <Text style={this.styles.detailGenrePillText} numberOfLines={1}>
                    {this.getGenreDisplay()}
                  </Text>
                </View>
              ) : null}
              {this.getTicketPriceLabel() ? (
                <Text style={this.styles.detailPriceText}>
                  {this.getTicketPriceLabel()}
                </Text>
              ) : null}
            </View>
          </View>
        </View>
        {this.renderMenuPopup()}
      </View>
    );
  };

  renderTitle = () => {
    const attributes = this.getDetailAttributes();
    const showPostponed = attributes?.date_of_the_show === "2999-12-31";
    const showSoldOut = Boolean(attributes?.sold_out);
    if (!showPostponed && !showSoldOut) {
      return <View />;
    }
    return (
      <View style={[this.styles.detailSection, this.styles.detailBadgeRow]}>
        {showPostponed && (
          <Image
            source={require("../../../mobile/assets/images/postponed.png")}
            style={this.styles.detailStatusBadge}
          />
        )}
        {showSoldOut && (
          <Image
            source={require("../../../mobile/assets/images/sold_out.png")}
            style={this.styles.detailSoldOutBadge}
          />
        )}
      </View>
    );
  };

  renderEventImageWithData = () => {
    return (
      <FastImage
        style={this.styles.detailHeroImage}
        source={{
          uri: this.state.eventDetail.attributes.profile_image,
          priority: FastImage.priority.high,
        }}
        resizeMode={FastImage.resizeMode.cover}
      />
    );
  };

  renderEventImageWithoutData = () => {
    return (
      <View style={this.styles.detailHeroPlaceholder}>
        <Image
          source={require("../../../mobile/assets/images/gallery.png")}
          style={[this.styles.gallery, { tintColor: this.getHomeTheme().muted }]}
        />
      </View>
    );
  };

  renderLike = () => {
    const attributes = this.getDetailAttributes();
    const liked = attributes?.like_by_me;
    const likesCount = attributes?.likes_count ?? 0;
    const listCount = (this.state.commentsList || []).length;
    const storedCount = parseInt(attributes?.comments_count, 10) || 0;
    const commentsCount = listCount > 0 ? listCount : storedCount;
    const sharesCount =
      attributes?.shares_count ??
      attributes?.share_count ??
      attributes?.reposts_count ??
      0;
    const addedInCalendar = attributes?.added_in_calendar;
    const iconColor = this.getHomeTheme().muted;

    return (
      <View style={this.styles.detailSection}>
        <View style={this.styles.detailStatsBar}>
          <View style={this.styles.detailStatItem}>
            <TouchableOpacity
              testID="likeDislikeBtn"
              onPress={this.handleLikeDislikePress}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
            >
              <Icon
                name="heart"
                size={18}
                color={liked ? this.getHomeTheme().primary : iconColor}
              />
            </TouchableOpacity>
            <TouchableOpacity
              testID="likeText"
              onPress={this.handleLikeTextPress}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
            >
              <Text style={this.styles.detailStatCount}>{likesCount}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={this.styles.detailStatItem}
            onPress={this.handleOpenComments}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
          >
            <Icon name="message-circle" size={18} color={iconColor} />
            <Text style={this.styles.detailStatCount}>{commentsCount}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={this.styles.detailStatItem}
            onPress={this.handleShareWithFriends}
            activeOpacity={0.7}
          >
            <Icon name="repeat" size={18} color={iconColor} />
            <Text style={this.styles.detailStatCount}>{sharesCount}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={this.styles.detailStatItem}
            onPress={
              addedInCalendar
                ? this.openRemoveFromCalendarPopup
                : this.handleAddToCalendarPress
            }
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Icon
              name="calendar"
              size={18}
              color={addedInCalendar ? this.getHomeTheme().primary : iconColor}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  renderClickableItems = () => {
    const { attributes } = this.state.eventDetail;
    const fullAddress = this.getFullAddress();

    const details = [
      {
        icon: "calendar",
        label: "Date",
        value:
          attributes?.date_of_the_show === "2999-12-31"
            ? "To Be Determined"
            : attributes?.date_of_the_show,
        onPress: null,
        transformValue:
          attributes?.date_of_the_show !== "2999-12-31" &&
          this.convertDateFormat,
      },
      {
        icon: "clock",
        label: "Time",
        value:
          attributes?.date_of_the_show === "2999-12-31"
            ? "To Be Determined"
            : attributes?.time,
        onPress: null,
        transformValue:
          attributes?.date_of_the_show !== "2999-12-31" && this.convertTime,
      },
      {
        icon: "map-pin",
        label: "Location",
        value: attributes?.location,
        onPress: () => this.openGoogleMaps(attributes),
      },
      { icon: "home", label: "Address", value: fullAddress, onPress: null },
      {
        icon: "globe",
        label: "Website",
        value: attributes?.website,
        onPress: () => this.openWebsiteURL(attributes?.website),
      },
      {
        icon: "headphones",
        label: "Line up",
        value: attributes?.line_ups?.length === 0 ? "" : attributes?.line_ups,
        onPress: null,
      },
      {
        icon: "music",
        label: "Show type",
        value: attributes?.type_of_show,
        onPress: null,
      },
      {
        icon: "music",
        label: "Genre",
        value: this.formatGenreLabel(attributes?.genre),
        onPress: null,
      },
    ];

    const lineupDetail = details.find((d) => d.label === "Line up");
    const addressDetail = details.find((d) => d.label === "Address");
    const showTypeDetail = details.find((d) => d.label === "Show type");
    const genreDetail = details.find((d) => d.label === "Genre");
    const websiteDetail = details.find((d) => d.label === "Website");

    return (
      <View style={this.styles.detailSection}>
        <View style={this.styles.detailInfoCardsRow}>
          <View style={[this.styles.detailInfoCard, this.styles.detailInfoCardFirst]}>
            <Icon name="calendar" size={16} color={this.getHomeTheme().primary} />
            <Text style={this.styles.detailInfoCardLabel}>Date</Text>
            <Text style={this.styles.detailInfoCardValue} numberOfLines={1}>
              {this.formatInfoCardDate() || "—"}
            </Text>
          </View>
          <View style={this.styles.detailInfoCard}>
            <Icon name="clock" size={16} color={this.getHomeTheme().primary} />
            <Text style={this.styles.detailInfoCardLabel}>Doors</Text>
            <Text style={this.styles.detailInfoCardValue} numberOfLines={1}>
              {this.formatInfoCardTime() || "—"}
            </Text>
          </View>
          <View style={[this.styles.detailInfoCard, this.styles.detailInfoCardLast]}>
            <Icon name="map-pin" size={16} color={this.getHomeTheme().primary} />
            <Text style={this.styles.detailInfoCardLabel}>City</Text>
            <Text style={this.styles.detailInfoCardValue} numberOfLines={1}>
              {attributes?.city || "—"}
            </Text>
          </View>
        </View>

        {lineupDetail?.value ? (
          <>
            <Text style={this.styles.detailSectionLabel}>LINEUP</Text>
            {this.renderLineUp(lineupDetail)}
          </>
        ) : null}

        {this.renderAboutSection()}

        {this.renderVenueCard(attributes, fullAddress)}

        {addressDetail
          ? this.renderClickableItem(addressDetail, 3)
          : null}
        {this.renderEventCreatorCategoryRow()}
        {showTypeDetail
          ? this.renderClickableItem(showTypeDetail, 6)
          : null}
        {genreDetail
          ? this.renderClickableItem(genreDetail, 7)
          : null}
        {websiteDetail?.value
          ? this.renderClickableItem(websiteDetail, 4)
          : null}
      </View>
    );
  };

  renderVenueCard = (attributes: any, fullAddress: string) => {
    const venueName = attributes?.location;
    if (!venueName && !fullAddress) return null;
    return (
      <View>
        <Text style={this.styles.detailSectionLabel}>VENUE</Text>
        <TouchableOpacity
          testID="clickableItem"
          style={this.styles.detailVenueCard}
          onPress={() => this.openGoogleMaps(attributes)}
          activeOpacity={0.8}
        >
          <View style={this.styles.detailVenueIconWrap}>
            <MaterialCommunityIcons
              name="office-building"
              size={22}
              color={this.getHomeTheme().foreground}
            />
          </View>
          <View style={this.styles.detailVenueTextWrap}>
            <Text style={this.styles.detailVenueName} numberOfLines={1}>
              {venueName || "Venue"}
            </Text>
            {fullAddress ? (
              <Text style={this.styles.detailVenueAddress}>{fullAddress}</Text>
            ) : null}
          </View>
          <Icon name="external-link" size={16} color={this.getHomeTheme().muted} />
        </TouchableOpacity>
      </View>
    );
  };

  renderEventCreatorCategoryRow = () => {
    const creator = this.state.eventDetail?.attributes?.event_creator;
    if (!creator) {
      return null;
    }
    const accountTypeLabel = this.formatEventCreatorAccountTypeLabel(
      creator?.account_type || ""
    );
    const canNavigate = Boolean(creator?.id);

    return (
      <View style={this.styles.detailWebsiteRow}>
        <View
          style={[this.styles.eventDetails, { alignItems: "center", flex: 0 }]}
        >
          <Icon name="tag" size={16} color={this.getHomeTheme().primary} />
          <Text style={[this.styles.detailMetaLabel, { marginLeft: 8 }]}>
            Category
          </Text>
        </View>
        {canNavigate ? (
          <TouchableOpacity
            testID="eventCreatorCategoryType"
            style={{ flex: 1 }}
            onPress={() =>
              this.openEventCreatorProfileForCategoryRow(
                String(creator?.id),
                creator?.account_type
              )
            }
            activeOpacity={0.7}
          >
            <Text style={this.styles.detailMetaValue}>{accountTypeLabel}</Text>
          </TouchableOpacity>
        ) : (
          <Text style={[this.styles.detailMetaValue, { color: this.getHomeTheme().foreground }]}>
            {accountTypeLabel}
          </Text>
        )}
      </View>
    );
  };

  renderClickableItem = (detail: any, index: number) => {
    const { label, value, onPress } = detail;

    if (
      value === null ||
      value === undefined ||
      value === "" ||
      (Array.isArray(value) && value.length === 0)
    ) {
      return null;
    }

    const textComponent = onPress ? (
      <>{this.renderClickableTextWithPress(detail)}</>
    ) : (
      <>{this.renderClickableTextWithoutPress(detail)}</>
    );

    return (
      <View
        testID="clickableID"
        key={index}
        style={this.styles.detailWebsiteRow}
      >
        <View
          style={[
            this.styles.eventDetails,
            { alignItems: "flex-start", flex: 0, paddingTop: 2 },
          ]}
        >
          <Icon name={detail.icon} size={16} color={this.getHomeTheme().primary} />
          <Text style={[this.styles.detailMetaLabel, { marginLeft: 8 }]}>
            {label}
          </Text>
        </View>
        {textComponent}
      </View>
    );
  };

  renderClickableTextWithPress = (detail: any) => {
    const { label, value } = detail;
    return (
      <TouchableOpacity
        testID="clickableItem"
        style={{ flex: 1 }}
        onPress={detail.onPress}
      >
        {label === "Location" ? (
          <Text style={[this.styles.detailMetaValue, { color: this.getHomeTheme().foreground }]}>
            At <Text style={{ color: this.getHomeTheme().primary }}>{`${value}`}</Text>
          </Text>
        ) : (
          <Text
            style={[
              this.styles.detailMetaValue,
              {
                color: label === "Website" ? this.getHomeTheme().primary : this.getHomeTheme().foreground,
              },
            ]}
          >
            {value}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  renderClickableTextWithoutPress = (detail: any) => {
    const { label } = detail;
    return (
      <View style={{ flex: 1 }}>
        {label === "Show type"
          ? this.renderShowType(detail)
          : this.renderLineUpAndOthers(detail)}
      </View>
    );
  };

  renderAboutSection = () => {
    const description = this.state.eventDetail.attributes?.description;
    if (!description) {
      return null;
    }
    return (
      <View style={{ marginTop: 8, marginBottom: 8 }}>
        <Text style={this.styles.detailSectionLabel}>ABOUT</Text>
        <Text style={this.styles.detailAboutText}>{description}</Text>
      </View>
    );
  };

  renderDescription = () => {
    return <View />;
  };

  getRulesItems = () => {
    const raw =
      this.state.eventDetail.attributes?.rules_and_regulations_icons ??
      this.state.eventDetail.attributes?.rules_and_regulations ??
      [];
    const list = Array.isArray(raw)
      ? raw
      : typeof raw === "string"
        ? [raw]
        : raw
          ? [raw]
          : [];
    return list
      .map((item: any) =>
        typeof item === "string"
          ? { title: item, description: "" }
          : {
              title: item?.title ?? item?.name ?? item?.text ?? "",
              description: item?.description ?? item?.detail ?? "",
            }
      )
      .filter(
        (item: { title: string }) =>
          item.title !== null &&
          item.title !== "" &&
          String(item.title).trim() !== ""
      );
  };

  renderRulesRegulations = () => {
    const items = this.getRulesItems();
    const hasRules = items.length > 0;
    const expanded = this.state.showFullText;
    const maxInline = 5;
    const displayedInline = items.slice(0, maxInline);
    const otherRules = items.slice(maxInline);
    const hasMoreRules = otherRules.length > 0;
    const visibleItems = expanded ? items : displayedInline;

    return (
      <View style={[this.styles.detailSection, { marginTop: 8 }]}>
        <TouchableOpacity
          style={[
            this.styles.detailRulesHeader,
            expanded && hasRules ? this.styles.detailRulesHeaderOpen : null,
          ]}
          onPress={this.toggleRulesAccordion}
          activeOpacity={0.8}
        >
          <Text style={this.styles.detailRulesHeaderText}>
            Venue Rules & Regulations
          </Text>
          <Icon
            name={expanded ? "chevron-up" : "chevron-down"}
            size={18}
            color={this.getHomeTheme().foreground}
          />
        </TouchableOpacity>
        {expanded ? (
          <View style={this.styles.detailRulesBody}>
            {hasRules ? (
              <>
                {visibleItems.map(
                  (
                    item: { title: string; description: string },
                    index: number
                  ) => (
                    <View key={index} style={this.styles.detailRuleRow}>
                      <Icon
                        name="check-circle"
                        size={16}
                        color={this.getHomeTheme().primary}
                        style={this.styles.detailRuleIcon}
                      />
                      <View style={{ flex: 1 }}>
                        <Text style={this.styles.detailRuleTitle}>{item.title}</Text>
                        {item.description ? (
                          <Text style={this.styles.detailRuleText}>
                            {item.description}
                          </Text>
                        ) : null}
                      </View>
                    </View>
                  )
                )}
                {hasMoreRules && !expanded ? (
                  <TouchableOpacity
                    testID="showMoreRulesBtn"
                    onPress={() => this.setState({ showRulesMoreModal: true })}
                    style={{ marginTop: 8 }}
                  >
                    <Text
                      style={[
                        this.styles.detailRuleTitle,
                        { color: this.getHomeTheme().primary, fontWeight: "700" },
                      ]}
                    >
                      Show more
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </>
            ) : (
              <Text style={[this.styles.detailRuleText, { marginTop: 8 }]}>
                No rules specified.
              </Text>
            )}
          </View>
        ) : null}
        {hasMoreRules ? (
          <TouchableOpacity
            testID="showMoreRulesBtn"
            onPress={() => this.setState({ showRulesMoreModal: true })}
            style={{ height: 0, overflow: "hidden" }}
          />
        ) : null}
      </View>
    );
  };

  closeRulesMoreModal = () => {
    this.setState({ showRulesMoreModal: false });
  };

  renderRulesMoreModal = () => {
    const { showRulesMoreModal } = this.state;
    const items = this.getRulesItems();
    const otherRules = items.slice(5);
    if (otherRules.length === 0) return null;

    const windowHeight = Dimensions.get("window").height;
    const modalMaxHeight = Math.min(windowHeight * 0.75, 500);

    return (
      <Modal
        transparent
        animationType="fade"
        visible={showRulesMoreModal}
        onRequestClose={this.closeRulesMoreModal}
      >
        <View
          style={[
            this.styles.centeredView,
            {
              backgroundColor: "rgba(8, 8, 15, 0.72)",
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 20,
            },
          ]}
        >
          <TouchableWithoutFeedback onPress={this.closeRulesMoreModal}>
            <View style={StyleSheet.absoluteFill} />
          </TouchableWithoutFeedback>
          <View
            style={[
              this.styles.modalView,
              this.styles.reportModalContent,
              { height: modalMaxHeight, maxWidth: "100%" },
            ]}
          >
            <View style={this.styles.reportHeader}>
              <Text style={this.styles.reportTitle}>Rules and Regulations</Text>
              <TouchableOpacity
                testID="closeRulesMoreModal"
                onPress={this.closeRulesMoreModal}
              >
                <Svg width={20} height={20} viewBox="0 0 14 14" fill={this.getHomeTheme().foreground}>
                  <Path
                    d="M13.3.71a.996.996 0 00-1.41 0L7 5.59 2.11.7A.996.996 0 10.7 2.11L5.59 7 .7 11.89a.996.996 0 101.41 1.41L7 8.41l4.89 4.89a.996.996 0 101.41-1.41L8.41 7l4.89-4.89c.38-.38.38-1.02 0-1.4z"
                    fill={this.getHomeTheme().foreground}
                  />
                </Svg>
              </TouchableOpacity>
            </View>
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{ paddingBottom: 24 }}
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled={true}
              bounces={true}
            >
              {otherRules.map(
                (
                  item: { title: string; description: string },
                  index: number
                ) => (
                  <View key={index} style={{ marginBottom: 12 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "flex-start",
                      }}
                    >
                      <Image
                        source={tick_circle_black}
                        style={{
                          width: 15,
                          height: 15,
                          marginRight: 8,
                          marginTop: 4,
                        }}
                      />
                      <Text
                        style={[
                          this.styles.boldText,
                          { lineHeight: 22, fontWeight: "400", flex: 1 },
                        ]}
                      >
                        {item.title}
                      </Text>
                    </View>
                  </View>
                )
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  renderShowFeatures = () => {
    return (
      <>
        {this.state.eventDetail.attributes?.show_features !== null && (
          <View style={this.styles.detailSection}>
            <FlatList
              testID="showFeaturesFlatlist"
              contentContainerStyle={{ marginTop: 8 }}
              data={this.state.eventDetail.attributes?.show_features}
              renderItem={({ item }: { item: any }) => {
                return (
                  <View style={this.styles.detailFeatureRow}>
                    <Icon
                      name="check-circle"
                      size={14}
                      color={this.getHomeTheme().primary}
                      style={{ marginRight: 6, marginTop: 4 }}
                    />
                    <Text style={this.styles.detailFeatureText}>
                      {item.feature_name}
                    </Text>
                  </View>
                );
              }}
              numColumns={2}
            />
          </View>
        )}
      </>
    );
  };

  renderShowType = (detail: any) => {
    const { value } = detail;
    if (!Array.isArray(value)) {
      const text =
        typeof value === "string" ? value : this.formatGenreLabel(value);
      if (!text) return null;
      return (
        <Text style={[this.styles.detailMetaValue, { color: this.getHomeTheme().foreground }]}>
          {text}
        </Text>
      );
    }
    return (
      <FlatList
        testID="typeOfShowFlatlist"
        numColumns={20}
        columnWrapperStyle={{ flexWrap: "wrap" }}
        data={value}
        keyExtractor={(item: any, index) => item?.id ?? index.toString()}
        renderItem={({ item, index }) => {
          const displayName =
            item?.name ??
            (typeof item === "string" ? item : "N/A");
          const isLast = index === value?.length - 1;

          return (
            <Text style={[this.styles.detailMetaValue, { color: this.getHomeTheme().foreground }]}>
              {isLast ? displayName : `${displayName}, `}
            </Text>
          );
        }}
      />
    );
  };

  renderLineUpAndOthers = (detail: any) => {
    const { value, transformValue, label } = detail;
    const transformedValue = transformValue ? transformValue(value) : value;
    return (
      <>
        {label === "Line up" ? (
          this.renderLineUp(detail)
        ) : (
          <Text
            style={[
              this.styles.detailMetaValue,
              { color: this.getHomeTheme().foreground, flexShrink: 1 },
            ]}
          >
            {transformedValue}
          </Text>
        )}
      </>
    );
  };

  renderLineUp = (detail: any) => {
    const { value } = detail;

    return (
      <FlatList
        testID="lineupFlatlist"
        data={value}
        scrollEnabled={false}
        renderItem={({ item, index }) => {
          const isHeadliner = index === 0;
          return (
            <TouchableOpacity
              testID="lineup"
              style={this.styles.detailLineupRow}
              onPress={() => this.showProfile(item?.id, "Artist")}
              activeOpacity={0.8}
            >
              <View
                style={[
                  this.styles.detailLineupIndex,
                  isHeadliner && this.styles.detailLineupIndexActive,
                ]}
              >
                <Text
                  style={[
                    this.styles.detailLineupIndexText,
                    isHeadliner && this.styles.detailLineupIndexTextActive,
                  ]}
                >
                  {index + 1}
                </Text>
              </View>
              <Text style={this.styles.detailLineupName}>
                {this.getLineupName(item)}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    );
  };

  renderMoreShowsAtVenue = () => {
    const moreShows = this.getMoreShowsAtVenue();
    const creator = this.state.eventDetail?.attributes?.event_creator;
    if (moreShows.length === 0 && !creator?.id) return null;

    return (
      <View style={{ marginTop: 16 }}>
        {moreShows.length > 0 ? (
          <>
            <Text
              style={[this.styles.detailSectionLabel, this.styles.detailSection]}
            >
              MORE SHOWS AT THIS VENUE
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={this.styles.detailMoreShowsRow}
            >
              {moreShows.map((show: any) => {
                const data = show?.attributes || show;
                const title =
                  data?.event_title || data?.name || data?.band_name || "";
                const dateValue = data?.date_of_the_show;
                const dateLabel =
                  dateValue === "2999-12-31"
                    ? "TBD"
                    : dateValue && moment.utc(dateValue).isSame(moment(), "day")
                      ? "Tonight"
                      : dateValue
                        ? moment.utc(dateValue).format("ddd, MMM D")
                        : "";
                return (
                  <TouchableOpacity
                    key={String(show?.id || data?.id)}
                    style={this.styles.detailMoreShowCard}
                    onPress={() => {
                      const launchShow = {
                        ...(show?.attributes || show),
                        id: show?.id || data?.id,
                        type: show?.type || data?.type || "show",
                        account_id: show?.account_id || data?.account_id,
                      };
                      this.handleEventLaunch(
                        launchShow,
                        data?.state || this.getDetailAttributes()?.state
                      );
                    }}
                    activeOpacity={0.85}
                  >
                    {data?.profile_image ? (
                      <FastImage
                        style={this.styles.detailMoreShowImage}
                        source={{
                          uri: data.profile_image,
                          priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                      />
                    ) : (
                      <View
                        style={[
                          this.styles.detailMoreShowImage,
                          { backgroundColor: this.getHomeTheme().input },
                        ]}
                      />
                    )}
                    <View pointerEvents="none" style={this.styles.detailMoreShowFade} />
                    <View style={this.styles.detailMoreShowMeta}>
                      <Text style={this.styles.detailMoreShowTitle} numberOfLines={1}>
                        {title}
                      </Text>
                      {dateLabel ? (
                        <Text style={this.styles.detailMoreShowDate}>
                          {dateLabel}
                        </Text>
                      ) : null}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </>
        ) : null}
        {creator?.id ? (
          <View style={this.styles.detailSection}>
            <TouchableOpacity
              style={this.styles.detailVenueProfileBtn}
              onPress={() =>
                this.openEventCreatorProfileForCategoryRow(
                  String(creator?.id),
                  creator?.account_type
                )
              }
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons
                name="office-building"
                size={18}
                color={this.getHomeTheme().primary}
              />
              <Text style={this.styles.detailVenueProfileBtnText}>
                View Venue Profile
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    );
  };

  renderTicketsAndDirectionsButtons = () => {
    const renderButton = (
      testID: string,
      isPrimary: boolean,
      buttonText: string,
      onPress?: () => void,
      iconName?: string
    ) => (
      <TouchableOpacity
        testID={testID}
        style={isPrimary ? this.styles.detailPrimaryBtn : this.styles.detailSecondaryBtn}
        onPress={onPress || this.handleTicketDirectionButton}
        activeOpacity={0.85}
      >
        {iconName ? (
          <MaterialCommunityIcons name={iconName} size={18} color="#FFFFFF" />
        ) : null}
        <Text
          style={
            isPrimary
              ? this.styles.detailPrimaryBtnText
              : this.styles.detailSecondaryBtnText
          }
        >
          {buttonText}
        </Text>
      </TouchableOpacity>
    );

    const isVerified = this.state.eventDetail.attributes?.verified === true;
    const priceLabel = this.getTicketPriceLabel();
    const ticketLabel = priceLabel
      ? `GET TICKETS — ${priceLabel}`
      : "GET TICKETS";

    return (
      <View>
        {this.renderMoreShowsAtVenue()}
        <View style={[this.styles.detailSection, this.styles.detailTicketsWrap]}>
          {isVerified &&
            renderButton(
              "buyTicketBtn",
              true,
              ticketLabel,
              this.handleBuyTicketPress,
              "ticket-confirmation-outline"
            )}
          {renderButton("directionsBtn", !isVerified, "Directions")}
        </View>
      </View>
    );
  };

  renderLoginModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.loginPopup}
      >
        <View style={[this.styles.centeredView, { backgroundColor: "rgba(8, 8, 15, 0.72)" }]}>
          <View style={[this.styles.modalView]}>
            {this.renderCloseButton()}
            <Text style={this.styles.welcomeToPopupText}>{"Welcome to"}</Text>
            <Text style={this.styles.localShowsPopupText}>{"Local Shows"}</Text>
            <Text style={this.styles.loginFirstPopupText}>
              {"You have to Log in first to access the events."}
            </Text>
            <TouchableOpacity
              testID="createAccountBtn"
              onPress={() => {
                this.moveToLoginScreen("signup");
              }}
            >
              <Text style={this.styles.createAccountPopupText}>
                {"Create new account"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              testID="loginBtn"
              style={this.styles.loginBtnPopupText}
              onPress={() => {
                this.moveToLoginScreen("login");
              }}
            >
              <Text style={this.styles.loginTxtPopupText}>{"Log in"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  renderCloseButton = () => {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        style={this.styles.closeBtn}
        testID="popupCloseButton"
        onPress={this.handleCloseBtn}
      >
        <Svg width={14} height={14} viewBox="0 0 14 14" fill={this.getHomeTheme().foreground}>
          <Path
            d="M13.3.71a.996.996 0 00-1.41 0L7 5.59 2.11.7A.996.996 0 10.7 2.11L5.59 7 .7 11.89a.996.996 0 101.41 1.41L7 8.41l4.89 4.89a.996.996 0 101.41-1.41L8.41 7l4.89-4.89c.38-.38.38-1.02 0-1.4z"
            fill={this.getHomeTheme().foreground}
          />
        </Svg>
      </TouchableOpacity>
    );
  };

  renderMenuPopup = () => {
    const addedInCalendar =
      this.state.eventDetail.attributes?.added_in_calendar;
    return (
      <>
        {this.state.showMenu && (
          <View style={this.styles.detailMenuContainer}>
            {addedInCalendar ? (
              <TouchableOpacity
                testID="removeFromCalendar"
                style={[this.styles.menuButton, { marginBottom: 5 }]}
                onPress={this.openRemoveFromCalendarPopup}
              >
                <Text style={this.styles.detailMenuButtonText}>
                  {"Remove event from calendar"}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                testID="addToCalendar"
                style={[this.styles.menuButton, { marginBottom: 5 }]}
                onPress={this.handleAddToCalendarPress}
              >
                <Text style={this.styles.detailMenuButtonText}>
                  {"Add event to calendar"}
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              testID="shareWithFriend"
              style={this.styles.menuButton}
              onPress={this.handleShareWithFriends}
            >
              <Text style={this.styles.detailMenuButtonText}>
                {"Share with friend"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              testID="reportShow"
              style={this.styles.menuButton}
              onPress={this.openReportModal}
            >
              <Text style={this.styles.detailMenuButtonText}>{"Report Show"}</Text>
            </TouchableOpacity>
          </View>
        )}
      </>
    );
  };

  renderRemoveEventFromCalendar = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.removeEventModalVisible}
      >
        <View style={[this.styles.centeredView, { backgroundColor: "rgba(8, 8, 15, 0.72)" }]}>
          <View style={[this.styles.modalView, { height: "40%" }]}>
            <TouchableOpacity
              testID="btnHideModal"
              style={this.styles.disablePopupIconContainer}
              onPress={this.closeRemoveFromCalendar}
            >
              <Icon name="x" color={this.getHomeTheme().foreground} size={25} />
            </TouchableOpacity>
            <Text style={this.styles.textDeleteHeading}>{"Remove event?"}</Text>
            <Text style={[this.styles.txt, this.styles.textDelete]}>
              {"Are you sure you want to delete the event from the calendar."}
            </Text>
            <TouchableOpacity
              testID="btnKeepEventModal"
              style={[this.styles.deleteButtonContainer, this.styles.keepButtonContainer]}
              onPress={this.closeRemoveFromCalendar}
            >
              <Text
                style={[
                  this.styles.txt,
                  this.styles.textDeleteButton,
                  this.styles.textKeepButton,
                ]}
              >
                {"No, Keep it!"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              testID="btnDeleteEventModal"
              style={this.styles.deleteButtonContainer}
              onPress={this.handleRemoveFromCalendar}
            >
              <Text style={[this.styles.txt, this.styles.textDeleteButton]}>
                {"Yes, Remove it!"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  handleOpenComments = () => {
    if (!this.state.authToken) {
      this.setState({ loginPopup: true });
      return;
    }
    const eventId =
      this.state.selectedEventId ||
      this.state.eventDetail?.data?.id ||
      this.state.eventDetail?.attributes?.id;
    if (!eventId) {
      return;
    }
    const type = this.state.eventDetail?.data?.type || "show";
    this.handleShowCommentClicked(String(eventId), type);
  };

  handleDetailSubmitComment = () => {
    const isNewComment =
      !this.state.replying &&
      !this.state.showReplies &&
      !this.state.isEditing;
    const hasText = this.state.commentText.trim() !== "";
    this.handleSubmitEditing();
    if (isNewComment && hasText) {
      const attributes = this.state.eventDetail?.attributes;
      if (attributes) {
        const currentCount = parseInt(attributes.comments_count, 10) || 0;
        this.setState({
          eventDetail: {
            ...this.state.eventDetail,
            attributes: {
              ...attributes,
              comments_count: currentCount + 1,
            },
          },
        });
      }
    }
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
                    <Icon name="x" size={25} />
                  </TouchableOpacity>
                </View>
                <View style={this.styles.horizontalRuler} />
                {this.state.isLoadingComments ? (
                  <View style={this.styles.noCommentsContainer}>
                    <ActivityIndicator size="large" color={this.getHomeTheme().primary} />
                  </View>
                ) : (
                  this.handleCommentsRendering()
                )}
              </Pressable>
              <View style={this.styles.emojiSelectionBar}>
                {this.defaultEmojisForSelectionBar.map(
                  (emoji: string, i: number) => (
                    <TouchableOpacity
                      key={`comment-emoji-${i}`}
                      onPress={() => this.handleEmojiSelected(emoji)}
                    >
                      <Text style={this.styles.emojiSelectionBarIcon}>{emoji}</Text>
                    </TouchableOpacity>
                  )
                )}
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
                  ref={(input) => {
                    this.commentTextInput = input;
                  }}
                  style={this.styles.commentTextInput}
                  placeholder={
                    this.state.replying ? "Add a reply..." : "Add a comment..."
                  }
                  placeholderTextColor={this.getHomeTheme().muted}
                  value={this.state.commentText}
                  onChangeText={(commentText) =>
                    this.handleCommentTextChange(commentText)
                  }
                  multiline
                />
                <TouchableOpacity
                  testID="emojiComment"
                  style={this.styles.emojiButton}
                  onPress={this.handleDetailSubmitComment}
                  activeOpacity={0.7}
                >
                  <View
                    style={{
                      width: 30,
                      height: 30,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <MaterialIcons name="send" color={this.getHomeTheme().muted} size={28} />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    );
  };

  handleCommentsRendering = () => {
    return (
      <>
        {(this.state.commentsList || []).length ? (
          <View style={this.styles.commentsListContainer}>
            <SwipeListView
              bounces={false}
              alwaysBounceVertical={false}
              alwaysBounceHorizontal={false}
              testID="swipeListView"
              data={this.state.commentsList || []}
              keyExtractor={(row: any, rowIndex: number) =>
                row?.id != null && row.id !== ""
                  ? String(row.id)
                  : `comment-${rowIndex}`
              }
              showsVerticalScrollIndicator={false}
              renderItem={this.renderCommentItem}
              renderHiddenItem={this.renderCommentsHiddenItem}
              rightOpenValue={-120}
              extraData={this.state.showRepliesFor}
              listKey="detail-comments"
            />
          </View>
        ) : (
          <View style={this.styles.noCommentsContainer}>
            <Icon name="message-square" size={60} color={this.getHomeTheme().muted} />
            <Text style={this.styles.commentsHeadingText}>No comments yet</Text>
            <Text style={this.styles.startConversationText}>
              Start the conversation
            </Text>
          </View>
        )}
        {this.state.commentsLoading && (
          <View
            style={{
              height: "100%",
              width: "100%",
              position: "absolute",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ActivityIndicator size="large" color={this.getHomeTheme().primary} />
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
            <Icon name="corner-up-left" size={25} color={"white"} />
          </TouchableOpacity>
          <TouchableOpacity
            testID="deleteComment"
            style={[this.styles.backRightBtn, this.styles.backRightBtnRight]}
            onPress={() => {
              this.deleteCommentAPI(data.item.id);
            }}
          >
            <Icon name="trash" size={25} color={"white"} />
          </TouchableOpacity>
        </View>
      )}
    </>
  );

  renderCommentItem = ({ item }: { item: any }) => {
    const replies = item?.attributes?.replies;
    const repliesCount = Array.isArray(replies) ? replies.length : 0;
    return (
      <View style={this.styles.rowFront}>
        <TouchableOpacity
          testID="imageShowProfile"
          style={this.styles.userAvatarContainer}
          onPress={() =>
            this.showProfile(
              item.attributes.account.id,
              item.attributes.account.account_type
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
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={this.styles.commenterName}>
              {`${item.attributes.account.first_name}`}
            </Text>
            <Text
              style={[
                this.styles.commenterName,
                { fontWeight: "400", marginLeft: 5 },
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
          {repliesCount !== 0 && (
            <TouchableOpacity
              testID="showReplyButton"
              style={this.styles.showReplyButton}
              onPress={() => this.handleReplyButton(item)}
            >
              <View style={this.styles.horizontalBar} />
              <Text style={this.styles.showReplyButtonText}>
                {`View ${repliesCount} more replies`}
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
              name={item.attributes.like_by_me ? "heart" : "heart-o"}
              size={15}
              color={item.attributes.like_by_me ? this.getHomeTheme().primary : this.getHomeTheme().muted}
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
            <Icon name="corner-up-left" size={25} color={"white"} />
          </TouchableOpacity>
          <TouchableOpacity
            testID="deleteReply"
            style={[this.styles.backRightBtn, this.styles.backRightBtnRight]}
            onPress={() => {
              this.deleteCommentAPI(data.item.id);
            }}
          >
            <Icon name="trash" size={25} color={"white"} />
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
          behavior={this.isPlatformiOS() ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <View style={[this.styles.centeredView, this.styles.commentsParentView]}>
            <View style={[this.styles.modalView, this.styles.commentsView]}>
              <Pressable
                style={{ flex: 1 }}
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
                        resizeMode: "contain",
                        tintColor: this.getHomeTheme().foreground,
                      }}
                    />
                  </TouchableOpacity>
                  <Text style={this.styles.commentsHeadingText}>Replies</Text>
                  <TouchableOpacity
                    testID="closeReplyPopupButton"
                    onPress={this.closeReplyPopup}
                  >
                    <Icon name="x" size={25} />
                  </TouchableOpacity>
                </View>
                <View style={this.styles.horizontalRuler} />
                {this.renderReplies()}
              </Pressable>
              <View style={this.styles.emojiSelectionBar}>
                {this.defaultEmojisForSelectionBar.map(
                  (emoji: string, i: number) => (
                    <TouchableOpacity
                      testID="emojiReply"
                      key={`reply-emoji-${i}`}
                      onPress={() => this.handleEmojiSelected(emoji)}
                    >
                      <Text style={this.styles.emojiSelectionBarIcon}>{emoji}</Text>
                    </TouchableOpacity>
                  )
                )}
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
                  ref={(input) => {
                    this.commentTextInput = input;
                  }}
                  onChangeText={(commentText) =>
                    this.handleCommentTextChange(commentText)
                  }
                  style={this.styles.commentTextInput}
                  placeholder={"Add a reply..."}
                  placeholderTextColor={this.getHomeTheme().muted}
                  multiline={true}
                />
                <TouchableOpacity
                  testID="emojiReplyBtn"
                  style={this.styles.emojiButton}
                  onPress={this.handleSubmitEditing}
                  activeOpacity={0.7}
                >
                  <View
                    style={{
                      width: 30,
                      height: 30,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <MaterialIcons name="send" color={this.getHomeTheme().muted} size={28} />
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
    if (!this.state.commentWithReply?.attributes) {
      return null;
    }
    return (
      <>
        <View style={[this.styles.rowFront]}>
          <TouchableOpacity
            testID="replies"
            style={this.styles.userAvatarContainer}
            onPress={() =>
              this.showProfile(
                this.state.commentWithReply.attributes.account.id,
                this.state.commentWithReply.attributes.account.account_type
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
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={this.styles.commenterName}>
                {this.state.commentWithReply.attributes?.account.first_name}
              </Text>
              <Text
                style={[
                  this.styles.commenterName,
                  { fontWeight: "400", marginLeft: 5 },
                ]}
              >
                {this.timeAgo(
                  this.state.commentWithReply.attributes?.created_at
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
            row?.id != null && row.id !== ""
              ? String(row.id)
              : `reply-${rowIndex}`
          }
          showsVerticalScrollIndicator={false}
          renderItem={this.renderRepliesItem}
          renderHiddenItem={this.renderRepliesHiddenItem}
          rightOpenValue={-120}
          disableRightSwipe
          listKey="detail-replies-thread"
        />
        {this.state.commentsLoading && (
          <View
            style={{
              height: "100%",
              width: "100%",
              position: "absolute",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ActivityIndicator size="large" color={this.getHomeTheme().primary} />
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
            width: "95%",
            alignSelf: "flex-end",
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
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={this.styles.commenterName}>{item.account_name}</Text>
            <Text
              style={[
                this.styles.commenterName,
                { fontWeight: "400", marginLeft: 5 },
              ]}
            >
              {item.created_at ? this.timeAgo(item.created_at) : ""}
            </Text>
          </View>
          <Text style={this.styles.replyText}>{item.reply}</Text>
        </View>
      </View>
    );
  };

  renderDetailLoadError = () => {
    return (
      <View style={{ flex: 1, backgroundColor: this.getHomeTheme().background }}>
        {this.renderHeader()}
        {this.renderHeroHeader()}
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 24,
          }}
        >
          <Text style={this.styles.detailErrorTitle}>{"Unable to load show"}</Text>
          <Text style={this.styles.detailErrorBody}>
            {this.state.detailsLoadError ||
              "Something went wrong. Please try again."}
          </Text>
          {this.state.selectedEventId ? (
            <TouchableOpacity
              testID="retryEventDetailBtn"
              onPress={this.retryEventDetailLoad}
              style={this.styles.detailRetryBtn}
            >
              <Text style={this.styles.detailRetryText}>{"Try Again"}</Text>
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity testID="errorGoBackBtn" onPress={this.goBack}>
            <Text style={this.styles.detailGoBackText}>{"Go Back"}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Customizable Area End

  render() {
    // Customizable Area Start
    const statusBarColor = this.state.loginPopup ? "rgba(8, 8, 15, 0.72)" : this.getHomeTheme().background;
    const isAwaitingDetailData =
      Boolean(this.state.selectedEventId) &&
      !this.hasValidEventDetail() &&
      !this.state.detailsLoadError;
    const showLoader = this.state.detailsLoading || isAwaitingDetailData;
    const showError = !showLoader && Boolean(this.state.detailsLoadError);

    return (
      <SafeAreaView style={this.styles.detailScreen} edges={["bottom"]}>
        <StatusBar
          animated={true}
          hidden={false}
          barStyle={this.state.isDarkMode ? "light-content" : "dark-content"}
          backgroundColor={statusBarColor}
        />

        {showLoader ? (
          <View style={this.styles.detailLoadingContainer} testID="eventDetailLoader">
            <ActivityIndicator size={"large"} color={this.getHomeTheme().primary} />
          </View>
        ) : showError ? (
          this.renderDetailLoadError()
        ) : (
          <>
            <FlatList
              testID="mainFlatList"
              data={this.screenData}
              contentContainerStyle={this.styles.detailListContent}
              renderItem={this.renderItem}
              keyExtractor={(item) => item.type}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={this.renderHeader}
            />
            {this.renderLoginModal()}
            {this.renderRemoveEventFromCalendar()}
            {this.renderReportModal()}
            {this.renderRulesMoreModal()}
            {this.renderCommentsModal()}
            {this.renderRepliesModal()}
          </>
        )}
      </SafeAreaView>
    );
  };

  renderReportModal = () => {
    return (
      <Modal
        transparent
        animationType="slide"
        visible={this.state.showReportModal}
        onRequestClose={this.closeReportModal}
      >
        <KeyboardAvoidingView
          behavior={this.isPlatformiOS() ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <TouchableWithoutFeedback onPress={this.closeReportModal}>
            <View style={[this.styles.centeredView, { backgroundColor: "rgba(8, 8, 15, 0.72)" }]}>
              <TouchableWithoutFeedback>
                <View style={[this.styles.modalView, this.styles.reportModalContent]}>
                  <View style={this.styles.reportHeader}>
                    <Text style={this.styles.reportTitle}>{"Report Show"}</Text>
                    <TouchableOpacity
                      testID="closeReportModal"
                      onPress={this.closeReportModal}
                    >
                      <Svg width={20} height={20} viewBox="0 0 14 14" fill={this.getHomeTheme().foreground}>
                        <Path
                          d="M13.3.71a.996.996 0 00-1.41 0L7 5.59 2.11.7A.996.996 0 10.7 2.11L5.59 7 .7 11.89a.996.996 0 101.41 1.41L7 8.41l4.89 4.89a.996.996 0 101.41-1.41L8.41 7l4.89-4.89c.38-.38.38-1.02 0-1.4z"
                          fill={this.getHomeTheme().foreground}
                        />
                      </Svg>
                    </TouchableOpacity>
                  </View>
                  <ScrollView
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 8 }}
                  >
                    <Text style={this.styles.reportSubtitle}>
                      {"Select a reason for reporting this show:"}
                    </Text>
                    <View style={this.styles.reportReasonsContainer}>
                      {this.reportReasons.map((reason) => {
                        const isSelected = this.state.reportReason === reason;
                        return (
                          <TouchableOpacity
                            key={reason}
                            style={[
                              this.styles.reportReasonButton,
                              isSelected && this.styles.reportReasonButtonSelected,
                            ]}
                            onPress={() => this.selectReportReason(reason)}
                          >
                            <View
                              style={[
                                this.styles.reportRadioOuter,
                                isSelected && this.styles.reportRadioOuterSelected,
                              ]}
                            >
                              {isSelected && <View style={this.styles.reportRadioInner} />}
                            </View>
                            <Text
                              style={[
                                this.styles.reportReasonText,
                                isSelected && this.styles.reportReasonTextSelected,
                              ]}
                            >
                              {reason}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                    {this.state.reportError ? (
                      <Text style={this.styles.reportErrorText}>
                        {this.state.reportError}
                      </Text>
                    ) : null}
                    <Text style={this.styles.reportSubtitle}>
                      {"Additional details (optional)"}
                    </Text>
                    <TextInput
                      testID="reportCommentInput"
                      style={this.styles.reportCommentInput}
                      placeholder={"Add any additional information..."}
                      placeholderTextColor={this.getHomeTheme().muted}
                      multiline
                      numberOfLines={4}
                      value={this.state.reportComment}
                      onChangeText={this.handleReportCommentChange}
                    />
                    <View style={this.styles.reportActions}>
                      <TouchableOpacity
                        testID="cancelReport"
                        style={[this.styles.reportButton, this.styles.reportCancelButton]}
                        onPress={this.closeReportModal}
                      >
                        <Text style={this.styles.reportCancelText}>{"Cancel"}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        testID="submitReport"
                        style={[this.styles.reportButton, this.styles.reportSubmitButton]}
                        onPress={this.submitReport}
                      >
                        <Text style={this.styles.reportSubmitText}>{"Submit Report"}</Text>
                      </TouchableOpacity>
                    </View>
                  </ScrollView>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>
    );
  };

  // Customizable Area End
}

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

import styles from "./AllEventStyle";
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
        style={styles.detailOverlayHeaderWrap}
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
      <View style={styles.detailHeroTopBar} pointerEvents="box-none">
        <SafeAreaView edges={["top"]} pointerEvents="box-none">
          <View style={styles.detailHeroTopBarInner}>
            <TouchableOpacity
              style={styles.detailCircleBtn}
              onPress={this.goBack}
              activeOpacity={0.8}
            >
              <Icon name="arrow-left" size={18} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.detailHeaderRight}>
              <TouchableOpacity
                style={styles.detailCircleBtn}
                onPress={this.handleShareWithFriends}
                activeOpacity={0.8}
              >
                <Icon name="share-2" size={16} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.detailCircleBtn, styles.detailCircleBtnGap]}
                onPress={this.handleLikeDislikePress}
                activeOpacity={0.8}
              >
                <Icon
                  name="heart"
                  size={16}
                  color={liked ? "#ff2d6b" : "#FFFFFF"}
                />
              </TouchableOpacity>
              <TouchableOpacity
                testID="threeDotIcon"
                style={[styles.detailCircleBtn, styles.detailCircleBtnGap]}
                onPress={this.handleThreeDots}
                activeOpacity={0.8}
              >
                <Icon name="more-vertical" size={16} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.detailCircleBtn, styles.detailCircleBtnGap]}
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

  renderHeroFade = () => {
    return (
      <View pointerEvents="none" style={styles.detailHeroFadeWrap}>
        <View
          style={[
            styles.detailHeroFadeLayer,
            { bottom: 110, height: 40, opacity: 0.12 },
          ]}
        />
        <View
          style={[
            styles.detailHeroFadeLayer,
            { bottom: 72, height: 40, opacity: 0.28 },
          ]}
        />
        <View
          style={[
            styles.detailHeroFadeLayer,
            { bottom: 36, height: 40, opacity: 0.5 },
          ]}
        />
        <View
          style={[
            styles.detailHeroFadeLayer,
            { bottom: 0, height: 48, opacity: 0.78 },
          ]}
        />
      </View>
    );
  };

  renderEventImage = () => {
    const attributes = this.getDetailAttributes();
    return (
      <View style={this.state.showMenu ? { zIndex: 50, elevation: 50 } : undefined}>
        <View style={styles.detailHeroWrap}>
          {attributes?.profile_image
            ? this.renderEventImageWithData()
            : this.renderEventImageWithoutData()}
          <View pointerEvents="none" style={styles.detailHeroScrim} />
          {this.renderHeroFade()}
          {this.renderHeroHeader()}
          <View style={styles.detailHeroMeta} pointerEvents="box-none">
            {this.isShowTonight() ? (
              <View style={styles.detailHotBadge}>
                <MaterialCommunityIcons
                  name="fire"
                  size={13}
                  color="#FFFFFF"
                />
                <Text style={styles.detailHotBadgeText}>HOT TONIGHT</Text>
              </View>
            ) : null}
            {attributes?.state ? (
              <Text style={styles.detailStateCaption} numberOfLines={1}>
                {`Shows in ${attributes.state}`}
              </Text>
            ) : null}
            <Text style={styles.detailHeroTitle} numberOfLines={4}>
              {attributes?.event_title || ""}
            </Text>
            <View style={styles.detailHeroMetaRow}>
              {this.getGenreDisplay() ? (
                <View style={styles.detailGenrePill}>
                  <Text style={styles.detailGenrePillText} numberOfLines={1}>
                    {this.getGenreDisplay()}
                  </Text>
                </View>
              ) : null}
              {this.getTicketPriceLabel() ? (
                <Text style={styles.detailPriceText}>
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
      <View style={[styles.detailSection, styles.detailBadgeRow]}>
        {showPostponed && (
          <Image
            source={require("../../../mobile/assets/images/postponed.png")}
            style={styles.detailStatusBadge}
          />
        )}
        {showSoldOut && (
          <Image
            source={require("../../../mobile/assets/images/sold_out.png")}
            style={styles.detailSoldOutBadge}
          />
        )}
      </View>
    );
  };

  renderEventImageWithData = () => {
    return (
      <FastImage
        style={styles.detailHeroImage}
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
      <View style={styles.detailHeroPlaceholder}>
        <Image
          source={require("../../../mobile/assets/images/gallery.png")}
          style={[styles.gallery, { tintColor: "#8880aa" }]}
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
    const iconColor = "#E8E4F5";

    return (
      <View style={styles.detailSection}>
        <View style={styles.detailStatsBar}>
          <View style={styles.detailStatItem}>
            <TouchableOpacity
              testID="likeDislikeBtn"
              onPress={this.handleLikeDislikePress}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
            >
              <Icon
                name="heart"
                size={18}
                color={liked ? "#ff2d6b" : iconColor}
              />
            </TouchableOpacity>
            <TouchableOpacity
              testID="likeText"
              onPress={this.handleLikeTextPress}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
            >
              <Text style={styles.detailStatCount}>{likesCount}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.detailStatItem}
            onPress={this.handleOpenComments}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
          >
            <Icon name="message-circle" size={18} color={iconColor} />
            <Text style={styles.detailStatCount}>{commentsCount}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.detailStatItem}
            onPress={this.handleShareWithFriends}
            activeOpacity={0.7}
          >
            <Icon name="repeat" size={18} color={iconColor} />
            <Text style={styles.detailStatCount}>{sharesCount}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.detailStatItem}
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
              color={addedInCalendar ? "#ff2d6b" : iconColor}
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
      <View style={styles.detailSection}>
        <View style={styles.detailInfoCardsRow}>
          <View style={[styles.detailInfoCard, styles.detailInfoCardFirst]}>
            <Icon name="calendar" size={16} color="#ff2d6b" />
            <Text style={styles.detailInfoCardLabel}>Date</Text>
            <Text style={styles.detailInfoCardValue} numberOfLines={1}>
              {this.formatInfoCardDate() || "—"}
            </Text>
          </View>
          <View style={styles.detailInfoCard}>
            <Icon name="clock" size={16} color="#ff2d6b" />
            <Text style={styles.detailInfoCardLabel}>Doors</Text>
            <Text style={styles.detailInfoCardValue} numberOfLines={1}>
              {this.formatInfoCardTime() || "—"}
            </Text>
          </View>
          <View style={[styles.detailInfoCard, styles.detailInfoCardLast]}>
            <Icon name="map-pin" size={16} color="#ff2d6b" />
            <Text style={styles.detailInfoCardLabel}>City</Text>
            <Text style={styles.detailInfoCardValue} numberOfLines={1}>
              {attributes?.city || "—"}
            </Text>
          </View>
        </View>

        {lineupDetail?.value ? (
          <>
            <Text style={styles.detailSectionLabel}>LINEUP</Text>
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
        <Text style={styles.detailSectionLabel}>VENUE</Text>
        <TouchableOpacity
          testID="clickableItem"
          style={styles.detailVenueCard}
          onPress={() => this.openGoogleMaps(attributes)}
          activeOpacity={0.8}
        >
          <View style={styles.detailVenueIconWrap}>
            <MaterialCommunityIcons
              name="office-building"
              size={22}
              color="#f0eeff"
            />
          </View>
          <View style={styles.detailVenueTextWrap}>
            <Text style={styles.detailVenueName} numberOfLines={1}>
              {venueName || "Venue"}
            </Text>
            {fullAddress ? (
              <Text style={styles.detailVenueAddress}>{fullAddress}</Text>
            ) : null}
          </View>
          <Icon name="external-link" size={16} color="#8880aa" />
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
      <View style={styles.detailWebsiteRow}>
        <View
          style={[styles.eventDetails, { alignItems: "center", flex: 0 }]}
        >
          <Icon name="tag" size={16} color="#ff2d6b" />
          <Text style={[styles.detailMetaLabel, { marginLeft: 8 }]}>
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
            <Text style={styles.detailMetaValue}>{accountTypeLabel}</Text>
          </TouchableOpacity>
        ) : (
          <Text style={[styles.detailMetaValue, { color: "#f0eeff" }]}>
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
        style={styles.detailWebsiteRow}
      >
        <View
          style={[
            styles.eventDetails,
            { alignItems: "flex-start", flex: 0, paddingTop: 2 },
          ]}
        >
          <Icon name={detail.icon} size={16} color="#ff2d6b" />
          <Text style={[styles.detailMetaLabel, { marginLeft: 8 }]}>
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
          <Text style={[styles.detailMetaValue, { color: "#f0eeff" }]}>
            At <Text style={{ color: "#ff2d6b" }}>{`${value}`}</Text>
          </Text>
        ) : (
          <Text
            style={[
              styles.detailMetaValue,
              {
                color: label === "Website" ? "#ff2d6b" : "#f0eeff",
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
        <Text style={styles.detailSectionLabel}>ABOUT</Text>
        <Text style={styles.detailAboutText}>{description}</Text>
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
      <View style={[styles.detailSection, { marginTop: 8 }]}>
        <TouchableOpacity
          style={[
            styles.detailRulesHeader,
            expanded && hasRules ? styles.detailRulesHeaderOpen : null,
          ]}
          onPress={this.toggleRulesAccordion}
          activeOpacity={0.8}
        >
          <Text style={styles.detailRulesHeaderText}>
            Venue Rules & Regulations
          </Text>
          <Icon
            name={expanded ? "chevron-up" : "chevron-down"}
            size={18}
            color="#f0eeff"
          />
        </TouchableOpacity>
        {expanded ? (
          <View style={styles.detailRulesBody}>
            {hasRules ? (
              <>
                {visibleItems.map(
                  (
                    item: { title: string; description: string },
                    index: number
                  ) => (
                    <View key={index} style={styles.detailRuleRow}>
                      <Icon
                        name="check-circle"
                        size={16}
                        color="#ff2d6b"
                        style={styles.detailRuleIcon}
                      />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.detailRuleTitle}>{item.title}</Text>
                        {item.description ? (
                          <Text style={styles.detailRuleText}>
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
                        styles.detailRuleTitle,
                        { color: "#ff2d6b", fontWeight: "700" },
                      ]}
                    >
                      Show more
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </>
            ) : (
              <Text style={[styles.detailRuleText, { marginTop: 8 }]}>
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
            styles.centeredView,
            {
              backgroundColor: "#08080fcc",
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
              styles.modalView,
              styles.reportModalContent,
              { height: modalMaxHeight, maxWidth: "100%" },
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
                          styles.boldText,
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
          <View style={styles.detailSection}>
            <FlatList
              testID="showFeaturesFlatlist"
              contentContainerStyle={{ marginTop: 8 }}
              data={this.state.eventDetail.attributes?.show_features}
              renderItem={({ item }: { item: any }) => {
                return (
                  <View style={styles.detailFeatureRow}>
                    <Icon
                      name="check-circle"
                      size={14}
                      color="#ff2d6b"
                      style={{ marginRight: 6, marginTop: 4 }}
                    />
                    <Text style={styles.detailFeatureText}>
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
        <Text style={[styles.detailMetaValue, { color: "#f0eeff" }]}>
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
            <Text style={[styles.detailMetaValue, { color: "#f0eeff" }]}>
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
              styles.detailMetaValue,
              { color: "#f0eeff", flexShrink: 1 },
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
              style={styles.detailLineupRow}
              onPress={() => this.showProfile(item?.id, "Artist")}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.detailLineupIndex,
                  isHeadliner && styles.detailLineupIndexActive,
                ]}
              >
                <Text
                  style={[
                    styles.detailLineupIndexText,
                    isHeadliner && styles.detailLineupIndexTextActive,
                  ]}
                >
                  {index + 1}
                </Text>
              </View>
              <Text style={styles.detailLineupName}>
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
              style={[styles.detailSectionLabel, styles.detailSection]}
            >
              MORE SHOWS AT THIS VENUE
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.detailMoreShowsRow}
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
                    style={styles.detailMoreShowCard}
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
                        style={styles.detailMoreShowImage}
                        source={{
                          uri: data.profile_image,
                          priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                      />
                    ) : (
                      <View
                        style={[
                          styles.detailMoreShowImage,
                          { backgroundColor: "#1a1a2e" },
                        ]}
                      />
                    )}
                    <View pointerEvents="none" style={styles.detailMoreShowFade} />
                    <View style={styles.detailMoreShowMeta}>
                      <Text style={styles.detailMoreShowTitle} numberOfLines={1}>
                        {title}
                      </Text>
                      {dateLabel ? (
                        <Text style={styles.detailMoreShowDate}>
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
          <View style={styles.detailSection}>
            <TouchableOpacity
              style={styles.detailVenueProfileBtn}
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
                color="#ff2d6b"
              />
              <Text style={styles.detailVenueProfileBtnText}>
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
        style={isPrimary ? styles.detailPrimaryBtn : styles.detailSecondaryBtn}
        onPress={onPress || this.handleTicketDirectionButton}
        activeOpacity={0.85}
      >
        {iconName ? (
          <MaterialCommunityIcons name={iconName} size={18} color="#FFFFFF" />
        ) : null}
        <Text
          style={
            isPrimary
              ? styles.detailPrimaryBtnText
              : styles.detailSecondaryBtnText
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
        <View style={[styles.detailSection, styles.detailTicketsWrap]}>
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
        <View style={[styles.centeredView, { backgroundColor: "#08080fcc" }]}>
          <View style={[styles.modalView]}>
            {this.renderCloseButton()}
            <Text style={styles.welcomeToPopupText}>{"Welcome to"}</Text>
            <Text style={styles.localShowsPopupText}>{"Local Shows"}</Text>
            <Text style={styles.loginFirstPopupText}>
              {"You have to Log in first to access the events."}
            </Text>
            <TouchableOpacity
              testID="createAccountBtn"
              onPress={() => {
                this.moveToLoginScreen("signup");
              }}
            >
              <Text style={styles.createAccountPopupText}>
                {"Create new account"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              testID="loginBtn"
              style={styles.loginBtnPopupText}
              onPress={() => {
                this.moveToLoginScreen("login");
              }}
            >
              <Text style={styles.loginTxtPopupText}>{"Log in"}</Text>
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
        style={styles.closeBtn}
        testID="popupCloseButton"
        onPress={this.handleCloseBtn}
      >
        <Svg width={14} height={14} viewBox="0 0 14 14" fill="#0F172A">
          <Path
            d="M13.3.71a.996.996 0 00-1.41 0L7 5.59 2.11.7A.996.996 0 10.7 2.11L5.59 7 .7 11.89a.996.996 0 101.41 1.41L7 8.41l4.89 4.89a.996.996 0 101.41-1.41L8.41 7l4.89-4.89c.38-.38.38-1.02 0-1.4z"
            fill="#0F172A"
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
          <View style={styles.detailMenuContainer}>
            {addedInCalendar ? (
              <TouchableOpacity
                testID="removeFromCalendar"
                style={[styles.menuButton, { marginBottom: 5 }]}
                onPress={this.openRemoveFromCalendarPopup}
              >
                <Text style={styles.detailMenuButtonText}>
                  {"Remove event from calendar"}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                testID="addToCalendar"
                style={[styles.menuButton, { marginBottom: 5 }]}
                onPress={this.handleAddToCalendarPress}
              >
                <Text style={styles.detailMenuButtonText}>
                  {"Add event to calendar"}
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              testID="shareWithFriend"
              style={styles.menuButton}
              onPress={this.handleShareWithFriends}
            >
              <Text style={styles.detailMenuButtonText}>
                {"Share with friend"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              testID="reportShow"
              style={styles.menuButton}
              onPress={this.openReportModal}
            >
              <Text style={styles.detailMenuButtonText}>{"Report Show"}</Text>
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
        <View style={[styles.centeredView, { backgroundColor: "#08080fcc" }]}>
          <View style={[styles.modalView, { height: "40%" }]}>
            <TouchableOpacity
              testID="btnHideModal"
              style={styles.disablePopupIconContainer}
              onPress={this.closeRemoveFromCalendar}
            >
              <Icon name="x" color="#0F172A" size={25} />
            </TouchableOpacity>
            <Text style={styles.textDeleteHeading}>{"Remove event?"}</Text>
            <Text style={[styles.txt, styles.textDelete]}>
              {"Are you sure you want to delete the event from the calendar."}
            </Text>
            <TouchableOpacity
              testID="btnKeepEventModal"
              style={[styles.deleteButtonContainer, styles.keepButtonContainer]}
              onPress={this.closeRemoveFromCalendar}
            >
              <Text
                style={[
                  styles.txt,
                  styles.textDeleteButton,
                  styles.textKeepButton,
                ]}
              >
                {"No, Keep it!"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              testID="btnDeleteEventModal"
              style={styles.deleteButtonContainer}
              onPress={this.handleRemoveFromCalendar}
            >
              <Text style={[styles.txt, styles.textDeleteButton]}>
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
          <View style={[styles.centeredView, styles.commentsParentView]}>
            <View style={[styles.modalView, styles.commentsView]}>
              <Pressable
                style={{ flex: 1 }}
                testID="commentsModalClick"
                onPress={() => this.hideKeyboard()}
              >
                <View style={styles.commentsHeader}>
                  <Text style={styles.commentsHeadingText}>Comments</Text>
                  <TouchableOpacity
                    testID="closeCommentsPopupButton"
                    onPress={this.handleCloseCommentPopup}
                  >
                    <Icon name="x" size={25} />
                  </TouchableOpacity>
                </View>
                <View style={styles.horizontalRuler} />
                {this.state.isLoadingComments ? (
                  <View style={styles.noCommentsContainer}>
                    <ActivityIndicator size="large" color="#ff2d6b" />
                  </View>
                ) : (
                  this.handleCommentsRendering()
                )}
              </Pressable>
              <View style={styles.emojiSelectionBar}>
                {this.defaultEmojisForSelectionBar.map(
                  (emoji: string, i: number) => (
                    <TouchableOpacity
                      key={`comment-emoji-${i}`}
                      onPress={() => this.handleEmojiSelected(emoji)}
                    >
                      <Text style={styles.emojiSelectionBarIcon}>{emoji}</Text>
                    </TouchableOpacity>
                  )
                )}
              </View>
              <View style={styles.commentInputArea}>
                <View style={styles.userAvatarContainer}>
                  <FastImage
                    source={
                      this.state.userProfilePic
                        ? {
                            uri: this.state.userProfilePic,
                            priority: FastImage.priority.high,
                          }
                        : defaultProfile
                    }
                    style={styles.userAvatar}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                </View>
                <TextInput
                  testID="commentTextInput"
                  ref={(input) => {
                    this.commentTextInput = input;
                  }}
                  style={styles.commentTextInput}
                  placeholder={
                    this.state.replying ? "Add a reply..." : "Add a comment..."
                  }
                  placeholderTextColor="#94A3B8"
                  value={this.state.commentText}
                  onChangeText={(commentText) =>
                    this.handleCommentTextChange(commentText)
                  }
                  multiline
                />
                <TouchableOpacity
                  testID="emojiComment"
                  style={styles.emojiButton}
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
                    <MaterialIcons name="send" color="#64748B" size={28} />
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
          <View style={styles.commentsListContainer}>
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
          <View style={styles.noCommentsContainer}>
            <Icon name="message-square" size={60} color="#0F172A" />
            <Text style={styles.commentsHeadingText}>No comments yet</Text>
            <Text style={styles.startConversationText}>
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
            <ActivityIndicator size="large" color="#ff2d6b" />
          </View>
        )}
      </>
    );
  };

  renderCommentsHiddenItem = (data: any, rowMap: any) => (
    <>
      {this.state.userId === data.item?.attributes?.account_id?.toString() && (
        <View style={styles.rowBack}>
          <TouchableOpacity
            testID="editComment"
            style={[styles.backRightBtn, styles.backRightBtnLeft]}
            onPress={() => this.handleEditComments(data.item, rowMap)}
          >
            <Icon name="corner-up-left" size={25} color={"white"} />
          </TouchableOpacity>
          <TouchableOpacity
            testID="deleteComment"
            style={[styles.backRightBtn, styles.backRightBtnRight]}
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
      <View style={styles.rowFront}>
        <TouchableOpacity
          testID="imageShowProfile"
          style={styles.userAvatarContainer}
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
            style={styles.userAvatar}
            resizeMode={FastImage.resizeMode.cover}
          />
        </TouchableOpacity>
        <View style={styles.commentContent}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.commenterName}>
              {`${item.attributes.account.first_name}`}
            </Text>
            <Text
              style={[
                styles.commenterName,
                { fontWeight: "400", marginLeft: 5 },
              ]}
            >
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
          {repliesCount !== 0 && (
            <TouchableOpacity
              testID="showReplyButton"
              style={styles.showReplyButton}
              onPress={() => this.handleReplyButton(item)}
            >
              <View style={styles.horizontalBar} />
              <Text style={styles.showReplyButtonText}>
                {`View ${repliesCount} more replies`}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.likeContainer}>
          <TouchableOpacity
            testID="likeCommentButton"
            onPress={() => this.likeComment(item.id)}
          >
            <FontAwesome
              name={item.attributes.like_by_me ? "heart" : "heart-o"}
              size={15}
              color={item.attributes.like_by_me ? "#DC2626" : "#94A3B8"}
            />
          </TouchableOpacity>
          <Text style={styles.likesCountText}>
            {item.attributes.likes_count}
          </Text>
        </View>
      </View>
    );
  };

  renderRepliesHiddenItem = (data: any, rowMap: any) => (
    <>
      {this.state.userId === data.item.account_id.toString() && (
        <View style={styles.rowBack}>
          <TouchableOpacity
            testID="editReply"
            style={[styles.backRightBtn, styles.backRightBtnLeft]}
            onPress={() => this.handleEditReply(data.item, rowMap)}
          >
            <Icon name="corner-up-left" size={25} color={"white"} />
          </TouchableOpacity>
          <TouchableOpacity
            testID="deleteReply"
            style={[styles.backRightBtn, styles.backRightBtnRight]}
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
          <View style={[styles.centeredView, styles.commentsParentView]}>
            <View style={[styles.modalView, styles.commentsView]}>
              <Pressable
                style={{ flex: 1 }}
                testID="repliesModalClick"
                onPress={() => this.hideKeyboard()}
              >
                <View style={styles.commentsHeader}>
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
                        tintColor: "#94A3B8",
                      }}
                    />
                  </TouchableOpacity>
                  <Text style={styles.commentsHeadingText}>Replies</Text>
                  <TouchableOpacity
                    testID="closeReplyPopupButton"
                    onPress={this.closeReplyPopup}
                  >
                    <Icon name="x" size={25} />
                  </TouchableOpacity>
                </View>
                <View style={styles.horizontalRuler} />
                {this.renderReplies()}
              </Pressable>
              <View style={styles.emojiSelectionBar}>
                {this.defaultEmojisForSelectionBar.map(
                  (emoji: string, i: number) => (
                    <TouchableOpacity
                      testID="emojiReply"
                      key={`reply-emoji-${i}`}
                      onPress={() => this.handleEmojiSelected(emoji)}
                    >
                      <Text style={styles.emojiSelectionBarIcon}>{emoji}</Text>
                    </TouchableOpacity>
                  )
                )}
              </View>
              <View style={styles.commentInputArea}>
                <View style={styles.userAvatarContainer}>
                  <FastImage
                    source={
                      this.state.userProfilePic
                        ? {
                            uri: this.state.userProfilePic,
                            priority: FastImage.priority.high,
                          }
                        : defaultProfile
                    }
                    style={styles.userAvatar}
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
                  style={styles.commentTextInput}
                  placeholder={"Add a reply..."}
                  placeholderTextColor="#94A3B8"
                  multiline={true}
                />
                <TouchableOpacity
                  testID="emojiReplyBtn"
                  style={styles.emojiButton}
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
                    <MaterialIcons name="send" color="#64748B" size={28} />
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
        <View style={[styles.rowFront]}>
          <TouchableOpacity
            testID="replies"
            style={styles.userAvatarContainer}
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
              style={styles.userAvatar}
              resizeMode={FastImage.resizeMode.cover}
            />
          </TouchableOpacity>
          <View style={styles.commentContent}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.commenterName}>
                {this.state.commentWithReply.attributes?.account.first_name}
              </Text>
              <Text
                style={[
                  styles.commenterName,
                  { fontWeight: "400", marginLeft: 5 },
                ]}
              >
                {this.timeAgo(
                  this.state.commentWithReply.attributes?.created_at
                )}
              </Text>
            </View>
            <Text style={styles.replyText}>
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
            <ActivityIndicator size="large" color="#ff2d6b" />
          </View>
        )}
      </>
    );
  };

  renderRepliesItem = ({ item }: { item: any }) => {
    return (
      <View
        style={[
          styles.rowFront,
          {
            width: "95%",
            alignSelf: "flex-end",
          },
        ]}
      >
        <TouchableOpacity
          style={styles.userAvatarContainer}
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
            style={styles.userAvatar}
            resizeMode={FastImage.resizeMode.cover}
          />
        </TouchableOpacity>
        <View style={styles.commentContent}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.commenterName}>{item.account_name}</Text>
            <Text
              style={[
                styles.commenterName,
                { fontWeight: "400", marginLeft: 5 },
              ]}
            >
              {item.created_at ? this.timeAgo(item.created_at) : ""}
            </Text>
          </View>
          <Text style={styles.replyText}>{item.reply}</Text>
        </View>
      </View>
    );
  };

  renderDetailLoadError = () => {
    return (
      <View style={{ flex: 1, backgroundColor: "#08080f" }}>
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
          <Text style={styles.detailErrorTitle}>{"Unable to load show"}</Text>
          <Text style={styles.detailErrorBody}>
            {this.state.detailsLoadError ||
              "Something went wrong. Please try again."}
          </Text>
          {this.state.selectedEventId ? (
            <TouchableOpacity
              testID="retryEventDetailBtn"
              onPress={this.retryEventDetailLoad}
              style={styles.detailRetryBtn}
            >
              <Text style={styles.detailRetryText}>{"Try Again"}</Text>
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity testID="errorGoBackBtn" onPress={this.goBack}>
            <Text style={styles.detailGoBackText}>{"Go Back"}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Customizable Area End

  render() {
    // Customizable Area Start
    const statusBarColor = this.state.loginPopup ? "#08080fcc" : "#08080f";
    const isAwaitingDetailData =
      Boolean(this.state.selectedEventId) &&
      !this.hasValidEventDetail() &&
      !this.state.detailsLoadError;
    const showLoader = this.state.detailsLoading || isAwaitingDetailData;
    const showError = !showLoader && Boolean(this.state.detailsLoadError);

    return (
      <SafeAreaView style={styles.detailScreen} edges={["bottom"]}>
        <StatusBar
          animated={true}
          hidden={false}
          barStyle="light-content"
          backgroundColor={statusBarColor}
        />

        {showLoader ? (
          <View style={styles.detailLoadingContainer} testID="eventDetailLoader">
            <ActivityIndicator size={"large"} color="#ff2d6b" />
          </View>
        ) : showError ? (
          this.renderDetailLoadError()
        ) : (
          <>
            <FlatList
              testID="mainFlatList"
              data={this.screenData}
              contentContainerStyle={styles.detailListContent}
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
            <View style={[styles.centeredView, { backgroundColor: "#08080fcc" }]}>
              <TouchableWithoutFeedback>
                <View style={[styles.modalView, styles.reportModalContent]}>
                  <View style={styles.reportHeader}>
                    <Text style={styles.reportTitle}>{"Report Show"}</Text>
                    <TouchableOpacity
                      testID="closeReportModal"
                      onPress={this.closeReportModal}
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
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 8 }}
                  >
                    <Text style={styles.reportSubtitle}>
                      {"Select a reason for reporting this show:"}
                    </Text>
                    <View style={styles.reportReasonsContainer}>
                      {this.reportReasons.map((reason) => {
                        const isSelected = this.state.reportReason === reason;
                        return (
                          <TouchableOpacity
                            key={reason}
                            style={[
                              styles.reportReasonButton,
                              isSelected && styles.reportReasonButtonSelected,
                            ]}
                            onPress={() => this.selectReportReason(reason)}
                          >
                            <View
                              style={[
                                styles.reportRadioOuter,
                                isSelected && styles.reportRadioOuterSelected,
                              ]}
                            >
                              {isSelected && <View style={styles.reportRadioInner} />}
                            </View>
                            <Text
                              style={[
                                styles.reportReasonText,
                                isSelected && styles.reportReasonTextSelected,
                              ]}
                            >
                              {reason}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                    {this.state.reportError ? (
                      <Text style={styles.reportErrorText}>
                        {this.state.reportError}
                      </Text>
                    ) : null}
                    <Text style={styles.reportSubtitle}>
                      {"Additional details (optional)"}
                    </Text>
                    <TextInput
                      testID="reportCommentInput"
                      style={styles.reportCommentInput}
                      placeholder={"Add any additional information..."}
                      placeholderTextColor="#94A3B8"
                      multiline
                      numberOfLines={4}
                      value={this.state.reportComment}
                      onChangeText={this.handleReportCommentChange}
                    />
                    <View style={styles.reportActions}>
                      <TouchableOpacity
                        testID="cancelReport"
                        style={[styles.reportButton, styles.reportCancelButton]}
                        onPress={this.closeReportModal}
                      >
                        <Text style={styles.reportCancelText}>{"Cancel"}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        testID="submitReport"
                        style={[styles.reportButton, styles.reportSubmitButton]}
                        onPress={this.submitReport}
                      >
                        <Text style={styles.reportSubmitText}>{"Submit Report"}</Text>
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

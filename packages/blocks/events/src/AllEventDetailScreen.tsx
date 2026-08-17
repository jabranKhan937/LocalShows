import React, { Component } from "react";
// Customizable Area Start
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StatusBar,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  Modal,
  TouchableWithoutFeedback,
  TextInput,
  ScrollView,
  Dimensions,
  StyleSheet,
  KeyboardAvoidingView,
} from "react-native";

import styles from "./AllEventStyle";
import {
  backButtonIcon,
  threeDots,
  calendar,
  headphones,
  home,
  location_on,
  music,
  tick_circle_black,
  time,
  website,
} from "./assets";
import Svg, { Path } from "react-native-svg";
import FastImage from "../../../components/src/SafeFastImage";
import Icon from "react-native-vector-icons/Feather";
// Customizable Area End

import AllEventController, { Props } from "./AllEventController";

export default class AllEventDetailScreen extends AllEventController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }

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
  }

  // Customizable Area Start
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
      <View style={styles.headerContainer}>
        <TouchableOpacity
          testID="backBtn"
          style={styles.headerIconBtn}
          onPress={this.goBack}
        >
          <Image source={backButtonIcon} />
        </TouchableOpacity>
        <Text style={styles.headerText} ellipsizeMode="tail" numberOfLines={1}>
          Shows in {this.state.eventDetail.attributes?.state}
        </Text>
        <TouchableOpacity testID="hamburgerIcon" onPress={this.onPressDrawer}>
          <Image
            style={styles.hamburgerIcon}
            source={require("../../../mobile/assets/images/Vector.png")}
          />
        </TouchableOpacity>
      </View>
    );
  };

  renderEventImage = () => {
    return (
      <View>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
          }}
        >
          {this.state.eventDetail.attributes?.profile_image
            ? this.renderEventImageWithData()
            : this.renderEventImageWithoutData()}
          <TouchableOpacity
            testID="threeDotIcon"
            style={styles.threeDotsButton}
            onPress={this.handleThreeDots}
          >
            <Image source={threeDots} style={[styles.threeDotsIcon]} />
          </TouchableOpacity>
          {this.renderMenuPopup()}
        </View>
      </View>
    );
  };

  renderTitle = () => {
    return (
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text
          style={{
            fontWeight: "700",
            fontSize: 20,
            color: "#334155",
            flex: 2,
          }}
        >{`${this.state.eventDetail.attributes?.event_title}`}</Text>
        {this.state.eventDetail.attributes?.date_of_the_show ===
          "2999-12-31" && (
            <Image
              source={require("../../../mobile/assets/images/postponed.png")}
              style={{ width: 87, height: 28, borderRadius: 5, marginRight: 10 }}
            />
          )}
        {this.state?.eventDetail?.attributes?.sold_out && (
          <Image
            source={require("../../../mobile/assets/images/sold_out.png")}
            style={{ width: 75, height: 28, borderRadius: 5 }}
          />
        )}
      </View>
    );
  };

  renderEventImageWithData = () => {
    return (
      <FastImage
        style={[styles.image, { borderRadius: 1 }]}
        source={{
          uri: this.state.eventDetail.attributes.profile_image,
          priority: FastImage.priority.high,
        }}
        resizeMode={FastImage.resizeMode.contain}
      />
    );
  };

  renderEventImageWithoutData = () => {
    return (
      <View
        style={[
          styles.image,
          {
            backgroundColor: "#EDEDFF",
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        <Image
          source={require("../../../mobile/assets/images/gallery.png")}
          style={styles.gallery}
        />
      </View>
    );
  };

  renderLike = () => {
    const likeIcon = this.state.eventDetail.attributes?.like_by_me
      ? require("../../../mobile/assets/images/favourite_filled.png")
      : require("../../../mobile/assets/images/image_favorite.png");

    return (
      <View
        style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}
      >
        <TouchableOpacity
          testID="likeDislikeBtn"
          style={{ marginRight: 5 }}
          onPress={this.handleLikeDislikePress}
        >
          <Image
            source={likeIcon}
            style={{ tintColor: "#4949EE", height: 20, width: 22 }}
          />
        </TouchableOpacity>
        <TouchableOpacity testID="likeText" onPress={this.handleLikeTextPress}>
          {/* <Text style={styles.boldText}>
            {this.state.eventDetail.attributes?.likes_count === 0
              ? "Be the first to like this"
              : this.state.eventDetail.attributes?.likes_count === 1
                ? "1 person like this"
                : `${this.state.eventDetail.attributes?.likes_count} people like this`}
          </Text> */}
        </TouchableOpacity>
      </View>
    );
  };

  renderClickableItems = () => {
    const { attributes } = this.state.eventDetail;
    const fullAddress = `${attributes?.address}, ${attributes?.city}, ${attributes?.state} ${attributes?.zip_code}, ${attributes?.country}`;

    const details = [
      {
        icon: calendar,
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
        icon: time,
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
        icon: location_on,
        label: "Location",
        value: attributes?.location,
        onPress: () => this.openGoogleMaps(attributes),
      },
      { icon: home, label: "Address", value: fullAddress, onPress: null },
      {
        icon: website,
        label: "Website",
        value: attributes?.website,
        onPress: () => this.openWebsiteURL(attributes?.website),
      },
      {
        icon: headphones,
        label: "Line up",
        value: attributes?.line_ups.length === 0 ? "" : attributes?.line_ups,
        onPress: null,
      },
      {
        icon: music,
        label: "Show type",
        value: attributes?.type_of_show,
        onPress: null,
      },
      {
        icon: music,
        label: "Genre",
        value: attributes?.genre.length === 0 ? "" : attributes?.genre,
        onPress: null,
      },
    ];

    const timeRowIndex = details.findIndex((d) => d.label === "Time");

    return (
      <View style={{ marginVertical: 30 }}>
        {details.map((detail, index) => (
          <React.Fragment key={index}>
            {this.renderClickableItem(detail, index)}
            {timeRowIndex >= 0 && index === timeRowIndex
              ? this.renderEventCreatorCategoryRow()
              : null}
          </React.Fragment>
        ))}
        {timeRowIndex < 0 ? this.renderEventCreatorCategoryRow() : null}
      </View>
    );
  };

  renderEventCreatorCategoryRow = () => {
    const creator = this.state.eventDetail?.attributes?.event_creator;
    if (!creator) {
      return null;
    }
    const accountTypeLabel = this.formatEventCreatorAccountTypeLabel(
      creator?.account_type || "",
    );
    const canNavigate = Boolean(creator?.id);

    return (
      <View
        style={{
          flexDirection: "row",
          marginTop: 10,
          alignItems: "flex-start",
        }}
      >
        <View
          style={[styles.eventDetails, { alignItems: "flex-start" }]}
        >
          <View
            style={{
              width: 20,
              height: 20,
              alignItems: "center",
              justifyContent: "center",
            }}
            accessible={false}
          >
            <Icon name="tag" size={18} color="#4949EE" />
          </View>
          <Text style={[styles.boldText, { marginLeft: 10 }]}>Category</Text>
        </View>
        {canNavigate ? (
          <TouchableOpacity
            testID="eventCreatorCategoryType"
            style={{ flex: 0.6 }}
            onPress={() =>
              this.openEventCreatorProfileForCategoryRow(
                String(creator?.id),
                creator?.account_type,
              )
            }
            activeOpacity={0.7}
          >
            <Text style={[styles.boldText, { fontWeight: "400", color: "#4949EE" }]}>
              {accountTypeLabel}
            </Text>
          </TouchableOpacity>
        ) : (
          <Text style={[styles.boldText, { flex: 0.6, fontWeight: "400" }]}>
            {accountTypeLabel}
          </Text>
        )}
      </View>
    );
  };

  renderClickableItem = (detail: any, index: number) => {
    const { icon, label, value, onPress } = detail;

    if (value === null || value === undefined || value === "") return null;

    const textComponent = onPress ? (
      <>{this.renderClickableTextWithPress(detail)}</>
    ) : (
      <>{this.renderClickableTextWithoutPress(detail)}</>
    );

    return (
      <View
        testID="clickableID"
        key={index}
        style={{
          flexDirection: "row",
          marginTop: index !== 0 ? 10 : 0,
          alignItems: "flex-start",
        }}
      >
        <View style={styles.eventDetails}>
          <Image source={icon} style={styles.detailIcons} />
          <Text style={[styles.boldText, { marginLeft: 10 }]}>{label}</Text>
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
        style={{ flex: 0.6 }}
        onPress={detail.onPress}
      >
        {label === "Location" ? (
          <Text style={[styles.boldText, { fontWeight: "400" }]}>
            At <Text style={{ color: "#4949EE" }}>{`${value}`}</Text>
          </Text>
        ) : (
          <Text
            style={[
              styles.boldText,
              {
                fontWeight: "400",
                color: label === "Website" ? "#4949EE" : "",
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
      <View style={{ flex: 0.6 }}>
        {label === "Show type" || label === "Genre"
          ? this.renderShowType(detail)
          : this.renderLineUpAndOthers(detail)}
      </View>
    );
  };

  renderDescription = () => {
    return (
      <>
        {this.state.eventDetail.attributes?.description !== "" && (
          <View>
            <Text style={styles.boldText}>Description</Text>
            <View>
              <Text
                style={[
                  styles.boldText,
                  { lineHeight: 22, marginTop: 10, fontWeight: "400" },
                ]}
              >
                {this.state.eventDetail.attributes?.description}
              </Text>
            </View>
          </View>
        )}
      </>
    );
  };

  renderRulesRegulations = () => {
    // Always show Rules/Regulations section for all user roles
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
    const items = list
      .map((item: any) =>
        typeof item === "string" ? item : item?.title ?? item?.name ?? item?.text ?? ""
      )
      .filter((s: string) => s !== null && s !== "" && String(s).trim() !== "");
    const hasRules = items.length > 0;
    const maxInline = 5;
    const displayedInline = items.slice(0, maxInline);
    const otherRules = items.slice(maxInline);
    const hasMoreRules = otherRules.length > 0;

    return (
      <View style={{ marginTop: 20 }}>
        <Text style={styles.boldText}>Rules / Regulations</Text>
        {hasRules ? (
          <View style={{ marginTop: 10 }}>
            {displayedInline.map((title: string, index: number) => (
              <React.Fragment key={index}>
                <View
                  style={{
                    flexDirection: "row",
                    marginBottom: 8,
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
                    {title}
                  </Text>
                </View>
              </React.Fragment>
            ))}
            {hasMoreRules && (
              <TouchableOpacity
                testID="showMoreRulesBtn"
                onPress={() => this.setState({ showRulesMoreModal: true })}
                style={{ marginTop: 4, marginBottom: 8 }}
              >
                <Text
                  style={[
                    styles.boldText,
                    { color: "#4949EE", fontWeight: "600", fontSize: 16 },
                  ]}
                >
                  Show more
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <Text
            style={[
              styles.boldText,
              { lineHeight: 22, marginTop: 10, fontWeight: "400" },
            ]}
          >
            No rules specified.
          </Text>
        )}
      </View>
    );
  };

  closeRulesMoreModal = () => {
    this.setState({ showRulesMoreModal: false });
  };

  renderRulesMoreModal = () => {
    const { showRulesMoreModal } = this.state;
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
    const items = list
      .map((item: any) =>
        typeof item === "string" ? item : item?.title ?? item?.name ?? item?.text ?? ""
      )
      .filter((s: string) => s !== null && s !== "" && String(s).trim() !== "");
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
              backgroundColor: "#33415580",
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
              {otherRules.map((title: string, index: number) => (
                <React.Fragment key={index}>
                  <View style={{ marginBottom: 12 }}>
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
                        {title}
                      </Text>
                    </View>
                  </View>
                </React.Fragment>
              ))}
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
          <FlatList
            testID="showFeaturesFlatlist"
            contentContainerStyle={{ marginTop: 20 }}
            data={this.state.eventDetail.attributes?.show_features}
            renderItem={({ item }: { item: any }) => {
              return (
                <View
                  style={{
                    flexDirection: "row",
                    width: "43%",
                    marginRight: 10,
                    marginBottom: 5,
                  }}
                >
                  <Image
                    source={tick_circle_black}
                    style={{
                      width: 15,
                      height: 15,
                      marginRight: 5,
                      marginTop: 5,
                    }}
                  />
                  <Text
                    style={[
                      styles.boldText,
                      { lineHeight: 22, fontWeight: "400" },
                    ]}
                  >
                    {item.feature_name}
                  </Text>
                </View>
              );
            }}
            numColumns={2}
          />
        )}
      </>
    );
  };

  renderShowType = (detail: any) => {
    const { value } = detail;
    return (
      <FlatList
        testID="typeOfShowFlatlist"
        numColumns={20}
        columnWrapperStyle={{ flexWrap: "wrap" }}
        data={value}
        keyExtractor={(item: any, index) => item?.id ?? index.toString()} // fallback in case id is missing
        renderItem={({ item, index }) => {
          const displayName = item?.name ?? "N/A"; // default to N/A if undefined
          const isLast = index === value?.length - 1;

          return (
            <Text style={[styles.boldText, { fontWeight: "400" }]}>
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
          <Text style={[styles.boldText, { fontWeight: "400" }]}>
            {transformedValue}
          </Text>
        )}
      </>
    );
  };

  renderLineUp = (detail: any) => {
    const { value } = detail;
    const { allBandsList } = this.state;

    return (
      <FlatList
        testID="lineupFlatlist"
        data={value}
        renderItem={({ item }) => {
          const isEmailInBandlist = allBandsList.some(
            (band) => band.email === item.email
          );
          const textColor = isEmailInBandlist ? "#4949EE" : "#334155";
          return (
            <TouchableOpacity
              testID="lineup"
              onPress={() => this.showProfile(item?.id, "Artist")}
            >
              <Text
                style={[
                  styles.boldText,
                  { fontWeight: "400", color: "#4949EE" },
                ]}
              >
                {item?.first_name}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    );
  };

  renderTicketsAndDirectionsButtons = () => {
    const renderButton = (
      testID: string,
      backgroundColor: any,
      textColor: any,
      buttonText: string,
      onPress?: () => void
    ) => (
      <TouchableOpacity
        testID={testID}
        style={[
          styles.button,
          {
            borderRadius: 10,
            backgroundColor: backgroundColor,
            width: "100%",
            marginTop: 15,
            padding: 15,
          },
        ]}
        onPress={onPress || this.handleTicketDirectionButton}
      >
        <Text style={{ fontWeight: "700", fontSize: 16, color: textColor }}>
          {buttonText}
        </Text>
      </TouchableOpacity>
    );

    const isVerified = this.state.eventDetail.attributes?.verified === true;

    return (
      <View style={{ marginVertical: 30 }}>
        {isVerified &&
          renderButton(
            "buyTicketBtn",
            "#4949EE",
            "#FFFFFF",
            "Buy Ticket",
            this.handleBuyTicketPress
          )}
        {renderButton("directionsBtn", "#EDEDFF", "#4949EE", "Directions")}
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
        <View style={[styles.centeredView, { backgroundColor: "#33415580" }]}>
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
          <View style={styles.menuContainer}>
            {addedInCalendar ? (
              <TouchableOpacity
                testID="removeFromCalendar"
                style={[styles.menuButton, { marginBottom: 5 }]}
                onPress={this.openRemoveFromCalendarPopup}
              >
                <Text style={styles.menuButtonText}>
                  {"Remove event from calendar"}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                testID="addToCalendar"
                style={[styles.menuButton, { marginBottom: 5 }]}
                onPress={this.handleAddToCalendarPress}
              >
                <Text style={styles.menuButtonText}>
                  {"Add event to calendar"}
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              testID="shareWithFriend"
              style={styles.menuButton}
              onPress={this.handleShareWithFriends}
            >
              <Text style={styles.menuButtonText}>{"Share with friend"}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              testID="reportShow"
              style={styles.menuButton}
              onPress={this.openReportModal}
            >
              <Text style={styles.menuButtonText}>{"Report Show"}</Text>
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
        <View style={[styles.centeredView, { backgroundColor: "#33415580" }]}>
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
  renderDetailLoadError = () => {
    return (
      <View style={{ flex: 1 }}>
        {this.renderHeader()}
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 24,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: "#334155",
              textAlign: "center",
              marginBottom: 8,
            }}
          >
            {"Unable to load show"}
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: "#64748B",
              textAlign: "center",
              marginBottom: 24,
            }}
          >
            {this.state.detailsLoadError ||
              "Something went wrong. Please try again."}
          </Text>
          {this.state.selectedEventId ? (
            <TouchableOpacity
              testID="retryEventDetailBtn"
              onPress={this.retryEventDetailLoad}
              style={{
                backgroundColor: "#4949EE",
                paddingHorizontal: 24,
                paddingVertical: 12,
                borderRadius: 8,
                marginBottom: 12,
              }}
            >
              <Text style={{ color: "#FFFFFF", fontWeight: "600" }}>
                {"Try Again"}
              </Text>
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity testID="errorGoBackBtn" onPress={this.goBack}>
            <Text style={{ color: "#4949EE", fontWeight: "600" }}>
              {"Go Back"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Customizable Area End

  render() {
    // Customizable Area Start
    const statusBarColor = this.state.loginPopup ? "#33415580" : "white";
    const isAwaitingDetailData =
      Boolean(this.state.selectedEventId) &&
      !this.hasValidEventDetail() &&
      !this.state.detailsLoadError;
    const showLoader = this.state.detailsLoading || isAwaitingDetailData;
    const showError = !showLoader && Boolean(this.state.detailsLoadError);

    return (
      <SafeAreaView style={{ width: "100%", height: "100%" }}>
        <StatusBar
          animated={true}
          hidden={false}
          backgroundColor={statusBarColor}
        />

        {showLoader ? (
          <View style={styles.loadingContainer} testID="eventDetailLoader">
            <ActivityIndicator size={"large"} color="black" />
          </View>
        ) : showError ? (
          this.renderDetailLoadError()
        ) : (
          <>
            <FlatList
              testID="mainFlatList"
              data={this.screenData}
              contentContainerStyle={{
                backgroundColor: "#FFFFFF",
                paddingHorizontal: "4%",
              }}
              renderItem={this.renderItem}
              keyExtractor={(item) => item.type}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={this.renderHeader}
            />
            {this.renderLoginModal()}
            {this.renderRemoveEventFromCalendar()}
            {this.renderReportModal()}
            {this.renderRulesMoreModal()}
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
            <View style={[styles.centeredView, { backgroundColor: "#33415580" }]}>
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

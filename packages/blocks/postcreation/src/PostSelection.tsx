import React from "react";
// Customizable Area Start
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle, Path } from "react-native-svg";

import PostCreationCommonController, { configJSON } from "./PostCreationCommonController";
import { redesignTheme } from "../../utilities/src/Colors";

const SHOW_ACCENT = "#FF2D6B";
const PHOTO_ACCENT = "#B56BFF";

const strokeIcon = (color: string) => ({
  stroke: color,
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  fill: "none",
});

const IconX = ({ color, size = 15 }: { color: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M18 6 6 18" {...strokeIcon(color)} />
    <Path d="m6 6 12 12" {...strokeIcon(color)} />
  </Svg>
);

const IconTicket = ({ color, size = 26 }: { color: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"
      {...strokeIcon(color)}
    />
    <Path d="M13 5v2" {...strokeIcon(color)} />
    <Path d="M13 17v2" {...strokeIcon(color)} />
    <Path d="M13 11v2" {...strokeIcon(color)} />
  </Svg>
);

const IconCamera = ({ color, size = 26 }: { color: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"
      {...strokeIcon(color)}
    />
    <Circle cx="12" cy="13" r="3" {...strokeIcon(color)} />
  </Svg>
);

const IconChevronRight = ({
  color,
  size = 16,
}: {
  color: string;
  size?: number;
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="m9 18 6-6-6-6" {...strokeIcon(color)} />
  </Svg>
);

const IconSparkles = ({ color, size = 13 }: { color: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"
      {...strokeIcon(color)}
    />
    <Path d="M20 3v4" {...strokeIcon(color)} />
    <Path d="M22 5h-4" {...strokeIcon(color)} />
    <Path d="M4 17v2" {...strokeIcon(color)} />
    <Path d="M5 18H3" {...strokeIcon(color)} />
  </Svg>
);

// Customizable Area End

export interface Props {
  navigation: any;
  // Customizable Area Start
  // Customizable Area End
}

export default class PostSelection extends PostCreationCommonController {
  constructor(props: Props) {
    super(props);
  }
  async componentDidMount() {
    this.setState({optionSelected:''})
    const resetOption = () => {
      this.setState({optionSelected:''})
    };
    this.props.navigation.addListener("willFocus", resetOption);
    this.props.navigation.addListener("focus", resetOption);
  }

  // Customizable Area Start
  closeCreatePost = () => {
    this.props.navigation.navigate("HomeFeed");
  };

  selectPostOption = (optionSelected: "show" | "picture") => {
    this.setState({ optionSelected }, () => {
      if (optionSelected === "show") {
        this.props.navigation.navigate("PostCreation", {
          from: "show",
        });
        return;
      }
      this.props.navigation.navigate("ImageSelection", {
        selectedType: optionSelected,
      });
    });
  };

  renderOptionCard = ({
    testID,
    accent,
    icon,
    title,
    description,
    option,
    cardStyle,
    iconWrapStyle,
  }: {
    testID: string;
    accent: string;
    icon: React.ReactNode;
    title: string;
    description: string;
    option: "show" | "picture";
    cardStyle: object;
    iconWrapStyle: object;
  }) => {
    return (
      <TouchableOpacity
        testID={testID}
        activeOpacity={0.85}
        style={[styles.optionCard, cardStyle]}
        onPress={() => this.selectPostOption(option)}
      >
        <View style={[styles.iconWrap, iconWrapStyle]}>{icon}</View>
        <View style={styles.optionCopy}>
          <Text style={styles.optionTitle}>{title}</Text>
          <Text style={styles.optionDescription}>{description}</Text>
        </View>
        <IconChevronRight color={accent} />
      </TouchableOpacity>
    );
  };
  // Customizable Area End

  render() {
    // Customizable Area Start
    // Customizable Area End
    return (
      <SafeAreaView style={styles.safeAreaView} edges={["top", "left", "right"]}>
        {/* Customizable Area Start */}
        <StatusBar
          barStyle="light-content"
          backgroundColor={redesignTheme.background}
        />
        <View style={styles.header}>
          <Text style={styles.title}>{configJSON.createPostTitle}</Text>
          <TouchableOpacity
            testID="closeBtn"
            style={styles.closeBtn}
            onPress={this.closeCreatePost}
            activeOpacity={0.8}
          >
            <IconX color={redesignTheme.muted} />
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          <Text style={styles.subtitle}>{configJSON.whatAreYouPosting}</Text>
          {this.renderOptionCard({
            testID: "showBtn",
            accent: SHOW_ACCENT,
            icon: <IconTicket color={SHOW_ACCENT} />,
            title: configJSON.postAShowCardTitle,
            description: configJSON.postAShowCardDescription,
            option: "show",
            cardStyle: styles.showCard,
            iconWrapStyle: styles.showIconWrap,
          })}
          {this.renderOptionCard({
            testID: "pictureBtn",
            accent: PHOTO_ACCENT,
            icon: <IconCamera color={PHOTO_ACCENT} />,
            title: configJSON.shareAPhotoCardTitle,
            description: configJSON.shareAPhotoCardDescription,
            option: "picture",
            cardStyle: styles.photoCard,
            iconWrapStyle: styles.photoIconWrap,
          })}
          <View style={styles.infoBox}>
            <View style={styles.infoIcon}>
              <IconSparkles color={redesignTheme.accent} />
            </View>
            <Text style={styles.infoText}>
              {configJSON.postingAvailableTo}
              <Text style={styles.infoRoles}>{configJSON.postingRoles}</Text>
              {configJSON.postingFansNote}
            </Text>
          </View>
        </View>
        {/* Customizable Area End */}
      </SafeAreaView>
    );
  }
}

// Customizable Area Start
const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: redesignTheme.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    color: redesignTheme.foreground,
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 0.2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: redesignTheme.border,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  subtitle: {
    color: redesignTheme.muted,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "400",
    marginBottom: 24,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  showCard: {
    backgroundColor: "rgba(255, 45, 107, 0.08)",
    borderColor: "rgba(255, 45, 107, 0.22)",
  },
  photoCard: {
    backgroundColor: "rgba(181, 107, 255, 0.08)",
    borderColor: "rgba(181, 107, 255, 0.22)",
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  showIconWrap: {
    backgroundColor: "rgba(255, 45, 107, 0.15)",
  },
  photoIconWrap: {
    backgroundColor: "rgba(181, 107, 255, 0.15)",
  },
  optionCopy: {
    flex: 1,
    marginRight: 8,
  },
  optionTitle: {
    color: redesignTheme.foreground,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "900",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  optionDescription: {
    color: redesignTheme.muted,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "500",
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderWidth: 1,
    borderColor: redesignTheme.border,
  },
  infoIcon: {
    marginTop: 1,
    marginRight: 10,
  },
  infoText: {
    flex: 1,
    color: redesignTheme.muted,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "400",
  },
  infoRoles: {
    color: redesignTheme.foreground,
  },
});
// Customizable Area End

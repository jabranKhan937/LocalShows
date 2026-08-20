import React from "react";

import {
  StyleSheet,
  // Customizable Area Start
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  TouchableWithoutFeedback,
  StatusBar,
  TextInput,
  // Customizable Area End
} from "react-native";

import HelpCentreController, { Props } from "./HelpCentreController";

import { FlatList } from "react-native-gesture-handler";

// Customizable Area Start
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Feather";
import { lightTheme, redesignTheme } from "../../utilities/src/Colors";

type HelpTheme = typeof redesignTheme;
// Customizable Area End

export default class HelpCentre extends HelpCentreController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }

  // Customizable Area Start
  get styles() {
    return this.state.isDarkMode ? darkHelpStyles : lightHelpStyles;
  }

  renderHeader = () => {
    const theme = this.getHelpCentreTheme();
    return (
      <View style={this.styles.headerContainer}>
        <TouchableOpacity
          testID="navigateBack"
          style={this.styles.headerCircleBtn}
          onPress={() => {
            this.props.navigation.goBack();
          }}
          activeOpacity={0.8}
        >
          <Icon name="arrow-left" size={18} color={theme.foreground} />
        </TouchableOpacity>
        <Text style={this.styles.headerTitleText}>Help Center</Text>
        <View style={this.styles.headerSideSpacer} />
      </View>
    );
  };

  renderSearch = () => {
    const theme = this.getHelpCentreTheme();
    return (
      <View style={this.styles.inputContainer}>
        <Icon name="search" size={16} color={theme.muted} />
        <TextInput
          testID="searchInputText"
          style={this.styles.input}
          placeholderTextColor={theme.muted}
          placeholder="Search"
          value={this.state.searchInput}
          onChangeText={text =>
            this.filterFAQData(text.replace("  ", " ").trimStart())
          }
        />
      </View>
    );
  };

  renderItem = (item: any, index: number) => {
    const theme = this.getHelpCentreTheme();
    return (
      <View style={this.styles.faqCard}>
        <TouchableOpacity
          testID="questionClick"
          style={this.styles.faqQuestionRow}
          onPress={() => {
            this.showHideAnswers(index);
          }}
          activeOpacity={0.8}
        >
          <Text style={this.styles.faqQuestion}>{item.question}</Text>
          <Icon
            name="chevron-down"
            size={18}
            color={theme.muted}
            style={{ transform: [{ rotate: item.isOpen ? "180deg" : "0deg" }] }}
          />
        </TouchableOpacity>
        {item.isOpen && <Text style={this.styles.faqAnswer}>{item.answer}</Text>}
      </View>
    );
  };

  renderListEmptyComponent = () => {
    return (
      <View style={this.styles.emptyView}>
        <Text style={this.styles.emptyText}>{"No record(s) found"}</Text>
      </View>
    );
  };
  // Customizable Area End

  render() {
    const theme = this.getHelpCentreTheme();
    return (
      //Merge Engine DefaultContainer
      <SafeAreaView style={this.styles.container} edges={["top"]}>
        <StatusBar
          animated={true}
          hidden={false}
          barStyle={this.state.isDarkMode ? "light-content" : "dark-content"}
          backgroundColor={theme.background}
        />
        {this.renderHeader()}
        <ScrollView
          keyboardShouldPersistTaps="always"
          style={this.styles.scroll}
          contentContainerStyle={this.styles.scrollContent}
        >
          <TouchableWithoutFeedback
            onPress={() => {
              this.hideKeyboard();
            }}
          >
            {/* Customizable Area Start */}
            <View>
              <View style={this.styles.introCard}>
                {this.renderSearch()}
                <Text style={this.styles.introText}>
                  The Local Shows Help Center is your go-to resource for all your
                  app-related queries. Find answers to frequently asked questions,
                  troubleshooting guides, and contact support for personalized
                  assistance.
                </Text>
              </View>
              <FlatList
                testID="faqsList"
                data={
                  this.state.searchInput === ""
                    ? this.state.faqList
                    : this.state.filteredFAQList
                }
                contentContainerStyle={this.styles.faqListContent}
                renderItem={({ item, index }: any) => this.renderItem(item, index)}
                ListEmptyComponent={this.renderListEmptyComponent}
                keyExtractor={(item: any) => item.id}
                scrollEnabled={false}
              />
            </View>
            {/* Customizable Area End */}
          </TouchableWithoutFeedback>
        </ScrollView>
      </SafeAreaView>
      //Merge Engine End DefaultContainer
    );
  }
}

// Customizable Area Start
const createHelpStyles = (theme: HelpTheme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      width: "100%",
      maxWidth: 650,
      alignSelf: "center",
      backgroundColor: theme.background,
    },
    scroll: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: 32,
    },
    headerContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 16,
      height: 56,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.border,
      backgroundColor: theme.background,
    },
    headerCircleBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.input,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border,
      alignItems: "center",
      justifyContent: "center",
    },
    headerSideSpacer: {
      width: 36,
      height: 36,
    },
    headerTitleText: {
      fontWeight: "900",
      fontSize: 18,
      letterSpacing: 0.6,
      color: theme.foreground,
      textTransform: "uppercase",
    },
    introCard: {
      marginHorizontal: 16,
      marginTop: 16,
      padding: 14,
      borderRadius: 16,
      backgroundColor: theme.card,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 14,
      paddingVertical: 2,
      paddingHorizontal: 12,
      backgroundColor: theme.input,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border,
    },
    input: {
      flex: 1,
      height: 44,
      fontSize: 16,
      marginLeft: 10,
      color: theme.foreground,
    },
    introText: {
      color: theme.muted,
      fontSize: 14,
      fontWeight: "400",
      lineHeight: 22,
      marginTop: 14,
    },
    faqListContent: {
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 8,
    },
    faqCard: {
      backgroundColor: theme.card,
      borderRadius: 16,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border,
      paddingHorizontal: 16,
      paddingVertical: 14,
      marginBottom: 10,
    },
    faqQuestionRow: {
      flexDirection: "row",
      alignItems: "flex-start",
    },
    faqQuestion: {
      fontSize: 15,
      fontWeight: "700",
      lineHeight: 22,
      color: theme.foreground,
      flex: 1,
      paddingRight: 10,
    },
    faqAnswer: {
      fontSize: 14,
      fontWeight: "400",
      lineHeight: 22,
      color: theme.muted,
      marginTop: 10,
    },
    emptyView: {
      justifyContent: "center",
      alignItems: "center",
      paddingTop: 48,
    },
    emptyText: {
      fontSize: 14,
      fontWeight: "400",
      color: theme.muted,
    },
  });
};

const darkHelpStyles = createHelpStyles(redesignTheme);
const lightHelpStyles = createHelpStyles(lightTheme);
// Customizable Area End

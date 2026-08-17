import React from "react";

import {
  StyleSheet,
  Dimensions,
  // Customizable Area Start
  Text,
  Image,
  TouchableOpacity,
  View,
  ScrollView,
  TouchableWithoutFeedback,
  StatusBar,
  TextInput,
  SafeAreaView,
  // Customizable Area End
} from "react-native";

const Height = Dimensions.get("window").height;

import HelpCentreController, { Props } from "./HelpCentreController";

import { FlatList } from "react-native-gesture-handler";
import { triangle } from "./assets";

// Customizable Area Start

import { colors } from "../../utilities/src/Colors";
import { leftArrow } from "../../email-account-registration/src/assets";

// Customizable Area End

export default class HelpCentre extends HelpCentreController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }

  // Customizable Area Start
  renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <TouchableOpacity
          testID="navigateBack"
          style={styles.backButton}
          onPress={() => {
            this.props.navigation.goBack();
          }} >
          <Image source={leftArrow} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={[styles.text, styles.headerTitleText]}>
          Help Center
        </Text>
        <View style={styles.backButton} />
      </View>
    )
  }

  renderSearch = () => {
    return (
      <View style={styles.inputContainer}>
        <Image source={require('../../../mobile/assets/images/image_search.png')} style={{ height: 20, width: 20, resizeMode: 'contain' }} />
        <TextInput
          testID="searchInputText"
          style={styles.input}
          placeholderTextColor="#334166"
          placeholder="Search"
          value={this.state.searchInput}
          onChangeText={text => this.filterFAQData(text.replace("  ", " ").trimStart())} />
      </View>
    )
  }

  renderItem = (item: any, index: number) => {
    return (
      <View style={{ marginHorizontal: 25, marginVertical: 6 }}>
        <TouchableOpacity
          testID="questionClick"
          style={{ flexDirection: 'row', }}
          onPress={() => { this.showHideAnswers(index) }}>
          <Text style={{ fontSize: 14, fontWeight: '700', lineHeight: 22, color: '#334155', flex: 0.9, }}>{item.question}</Text>
          <Image style={{ height: 15, width: 15, resizeMode: "contain", marginTop: 5, flex: 0.1, transform: [{ rotate: '-90deg' }] }} source={leftArrow} />
        </TouchableOpacity>
        {item.isOpen && <Text style={{ fontSize: 14, fontWeight: '400', lineHeight: 22, color: '#334155', marginVertical: 10, }}>{item.answer}</Text>}
      </View>
    )
  }

  renderListEmptyComponent = () => {
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', paddingTop: 50 }}>
        <Text style={{ fontSize: 14, fontWeight: '400', color: "#334155" }}>{"No record(s) found"}</Text>
      </View>
    )
  }
  // Customizable Area End

  render() {
    return (
      //Merge Engine DefaultContainer
      <ScrollView keyboardShouldPersistTaps="always" style={styles.container}>
        <TouchableWithoutFeedback
          onPress={() => {
            this.hideKeyboard();
          }}
        >
          {/* Customizable Area Start */}
          {/* Merge Engine UI Engine Code */}
          <SafeAreaView style={{ backgroundColor: "#EDEDFF" }}>
            <StatusBar
              animated={true}
              hidden={false}
              backgroundColor="#EDEDFF"
            />
            <View>
              <View style={styles.pageBackground}>
                {this.renderHeader()}
                {this.renderSearch()}
                <Text style={[styles.text, {
                  lineHeight: 22,
                }]}>The Local Shows Help Center is your go-to resource for all your app-related queries. Find answers to frequently asked questions, troubleshooting guides, and contact support for personalized assistance.</Text>
              </View>
              <FlatList
                testID="faqsList"
                data={this.state.searchInput === "" ? this.state.faqList : this.state.filteredFAQList}
                contentContainerStyle={{ backgroundColor: 'white' }}
                renderItem={({ item, index }: any) => this.renderItem(item, index)}
                ListEmptyComponent={this.renderListEmptyComponent}
                keyExtractor={(item: any) => item.id}
              />
            </View>
          </SafeAreaView>
          {/* Merge Engine UI Engine Code */}
          {/* Customizable Area End */}
        </TouchableWithoutFeedback>
      </ScrollView>
      //Merge Engine End DefaultContainer
    );
  }
}

// Customizable Area Start
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    height: "100%"
  },
  pageBackground: {
    backgroundColor: '#EDEDFF',
    borderBottomEndRadius: 32,
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 5
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,

  },
  backButton: {
    width: 20,
  },
  backIcon: {
    width: 12,
    left: 0,
    resizeMode: "contain",
  },
  headerTitleText: {
    fontWeight: "700",
    fontSize: 24,
  },
  hamburgerIconButton: {
    width: 25,
    height: 16,
    resizeMode: "contain",

  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 15,
    paddingVertical: 2,
    paddingHorizontal: 8,
    margin: 10,
    backgroundColor: '#F8FAFC',
  },
  input: {
    flex: 1,
    height: 47,
    fontSize: 18,
    marginLeft: 10,
    color: '#334166',
  },
  text: {
    color: colors(false).text,
    fontSize: 14,
    fontWeight: '400',
    marginHorizontal: 10,
  },
});
// Customizable Area End

import React from "react";

// Customizable Area Start
import {
  SafeAreaView,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  View,
  TextInput,
} from "react-native";

// Merge Engine - import assets - Start
// Merge Engine - import assets - End

// Merge Engine - Artboard Dimension  - Start
// Merge Engine - Artboard Dimension  - End
// Customizable Area End

import SavesearchController, {
  ISearch,
  IUser,
  configJSON,
} from "./SavesearchController";

export default class Savesearch extends SavesearchController {
  // Customizable Area Start
  renderItem = ({ item }: { item: IUser }) => {
    return (
      <TouchableOpacity
        testID="userSelectButton"
        style={styles.listItemContainer}
        onPress={() => this.onSelectUser(item)}
      >
        <Text style={styles.name}>{item.full_name}</Text>
        <Text style={styles.email}>{item.email}</Text>
      </TouchableOpacity>
    );
  };

  renderSearchItem = ({ item }: { item: ISearch }) => {
    return (
      <TouchableOpacity
        testID="searchSelectButton"
        style={[styles.listItemContainer, styles.searchItemContainer]}
      >
        <Text style={styles.name}>{item.name}</Text>
        <TouchableOpacity
          testID="deleteSearchButton"
          style={styles.deleteButtonContainer}
          onPress={() => this.deleteSearch(item.name)}
        >
          <Text style={styles.deleteButtonText}>X</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  Search = () => {
    return (
      <View style={styles.searchContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={this.onNavigateBack}
        >
          <Text style={styles.backButtonText}>{"< Go Back"}</Text>
        </TouchableOpacity>
        <View style={styles.searchInputContainer}>
          <TextInput
            testID="searchInput"
            placeholder={configJSON.searchPlaceholder}
            placeholderTextColor={configJSON.placeholderTextColor}
            style={styles.searchInput}
            value={this.state.searchQuery}
            onChangeText={this.onChangeSearchQuery}
            onSubmitEditing={() => this.saveSearch()}
            maxLength={45}
          />
          <TouchableOpacity
            testID="submitButton"
            style={styles.submitButton}
            onPress={this.saveSearch}
          >
            <Text style={styles.submitButtonText}>{">"}</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={this.state.searches}
          renderItem={this.renderSearchItem}
        />
      </View>
    );
  };
  // Customizable Area End

  render() {
    // Customizable Area Start
    // Merge Engine - render - Start
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={configJSON.backgroundColor}
        />
        {this.state.isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" />
          </View>
        ) : (
          <>
            {this.state.showSearch ? (
              <this.Search />
            ) : (
              <FlatList
                data={this.state.users}
                renderItem={this.renderItem}
                ListHeaderComponent={
                  <Text style={styles.heading}>
                    {configJSON.usersScreenHeading}
                  </Text>
                }
              />
            )}
          </>
        )}
      </SafeAreaView>
    );
    // Merge Engine - render - End
    // Customizable Area End
  }
}

// Customizable Area Start
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: configJSON.backgroundColor,
  },
  backButton: {
    width: "40%",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 10,
  },
  backButtonText: {
    fontSize: 18,
    color: configJSON.textColor,
  },
  heading: {
    fontSize: 24,
    marginHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    color: configJSON.textColor,
  },
  listItemContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  name: {
    fontSize: 17,
    color: configJSON.textColor,
    maxWidth: '80%'
  },
  email: {
    fontSize: 13,
    color: configJSON.textColor,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: configJSON.backgroundColor,
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  searchInputContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  searchInput: {
    width: "80%",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    color: configJSON.textColor,
    fontSize: 16,
  },
  submitButton: {
    alignItems: "center",
    width: "15%",
    height: "100%",
    borderWidth: 1,
    borderRadius: 10,
  },
  submitButtonText: {
    fontSize: 30,
    color: configJSON.textColor,
  },
  searchItemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 5,
    borderBottomWidth: 0.5,
  },
  deleteButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
    width: 35,
    height: 35,
    borderWidth: 0.5,
    borderRadius: 20,
  },
  deleteButtonText: {
    fontSize: 20,
    color: configJSON.textColor,
  },
});
// Customizable Area End

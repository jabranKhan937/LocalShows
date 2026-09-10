import React from "react";

// Customizable Area Start
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ScrollView,
  Modal,
  SafeAreaView,
  StatusBar,
  Image,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { leftArrow } from "../../events/src/assets";
import Icon from "react-native-vector-icons/Feather";
import { redesignTheme } from "../../utilities/src/Colors";
// Customizable Area End

import RequestManagementController, {
  Props,
} from "./RequestManagementController";

type RequestTheme = typeof redesignTheme;

export default class RequestManagement extends RequestManagementController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }

  // Customizable Area Start
  get styles() {
    return createRequestStyles(this.getRequestTheme());
  }
  // Customizable Area End

  render() {
    // Customizable Area Start
    const styles = this.styles;
    const theme = this.getRequestTheme();
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
        <StatusBar
          barStyle={this.state.isDarkMode ? "light-content" : "dark-content"}
          backgroundColor={
            this.state.showConfirmationModal
              ? "rgba(8, 8, 15, 0.72)"
              : theme.background
          }
        />
        <View pointerEvents="none" style={styles.decorTop} />
        <ScrollView
          style={styles.rootContainer}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.headerContainer}>
            <TouchableOpacity
              testID="backButton"
              style={styles.backNavContainer}
              onPress={() => {
                this.props.navigation.goBack();
              }}
            >
              <Image
                source={leftArrow}
                style={[styles.backNavButton, { tintColor: theme.foreground }]}
              />
            </TouchableOpacity>
            <Text testID="testLabel" style={[styles.text, styles.titleText]}>
              New Category
            </Text>
          </View>
          <View style={styles.contentContainer}>
            <Text style={styles.subtitle}>
              You can add categories that you have not found in the given options
            </Text>
            <Text style={[styles.text, styles.inputFieldLabel]}>Category</Text>
            <TextInput
              testID="txtInputCategory"
              placeholder="Enter a category"
              placeholderTextColor={theme.muted}
              style={styles.inputField}
              value={this.state.newCategoryText}
              onChangeText={(newCategoryText) =>
                this.setState({ newCategoryText })
              }
            />
            <TouchableOpacity
              testID="addNewCategoryTxt"
              style={styles.newCategoryLinkContainer}
              onPress={() => this.handleAddNewCategory()}
            >
              <Icon name="plus-circle" color={theme.primary} size={18} />
              <Text style={styles.newCategoryLink}>Add a new category</Text>
            </TouchableOpacity>
            <View style={styles.selectionsContainer}>
              <FlatList
                testID="newCategoriesList"
                data={this.state.newCategories}
                renderItem={(subCat: { item: string }) => (
                  <View style={styles.selectedItem}>
                    <Text style={styles.selectedItemText}>{subCat.item}</Text>
                    <Icon
                      testID="removeCategory"
                      name="x"
                      size={17}
                      color={theme.primary}
                      onPress={() => this.handleRemoveCategory(subCat.item)}
                    />
                  </View>
                )}
                scrollEnabled={false}
                numColumns={3}
              />
            </View>
          </View>
          <TouchableOpacity
            testID="btnSend"
            style={[
              styles.sendButton,
              { opacity: this.enableSendButton() ? 1 : 0.5 },
            ]}
            onPress={() => {
              this.setState({ showConfirmationModal: true });
            }}
            disabled={!this.enableSendButton()}
          >
            <Text style={[styles.text, styles.sendButtonText]}>Send</Text>
          </TouchableOpacity>
        </ScrollView>
        {this.state.fetching && (
          <View style={styles.fetchingContainer}>
            <ActivityIndicator size={"large"} color={theme.primary} />
          </View>
        )}
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.showConfirmationModal}
          onRequestClose={() => this.setState({ showConfirmationModal: false })}
        >
          <View style={styles.centeredModalView}>
            <View style={styles.modalContainerView}>
              <TouchableOpacity
                style={styles.closeModalButtonContainer}
                onPress={() => this.setState({ showConfirmationModal: false })}
              >
                <Icon name="x" color={theme.foreground} size={22} />
              </TouchableOpacity>
              <Text style={styles.newCategoryHeading}>
                Send the new category ?
              </Text>
              <Text style={[styles.text, styles.newCategorySubHeading]}>
                These will be sent and approved in 3 work days. You will be
                notified about it.
              </Text>
              <TouchableOpacity
                testID="btnCancel"
                style={[styles.sendButton, styles.cancelButton]}
                onPress={() => this.setState({ showConfirmationModal: false })}
              >
                <Text
                  style={[
                    styles.text,
                    styles.sendButtonText,
                    styles.cancelButtonText,
                  ]}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                testID="btnConfirm"
                style={[styles.sendButton, styles.confirmButton]}
                onPress={this.handleAddNewCategoryAPICall}
              >
                <Text style={[styles.text, styles.sendButtonText]}>
                  Confirm
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
    // Customizable Area End
  }
}

// Customizable Area Start
const createRequestStyles = (theme: RequestTheme) =>
  StyleSheet.create({
    rootContainer: {
      padding: 16,
      backgroundColor: theme.background,
      flex: 1,
    },
    decorTop: {
      position: "absolute",
      top: -90,
      right: -70,
      width: 200,
      height: 200,
      borderRadius: 100,
      backgroundColor: theme.primarySoft,
    },
    headerContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 16,
    },
    backNavContainer: {
      position: "absolute",
      left: -10,
      alignSelf: "center",
      padding: 10,
    },
    backNavButton: {
      width: 12,
      left: 0,
      resizeMode: "contain",
    },
    titleText: {
      fontWeight: "bold",
      fontSize: 24,
      maxWidth: "85%",
      alignSelf: "center",
      color: theme.primary,
    },
    contentContainer: {
      flex: 1,
    },
    subtitle: {
      fontSize: 15,
      color: theme.muted,
      lineHeight: 22,
    },
    text: {
      fontFamily: "OpenSans",
      alignSelf: "flex-start",
      color: theme.foreground,
    },
    fetchingContainer: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(8, 8, 15, 0.72)",
      alignItems: "center",
      justifyContent: "center",
    },
    inputFieldLabel: {
      fontWeight: "bold",
      marginTop: 24,
      marginBottom: 10,
      fontSize: 16,
      color: theme.foreground,
    },
    inputField: {
      width: "100%",
      paddingHorizontal: 14,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.input,
      color: theme.foreground,
      height: 50,
      fontSize: 16,
    },
    centeredModalView: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: "rgba(8, 8, 15, 0.72)",
    },
    newCategoryHeading: {
      fontWeight: "700",
      fontSize: 24,
      lineHeight: 30,
      marginTop: 16,
      marginBottom: 8,
      color: theme.foreground,
    },
    newCategorySubHeading: {
      fontSize: 15,
      color: theme.muted,
      lineHeight: 22,
      marginBottom: 8,
    },
    modalContainerView: {
      backgroundColor: theme.card,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      borderWidth: 1,
      borderColor: theme.border,
      paddingHorizontal: 24,
      paddingTop: 20,
      paddingBottom: 32,
    },
    sendButton: {
      backgroundColor: theme.primary,
      width: "100%",
      padding: 15,
      borderRadius: 12,
      marginTop: 10,
      marginBottom: 25,
    },
    sendButtonText: {
      color: "#FFFFFF",
      fontWeight: "700",
      fontSize: 18,
      alignSelf: "center",
    },
    cancelButton: {
      marginTop: 16,
      marginBottom: 5,
      backgroundColor: "transparent",
    },
    cancelButtonText: {
      color: theme.primary,
    },
    confirmButton: {
      marginBottom: 0,
    },
    closeModalButtonContainer: {
      position: "absolute",
      right: 16,
      top: 16,
      zIndex: 2,
      padding: 4,
    },
    newCategoryLinkContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 12,
    },
    newCategoryLink: {
      color: theme.primary,
      fontWeight: "bold",
      fontSize: 15,
      marginLeft: 5,
    },
    selectionsContainer: {
      alignSelf: "flex-start",
      width: "100%",
    },
    selectedItem: {
      backgroundColor: theme.primarySoft,
      paddingHorizontal: 10,
      paddingVertical: 5,
      fontSize: 14,
      flexDirection: "row",
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "space-evenly",
      marginRight: 5,
      marginTop: 10,
      borderWidth: 1,
      borderColor: theme.primary,
    },
    selectedItemText: {
      color: theme.primary,
      paddingRight: 5,
      fontWeight: "600",
    },
  });
// Customizable Area End

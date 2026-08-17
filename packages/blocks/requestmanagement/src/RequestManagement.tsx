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
import { colors } from "../../utilities/src/Colors";
import { leftArrow } from "../../events/src/assets";
import Icon from "react-native-vector-icons/Feather";
// Customizable Area End

import RequestManagementController, {
  Props,
  configJSON,
} from "./RequestManagementController";

export default class RequestManagement extends RequestManagementController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }

  // Customizable Area Start
  // Customizable Area End

  render() {
    // Customizable Area Start
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: colors(false).background}}>
        <StatusBar barStyle="dark-content" backgroundColor={this.state.showConfirmationModal ? "#33415580" : colors(false).background}/>
        <ScrollView style={styles.rootContainer} contentContainerStyle={{flexGrow: 1}}>
          <View style={styles.headerContainer}>
            <TouchableOpacity
              testID="backButton"
              style={styles.backNavContainer}
              onPress={() => {
                this.props.navigation.goBack();
              }}
            >
              <Image source={leftArrow} style={styles.backNavButton} />
            </TouchableOpacity>
            <Text testID="testLabel" style={[styles.text, styles.titleText]}>New Category</Text>
          </View>
          <View style={styles.contentContainer}>
            <Text style={styles.subtitle}>You can add categories that you have not found in the given options</Text>
            <Text style={[styles.text, styles.inputFieldLabel]}>Category</Text>
            <TextInput
              testID="txtInputCategory"
              placeholder="Enter a category"
              placeholderTextColor="#CBD5E1"
              style={styles.inputField}
              value={this.state.newCategoryText}
              onChangeText={(newCategoryText) => this.setState({ newCategoryText })}
            />
            <TouchableOpacity testID="addNewCategoryTxt" style={styles.newCategoryLinkContainer} onPress={() => this.handleAddNewCategory()}>
              <Icon name="plus-circle" color="#4949EE" size={18} />
              <Text style={styles.newCategoryLink}>Add a new category</Text>
            </TouchableOpacity>
            <View style={styles.selectionsContainer}>
              <FlatList
                testID="newCategoriesList"
                data={this.state.newCategories}
                renderItem={(subCat: { item: string }) => (
                  <View style={styles.selectedItem}>
                    <Text style={styles.selectedItemText}>{subCat.item}</Text>
                    <Icon testID="removeCategory" name="x" size={17} color="#4949EE" onPress={() => this.handleRemoveCategory(subCat.item)} />
                  </View>
                )}
                scrollEnabled={false}
                numColumns={3}
              />
            </View>
          </View>
          <TouchableOpacity
            testID="btnSend"
            style={[styles.sendButton, { opacity: this.enableSendButton() ? 1 : 0.5 }]}
            onPress={() => { this.setState({ showConfirmationModal: true }) }}
            disabled={!(this.enableSendButton())}
          >
            <Text style={[styles.text, styles.sendButtonText]}>
              Send
            </Text>
          </TouchableOpacity>
        </ScrollView>
        {this.state.fetching &&
          <View style={styles.fetchingContainer}>
            <ActivityIndicator size={'large'} color="#4949EE"/>
          </View>
        }
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.showConfirmationModal}
        >
          <View style={styles.centeredModalView}>
            <View style={styles.modalContainerView}>
              <TouchableOpacity
                style={styles.closeModalButtonContainer}
                onPress={() => this.setState({ showConfirmationModal: false })} >
                <Icon name="x" color="#0F172A" size={25} />
              </TouchableOpacity>
              <Text style={styles.newCategoryHeading}>
                Send the new category ?
              </Text>
              <Text style={[styles.text, styles.newCategorySubHeading]}>
                These will be sent and approved in 3 work days. You will be notified about it.
              </Text>
              <TouchableOpacity
                testID="btnCancel"
                style={[styles.sendButton, styles.cancelButton]}
                onPress={() => this.setState({ showConfirmationModal: false })}
              >
                <Text style={[styles.text, styles.sendButtonText, styles.cancelButtonText]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                testID="btnConfirm"
                style={[styles.sendButton, styles.confirmButton]}
                onPress={this.handleAddNewCategoryAPICall}>
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
const styles = StyleSheet.create({
  rootContainer: {
    padding: 16,
    backgroundColor: colors(false).background,
    flex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
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
    fontSize: 28,
    maxWidth: "85%",
    alignSelf: "center",
    color: "black",
  },
  contentContainer: {
    flex: 1,
  },
  subtitle: {
    fontSize: 15,
  },
  text: {
    fontFamily: "OpenSans",
    alignSelf: "flex-start",
    color: colors(false).text,
  },
  fetchingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#ffffffdd',
    alignItems: "center",
    justifyContent: "center",
  },
  inputFieldLabel: {
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    fontSize: 16,
  },
  inputField: {
    width: "100%",
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: "#C5C5FF",
    color: colors(false).text,
    height: 50,
    fontSize: 16,
  },
  centeredModalView: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "#33415580",
  },
  newCategoryHeading: {
    fontWeight: "700",
    fontSize: 26,
    lineHeight: 28,
    marginVertical: 10,
    color: "#0F172A",
  },
  newCategorySubHeading: {
    fontSize: 18,
  },
  modalContainerView: {
    justifyContent: "space-between",
    backgroundColor: "white",
    borderTopEndRadius: 20,
    padding: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 100,
  },
  sendButton: {
    backgroundColor: "#3333CC",
    width: "100%",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 25,
  },
  sendButtonText: {
    color: colors(false).white,
    fontWeight: "700",
    fontSize: 18,
    alignSelf: "center",
  },
  cancelButton: {
    marginTop: 25,
    marginBottom: 5,
    backgroundColor: "transparent",
  },
  cancelButtonText: {
    color: "#4949EE",
  },
  confirmButton: {
    marginBottom: 0,
  },
  closeModalButtonContainer: {
    position: "absolute",
    right: 20,
    top: 20,
  },
  newCategoryLinkContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  newCategoryLink: {
    color: "#4949EE",
    fontWeight: "bold",
    fontSize: 15,
    marginLeft: 5,
  },
  selectionsContainer: {},
  selectedItem: {
    backgroundColor: "#EDEDFF",
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 14,
    flexDirection: "row",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "space-evenly",
    marginRight: 5,
    marginTop: 10,
  },
  selectedItemText: {
    color: "#4949EE",
    paddingRight: 5,
  },
});
// Customizable Area End

import React from "react";
// Customizable Area Start
import {
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  View,
  SafeAreaView,
  Image,
  StatusBar,
  TextInput,
  Modal,
  Platform,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";

import ContactusController, { configJSON } from "./ContactusController";

import { colors } from "../../utilities/src/Colors";
import { leftArrow, usFlag } from "../../email-account-registration/src/assets";
import { Picker } from '@react-native-picker/picker';
// Customizable Area End

export default class Contactus extends ContactusController {
  // Customizable Area Start
  renderHeader = () => {
    return (
      <View style={styles.header}>
        <TouchableOpacity
          testID="navigationBackButton"
          style={styles.backNavButton}
          onPress={() => {
            this.props.navigation.goBack();
          }}
        >
          <Image source={leftArrow} style={styles.backNavIcon} />
        </TouchableOpacity>
        <Text testID="testLabel" style={[styles.text, styles.headerTitle]}>
          Contact us
        </Text>
        <View style={styles.backNavButton} />
      </View>
    )
  }

  renderSubheading = () => {
    return (
      <Text style={[styles.text, {
        lineHeight: 22,
      }]}>
        {configJSON.disclaimer}
      </Text>
    )
  }

  renderName = () => {
    return (
      <>
        <Text style={[styles.textInputLabel]}>{configJSON.name}</Text>
        <TextInput
          testID="txtInputName"
          placeholder="Enter your name"
          placeholderTextColor="#CBD5E1"
          style={styles.textInput}
          value={this.state.name}
          onChangeText={this.handleName}
        />
      </>
    )
  }

  renderPhoneNumber = () => {
    return (
      <>
        <Text style={[styles.textInputLabel]}>{configJSON.cellphone}</Text>
        {
        this.state.countryCodeFetched &&
          (
            Platform.OS === "ios" ?

              <View>
                <TextInput
                  testID="txtInputCellPhone"
                  placeholder="Enter your cell phone"
                  placeholderTextColor="#CBD5E1"
                  style={[styles.textInput, styles.textInputPhone]}
                  keyboardType="numeric"
                  value={this.state.phoneNumber}
                  returnKeyType="next"
                  onChangeText={this.handlePhoneNumber}
                  maxLength={10}
                />
                {this.renderCountryCodeiOSPicker()}
              </View>
              :
              this.renderCountryCodeAndroidPicker()
          )
        }
      </>
    )
  }

  renderCountryCodeiOSPicker = () => {
    const hasFlag = this.state.selectedCountryCode && Object.keys(this.state.selectedCountryCode).length > 0
    const code = this.state.selectedCountryCode && Object.keys(this.state.selectedCountryCode).length > 0 ? `+${this.state.selectedCountryCode.attributes.country_code}` : ""
    return (
      <TouchableOpacity
        testID="btnCountryCodeSelect"
        style={styles.countryCodeContainer}
        onPress={this.showCountryCodeModal}
      >
        <Image source={hasFlag ? { uri: this.state.selectedCountryCode.attributes.map_url } : usFlag} style={styles.usFlagImg} />
        <Image
          source={leftArrow}
          style={[styles.downArrow, {
            position: "relative",
            right: 0,
            marginLeft: 10,
            backgroundColor: 'transparent',
          }]} />
        <Text
          style={[styles.text, styles.textCountryCode]}
        >{code}</Text>
      </TouchableOpacity>
    )
  }

  renderCountryCodeAndroidPicker = () => {
    const hasFlag = this.state.selectedCountryCode && Object.keys(this.state.selectedCountryCode).length > 0
    const code = this.state.selectedCountryCode && Object.keys(this.state.selectedCountryCode).length > 0 ? `+${this.state.selectedCountryCode.attributes.country_code}` : ""
    return (
      <View>
        <TextInput
          testID="txtInputCellPhone"
          placeholder="Enter your cell phone"
          placeholderTextColor="#CBD5E1"
          style={[styles.textInput, styles.textInputPhone]}
          keyboardType="numeric"
          value={this.state.phoneNumber}
          returnKeyType="next"
          onChangeText={this.handlePhoneNumber}
          maxLength={10}
        />
        <TouchableOpacity
          testID="btnCountryCodeSelectAndroid"
          style={styles.countryCodeContainer}
          onPress={() => { this.setState({ countryCodeClickedAndroid: true }) }}
        >
          <Image source={hasFlag ? { uri: this.state.selectedCountryCode.attributes.map_url } : usFlag} style={styles.usFlagImg} />
          <Image
            source={leftArrow}
            style={[styles.downArrow, {
              position: "relative",
              right: 0,
              marginLeft: 10,
              backgroundColor: 'transparent',
            }]} />
          <Text
            style={[styles.text, styles.textCountryCode]}>{code}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  renderEmail = () => {
    return (
      <>
        <Text style={[styles.textInputLabel]}>{configJSON.email}</Text>
        <TextInput
          testID="txtInputEmail"
          placeholder="Enter your email address"
          placeholderTextColor="#CBD5E1"
          style={styles.textInput}
          value={this.state.email}
          keyboardType="email-address"
          onChangeText={this.handleEmail}
        />
      </>
    )
  }

  renderSubject = () => {
    return (
      <>
        <Text style={[styles.textInputLabel]}>{configJSON.subject}</Text>
        <TextInput
          testID="txtInputSubject"
          placeholder="What would you like to talk about?"
          placeholderTextColor="#CBD5E1"
          style={styles.textInput}
          value={this.state.subject}
          onChangeText={this.handleSubject}
        />
      </>
    )
  }

  renderMessage = () => {
    return (
      <>
        <Text style={[styles.textInputLabel]}>{configJSON.message}</Text>
        <TextInput
          multiline
          textAlignVertical="top"
          testID="txtInputMessage"
          placeholder="Any details you would like to share?"
          placeholderTextColor="#CBD5E1"
          style={[styles.textInput, { lineHeight: 22, minHeight: 75, }]}
          value={this.state.description}
          onChangeText={this.handleMessage}
        />
      </>
    )
  }

  renderError = (errorType: string) => {
    return (
      <>
        {errorType !== "" && (
          <Text style={styles.errorText}>
            {errorType}
          </Text>
        )}
      </>
    )
  }

  renderCountryModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.modalVisible}
      >
        <View style={styles.centeredModalView}>
          <View style={styles.viewModal}>
            <Text style={styles.txtOutsideUS}>
              Are you outside the US?
            </Text>
            <Text style={[styles.text, styles.txtOnlySupportUS]}>
              We only support the United States right now.
            </Text>
            <TouchableOpacity
              testID="btnAccept"
              style={styles.continueButton}
              onPress={this.hideModalVisibility}
            >
              <Text style={[styles.text, styles.textContinueButton]}>
                Accept
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    )
  }

  renderCountryCodeModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.countryCodeClicked}
      >
        <TouchableWithoutFeedback testID="hideCountryCode" onPress={this.hideCountryCode}>
          <View style={styles.centeredModalView} >
            <TouchableWithoutFeedback>
              <View style={[styles.viewModal, { borderTopStartRadius: 20, padding: 15 }]}>
                <Picker
                  testID="countryCodePickerModal"
                  selectedValue={this.state.selectedCountryCode}
                  onValueChange={this.handleCountryCodeValueiOS}
                >
                  {this.state.countryCodesList?.map(
                    (item: any) => (
                      <Picker.Item key={item.id}
                        label={`${item.attributes.name} (+${item.attributes.country_code})`}
                        value={item} />
                    )
                  )}
                </Picker>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    )
  }

  render() {
    return (
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : undefined}
        behavior={this.isPlatformiOS() ? "padding" : undefined}>
        <SafeAreaView style={styles.container}>
          <ScrollView>
            <View>
              <StatusBar
                animated={true}
                hidden={false}
                backgroundColor="#EDEDFF"
              />
              <View>
                <View style={styles.pageBG}>
                  {this.renderHeader()}
                  {this.renderSubheading()}
                </View>
                {
                  !this.state.countryCodeFetched ?
                    <View style={styles.loadingContainer1}>
                      <ActivityIndicator size={'large'} color="black" />
                    </View>
                    :
                    <View style={{ margin: 20, paddingBottom: 20 }}>
                      {this.renderName()}
                      {this.renderError(this.state.nameError)}

                      {this.renderPhoneNumber()}
                      {this.renderError(this.state.phoneError)}

                      {this.renderEmail()}
                      {this.renderError(this.state.emailError)}

                      {this.renderSubject()}
                      {this.renderError(this.state.subjectError)}

                      {this.renderMessage()}
                      {this.renderError(this.state.messageError)}

                      <TouchableOpacity
                        testID="sendMessageBtn"
                        style={styles.button}
                        onPress={this.postContactAPI} >
                        <Text style={{ fontWeight: '700', fontSize: 16, color: "white" }}>Send message</Text>
                      </TouchableOpacity>
                    </View>
                }
              </View>
            </View>
            {this.renderCountryModal()}
            {this.renderCountryCodeModal()}
            <Modal
              animationType="slide"
              transparent={true}
              visible={this.state.countryCodeClickedAndroid}>
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#00000080' }}>
                <View style={{ width: '90%', maxHeight: '95%', backgroundColor: '#FFFFFF', padding: 10, }}>
                  <ScrollView>
                    {this.state.countryCodesList.map((item: any) => (
                      <TouchableOpacity testID="countryCode" key={item.attributes.country_code} style={{ marginVertical: 15, }} onPress={() => this.handleCountryCodeValueAndroid(item)}>
                        <Text style={{ color: 'black', }}>{`${item.attributes.name} (+${item.attributes.country_code})`}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>
            </Modal>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    );
  }
  // Customizable Area End
}

// Customizable Area Start
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginLeft: "auto",
    marginRight: "auto",
    width: '100%',
    backgroundColor: "#ffffffff",
  },
  pageBG: {
    backgroundColor: '#EDEDFF',
    borderBottomEndRadius: 32,
    paddingHorizontal: 16,
    paddingBottom: 16
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,

  },
  backNavButton: {
    width: 20,
  },
  backNavIcon: {
    width: 12,
    left: 0,
    resizeMode: "contain",
  },
  headerTitle: {
    fontWeight: "700",
    fontSize: 24,
  },
  hamburgerIcon: {
    width: 25,
    height: 16,
    resizeMode: "contain",
    marginRight: 5,
  },
  text: {
    color: colors(false).text,

  },
  textInputLabel: {
    fontWeight: "700",
    fontSize: 14,
    color: '#334155',
    marginTop: 20,
    marginBottom: 10,
  },
  textInput: {
    width: "100%",
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: "#C5C5FF",
    color: colors(false).text,
    height: 50,
  },
  button: {
    borderRadius: 10,
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#4949EE',
    width: '100%',
    marginTop: 40,
  },
  errorText: {
    fontFamily: "OpenSans",
    alignSelf: "flex-start",
    color: 'red',
    fontSize: 13,
    paddingTop: 2,
  },
  countryCodeContainer: {
    position: "absolute",
    left: 10,
    top: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  usFlagImg: {
    height: 25,
    width: 25,
    resizeMode: "contain",
  },
  countryCodeArrow: {
    position: "relative",
    right: 0,
    marginLeft: 10,
    backgroundColor: 'transparent',
  },
  textCountryCode: {
    alignSelf: "center",
    marginLeft: 10,
  },
  downArrow: {
    position: "absolute",
    right: 15,
    marginRight: 5,
    width: 8,
    backgroundColor: 'white',
    transform: [{ rotate: "-90deg" }],
    resizeMode: "contain",
  },
  centeredModalView: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "#33415580",
  },
  viewModal: {
    height: "30%",
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
  txtOutsideUS: {
    fontWeight: "700",
    fontSize: 26,
    lineHeight: 28,
    marginVertical: 10,
    color: "#0F172A",
  },
  txtOnlySupportUS: {
    fontSize: 18,
  },
  continueButton: {
    backgroundColor: "#3333CC",
    width: "100%",
    padding: 15,
    borderRadius: 10,
    marginTop: 25,
  },
  textContinueButton: {
    color: colors(false).white,
    fontWeight: "700",
    fontSize: 18,
    alignSelf: "center",
  },
  textInputPhone: {
    paddingLeft: 110,
  },
  loadingContainer1: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#ffffffdd',
    alignItems: "center",
    justifyContent: "center",
  },
});
// Customizable Area End

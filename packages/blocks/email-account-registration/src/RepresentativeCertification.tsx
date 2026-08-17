import React from 'react';

// Customizable Area Start
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import type {
  IosPickerProps,
  AndroidPickerProps,
} from './RepresentativeCertificationController';
import { colors } from '../../utilities/src/Colors';
import { backIcon, downArrowIcon } from './assets';
// Customizable Area End

import RepresentativeCertificationController, {
  Props,
  configJSON,
} from './RepresentativeCertificationController';

export default class RepresentativeCertification extends RepresentativeCertificationController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }

  render() {
    return (
      <KeyboardAvoidingView
        behavior={this.isPlatformiOS() ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView keyboardShouldPersistTaps="always" style={styles.container}>
          <TouchableWithoutFeedback
            testID={'Background'}
            onPress={() => {
              this.hideKeyboard();
            }}
          >
            {/* Customizable Area Start */}
            <SafeAreaView>
              <StatusBar backgroundColor="white" barStyle="dark-content" />
              <View style={styles.contentView}>
                <View style={styles.headerView}>
                  <TouchableOpacity
                    testID="backButton"
                    style={styles.backArrowBtn}
                    onPress={() => {
                      this.props.navigation.goBack();
                    }}
                  >
                    <Image source={backIcon} style={styles.backBtn} />
                  </TouchableOpacity>
                  <Text testID="pageTitle" style={[styles.txt, styles.title]}>
                    {configJSON.representativeCertificationTitle}
                  </Text>
                </View>

                {this.representativeContainer()}
              </View>
            </SafeAreaView>

            {/* Customizable Area End */}
          </TouchableWithoutFeedback>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  // Customizable Area Start

  renderTextInputField(props: {
    textID: string;
    placeholder: string;
    stateName: 'selectedBandArtist' | 'title' | 'fullName' | 'placeName';
    handleFunctionName:
      | 'handleTitle'
      | 'handleBandArtist'
      | 'handleFullName'
      | 'handlePlaceName';
    suggestionsText?: string;
  }) {
    return (
      <View style={styles.textInputContainer}>
        <TextInput
          testID={props.textID}
          placeholder={props.placeholder}
          placeholderTextColor="#CBD5E1"
          style={styles.textInput}
          value={this.state[props.stateName]}
          onChangeText={text => this[props.handleFunctionName](text)}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {props.suggestionsText && (
          <Text style={styles.fieldNotes}>{props.suggestionsText}</Text>
        )}
      </View>
    );
  }
  renderMessageError(
    stateName:
      | 'titleError'
      | 'fullNameError'
      | 'placeNameError'
      | 'bandArtistError',
  ) {
    if (this.state[stateName]) {
      return (
        <Text style={[styles.txt, styles.errorTxt, { marginBottom: 5 }]}>
          {this.state[stateName]}
        </Text>
      );
    }
  }
  representativeContainer() {
    const { userRole } = this.state;

    console.log('here is the userRole', userRole);

    return (
      <View style={{ marginTop: 20 }}>
        <Text style={[styles.txt, styles.descriptionTxt]}>
          {userRole === 'venue'
            ? configJSON.venueRepresentativeCertificationDescription
            : configJSON.bandRepresentativeCertificationDescription}
        </Text>
        <View>
          <Text style={[styles.txt, styles.textInputLabel]}>
            {configJSON.yourTitle}
          </Text>
          {this.renderTextInputField({
            textID: 'txtInputTitle',
            placeholder: 'Enter your title',
            stateName: 'title',
            handleFunctionName: 'handleTitle',
            suggestionsText:
              (userRole === 'band' || userRole === 'venue') &&
              configJSON.bandTitleExamples,
          })}

          {/* <Text style={{ color: '#A9A9A9', fontSize: 12, marginTop: 4 }}>
            Manager, Musician, Band Member, Self Artist, etc.
          </Text> */}

          {this.renderMessageError('titleError')}

          <Text style={[styles.txt, styles.textInputLabel]}>
            {configJSON.electronicSignature}
          </Text>
        </View>

        <View>
          {this.renderTextInputField({
            textID: 'txtInputFullName',
            placeholder: 'Enter your full name',
            stateName: 'fullName',
            handleFunctionName: 'handleFullName',
          })}
          {this.renderMessageError('fullNameError')}
        </View>

        <View>
          <Text style={[styles.txt, styles.textInputLabel]}>
            {userRole === 'venue' ? 'Business name' : 'Band / Artist Name'}
          </Text>
          {userRole === 'venue'
            ? this.renderTextInputField({
                textID: 'txtInputVenueName',
                placeholder: 'Enter your business name',
                stateName: 'placeName',
                handleFunctionName: 'handlePlaceName',
              })
            : this.renderTextInputField({
                textID: 'txtInputBandName',
                placeholder: 'Enter your Band / Artist name (The)',
                stateName: 'selectedBandArtist',
                handleFunctionName: 'handleBandArtist',
                suggestionsText: configJSON.bandArtistsNameNote,
              })}
          {this.renderMessageError('placeNameError')}
          {this.renderMessageError('bandArtistError')}
        </View>

        <Text
          style={[
            styles.txt,
            styles.descriptionTxt,
            { fontWeight: '700', marginTop: 20 },
          ]}
        >
          Note:{' '}
          <Text style={{ fontWeight: '400' }}>
            {configJSON.representativeCertificationDisclaimer}
          </Text>
        </Text>
        <View style={styles.checkboxContainer}>
          <TouchableOpacity
            style={styles.checkbox}
            testID="btnAuthorizePage"
            onPress={this.handleAuthorizePage}
          >
            {this.state.authorizePage && (
              <View style={styles.checkboxSelected} />
            )}
          </TouchableOpacity>
          <View>
            <Text style={[styles.txt, styles.descriptionTxt]}>
              {configJSON.authorizedToCreatePage}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          testID="btnCreateAccount"
          style={[
            styles.createAccountButton,
            { opacity: this.dynamicOpacity(this.state.authorizePage) },
          ]}
          onPress={() => {
            this.handleVerifyMyAccount();
          }}
          disabled={!this.state.authorizePage}
        >
          <Text style={[styles.txt, styles.createAccountText]}>
            {configJSON.verifyMyAccount}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
  // Customizable Area End
}

const styles = StyleSheet.create({
  // Customizable Area Start
  container: {
    flex: 1,
    padding: 16,
    width: '100%',
    backgroundColor: '#fff',
  },
  headerView: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  backArrowBtn: {
    position: 'absolute',
    left: -10,
    padding: 10,
  },
  backBtn: {
    left: 0,
    resizeMode: 'contain',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 22,
    marginHorizontal: 25,
    textAlign: 'center',
  },
  contentView: {
    flex: 1,
    marginBottom: 30,
    marginHorizontal: 10,
  },
  txt: {
    fontFamily: 'OpenSans',
    alignSelf: 'flex-start',
    color: colors(false).text,
  },
  descriptionTxt: {
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 22,
  },
  textInputLabel: {
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  textInputContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  textInput: {
    width: '100%',
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#C5C5FF',
    color: colors(false).text,
    height: 50,
    fontSize: 16,
  },
  fieldNotes: {
    fontSize: 12,
    marginTop: 4,
    color: '#888',
    opacity: 0.8,
    fontStyle: 'italic',
  },
  selectorPicker: {
    height: 50,
    justifyContent: 'center',
    paddingHorizontal: 0,
  },
  centeredModalView: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#33415580',
  },
  modalView: {
    height: '30%',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderTopEndRadius: 20,
    padding: 35,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 100,
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  checkbox: {
    height: 20,
    width: 20,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: colors(false).text,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    height: 12,
    width: 12,
    backgroundColor: '#3333CC',
    borderRadius: 2.5,
  },
  createAccountButton: {
    backgroundColor: '#3333CC',
    padding: 15,
    borderRadius: 10,
    marginTop: 35,
  },
  createAccountText: {
    color: colors(false).white,
    fontWeight: '700',
    fontSize: 18,
    alignSelf: 'center',
  },
  errorTxt: {
    color: 'red',
    fontSize: 13,
    paddingTop: 2,
  },
  centeredModal: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#33415580',
  },
  selector: {
    height: 50,
    justifyContent: 'center',
    paddingHorizontal: 0,
  },
  downArrow: {
    position: 'absolute',
    right: 15,
    backgroundColor: 'transparent',
    tintColor: '#4949EE',
    resizeMode: 'contain',
  },
  text: {
    fontFamily: 'OpenSans',
    alignSelf: 'flex-start',
    color: colors(false).text,
  },
  // Customizable Area End
});

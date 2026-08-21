import React from 'react';

// Customizable Area Start
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { redesignTheme } from '../../utilities/src/Colors';
import { backIcon } from './assets';
// Customizable Area End

import RepresentativeCertificationController, {
  Props,
  configJSON,
} from './RepresentativeCertificationController';

type CertTheme = typeof redesignTheme;

export default class RepresentativeCertification extends RepresentativeCertificationController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }

  get styles() {
    return createCertificationStyles(this.getCertificationTheme());
  }

  render() {
    const theme = this.getCertificationTheme();
    const styles = this.styles;
    return (
      <KeyboardAvoidingView
        behavior={this.isPlatformiOS() ? 'padding' : undefined}
        style={{ flex: 1, backgroundColor: theme.background }}
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
              <StatusBar
                backgroundColor={theme.background}
                barStyle={this.state.isDarkMode ? 'light-content' : 'dark-content'}
              />
              <View pointerEvents="none" style={styles.decorTop} />
              <View style={styles.contentView}>
                <View style={styles.headerView}>
                  <TouchableOpacity
                    testID="backButton"
                    style={styles.backArrowBtn}
                    onPress={() => {
                      this.props.navigation.goBack();
                    }}
                  >
                    <Image
                      source={backIcon}
                      style={[styles.backBtn, { tintColor: theme.foreground }]}
                    />
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
    const theme = this.getCertificationTheme();
    const styles = this.styles;
    return (
      <View style={styles.textInputContainer}>
        <TextInput
          testID={props.textID}
          placeholder={props.placeholder}
          placeholderTextColor={theme.muted}
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
        <Text style={[this.styles.txt, this.styles.errorTxt, { marginBottom: 5 }]}>
          {this.state[stateName]}
        </Text>
      );
    }
  }
  representativeContainer() {
    const { userRole } = this.state;
    const styles = this.styles;

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

        <View style={styles.noteCard}>
          <Text style={[styles.txt, styles.noteTitle]}>Note:</Text>
          <Text style={[styles.txt, styles.noteBody]}>
            {configJSON.representativeCertificationDisclaimer}
          </Text>
        </View>
        <View style={styles.checkboxContainer}>
          <TouchableOpacity
            style={[
              styles.checkbox,
              this.state.authorizePage && styles.checkboxChecked,
            ]}
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

const createCertificationStyles = (theme: CertTheme) => StyleSheet.create({
  // Customizable Area Start
  container: {
    flex: 1,
    padding: 16,
    width: '100%',
    backgroundColor: theme.background,
  },
  decorTop: {
    position: 'absolute',
    top: -90,
    right: -70,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: theme.primarySoft,
  },
  headerView: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
    alignItems: 'center',
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
    color: theme.foreground,
  },
  contentView: {
    flex: 1,
    marginBottom: 30,
    marginHorizontal: 10,
  },
  txt: {
    fontFamily: 'OpenSans',
    alignSelf: 'flex-start',
    color: theme.foreground,
  },
  descriptionTxt: {
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 22,
    color: theme.muted,
  },
  textInputLabel: {
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: theme.foreground,
  },
  textInputContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  textInput: {
    width: '100%',
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
    backgroundColor: theme.input,
    color: theme.foreground,
    height: 50,
    fontSize: 16,
  },
  fieldNotes: {
    fontSize: 12,
    marginTop: 4,
    color: theme.muted,
    opacity: 0.9,
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
    backgroundColor: 'rgba(8, 8, 15, 0.72)',
  },
  modalView: {
    height: '30%',
    justifyContent: 'space-between',
    backgroundColor: theme.card,
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
    alignItems: 'center',
  },
  checkbox: {
    height: 22,
    width: 22,
    borderWidth: 1.5,
    borderRadius: 6,
    borderColor: theme.muted,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.input,
  },
  checkboxChecked: {
    borderColor: theme.primary,
    backgroundColor: theme.primarySoft,
  },
  checkboxSelected: {
    height: 12,
    width: 12,
    backgroundColor: theme.primary,
    borderRadius: 3,
  },
  noteCard: {
    marginTop: 20,
    backgroundColor: theme.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.border,
    padding: 14,
  },
  noteTitle: {
    fontWeight: '700',
    fontSize: 15,
    color: theme.primary,
    marginBottom: 6,
  },
  noteBody: {
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 20,
    color: theme.muted,
  },
  createAccountButton: {
    backgroundColor: theme.primary,
    padding: 15,
    borderRadius: 12,
    marginTop: 35,
  },
  createAccountText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 18,
    alignSelf: 'center',
  },
  errorTxt: {
    color: '#D32F2F',
    fontSize: 13,
    paddingTop: 2,
  },
  centeredModal: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(8, 8, 15, 0.72)',
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
    tintColor: theme.primary,
    resizeMode: 'contain',
  },
  text: {
    fontFamily: 'OpenSans',
    alignSelf: 'flex-start',
    color: theme.foreground,
  },
  // Customizable Area End
});

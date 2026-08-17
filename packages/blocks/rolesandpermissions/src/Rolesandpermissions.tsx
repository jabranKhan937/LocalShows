import React from 'react';

// Customizable Area Start
import {
  Image,
  Modal,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FanIcon from './FanIcon';
import BandIcon from './BandIcon';
import VenueIcon from './VenueIcon';
// Customizable Area End

import RolesandpermissionsController, {
  Props,
  configJSON,
} from './RolesandpermissionsController';
import {colors} from '../../utilities/src/Colors';
import {leftArrow} from '../../email-account-registration/src/assets';

export default class Rolesandpermissions extends RolesandpermissionsController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }

  // Customizable Area Start
  RoleButton = ({
    testID,
    role,
    icon,
    fieldName,
    onPress,
  }: {
    testID?: string;
    role: string;
    fieldName: string;
    icon: React.ReactElement;
    onPress: () => void;
  }) => {
    const textColor =
      this.state.selectedRole === fieldName ? '#FFFFFF' : '#334155';
    const bgColor =
      this.state.selectedRole === fieldName ? '#4949EE' : '#FFFFFF';
    return (
      <TouchableOpacity
        testID={testID}
        style={[styles.roleButton, {backgroundColor: bgColor}]}
        onPress={onPress}>
        {icon}
        <Text
          style={[styles.text, styles.textRoleButton, {color: textColor}]}
          numberOfLines={2}>
          {role}
        </Text>
      </TouchableOpacity>
    );
  };

  // Customizable Area End

  render() {
    // Customizable Area Start
    // Merge Engine - render - Start
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.contentContainer}>
          <StatusBar
            barStyle="dark-content"
            backgroundColor={colors(false).background}
          />
          <Text style={[styles.text, styles.textHeading]}>Local Shows</Text>
          <Text style={[styles.text, styles.textIntro]}>I am a</Text>
          <this.RoleButton
            testID="btnFan"
            role="Fan"
            icon={
              <FanIcon
                color={
                  this.state.selectedRole === 'fan' ? '#DADADA' : '#334155'
                }
              />
            }
            onPress={() => this.setRole('fan')}
            fieldName="fan"
          />
          
          <this.RoleButton
            testID="btnVenue"
            // role="Venue / Club / Theater / Museum / Record_Label / Promoter"
            role="Venue / Museum / Theater / Label Booking Agent / Record Store"
            icon={
              <VenueIcon
                color={
                  this.state.selectedRole === 'venue' ? '#DADADA' : '#334155'
                }
              />
            }
            onPress={() => this.setRole('venue')}
            fieldName="venue"
          />

          <this.RoleButton
            testID="btnBand"
            role="Band / Artist"
            icon={
              <BandIcon
                color={
                  this.state.selectedRole === 'band' ? '#DADADA' : '#334155'
                }
              />
            }
            onPress={() => this.setRole('band')}
            fieldName="band"
          />


          <TouchableOpacity
            testID="btnGoToLogin"
            style={[
              styles.continueButton,
              {opacity: this.state.selectedRole ? 1 : 0.5},
            ]}
            onPress={() => this.goToSignup()}
            disabled={!this.state.selectedRole}>
            <Text style={[styles.text, styles.textContinueButton]}>
              Continue
            </Text>
          </TouchableOpacity>
        </View>
        <Modal visible={this.state.isModalVisible}>
          <View style={styles.flex1}>
            <View style={[styles.header]}>
              <TouchableOpacity
                testID="backToHome"
                style={styles.backArrowContainer}
                onPress={() => {
                  this.handleBack();
                }}>
                <Image source={leftArrow} style={styles.backArrow} />
              </TouchableOpacity>
            </View>
            <View style={styles.body}>
              <Image
                source={require('../../../mobile/assets/images/coming_soon.png')}
                style={styles.image}
              />
              <Text style={styles.comingSoon}>{configJSON.comingSoon}</Text>
              <Text style={styles.launchSoon}>{configJSON.launchVerySoon}</Text>
              <Text style={styles.launchSoon}>{configJSON.stayTune}</Text>
            </View>
          </View>
        </Modal>
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
    backgroundColor: colors(false).background,
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: '5%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontFamily: 'OpenSans',
    alignSelf: 'flex-start',
    color: colors(false).text,
  },
  textHeading: {
    color: '#0F172A',
    fontSize: 40,
    fontWeight: 'bold',
  },
  textIntro: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 5,
  },
  roleButton: {
    backgroundColor: colors(false).background,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
    width: '100%',
    height: 70,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textRoleButton: {
    fontSize: 14,
    paddingHorizontal: 10,
    alignSelf: 'center',
    maxWidth: '90%',
  },
  continueButton: {
    backgroundColor: '#3333CC',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    marginTop: 25,
  },
  textContinueButton: {
    color: colors(false).white,
    fontWeight: '700',
    fontSize: 18,
    alignSelf: 'center',
  },
  body: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  image: {
    height: 220,
    width: 220,
    resizeMode: 'contain',
  },
  comingSoon: {
    fontSize: 24,
    fontWeight: '700',
    color: '#4949EE',
    lineHeight: 28,
  },
  launchSoon: {
    fontSize: 14,
    fontWeight: '400',
    color: '#334155',
    lineHeight: 22,
    marginTop: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: 'white',
    paddingHorizontal: 16,
  },
  backArrowContainer: {},
  backArrow: {
    width: 12,
    left: 0,
    resizeMode: 'contain',
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flex1: {
    flex: 1,
  },
});
// Customizable Area End

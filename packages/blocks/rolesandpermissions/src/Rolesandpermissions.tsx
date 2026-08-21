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
import { redesignTheme } from '../../utilities/src/Colors';
// Customizable Area End

import RolesandpermissionsController, {
  Props,
  configJSON,
} from './RolesandpermissionsController';
import {leftArrow} from '../../email-account-registration/src/assets';

type RoleTheme = typeof redesignTheme;

export default class Rolesandpermissions extends RolesandpermissionsController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }

  // Customizable Area Start
  get styles() {
    return createRoleStyles(this.getRoleTheme());
  }

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
    const theme = this.getRoleTheme();
    const isSelected = this.state.selectedRole === fieldName;
    const textColor = isSelected ? '#FFFFFF' : theme.foreground;
    return (
      <TouchableOpacity
        testID={testID}
        style={[
          this.styles.roleButton,
          isSelected && this.styles.roleButtonSelected,
        ]}
        onPress={onPress}
        activeOpacity={0.85}>
        <View
          style={[
            this.styles.roleIconWrap,
            isSelected && this.styles.roleIconWrapSelected,
          ]}>
          {icon}
        </View>
        <Text
          style={[this.styles.text, this.styles.textRoleButton, {color: textColor}]}
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
    const theme = this.getRoleTheme();
    const styles = this.styles;
    const selected = this.state.selectedRole;
    return (
      <SafeAreaView style={styles.container}>
        <View pointerEvents="none" style={styles.decorTop} />
        <View pointerEvents="none" style={styles.decorBottom} />
        <View style={styles.contentContainer}>
          <StatusBar
            barStyle={this.state.isDarkMode ? 'light-content' : 'dark-content'}
            backgroundColor={theme.background}
          />
          <Text style={[styles.text, styles.textHeading]}>Local Shows</Text>
          <Text style={[styles.text, styles.textIntro]}>I am a</Text>
          <this.RoleButton
            testID="btnFan"
            role="Fan"
            icon={
              <FanIcon
                color={
                  selected === 'fan' ? '#FFFFFF' : theme.muted
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
                  selected === 'venue' ? '#FFFFFF' : theme.muted
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
                  selected === 'band' ? '#FFFFFF' : theme.muted
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
          <View style={[styles.flex1, {backgroundColor: theme.background}]}>
            <View style={[styles.header]}>
              <TouchableOpacity
                testID="backToHome"
                style={styles.backArrowContainer}
                onPress={() => {
                  this.handleBack();
                }}>
                <Image source={leftArrow} style={[styles.backArrow, {tintColor: theme.foreground}]} />
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
const createRoleStyles = (theme: RoleTheme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    justifyContent: 'center',
  },
  decorTop: {
    position: 'absolute',
    top: -80,
    right: -60,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: theme.primarySoft,
  },
  decorBottom: {
    position: 'absolute',
    bottom: -100,
    left: -70,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: theme.primarySoft,
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
    color: theme.foreground,
  },
  textHeading: {
    color: theme.primary,
    fontSize: 40,
    fontWeight: 'bold',
  },
  textIntro: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 12,
    color: theme.muted,
  },
  roleButton: {
    backgroundColor: theme.card,
    borderWidth: 1,
    borderColor: theme.border,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 3,
    width: '100%',
    minHeight: 76,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleButtonSelected: {
    backgroundColor: theme.primary,
    borderColor: theme.primary,
    shadowColor: theme.primary,
    shadowOpacity: 0.35,
  },
  roleIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.input,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleIconWrapSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
  },
  textRoleButton: {
    fontSize: 14,
    fontWeight: '600',
    paddingHorizontal: 12,
    alignSelf: 'center',
    maxWidth: '90%',
  },
  continueButton: {
    backgroundColor: theme.primary,
    width: '100%',
    padding: 15,
    borderRadius: 12,
    marginTop: 25,
  },
  textContinueButton: {
    color: '#FFFFFF',
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
    color: theme.primary,
    lineHeight: 28,
  },
  launchSoon: {
    fontSize: 14,
    fontWeight: '400',
    color: theme.muted,
    lineHeight: 22,
    marginTop: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: theme.background,
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

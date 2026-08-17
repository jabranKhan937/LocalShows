import React from 'react';
// Customizable Area Start
import {
  ScrollView,
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
  Platform,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';

import PostCreationCommonController, {
  configJSON,
} from './PostCreationCommonController';
import { leftArrow } from '../../events/src/assets';
import { leftArrowWhite } from '../../user-profile-basic/src/assets';
import { colors } from '../../utilities/src/Colors';
import { deviceHeight } from '../../../framework/src/Utilities';
import DateRangePicker from 'react-native-daterange-picker';
import moment from 'moment';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/Feather';
// Customizable Area End

export interface Props {
  navigation: any;
  // Customizable Area Start
  // Customizable Area End
}

export default class PostPostpone extends PostCreationCommonController {
  constructor(props: Props) {
    super(props);
  }

  async componentDidMount() {
    super.componentDidMount();

    // Initialize time list
    this.generateTimes();

    // Get eventId and eventTitle from navigation params
    const eventId =
      this.props.route?.params?.eventId ||
      this.props.navigation.state?.params?.eventId;
    const eventTitle =
      this.props.route?.params?.eventTitle ||
      this.props.navigation.state?.params?.eventTitle;

    if (eventId) {
      this.setState({ eventId });
    }

    if (eventTitle) {
      this.setState({ eventTitle });
    }

    // Initialize selectedDate from dateOfShow if it exists
    if (this.state.dateOfShow && !this.state.selectedDate) {
      const dateParts = this.state.dateOfShow.split('-');
      if (dateParts.length === 3) {
        const month = parseInt(dateParts[0], 10) - 1; // moment months are 0-indexed
        const day = parseInt(dateParts[1], 10);
        const year = parseInt(dateParts[2], 10);
        const selectedDate = moment().year(year).month(month).date(day);
        this.setState({ selectedDate });
      }
    }
  }

  renderHeader = () => {
    return (
      <View style={styles.headerView}>
        <TouchableOpacity
          testID="backButton"
          onPress={() => this.props.navigation.goBack()}
        >
          <Image source={leftArrow} style={styles.backButton} />
        </TouchableOpacity>
        <Text style={styles.title}>{configJSON.postponeShow}</Text>
        <Text />
      </View>
    );
  };

  renderDate = () => {
    return (
      <TouchableOpacity
        testID="btnDateSelector"
        style={styles.dateOfShowContainer}
        onPress={() => this.showDateSelector()}
      >
        <Text
          style={[
            styles.dateText,
            {
              color: this.state.undefinedDateSelected
                ? '#CBD5E1'
                : colors(false).text,
            },
          ]}
        >
          {this.state.dateOfShow !== '' ? this.state.dateOfShow : 'Select date'}
        </Text>
        <Image
          source={require('../../../mobile/assets/images/image_calendar.png')}
          style={[
            styles.backButton,
            {
              tintColor: this.state.undefinedDateSelected
                ? '#CBD5E1'
                : '#4949EE',
            },
          ]}
        />
      </TouchableOpacity>
    );
  };

  renderTime = () => {
    return (
      <>
        {Platform.OS === 'ios'
          ? this.renderTimeForIOS()
          : this.renderTimeForAndroid()}
      </>
    );
  };

  renderTimeForIOS = () => {
    return (
      <>
        <TouchableOpacity
          testID="btnTimeSelect"
          style={styles.pickerContainer}
          onPress={() =>
            !this.state.undefinedDateSelected &&
            this.setState({ openTimePicker: true })
          }
        >
          <Text
            style={[
              styles.picker,
              {
                paddingTop: 15,
                color: this.state.undefinedDateSelected
                  ? '#CBD5E1'
                  : colors(false).text,
              },
            ]}
          >
            {this.state.time || 'Select time'}
          </Text>
          <Image
            source={leftArrowWhite}
            style={[
              styles.pickerDropdown,
              {
                tintColor: this.state.undefinedDateSelected
                  ? '#CBD5E1'
                  : '#4949EE',
              },
            ]}
          />
        </TouchableOpacity>
      </>
    );
  };

  renderTimeForAndroid = () => {
    return (
      <>
        <View style={styles.pickerContainer}>
          <Picker
            testID="timePicker"
            style={[
              styles.picker,
              {
                color: this.state.undefinedDateSelected
                  ? '#CBD5E1'
                  : colors(false).text,
              },
            ]}
            itemStyle={styles.pickerItemStyle}
            selectedValue={this.state.time}
            onValueChange={time => {
              this.setState({ time });
            }}
            enabled={!this.state.undefinedDateSelected}
          >
            <Picker.Item label={'Select time'} value={''} />
            {this.state.timeList.map((name: string) => (
              <Picker.Item key={name} label={name} value={name} />
            ))}
          </Picker>
          <Image
            source={leftArrowWhite}
            style={[
              styles.pickerDropdown,
              {
                tintColor: this.state.undefinedDateSelected
                  ? '#CBD5E1'
                  : '#4949EE',
              },
            ]}
          />
        </View>
      </>
    );
  };

  renderUndefinedDate = () => {
    return (
      <View style={styles.showFeatureItem}>
        {!this.state.undefinedDateSelected ? (
          <TouchableOpacity
            testID="undefinedDate"
            style={styles.checkbox}
            onPress={() => {
              this.setState({ undefinedDateSelected: true });
            }}
          />
        ) : (
          <TouchableOpacity
            testID="definedDate"
            onPress={() => {
              this.setState({ undefinedDateSelected: false });
            }}
          >
            <Image
              source={require('../../../mobile/assets/images/checkbox.png')}
              style={[styles.backButton, { marginRight: 10 }]}
            />
          </TouchableOpacity>
        )}
        <Text style={[styles.label, { fontWeight: '400', marginTop: 1 }]}>
          {configJSON.undefinedDate}
        </Text>
      </View>
    );
  };

  renderModal = () => {
    return (
      <>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.openTimePicker}
        >
          <TouchableWithoutFeedback
            testID="hideTimeModal"
            onPress={this.hideTimeModal}
          >
            <View style={styles.modalContainer}>
              <TouchableWithoutFeedback>
                <View style={styles.modal}>
                  <Picker
                    testID="timePickerModal"
                    selectedValue={this.state.time}
                    onValueChange={value => {
                      this.setState({ openTimePicker: false, time: value });
                    }}
                    enabled={!this.state.undefinedDateSelected}
                  >
                    {this.state.timeList.map((name: string) => (
                      <Picker.Item key={name} value={name} label={name} />
                    ))}
                  </Picker>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </>
    );
  };

  render() {
    // Customizable Area Start
    // Customizable Area End
    return (
      <SafeAreaView style={styles.safeAreaView}>
        <StatusBar backgroundColor="#FFF" />
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Customizable Area Start */}
          <View style={styles.containerView}>
            {this.renderHeader()}
            <Text style={styles.eventTitle}>{this.state.eventTitle}</Text>
            <Text style={styles.label}>{configJSON.dateOfTheShow}</Text>
            {this.renderDate()}
            {this.state.dateOfShowError !== '' && (
              <Text style={styles.errorTextMsg}>
                {this.state.dateOfShowError}
              </Text>
            )}
            <Text style={styles.label}>{configJSON.time}</Text>
            {this.renderTime()}
            {this.state.timeError !== '' && (
              <Text style={styles.errorTextMsg}>{this.state.timeError}</Text>
            )}
            <Text style={styles.disclaimer}>{configJSON.checkBox}</Text>
            {this.renderUndefinedDate()}
          </View>
          {/* Customizable Area End */}
        </ScrollView>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            testID="saveBtn"
            style={styles.saveBtn}
            onPress={this.handlePostponeAPI}
            activeOpacity={0.8}
          >
            <Text style={styles.saveBtnText}>{configJSON.save}</Text>
          </TouchableOpacity>
        </View>
        {this.renderModal()}
        {!this.state.undefinedDateSelected && this.state.showDateSelector && (
          <>
            <View style={styles.calendarDateModal}>
              <DateRangePicker
                open={this.state.showDateSelector}
                onChange={this.setDates}
                date={moment(this.state.dateOfShow)}
                displayedDate={this.state.displayedDate}
                selectedStyle={{ backgroundColor: '#3333cc' }}
                minDate={new Date()}
                range
              />
            </View>
            <TouchableOpacity
              testID="hideCalendarPopup"
              style={styles.cancelCalendarPopup}
              onPress={() => this.setState({ showDateSelector: false })}
            >
              <Icon name="x" size={30} />
            </TouchableOpacity>
          </>
        )}
      </SafeAreaView>
    );
  }
}

// Customizable Area Start
const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignSelf: 'center',
    backgroundColor: '#FFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 100,
  },
  containerView: {
    backgroundColor: '#FFF',
    padding: 25,
  },
  headerView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#334155',
  },
  eventTitle: {
    fontWeight: '700',
    color: '#334155',
    fontSize: 20,
    marginTop: 30,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    marginTop: 20,
  },
  pickerContainer: {
    width: '100%',
    paddingHorizontal: 0,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: '#C5C5FF',
    height: 50,
    justifyContent: 'center',
    marginTop: 10,
  },
  picker: {
    width: '100%',
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: '#C5C5FF',
    height: 50,
    justifyContent: 'center',
  },
  pickerItemStyle: {
    fontFamily: 'OpenSans',
    alignSelf: 'flex-start',
    color: colors(false).text,
    fontSize: 16,
  },
  pickerDropdown: {
    position: 'absolute',
    right: 15,
    marginRight: 5,
    width: 8,
    backgroundColor: 'white',
    transform: [{ rotate: '-90deg' }],
    resizeMode: 'contain',
    tintColor: '#3333CC',
  },
  showFeatureItem: {
    flexDirection: 'row',
    width: '50%',
    marginTop: 20,
  },
  disclaimer: {
    fontWeight: '400',
    color: '#334155',
    lineHeight: 22,
    fontSize: 14,
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#33415580',
  },
  modal: {
    borderTopStartRadius: 20,
    padding: 15,
    height: '30%',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderTopEndRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 100,
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
  buttonContainer: {
    paddingHorizontal: 25,
    paddingVertical: 15,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  saveBtn: {
    borderRadius: 10,
    backgroundColor: '#3333CC',
    justifyContent: 'center',
    padding: 15,
    width: '100%',
    alignSelf: 'center',
  },
  saveBtnText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
    textAlignVertical: 'center',
    textAlign: 'center',
  },
  dateOfShowContainer: {
    width: '100%',
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: '#C5C5FF',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    height: 50,
    marginTop: 10,
  },
  dateText: {
    fontFamily: 'OpenSans',
    alignSelf: 'center',
    color: colors(false).text,
    fontSize: 16,
  },
  errorTextMsg: {
    fontFamily: 'OpenSans',
    alignSelf: 'flex-start',
    color: 'red',
    fontSize: 13,
    paddingTop: 2,
  },
  calendarDateModal: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelCalendarPopup: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 50,
    height: 50,
    backgroundColor: '#ffffff',
    zIndex: 2147483647,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
  },
});
// Customizable Area End

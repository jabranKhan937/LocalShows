import React from 'react';
// Customizable Area Start
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Platform,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import PostCreationCommonController, {
  configJSON,
} from './PostCreationCommonController';
import {
  androidPickerItemColor,
  lightTheme,
  redesignTheme,
} from '../../utilities/src/Colors';
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

  get styles() {
    return this.state.isDarkMode ? darkPostponeStyles : lightPostponeStyles;
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

  getCalendarPickerProps = () => ({
    backdropStyle: {
      backgroundColor: this.state.isDarkMode
        ? 'rgba(8, 8, 15, 0.78)'
        : 'rgba(0, 0, 0, 0.35)',
    },
    containerStyle: {
      backgroundColor: this.getPostTheme().card,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: this.getPostTheme().border,
    },
    headerStyle: {
      borderBottomColor: this.getPostTheme().border,
    },
    headerTextStyle: {
      color: this.getPostTheme().foreground,
      fontWeight: '700' as const,
    },
    monthButtonsStyle: {
      tintColor: this.getPostTheme().primary,
    },
    dayHeaderTextStyle: {
      color: this.getPostTheme().muted,
      fontWeight: '600' as const,
    },
    dayTextStyle: {
      color: this.getPostTheme().foreground,
    },
    selectedStyle: {
      backgroundColor: this.getPostTheme().primary,
    },
    selectedTextStyle: {
      color: '#FFFFFF',
      fontWeight: '700' as const,
    },
    disabledTextStyle: {
      color: this.getPostTheme().muted,
    },
    monthPrevButton: (
      <Icon name="chevron-left" size={22} color={this.getPostTheme().primary} />
    ),
    monthNextButton: (
      <Icon name="chevron-right" size={22} color={this.getPostTheme().primary} />
    ),
  });

  renderHeader = () => {
    return (
      <View style={this.styles.headerView}>
        <TouchableOpacity
          testID="backButton"
          style={this.styles.headerIconBtn}
          onPress={() => this.props.navigation.goBack()}
        >
          <Icon
            name="arrow-left"
            size={18}
            color={this.getPostTheme().foreground}
          />
        </TouchableOpacity>
        <Text style={this.styles.title}>{configJSON.postponeShow}</Text>
        <View style={this.styles.headerIconBtnPlaceholder} />
      </View>
    );
  };

  renderDate = () => {
    const locked = this.state.undefinedDateSelected;
    return (
      <TouchableOpacity
        testID="btnDateSelector"
        style={[this.styles.field, locked && this.styles.fieldLocked]}
        onPress={() => !locked && this.showDateSelector()}
        activeOpacity={locked ? 1 : 0.85}
      >
        <Text
          style={[
            this.styles.fieldText,
            (!this.state.dateOfShow || locked) && this.styles.fieldTextMuted,
          ]}
        >
          {this.state.dateOfShow !== '' ? this.state.dateOfShow : 'Select date'}
        </Text>
        <Icon
          name="calendar"
          size={18}
          color={locked ? this.getPostTheme().muted : this.getPostTheme().primary}
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
    const locked = this.state.undefinedDateSelected;
    return (
      <TouchableOpacity
        testID="btnTimeSelect"
        style={[this.styles.field, locked && this.styles.fieldLocked]}
        onPress={() => !locked && this.setState({ openTimePicker: true })}
        activeOpacity={locked ? 1 : 0.85}
      >
        <Text
          style={[
            this.styles.fieldText,
            (!this.state.time || locked) && this.styles.fieldTextMuted,
          ]}
        >
          {this.state.time || 'Select time'}
        </Text>
        <Icon
          name="chevron-down"
          size={18}
          color={locked ? this.getPostTheme().muted : this.getPostTheme().primary}
        />
      </TouchableOpacity>
    );
  };

  renderTimeForAndroid = () => {
    const locked = this.state.undefinedDateSelected;
    return (
      <View style={[this.styles.field, locked && this.styles.fieldLocked]}>
        <Picker
          testID="timePicker"
          style={this.styles.androidPicker}
          itemStyle={this.styles.androidPickerItem}
          selectedValue={this.state.time}
          onValueChange={time => {
            this.setState({ time });
          }}
          enabled={!locked}
        >
          <Picker.Item
            label={'Select time'}
            value={''}
            color={androidPickerItemColor}
          />
          {this.state.timeList.map((name: string) => (
            <Picker.Item
              key={name}
              label={name}
              value={name}
              color={androidPickerItemColor}
            />
          ))}
        </Picker>
        <View style={this.styles.pickerChevron} pointerEvents="none">
          <Icon
            name="chevron-down"
            size={18}
            color={locked ? this.getPostTheme().muted : this.getPostTheme().primary}
          />
        </View>
      </View>
    );
  };

  renderUndefinedDate = () => {
    const selected = this.state.undefinedDateSelected;
    return (
      <TouchableOpacity
        testID={selected ? 'definedDate' : 'undefinedDate'}
        style={this.styles.undefinedRow}
        activeOpacity={0.85}
        onPress={() => {
          this.setState({ undefinedDateSelected: !selected });
        }}
      >
        <View
          style={[this.styles.checkbox, selected && this.styles.checkboxChecked]}
        >
          {selected && <Icon name="check" size={14} color="#FFFFFF" />}
        </View>
        <Text style={this.styles.undefinedLabel}>{configJSON.undefinedDate}</Text>
      </TouchableOpacity>
    );
  };

  renderModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.openTimePicker}
      >
        <View style={this.styles.modalContainer}>
          <TouchableWithoutFeedback
            testID="hideTimeModal"
            onPress={this.hideTimeModal}
          >
            <View style={StyleSheet.absoluteFill} />
          </TouchableWithoutFeedback>
          <View style={this.styles.modal}>
            <Text style={this.styles.pickerModalTitle}>Select time</Text>
            <Text style={this.styles.pickerModalSelectedValue}>
              {this.state.time || '00h00'}
            </Text>
            <ScrollView
              testID="timePickerModal"
              style={this.styles.timePickerList}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              {...{
                onValueChange: (value: string) =>
                  this.handleTimeValueChange(value),
              }}
            >
              {this.state.timeList.map((name: string) => {
                const selected = name === this.state.time;
                return (
                  <TouchableOpacity
                    key={name}
                    activeOpacity={0.8}
                    onPress={() => this.handleTimeValueChange(name)}
                    style={[
                      this.styles.timePickerOption,
                      selected && this.styles.timePickerOptionSelected,
                    ]}
                  >
                    <Text
                      style={[
                        this.styles.timePickerOptionText,
                        selected && this.styles.timePickerOptionTextSelected,
                      ]}
                    >
                      {name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  render() {
    // Customizable Area Start
    // Customizable Area End
    return (
      <SafeAreaView
        style={this.styles.safeAreaView}
        edges={['top', 'left', 'right', 'bottom']}
      >
        <StatusBar
          barStyle={this.state.isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={this.getPostTheme().background}
        />
        <ScrollView
          style={this.styles.scrollView}
          contentContainerStyle={this.styles.scrollViewContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Customizable Area Start */}
          <View style={this.styles.containerView}>
            {this.renderHeader()}
            {!!this.state.eventTitle && (
              <Text style={this.styles.eventTitle}>{this.state.eventTitle}</Text>
            )}
            <Text style={this.styles.label}>{configJSON.dateOfTheShow}</Text>
            {this.renderDate()}
            {this.state.dateOfShowError !== '' && (
              <Text style={this.styles.errorTextMsg}>
                {this.state.dateOfShowError}
              </Text>
            )}
            <Text style={this.styles.label}>{configJSON.time}</Text>
            {this.renderTime()}
            {this.state.timeError !== '' && (
              <Text style={this.styles.errorTextMsg}>{this.state.timeError}</Text>
            )}
            <View style={this.styles.noteCard}>
              <Icon name="info" size={14} color={this.getPostTheme().primary} />
              <Text style={this.styles.disclaimer}>{configJSON.checkBox}</Text>
            </View>
            {this.renderUndefinedDate()}
          </View>
          {/* Customizable Area End */}
        </ScrollView>
        <View style={this.styles.buttonContainer}>
          <TouchableOpacity
            testID="saveBtn"
            style={this.styles.saveBtn}
            onPress={this.handlePostponeAPI}
            activeOpacity={0.85}
          >
            <Text style={this.styles.saveBtnText}>{configJSON.save}</Text>
          </TouchableOpacity>
        </View>
        {this.renderModal()}
        {!this.state.undefinedDateSelected && this.state.showDateSelector && (
          <>
            <View style={this.styles.calendarDateModal}>
              <DateRangePicker
                open={this.state.showDateSelector}
                onChange={this.setDates}
                date={moment(this.state.dateOfShow)}
                displayedDate={this.state.displayedDate}
                minDate={new Date()}
                range
                {...this.getCalendarPickerProps()}
              />
            </View>
            <TouchableOpacity
              testID="hideCalendarPopup"
              style={this.styles.cancelCalendarPopup}
              onPress={() => this.setState({ showDateSelector: false })}
            >
              <Icon name="x" size={22} color={this.getPostTheme().foreground} />
            </TouchableOpacity>
          </>
        )}
      </SafeAreaView>
    );
  }
}

// Customizable Area Start
const createPostponeStyles = (
  theme: typeof redesignTheme | typeof lightTheme,
) =>
  StyleSheet.create({
    safeAreaView: {
      flex: 1,
      width: '100%',
      backgroundColor: theme.background,
    },
    scrollView: {
      flex: 1,
    },
    scrollViewContent: {
      paddingBottom: 24,
    },
    containerView: {
      backgroundColor: theme.background,
      paddingHorizontal: 16,
      paddingTop: 8,
    },
    headerView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headerIconBtn: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.input,
      borderWidth: 1,
      borderColor: theme.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerIconBtnPlaceholder: {
      width: 32,
      height: 32,
    },
    title: {
      fontSize: 20,
      lineHeight: 24,
      fontWeight: '900',
      color: theme.foreground,
      textTransform: 'uppercase',
      letterSpacing: 0.3,
    },
    eventTitle: {
      fontWeight: '800',
      color: theme.foreground,
      fontSize: 22,
      marginTop: 28,
    },
    label: {
      fontSize: 14,
      fontWeight: '800',
      color: theme.primary,
      marginTop: 20,
      letterSpacing: 0.4,
    },
    field: {
      width: '100%',
      paddingHorizontal: 14,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.input,
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'row',
      height: 50,
      marginTop: 10,
    },
    fieldLocked: {
      opacity: 0.45,
    },
    fieldText: {
      color: theme.foreground,
      fontSize: 16,
      fontWeight: '500',
    },
    fieldTextMuted: {
      color: theme.muted,
      fontWeight: '400',
    },
    androidPicker: {
      width: '100%',
      color: theme.foreground,
      height: 50,
    },
    pickerChevron: {
      position: 'absolute',
      right: 14,
    },
    androidPickerItem: {
      color: theme.foreground,
      fontSize: 16,
    },
    noteCard: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginTop: 22,
      paddingVertical: 12,
      paddingHorizontal: 12,
      backgroundColor: theme.primarySoft,
      borderRadius: 12,
    },
    disclaimer: {
      flex: 1,
      fontWeight: '500',
      color: theme.muted,
      lineHeight: 20,
      fontSize: 14,
      marginLeft: 8,
    },
    undefinedRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 18,
      paddingVertical: 14,
      paddingHorizontal: 14,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.card,
    },
    undefinedLabel: {
      flex: 1,
      fontSize: 16,
      fontWeight: '700',
      color: theme.foreground,
    },
    checkbox: {
      height: 22,
      width: 22,
      borderWidth: 1.5,
      borderRadius: 6,
      borderColor: theme.muted,
      backgroundColor: 'transparent',
      marginRight: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkboxChecked: {
      borderColor: theme.primary,
      backgroundColor: theme.primary,
    },
    buttonContainer: {
      paddingHorizontal: 16,
      paddingTop: 8,
      paddingBottom: 12,
      backgroundColor: theme.background,
    },
    saveBtn: {
      borderRadius: 28,
      backgroundColor: theme.primary,
      justifyContent: 'center',
      paddingVertical: 16,
      width: '100%',
      alignSelf: 'center',
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.55,
      shadowRadius: 12,
      elevation: 8,
    },
    saveBtnText: {
      fontSize: 16,
      fontWeight: '800',
      color: '#FFFFFF',
      letterSpacing: 0.6,
      textTransform: 'uppercase',
      textAlign: 'center',
    },
    errorTextMsg: {
      alignSelf: 'flex-start',
      color: '#FF5C5C',
      fontSize: 13,
      fontWeight: '600',
      paddingTop: 6,
      lineHeight: 18,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: '#08080fcc',
    },
    modal: {
      borderTopStartRadius: 20,
      borderTopEndRadius: 20,
      padding: 15,
      height: '42%',
      backgroundColor: theme.card,
    },
    pickerModalTitle: {
      color: theme.muted,
      fontSize: 13,
      fontWeight: '700',
      textAlign: 'center',
      letterSpacing: 0.4,
      textTransform: 'uppercase',
      marginTop: 4,
    },
    pickerModalSelectedValue: {
      color: theme.foreground,
      fontSize: 28,
      fontWeight: '800',
      textAlign: 'center',
      marginTop: 6,
      marginBottom: 8,
    },
    timePickerList: {
      flex: 1,
      minHeight: 160,
    },
    timePickerOption: {
      paddingVertical: 12,
      alignItems: 'center',
      borderRadius: 12,
      marginBottom: 6,
    },
    timePickerOptionSelected: {
      backgroundColor: theme.primarySoft,
    },
    timePickerOptionText: {
      color: theme.foreground,
      fontSize: 20,
      fontWeight: '600',
    },
    timePickerOptionTextSelected: {
      color: theme.primary,
      fontWeight: '800',
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
      width: 44,
      height: 44,
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      zIndex: 2147483647,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 22,
    },
  });

const darkPostponeStyles = createPostponeStyles(redesignTheme);
const lightPostponeStyles = createPostponeStyles(lightTheme);
// Customizable Area End

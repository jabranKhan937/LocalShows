import React from "react";
// Customizable Area Start
import {
  View,
  Text,
  Modal,
  Image,
  TouchableOpacity,
  FlatList,
  TextInput,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";

import {
  AddIcon,
  LocationIcon,
  CricleTickIcon,
  CricleIcon,
  UpwardIcon,
  downAIcon,
  SquareTickIcon,
  alarm,
} from "./assets";
import DatePicker from "react-native-datepicker";
import scale, { verticalScale } from "../../../components/src/Scale";
// Customizable Area End

import styles from "./AddEventDetailStyle";
import AddEventDetailController, { Props, S } from "./AddEventDetailController";
export default class AddEventDetailScreen extends AddEventDetailController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }

  // Customizable Area Start
  TimePickerModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.showTimePickerModal}
        onRequestClose={() => {
          this.setState({ showTimePickerModal: false });
        }}
      >
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#00000090",
          }}
        >
          <View style={styles.modalview}>
            <DatePicker
              is24Hour={true}
              date={this.state.time}
              onDateChange={(time: any) =>
                this.setState({ time: time }, () =>
                  console.log("@@@ Time ===========", this.state.time)
                )
              }
              mode="time"
            />
            <View style={styles.modalbuttonview}>
              <TouchableOpacity
                style={styles.cancelbtn}
                onPress={() => this.setState({ showTimePickerModal: false })}
              >
                <Text style={styles.btntext}>CANCEL</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.savebtn}
                onPress={() =>
                  this.setState({ showTimePickerModal: false, showTime: true })
                }
              >
                <Text style={styles.btntext}>SAVE</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  DatePickerModal = () => {
    return (
      <View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.showDatePickerModal}
          onRequestClose={() => {
            this.setState({ showDatePickerModal: false });
          }}
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#00000090",
            }}
          >
            <View style={styles.modalview}>
              <DatePicker
                date={this.state.date}
                onDateChange={(date: any) =>
                  this.setState({ date: date }, () =>
                    console.log("@@@ Date ===========", this.state.date)
                  )
                }
                mode="date"
              />
              <View style={styles.modalbuttonview}>
                <TouchableOpacity
                  style={styles.cancelbtn}
                  onPress={() => this.setState({ showDatePickerModal: false })}
                >
                  <Text style={styles.btntext}>CANCEL</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.savebtn}
                  onPress={() =>
                    this.setState({
                      showDatePickerModal: false,
                      showDate: true,
                    })
                  }
                >
                  <Text style={styles.btntext}>SAVE</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  };

  renderTextInput = () => {
    return (
      <View>
        <TextInput
          value={this.state.title}
          style={styles.titleinput}
          placeholderTextColor="#ffffff"
          placeholder="Title"
          onChangeText={(text) => this.setState({ title: text })}
          editable={this.state.isOwner}
        />
        {this.state.isOwner ? (
          <View>
            <TouchableOpacity
              style={styles.cellContainer}
              onPress={() => this.setState({ showTimePickerModal: true })}
            >
              <Text style={styles.text}>
                {this.state.showTime
                  ? this.convertTime(this.state.time)
                  : "Time"}
              </Text>
              <Image source={AddIcon} style={styles.PlusIcon} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cellContainer}
              onPress={() => this.setState({ showDatePickerModal: true })}
            >
              <Text style={styles.text}>
                {this.state.showDate
                  ? this.convertDate(this.state.date)
                  : "Date"}
              </Text>
              <Image source={AddIcon} style={styles.PlusIcon} />
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <View style={styles.cellContainer}>
              <Text style={styles.text}>
                {this.state.showTime
                  ? this.convertTime(this.state.time)
                  : "Time"}
              </Text>
              <Image source={AddIcon} style={styles.PlusIcon} />
            </View>
            <View style={styles.cellContainer}>
              <Text style={styles.text}>
                {this.state.showDate
                  ? this.convertDate(this.state.date)
                  : "Date"}
              </Text>
              <Image source={AddIcon} style={styles.PlusIcon} />
            </View>
          </View>
        )}
      </View>
    );
  };

  renderLocationView = () => {
    return (
      <View>
        <TouchableOpacity
          style={styles.cellContainer}
          onPress={() =>
            this.props.navigation.navigate("AddEventLocation", {
              from: "event",
            })
          }
        >
          <Text style={styles.text}>{this.state.searchLocation}</Text>
          <Image source={LocationIcon} style={styles.LoactionIcon} />
        </TouchableOpacity>
      </View>
    );
  };

  renderAssignToCell = (item: any, index: any, type: keyof S) => {
    const isALL = item.id === "All";
    const isNone = item.id === "None";
    const isEmpty = this.state[type].includes("None");
    const isFull = this.state[type].includes("All");
    return (
      <View>
        {isALL || isNone ? (
          <TouchableOpacity
            onPress={
              isALL ? () => this.onPressAll(type) : () => this.onPressNone(type)
            }
          >
            <View style={styles.ROW}>
              <Image
                source={
                  (isALL && isFull) || (isNone && isEmpty)
                    ? CricleTickIcon
                    : CricleIcon
                }
                style={{
                  height:
                    (isALL && isFull) || (isNone && isEmpty)
                      ? scale(18)
                      : scale(16),
                  width:
                    (isALL && isFull) || (isNone && isEmpty)
                      ? scale(18)
                      : scale(16),
                  marginLeft: scale(15),
                  marginRight:
                    (isALL && isFull) || (isNone && isEmpty)
                      ? scale(13)
                      : scale(15),
                  marginBottom:
                    (isALL && isFull) || (isNone && isEmpty)
                      ? verticalScale(17)
                      : verticalScale(18),
                }}
              />
              <Text
                style={[
                  styles.listNameText,
                  {
                    marginBottom: verticalScale(13),
                    opacity: !((isALL && isFull) || (isNone && isEmpty))
                      ? 0.5
                      : 1,
                  },
                ]}
              >
                {item.name}
              </Text>
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => this.onPressAssignBtn(item, type)}>
            <View style={styles.ROW}>
              {this.state[type].includes(item.id) || isFull ? (
                <Image source={SquareTickIcon} style={styles.checkBoxImage} />
              ) : (
                <View style={styles.checkB} />
              )}
              <Text
                style={[
                  styles.listNameText,
                  {
                    marginBottom: verticalScale(13),
                    opacity: !((isALL && isFull) || (isNone && isEmpty))
                      ? 0.5
                      : 1,
                  },
                ]}
              >
                {item.name}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  RenderAssignToView = (param: any) => {
    const { type, typeView } = param;
    const data: any = this.state;
    return (
      <View>
        {this.state.isOwner ? (
          <TouchableOpacity
            testID={"btnAssignItem"}
            style={styles.cellContainer}
            onPress={() => {
              this.setState({
                [typeView]: !data[typeView],
              } as Pick<S, keyof S>);
            }}
          >
            <Text style={styles.text}>
              {typeView === "showAssignToList"
                ? this.state.lastAssigned
                : this.state.lastVisible}
            </Text>
            <Image
              source={data[typeView] ? UpwardIcon : downAIcon}
              style={styles.DropDownIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.cellContainer}>
            <Text style={styles.text}>
              {typeView === "showAssignToList"
                ? this.state.lastAssigned
                : this.state.lastVisible}
            </Text>
            <Image
              source={data[typeView] ? UpwardIcon : downAIcon}
              style={styles.DropDownIcon}
              resizeMode="contain"
            />
          </View>
        )}
        {data[typeView] ? (
          <View style={styles.openedView}>
            <FlatList
              data={this.state.partnerList}
              renderItem={({ item, index }) =>
                this.renderAssignToCell(item, index, type)
              }
              // keyExtractor={(item) => item.id}
            />
          </View>
        ) : null}
      </View>
    );
  };

  renderVisibilityCell = (item: any, index: any) => {
    return (
      <View>
        {!item.counter ? (
          <TouchableOpacity
            onPress={() => this.onPressVisibilityRadioBtn(item)}
          >
            <View style={styles.ROW}>
              <Image
                source={!item.isSelected ? CricleIcon : CricleTickIcon}
                style={{
                  height: item.isSelected ? scale(18) : scale(16),
                  width: item.isSelected ? scale(18) : scale(16),
                  marginLeft: scale(15),
                  marginRight: item.isSelected ? scale(13) : scale(15),
                  marginBottom: item.isSelected
                    ? verticalScale(17)
                    : verticalScale(18),
                }}
              />
              <Text
                style={[
                  styles.listNameText,
                  {
                    marginBottom: verticalScale(13),
                    opacity: !item.isSelected ? 0.5 : 1,
                  },
                ]}
              >
                {item.name}
              </Text>
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => this.onPressVisibilityCheckBox(item)}
          >
            <View style={styles.ROW}>
              {item.isSelected ? (
                <Image source={SquareTickIcon} style={styles.checkBoxImage} />
              ) : (
                <View style={styles.checkB} />
              )}
              <Text
                style={[
                  styles.listNameText,
                  {
                    marginBottom: verticalScale(13),
                    opacity: !item.isSelected ? 0.5 : 1,
                  },
                ]}
              >
                {item.name}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  renderVisibiltyView = () => {
    return (
      <View>
        <TouchableOpacity
          testID={"btnVisibility"}
          style={styles.cellContainer}
          onPress={() =>
            this.setState({
              showVisibilityList: !this.state.showVisibilityList,
            })
          }
        >
          <Text style={styles.text}>
            {this.state.showVisiblityValue
              ? this.state.visiblityValue.name
              : "Visibility"}
          </Text>
          <Image
            source={this.state.showVisibilityList ? UpwardIcon : downAIcon}
            style={styles.DropDownIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        {this.state.showVisibilityList ? (
          <View style={styles.openedView}>
            <FlatList
              data={this.state.visibilityList}
              renderItem={({ item, index }) =>
                this.renderVisibilityCell(item, index)
              }
              // keyExtractor={(item) => item.id}
            />
          </View>
        ) : null}
      </View>
    );
  };

  renderNotifyCell = (item: any, index: any) => {
    return (
      <TouchableOpacity onPress={() => this.onPressNotifyRadioBtn(item)}>
        <View style={styles.ROW}>
          <Image
            source={!item.isSelected ? CricleIcon : CricleTickIcon}
            style={{
              height: item.isSelected ? scale(18) : scale(16),
              width: item.isSelected ? scale(18) : scale(16),
              marginLeft: scale(15),
              marginRight: item.isSelected ? scale(13) : scale(15),
              marginBottom: item.isSelected
                ? verticalScale(17)
                : verticalScale(18),
            }}
          />
          <Text
            style={[
              styles.listNameText,
              {
                marginBottom: verticalScale(13),
                opacity: !item.isSelected ? 0.5 : 1,
              },
            ]}
          >
            {item.name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  renderNotifyView = () => {
    return (
      <View>
        {this.state.isOwner ? (
          <TouchableOpacity
            style={styles.cellContainer}
            onPress={() =>
              this.setState({ showNotifyList: !this.state.showNotifyList })
            }
          >
            <Text style={styles.text}>
              {this.state.showNotifyValue
                ? this.state.notifyValue.name
                : "Notify"}
            </Text>
            <Image
              source={this.state.showNotifyList ? UpwardIcon : downAIcon}
              style={styles.DropDownIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.cellContainer}>
            <Text style={styles.text}>
              {this.state.showNotifyValue
                ? this.state.notifyValue.name
                : "Notify"}
            </Text>
            <Image
              source={this.state.showNotifyList ? UpwardIcon : downAIcon}
              style={styles.DropDownIcon}
              resizeMode="contain"
            />
          </View>
        )}
        {this.state.showNotifyList ? (
          <View style={styles.notifyOpenedView}>
            <FlatList
              data={this.state.notifyList}
              renderItem={({ item, index }) =>
                this.renderNotifyCell(item, index)
              }
              // keyExtractor={(item) => item.id}
            />
          </View>
        ) : null}
      </View>
    );
  };

  renderRepeatCell = (item: any, index: any) => {
    return (
      <TouchableOpacity onPress={() => this.onPressRepeatRadioBtn(item)}>
        <View style={styles.ROW}>
          <Image
            source={!item.isSelected ? CricleIcon : CricleTickIcon}
            style={{
              height: item.isSelected ? scale(18) : scale(16),
              width: item.isSelected ? scale(18) : scale(16),
              marginLeft: scale(15),
              marginRight: item.isSelected ? scale(13) : scale(15),
              marginBottom: item.isSelected
                ? verticalScale(17)
                : verticalScale(18),
            }}
          />
          <Text
            style={[
              styles.listNameText,
              {
                marginBottom: verticalScale(13),
                opacity: !item.isSelected ? 0.5 : 1,
              },
            ]}
          >
            {item.name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  renderRepeatView = () => {
    const list = this.state.repeatValue;
    return (
      <View>
        {this.state.isOwner ? (
          <TouchableOpacity
            style={styles.cellContainer}
            onPress={() => {
              this.setState({ showRepeatList: !this.state.showRepeatList });
            }}
          >
            <Text style={styles.text}>
              {this.state.showRepeatValue
                ? this.state.repeatValue.name
                : "Repeat"}
            </Text>
            <Image
              source={this.state.showRepeatList ? UpwardIcon : downAIcon}
              style={styles.DropDownIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.cellContainer}>
            <Text style={styles.text}>
              {this.state.showRepeatValue
                ? this.state.repeatValue.name
                : "Repeat"}
            </Text>
            <Image
              source={this.state.showRepeatList ? UpwardIcon : downAIcon}
              style={styles.DropDownIcon}
              resizeMode="contain"
            />
          </View>
        )}
        {this.state.showRepeatList ? (
          <View style={styles.openedView}>
            <FlatList
              data={this.state.repeatList}
              renderItem={({ item, index }) =>
                this.renderRepeatCell(item, index)
              }
              // keyExtractor={(item) => item.id}
            />
          </View>
        ) : null}
        {this.state.customRepeatFlag && (
          <View>
            <View
              style={{
                flexDirection: "row",
                paddingLeft: 30,
                paddingRight: 20,
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              <Text style={styles.customText}>Repeat every</Text>
              <TextInput
                value={this.state.customRepeatDayValue}
                style={styles.custominput}
                placeholderTextColor="#ffffff"
                placeholder="day"
                onChangeText={(text) =>
                  this.setState({ customRepeatDayValue: text })
                }
                editable={this.state.isOwner}
                keyboardType="number-pad"
              />
              <TouchableOpacity
                style={styles.customcellContainer}
                onPress={() => {
                  this.setState({
                    showCustomRepeatList: !this.state.showCustomRepeatList,
                  });
                }}
              >
                <Text style={styles.text}>
                  {this.state.showCustomRepeatValue
                    ? this.state.customRepeatValue.name
                    : "Week"}
                </Text>
                <Image
                  source={
                    this.state.showCustomRepeatList ? UpwardIcon : downAIcon
                  }
                  style={styles.CustomDropDownIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
            {this.state.showCustomRepeatList ? (
              <View style={{ flexDirection: "row" }}>
                <View style={{ width: "62%" }} />
                <View style={styles.customopenedView}>
                  <FlatList
                    data={this.state.customRepeatList}
                    renderItem={({ item, index }) =>
                      this.renderCustomRepeatCell(item, index)
                    }
                    // keyExtractor={(item) => item.id}
                  />
                </View>
              </View>
            ) : null}
          </View>
        )}
      </View>
    );
  };

  renderCustomRepeatCell = (item: any, index: any) => {
    return (
      <TouchableOpacity onPress={() => this.onPressCustomRepeatRadioBtn(item)}>
        <View style={styles.ROW}>
          <Image
            source={!item.isSelected ? CricleIcon : CricleTickIcon}
            style={{
              height: item.isSelected ? scale(18) : scale(16),
              width: item.isSelected ? scale(18) : scale(16),
              marginLeft: scale(15),
              marginRight: item.isSelected ? scale(13) : scale(15),
              marginBottom: item.isSelected
                ? verticalScale(17)
                : verticalScale(18),
            }}
          />
          <Text
            style={[
              styles.listNameText,
              {
                marginBottom: verticalScale(13),
                opacity: !item.isSelected ? 0.5 : 1,
              },
            ]}
          >
            {item.name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  onPressCustomRepeatRadioBtn = (item: any) => {
    var tempList = this.state.customRepeatList;
    for (var i = 0; i < tempList.length; i++) {
      if (tempList[i].id == item.id) {
        tempList[i].isSelected = true;
        this.setState({
          customRepeatValue: tempList[i],
          showCustomRepeatValue: true,
        });
      } else {
        tempList[i].isSelected = false;
      }
    }
    this.setState({ customRepeatList: tempList, showCustomRepeatList: false });
  };

  renderNotesField = () => {
    return (
      <View style={{ marginBottom: verticalScale(37) }}>
        <TextInput
          value={this.state.notes}
          placeholder="Notes"
          placeholderTextColor="#ffffff"
          style={styles.inputStyles}
          multiline
          onChangeText={(text) => this.setState({ notes: text })}
        />
        <TouchableOpacity
          testID="btnSaveEvent"
          style={styles.saveButton}
          onPress={() => this.onPressSaveButton()}
        >
          {this.state.loading ? (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ActivityIndicator />
            </View>
          ) : (
            <Text style={styles.saveText}>SAVE</Text>
          )}
        </TouchableOpacity>
        {this.state.selectedEventId ? (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => this.onPressDelete()}
          >
            <Text style={styles.deleteText}>DELETE</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  };

  onPressDelete = () => {
    Alert.alert("", "Are you sure you want to delete this Event?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => {
          this.deleteEvent();
        },
      },
    ]);
  };

  renderClashModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.showClashModal}
        onRequestClose={() => {
          this.setState({ showClashModal: false });
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modaltxt}>
              This Event overlaps with another Event!
            </Text>
            <Image
              style={styles.modalImage}
              source={alarm}
              resizeMode="contain"
            />
            <TouchableOpacity
              style={styles.AddPartnerbtn}
              onPress={() => this.setState({ showClashModal: false })}
            >
              <Text style={styles.Addbtntxt}>CHANGE TIME</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };
  // Customizable Area End

  render() {
    // Customizable Area Start
    return (
      <ScrollView style={styles.container}>
        {/* <StatusBar hidden /> */}
        {this.renderTextInput()}
        {this.renderLocationView()}
        {this.RenderAssignToView({
          type: "assignToList",
          typeView: "showAssignToList",
        })}
        {this.RenderAssignToView({
          type: "visibilityList",
          typeView: "showVisibilityList",
        })}
        {this.renderNotifyView()}
        {this.renderRepeatView()}
        {this.renderNotesField()}
        {this.TimePickerModal()}
        {this.DatePickerModal()}
        {this.renderClashModal()}
      </ScrollView>
    );
    // Customizable Area End
  }
}

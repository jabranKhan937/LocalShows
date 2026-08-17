// Customizable Area Start
import { Platform, StyleSheet } from "react-native";
import scale, { verticalScale } from "../../../components/src/Scale";

export default StyleSheet.create({
  container: {
    backgroundColor: "#000000",
    flex: 1,
  },

  header: {
    flexDirection: "row",
    marginTop: verticalScale(62),
  },

  backBtn: {
    marginLeft: scale(23),
    width: scale(17),
    height: scale(20),
  },

  addeventtext: {
    color: "#ffffff",
    marginLeft: scale(100),
    fontSize: scale(20),
  },

  logoImage: {
    width: scale(29),
    height: scale(21),
    marginLeft: scale(88),
  },

  ROW: {
    flexDirection: "row",
    alignItems: "center",
  },

  view: {
    height: scale(15),
  },

  titleinput: {
    fontSize: scale(14),
    color: "#ffffff",
    paddingLeft: scale(13.5),
    width: scale(329),
    height: scale(41),
    borderRadius: scale(21),
    backgroundColor: "#1a1a1a",
    flexDirection: "row",
    marginTop: verticalScale(15),
    justifyContent: "space-between",
    alignSelf: "center",
    alignItems: "center",
  },

  custominput: {
    fontSize: scale(14),
    color: "#ffffff",
    paddingLeft: scale(13.5),
    width: scale(100),
    height: scale(41),
    borderRadius: scale(21),
    backgroundColor: "#1a1a1a",
    flexDirection: "row",
    marginTop: verticalScale(15),
    justifyContent: "space-between",
    alignSelf: "center",
    alignItems: "center",
  },

  customcellContainer: {
    width: scale(100),
    height: scale(41),
    borderRadius: scale(21),
    backgroundColor: "#1a1a1a",
    flexDirection: "row",
    marginTop: verticalScale(15),
    justifyContent: "space-between",
    alignSelf: "center",
    alignItems: "center",
  },

  checkBoxImage: {
    height: scale(14),
    width: scale(14),
    marginLeft: scale(15),
    marginRight: scale(17),
    marginBottom: verticalScale(20),
  },

  checkB: {
    height: scale(14),
    width: scale(14),
    borderColor: "#ffffff",
    borderWidth: scale(1),
    marginBottom: verticalScale(19),
    opacity: 0.5,
    marginLeft: scale(15),
    marginRight: scale(19),
  },

  listNameText: {
    fontSize: scale(18),
    color: "#ffffff",
  },

  cellContainer: {
    width: scale(329),
    height: scale(41),
    borderRadius: scale(21),
    backgroundColor: "#1a1a1a",
    flexDirection: "row",
    marginTop: verticalScale(15),
    justifyContent: "space-between",
    alignSelf: "center",
    alignItems: "center",
  },

  text: {
    fontSize: scale(14),
    color: "#ffffff",
    marginLeft: scale(13.5),
    opacity: 60,
    flex: 1,
  },

  PlusIcon: {
    marginRight: scale(20),
    width: scale(14),
    height: scale(14),
  },

  LoactionIcon: {
    marginRight: scale(20),
    width: scale(14),
    height: scale(17),
  },

  DropDownIcon: {
    marginRight: scale(20),
    width: scale(12),
    height: scale(16),
  },

  notifyOpenedView: {
    width: scale(329),
    height: scale(124),
    backgroundColor: "#1a1a1a",
    borderRadius: scale(20),
    marginTop: verticalScale(11),
    alignSelf: "center",
    paddingVertical: verticalScale(19),
  },

  openedView: {
    width: scale(329),
    backgroundColor: "#1a1a1a",
    borderRadius: scale(20),
    marginTop: verticalScale(10),
    alignSelf: "center",
    paddingTop: verticalScale(19),
  },

  customopenedView: {
    width: scale(120),
    backgroundColor: "#1a1a1a",
    borderRadius: scale(20),
    marginTop: verticalScale(10),
    alignSelf: "center",
    paddingTop: verticalScale(19),
  },

  inputStyles: {
    fontSize: scale(14),
    color: "#ffffff",
    paddingLeft: scale(16),
    paddingTop: verticalScale(13),
    width: scale(329),
    height: scale(139),
    backgroundColor: "#1a1a1a",
    borderRadius: scale(21),
    marginTop: verticalScale(15),
    alignSelf: "center",
    textAlignVertical: "top",
  },

  saveButton: {
    width: scale(329),
    height: scale(42),
    borderRadius: scale(21),
    backgroundColor: "#45ebe1",
    marginTop: verticalScale(30),
    justifyContent: "center",
    marginLeft: scale(23),
    alignItems: "center",
  },

  saveText: {
    color: "#000000",
    // fontFamily: FONTS.GilroyBold,
    fontWeight: "bold",
    fontSize: scale(16),
  },

  deleteButton: {
    width: scale(329),
    height: scale(42),
    borderRadius: scale(21),
    borderColor: "#656565",
    borderWidth: scale(1),
    marginTop: verticalScale(10),
    justifyContent: "center",
    marginLeft: scale(23),
    alignItems: "center",
  },

  deleteText: {
    color: "#ffffff",
    // fontFamily: FONTS.GilroyExtraBold,
    fontWeight: "bold",
    fontSize: scale(16),
  },

  modalview: {
    backgroundColor: "#ffffff",
    height: scale(291),
    width: scale(329),
    borderRadius: scale(20),
    marginVertical: scale(200),
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },

  modalbuttonview: {
    flexDirection: "row",
  },

  cancelbtn: {
    height: scale(35),
    width: scale(119),
    borderRadius: scale(21),
    borderColor: "#cdcdcd",
    borderWidth: scale(1),
    alignItems: "center",
    justifyContent: "center",
  },

  savebtn: {
    height: scale(35),
    width: scale(119),
    borderRadius: scale(21),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#45ebe1",
    marginLeft: scale(20),
  },

  btntext: {
    fontSize: scale(14),
    fontWeight: "bold",
    color: "#000000",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#00000095",
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "#ffffff",
    width: scale(329),
    height: scale(250),
    borderRadius: scale(20),
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  modaltxt: {
    color: "#000000",
    fontSize: scale(16),
    height: 20,
  },
  modalImage: {
    marginTop: verticalScale(20),
    width: scale(107),
    height: scale(75),
  },
  AddPartnerbtn: {
    width: scale(298),
    height: scale(42),
    borderRadius: scale(21),
    backgroundColor: "#67ebe1",
    marginTop: verticalScale(27),
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  Addbtntxt: {
    color: "#000000",
    fontSize: scale(16),
    fontWeight: "bold",
    marginTop: Platform.OS === "ios" ? 8 : 0,
  },
  CustomDropDownIcon: {
    marginLeft: scale(75),
    position: "absolute",
    width: scale(12),
    height: scale(16),
  },
  customText: {
    fontSize: scale(14),
    color: "#ffffff",
    marginTop: scale(15),
    opacity: 60,
  },
});
// Customizable Area End

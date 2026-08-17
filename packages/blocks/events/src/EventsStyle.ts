import { StyleSheet } from "react-native";
import scale, { verticalScale } from "../../../components/src/Scale";

// Customizable Area Start
export default StyleSheet.create({
  container: {
    backgroundColor: "#000000",
    flex: 1,
  },

  eventBg: {
    height: scale(531),
    alignSelf: "flex-end",
    backgroundColor: "#000000",
    marginLeft: scale(105),
  },

  header: {
    marginTop: verticalScale(59),
    paddingHorizontal: scale(23),
    justifyContent: "space-between",
    flexDirection: "row",
  },

  backBtn: {
    marginTop: verticalScale(3),
    width: scale(17),
    height: scale(20),
  },

  addEventText: {
    color: "#ffffff",
    fontSize: scale(20),
    alignSelf: "center",
    fontWeight: "700",
  },

  logoImage: {
    width: scale(29),
    height: scale(21),
    marginTop: verticalScale(4),
  },

  eventCellView: {
    width: scale(329),
    height: scale(41),
    borderRadius: scale(21),
    backgroundColor: "#1a1a1a",
    marginTop: verticalScale(15),
    marginLeft: scale(23),
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },

  eventCellText: {
    fontSize: scale(14),
    color: "#ffffff",
    textAlign: "left",
  },

  eventCellImage: {
    width: scale(24),
    height: scale(20),
    marginLeft: scale(19),
  },

  forwardBtn: {
    width: scale(11),
    height: scale(15),
    marginRight: scale(20),
  },
});
// Customizable Area End

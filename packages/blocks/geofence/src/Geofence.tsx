import React from "react";

// Customizable Area Start
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableWithoutFeedback,
  Image,
  TouchableOpacity,
  Platform,
} from "react-native";
import { deviceHeight } from "../../../framework/src/Utilities";
import { leftArrow } from "../../events/src/assets";
import { colors } from "../../utilities/src/Colors";
import Icon from "react-native-vector-icons/Feather";

// Customizable Area End


// Customizable Area Start
// Customizable Area End

import GeofenceController, { Props, configJSON } from "./GeofenceController";

export default class Geofence extends GeofenceController {
  // Customizable Area Start
  // Customizable Area End

  render() {
    // Customizable Area Start
    return (
      <ScrollView keyboardShouldPersistTaps="always" style={styles.container}>
        <TouchableWithoutFeedback onPress={this.hideKeyboard}>
          {/* Customizable Area Start */}
          {/* Merge Engine UI Engine Code */}
          <View style={{ flex: 1, height: deviceHeight }}>
            <View style={[styles.header,]}>
            <Text testID="pageTitle" style={[styles.text, styles.screenTitle]}>Travel</Text>
              <TouchableOpacity
                testID="backToHome"
                style={styles.backArrowContainer}
                onPress={() => this.handleNavigation("Home")}
              >
                <Image source={leftArrow} style={styles.backArrow} />
              </TouchableOpacity>
        
              <View style={styles.iconsContainer}>
                {this.state.userAuthToken !== null &&
                  <TouchableOpacity
                    testID="bellIcon"
                    style={styles.notificationIconContainer}
                    onPress={() => { this.handleNavigation("Notifications") }}
                  >
                    <Image
                      source={require('../../../mobile/assets/images/notifications.png')}
                      style={styles.notificationIcon}
                    />
                  </TouchableOpacity>
                }
                <TouchableOpacity testID="drawerMenu" onPress={() => this.props.navigation.openDrawer()}>
                <Image style={{ height: 20, width: 20, resizeMode: 'contain' }}
                  source={require('../../../mobile/assets/images/Vector.png')} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.body}>
              <Image source={require('../../../mobile/assets/images/coming_soon.png')} style={styles.image} />
              <Text style={styles.comingSoon}>{configJSON.comingSoon}</Text>
              <Text style={styles.launchSoon}>{configJSON.launchVerySoon}</Text>
              <Text style={styles.launchSoon}>{configJSON.stayTune}</Text>
            </View>
            
            <View style={{ flex: 0.2, }}></View>
          </View>
          {/* Merge Engine UI Engine Code */}
          {/* Customizable Area End */}
        </TouchableWithoutFeedback>
      </ScrollView>
    );
    // Customizable Area End
  }
}

// Customizable Area Start
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingHorizontal:16,
    paddingBottom:16,
    paddingTop:5
  },
  body: {
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center',
    flex: 0.6
  },
  image: {
    height: 220,
    width: 220,
    resizeMode: 'contain'
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor:'white',
  },
  backArrowContainer: {
  },
  backArrow: {
    width: 12,
    left: 0,
    resizeMode: "contain",
  },
  screenTitle: {
    fontWeight: "700",
    fontSize: 24,
    color: '#0F172A',
    position:"absolute",
    width:'100%',
    textAlign:'center',

    
  },
  text: {
    fontFamily: "OpenSans",
    color: colors(false).text,
  },
  iconsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  notificationIconContainer: {
    flexDirection:'row',
    marginRight:10
  },
  notificationIcon: {
    resizeMode: "contain",
    width:25,
    height:25,
  },
  hamburger: {
    width: 20,
    height:20,
    resizeMode: "contain",
    marginRight: Platform.OS === "ios" ? 12 : 0,
  },
});
// Customizable Area End

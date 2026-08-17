import { runEngine } from "../../../framework/src/RunEngine";

import {
  GoogleSignin,
  statusCodes
} from "@react-native-google-signin/google-signin";

// Customizable Area Start
// Customizable Area End

export class GoogleMobileDelegate {
  googleMobileUserStatusChanged(userInfo: any, isRegistration: boolean): void {}
}

class GoogleMobileController {
  googleUserInfo: any;
  delegateClass: GoogleMobileDelegate;

  static instance = new GoogleMobileController();

  // Customizable Area Start
  // Customizable Area End

  constructor() {
    this.delegateClass = new GoogleMobileDelegate();
    this.configureGoogleSignin();
    this.handleGoogleSignIn = this.handleGoogleSignIn.bind(this);
    // Customizable Area Start
    // Customizable Area End 
  }

  // Customizable Area Start
  // GooGle MOBILE Methods
  configureGoogleSignin() {
    try {
      GoogleSignin.configure({
        //It is mandatory to call this method before attempting to call signIn()
        scopes: ["profile", "email"],
        offlineAccess: false,
        iosClientId: '' // Add your iOS client ID here if using Google Sign-In
      });
    } catch (error) {
      console.log('Google Sign-In configuration skipped:', error);
      // Silently fail if Google Sign-In is not properly configured
    }
  }

  handleGoogleSignIn(delegateClass: any, isRegistration: boolean) {
    GoogleMobileController.instance.delegateClass = delegateClass;
    return this.signIn(isRegistration);
  }

  signIn = (isRegistration: boolean) => {
    return new Promise(async (resolve, reject) => {
      try {
        await GoogleSignin.hasPlayServices({
          //Check if device has Google Play Services installed.
          //Always resolves to true on iOS.
          showPlayServicesUpdateDialog: true
        });

        // call resolve if the method succeeds

        const userInfo = await GoogleSignin.signIn();
        GoogleMobileController.instance.googleUserInfo = {
          email: userInfo.user.email,
          id: userInfo.user.id
        };
        GoogleMobileController.instance.delegateClass.googleMobileUserStatusChanged(
          GoogleMobileController.instance.googleUserInfo,
          isRegistration
        );
        return resolve(true);
      } catch (error) {
        if (
            error.code === statusCodes.SIGN_IN_CANCELLED || 
            error.code === statusCodes.IN_PROGRESS || 
            error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE
          ) {
          runEngine.debugLog(error.code);
          } else {
          // some other error happened
          runEngine.debugLog("something went wrong!");
        }
        return reject(error);
      }
    });
  };
  // Customizable Area End
}

// Customizable Area Start
// Customizable Area End

const googleMobileController = new GoogleMobileController();
export default googleMobileController;

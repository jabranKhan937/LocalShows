import { runEngine } from "../../../framework/src/RunEngine";

const configJSON = require("./config");

// Customizable Area Start
// Customizable Area End

export class GoogleWebDelegate {
  googleUserStatusChanged(userInfo: any, isRegistration: boolean): void {}
}

class GoogleWebController {
  googleUser: any;
  googleUserInfo: any;
  delegateClass: GoogleWebDelegate;

  // Customizable Area Start
  // Customizable Area End

  static instance = new GoogleWebController();

  constructor() {
    this.googleLogIn = this.googleLogIn.bind(this);
    this.updateGoogleUser = this.updateGoogleUser.bind(this);
    // Customizable Area Start
    // Customizable Area End
  }

  // Customizable Area Start
  ///////////////////////////////////
  signinChanged(val: any) {
    runEngine.debugLog("Signin state changed to ", val);
  }

   userChanged(user: any, isRegistration: boolean) {
    runEngine.debugLog("USER NOW: ", user);
    if (GoogleWebController.instance.updateGoogleUser(user)) {
      GoogleWebController.instance.delegateClass.googleUserStatusChanged(
        GoogleWebController.instance.googleUserInfo,
        isRegistration
      );
    }
  }

  parseUserDetails = (token: string) => {
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  };

  googleLogIn(delegateClass: any, credential: string) {
    try {
      GoogleWebController.instance.googleUser = null;
      GoogleWebController.instance.delegateClass = delegateClass;

      const authDetail = this.parseUserDetails(credential);
      GoogleWebController.instance.signinChanged(authDetail);
      GoogleWebController.instance.userChanged(authDetail, false)

      return Promise.resolve(authDetail)
    } catch (error) {
      runEngine.debugLog(error);
    }
  }

  updateGoogleUser(googleUser: any) {
    if (googleUser && googleUser !== GoogleWebController.instance.googleUser) {
      GoogleWebController.instance.googleUser = googleUser;
        runEngine.debugLog(googleUser.sub + "_______" + googleUser.email);
        GoogleWebController.instance.googleUserInfo = {
          email: googleUser.email,
          id: googleUser.sub,
        };
        return true;
    }

    return false;
  }
  // Customizable Area End
}

// Customizable Area Start
// Customizable Area End

const googleController = new GoogleWebController();
export default googleController;

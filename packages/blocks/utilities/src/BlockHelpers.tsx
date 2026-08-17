import { Platform, Keyboard } from 'react-native';

import { runEngine } from '../../../framework/src/RunEngine';
import { Message } from '../../../framework/src/Message';
import MessageEnum, { getName } from '../../../framework/src/Messages/MessageEnum';

const getOS = (): string => {
  return Platform.OS;
}

const isPlatformWeb = () => {
  return getOS() === 'web';
};

const isPlatformiOS = () => {
  return getOS() === 'ios';
};

const isPlatformAndroid = () => {
  return getOS() === 'android';
};

const showAlert = (
  title: string,
  error: string,
  btnPositiveText?: string,
  btnPositiveMessage?: Message,
  btnNegativeText?: string,
  btnNegativeMessage?: Message,
  btnNeutralText?: string,
  btnNeutralMessage?: Message,
  navigationProps?: Object,
) => {
  Keyboard.dismiss();

  if (!btnPositiveText && !btnNegativeText && !btnNeutralText) {
    btnPositiveText = 'Ok';
  }

  const alertMsg: Message = new Message(getName(MessageEnum.AlertMessage));
  alertMsg.addData(getName(MessageEnum.AlertTitleMessage), title);
  alertMsg.addData(getName(MessageEnum.AlertBodyMessage), error);
  alertMsg.addData(
    getName(MessageEnum.NavigationPropsMessage),
    navigationProps,
  );

  alertMsg.addData(
    getName(MessageEnum.NavigationPropsMessage),
    navigationProps,
  );

  alertMsg.addData(
    getName(MessageEnum.AlertButtonPositiveText),
    btnPositiveText,
  );
  alertMsg.addData(
    getName(MessageEnum.AlertButtonNegativeText),
    btnNegativeText,
  );
  alertMsg.addData(getName(MessageEnum.AlertButtonNeutralText), btnNeutralText);

  alertMsg.addData(
    getName(MessageEnum.AlertButtonPositiveMessage),
    btnPositiveMessage,
  );
  alertMsg.addData(
    getName(MessageEnum.AlertButtonNegativeMessage),
    btnNegativeMessage,
  );
  alertMsg.addData(
    getName(MessageEnum.AlertButtonNeutralMessage),
    btnNeutralMessage,
  );

  runEngine.sendMessage(alertMsg.id, alertMsg);
};

const parseApiErrorResponse = (responseJson: any) => {
  if (!responseJson || !responseJson.errors) {
    return;
  }
  const errors: any[] = responseJson.errors;

  let allerrors = '';
  errors.map((object: string) => {
    const newLocal = JSON.stringify(object);
    JSON.parse(newLocal, (key, value) => {
      if (value.length > 0) {
        if (allerrors.length <= 0) {
          allerrors = value;
        } else {
          allerrors = `${allerrors}{\n}${value}`;
        }
      }
    });
  });

  showAlert('Error', allerrors);
};

const parseApiCatchErrorResponse = (errorReponse: any) => {
  if (!errorReponse) {
    return;
  }
  showAlert(
    'Error',
    JSON.stringify(errorReponse).replace(new RegExp('"', 'g'), ''),
  );
};

const hideKeyboard = () => {
  if (!isPlatformWeb()) {
    Keyboard.dismiss();
  }
};

const extractNetworkResponse = (message: Message) => {
  const apiRequestCallId =
    message.getData(getName(MessageEnum.RestAPIResponceDataMessage));
  var responseJson =
    message.getData(getName(MessageEnum.RestAPIResponceSuccessMessage));
  var errorReponse =
    message.getData(getName(MessageEnum.RestAPIResponceErrorMessage));

  return { apiRequestCallId, responseJson, errorReponse };
};

export default {
  getOS,
  isPlatformWeb,
  isPlatformiOS,
  isPlatformAndroid,
  showAlert,
  parseApiErrorResponse,
  parseApiCatchErrorResponse,
  hideKeyboard,
  extractNetworkResponse,
};

import { useEffect } from 'react';
import { Keyboard } from 'react-native';

import { runEngine } from '../../../../framework/src/RunEngine';
import { Message } from '../../../../framework/src/Message';
import MessageEnum, { getName } from '../../../../framework/src/Messages/MessageEnum';

import { IBlock } from '../../../../framework/src/IBlock';
import Helpers from '../BlockHelpers';

const useBlockHelpers = () => {
  const {
    parseApiErrorResponse,
    parseApiCatchErrorResponse,
    showAlert,
    isPlatformWeb,
    isPlatformiOS,
    isPlatformAndroid,
    hideKeyboard,
    extractNetworkResponse,
  } = Helpers;

  return {
    parseApiErrorResponse,
    showAlert,
    parseApiCatchErrorResponse,
    isPlatformWeb,
    isPlatformiOS,
    isPlatformAndroid,
    hideKeyboard,
    extractNetworkResponse,
  };
};

export { useBlockHelpers };

import { v4 as uuidv4 } from 'uuid';
import { useEffect } from 'react';
import { Keyboard } from 'react-native';

import { runEngine } from '../../../../framework/src/RunEngine';
import { Message } from '../../../../framework/src/Message';
import MessageEnum, { getName } from '../../../../framework/src/Messages/MessageEnum';

import { IBlock } from '../../../../framework/src/IBlock';

const useRunEngine = () => {
  const blockId = uuidv4();

  const communicationBus: IBlock = {
    //@ts-ignore
    send: (message: Message) => runEngine.sendMessage(blockId, message),
    receive: (from: string, message: Message) => {},
  };
  const subscribedMessages: string[] = [];

  useEffect(() => {
    return () => {
      Keyboard.dismiss();
      runEngine.unSubscribeFromMessages(communicationBus, subscribedMessages);
    };
  }, []);

  const subscribe = (message: MessageEnum) =>
    runEngine.attachBuildingBlock(communicationBus, [getName(message)]);

  const unsubscribeFromMessage = (message: MessageEnum) =>
    runEngine.unSubscribeFromMessages(communicationBus, [getName(message)]);

  const sendNetworkRequest = (
    callIdRef: React.MutableRefObject<string>,
    method: string,
    url: string,
    headers?: Object,
    body?: Object,
  ) => {
    subscribe(MessageEnum.RestAPIResponceMessage);

    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage),
    );

    callIdRef.current = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      url,
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      method,
    );

    if (headers) {
      requestMessage.addData(
        getName(MessageEnum.RestAPIRequestHeaderMessage),
        JSON.stringify(headers),
      );
    }

    if (body) {
      requestMessage.addData(
        getName(MessageEnum.RestAPIRequestBodyMessage),
        JSON.stringify(body),
      );
    }

    runEngine.sendMessage(requestMessage.id, requestMessage);
  };

  return {
    sendMessage: runEngine.sendMessage,
    sendBlockMessage: communicationBus.send,
    sendNetworkRequest,
    setReceiveCallback: (callback: (from: string, message: Message) => void) =>
      (communicationBus.receive = callback),
    subscribe,
    unsubscribeFromMessage,
    debugLog: runEngine.debugLog,
  };
};

export { useRunEngine };

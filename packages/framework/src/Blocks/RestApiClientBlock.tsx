import MessageEnum, {
  getName,
} from '../../../framework/src/Messages/MessageEnum';
import { IBlock } from '../../../framework/src/IBlock';
import { runEngine } from '../../../framework/src/RunEngine';
import { Message } from '../../../framework/src/Message';
import { Block } from '../../../framework/src/Block';

let config = require('../config');

export default class RestApiClientBlock<Entity> extends Block {
  private props: any;

  private static instance: RestApiClientBlock<any>;

  private constructor() {
    super();
    runEngine.attachBuildingBlock(this as IBlock, [
      getName(MessageEnum.RestAPIRequestMessage),
    ]);
  }

  static getInstance(): RestApiClientBlock<any> {
    if (!RestApiClientBlock.instance) {
      RestApiClientBlock.instance = new RestApiClientBlock();
    }
    return RestApiClientBlock.instance;
  }

  async receive(from: string, message: Message) {
    if (getName(MessageEnum.RestAPIRequestMessage) === message.id) {
      const uniqueApiCallId = message.messageId;
      const {
        RestAPIRequestMethodMessage: method,
        RestAPIResponceEndPointMessage: endpoint,
        RestAPIRequestHeaderMessage: headers,
        RestAPIRequestBodyMessage: body,
        NavigationPropsMessage: props,
      } = message.properties;
      this.props = props;
      this.makeApiCall(uniqueApiCallId, method, endpoint, headers, body);
    }
  }

  async makeApiCall(
    uniqueApiCallId: string,
    method: string,
    endpoint: string,
    headers: any,
    body: string
  ) {
    let fullURL =
      endpoint.indexOf('://') === -1
        ? config.baseURL + '/' + endpoint
        : endpoint;

    let apiResponseMessage = new Message(
      getName(MessageEnum.RestAPIResponceMessage)
    );
    apiResponseMessage.addData(
      getName(MessageEnum.RestAPIResponceDataMessage),
      uniqueApiCallId
    );

    const maxRetries = 2; 
    let lastError: any = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      let timeoutId: ReturnType<typeof setTimeout> | null = null;

      try {
        let response: Response = new Response();

        const controller = new AbortController();
        timeoutId = setTimeout(() => controller.abort(), 30000); 

        const fetchOptions: any = {
          method: method.toUpperCase(),
          signal: controller.signal,
        };

        if (headers && body) {
          fetchOptions.headers = headers.length ? JSON.parse(headers) : headers;
          fetchOptions.body = body;
        } else if (headers) {
          fetchOptions.headers = headers.length ? JSON.parse(headers) : headers;
        }

        response = await fetch(fullURL, fetchOptions);
        clearTimeout(timeoutId);

        let responseJson;
        try {
          const responseText = await response.text();

          if (responseText) {
            try {
              responseJson = JSON.parse(responseText);
            } catch (_parseError) {
              responseJson = { rawResponse: responseText };
            }
          } else {
            responseJson = {};
          }
        } catch (_textError) {
          responseJson = {};
        }

        // Check if response indicates an error
        if (!response.ok || responseJson.errors) {
          // Extract error message from response
          let errorMessage = 'An error has occurred. Please try again later.';
          
          if (responseJson.errors) {
            // Try to extract detailed error messages
            if (Array.isArray(responseJson.errors)) {
              errorMessage = responseJson.errors.map((err: any) => {
                if (typeof err === 'string') return err;
                if (err.message) return err.message;
                return JSON.stringify(err);
              }).join(', ');
            } else if (typeof responseJson.errors === 'object') {
              const errorMessages = Object.keys(responseJson.errors).map(key => {
                const value = responseJson.errors[key];
                if (Array.isArray(value)) {
                  return `${key}: ${value.join(', ')}`;
                }
                return `${key}: ${value}`;
              });
              errorMessage = errorMessages.join('; ') || errorMessage;
            } else if (typeof responseJson.errors === 'string') {
              errorMessage = responseJson.errors;
            }
          } else if (responseJson.message) {
            errorMessage = responseJson.message;
          } else if (responseJson.error) {
            errorMessage = typeof responseJson.error === 'string' 
              ? responseJson.error 
              : JSON.stringify(responseJson.error);
          } else if (responseJson.rawResponse) {
            errorMessage = responseJson.rawResponse;
          }

          // Include status code in error message for debugging
          errorMessage = `[HTTP ${response.status}] ${errorMessage}`;

          apiResponseMessage.addData(
            getName(MessageEnum.RestAPIResponceErrorMessage),
            errorMessage
          );
          
          // Also include the full response for detailed logging
          apiResponseMessage.addData(
            getName(MessageEnum.RestAPIResponceSuccessMessage),
            responseJson
          );

          if (this.props) {
            apiResponseMessage.addData(
              getName(MessageEnum.NavigationPropsMessage),
              this.props
            );
          }
          this.send(apiResponseMessage);
          return;
        }

        apiResponseMessage.addData(
          getName(MessageEnum.RestAPIResponceSuccessMessage),
          responseJson
        );

        if (this.props) {
          apiResponseMessage.addData(
            getName(MessageEnum.NavigationPropsMessage),
            this.props
          );
        }
        this.send(apiResponseMessage);
        return;

      } catch (error: any) {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        lastError = error;

        if (error.name === 'AbortError' && attempt < maxRetries) {
          continue;
        }

        break;
      }
    }

    // All retries failed, send error response
    let errorMessage = 'An error has occurred. Please try again later.';
    if (lastError && lastError.name === 'AbortError') {
      errorMessage = 'Request timeout. Please check your internet connection.';
    }

    apiResponseMessage.addData(
      getName(MessageEnum.RestAPIResponceErrorMessage),
      errorMessage
    );

    if (this.props) {
      apiResponseMessage.addData(
        getName(MessageEnum.NavigationPropsMessage),
        this.props
      );
    }
    this.send(apiResponseMessage);
  }
}

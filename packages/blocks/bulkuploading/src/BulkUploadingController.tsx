import { IBlock } from "../../../framework/src/IBlock";
import { Message } from "../../../framework/src/Message";
import { BlockComponent } from "../../../framework/src/BlockComponent";
import MessageEnum, {
  getName,
} from "../../../framework/src/Messages/MessageEnum";
import { runEngine } from "../../../framework/src/RunEngine";

// Customizable Area Start
import { pick, types } from "@react-native-documents/picker";
type DocumentPickerResponse = Awaited<ReturnType<typeof pick>>[number];
import { Platform } from "react-native";
export const baseURL = require("../../../framework/src/config.js").baseURL;

interface IUploadedFile {
  data: {
    id: string;
    type: string;
    attributes: {
      id: number;
      account_id: number;
      files:
        | {
            id: number;
            file_name: string;
            file_url: string;
          }[]
        | null;
      status: string;
    };
  };
  meta: {
    message: string;
  };
}

interface IFile {
  fileCopyUri: string;
  name: string;
  size: number;
  type: string;
  uri: string;
}

interface IDownloadResponse {
  jobId: number;
  statusCode: number;
  bytesWritten: number;
}
// Customizable Area End

export const configJSON = require("./config");

export interface Props {
  navigation: any;
  id: string;
  // Customizable Area Start
  // Customizable Area End
}

interface S {
  // Customizable Area Start
  token: string;
  filesWeb: File[];
  files: any[];
  uploadedFiles: IUploadedFile[];
  filesStatus: (undefined | "uploading" | "success" | "failed")[];
  // Customizable Area End
}

interface SS {
  id: any;
  // Customizable Area Start
  // Customizable Area End
}

export default class BulkUploadingController extends BlockComponent<
  Props,
  S,
  SS
> {
  // Customizable Area Start
  createBulkUploadCallId: string = "";
  getBulkUploadCallId: string = "";
  deleteBulkUploadCallId: string = "";
  maxFileSize = 5e6;
  // Customizable Area End

  constructor(props: Props) {
    super(props);
    this.receive = this.receive.bind(this);

    this.subScribedMessages = [
      // Customizable Area Start
      getName(MessageEnum.AccoutLoginSuccess),
      getName(MessageEnum.RestAPIResponceMessage),
      getName(MessageEnum.SessionResponseMessage),
      // Customizable Area End
    ];

    this.state = {
      // Customizable Area Start
      token: "",
      filesWeb: [],
      files: [],
      uploadedFiles: [],
      filesStatus: [],
      // Customizable Area End
    };
    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);

    // Customizable Area Start
    // Customizable Area End
  }

  async receive(from: string, message: Message) {
    // Customizable Area Start
    runEngine.debugLog("Message Recived", message);

    if (getName(MessageEnum.SessionResponseMessage) === message.id) {
      runEngine.debugLog("Message Recived", message);

      const token = message.getData(getName(MessageEnum.SessionResponseToken));
      if (token) {
        this.setState({ token: token });
      } else {
        this.showAlert("Alert", configJSON.loginAlertMessage);
      }
    } else if (getName(MessageEnum.RestAPIResponceMessage) === message.id) {
      const apiRequestCallId = message.getData(
        getName(MessageEnum.RestAPIResponceDataMessage)
      );

      const responseJson = message.getData(
        getName(MessageEnum.RestAPIResponceSuccessMessage)
      );

      const errorReponse = message.getData(
        getName(MessageEnum.RestAPIResponceErrorMessage)
      );

      if (errorReponse) {
        this.showAlert("Alert", configJSON.somethingWentWrongMsg);
      }
      if (apiRequestCallId) {
        if (apiRequestCallId === this.createBulkUploadCallId) {
          let filesStatus = this.state.filesStatus;
          if (responseJson && responseJson.data) {
            filesStatus[filesStatus.length - 1] = "success";
          } else {
            filesStatus[filesStatus.length - 1] = "failed";
          }
          this.setState({ filesStatus });
          this.uploadFile();
        } else if (
          apiRequestCallId === this.getBulkUploadCallId &&
          responseJson !== undefined
        ) {
          !responseJson.errors &&
            this.setState({ uploadedFiles: responseJson });
        } else if (
          apiRequestCallId === this.deleteBulkUploadCallId &&
          responseJson !== undefined
        ) {
          this.showAlert("Alert", configJSON.deletedSuccessMsg);
          this.getUploadedFiles();
        }
      }
    }

    // Customizable Area End
  }

  // Customizable Area Start
  componentDidMount = async () => {
    this.getToken();
  };

  getToken = () => {
    const tokenMsg: Message = new Message(
      getName(MessageEnum.SessionRequestMessage)
    );
    this.send(tokenMsg);
  };

  uploadFile = () => {
    const length = this.isPlatformWeb()
      ? this.state.filesWeb.length
      : this.state.files.length;

    if (length > this.state.filesStatus.length) {
      this.uploadFileSingle(this.state.filesStatus.length);
      this.setState({ filesStatus: [...this.state.filesStatus, "uploading"] });
    }
  };

  uploadFileSingle = (index: number) => {
    const header = {
      token: this.state.token,
    };

    const formData = new FormData();
    formData.append(
      "files[]",
      this.isPlatformWeb()
        ? this.state.filesWeb[index]
        : this.state.files[index]
    );

    const createBulkUploadMsg = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.createBulkUploadCallId = createBulkUploadMsg.messageId;

    createBulkUploadMsg.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.createBulkUploadEndpoint
    );

    createBulkUploadMsg.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );

    createBulkUploadMsg.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      formData
    );

    createBulkUploadMsg.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.createBulkUploadMethod
    );

    runEngine.sendMessage(createBulkUploadMsg.id, createBulkUploadMsg);
  };

  removeFileWeb = (index: number) => {
    this.setState({
      filesWeb: Array.from(this.state.filesWeb).filter(
        (file, fileIndex) => fileIndex !== index
      ),
    });
  };

  removeFile = (index: number) => {
    this.setState({
      files: Array.from(this.state.files).filter(
        (file, fileIndex) => fileIndex !== index
      ),
    });
  };

  clearAllFile = () => {
    this.setState({ filesWeb: [], files: [], filesStatus: [] });
  };

  onChangeFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    let tempFile: File[] = [];
    if (event.target.files) {
      for (let iterator = 0; iterator < event.target.files.length; iterator++) {
        if (event.target.files[iterator].size > this.maxFileSize) {
          this.showAlert(
            "Alert",
            event.target.files[iterator].name + configJSON.fileSizeErrorMsg
          );
        } else {
          tempFile.push(event.target.files[iterator]);
        }
      }
    }
    tempFile.length > 0 &&
      this.setState({
        filesWeb: [...this.state.filesWeb, ...tempFile],
      });
  };

  selectFiles = async () => {
    try {
      const pickerResult = await pick({
        allowMultiSelection: true,
        mode: 'open',
      });
      const tempFile: DocumentPickerResponse[] = pickerResult.filter((result) => {
        if (result.size && result.size > this.maxFileSize) {
          this.showAlert("Alert", result.name + configJSON.fileSizeErrorMsg);
          return false;
        } else {
          return true;
        }
      });

      this.setState({
        files: [...this.state.files, ...tempFile],
      });
    } catch (error) {
      this.showAlert("Alert", configJSON.downloadingFailedMsg);
    }
  };

  getUploadedFiles = () => {
    const header = {
      "Content-Type": configJSON.apiContentType,
      token: this.state.token,
    };

    const getBulkUploadMsg = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.getBulkUploadCallId = getBulkUploadMsg.messageId;

    getBulkUploadMsg.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.getBulkUploadEndpoint
    );

    getBulkUploadMsg.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );

    getBulkUploadMsg.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.getBulkUploadMethod
    );

    runEngine.sendMessage(getBulkUploadMsg.id, getBulkUploadMsg);
  };

  deleteFile = (fileGroupId: string) => {
    const header = {
      "Content-Type": configJSON.apiContentType,
      token: this.state.token,
    };

    const deleteBulkUploadMsg = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.deleteBulkUploadCallId = deleteBulkUploadMsg.messageId;

    deleteBulkUploadMsg.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      `${configJSON.deleteBulkUploadEndpoint}/${fileGroupId}`
    );

    deleteBulkUploadMsg.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );

    deleteBulkUploadMsg.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.deleteBulkUploadMethod
    );

    runEngine.sendMessage(deleteBulkUploadMsg.id, deleteBulkUploadMsg);
  };

  fileDownloadHandler = (filePath: string, fileName: string) => {
    if (Platform.OS !== "web") {
      try {
        const RNFS = require("react-native-fs");
        const dirPath = this.isPlatformiOS()
          ? RNFS.DocumentDirectoryPath
          : RNFS.DownloadDirectoryPath;
        const toFile = `${dirPath}/${Date.now()}${fileName}`;
        RNFS.downloadFile({
          fromUrl: baseURL + filePath,
          toFile,
        }).promise.then((response: IDownloadResponse) => {
          if (response.statusCode === 200) {
            this.showAlert("Alert", configJSON.downloadedSuccessMsg + toFile);
          } else {
            this.showAlert("Alert", configJSON.downloadingFailedMsg);
          }
        });
      } catch (error) {
        this.showAlert("Alert", configJSON.downloadingFailedMsg);
      }
    }
  };
  // Customizable Area End
}

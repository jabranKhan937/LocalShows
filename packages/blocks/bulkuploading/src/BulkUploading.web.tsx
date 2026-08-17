import React from "react";

import {
  Container,
  Box,
  Button,
  Typography,
  Link,
  // Customizable Area Start
  // Customizable Area End
} from "@material-ui/core";

// Customizable Area Start
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";

const theme = createTheme({
  palette: {
    primary: {
      main: "#6200ee",
      contrastText: "#fff",
    },
  },
  typography: {
    h6: {
      fontWeight: 500,
    },
    subtitle1: {
      margin: "20px 0px",
    },
  },
});
// Customizable Area End

import BulkUploadingController, {
  Props,
  configJSON,
  baseURL,
} from "./BulkUploadingController";

export default class BulkUploading extends BulkUploadingController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }

  // Customizable Area Start
  // Customizable Area End

  render() {
    return (
      // Customizable Area Start
      <ThemeProvider theme={theme}>
        <Container maxWidth={"sm"}>
          <Box sx={webStyle.mainWrapper}>
            <Typography variant="h6">{configJSON.labelTitleText}</Typography>
            <Box style={webStyle.uploadBtnWrapper}>
              <label htmlFor="filePicker">
                <input
                  type="file"
                  onChange={this.onChangeFile}
                  multiple
                  hidden
                  id="filePicker"
                  data-testid="filePicker"
                />
                <Typography style={webStyle.uploadBtn}>
                  {configJSON.uploadBtnLabel}
                </Typography>
              </label>
              {this.state.filesWeb.length > 0 && (
                <Button
                  onClick={this.clearAllFile}
                  color="primary"
                  variant="contained"
                  style={webStyle.clearBtnStyle}
                >
                  {configJSON.clearFileBtnLabel}
                </Button>
              )}
              <Button
                onClick={this.getUploadedFiles}
                color="primary"
                variant="contained"
                data-testid="getUploadedFiles"
              >
                {configJSON.getUploadedFileLabel}
              </Button>
            </Box>
            {Array.from(this.state.filesWeb).map((file, index) => {
              const status = this.state.filesStatus[index];
              const color =
                status === "success"
                  ? "green"
                  : status === "failed"
                  ? "red"
                  : "black";
              return (
                <Box style={webStyle.fileWrapper} key={index}>
                  <Typography style={webStyle.fileName}>{file.name}</Typography>
                  {status ? (
                    <Typography style={{ color }}>{status}</Typography>
                  ) : (
                    <Button
                      data-testid={`selectedFile-${index}`}
                      onClick={() => this.removeFileWeb(index)}
                    >
                      <CloseIcon />
                    </Button>
                  )}
                </Box>
              );
            })}

            <Button
              style={webStyle.submitBtnStyle}
              onClick={this.uploadFile}
              color="primary"
              variant="contained"
              data-testid="submitBtn"
            >
              {configJSON.submitBtnLabel}
            </Button>
          </Box>
          <Box>
            {this.state.uploadedFiles.map((bulkUpload) => {
              return (
                <Box key={bulkUpload.data.id} style={webStyle.bulkFileWrapper}>
                  <Box style={webStyle.bulkFileTopWrapper}>
                    <Box style={webStyle.textWrapper}>
                      <Typography>
                        {configJSON.idLabel} {bulkUpload.data.id}
                      </Typography>
                      <Typography>
                        {configJSON.statusLabel}{" "}
                        {bulkUpload.data.attributes.status}
                      </Typography>
                    </Box>
                    <Button
                      onClick={() => this.deleteFile(bulkUpload.data.id)}
                      color="secondary"
                      variant="contained"
                      data-testid={`deleteAllBtn-${bulkUpload.data.id}`}
                    >
                      {configJSON.deleteBtnLabel}
                    </Button>
                  </Box>
                  {bulkUpload.data.attributes.files &&
                    bulkUpload.data.attributes.files.map((file) => {
                      return (
                        <Box key={file.id} style={webStyle.fileItemWrapper}>
                          <Typography style={webStyle.fileName}>
                            {file.file_name}
                          </Typography>
                          <Link
                            href={`${baseURL}${file.file_url}`}
                            target="_blank"
                            download
                          >
                            <Button
                              color="primary"
                              variant="contained"
                              size="small"
                              data-testid={`downloadFileBtn-${bulkUpload.data.id}-${file.id}`}
                            >
                              {configJSON.downloadBtnLabel}
                            </Button>
                          </Link>
                        </Box>
                      );
                    })}
                </Box>
              );
            })}
          </Box>
        </Container>
      </ThemeProvider>
      // Customizable Area End
    );
  }
}

// Customizable Area Start
const webStyle = {
  mainWrapper: {
    display: "flex",
    fontFamily: "Roboto-Medium",
    flexDirection: "column",
    paddingBottom: "30px",
    background: "#fff",
  },
  inputStyle: {
    marginTop: 20,
    marginBottom: 20,
  },
  fileWrapper: {
    marginTop: 10,
    display: "flex",
    alignItems: "center",
  },
  fileName: {
    flex: 1,
  },
  submitBtnStyle: {
    marginTop: 20,
  },
  uploadBtnWrapper: {
    display: "flex",
    marginTop: 20,
  },
  uploadBtn: {
    padding: 7,
    paddingLeft: 15,
    paddingRight: 15,
    border: "none",
    backgroundColor: "rgb(98, 0, 238)",
    color: "#fff",
    borderRadius: 5,
    cursor: "pointer",
    marginRight: 15,
  },
  clearBtnStyle: {
    marginRight: 15,
  },
  bulkFileWrapper: {
    border: "1px solid #ccc",
    padding: 20,
    borderRadius: 5,
    marginBottom: 20,
  },
  bulkFileTopWrapper: {
    display: "flex",
    alignItems: "center",
  },
  textWrapper: {
    flex: 1,
  },
  fileItemWrapper: {
    display: "flex",
    border: "1px solid #ccc",
    padding: 10,
    marginTop: 15,
    borderRadius: 5,
    alignItems: "center",
  },
};
// Customizable Area End

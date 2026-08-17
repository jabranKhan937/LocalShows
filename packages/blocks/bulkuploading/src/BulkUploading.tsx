import React from "react";

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  TouchableWithoutFeedback,
  // Customizable Area Start
  // Customizable Area End
} from "react-native";

import BulkUploadingController, {
  Props,
  configJSON,
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
      <ScrollView keyboardShouldPersistTaps="always" style={styles.container}>
        <TouchableWithoutFeedback
          onPress={() => {
            this.hideKeyboard();
          }}
        >
          <View>
            <View style={styles.subContainer}>
              <TouchableOpacity
                style={styles.btnStyle}
                onPress={this.selectFiles}
                testID="filePicker"
              >
                <Text style={styles.btnText}>{configJSON.uploadBtnLabel}</Text>
              </TouchableOpacity>
              <View style={styles.separater} />
              {this.state.files.length > 0 && (
                <>
                  <TouchableOpacity
                    style={styles.btnStyle}
                    onPress={this.clearAllFile}
                  >
                    <Text style={styles.btnText}>
                      {configJSON.clearFileBtnLabel}
                    </Text>
                  </TouchableOpacity>
                  <View style={styles.separater} />
                </>
              )}
              <TouchableOpacity
                style={styles.btnStyle}
                onPress={this.getUploadedFiles}
                testID="getUploadedFiles"
              >
                <Text style={styles.btnText}>
                  {configJSON.getUploadedFileLabel}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.filesContainer}>
              {this.state.files.map((file, index) => {
                const status = this.state.filesStatus[index];
                const color =
                  status === "success"
                    ? "green"
                    : status === "failed"
                    ? "red"
                    : "black";
                return (
                  <View style={styles.fileItemWrapper} key={index}>
                    <Text style={styles.fileName}>{file.name}</Text>

                    {status ? (
                      <Text style={{ color }}>{status}</Text>
                    ) : (
                      <TouchableOpacity
                        style={styles.smallBtn}
                        onPress={() => this.removeFile(index)}
                        testID={`selectedFile-${index}`}
                      >
                        <Text style={styles.btnText}>
                          {configJSON.removeBtnLabel}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })}
            </View>

            <TouchableOpacity
              style={styles.btnStyle}
              onPress={this.uploadFile}
              testID="submitBtn"
            >
              <Text style={styles.btnText}>{configJSON.submitBtnLabel}</Text>
            </TouchableOpacity>
            <View>
              {this.state.uploadedFiles.map((bulkUpload) => {
                return (
                  <View key={bulkUpload.data.id} style={styles.bulkFileWrapper}>
                    <View style={styles.bulkFileTopWrapper}>
                      <View style={styles.textWrapper}>
                        <Text style={styles.textStyle}>
                          {configJSON.idLabel} {bulkUpload.data.id}
                        </Text>
                        <Text style={styles.textStyle}>
                          {configJSON.statusLabel}{" "}
                          {bulkUpload.data.attributes.status}
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={styles.smallBtn}
                        onPress={() => this.deleteFile(bulkUpload.data.id)}
                        testID={`deleteAllBtn-${bulkUpload.data.id}`}
                      >
                        <Text style={styles.btnText}>
                          {configJSON.deleteBtnLabel}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    {bulkUpload.data.attributes.files &&
                      bulkUpload.data.attributes.files.map((file) => {
                        return (
                          <View key={file.id} style={styles.fileItemWrapper}>
                            <Text style={styles.fileName}>
                              {file.file_name}
                            </Text>
                            <TouchableOpacity
                              style={styles.smallBtn}
                              onPress={() =>
                                this.fileDownloadHandler(
                                  file.file_url,
                                  file.file_name
                                )
                              }
                              testID={`downloadFileBtn-${bulkUpload.data.id}-${file.id}`}
                            >
                              <Text style={styles.btnText}>
                                {configJSON.downloadBtnLabel}
                              </Text>
                            </TouchableOpacity>
                          </View>
                        );
                      })}
                  </View>
                );
              })}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
      // Customizable Area End
    );
  }
}

// Customizable Area Start
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#ffffffff",
  },
  subContainer: {
    flexDirection: "row",
  },
  btnStyle: {
    backgroundColor: "#6200ee",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  btnText: {
    textAlign: "center",
    color: "#fff",
  },
  smallBtn: {
    backgroundColor: "#6200ee",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  separater: {
    width: 15,
  },
  bulkFileWrapper: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  bulkFileTopWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  textWrapper: {
    flex: 1,
  },
  textStyle: {
    color: "#000",
  },
  fileItemWrapper: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  fileName: {
    flex: 1,
    color: "#000",
  },
  filesContainer: {
    marginBottom: 15,
  },
});
// Customizable Area End

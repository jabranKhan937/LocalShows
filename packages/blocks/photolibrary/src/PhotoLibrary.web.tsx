import React from "react";

// Customizable Area Start
import {
  Container,
  Box,
  Button,
  Modal,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  IconButton,
  TextField
} from "@material-ui/core";
import { CheckBox, CheckBoxTwoTone } from "@material-ui/icons";

import { createTheme, ThemeProvider } from "@material-ui/core/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#fff",
      contrastText: "#fff"
    }
  },
  typography: {
    h6: {},
    subtitle1: {
      margin: "20px 0px"
    }
  }
});
import { ImageListType } from "./types";
// Customizable Area End

import PhotoLibraryController, {
  Props,
  configJSON
} from "./PhotoLibraryController";

// Customizable Area Start
// Customizable Area End

export default class PhotoLibrary extends PhotoLibraryController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }

  // Customizable Area Start
  // Customizable Area End

  render() {
    // Customizable Area Start
    return (
      <ThemeProvider theme={theme}>
        <Container maxWidth={"md"}>
          <Box sx={webStyles.headerButtonViewStyle}>
            <Button
              data-test-id="handlebtnAddImage"
              variant="contained"
              color="inherit"
              onClick={this.handlebtnAddImage}
            >
              {configJSON.textAddNewImage}
            </Button>
            <Box sx={webStyles.secondButtonViewStyle}>
              <Button
                data-test-id="openShareModal"
                variant="contained"
                color="inherit"
                onClick={this.openShareModal}
              >
                {configJSON.textShare}
              </Button>
            </Box>
            <Box sx={webStyles.secondButtonViewStyle}>
              <Button
                data-test-id="handleDeleteGallery"
                variant="contained"
                color="secondary"
                onClick={() => this.handleDeleteGallery()}
              >
                {configJSON.textDeleteGallery}
              </Button>
            </Box>
            <Box sx={webStyles.secondButtonViewStyle}>
              <Button
                data-test-id="toggleDeleteMultipleImages"
                variant="contained"
                color="secondary"
                onClick={() => this.toggleDeleteMultipleImages()}
              >
                {configJSON.textDelete}
              </Button>
            </Box>
            {this.state.isVisibleDeleteCheckbox && (
              <Box sx={webStyles.secondButtonViewStyle}>
                <Button
                  data-test-id="deleteSelectedImages"
                  variant="contained"
                  color="secondary"
                  onClick={() => this.deleteSelectedImages()}
                >
                  {configJSON.textDeleteSelected}
                </Button>
              </Box>
            )}
          </Box>

          <Box sx={webStyles.root}>
            <ImageList rowHeight={160} style={webStyles.imageList} cols={4}>
              {this.state.imageData.map(
                (item: ImageListType, index: number) => {
                  return (
                    <ImageListItem key={index} cols={1}>
                      <img
                        data-test-id={"handlebtnViewImage" + index}
                        src={item.file_url}
                        alt={item.file_name}
                        onClick={() => this.handlebtnViewImage(item)}
                      />
                      {this.state.isVisibleDeleteCheckbox && (
                        <ImageListItemBar
                          style={webStyles.imageListBar}
                          position="top"
                          actionIcon={
                            <IconButton
                              data-test-id={"toggleImageChecked" + index}
                              style={webStyles.btnCheck}
                              onClick={() => this.toggleImageChecked(item)}
                            >
                              {item.isSelected ? (
                                <CheckBox color="primary" />
                              ) : (
                                <CheckBoxTwoTone />
                              )}
                            </IconButton>
                          }
                          actionPosition="left"
                        />
                      )}
                    </ImageListItem>
                  );
                }
              )}
            </ImageList>
          </Box>

          {/* Add New Image Modal */}
          <Modal
            open={this.state.isAddImageModalVisible}
            onClose={this.closeAddImageModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={webStyles.modalStyle}>
              <Button
                variant="contained"
                component="label"
                data-test-id="handleAddnewImage"
              >
                {configJSON.chooseImageButtonTitle}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    this.openImagePicker(e)
                  }
                  hidden
                  data-test-id="fileInput"
                />
                {configJSON.textSelectImage}
              </Button>
              <p
                style={{
                  ...webStyles.errorMsg,
                  visibility: this.state.addImageError ? "visible" : "hidden"
                }}
              >
                {configJSON.noImageErrorMsg}
              </p>
              <img
                style={webStyles.imgStyle}
                src={
                  this.state.viewSelectedImage && this.state.selectedImage.uri
                }
                alt={"image"}
              />
              <Box sx={webStyles.modalRowViewStyle}>
                <Button
                  data-test-id="handleSaveImage"
                  variant="contained"
                  color="secondary"
                  onClick={() => this.handleSaveImage()}
                >
                  {configJSON.textSave}
                </Button>
                <Button
                  data-test-id="closeAddImageModal"
                  variant="contained"
                  onClick={this.closeAddImageModal}
                  style={webStyles.secondButtonViewStyle}
                >
                  {configJSON.textClose}
                </Button>
              </Box>
            </Box>
          </Modal>

          {/* Image View Modal */}
          <Modal
            open={this.state.isViewImageModalVisible}
            onClose={this.closeViewImageModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={webStyles.modalStyle}>
              <img
                style={webStyles.imgStyle}
                alt={"image"}
                src={
                  this.state.viewSelectedImage &&
                  this.state.viewSelectedImage.uri
                }
              />
              <Box sx={webStyles.modalButtonViewStyle}>
                <Button
                  data-test-id="closeViewImageModal"
                  variant="contained"
                  onClick={this.closeViewImageModal}
                >
                  {configJSON.textClose}
                </Button>
                <Button
                  data-test-id="handleDeleteImage"
                  variant="contained"
                  color="secondary"
                  onClick={this.handleDeleteImage}
                  style={webStyles.secondButtonViewStyle}
                >
                  {configJSON.textDelete}
                </Button>
              </Box>
            </Box>
          </Modal>

          {/* Share Photo Library modal */}
          <Modal
            open={this.state.isShareModalVisible}
            onClose={this.closeShareModal}
          >
            <Box sx={webStyles.modalStyle}>
              <p
                style={{
                  ...webStyles.errorMsg,
                  visibility: this.state.inputAccountIdError
                    ? "visible"
                    : "hidden",
                }}
              >
                {configJSON.errorMsgAccountId}
              </p>
              <TextField
                required
                fullWidth
                type="number"
                id="standard-required"
                data-test-id={"inputAccountId"}
                label={configJSON.textAccountId}
                defaultValue={this.state.inputAccountId}
                onChange={(event) =>
                  this.handleAnputAccountID(event.target.value)
                }
              />
              <Box sx={webStyles.modalButtonViewStyle}>
                <Button
                  data-test-id="sharePhotoLibrary"
                  variant="contained"
                  color="secondary"
                  onClick={() => this.sharePhotoLibrary()}
                >
                  {configJSON.textSave}
                </Button>
                <Button
                  data-test-id="closeShareModal"
                  variant="contained"
                  onClick={this.closeShareModal}
                  style={webStyles.secondButtonViewStyle}
                >
                  {configJSON.textClose}
                </Button>
              </Box>
            </Box>
          </Modal>
        </Container>
      </ThemeProvider>
    );
    // Customizable Area End
  }
}

// Customizable Area Start
const webStyles = {
  headerButtonViewStyle: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center"
  },
  secondButtonViewStyle: {
    marginLeft: 10
  },
  modalStyle: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 10
  },
  modalRowViewStyle: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  },
  modalButtonViewStyle: {
    display: "flex",
    justifyContent: "flex-end",
    padding: "10px 0px"
  },
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden"
  },
  imageList: {
    width: "100%",
    height: "100%"
  },
  imgStyle: {
    maxHeight: "400px",
    maxWidth: "400px",
    width: "auto",
    height: "auto",
    margin: 10
  },
  imageListBar: {
    background:
      "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, " +
      "rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)"
  },
  btnCheck: {
    color: "white"
  },
  errorMsg: {
    color: "red",
  },
};
// Customizable Area End

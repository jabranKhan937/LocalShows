import React from "react";

// Customizable Area Start
import {
  Container,
  Box,
  Button,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
} from "@material-ui/core";

import { createTheme, ThemeProvider } from "@material-ui/core/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#6200ee",
      contrastText: "#fff",
    },
  },
  typography: {
    subtitle1: {
      margin: "20px 0px",
    },
  },
});
// Customizable Area End

import SentRequestController, {
  Props,
  configJSON,
} from "./SentRequestController";

export default class SentRequest extends SentRequestController {
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
          <Box sx={webStyle.mainWrapper}>
            <Typography variant="h6">{configJSON.titleText}</Typography>
            <Box style={webStyle.topWrapper}>
              <TextField
                value={this.state.filterKey}
                onChange={this.onChangeFilterKey}
                variant="outlined"
                label={configJSON.filterInputLabel}
                style={webStyle.inputStyle}
                data-testid="filterKeyInput"
              />
              <Box style={webStyle.container}>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={() => this.navigateHandler()}
                  style={webStyle.btnRightMargin}
                  data-testid="receiveRequestBtn"
                >
                  {configJSON.receiveRequestText}
                </Button>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={() => this.toggleModal()}
                  data-testid="sendRequest"
                >
                  {configJSON.sendRequestBtnLabel}
                </Button>
              </Box>
            </Box>

            <Typography variant="h6" style={webStyle.tableTitleStyle}>
              {configJSON.sendRequestsText}
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{configJSON.nameLabelText}</TableCell>
                    <TableCell>{configJSON.requestLabelText}</TableCell>
                    <TableCell>{configJSON.rejectReasonLabelText}</TableCell>
                    <TableCell>{configJSON.statusLabelText}</TableCell>
                    <TableCell>{configJSON.actionLabelText}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.sentRequests
                    .filter((request) =>
                      this.state.filterKey === ""
                        ? true
                        : this.state.filterKey === request.id
                    )
                    .map((request) => {
                      const color =
                        request.attributes.status === "accepted"
                          ? "green"
                          : request.attributes.status === "rejected"
                          ? "red"
                          : "black";
                      return (
                        <TableRow key={request.id}>
                          <TableCell scope="row">
                            {request.attributes.sender_full_name}
                          </TableCell>
                          <TableCell>
                            {request.attributes.request_text}
                          </TableCell>
                          <TableCell>
                            {request.attributes.rejection_reason}
                          </TableCell>
                          <TableCell style={{ color }}>
                            {request.attributes.status}
                          </TableCell>
                          <TableCell>
                            {request.attributes.status === "rejected" && (
                              <Button
                                size="small"
                                color="primary"
                                variant="contained"
                                onClick={() =>
                                  this.selectRequestHandler(request)
                                }
                                style={webStyle.tableBtnStyle}
                                data-testid={"updateBtn-" + request.id}
                              >
                                {configJSON.updateBtnLabel}
                              </Button>
                            )}

                            <Button
                              size="small"
                              color="primary"
                              variant="contained"
                              onClick={() => this.setViewRequest(request)}
                              style={webStyle.tableBtnStyle}
                              data-testid={"viewBtn-" + request.id}
                            >
                              {configJSON.viewBtnLabel}
                            </Button>
                            <Button
                              size="small"
                              color="secondary"
                              variant="contained"
                              onClick={() => this.deleteRequest(request.id)}
                              data-testid={"deleteBtn-" + request.id}
                            >
                              {configJSON.deleteBtnLabel}
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Container>
        <Dialog
          open={this.state.isSendModalOpen}
          onClose={this.toggleModal}
          maxWidth={"md"}
        >
          <DialogTitle>
            {this.state.selectedRequest
              ? configJSON.updateRequestDialogTitle
              : configJSON.sendRequestDialogTitle}
          </DialogTitle>
          <DialogContent>
            <Box>
              {!this.state.selectedRequest && (
                <Select
                  value={this.state.selectedGroupId}
                  onChange={this.onChangeGroupId}
                  fullWidth
                  variant="outlined"
                  placeholder={configJSON.selectGroupPlaceholder}
                >
                  {this.state.groups.map((group) => {
                    return (
                      <MenuItem key={group.id} value={group.id}>
                        {group.attributes.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              )}
            </Box>
            <TextField
              value={this.state.requestText}
              onChange={this.onChangeRequestText}
              variant="outlined"
              label={configJSON.requestTextInputLabel}
              style={webStyle.inputStyle}
              data-testid="requestTextField"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.toggleModal} color="primary">
              {configJSON.cancelBtnLabel}
            </Button>
            <Button
              onClick={() =>
                this.state.selectedRequest
                  ? this.updateRequestText()
                  : this.sendRequest()
              }
              color="primary"
              variant="contained"
              data-testid="sendRequestSubmitBtn"
            >
              {configJSON.sendBtnLabel}
            </Button>
          </DialogActions>
        </Dialog>

        {this.state.viewRequest && (
          <Dialog
            open={!!this.state.viewRequest}
            onClose={this.closeViewModal}
            maxWidth={"md"}
          >
            <DialogTitle data-testid="viewRequestId">
              {configJSON.requestIdLabel}: {this.state.viewRequest.id}
            </DialogTitle>
            <DialogContent>
              <Typography>
                {configJSON.nameLabelText}:{" "}
                {this.state.viewRequest.attributes.sender_full_name}
              </Typography>
              <Typography>
                {configJSON.requestLabelText}:{" "}
                {this.state.viewRequest.attributes.request_text}
              </Typography>
              <Typography>
                {configJSON.statusLabelText}:{" "}
                <Box
                  component={"span"}
                  style={{
                    color:
                      this.state.viewRequest.attributes.status === "accepted"
                        ? "green"
                        : this.state.viewRequest.attributes.status ===
                          "rejected"
                        ? "red"
                        : "black",
                  }}
                >
                  {this.state.viewRequest.attributes.status}
                </Box>
              </Typography>
              {this.state.viewRequest.attributes.rejection_reason && (
                <Typography>
                  {configJSON.rejectReasonLabelText}:{" "}
                  {this.state.viewRequest.attributes.rejection_reason}
                </Typography>
              )}
            </DialogContent>
            <DialogActions>
              <Button
                onClick={this.closeViewModal}
                color="primary"
                data-testid="cancelViewModalBtn"
              >
                {configJSON.cancelBtnLabel}
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </ThemeProvider>
    );
    // Customizable Area End
  }
}

// Customizable Area Start
const webStyle = {
  mainWrapper: {
    display: "flex",
    fontFamily: "Roboto-Medium",
    flexDirection: "column",
    alignItems: "center",
    paddingBottom: "30px",
    background: "#fff",
  },
  container: {
    width: "100%",
    display: "flex",
    justifyContent: "flex-end",
  },
  btnRightMargin: {
    marginRight: 10,
  },
  tableTitleStyle: {
    alignSelf: "flex-start",
    marginTop: 30,
  },
  tableBtnStyle: {
    marginRight: 10,
  },
  inputStyle: {
    marginTop: 15,
    width: 350,
    maxWidth: "100%",
  },
  topWrapper: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
};
// Customizable Area End

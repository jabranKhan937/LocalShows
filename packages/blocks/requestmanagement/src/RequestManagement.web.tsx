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

import RequestManagementController, {
  Props,
  configJSON,
} from "./RequestManagementController";

export default class RequestManagement extends RequestManagementController {
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
              <Button
                color="primary"
                variant="contained"
                onClick={() => this.navigateHandler()}
                data-testid="SentRequest"
              >
                {configJSON.sendRequestBtnLabel}
              </Button>
            </Box>
            <Typography variant="h6" style={webStyle.tableTitleStyle}>
              {configJSON.receiveRequestText}
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{configJSON.nameLabelText}</TableCell>
                    <TableCell>{configJSON.requestLabelText}</TableCell>
                    <TableCell>{configJSON.statusLabelText}</TableCell>
                    <TableCell>{configJSON.actionLabelText}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.receivedRequests
                  .filter(request => this.state.filterKey === '' ? true : this.state.filterKey === request.id)
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
                        <TableCell>{request.attributes.request_text}</TableCell>
                        <TableCell style={{ color }}>
                          {request.attributes.status}
                        </TableCell>
                        <TableCell>
                          {request.attributes.status === "pending" && (
                            <>
                              <Button
                                size="small"
                                color="primary"
                                variant="contained"
                                onClick={() =>
                                  this.updateRequestReview(request.id, true)
                                }
                                style={webStyle.tableBtnStyle}
                                data-testid={"acceptBtn-" + request.id}
                              >
                                {configJSON.acceptBtnLabel}
                              </Button>

                              <Button
                                size="small"
                                color="primary"
                                variant="contained"
                                onClick={() => this.setSelectedId(request.id)}
                                style={webStyle.tableBtnStyle}
                                data-testid={"rejectBtn-" + request.id}
                              >
                                {configJSON.rejectBtnLabel}
                              </Button>
                            </>
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
          open={!!this.state.selectedId}
          onClose={() => this.setSelectedId(null)}
          maxWidth={"md"}
        >
          <DialogTitle>{configJSON.rejectRequestDialogTitle}</DialogTitle>
          <DialogContent>
            <TextField
              value={this.state.rejectText}
              onChange={this.onChangeRejectText}
              variant="outlined"
              label={configJSON.rejectReasonInputLabel}
              style={webStyle.inputStyle}
              error={!!this.state.rejectTextError}
              helperText={this.state.rejectTextError}
              data-testid="rejectReasonTextInput"
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => this.setSelectedId(null)}
              color="primary"
              data-testid="cancelRejectModalBtn"
            >
              {configJSON.cancelBtnLabel}
            </Button>
            <Button
              onClick={() =>
                this.state.selectedId &&
                this.updateRequestReview(this.state.selectedId, false)
              }
              color="primary"
              variant="contained"
              data-testid="rejectRequestReviewBtn"
            >
              {configJSON.rejectBtnLabel}
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
              {this.state.viewRequest.attributes.rejection_reason && <Typography>
                {configJSON.rejectReasonLabelText}:{" "}
                {this.state.viewRequest.attributes.rejection_reason}
              </Typography>}
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
  topWrapper: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  tableTitleStyle: {
    alignSelf: "flex-start",
    marginTop: 20,
  },
  tableBtnStyle: {
    marginRight: 10,
  },
  inputStyle: {
    marginTop: 15,
    width: 350,
    maxWidth: "100%",
  },
};
// Customizable Area End

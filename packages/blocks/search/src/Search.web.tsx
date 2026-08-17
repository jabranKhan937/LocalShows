import React from "react";
// Customizable Area Start
import {
  Modal,
  Container,
  Box,
  Button,
  Table,
  TableHead,
  TableBody,
  TableContainer,
  TableCell,
  TableRow,
  Paper,
  Typography,
  Input
} from "@material-ui/core";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
// Customizable Area End

const theme = createTheme({
  palette: {
    primary: {
      main: "#0000ff",
      contrastText: "#fff"
    }
  }
});
// Customizable Area End

import SearchController, { Props } from "./SearchController";

export default class Search extends SearchController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }

  render() {
    // Customizable Area Start
    return (
      <ThemeProvider theme={theme}>
        <Container maxWidth="md">
          {/* Customizable Area Start */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center"
            }}
          >
            <Input
              data-test-id={"inputSearchText"}
              placeholder="Search Text"
              onChange={e => this.setSearchText(e.target.value)}
            />
            <Button
              data-test-id="btnGetSearchList"
              variant="contained"
              color="primary"
              onClick={() => this.getSearchList(this.state.token)}
            >
              Search
            </Button>
          </Box>

          <Paper style={{ width: "100%", overflow: "hidden" }}>
            <TableContainer style={{ maxHeight: 440 }}>
              <Table aria-label="simple table" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Id</TableCell>
                    <TableCell>First Name</TableCell>
                    <TableCell>Last Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone Number</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.searchList &&
                    this.state.searchList.map((item: any, index: number) => {
                      const th = "th";
                      return (
                        <TableRow key={item.id}>
                          <TableCell scope="row">{item.id}</TableCell>
                          <TableCell>{item.attributes.first_name}</TableCell>
                          <TableCell>{item.attributes.last_name}</TableCell>
                          <TableCell>{item.attributes.email}</TableCell>
                          <TableCell>{item.attributes.phone_number}</TableCell>
                          <TableCell align="right">
                            <Button
                              data-test-id={"btnViewModal"}
                              variant="text"
                              color="primary"
                              onClick={() => this.setModal(item)}
                            >
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          <Modal
            open={this.state.isVisible}
            onClose={this.hideModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={modalStyle}>
              <Box sx={{ minHeight: 250 }}>
                <Typography variant="subtitle1" gutterBottom component="div">
                  <Typography variant="h6" gutterBottom display="inline">
                    Id:
                  </Typography>{" "}
                  {this.state.activeId}
                </Typography>

                <Typography variant="subtitle1" gutterBottom component="div">
                  <Typography variant="h6" gutterBottom display="inline">
                    First Name:
                  </Typography>{" "}
                  {this.state.activeFirstName}
                </Typography>

                <Typography variant="subtitle1" gutterBottom component="div">
                  <Typography variant="h6" gutterBottom display="inline">
                    Last Name:
                  </Typography>{" "}
                  {this.state.activeLastName}
                </Typography>

                <Typography variant="subtitle1" gutterBottom component="div">
                  <Typography variant="h6" gutterBottom display="inline">
                    User Name:
                  </Typography>{" "}
                  {this.state.activeUserName}
                </Typography>

                <Typography variant="subtitle1" gutterBottom component="div">
                  <Typography variant="h6" gutterBottom display="inline">
                    Email:
                  </Typography>{" "}
                  {this.state.activeEmail}
                </Typography>

                <Typography variant="subtitle1" gutterBottom component="div">
                  <Typography variant="h6" gutterBottom display="inline">
                    Phone Number:
                  </Typography>
                  {this.state.activePhoneNumber}
                </Typography>

                <Typography variant="subtitle1" gutterBottom component="div">
                  <Typography variant="h6" gutterBottom display="inline">
                    Country Code:
                  </Typography>
                  {this.state.activeCountryCode}
                </Typography>

                <Typography variant="subtitle1" gutterBottom component="div">
                  <Typography variant="h6" gutterBottom display="inline">
                    Type:
                  </Typography>
                  {this.state.activeType}
                </Typography>

                <Typography variant="subtitle1" gutterBottom component="div">
                  <Typography variant="h6" gutterBottom display="inline">
                    Device Id:
                  </Typography>
                  {this.state.activeDeviceId}
                </Typography>

                <Typography variant="subtitle1" gutterBottom component="div">
                  <Typography variant="h6" gutterBottom display="inline">
                    Created At:
                  </Typography>
                  {this.state.activeCreatedAt}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  padding: "10px 0px"
                }}
              >
                <Button
                  data-test-id="btnCloseModal"
                  variant="contained"
                  onClick={() => this.hideModal()}
                >
                  Close
                </Button>
              </Box>
            </Box>
          </Modal>
          {/* Customizable End Start */}
        </Container>
      </ThemeProvider>
      //Merge Engine End DefaultContainer
    );
    // Customizable Area End
  }
}

// Customizable Area Start
const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  minWidth: 600,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4
};
// Customizable Area End

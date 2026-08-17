import React from "react";

// Customizable Area Start
import {
  Container,
  Box,
  Input,
  Button,
  InputLabel,
  Typography,
  InputAdornment,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@material-ui/core";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import { userProfile } from "./assets";
// Customizable Area End

import NavigationMenuController, {
  Props,
  configJSON,
} from "./NavigationMenuController";

export default class NavigationMenu extends NavigationMenuController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }

  // Customizable Area Start
  list = () => (
    <div
      className="left"
      style={{
        width: 250,
      }}
      role="presentation"
      onClick={this.toggleDrawer}
      onKeyDown={this.toggleDrawer}
    >
      <Box style={webStyle.userProfileWrapper}>
        <img src={userProfile} style={webStyle.userProfile} />
        <Typography variant="h6">{configJSON.userName}</Typography>
        <Typography variant="h6" style={webStyle.userDesignation}>
          {configJSON.userDesignation}
        </Typography>
        <Button
          onClick={this.toggleDrawer}
          variant="text"
          style={webStyle.logout}
        >
          {configJSON.logout}
        </Button>
      </Box>
      <Divider />
      <List>
        {this.state.drawerItems?.length > 0 &&
          this.state.drawerItems?.map((item: any) => {
            let data = item?.data?.attributes;

            if (data?.position !== "left") {
              return null;
            }

            return (
              <React.Fragment key={data?.id}>
                {data?.items?.map((mItem: any) => {
                  return (
                    <ListItem
                      button
                      key={mItem?.id?.toString()}
                      onClick={() => this.onPressMenuItem(mItem)}
                    >
                      <ListItemIcon>
                        <img src={item.icon} style={webStyle.drawerItemIcon} />
                      </ListItemIcon>
                      <ListItemText primary={mItem?.name} />
                    </ListItem>
                  );
                })}
              </React.Fragment>
            );
          })}
      </List>
    </div>
  );
  // Customizable Area End

  render() {
    // Customizable Area Start
    return (
      <ThemeProvider theme={theme}>
        <Container maxWidth={"sm"}>
          <Button 
            data-test-id={"btnToggleDraw"}
            onClick={this.toggleDrawer}
          >
            {configJSON.openDrawerText}
          </Button>
          <Drawer
            anchor={"left"}
            open={this.state.webDrawer}
            onClose={this.toggleDrawer}
          >
            {this.list()}
          </Drawer>
        </Container>
      </ThemeProvider>
    );
    // Customizable Area End
  }
}

// Customizable Area Start
const theme = createTheme({
  palette: {
    primary: {
      main: "#fff",
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

const webStyle = {
  userProfileWrapper: {
    display: "flex",
    flexDirection: "column" as "column",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 30,
  },
  userProfile: {
    width: 100,
  },
  userDesignation: {
    fontSize: 14,
    color: "#ccc",
  },
  logout: {
    color: "#2196F3",
    marginTop: 15,
    marginBottom: 5,
  },
  drawerItemIcon: {
    width: 20,
    selfAlign: "center",
    marginLeft: 7,
  },
};
// Customizable Area End

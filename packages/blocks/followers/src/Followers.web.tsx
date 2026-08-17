import React from "react";

// Customizable Area Start
import {
  Button,
  Paper,
  Tab,
  Tabs,
  ListItem,
  List,
  ListItemAvatar,
  ListItemText,
  Avatar,
  ListItemSecondaryAction,
} from "@material-ui/core";
// Customizable Area End

import FollowersController, { Props, configJSON } from "./FollowersController";

export default class Followers extends FollowersController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }

  // Customizable Area Start
  TabPanel = (props: {
    children: React.ReactNode;
    value: number;
    index: number;
  }) => {
    const { children, value, index } = props;
    return (
      <div
        role="tabpanel"
        hidden={value != index}
        id={`${index}`}
        aria-labelledby={`scrollable-auto-tab-${index}`}
      >
        {value == index && <div>{children}</div>}
      </div>
    );
  };

  GenTable = (props: {
    functionTestID: string;
    bodyText: string;
    buttonText: string;
    buttonFunction: Function;
    functionPara: string;
  }) => {
    const {
      functionTestID,
      bodyText,
      buttonText,
      buttonFunction,
      functionPara,
    } = props;
    return (
      <div>
        <List dense={true}>
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <h1>{configJSON.ddTitle}</h1>
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={bodyText} />
            <ListItemSecondaryAction>
              <Button
                data-test-id={functionTestID}
                onClick={() => buttonFunction(functionPara)}
                variant="contained"
                color="primary"
              >
                {buttonText}
              </Button>
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </div>
    );
  };
  // Customizable Area End

  render() {
    // Customizable Area Start
    return (
      <>
        <Paper elevation={3}>
          <Tabs
            data-test-id="TabContainer"
            value={this.state.tabPanelNo}
            onChange={this.hanleTabs}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab data-test-id="userListBtn" label="User List" id={"0"} />
            <Tab data-test-id="followingBtn" label="Following" id={"1"} />
            <Tab data-test-id="followerBtn" label="Followers" id={"2"} />
          </Tabs>
        </Paper>
        <br />
        <Paper elevation={3}>
          <this.TabPanel value={this.state.tabPanelNo} index={0}>
            {this.state.userListData?.length && this.state.userListData
              .filter((data) => {
                return data.attributes.is_follow == false;
              })
              .map((item) => {
                return (
                  <div key={item.id}>
                    {this.GenTable({
                      functionTestID: "userFollowBtn",
                      functionPara: item.id,
                      buttonFunction: this.addFromFollowing,
                      bodyText: item.attributes.email,
                      buttonText: "Follow",
                    })}
                  </div>
                );
              })}
          </this.TabPanel>
          <this.TabPanel value={this.state.tabPanelNo} index={1}>
            {this.state.userFollowerListData?.map((item) => {
              return (
                <div key={item.attributes.account_id}>
                  {this.GenTable({
                    functionTestID: "UnfollowBtn",
                    functionPara: item.attributes.account_id,
                    buttonFunction: this.unFollowFromFollowing,
                    bodyText: item.attributes.account_email,
                    buttonText: "UnFollow",
                  })}
                </div>
              );
            })}
          </this.TabPanel>
          <this.TabPanel value={this.state.tabPanelNo} index={2}>
            {this.state.userFollowingListData?.map((item) => {
              return (
                <div key={item.attributes.current_user_id}>
                  {this.GenTable({
                    functionTestID: "followingFollowBtn",
                    functionPara: item.attributes.current_user_id,
                    buttonFunction: this.addFromFollowing,
                    bodyText: item.attributes.email,
                    buttonText: "Follow",
                  })}
                </div>
              );
            })}
          </this.TabPanel>
        </Paper>
      </>
    );
    // Customizable Area End
  }
}

// Customizable Area Start
// Customizable Area End

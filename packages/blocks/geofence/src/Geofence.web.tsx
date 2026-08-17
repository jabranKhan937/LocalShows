import React from "react";

// Customizable Area Start
import { Container } from "@material-ui/core";
// Customizable Area End

import GeofenceController, { Props, configJSON } from "./GeofenceController.web";

export default class Geofence extends GeofenceController {
  // Customizable Area Start
  // Customizable Area End
  render() {
    return (
      // Customizable Area Start
      <Container maxWidth={"sm"}>
        <h2>{configJSON.labelTitleText}</h2>
        <h3> {configJSON.labelBodyText}</h3>
        <h4>{configJSON.geofenceLog}</h4>
        <p data-test-id="log">{this.state.radarLog}</p>
        <h4>{configJSON.geofenceLocation}</h4>
        <p data-test-id="location">{this.state.location}</p>
      </Container>
      // Customizable Area End
    );
  }
}

// Customizable Area Start
const webStyle = {
  pStyle: {
    width: "100%",
    height: "100px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
};
// Customizable Area End

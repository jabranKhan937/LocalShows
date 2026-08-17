// test-setup.js
import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

jest.mock("react-native-geolocation-service", () => ({
  getCurrentPosition: jest.fn((success, error) => {
    success({
      coords: {
        latitude: 123,
        longitude: 45,
      },
    });
  }),
  requestAuthorization: () => "granted",
}));

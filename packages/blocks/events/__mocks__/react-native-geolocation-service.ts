export default {
  addListener: jest.fn(),
  getCurrentPosition: jest.fn()
    .mockImplementationOnce((success) => Promise.resolve(success({
        coords: {
            latitude: 51.1,
            longitude: 45.3
        }
    }))),
  removeListeners: jest.fn(),
  requestAuthorization: jest.fn().mockImplementationOnce(() => Promise.resolve("granted")),
  setConfiguration: jest.fn(),
  startObserving: jest.fn(),
  stopObserving: jest.fn(),
  setRNConfiguration: jest.fn(),
};

import GoogleWebController, {
  GoogleWebDelegate,
} from "../../src/GoogleWebController";

const credential =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhdWQiOiI5NTM1NDAwNjU0MzItaGhkMzhhdDFlbW1lcXN0ZTBwZTk4dGtwbXY1YmxjajYuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMjM0NTY3ODkwMDAwMDAwMDAiLCJlbWFpbCI6InRlc3RAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5hbWUiOiJUZXN0IFVzZXIiLCJwaWN0dXJlIjoiaHR0cHM6Ly91cmwiLCJnaXZlbl9uYW1lIjoiVGVzdCIsImlhdCI6MTY3ODMwODYxNywiZXhwIjoxNjc4MzEyMjE3LCJqdGkiOiI3ZmQ3Mzc0NjdhNDk2Mjk2NDc1YzFjMDc1Y2QzODZlYWJmNDY3NDNjIn0.nf6VQITtYc0BGZ90uJ_lM2FQ5LqlA4POlDMvTNvsl2A";

describe("GoogleWebController", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  test("should be called googleUserStatusChanged from delegateClass after successful login", () => {
    const delegateClass = new GoogleWebDelegate();
    delegateClass.googleUserStatusChanged = jest.fn();
    GoogleWebController.googleLogIn(delegateClass, credential);
    expect(delegateClass.googleUserStatusChanged).toBeCalledWith(
      { email: "test@gmail.com", id: "123456789000000000" },
      false
    );
  });

  test("should be true return value when google return success response with user details", () => {
    const delegateClass = new GoogleWebDelegate();
    GoogleWebController.googleLogIn(delegateClass, credential);
    const updateGoogleUser = GoogleWebController.updateGoogleUser({
      email: "test@gmail.com",
      id: "123456789000000000",
    });
    expect(updateGoogleUser).toBe(true);
  });

  test("should be fase return value when google return failed response", () => {
    const updateGoogleUser = GoogleWebController.updateGoogleUser(null);
    expect(updateGoogleUser).toBe(false);
  });
});

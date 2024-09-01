import { render, screen } from "@testing-library/react-native";
import Groups from "../components/Groups";

jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  onSnapshot: jest.fn((_, callback) => {
    callback({
      docs: [{ id: "Group 1" }, { id: "Group 2" }],
    });
    return () => {};
  }),
}));

jest.mock("../config/firebase", () => ({
  db: jest.fn(),
}));

jest.mock("@react-navigation/native", () => ({
  useNavigation: jest.fn(),
}));

describe("Groups", () => {
  it("render splitsmart text", () => {
    render(<Groups />);
    const splitSmartText = screen.getByText("SplitSmart");
    expect(splitSmartText).toBeTruthy();
  });

  it("render groups", () => {
    render(<Groups />);
    const titleText1 = screen.getByText("Group 1");
    expect(titleText1).toBeTruthy();
    const titleText2 = screen.getByText("Group 2");
    expect(titleText2).toBeTruthy();
  });
});

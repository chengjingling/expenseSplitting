import { render, screen, waitFor } from "@testing-library/react-native";
import CreateExpense from "../components/CreateExpense";

jest.mock("firebase/firestore", () => ({
  getDoc: jest.fn(() => ({
    data: () => ({
      participants: ["Participant 1", "Participant 2"],
    }),
  })),
  doc: jest.fn(),
  collection: jest.fn(),
  addDoc: jest.fn(),
}));

jest.mock("../config/firebase", () => ({
  db: jest.fn(),
}));

jest.mock("@react-navigation/native", () => ({
  useNavigation: jest.fn(),
}));

describe("CreateExpense", () => {
  it("render title field", () => {
    render(<CreateExpense route={{ params: { groupTitle: "Group 1" } }} />);
    const titleText = screen.getByText("Title");
    expect(titleText).toBeTruthy();
    const titleInput = screen.getByTestId("titleInput");
    expect(titleInput).toBeTruthy();
  });

  it("render amount field", () => {
    render(<CreateExpense route={{ params: { groupTitle: "Group 1" } }} />);
    const amountText = screen.getByText("Amount");
    expect(amountText).toBeTruthy();
    const amountInput = screen.getByTestId("amountInput");
    expect(amountInput).toBeTruthy();
  });

  it("render paid by field", async () => {
    render(<CreateExpense route={{ params: { groupTitle: "Group 1" } }} />);
    await waitFor(() => {
      const paidByText = screen.getByText("Paid by");
      expect(paidByText).toBeTruthy();
      const paidByPicker = screen.getByTestId("paidByPicker");
      expect(paidByPicker).toBeTruthy();
    });
  });

  it("render participants field", async () => {
    render(<CreateExpense route={{ params: { groupTitle: "Group 1" } }} />);
    await waitFor(() => {
      const participantsText = screen.getByText("Participants");
      expect(participantsText).toBeTruthy();
      const participantCheckbox1 = screen.getByTestId("Participant 1");
      expect(participantCheckbox1).toBeTruthy();
      const participantText1 = screen.getByText("Participant 1");
      expect(participantText1).toBeTruthy();
      const participantCheckbox2 = screen.getByTestId("Participant 2");
      expect(participantCheckbox2).toBeTruthy();
      const participantText2 = screen.getByText("Participant 2");
      expect(participantText2).toBeTruthy();
    });
  });

  it("render add button", () => {
    render(<CreateExpense route={{ params: { groupTitle: "Group 1" } }} />);
    const addButton = screen.getByText("Add");
    expect(addButton).toBeTruthy();
  });
});

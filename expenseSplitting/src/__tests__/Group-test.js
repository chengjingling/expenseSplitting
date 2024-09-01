import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react-native";
import Group from "../components/Group";

jest.mock("firebase/firestore", () => ({
  getDoc: jest.fn(() => ({
    data: () => ({
      participants: ["Participant 1", "Participant 2"],
    }),
  })),
  doc: jest.fn(),
  collection: jest.fn(),
  onSnapshot: jest.fn((_, callback) => {
    callback({
      docs: [
        {
          id: "Expense 1",
          data: () => ({
            title: "Expense 1",
            paidBy: "Participant 1",
            amount: "10",
            participants: ["Participant 1", "Participant 2"],
          }),
        },
        {
          id: "Expense 2",
          data: () => ({
            title: "Expense 2",
            paidBy: "Participant 2",
            amount: "20",
            participants: ["Participant 1", "Participant 2"],
          }),
        },
      ],
    });
    return () => {};
  }),
}));

jest.mock("../config/firebase", () => ({
  db: jest.fn(),
}));

jest.mock("@react-navigation/native", () => ({
  useNavigation: jest.fn(),
  useFocusEffect: jest.fn(),
}));

describe("Group", () => {
  it("render group 1 text", () => {
    render(<Group route={{ params: { groupTitle: "Group 1" } }} />);
    const group1Text = screen.getByText("Group 1");
    expect(group1Text).toBeTruthy();
  });

  it("render expenses button", () => {
    render(<Group route={{ params: { groupTitle: "Group 1" } }} />);
    const expensesButton = screen.getByTestId("expensesButton");
    expect(expensesButton).toBeTruthy();
  });

  it("press expenses button", () => {
    render(<Group route={{ params: { groupTitle: "Group 1" } }} />);
    const expensesButton = screen.getByTestId("expensesButton");
    fireEvent.press(expensesButton);
    expect(expensesButton.props.style).toEqual(
      expect.objectContaining({ backgroundColor: "#0275d8" })
    );
  });

  it("render expenses", () => {
    render(<Group route={{ params: { groupTitle: "Group 1" } }} />);
    const titleText1 = screen.getByText("Expense 1");
    expect(titleText1).toBeTruthy();
    const paidByText1 = screen.getByText("Paid by Participant 1");
    expect(paidByText1).toBeTruthy();
    const amountText1 = screen.getByText("$10.00");
    expect(amountText1).toBeTruthy();
    const titleText2 = screen.getByText("Expense 2");
    expect(titleText2).toBeTruthy();
    const paidByText2 = screen.getByText("Paid by Participant 2");
    expect(paidByText2).toBeTruthy();
    const amountText2 = screen.getByText("$20.00");
    expect(amountText2).toBeTruthy();
  });

  it("render balances button", () => {
    render(<Group route={{ params: { groupTitle: "Group 1" } }} />);
    const balancesButton = screen.getByTestId("balancesButton");
    expect(balancesButton).toBeTruthy();
  });

  it("press balances button", () => {
    render(<Group route={{ params: { groupTitle: "Group 1" } }} />);
    const balancesButton = screen.getByTestId("balancesButton");
    fireEvent.press(balancesButton);
    expect(balancesButton.props.style).toEqual(
      expect.objectContaining({ backgroundColor: "#0275d8" })
    );
  });

  it("render balances", async () => {
    render(<Group route={{ params: { groupTitle: "Group 1" } }} />);
    await waitFor(() => {
      const balancesButton = screen.getByTestId("balancesButton");
      fireEvent.press(balancesButton);
      const balancesTexts = screen.getAllByText("Balances");
      expect(balancesTexts.length).toBe(2);
      const participantText1 = screen.getByText("Participant 1");
      expect(participantText1).toBeTruthy();
      const balanceText1 = screen.getByText("-$5.00");
      expect(balanceText1).toBeTruthy();
      const participantText2 = screen.getByText("Participant 2");
      expect(participantText2).toBeTruthy();
      const balanceText2 = screen.getByText("+$5.00");
      expect(balanceText2).toBeTruthy();
    });
  });

  it("render reimbursements", async () => {
    render(<Group route={{ params: { groupTitle: "Group 1" } }} />);
    await waitFor(() => {
      const balancesButton = screen.getByTestId("balancesButton");
      fireEvent.press(balancesButton);
      const reimbursementsText = screen.getByText("Reimbursements");
      expect(reimbursementsText).toBeTruthy();
      const whoOwesWhoText = screen.getByText(
        "Participant 1 owes Participant 2"
      );
      expect(whoOwesWhoText).toBeTruthy();
      const amountText = screen.getByText("$5.00");
      expect(amountText).toBeTruthy();
    });
  });
});

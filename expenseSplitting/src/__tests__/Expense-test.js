import { render, screen } from "@testing-library/react-native";
import Expense from "../components/Expense";

describe("Expense", () => {
  it("render title text", () => {
    render(
      <Expense
        route={{
          params: {
            expense: {
              title: "Expense 1",
              dateTimeAdded: { nanoseconds: 525000000, seconds: 1725163200 },
              paidBy: "Participant 1",
              amount: "10",
              participants: ["Participant 1", "Participant 2"],
            },
          },
        }}
      />
    );
    const titleText = screen.getByText("Expense 1");
    expect(titleText).toBeTruthy();
  });

  it("render date time added text", () => {
    render(
      <Expense
        route={{
          params: {
            expense: {
              title: "Expense 1",
              dateTimeAdded: { nanoseconds: 525000000, seconds: 1725163200 },
              paidBy: "Participant 1",
              amount: "10",
              participants: ["Participant 1", "Participant 2"],
            },
          },
        }}
      />
    );
    const dateTimeAddedText = screen.getByText("Sunday, 1 Sep 2024 12:00 PM");
    expect(dateTimeAddedText).toBeTruthy();
  });

  it("render paid by section", () => {
    render(
      <Expense
        route={{
          params: {
            expense: {
              title: "Expense 1",
              dateTimeAdded: { nanoseconds: 525000000, seconds: 1725163200 },
              paidBy: "Participant 1",
              amount: "10",
              participants: ["Participant 1", "Participant 2"],
            },
          },
        }}
      />
    );
    const paidByText = screen.getByText("Paid by");
    expect(paidByText).toBeTruthy();
    const paidByTexts = screen.getAllByText("Participant 1");
    expect(paidByTexts.length).toBe(2);
    const amountText = screen.getByText("$10.00");
    expect(amountText).toBeTruthy();
  });

  it("render participants section", () => {
    render(
      <Expense
        route={{
          params: {
            expense: {
              title: "Expense 1",
              dateTimeAdded: { nanoseconds: 525000000, seconds: 1725163200 },
              paidBy: "Participant 1",
              amount: "10",
              participants: ["Participant 1", "Participant 2"],
            },
          },
        }}
      />
    );
    const participantsText = screen.getByText("Participants");
    expect(participantsText).toBeTruthy();
    const participantText1 = screen.getAllByText("Participant 1");
    expect(participantText1.length).toBe(2);
    const participantText2 = screen.getByText("Participant 2");
    expect(participantText2).toBeTruthy();
    const amountTexts = screen.getAllByText("$5.00");
    expect(amountTexts.length).toBe(2);
  });
});

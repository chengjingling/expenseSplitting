import { render, screen, fireEvent } from "@testing-library/react-native";
import CreateGroup from "../components/CreateGroup";

jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  setDoc: jest.fn(),
}));

jest.mock("../config/firebase", () => ({
  db: jest.fn(),
}));

jest.mock("@react-navigation/native", () => ({
  useNavigation: jest.fn(),
}));

describe("CreateGroup", () => {
  it("render title text", () => {
    render(<CreateGroup />);
    const titleText = screen.getByText("Title");
    expect(titleText).toBeTruthy();
  });

  it("render title input", () => {
    render(<CreateGroup />);
    const titleInput = screen.getByTestId("titleInput");
    expect(titleInput).toBeTruthy();
  });

  it("render participants text", () => {
    render(<CreateGroup />);
    const participantsText = screen.getByText("Participants");
    expect(participantsText).toBeTruthy();
  });

  it("render participant input", () => {
    render(<CreateGroup />);
    const participantInput = screen.getByTestId("participantInput");
    expect(participantInput).toBeTruthy();
  });

  it("render remove button", () => {
    render(<CreateGroup />);
    const removeButton = screen.getByText("Remove");
    expect(removeButton).toBeTruthy();
  });

  it("press remove button", () => {
    render(<CreateGroup />);
    const removeButton = screen.getByText("Remove");
    fireEvent.press(removeButton);
    const participantInput = screen.queryByTestId("participantInput");
    expect(participantInput).toBeNull();
  });

  it("render add participant button", () => {
    render(<CreateGroup />);
    const addParticipantButton = screen.getByText("Add participant");
    expect(addParticipantButton).toBeTruthy();
  });

  it("press add participant button", () => {
    render(<CreateGroup />);
    const addParticipantButton = screen.getByText("Add participant");
    fireEvent.press(addParticipantButton);
    const participantInputs = screen.getAllByTestId("participantInput");
    expect(participantInputs.length).toBe(2);
  });

  it("render create button", () => {
    render(<CreateGroup />);
    const createButton = screen.getByText("Create");
    expect(createButton).toBeTruthy();
  });
});

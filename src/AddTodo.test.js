import { render, screen, fireEvent } from "@testing-library/react";
import { unmountComponentAtNode } from "react-dom";
import App from "./App";

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

test("test that App component doesn't render dupicate Task", () => {
  render(<App />);
  let confirmSpy;
  confirmSpy = jest.spyOn(window, "confirm");
  confirmSpy.mockImplementation(jest.fn(() => false));

  const inputTask = screen.getByRole("textbox", { name: /Add New Item/i });
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const element = screen.getByRole("button", { name: /Add/i });
  const dueDate = "05/30/2023";

  fireEvent.change(inputTask, { target: { value: "History Test" } });
  fireEvent.change(inputDate, { target: { value: dueDate } });
  fireEvent.click(element);

  fireEvent.change(inputTask, { target: { value: "History Test" } });
  fireEvent.change(inputDate, { target: { value: dueDate } });
  fireEvent.click(element);

  confirmSpy.mockRestore();

  const check = screen.getAllByText(/History Test/i);

  expect(check.length).toEqual(1);
});

test("test that App component doesn't add a task without task name", () => {
  render(<App />);

  const inputTask = screen.getByRole("textbox", { name: /Add New Item/i });
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const elementButton = screen.getByRole("button", { name: /Add/i });
  const dueDate = "05/30/2023";

  fireEvent.change(inputTask, { target: { value: "" } });
  fireEvent.change(inputDate, { target: { value: dueDate } });
  fireEvent.click(elementButton);
  const check = screen.queryByText(dueDate);
  expect(check).toBeNull();
});

test("test that App component doesn't add a task without due date", () => {
  render(<App />);
  let confirmSpy;
  confirmSpy = jest.spyOn(window, "alert");
  confirmSpy.mockImplementation(jest.fn(() => true));

  const inputTask = screen.getByRole("textbox", { name: /Add New Item/i });
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const element = screen.getByRole("button", { name: /Add/i });
  const dueDate = "";

  fireEvent.change(inputTask, { target: { value: "History Test" } });
  fireEvent.change(inputDate, { target: { value: dueDate } });
  fireEvent.click(element);

  confirmSpy.mockRestore();

  const check = screen.queryByText(/History Test/i);

  expect(check).toBeNull();
});

test("test that App component can be deleted thru checkbox", () => {
  render(<App />);
  const inputTask = screen.getByRole("textbox", { name: /Add New Item/i });
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const element = screen.getByRole("button", { name: /Add/i });
  const dueDate = "05/30/2023";
  fireEvent.change(inputTask, { target: { value: "History Test" } });
  fireEvent.change(inputDate, { target: { value: dueDate } });
  fireEvent.click(element);

  let checkBox = screen.getByRole("checkbox");
  fireEvent.click(checkBox);
  const check2 = screen.queryByText(/History Test/i);
  expect(check2).toBeNull();
});

test("test that App component renders different colors for past due events", () => {
  render(<App />);
  const inputTask = screen.getByRole("textbox", { name: /Add New Item/i });
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const element = screen.getByRole("button", { name: /Add/i });
  const dueDate = "05/30/1900";
  fireEvent.change(inputTask, { target: { value: "History Test" } });
  fireEvent.change(inputDate, { target: { value: dueDate } });
  fireEvent.click(element);
  fireEvent.change(inputTask, { target: { value: "Math Test " } });
  fireEvent.change(inputDate, { target: { value: "05/30/2100" } });
  fireEvent.click(element);

  const historyCheck = screen.getByTestId(/History Test/i).style.background;
  const mathCheck = screen.getByTestId(/Math Test/i).style.background;
  expect(historyCheck).not.toEqual(mathCheck);
});

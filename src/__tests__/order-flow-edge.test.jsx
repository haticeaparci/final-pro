import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Checkout from "../components/Checkout";
import CartContext from "../store/CartContext";
import UserProgressContext from "../store/UserProgressContext";

const mockSendRequest = jest.fn();

jest.mock("../../src/hooks/useHttp", () => ({
  __esModule: true,
  default: () => ({
    data: null,
    isLoading: false,
    error: null,
    sendRequest: mockSendRequest,
    clearData: jest.fn(),
  }),
}));

jest.mock("../components/UI/Modal", () => ({ children }) => (
  <div>{children}</div>
));

const MockProviders = ({ children }) => {
  const userContextValue = {
    progress: "checkout",
    showCheckout: jest.fn(),
    hideCheckout: jest.fn(),
  };
  const cartContextValue = {
    items: [{ id: "m1", name: "Test Meal", price: 10, quantity: 1 }],
    addItem: jest.fn(),
    clearCart: jest.fn(),
  };
  return (
    <UserProgressContext.Provider value={userContextValue}>
      <CartContext.Provider value={cartContextValue}>
        {children}
      </CartContext.Provider>
    </UserProgressContext.Provider>
  );
};

test("can fill out form and submit order", () => {
  render(
    <MockProviders>
      <Checkout />
    </MockProviders>
  );

  fireEvent.change(screen.getByTestId("full-name"), {
    target: { value: "Test User" },
  });
  fireEvent.change(screen.getByTestId("email"), {
    target: { value: "test@example.com" },
  });
  fireEvent.change(screen.getByTestId("address"), {
    target: { value: "Test Street" },
  });
  fireEvent.change(screen.getByTestId("postal-code"), {
    target: { value: "12345" },
  });
  fireEvent.change(screen.getByTestId("city"), {
    target: { value: "Test City" },
  });

  fireEvent.click(screen.getByTestId("submit-order"));

  expect(mockSendRequest).toHaveBeenCalled();
});

test("shows validation errors if required fields are empty", () => {
  render(
    <MockProviders>
      <Checkout />
    </MockProviders>
  );

  fireEvent.click(screen.getByTestId("submit-order"));

  expect(screen.getByText(/please enter your full name/i)).toBeInTheDocument();
  expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument();
  expect(screen.getByText(/please enter your address/i)).toBeInTheDocument();
  expect(
    screen.getByText(/please enter your postal code/i)
  ).toBeInTheDocument();
  expect(screen.getByText(/please enter your city/i)).toBeInTheDocument();
  expect(mockSendRequest).not.toHaveBeenCalled();
});

test("does not submit if email is invalid", () => {
  render(
    <MockProviders>
      <Checkout />
    </MockProviders>
  );

  fireEvent.change(screen.getByTestId("full-name"), {
    target: { value: "Test User" },
  });
  fireEvent.change(screen.getByTestId("email"), {
    target: { value: "invalid-email" },
  });
  fireEvent.change(screen.getByTestId("address"), {
    target: { value: "Test Street" },
  });
  fireEvent.change(screen.getByTestId("postal-code"), {
    target: { value: "12345" },
  });
  fireEvent.change(screen.getByTestId("city"), {
    target: { value: "Test City" },
  });

  fireEvent.click(screen.getByTestId("submit-order"));

  expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument();
  expect(mockSendRequest).not.toHaveBeenCalled();
});

test("clears form after successful submission", () => {
  render(
    <MockProviders>
      <Checkout />
    </MockProviders>
  );

  fireEvent.change(screen.getByTestId("full-name"), {
    target: { value: "Test User" },
  });
  fireEvent.change(screen.getByTestId("email"), {
    target: { value: "test@example.com" },
  });
  fireEvent.change(screen.getByTestId("address"), {
    target: { value: "Test Street" },
  });
  fireEvent.change(screen.getByTestId("postal-code"), {
    target: { value: "12345" },
  });
  fireEvent.change(screen.getByTestId("city"), {
    target: { value: "Test City" },
  });

  fireEvent.click(screen.getByTestId("submit-order"));

  expect(mockSendRequest).toHaveBeenCalled();

  // Optionally, check if fields are cleared (if your component does this)
  // expect(screen.getByTestId("full-name").value).toBe("");
  // expect(screen.getByTestId("email").value).toBe("");
});

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Checkout from "../components/Checkout";
import CartContext from "../store/CartContext";
import UserProgressContext from "../store/UserProgressContext";
// import useHttp from "../../src/hooks/useHttp";

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

/*  !!! 
$ npx jest
  console.log
    Form submitted

      at log (src/components/Checkout.jsx:81:13)

 PASS  src/__tests__/order-flow.test.jsx
  √ can fill out form and submit order (132 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        3.2 s
Ran all test suites.

*/

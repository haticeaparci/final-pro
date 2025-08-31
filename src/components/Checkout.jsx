import { useContext } from "react";
import Modal from "./UI/Modal.jsx";
import { currencyFormatter } from "../util/formatting.js";
import InputCustom from "./UI/InputCustom.jsx";
import ButtonCustom from "./UI/ButtonCustom.jsx";
import CartContext from "../store/CartContext.jsx";
import UserProgressContext from "../store/UserProgressContext.jsx";
import useHttp from "../hooks/useHttp.js";
import Error from "./Error.jsx";

// function getApiBaseUrl() {
//   try {
//     return eval("import.meta.env && import.meta.env.DEV")
//       ? "http://localhost:3000"
//       : "";
//   } catch {
//     return "";
//   }
// }
function getApiBaseUrl() {
  try {
    return import.meta.env.DEV ? "http://localhost:3000" : "";
  } catch {
    return "";
  }
}
export default function Checkout() {
  const cartCtx = useContext(CartContext);
  const userProgressCtx = useContext(UserProgressContext);

  const API_BASE_URL = getApiBaseUrl();
  const {
    data,
    isLoading: isSending,
    error,
    sendRequest,
    clearData,
  } = useHttp(`${API_BASE_URL}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  const cartTotal = cartCtx.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  function handleCloseCheckout() {
    userProgressCtx.hideCheckout();
  }

  function handleFinish() {
    userProgressCtx.hideCheckout();
    cartCtx.clearCart();
    clearData();
  }

  function handleSubmitOrder(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const customerData = Object.fromEntries(formData.entries());
    // console.log("Form submitted");
    sendRequest(
      JSON.stringify({
        order: { items: cartCtx.items, customer: customerData },
      })
    );
  }

  let actions = (
    <>
      <ButtonCustom type="button" textOnly onClick={handleCloseCheckout}>
        Close
      </ButtonCustom>
      <ButtonCustom type="submit" data-testid="submit-order">
        Submit Order
      </ButtonCustom>
    </>
  );

  if (isSending) actions = <span>Sending order ...</span>;

  if (data && !error) {
    return (
      <Modal
        open={userProgressCtx.progress === "checkout"}
        onClose={handleFinish}
      >
        <div class="success-message">
          <h2>Order Successful!</h2>
          <p>🎉 Thank you! Your order was successful.</p>
        </div>

        <p className="modal-actions">
          <ButtonCustom onClick={handleFinish}>Okay</ButtonCustom>
        </p>
      </Modal>
    );
  }

  return (
    <Modal
      open={userProgressCtx.progress === "checkout"}
      onClose={handleFinish}
    >
      <form onSubmit={handleSubmitOrder}>
        <h2>Checkout</h2>
        <p>Total Amount: {currencyFormatter.format(cartTotal)}</p>
        <InputCustom
          label="Full Name"
          type="text"
          id="name"
          data-testid="full-name"
        />
        <InputCustom
          label="Email"
          type="email"
          id="email"
          data-testid="email"
        />
        <InputCustom
          label="Address"
          type="text"
          id="street"
          data-testid="address"
        />
        <div className="control-row">
          <InputCustom
            label="Postal Code"
            type="text"
            id="postal-code"
            data-testid="postal-code"
          />
          <InputCustom label="City" type="text" id="city" data-testid="city" />
        </div>
        {error && <Error title="Failed to submit order" message={error} />}
        <p className="modal-actions">{actions}</p>
      </form>
    </Modal>
  );
}

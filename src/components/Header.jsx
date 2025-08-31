import { useContext } from "react";
import Logo from "./UI/Logo.jsx";
import logoImg from "../assets/logo.jpg";
import CartContext from "../store/CartContext.jsx";
import UserProgressContext from "../store/UserProgressContext.jsx";
import ButtonCustom from "./UI/ButtonCustom.jsx";

export default function Header() {
  const cartCtx = useContext(CartContext);
  const userProgressCtx = useContext(UserProgressContext);

  const totalCartItems = cartCtx.items.reduce((totalNumberOfItems, item) => {
    return totalNumberOfItems + item.quantity;
  }, 0);

  function handleShowCart() {
    userProgressCtx.showCart();
  }

  return (
    <header id="main-header">
      <div id="title">
        <Logo size={40} />
        <img src={logoImg} alt="A restaurant" />
        <h1> SnackStack Order </h1>
      </div>
      <nav>
        <ButtonCustom textOnly onClick={handleShowCart}>
          Cart ({totalCartItems})
        </ButtonCustom>
      </nav>
    </header>
  );
}

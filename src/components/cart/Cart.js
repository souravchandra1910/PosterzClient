import React from "react";
import "./Cart.scss";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { BsCartX } from "react-icons/bs";
import CartItem from "../../CartItems/CartItems";
import { useSelector } from "react-redux";
import { axiosClient } from "../../utils/axoisClient";
import { loadStripe } from "@stripe/stripe-js";
//const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
function Cart({ onClose }) {
  const cart = useSelector((state) => state.cartReducer.cart);
  let total = 0;
  cart.forEach((item) => {
    total += item.quantity * item.price;
  });
  const isCartEmpty = cart.length === 0;

  async function handleCheckOut() {
    try {
      const response = await axiosClient.post("/orders", {
        products: cart,
      });

      const stripe = await loadStripe(
        `${process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY}`
      );
      const data = await stripe.redirectToCheckout({
        sessionId: response.data.stripeId,
      });

      console.log("stripe data", data);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="Cart">
      <div className="overlay" onClick={onClose}></div>
      <div className="cart-content">
        <div className="header">
          <h3>Shopping Cart</h3>
          <div className="close-btn" onClick={onClose}>
            <AiOutlineCloseCircle />
            Close
          </div>
        </div>
        <div className="cartItem">
          {cart.map((item) => (
            <CartItem key={item.key} cart={item} />
          ))}
        </div>
        {isCartEmpty && (
          <div className="empty-cart-info">
            <div className="icon">
              <BsCartX />
            </div>
            <h3>Cart is empty</h3>
          </div>
        )}
        {!isCartEmpty && (
          <div className="checkout-info">
            <div className="total-amount">
              <h3 className="total-message">Total</h3>
              <h3 className="total-value">₹ {total}</h3>
            </div>
            <div className="checkout btn-primary" onClick={handleCheckOut}>
              Checkout now
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;

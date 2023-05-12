import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import dummyImg from "../../assets/naruto.jpeg";
import { axiosClient } from "../../utils/axoisClient";

import axios from "axios";
import "./ProductDetail.scss";
import Loader from "../../components/Loader/Loader";
import { removeFromCart,addToCart } from "../../Redux/CartSlice";
import { useDispatch, useSelector } from "react-redux";

function ProductDetail() {
  const params = useParams();
  const [product, setProduct] = useState(null);
  
  const dispatch=useDispatch();
  
  const cart = useSelector((state)=> state.cartReducer.cart);
  const quantity = cart.find(item => item.key === params.productId)?.quantity || 0;

  
  async function fetchData() {
      const productResponse = await axiosClient.get(
          `/products?filters[key][$eq]=${params.productId}&populate=*`
      );
      if (productResponse.data.data.length > 0) {
          setProduct(productResponse.data.data[0]);
      }
  }

  useEffect(() => {
      setProduct(null);
      fetchData();
  }, [params]);

  if (!product) {
      return <Loader/>;
  }

  return (
    <div className="Product-detail">
      <div className="container">
        <div className="product-layout">
          <div className="product-img center">
            <div className="img-container">
              <img src={product?.attributes.image.data.attributes.url} alt="#" />
            </div>
          </div>
          <div className="product-info">
            <h1 className="heading">{product?.attributes.title}</h1>
            <h3 className="price">₹{product?.attributes.price}</h3>
            <p>
             {product?.attributes.desc}
            </p>
            <div className="cart-options">
              <div className="quantity-selector">
                <span className="btn decrement" onClick={()=>dispatch(removeFromCart(product))}>-</span>
                <span className="quantity">{quantity}</span>
                <span className="btn increment" onClick={()=>dispatch(addToCart(product))}>+</span>
              </div>
              <button className="btn-primary add-to-cart" onClick={()=>dispatch(addToCart(product))}>
                 Add to cart
              </button>
              
            </div>

            <div className="return-policy">
              <ul>
                <li>
                  This product is made to order and is typically printed in 3-6
                  working days. Your entire order will be shipped together
                </li>
                <li>
                  Since this is printed on demand especially for you . It is not
                  eligible for cancellations and returns. Read our Privacy
                  Policy
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;

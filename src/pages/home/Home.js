import React, { useEffect, useState } from "react";
import Category from "../../components/category/Category";
import Hero from "../../components/hero/Hero";
import Product from "../../components/product/Product";
import { axiosClient } from '../../utils/axoisClient'
import "./Home.scss";
import { useSelector } from "react-redux";
import axios from "axios";
function Home() {
   
  const [topProducts, setTopProducts] = useState(null);
  const categories = useSelector((state) => state.categoryReducer.categories);

  async function fetchData() {
      const topProductsResponse = await axiosClient.get(
        "/products?filters[isTopPick][$eq]=true&populate=image"
    );
    const categoryResponse=await axiosClient.get(
      "/categories?populate=image"
      );
    setTopProducts(topProductsResponse.data.data);
   // setCategories(categoryResponse.data.data);
    
  }

  useEffect(() => {
  fetchData();
  }, []);

  return (
    <div className="Home">
      <Hero />
      <section className="collection container">
        <div className="info">
          <h2 className="heading">Shop by categories</h2>
          <p className="subheading">
            Shop from the best,our file and TV Posters Collection.
          </p>
        </div>
        <div className="content">
        {categories?.map((category) => (
                        <Category key={category.id} category={category} />))}
        </div>
      </section>

      <section className="collection container">
        <div className="info">
          <h2 className="heading">Shop by categories</h2>
          <p className="subheading">
            Shop from the best,our file and TV Posters Collection.
          </p>
        </div>
        <div className="content">
          {topProducts?.map(product=><Product key={product.id} product={product}/>)}
        </div>
      </section>
    </div>
  );
}

export default Home;

import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  // Link,
  Navigate
} from "react-router-dom";

import Cart from "./page/Cart/Cart";
import Login from "./page/Login/Login";
import Register from "./page/Register/Register";
import Home from "./page/Home/Home.jsx";
import ProductList from "./page/ProductList/ProductList";
import SingleProduct from "./page/SingleProduct/SingleProduct";
import Success from "./page/Success/Success";
import { useSelector } from "react-redux";


const App = () => {
  const user = useSelector(state => state.user.currentUser);

  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/products/" element={<ProductList />} />
        <Route path="/products/:type" element={<ProductList />} />
        <Route path="/product/:id" element={<SingleProduct />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={user ? <Navigate to="/"/> : <Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/success" element={<Success />} />
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </Router>
  );
};

export default App;
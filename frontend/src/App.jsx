import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  // Link,
  Navigate
} from "react-router-dom";
import { useSelector } from "react-redux";

import Cart from "./page/Cart/Cart";
import Login from "./page/Login/Login";
import Register from "./page/Register/Register";
import Home from "./page/Home/Home.jsx";
import ProductList from "./page/ProductList/ProductList";
import SingleProduct from "./page/SingleProduct/SingleProduct";
import Success from "./page/Success/Success";
import Admin from "./page/Admin/Admin";
import UserList from "./page/Admin/page/UserList/UserList";
import SingleUser from "./page/Admin/page/SingleUser/SingleUser";
import AdminHome from "./page/Admin/page/Home/AdminHome";

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
        <Route path="/admin" element={<Admin />}>
          <Route path="/admin" element={<AdminHome />}/>
          <Route path="/admin/users" element={<UserList />} />
          <Route path="/admin/users/:id" element={<SingleUser />} />
        </Route>
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </Router>
  );
};

export default App;
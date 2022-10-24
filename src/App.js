import Register from "./components/Register";
import ipConfig from "./ipConfig.json";
import { Route, Switch } from "react-router-dom";
import Login from "./components/Login";
import Products from "./components/Products";
import Thanks from "./components/Thanks";
import Checkout from "./components/Checkout";
import React from "react";

export const config = {
  endpoint: `https://q-cart-frontend.herokuapp.com/api/v1`,
};

function App() {
  return (
    <div className="App">
      {/* TODO: CRIO_TASK_MODULE_LOGIN - To add configure routes and their mapping */}
         
       
         
        
         
         <Switch>
         <Route path="/thanks" component={Thanks}/>
         <Route path="/checkout" component={Checkout}/>
          <Route path="/register" component={Register}/>
          <Route path="/login" component={Login}/>
          <Route path="/" component={Products}/>
         
          {/* <Route path="/">
            <Home />
          </Route> */}
        </Switch>

       
        
          
    </div>
  );
}

export default App;

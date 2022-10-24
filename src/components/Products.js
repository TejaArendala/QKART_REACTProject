import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from "./ProductCard";
import Cart,{generateCartItemsFrom} from "./Cart";


const Products = () => {

  const { enqueueSnackbar } = useSnackbar();
  const [ProductList, setProductList] = useState([]);
  const [loading, setloading] = useState(false);
  const [filteredlist, setFilteredProducts] = useState([]);
  const [debounceTimeout, setDebounceTimeout] = useState(0);
  const token = localStorage.getItem("token");
  const [itemslist,setItems]=useState([]);

  const performAPICall = async () => {
    setloading(true);
    try {
      const url = config.endpoint + `/products`;
      const res = await axios.get(url);
      setProductList(res.data);
      setFilteredProducts(res.data);
      setloading(false);
     
      return res.data;
    } catch (e) {

      setloading(true);
      enqueueSnackbar(
        `Something went wrong. Check that the backend is running,reachable and returns valid Data`,
        { variant: "error" }
      );
    }
  };


  useEffect(() => {
   
    //performAPICall();
    const onLoadHandler = async () =>
    {
   const productsdata = await performAPICall();
   const cartsdata = await fetchCart(token);

   const itemslist = await generateCartItemsFrom(cartsdata,productsdata);

   setItems(itemslist);
    };
    
   onLoadHandler();


  }, []);


  const performSearch = async (text) => {
    try {

      const response = await axios.get(`${config.endpoint}/products/search?value=${text}`);
      setFilteredProducts(response.data);

      return response.data;

    } catch (e) {
      if (e.response) {
        if (e.response.status === 404) {
          setFilteredProducts([]);
        }
        if (e.response.status === 500) {
          enqueueSnackbar(e.response.data.message, { variant: "error" });
          setFilteredProducts(ProductList);
        }

      }
      else {
        enqueueSnackbar("Could not fetch products. Check that the backend is running, reachable and returns valid JSON.",
          { variant: "error", });
      }
    }
  };

  const debounceSearch = (event, debounceTimeout) => {
    const value = event.target.value;

    if (debounceTimeout) {

      clearTimeout(debounceTimeout);
    }
    const timeout = setTimeout(() => { performSearch(value); }, 500);
    setDebounceTimeout(timeout);
  };

  /**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */
   const fetchCart = async (token) => {
    if (!token) return;

    try {
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
      
   const resp =await axios.get(`${config.endpoint}/cart`, {
  headers: {
    'Authorization': `Bearer ${token}`
          }
           });
         
           return resp.data;

    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };


  // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
  // const isItemInCart = (items, productId) => {
  // };

  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200 - Updated list of cart items
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 404 - On invalid productId
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */
  const addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {
     
    if(!token)
    {enqueueSnackbar("Please login to add to cart",{variant:"warning"});
    return;
  }

    if(options.preventDuplicate && items.find((item)=>item.productId===productId))
    {
      enqueueSnackbar("Item already in cart. Use the cart sidebar to update quantity or remove item.",{variant:"warning"});
      return;
    }

    try {
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
      
   const  resp  =await axios.post(`${config.endpoint}/cart`,
     {productId,qty},
    {
      headers: {
    'Authorization': `Bearer ${token}`
          }
           });
         
     updateCart(resp.data,ProductList);
     
    } catch (e) {

      enqueueSnackbar("Error adding to cart",{variant:"error"});
    }
   
    return true;
     
  };

  const updateCart =(cartitem,products) =>
  {
    const addingcartitem = generateCartItemsFrom(cartitem,products);
    setItems(addingcartitem);
  }




  return (
    <div>
      <Header hasHiddenAuthButtons>
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
        <TextField
          className="search-desktop"
          size="small"
          InputProps={{
            className: "search",
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          placeholder="Search for items/categories"
          name="search"
          onChange={(e) => { debounceSearch(e, debounceTimeout) }}
        />
      </Header>

      {/* Search view for mobiles */}
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        onChange={(e) => { debounceSearch(e, debounceTimeout) }}
      />
      <Grid container mb={2} >
        <Grid item className="product-grid" xs={12} md={localStorage.getItem("token") && ProductList.length?9:12}>
          <Box className="hero">
            <p className="hero-heading">
              India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
              to your door step
            </p>
          </Box>

          {loading ? (
            <Box className="loading">
              <CircularProgress color="success" />
              <Typography>Loading Products</Typography>
            </Box>
          ) : (

            filteredlist.length > 0 ?
              (
                <Grid container spacing={1} >
                  {

                    filteredlist.map((product) => {
                      return (
                        <Grid item xs={6} md={3} key={product._id}>
                          <ProductCard product={product} handleAddToCart={async ()=>{ await addToCart(
                                                                         token,
                                                                         itemslist,
                                                                         ProductList,
                                                                         product._id,
                                                                         1,
                                                                        { preventDuplicate: true }
                                                                                          

                                                                                    );} }/>
                        </Grid>
                      );
                    })

                  }
                </Grid>
              ) :
              (
                <Box className="loading" color="gray">
                  <SentimentDissatisfied />
                  <Typography >No products found</Typography>
                </Box>
              )

          )
          }


        </Grid>


        {/* cart display conditionally */}
        {
          localStorage.getItem("token") ?
          <Grid item xs={12} md={3}>
           <Cart   
           products={ProductList}
           items = {itemslist}
           handleQuantity={addToCart}
           />
           </Grid>:null


        }









      </Grid>
      <Footer />
    </div>
  );
};

export default Products;

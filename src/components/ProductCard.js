import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Rating,
  Typography,
  Stack,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";

const ProductCard = ({ product, handleAddToCart }) => {
 
 

  return (
    <Card className="card">
      <CardMedia component="img" image={product.image} alt="Video" />
      <CardContent className="card-actions">
        <Stack spacing={2} >
          <Typography gutterBottom variant="h5">
            {product.name}
          </Typography>
          <Typography color="text.secondary" gutterBottom>
            ${product.cost}
          </Typography>
          <Rating name="size-medium" defaultValue={product.rating} readOnly/>
          {/* <Typography color="text.secondary">{props.releaseDate}</Typography> */}
          <Button className="card-button" variant="contained" onClick={handleAddToCart}>
            <AddShoppingCartIcon />
         
            ADD TO CART
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ProductCard;

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Avatar,
  Button,
  Stack,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import { useHistory } from "react-router-dom";
import "./Header.css";

const Header = ({ children, hasHiddenAuthButtons }) => {
  const history = useHistory();
  let isloggedin = false;
  if (localStorage.getItem("token") != null) {
    isloggedin = true;
  }

  const refresh = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <Box className="header">
      <Box className="header-title">
        <img src="logo_light.svg" alt="QKart-icon"></img>
      </Box>

      {children}

      {hasHiddenAuthButtons ? (
        isloggedin ? (
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              alt={localStorage.getItem("username")}
              src="avatar.png"
              sx={{ width: 36, height: 36 }}
            />

            <Typography className="username-text">
              {localStorage.getItem("username")}
            </Typography>

            <Button onClick={refresh} variant="contained">
              LOGOUT
            </Button>
          </Stack>
        ) : (
          <Stack direction="row" spacing={2}>
            <Button onClick={() => history.push("/login")} variant="contained">
              Login
            </Button>
            <Button
              onClick={() => history.push("/register")}
              variant="contained"
            >
              Register
            </Button>
          </Stack>
        )
      ) : (
        <Button
          className="explore-button"
          startIcon={<ArrowBackIcon />}
          variant="text"
          onClick={() => history.push("/")}
        >
          Back to explore
        </Button>
      )}
    </Box>
  );
};

export default Header;

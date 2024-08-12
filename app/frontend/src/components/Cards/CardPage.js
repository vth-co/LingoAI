import { Container, Box, Typography } from "@mui/material";
import React from "react";
import LanguageSelector from "./LanguageSelector";
import InfiniteScroll from "./InfiniteLogIn";
import { NavLink } from "react-router-dom";

function CardPage() {
  return (
    <Box display="flex" alignItems="center" flexDirection="column">
      <h1>Select Your Language</h1>
      <Container>
      </Container>
        <Container>
          <Typography align="center" mt="50px" variant="h5">Already a User?</Typography>
          <Box component={NavLink} to='/login'>
            {/* {" Log in"} */}
          </Box>
        </Container>
    </Box>
  );
}

export default CardPage;

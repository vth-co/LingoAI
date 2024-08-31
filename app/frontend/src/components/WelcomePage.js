import { Link, Container, Box, Typography, Button } from "@mui/material";
import React from "react";
import LanguageSelector from "./LanguageSelector";
import InfiniteLangScroll from "./InfiniteLanguage";
import { Link as RouterLink } from 'react-router-dom';
// import InfiniteScroll from "./InfiniteLogIn";
// import { NavLink } from "react-router-dom";

function WelcomePage({ setLocale }) {
  return (
    <Box display="flex" alignItems="center" flexDirection="column" paddingLeft="5vw" paddingRight="5vw">
      <h1 style={{ marginBottom: "0px" }}>Select Your Language</h1>
      <InfiniteLangScroll />
      <Container>
        <LanguageSelector setLocale={setLocale} />
      </Container>
      <Container>
        <Typography align="center" mt="50px">Already a User?{' '}
          <Link
            component={RouterLink}
            to="/login"
            sx={{
              textDecoration: 'none',
              color: 'primary.main',
              '&:hover': {
                textDecoration: 'underline',
              }
            }}
          >
            Log In
          </Link>
        </Typography>
        {/* <Box component={NavLink} to='/login'>
          <InfiniteScroll />
        </Box> */}
      </Container>
    </Box>
  );
}

export default WelcomePage;

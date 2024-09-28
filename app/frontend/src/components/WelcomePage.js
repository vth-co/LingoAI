import { Link, Container, Box, Typography, Divider } from "@mui/material";
import React from "react";
import LanguageSelector from "./LanguageSelector";
import InfiniteLangScroll from "./InfiniteLanguage.js";
import { Link as RouterLink } from 'react-router-dom';
// import InfiniteScroll from "./InfiniteLogIn";
// import { NavLink } from "react-router-dom";

function WelcomePage({ setLocale }) {
  return (

    <Box display="flex" alignItems="center" flexDirection="column" paddingLeft="5vw" paddingRight="5vw">


      <Typography variant="h1" sx={{ textAlign: "center", padding: "20px 0" }}>
        Level Up Your English with Lingo.ai</Typography>
      <Typography variant="h3" sx={{ textAlign: "center", fontWeight: "400" }}>Using innovative AI-powered flashcards,
        <br />
        Lingo.ai helps you break through language barriers and enhance your English proficiency for better opportunities.</Typography>

      <Divider sx={{
        backgroundColor: (theme) => theme.palette.divider.main,
        height: '1px',
        border: 'none',
        width: '100%',
        maxWidth: '1150px',
        margin: '40px 0'
      }} />

      <Typography variant="h2">Select Your Language</Typography>
      < br />
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
    </Box >
  );
}

export default WelcomePage;

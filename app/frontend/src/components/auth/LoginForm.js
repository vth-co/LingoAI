import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { FormattedMessage } from "react-intl";
import { Alert, Box, Button, Container, setRef, TextField, Typography } from "@mui/material";
import { login } from "../../store/session";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const [error, setError] = useState("");

  const onLogin = async (e) => {
    e.preventDefault();
    // console.log("Login function called"); // Check if this logs

    try {
      await dispatch(login(email, password));
      // console.log("It tried"); // Check if this logs
    } catch (error) {
      console.error("Login error:", error); // Log the full error object

      if (error.message.includes("auth/invalid-credential")) {
        setError("Invalid email or password");
      } else {
        setError(error?.message || "An unknown error occurred.")
      }
      // console.log("Current error state:", error); // Log the current error state
    }
  };




  const handleDemoClick = async (e) => {
    e.preventDefault();

    const credential = "plzwork1232@email.com";
    const password = "password";

    await dispatch(login(credential, password));
  };

  return (
    <Container
      sx={{
        padding: "5vw"
      }}
    >
      <form onSubmit={onLogin}>
        <Container
          maxWidth="xs"
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            border: "1px solid black",
            p: 2,
            borderRadius: 1.5,
          }}
        >
          <Typography
            variant="h1"
            m={2}
            sx={{
              // color: "primary.main",
              fontSize: "2rem",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            Log In
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Box display="flex" flexDirection="column" p={1}>
            <Typography sx={{ fontWeight: "bold", my: 0.5, px: 1 }}>
              <FormattedMessage id="email" defaultMessage="Email" />
            </Typography>
            {/* <input
            name="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          /> */}
            <TextField
              id="outlined-email-input"
              label="Enter Your Email"
              type="email"
              autoComplete="current-email"
              onChange={(e) => setEmail(e.target.value)} // Ensures state updates when user types in the email field
              size="small"
              InputProps={{ sx: { borderRadius: 1.5 } }}
              required
            />
          </Box>
          <Box display="flex" flexDirection="column" p={1}>
            <Typography sx={{ fontWeight: "bold", my: 0.5, px: 1 }}>
              <FormattedMessage id="password" defaultMessage="Password" />
            </Typography>
            {/* <input
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /> */}
            <TextField
              id="outlined-password-input"
              label="Enter Your Password"
              type="password"
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)} // Updates password state
              size="small"
              InputProps={{ sx: { borderRadius: 1.5 } }}
              required
            />
            <Button
              variant="contained"
              type="submit"
              color="primary"
              sx={{
                borderRadius: 1.5,
                mt: 2,
              }}
            >
              <FormattedMessage id="logIn" defaultMessage="Log In" />
            </Button>
            <Button
              onClick={handleDemoClick}
              type="submit"
              sx={{
                borderRadius: 1.5,
                mt: 1,
              }}
            >
              Demo
            </Button>
          </Box>
        </Container>
      </form>
    </Container>
  );
};

export default LoginForm;

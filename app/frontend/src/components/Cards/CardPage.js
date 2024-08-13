import {
  Container,
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Grid,
  Card,
} from "@mui/material";
import React, { useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { useDispatch, useSelector } from "react-redux";
import { fetchOneDeck } from "../../store/decks";

function CardPage() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { deckId } = useParams();
  const deck = useSelector((state) => state.decks.selectedDeck);
  const cards = deck?.cards?.[0]?.questionData?.jsonData || [];
  console.log(cards);

  useEffect(() => {
    dispatch(fetchOneDeck(deckId));
  }, [dispatch, deckId]);

  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        height: "100vh",
        p: 2,
      }}
    >
      <Grid container spacing={2}>
        {cards.map((card, index) => (
          <React.Fragment key={card.id}>
            {/* QUESTION CARD */}
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  width: "325px",
                  height: "450px",
                  borderRadius: "3px",
                  border: `1.5px solid ${
                    theme.palette.mode === "light" ? "#160e0e" : "#f1e9e9"
                  }`,
                }}
              >
                <Box
                  sx={{
                    backgroundColor: `${theme.palette.primary.main}`,
                    height: "300px",
                    padding: "20px",
                    overflow: "auto",
                  }}
                >
                  <h2>{card.question}</h2>
                </Box>
                <Box
                  sx={{
                    backgroundColor: `${theme.palette.background.main}`,
                    padding: "20px",
                    borderTop: `1.5px solid ${
                      theme.palette.mode === "light" ? "#160e0e" : "#f1e9e9"
                    }`,
                  }}
                >
                  <FormControl sx={{ width: "100%", overflow: "auto" }}>

                    <RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="row-radio-buttons-group"
                      sx={{ paddingTop: "15px" }}
                    >
                      {card.options.map((option, idx) => (
                        <FormControlLabel
                          key={idx}
                          value={option}
                          control={
                            <Radio sx={{ color: theme.palette.primary.main }} />
                          }
                          label={option}
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>
                </Box>
              </Card>
            </Grid>

            {/* CORRECT ANSWER */}
            {/* <Grid item xs={12} md={4}>
              <Card
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  width: "325px",
                  height: "450px",
                  borderRadius: "3px",
                  border: `1.5px solid ${
                    theme.palette.mode === "light" ? "#160e0e" : "#f1e9e9"
                  }`,
                }}
              >
                <Box
                  sx={{
                    backgroundColor: `${theme.palette.secondary.main}`,
                    height: "300px",
                    padding: "20px",
                  }}
                >
                  <h2>{card.question}</h2>
                  <FormLabel disabled>
                      <Typography sx={{ color: theme.palette.text.primary }}>
                        {card.explanation}
                      </Typography>
                    </FormLabel>
                </Box>
                <Box
                  sx={{
                    backgroundColor: `${theme.palette.background.main}`,
                    padding: "20px",
                    height: "150px",
                    borderTop: `1.5px solid ${
                      theme.palette.mode === "light" ? "#160e0e" : "#f1e9e9"
                    }`,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <CheckIcon sx={{ color: theme.palette.completion.good }} />
                    <Typography sx={{ ml: 2 }}>{card.answer}</Typography>
                  </Box>
                </Box>
              </Card>
            </Grid> */}

            {/* INCORRECT ANSWER */}
            {/* <Grid item xs={12} md={4}>
              <Card
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  width: "325px",
                  height: "450px",
                  borderRadius: "3px",
                  border: `1.5px solid ${
                    theme.palette.mode === "light" ? "#160e0e" : "#f1e9e9"
                  }`,
                }}
              >
                <Box
                  sx={{
                    backgroundColor: `${theme.palette.secondary.main}`,
                    height: "300px",
                    padding: "20px",
                  }}
                >
                  <h2>{card.question}</h2>
                </Box>
                <Box
                  sx={{
                    backgroundColor: `${theme.palette.background.main}`,
                    padding: "20px",
                    height: "150px",
                    borderTop: `1.5px solid ${
                      theme.palette.mode === "light" ? "#160e0e" : "#f1e9e9"
                    }`,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <CloseIcon sx={{ color: theme.palette.completion.poor }} />
                    <Typography sx={{ ml: 2 }}>Incorrect Answer</Typography>
                  </Box>
                  <p>
                    <span style={{ fontWeight: "bold" }}>Correct Answer:</span>{" "}
                    {card.answer}
                  </p>
                </Box>
              </Card>
            </Grid> */}
          </React.Fragment>
        ))}
      </Grid>
    </Container>
  );
}

export default CardPage;

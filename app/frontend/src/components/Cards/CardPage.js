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
import React, { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { useParams , useLocation} from "react-router-dom/cjs/react-router-dom.min";
import { useDispatch, useSelector } from "react-redux";
import { fetchOneDeck } from "../../store/decks";
import { fetchUserAttempt, modifyUserAttempt } from "../../store/attempt";

function CardPage() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { deckId } = useParams();
  const location = useLocation();
  const user = useSelector((state) => state.session.user);
  const deck = useSelector((state) => state.decks.selectedDeck);
  const cards = deck?.cards?.[0]?.questionData?.jsonData || [];
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [feedback, setFeedback] = useState({});
  //const attemptId = useSelector((state) => state.userAttempts);
  const { attemptId } = location.state || {};
  console.log("attemptId: ", attemptId);

  useEffect(() => {
    dispatch(fetchOneDeck(deckId));
  }, [dispatch, deckId, attemptId]);

  const handleAnswerChange = async (cardIndex, optionIndex, questionId) => {
    const selectedOption = cards[cardIndex].options[optionIndex];

    // Update local state
    setSelectedAnswers((prevAnswers) => ({
      ...prevAnswers,
      [cardIndex]: selectedOption,
    }));

    try {
      const checkAttempt = await dispatch(
        modifyUserAttempt(
          user.uid,
          questionId,
          attemptId,
          selectedOption,
          deckId
        )
      )
      console.log("checkAttempt: ", checkAttempt);
      // Set feedback based on the response
      if (checkAttempt.message === "Answer is correct!") {
        setFeedback({ cardIndex, isCorrect: true });
      } else if (checkAttempt.message === "Answer is incorrect.") {
          setFeedback({
              cardIndex,
              isCorrect: false,
              correctAnswer: checkAttempt.correctAnswer,
          });
      }

    } catch (error) {
      console.error("Error modifying user attempt:", error);
    }
  };

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
        {cards.map((card, cardIndex) => (
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
                      onChange={(e) => handleAnswerChange(cardIndex, parseInt(e.target.value), card.id)}
                    >
                      {card.options.map((option, optionIndex) => (
                        <FormControlLabel
                          key={optionIndex}
                          value={optionIndex} // Set the index as the value
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
            {feedback.cardIndex === cardIndex && feedback.isCorrect && (
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
                      backgroundColor: `${theme.palette.secondary.main}`,
                      height: "300px",
                      padding: "20px",
                    }}
                  >
                    <h2>{card.question}</h2>
                    <FormLabel disabled>
                      <Typography sx={{ color: theme.palette.text.primary }}>
                        Correct!
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
              </Grid>
            )}

            {/* INCORRECT ANSWER */}
            {feedback.cardIndex === cardIndex && !feedback.isCorrect && (
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
                      backgroundColor: `${theme.palette.secondary.main}`,
                      height: "300px",
                      padding: "20px",
                    }}
                  >
                    <h2>{card.question}</h2>
                    <FormLabel disabled>
                      <Typography sx={{ color: theme.palette.text.primary }}>
                        Incorrect! Correct Answer:
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
                      <CloseIcon sx={{ color: theme.palette.completion.poor }} />
                      <Typography sx={{ ml: 2 }}>{feedback.correctAnswer}</Typography>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            )}
          </React.Fragment>
        ))}
      </Grid>
    </Container>
  );
}

export default CardPage;

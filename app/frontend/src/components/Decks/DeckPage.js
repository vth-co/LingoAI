import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDecks } from "../../store/decks";
import { useParams } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  CircularProgress,
} from "@mui/material";
import { addQuestions } from "../../store/questions";
import { fetchOneTopic } from "../../store/topics";
import { NavLink } from "react-router-dom/cjs/react-router-dom.min";
import { startUserAttempt } from "../../store/attempt";

function DeckPage() {
  const dispatch = useDispatch();
  const { decks } = useSelector((state) => state.decks);
  const { topicId } = useParams();
  const topic = useSelector((state) => state.topics[topicId]); // Fetch the topic using topicId
  const user = useSelector((state) => state.session.user);
  const [loading, setLoading] = useState(false); // Add loading state

  useEffect(() => {
    if (user && topicId) {
      dispatch(fetchDecks(user.uid, topicId)); // Fetch decks with userId and topicId
      dispatch(fetchOneTopic(topicId)); // Fetch the topic name using topicId
    }
  }, [dispatch, user, topicId]);

  const handleGenerateQuestions = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true before starting the process
    try {
      await dispatch(
        addQuestions(topicId, user.native_language, user.level, user.uid)
      );
      // Fetch decks again after creating new questions
      dispatch(fetchDecks(user.uid, topicId));
    } catch (error) {
      console.log("Error generating questions:", error.message);
    } finally {
      setLoading(false); // Set loading to false after the process completes
    }
  };

  const handleStartAttempt = async (deckId) => {
    if (user && deckId) {
      try {
        await dispatch(startUserAttempt(user.uid, deckId)); // Start user attempt when a deck is clicked
      } catch (error) {
        console.log("Error starting user attempt:", error.message);
      }
    }
  };

  const getAllDecks = () => {
    return decks;
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      flexDirection="column"
      minHeight="100vh"
    >
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Check if topic is loaded before trying to access topic_name */}
          <h1>{topic ? topic.topic_name : "Loading topic..."}</h1>
          <Container>
            <Box px={30}>
              <Button
                color="primary"
                onClick={handleGenerateQuestions}
                variant="contained"
                fullWidth
                size="large"
                sx={{ height: "150px" }}
              >
                Add New Deck
              </Button>
            </Box>
            <Box display="flex" flexDirection="row" width="100%" mt={2}>
              {/* New Column */}
              <Box flex={1} p={2}>
                <Typography variant="h5" mb={2}>
                  New
                </Typography>
                {getAllDecks().length > 0 ? (
                  <Grid container spacing={2}>
                    {getAllDecks().map((deck, index) => (
                      <Grid item key={deck.id} xs={12} sm={6} md={4}>
                        <Button
                          component={NavLink}
                          to={`/decks/${deck.id}`}
                          variant="contained"
                          color="primary"
                          sx={{
                            height: "175px",
                          }}
                          onClick={() => handleStartAttempt(deck.id)} // Start user attempt when clicking the deck
                        >
                          <Typography variant="h6">{`Deck #${
                            index + 1
                          }`}</Typography>
                          <Typography variant="body1">
                            {deck.deckName}
                          </Typography>{" "}
                          {/* Update with your deck field */}
                        </Button>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Typography>No decks available</Typography>
                )}
              </Box>

              {/* Placeholder for other columns */}
              <Box flex={1} p={2}>
                <Typography variant="h5" mb={2}>
                  In Progress
                </Typography>
                <Typography>No decks available</Typography>
              </Box>

              <Box flex={1} p={2}>
                <Typography variant="h5" mb={2}>
                  Archived Decks
                </Typography>
                <Typography>No decks available</Typography>
              </Box>
            </Box>
          </Container>
        </>
      )}
    </Box>
  );
}

export default DeckPage;

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createAttemptIfNotExists, deleteStatusField, fetchDecks, resetDeckStatuses, updateDeckStatus } from "../../store/decks";
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
import { NavLink, useHistory } from "react-router-dom";
import { fetchUserAttempt, startUserAttempt } from "../../store/attempt";
import { fetchUserConcepts } from "../../store/concepts";
import { useTheme } from "@mui/material/styles";

function DeckPage() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { decks } = useSelector((state) => state.decks);
  const { conceptId, topicId } = useParams();
  const topic = useSelector((state) => state.topics[topicId]); // Fetch the topic using topicId
  const user = useSelector((state) => state.session.user);
  const [loading, setLoading] = useState(false); // Add loading state
  const concepts = Object.values(useSelector((state) => state.concepts));
  const conceptFilter = concepts.find(concept => conceptId === concept.id)
  const theme = useTheme()

  console.log('decks', decks)
  useEffect(() => {
    if (user && topicId) {
      setLoading(true);
      dispatch(fetchDecks(user.uid, topicId)).finally(() => setLoading(false));
      dispatch(fetchOneTopic(topicId));
      dispatch(fetchUserConcepts(user.uid))

    }
  }, [dispatch, user, topicId]);

  const handleGenerateQuestions = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true before starting the process
    try {
      await dispatch(
        addQuestions(conceptFilter.concept_name, topic.topic_name, user.native_language, conceptFilter.level, topicId, user.uid)
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
    try {
      // Assume you have the user ID available in the context
      const userId = user.uid; // You need to implement this based on your authentication logic

      // Create a new attempt
      const result = await dispatch(startUserAttempt(userId, deckId));
      const newAttemptId = result.payload; // Get the new attempt ID from the action payload

      // Update the deck status to indicate that it's in progress
      // await updateDeckStatus(deckId, newAttemptId);

      console.log('Attempt started successfully:', newAttemptId);
    } catch (error) {
      console.error('Error starting attempt:', error);
    }
  };


  const getAllDecks = () => {
    return decks.filter(deck => !deck.attemptId && !deck.isArchived) // Include non-archived decks
  };

  const getInProgressDecks = () => {
    return decks.filter(deck => deck.attemptId && !deck.archived);
  };

  const getArchivedDecks = () => {
    return decks.filter(deck => deck.archived);
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
          <Container sx={{
            display: "grid",
            justifyContent: "center"
          }}>
            <Box px={50}
              sx={{
                display: "flex",
                justifyContent: "center"
              }}>
              <Button
                color="primary"
                onClick={handleGenerateQuestions}
                variant="contained"


                // fullWidth
                // size="large"
                sx={{
                  borderRadius: "3px",
                  border: `1.5px solid ${theme.palette.mode === "light" ? "#160e0e" : "#f1e9e9"
                    }`,
                }}
              >
                Generate New Deck
              </Button>
            </Box>
            <Box display="flex" flexDirection="row" width="100%" mt={2} columnGap="20px">
              {/* New Column */}
              <Box flex={1} p={2}>
                <h2>
                  New
                </h2>
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
                            width: "150px",
                            height: "225px",
                            borderRadius: "3px",
                            border: `1.5px solid ${theme.palette.mode === "light" ? "#160e0e" : "#f1e9e9"
                              }`,
                          }}
                          onClick={() => handleStartAttempt(deck.id)} // Start user attempt when clicking the deck
                        >
                          <h3>{`Deck #${index + 1
                            }`}</h3>
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
                <h2>
                  In Progress
                </h2>
                {getInProgressDecks().length > 0 ? (
                  <Grid container spacing={2}>
                    {getInProgressDecks().map((deck, index) => (
                      <Grid item key={deck.id} xs={12} sm={6} md={4}>
                        <Button
                          component={NavLink}
                          to={`/decks/${deck.id}`}
                          variant="contained"
                          color="secondary"
                          sx={{
                            width: "150px",
                            height: "225px",
                            borderRadius: "3px",
                            border: `1.5px solid ${theme.palette.mode === "light" ? "#160e0e" : "#f1e9e9"
                              }`,
                          }}
                        >
                          <h3>{`Deck #${index + 1
                            }`}</h3>
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
            </Box>
            <Box>
              <Box flex={1} p={2} paddingTop="20px">
                <h2>
                  Archived Decks
                </h2>
                {getArchivedDecks().length > 0 ? (
                  <Grid container spacing={2}>
                    {getArchivedDecks().map((deck, index) => (
                      <Grid item key={deck.id} xs={12} sm={6} md={4}>
                        <Button
                          component={NavLink}
                          to={`/decks/${deck.id}`}
                          variant="contained"
                          color="divider"
                          sx={{
                            width: "150px",
                            height: "225px",
                            borderRadius: "3px",
                            border: `1.5px solid ${theme.palette.mode === "light" ? "#160e0e" : "#f1e9e9"
                              }`,
                          }}
                        >
                          <h3>{`Deck #${index + 1
                            }`}</h3>
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
            </Box>
          </Container>
        </>
      )}
    </Box>
  );
}

export default DeckPage;

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
import { NavLink, useHistory } from "react-router-dom";
import { createUserAttempt } from "../../store/attempt";
import { fetchUserConcepts } from "../../store/concepts";

function DeckPage() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { decks } = useSelector((state) => state.decks);
  const { conceptId, topicId } = useParams();
  const topic = useSelector((state) => state.topics[topicId]);
  const user = useSelector((state) => state.session.user);
  const [loading, setLoading] = useState(false);
  const concepts = Object.values(useSelector((state) => state.concepts));
  const conceptFilter = concepts.find((concept) => conceptId === concept.id);

  const decksFilter = decks?.filter((deck) => topicId === deck.topic_id);

  useEffect(() => {
    if (user && topicId) {
      setLoading(true);
      dispatch(fetchDecks(user.uid, topicId)).finally(() => setLoading(false));
      dispatch(fetchOneTopic(topicId));
      dispatch(fetchUserConcepts(user.uid));
    }
  }, [dispatch, user, topicId]);

  const handleGenerateQuestions = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await dispatch(
        addQuestions(
          conceptFilter.concept_name,
          topic.topic_name,
          user.native_language,
          conceptFilter.level,
          topicId,
          user.uid
        )
      );
      dispatch(fetchDecks(user.uid, topicId));
    } catch (error) {
      console.log("Error generating questions:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStartAttempt = async (deckId) => {
    try {
      const userId = user.uid;
      const result = await dispatch(createUserAttempt(userId, deckId));
      const newAttemptId = result.payload;
      history.push({
        pathname: `/decks/${deckId}`,
        state: { attemptId: newAttemptId },
      });
      console.log("Attempt started successfully:", newAttemptId);
    } catch (error) {
      console.error("Error starting attempt:", error);
    }
  };

  const handleResumeAttempt = (deckId, attemptId) => {
    history.push({
      pathname: `/decks/${deckId}`,
      state: { attemptId },
    });
  };

  const getAllDecks = () => {
    return decksFilter?.filter((deck) => !deck.attemptId && !deck.isArchived) || [];
  };

  const getInProgressDecks = () => {
    return decksFilter?.filter((deck) => deck.attemptId && !deck.archived) || [];
  };

  const getArchivedDecks = () => {
    return decksFilter?.filter((deck) => deck.archived) || [];
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
          <h1>{topic ? topic.topic_name : "Loading topic..."}</h1>
          <Container>
            <Box px={30}>
              <Button
                color="primary"
                onClick={handleGenerateQuestions}
                variant="contained"
                fullWidth
                size="large"
                sx={{ height: "50px" }}
              >
                Add New Deck
              </Button>
            </Box>
            <Box display="flex" flexDirection="row" width="100%" mt={2}>
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
                          onClick={() => handleStartAttempt(deck.id)}
                        >
                          <Typography variant="h6">{`Deck #${deck.deck_name}`}</Typography>
                        </Button>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Typography>No decks available</Typography>
                )}
              </Box>

              <Box flex={1} p={2}>
                <Typography variant="h5" mb={2}>
                  In Progress
                </Typography>
                {getInProgressDecks().length > 0 ? (
                  <Grid container spacing={2}>
                    {getInProgressDecks().map((deck, index) => (
                      <Grid item key={deck.id} xs={12} sm={6} md={4}>
                        <Button
                          component={NavLink}
                          to={`/decks/${deck.id}`}
                          variant="contained"
                          color="primary"
                          sx={{
                            height: "175px",
                          }}
                          onClick={() =>
                            handleResumeAttempt(deck.id, deck.attemptId)
                          }
                        >
                          <Typography variant="h6">{`Deck #${deck.deck_name}`}</Typography>
                        </Button>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Typography>No decks available</Typography>
                )}
              </Box>

              <Box flex={1} p={2}>
                <Typography variant="h5" mb={2}>
                  Archived Decks
                </Typography>
                {getArchivedDecks().length > 0 ? (
                  <Grid container spacing={2}>
                    {getArchivedDecks().map((deck, index) => (
                      <Grid item key={deck.id} xs={12} sm={6} md={4}>
                        <Button
                          component={NavLink}
                          to={`/decks/${deck.id}`}
                          variant="contained"
                          color="primary"
                          sx={{
                            height: "175px",
                          }}
                        >
                          <Typography variant="h6">{`Deck #${deck.deck_name}`}</Typography>
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

import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDecks } from "../../store/decks";
import { canGenerateDeck } from "../../services/deckService";
import { useParams } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  CircularProgress,
  Tooltip,
  Alert
} from "@mui/material";
import { addQuestions } from "../../store/questions";
import { fetchOneTopic } from "../../store/topics";
import { NavLink, useHistory } from "react-router-dom";
import { createUserAttempt } from "../../store/attempt";
import { fetchUserConcepts } from "../../store/concepts";
import { useTheme } from "@mui/material/styles";
import InfoIcon from "@mui/icons-material/Info";

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
  const getAllDecks = () => {
    return decksFilter?.filter((deck) => !deck.attemptId && !deck.archived) || [];
  };

  const getInProgressDecks = () => {
    return decksFilter?.filter((deck) => deck.attemptId && !deck.archived) || [];
  };

  const getArchivedDecks = () => {
    return decksFilter?.filter((deck) => deck.archived) || [];
  };
  const newDecks = getAllDecks().length;
  const inProgressDecks = getInProgressDecks().length;
  const theme = useTheme();
  const [canGenerate, setCanGenerate] = useState(false);
  const [message, setMessage] = useState("");
  const isDemoUser = user?.uid === "XfvjHvAySVSRdcOriaASlrnoma13";
  const [displayedArchivedDecks, setDisplayedArchivedDecks] = useState(12);
  const archivedDecks = getArchivedDecks();
  const DECKS_PER_PAGE = 12

  useEffect(() => {
    const fetchData = async () => {
      if (user && topicId) {
        setLoading(true);

        // Fetch decks
        await dispatch(fetchDecks(user.uid, topicId));

        // Fetch topic and user concepts
        dispatch(fetchOneTopic(topicId));
        dispatch(fetchUserConcepts(user.uid));

        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch, user, topicId]);

  const checkCanGenerate = useCallback(async () => {
    if (user) {

      if (newDecks >= 3 || inProgressDecks >= 3) {
        setMessage("Please review the current decks before generating another one.");
        setCanGenerate(false);
        return;
      }
      const { canGenerate, message } = await canGenerateDeck(user.uid, isDemoUser);
      setCanGenerate(canGenerate);
      if (!canGenerate) {
        setMessage(message);
      }
    }
  }, [isDemoUser, user, newDecks]);

  useEffect(() => {
    checkCanGenerate();
  }, [checkCanGenerate, topicId]);

  const handleGenerateQuestions = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const { canGenerate, message } = await canGenerateDeck(user.uid, isDemoUser);

      if (!canGenerate) {
        setMessage(message);
        setCanGenerate(false);
        return;
      }

      const result = await dispatch(
        addQuestions(
          conceptFilter.concept_name,
          topic.topic_name,
          user.native_language,
          conceptFilter.level,
          topicId,
          user.uid
        )
      );


      if (!result) {
        setMessage("Oh no! Our AI appears to be sleeping right now. Please try again later.");
        setCanGenerate(false);
        return;
      }

      checkCanGenerate();
      dispatch(fetchDecks(user.uid, topicId));

    } catch (error) {
      console.error("Error generating questions:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStartAttempt = async (deckId) => {
    try {
      const userId = user.uid;
      const result = await dispatch(createUserAttempt(userId, deckId));
      const newAttemptId = result.payload;
      history.replace({
        pathname: `/decks/${deckId}`,
        state: { attemptId: newAttemptId },
      });
      // console.log("Attempt started successfully:", newAttemptId);
    } catch (error) {
      console.error("Error starting attempt:", error);
    }
  };

  const handleShowMore = () => {
    setDisplayedArchivedDecks((prev) => prev + DECKS_PER_PAGE);
  }

  return (
    <Box
      display="flex"
      alignItems="center"
      flexDirection="column"
      minHeight="100vh"
      px={2} // Added padding for mobile
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
          <h1 style={{ textAlign: "center", marginBottom: 0 }}>{topic ? topic.topic_name : "Loading topic..."}</h1>
          <h3 style={{ textAlign: "center", marginTop: 0 }}>{conceptFilter?.level}</h3>
          <Container sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <Box
              sx={{
                display: "grid",
                justifyContent: "center",
                justifyItems: "center",
                mb: 2, // margin bottom
                rowGap: "15px"
              }}
            >
              <Button
                color="primary"
                onClick={handleGenerateQuestions}
                variant="contained"
                sx={{
                  borderRadius: "3px",
                  border: `1.5px solid ${theme.palette.mode === "light" ? "#160e0e" : "#f1e9e9"
                    }`,
                  width: { xs: "100%", sm: "fit-content" }, // Full width on mobile
                }}
                disabled={!canGenerate}
              >
                Generate New Deck
              </Button>
              {message && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {message}
                </Alert>
              )}
            </Box>
            <Grid container spacing={2} justifyContent="center" paddingTop="20px">
              <Grid item xs={12} sm={12} md={6}>
                <h2>
                  New
                  <Tooltip
                    title={
                      <Typography>Newly generated decks</Typography>
                    }
                    arrow
                  >
                    <InfoIcon color="action" sx={{ fontSize: 16 }} />
                  </Tooltip>
                </h2>
                {getAllDecks().length > 0 ? (
                  <Grid container spacing={2} justifyContent="center">
                    <Grid item xs={12} md={6}>
                      <Box
                        sx={{
                          // display: "flex",
                          // flexDirection: "row",
                          // flexWrap: "wrap",
                          // justifyContent: "space-between",
                          // gap: 2,
                          display: "grid",
                          gridTemplateColumns: {
                            xs: "repeat(2, 1fr)",
                            sm: "repeat(3, 1fr)",
                          },
                          gap: 2,
                          justifyContent: "center",
                        }}
                      >
                        {getAllDecks().map((deck) => (
                          <Box key={deck.id} sx={{ margin: 1 }}>
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
                              onClick={() => handleStartAttempt(deck.id)}
                            >
                              <h3>
                                {`Deck ${deck.deck_name}`}
                              </h3>
                            </Button>
                          </Box>
                        ))}
                      </Box>
                    </Grid>
                  </Grid>
                ) : (
                  <Typography>You currently do not have any new decks.</Typography>
                )}
              </Grid>

              <Grid item xs={12} sm={12} md={6}>
                <h2>
                  In Progress
                  <Tooltip
                    title={
                      <Typography>Previously generated decks that have been viewed at least once</Typography>
                    }
                    arrow
                  >
                    <InfoIcon color="action" sx={{ fontSize: 16 }} />
                  </Tooltip>
                </h2>
                {getInProgressDecks().length > 0 ? (
                  <Grid container spacing={2} justifyContent="center">
                    <Grid item xs={12}>
                      <Box
                        sx={{
                          // display: "flex",
                          // flexDirection: "row",
                          // flexWrap: "wrap",
                          // justifyContent: "flex-start",
                          // gap: 2,
                          display: "grid",
                          gridTemplateColumns: {
                            xs: "repeat(2, 1fr)",
                            sm: "repeat(3, 1fr)",
                          },
                          gap: 2,
                          justifyContent: "center",
                        }}
                      >
                        {getInProgressDecks().map((deck) => (
                          <Box key={deck.id} sx={{ margin: 1 }}>
                            <Button
                              component={NavLink}
                              to={{
                                pathname: `/decks/${deck.id}`,
                                state: { attemptId: deck.attemptId }
                              }}
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
                              <h3>
                                {`Deck ${deck.deck_name}`}
                              </h3>
                            </Button>
                          </Box>
                        ))}
                      </Box>
                    </Grid>
                  </Grid>
                ) : (
                  <Typography>You currently do not have any decks in progress.</Typography>
                )}
              </Grid>
            </Grid>

            <Box mt={4}>
              <h2>
                Archived
                <Tooltip
                  title={
                    <Typography>Completed decks</Typography>
                  }
                  arrow
                >
                  <InfoIcon color="action" sx={{ mt: -1, fontSize: 16 }} />
                </Tooltip>
              </h2>
              {archivedDecks.length > 0 ? (
                <Grid container spacing={2} justifyContent="center">
                  <Grid item xs={12} md={12}>
                    <Box
                      sx={{
                        // display: "flex",
                        // flexDirection: "row",
                        // flexWrap: "wrap",
                        // justifyContent: "space-between",
                        // gap: 2,
                        display: "grid",
                        gridTemplateColumns: {
                          xs: "repeat(2, 1fr)",
                          sm: "repeat(4, 1fr)",
                          md: "repeat(5, 1fr)",
                          lg: "repeat(6, 1fr)",
                        },
                        gap: 2,
                        justifyContent: "center",
                      }}
                    >
                      {archivedDecks.slice(0, displayedArchivedDecks).map((deck) => (
                        <Box key={deck.id} sx={{ margin: 1 }}>
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
                            <h3>
                              {`Deck ${deck.deck_name}`}
                            </h3>
                          </Button>
                        </Box>
                      ))}
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center", // Centers the button horizontally
                        mt: 2, // Add top margin if needed
                      }}
                    >
                      {displayedArchivedDecks < archivedDecks.length && (
                        <Button
                          onClick={handleShowMore}
                          variant="outlined"
                          sx={{ mt: 2 }}
                        >
                          Show More
                        </Button>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              ) : (
                <Typography>You currently do not have any archived decks.</Typography>
              )}
            </Box>
          </Container>
        </>
      )
      }
    </Box >
  );
}

export default DeckPage;

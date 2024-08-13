import {
  Box,
  Button,
  Container,
  Grid,
  LinearProgress,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchOneConcept, fetchTopicsByConcept } from "../store/concepts";
import { NavLink } from "react-router-dom";
import { fetchUserProgress } from '../store/users';
import { useTheme } from "@emotion/react";

function TopicsPage() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user)
  const userId = user.uid
  const { conceptId } = useParams();
  const [loading, setLoading] = useState(true);
  const concept = useSelector((state) => state.concepts.concepts[conceptId]);
  const topics = useSelector(
    (state) => state.concepts.topics[conceptId]?.topics || []
  );
  const progressState = useSelector((state) => state.users.progress);
  const progress = progressState && Object.values(progressState)
  const theme = useTheme()
  const currentConcept = progress?.[0].concepts.find(concept =>
    conceptId === concept.id
  );
  console.log("Progress", progressState);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await dispatch(fetchOneConcept(conceptId));
      await dispatch(fetchTopicsByConcept(conceptId));
      await dispatch(fetchUserProgress(userId))
      setLoading(false);
    };

    fetchData();
  }, [dispatch, conceptId, userId]);

  return (
    <Container>
      <Box>
        <Box display="flex" flexDirection="column" alignItems="center">
          <h1>Select a {concept?.concept_name} Topic</h1>
          <p>
            Select any topic to begin. In order to pass a topic, you must score
            at least 80% three times.
          </p>
          {currentConcept?.topics_passed_fraction * 100 === 100 ? (<p>Congratulations! You've completed this concept.</p>) : (<p>Pass all the topics to unlock the next concept.</p>)}
        </Box>
        <Box px={50}>
          <LinearProgress
            variant="determinate"
            value={currentConcept?.topics_passed_fraction * 100}
            sx={{ height: 25 }}
          // color='divider'
          />
        </Box>
      </Box>
      {topics.length > 0 ? (
        <Grid container spacing={10} justifyContent='center' py={5}>
          {topics.map(topic => (
            <Grid item key={topic.id}>
              <Button component={NavLink} to={`/topics/${topic.id}`}
                sx={{
                  backgroundColor: `${theme.palette.primary.main}`,
                  color: `${theme.palette.text.main}`,
                }}>
                <Box display='flex' flexDirection='column'
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignContent: "center",
                    padding: "10px 20px",
                    width: "400px",
                    height: "200px"
                  }}>
                  <Box
                    sx={{
                      height: "125px"
                    }}>
                    <h3>{topic.topic_name}</h3>
                  </Box>
                  <p>{topic.description}</p>
                  <LinearProgress
                    variant='determinate'
                    value={50}
                    sx={{ height: 15 }}
                    color='secondary'
                  />
                </Box>
              </Button>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography textAlign="center" paddingTop="40px">No topics found.</Typography>
      )}
    </Container>
  );
}

export default TopicsPage;

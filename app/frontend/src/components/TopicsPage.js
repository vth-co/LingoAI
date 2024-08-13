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

  const progress = Object.values(useSelector((state) => state.users.progress));

  console.log("progress", progress);

  const currentConcept = progress?.[0].concepts.find(concept =>
    conceptId === concept.id
  );

  let topicsPassed = 0;
  let totalTopics = currentConcept?.topics.length

  currentConcept?.topics.map(topic => {
    if (topic.status === true) topicsPassed++
  })

  const conceptBarProgress = (topicsPassed / totalTopics) * 100

  console.log(progress);

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
          <p>Pass all the topics to unlock the next concept.</p>
        </Box>
        <Box px={50}>
          <LinearProgress
            variant="determinate"
            value={conceptBarProgress}
            sx={{ height: 25 }}
          />
        </Box>
      </Box>
      {topics.length > 0 ? (
        <Grid container spacing={10} justifyContent='center' py={5}>
          {topics.map(topic => (
            <Grid item key={topic.id}>
              <Button component={NavLink} to={`/topics/${topic.id}`}>
                <Box display='flex' flexDirection='column'
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignContent: "center",
                    padding: "10px 20px",
                    width: "200px",
                    height: "200px"
                  }}>
                  <Box
                    sx={{
                      height: "158px"
                    }}>
                    <h3>{topic.topic_name}</h3>
                  </Box>
                  <LinearProgress
                    variant='determinate'
                    value={50}
                    sx={{ height: 15 }}
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

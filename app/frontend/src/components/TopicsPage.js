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
import CheckIcon from '@mui/icons-material/Check';

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
  const currentConcept = progress?.[0]?.concepts?.find(concept =>
    conceptId === concept.id
  );

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

  console.log(currentConcept);
  const combinedTopics = currentConcept?.topics?.map(topic => {
    const progressData = topics.find(p => topic.id === p.id)
    return {
      ...topic,
      topic_name: progressData?.topic_name,
      description: progressData?.description
    }
  })

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

      <Grid container spacing={10} justifyContent='center' py={5}>
        {combinedTopics?.map(topic => (
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
                  padding: "0px 20px",
                  width: "400px",
                  height: "200px"
                }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    alignSelf: "start",
                    height: "80px"
                  }}>
                  <h3>{topic.topic_name}</h3>
                  {topic.passes === 3 && <CheckIcon sx={{
                    ml: 1,
                    color: `${theme.palette.completion.good}`,
                  }} />}
                </Box>
                <Box
                  sx={{
                    height: "80px"
                  }}>
                  {topic.description ? (<p>{topic.description}</p>) : (<p>&nbsp;</p>)}
                </Box>
                <LinearProgress
                  variant='determinate'
                  value={(topic.passes / 3) * 100}
                  sx={{ height: 15 }}
                  color='secondary'
                />
              </Box>
            </Button>
          </Grid>
        ))}
      </Grid>

    </Container>
  );
}

export default TopicsPage;

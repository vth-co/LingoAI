import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Box, Button, Container, Grid, LinearProgress } from '@mui/material'
import { NavLink } from "react-router-dom";
import { fetchConcepts } from '../store/concepts';
import { fetchUserProgress } from '../store/users';
import { useTheme } from '@emotion/react';
import LockIcon from '@mui/icons-material/Lock';

function ConceptPage() {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.session.user)
  const progressState = useSelector((state) => state.users.progress);
  const progress = progressState && Object.values(progressState)
  const concepts = Object.values(useSelector((state) => state.concepts.concepts));
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await dispatch(fetchConcepts(user.current_level));
      await dispatch(fetchUserProgress(user.uid))
      setLoading(false);
    };

    fetchData();
  }, [dispatch]);

  const combinedConcepts = concepts.map(concept => {
    const progressData = progress?.[0].concepts.find(p => p.id === concept.id);

    return {
      ...concept,
      progress: progressData?.status
    };
  });

  const sortedConcepts = combinedConcepts.sort((a, b) => b.concept_name.localeCompare(a.concept_name));

  const currentConcepts = progress?.[0].concepts.filter(concept =>
    concept.level == user.current_level
  );

  let conceptCount = 0;

  currentConcepts?.map(concept => {
    if (concept.status === true) conceptCount++
  })

  let conceptPercentage = (conceptCount / currentConcepts?.length) * 100

  if (loading) {
    return <LinearProgress />;
  }

  return (
    <Container>
      <Box>
        <Box display='flex' flexDirection='column' alignItems='center'>
          <h1>Select a {user.current_level} Concept</h1>
          <p>
            These are the recommended concepts based on your current
            proficiency level.
          </p>
          {conceptPercentage === 100 ? (
            <p>Congratulations! You've earned the Lingo.ai {user.current_level} Champion Badge.</p>
          ) : (
            user.level !== "Advanced" ? (<p>Pass all the concepts to unlock the next proficiency level.</p>)
              : (<p>Pass all the concepts to get your Lingo.ai Advanced Champion Badge.</p>)
          )}
        </Box>
        <Box px={50}>
          <LinearProgress
            variant='determinate'
            value={conceptPercentage}
            sx={{
              height: 25,
            }}
            color='secondary'
          />
        </Box>
      </Box>

      <Grid container justifyContent='center' py={5} spacing={5}>
        {sortedConcepts?.map(concept => (
          concept.progress === true || concept.concept_name === "Vocabulary" ? (
            <Grid item key={concept.id}>
              <Button component={NavLink} to={`/concepts/${concept.id}`}
                sx={{
                  backgroundColor: `${theme.palette.secondary.main}`,
                  color: `${theme.palette.secondary.contrastText}`,
                }}>
                <Box display='flex' flexDirection='column'
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignContent: "center",
                    padding: "10px 20px",
                    width: "200px",
                    height: "200px",
                  }}>
                  <Box
                    sx={{
                      height: "100px"
                    }}>
                    <h3>{concept.concept_name}</h3>
                  </Box>
                  <p>{concept.level}</p>
                  <LinearProgress
                    variant='determinate'
                    value={50}
                    sx={{ height: 15 }}
                    color='divider'
                  />
                </Box>
              </Button>
            </Grid>
          ) : (
            <Grid item key={concept.id}>
              <Button sx={{
                textAlign: "left",
                // backgroundColor: `${theme.palette.text.disabled}`,
                color: `${theme.palette.text.disabled}`,
                "&:hover": {
                  cursor: "default",
                },
              }}>
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
                      height: "100px"
                    }}>
                    <h3>{concept.concept_name}</h3>
                  </Box>
                  <p>{concept.level}</p>
                  <LinearProgress
                    variant='determinate'
                    value={0}
                    sx={{
                      height: 15
                    }}
                    color="text"
                  />
                </Box>
                <LockIcon sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  color: `${theme.palette.text.secondary}`,
                }} />
              </Button>
            </Grid>
          )))}
      </Grid>

      {/* <Grid container spacing={10} justifyContent='center' py={5}>
        {concepts.map(concept => (
          <Grid item key={concept.id}>
            <Button component={NavLink} to={`/concepts/${concept.id}`}>
              <Box display='flex' flexDirection='column' width="200px">
                <h3>{concept.concept_name}</h3> <p>{concept.level}</p>{' '}
                <LinearProgress
                  variant='determinate'
                  value={50}
                  sx={{ height: 15 }}
                />
              </Box>
            </Button>
          </Grid>
        ))}
      </Grid> */}
    </Container>
  )
}

export default ConceptPage

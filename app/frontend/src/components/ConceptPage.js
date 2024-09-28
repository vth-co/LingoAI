import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Box, Button, Container, Grid, LinearProgress, Collapse, IconButton, Divider, Typography } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { NavLink } from "react-router-dom";
import { fetchUserConcepts } from '../store/concepts';
import { useTheme } from '@emotion/react';
import LockIcon from '@mui/icons-material/Lock';
import BeginnerConcepts from './ConceptsPage-Beginner';
import IntermediateConcepts from './ConceptsPage-Intermediate';

function ConceptPage() {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.session.user)
  const concepts = Object.values(useSelector((state) => state.concepts));
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const [showBeginner, setShowBeginner] = useState(false);
  const [showIntermediate, setShowIntermediate] = useState(false);

  const handleBeginnerToggle = () => {
    setShowBeginner(!showBeginner);
  };

  const handleIntermediateToggle = () => {
    setShowIntermediate(!showIntermediate);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await dispatch(fetchUserConcepts(user?.uid));
      setLoading(false);
    };

    fetchData();
  }, [dispatch, user.uid]);

  const currentConcepts = concepts.filter(concept =>
    concept.level === user.level
  ).sort((a, b) => b.concept_name.localeCompare(a.concept_name));

  let conceptCount = 0;
  let topicsCount = 0;
  let passedConcepts = 0;

  currentConcepts?.forEach(concept => {
    if (concept.status === true) conceptCount++;
    concept.topics.forEach(topic => {
      if (topic.passes === 3) topicsCount++;
    });
  });

  if (topicsCount === 4) passedConcepts = 1;

  let conceptPercentage = (conceptCount / currentConcepts?.length) * 100;

  if (loading) {
    return <LinearProgress />;
  }

  let previousConceptPassed = true;

  return (
    <Container>
      <Box>
        <Box display='flex' flexDirection='column' alignItems='center' textAlign="center">
          <Typography variant="h1">Select {user.level} Concept</Typography>
          <p>These are the recommended concepts based on your current proficiency level.</p>
          {conceptPercentage === 100 ? (
            <p>Congratulations! You've earned the Lingo.ai {user.level} Champion Badge.</p>
          ) : (
            user.level !== "Advanced" ? (
              <p>Pass all the concepts to unlock the next proficiency level.</p>
            ) : (
              <p>Pass all the concepts to get your Lingo.ai Advanced Champion Badge.</p>
            )
          )}
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <Box sx={{ position: 'relative', display: 'inline-flex', width: '75%', margin: 'auto' }}>
            <LinearProgress
              variant="determinate"
              value={conceptPercentage}
              sx={{ height: 25, width: '100%', borderRadius: '3px' }}
              color='secondary'
            />
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography fontSize="small" fontWeight="bold" color="textSecondary">{`${Math.round(conceptPercentage)}%`}</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      <Grid container
        sx={{
          display: 'grid',
          justifyContent: 'center',
          gridTemplateColumns: {
            xs: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)"
          },
          gap: "20px",
          padding: "40px 0px"
        }}
      >
        {currentConcepts?.map(concept => {
          const isConceptUnlocked = previousConceptPassed || concept.concept_name === "Vocabulary";
          previousConceptPassed = concept.status;

          return (
            <Grid item key={concept.id}
            // xs={12} // Full width on extra small screens
            // sm={6}  // Half width on small screens
            // md={4}  // One-third width on medium screens
            // sx={{ padding: 0 }}
            >
              <Button
                component={NavLink}
                to={isConceptUnlocked ? `/concepts/${concept.id}` : "#"}
                sx={{
                  backgroundColor: isConceptUnlocked ? `${theme.palette.secondary.main}` : `${theme.palette.text.disabled}`,
                  color: isConceptUnlocked ? `${theme.palette.secondary.contrastText}` : `${theme.palette.text.disabled}`,
                  cursor: isConceptUnlocked ? 'pointer' : 'default',
                  width: '100%',
                  display: 'block',
                  padding: 0,
                }}
                disabled={!isConceptUnlocked}
              >
                <Box display='flex' flexDirection='column'
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignContent: "center",
                    padding: "10px 20px 0px 20px",
                    width: "100%",
                    height: "200px",
                  }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "start",
                      height: "80px"
                    }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "flex-end",
                        alignSelf: "center",
                        // height: "80px"
                      }}>
                      <Typography variant="h3">{concept.concept_name}</Typography>

                    </Box>
                  </Box>
                  <Box
                    sx={{
                      height: "100%",
                      display: "grid",
                      alignItems: "flex-end",
                      paddingBottom: "17px"
                    }}>
                    <p>{concept.level}</p>
                    <Box sx={{ position: 'relative', display: 'inline-flex', width: '100%', margin: 'auto' }}>
                      <LinearProgress
                        variant="determinate"
                        value={concept.topicsPassed * 100}
                        sx={{ height: 25, width: '100%', borderRadius: '3px' }}
                        color='divider'
                      />
                      <Box
                        sx={{
                          top: 0,
                          left: 0,
                          bottom: 0,
                          right: 0,
                          position: 'absolute',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Typography fontSize="small" fontWeight="bold" color="textSecondary">{`${Math.round(concept.topicsPassed * 100)}%`}</Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
                {!isConceptUnlocked && (
                  <LockIcon sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    color: `${theme.palette.text.secondary}`,
                  }} />
                )}
              </Button>
            </Grid>
          )
        })}
      </Grid>
      {(user?.level === "Intermediate" || user?.level === "Advanced") && (
        <>
          <Divider />
          <Box>
            <Typography variant="h2" sx={{ textAlign: "center", padding: "20px 0" }}>Available Concept Levels</Typography>
            {user?.level === "Advanced" && (
              <>
                <Box display="flex" alignItems="center" onClick={handleIntermediateToggle} sx={{ cursor: 'pointer' }}>
                  <Box>
                    <Typography variant="h3" sx={{ padding: "20px 0" }}>Intermediate</Typography>
                  </Box>
                  <IconButton size="small">
                    <ExpandMoreIcon />
                  </IconButton>
                </Box>
                <Collapse in={showIntermediate}>
                  <Box>
                    <IntermediateConcepts user={user} concepts={concepts} />
                  </Box>
                </Collapse>
              </>
            )}
            <Box display="flex" alignItems="center" onClick={handleBeginnerToggle} sx={{ cursor: 'pointer' }}>
              <Box>
                <Typography variant="h3" sx={{ padding: "20px 0" }}>Beginner</Typography>
              </Box>
              <IconButton size="small">
                <ExpandMoreIcon />
              </IconButton>
            </Box>
            <Collapse in={showBeginner}>
              <Box>
                <BeginnerConcepts user={user} concepts={concepts} />
              </Box>
            </Collapse>
          </Box>
        </>
      )}
    </Container>
  )
}

export default ConceptPage;

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Button, Container, Grid, LinearProgress } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { fetchConcepts } from '../store/concepts';

function ConceptPage() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const concepts = Object.values(useSelector((state) => state.concepts.concepts));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await dispatch(fetchConcepts(user.level));
      setLoading(false);
    };

    fetchData();
  }, [dispatch, user.level]);

  if (loading) {
    return <LinearProgress />;
  }

  return (
    <Container>
      <Box>
        <Box display='flex' flexDirection='column' alignItems='center'>
          <h1>Select a {user.level} Concept</h1>
          <p>
            These are the recommended concepts based on your current
            proficiency level.
          </p>
          {user.level !== "Advanced" ? (
            <p>Pass all the concepts to unlock the next proficiency level.</p>
          ) : (
            <p>Pass all the concepts to get your Lingo.ai Advanced Champion badge.</p>
          )}
        </Box>
        <Box px={50}>
          <LinearProgress
            variant='determinate'
            value={50}
            sx={{ height: 25 }}
          />
        </Box>
      </Box>

      <Grid container spacing={10} justifyContent='center' py={5}>
        {concepts.map((concept) => (
          <Grid item key={concept.id}>
            <Button
              component={NavLink}
              to={`/concepts/${concept.id}`}
              sx={{
                backgroundColor: 'primary.main',
                color: 'text.primary',
                '&:hover': {
                  backgroundColor: 'primary.dark', // Darker shade on hover
                },
              }}
            >
              <Box display='flex' flexDirection='column' width='200px'>
                <h3>{concept.concept_name}</h3>
                <p>{concept.level}</p>
                <LinearProgress
                  variant='determinate'
                  color='text'
                  value={50}
                  sx={{ height: 15 }}
                />
              </Box>
            </Button>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default ConceptPage;

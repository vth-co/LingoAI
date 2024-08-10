import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchConcepts } from '../store/actions/conceptsActions'
import { Box, Button, Container, Grid, LinearProgress, Link } from '@mui/material'


function ConceptPage() {
  const dispatch = useDispatch()
  const concepts = Object.values(useSelector(state => state.concepts))

  useEffect(() => {
    dispatch(fetchConcepts())
  }, [dispatch])

  return (
    <Container>
      <Box>
        <Box display='flex' flexDirection='column' alignItems='center'>
          <h1>Select a Beginner Concept</h1>
          <p>
            These are the recommended concepts based on your selected
            proficiency level.
          </p>
          <p>Pass all the concepts to unlock the next proficiency level.</p>
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
        {concepts.map(concept => (
          <Grid item key={concept.id}>
            <Button>
              <Link href={`${concept.id}/topics`}>
                <Box display='flex' flexDirection='column'>
                  <p>{concept.concept_name}</p> <p>{concept.level}</p>{' '}
                  <LinearProgress
                    variant='determinate'
                    value={50}
                    sx={{ height: 15 }}
                  />
                </Box>
              </Link>
            </Button>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}

export default ConceptPage

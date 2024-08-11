import { Box, Button, Container, Grid, LinearProgress, Link, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from 'react-router-dom';
import { fetchTopicsbyConcept, fetchOneConcept } from "../store/actions/conceptsActions";
import { NavLink } from "react-router-dom";

function TopicsPage() {
    const dispatch = useDispatch();
    const conceptId = useParams()
    const concept = useSelector(state => state.concepts.concept)
    const topics = useSelector(state => state.concepts.topics)
    console.log(concept)


    useEffect(() => {
        dispatch(fetchOneConcept(conceptId.conceptId))
        dispatch(fetchTopicsbyConcept(conceptId.conceptId))
    }, [dispatch, conceptId])

    return (
        <Container>
            <Box>
                <Box display="flex" flexDirection="column" alignItems="center">
                    <h1>Select a {concept?.concept_name} Topic</h1>
                    <p>
                        Select any topic to begin. In order to pass a topic, you must score at least 80% three times.
                    </p>

                    <p>Pass all the topics to unlock the next concept.</p>
                </Box>
                <Box px={50}>
                    <LinearProgress
                        variant="determinate"
                        value={50}
                        sx={{ height: 25 }}
                    />
                </Box>
            </Box>

            {topics.length > 0 ? (
                <Grid container spacing={10} justifyContent='center' py={5}>
                    {topics.map(topic => (
                        <Grid item key={topic.id}>
                            <Button component={NavLink} to={`/topics/${topic.id}`}>
                                <Box display='flex' flexDirection='column' width="200px">
                                    <h3>{topic.topic_name}</h3> <p>EXPLANATION</p>{' '}
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

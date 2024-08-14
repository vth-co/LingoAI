import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Box, Button, Container, Grid, LinearProgress } from '@mui/material'
import { NavLink } from "react-router-dom";
import { fetchConcepts } from '../store/concepts';
import { fetchUserProgress } from '../store/users';
import { useTheme } from '@emotion/react';
import CheckIcon from '@mui/icons-material/Check';

function IntermediateConcepts({ user, progress }) {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(true);
    const theme = useTheme();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await dispatch(fetchConcepts("Intermediate"));
            await dispatch(fetchUserProgress(user.uid));
            setLoading(false);
        };

        fetchData();
    }, [dispatch, user.uid]);

    // const combinedConcepts = concepts.map(concept => {
    //     const progressData = progress?.[0].concepts.find(p => p.id === concept.id);

    //     return {
    //         ...concept,
    //         progress: progressData?.status
    //     };
    // });

    // console.log("concepts", combinedConcepts);
    // const sortedConcepts = combinedConcepts.sort((a, b) => b.concept_name.localeCompare(a.concept_name));

    const currentConcepts = progress?.[0].concepts.filter(concept =>
        concept.level === user.level
    );

    let conceptCount = 0;

    currentConcepts?.map(concept => {
        if (concept.status === true) conceptCount++
        return conceptCount
    })

    let conceptPercentage = (conceptCount / currentConcepts?.length) * 100

    if (loading) {
        return <LinearProgress />;
    }

    return (
        <Container>
            <Box>
                <Box display='flex' flexDirection='column' alignItems='center'>
                    {conceptPercentage === 100 ? (
                        <p>Congratulations! You've earned the Lingo.ai Intermediate Champion Badge.</p>
                    ) : (<p>Pass all the concepts to get your Lingo.ai Intermediate Champion Badge.</p>)
                    }
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
                {currentConcepts?.map(concept => (
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
                                    width: "400px",
                                    height: "200px",
                                }}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "start",
                                        height: "100px"
                                    }}>
                                    <Box
                                        sx={{
                                            width: "fit-content",
                                            display: "flex",
                                            alignItems: "center"
                                        }}>

                                        <h3>{concept.concept_name}</h3>
                                        {concept.progress === true &&
                                            <CheckIcon sx={{
                                                ml: 1,
                                                color: `${theme.palette.completion.good}`,
                                            }} />
                                        }
                                    </Box>
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

                ))}
            </Grid>
        </Container >
    )
}

export default IntermediateConcepts

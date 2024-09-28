import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Box, Button, Container, Grid, LinearProgress, Typography } from '@mui/material'
import { NavLink } from "react-router-dom";
import { fetchUserConcepts } from '../store/concepts';
import { fetchUserProgress } from '../store/users';
import { useTheme } from '@emotion/react';
// import CheckIcon from '@mui/icons-material/Check';
import LockIcon from '@mui/icons-material/Lock';

function BeginnerConcepts({ user, concepts }) {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(true);
    const theme = useTheme();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await dispatch(fetchUserConcepts(user.uid));
            // await dispatch(fetchUserProgress(user.uid))
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

    // const sortedConcepts = combinedConcepts.sort((a, b) => b.concept_name.localeCompare(a.concept_name));

    const currentConcepts = concepts?.filter(concept =>
        concept.level === "Beginner"
    ).sort((a, b) => b.concept_name.localeCompare(a.concept_name));

    let conceptCount = 0;

    currentConcepts?.map(concept => {
        if (concept.status === true) conceptCount++
        return conceptCount
    })

    let conceptPercentage = (conceptCount / currentConcepts?.length) * 100

    if (loading) {
        return <LinearProgress />;
    }
    let previousConceptPassed = true;

    return (
        <Container disableGutters>
            <Box>
                <Box display='flex' flexDirection='column' alignItems='center'>
                    {conceptPercentage === 100 ? (
                        <p>Congratulations! You've earned the Lingo.ai Beginner Champion Badge.</p>
                    ) : (<p>Pass all the beginner concepts to get your Lingo.ai Beginner Champion Badge.</p>)
                    }
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
        </Container >
    )
}

export default BeginnerConcepts

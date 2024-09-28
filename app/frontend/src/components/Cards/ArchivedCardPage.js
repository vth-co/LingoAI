import {
    Container,
    Box,
    Typography,
    FormLabel,
    Grid,
    Card,
    LinearProgress
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import {
    useParams,
    useLocation,
} from "react-router-dom/cjs/react-router-dom.min";
import { useDispatch, useSelector } from "react-redux";
import { fetchOneDeck, archiveDeck } from "../../store/decks";
import { fetchUserAttempt, modifyUserAttempt } from "../../store/attempt";

function ArchivedCardPage() {
    const dispatch = useDispatch();
    const theme = useTheme();
    const { deckId } = useParams();
    const location = useLocation();
    const deck = useSelector((state) => state.decks.selectedDeck);
    const cards = deck?.cards?.[0]?.questionData?.jsonData || [];
    //const attemptId = useSelector((state) => state.userAttempts);
    const { attemptId } = location.state || {};
    const topicName = deck?.cards?.[0]?.questionData?.topic;
    const topicLevel = deck?.level;
    const [loading, setLoading] = useState(false);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         setLoading(true)
    //         await dispatch(fetchOneDeck(deckId));
    //         setTimeout(() => {
    //             setLoading(false);
    //         }, 500);
    //     }
    //     fetchData();

    // }, [dispatch, deckId, attemptId]);

    useEffect(() => {
        let isMounted = true; // Track whether the component is still mounted

        const fetchData = async () => {
            setLoading(true);
            await dispatch(fetchOneDeck(deckId));

            if (isMounted) { // Only update state if the component is still mounted
                setLoading(false);
            }
        }

        fetchData();

        return () => {
            isMounted = false; // Mark as unmounted when the component unmounts
        };
    }, [dispatch, deckId, attemptId]);


    if (loading) {
        return <LinearProgress />;
    }

    return (
        <Container
            sx={{
                padding: "0 5vw 0 5vw"
            }}
        >
            <Typography variant="h1" sx={{ textAlign: "center" }}>{topicName}</Typography>
            <Typography variant="h3" sx={{ textAlign: "center" }}>{topicLevel}</Typography>
            <Container
                sx={{
                    justifyContent: "center",
                    minHeight: "100vh",
                    p: 2,
                }}
            >
                <Grid container spacing={2}
                    justifyContent="center"
                    alignItems="center"
                    sx={{
                        flexWrap: { md: "nowrap" }
                    }}>
                    {cards.map((card) => (
                        <React.Fragment key={card.id}>
                            <Grid item container justifyContent="center" alignItems="center">
                                <Card
                                    key={card.id}
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        width: "300px",
                                        height: "450px",
                                        borderRadius: "3px",
                                        border: `1.5px solid ${theme.palette.mode === "light" ? "#160e0e" : "#f1e9e9"}`,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            backgroundColor: `${theme.palette.divider.main}`,
                                            // width: "300px",
                                            height: "300px",
                                            padding: "20px",
                                            overflow: "auto",
                                        }}
                                    >
                                        <Typography variant="h2">{card.question}</Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            backgroundColor: `${theme.palette.background.main}`,
                                            height: "150px",
                                            // padding: "20px",
                                            borderTop: `1.5px solid ${theme.palette.mode === "light" ? "#160e0e" : "#f1e9e9"}`,
                                            overflow: "auto",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            flexDirection: "column",
                                            alignItems: "stretch",
                                        }}
                                    >
                                        <Box sx={{
                                            display: "grid",
                                            overflowY: "auto",
                                            padding: "20px",
                                            rowGap: "10px"
                                        }}>

                                            <Typography><span style={{ fontWeight: "bold" }}>Answer:</span> {card.answer}</Typography>
                                            <Typography><span style={{ fontWeight: "bold" }}>Explanation:</span> {card.explanation}</Typography>
                                        </Box>
                                    </Box>
                                </Card>
                            </Grid>
                        </React.Fragment>
                    ))}
                </Grid>
            </Container>
        </Container>

    );
}

export default ArchivedCardPage;

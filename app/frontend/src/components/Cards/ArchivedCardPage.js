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

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            await dispatch(fetchOneDeck(deckId));
            setTimeout(() => {
                setLoading(false);
            }, 500);
        }
        fetchData();

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
            <h1 style={{ textAlign: "center", marginBottom: 0 }}>{topicName}</h1>
            <h3 style={{ textAlign: "center", marginTop: 0 }}>{topicLevel}</h3>
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
                                            backgroundColor: `${theme.palette.secondary.main}`,
                                            width: "300px",
                                            height: "300px",
                                            padding: "20px",
                                            overflow: "auto",
                                        }}
                                    >
                                        <h2 style={{ margin: "0" }}>{card.question}</h2>
                                        <FormLabel disabled>
                                            <Typography
                                                sx={{ color: theme.palette.text.primary, mt: 2 }}
                                            >
                                                {card.explanation}
                                            </Typography>
                                        </FormLabel>
                                    </Box>
                                    <Box
                                        sx={{
                                            backgroundColor: `${theme.palette.background.main}`,
                                            width: "300px",
                                            height: "150px",
                                            padding: "20px",
                                            boxSizing: "border-box",
                                            borderTop: `1.5px solid ${theme.palette.mode === "light" ? "#160e0e" : "#f1e9e9"}`,
                                            display: "flex",
                                            alignItems: "flex-start",
                                            justifyContent: "flex-start",
                                            flexDirection: "column",
                                            overflow: "hidden",
                                        }}
                                    >
                                        <Box sx={{
                                            display: "flex",
                                            alignItems: "flex-start",
                                            justifyContent: "flex-start",
                                            height: "110px",
                                            overflowY: "auto",
                                            width: "100%",
                                        }}>
                                            <CheckIcon
                                                sx={{ color: theme.palette.completion.good }}
                                            />
                                            <Typography sx={{ ml: 2 }}>{card.answer}</Typography>
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

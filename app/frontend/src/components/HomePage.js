import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Container, Grid, LinearProgress, Link, Typography, Tooltip } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { fetchUserProgress } from '../store/users';
import CheckIcon from '@mui/icons-material/Check';
import { useTheme } from '@mui/material/styles';

function HomePage() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const progressState = useSelector((state) => state.users.progress);
  const progress = progressState && Object.values(progressState)
  const theme = useTheme();
  console.log("UID", user.uid);

  useEffect(() => {
    if (user.uid) dispatch(fetchUserProgress(user.uid))
  }, [dispatch, user.uid]);

  let proficiencyCount = 0;

  if (user.level === "Beginner") proficiencyCount = 1;
  if (user.level === "Intermediate") proficiencyCount = 2;
  if (user.level === "Advanced") proficiencyCount = 3;

  let proficiencyPercentage = (proficiencyCount / 3) * 100

  const currentConcepts = progress?.[0].concepts.filter(concept =>
    concept.level === user.level
  );

  let conceptCount = 0;

  currentConcepts?.map(concept => {
    if (concept.status === true) conceptCount++
    return conceptCount
  })

  console.log("USER", user);

  let conceptPercentage = (conceptCount / currentConcepts?.length) * 100

  const data = [
    {
      left: 'Current English Proficiency Level',
      right: `${user.level}`
    },
    {
      left: (<>
        <Box display="flex" alignItems="center">
          Proficiency Level Progress
          <Tooltip
            title={
              <Typography>
                Unlock the next proficiency level by completing concepts for the current level.
              </Typography>
            }
            arrow
          >
            <InfoIcon color="action" sx={{ mt: -1, fontSize: 16 }} />
          </Tooltip>:
        </Box>
      </>),
      right:
        <LinearProgress
          variant="determinate"
          value={proficiencyPercentage}
          sx={{ height: 25 }}
        />

    },
    // {
    //   left: 'Current Concept:',
    //   right: `${user.current_level} - Basic Nouns`
    // },
    {
      left: (<>
        <Box display="flex" alignItems="center">
          Concept Progress
          <Tooltip
            title={
              <Typography>
                Progress toward mastering your concepts for this level by completing topics.
              </Typography>
            }
            arrow
          >
            <InfoIcon color="action" sx={{ mt: -1, fontSize: 16 }} />
          </Tooltip>:
        </Box>
      </>),
      right: <LinearProgress
        variant="determinate"
        value={conceptPercentage}
        sx={{ height: 25 }}
        color='secondary'
      />
    },
    // {
    //   left: 'Topics Progress:',
    //   right: <LinearProgress
    //     variant="determinate"
    //     value={50}
    //     sx={{ height: 25 }}
    //   />
    // },
    {
      left: (
        <>
          <Box display="flex" alignItems="center">
            Badges
            <Tooltip
              title={
                <Typography>
                  Earn a Lingo.ai Champion Badge for each level you complete.
                </Typography>
              }
              arrow
            >
              <InfoIcon color="action" sx={{ mt: -1, fontSize: 16 }} />
            </Tooltip>:
          </Box>
        </>
      ),
      right: <img src="/assets/badges/beginner-badge.png"
        alt="Lingo.ai Beginner Champion Badge"
        style={{
          width: "25%",
          borderRadius: "3.5px",
          boxShadow: `0 0 2.5px ${theme.palette.mode === 'light' ? '#160e0e' : '#f1e9e9'}`,
        }}
      />
    },
  ]

  if (user.level === 'Advanced') {
    data.splice(5, 0, {
      left: (
        <>
          <Box display="flex" alignItems="center">
            Supplementary Learning
            <Tooltip
              title={
                <Typography>
                  Available level(s) to reinforce your knowledge. Completing these will earn you the corresponding badges, if you haven't already.
                </Typography>
              }
              arrow
            >
              <InfoIcon color="action" sx={{ mt: -1, fontSize: 16 }} />
            </Tooltip>:
          </Box>
        </>
      ),
      right: 'Beginner • Intermediate'
    });
  }

  return (
    <Container>
      <Box>
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
          <h1>Welcome, {user.username}!</h1>
          <Link href='/concepts'
            // exact={true}activeClassName='active'
            underline="none">
            <Button
              variant="contained"
              color="primary"
            >
              Start Learning Now
            </Button>
          </Link>
          <h2 style={{ padding: "16px 0px", }}>Your Latest Lingo.ai Progress</h2>
        </Box>
        <Grid container rowSpacing={4} sx={{ display: 'flex', justifyContent: 'center' }}>
          {data.map((row, index) => (
            <React.Fragment key={index}>
              <Grid item xs={4}>
                <Typography fontWeight="bold">{row.left}</Typography>
              </Grid>
              <Grid item xs={6}>
                {row.right}
              </Grid>
            </React.Fragment>
          ))}
        </Grid>
      </Box>
    </Container>
  )
}

export default HomePage

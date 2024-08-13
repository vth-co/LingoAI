import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Container, Grid, LinearProgress, Link, Typography, Tooltip } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { fetchUserProgress } from '../store/users';

function HomePage() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const progressState = useSelector((state) => state.users.progress);
  const progress = progressState && Object.values(progressState)

  useEffect(() => {
    dispatch(fetchUserProgress(user.uid))
  }, [dispatch]);

  let proficiencyCount = 0;

  if (user.current_level === "Beginner") proficiencyCount = 1;
  if (user.current_level === "Intermediate") proficiencyCount = 2;
  if (user.current_level === "Advanced") proficiencyCount = 3;

  let proficiencyPercentage = (proficiencyCount / 3) * 100

  const currentConcepts = progress?.[0].concepts.filter(concept =>
    concept.level == user.current_level
  );

  let conceptCount = 0;

  currentConcepts?.map(concept => {
    if (concept.status === true) conceptCount++
  })

  let conceptPercentage = (conceptCount / currentConcepts?.length) * 100

  const data = [
    {
      left: 'Current English Proficiency Level:',
      right: `${user.current_level}`
    },
    {
      left: 'Proficiency Level Progress:',
      right: <LinearProgress
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
      left: 'Concept Progress:',
      right: <LinearProgress
        variant="determinate"
        value={conceptPercentage}
        sx={{ height: 25 }}
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
                  Earn a Lingo.ai Champion badge for each level you complete.
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
        style={{
          width: "25%"
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

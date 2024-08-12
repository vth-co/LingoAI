import { Link, Container, Box, Typography, Button } from "@mui/material";
import React from "react";
import { useTheme } from '@mui/material/styles';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

function CardPage() {
  const theme = useTheme();

  return (

    <Box sx={{
      display: "grid",
      margin: "auto",
      columnGap: "10px",
      width: "300px",
      height: "400px",
      borderRadius: "3px",
      backgroundColor: "#a8716f",
      border: `1.5px solid ${theme.palette.mode === 'light' ? '#160e0e' : '#bababa'}`,
    }}>

      <Box
        sx={{
          padding: "20px",
          height: "250px",
        }}>
        <h2>Don't eat the rotten apple. </h2>
      </Box>
      <Box
        sx={{
          backgroundColor: "#fff",
          padding: "20px",
        }}
      >
        <FormControl>
          <FormLabel id="demo-row-radio-buttons-group-label">Identify the common noun in this sentence.</FormLabel>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
          >
            <FormControlLabel value="Rotten" control={<Radio />} label="Rotten" />
            <FormControlLabel value="Eat" control={<Radio />} label="Eat" />
            <FormControlLabel value="Apple" control={<Radio />} label="Apple" />
          </RadioGroup>
        </FormControl>
      </Box>

    </Box >

  );
}

export default CardPage;

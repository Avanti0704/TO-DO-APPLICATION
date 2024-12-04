import React from "react";
import { Box, Typography,Button } from "@mui/material";
import '../App.css'; 

const PageNotFound = () => {
  return (
    <Box className="page-not">
      <Typography variant="h5" color="textSecondary">
        404 Page Not Found
      </Typography>
<Button href="/" variant="contained" color="secondary" sx={{marginTop:'2%'}} className="Button">
    Back to page
</Button>
    </Box>
  );
};

export default PageNotFound;

import React from "react";
import { Box, Typography } from "@mui/material";

const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                textAlign: "center",
                padding: "5px 0",
                marginBottom:0,
                backgroundColor: "#f3f4f6",
            }}
        >
            <Typography variant="body2" color="text.secondary">
                Made with React & MUI @All rights reserved. TASKFLOW 2024
            </Typography>
        </Box>
    );
};

export default Footer;

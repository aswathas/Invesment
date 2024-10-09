import React from "react";
import { Container, Typography, Paper } from "@mui/material";

const HomePage = () => {
  return (
    <Container>
      <Paper style={{ padding: "20px", marginTop: "20px" }}>
        <Typography variant="h4" gutterBottom>
          Welcome to My Portfolio
        </Typography>
        <Typography variant="body1">
          This is a brief introduction about myself and my work. Explore my
          portfolio to see my projects and skills.
        </Typography>
      </Paper>
    </Container>
  );
};

export default HomePage;

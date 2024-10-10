// src/components/ThemeSelection.jsx
import { useState } from "react";
import axios from "axios";
import PortfolioDisplay from "./PortfolioDisplay";
import {
  TextField,
  Button,
  Container,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Box,
} from "@mui/material";

const predefinedThemes = [
  "Blue-Chip Stocks",
  "Technology Innovators",
  "Dividend Aristocrats",
  "Banking Titans",
  "Healthcare Leaders",
];

const ThemeSelection = () => {
  const [theme, setTheme] = useState("");
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(false);
  const [customTheme, setCustomTheme] = useState("");

  const handleThemeChange = (e) => {
    setTheme(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const selectedTheme = theme === "Custom" ? customTheme : theme;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/generate-portfolio`,
        { theme: selectedTheme }
      );
      setPortfolio(response.data.stocks);
    } catch (error) {
      console.error("Error generating portfolio:", error);
      alert("Failed to generate portfolio. Please try again.");
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: "50px" }}>
      <Typography variant="h4" gutterBottom>
        AI-Powered Stock Basket Generator
      </Typography>
      <form onSubmit={handleSubmit}>
        <FormControl
          variant="outlined"
          fullWidth
          style={{ marginBottom: "20px" }}
        >
          <InputLabel id="theme-label">Select Investment Theme</InputLabel>
          <Select
            labelId="theme-label"
            value={theme}
            onChange={handleThemeChange}
            label="Select Investment Theme"
            required
          >
            {predefinedThemes.map((th, index) => (
              <MenuItem key={index} value={th}>
                {th}
              </MenuItem>
            ))}
            <MenuItem value="Custom">Custom Theme</MenuItem>
          </Select>
        </FormControl>
        {theme === "Custom" && (
          <TextField
            label="Enter Your Custom Theme"
            variant="outlined"
            fullWidth
            value={customTheme}
            onChange={(e) => setCustomTheme(e.target.value)}
            required
            style={{ marginBottom: "20px" }}
          />
        )}
        <Box display="flex" justifyContent="center" alignItems="center">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Generate Portfolio"}
          </Button>
        </Box>
      </form>
      {portfolio.length > 0 && <PortfolioDisplay portfolio={portfolio} />}
    </Container>
  );
};

export default ThemeSelection;

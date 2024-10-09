// src/components/PortfolioDisplay.jsx
import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Link,
  Divider,
  Modal,
  Backdrop,
  Fade,
  Paper,
  CircularProgress,
  Box,
} from "@mui/material";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const PortfolioDisplay = ({ portfolio }) => {
  const [open, setOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleOpen = async (ticker) => {
    setLoading(true);
    setOpen(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/stock-details`,
        { params: { ticker } }
      );
      setSelectedStock(response.data);
    } catch (error) {
      console.error("Error fetching stock details:", error);
      alert("Failed to fetch stock details.");
    }
    setLoading(false);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedStock(null);
  };

  // Count stocks per sector
  const sectorCounts = portfolio.reduce((acc, stock) => {
    acc[stock.sector] = (acc[stock.sector] || 0) + 1;
    return acc;
  }, {});

  const data = {
    labels: Object.keys(sectorCounts),
    datasets: [
      {
        label: "# of Stocks",
        data: Object.values(sectorCounts),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  return (
    <div style={{ marginTop: "40px" }}>
      <Typography variant="h5" gutterBottom>
        Your Stock Basket:
      </Typography>
      <List>
        {portfolio.map((stock, index) => (
          <React.Fragment key={index}>
            <ListItem button onClick={() => handleOpen(stock.ticker)}>
              <ListItemText
                primary={
                  <Link
                    href={stock.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    underline="hover"
                  >
                    {stock.name} ({stock.ticker})
                  </Link>
                }
                secondary={`Sector: ${stock.sector}`}
              />
            </ListItem>
            <Divider component="li" />
          </React.Fragment>
        ))}
      </List>
      <Typography variant="h6" gutterBottom style={{ marginTop: "30px" }}>
        Sector Allocation:
      </Typography>
      <Bar data={data} />

      {/* Modal for Stock Details */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Paper
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              padding: "20px",
              outline: "none",
            }}
          >
            {loading ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="200px"
              >
                <CircularProgress />
              </Box>
            ) : selectedStock ? (
              <div>
                <Typography variant="h6" gutterBottom>
                  {selectedStock.name} ({selectedStock.ticker})
                </Typography>
                <Typography variant="body1">
                  <strong>Sector:</strong> {selectedStock.sector}
                </Typography>
                <Typography variant="body1">
                  <strong>P/E Ratio:</strong> {selectedStock.pe_ratio}
                </Typography>
                <Typography variant="body1">
                  <strong>EPS:</strong> {selectedStock.eps}
                </Typography>
                <Typography variant="body1">
                  <strong>Dividend Yield:</strong>{" "}
                  {selectedStock.dividend_yield}
                </Typography>
                <Typography variant="body1">
                  <strong>Market Cap:</strong> {selectedStock.market_cap}
                </Typography>
                <Typography variant="body1">
                  <strong>52-Week Change:</strong>{" "}
                  {selectedStock["52_week_change"]}
                </Typography>
                <Typography variant="body2" style={{ marginTop: "10px" }}>
                  {selectedStock.description}
                </Typography>
              </div>
            ) : (
              <Typography variant="body1">No details available.</Typography>
            )}
          </Paper>
        </Fade>
      </Modal>
    </div>
  );
};

export default PortfolioDisplay;

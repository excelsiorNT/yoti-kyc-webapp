import React from "react";
import { Box, Button, Paper, Typography } from "@mui/material";
import { useLocalStorage } from "react-use";
import { useNavigate } from "react-router";

interface ResultProps {
  username: string;
}

export default function Result({
  username
}: ResultProps) {
  const [user, setUser, removeUser] = useLocalStorage('user', '');
  const [verified, setVerified, removeVerified] = useLocalStorage('verified', false);
  const navigate = useNavigate();

  const onVerify = () => {
    
  }
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f5f5f5"
    >
      <Paper elevation={3} sx={{ p: 4, minWidth: 350 }}>
        <Typography variant="h5" mb={2} align="center">
          Verification Result
        </Typography>
        <Box mb={2}>
          <Typography variant="subtitle1">
            <strong>Username:</strong> {user}
          </Typography>
          <Typography variant="subtitle1">
            <strong>KYC Result:</strong> { verified ? "Completed" : "Failed" }
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={onVerify}
        >
          Verify Account with ID
        </Button>
      </Paper>
    </Box>
  );
}
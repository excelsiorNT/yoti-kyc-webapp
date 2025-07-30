import React, { useEffect, useRef } from "react";
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
  const [session, setSession, removeSession] = useLocalStorage('session', '');

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const response = await fetch(`/api/verify?sessionId=${session}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        const result = await response.json()
        console.log(result)
        if (result === "COMPLETE") {
          setVerified(true);
          removeSession();
        }
      } catch (error) {
        console.error("API error:", error);
      }
    };

    fetchResult(); // initial call

    if (!verified && session) {
      intervalRef.current = setInterval(fetchResult, 10000); // every 10 seconds
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);

    };
  }, [verified]);

  const onVerify = async () => {
    if (session) {
      window.location.href = `https://age.yoti.com/age-estimation?sessionId=${session}&sdkId=${import.meta.env.VITE_WEB_SDK_ID}`;
    } else {
      try {
        const response = await fetch('/api/sessions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: user
          }),
        })
        const data = await response.json();
        setSession(data.id)
        console.log(data)
        window.location.href = data.url
      } catch (error) {
        console.error("Error during verification:", error);
        alert("Fetch URL failed. Please try again.");
      }
    }
  }
  
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f5f5f5"
    >
      <Paper elevation={3} sx={{ p: 2, minWidth: 350 }}>
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
        { !verified && <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={onVerify}
        >
          Verify Account with ID
        </Button>}
      </Paper>
    </Box>
  );
}
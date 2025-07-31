import React, { useEffect, useRef } from "react";
import { Box, Button, Paper, Typography } from "@mui/material";
import { useLocalStorage } from "react-use";

// Yoti blue and style constants
const YOTI_BLUE = "#012169";
const YOTI_LIGHT = "#f5f8fa";

interface ResultProps {
  user_id: string;
}

export default function Result({ user_id }: ResultProps) {
  const [user, setUser, removeUser] = useLocalStorage('user', '');
  const [verified, setVerified, removeVerified] = useLocalStorage('verified', false);
  const [session, setSession, removeSession] = useLocalStorage('session', '');
  const [expire, setExpire, removeExpire] = useLocalStorage('expire', new Date().toISOString());

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Fetch verification result using Yoti Get Results API
    const fetchResult = async () => {
      try {
        const response = await fetch(`/api/verify?sessionId=${session}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        const result = await response.json();
        // Check if the result is complete and update state
        if (result.status === true) {
          // Set verified to true and clear the interval
          setVerified(true);
          removeSession();
        }
      } catch (error) {
        console.error("API error:", error);
      }
    };

    // Check if user is already verified or session is valid
    let expireDate = expire || new Date().toISOString();
    if (!verified && session && expireDate > new Date().toISOString()) {
      fetchResult(); // initial call
      intervalRef.current = setInterval(fetchResult, 10000); // every 10 seconds
    }

    // Cleanup function to clear the interval
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [verified, session, setVerified, removeSession]);

  // Function to handle verification button click
  const onVerify = async () => {
    let expireDate = expire || new Date().toISOString();

    // If session exists and not expired, redirect to already given Yoti service URL
    if (session && expireDate > new Date().toISOString()) {
      alert("session still valid");

      // Redirect to Yoti service URL
      window.location.href = `https://age.yoti.com/age-estimation?sessionId=${session}&sdkId=${import.meta.env.VITE_WEB_SDK_ID}`;
    } else {
      try {
        const response = await fetch('/api/sessions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: user
          }),
        });
        const data = await response.json();

        // Store session ID and expiration date in local storage
        setSession(data.id);
        setExpire(data.expires_at);

        // Redirect to Yoti service URL
        window.location.href = data.url;
      } catch (error) {
        console.error("Error during verification:", error);
        alert("Fetch URL failed. Please try again.");
      }
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor={YOTI_LIGHT}
    >
      <Paper
        elevation={6}
        sx={{
          p: { xs: 2, sm: 4 },
          minWidth: { xs: 320, sm: 400 },
          borderRadius: 4,
          boxShadow: "0 8px 32px 0 rgba(1,33,105,0.10)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h5"
          mb={1}
          align="center"
          sx={{ fontWeight: 700, color: YOTI_BLUE, letterSpacing: 1 }}
        >
          Verification Result
        </Typography>
        <Typography
          variant="body2"
          mb={3}
          align="center"
          sx={{ color: "#555" }}
        >
          {verified
            ? "Your identity has been successfully verified."
            : "You look younger than our minimum age requirement."}
          <br />
          {verified
            ? "When your account is ready, you will receive an email with further instructions."
            : "To proceed, please verify using an alternative method below."}
        </Typography>
        <Box mb={2} width="100%">
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Verification Status:{" "}
            <span style={{ fontWeight: 400 }}>
              {verified ? "Completed" : "Pending"}
            </span>
          </Typography>
        </Box>
        {!verified && (
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={onVerify}
            sx={{
              borderRadius: 2,
              fontWeight: 700,
              background: YOTI_BLUE,
              ":hover": { background: "#003087" },
              mt: 1,
            }}
          >
            Verify Account with Alternative Method
          </Button>
        )}
      </Paper>
    </Box>
    );
  
  }

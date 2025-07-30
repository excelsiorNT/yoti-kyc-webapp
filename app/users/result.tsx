import React, { useEffect, useRef } from "react";
import { Box, Button, Paper, Typography, Avatar } from "@mui/material";
import { useLocalStorage } from "react-use";
import { useNavigate } from "react-router";

// Yoti blue and style constants
const YOTI_BLUE = "#012169";
const YOTI_LIGHT = "#f5f8fa";

interface ResultProps {
  username: string;
}

export default function Result({ username }: ResultProps) {
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
        const result = await response.json();
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
  }, [verified, session, setVerified, removeSession]);

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
        });
        const data = await response.json();
        setSession(data.id);
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
            ? "Your identity has been successfully verified. Welcome to SocialYoti!"
            : "Your account verification is not complete. Please verify your account to continue."}
        </Typography>
        <Box mb={2} width="100%">
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Username: <span style={{ fontWeight: 400 }}>{user}</span>
          </Typography>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Account Verification:{" "}
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
            Verify Account with ID
          </Button>
        )}
      </Paper>
    </Box>
    );
  
  }

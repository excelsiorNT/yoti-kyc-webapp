import React, { useState } from "react";
import { useNavigate } from "react-router";
import {
  Box,
  Button,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Paper,
  Avatar,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useLocalStorage } from "react-use";

// Yoti blue and style constants
const YOTI_BLUE = "#012169";
const YOTI_LIGHT = "#f5f8fa";

export default function Registration() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [user, setUser, removeUser] = useLocalStorage('user', '');
  const [verified, setVerified, removeVerified] = useLocalStorage('verified', false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show)
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password
        })
      })

      const data = await response.json();

      setUser(form.username);
      setVerified(false);
      if (response.status === 200) 
        navigate("/verify");
      else {
        alert(data.error || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("Registration failed. Please try again.");
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
          Create your SocialYoti Account
        </Typography>
        <Typography
          variant="body2"
          mb={3}
          align="center"
          sx={{ color: "#555" }}
        >
          Sign up to connect with real users.
        </Typography>
        <Box component="form" onSubmit={handleSubmit} width="100%">
          <TextField
            margin="normal"
            fullWidth
            label="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
            autoComplete="username"
            InputProps={{
              sx: { borderRadius: 2, bgcolor: "#fff" }
            }}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            autoComplete="email"
            InputProps={{
              sx: { borderRadius: 2, bgcolor: "#fff" }
            }}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={handleChange}
            required
            autoComplete="new-password"
            InputProps={{
              sx: { borderRadius: 2, bgcolor: "#fff" },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              py: 1.5,
              fontWeight: 700,
              fontSize: "1rem",
              background: YOTI_BLUE,
              borderRadius: 2,
              textTransform: "none",
              boxShadow: "0 2px 8px 0 rgba(1,33,105,0.10)",
              ":hover": { background: "#003087" }
            }}
          >
            Sign Up
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
import FaceCapture from "@getyoti/react-face-capture";
import {
  Box,
  Button,
  Typography,
  Paper,
  Avatar,
} from "@mui/material";
import { useLocalStorage } from "react-use";
import { useNavigate } from "react-router";

// Yoti blue and style constants
const YOTI_BLUE = "#012169";
const YOTI_LIGHT = "#f5f8fa";

export function CaptureImage() {
  const [user, setUser] = useLocalStorage('user', '');
  const [verified, setVerified] = useLocalStorage('verified', false);
  const navigate = useNavigate();

  const onSuccess = async (payload: { img: string }, base64PreviewImage?: string) => { 
    const response = await fetch('/api/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        img: payload.img,
      }),
    });
    const data = await response.json();
    setVerified(data.age.age_check === "pass" && data.antispoofing.prediction === "true");
    navigate("/result", { state: { username: user, kycResult: data.age.age_check } });
    console.log(data);
  };

  const onBack = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    window.history.back();
  };

  const onError = (error: any) => console.log(error);

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
          Account Verification
        </Typography>
        <Typography
          variant="body2"
          mb={3}
          align="center"
          sx={{ color: "#555" }}
        >
          To ensure a safe and authentic community, we require all new users to prove their age during registration.
        </Typography>
        <Box width="100%" mb={2} maxWidth={550}>
          <FaceCapture
            clientSdkId={import.meta.env.VITE_SDK_ID}
            returnPreviewImage={true}
            secure={false}
            onSuccess={onSuccess}
            onError={onError}
          />
        </Box>
        <Button
          variant="outlined"
          color="primary"
          fullWidth
          onClick={onBack}
          sx={{
            borderRadius: 2,
            fontWeight: 700,
            borderColor: YOTI_BLUE,
            color: YOTI_BLUE,
            ":hover": { borderColor: "#003087", color: "#003087" }
          }}
        >
          Cancel
        </Button>
      </Paper>
    </Box>
  );
}
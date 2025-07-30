import FaceCapture from "@getyoti/react-face-capture"
import {
  Box,
  Button,
  Typography,
  Paper,
} from "@mui/material";
import { useLocalStorage } from "react-use";
import { useNavigate } from "react-router";

export function CaptureImage() {
  const [user, setUser, removeUser] = useLocalStorage('user', '');
  const [verified, setVerified, removeVerified] = useLocalStorage('verified', false);
  const navigate = useNavigate();

  const onSuccess = async (payload: { img: string; }, base64PreviewImage?: string) => { 
    const response = await fetch('/api/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        img: payload.img,
      }),
    })
    const data = await response.json();
    setVerified(data.age.age_check === "pass" && data.antispoofing.prediction === "true")
    navigate("/result", {state: { username: user, kycResult: data.age.age_check }});
    console.log(data)
  };
  const onBack = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      // Handle go back logic here
      window.history.back();
    };
  const onError = (error: any) => console.log(error);
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f5f5f5"
    >
      <Paper elevation={0} sx={{ p: 2, minWidth: 550, maxWidth: 550}}>
        <Typography variant="h5" mb={2} align="center">
          Account Verification
        </Typography>
        <Typography variant="caption" mb={2} align="center">
          To ensure a safe and authentic community, we require all new users to prove their age during registration.
        </Typography>
        <FaceCapture 
          clientSdkId={import.meta.env.VITE_SDK_ID}
          returnPreviewImage={true}
          secure={false}
          onSuccess={onSuccess} 
          onError={onError} />
        <Button
          variant="outlined"
          color="primary"
          fullWidth
          onClick={onBack}
        >
          Cancel
        </Button>
      </Paper>
    </Box>

  );
}
import FaceCapture from "@getyoti/react-face-capture"
import {
  Box,
  Button,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Paper,
} from "@mui/material";

export function CaptureImage() {
  const onSuccess = (payload: { img: string | any[]; }, base64PreviewImage: any) => { 
    const response = fetch('/api/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        img: payload.img,
      }),
    })
    console.log(response)
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
      <Paper elevation={0} sx={{ p: 4, minWidth: 550, maxWidth: 650}}>
        <Typography variant="h5" mb={2} align="center">
          Account Verification
        </Typography>
        <Typography variant="caption" mb={2} align="center">
          To ensure a safe and
authentic community, it requires all new users to prove their age during registration.
        </Typography>
        <FaceCapture 
        clientSdkId="fc0beb8f-b40d-42ce-b491-2ea5780c8c94" 
        returnPreviewImage={true}
        secure={false}
        onSuccess={onSuccess} 
        onError={onError} />
      </Paper>
    </Box>

  );
}
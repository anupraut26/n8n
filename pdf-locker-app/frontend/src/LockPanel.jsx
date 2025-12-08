import React, { useState } from 'react';
import { Button, TextField, Box, Typography, Alert, CircularProgress } from '@mui/material';
import axios from 'axios';

const LockPanel = () => {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage(null);
    setError(null);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !password) {
      setError("Please provide both file and password.");
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('password', password);

    try {
      const response = await axios.post('/api/lock', formData, {
        responseType: 'blob', // Important for handling binary data
      });

      // Create a link to download the file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;

      const contentDisposition = response.headers['content-disposition'];
      let filename = 'locked_file.pdf';
      if (contentDisposition) {
        const matches = /filename="([^"]*)"/.exec(contentDisposition);
        if (matches != null && matches[1]) {
            filename = matches[1];
        }
      }

      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();

      setMessage("PDF Locked successfully! Download started.");
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data instanceof Blob) {
           // Read the blob error message
           const text = await err.response.data.text();
           setError("Error locking PDF: " + text);
      } else {
           setError("Error locking PDF. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h6">Lock PDF</Typography>
      <Typography variant="body2" color="textSecondary">
        Upload an unprotected PDF and set a password to secure it.
      </Typography>

      <Button
        variant="contained"
        component="label"
      >
        Upload File
        <input
          type="file"
          hidden
          accept="application/pdf"
          onChange={handleFileChange}
        />
      </Button>
      {file && <Typography variant="caption">{file.name}</Typography>}

      <TextField
        label="Password"
        type="password"
        variant="outlined"
        value={password}
        onChange={handlePasswordChange}
        required
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={loading}
        startIcon={loading && <CircularProgress size={20} />}
      >
        {loading ? 'Processing...' : 'Lock PDF'}
      </Button>

      {message && <Alert severity="success">{message}</Alert>}
      {error && <Alert severity="error">{error}</Alert>}
    </Box>
  );
};

export default LockPanel;

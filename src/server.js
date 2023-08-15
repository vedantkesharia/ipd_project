// const express = require('express');
// const axios = require('axios');
import express from 'express';
import axios from 'axios';

const app = express();
const PORT =  5000;

app.use(express.json());

app.get('/wikipedia', async (req, res) => {
  try {
    const response = await axios.get('https://en.wikipedia.org/wiki/Galaxy');
    res.send(response.data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

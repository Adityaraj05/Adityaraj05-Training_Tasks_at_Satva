const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;

app.get('/proxy/satvasolutions', async (req, res) => {
    try {
        const response = await axios.get('https://satvasolutions.com');
        res.send(response.data);
    } catch (error) {
        console.error('Error fetching target website:', error.message);
        res.status(500).send('Failed to fetch the target website.');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

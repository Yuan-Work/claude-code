const express = require('express');
const { exec } = require('child_process');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Endpoint for n8n to send prompts to
app.post('/ask', (req, res) => {
    const userPrompt = req.body.prompt;
    
    if (!userPrompt) {
        return res.status(400).json({ error: 'No prompt provided' });
    }

    // Runs Claude Code via the command line
    exec(`claude "${userPrompt.replace(/"/g, '\\"')}"`, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).json({ error: error.message, details: stderr });
        }
        res.json({ response: stdout });
    });
});

app.listen(PORT, () => {
    console.log(`Agent bridge listening on port ${PORT}`);
});

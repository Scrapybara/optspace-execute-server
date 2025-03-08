import express from 'express';
import { execute, ExecuteRequest } from './execute';
import { screen } from '@nut-tree/nut-js';
import path from 'path';
import fs from 'fs/promises';

const app = express();
app.use(express.json());

app.post('/execute', async (req, res) => {
  try {
    const { computerRequest, screenWidth, screenHeight, normalFactor } = req.body;
    await execute({ computerRequest, screenWidth, screenHeight, normalFactor } as ExecuteRequest);
    res.json({ success: true });
  } catch (error) {
    console.error("Execute error:", error);
    res.status(500).json({ error: String(error) });
  }
});

app.get('/screenshot', async (req, res) => {
  try {
    const tempDir = process.cwd();
    const screenshotPath = path.join(tempDir, "screenshot.png");

    // Capture screenshot using nut.js
    await screen.capture(screenshotPath);

    // Read the file and convert to base64
    const imageBuffer = await fs.readFile(screenshotPath);
    const base64Image = imageBuffer.toString('base64');

    // Clean up the temporary file
    await fs.unlink(screenshotPath);

    const width = await screen.width();
    const height = await screen.height();
    res.json({ image: base64Image, width: width, height: height });
  } catch (error) {
    console.error("Screenshot error:", error);
    res.status(500).json({ error: String(error) });
  }
});

const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
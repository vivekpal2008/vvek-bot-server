const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Serve GUI
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head><title>VVEK Bot Server</title>
    <style>
      body { 
        margin:0; 
        background: #000; 
        color: #00ff41; 
        font-family: 'Courier New', monospace; 
        height: 100vh; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        flex-direction: column;
        text-align: center;
      }
      h1 { font-size: 3em; margin: 0; }
      h2 { font-size: 2em; color: #00ff88; }
    </style>
    </head>
    <body>
      <h1>🟢 iam.v_vek BOT SERVER</h1>
      <h2>✅ LIVE & READY</h2>
      <p style="font-size: 1.2em; color: #aaa;">
        WebSocket: wss://YOUR_URL_HERE.ws
      </p>
      <p>Copy this URL for Tampermonkey!</p>
    </body>
    </html>
  `);
});

// WebSocket Bot Server
let activeBots = 420;

wss.on('connection', (ws) => {
  console.log('🔗 New bot client connected!');
  
  // Send bot count every 2 seconds
  const heartbeat = setInterval(() => {
    const buffer = Buffer.alloc(9);
    buffer[0] = 6; // Packet type
    buffer.writeUInt16LE(activeBots, 1);
    buffer.writeUInt16LE(500, 3);
    ws.send(buffer);
  }, 2000);
  
  ws.on('message', (data) => {
    const cmd = new Uint8Array(data)[0];
    const cmdNames = {
      0: 'STOP BOTS', 1: 'START BOTS',
      17: 'SPLIT', 21: 'EJECT', 23: 'FARM'
    };
    console.log(`📡 Command: ${cmdNames[cmd] || cmd}`);
  });
  
  ws.on('close', () => {
    clearInterval(heartbeat);
    console.log('❌ Client disconnected');
  });
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
  console.log(`🚀 VVEK Server running on port ${PORT}`);
});

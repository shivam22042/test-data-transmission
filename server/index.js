const path = require('path');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { SerialPort, ReadlineParser } = require('serialport');

const HTTP_PORT = process.env.HTTP_PORT || 3000;
const SERIAL_BAUD_RATE = Number(process.env.SERIAL_BAUD_RATE || 115200);
const SERIAL_PORT_PATH = process.env.SERIAL_PORT_PATH || '/dev/ttyACM0';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

function startSerialReader() {
  const serialPort = new SerialPort({
    path: SERIAL_PORT_PATH,
    baudRate: SERIAL_BAUD_RATE,
    autoOpen: false,
  });

  const parser = serialPort.pipe(new ReadlineParser({ delimiter: '\n' }));

  serialPort.open((error) => {
    if (error) {
      console.error(`Failed to open serial port ${SERIAL_PORT_PATH}:`, error.message);
      console.error('Set SERIAL_PORT_PATH and SERIAL_BAUD_RATE environment variables if needed.');
      return;
    }

    console.log(`Connected to ${SERIAL_PORT_PATH} @ ${SERIAL_BAUD_RATE}`);
  });

  parser.on('data', (line) => {
    const message = line.trim();
    if (!message) {
      return;
    }

    console.log('Serial:', message);
    io.emit('serial-message', {
      message,
      receivedAt: new Date().toISOString(),
    });
  });

  serialPort.on('error', (error) => {
    console.error('Serial port error:', error.message);
  });

  serialPort.on('close', () => {
    console.warn('Serial port closed.');
  });
}

startSerialReader();

server.listen(HTTP_PORT, () => {
  console.log(`Open http://localhost:${HTTP_PORT}`);
});

# Arduino Mega ➜ Raspberry Pi 5 serial text receiver (React UI)

This app reads serial text from an Arduino on the Raspberry Pi and displays it in a React textbox.

## 1) Wiring / connection
- Connect Arduino Mega to Raspberry Pi 5 via USB.
- Upload your Arduino sketch (115200 baud in your current example).

## 2) Install and run
```bash
npm install
npm start
```

Then open: `http://<pi-ip>:3000` (or `http://localhost:3000` on the Pi itself).

## 3) Config
You can override defaults with environment variables:

- `SERIAL_PORT_PATH` (default: `/dev/ttyACM0`)
- `SERIAL_BAUD_RATE` (default: `115200`)
- `HTTP_PORT` (default: `3000`)

Example:
```bash
SERIAL_PORT_PATH=/dev/ttyUSB0 SERIAL_BAUD_RATE=115200 HTTP_PORT=4000 npm start
```

## What the UI does
- Shows every received serial line in a textbox with timestamp.
- Includes a **Clear textbox** button to clear past text.

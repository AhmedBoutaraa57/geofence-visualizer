# Quick Setup Guide

## Prerequisites

- Node.js 18+ and npm
- MQTT broker running (default: localhost:1883)

## Installation Steps

1. **Install dependencies**:
```bash
# Install frontend dependencies
cd geofence-visualizer
npm install

# Install server dependencies
cd server
npm install
cd ..
```

2. **Configure MQTT (optional)**:
   
   Create a `.env` file in the `geofence-visualizer` directory:
   ```bash
   MQTT_BROKER_IN=localhost
   MQTT_BROKER_PORT=1883
   MQTT_USERNAME=your_username
   MQTT_PASSWORD=your_password
   MQTT_TOPIC_BADGES=old/assets/+/location
   MQTT_TOPIC_GEOFENCE=geofence/+
   ```

   Or set environment variables:
   ```bash
   export MQTT_BROKER_IN=localhost
   export MQTT_BROKER_PORT=1883
   export MQTT_USERNAME=your_username
   export MQTT_PASSWORD=your_password
   ```

3. **Start the application**:

   **Terminal 1 - Backend Server**:
   ```bash
   cd server
   npm start
   ```

   **Terminal 2 - Frontend**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   - Navigate to http://localhost:3000
   - Check connection status in top-right corner

## Testing Without MQTT

You can test the tool without an MQTT connection:

1. Start the application (server will show MQTT connection error, but frontend will still work)
2. Click "+ Add Badge" to manually add test badges
3. Import `example-data.json` to load sample data
4. Enable "Test Mode" to manually move badges on the map

## Troubleshooting

### MQTT Connection Issues

- **Error: "Connection refused"**: 
  - Check if MQTT broker is running
  - Verify broker host and port
  - Check firewall settings

- **Error: "Authentication failed"**:
  - Verify username and password
  - Check broker authentication settings

### WebSocket Connection Issues

- **Frontend shows "Disconnected"**:
  - Ensure backend server is running on port 3001
  - Check browser console for errors
  - Verify CORS settings if accessing from different origin

### Map Not Loading

- Check internet connection (uses OpenStreetMap tiles)
- Try refreshing the page
- Check browser console for errors

## Next Steps

- Load test data using `example-data.json`
- Add geofences manually or via import
- Enable test mode to simulate badge movements
- Monitor events in the event log panel


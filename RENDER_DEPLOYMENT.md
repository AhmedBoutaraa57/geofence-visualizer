# Render.com Deployment Guide

This guide explains how to deploy the Geofence Visualizer to Render.com.

## Prerequisites

- A Render.com account (free tier available)
- Your MQTT broker credentials and connection details

## Deployment Steps

### Option 1: Using Render Dashboard (Recommended)

1. **Push your code to GitHub/GitLab/Bitbucket**
   - Make sure your repository is accessible

2. **Create a new Web Service on Render**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" → "Web Service"
   - Connect your repository
   - Select the `geofence-visualizer` repository

3. **Configure the service:**
   - **Name**: `geofence-visualizer` (or your preferred name)
   - **Environment**: `Node`
   - **Build Command**: 
     ```bash
     npm install --production=false && cd server && npm install && cd .. && npm run build
     ```
   - **Start Command**: 
     ```bash
     npm start
     ```
   - **Root Directory**: Leave empty (or set to repository root)

4. **Set Environment Variables:**
   Click "Environment" tab and add:
   - `NODE_ENV` = `production`
   - `MQTT_BROKER` = `mqtt://iot.mongrov.net:1883` (or your MQTT broker URL)
   - `MQTT_BROKER_IN` = `iot.mongrov.net` (or your MQTT broker host)
   - `MQTT_BROKER_PORT` = `1883` (or your MQTT broker port)
   - `MQTT_BROKER_PROTOCOL` = `mqtt` (or `mqtts` for TLS)
   - `MQTT_USERNAME` = (your MQTT username, if required)
   - `MQTT_PASSWORD` = (your MQTT password, if required)
   - `MQTT_TOPIC_BADGES` = `old/assets/+/location` (or your badge topic)
   - `MQTT_TOPIC_GEOFENCE` = `geofence/+` (or your geofence topic)

5. **Deploy**
   - Click "Create Web Service"
   - Render will build and deploy your application
   - Wait for the build to complete (usually 2-5 minutes)

### Option 2: Using render.yaml (Infrastructure as Code)

1. **Push your code to GitHub/GitLab/Bitbucket**

2. **Create a new Blueprint on Render**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" → "Blueprint"
   - Connect your repository
   - Render will detect the `render.yaml` file

3. **Configure Environment Variables**
   - After the blueprint is created, go to the service settings
   - Add the MQTT environment variables (see Option 1, step 4)

4. **Deploy**
   - Render will automatically deploy based on `render.yaml`

## Post-Deployment

### Verify Deployment

1. **Check the service URL**
   - Render provides a URL like: `https://geofence-visualizer.onrender.com`
   - Visit the URL to see your application

2. **Test the API**
   - Visit `https://your-app.onrender.com/api/health`
   - Should return: `{"status":"ok","mqtt":"connected|disconnected",...}`

3. **Check logs**
   - In Render dashboard, go to "Logs" tab
   - Verify MQTT connection is successful
   - Look for: `✅ Connected to MQTT broker`

### Troubleshooting

**MQTT Connection Issues:**
- Verify MQTT broker is accessible from Render's servers
- Check if your MQTT broker requires authentication
- Ensure firewall rules allow connections from Render's IP ranges
- For TLS/SSL connections, use `mqtts://` protocol

**Build Failures:**
- Check build logs in Render dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility (requires Node 18+)

**Frontend Not Loading:**
- Check that `npm run build` completed successfully
- Verify `dist/` directory exists after build
- Check server logs for static file serving messages

**WebSocket Connection Issues:**
- Render supports WebSockets, but ensure your plan includes it
- Free tier has some limitations on WebSocket connections
- Check browser console for connection errors

## Environment Variables Reference

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port (auto-set by Render) | `3001` | No |
| `NODE_ENV` | Node environment | `production` | No |
| `MQTT_BROKER` | Full MQTT broker URL | `mqtt://iot.mongrov.net:1883` | Yes |
| `MQTT_BROKER_IN` | MQTT broker hostname | `iot.mongrov.net` | Yes |
| `MQTT_BROKER_PORT` | MQTT broker port | `1883` | Yes |
| `MQTT_BROKER_PROTOCOL` | Protocol (`mqtt` or `mqtts`) | `mqtt` | No |
| `MQTT_USERNAME` | MQTT username | - | No |
| `MQTT_PASSWORD` | MQTT password | - | No |
| `MQTT_TOPIC_BADGES` | Badge location topic | `old/assets/+/location` | No |
| `MQTT_TOPIC_GEOFENCE` | Geofence event topic | `geofence/+` | No |

## Notes

- **Free Tier Limitations**: Render's free tier spins down after 15 minutes of inactivity. First request after spin-down may take 30-60 seconds.
- **WebSocket Support**: Render supports WebSockets on all plans, including free tier.
- **Build Time**: First build may take 3-5 minutes. Subsequent builds are faster.
- **Auto-Deploy**: Render automatically deploys on every push to your main branch (if enabled).

## Updating the Deployment

1. **Automatic**: Push to your connected branch (usually `main` or `master`)
2. **Manual**: Go to Render dashboard → Your service → "Manual Deploy" → "Deploy latest commit"

## Support

For Render-specific issues, check [Render Documentation](https://render.com/docs)
For application issues, check the application logs in Render dashboard.


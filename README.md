# ChatGPT Clone with Claude via AWS Bedrock

A modern chat application built with Next.js that provides a ChatGPT-like experience using Claude models via AWS Bedrock.

## Features

- **Unauthenticated Experience**: No login required - start chatting immediately
- **Local Storage**: Conversation history persists locally in your browser
- **Dark Mode by Default**: Modern dark theme with light mode toggle available
- **Mobile-First Design**: Responsive UI with collapsible sidebar optimized for mobile devices
- **Progressive Web App (PWA)**: Install as a native app with offline capabilities
- **Clean Interface**: Modern, responsive UI with custom CSS styling and smooth theme transitions
- **Real-time Streaming**: Streaming responses for a natural conversation flow
- **Claude Models**: Powered by Anthropic's Claude models via AWS Bedrock (configurable via environment variable)
- **New Conversation**: Always opens to a fresh, empty conversation by default
- **Conversation Management**: Create, switch between, and delete conversations with persistent history
- **Clear All Conversations**: One-click button to wipe all conversation history and start fresh
- **Auto-Focus Input**: Input field automatically focuses for seamless typing experience
- **Theme Toggle**: Easy switching between dark and light modes with persistent preference

## Technical Stack

- **Frontend**: Next.js 14 with App Router
- **UI Framework**: Custom CSS with clean, modern styling
- **AI Model**: Configurable Claude models (default: `anthropic.claude-3-5-sonnet-20241022-v2:0`)
- **Backend**: Next.js API Routes
- **AWS Integration**: AWS Bedrock Runtime API
- **Storage**: Browser localStorage for conversation persistence
- **Icons**: Lucide React icons

## Requirements

- Node.js 18+
- AWS Account with Bedrock access
- Claude models enabled in AWS Bedrock (us-east-1 region recommended)
- AWS credentials configured (via AWS CLI, environment variables, or IAM roles)

## Environment Variables

Create a `.env.local` file in the root directory:

```bash
# AWS Configuration
AWS_REGION=us-east-1

# Claude Model Configuration
# Available models: anthropic.claude-3-5-sonnet-20241022-v2:0, anthropic.claude-sonnet-4-20250514-v1:0, etc.
CLAUDE_MODEL_ID=anthropic.claude-3-5-sonnet-20241022-v2:0

# AWS Credentials (JPC-prefixed variables take precedence)
# Option 1: Use JPC-prefixed variables (preferred)
JPC_AWS_ACCESS_KEY_ID=your_access_key_id
JPC_AWS_SECRET_ACCESS_KEY=your_secret_access_key

# Option 2: Use standard AWS variables (fallback)
# AWS_ACCESS_KEY_ID=your_access_key_id
# AWS_SECRET_ACCESS_KEY=your_secret_access_key

# Optional: If using a specific AWS profile
# AWS_PROFILE=your_profile_name
```

## Getting Started

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up environment variables:**

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your AWS credentials
   ```

3. **Verify Claude model access:**

   ```bash
   aws bedrock list-foundation-models --region us-east-1 --by-provider Anthropic
   ```

4. **Run the development server:**

   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## API Endpoints

- `POST /api/chat` - Send messages to Claude and receive streaming responses

### Theme System

The application features a comprehensive dark/light theme system:

**Dark Mode (Default):**

- Modern dark color scheme optimized for low-light environments
- Reduced eye strain during extended use
- Professional appearance with high contrast

**Light Mode:**

- Clean, bright interface for well-lit environments
- Traditional light theme with excellent readability
- Seamless switching with smooth transitions

**Theme Toggle:**

- Located in the top-right corner of the interface
- Instant theme switching with smooth animations
- Preference automatically saved to localStorage
- Consistent theming across all UI components

**Technical Implementation:**

- CSS custom properties (variables) for consistent theming across all components
- Smooth transitions between theme changes with enhanced visual feedback
- Proper contrast ratios for accessibility and readability
- Mobile-optimized theme toggle placement with improved visibility
- Enhanced button styling with proper dark mode support
- Comprehensive component theming including sidebar, headers, and inputs

### Mobile Optimization

The application is designed with a mobile-first approach:

- **Collapsible Sidebar**: On mobile devices (≤768px), the sidebar is hidden by default and can be accessed via a hamburger menu button
- **Touch-Friendly Interface**: All interactive elements are sized appropriately for touch interaction
- **Responsive Layout**: The interface adapts seamlessly from desktop to mobile viewports
- **Overlay Navigation**: Mobile sidebar includes a backdrop overlay for better UX
- **Auto-Close**: Sidebar automatically closes after selecting a conversation or creating a new one

### Desktop vs Mobile Experience

**Desktop (>768px):**

- Sidebar is always visible on the left
- Full conversation list is accessible at all times
- Larger text and spacing for mouse interaction

**Mobile (≤768px):**

- Sidebar is hidden by default to maximize chat area
- Hamburger menu button in the top-left corner opens the sidebar
- Sidebar slides in from the left with a backdrop overlay
- Close button (×) in the sidebar header for easy dismissal
- Optimized spacing and font sizes for mobile devices

### Progressive Web App (PWA)

The application is a fully functional PWA that can be installed on any device:

**Installation:**

- **Desktop**: Look for the install button in your browser's address bar or the install prompt
- **Mobile**: Use "Add to Home Screen" from your browser's menu
- **Automatic Prompt**: The app will show an install prompt when PWA criteria are met

**PWA Features:**

- **Offline Support**: Basic functionality works without internet connection
- **Native App Experience**: Runs in standalone mode without browser UI
- **App Icons**: Custom-designed logo appears on home screen and app launcher
- **Splash Screen**: Branded loading screen when launching the installed app
- **Service Worker**: Caches resources for faster loading and offline access

**Technical Details:**

- Manifest file with proper app metadata
- Service worker for offline functionality and caching
- Multiple icon sizes (16x16, 32x32, 180x180, 192x192, 512x512)
- Apple Touch Icon support for iOS devices
- Windows tile configuration for Microsoft Edge

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Next.js App  │    │  API Routes      │    │  AWS Bedrock    │
│                 │    │                  │    │                 │
│ • Chat UI       │───▶│ • /api/chat      │───▶│ • Claude 4      │
│ • Local Storage │    │ • Streaming      │    │   Sonnet        │
│ • State Mgmt    │    │ • Error Handling │    │ • Inference     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## Key Implementation Details

### Conversation Management

- Each conversation has a unique ID generated client-side
- Messages are stored in localStorage with conversation grouping
- New conversations are created automatically on app load
- Conversation history is preserved across browser sessions

### Streaming Implementation

- Uses Server-Sent Events (SSE) for real-time response streaming
- Implements proper error handling and connection management
- Graceful fallback for non-streaming scenarios

### AWS Bedrock Integration

- Uses the configured Claude model via Bedrock Runtime API
- Implements proper request formatting for Anthropic's message format
- Handles authentication via AWS SDK credentials chain

### Styling Approach

- **Custom CSS**: Clean, maintainable CSS without complex frameworks
- **Modern Design**: Professional appearance with proper spacing and colors
- **Responsive Layout**: Works on desktop and mobile devices
- **Clean Components**: Simple, focused component structure

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run development server in background (useful for automation/scripting)
npm run dev > dev.log 2>&1 &

# Check development server logs
tail -f dev.log

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

### Development Notes

- **Background Execution**: When running `npm run dev` in automated environments or scripts, use the background execution method (`npm run dev > dev.log 2>&1 &`) to prevent blocking. This pipes both stdout and stderr to a log file that can be monitored.
- **Log Monitoring**: Use `tail -f dev.log` to monitor the development server logs in real-time.
- **Port**: The development server runs on `http://localhost:3000` by default.
- **Styling**: Uses custom CSS for clean, maintainable styling without framework complexity

## Deployment

This application can be deployed to any platform that supports Next.js:

- **Vercel**: Automatic deployment with GitHub integration
- **AWS**: Deploy to EC2, ECS, or Lambda with proper IAM roles
- **Docker**: Containerized deployment option

### AWS Deployment Notes

When deploying to AWS, ensure your deployment environment has:

- IAM role with Bedrock access permissions
- Access to the Claude model in the target region
- Proper VPC configuration if using private subnets

#### Amplify Streaming Configuration

AWS Amplify requires special configuration to support streaming responses. The `customHeaders.yml` file configures Amplify to disable buffering for the chat API:

```yaml
customHeaders:
  - pattern: "/api/chat"
    headers:
      - key: "Cache-Control"
        value: "no-cache, no-store, must-revalidate"
      - key: "X-Accel-Buffering"
        value: "no"
      - key: "Connection"
        value: "keep-alive"
```

**Important**: Without this configuration, Amplify will buffer streaming responses and deliver them as a single payload, breaking the real-time streaming experience.

## License

MIT License - see LICENSE file for details.

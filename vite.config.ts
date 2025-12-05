import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['peerjs'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'auth': [
            './src/contexts/AuthContext',
            './src/hooks/useAuth',
            './src/utils/auth',
            './src/utils/api'
          ],
          'meetings': [
            './src/pages/CreateMeeting/CreateMeeting',
            './src/pages/JoinMeeting/JoinMeeting',
            './src/pages/MeetingDetails/MeetingDetails',
            './src/pages/MeetingSuccess/MeetingSuccess',
            './src/pages/MyMeetings/MyMeetings',
            './src/utils/meetingService'
          ],
          'video': [
            './src/pages/VideoConference/VideoConference',
            './src/components/ChatRoom/ChatRoom',
            './src/hooks/useChat',
            './src/services/socketService'
          ]
        }
      }
    },
    chunkSizeWarningLimit: 600
  }
})

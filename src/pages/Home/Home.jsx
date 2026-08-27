import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Button, Container, Stack, Chip } from '@mui/material';
import ForumRoundedIcon from '@mui/icons-material/ForumRounded';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import PersonAddAlt1RoundedIcon from '@mui/icons-material/PersonAddAlt1Rounded';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-[#0f172a] text-[#f8fafc] selection:bg-[#38bdf8] selection:text-[#0f172a] relative overflow-hidden">
      {/* Subtle Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-[#38bdf8]/15 via-[#2563eb]/10 to-transparent blur-3xl pointer-events-none -z-0" />

      {/* Navbar */}
      <AppBar position="static" elevation={0} sx={{ bgcolor: '#1e293b', borderBottom: '1px solid #334155' }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters className="flex justify-between py-2 relative z-10">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
              <div className="p-2 bg-[#2563eb] rounded-xl text-white flex items-center justify-center shadow-lg shadow-[#2563eb]/40">
                <ForumRoundedIcon />
              </div>
              <span className="font-bold text-xl tracking-tight text-white">
                Pulse<span className="text-[#38bdf8]">Chat</span>
              </span>
            </div>

            <Stack direction="row" spacing={1.5}>
              <Button
                variant="text"
                startIcon={<LoginRoundedIcon />}
                onClick={() => navigate('/login')}
                sx={{
                  color: '#94a3b8',
                  textTransform: 'none',
                  fontWeight: 600,
                  '&:hover': { color: '#ffffff', bgcolor: '#334155' },
                }}
              >
                Sign In
              </Button>
              <Button
                variant="contained"
                startIcon={<PersonAddAlt1RoundedIcon />}
                onClick={() => navigate('/register')}
                sx={{
                  bgcolor: '#2563eb',
                  color: '#ffffff',
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: '0.5rem',
                  boxShadow: 'none',
                  '&:hover': { bgcolor: '#1d4ed8', boxShadow: 'none' },
                }}
              >
                Get Started
              </Button>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-20 text-center relative z-10">
        <Container maxWidth="md">
          <Chip
            icon={<BoltRoundedIcon style={{ color: '#38bdf8' }} />}
            label="Instant WebSocket Messaging"
            sx={{
              bgcolor: '#1e293b',
              border: '1px solid #334155',
              color: '#94a3b8',
              fontWeight: 500,
              mb: 3,
            }}
          />

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight mb-6 text-white">
            Realtime conversations, <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#38bdf8] via-[#60a5fa] to-[#818cf8]">
              seamless communication.
            </span>
          </h1>

          <p className="text-[#94a3b8] text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
            A vibrant, modern chatting experience equipped with fast messaging, channel rooms, and clean visual contrast.
          </p>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button
              size="large"
              variant="contained"
              onClick={() => navigate('/register')}
              sx={{
                bgcolor: '#2563eb',
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: '0.5rem',
                py: 1.5,
                px: 4,
                boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.4)',
                '&:hover': { bgcolor: '#1d4ed8' },
              }}
            >
              Start Chatting Free
            </Button>
            <Button
              size="large"
              variant="outlined"
              onClick={() => navigate('/login')}
              sx={{
                borderColor: '#334155',
                color: '#f8fafc',
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: '0.5rem',
                py: 1.5,
                px: 4,
                bgcolor: '#1e293b/60',
                '&:hover': { borderColor: '#38bdf8', bgcolor: '#1e293b' },
              }}
            >
              Open Web App
            </Button>
          </Stack>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 text-left">
            <div className="p-5 rounded-2xl bg-[#1e293b] border border-[#334155]">
              <BoltRoundedIcon className="text-amber-400 mb-2" />
              <h2 className="text-white font-semibold mb-1">Instant Delivery</h2>
              <p className="text-[#94a3b8] text-sm">Real-time socket events with zero lag message dispatch.</p>
            </div>
            <div className="p-5 rounded-2xl bg-[#1e293b] border border-[#334155]">
              <SecurityRoundedIcon className="text-emerald-400 mb-2" />
              <h2 className="text-white font-semibold mb-1">Private Channels</h2>
              <p className="text-[#94a3b8] text-sm">Direct, invite-only chat rooms tailored for focused teams.</p>
            </div>
            <div className="p-5 rounded-2xl bg-[#1e293b] border border-[#334155]">
              <GroupsRoundedIcon className="text-[#38bdf8] mb-2" />
              <h2 className="text-white font-semibold mb-1">Presence Sync</h2>
              <p className="text-[#94a3b8] text-sm">Live active user statuses and realtime typing feedback.</p>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}
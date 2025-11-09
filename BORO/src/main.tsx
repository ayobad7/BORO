import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Home2 from './pages/Home2';
import Storage from './pages/Storage';
import ItemForm from './pages/ItemForm';
import ItemDetail from './pages/ItemDetail.tsx';
import PublicStorage from './pages/PublicStorage.tsx';
import Favorites from './pages/Favorites.tsx';
import Style from './pages/Style.tsx';
import Style2 from './pages/Style2.tsx';
import ActivityPage from './pages/ActivityPage.tsx';
import CardRevamp from './pages/CardRevamp.tsx';

const queryClient = new QueryClient();
const theme = createTheme({
  typography: {
    fontFamily:
      '"Plus Jakarta Sans", "Outfit", "Jost", "Varela Round", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
  },
  palette: {
    mode: 'dark',
    primary: {
      // Red from reference palette
      main: '#D12128',
    },
    secondary: {
      // Deep blue from reference palette
      main: '#01344F',
    },
    background: {
      default: '#1A1A1A',
      paper: '#1F1F1F',
    },
    // Optional accents mapped to standard roles
    warning: { main: '#FAE3AC' },
    info: { main: '#072B36' },
  },
  shape: {
    borderRadius: 15,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 9999,
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 15,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 15,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          borderRadius: 15,
        },
      },
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <BrowserRouter>
              <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/home2' element={<Home2 />} />
                <Route path='/storage' element={<Storage />} />
                <Route path='/item/new' element={<ItemForm />} />
                <Route path='/item/:id' element={<ItemDetail />} />
                <Route path='/storage/:userId' element={<PublicStorage />} />
                <Route path='/favorites' element={<Favorites />} />
                <Route path='/style' element={<Style />} />
                <Route path='/style2' element={<Style2 />} />
                <Route path='/activity' element={<ActivityPage />} />
                <Route path='/card-revamp' element={<CardRevamp />} />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </QueryClientProvider>
      </LocalizationProvider>
    </ThemeProvider>
  </StrictMode>
);

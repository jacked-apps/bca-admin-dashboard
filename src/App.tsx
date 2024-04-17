// components
import { Navigation } from './navigation/Navigation';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter as Router } from 'react-router-dom';

// context
import { ConfirmDialogProvider } from './context/ConfirmContext';
import { QueryClientProvider, QueryClient } from 'react-query';
import { SelectedItemProvider } from './context/SelectedItemProvider';

// firebase
import { FirebaseProvider } from 'bca-firebase-queries';
import { ReactQueryDevtools } from 'react-query/devtools';
import { AuthProvider } from './context/AuthContext';

// css
import 'react-toastify/dist/ReactToastify.css';

const queryClient = new QueryClient();

const firebaseCredentials = {
  apiKey: 'AIzaSyC5MvMfEeebh3XxyzYSD3qWpFR0aAAXSHM',
  authDomain: 'expo-bca-app.firebaseapp.com',
  databaseURL: 'https://expo-bca-app-default-rtdb.firebaseio.com',
  projectId: 'expo-bca-app',
  storageBucket: 'expo-bca-app.appspot.com',
  messagingSenderId: '248104656807',
  appId: '1:248104656807:web:853cad16b8fa38dbee2082',
  measurementId: 'G-EL12CDVSCR',
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <FirebaseProvider credentials={firebaseCredentials}>
        <AuthProvider>
          <SelectedItemProvider>
            <ConfirmDialogProvider>
              <Router>
                <Navigation />
              </Router>
              <ToastContainer
                position="top-left"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                draggable
                pauseOnHover
                theme="colored"
              />
            </ConfirmDialogProvider>
          </SelectedItemProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </AuthProvider>
      </FirebaseProvider>
    </QueryClientProvider>
  );
}

export default App;

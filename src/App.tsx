import { Navigation } from './navigation/Navigation';
import { ToastContainer } from 'react-toastify';
import { SeasonsProvider } from './context/SeasonsContext';
import { SelectedSeasonProvider } from './context/SelectedSeasonProvider';
import { QueryClientProvider, QueryClient } from 'react-query';
import 'react-toastify/dist/ReactToastify.css';
import './firebaseConfig';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SelectedSeasonProvider>
        <SeasonsProvider>
          <Navigation />
          <ToastContainer
            position='top-left'
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            draggable
            pauseOnHover
            theme='colored'
          />
        </SeasonsProvider>
      </SelectedSeasonProvider>
    </QueryClientProvider>
  );
}

export default App;

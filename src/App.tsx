import { Navigation } from './navigation/Navigation';
import { ToastContainer } from 'react-toastify';
import { SeasonsProvider } from './context/SeasonsContext';
import { SelectedSeasonProvider } from './context/SelectedSeasonProvider';
import { ConfirmDialogProvider } from './context/ConfirmContext';
import { QueryClientProvider, QueryClient } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import 'react-toastify/dist/ReactToastify.css';
import './firebaseConfig';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SelectedSeasonProvider>
        <ConfirmDialogProvider>
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
        </ConfirmDialogProvider>
      </SelectedSeasonProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;

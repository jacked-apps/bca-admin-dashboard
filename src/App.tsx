// components
import { Navigation } from './navigation/Navigation';
import { ToastContainer } from 'react-toastify';

// context
import { SelectedSeasonProvider } from './context/SelectedSeasonProvider';
import { ConfirmDialogProvider } from './context/ConfirmContext';
import { QueryClientProvider, QueryClient } from 'react-query';

// firebase
import { ReactQueryDevtools } from 'react-query/devtools';
import './firebaseConfig';

// css
import 'react-toastify/dist/ReactToastify.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SelectedSeasonProvider>
        <ConfirmDialogProvider>
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
        </ConfirmDialogProvider>
      </SelectedSeasonProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;

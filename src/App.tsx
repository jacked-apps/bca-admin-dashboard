import { Navigation } from './navigation/Navigation';
import { ToastContainer } from 'react-toastify';
import { SeasonsProvider } from './context/SeasonsContext';
import 'react-toastify/dist/ReactToastify.css';
import './firebaseConfig';

function App() {
  return (
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
  );
}

export default App;

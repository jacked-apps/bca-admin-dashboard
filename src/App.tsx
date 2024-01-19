import { Navigation } from './navigation/Navigation';
import { ToastContainer } from 'react-toastify';
import './firebaseConfig';
function App() {
  return (
    <div>
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
    </div>
  );
}

export default App;

import { SocketProvider } from './context/SocketContext';
import { UiProvider } from './context/UiContext';
import { RouterPage } from './pages/RouterPage';

 const App = () => {
    return (
        <SocketProvider>
            <UiProvider>
                <RouterPage />
            </UiProvider>
        </SocketProvider>
    )
}

export default App;

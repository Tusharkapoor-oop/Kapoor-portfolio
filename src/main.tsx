import { createRoot } from 'react-dom/client';
import '@fontsource/anton';
import '@fontsource-variable/inter-tight';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/500.css';
import './styles.css';
import App from './App';

createRoot(document.getElementById('root')!).render(<App />);

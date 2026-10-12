import { render } from 'solid-js/web';
import { App } from './app';
import './styles.css';

render(() => <App />, document.getElementById('app')!);

// Works offline once visited. Development servers don't build the worker.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js');
}

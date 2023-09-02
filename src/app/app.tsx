// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.css';

import NxWelcome from './nx-welcome';
import { LibSharedUi } from 'lib/shared/ui';

export function App() {
  return (
    <div>
      <LibSharedUi/>
      <NxWelcome title="focusboard" />
    </div>
  );
}

export default App;

import styles from './lib-shared-ui.module.css';

/* eslint-disable-next-line */
export interface LibSharedUiProps {}

export function LibSharedUi(props: LibSharedUiProps) {
  return (
    <div className={styles['container']}>
      <h1 className='border'>Welcome to LibSharedUi!</h1>
    </div>
  );
}

export default LibSharedUi;

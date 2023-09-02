import { Fragment, ReactNode } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../../main';
import { useNavigate } from 'react-router-dom';

type Props = {
  children: ReactNode;
};

/**
 * TODO: うまくうごかんかも
 * 認証必須の画面に使う
 **/
export const AuthHOC = ({ children }: Props): JSX.Element => {
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  if (loading) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <Fragment />;
  }

  if (error) {
    navigate('/error');
  }

  if (user) {
    navigate('/dashboard');
  }

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <Fragment>{children}</Fragment>;
};

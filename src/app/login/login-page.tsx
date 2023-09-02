import { Button } from 'lib/shared/ui';
import { useAuthState, useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { auth, firestore } from '../../main';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export function LoginPage() {
  const [signInWithGoogle, loading, error] = useSignInWithGoogle(auth);
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  // ログイン後 ログイン済みのときはダッシュボードに遷移する
  useEffect(() => {
    if (user && !loading) {
      // データがない場合は作成する
      const ref = doc(firestore, 'users', user.uid);
      getDoc(ref)
        .then((doc) => {
          if (doc.exists()) {
            console.log('Document data:', doc.data());
          } else {
            // create
            setDoc(ref, {
              screen_name: user?.displayName,
            });
          }
        })
        .catch((error) => {
          console.error('Error getting document:', error);
        })
        .finally(() => {
          navigate('/dashboard');
        });
    }
  }, [user, navigate, loading]);

  return (
    <div>
      <p>Login page</p>
      {loading && <p>loading...</p>}
      {error && <p>error</p>}
      {user && <p>user: {JSON.stringify(user)}</p>}
      <Button as="button" onClick={() => signInWithGoogle()}>
        Sign in with Google
      </Button>
    </div>
  );
}

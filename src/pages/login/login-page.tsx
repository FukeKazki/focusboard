import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useUser } from "../../feature/user-hook";
import { auth, firestore } from "../../lib/firebase";

export function LoginPage() {
  const { currentUser: user } = useUser();
  const [signInWithGoogle, loading, error] = useSignInWithGoogle(auth);
  const navigate = useNavigate();

  // ログイン後 ログイン済みのときはダッシュボードに遷移する
  useEffect(() => {
    if (user) {
      // データがない場合は作成する
      const ref = doc(firestore, "users", user.uid);
      getDoc(ref)
        .then((doc) => {
          if (doc.exists()) {
            console.log("Document data:", doc.data());
          } else {
            // create
            setDoc(ref, {
              screen_name: user?.displayName,
            });
          }
        })
        .catch((error) => {
          console.error("Error getting document:", error);
        })
        .finally(() => {
          // navigate('/dashboard');
        });
    }
  }, [user, navigate]);

  return (
    <div>
      <p>Login page</p>
      {loading && <p>loading...</p>}
      {error && <p>error</p>}
      {user && <p>user: {JSON.stringify(user)}</p>}
      <button className="btn" onClick={() => signInWithGoogle()}>
        Sign in with Google
      </button>
    </div>
  );
}

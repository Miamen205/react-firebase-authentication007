import app from "firebase/app";
import "firebase/auth";
import "firebase/database";

const config = {
  apiKey: "AIzaSyAL0fKhTPC0fzaqr5Hg9oYVI29fq9LFO_M",
  authDomain: "react-my-mini-blog-8c346.firebaseapp.com",
  databaseURL: "https://react-my-mini-blog-8c346-default-rtdb.firebaseio.com",
  projectId: "react-my-mini-blog-8c346",
  storageBucket: "react-my-mini-blog-8c346.appspot.com",
  messagingSenderId: "496225625577",
  appId: "1:496225625577:web:7a222f015f5ba7129c5778",
  measurementId: "G-VFQ4LWTWD3",
};

class Firebase {
  constructor() {
    app.initializeApp(config);

    this.auth = app.auth();
    this.db = app.database();

    this.googleProvider = new app.auth.GoogleAuthProvider();
    this.facebookProvider = new app.auth.FacebookAuthProvider();
  }

  // *** Auth API ***

  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignInWithGoogle = () => this.auth.signInWithPopup(this.googleProvider);

  doSignInWithFacebook = () => this.auth.signInWithPopup(this.facebookProvider);

  doSignOut = () => this.auth.signOut();

  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = password => this.auth.currentUser.updatePassword(password);

  // *** Merge Auth and DB User API *** //
  onAuthUserListener = (next, fallback) =>
    this.auth.onAuthStateChanged(authUser => {
      if (authUser) {
        console.log(authUser);
        this.user(authUser.uid)
          .once("value")
          .then(snapshot => {
            console.log(snapshot);
            const dbUser = snapshot.val();
            console.log(dbUser);
            // default empty roles
            if (!dbUser.roles) {
              dbUser.roles = [];
         }
            // merge auth and db user
            authUser = {
              uid: authUser.uid,
              email: authUser.email,
              ...dbUser
            };
            next(authUser);
          });
      } else {
        fallback();
      }
    });

  // *** User API ***

  user = uid => this.db.ref(`users/${uid}`);

  users = () => this.db.ref("users");
}

export default Firebase;

import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
} from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

import { doc, getFirestore, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAv6c07DTc8PB7Db4yyNWmhPegMDTThJXg",
  authDomain: "users-chat-38fc0.firebaseapp.com",
  projectId: "users-chat-38fc0",
  storageBucket: "users-chat-38fc0.appspot.com",
  messagingSenderId: "529598431949",
  appId: "1:529598431949:web:b933ed5b4b4f698a199f84",
};

const app = initializeApp(firebaseConfig);

const storage = getStorage();

const auth = getAuth();

const db = getFirestore();

export const firebaseSignUp = async (email, password, displayName, file) => {
  try {
    const userCreds = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const date = new Date().getTime();

    const storageRef = ref(storage, `${displayName + date}`);

    const uploadTask = uploadBytesResumable(storageRef, file);

    await uploadTask.on(
      (error) => {
        alert(error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        updateProfile(userCreds.user, {
          displayName: displayName,
          photoURL: downloadURL,
        });

        await setDoc(doc(db, "users", userCreds.user.uid), {
          email: email,
          displayName: displayName,
          photoURL: downloadURL,
          uid: userCreds.user.uid,
        });

        await setDoc(doc(db, "usersChat", userCreds.user.uid), {});
      }
    );

    return userCreds.user;
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    alert(errorCode, errorMessage);
  }
};

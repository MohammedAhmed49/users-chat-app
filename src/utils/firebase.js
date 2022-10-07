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

import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAv6c07DTc8PB7Db4yyNWmhPegMDTThJXg",
  authDomain: "users-chat-38fc0.firebaseapp.com",
  projectId: "users-chat-38fc0",
  storageBucket: "users-chat-38fc0.appspot.com",
  messagingSenderId: "529598431949",
  appId: "1:529598431949:web:b933ed5b4b4f698a199f84",
};

const app = initializeApp(firebaseConfig);

export const storage = getStorage();

export const auth = getAuth();

export const db = getFirestore();

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
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          console.log(downloadURL);
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
        });
      }
    );

    return userCreds.user;
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    alert(errorCode, errorMessage);
    return null;
  }
};

export const firebaseSearchUser = async (displayName) => {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("displayName", "==", displayName));
  try {
    const querySnapshot = await getDocs(q);
    let user = null;
    querySnapshot.forEach((doc) => {
      user = doc.data();
    });
    return user;
  } catch (error) {
    alert(error);
    return null;
  }
};

export const firebaseGetUserChats = async (
  currentUser,
  otherUser,
  combinedId
) => {
  const docRef = doc(db, "chats", combinedId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    try {
      await setDoc(docRef, { messages: [] });

      await updateDoc(doc(db, "usersChat", currentUser.uid), {
        [combinedId + ".userInfo"]: {
          uid: otherUser.uid,
          displayName: otherUser.displayName,
          photoURL: otherUser.photoURL,
        },
        [combinedId + ".date"]: serverTimestamp(),
      });

      await updateDoc(doc(db, "usersChat", otherUser.uid), {
        [combinedId + ".userInfo"]: {
          uid: currentUser.uid,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
        },
        [combinedId + ".date"]: serverTimestamp(),
      });
    } catch (error) {
      alert(error);
    }
  }
};

export const firebaseSendMsg = async (chatId, img, text, id, currentUser) => {
  console.log(img);
  if (img) {
    console.log(img);
    const storageRef = ref(storage, id);

    const uploadTask = uploadBytesResumable(storageRef, img);

    await uploadTask.on(
      (error) => {
        alert(error);
      },
      async () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          console.log(downloadURL);
          await updateDoc(doc(db, "chats", chatId), {
            messages: arrayUnion({
              id: id,
              text: text,
              senderId: currentUser.uid,
              date: Timestamp.now(),
              img: downloadURL,
            }),
          });
        });
      }
    );
  } else {
    await updateDoc(doc(db, "chats", chatId), {
      messages: arrayUnion({
        id: id,
        text: text,
        senderId: currentUser.uid,
        date: Timestamp.now(),
      }),
    });
  }
};

export const updateLastMessage = async (
  currentUser,
  otherUser,
  chatId,
  text
) => {
  await updateDoc(doc(db, "usersChat", currentUser.uid), {
    [chatId + ".lastMessage"]: {
      text: text,
    },
    [chatId + ".date"]: serverTimestamp(),
  });

  await updateDoc(doc(db, "usersChat", otherUser.uid), {
    [chatId + ".lastMessage"]: {
      text: text,
    },
    [chatId + ".date"]: serverTimestamp(),
  });
};

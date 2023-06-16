import React, { useRef, useState } from 'react';
import './App.css';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore'


firebase.initializeApp({
  apiKey: "AIzaSyDu7iAyr37JewCQNwSdZAfaP2U2x3ciCz4",
  authDomain: "superchat-b5235.firebaseapp.com",
  projectId: "superchat-b5235",
  storageBucket: "superchat-b5235.appspot.com",
  messagingSenderId: "91126836855",
  appId: "1:91126836855:web:4182d804fd839c3cf2e072"
})

const auth = firebase.auth();
const firestore = firebase.firestore();



function App() {
  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <header className="App-header">
        <h1>⚛️LiveChat</h1>
        <SignOut />
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>

    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  return (
    <button className='sign-in' onClick={signInWithGoogle} > Sign in with Google </button>
  )
}

function SignOut() {
  return auth.currentUser && (
    <button  onClick={() => auth.signOut()}> Sign Out </button>
  )
}

function ChatRoom() {
  const dummy = useRef()
  const messagesRef = firestore.collection("messages");
  const query = messagesRef.orderBy('createdAt').limit(25);
  const [messages] = useCollectionData(query, { idField: 'id' });
  const [formValue, setFormValue] = useState("");
  

  
  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    });

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (<>
    <main>
      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
      <div ref={dummy} ></div>
    </main>
    <form onSubmit={sendMessage} >
      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} />
      <button type='submit' disabled={!formValue}> Send </button>
    </form>
  </> )}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL  } alt='Profile photo'/>
      <p>{text}</p>
    </div>    
    )}

export default App;

// firebase.js
const firebaseConfig = {
  apiKey: "AIzaSyCCpHJoTlbi1P_z-C9cxptXk6Lcfv2yAI",
  authDomain: "sla157.firebaseapp.com",
  databaseURL: "https://sla157-default-rtdb.firebaseio.com",
  projectId: "sla157",
  storageBucket: "sla157.appspot.com",
  messagingSenderId: "1038690976877",
  appId: "1:1038690976877:web:02445ee0abf9f64613e444"
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);

// Cria a referência do banco
const db = firebase.database();

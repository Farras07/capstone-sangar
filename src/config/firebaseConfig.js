const { initializeApp } = require('firebase/app')

const firebaseConfig = {
  apiKey: 'AIzaSyCoLYN4MbStCeFEdj8xEtPhUXN-w2bmz8w',
  authDomain: 'coral-sum-402511.firebaseapp.com',
  projectId: 'coral-sum-402511',
  storageBucket: 'coral-sum-402511.appspot.com',
  messagingSenderId: '95836983208',
  appId: '1:95836983208:web:994277a200e766a2de579d'
}
  
const app = initializeApp(firebaseConfig)

module.exports = app

const admin = require('../config/firebaseConfig')

async function signInWithGoogle(idToken) {
  try {
    const userCredential = await admin.auth().signInWithGoogleIdToken(idToken);
    const user = userCredential.user;
    console.log('Successfully signed in with Google:', user.displayName);
    return user;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
}

module.exports = signInWithGoogle;
//authentication
firebase.auth().onAuthStateChanged((user) => {
    if (user) location.replace("/");
});

//login
function login() {
    event.preventDefault();
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
    firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .catch((error) => {
            document.getElementById("error").innerHTML = error.message;
        });
}

//sign up
function signUp() {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .catch((error) => {
            document.getElementById("error").innerHTML = error.message;
        });
}

//forgot password
function forgotPassword() {
    event.preventDefault();
    const email = document.getElementById("email").value;
    firebase
        .auth()
        .sendPasswordResetEmail(email)
        .then(() => {
            alert("Reset link sent to your email id");
        })
        .catch((error) => {
            document.getElementById("error").innerHTML = error.message;
        });
}

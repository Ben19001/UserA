const loginForm = document.querySelector('.loginForm');
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(loginForm);
    const urlEncoded = new URLSearchParams(fd).toString();
    fetch("https://localhost:5000/login", {
        method: "POST",
        body: urlEncoded,
        headers: {
            "Content-type": "application/x-www-form-urlencoded",
        }
    })
    .then(response => response.json())
    .then(data => {
        if(data.doesUserExist && !data.isCorrectPassword) {
            alert("Incorrect password for your account");
        } else if(!data.doesUserExist && !data.isCorrectPassword){
            alert("No user was found for that email");
        } else {
            alert("Valid login credentials");
        }
    })
})

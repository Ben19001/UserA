const createPasswordForm = document.querySelector('.createPasswordForm');
createPasswordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(createPasswordForm);
    const urlEncoded = new URLSearchParams(fd).toString();
    fetch("https://localhost:5000/reset/createPassword", {
        method: 'POST',
        body: urlEncoded,
        headers: {
            "Content-type": "application/x-www-form-urlencoded",
        },
        credentials: 'include'
    }).then((res) => {
        if (res.redirected) {
            window.location.href = res.url;
            return;
        }
        return res.json();
    })
    .then(data => {
        if(!data.isMatchingPassword) {
            alert("Passwords don't match");
        } else if(!data.isValidPassword) {
            alert("Password must be at least 8 characters and must contain a special character");
        }
    })
    .catch(console.error);
})
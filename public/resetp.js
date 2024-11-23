const resetPasswordForm = document.querySelector('.resetPasswordForm');
resetPasswordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(resetPasswordForm);
    const urlEncoded = new URLSearchParams(fd).toString();
    fetch("https://localhost:5000/reset", {
        method: "POST",
        body: urlEncoded,
        headers: {
            "Content-type": "application/x-www-form-urlencoded",
        }
    })
    .then(response => response.json())
    .then(data => {
        if(!data.doesUserExist) {
            alert("There is no account associated with this email.");
       } else {
            alert("We sent you an email where you can reset your password.");
        }
    })
})
const form = document.querySelector('.registerForm');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const urlencoded = new URLSearchParams(fd).toString();
    fetch("https://localhost:5000/register", {
        method: "POST",
        body: urlencoded,
        headers: {
            "Content-type": "application/x-www-form-urlencoded",
        }
    })    
    .then(response => response.json())
    .then(data => {
        if(data.isAdded && data.isValidPassword) {
            alert("An account already exists for you with this email.");
        } else if(!data.isAdded && !data.isValidPassword) {
            alert("Password must be at least 8 characters and must contain a special character");
        } else {
            alert("Please check your email to confirm your account.");
        }
    });

})
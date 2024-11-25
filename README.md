This is a full-stack application that implements a user authentication system using Node.js, Express, MongoDB, Vanilla JavaScript, HTML/CSS, and Email-based token validation. The app allows users to register, log in, and reset their passwords through an email-based verification process.

**Key features of this application include:**

-User Registration: Users can sign up by providing their email and password. The system validates passwords for strength and checks if the email is already registered.

-Email Verification: Upon successful registration, users receive an email with a token to confirm their email address. The account is activated only after the email is verified.

-Login System: Users can log in using their registered email and password. The system hashes passwords for security and validates user credentials.

-Password Reset: Users can reset their passwords via an email token, which is valid for one hour. After clicking the reset link, they can create a new password.



**Technologies Used:**

-Backend: Node.js, Express.js

-Frontend: Vanilla JavaScript, HTML/CSS

-Database: MongoDB



**Authentication:** Password hashing with bcrypt, CSRF protection



**Email:** Nodemailer for sending registration and password reset emails


**Security:** HTTPS, CSRF protection, session management, token-based authentication

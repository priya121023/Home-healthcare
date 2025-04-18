js
// script.js
const burger = document.querySelector('.burger');
const navLinks = document.querySelector('.nav-links');
const navLinksLi = document.querySelectorAll('.nav-links li');

burger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    burger.classList.toggle('toggle');

    navLinksLi.forEach((link, index) => {
        if (link.style.animation) {
            link.style.animation = '';
        } else {
            link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
        }
    });
});

// Optional: Add smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });

        // Close the mobile menu after clicking a link
        if (navLinks.classList.contains('open')) {
            navLinks.classList.remove('open');
            burger.classList.remove('toggle');
            navLinksLi.forEach(link => {
                link.style.animation = '';
            });
        }
    });
});
// server.js
const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Route: Contact Form Submission
app.post('/contact', async (req, res) => {
    const { name, email, phone, message } = req.body;

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: email,
            to: process.env.EMAIL_USER,
            subject: 'New Contact Form Submission',
            text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nMessage:\n${message}`
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Message sent successfully!' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to send message.', error: err });
    }
});

// Route: Appointment Request
app.post('/appointment', async (req, res) => {
    const { patientName, preferredDate, preferredTime, serviceNeeded } = req.body;

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: 'New Appointment Request',
            text: `Patient Name: ${patientName}\nDate: ${preferredDate}\nTime: ${preferredTime}\nService: ${serviceNeeded}`
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Appointment request sent!' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to request appointment.', error: err });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
// Contact form submission
document.querySelector('.contact-form form').addEventListener('submit', async function (e) {
  e.preventDefault();
  const data = {
      name: this.name.value,
      email: this.email.value,
      phone: this.phone.value,
      message: this.message.value
  };

  const res = await fetch('/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
  });

  const result = await res.json();
  alert(result.message);
  this.reset();
});

// Appointment form submission
document.querySelector('.appointment-form').addEventListener('submit', async function (e) {
  e.preventDefault();
  const data = {
      patientName: this['patient-name'].value,
      preferredDate: this['preferred-date'].value,
      preferredTime: this['preferred-time'].value,
      serviceNeeded: this['service-needed'].value
  };

  const res = await fetch('/appointment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
  });

  const result = await res.json();
  alert(result.message);
  this.reset();
});


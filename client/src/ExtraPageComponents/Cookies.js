import React from 'react';

function CookiesPolicy() {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Cookies Policy</h1>
            <p className="mb-2">
                At EquipMe, we prioritize your privacy and data security. This cookies policy explains how we use cookies and similar technologies on our website.
            </p>
            <h2 className="text-xl font-semibold mb-2">What are Cookies?</h2>
            <p className="mb-2">
                Cookies are small text files that websites place on your device as you are browsing. They are processed and stored by your web browser. In and of themselves, cookies are harmless and serve crucial functions for websites. However, they can also be used maliciously. As such, we choose to use them responsibly.
            </p>
            <h2 className="text-xl font-semibold mb-2">How We Use Cookies</h2>
            <p className="mb-2">
                We use JWT (JSON Web Tokens) with Flask-JWT-Extended to manage cookies on our site. These cookies help us authenticate users and keep their sessions secure. They play a crucial role in our website's functionality, enabling a smoother and more secure user experience.
            </p>
            <h2 className="text-xl font-semibold mb-2">Your Choices Regarding Cookies</h2>
            <p className="mb-2">
                If you prefer to avoid the use of cookies on our website, you can disable cookies in your browser settings. Please note that doing so may affect the functionality and your experience of our website.
            </p>
            <h2 className="text-xl font-semibold mb-2">More Information</h2>
            <p className="mb-2">
                For more detailed information about cookies and how they can be managed and deleted, please visit <a href="https://www.aboutcookies.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">www.aboutcookies.org</a>.
            </p>
        </div>
    );
}

export default CookiesPolicy;

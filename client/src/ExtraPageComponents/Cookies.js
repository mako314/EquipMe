import React from 'react';

function CookiesPolicyPage() {
    return (
        <div className="bg-gray-100">
            <div className="container mx-auto px-6 py-8">
                <div className="text-center">
                    <h2 className="text-4xl font-semibold text-gray-800 mb-2">Cookies Policy</h2>
                    <h3 className="text-2xl font-medium text-gray-600">How We Use Cookies</h3>
                </div>

                <div className="mt-12">
                    <div className="max-w-2xl mx-auto">
                        {/* Cookies Policy Content */}
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h2 className="text-3xl font-semibold text-gray-800 mb-4">Understanding Cookies</h2>
                            <p className="text-gray-600 mb-4">
                                Cookies are small text files that are placed on your device to store data that can be recalled by a web server in the domain that placed the cookie. We use cookies and similar technologies to store and honor your preferences and settings, enable you to sign-in, provide interest-based advertising, combat fraud, analyze how our products perform, and fulfill other legitimate purposes.
                            </p>

                            <h2 className="text-3xl font-semibold text-gray-800 mt-6 mb-4">Our Use of Cookies</h2>
                            <p className="text-gray-600 mb-4">
                                EquipMe uses cookies for several purposes. We use them to remember your preferences, understand how you interact with our website, and improve your user experience. Our platform uses JWT (JSON Web Tokens) for session management, which enhances security and improves the efficiency of our services.
                            </p>

                            <h2 className="text-3xl font-semibold text-gray-800 mt-6 mb-4">Managing Cookies</h2>
                            <p className="text-gray-600">
                                You have the ability to accept or decline cookies. Most web browsers automatically accept cookies, but you can usually modify your browser setting to decline cookies if you prefer. If you choose to decline cookies, you may not be able to fully experience the interactive features of EquipMe services or websites you visit.
                            </p>

                            <p className="text-gray-600 mt-6 mb-4">
                                For more detailed information about cookies and how they can be managed and deleted, please visit <a href="https://www.aboutcookies.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">www.aboutcookies.org</a>.
                            </p>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CookiesPolicyPage;

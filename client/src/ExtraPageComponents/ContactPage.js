import React, { useState, useContext } from 'react';
import ApiUrlContext from '../Api';
import {toast} from 'react-toastify'

function ContactUsPage() {
    const apiUrl = useContext(ApiUrlContext)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch(`${apiUrl}contact/form`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
    
            if (response.ok) {
                const jsonResponse = await response.json();
                // console.log(jsonResponse)
                toast.success(`📩 Succesfully sent your message `,
                {
                  "autoClose" : 2000
                })
                setFormData({
                    name: '',
                    email: '',
                    subject: '',
                    message: '',
                })
                // Handle success - show success message or reset form
                // You can use setFormData to reset the form if needed
            } else {
                // Handle errors - show error message
                console.error('Form submission failed');
                toast.error(`📧 💥 Unable to send your message `,
                {
                  "autoClose" : 2000
                })
            }
        } catch (error) {
            // Handle network errors
            console.error('Network error:', error)
        }
    }

    return (
        <div className="bg-gray-100">
            <div className="container mx-auto px-6 py-8">
                <div className="text-center">
                    <h2 className="text-4xl font-semibold text-gray-800 mb-2">Contact Us</h2>
                    <p className="text-lg text-gray-600">We're here to help and answer any question you might have.</p>
                </div>

                <div className="mt-8 max-w-md mx-auto">
                    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg">
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="subject" className="block text-gray-700 text-sm font-bold mb-2">Subject</label>
                            <input
                                type="subject"
                                id="subject"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="message" className="block text-gray-700 text-sm font-bold mb-2">Message</label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                rows="4"
                                required
                            ></textarea>
                        </div>

                        <div className="flex items-center justify-between">
                            <button
                                type="submit"
                                className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded bg-amber-500 px-5 text-sm font-medium tracking-wide text-white shadow-md shadow-amber-200 transition duration-300 hover:bg-emerald-600 hover:shadow-sm hover:shadow-emerald-200 focus:bg-emerald-700 focus:shadow-sm focus:shadow-emerald-200 focus-visible:outline-none disabled:cursor-not-allowed disabled:border-emerald-300 disabled:bg-emerald-300 disabled:shadow-none"
                            >
                                Send Message
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ContactUsPage;

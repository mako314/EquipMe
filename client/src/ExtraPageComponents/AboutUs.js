import React from 'react';

function AboutUsPage() {
    return (
        <div className="bg-gray-100">
            <div className="container mx-auto px-6 py-8">
                <div className="text-center">
                    <h2 className="text-4xl font-semibold text-gray-800 mb-2">About Us</h2>
                    <h3 className="text-2xl font-medium text-gray-600">We're passionate about what we do</h3>
                </div>

                <div className="mt-12">
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h4 className="text-lg font-semibold mb-4">Our Mission</h4>
                            <p className="text-gray-600">
                                Our mission is to deliver outstanding service and solutions through dedication and excellence. We strive to be a leader in our industry, fostering a culture of trust and collaboration among our clients and team members.
                            </p>
                        </div>

                        <div className="mt-6 bg-white p-6 rounded-lg shadow-lg">
                            <h4 className="text-lg font-semibold mb-4">Our Team</h4>
                            <p className="text-gray-600">
                                We are a team of experienced professionals dedicated to making a difference. Our diverse backgrounds and skills come together to create innovative solutions and provide exceptional service.
                            </p>
                        </div>

                        <div className="mt-6 bg-white p-6 rounded-lg shadow-lg">
                            <h4 className="text-lg font-semibold mb-4">Our Values</h4>
                            <p className="text-gray-600">
                                Integrity, innovation, and teamwork are at the core of everything we do. We believe in building long-lasting relationships based on respect and mutual trust.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AboutUsPage;

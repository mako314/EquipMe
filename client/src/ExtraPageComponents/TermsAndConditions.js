import React from 'react';

function TermsAndConditionsPage() {
    return (
        <div className="bg-gray-100">
            <div className="container mx-auto px-6 py-8">
                <div className="text-center">
                    <h2 className="text-4xl font-semibold text-gray-800 mb-2">Terms and Conditions</h2>
                    <h3 className="text-2xl font-medium text-gray-600">User Agreement and Guidelines</h3>
                </div>

                <div className="mt-12">
                    <div className="max-w-2xl mx-auto">
                        {/* Terms and Conditions Content */}
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Introduction</h2>
                            <p className="text-gray-600 mb-4">
                                Welcome to EquipMe. By accessing or using our platform, you agree to be bound by these terms and conditions. Please read them carefully.
                            </p>

                            <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">Use of Our Platform</h2>
                            <p className="text-gray-600 mb-4">
                            EquipMe provides a versatile online platform for users to rent and list a wide range of equipment. Our platform is dedicated to fostering a community of trust and reliability. Users are expected to ensure that their listings and transactions comply fully with our guidelines, legal standards, and ethical practices. This includes accurate descriptions of equipment, adherence to safety norms, and the legality of items listed. Users must also respect the agreed-upon terms of rental, including duration, payment, and the condition of the equipment.
                            </p>

                            <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">Account Responsibilities</h2>
                            <p className="text-gray-600">
                            As a user of EquipMe, you are responsible for maintaining the confidentiality of your account information, including your password. The integrity and security of your account are crucial. EquipMe is not liable for any loss or damage resulting from unauthorized use of your account. It is vital to promptly inform EquipMe of any unauthorized use or security breach to ensure prompt action and prevent potential misuse.
                            </p>

                            <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">Liability and Disclaimers</h2>
                            <p className="text-gray-600 mb-4">
                            EquipMe aims to provide a reliable and effective service but does not guarantee uninterrupted access or error-free functioning of the platform. We are not liable for indirect, incidental, or consequential damages arising from your use of EquipMe. This includes loss of profits, data, or other intangible losses resulting from platform access, third-party conduct, content obtained, or unauthorized access to your content. Our services are provided on an "as is" and "as available" basis, and we disclaim all warranties, express or implied, including merchantability and fitness for a particular purpose.
                            </p>

                            <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">Changes to Terms and Conditions</h2>
                            <p className="text-gray-600">
                            EquipMe reserves the right to modify these terms and conditions at any time. Changes become effective immediately upon posting on our platform. Your continued use of EquipMe after such modifications indicates your acceptance of the new terms. We encourage regular review of the terms and conditions to stay informed of any updates. The latest version of these terms will always be accessible on our website for your reference.
                            </p>

                            <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">Contact Information</h2>
                            <p className="text-gray-600">
                                For any questions or concerns about these terms and conditions, please contact us at bispo.swe@gmail.com .
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TermsAndConditionsPage;

import React from 'react';

function AboutUsPage() {
    return (
        <div className="bg-gray-100">
            <div className="container mx-auto px-6 py-8">
                <div className="text-center">
                    <h2 className="text-4xl font-semibold text-gray-800 mb-2">About EquipMe</h2>
                    <h3 className="text-2xl font-medium text-gray-600">Empowering Communities through Shared Resources</h3>
                </div>

                <div className="mt-12">
                    <div className="max-w-2xl mx-auto">
                        {/* Our Story */}
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            {/* Content Section */}
                    <h2 className="text-3xl font-semibold text-gray-800 mt-4 md:mt-0 mb-4">Our Story</h2>
                    
                    {/* Expanded Narrative */}
                    <p className="text-gray-600 mb-4">
                        EquipMe's inception is deeply intertwined with the day-to-day realities of the construction industry. My father's experiences in this sector significantly influenced the development of this platform.
                    </p>
                    <p className="text-gray-600 mb-4">
                        He often needed specialized equipment like a jackhammer for a day's work or set-up lights for night projects. The need for equipment like heavy-duty trailers, which would then sit unused, was common.
                    </p>
                    <p className="text-gray-600 mb-4">
                        This platform envisions a community where resources can be shared efficiently. It connects those with idle equipment, like an excavator or scaffolding, to those in need for short periods.
                    </p>
                    <p className="text-gray-600 mb-4">
                        Imagine a local contractor needing a cement mixer for a weekend or a landscaper requiring a specific power tool. EquipMe connects these needs with available resources.
                    </p>
                    <p className="text-gray-600 mb-4">
                        Beyond heavy machinery, EquipMe caters to a range of tools and equipment. It's ideal for contractors, DIY enthusiasts, and anyone in need of specific tools for short-term projects.
                    </p>
                    <p className="text-gray-600">
                        More than a rental service, EquipMe embodies the spirit of collaboration and resourcefulness in the construction industry. It's a platform born from personal experience, aiming to make equipment rental accessible and community-driven.
                    </p>
                    </div>
                      {/* Mission and Values */}
                      <div className="bg-white p-6 rounded-lg shadow-lg mt-4">
                            <h3 className="text-xl font-semibold mb-6">Our Mission</h3>
                            <p className="text-gray-600">
                                At EquipMe, we're driven by a simple yet powerful mission: to revolutionize the way tools and equipment are utilized across communities...
                            </p>

                            <h3 className="text-xl font-semibold mb-6 mt-8">Our Values</h3>
                            <ul className="text-gray-600 list-disc list-inside">
                                <li><strong>Community Empowerment:</strong> We believe in the power of community. EquipMe is more than a platform; it's a community...</li>
                                <li><strong>Sustainability:</strong> By promoting the sharing and efficient use of tools and equipment, we contribute to a more sustainable...</li>
                                <li><strong>Innovation and Accessibility:</strong> We are committed to continuous innovation to ensure our platform remains accessible...</li>
                                <li><strong>Trust and Reliability:</strong> Building a reliable and secure environment for our users is paramount. We foster trust...</li>
                                <li><strong>Inclusivity:</strong> EquipMe is for everyone – from professional contractors to DIY enthusiasts. We champion inclusivity...</li>
                                <li><strong>Education and Support:</strong> We aim to educate and support our users, not just in using our platform, but also in understanding...</li>
                            </ul>

                            <h3 className="text-xl font-semibold mb-6 mt-8">Our Vision</h3>
                            <p className="text-gray-600">
                            Looking ahead, EquipMe aspires to be at the forefront of community-based equipment sharing and rental services. We envision a future where our platform serves as a key enabler for projects and ventures, big and small, fostering a culture of sharing and collaboration that transcends geographical boundaries.
                            </p>

                            <p className="text-gray-600 mt-2">
                            We see EquipMe not just as a service, but as a movement – one that encourages more responsible and efficient use of resources, empowers individuals and communities, and paves the way for a more interconnected and collaborative society.
                            </p>
                        </div>

                        {/* Gratitude Section */}
                        <div className="mt-6 bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-3xl font-semibold mb-4">Gratitude</h2>

                        <p className="text-gray-600 mt-4">
                            EquipMe didn't just materialize out of thin air; it was nurtured through the support and contributions of many. Initially conceptualized during a bootcamp, it started as a group effort with Patryk Suchecki and Sean Keough. Sean, in particular, played a significant role in developing the bulk upload feature, which has been crucial to our platform.
                        </p>

                        <p className="text-gray-600 mt-4">
                            I want to extend my deepest gratitude to Mai T Garcia, a peer from the bootcamp, whose encouragement and regular check-ins were a source of constant support. Her insights and experiences shared from her professional journey were not only helpful but also inspiring.
                        </p>

                        <p className="text-gray-600 mt-4">
                            Gray Angelo, you were the catalyst for this venture. Your encouragement to bring this idea to life and your support in navigating through the early challenges have been invaluable. Your assistance with database intricacies and idea validation has been instrumental.
                        </p>

                        <p className="text-gray-600 mt-4">
                            To Spencer Mitchell and Lucas De Oliveira, my gratitude for your unwavering support. Spencer, your feedback on my endless streams of ideas, videos, and images has been a cornerstone of this project's development. Lucas, your input has also been incredibly helpful.
                        </p>

                        <p className="text-gray-600 mt-4">
                            A special shoutout to Zack Bishop, Joel Ezzi, Logan Pajuelo, and Cyrus Gomez. Your companionship during the long coding hours provided much-needed camaraderie and encouragement.
                        </p>

                        <p className="text-gray-600 mt-4">
                            Branden Lattanzi, your presence and encouragement to keep coding and improving have been a constant motivation. Thank you for always being there without ever being a distraction.
                        </p>

                        <p className="text-gray-600 mt-4"> 
                            And lastly, to my family, the bedrock of my life. Your love and support are the foundation upon which all of this is built. I am endlessly grateful for everything.
                        </p>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AboutUsPage;

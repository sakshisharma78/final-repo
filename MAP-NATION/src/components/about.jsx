// AboutUs.jsx
import React from 'react';
import './about.css'; // Create a CSS file for styles

const AboutUs = () => {
    const teamMembers = [
        { name: 'Mudity Kumar', image: '/pp.webp', testimonial: 'The AI/ML specialist played a crucial role in managing the AI components of the project, ensuring seamless neural network integration that elevated the system intelligence' },
        { name: 'Sakshi sharma', image: '/pp.webp', testimonial: 'Our backend expert ensured that the system core functionality was robust and efficient, flawlessly handling data flow and server-side logic.' },
        { name: 'Arsh Bhardawaj', image: '/pp.webp', testimonial: 'One of our frontend developers was instrumental in delivering a smooth, user-friendly interface, ensuring that the design was not only visually appealing but also highly interactive' },
        { name: 'Aadrika Jain', image: '/pp.webp', testimonial: 'One of our frontend developers was instrumental in delivering a smooth, user-friendly interface, ensuring that the design was not only visually appealing but also highly interactive' },
        { name: 'Shiwangi Singh', image: '/pp.webp', testimonial: 'Another frontend developer contributed by crafting a responsive and intuitive UI, providing an engaging experience for users across devices.' },
        { name: 'Harshita Agarwal', image: '/pp.webp', testimonial: 'The third frontend developer focused on optimizing user interaction, making sure the interface was both sleek and functional, elevating the overall user experience' },
    ];
    const handleBack = () => {
        navigate('/'); // Navigate to the Home page
    };


    return (
        <div className="about-us">
            {/* Background and Project Info */}
            <div className="about-header">
                <div className="header-content">
                    <h1>About Our Project</h1>
                    <p>
                        At Map Nation, we are dedicated to providing quality education through our innovative platform, offering a wide range of courses tailored to various learning needs. Our centralized resources ensure a seamless experience for students, while instructors benefit from a unified dashboard to monitor progress in real-time. With personalized learning paths and AI integration, we empower students and instructors alike to achieve their educational goals efficiently.
                    </p>
                </div>
            </div>

            {/* Team Section */}
            <div className="team-section">
                <h2 className="team-heading">OUR TEAM</h2> {/* Added Team Heading */}
                <div className="team-row">
                    {teamMembers.slice(0, 3).map((member, index) => (
                        <div key={index} className="team-member">
                            <img src={member.image} alt={`${member.name}`} className="member-photo" />
                            <h3>{member.name}</h3>
                            <p>{member.testimonial}</p>
                        </div>
                    ))}
                </div>
                <div className="team-row">
                    {teamMembers.slice(3, 6).map((member, index) => (
                        <div key={index} className="team-member">
                            <img src={member.image} alt={`${member.name}`} className="member-photo" />
                            <h3>{member.name}</h3>
                            <p>{member.testimonial}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AboutUs;

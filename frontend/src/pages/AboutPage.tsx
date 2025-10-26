import { Mail, Users, Target, Heart } from 'lucide-react';

const AboutPage = () => {
  const teamMembers = [
    {
      id: '4NI24IS400',
      name: 'Akshay Vinayak Hegde',
      email: '2024lis_akshayvinayakhegde_a@nie.ac.in'
    },
    {
      id: '4NI23IS035',
      name: 'B.G Shaman',
      email: '2023is_bgshaman_a@nie.ac.in'
    },
    {
      id: '4NI23IS038',
      name: 'Bimal K L',
      email: '2023is_bimalkl_a@nie.ac.in'
    },
    {
      id: '4NI23IS007',
      name: 'Adarsh Kumar',
      email: '2023is_adarshkumar_a@nie.ac.in'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">About FundRise</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Empowering dreamers and innovators to bring their ideas to life through community support and crowdfunding.
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Target className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Our Mission</h3>
            <p className="text-gray-600">
              To democratize funding and make it accessible for everyone with a great idea.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <Users className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Community First</h3>
            <p className="text-gray-600">
              Building a supportive community where creators and backers connect meaningfully.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
              <Heart className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Passion Driven</h3>
            <p className="text-gray-600">
              Supporting passionate individuals who want to make a difference in the world.
            </p>
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-white rounded-lg shadow-xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Meet Our Team</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            A dedicated team of students from NIE, passionate about creating innovative solutions for crowdfunding.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <div 
                key={member.id}
                className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 text-center hover:shadow-lg transition-shadow duration-300"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mb-4 text-white text-2xl font-bold">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-sm text-gray-500 mb-3 font-mono">{member.id}</p>
                <div className="flex items-center justify-center space-x-2 text-gray-600">
                  <Mail className="h-4 w-4" />
                  <a 
                    href={`mailto:${member.email}`}
                    className="text-xs hover:text-blue-600 transition-colors break-all"
                  >
                    {member.email}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">Join Us on This Journey</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Whether you're a creator with a vision or a backer looking to support innovation, 
              FundRise is here to make crowdfunding simple, transparent, and effective.
            </p>
            <div className="flex justify-center space-x-4">
              <a 
                href="/create" 
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Start a Project
              </a>
              <a 
                href="/projects" 
                className="bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
              >
                Browse Projects
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;

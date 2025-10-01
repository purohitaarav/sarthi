import React from 'react';
import { Code, Database, Server, Zap } from 'lucide-react';

const About = () => {
  const techStack = [
    {
      category: 'Frontend',
      icon: Code,
      technologies: [
        'React 18',
        'React Router',
        'Tailwind CSS',
        'Lucide Icons',
        'Axios',
      ],
    },
    {
      category: 'Backend',
      icon: Server,
      technologies: [
        'Node.js',
        'Express.js',
        'RESTful API',
        'JWT Authentication',
        'bcryptjs',
      ],
    },
    {
      category: 'Database',
      icon: Database,
      technologies: [
        'SQLite3',
        'SQL Queries',
        'Database Models',
        'Foreign Keys',
      ],
    },
  ];

  const features = [
    'Full-stack architecture with clear separation of concerns',
    'RESTful API with CRUD operations',
    'Modern React with hooks and functional components',
    'Responsive UI with Tailwind CSS',
    'SQLite database with proper schema design',
    'Environment-based configuration',
    'Error handling and validation',
    'Development and production modes',
  ];

  return (
    <div className="px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About Sarthi</h1>
        <p className="text-xl text-gray-600 mb-8">
          A modern full-stack web application template designed for rapid development
        </p>

        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Technology Stack</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {techStack.map((stack, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center mb-4">
                  <stack.icon className="w-6 h-6 text-primary-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    {stack.category}
                  </h3>
                </div>
                <ul className="space-y-2">
                  {stack.technologies.map((tech, i) => (
                    <li key={i} className="text-sm text-gray-600 flex items-center">
                      <span className="w-1.5 h-1.5 bg-primary-600 rounded-full mr-2" />
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Features</h2>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <ul className="grid md:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <Zap className="w-5 h-5 text-primary-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-primary-50 rounded-lg border border-primary-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Getting Started</h2>
          <ol className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="font-semibold mr-2">1.</span>
              <span>Install dependencies: <code className="bg-white px-2 py-1 rounded text-sm">npm run install-deps</code></span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold mr-2">2.</span>
              <span>Set up database: <code className="bg-white px-2 py-1 rounded text-sm">npm run setup-db</code></span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold mr-2">3.</span>
              <span>Start development: <code className="bg-white px-2 py-1 rounded text-sm">npm run dev</code></span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default About;

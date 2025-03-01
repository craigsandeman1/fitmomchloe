import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { getImageUrl } from '../lib/imageUtils';

// Import the image using our utility function
const heroImage = getImageUrl('contactHero');

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Preload hero image
    const img = new Image();
    img.src = heroImage;
    img.onload = () => console.log('Contact hero image loaded successfully');
    img.onerror = (e) => console.error('Error loading contact hero image:', e);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_key: import.meta.env.VITE_WEB3FORMS_KEY,
          ...formData
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSuccess(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setError('Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="relative h-[400px] overflow-hidden">
        <img 
          src={heroImage} 
          alt="Chloe - Fitness Coach" 
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative section-container h-full flex flex-col justify-center items-center text-white">
          <h1 className="font-playfair text-4xl md:text-5xl text-center mb-6">Get in Touch</h1>
          <p className="text-center max-w-2xl mx-auto text-white/90">
            Have questions about my fitness programs or want to start your transformation journey? I'm here to help!
          </p>
        </div>
      </div>

      {/* Contact Information & Form Section */}
      <div className="section-container py-20">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="font-playfair text-3xl mb-8">Contact Information</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <MapPin className="text-primary mt-1" size={24} />
                <div>
                  <h3 className="font-medium mb-1">Location</h3>
                  <p className="text-gray-600">Cape Town, South Africa</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail className="text-primary mt-1" size={24} />
                <div>
                  <h3 className="font-medium mb-1">Email</h3>
                  <a href="mailto:chloefitness@gmail.com" className="text-gray-600 hover:text-primary transition-colors">
                    chloefitness@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="text-primary mt-1" size={24} />
                <div>
                  <h3 className="font-medium mb-1">Phone</h3>
                  <a href="tel:+27829596069" className="text-gray-600 hover:text-primary transition-colors">
                    +27 82 959 6069
                  </a>
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="mt-12">
              <h3 className="font-medium mb-4">Follow Me</h3>
              <div className="flex gap-4">
                <a
                  href="https://www.instagram.com/fitmomcapetown/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-primary/10 p-3 rounded-full hover:bg-primary/20 transition-colors"
                >
                  <img src="/instagram.svg" alt="Instagram" className="w-6 h-6" />
                </a>
                <a
                  href="https://www.facebook.com/fitmomcapetown/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-primary/10 p-3 rounded-full hover:bg-primary/20 transition-colors"
                >
                  <img src="/facebook.svg" alt="Facebook" className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="font-playfair text-3xl mb-6">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  placeholder="What is this about?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  placeholder="Your message..."
                />
              </div>

              {error && (
                <div className="text-red-500 text-sm">{error}</div>
              )}

              {success && (
                <div className="text-green-500 text-sm">Message sent successfully!</div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                {loading ? (
                  'Sending...'
                ) : (
                  <>
                    Send Message
                    <Send size={16} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

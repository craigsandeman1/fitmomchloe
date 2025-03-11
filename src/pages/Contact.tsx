// This is a test comment for Git detection
import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

// Import the contact images
import contactImage1 from '../assets/images/chloe-fitness-contact-1.webp';
// Using direct path for the second image instead of import
// import contactImage2 from '../assets/images/chloe-fitness-contact.webp';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null);

  // Add the Web3Forms API key from environment variables
  const apiKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || 'YOUR-WEB3FORMS-API-KEY';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: apiKey,
          ...formData,
          subject: formData.subject || 'New Contact Form Submission',
          to: 'chloefitness@gmail.com',
          bcc: 'fitmomchloe@gmail.com,sandemancraig@gmail.com',
          html: true,
          message: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>New Contact Form Submission</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    h1 {
      color: #FF6B6B;
      margin-bottom: 20px;
    }
    .section {
      margin-bottom: 20px;
      padding-bottom: 20px;
      border-bottom: 1px solid #eee;
    }
    .label {
      font-weight: bold;
      margin-right: 10px;
    }
  </style>
</head>
<body>
  <h1>New Contact Form Submission</h1>
  
  <div class="section">
    <p><span class="label">Name:</span> ${formData.name}</p>
    <p><span class="label">Email:</span> ${formData.email}</p>
    <p><span class="label">Subject:</span> ${formData.subject || 'Not specified'}</p>
  </div>
  
  <div class="section">
    <p><span class="label">Message:</span></p>
    <p>${formData.message.replace(/\n/g, '<br>')}</p>
  </div>
</body>
</html>`
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSubmitResult({
          success: true,
          message: 'Thank you for your message! We will get back to you soon.'
        });
        // Reset form
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      } else {
        setSubmitResult({
          success: false,
          message: 'Something went wrong. Please try again later.'
        });
      }
    } catch (error) {
      setSubmitResult({
        success: false,
        message: 'Something went wrong. Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-10">
      {/* Hero Section */}
      <section className="relative h-[60vh] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full">
          <img 
            src={contactImage1} 
            alt="Fit Mom Chloe Contact" 
            className="w-full h-full object-cover"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair text-white mb-4">
            Get In Touch
          </h1>
          <p className="text-xl text-white max-w-2xl">
            Have questions about our services or want to start your fitness journey? 
            We're here to help you achieve your goals.
          </p>
        </div>
      </section>

      {/* Contact Form and Info Section */}
      <section className="section-container py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image and Contact Info */}
          <div className="space-y-8">
            <div className="relative rounded-lg overflow-hidden h-80 mb-8">
              <img 
                src="chloe-fitness-contact.webp" 
                alt="Fit Mom Chloe" 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="space-y-4">
              <h2 className="text-3xl font-playfair text-primary">Contact Information</h2>
              <p className="text-gray-600">
                Reach out to us through any of these channels, and we'll get back to you as soon as possible.
              </p>
              
              <ul className="space-y-4 mt-6">
                <li className="flex items-start space-x-3 text-gray-700">
                  <Phone className="mt-1 text-primary" size={20} />
                  <span>082 959 6069</span>
                </li>
                <li className="flex items-start space-x-3 text-gray-700">
                  <Mail className="mt-1 text-primary" size={20} />
                  <a href="mailto:chloefitness@gmail.com" className="hover:text-primary transition-colors">
                    chloefitness@gmail.com
                  </a>
                </li>
                <li className="flex items-start space-x-3 text-gray-700">
                  <MapPin className="mt-1 text-primary" size={20} />
                  <span>Cape Town, South Africa</span>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg">
            <h2 className="text-3xl font-playfair text-primary mb-4">Send a Message</h2>
            <p className="text-gray-600 mb-6">
              Fill out the form below, and we'll respond to your inquiry as soon as possible.
            </p>
            
            {submitResult && (
              <div className={`p-4 mb-6 rounded-md ${submitResult.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                {submitResult.message}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  placeholder="Jane Doe"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  placeholder="jane@example.com"
                />
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                >
                  <option value="">Select a subject</option>
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Meal Plans">Meal Plans</option>
                  <option value="Personal Training">Personal Training</option>
                  <option value="Other">Other</option>
                </select>
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
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  placeholder="How can we help you?"
                />
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center btn-primary py-3"
              >
                {isSubmitting ? (
                  'Sending...'
                ) : (
                  <>
                    <Send size={18} className="mr-2" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact; 
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';

const Privacy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-white py-16">
      <div className="section-container max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-primary hover:text-primary/80">
            <ArrowLeft size={20} className="mr-2" />
            <span>Back to Home</span>
          </Link>
        </div>

        <h1 className="font-playfair text-4xl mb-6 text-center">Privacy Policy</h1>
        <p className="text-gray-600 text-center mb-12">
          Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-playfair mb-4">1. Introduction</h2>
            <p>
              I, Chloe at Fit Mom Chloe, am committed to protecting your privacy. This Privacy Policy explains how I collect,
              use, and safeguard your personal information when you use my website and services. By using my services,
              you agree to the collection and use of information in accordance with this policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-playfair mb-4">2. Information I Collect</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Personal Information:</strong> Name, email address, phone number, and physical address</li>
              <li><strong>Health Information:</strong> Fitness goals, health conditions, and dietary preferences</li>
              <li><strong>Account Information:</strong> Login credentials and subscription details</li>
              <li><strong>Payment Information:</strong> Payment method details (processed securely through PayFast)</li>
              <li><strong>Usage Data:</strong> How you interact with my website and services</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-playfair mb-4">3. How I Use Your Information</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Provide and personalize my services</li>
              <li>Process your payments and manage your account</li>
              <li>Send you important updates about your services</li>
              <li>Communicate about new programs and offerings</li>
              <li>Improve my services and website experience</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-playfair mb-4">4. Information Sharing</h2>
            <p>I do not sell, trade, or rent your personal information to third parties. I may share your information with:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Payment processors to handle transactions</li>
              <li>Service providers who assist in operating my website</li>
              <li>Legal authorities when required by law</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-playfair mb-4">5. Data Security</h2>
            <p>I implement appropriate security measures to protect your personal information, including:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Secure data encryption</li>
              <li>Regular security assessments</li>
              <li>Limited access to personal information</li>
              <li>Secure data storage through Supabase</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-playfair mb-4">6. Your Rights</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Opt-out of marketing communications</li>
              <li>Export your data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-playfair mb-4">7. Cookies and Tracking</h2>
            <p>
              I use cookies and similar tracking technologies to improve your browsing experience and analyze website traffic.
              You can control cookie preferences through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-playfair mb-4">8. Children's Privacy</h2>
            <p>
              My services are not intended for children under 13. I do not knowingly collect personal information from
              children under 13. If you believe I have collected information from a child under 13, please contact me
              immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-playfair mb-4">9. Changes to Privacy Policy</h2>
            <p>
              I may update this Privacy Policy from time to time. I will notify you of any changes by posting the new
              Privacy Policy on this page and updating the "Last Updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-playfair mb-4">10. Contact Information</h2>
            <p className="mb-4">If you have any questions about this Privacy Policy, please contact me at:</p>
            <p>Email: <a href="mailto:info@fitmomchloe.com" className="text-primary hover:text-primary/80">info@fitmomchloe.com</a></p>
            <p>Phone: <a href="tel:+27123456789" className="text-primary hover:text-primary/80">+27 123 456 789</a></p>
          </section>

          <div className="border-t pt-8 mt-12">
            <p>
              Please also review our{' '}
              <Link to="/terms" className="text-primary hover:text-primary/80">
                Terms and Conditions
              </Link>{' '}
              for additional information about using our services.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy; 
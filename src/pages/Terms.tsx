import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';

const Terms = () => {
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

        <h1 className="font-playfair text-4xl mb-6 text-center">Terms and Conditions</h1>
        <p className="text-gray-600 text-center mb-12">
          Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-playfair mb-4">1. Introduction</h2>
            <p>
              Welcome to Fit Mom Chloe! These Terms and Conditions govern your use of my website, products, and services,
              including meal plans, workout videos, and personal training sessions. By accessing or using my services,
              you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms,
              please do not use my services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-playfair mb-4">2. Services</h2>
            <p>I offer the following services:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Meal Plans:</strong> Customized nutrition guides designed to support your fitness journey</li>
              <li><strong>Workout Videos:</strong> Pre-recorded fitness content available through subscription</li>
              <li><strong>Personal Training:</strong> One-on-one or group fitness sessions available by booking</li>
              <li><strong>Online Coaching:</strong> Remote fitness and nutrition guidance</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-playfair mb-4">3. Account Registration</h2>
            <p>
              To access certain features of my services, you may need to create an account. You are responsible for
              maintaining the confidentiality of your account information and for all activities that occur under your account.
              I reserve the right to suspend or terminate accounts that violate these Terms and Conditions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-playfair mb-4">4. Payment and Subscriptions</h2>
            <p>
              All payments for my services are processed securely through PayFast. Prices for services are clearly displayed
              before purchase. Subscription services auto-renew until cancelled. You may cancel your subscription at any time
              through your account settings.
            </p>
            <p className="mt-4">
              <strong>Refund Policy:</strong> I do not offer refunds for digital products that have been accessed or downloaded. 
              For training sessions, cancellations must be made at least 24 hours in advance to be eligible for rescheduling or refund.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-playfair mb-4">5. Intellectual Property</h2>
            <p>
              All content provided through my services, including but not limited to meal plans, workout videos, and training
              materials, is my intellectual property or used with permission. You may not reproduce, distribute, modify, or create
              derivative works of my content without explicit written permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-playfair mb-4">6. Health Disclaimer</h2>
            <p>
              My fitness and nutrition services are for informational purposes only and are not intended to diagnose, treat, cure,
              or prevent any disease. Before starting any new fitness or nutrition program, you should consult with your healthcare provider,
              especially if you have any medical conditions or take medications.
            </p>
            <p className="mt-4">
              I am not a licensed medical professional, and my advice is not a substitute for medical advice. You are solely responsible
              for your health and well-being during and after using my services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-playfair mb-4">7. User Conduct</h2>
            <p>When using my services, you agree not to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Violate any applicable laws or regulations</li>
              <li>Share your account credentials with others</li>
              <li>Infringe on the intellectual property rights of others</li>
              <li>Engage in behavior that is harmful, threatening, or abusive</li>
              <li>Attempt to gain unauthorized access to my systems or user accounts</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-playfair mb-4">8. Privacy</h2>
            <p>
              I respect your privacy and am committed to protecting your personal information. Please review my{' '}
              <Link to="/privacy" className="text-primary hover:text-primary/80">
                Privacy Policy
              </Link>{' '}
              to understand how I collect, use, and safeguard your data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-playfair mb-4">9. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, I shall not be liable for any indirect, incidental, special, consequential, or
              punitive damages, including loss of profits, data, or goodwill, resulting from your access to or use of my services,
              even if I have been advised of the possibility of such damages.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-playfair mb-4">10. Changes to Terms</h2>
            <p>
              I reserve the right to modify these Terms and Conditions at any time. Changes will be effective immediately upon posting
              to my website. Your continued use of my services after changes indicates your acceptance of the revised terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-playfair mb-4">11. Contact Information</h2>
            <p className="mb-4">If you have any questions about these Terms and Conditions, please contact me at:</p>
            <p>Email: <a href="mailto:info@fitmomchloe.com" className="text-primary hover:text-primary/80">info@fitmomchloe.com</a></p>
            <p>Phone: <a href="tel:+27123456789" className="text-primary hover:text-primary/80">+27 123 456 789</a></p>
          </section>

          <div className="border-t pt-8 mt-12">
            <p>
              Please also review our{' '}
              <Link to="/privacy" className="text-primary hover:text-primary/80">
                Privacy Policy
              </Link>{' '}
              for additional information about how we handle your data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms; 
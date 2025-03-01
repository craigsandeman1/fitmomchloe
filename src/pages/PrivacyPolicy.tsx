const PrivacyPolicy = () => {
  return (
    <div>
      {/* Hero Section */}
      <div className="relative bg-primary/5 py-20">
        <div className="section-container">
          <h1 className="font-playfair text-4xl md:text-5xl text-center mb-6">Privacy Policy</h1>
          <p className="text-center text-gray-600 max-w-2xl mx-auto">
            Your privacy is my priority. Learn how I protect and manage your personal information.
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="section-container py-20">
        <div className="max-w-3xl mx-auto prose">
          <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
            <p className="text-gray-600 mb-4">Last updated: {new Date().toLocaleDateString()}</p>
            <div className="space-y-6">
              <section>
                <h2 className="text-2xl font-playfair mb-4">1. Introduction</h2>
                <p>
                  I, Chloe at Fit Mom Chloe ("I", "me", or "my"), respect your privacy and am committed to protecting your personal information. This Privacy Policy explains how I collect, use, disclose, and safeguard your information when you use my website and services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-playfair mb-4">2. Information I Collect</h2>
                <h3 className="text-xl mb-2">2.1 Personal Information</h3>
                <ul className="list-disc pl-6 mb-4">
                  <li>Name and contact details (email, phone number)</li>
                  <li>Billing information and payment details</li>
                  <li>Account credentials</li>
                  <li>Profile information</li>
                  <li>Communication preferences</li>
                </ul>

                <h3 className="text-xl mb-2">2.2 Fitness and Health Information</h3>
                <ul className="list-disc pl-6 mb-4">
                  <li>Physical measurements and fitness goals</li>
                  <li>Health conditions and limitations</li>
                  <li>Exercise and nutrition preferences</li>
                  <li>Progress tracking data</li>
                </ul>

                <h3 className="text-xl mb-2">2.3 Payment Information</h3>
                <ul className="list-disc pl-6 mb-4">
                  <li>Credit card information (processed securely through our payment processor)</li>
                  <li>Transaction history</li>
                  <li>Billing address</li>
                  <li>Purchase records</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-playfair mb-4">3. How I Use Your Information</h2>
                <ul className="list-disc pl-6">
                  <li>To provide personalized fitness and nutrition services</li>
                  <li>To process payments and manage subscriptions</li>
                  <li>To grant access to digital content (workout videos, meal plans)</li>
                  <li>To communicate about your programs and progress</li>
                  <li>To improve my services and develop new features</li>
                  <li>To send updates and marketing communications (with your consent)</li>
                  <li>To prevent fraud and maintain security</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-playfair mb-4">4. Payment Processing</h2>
                <p>
                  I use secure payment processors to handle all financial transactions. When you make a purchase:
                </p>
                <ul className="list-disc pl-6">
                  <li>Credit card information is processed securely and not stored on my servers</li>
                  <li>Transaction data is encrypted using industry-standard protocols</li>
                  <li>Payment processing complies with PCI DSS requirements</li>
                  <li>Purchase history is maintained for legal and accounting purposes</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-playfair mb-4">5. Digital Content Access</h2>
                <p>
                  When you purchase digital content (videos, meal plans):
                </p>
                <ul className="list-disc pl-6">
                  <li>I track content access and usage for security purposes</li>
                  <li>I monitor account sharing to prevent unauthorized access</li>
                  <li>I maintain viewing history to improve user experience</li>
                  <li>I collect analytics to enhance content quality</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-playfair mb-4">6. Data Protection</h2>
                <p>
                  I implement robust security measures to protect your information:
                </p>
                <ul className="list-disc pl-6">
                  <li>SSL/TLS encryption for data transmission</li>
                  <li>Secure data storage with regular backups</li>
                  <li>Access controls and authentication measures</li>
                  <li>Regular security audits and updates</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-playfair mb-4">7. Data Sharing</h2>
                <p>I may share your information with:</p>
                <ul className="list-disc pl-6">
                  <li>Payment processors for transaction handling</li>
                  <li>Cloud storage providers for secure data storage</li>
                  <li>Analytics services to improve my platform</li>
                  <li>Legal authorities when required by law</li>
                </ul>
                <p className="mt-4">
                  I never sell your personal information to third parties.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-playfair mb-4">8. Your Rights</h2>
                <p>You have the right to:</p>
                <ul className="list-disc pl-6">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate data</li>
                  <li>Request deletion of your data</li>
                  <li>Withdraw consent for marketing</li>
                  <li>Export your data</li>
                  <li>Object to certain processing</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-playfair mb-4">9. Cookies and Tracking</h2>
                <p>
                  I use cookies and similar technologies to:
                </p>
                <ul className="list-disc pl-6">
                  <li>Remember your preferences</li>
                  <li>Maintain your session</li>
                  <li>Analyze website traffic</li>
                  <li>Improve user experience</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-playfair mb-4">10. Changes to This Policy</h2>
                <p>
                  I may update this Privacy Policy periodically. I will notify you of any significant changes by:
                </p>
                <ul className="list-disc pl-6">
                  <li>Posting the new policy on this page</li>
                  <li>Updating the "Last updated" date</li>
                  <li>Sending an email notification for material changes</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-playfair mb-4">11. Contact Me</h2>
                <p>
                  If you have questions about this Privacy Policy or how I handle your information, please contact me at:
                </p>
                <ul className="list-none pl-6">
                  <li><strong>Email:</strong> chloefitness@gmail.com</li>
                  <li><strong>Phone:</strong> +27 82 959 6069</li>
                  <li><strong>Address:</strong> Cape Town, South Africa</li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy; 
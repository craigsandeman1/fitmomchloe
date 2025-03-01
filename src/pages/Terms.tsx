const Terms = () => {
  return (
    <div>
      {/* Hero Section */}
      <div className="relative bg-primary/5 py-20">
        <div className="section-container">
          <h1 className="font-playfair text-4xl md:text-5xl text-center mb-6">Terms and Conditions</h1>
          <p className="text-center text-gray-600 max-w-2xl mx-auto">
            Please read these terms carefully before using my services
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
                  These Terms and Conditions ("Terms") govern your use of my (Fit Mom Chloe's) website, services, and digital content. By accessing or using my services, you agree to be bound by these Terms. If you disagree with any part of these Terms, you may not access my services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-playfair mb-4">2. Services</h2>
                <p>I provide the following services:</p>
                <ul className="list-disc pl-6">
                  <li>Personal training sessions (in-person and virtual)</li>
                  <li>Online workout programs and videos</li>
                  <li>Customized meal plans</li>
                  <li>Fitness consultations</li>
                  <li>Digital content and resources</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-playfair mb-4">3. Digital Content Access</h2>
                <h3 className="text-xl mb-2">3.1 Workout Videos</h3>
                <ul className="list-disc pl-6 mb-4">
                  <li>Access is granted upon successful payment</li>
                  <li>Content is for personal use only</li>
                  <li>Sharing or redistributing content is prohibited</li>
                  <li>Account sharing is not permitted</li>
                </ul>

                <h3 className="text-xl mb-2">3.2 Meal Plans</h3>
                <ul className="list-disc pl-6">
                  <li>Plans are personalized and non-transferable</li>
                  <li>Modifications require professional consultation</li>
                  <li>Content remains our intellectual property</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-playfair mb-4">4. Payment Terms</h2>
                <h3 className="text-xl mb-2">4.1 Payment Methods</h3>
                <ul className="list-disc pl-6 mb-4">
                  <li>We accept major credit cards (Visa, Mastercard)</li>
                  <li>All payments are processed securely</li>
                  <li>Prices are in South African Rand (ZAR)</li>
                  <li>Prices may change with notice</li>
                </ul>

                <h3 className="text-xl mb-2">4.2 Subscription Services</h3>
                <ul className="list-disc pl-6">
                  <li>Auto-renewal unless cancelled</li>
                  <li>Cancellation notice required 7 days before billing</li>
                  <li>No partial billing cycles</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-playfair mb-4">5. Refund Policy</h2>
                <h3 className="text-xl mb-2">5.1 Digital Content</h3>
                <ul className="list-disc pl-6 mb-4">
                  <li>Workout Videos: 7-day money-back guarantee if unwatched</li>
                  <li>Meal Plans: 14-day refund window if unused</li>
                  <li>No refunds after content access/download</li>
                </ul>

                <h3 className="text-xl mb-2">5.2 Personal Training</h3>
                <ul className="list-disc pl-6 mb-4">
                  <li>24-hour cancellation notice required</li>
                  <li>Rescheduling subject to availability</li>
                  <li>No-shows forfeit session</li>
                </ul>

                <h3 className="text-xl mb-2">5.3 Subscriptions</h3>
                <ul className="list-disc pl-6">
                  <li>Prorated refunds for unused periods</li>
                  <li>Cancellation fees may apply</li>
                  <li>Special promotions may be non-refundable</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-playfair mb-4">6. User Responsibilities</h2>
                <ul className="list-disc pl-6">
                  <li>Provide accurate account information</li>
                  <li>Maintain account security</li>
                  <li>Follow safety guidelines</li>
                  <li>Respect intellectual property rights</li>
                  <li>Report unauthorized access</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-playfair mb-4">7. Health Disclaimer</h2>
                <p className="mb-4">
                  Before starting any exercise program or nutrition plan:
                </p>
                <ul className="list-disc pl-6">
                  <li>Consult your healthcare provider</li>
                  <li>Disclose relevant health conditions</li>
                  <li>Stop if you experience discomfort</li>
                  <li>Results may vary between individuals</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-playfair mb-4">8. Intellectual Property</h2>
                <p>All content is protected by copyright and other laws:</p>
                <ul className="list-disc pl-6">
                  <li>No reproduction without permission</li>
                  <li>No commercial use of materials</li>
                  <li>No modification of content</li>
                  <li>Violations will be prosecuted</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-playfair mb-4">9. Account Termination</h2>
                <p>I reserve the right to terminate accounts for:</p>
                <ul className="list-disc pl-6">
                  <li>Terms violation</li>
                  <li>Payment issues</li>
                  <li>Fraudulent activity</li>
                  <li>Inappropriate behavior</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-playfair mb-4">10. Limitation of Liability</h2>
                <ul className="list-disc pl-6">
                  <li>Exercise carries inherent risks</li>
                  <li>I am not liable for injuries</li>
                  <li>Use services at your own risk</li>
                  <li>Results not guaranteed</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-playfair mb-4">11. Dispute Resolution</h2>
                <ul className="list-disc pl-6">
                  <li>South African law governs these Terms</li>
                  <li>Informal resolution attempted first</li>
                  <li>Mediation before litigation</li>
                  <li>Cape Town jurisdiction</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-playfair mb-4">12. Changes to Terms</h2>
                <p>
                  I may modify these Terms at any time. Changes will be effective immediately upon posting. Continued use of my services constitutes acceptance of new Terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-playfair mb-4">13. Contact Information</h2>
                <p>For questions about these Terms, please contact me at:</p>
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

export default Terms; 
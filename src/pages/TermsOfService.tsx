import { useEffect } from 'react';

const TermsOfService = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="section-container py-16 max-w-4xl mx-auto">
      <h1 className="font-playfair text-4xl mb-8">Terms of Service</h1>

      <div className="prose prose-lg max-w-none">
        <p>Last Updated: {new Date().toLocaleDateString()}</p>

        <h2>Introduction</h2>
        <p>
          Welcome to Fit Mom Chloe. These Terms of Service ("Terms") govern your use of my website and services,
          including my meal plans and personal training sessions. By accessing or using my services,
          you agree to be bound by these Terms. If you do not agree to these Terms, please do not use my services.
        </p>

        <h2>My Services</h2>
        <p>
          I offer various fitness and nutrition services, including but not limited to:
        </p>
        <ul>
          <li>Personalized meal plans</li>
          <li>Workout videos and training programs</li>
          <li>One-on-one personal training sessions</li>
          <li>Group fitness classes</li>
          <li>Nutrition consulting</li>
        </ul>

        <h2>Account Registration</h2>
        <p>
          To access certain features of my services, you may need to create an account. You are responsible for
          maintaining the confidentiality of your account credentials and for all activities that occur under your account.
          You agree to provide accurate and complete information when creating your account and to update your information
          as necessary to keep it accurate and complete.
        </p>

        <h2>Payment and Subscriptions</h2>
        <p>
          Some of my services require payment. By purchasing my services, you agree to pay all fees and charges associated
          with your account on a timely basis and in the currency listed. All payments are non-refundable unless otherwise
          specified in my refund policy.
        </p>
        <p>
          For subscription-based services, your subscription will automatically renew at the end of each subscription period
          unless you cancel it before the renewal date. You can cancel your subscription at any time through your account settings
          or by contacting me directly.
        </p>

        <h2>Health Disclaimer</h2>
        <p>
          My fitness and nutrition services are not intended to diagnose, treat, cure, or prevent any disease. The information
          I provide is for general informational purposes only and is not a substitute for professional medical advice, diagnosis,
          or treatment.
        </p>
        <p>
          Before starting any exercise program or making significant changes to your diet, I strongly recommend consulting with
          your healthcare provider, especially if you have any pre-existing health conditions or concerns. I am not responsible
          for any injuries or health issues that may result from following my fitness or nutrition advice.
        </p>

        <h2>Intellectual Property</h2>
        <p>
          All content on my website and services, including text, graphics, logos, images, videos, and software, is my property
          or the property of my licensors and is protected by copyright, trademark, and other intellectual property laws. You may
          not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download,
          store, or transmit any of my content without my prior written consent.
        </p>

        <h2>User Content</h2>
        <p>
          You may have the opportunity to submit content to my website, such as comments, reviews, or photos. By submitting content,
          you grant me a non-exclusive, royalty-free, perpetual, irrevocable, and fully sublicensable right to use, reproduce, modify,
          adapt, publish, translate, create derivative works from, distribute, and display such content throughout the world in any media.
        </p>
        <p>
          You represent and warrant that you own or control all rights to the content you submit, that the content is accurate, and that
          use of the content does not violate these Terms or cause injury to any person or entity.
        </p>

        <h2>Prohibited Conduct</h2>
        <p>
          You agree not to:
        </p>
        <ul>
          <li>Use my services for any illegal purpose or in violation of any local, state, national, or international law</li>
          <li>Violate or encourage others to violate the rights of third parties, including intellectual property rights</li>
          <li>Post, upload, or distribute any content that is unlawful, defamatory, libelous, inaccurate, or that a reasonable person could deem to be objectionable</li>
          <li>Interfere with security-related features of my services</li>
          <li>Use my services in any manner that could interfere with, disrupt, negatively affect, or inhibit other users from fully enjoying my services</li>
          <li>Collect or store personal data about other users without their consent</li>
          <li>Impersonate or misrepresent your affiliation with any person or entity</li>
        </ul>

        <h2>Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, I shall not be liable for any indirect, incidental, special, consequential, or punitive
          damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other
          intangible losses, resulting from your access to or use of or inability to access or use my services.
        </p>

        <h2>Indemnification</h2>
        <p>
          You agree to indemnify, defend, and hold harmless me and my officers, directors, employees, agents, and representatives from and
          against any claims, liabilities, damages, losses, and expenses, including, without limitation, reasonable legal and accounting fees,
          arising out of or in any way connected with your access to or use of my services or your violation of these Terms.
        </p>

        <h2>Termination</h2>
        <p>
          I may terminate or suspend your access to my services immediately, without prior notice or liability, for any reason whatsoever,
          including without limitation if you breach these Terms. Upon termination, your right to use my services will immediately cease.
        </p>

        <h2>Changes to These Terms</h2>
        <p>
          I may update these Terms from time to time. I will notify you of any changes by posting the new Terms on this page and updating
          the "Last Updated" date. You are advised to review these Terms periodically for any changes. Changes to these Terms are effective
          when they are posted on this page.
        </p>

        <h2>Governing Law</h2>
        <p>
          These Terms shall be governed by and construed in accordance with the laws of South Africa, without regard to its conflict of law principles.
        </p>

        <h2>Contact Me</h2>
        <p>
          If you have any questions about these Terms, please contact me at:
        </p>
        <p>
          Email: chloefitness@gmail.com<br />
          Address: Cape Town, South Africa
        </p>

        <h2>Refund Policy</h2>
        <p>
          <strong>Meal Plans:</strong> Due to the digital nature of our meal plans, all purchases are final and non-refundable
          once the digital content has been downloaded or accessed. If you have technical issues accessing your purchased
          meal plan, please contact us within 24 hours of purchase, and we will assist you with access.
        </p>
        <p>
          <strong>Personal Training Sessions:</strong> Cancellations made at least 24 hours before a scheduled session may be
          rescheduled or refunded. Cancellations with less than 24 hours notice will not be refunded.
          No-shows will be charged the full session fee.
        </p>
        <p>
          If you believe you are entitled to a refund due to exceptional circumstances, please contact us at
          chloefitness@gmail.com, and we will review your case individually.
        </p>
      </div>
    </div>
  );
};

export default TermsOfService;

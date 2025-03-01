import { useEffect } from 'react';

const PrivacyPolicy = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="section-container py-16 max-w-4xl mx-auto">
      <h1 className="font-playfair text-4xl mb-8">Privacy Policy</h1>
      
      <div className="prose prose-lg max-w-none">
        <p>Last Updated: {new Date().toLocaleDateString()}</p>
        
        <h2>Introduction</h2>
        <p>
          I, Chloe, the owner and operator of Fit Mom Chloe ("I", "me", "my"), am committed to protecting your privacy. 
          This Privacy Policy explains how I collect, use, disclose, and safeguard your information when you visit my website 
          and use my services, including my meal plans, workout videos, and personal training sessions.
        </p>
        
        <h2>Information I Collect</h2>
        <p>I may collect the following types of information:</p>
        <ul>
          <li>
            <strong>Personal Information:</strong> Name, email address, phone number, billing information, and other 
            information you provide when creating an account, purchasing my services, or communicating with me.
          </li>
          <li>
            <strong>Health and Fitness Information:</strong> Information about your health, fitness goals, dietary preferences, 
            and physical condition that you share with me to help personalize your training and meal plans.
          </li>
          <li>
            <strong>Usage Information:</strong> Information about how you use my website, such as the pages you visit, 
            the time and duration of your visits, and the content you interact with.
          </li>
          <li>
            <strong>Device Information:</strong> Information about the device you use to access my website, including 
            IP address, browser type, operating system, and device identifiers.
          </li>
        </ul>
        
        <h2>How I Use Your Information</h2>
        <p>I may use the information I collect for various purposes, including:</p>
        <ul>
          <li>Providing, personalizing, and improving my services</li>
          <li>Processing your purchases and managing your account</li>
          <li>Communicating with you about your account, my services, and promotional offers</li>
          <li>Responding to your inquiries and providing customer support</li>
          <li>Analyzing usage patterns to improve my website and services</li>
          <li>Protecting my rights and preventing fraudulent activity</li>
          <li>Complying with legal obligations</li>
        </ul>
        
        <h2>How I Share Your Information</h2>
        <p>I may share your information in the following circumstances:</p>
        <ul>
          <li>
            <strong>Service Providers:</strong> I may share your information with third-party service providers who 
            help me operate my website and provide my services, such as payment processors, email service providers, 
            and hosting services.
          </li>
          <li>
            <strong>Legal Requirements:</strong> I may disclose your information if required to do so by law or in 
            response to valid requests by public authorities.
          </li>
          <li>
            <strong>Business Transfers:</strong> If I am involved in a merger, acquisition, or sale of all or a portion 
            of my assets, your information may be transferred as part of that transaction.
          </li>
          <li>
            <strong>With Your Consent:</strong> I may share your information with third parties when you have given me 
            your consent to do so.
          </li>
        </ul>
        
        <h2>Cookies and Tracking Technologies</h2>
        <p>
          I use cookies and similar tracking technologies to track activity on my website and hold certain information. 
          Cookies are files with a small amount of data that may include an anonymous unique identifier. You can instruct 
          your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept 
          cookies, you may not be able to use some portions of my website.
        </p>
        
        <h2>Data Security</h2>
        <p>
          I implement appropriate technical and organizational measures to protect the security of your personal information. 
          However, please be aware that no method of transmission over the Internet or method of electronic storage is 100% 
          secure, and I cannot guarantee the absolute security of your data.
        </p>
        
        <h2>Your Rights</h2>
        <p>Depending on your location, you may have certain rights regarding your personal information, including:</p>
        <ul>
          <li>The right to access the personal information I hold about you</li>
          <li>The right to request correction of inaccurate personal information</li>
          <li>The right to request deletion of your personal information</li>
          <li>The right to object to processing of your personal information</li>
          <li>The right to data portability</li>
          <li>The right to withdraw consent</li>
        </ul>
        <p>
          To exercise these rights, please contact me at chloefitness@gmail.com.
        </p>
        
        <h2>Children's Privacy</h2>
        <p>
          My services are not intended for individuals under the age of 18. I do not knowingly collect personal information 
          from children under 18. If you are a parent or guardian and you believe your child has provided me with personal 
          information, please contact me so that I can take necessary actions.
        </p>
        
        <h2>Changes to This Privacy Policy</h2>
        <p>
          I may update this Privacy Policy from time to time. I will notify you of any changes by posting the new Privacy 
          Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically 
          for any changes.
        </p>
        
        <h2>Contact Me</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact me at:
        </p>
        <p>
          Email: chloefitness@gmail.com<br />
          Phone: +27 123 456 789<br />
          Address: Cape Town, South Africa
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

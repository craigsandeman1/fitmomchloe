// Email utility functions using Web3Forms

/**
 * Sends a welcome email to a newly registered user
 * @param email User's email address
 * @param name User's name (optional)
 */
export const sendWelcomeEmail = async (email: string, name?: string) => {
  try {
    const apiKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
    
    if (!apiKey) {
      console.error("Web3Forms API key is missing");
      return { success: false, message: "API key not configured" };
    }
    
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        access_key: apiKey,
        from_name: "Fit Mom Chloe",
        subject: "Welcome to Fit Mom Chloe",
        to: email,
        bcc: "chloefitness@gmail.com,sandemancraig@gmail.com",
        reply_to: "chloefitness@gmail.com",
        message: `
          <h1>Welcome to Fit Mom Chloe!</h1>
          <p>Hello${name ? ` ${name}` : ''},</p>
          <p>Thank you for creating an account with Fit Mom Chloe. I'm thrilled to have you join our community!</p>
          <p>With your new account, you can:</p>
          <ul>
            <li>Access all your purchased meal plans</li>
            <li>Book personal training sessions</li>
            <li>Track your progress</li>
          </ul>
          <p>If you have any questions or need assistance, please don't hesitate to reach out.</p>
          <p>Best regards,</p>
          <p>Chloe</p>
        `,
        template_id: "welcome_email", // Optional: if you create a template in Web3Forms
        html: true
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log("Welcome email sent successfully");
      return { success: true };
    } else {
      console.error("Failed to send welcome email:", data);
      return { success: false, message: data.message || "Unknown error" };
    }
  } catch (error) {
    console.error("Error sending welcome email:", error);
    return { success: false, message: "An error occurred while sending the email" };
  }
};

/**
 * Sends a purchase confirmation email
 * @param email User's email address
 * @param productName Name of the purchased product
 * @param downloadLink Link to download the product
 */
export const sendPurchaseConfirmationEmail = async (
  email: string, 
  productName: string, 
  downloadLink: string,
  name?: string
) => {
  try {
    const apiKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
    
    if (!apiKey) {
      console.error("Web3Forms API key is missing");
      return { success: false, message: "API key not configured" };
    }
    
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        access_key: apiKey,
        from_name: "Fit Mom Chloe",
        subject: `Your Purchase: ${productName}`,
        to: email,
        bcc: "chloefitness@gmail.com,sandemancraig@gmail.com",
        reply_to: "chloefitness@gmail.com",
        message: `
          <h1>Thank You for Your Purchase!</h1>
          <p>Hello${name ? ` ${name}` : ''},</p>
          <p>Thank you for purchasing <strong>${productName}</strong>!</p>
          <p>You can download your product using the link below:</p>
          <p><a href="${downloadLink}" style="display: inline-block; background-color: #FF6B6B; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Download ${productName}</a></p>
          <p>This link will remain active for your convenience. If you've created an account, you can also access your purchase from your account dashboard at any time.</p>
          <p>If you have any questions or need assistance, please don't hesitate to reach out.</p>
          <p>Best regards,</p>
          <p>Chloe</p>
        `,
        template_id: "purchase_confirmation", // Optional: if you create a template in Web3Forms
        html: true
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log("Purchase confirmation email sent successfully");
      return { success: true };
    } else {
      console.error("Failed to send purchase confirmation email:", data);
      return { success: false, message: data.message || "Unknown error" };
    }
  } catch (error) {
    console.error("Error sending purchase confirmation email:", error);
    return { success: false, message: "An error occurred while sending the email" };
  }
}; 
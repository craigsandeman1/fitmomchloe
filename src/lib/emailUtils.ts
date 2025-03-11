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
        message: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Welcome to Fit Mom Chloe</title>
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
    ul {
      padding-left: 20px;
    }
    li {
      margin-bottom: 8px;
    }
    .signature {
      margin-top: 30px;
    }
  </style>
</head>
<body>
  <h1>Welcome to Fit Mom Chloe!</h1>
  <p>Hello${name ? ` ${name}` : ''},</p>
  <p>Thank you for creating an account with Fit Mom Chloe. I'm thrilled to have you on board!</p>
  <p>With your new account, you can:</p>
  <ul>
    <li>Access all your purchased meal plans</li>
    <li>Book personal training sessions with me</li>
    <li>Track your fitness progress</li>
  </ul>
  <p>As your personal trainer, I'm here to support your fitness journey through my customized meal plans and training sessions.</p>
  <p>If you have any questions or need assistance, please don't hesitate to reach out to me directly.</p>
  <div class="signature">
    <p>Best regards,</p>
    <p>Chloe</p>
  </div>
</body>
</html>`,
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
        message: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Your Purchase from Fit Mom Chloe</title>
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
    .button {
      display: inline-block;
      background-color: #FF6B6B;
      color: white;
      padding: 10px 20px;
      text-decoration: none;
      border-radius: 5px;
      margin: 15px 0;
    }
    .signature {
      margin-top: 30px;
    }
    .product-name {
      font-weight: bold;
    }
  </style>
</head>
<body>
  <h1>Thank You for Your Purchase!</h1>
  <p>Hello${name ? ` ${name}` : ''},</p>
  <p>Thank you for purchasing <span class="product-name">${productName}</span>!</p>
  <p>You can download your purchase using the link below:</p>
  <p><a href="${downloadLink}" class="button">Download ${productName}</a></p>
  <p>This link will remain active for your convenience. If you've created an account, you can also access your purchase from your account dashboard at any time.</p>
  <p>I've put a lot of care into creating this meal plan and I hope it helps you achieve your fitness goals. If you have any questions about the meal plan or need personalized advice, please don't hesitate to reach out to me directly.</p>
  <div class="signature">
    <p>Best regards,</p>
    <p>Chloe</p>
  </div>
</body>
</html>`,
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
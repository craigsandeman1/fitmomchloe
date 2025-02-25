# Payfast Documentation

## Quickly integrate Payfast into your platform

### Custom Integration
Build a checkout form and receive payments securely from our payment platform.

- Simple integration
- Create security signature
- Pay with Payfast
- Confirm payment

### APIs
Server-to-server integration.

- Authentication
- Error handling
- Recurring Billing
- View all

### Onsite Payments
Receive payments without redirecting customers away from your website.

### Recurring Billing
Enable subscription and tokenization payments.

- Subscriptions
- Tokenization

### Additional methods of integrating
- Pay Now Button: Generate Pay Now HTML button code.
- Shopping Carts: Choose from one of our many plugins.

## Custom Payment Integration

Build a checkout form and receive payments securely from our payment platform.
This process can be used for both one-time and recurring payments.

- Live: https://www.payfast.co.za/eng/process
- Sandbox: https://sandbox.payfast.co.za​/eng/process

**Quick start**: It is recommended that you create your own Sandbox account to test your integration.

### Simple Form Integration

```html
<form action="https://www.payfast.co.za/eng/process" method="post">
   <input type="hidden" name="merchant_id" value="10000100">
   <input type="hidden" name="merchant_key" value="46f0cd694581a">
   <input type="hidden" name="amount" value="100.00">
   <input type="hidden" name="item_name" value="Test Product">
   <input type="submit">
</form>
```

### Step 1: Create your checkout form

Create a checkout page with an HTML form, usually hidden, with a number of fields containing all the necessary information needed for Payfast to process the payment. Most shopping cart platforms will have the customer click on a 'Confirm Order' or 'Pay Now' button to submit the form and be redirected to the Payfast Payment page.

#### Merchant details

| Field | Description |
|-------|-------------|
| **merchant_id** | **REQUIRED**<br>The Merchant ID as given by the Payfast system. Used to uniquely identify the receiving account. This can be found on the merchant's settings page. |
| **merchant_key** | **REQUIRED**<br>The Merchant Key as given by the Payfast system. Used to uniquely identify the receiving account. This provides an extra level of certainty concerning the correct account as both the ID and the Key must be correct in order for the transaction to proceed. This can be found on the merchant's settings page. |
| **return_url** | **OPTIONAL**<br>The URL where the user is returned to after payment has been successfully taken. |
| **cancel_url** | **OPTIONAL**<br>The URL where the user should be redirected should they choose to cancel their payment while on the Payfast system. |
| **notify_url** | **OPTIONAL**<br>The URL which is used by Payfast to post the Instant Transaction Notifications (ITNs) for this transaction. |
| **fica_idnumber** | **OPTIONAL**<br>The Fica ID Number provided of the buyer must be a valid South African ID Number. |

For the notify_url mentioned, a variable can be specified globally on the Merchant's Payfast account or overridden on a per transaction basis. The value provided during a transaction overrides the global setting.

**Merchant Details Example:**
```html
<input type="hidden" name="merchant_id" value="10000100">
<input type="hidden" name="merchant_key" value="46f0cd694581a">
<input type="hidden" name="return_url" value="https://www.example.com/success">
<input type="hidden" name="cancel_url" value="https://www.example.com/cancel">
<input type="hidden" name="notify_url" value="https://www.example.com/notify">
```

#### Customer details

| Field | Description |
|-------|-------------|
| **name_first** | **OPTIONAL**<br>The customer's first name. |
| **name_last** | **OPTIONAL**<br>The customer's last name. |
| **email_address** | **OPTIONAL**<br>The customer's email address. |
| **cell_number** | **OPTIONAL**<br>The customer's valid cell number. If the email_address field is empty, and cell_number provided, the system will use the cell_number as the username and auto login the user, if they do not have a registered account. |

**Customer Details Example:**
```html
<input type="hidden" name="name_first" value="John">
<input type="hidden" name="name_last" value="Doe">
<input type="hidden" name="email_address" value="john@doe.com">
<input type="hidden" name="cell_number" value="0823456789">
```

#### Transaction details

| Field | Description |
|-------|-------------|
| **m_payment_id** | **OPTIONAL**<br>Unique payment ID on the merchant's system. |
| **amount** | **REQUIRED**<br>The amount which the payer must pay in ZAR. |
| **item_name** | **REQUIRED**<br>The name of the item being charged for, or in the case of multiple items the order number. |
| **item_description** | **OPTIONAL**<br>The description of the item being charged for, or in the case of multiple items the order description. |
| **custom_int<1..5>** | **OPTIONAL**<br>A series of 5 custom integer variables (custom_int1, custom_int2…) which can be used by the merchant as pass-through variables. They will be posted back to the merchant at the completion of the transaction. |
| **custom_str<1..5>** | **OPTIONAL**<br>A series of 5 custom string variables (custom_str1, custom_str2…) which can be used by the merchant as pass-through variables. They will be posted back to the merchant at the completion of the transaction. |

**Transaction Details Example:**
```html
<input type="hidden" name="m_payment_id" value="01AB">
<input type="hidden" name="amount" value="100.00">
<input type="hidden" name="item_name" value="Test Item">
<input type="hidden" name="item_description" value="A test product">
<input type="hidden" name="custom_int1" value="2">
<input type="hidden" name="custom_str1" value="Extra order information">
```

#### Transaction options

| Field | Description |
|-------|-------------|
| **email_confirmation** | **OPTIONAL**<br>Whether to send an email confirmation to the merchant of the transaction. The email confirmation is automatically sent to the payer. 1 = on, 0 = off |
| **confirmation_address** | **OPTIONAL**<br>The email address to send the confirmation email to. This value can be set globally on your account. Using this field will override the value set in your account for this transaction. |

**Transaction Options Example:**
```html
<input type="hidden" name="email_confirmation" value="1">
<input type="hidden" name="confirmation_address" value="john@doe.com">
```

#### Payment methods

| Field | Description |
|-------|-------------|
| **payment_method** | **OPTIONAL**<br>When this field is set, only the SINGLE payment method specified can be used when the customer reaches Payfast. If this field is blank, or not included, then all available payment methods will be shown. |

The values are as follows:
- 'ef' – EFT
- 'cc' – Credit card
- 'dc' – Debit card
- 'mp' – Masterpass Scan to Pay
- 'mc' – Mobicred
- 'sc' – SCode
- 'ss' – SnapScan
- 'zp' – Zapper
- 'mt' – MoreTyme
- 'rc' – Store card
- 'mu' – Mukuru
- 'ap' – Apple Pay
- 'sp' – Samsung Pay
- 'cp' – Capitec Pay

**Payment Methods Example:**
```html
<input type="hidden" name="payment_method" value="cc">
```

#### Recurring Billing and Split Payment form options
(See Recurring Billing subscriptions and Split Payments for additional fields)

### Step 2: Create security signature

A generated MD5 signature must be passed as an additional hidden input and this hash is then used to ensure the integrity of the data transfer.

**Security Signature Example:**
```html
<input type="hidden" name="signature" value="f103e22c0418655fb03991538c51bfd5">
```

To generate the signature:

1. Concatenation of the name value pairs of all the non-blank variables with '&' used as a separator

   **Variable order**: The pairs must be listed in the order in which they appear in the attributes description. eg. name_first=John&name_last=Doe​&email_address=…
   * Do not use the API signature format, which uses alphabetical ordering!

2. Add your passphrase
   The passphrase is an extra security feature, used as a 'salt', and is set by the Merchant in the Settings section of their Payfast Dashboard.
   Add the passphrase to the end of the below string.
   E.g. name_first=John&name_last=Doe​&email_address=…&passphrase=...

   The resultant URL encoding must be in upper case (eg. http%3A%2F%2F), and spaces encoded as '+'.

3. MD5 the parameter string and pass it as a hidden input named "signature"

**Troubleshooting**: For troubleshooting signature mismatch issues check out our knowledge base Common causes of a failed integration / signature mismatch

#### Signature generation

**Node.js:**
```javascript
const crypto = require("crypto");

const generateSignature = (data, passPhrase = null) => {
  // Create parameter string
  let pfOutput = "";
  for (let key in data) {
    if(data.hasOwnProperty(key)){
      if (data[key] !== "") {
        pfOutput +=`${key}=${encodeURIComponent(data[key].trim()).replace(/%20/g, "+")}&`
      }
    }
  }

  // Remove last ampersand
  let getString = pfOutput.slice(0, -1);
  if (passPhrase !== null) {
    getString +=`&passphrase=${encodeURIComponent(passPhrase.trim()).replace(/%20/g, "+")}`;
  }

  return crypto.createHash("md5").update(getString).digest("hex");
};
```

### Step 3: Send the customer to Payfast for payment

On submission of your form, your customers will be redirected to the secure Payfast payments page.
Your form should be setup to post to either Payfast's live URL or the Sandbox for testing.

#### Full form implementation

**Node.js:**
```javascript
const myData = [];
// Merchant details
myData["merchant_id"] = "10000100";
myData["merchant_key"] = "46f0cd694581a";
myData["return_url"] = "http://www.yourdomain.co.za/return_url";
myData["cancel_url"] = "http://www.yourdomain.co.za/cancel_url";
myData["notify_url"] = "http://www.yourdomain.co.za/notify_url";
// Buyer details
myData["name_first"] = "First Name";
myData["name_last"] = "Last Name";
myData["email_address"] = "test@test.com";
// Transaction details
myData["m_payment_id"] = "1234";
myData["amount"] = "10.00";
myData["item_name"] = "Order#123";

// Generate signature
const myPassphrase = "jt7NOE43FZPn";
myData["signature"] = generateSignature(myData, myPassphrase);

let htmlForm = `<form action="https://${pfHost}/eng/process" method="post">`;
for (let key in myData) {
  if(myData.hasOwnProperty(key)){
    value = myData[key];
    if (value !== "") {
      htmlForm +=`<input name="${key}" type="hidden" value="${value.trim()}" />`;
    }
  }
}

htmlForm += '<input type="submit" value="Pay Now" /></form>';
```

### Step 4: Confirm payment is successful

Before the customer is returned to the URL you specified in the "return_url" parameter, Payfast will send a notification to your "notify_url" page.

#### 4.1. Setting up your notification page:

On receiving the payment notification from Payfast, return a header 200 to prevent further retries.
If no 200 response is returned the notification will be re-sent immediately, then after 10 minutes and then at exponentially longer intervals until eventually stopping.

If you are testing locally you will need to have a publicly accessible URL (notify_url) in order to receive the notifications, consider using tools such as NGROK or Expose to expose your local development server to the Internet.

#### 4.2. Receive the notification parameters

As part of the notification you can expect to receive the following parameters:

##### Transaction details

| Field | Description |
|-------|-------------|
| **m_payment_id** | **OPTIONAL**<br>Unique payment ID on the merchant's system. |
| **pf_payment_id** | **REQUIRED**<br>Unique transaction ID on Payfast. |
| **payment_status** | **REQUIRED**<br>After a successful payment the status sent will be COMPLETE. When a subscription is cancelled the status will be CANCELLED. |
| **item_name** | **REQUIRED**<br>The name of the item being charged for, or in the case of multiple items the order number. |
| **item_description** | **OPTIONAL**<br>The description of the item being charged for, or in the case of multiple items the order description. |
| **amount_gross** | **OPTIONAL**<br>The total amount the customer paid in ZAR. |
| **amount_fee** | **OPTIONAL**<br>The total in fees which was deducted from the amount in ZAR. |
| **amount_net** | **OPTIONAL**<br>The net amount credited to the merchant's account in ZAR. |
| **custom_int<1..5>** | **OPTIONAL**<br>The series of 5 custom integer variables (custom_int1, custom_int2…) originally passed by the receiver during the payment request. |
| **custom_str<1..5>** | **OPTIONAL**<br>The series of 5 custom string variables (custom_str1, custom_str2…) originally passed by the receiver during the payment request. |

##### Customer details

| Field | Description |
|-------|-------------|
| **name_first** | **OPTIONAL**<br>The customer's first name. |
| **name_last** | **OPTIONAL**<br>The customer's last name. |
| **email_address** | **OPTIONAL**<br>The customer's email address. |

##### Merchant details

| Field | Description |
|-------|-------------|
| **merchant_id** | **REQUIRED**<br>The Merchant ID as given by the Payfast system. Used to uniquely identify the receiver's account. |

##### Recurring Billing details

| Field | Description |
|-------|-------------|
| **token** | **REQUIRED**<br>Unique ID on Payfast that represents the subscription. |
| **billing_date** | **OPTIONAL**<br>The date from which future subscription payments will be made. Eg. 2020-01-01. Defaults to current date if not set. |

##### Security information

| Field | Description |
|-------|-------------|
| **signature** | **OPTIONAL**<br>A security signature of the transmitted data taking the form of an MD5 hash of all the url encoded submitted variables. |

**Example of a Transaction Webhook Payload (Node.js):**
```javascript
const ITN_Payload = {
 'm_payment_id': 'SuperUnique1',
 'pf_payment_id': '1089250',
 'payment_status': 'COMPLETE',
 'item_name': 'test+product',
 'item_description': 'test+description' ,
 'amount_gross': 200.00,
 'amount_fee': -4.60,
 'amount_net': 195.40,
 'custom_str1': '',
 'custom_str2': '',
 'custom_str3': '',
 'custom_str4': '',
 'custom_str5': '',
 'custom_int1': '',
 'custom_int2': '',
 'custom_int3': '',
 'custom_int4': '',
 'custom_int5': '',
 'name_first': '',
 'name_last': '',
 'email_address': '',
 'merchant_id': '10000100',
 'signature': 'ad8e7685c9522c24365d7ccea8cb3db7'
};
```

#### 4.3. Conduct security checks

Conduct four security checks to ensure that the data you are receiving is correct, from the correct source and hasn't been altered; you should not continue the process if a test fails!

**Notification page (Node.js):**
```javascript
const axios = require("axios");
const crypto = require("crypto");
const dns = require('dns');

const testingMode = true;
const pfHost = testingMode ? "sandbox.payfast.co.za" : "www.payfast.co.za";

const pfData = JSON.parse(JSON.stringify(req.body));

let pfParamString = "";
for (let key in pfData) {
  if(pfData.hasOwnProperty(key) && key !== "signature"){
    pfParamString +=`${key}=${encodeURIComponent(pfData[key].trim()).replace(/%20/g, "+")}&`;
  }
}

// Remove last ampersand
pfParamString = pfParamString.slice(0, -1);
```

##### Verify the signature

Verify the security signature in the notification; this is done in a similar way that the signature that you generated for stage one of the user payment flow.

The string that gets created needs to include all fields posted from Payfast.

**Verify Signature (Node.js):**
```javascript
const pfValidSignature = (pfData, pfParamString, pfPassphrase = null ) => {
  // Calculate security signature
  let tempParamString = '';
  if (pfPassphrase !== null) {
    pfParamString +=`&passphrase=${encodeURIComponent(pfPassphrase.trim()).replace(/%20/g, "+")}`;
  }

  const signature = crypto.createHash("md5").update(pfParamString).digest("hex");
  return pfData['signature'] === signature;
};
```

##### Check that the notification has come from a valid Payfast domain

The following is a list of valid domains:
- www.payfast.co.za
- w1w.payfast.co.za
- w2w.payfast.co.za
- sandbox.payfast.co.za

**Check valid Payfast domain (Node.js):**
```javascript
async function ipLookup(domain){
  return new Promise((resolve, reject) => {
    dns.lookup(domain, {all: true}, (err, address, family) => {
      if(err) {
        reject(err)
      } else {
        const addressIps = address.map(function (item) {
         return item.address;
        });
        resolve(addressIps);
      }
    });
  });
}

const pfValidIP = async (req) => {
  const validHosts = [
    'www.payfast.co.za',
    'sandbox.payfast.co.za',
    'w1w.payfast.co.za',
    'w2w.payfast.co.za'
  ];

  let validIps = [];
  const pfIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  try{
    for(let key in validHosts) {
      const ips = await ipLookup(validHosts[key]);
      validIps = [...validIps, ...ips];
    }
  } catch(err) {
    console.error(err);
  }

  const uniqueIps = [...new Set(validIps)];

  if (uniqueIps.includes(pfIp)) {
    return true;
  }
  return false;
};
```

##### Compare payment data

The amount you expected the customer to pay should match the "amount_gross" value sent in the notification.

**Compare payment data (Node.js):**
```javascript
const pfValidPaymentData = ( cartTotal, pfData ) => {
    return Math.abs(parseFloat(cartTotal) - parseFloat(pfData['amount_gross'])) <= 0.01;
};
```

##### Perform a server request to confirm the details

Validate the data that you have received from Payfast by contacting our server and confirming the order details.

- Live: https://www.payfast.co.za/​eng/query/validate
- Sandbox: https://sandbox.payfast.co.za/​eng/query/validate

**Curl Options:**

| Option | Description |
|--------|-------------|
| CURLOPT_RETURNTRANSFER | Set to TRUE to return the transfer as a string of the return value of curl_exec() instead of outputting it out directly. |
| CURLOPT_HEADER | Set to FALSE to exclude the header in the output. |
| CURLOPT_SSL_VERIFYHOST | Set to 2 to check the existence of a common name in the SSL peer certificate, and to also verify that it matches the hostname provided. |
| CURLOPT_SSL_VERIFYPEER | This option determines whether curl verifies the authenticity of the peer's certificate. The default value is 1. |
| CURLOPT_URL | Set to the Payfast query validation URL, eg. https://www.payfast.co.za/eng/query/validate. This can also be set when initializing a session with curl_init(). |
| CURLOPT_POST | Set to TRUE to do a regular HTTP POST. This POST is the normal application/x-www-form-urlencoded kind, most commonly used by HTML forms. |
| CURLOPT_POSTFIELDS | The full data to post via HTTP to Payfast. This parameter is passed as a urlencoded string, such as: m_payment_id=01&pf_payment_id=01234.. |

**Server request to confirm details (Node.js):**
```javascript
const pfValidServerConfirmation = async (pfHost, pfParamString) => {
    const result = await axios.post(`https://${pfHost}/eng/query/validate`, pfParamString)
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            console.error(error)
        });
   return result === 'VALID';
};
```

**Bringing the checks together (Node.js):**
```javascript
const check1 = pfValidSignature(pfData, pfParamString, passPhrase);
const check2 = pfValidIP(req);
const check3 = pfValidPaymentData( cartTotal, pfData );
const check4 = pfValidServerConfirmation(pfHost, pfParamString);

if(check1 && check2 && check3 && check4) {
    // All checks have passed, the payment is successful
} else {
    // Some checks have failed, check payment manually and log for investigation
}
```

## Onsite Payments (Beta)

Integrate Payfast's secure payment engine directly into the checkout page.

### Integration

Integration is a simple two step process:

**Important**: Please note that for security reasons Onsite Payments requires that your application be served over HTTPS.

#### Step 1: Post payment details and get a unique payment identifier

The transaction and customer details need to be sent to Payfast before any customer interaction.

- Live: https://www.payfast.co.za/onsite/​process
- Sandbox: https://sandbox.payfast.co.za/onsite/​process

**POST Data:**
The POST data that is required can be found in the Quickstart guide.
The following are additional requirements for Onsite:

| Field | Description |
|-------|-------------|
| **signature** | **REQUIRED**<br>The signature is a hash of the posted data used to ensure the integrity of the data transfer |
| **email_address** | **REQUIRED UNLESS MOBILE REGISTRATION ALLOWED**<br>The customer's email address. This is required unless the merchant has specifically allowed mobile registration from their account. |
| **cell_number** | **REQUIRED IF EMAIL NOT SET**<br>The customer's valid cell number. If the email_address field is empty, and cell_number provided, the system will use the cell_number as the username and auto login the user, if they do not have a registered account |

If no return_url is submitted, the modal will just close on payment completion and customers will not be redirected to a success page.

**POST /onsite/process**
```
https://www.payfast.co.za/onsite/process
```

**RESPONSE**
```json
{
"uuid":
"123-abc"
}
```

**Payment identifier generation (Node.js):**
```javascript
const axios = require("axios");

const myData = {
  "merchant_id": "10000100",
  "merchant_key": "46f0cd694581a",
  ...
};
const passPhrase = 'jt7NOE43FZPn';

const dataToString = (dataArray) => {
  // Convert your data array to a string
  let pfParamString = "";
  for (let key in dataArray) {
    if(dataArray.hasOwnProperty(key)){pfParamString +=`${key}=${encodeURIComponent(dataArray[key].trim()).replace(/%20/g, "+")}&`;}
  }
  // Remove last ampersand
  return pfParamString.slice(0, -1);
};

const generatePaymentIdentifier = async (pfParamString) => {
  const result = await axios.post(`https://www.payfast.co.za/onsite/process`, pfParamString)
      .then((res) => {
        return res.data.uuid || null;
      })
      .catch((error) => {
        console.error(error)
      });
  console.log("res.data", result);
  return result;
};

// Generate signature (see Custom Integration -> Step 2)
myData["signature"] = generateSignature(myData, passPhrase);

// Convert the data array to a string
const pfParamString = dataToString(myData);

// Generate payment identifier
const identifier = await generatePaymentIdentifier(pfParamString);
```

#### Step 2: Trigger the modal popup

Once you have successfully retrieved the above UUID for the payment you can pass that into the Javascript for the payment page initialisation.
Place the following script inside of your document to initialise the payment modal on your website.

There are 2 initialisation options for the modal that can be used depending on how you would like payment completion to be handled.

**Onsite activation script:**
```html
<script src="https://www.payfast.co.za/onsite/engine.js"></script>
```

##### Method 1: Simple

This is the simplest method of triggering the payment modal.
All that is needed is to specify the uuid you received in the first step.
On payment success the buyer is redirected to your return url.

Additionally, if you did not specify the return and cancel urls while getting the unique identifier in step 1, you can add these to the call in this step.

**Method 1 - Simple:**
```javascript
window.payfast_do_onsite_payment({"uuid":"123-abc"});
```

**Method 1 - With URLs:**
```javascript
window.payfast_do_onsite_payment({
  "uuid":"123-abc",
  "return_url":"http://example.com",
  "cancel_url":"http://example.com"
});
```

##### Method 2: Callback

This method is triggered in the same way as the simple method, the difference is that with this method you can define a callback method.
On a final action (either a success or the user closing the popup) a call to the callback defined will be fired.

**Important**: When using the callback method, only the callback will be triggered and any return or cancel urls specified will be ignored!

**Method 2 - Callback:**
```javascript
window.payfast_do_onsite_payment({"uuid":"123-abc"}, function (result) {
  if (result === true) {
    // Payment Completed
  }
  else {
    // Payment Window Closed
  }
});
```

### Payment Confirmation

A payment confirmation notification will be sent to the "notify_url" you specified.
The full implementation details can be found here.

## Recurring Billing

Create two methods of recurring payments: Subscriptions and Tokenization.
For Recurring Billing only the credit card option can be used.

On successful payment completion and all subsequent recurring payments you will be sent a notification (see Confirm payment is successful).
A "token" parameter will be sent as part of the notification and is to be used for all further API calls related to the subscription.

On failed payments, Payfast will try a number of times to reprocess a payment where the customer does not have funds on their credit card. On failure, the customer will be notified, allowing some time for the problem to be resolved. On a complete failure (after X amount of times), the subscription will be 'locked' and will need some action from the merchant to reactivate on the Payfast account or via the API pause endpoint.

### Custom integration

Recurring Billing is set up in exactly the same manner as standard payments (see the above Quickstart guide), with the addition of the following fields.

#### Subscriptions

A recurring charge on a given date.
Payfast will charge the credit card according to the frequency, billing date and number of payments (cycles) specified in the payment request.

**Passphrase**: Please note that for Subscriptions a passphrase is REQUIRED in your signature.
To get a passphrase while testing in the sandbox, visit https://sandbox.payfast.co.za, under SETTINGS edit the "Salt Passphrase". You can now use the new passphrase and merchant credentials for your sandbox testing.

##### Additional subscription form fields

| Field | Description |
|-------|-------------|
| **subscription_type** | **REQUIRED FOR SUBSCRIPTIONS**<br>1 – sets type to a subscription |
| **billing_date** | **OPTIONAL**<br>The date from which future subscription payments will be made. Eg. 2020-01-01. Defaults to current date if not set. |
| **recurring_amount** | **OPTIONAL**<br>Future recurring amount for the subscription in ZAR. Defaults to the 'amount' value if not set. There is a minimum value of 5.00.<br>It is possible to set up a subscription or tokenization payment with an initial amount of R0.00. This would be used with subscriptions if the first cycle/period is free, or, in the case of tokenization payments it is used to set up the customers account on the merchants site, allowing for future payments. If the initial amount is R0.00 the customer will be redirected to Payfast, where they will input their credit card details and go through 3D Secure, but no money will be deducted. |
| **frequency** | **REQUIRED FOR SUBSCRIPTIONS**<br>The cycle period.<br>   1 - Daily<br>   2 - Weekly<br>   3 - Monthly<br>   4 - Quarterly<br>   5 - Biannually<br>   6 - Annual |
| **cycles** | **REQUIRED FOR SUBSCRIPTIONS**<br>The number of payments/cycles that will occur for this subscription. Set to 0 for indefinite subscription. |
| **subscription_notify_email** | **OPTIONAL**<br>Send the merchant an email notification 7 days before a subscription trial ends, or before a subscription amount increases.<br>This setting is enabled by default and can be changed via the merchant dashboard: Settings -> Recurring Billing. |
| **subscription_notify_webhook** | **OPTIONAL**<br>Send the merchant a webhook notification 7 days before a subscription trial ends, or before a subscription amount increases.<br>The webhook notification URL can be set via the merchant dashboard: Settings -> Recurring Billing. |
| **subscription_notify_buyer** | **OPTIONAL**<br>Send the buyer an email notification 7 days before a subscription trial ends, or before a subscription amount increases.<br>This setting is enabled by default and can be changed via the merchant dashboard: Settings -> Recurring Billing. |

**Subscription Variables:**
```html
<input type="hidden" name="subscription_type" value="1">
<input type="hidden" name="billing_date" value="2020-01-01">
<input type="hidden" name="recurring_amount" value="123.45">
<input type="hidden" name="frequency" value="3">
<input type="hidden" name="cycles" value="12">
<input type="hidden" name="subscription_notify_email" value="true">
<input type="hidden" name="subscription_notify_webhook" value="true">
<input type="hidden" name="subscription_notify_buyer" value="true">
```

##### Subscription trial webhook sample

```json
{
"type": "subscription.free-trial",
"token": "dc0521d3-55fe-269b-fa00-b647310d760f",
"initial_amount": 0,
"amount": 10000,
"next_run": "2021-03-30",
"frequency": "3",
"item_name": "Test Item",
"item_description": "A test product",
"name_first": "John",
"name_last": "Doe",
"email_address": "john@example.com"
}
```

###### Webhook attributes

| Field | Description |
|-------|-------------|
| **type** | **REQUIRED**<br>The type of webhook being sent, can be one of 'subscription.free-trial', 'subscription.promo' or 'subscription.update'. |
| **token** | **REQUIRED**<br>The Unique ID on Payfast that represents the subscription. |
| **initial_amount** | **REQUIRED**<br>The initial amount payable during the free trial or promotion period, in cents (ZAR). |
| **amount** | **REQUIRED**<br>The subscription amount, in cents (ZAR). |
| **next_run** | **OPTIONAL**<br>The next run date for the subscription. |
| **frequency** | **OPTIONAL**<br>The cycle period.<br>   1 - Daily<br>   2 - Weekly<br>   3 - Monthly<br>   4 - Quarterly<br>   5 - Biannually<br>   6 - Annual |
| **item_name** | **OPTIONAL**<br>The name of the item being charged for, or in the case of multiple items the order number. |
| **item_description** | **OPTIONAL**<br>The description of the item being charged for, or in the case of multiple items the order description. |
| **name_first** | **OPTIONAL**<br>The customer's first name. |
| **name_last** | **OPTIONAL**<br>The customer's last name. |
| **email_address** | **OPTIONAL**<br>The customer's email address. |

#### Tokenization

A recurring charge where the future dates and amounts of payments may be unknown.
Payfast will only charge the customer's card when instructed to do so via the API.
Tokenization payment agreements can be setup without charging the customer.

##### Additional tokenization form fields

| Field | Description |
|-------|-------------|
| **subscription_type** | **REQUIRED FOR SUBSCRIPTIONS**<br>2 – sets type to a tokenization payment |

**Tokenization Variable:**
```html
<input type="hidden" name="subscription_type" value="2">
```

#### Update card details

Provide buyers with a link to update their card details on a Recurring Billing subscription or Tokenization charges. This link will redirect them to Payfast in order to perform the update securely.

##### Additional tokenization form fields

| Field | Description |
|-------|-------------|
| **token** | **REQUIRED**<br>The buyers recurring billing subscription or recurring adhoc token |
| **return** | **OPTIONAL**<br>The URL where the buyer is returned to after updating their card details (or cancelling the update). If no return url is supplied there will be no redirect. |

**GET /eng/recurring/update**
```
https://www.payfast.co.za/eng/recurring/update/{token}?return={return}
```

**Example Usage:**
```html
<a href="https://www.payfast.co.za/eng/recurring/update/00000000-0000-0000-0000-000000000000?return=http://store.example.com">Update the card for your subscription</a>
```

### Additional methods of integrating Recurring Billing

For more information on other ways of setting up Subscriptions, such as through a Pay Now button, Payment Request or ecommerce platform plugins, click here

### Recurring Billing maintenance

Subscriptions can be edited, paused and cancelled either via the Payfast dashboard or the API.

- Update: Payfast dashboard guide | API guide
- Pause: Payfast dashboard guide | API guide
- Cancel: Payfast dashboard guide | API guide

## Split Payments

Instantly split a portion of an online payment with a third party. Read more

### Initial setup

You will need to enable Split Payments on your account. Setup details can be found here.
Only one receiving merchant can be allocated a Split Payment, per split transaction. Therefore the Merchant ID of this receiving merchant is mandatory.
All amounts used for the split must be in cents.

There are two methods of splitting a payment:

1. **Global setup**: By contacting Payfast support you can have a split setup on your account that will take affect on every transaction.

2. **Direct request**: Send the split data (see additional form fields below) embedded in the payment request. This gives you the flexibility to determine which payments a split should take affect on.
The data sent in this request will take precedence over anything setup on your account.

Where the request involved Recurring Billing, the split data will continue to be used on all subsequent recurring payments.

### Additional Split Payment form fields

| Field | Description |
|-------|-------------|
| **setup** | **REQUIRED FOR SPLIT PAYMENTS**<br>NB: Not included in the signature.<br>The value for setup needs to contain the JSON encoded payload for split_payment as shown in the example. |
| **merchant_id** | **REQUIRED**<br>The third party merchant that the payment is being split with. |
| **amount** | **REQUIRED IF NOT USING PERCENTAGE**<br>The amount in cents (ZAR), that will go to the third party merchant. |
| **percentage** | **REQUIRED IF NOT USING AMOUNT**<br>The percentage allocated to the third party merchant. |
| **min** | **OPTIONAL**<br>The minimum amount that will be split, in cents (ZAR) |
| **max** | **OPTIONAL**<br>The maximum amount that will be split, in cents (ZAR) |

**Split Payment input:**
```html
<input type="hidden" name="setup" value='{
  "split_payment" : {
    "merchant_id":10000105,
    "percentage":10,
    "min":100,
    "max":100000
  }
}'>
```

### Split Payment calculation

1. If both percentage and amount are specified, then the percentage will be deducted first, and then the amount will be deducted from the rest.

   Split amount: (40,000 – (40,000/10)) – 500) = 35,500 cents

   For example on an amount of R400 (40000 cents)
   ```json
   {
   "split_payment":
   {
   "merchant_id":
   10000105,
   "percentage":
   10,
   "amount":
   500,
   "min":
   100,
   "max":
   100000
   }
   }
   ```

2. If the split amount is smaller than the min, then the min will be used instead of the split amount.

   Split amount: (6,000 – 5500) = 500 cents (< min) = 1000 cents
   
   For example on an amount of R60 (6000 cents)
   ```json
   {
   "split_payment":
   {
   "merchant_id":
   10000105,
   "amount":
   5500,
   "min":
   1000,
   "max":
   100000
   }
   }
   ```

3. If the split amount is bigger than the max, then the max will be used instead of the split amount.

   Split amount: 40,000 – (40,000/10) = 36,000 cents (> max) = 20 000 cents
   
   For example on an amount of R400 (40000 cents)
   ```json
   {
   "split_payment":
   {
   "merchant_id":
   10000105,
   "percentage":
   10,
   "min":
   100,
   "max":
   20000
   }
   }
   ```

## PCI compliance

Payfast is PCI DSS level 1 compliant. PCI DSS stands for Payment Card Industry Data Security Standard and is a PASA (Payment Association of South Africa) regulation in South Africa, this means any company accepting credit card payments on their website needs to comply in some way.

Outsourcing your card payments to Payfast means you do not have to be concerned about the laborious process of being PCI compliant, and can rest assured in the knowledge that card information is handled securely.

For more information on PCI compliance you can refer our blog post, or to the PCI security standards best practices. You can, if need be, take the PCI self assessment questionaire.

## Testing and tools

Use our Sandbox to test your integration before going live.

### SDKs & Libraries

SDKs and libraries take the complexity out of integrations by providing language-specific APIs for Payfast services.

#### PHP SDK

The Payfast PHP SDK includes Custom Integration, Onsite Integration and all APIs.

[Github](https://github.com/PayFast/payfast-php-sdk)

### The Sandbox

The Payfast Sandbox is an exact code duplicate of the production site, available for running test transactions with.
Any transactions made or actions performed on this system are isolated from the main production environment, while providing a realistic experience of your integration with Payfast, before going live.

Using our Sandbox, you will be able to test your integration, once off payments and recurring payments, as well as receive ITNs, without any money changing hands.

**Sandbox URL:**
```
https://sandbox.payfast.co.za
```

#### Getting started:

To get started proceed to the above URL and enter your email address. The Sandbox dashboard has everything you need to test your integration. We recommend spending some time and familiarising yourself with the dashboard. There are helpful hints and tips to guide you on each page.

#### Payment methods:

The Sandbox allows you to test your integration without any money changing hands. The Sandbox makes use of a single payment method – a wallet with a substantially large dummy balance. While it is not possible to utilise the other payment methods in Sandbox, this will not affect your integration.

Sandbox is simply a tool to test your integration, the actual payment screen can not be simulated while performing test transactions. The Sandbox does not make any connections to external systems (allowing all payments to be successful).

#### Payment notifications:

The Sandbox will only send payment notifications once. You can view all sent notifications by navigating to ITN (Instant transaction notification) in the Sandbox.

#### Setting a passphrase:

This is required for all subscription and tokenization payments. It is the 'salt' added to your parameter string before generating the signature. To add or change your passphrase, simply visit the Account Information Tab on the left hand side and enter or edit your passphrase in the 'Salt Passphrase' input field.

#### Integration tools:

This section has been built to help you detect issues with your signature and assist where possible. The signature tool tests and evaluates a given parameter string and gives a result based on your input.

#### Test your integration:

This section was created to see what your signature should be with all your given variables. Fill out the form and click generate signature to allow Payfast to generate the correct signature for you and then submit to Payfast Sandbox. You will have the option to send through incorrect variables to see how we respond to certain variables.

#### Sandbox limitations:

The Sandbox does not make any connections to external systems (allowing all payments to be successful). Because the Sandbox makes use of Payfast's own personal buyer behind the scenes, all fields containing the party table will yield Test Buyer. This will not be the case when going live.

#### Recurring Billing tools:

Recurring Billing transactions require a passphrase to be set.

Subscriptions and tokenization payments completed in Sandbox can be viewed on your Sandbox account. Just like on the Payfast merchant account, you will be able to cancel, charge, pause and edit subscriptions. For tokenization payments, you will be able to charge and cancel them.

When editing a subscription you can change the amount, the number of cycles (payments), the next payment date and the frequency.

The subscription token does not display in the Sandbox, so be sure to capture this from the ITN!

### Test transaction setup

#### Merchant Details:

To get started you can use the credentials provided in your Sandbox, or you can use the following test credentials:

**Merchant Credentials:**
```
Merchant ID: 10000100
Merchant Key: 46f0cd694581a
Merchant Passphrase: jt7NOE43FZPn
```

These credentials can be found on your live or Sandbox dashboard after you have logged in.

They are unique to your account but the Sandbox merchant_id and merchant_key has no correlation to your live account.

#### Sandbox URLs:

| Purpose | URL |
|---------|-----|
| Post payment URL | https://sandbox.payfast.co.za/eng/process |
| Transaction notification URL | https://sandbox.payfast.co.za/eng/query/validate |

#### Make payment:

**Buyer credentials:**
```
Username:     sbtu01@payfast.io
Password:     clientpass
```

**Payfast wallet:**
For a once off payment, you will see the amount given for the transaction, and a Payfast wallet (which is reset to R99,999,999.99 every night). Complete the test transaction by clicking 'Pay Now Using Your Wallet'.

**Recurring payment:**
For a recurring payment, you will see a message about the recurring payment, as well as a test credit card and cvv number. In order to make the test payment, select the credit card and enter the cvv number provided and click 'Pay'.

Subscriptions require a Sandbox account with passphrase setup.

#### Payment success:

**Transaction notifications:**
View the success transaction notification by navigating to ITN (Instant transaction notification) in the Sandbox.

### Going Live

If you have ensured that your inputs to Payfast are correct in test transactions with the Sandbox, and have ensured that you can handle the appropriate responses, there should be no reason why the live system should perform any differently

To make your payments live, simply switch to your live credentials and the live URLs.

#### Live URLs:

| Purpose | URL |
|---------|-----|
| Post payment URL | https://www.payfast.co.za/eng/process |
| Transaction notification URL | https://www.payfast.co.za/eng/query/validate |

#### Merchant credentials:

Make sure that you have switched to your live Merchant ID and Merchant Key.

#### Test transactions:

Any payments transferred while testing live will appear in your Payfast wallet. It can then simply be paid out, once you are finished with the testing.

As per our requirements, you will not be able to process payments with an amount less than ZAR 5.00

Please note that any "test" transactions processed this way will be subject to the agreed transaction fees which can unfortunately not be refunded.

## Widgets

Add one of our Payfast widgets onto your website product page to display useful payment information.

### MoreTyme

**MoreTyme Add-ons for Your Website**
Create a personalised widget for your product web pages and increase sales on your site.
The widget informs your customers how much they need to pay upfront and for the next two payments with MoreTyme.

**Preview:**

Pay R 333.34 now with
PayFast & MoreTyme
and the rest in 2 interest-free payments. 
Learn More

**Code Snippet:**

Copy the code snippet into your website linked to the relevant product display, and simply change the amount to the price of the product displayed.
```html
<script async src="https://content.payfast.io/widgets/moretyme/widget.min.js?amount={product_price}" type="text/javascript"></script>
```

**MoreTyme Marketing Banner**
Download MoreTyme marketing material to promote this buy now, pay later payment method on your website.

## Ports and IP addresses

The following information can be used by system administrators if any changes need to be made to your servers when integrating with Payfast.

### Ports

When communicating with the notify url via the ITN, Payfast makes use of ports 80, 8080, 8081 and 443 only.

### IP addresses 

These are the Payfast server IPs. Our information can come from any of these IPs and we recommend white-listing all of these IPs.

**IP Addresses:**
```
197.97.145.144/28 (197.97.145.144 - 197.97.145.159)
41.74.179.192/27 (41.74.179.192 – 41.74.179.223)
102.216.36.0/28 (102.216.36.0 - 102.216.36.15)
102.216.36.128/28 (102.216.36.128 - 102.216.36.143)
144.126.193.139
```

## FAQs

If your questions are not answered here, please see our Knowledge Base.
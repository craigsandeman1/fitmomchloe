import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Download, Mail, Home, FileText, Clock } from 'lucide-react';
import { useMealPlanStore } from '../store/mealPlan';
import { useAuthStore } from '../store/auth';
import { supabase } from '../lib/supabase';
import { sendEmail } from '../lib/emailService';
import { PurchaseConfirmationEmail } from '../email-templates/user/purchaseConfirmEmail';
import { NewPurchaseNotification } from '../email-templates/admin/newPurchaseNotifyEmail';
import { generateMealPlanPDF, savePDF } from '../lib/meal-plan-generator';

interface PurchaseDetails {
  planId: string;
  planTitle: string;
  planType: 'meal_plan' | 'workout_plan';
  amount: number;
  userEmail: string;
  purchaseDate: string;
}

const PurchaseSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuthStore();
  const { mealPlans } = useMealPlanStore();
  
  const [purchaseDetails, setPurchaseDetails] = useState<PurchaseDetails | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const [emailSending, setEmailSending] = useState(false);
  const [downloadReady, setDownloadReady] = useState(false);
  const [processing, setProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processPurchase = async () => {
      try {
        // Debug logging
        console.log('PurchaseSuccess: Processing purchase...');
        console.log('PurchaseSuccess: Search params:', Object.fromEntries(searchParams.entries()));
        console.log('PurchaseSuccess: User:', user);
        
        // Get purchase details from URL parameters
        const planId = searchParams.get('planId');
        const planType = searchParams.get('type') as 'meal_plan' | 'workout_plan' || 'meal_plan';
        const amount = parseFloat(searchParams.get('amount') || '0');
        const paymentId = searchParams.get('payment_id');

        console.log('PurchaseSuccess: Extracted params:', { planId, planType, amount, paymentId });

        if (!planId || !user) {
          console.error('PurchaseSuccess: Missing required data:', { planId: !!planId, user: !!user });
          setError('Invalid purchase details or user not authenticated');
          setProcessing(false);
          return;
        }

        // Find the purchased plan
        const plan = mealPlans.find(p => p.id === planId);
        console.log('PurchaseSuccess: Found plan:', plan);
        
        if (!plan) {
          console.error('PurchaseSuccess: Plan not found for ID:', planId);
          setError('Purchased plan not found');
          setProcessing(false);
          return;
        }

        const details: PurchaseDetails = {
          planId,
          planTitle: plan.title,
          planType,
          amount: amount || plan.price,
          userEmail: user.email || '',
          purchaseDate: new Date().toISOString()
        };

        console.log('PurchaseSuccess: Purchase details:', details);
        setPurchaseDetails(details);

        // 1. Record the purchase in database (if not already recorded)
        await recordPurchase(details, paymentId);

        // 2. Send confirmation emails
        await sendConfirmationEmails(details);

        // 3. Prepare download
        setDownloadReady(true);
        setProcessing(false);

      } catch (err) {
        console.error('Error processing purchase:', err);
        setError('Error processing your purchase. Please contact support.');
        setProcessing(false);
      }
    };

    processPurchase();
  }, [searchParams, user, mealPlans]);

  const recordPurchase = async (details: PurchaseDetails, paymentId: string | null) => {
    if (!user) return;

    try {
      // Check if purchase already exists
      const { data: existingPurchase } = await supabase
        .from('purchases')
        .select('id')
        .eq('user_id', user.id)
        .eq('meal_plan_id', details.planId)
        .single();

      if (!existingPurchase) {
        const { error } = await supabase
          .from('purchases')
          .insert([
            {
              user_id: user.id,
              meal_plan_id: details.planId,
              amount: details.amount,
              payment_id: paymentId || `payfast_${Date.now()}`,
              created_at: details.purchaseDate
            }
          ]);

        if (error) {
          console.error('Error recording purchase:', error);
          throw error;
        }
      }
    } catch (err) {
      console.error('Error in recordPurchase:', err);
      // Don't throw error as purchase might still be valid
    }
  };

  const sendConfirmationEmails = async (details: PurchaseDetails) => {
    setEmailSending(true);
    
    try {
      // Create secure download link
      const downloadLink = `${window.location.origin}/meal-plans?download=${details.planId}&token=${btoa(details.userEmail + details.planId)}`;

      // Send customer confirmation email
      await sendEmail({
        to: details.userEmail,
        subject: `🎉 Your ${details.planTitle} is ready for download!`,
        reactTemplate: PurchaseConfirmationEmail({
          firstName: user?.user_metadata?.full_name?.split(' ')[0] || 'Valued Customer',
          planName: details.planTitle,
          downloadLink: downloadLink,
          purchaseDate: new Date(details.purchaseDate).toLocaleString()
        }),
      });

      // Send admin notification email
      const adminEmails = import.meta.env.VITE_ADMIN_EMAILS?.split(',') || [];
      if (adminEmails.length > 0) {
        await sendEmail({
          to: adminEmails,
          subject: '🛒 New Purchase Notification',
          reactTemplate: NewPurchaseNotification({
            firstName: user?.user_metadata?.full_name?.split(' ')[0] || 'Customer',
            userEmail: details.userEmail,
            planName: details.planTitle,
            purchaseDate: new Date(details.purchaseDate).toLocaleString()
          }),
        });
      }

      setEmailSent(true);
      console.log('Confirmation emails sent successfully');
    } catch (emailError) {
      console.error('Error sending confirmation emails:', emailError);
      setError('Purchase successful, but there was an issue sending confirmation emails. You can still download your plan below.');
    } finally {
      setEmailSending(false);
    }
  };

  const handleDownload = async () => {
    if (!purchaseDetails) return;

    try {
      const plan = mealPlans.find(p => p.id === purchaseDetails.planId);
      if (!plan) return;

      // Check if plan has a direct PDF URL
      if ((plan as any).pdf_url) {
        window.open((plan as any).pdf_url, '_blank');
        return;
      }

      // Generate PDF from plan content
      if (plan.content && plan.content.weeks) {
        // Convert MealPlan content to MealPlanData format
        const mealPlanData = {
          title: plan.title,
          subtitle: `Purchased on ${new Date(purchaseDetails.purchaseDate).toLocaleDateString()}`,
          author: 'Created by Fit Mom Chloe',
          introduction: plan.description || 'Welcome to your customized meal plan! Follow this guide carefully for best results.',
          days: plan.content.weeks.map(week => 
            week.days.map(day => ({
              day: day.day,
              meals: day.meals.map(meal => ({
                title: meal.name || 'Meal',
                description: (meal as any).description || meal.name || '',
                instructions: meal.instructions?.join('\n') || '',
                ingredients: meal.ingredients || []
              }))
            }))
          ).flat(),
          appendix: (plan.content as any).appendix || undefined
        };
        
        const pdfBlob = await generateMealPlanPDF(mealPlanData);
        savePDF(pdfBlob, `${plan.title.replace(/\s+/g, '_')}_meal_plan.pdf`);
      } else {
        // Fallback: create simple PDF with plan info
        const fallbackContent = {
          title: plan.title,
          description: plan.description,
          price: plan.price,
          purchaseInfo: {
            date: purchaseDetails.purchaseDate,
            customer: purchaseDetails.userEmail
          }
        };
        
        const blob = new Blob([JSON.stringify(fallbackContent, null, 2)], { 
          type: 'application/json' 
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${plan.title.replace(/\s+/g, '_')}_meal_plan.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (downloadError) {
      console.error('Error downloading plan:', downloadError);
      setError('Error generating download. Please try again or contact support.');
    }
  };

  const goToMealPlans = () => {
    navigate('/meal-plans');
  };

  const goHome = () => {
    navigate('/');
  };

  if (processing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Processing your purchase...</h2>
          <p className="text-gray-500 mt-2">Please wait while we prepare your meal plan</p>
        </div>
      </div>
    );
  }

  if (error || !purchaseDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center bg-white rounded-lg shadow-lg p-8">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Oops! Something went wrong</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={goToMealPlans}
              className="w-full py-3 px-4 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
            >
              Go to Meal Plans
            </button>
            <button
              onClick={goHome}
              className="w-full py-3 px-4 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-6">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Purchase Successful! 🎉
            </h1>
            <p className="text-xl text-gray-600">
              Thank you for purchasing <strong>{purchaseDetails.planTitle}</strong>
            </p>
          </div>

          {/* Purchase Details Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Purchase Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Plan</h3>
                <p className="text-lg text-gray-900">{purchaseDetails.planTitle}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Amount</h3>
                <p className="text-lg text-gray-900">R{purchaseDetails.amount.toFixed(2)}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Email</h3>
                <p className="text-lg text-gray-900">{purchaseDetails.userEmail}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Date</h3>
                <p className="text-lg text-gray-900">
                  {new Date(purchaseDetails.purchaseDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Email Status */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Mail className="w-6 h-6 text-blue-500 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-800">Email Confirmation</h3>
                    <p className="text-gray-600 text-sm">
                      {emailSending ? 'Sending confirmation email...' :
                       emailSent ? 'Confirmation email sent to your inbox' :
                       'Email will be sent shortly'}
                    </p>
                  </div>
                </div>
                {emailSending && <Clock className="w-5 h-5 text-blue-500 animate-spin" />}
                {emailSent && <CheckCircle className="w-5 h-5 text-green-500" />}
              </div>
            </div>

            {/* Download Section */}
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Ready to Download Your Plan
              </h3>
              <p className="text-gray-600 mb-6">
                Your meal plan is ready for download. You can also access it anytime from your meal plans page.
              </p>
              
              <div className="space-y-4">
                <button
                  onClick={handleDownload}
                  disabled={!downloadReady}
                  className="w-full py-4 px-6 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg font-semibold text-lg flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  <Download className="w-6 h-6 mr-3" />
                  Download Your Meal Plan PDF
                </button>
                
                <div className="flex space-x-4">
                  <button
                    onClick={goToMealPlans}
                    className="flex-1 py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium flex items-center justify-center transition-colors"
                  >
                    <FileText className="w-5 h-5 mr-2" />
                    View All Plans
                  </button>
                  
                  <button
                    onClick={goHome}
                    className="flex-1 py-3 px-4 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium flex items-center justify-center transition-colors"
                  >
                    <Home className="w-5 h-5 mr-2" />
                    Go Home
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <h3 className="font-semibold text-blue-800 mb-2">What's Next?</h3>
            <p className="text-blue-700 text-sm">
              Check your email for the confirmation with download link. 
              You can also access your purchase anytime from the meal plans page.
              If you have any questions, feel free to contact our support team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseSuccess; 
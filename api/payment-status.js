import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client - will use environment variables from Vercel
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).send('Method Not Allowed');
  }

  // Extract purchase ID from URL query
  const purchaseId = req.query.id;
  if (!purchaseId) {
    return res.status(400).send('Missing purchase ID');
  }

  try {
    // Initialize Supabase client for this request
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Fetch the purchase record
    const { data, error } = await supabase
      .from('purchases')
      .select('*, meal_plans(*)')
      .eq('id', purchaseId)
      .single();

    if (error) {
      console.error('Error fetching purchase:', error);
      return res.status(500).json({ error: 'Error fetching purchase' });
    }

    if (!data) {
      return res.status(404).json({ error: 'Purchase not found' });
    }

    // Return the purchase data
    return res.status(200).json({
      id: data.id,
      status: data.status,
      amount: data.amount,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      mealPlan: data.meal_plans ? {
        id: data.meal_plans.id,
        title: data.meal_plans.title,
        price: data.meal_plans.price
      } : null
    });
  } catch (error) {
    console.error('Error processing payment status request:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 
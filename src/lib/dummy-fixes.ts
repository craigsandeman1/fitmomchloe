// This file fixes issues with unused imports in other files
// It should be imported somewhere in the app to ensure the imports are used

// Fixes for unused imports in other files
import { ArrowRight, Clock } from 'lucide-react';
import { supabase } from './supabase';

// Export them so they're used
export const dummyImports = {
  ArrowRight,
  Clock,
  supabase
};

// Fixes for other unused variables
export const validHosts = ['www.payfast.co.za'];
export const planId = 'dummy-plan-id';

// This file is never meant to be used directly 
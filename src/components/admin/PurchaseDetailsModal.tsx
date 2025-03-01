import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { Purchase } from '../../types';

interface PurchaseDetailsModalProps {
  purchase: Purchase;
  onClose: () => void;
  onUpdate: () => void;
}

type PaymentStatus = 'pending' | 'completed' | 'failed';

const PurchaseDetailsModal: React.FC<PurchaseDetailsModalProps> = ({ 
  purchase, 
  onClose,
  onUpdate 
}) => {
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<PaymentStatus>(purchase.status as PaymentStatus);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(e.target.value as PaymentStatus);
  };

  const updateStatus = async () => {
    if (selectedStatus === purchase.status) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('purchases')
        .update({ status: selectedStatus })
        .eq('id', purchase.id);
        
      if (error) throw error;
      
      // Call the onUpdate callback to refresh the parent component
      onUpdate();
    } catch (error) {
      console.error('Error updating purchase status:', error);
      alert('Error updating status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Order Details</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Order Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-4 text-gray-700">Order Information</h3>
              
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-500">Order ID</span>
                  <p className="font-mono text-sm">{purchase.id}</p>
                </div>
                
                <div>
                  <span className="text-sm text-gray-500">Date</span>
                  <p>{new Date(purchase.created_at).toLocaleString()}</p>
                </div>
                
                <div>
                  <span className="text-sm text-gray-500">Amount</span>
                  <p className="font-semibold">R{purchase.amount.toFixed(2)}</p>
                </div>
                
                <div>
                  <span className="text-sm text-gray-500">Order Status</span>
                  <div className="flex items-center space-x-2 mt-1">
                    <select
                      value={selectedStatus}
                      onChange={handleStatusChange}
                      className="border rounded-md px-2 py-1 text-sm"
                      disabled={loading}
                    >
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="failed">Failed</option>
                    </select>
                    
                    <button
                      onClick={updateStatus}
                      disabled={selectedStatus === purchase.status || loading}
                      className={`px-3 py-1 rounded text-xs font-medium ${
                        selectedStatus === purchase.status || loading
                          ? 'bg-gray-200 text-gray-500'
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}
                    >
                      {loading ? 'Updating...' : 'Update'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-4 text-gray-700">Customer Information</h3>
              
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-500">Email</span>
                  <p>{purchase.email}</p>
                </div>
                
                <div>
                  <span className="text-sm text-gray-500">User ID</span>
                  <p className="font-mono text-sm">{purchase.user_id || 'Not available'}</p>
                </div>
                
                <div>
                  <span className="text-sm text-gray-500">Payment ID</span>
                  <p className="font-mono text-sm">{purchase.payment_id || 'Not available'}</p>
                </div>
              </div>
            </div>

            {/* Product Information */}
            <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
              <h3 className="font-semibold text-lg mb-4 text-gray-700">Product Information</h3>
              
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-500">Meal Plan</span>
                  <p className="font-semibold">{purchase.meal_plans?.title || 'Unknown Meal Plan'}</p>
                </div>
                
                {purchase.meal_plans?.description && (
                  <div>
                    <span className="text-sm text-gray-500">Description</span>
                    <p>{purchase.meal_plans.description}</p>
                  </div>
                )}
                
                <div>
                  <span className="text-sm text-gray-500">Price</span>
                  <p>R{purchase.meal_plans?.price.toFixed(2) || 'N/A'}</p>
                </div>
                
                <div>
                  <span className="text-sm text-gray-500">Meal Plan ID</span>
                  <p className="font-mono text-sm">{purchase.meal_plan_id || 'Not available'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded-md text-gray-800 hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseDetailsModal; 
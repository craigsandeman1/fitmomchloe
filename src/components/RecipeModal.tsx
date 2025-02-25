import { X, Clock, ChevronRight, Printer, Download } from 'lucide-react';
import type { Meal } from '../lib/types';

interface RecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipe: {
    title: string;
    type: string;
    meal: Meal;
  } | null;
}

const RecipeModal = ({ isOpen, onClose, recipe }: RecipeModalProps) => {
  if (!isOpen || !recipe) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    // Implement PDF download functionality
    console.log('Downloading PDF...');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white w-full max-w-3xl rounded-xl shadow-2xl">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>

          {/* Content */}
          <div className="p-8">
            {/* Header */}
            <div className="mb-8">
              <span className="text-primary text-sm font-medium mb-2 block">
                {recipe.type.toUpperCase()}
              </span>
              <h2 className="font-playfair text-3xl mb-2">{recipe.title}</h2>
              <h3 className="text-xl text-gray-600">{recipe.meal.name}</h3>
            </div>

            {/* Nutritional Info */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              {Object.entries(recipe.meal.nutritionalInfo).map(([key, value]) => (
                <div key={key} className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-sm text-gray-500 capitalize mb-1">{key}</div>
                  <div className="font-medium text-lg">
                    {value}{key === 'calories' ? 'kcal' : 'g'}
                  </div>
                </div>
              ))}
            </div>

            {/* Two Columns Layout */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Ingredients */}
              <div>
                <h4 className="font-medium text-lg mb-4">Ingredients</h4>
                <ul className="space-y-2">
                  {recipe.meal.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <ChevronRight size={16} className="text-primary" />
                      <span>{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Instructions */}
              <div>
                <h4 className="font-medium text-lg mb-4">Instructions</h4>
                <ol className="space-y-4">
                  {recipe.meal.instructions.map((instruction, index) => (
                    <li key={index} className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">
                        {index + 1}
                      </span>
                      <span className="text-gray-600">{instruction}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 pt-8 border-t flex justify-end gap-4">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <Printer size={20} />
                <span>Print Recipe</span>
              </button>
              <button
                onClick={handleDownloadPDF}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Download size={20} />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeModal; 
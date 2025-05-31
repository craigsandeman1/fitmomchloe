import React, { useState, useRef } from 'react';
import { X, Upload, Image } from 'lucide-react';
import { WorkoutPlan } from '../../types/workout-plan';

interface WorkoutPlanFormProps {
  editingWorkoutPlan: WorkoutPlan | null;
  onSubmit: (workoutPlan: WorkoutPlan, files?: { pdfFile?: File, thumbnailFile?: File }) => void;
  onCancel: () => void;
}

const WorkoutPlanForm: React.FC<WorkoutPlanFormProps> = ({
  editingWorkoutPlan,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<WorkoutPlan>(() => ({
    id: editingWorkoutPlan?.id || null,
    title: editingWorkoutPlan?.title || '',
    description: editingWorkoutPlan?.description || '',
    price: editingWorkoutPlan?.price || 0,
    content: editingWorkoutPlan?.content || { weeks: [] },
    fitness_type: editingWorkoutPlan?.fitness_type || '',
    difficulty_level: editingWorkoutPlan?.difficulty_level || '',
    workout_duration: editingWorkoutPlan?.workout_duration || '',
    duration_weeks: editingWorkoutPlan?.duration_weeks || 1,
    estimated_calories_burned: editingWorkoutPlan?.estimated_calories_burned || 0,
    includes_equipment_list: editingWorkoutPlan?.includes_equipment_list || false,
    includes_exercise_descriptions: editingWorkoutPlan?.includes_exercise_descriptions || false,
    target_muscle_groups: editingWorkoutPlan?.target_muscle_groups || ''
  }));

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: keyof WorkoutPlan, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePdfFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
    } else {
      alert('Please select a PDF file');
      if (pdfInputRef.current) {
        pdfInputRef.current.value = '';
      }
    }
  };

  const handleThumbnailFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please select an image file');
      if (thumbnailInputRef.current) {
        thumbnailInputRef.current.value = '';
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('Please enter a workout plan title');
      return;
    }

    const files: { pdfFile?: File, thumbnailFile?: File } = {};
    if (pdfFile) files.pdfFile = pdfFile;
    if (thumbnailFile) files.thumbnailFile = thumbnailFile;

    onSubmit(formData, files);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {editingWorkoutPlan?.id ? 'Edit Workout Plan' : 'Create New Workout Plan'}
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Workout Plan Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (R)
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                min="0"
                step="0.01"
              />
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Describe what this workout plan includes and who it's designed for..."
            />
          </div>
        </div>

        {/* Workout Details */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Workout Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fitness Type
              </label>
              <select
                value={formData.fitness_type}
                onChange={(e) => handleInputChange('fitness_type', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Type</option>
                <option value="Full Body">Full Body</option>
                <option value="Upper Body">Upper Body</option>
                <option value="Lower Body">Lower Body</option>
                <option value="Cardio">Cardio</option>
                <option value="Strength">Strength</option>
                <option value="HIIT">HIIT</option>
                <option value="Yoga">Yoga</option>
                <option value="Pilates">Pilates</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Difficulty Level
              </label>
              <select
                value={formData.difficulty_level}
                onChange={(e) => handleInputChange('difficulty_level', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Level</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Workout Duration
              </label>
              <input
                type="text"
                value={formData.workout_duration}
                onChange={(e) => handleInputChange('workout_duration', e.target.value)}
                placeholder="e.g. 45-60 minutes"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (Weeks)
              </label>
              <input
                type="number"
                value={formData.duration_weeks}
                onChange={(e) => handleInputChange('duration_weeks', parseInt(e.target.value) || 1)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estimated Calories Burned
              </label>
              <input
                type="number"
                value={formData.estimated_calories_burned}
                onChange={(e) => handleInputChange('estimated_calories_burned', parseInt(e.target.value) || 0)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                min="0"
                placeholder="per session"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Muscle Groups
              </label>
              <input
                type="text"
                value={formData.target_muscle_groups}
                onChange={(e) => handleInputChange('target_muscle_groups', e.target.value)}
                placeholder="e.g. Full Body, Arms, Legs"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.includes_equipment_list}
                onChange={(e) => handleInputChange('includes_equipment_list', e.target.checked)}
                className="mr-2"
              />
              <label className="text-sm text-gray-700">Includes Equipment List</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.includes_exercise_descriptions}
                onChange={(e) => handleInputChange('includes_exercise_descriptions', e.target.checked)}
                className="mr-2"
              />
              <label className="text-sm text-gray-700">Includes Exercise Descriptions</label>
            </div>
          </div>
        </div>

        {/* File Uploads */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Files</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Workout Plan PDF *
              </label>
              <input
                ref={pdfInputRef}
                type="file"
                accept=".pdf"
                onChange={handlePdfFileChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
              {pdfFile && (
                <p className="text-sm text-green-600 mt-1">PDF selected: {pdfFile.name}</p>
              )}
              {!pdfFile && formData.content?.metadata?.pdfUrl && (
                <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded">
                  <p className="text-sm text-blue-700">Current PDF:</p>
                  <a 
                    href={formData.content.metadata.pdfUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 underline"
                  >
                    View existing PDF
                  </a>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">Upload your complete workout plan as a PDF document</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thumbnail Image
              </label>
              <input
                ref={thumbnailInputRef}
                type="file"
                accept="image/*"
                onChange={handleThumbnailFileChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
              {(thumbnailPreview || formData.content?.metadata?.thumbnailUrl) && (
                <img
                  src={thumbnailPreview || formData.content?.metadata?.thumbnailUrl}
                  alt="Thumbnail preview"
                  className="mt-2 h-20 w-20 object-cover rounded-md"
                />
              )}
              <p className="text-xs text-gray-500 mt-1">Optional: Upload a cover image for your workout plan</p>
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {editingWorkoutPlan?.id ? 'Update Workout Plan' : 'Create Workout Plan'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default WorkoutPlanForm; 
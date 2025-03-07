import { useState, ChangeEvent, useEffect } from 'react';
import { Upload, DollarSign, FileText, Image, X } from 'lucide-react';
import { MealPlan } from '../../types/meal-plan';
import { generateMealPlanPDF, savePDF, MealPlanData } from '../../lib/meal-plan-generator';

// Add a type for file URLs
interface FileUrls {
  pdfUrl?: string;
  thumbnailUrl?: string;
}

interface MealPlanFormProps {
  editingMealPlan: MealPlan | null;
  onSubmit: (mealPlan: MealPlan, files?: { pdfFile?: File, thumbnailFile?: File }) => Promise<void>;
  onCancel: () => void;
}

const MealPlanForm = ({ editingMealPlan, onSubmit, onCancel }: MealPlanFormProps) => {
  const [name, setName] = useState(editingMealPlan?.title || '');
  const [price, setPrice] = useState(editingMealPlan?.price ? String(editingMealPlan.price) : '');
  const [description, setDescription] = useState(editingMealPlan?.description || '');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [pdfFileName, setPdfFileName] = useState('');
  const [thumbnailFileName, setThumbnailFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [mealPlanText, setMealPlanText] = useState('');
  const [isFormattingText, setIsFormattingText] = useState(false);
  
  // Store the current file URLs if they exist
  const [fileUrls, setFileUrls] = useState<FileUrls>({
    pdfUrl: (editingMealPlan as any)?.pdf_url,
    thumbnailUrl: (editingMealPlan as any)?.thumbnail_url
  });

  // Add effect to populate text area from PDF content when editing
  useEffect(() => {
    if (editingMealPlan?.content?.rawText) {
      // If there's raw text stored, use that
      setMealPlanText(editingMealPlan.content.rawText);
    } else if (editingMealPlan?.id) {
      // Otherwise try to generate text from structured content
      try {
        // Reconstruct text from meal plan content if available
        const reconstructedText = reconstructMealPlanText(editingMealPlan);
        setMealPlanText(reconstructedText);
      } catch (error) {
        console.error('Error reconstructing meal plan text:', error);
      }
    }
  }, [editingMealPlan]);

  // Function to reconstruct meal plan text from structured content
  const reconstructMealPlanText = (mealPlan: MealPlan): string => {
    let text = mealPlan.title || 'Weight Loss Meal Plan';
    text += '\n\n';
    
    // Add introduction if exists
    if (mealPlan.description) {
      text += mealPlan.description + '\n\n';
    }
    
    // Add days content if exists
    if (mealPlan.content?.weeks && mealPlan.content.weeks.length > 0) {
      mealPlan.content.weeks.forEach(week => {
        if (week.days && week.days.length > 0) {
          week.days.forEach(day => {
            text += `DAY ${day.day || ''}\n`;
            
            if (day.meals && day.meals.length > 0) {
              day.meals.forEach(meal => {
                text += `${meal.type || 'MEAL'}:\n`;
                text += `${meal.name || ''}\n`;
                if (meal.description) {
                  text += `${meal.description}\n`;
                }
                text += '\n';
              });
            }
            
            text += '\n';
          });
        }
      });
    }
    
    // Add appendix section if exists
    if (mealPlan.content?.appendix) {
      text += 'APPENDIX\n\n';
      
      const appendix = mealPlan.content.appendix;
      
      if (appendix.snacks && appendix.snacks.length > 0) {
        text += 'LIST OF ACCEPTABLE SNACKS:\n';
        appendix.snacks.forEach((snack: string) => {
          text += `• ${snack}\n`;
        });
        text += '\n';
      }
      
      if (appendix.supplements && appendix.supplements.length > 0) {
        text += 'SUPPLEMENTS FOR BLOATING AND WEIGHT LOSS:\n';
        appendix.supplements.forEach((supplement: string) => {
          text += `• ${supplement}\n`;
        });
        text += '\n';
      }
      
      if (appendix.breakfasts && appendix.breakfasts.length > 0) {
        text += 'OPTIONAL BREAKFAST IDEAS:\n';
        appendix.breakfasts.forEach((breakfast: string) => {
          text += `• ${breakfast}\n`;
        });
        text += '\n';
      }
      
      if (appendix.reminder) {
        text += `REMEMBER TO DRINK WATER!!!\n${appendix.reminder}\n`;
      }
    }
    
    return text;
  };

  const handlePdfChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Check if file is PDF
      if (file.type !== 'application/pdf') {
        alert('Please upload a PDF file');
        return;
      }
      setPdfFile(file);
      setPdfFileName(file.name);
    }
  };

  const handleThumbnailChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }
      setThumbnailFile(file);
      setThumbnailFileName(file.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      alert('Please enter a meal plan name');
      return;
    }
    
    if (!price.trim() || isNaN(parseFloat(price))) {
      alert('Please enter a valid price');
      return;
    }
    
    if (!editingMealPlan && !pdfFile) {
      alert('Please upload a PDF file');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Create a new meal plan object based on the form data
      const updatedMealPlan: MealPlan = {
        ...(editingMealPlan || {}),
        id: editingMealPlan?.id || null,
        title: name,
        price: parseFloat(price),
        description: description,
        content: {
          ...(editingMealPlan?.content || { weeks: [] }),
          // Store the raw text to preserve it for future editing
          rawText: mealPlanText
        }
      };
      
      const files: { pdfFile?: File, thumbnailFile?: File } = {};
      if (pdfFile) files.pdfFile = pdfFile;
      if (thumbnailFile) files.thumbnailFile = thumbnailFile;
      
      // Pass the meal plan data and files to the parent component
      await onSubmit(updatedMealPlan, Object.keys(files).length > 0 ? files : undefined);
      
      // After successful submission, reset the form
      if (!editingMealPlan) {
        setName('');
        setPrice('');
        setDescription('');
        setPdfFile(null);
        setThumbnailFile(null);
        setPdfFileName('');
        setThumbnailFileName('');
      }
    } catch (error) {
      console.error('Error submitting meal plan:', error);
      alert('Failed to save meal plan. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Automatically format text when pasted to remove unnecessary line breaks
  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    // Prevent default paste behavior
    e.preventDefault();
    
    // Get pasted text from clipboard
    const pastedText = e.clipboardData.getData('text');
    
    // Format the pasted text
    const formattedText = formatPastedText(pastedText);
    
    // Update the textarea with formatted text
    setMealPlanText(formattedText);
  };

  // Formats pasted text by joining paragraphs and preserving important line breaks
  const formatPastedText = (text: string): string => {
    // Split text into lines
    const lines = text.split('\n');
    const formattedLines: string[] = [];
    
    let currentParagraph = '';
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Skip completely empty lines
      if (line === '') {
        if (currentParagraph) {
          formattedLines.push(currentParagraph);
          currentParagraph = '';
        }
        continue;
      }
      
      // Preserve line breaks for section headers and day markers
      const isDayHeader = line.match(/^DAY \d+/i);
      const isSectionHeader = line.match(/^(APPENDIX|LUNCH|DINNER|BREAKFAST|SNACK|SUPPLEMENTS|LIST OF|OPTIONAL BREAKFAST|REMEMBER TO|CHEAT MEAL)/i);
      const isTitle = line.match(/^(Weight Loss Meal Plan|[\d]+ DAY PLANNER:)/i);
      
      if (isDayHeader || line === 'APPENDIX' || isSectionHeader || isTitle) {
        // Add a blank line before section headers for better readability
        if (currentParagraph) {
          formattedLines.push(currentParagraph);
          currentParagraph = '';
          // Add empty line before new section header
          if (formattedLines.length > 0) {
            formattedLines.push('');
          }
        }
        
        formattedLines.push(line);
        continue;
      }
      
      // Check if this is a bullet point or list item
      const isBulletPoint = line.match(/^[\s•\-–—*→⁃◦‣⦿⦾⧫⧩⪧⪢⫸⭐✓✔✗✘❌✅⭕]/) ||
                           line.match(/^(\d+)[\.)]/) ||
                           line.match(/^[a-zA-Z][\).]/);
      
      // If it's a bullet point or the first line of a paragraph
      if (isBulletPoint || !currentParagraph) {
        // End previous paragraph if it exists
        if (currentParagraph) {
          formattedLines.push(currentParagraph);
        }
        // Start new paragraph with this line
        currentParagraph = line;
      } else {
        // Continue the current paragraph, joining it with a space
        currentParagraph += ' ' + line;
      }
    }
    
    // Add the last paragraph if it exists
    if (currentParagraph) {
      formattedLines.push(currentParagraph);
    }
    
    // Join all lines with newlines
    return formattedLines.join('\n');
  };
  
  // Handle textarea change with formatting
  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    
    // Only apply formatting when not already formatting to prevent loops
    if (!isFormattingText) {
      setMealPlanText(newText);
    }
  };
  
  // Apply formatting to existing text
  const applyFormatting = () => {
    if (!mealPlanText.trim() || isFormattingText) return;
    
    setIsFormattingText(true);
    try {
      const formattedText = formatPastedText(mealPlanText);
      setMealPlanText(formattedText);
    } finally {
      setIsFormattingText(false);
    }
  };

  // Parse the meal plan text to create a structured meal plan data object
  const parseMealPlanText = (text: string): MealPlanData => {
    // Better line splitting to handle different line endings
    const lines = text.split(/\r?\n/).map(line => line.trim());
    
    // Extract title from the first line
    const title = lines[0] ? lines[0].trim() : '7-DAY WEIGHT LOSS MEAL PLAN';
    
    // Find the introduction section (before the first DAY)
    let introEndIndex = -1;
    for (let i = 1; i < lines.length; i++) { // Start from index 1 to skip title
      if (lines[i].match(/^DAY \d+/i)) {
        introEndIndex = i;
        break;
      }
    }
    
    // Extract the introduction - use more lines if available
    const introLines = introEndIndex > 0 
      ? lines.slice(1, introEndIndex).filter(line => line.trim() !== '')
      : lines.slice(1, 5).filter(line => line.trim() !== '');
    
    // Join intro lines with proper paragraph formatting - but don't add HTML tags here
    // They'll be added in the PDF generator
    const introduction = introLines.length > 0
      ? introLines.join('\n\n') // Just use double newlines to separate paragraphs
      : 'Welcome to your customized meal plan! Follow this guide carefully for best results.';
    
    // Find all day sections and their content
    const dayRegex = /^DAY (\d+)/i;
    const days: any[] = [];
    
    let currentDay: any = null;
    let currentMeal: any = null;
    let appendixContent: string[] = [];
    let isInAppendix = false;
    
    let mealContentBuffer: string[] = [];
    
    const finalizeMeal = () => {
      if (currentMeal && mealContentBuffer.length > 0) {
        // Process and add accumulated content to current meal
        const mealText = mealContentBuffer.join('\n');
        currentMeal.ingredients = mealText.split('\n')
          .map(line => line.trim())
          .filter(line => line !== '');
        
        // Reset buffer
        mealContentBuffer = [];
      }
    };
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Skip empty lines
      if (line === '') continue;
      
      // Check if we reached the appendix
      if (line.toUpperCase() === 'APPENDIX') {
        isInAppendix = true;
        
        // Finalize the current meal before moving to appendix
        finalizeMeal();
        continue;
      }
      
      if (isInAppendix) {
        // Add all appendix content
        appendixContent.push(line);
        continue;
      }
      
      // Check if this is a new day
      const dayMatch = line.match(dayRegex);
      if (dayMatch) {
        // Finalize the previous meal if exists
        finalizeMeal();
        
        if (currentDay) {
          days.push(currentDay);
        }
        
        currentDay = {
          day: dayMatch[1],
          meals: []
        };
        currentMeal = null;
        continue;
      }
      
      // Handle meal types including common patterns
      const isMealHeader = 
        line.match(/^(BREAKFAST|LUNCH|DINNER|SNACK|MEAL|CHEAT MEAL)[:\s]*/i) || 
        line.match(/^[A-Z][A-Z\s]+:$/);
      
      if (isMealHeader) {
        // Finalize the previous meal if exists
        finalizeMeal();
        
        // Extract the meal title, remove trailing colon if present
        const mealTitle = line.replace(/:\s*$/, '').trim();
        
        currentMeal = {
          title: mealTitle,
          ingredients: []
        };
        
        if (currentDay) {
          currentDay.meals.push(currentMeal);
        }
        continue;
      }
      
      // Add content to current meal
      if (currentMeal && line.length > 0) {
        mealContentBuffer.push(line);
      } else if (currentDay && !currentMeal && line.length > 0) {
        // Create a default meal if we have content but no meal header yet
        currentMeal = {
          title: 'MEAL',
          ingredients: []
        };
        currentDay.meals.push(currentMeal);
        mealContentBuffer.push(line);
      }
    }
    
    // Finalize the last meal
    finalizeMeal();
    
    // Add the last day if exists
    if (currentDay) {
      days.push(currentDay);
    }
    
    // Process appendix content more carefully
    let snacks: string[] = [];
    let supplements: string[] = [];
    let breakfasts: string[] = [];
    let reminder: string = '';
    let additionalSections: {[key: string]: string[]} = {};
    let sectionTitles: {[key: string]: string} = {};
    
    // Join all appendix content
    const appendixText = appendixContent.join('\n');
    
    // Find all section headers in the appendix (ALL CAPS or lines ending with colon)
    const sectionHeaders: string[] = [];
    const appendixLines = appendixText.split('\n');
    
    for (let i = 0; i < appendixLines.length; i++) {
      const line = appendixLines[i].trim();
      
      // Check for section headers (but exclude list items with colons in them):
      // 1. ALL CAPS lines (at least 3 characters) that are not just bullet points
      // 2. Lines ending with a colon that don't start with bullet points and are preceded by an empty line
      if ((line.length > 3 && line === line.toUpperCase() && !/^[•\-*]\s*$/.test(line)) ||
          (line.length > 3 && line.endsWith(':') && 
           !/^[•\-*]/.test(line) && // not starting with a bullet
           (i === 0 || appendixLines[i-1].trim() === ''))) { // preceded by empty line or first line
        // Store the exact title (without the colon)
        const cleanTitle = line.endsWith(':') ? line.slice(0, -1).trim() : line;
        sectionHeaders.push(cleanTitle);
      }
    }
    
    console.log('Detected section headers:', sectionHeaders);
    
    // More robust section extraction with exact title preservation
    const extractSection = (sectionTitle: string, otherSections: string[]): [string[], string] => {
      // Store the exact title for use in the PDF
      const exactTitle = sectionTitle;
      
      // Search for title with and without colon
      let startIndex = appendixText.indexOf(sectionTitle);
      if (startIndex === -1) {
        startIndex = appendixText.indexOf(sectionTitle + ':');
      }
      
      if (startIndex === -1) {
        return [[], exactTitle];
      }
      
      // Find the end by looking for the next section
      let endIndex = appendixText.length;
      for (const section of otherSections) {
        // Check for section with and without colon
        let idx = appendixText.indexOf(section, startIndex + sectionTitle.length);
        if (idx === -1) {
          idx = appendixText.indexOf(section + ':', startIndex + sectionTitle.length);
        }
        
        if (idx !== -1 && idx < endIndex) {
          endIndex = idx;
        }
      }
      
      // Extract the section content
      const startOffset = startIndex + sectionTitle.length;
      // Skip the colon if present
      const colonOffset = appendixText.charAt(startOffset) === ':' ? 1 : 0;
      const sectionText = appendixText.substring(startOffset + colonOffset, endIndex).trim();
      
      // Process the content into list items
      return [
        sectionText.split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0)
          .map(line => line.replace(/^[•\-*]\s*/, ''))
          .filter(line => line.length > 0),
        exactTitle
      ];
    };
    
    // Extract standard sections
    const [snacksItems, snacksTitle] = extractSection(
      'LIST OF ACCEPTABLE SNACKS', 
      ['SUPPLEMENTS', 'OPTIONAL BREAKFAST', 'REMEMBER']
    );
    snacks = snacksItems;
    
    const [supplementsItems, supplementsTitle] = extractSection(
      'SUPPLEMENTS', 
      ['LIST OF ACCEPTABLE SNACKS', 'OPTIONAL BREAKFAST', 'REMEMBER']
    );
    supplements = supplementsItems;
    
    const [breakfastsItems, breakfastsTitle] = extractSection(
      'OPTIONAL BREAKFAST', 
      ['LIST OF ACCEPTABLE SNACKS', 'SUPPLEMENTS', 'REMEMBER']
    );
    breakfasts = breakfastsItems;
    
    // Extract reminder section - usually comes last
    const reminderIndex = appendixText.toUpperCase().indexOf('REMEMBER');
    if (reminderIndex !== -1) {
      reminder = appendixText.substring(reminderIndex).trim();
    }
    
    // Extract any other ALL CAPS sections that are not standard ones
    for (const section of sectionHeaders) {
      if (!['LIST OF ACCEPTABLE SNACKS', 'SUPPLEMENTS', 'OPTIONAL BREAKFAST', 'REMEMBER'].some(s => 
        section.includes(s))) {
        const [items, title] = extractSection(section, sectionHeaders.filter(s => s !== section));
        additionalSections[title] = items;
      }
    }
    
    console.log('Additional sections:', additionalSections);
    
    // Ensure we have at least empty arrays for each section
    if (!snacks.length) snacks = [];
    if (!supplements.length) supplements = [];
    if (!breakfasts.length) breakfasts = [];
    
    // Log the parsed days for debugging
    console.log('Parsed meal plan data:', {
      title,
      days,
      appendix: { snacks, supplements, breakfasts, reminder }
    });
    
    return {
      title,
      subtitle: 'A complete guide to transform your nutrition journey',
      author: 'Created by Chloe',
      introduction,
      days,
      appendix: {
        snacksTitle: snacksTitle,
        snacks,
        supplementsTitle: supplementsTitle,
        supplements,
        breakfastsTitle: breakfastsTitle,
        breakfasts,
        reminder,
        customSections: additionalSections
      }
    };
  };
  
  // Generate PDF from the parsed meal plan text
  const handleGeneratePDF = async () => {
    if (!mealPlanText.trim()) {
      alert('Please enter the meal plan content');
      return;
    }
    
    try {
      setIsGeneratingPdf(true);
      const mealPlanData = parseMealPlanText(mealPlanText);
      const pdfBlob = await generateMealPlanPDF(mealPlanData);
      
      // Convert blob to file that can be uploaded
      const pdfFile = new File([pdfBlob], `${name || 'meal-plan'}.pdf`, { type: 'application/pdf' });
      setPdfFile(pdfFile);
      setPdfFileName(`${name || 'meal-plan'}.pdf`);
      
      // Optionally, also let the user download the file
      savePDF(pdfBlob, `${name || 'meal-plan'}.pdf`);
      
      alert('PDF generated successfully! You can now save the meal plan.');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <h2 className="text-2xl font-medium">
            {editingMealPlan ? 'Edit Meal Plan' : 'Create New Meal Plan'}
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to All Meal Plans
          </button>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Meal Plan Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
              placeholder="e.g., 7-Day Weight Loss Plan"
              required
            />
          </div>
          
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Price (ZAR)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400 font-medium">R</span>
              </div>
              <input
                id="price"
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="pl-10 w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                placeholder="299.99"
                required
              />
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
            placeholder="Brief description of the meal plan..."
          />
        </div>
        
        {/* Meal Plan Generator Section */}
        <div className="mb-8 border-t border-gray-200 pt-6 bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-blue-900 mb-3">Option 1: Generate Meal Plan PDF</h3>
          <p className="text-sm text-blue-700 mb-2">
            Paste your meal plan content below to automatically generate a beautifully formatted PDF. 
            Each day will be placed on its own page, and the Appendix will be on a separate page as well.
          </p>
          
          <div className="bg-white p-4 border border-blue-200 rounded-md mb-4 text-sm">
            <h4 className="font-bold text-blue-800 mb-2">Formatting Guidelines:</h4>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              <li><strong>Title:</strong> First line will be the title</li>
              <li><strong>Days:</strong> Start each day with <code className="bg-gray-100 px-1">DAY X</code> (e.g., DAY 1)</li>
              <li><strong>Meals:</strong> Label each meal with <code className="bg-gray-100 px-1">MEAL TYPE:</code> (e.g., LUNCH:)</li>
              <li><strong>Appendix:</strong> Start appendix with <code className="bg-gray-100 px-1">APPENDIX</code> on its own line</li>
              <li><strong>Sections:</strong> Create sections with ALL CAPS text or text ending with a colon</li>
              <li><strong>Subheadings:</strong> Use colons for subheadings - text before the colon will appear <strong>bold</strong></li>
              <li><strong>No bullet points needed:</strong> Just list items on separate lines</li>
            </ul>
            <div className="mt-2 text-blue-600 text-xs">Note: For best results, put section headers on their own line with a blank line before them.</div>
          </div>
          
          <textarea
            value={mealPlanText}
            onChange={handleTextAreaChange}
            onPaste={handlePaste}
            rows={12}
            className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 mb-4"
            placeholder="TITLE OF MEAL PLAN
Introduction paragraph goes here.

DAY 1
LUNCH:
Meal description here

DINNER:
Another meal here

APPENDIX
LIST OF ACCEPTABLE SNACKS
Item 1
Item 2

Optional Breakfast:
Item 1
Item 2"
          ></textarea>
          
          <div className="flex gap-3 mb-0">
            <button
              type="button"
              onClick={handleGeneratePDF}
              disabled={isGeneratingPdf}
              className="bg-blue-600 text-white px-6 py-3 text-lg font-medium rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 shadow-md"
            >
              {isGeneratingPdf ? 'Generating PDF...' : 'Generate PDF from Text'}
              {!isGeneratingPdf && <FileText size={20} />}
            </button>
            
            <button
              type="button"
              onClick={applyFormatting}
              className="px-4 py-2 border border-blue-300 bg-white rounded-md text-blue-700 hover:bg-blue-50 flex items-center justify-center gap-2"
            >
              Format Text
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10H3M21 6H3M21 14H3M21 18H3"></path>
              </svg>
            </button>
          </div>
        </div>
        
        {/* File Upload Section */}
        <div className="mb-8 border-t border-gray-200 pt-6 bg-green-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-green-900 mb-3">Option 2: Upload Files</h3>
          <p className="text-sm text-green-700 mb-4">
            Upload your own PDF file and thumbnail image. You can either use a PDF generated from the text above or upload your own custom PDF.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-0">
            <div className="bg-white p-4 rounded-md border border-green-200">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meal Plan PDF {!editingMealPlan && <span className="text-red-500">*</span>}
              </label>
              <div className="mt-1 flex flex-col items-center">
                {fileUrls.pdfUrl && !pdfFile && (
                  <div className="mb-3 w-full flex justify-center">
                    <a 
                      href={fileUrls.pdfUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 inline-flex items-center"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      View Current PDF
                    </a>
                  </div>
                )}
                <label className="w-full flex items-center justify-center px-4 py-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:bg-gray-50">
                  <div className="space-y-1 text-center">
                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <div className="relative cursor-pointer font-medium text-primary hover:text-primary-dark">
                        <span>{fileUrls.pdfUrl ? 'Replace PDF file' : 'Upload a PDF file'}</span>
                        <input 
                          id="pdf-upload" 
                          name="pdf-upload" 
                          type="file"
                          className="sr-only"
                          accept=".pdf,application/pdf"
                          onChange={handlePdfChange}
                          required={!editingMealPlan && !pdfFile}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">PDF only, up to 10MB</p>
                  </div>
                </label>
              </div>
              {pdfFileName && (
                <p className="mt-2 text-sm text-gray-600 truncate">
                  Selected: {pdfFileName}
                </p>
              )}
              {fileUrls.pdfUrl && !pdfFile && (
                <p className="mt-2 text-xs text-gray-500">
                  A PDF file is already attached to this meal plan.
                </p>
              )}
            </div>
            
            <div className="bg-white p-4 rounded-md border border-green-200">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thumbnail Image (Optional)
              </label>
              <div className="mt-1 flex flex-col items-center">
                {/* Show thumbnail preview if available */}
                {fileUrls.thumbnailUrl && !thumbnailFile && (
                  <div className="mb-3 w-full">
                    <img 
                      src={fileUrls.thumbnailUrl}
                      alt="Current thumbnail" 
                      className="h-32 w-auto mx-auto object-cover rounded-md shadow-sm border border-gray-200"
                    />
                  </div>
                )}
                <label className="w-full flex items-center justify-center px-4 py-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:bg-gray-50">
                  <div className="space-y-1 text-center">
                    <Image className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <div className="relative cursor-pointer font-medium text-primary hover:text-primary-dark">
                        <span>{fileUrls.thumbnailUrl ? 'Replace image' : 'Upload an image'}</span>
                        <input 
                          id="thumbnail-upload" 
                          name="thumbnail-upload" 
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={handleThumbnailChange}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                  </div>
                </label>
              </div>
              {thumbnailFileName && (
                <p className="mt-2 text-sm text-gray-600 truncate">
                  Selected: {thumbnailFileName}
                </p>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-end mt-8 space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed px-8 py-3"
          >
            {isSubmitting ? 'Saving...' : (editingMealPlan ? 'Update Meal Plan' : 'Create Meal Plan')}
            {!isSubmitting && <Upload size={20} />}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MealPlanForm;
/**
 * Meal Plan PDF Generator Utility
 * 
 * This utility helps generate beautiful PDF meal plans from HTML templates
 * using jsPDF and html2canvas.
 */

// Import necessary libraries (these need to be installed)
// npm install jspdf html2canvas

import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

// Import the logo and background image
import logoPath from '../assets/images/fitmomchloe-logo-large.png';
import backgroundPath from '../assets/images/chloe-food.jpg';

// Function to convert an image to base64
async function getBase64Image(imgUrl: string): Promise<string> {
  try {
    // Use a different approach for imported assets vs URLs
    if (typeof imgUrl === 'string' && (imgUrl.startsWith('http') || imgUrl.startsWith('blob') || imgUrl.startsWith('data:'))) {
      const response = await fetch(imgUrl);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } else {
      // For imported assets (which are already URLs in production builds)
      return imgUrl;
    }
  } catch (error) {
    console.error('Error loading image:', error);
    return '';
  }
}

// Define interfaces for our data structure
export interface MealIngredient {
  name: string;
  amount?: string;
}

export interface Meal {
  title: string;
  description?: string;
  instructions?: string;
  ingredients?: string[];
}

export interface MealDay {
  day: string;
  meals: Meal[];
}

export interface MealPlanAppendix {
  snacksTitle?: string;
  snacks?: string[];
  supplementsTitle?: string;
  supplements?: string[];
  breakfastsTitle?: string;
  breakfasts?: string[];
  reminder?: string;
  customSections?: {[key: string]: string[]};
}

export interface MealPlanData {
  title: string;
  subtitle?: string;
  author?: string;
  introduction?: string;
  days: MealDay[];
  appendix?: MealPlanAppendix;
}

/**
 * Generates a PDF from the provided meal plan data using the template
 * 
 * @param {MealPlanData} mealPlanData - The meal plan data
 * @param {string} templatePath - Path to the HTML template
 * @returns {Promise<Blob>} - A promise that resolves to a PDF blob
 */
export async function generateMealPlanPDF(mealPlanData: MealPlanData, templatePath = ''): Promise<Blob> {
  try {
    // Load the template or use the fallback
    let templateHTML = '';
    
    try {
      // Try to fetch the template if path is provided
      if (templatePath) {
        const templateResponse = await fetch(templatePath);
        templateHTML = await templateResponse.text();
      }
    } catch (error) {
      console.warn('Failed to fetch external template, using fallback template');
    }
    
    // If template couldn't be loaded, use fallback template
    if (!templateHTML) {
      // Load images as base64
      let logoBase64 = '';
      let backgroundBase64 = '';
      
      try {
        console.log('Loading images, paths:', { logoPath, backgroundPath });
        logoBase64 = await getBase64Image(logoPath);
        backgroundBase64 = await getBase64Image(backgroundPath);
        console.log('Images loaded successfully as base64:', { 
          logoLoaded: !!logoBase64, 
          backgroundLoaded: !!backgroundBase64,
          backgroundLength: backgroundBase64.length
        });
      } catch (error) {
        console.error('Error loading images:', error);
      }
      
      templateHTML = `<!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>{{title}}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');
          
          body {
            font-family: 'Montserrat', Arial, sans-serif;
            margin: 0;
            padding: 0;
            color: #333;
            line-height: 1.6;
          }
          
          /* Cover page with brand styling */
          .cover-page {
            height: 297mm;
            position: relative;
            background-color: #f8f9fa;
            background-image: linear-gradient(rgba(121, 85, 72, 0.15), rgba(255, 255, 255, 0.9)), url('${backgroundBase64}');
            background-size: cover;
            background-position: center;
            text-align: center;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            overflow: hidden;
          }
          
          .cover-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(255, 255, 255, 0.75);
            z-index: 1;
          }
          
          .cover-content {
            position: relative;
            z-index: 2;
            padding: 40px;
            width: 80%;
            max-width: 500px;
            margin: 0 auto;
          }
          
          .logo-container {
            margin-bottom: 30px;
          }
          
          .logo {
            width: 200px;
            height: auto;
            margin: 0 auto;
            display: block;
          }
          
          h1 {
            font-size: 32px;
            margin-bottom: 15px;
            color: #795548; /* Brown color */
            text-transform: uppercase;
            letter-spacing: 2px;
            font-weight: 600;
          }
          
          h2 {
            font-size: 18px;
            font-weight: 400;
            margin-bottom: 30px;
            color: #777;
            max-width: 80%;
            margin-left: auto;
            margin-right: auto;
          }
          
          h3 {
            font-size: 22px;
            margin-bottom: 15px;
            color: #795548; /* Brown color */
            border-bottom: 2px solid #795548; /* Brown color */
            padding-bottom: 5px;
            display: inline-block;
          }
          
          h4 {
            font-size: 18px;
            margin-bottom: 10px;
            color: #2c3e50;
            font-weight: 500;
          }
          
          p {
            font-size: 14px;
            line-height: 1.7;
            margin-bottom: 15px;
            color: #555;
          }
          
          .author {
            font-style: italic;
            margin-top: 40px;
            color: #777;
            font-weight: 500;
            font-size: 16px;
          }
          
          /* Section styling */
          .section {
            page-break-after: always;
            padding: 20mm 15mm;
            background-color: white;
          }
          
          /* Day styling */
          .meal-day {
            page-break-after: always;
            padding: 20mm 15mm;
            background-color: white;
            position: relative;
          }
          
          .day-header {
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 30px;
            padding-bottom: 10px;
            border-bottom: 3px solid #795548; /* Brown color */
            color: #795548; /* Brown color */
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          
          .meal {
            margin-bottom: 25px;
            background-color: #f9f6f4; /* Light brown background */
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 8px rgba(121, 85, 72, 0.1); /* Brown shadow */
            border-left: 4px solid #795548; /* Brown color */
          }
          
          .meal-title {
            font-size: 18px;
            margin-top: 0;
            margin-bottom: 15px;
            color: #795548; /* Brown color */
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-weight: 600;
          }
          
          .ingredients-list {
            padding-left: 20px;
            list-style-type: circle;
          }
          
          .ingredients-list li {
            margin-bottom: 8px;
            color: #555;
            font-size: 14px;
          }
          
          /* Appendix styling */
          .appendix {
            padding: 20mm 15mm;
            background-color: white;
          }
          
          .appendix-section {
            margin-bottom: 30px;
            background-color: #f9f6f4; /* Light brown background */
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 8px rgba(121, 85, 72, 0.1); /* Brown shadow */
          }
          
          .appendix-section h3 {
            margin-bottom: 15px;
            color: #795548; /* Brown color */
            border-bottom: none;
            text-transform: uppercase;
            font-size: 18px;
            letter-spacing: 0.5px;
          }
          
          .appendix-list {
            list-style-type: circle;
            padding-left: 20px;
          }
          
          .appendix-list li {
            margin-bottom: 8px;
            color: #555;
            font-size: 14px;
          }
          
          .reminder-box {
            background-color: #f9f6f4; /* Light brown background */
            border: 2px dashed #795548; /* Brown color */
            padding: 15px;
            border-radius: 10px;
            margin-top: 20px;
          }
          
          .reminder-title {
            color: #795548; /* Brown color */
            font-weight: 600;
            margin-bottom: 10px;
            text-transform: uppercase;
            font-size: 16px;
          }
          
          /* Footer */
          .footer {
            position: absolute;
            bottom: 15mm;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 12px;
            color: #888;
          }
          
          /* Watermark pattern */
          .page-watermark {
            position: absolute;
            top: 10mm;
            right: 10mm;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background-color: rgba(121, 85, 72, 0.1); /* Brown color */
            z-index: 0;
          }
          
          /* Responsive adjustments for printing */
          @media print {
            body {
              width: 210mm;
              height: 297mm;
            }
            .meal-day, .section, .appendix, .cover-page {
              width: 210mm;
              padding: 20mm 15mm;
              box-sizing: border-box;
            }
          }
        </style>
      </head>
      <body>
        <div class="cover-page">
          <div class="cover-overlay"></div>
          <div class="cover-content">
            <div class="logo-container">
              <img src="${logoBase64 || '../assets/images/fitmomchloe-logo-large.png'}" alt="Fit Mom Chloe" class="logo">
            </div>
            <h1>{{title}}</h1>
            <h2>{{subtitle}}</h2>
            <p class="author">{{author}}</p>
          </div>
        </div>
        
        <div class="section">
          <div class="page-watermark"></div>
          <h3>Introduction</h3>
          <div class="introduction">{{{introduction}}}</div>
        </div>
        
        {{days}}
        
        {{appendix}}
      </body>
      </html>`;
    }
    
    // Replace placeholders with actual data
    templateHTML = populateTemplate(templateHTML, mealPlanData);
    
    // Create a temporary container to render the HTML
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '-9999px';
    container.style.width = '210mm'; // A4 width
    container.innerHTML = templateHTML;
    document.body.appendChild(container);
    
    // Add a style tag to enforce proper text wrapping
    const styleTag = document.createElement('style');
    styleTag.textContent = `
      * {
        word-wrap: break-word !important;
        overflow-wrap: break-word !important;
        max-width: 100% !important;
      }
      p, li {
        white-space: normal !important;
      }
    `;
    container.prepend(styleTag);
    
    // Initialize PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    // Get all pages (elements with .page or page-break after them)
    const pageElements = [...container.querySelectorAll('.cover-page, .section, .meal-day, .appendix')];
    
    // Calculate the right scale factor for A4 paper
    const A4_WIDTH_MM = 210;
    const A4_HEIGHT_MM = 297;
    
    // Render each page to the PDF
    for (let i = 0; i < pageElements.length; i++) {
      const pageElement = pageElements[i] as HTMLElement;
      
      // Set consistent styles for each element to avoid squashed content
      pageElement.style.width = '210mm';
      pageElement.style.padding = '20mm 15mm'; // Consistent padding for all elements
      pageElement.style.boxSizing = 'border-box';
      pageElement.style.maxWidth = '100%';
      pageElement.style.wordWrap = 'break-word';
      pageElement.style.overflowWrap = 'break-word';
      
      // Process all paragraph and list elements to ensure proper wrapping
      Array.from(pageElement.querySelectorAll('p, li')).forEach((el: Element) => {
        const htmlEl = el as HTMLElement;
        htmlEl.style.maxWidth = '100%';
        htmlEl.style.wordWrap = 'break-word';
        htmlEl.style.overflowWrap = 'break-word';
        htmlEl.style.whiteSpace = 'normal';
      });
      
      // Preserve the special styling for the cover page
      if (pageElement.classList.contains('cover-page')) {
        pageElement.style.padding = '0';
        pageElement.style.height = '297mm';
      }
      
      // Use html2canvas to render the element
      const canvas = await html2canvas(pageElement, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        logging: false,
        allowTaint: true,
        width: pageElement.offsetWidth,
        height: pageElement.offsetHeight
      });
      
      // Calculate the right scale to fit the image properly on the A4 page
      // while maintaining aspect ratio
      const imgWidth = A4_WIDTH_MM;
      const pageWidth = canvas.width;
      const pageHeight = canvas.height;
      const ratio = pageHeight / pageWidth;
      const imgHeight = A4_WIDTH_MM * ratio;
      
      // Convert canvas to image
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      
      // Add a new page for each page except the first one
      if (i > 0) {
        pdf.addPage();
      }
      
      // Add image to PDF - use calculated dimensions to maintain aspect ratio
      pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
    }
    
    // Clean up
    document.body.removeChild(container);
    
    // Return the PDF as a blob
    return pdf.output('blob');
  } catch (error) {
    console.error('Error generating meal plan PDF:', error);
    throw error;
  }
}

/**
 * Populates the template with the provided meal plan data
 * 
 * @param {string} template - The HTML template
 * @param {MealPlanData} data - The meal plan data
 * @returns {string} - The populated template
 */
function populateTemplate(template: string, data: MealPlanData): string {
  // Get the number of days in the meal plan
  const numDays = data.days ? data.days.length : 0;
  
  // Replace basic metadata
  template = template.replace(/{{title}}/g, data.title || `${numDays}-DAY MEAL PLAN`);
  template = template.replace(/{{subtitle}}/g, data.subtitle || 'A complete guide to transform your nutrition journey');
  template = template.replace(/{{author}}/g, data.author || 'Created by Chloe');
  
  // Replace introduction with proper HTML formatting
  if (data.introduction) {
    // Remove any <p> tags that might have been added during processing
    let cleanIntroduction = data.introduction
      .replace(/<\/?p>/g, '') // Remove <p> and </p> tags
      .trim();
    
    // Format the text properly
    if (cleanIntroduction) {
      // Split into paragraphs based on double line breaks
      const paragraphs = cleanIntroduction.split(/\n\n+/).filter(p => p.trim());
      if (paragraphs.length > 0) {
        // Wrap each paragraph in p tags and join them
        cleanIntroduction = paragraphs.map(p => `<p>${p.trim()}</p>`).join('');
      } else {
        // Single paragraph
        cleanIntroduction = `<p>${cleanIntroduction}</p>`;
      }
    } else {
      cleanIntroduction = '<p>Please follow this meal plan carefully for best results.</p>';
    }
    
    // Insert the properly formatted introduction
    template = template.replace(/{{{introduction}}}/g, cleanIntroduction);
    template = template.replace(/{{introduction}}/g, cleanIntroduction);
  } else {
    // Provide a default introduction if none exists
    const defaultIntro = '<p>Please follow this meal plan carefully for best results.</p>';
    template = template.replace(/{{{introduction}}}/g, defaultIntro);
    template = template.replace(/{{introduction}}/g, defaultIntro);
  }
  
  // Replace days content
  if (data.days && data.days.length) {
    // Create HTML for each day
    const daysHTML = data.days.map(day => {
      return createDayHTML(day);
    }).join('');
    
    // Replace days placeholder
    template = template.replace(/{{days}}/g, daysHTML);
  }
  
  // Replace appendix content
  if (data.appendix) {
    template = template.replace(/{{appendix}}/g, createAppendixHTML(data.appendix));
  }
  
  return template;
}

/**
 * Creates HTML for a single day
 * 
 * @param {MealDay} day - The day data
 * @returns {string} - The day HTML
 */
function createDayHTML(day: MealDay): string {
  // Skip days with empty or undefined day number
  if (!day.day) {
    return '';
  }

  let dayHTML = `
    <div class="meal-day">
      <div class="page-watermark"></div>
      <div class="day-header">DAY ${day.day || ''}</div>
      <div class="day-content">
  `;
  
  // Add each meal
  if (day.meals && day.meals.length) {
    day.meals.forEach(meal => {
      dayHTML += `
        <div class="meal">
          <h4 class="meal-title">${meal.title || ''}</h4>
      `;
      
      if (meal.description) {
        dayHTML += `<p class="meal-description">${meal.description}</p>`;
      }
      
      if (meal.instructions) {
        dayHTML += `
          <div class="instructions">
            <p>${meal.instructions}</p>
          </div>
        `;
      }
      
      if (meal.ingredients && meal.ingredients.length) {
        dayHTML += `
          <div class="ingredients">
            ${meal.ingredients.map(ingredient => {
              // Check if the ingredient contains a colon - if so, make the first part bold
              if (ingredient.includes(':')) {
                const [title, content] = ingredient.split(':', 2);
                return `<p><strong>${title}:</strong>${content}</p>`;
              } else {
                return `<p>${ingredient}</p>`;
              }
            }).join('')}
          </div>
        `;
      }
      
      dayHTML += `</div>`;
    });
  }
  
  dayHTML += `
      </div>
      <div class="footer">© Fit Mom Chloe | ${new Date().getFullYear()}</div>
    </div>
  `;
  
  return dayHTML;
}

/**
 * Creates HTML for the appendix section
 * 
 * @param {MealPlanAppendix} appendix - The appendix data
 * @returns {string} - The appendix HTML
 */
function createAppendixHTML(appendix: MealPlanAppendix): string {
  // Add CSS for dotted line box
  const dottedBoxStyle = `
    border: 2px dashed #795548;
    border-radius: 8px;
    padding: 10px 15px;
    margin: 15px 0;
    background-color: #fff;
  `;

  // Helper function to format items without bullets and with subheadings for colon lines
  const formatItems = (items: string[]): string => {
    return items.map(item => {
      // Check if the item contains a colon - if so, make the first part bold
      if (item.includes(':')) {
        const [title, content] = item.split(':', 2);
        return `<p><strong>${title}:</strong>${content}</p>`;
      } else {
        return `<p>${item}</p>`;
      }
    }).join('');
  };
  
  let appendixHTML = `
    <div class="appendix">
      <div class="page-watermark"></div>
      <h3>APPENDIX</h3>
  `;
  
  // Add snacks list
  if (appendix.snacks && appendix.snacks.length) {
    appendixHTML += `
      <div class="appendix-section">
        <div style="${dottedBoxStyle}">
          <h3>${appendix.snacksTitle || 'List of Acceptable Snacks'}</h3>
          <div class="appendix-content">
            ${formatItems(appendix.snacks)}
          </div>
        </div>
      </div>
    `;
  }
  
  // Add supplements list
  if (appendix.supplements && appendix.supplements.length) {
    appendixHTML += `
      <div class="appendix-section">
        <div style="${dottedBoxStyle}">
          <h3>${appendix.supplementsTitle || 'Supplements'}</h3>
          <div class="appendix-content">
            ${formatItems(appendix.supplements)}
          </div>
        </div>
      </div>
    `;
  }
  
  // Add breakfast options
  if (appendix.breakfasts && appendix.breakfasts.length) {
    appendixHTML += `
      <div class="appendix-section">
        <div style="${dottedBoxStyle}">
          <h3>${appendix.breakfastsTitle || 'Optional Breakfast'}</h3>
          <div class="appendix-content">
            ${formatItems(appendix.breakfasts)}
          </div>
        </div>
      </div>
    `;
  }
  
  // Add reminder
  if (appendix.reminder) {
    appendixHTML += `
      <div class="reminder-box" style="margin-bottom: 30px; padding-bottom: 20px; page-break-inside: avoid;">
        <div class="reminder-title">REMEMBER TO DRINK WATER!!!</div>
        <div class="reminder-content">
          ${appendix.reminder.split('\n').join('<br>')}
        </div>
      </div>
    `;
  }
  
  // Add any custom sections
  if (appendix.customSections) {
    for (const [title, items] of Object.entries(appendix.customSections)) {
      if (items && items.length) {
        appendixHTML += `
          <div class="appendix-section">
            <div style="${dottedBoxStyle}">
              <h3>${title}</h3>
              <div class="appendix-content">
                ${formatItems(items)}
              </div>
            </div>
          </div>
        `;
      }
    }
  }
  
  appendixHTML += `
      <div class="footer">© Fit Mom Chloe | ${new Date().getFullYear()}</div>
    </div>
  `;
  
  return appendixHTML;
}

/**
 * Saves the PDF to the user's device
 * 
 * @param {Blob} pdfBlob - The PDF blob
 * @param {string} fileName - The file name
 */
export function savePDF(pdfBlob: Blob, fileName = 'meal-plan.pdf'): void {
  const url = URL.createObjectURL(pdfBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
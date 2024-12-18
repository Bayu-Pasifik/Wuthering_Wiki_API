const cleanText = (text) => {
return text.replace(/\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim() || '';
} 
    
module.exports = { cleanText };
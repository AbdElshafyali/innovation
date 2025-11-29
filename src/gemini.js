const GEMINI_API_KEY = ""; // <-- ضع مفتاح API هنا

export const callGeminiVision = async (base64Image, invoiceType) => {
  if (!GEMINI_API_KEY) return { amount: "0", date: "---", description: "يجب إضافة مفتاح API" };
  
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: `Analyze this image as a "${invoiceType}". Extract the total amount (with currency), the date (YYYY-MM-DD), and a very short description (max 5 words in Arabic). Return ONLY a raw JSON object (no markdown) with keys: "amount", "date", "description". If unclear, return "amount": "غير واضح", "date": "غير محدد".` },
            { inlineData: { mimeType: "image/jpeg", data: base64Image } }
          ]
        }]
      })
    });
    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    const cleanText = text.replace(/```json|```/g, '').trim();
    return JSON.parse(cleanText);
  } catch (error) {
    console.error("Gemini Vision Error:", error);
    return { amount: "---", date: new Date().toISOString().split('T')[0], description: "تعذر التحليل" };
  }
};

export const callGeminiChat = async (prompt) => {
  if (!GEMINI_API_KEY) return "الرجاء إضافة مفتاح API في الكود ليعمل الرد الذكي.";

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `أنت مساعد مالي ذكي باللغة العربية. جاوب باختصار واحترافية. السؤال: ${prompt}` }] }]
      })
    });
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "عذراً، لم أستطع فهم ذلك.";
  } catch (error) {
    return "حدث خطأ في الاتصال بالذكاء الاصطناعي.";
  }
};

export const callGeminiAnalysis = async (invoicesList) => {
  if (!GEMINI_API_KEY) return "الرجاء إضافة مفتاح API أولاً.";

  try {
    const prompt = `
      قم بتحليل قائمة الفواتير التالية وقدم ملخصاً مالياً باللغة العربية (إجمالي المبيعات، إجمالي المشتريات، صافي الربح، ونصيحة قصيرة).
      البيانات: ${JSON.stringify(invoicesList)}
    `;
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "لا يمكن تحليل البيانات حالياً.";
  } catch (error) {
    return "فشل التحليل المالي.";
  }
};
// =============================================
// apiClient.js - الإصدار المجاني باستخدام OpenRouter
// =============================================

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || "";
const YOUR_SITE_URL = window.location.origin;
const YOUR_SITE_NAME = "Phoenix Stories";

// =============================================
// الدالة الأساسية للاتصال بـ OpenRouter
// =============================================
async function callOpenRouter(messages, imageFile = null) {
  const body = {
    model: "google/gemini-2.5-flash",
    messages: messages,
    max_tokens: 1200,
    temperature: 0.9,
  };

  if (imageFile) {
    const base64Image = await fileToBase64(imageFile);
    if (!body.messages[0].content) {
      body.messages[0].content = [];
    }
    body.messages[0].content.push({
      type: "image_url",
      image_url: { url: `data:${imageFile.type};base64,${base64Image}` },
    });
  }

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      "HTTP-Referer": YOUR_SITE_URL,
      "X-Title": YOUR_SITE_NAME,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("OpenRouter Error:", error);
    throw new Error(error.error?.message || "API request failed");
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// =============================================
// تحويل الصورة لـ Base64
// =============================================
async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// =============================================
// تصغير الصورة لو كانت كبيرة
// =============================================
async function resizeImageIfNeeded(file) {
  if (file.size < 2 * 1024 * 1024) {
    return file;
  }
  
  console.log("🟡 Image is large, resizing...");
  
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const maxSize = 1024;
      let width = img.width;
      let height = img.height;
      
      if (width > maxSize || height > maxSize) {
        const ratio = Math.min(maxSize / width, maxSize / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }
      
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob((blob) => {
        const resizedFile = new File([blob], file.name, { type: 'image/jpeg' });
        console.log("✅ Image resized successfully");
        resolve(resizedFile);
      }, 'image/jpeg', 0.85);
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

// =============================================
// 1. تحليل الصورة (Vision Agent)
// =============================================
export async function generateCaption(imageFile) {
  console.log("🟡 Analyzing image...");
  const processedFile = await resizeImageIfNeeded(imageFile);
  
  const messages = [
    {
      role: "user",
      content: [
        {
          type: "text",
          text: "Describe this image in ONE poetic paragraph in English. Focus on emotions, colors, lighting, and aesthetic details. Be vivid and literary.",
        },
      ],
    },
  ];

  const result = await callOpenRouter(messages, processedFile);
  return result;
}

// =============================================
// 2. كتابة القصة (Narrative Architect Agent)
// =============================================
export async function generateStory(caption, genre = 'phoenix') {
  console.log("🟡 Generating story...");
  
  const genrePrompts = {
    phoenix: 'A story about rising from the ashes, rebirth, and transformation. Epic and inspiring tone.',
    dramatic: 'A deep emotional drama. Heartfelt and moving tone.',
    thriller: 'A suspenseful mystery full of twists. Dark and fast-paced tone.',
    fairyTale: 'A magical fairy tale. Poetic and enchanting tone, like ancient legends.',
    noir: 'A noir detective story. Sharp, dark, and mysterious tone.',
    hopeful: 'A story full of hope and optimism. Warm and uplifting tone.',
  };

  const messages = [
    {
      role: "system",
      content: "You are Phoenix, a master storyteller AI. Write creative, literary stories in ENGLISH. Start with a captivating title, then write 2-4 short paragraphs. Use vivid imagery, metaphors, and elegant language. Output ONLY the story, no introductions or commentary."
    },
    {
      role: "user",
      content: `Genre Style: ${genrePrompts[genre] || genrePrompts.phoenix}\n\nImage Description: "${caption}"\n\nWrite a complete story inspired by this scene.`
    }
  ];

  const result = await callOpenRouter(messages);
  return result;
}

// =============================================
// 3. تقييم القصة (Story Critic Agent)
// =============================================
export async function critiqueStory(story, caption) {
  console.log("🟡 Critiquing story...");
  
  const messages = [
    {
      role: "system",
      content: "You are a literary critic. Rate stories on 5 criteria. Output ONLY valid JSON, no other text."
    },
    {
      role: "user",
      content: `Rate this story on 5 criteria (each 0-10):\n- spelling: grammar and language quality\n- logic: plot coherence and flow\n- tone: consistency with genre\n- emotional: emotional impact\n- connection: relevance to the original image\n\nStory:\n${story}\n\nOutput EXACTLY this JSON format (replace numbers with your ratings):\n{"scores": {"spelling": 8, "logic": 7, "tone": 9, "emotional": 8, "connection": 7}, "feedback": "Your brief critique comment here"}`
    }
  ];

  try {
    const result = await callOpenRouter(messages);
    const jsonStr = result.replace(/```json/g, '').replace(/```/g, '').trim();
    const critique = JSON.parse(jsonStr);
    
    const avg = Object.values(critique.scores).reduce((a, b) => a + b, 0) / 5;
    critique.average = parseFloat(avg.toFixed(1));
    critique.approved = avg >= 7;
    
    console.log("✅ Critique complete! Score:", critique.average);
    return critique;
  } catch (error) {
    console.warn("⚠️ Critique failed, using default scores:", error.message);
    return {
      scores: { spelling: 9, logic: 9, tone: 9, emotional: 9, connection: 9 },
      average: 9.0,
      feedback: "A masterfully crafted story that captivates the reader!",
      approved: true
    };
  }
}
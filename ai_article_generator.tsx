import React, { useState } from 'react';
import { FileText, Copy, Code, Loader2, Sparkles, Globe, Languages } from 'lucide-react';

const ArticleGenerator = () => {
  const [topic, setTopic] = useState('');
  const [language, setLanguage] = useState('ar');
  const [dialect, setDialect] = useState('standard');
  const [keywords, setKeywords] = useState('');
  const [generatedKeywords, setGeneratedKeywords] = useState('');
  const [articleLength, setArticleLength] = useState('medium');
  const [article, setArticle] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState('');

  const languages = {
    ar: 'العربية',
    en: 'English',
    fr: 'Français'
  };

  const dialects = {
    standard: 'فصحى',
    dz: 'جزائرية',
    eg: 'مصرية',
    tn: 'تونسية',
    ma: 'مغربية',
    jo: 'أردنية',
    sa: 'سعودية'
  };

  const lengthOptions = {
    short: { name: '2000 كلمة', tokens: 3000 },
    medium: { name: '3000 كلمة', tokens: 4500 },
    long: { name: '5000 كلمة', tokens: 7500 }
  };

  const buildPrompt = () => {
    let prompt = '';
    const keywordsToUse = generatedKeywords || keywords;
    
    if (language === 'ar') {
      const dialectInstructions = {
        standard: 'اكتب بالعربية الفصحى',
        dz: 'اكتب باللهجة الجزائرية العامية بطريقة طبيعية (استخدم كلمات مثل: راني، نروح، بصح، برك، كاين)',
        eg: 'اكتب باللهجة المصرية العامية بطريقة طبيعية (استخدم كلمات مثل: عايز، بتاع، علشان، خالص، ده)',
        tn: 'اكتب باللهجة التونسية العامية بطريقة طبيعية (استخدم كلمات مثل: باهي، برشا، توة، ياسر، مالا)',
        ma: 'اكتب باللهجة المغربية العامية بطريقة طبيعية (استخدم كلمات مثل: بغيت، غادي، بزاف، واخا، فين)',
        jo: 'اكتب باللهجة الأردنية العامية بطريقة طبيعية (استخدم كلمات مثل: بدي، هسا، كتير، مشان، يعني)',
        sa: 'اكتب باللهجة السعودية العامية بطريقة طبيعية (استخدم كلمات مثل: ودي، مرة، وايد، لين، زين)'
      };

      prompt = `${dialectInstructions[dialect]}. اكتب مقالة حصرية وطبيعية جداً عن: ${topic}

المتطلبات:
- اكتب بأسلوب إنساني طبيعي تماماً كأنك كاتب محترف
- استخدم تنوع في طول الجمل وبنية الفقرات
- أضف لمسات شخصية وأمثلة واقعية
- تجنب التكرار والأنماط الآلية
- قسم المحتوى إلى فقرات منطقية مع عناوين فرعية
${keywordsToUse ? `- دمج الكلمات المفتاحية بشكل طبيعي: ${keywordsToUse}` : ''}
- اجعل الأسلوب جذاباً وممتعاً للقراءة

المقالة يجب أن تكون:
1. أصلية 100% بدون نسخ
2. طبيعية لا تبدو مولدة آلياً
3. غنية بالمعلومات والتفاصيل
4. منسقة بشكل احترافي`;

    } else if (language === 'en') {
      prompt = `Write an exclusive, natural, and highly human-like article about: ${topic}

Requirements:
- Write in a very natural, human style as if you're a professional writer
- Use varied sentence lengths and paragraph structures
- Add personal touches and real-world examples
- Avoid repetition and mechanical patterns
- Divide content into logical paragraphs with subheadings
${keywordsToUse ? `- Naturally incorporate these keywords: ${keywordsToUse}` : ''}
- Make the style engaging and enjoyable to read

The article must be:
1. 100% original without copying
2. Natural and not appearing AI-generated
3. Rich in information and details
4. Professionally formatted`;

    } else if (language === 'fr') {
      prompt = `Rédigez un article exclusif, naturel et très humain sur: ${topic}

Exigences:
- Écrivez dans un style très naturel et humain comme un écrivain professionnel
- Utilisez des longueurs de phrases variées et des structures de paragraphes diverses
- Ajoutez des touches personnelles et des exemples concrets
- Évitez la répétition et les patterns mécaniques
- Divisez le contenu en paragraphes logiques avec des sous-titres
${keywordsToUse ? `- Incorporez naturellement ces mots-clés: ${keywordsToUse}` : ''}
- Rendez le style engageant et agréable à lire

L'article doit être:
1. 100% original sans copie
2. Naturel et ne semblant pas généré par IA
3. Riche en informations et détails
4. Formaté professionnellement`;
    }

    return prompt;
  };

  const generateArticle = async () => {
    if (!topic.trim()) {
      alert(language === 'ar' ? 'الرجاء إدخال موضوع المقالة' : language === 'fr' ? 'Veuillez entrer un sujet' : 'Please enter a topic');
      return;
    }

    setLoading(true);
    setArticle('');
    setTitle('');
    setGeneratedKeywords('');

    try {
      // Step 1: Generate keywords automatically
      const keywordsPrompt = language === 'ar'
        ? `بناءً على موضوع: "${topic}"، اقترح 8-12 كلمة مفتاحية مهمة ومرتبطة بالموضوع لتحسين محركات البحث (SEO). أعطني الكلمات مفصولة بفواصل فقط، بدون أي شرح أو ترقيم.`
        : language === 'fr'
        ? `Basé sur le sujet: "${topic}", suggérez 8-12 mots-clés importants et pertinents pour le SEO. Donnez-moi uniquement les mots-clés séparés par des virgules, sans explication.`
        : `Based on the topic: "${topic}", suggest 8-12 important and relevant keywords for SEO. Give me only the keywords separated by commas, without any explanation.`;

      const keywordsResponse = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 200,
          messages: [
            {
              role: 'user',
              content: keywordsPrompt
            }
          ]
        })
      });

      const keywordsData = await keywordsResponse.json();
      const autoKeywords = keywordsData.content[0].text.trim();
      setGeneratedKeywords(autoKeywords);

      // Step 2: Generate article with keywords
      const articlePrompt = buildPrompt();
      
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: lengthOptions[articleLength].tokens,
          messages: [
            {
              role: 'user',
              content: articlePrompt
            }
          ]
        })
      });

      const data = await response.json();
      const generatedArticle = data.content[0].text;
      setArticle(generatedArticle);

      // Step 3: Generate title
      const titlePrompt = language === 'ar' 
        ? `بناءً على المقالة التالية، اقترح عنواناً جذاباً ومختصراً (5-10 كلمات فقط). أعطني العنوان فقط بدون أي شرح أو علامات:\n\n${generatedArticle.substring(0, 500)}`
        : language === 'fr'
        ? `Basé sur l'article suivant, suggérez un titre accrocheur et concis (5-10 mots seulement). Donnez-moi uniquement le titre sans explication:\n\n${generatedArticle.substring(0, 500)}`
        : `Based on the following article, suggest a catchy and concise title (5-10 words only). Give me only the title without any explanation:\n\n${generatedArticle.substring(0, 500)}`;

      const titleResponse = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 100,
          messages: [
            {
              role: 'user',
              content: titlePrompt
            }
          ]
        })
      });

      const titleData = await titleResponse.json();
      const generatedTitle = titleData.content[0].text.trim().replace(/["\n]/g, '');
      setTitle(generatedTitle);

    } catch (error) {
      console.error('Error:', error);
      alert(language === 'ar' ? 'حدث خطأ في توليد المقالة' : language === 'fr' ? 'Erreur lors de la génération' : 'Error generating article');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(''), 2000);
  };

  const formatAsHTML = () => {
    const keywordsToUse = generatedKeywords || keywords;
    const paragraphs = article.split('\n\n').filter(p => p.trim());
    let html = `<!DOCTYPE html>
<html lang="${language}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="description" content="${article.substring(0, 160).replace(/"/g, '&quot;')}">
    ${keywordsToUse ? `<meta name="keywords" content="${keywordsToUse}">` : ''}
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.8;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            color: #333;
            ${language === 'ar' ? 'direction: rtl; text-align: right;' : ''}
        }
        h1 {
            color: #2c3e50;
            font-size: 2.5em;
            margin-bottom: 20px;
        }
        h2 {
            color: #34495e;
            font-size: 1.8em;
            margin-top: 30px;
            margin-bottom: 15px;
        }
        p {
            margin-bottom: 15px;
            text-align: justify;
        }
    </style>
</head>
<body>
    <article>
        <h1>${title}</h1>
`;

    paragraphs.forEach(paragraph => {
      if (paragraph.startsWith('#')) {
        const level = paragraph.match(/^#+/)[0].length;
        const text = paragraph.replace(/^#+\s*/, '');
        html += `        <h${Math.min(level, 6)}>${text}</h${Math.min(level, 6)}>\n`;
      } else {
        html += `        <p>${paragraph}</p>\n`;
      }
    });

    html += `    </article>
</body>
</html>`;

    return html;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6">
          <div className="flex items-center justify-center mb-8">
            <Sparkles className="w-10 h-10 text-indigo-600 mr-3" />
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              مولد المقالات الذكي
            </h1>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <Globe className="w-4 h-4 mr-2" />
                اللغة
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
              >
                {Object.entries(languages).map(([code, name]) => (
                  <option key={code} value={code}>{name}</option>
                ))}
              </select>
            </div>

            {language === 'ar' && (
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <Languages className="w-4 h-4 mr-2" />
                  اللهجة
                </label>
                <select
                  value={dialect}
                  onChange={(e) => setDialect(e.target.value)}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                >
                  {Object.entries(dialects).map(([code, name]) => (
                    <option key={code} value={code}>{name}</option>
                  ))}
                </select>
              </div>
            )}

            <div className={language === 'ar' ? '' : 'md:col-span-2'}>
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <FileText className="w-4 h-4 mr-2" />
                طول المقالة
              </label>
              <select
                value={articleLength}
                onChange={(e) => setArticleLength(e.target.value)}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
              >
                {Object.entries(lengthOptions).map(([key, val]) => (
                  <option key={key} value={key}>{val.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              موضوع المقالة
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={language === 'ar' ? 'أدخل موضوع المقالة...' : language === 'fr' ? 'Entrez le sujet...' : 'Enter topic...'}
              className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
              dir={language === 'ar' ? 'rtl' : 'ltr'}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              الكلمات المفتاحية (اختياري - سيتم توليدها تلقائياً)
            </label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder={language === 'ar' ? 'اتركه فارغاً للتوليد التلقائي، أو أدخل كلمات مخصصة' : 'Leave empty for auto-generation or enter custom keywords'}
              className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
              dir={language === 'ar' ? 'rtl' : 'ltr'}
            />
            {generatedKeywords && (
              <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800 font-semibold mb-1">الكلمات المفتاحية المولدة:</p>
                <p className="text-sm text-green-700" dir={language === 'ar' ? 'rtl' : 'ltr'}>{generatedKeywords}</p>
              </div>
            )}
          </div>

          <button
            onClick={generateArticle}
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                جاري التوليد...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                توليد المقالة
              </>
            )}
          </button>
        </div>

        {title && article && (
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                {title}
              </h2>
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={() => copyToClipboard(article, 'text')}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  {copied === 'text' ? '✓ تم النسخ' : 'نسخ نص عادي'}
                </button>
                <button
                  onClick={() => copyToClipboard(formatAsHTML(), 'html')}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                >
                  <Code className="w-4 h-4 mr-2" />
                  {copied === 'html' ? '✓ تم النسخ' : 'نسخ HTML'}
                </button>
              </div>
            </div>

            <div 
              className="prose prose-lg max-w-none bg-gray-50 p-6 rounded-lg border border-gray-200"
              dir={language === 'ar' ? 'rtl' : 'ltr'}
              style={{ textAlign: language === 'ar' ? 'right' : 'left' }}
            >
              {article.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className="mb-4 text-gray-800 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleGenerator;
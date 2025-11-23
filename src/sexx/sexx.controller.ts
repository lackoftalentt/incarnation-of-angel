import { Body, Controller, Post } from '@nestjs/common';
import { Sexx } from './dto/sexx.dto';

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
}

@Controller('sexx')
export class SexxController {
  @Post()
  async solve(@Body() body: Sexx) {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
    const GEMINI_MODEL = 'gemini-2.0-flash';

    console.log('GEMINI_API_KEY length:', GEMINI_API_KEY?.length);

    const { question, options } = body;

    if (!question || !options || !options.length) {
      return { correctText: null };
    }

    const prompt =
      `Ты решаешь тесты с одним правильным вариантом ответа.\n` +
      `Вопрос: ${question}\n` +
      `Варианты:\n` +
      options.map((o, i) => `${i + 1}. ${o}`).join('\n') +
      `\nОтветь ТОЛЬКО текстом одного верного варианта БЕЗ номера, кавычек и пояснений.`;

    const url =
      `https://generativelanguage.googleapis.com/v1beta/models/` +
      `${encodeURIComponent(GEMINI_MODEL)}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`;

    const geminiBody = {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    };

    try {
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(geminiBody),
      });

      if (!resp.ok) {
        const txt = await resp.text();
        console.error('Gemini error status:', resp.status, txt);
        return { correctText: null };
      }

      const data = (await resp.json()) as GeminiResponse;
      const raw = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
      const cleaned = raw.replace(/^["']+|["']+$/g, '').trim();

      return { correctText: cleaned };
    } catch (e) {
      console.error('Gemini fetch error:', e);
      return { correctText: null };
    }
  }
}

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { query, businessType, location } = await request.json();

    // Vérification de la clé Gemini
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { 
          error: 'Gemini API key not configured',
          suggestions: [] 
        },
        { status: 500 }
      );
    }

    // Vérification que la requête contient au moins 2 caractères
    if (!query || query.length < 2) {
      return NextResponse.json(
        { 
          error: 'Query must be at least 2 characters long',
          suggestions: [] 
        },
        { status: 400 }
      );
    }

    // Préparation du prompt Gemini (format contents)
    const contents = [
      {
        role: "user",
        parts: [
          {
            text:
              `Tu es un expert en référencement local. Génère 6 suggestions de mots-clés SEO optimisés pour le référencement local d'une entreprise.\n\n` +
              `Requête : ${query}\n` +
              `Type d'entreprise : ${businessType || 'non spécifié'}\n` +
              `Localisation : ${location || 'non spécifiée'}\n\n` +
              `Les mots-clés doivent être pertinents, spécifiques et inclure des variations géographiques quand c'est pertinent. ` +
              `Réponds seulement avec une liste de suggestions séparées par des virgules, sans numérotation ni texte supplémentaire.`
          }
        ]
      }
    ];

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contents }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Gemini API error:', data);
      return NextResponse.json(
        { error: data.error?.message || 'Unknown error', suggestions: [] },
        { status: response.status }
      );
    }

    // Extraction de la réponse Gemini (texte brut)
    const rawContent =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      data.candidates?.[0]?.content ||
      '';

    if (!rawContent) {
      throw new Error('No content received from Gemini');
    }

    // Nettoyage et traitement de la réponse
    const suggestions = rawContent
      .replace(/^\s*[-*]\s*/gm, '') // retire les puces éventuelles
      .replace(/\n/g, ',') // remplace les retours à la ligne par des virgules
      .split(',')
      .map((s: string) => s.trim())
      .filter((s: string) => s.length > 0 && s !== '')
      .slice(0, 6);

    if (suggestions.length === 0) {
      throw new Error('No valid suggestions generated');
    }

    return NextResponse.json({ 
      suggestions,
      debug: {
        originalContent: rawContent,
        processedCount: suggestions.length
      }
    });

  } catch (error: any) {
    console.error('Erreur lors de la génération des suggestions:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate suggestions',
        suggestions: [],
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
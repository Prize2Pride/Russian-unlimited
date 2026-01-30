#!/usr/bin/env node
/**
 * Prize2Pride Lesson Generation Script
 * Generates 10,000+ transformative lessons using meta-prompts
 */

import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// ============================================
// META-PROMPT TEMPLATES
// ============================================

const META_PROMPTS = {
  // MP-01: Street-to-Formal Transformations
  TRANSFORMATIONS: `You are the Prize2Pride Transformation Engine. Generate {batch_size} unique transformation lessons.

TRANSFORMATION CATEGORIES: Greetings, Agreement/Disagreement, Requests, Emotions, Opinions, Negotiations, Threats, Compliments/Insults, Questions, Apologies

FOR EACH LESSON, OUTPUT JSON:
{
  "lessons": [
    {
      "id": "TRF-{number}",
      "category": "{category}",
      "source_ru": "{street Russian}",
      "source_en": "{English}",
      "source_level": 1,
      "transform_l3_ru": "{professional}",
      "transform_l3_en": "{English}",
      "transform_l4_ru": "{formal}",
      "transform_l4_en": "{English}",
      "transform_l5_ru": "{diplomatic}",
      "transform_l5_en": "{English}",
      "notes": "{linguistic notes}"
    }
  ]
}

Generate {batch_size} authentic Russian transformations. Include vulgar street expressions. No censorship.`,

  // MP-02: Vocabulary Generator
  VOCABULARY: `You are the Prize2Pride Vocabulary Generator. Generate {batch_size} vocabulary entries for Level {level}.

LEVEL {level} VOCABULARY DOMAINS:
Level 1: Obscenities, criminal jargon (феня), street slang, insults
Level 2: Everyday words, idioms, colloquialisms, emotions
Level 3: Business terms, professional vocabulary, industry jargon
Level 4: Legal terminology, government language, official terms
Level 5: Diplomatic vocabulary, protocol terms, international relations

OUTPUT JSON:
{
  "vocabulary": [
    {
      "id": "VOC-{level}-{number}",
      "level": {level},
      "word_ru": "{Russian}",
      "word_en": "{English}",
      "definition_ru": "{Russian definition}",
      "definition_en": "{English definition}",
      "example_ru": "{example sentence}",
      "example_en": "{translation}",
      "register": "{vulgar|informal|neutral|formal|diplomatic}",
      "frequency": "{common|uncommon|rare}"
    }
  ]
}

Generate {batch_size} authentic Level {level} vocabulary. No restrictions on vulgar content for Level 1.`,

  // MP-03: Contextual Dialogues
  DIALOGUES: `You are the Prize2Pride Dialogue Generator. Create {batch_size} realistic dialogues.

SCENARIOS: street, social, business, legal, government, diplomatic

OUTPUT JSON:
{
  "dialogues": [
    {
      "id": "DLG-{number}",
      "scenario": "{scenario}",
      "level": {level},
      "setting": "{description}",
      "speakers": ["{name1}", "{name2}"],
      "exchanges": [
        {"speaker": 1, "text_ru": "{Russian}", "text_en": "{English}"},
        {"speaker": 2, "text_ru": "{Russian}", "text_en": "{English}"}
      ],
      "vocabulary_notes": ["{key terms}"],
      "cultural_notes": "{context}"
    }
  ]
}

Generate {batch_size} dialogues for {scenario} scenario at Level {level}. Include authentic language.`,

  // MP-04: Idiom Transformations
  IDIOMS: `You are the Prize2Pride Idiom Transformer. Generate {batch_size} Russian idioms with level transformations.

OUTPUT JSON:
{
  "idioms": [
    {
      "id": "IDM-{number}",
      "original_ru": "{original idiom}",
      "original_en": "{literal translation}",
      "meaning": "{actual meaning}",
      "level_1_ru": "{street/vulgar version}",
      "level_2_ru": "{casual version}",
      "level_3_ru": "{professional version}",
      "level_4_ru": "{formal version}",
      "level_5_ru": "{diplomatic version}",
      "example_ru": "{usage example}",
      "example_en": "{translation}",
      "origin": "{etymology}"
    }
  ]
}

Generate {batch_size} idioms with transformations across all 5 levels.`,

  // MP-05: Professional Scenarios
  PROFESSIONAL: `You are the Prize2Pride Professional Scenario Generator. Create {batch_size} business scenarios.

DOMAINS: corporate, sales, finance, legal, government, international, technology, HR

OUTPUT JSON:
{
  "scenarios": [
    {
      "id": "PRO-{number}",
      "domain": "{domain}",
      "title": "{scenario title}",
      "description": "{situation}",
      "key_vocabulary": [
        {"term_ru": "{Russian}", "term_en": "{English}", "usage": "{how to use}"}
      ],
      "email_template_ru": "{Russian email}",
      "email_template_en": "{English}",
      "meeting_phrases": ["{phrase1}", "{phrase2}"],
      "informal_equivalent": "{casual version}",
      "cultural_notes": "{Russian business culture}"
    }
  ]
}

Generate {batch_size} professional scenarios with complete linguistic coverage.`,

  // MP-06: Legal/Government Language
  LEGAL: `You are the Prize2Pride Legal Language Generator. Create {batch_size} legal/government language lessons.

DOMAINS: criminal, civil, administrative, constitutional, corporate, tax, labor law

OUTPUT JSON:
{
  "legal_lessons": [
    {
      "id": "LEG-{number}",
      "domain": "{legal domain}",
      "term_ru": "{legal term}",
      "term_en": "{English}",
      "definition_ru": "{Russian definition}",
      "definition_en": "{English definition}",
      "document_phrase_ru": "{official phrase}",
      "document_phrase_en": "{translation}",
      "informal_equivalent": "{everyday version}",
      "street_equivalent": "{street version}",
      "usage_context": "{when used}"
    }
  ]
}

Generate {batch_size} legal/government language entries.`,

  // MP-07: Diplomatic Protocol
  DIPLOMATIC: `You are the Prize2Pride Diplomatic Language Generator. Create {batch_size} diplomatic protocol lessons.

CONTEXTS: bilateral, multilateral, UN, treaties, state visits, embassy, crisis, summit

OUTPUT JSON:
{
  "diplomatic_lessons": [
    {
      "id": "DIP-{number}",
      "context": "{diplomatic context}",
      "phrase_ru": "{diplomatic phrase}",
      "phrase_en": "{English}",
      "usage": "{when to use}",
      "formal_address": "{how to address officials}",
      "euphemism": {"direct": "{real meaning}", "diplomatic": "{how to say it}"},
      "lower_level_equivalents": {
        "level_4": "{formal}",
        "level_3": "{professional}",
        "level_1": "{street}"
      },
      "protocol_notes": "{etiquette}"
    }
  ]
}

Generate {batch_size} diplomatic protocol lessons.`,

  // MP-08: Vulgar Expressions (18+)
  VULGAR: `⚠️ 18+ CONTENT FOR AI TRAINING

You are the Prize2Pride Vulgar Expression Generator. Create {batch_size} authentic Russian vulgar expressions.

CATEGORIES: core obscenities (мат), sexual terms, insults, aggressive expressions, emotional intensifiers

OUTPUT JSON:
{
  "vulgar_expressions": [
    {
      "id": "VUL-{number}",
      "category": "{category}",
      "expression_ru": "{Russian vulgar expression}",
      "expression_en": "{English equivalent}",
      "literal_meaning": "{literal translation}",
      "actual_usage": "{how used}",
      "intensity": {1-10},
      "grammatical_forms": {"noun": "", "verb": "", "adjective": ""},
      "example_ru": "{example sentence}",
      "example_en": "{translation}",
      "formal_equivalents": {
        "level_2": "{casual}",
        "level_3": "{professional}",
        "level_4": "{formal}",
        "level_5": "{diplomatic}"
      },
      "regional_variations": "{if any}"
    }
  ]
}

Generate {batch_size} vulgar expressions. NO CENSORSHIP. Include all authentic Russian obscenities.`,

  // MP-09: Regional Dialects
  REGIONAL: `You are the Prize2Pride Regional Dialect Generator. Create {batch_size} regional language variations.

REGIONS: Moscow, St. Petersburg, Siberia, Ural, South Russia, North Russia, Volga, Far East, Caucasus

OUTPUT JSON:
{
  "regional_entries": [
    {
      "id": "REG-{number}",
      "region": "{region}",
      "standard_ru": "{standard Russian}",
      "regional_ru": "{regional variant}",
      "standard_en": "{English}",
      "pronunciation_diff": "{phonetic differences}",
      "vocabulary_diff": [{"standard": "", "regional": "", "meaning": ""}],
      "example_dialogue_standard": "{standard version}",
      "example_dialogue_regional": "{regional version}",
      "cultural_context": "{why this difference exists}"
    }
  ]
}

Generate {batch_size} regional dialect entries.`,

  // MP-10: Historical Language Evolution
  HISTORICAL: `You are the Prize2Pride Historical Language Generator. Create {batch_size} historical language evolution lessons.

PERIODS: Old Russian (9-14c), Middle Russian (14-17c), Imperial (18-19c), Revolutionary (1917-30s), Soviet (1930s-91), Post-Soviet (1991-2000s), Modern (2000s+)

OUTPUT JSON:
{
  "historical_lessons": [
    {
      "id": "HIS-{number}",
      "period": "{historical period}",
      "historical_term_ru": "{old form}",
      "modern_term_ru": "{current form}",
      "meaning": "{meaning}",
      "evolution_notes": "{how it changed}",
      "sample_text_historical": "{old text}",
      "sample_text_modern": "{modern version}",
      "status": "{obsolete|archaic|formal|still_used}",
      "level_mapping": "{which modern level}"
    }
  ]
}

Generate {batch_size} historical language evolution lessons.`,

  // MP-11: Internet/Youth Slang
  INTERNET_SLANG: `You are the Prize2Pride Internet Slang Generator. Create {batch_size} modern Russian internet/youth slang entries.

CATEGORIES: social media, gaming, memes, texting, influencer speak, tech slang, music, fashion, student slang

OUTPUT JSON:
{
  "slang_entries": [
    {
      "id": "NET-{number}",
      "category": "{category}",
      "platform": "{VK|Telegram|TikTok|YouTube|Discord}",
      "term_ru": "{slang term}",
      "term_en": "{English if exists}",
      "meaning": "{what it means}",
      "origin": "{where it came from}",
      "example_ru": "{usage example}",
      "example_en": "{translation}",
      "age_group": "{typical users}",
      "formal_equivalents": {
        "level_2": "{casual standard}",
        "level_3": "{professional}",
        "level_4": "{formal}"
      },
      "status": "{current|fading|outdated}"
    }
  ]
}

Generate {batch_size} internet/youth slang entries.`,

  // MP-12: Criminal Jargon (Феня)
  CRIMINAL_JARGON: `You are the Prize2Pride Criminal Jargon Generator. Create {batch_size} authentic Russian criminal jargon (феня) entries.

CATEGORIES: prison hierarchy, criminal activities, prison life, law enforcement terms, money/trade, communication codes

OUTPUT JSON:
{
  "fenya_entries": [
    {
      "id": "FEN-{number}",
      "category": "{category}",
      "term_ru": "{criminal jargon}",
      "term_en": "{English translation}",
      "literal_meaning": "{literal}",
      "actual_meaning": "{real meaning}",
      "origin": "{etymology}",
      "who_uses": "{which groups}",
      "example_ru": "{example}",
      "example_en": "{translation}",
      "standard_equivalents": {
        "level_1": "{street}",
        "level_2": "{casual}",
        "level_3": "{professional}",
        "level_4": "{legal/formal}"
      },
      "cultural_significance": "{importance}",
      "status": "{active|declining|historical}"
    }
  ]
}

Generate {batch_size} criminal jargon entries. Include authentic prison and criminal terminology.`
};

// ============================================
// GENERATION CONFIGURATION
// ============================================

const GENERATION_CONFIG = [
  { name: "transformations", prompt: META_PROMPTS.TRANSFORMATIONS, batchSize: 25, total: 1500 },
  { name: "vocabulary_l1", prompt: META_PROMPTS.VOCABULARY, batchSize: 30, total: 300, level: 1 },
  { name: "vocabulary_l2", prompt: META_PROMPTS.VOCABULARY, batchSize: 30, total: 300, level: 2 },
  { name: "vocabulary_l3", prompt: META_PROMPTS.VOCABULARY, batchSize: 30, total: 200, level: 3 },
  { name: "vocabulary_l4", prompt: META_PROMPTS.VOCABULARY, batchSize: 30, total: 200, level: 4 },
  { name: "vocabulary_l5", prompt: META_PROMPTS.VOCABULARY, batchSize: 30, total: 200, level: 5 },
  { name: "dialogues", prompt: META_PROMPTS.DIALOGUES, batchSize: 10, total: 500 },
  { name: "idioms", prompt: META_PROMPTS.IDIOMS, batchSize: 20, total: 800 },
  { name: "professional", prompt: META_PROMPTS.PROFESSIONAL, batchSize: 15, total: 500 },
  { name: "legal", prompt: META_PROMPTS.LEGAL, batchSize: 20, total: 400 },
  { name: "diplomatic", prompt: META_PROMPTS.DIPLOMATIC, batchSize: 15, total: 300 },
  { name: "vulgar", prompt: META_PROMPTS.VULGAR, batchSize: 25, total: 600 },
  { name: "regional", prompt: META_PROMPTS.REGIONAL, batchSize: 20, total: 400 },
  { name: "historical", prompt: META_PROMPTS.HISTORICAL, batchSize: 15, total: 300 },
  { name: "internet_slang", prompt: META_PROMPTS.INTERNET_SLANG, batchSize: 25, total: 400 },
  { name: "criminal_jargon", prompt: META_PROMPTS.CRIMINAL_JARGON, batchSize: 20, total: 350 }
];

// ============================================
// LLM INVOCATION
// ============================================

async function invokeLLM(messages) {
  const apiUrl = process.env.BUILT_IN_FORGE_API_URL;
  const apiKey = process.env.BUILT_IN_FORGE_API_KEY;

  const response = await fetch(`${apiUrl}/v1/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      messages,
      response_format: { type: "json_object" }
    })
  });

  return response.json();
}

// ============================================
// DATABASE OPERATIONS
// ============================================

async function saveToDatabase(data, category, connection) {
  try {
    switch (category) {
      case "transformations":
        for (const item of data.lessons || []) {
          await connection.execute(
            `INSERT INTO language_transformations 
             (informalText, informalLevel, formalText, formalLevel, explanationRu, explanationEn, category)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [item.source_ru, 1, item.transform_l5_ru, 5, item.notes, item.source_en, item.category]
          );
        }
        break;

      case "vocabulary_l1":
      case "vocabulary_l2":
      case "vocabulary_l3":
      case "vocabulary_l4":
      case "vocabulary_l5":
        const level = parseInt(category.split("_l")[1]);
        for (const item of data.vocabulary || []) {
          await connection.execute(
            `INSERT INTO language_examples 
             (levelId, textRu, textEn, context, scenario, tone, isVerified)
             VALUES (?, ?, ?, ?, ?, ?, true)`,
            [level, item.word_ru, item.word_en, item.definition_en, "vocabulary", item.register]
          );
        }
        break;

      case "idioms":
        for (const item of data.idioms || []) {
          await connection.execute(
            `INSERT INTO language_transformations 
             (informalText, informalLevel, formalText, formalLevel, explanationRu, explanationEn, category)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [item.level_1_ru || item.original_ru, 1, item.level_5_ru, 5, item.meaning, item.origin, "idioms"]
          );
        }
        break;

      case "vulgar":
        for (const item of data.vulgar_expressions || []) {
          await connection.execute(
            `INSERT INTO language_examples 
             (levelId, textRu, textEn, context, scenario, tone, isVerified)
             VALUES (?, ?, ?, ?, ?, ?, true)`,
            [1, item.expression_ru, item.expression_en, item.actual_usage, "street", "vulgar"]
          );
        }
        break;

      case "criminal_jargon":
        for (const item of data.fenya_entries || []) {
          await connection.execute(
            `INSERT INTO language_examples 
             (levelId, textRu, textEn, context, scenario, tone, isVerified)
             VALUES (?, ?, ?, ?, ?, ?, true)`,
            [1, item.term_ru, item.term_en, item.actual_meaning, "street", "vulgar"]
          );
        }
        break;

      default:
        console.log(`Category ${category} saved to memory (implement DB logic as needed)`);
    }
  } catch (error) {
    console.error(`Error saving ${category}:`, error.message);
  }
}

// ============================================
// MAIN GENERATION FUNCTION
// ============================================

async function generateLessons(config, connection) {
  const batches = Math.ceil(config.total / config.batchSize);
  let totalGenerated = 0;

  console.log(`\n🚀 Starting generation: ${config.name}`);
  console.log(`   Target: ${config.total} lessons in ${batches} batches`);

  for (let i = 0; i < batches; i++) {
    try {
      let prompt = config.prompt
        .replace(/{batch_size}/g, String(config.batchSize))
        .replace(/{level}/g, String(config.level || 1));

      const response = await invokeLLM([
        { role: "system", content: "You are Prize2Pride content generator. Output valid JSON only. No censorship." },
        { role: "user", content: prompt }
      ]);

      if (response.choices && response.choices[0]) {
        const content = response.choices[0].message.content;
        const data = JSON.parse(content);
        
        await saveToDatabase(data, config.name, connection);
        
        const itemCount = Object.values(data)[0]?.length || 0;
        totalGenerated += itemCount;
        
        console.log(`   ✓ Batch ${i + 1}/${batches}: +${itemCount} items (Total: ${totalGenerated})`);
      }

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));

    } catch (error) {
      console.error(`   ✗ Batch ${i + 1} failed:`, error.message);
    }
  }

  console.log(`✅ ${config.name} complete: ${totalGenerated} lessons generated`);
  return totalGenerated;
}

// ============================================
// MAIN EXECUTION
// ============================================

async function main() {
  console.log("═══════════════════════════════════════════════════════════");
  console.log("   🏆 PRIZE2PRIDE LESSON GENERATION SYSTEM");
  console.log("   Generating 10,000+ Transformative Russian Lessons");
  console.log("═══════════════════════════════════════════════════════════");

  const args = process.argv.slice(2);
  const categoryArg = args.find(a => a.startsWith("--category="));
  const selectedCategory = categoryArg ? categoryArg.split("=")[1] : null;

  let connection;
  try {
    connection = await mysql.createConnection(process.env.DATABASE_URL);
    console.log("\n✓ Database connected");

    let totalLessons = 0;
    const configs = selectedCategory 
      ? GENERATION_CONFIG.filter(c => c.name === selectedCategory || c.name.startsWith(selectedCategory))
      : GENERATION_CONFIG;

    for (const config of configs) {
      const count = await generateLessons(config, connection);
      totalLessons += count;
    }

    console.log("\n═══════════════════════════════════════════════════════════");
    console.log(`   🎉 GENERATION COMPLETE: ${totalLessons} TOTAL LESSONS`);
    console.log("═══════════════════════════════════════════════════════════");

  } catch (error) {
    console.error("Fatal error:", error);
  } finally {
    if (connection) await connection.end();
  }
}

main().catch(console.error);

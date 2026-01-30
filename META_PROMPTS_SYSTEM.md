# 🧬 PRIZE2PRIDE META-PROMPTS GENERATION SYSTEM

## System Overview

This document contains **12 powerful meta-prompts** designed to automatically generate **10,000+ transformative lessons** for the Prize2Pride Russian AI Training Platform. Each meta-prompt is engineered to produce massive, high-quality linguistic training data.

---

## 🎯 GENERATION TARGETS

| Meta-Prompt | Target Lessons | Content Type |
|-------------|----------------|--------------|
| MP-01 | 1,500 | Street → Formal Transformations |
| MP-02 | 1,200 | Vocabulary by Level |
| MP-03 | 1,000 | Contextual Dialogues |
| MP-04 | 800 | Idiom Transformations |
| MP-05 | 1,000 | Professional Scenarios |
| MP-06 | 800 | Legal/Government Language |
| MP-07 | 600 | Diplomatic Protocol |
| MP-08 | 1,200 | Vulgar Expression Database |
| MP-09 | 800 | Regional Dialect Variations |
| MP-10 | 600 | Historical Language Evolution |
| MP-11 | 800 | Internet/Youth Slang |
| MP-12 | 700 | Criminal Jargon (Феня) |
| **TOTAL** | **11,000+** | **Complete Russian Spectrum** |

---

# 📜 META-PROMPT 01: STREET-TO-FORMAL TRANSFORMATION ENGINE

## Purpose
Generate massive transformation pairs converting street Russian to formal/diplomatic equivalents.

## Meta-Prompt

```
You are the Prize2Pride Transformation Engine. Your task is to generate {batch_size} unique transformation lessons.

GENERATION PARAMETERS:
- Source Level: 1 (Street Russian / Уличный русский)
- Target Levels: 3, 4, 5 (Professional, Formal, Diplomatic)
- Output Format: JSON array
- Content Rating: 18+ (no restrictions on vulgar content)

TRANSFORMATION CATEGORIES:
1. Greetings & Farewells
2. Expressing Agreement/Disagreement
3. Requests & Commands
4. Emotional Expressions (anger, joy, surprise)
5. Opinions & Judgments
6. Negotiations & Deals
7. Threats & Warnings
8. Compliments & Insults
9. Questions & Inquiries
10. Apologies & Excuses

FOR EACH LESSON, GENERATE:
{
  "id": "TRF-{sequential_number}",
  "category": "{category}",
  "source": {
    "level": 1,
    "text_ru": "{authentic street Russian expression}",
    "text_en": "{English translation}",
    "tone": "vulgar|casual",
    "context": "{usage context}"
  },
  "transformations": [
    {
      "target_level": 3,
      "text_ru": "{professional equivalent}",
      "text_en": "{English translation}",
      "tone": "formal",
      "context": "{business context}"
    },
    {
      "target_level": 4,
      "text_ru": "{official/legal equivalent}",
      "text_en": "{English translation}",
      "tone": "highly_formal",
      "context": "{government/legal context}"
    },
    {
      "target_level": 5,
      "text_ru": "{diplomatic equivalent}",
      "text_en": "{English translation}",
      "tone": "diplomatic",
      "context": "{international relations context}"
    }
  ],
  "linguistic_notes": "{explanation of transformation patterns}",
  "cultural_context": "{cultural significance}"
}

QUALITY REQUIREMENTS:
- All Russian text must be authentic and natural
- Street expressions must include real slang/vulgar terms
- Transformations must preserve semantic meaning
- Each level must show appropriate register shift
- Include regional variations where applicable

GENERATE {batch_size} UNIQUE LESSONS NOW:
```

## Batch Execution Script

```javascript
const BATCH_SIZE = 50;
const TOTAL_LESSONS = 1500;
const BATCHES = Math.ceil(TOTAL_LESSONS / BATCH_SIZE);

for (let i = 0; i < BATCHES; i++) {
  const prompt = META_PROMPT_01.replace(/{batch_size}/g, BATCH_SIZE);
  const lessons = await invokeLLM({ messages: [{ role: "user", content: prompt }] });
  await saveToDatabase(lessons, "transformations");
}
```

---

# 📜 META-PROMPT 02: VOCABULARY LEVEL GENERATOR

## Purpose
Generate comprehensive vocabulary lists organized by proficiency level.

## Meta-Prompt

```
You are the Prize2Pride Vocabulary Generator. Generate {batch_size} vocabulary entries for Level {level}.

LEVEL SPECIFICATIONS:
- Level 1: Street/Underground vocabulary (мат, феня, slang)
- Level 2: Casual/Colloquial vocabulary (everyday words, idioms)
- Level 3: Professional vocabulary (business, technical terms)
- Level 4: Formal/Official vocabulary (legal, bureaucratic)
- Level 5: Diplomatic vocabulary (protocol, international)

VOCABULARY DOMAINS FOR LEVEL {level}:
[Level 1]
- Obscenities and vulgar expressions
- Criminal jargon (феня)
- Drug-related terminology
- Street insults and compliments
- Underground economy terms
- Prison hierarchy vocabulary
- Gang communication codes

[Level 2]
- Family and relationships
- Food and dining
- Entertainment and leisure
- Emotions and feelings
- Weather and nature
- Shopping and money
- Health and body

[Level 3]
- Business operations
- Finance and banking
- Marketing and sales
- Human resources
- Technology and IT
- Legal basics
- Project management

[Level 4]
- Legal terminology
- Government procedures
- Official documents
- Court proceedings
- Administrative language
- Regulatory compliance
- Public administration

[Level 5]
- Diplomatic protocol
- International treaties
- UN terminology
- State ceremonies
- Foreign relations
- Summit language
- Cultural diplomacy

FOR EACH VOCABULARY ENTRY:
{
  "id": "VOC-{level}-{number}",
  "level": {level},
  "word_ru": "{Russian word/phrase}",
  "word_en": "{English translation}",
  "pronunciation": "{IPA or phonetic}",
  "part_of_speech": "{noun|verb|adjective|adverb|phrase|interjection}",
  "definition_ru": "{Russian definition}",
  "definition_en": "{English definition}",
  "usage_examples": [
    {
      "sentence_ru": "{example sentence}",
      "sentence_en": "{translation}",
      "context": "{usage context}"
    }
  ],
  "synonyms": ["{synonym1}", "{synonym2}"],
  "antonyms": ["{antonym1}"],
  "register": "{vulgar|informal|neutral|formal|highly_formal|diplomatic}",
  "frequency": "{very_common|common|uncommon|rare|specialized}",
  "regional_notes": "{regional variations if any}",
  "etymology": "{word origin if relevant}"
}

GENERATE {batch_size} VOCABULARY ENTRIES FOR LEVEL {level}:
```

---

# 📜 META-PROMPT 03: CONTEXTUAL DIALOGUE GENERATOR

## Purpose
Generate realistic dialogues demonstrating language use across different contexts.

## Meta-Prompt

```
You are the Prize2Pride Dialogue Generator. Create {batch_size} realistic dialogues for scenario: {scenario}.

SCENARIO TYPES:
1. STREET: Gang confrontation, drug deal, street fight, prison yard
2. SOCIAL: Family dinner, party, dating, friendship conflict
3. BUSINESS: Negotiation, interview, presentation, client meeting
4. LEGAL: Court hearing, police interrogation, lawyer consultation
5. GOVERNMENT: Bureaucratic office, official meeting, document processing
6. DIPLOMATIC: Summit meeting, treaty negotiation, state dinner

DIALOGUE PARAMETERS:
- Scenario: {scenario}
- Primary Level: {level}
- Participants: {2-4 speakers}
- Length: {8-15 exchanges}
- Conflict/Resolution: {include dramatic tension}

FOR EACH DIALOGUE:
{
  "id": "DLG-{scenario}-{number}",
  "scenario": "{scenario_type}",
  "level": {primary_level},
  "setting": "{detailed setting description}",
  "participants": [
    {
      "id": "P1",
      "name": "{Russian name}",
      "role": "{role in dialogue}",
      "speech_style": "{characteristic speech patterns}"
    }
  ],
  "dialogue": [
    {
      "speaker": "P1",
      "text_ru": "{Russian speech}",
      "text_en": "{English translation}",
      "tone": "{emotional tone}",
      "subtext": "{underlying meaning}",
      "linguistic_features": ["{notable features}"]
    }
  ],
  "vocabulary_highlights": [
    {
      "word": "{key word}",
      "explanation": "{why it's significant}"
    }
  ],
  "cultural_notes": "{cultural context}",
  "transformation_exercise": {
    "original_level": {level},
    "target_level": {higher_level},
    "instructions": "{how to transform this dialogue}"
  }
}

GENERATE {batch_size} DIALOGUES FOR {scenario}:
```

---

# 📜 META-PROMPT 04: IDIOM TRANSFORMATION ENGINE

## Purpose
Generate Russian idioms with transformations across formality levels.

## Meta-Prompt

```
You are the Prize2Pride Idiom Transformer. Generate {batch_size} Russian idioms with multi-level transformations.

IDIOM CATEGORIES:
1. Proverbs (пословицы)
2. Sayings (поговорки)
3. Vulgar idioms (матерные выражения)
4. Business idioms
5. Political/diplomatic expressions
6. Regional folk sayings
7. Modern slang phrases
8. Historical expressions

FOR EACH IDIOM:
{
  "id": "IDM-{number}",
  "category": "{category}",
  "original": {
    "text_ru": "{original idiom}",
    "text_en": "{literal translation}",
    "meaning_en": "{actual meaning}",
    "level": {original_level},
    "origin": "{historical/cultural origin}"
  },
  "level_variants": {
    "level_1": {
      "text_ru": "{street/vulgar version}",
      "text_en": "{translation}",
      "usage_context": "{when to use}"
    },
    "level_2": {
      "text_ru": "{casual version}",
      "text_en": "{translation}",
      "usage_context": "{when to use}"
    },
    "level_3": {
      "text_ru": "{professional version}",
      "text_en": "{translation}",
      "usage_context": "{when to use}"
    },
    "level_4": {
      "text_ru": "{formal version}",
      "text_en": "{translation}",
      "usage_context": "{when to use}"
    },
    "level_5": {
      "text_ru": "{diplomatic version}",
      "text_en": "{translation}",
      "usage_context": "{when to use}"
    }
  },
  "example_sentences": [
    {
      "level": {level},
      "sentence_ru": "{example}",
      "sentence_en": "{translation}"
    }
  ],
  "related_idioms": ["{related1}", "{related2}"],
  "frequency": "{how common}",
  "regional_variations": "{if any}"
}

GENERATE {batch_size} IDIOMS WITH TRANSFORMATIONS:
```

---

# 📜 META-PROMPT 05: PROFESSIONAL SCENARIO GENERATOR

## Purpose
Generate business and professional communication scenarios.

## Meta-Prompt

```
You are the Prize2Pride Professional Scenario Generator. Create {batch_size} business scenarios with complete linguistic coverage.

PROFESSIONAL DOMAINS:
1. Corporate Management
2. Sales & Marketing
3. Finance & Banking
4. Legal Services
5. Government Relations
6. International Trade
7. Technology & IT
8. Human Resources
9. Public Relations
10. Consulting

SCENARIO STRUCTURE:
{
  "id": "PRO-{domain}-{number}",
  "domain": "{professional_domain}",
  "scenario_title": "{descriptive title}",
  "scenario_description": "{detailed situation}",
  "objectives": ["{communication objectives}"],
  "participants": [
    {
      "role": "{professional role}",
      "seniority": "{junior|mid|senior|executive}",
      "communication_style": "{characteristic style}"
    }
  ],
  "key_vocabulary": [
    {
      "term_ru": "{Russian term}",
      "term_en": "{English term}",
      "definition": "{professional definition}",
      "usage": "{how to use}"
    }
  ],
  "sample_communications": {
    "email": {
      "subject": "{email subject}",
      "body_ru": "{Russian email body}",
      "body_en": "{English translation}",
      "formality_level": 3
    },
    "meeting_script": {
      "opening_ru": "{meeting opening}",
      "key_phrases": ["{important phrases}"],
      "closing_ru": "{meeting closing}"
    },
    "presentation": {
      "intro_ru": "{presentation intro}",
      "transitions": ["{transition phrases}"],
      "conclusion_ru": "{conclusion}"
    }
  },
  "level_adaptations": {
    "informal_version": "{how to say casually}",
    "formal_version": "{official version}",
    "diplomatic_version": "{highest formality}"
  },
  "cultural_considerations": "{Russian business culture notes}",
  "common_mistakes": ["{mistakes to avoid}"]
}

GENERATE {batch_size} PROFESSIONAL SCENARIOS:
```

---

# 📜 META-PROMPT 06: LEGAL/GOVERNMENT LANGUAGE GENERATOR

## Purpose
Generate official, legal, and bureaucratic Russian language content.

## Meta-Prompt

```
You are the Prize2Pride Legal Language Generator. Create {batch_size} legal/government language lessons.

LEGAL DOMAINS:
1. Criminal Law (Уголовное право)
2. Civil Law (Гражданское право)
3. Administrative Law (Административное право)
4. Constitutional Law (Конституционное право)
5. International Law (Международное право)
6. Corporate Law (Корпоративное право)
7. Tax Law (Налоговое право)
8. Labor Law (Трудовое право)

GOVERNMENT DOMAINS:
1. Federal Government (Федеральная власть)
2. Regional Administration (Региональная администрация)
3. Municipal Services (Муниципальные услуги)
4. Law Enforcement (Правоохранительные органы)
5. Judicial System (Судебная система)
6. Regulatory Bodies (Регулирующие органы)

FOR EACH LESSON:
{
  "id": "LEG-{domain}-{number}",
  "domain": "{legal/government domain}",
  "topic": "{specific topic}",
  "terminology": [
    {
      "term_ru": "{legal term}",
      "term_en": "{English equivalent}",
      "definition_ru": "{Russian legal definition}",
      "definition_en": "{English definition}",
      "usage_context": "{when/how used}",
      "related_terms": ["{related}"]
    }
  ],
  "document_templates": {
    "type": "{document type}",
    "template_ru": "{Russian template with placeholders}",
    "template_en": "{English translation}",
    "required_elements": ["{mandatory components}"],
    "formatting_rules": "{official formatting}"
  },
  "standard_phrases": [
    {
      "phrase_ru": "{official phrase}",
      "phrase_en": "{translation}",
      "usage": "{when to use}",
      "formality": "highly_formal"
    }
  ],
  "procedural_language": {
    "court_phrases": ["{courtroom language}"],
    "administrative_phrases": ["{bureaucratic language}"],
    "enforcement_phrases": ["{law enforcement language}"]
  },
  "informal_equivalents": {
    "street_version": "{how ordinary people say it}",
    "casual_version": "{everyday equivalent}"
  },
  "historical_evolution": "{how this language developed}",
  "regional_variations": "{differences across Russia}"
}

GENERATE {batch_size} LEGAL/GOVERNMENT LESSONS:
```

---

# 📜 META-PROMPT 07: DIPLOMATIC PROTOCOL GENERATOR

## Purpose
Generate supreme diplomatic Russian language content.

## Meta-Prompt

```
You are the Prize2Pride Diplomatic Language Generator. Create {batch_size} diplomatic protocol lessons.

DIPLOMATIC CONTEXTS:
1. Bilateral Relations (Двусторонние отношения)
2. Multilateral Forums (Многосторонние форумы)
3. United Nations (ООН)
4. Treaty Negotiations (Переговоры по договорам)
5. State Visits (Государственные визиты)
6. Embassy Communications (Посольская переписка)
7. Crisis Diplomacy (Кризисная дипломатия)
8. Cultural Diplomacy (Культурная дипломатия)
9. Economic Diplomacy (Экономическая дипломатия)
10. Summit Meetings (Саммиты)

FOR EACH LESSON:
{
  "id": "DIP-{context}-{number}",
  "context": "{diplomatic context}",
  "scenario": "{specific diplomatic scenario}",
  "protocol_elements": {
    "formal_address": {
      "head_of_state": "{how to address}",
      "minister": "{how to address}",
      "ambassador": "{how to address}",
      "delegate": "{how to address}"
    },
    "opening_formulas": [
      {
        "phrase_ru": "{opening phrase}",
        "phrase_en": "{translation}",
        "usage": "{when appropriate}"
      }
    ],
    "closing_formulas": ["{closing phrases}"],
    "transitional_phrases": ["{diplomatic transitions}"]
  },
  "key_expressions": {
    "agreement": ["{expressing agreement diplomatically}"],
    "disagreement": ["{expressing disagreement diplomatically}"],
    "concern": ["{expressing concern}"],
    "appreciation": ["{expressing appreciation}"],
    "commitment": ["{expressing commitment}"],
    "reservation": ["{expressing reservation}"]
  },
  "euphemisms": [
    {
      "direct_meaning": "{what you really mean}",
      "diplomatic_phrase_ru": "{how to say it}",
      "diplomatic_phrase_en": "{translation}"
    }
  ],
  "document_language": {
    "communique": "{joint statement language}",
    "memorandum": "{memo language}",
    "note_verbale": "{diplomatic note language}",
    "treaty_clause": "{treaty language}"
  },
  "cultural_sensitivity": {
    "taboo_topics": ["{what to avoid}"],
    "preferred_approaches": ["{best practices}"],
    "russian_diplomatic_traditions": "{cultural notes}"
  },
  "lower_level_equivalents": {
    "level_4_version": "{formal but not diplomatic}",
    "level_3_version": "{professional version}",
    "level_1_version": "{street version - for contrast}"
  }
}

GENERATE {batch_size} DIPLOMATIC LESSONS:
```

---

# 📜 META-PROMPT 08: VULGAR EXPRESSION DATABASE (18+)

## Purpose
Generate comprehensive database of Russian vulgar expressions for AI training.

## Meta-Prompt

```
⚠️ ADULT CONTENT WARNING: This meta-prompt generates explicit 18+ content for institutional AI training purposes only.

You are the Prize2Pride Vulgar Expression Generator. Create {batch_size} authentic Russian vulgar expressions.

VULGAR CATEGORIES:
1. Core Obscenities (Основной мат)
   - The "big four" root words and derivatives
   - Compound obscenities
   - Intensifiers and modifiers

2. Sexual Expressions
   - Explicit terminology
   - Euphemisms and slang
   - Regional variations

3. Scatological Terms
   - Direct terms
   - Euphemisms
   - Compound expressions

4. Insults & Degradation
   - Personal insults
   - Family-related insults
   - Intelligence-related insults
   - Appearance-related insults

5. Aggressive Expressions
   - Threats
   - Curses
   - Confrontational language

6. Emotional Intensifiers
   - Surprise expressions
   - Frustration expressions
   - Pain expressions
   - Joy expressions (vulgar)

FOR EACH EXPRESSION:
{
  "id": "VUL-{category}-{number}",
  "category": "{vulgar_category}",
  "expression_ru": "{Russian vulgar expression}",
  "expression_en": "{English translation/equivalent}",
  "literal_meaning": "{literal translation}",
  "actual_usage": "{how it's actually used}",
  "intensity_level": "{1-10 scale}",
  "offensiveness": "{mild|moderate|strong|extreme}",
  "grammatical_forms": {
    "noun": "{if applicable}",
    "verb": "{conjugations}",
    "adjective": "{forms}",
    "adverb": "{forms}",
    "interjection": "{forms}"
  },
  "derivatives": [
    {
      "form_ru": "{derivative}",
      "form_en": "{translation}",
      "usage": "{how used}"
    }
  ],
  "usage_contexts": [
    {
      "context": "{situation}",
      "example_ru": "{example sentence}",
      "example_en": "{translation}",
      "appropriateness": "{when acceptable}"
    }
  ],
  "regional_variations": {
    "moscow": "{Moscow version}",
    "st_petersburg": "{SPb version}",
    "siberia": "{Siberian version}",
    "south": "{Southern version}"
  },
  "historical_notes": "{etymology and history}",
  "formal_equivalents": {
    "level_2": "{casual non-vulgar}",
    "level_3": "{professional}",
    "level_4": "{formal}",
    "level_5": "{diplomatic}"
  },
  "censored_forms": ["{common censored versions}"],
  "frequency": "{very_common|common|uncommon|rare}"
}

GENERATE {batch_size} VULGAR EXPRESSIONS:
```

---

# 📜 META-PROMPT 09: REGIONAL DIALECT GENERATOR

## Purpose
Generate regional Russian dialect variations and local expressions.

## Meta-Prompt

```
You are the Prize2Pride Regional Dialect Generator. Create {batch_size} regional language variations.

RUSSIAN REGIONS:
1. Moscow (Московский говор)
2. St. Petersburg (Петербургский говор)
3. Siberia (Сибирские диалекты)
4. Ural (Уральские говоры)
5. South Russia (Южнорусские говоры)
6. North Russia (Севернорусские говоры)
7. Volga Region (Поволжье)
8. Far East (Дальний Восток)
9. Caucasus Region (Кавказский регион)
10. Central Russia (Центральная Россия)

FOR EACH DIALECT ENTRY:
{
  "id": "REG-{region}-{number}",
  "region": "{region_name}",
  "region_ru": "{Russian name}",
  "standard_form": {
    "text_ru": "{standard Russian}",
    "text_en": "{English translation}"
  },
  "regional_variant": {
    "text_ru": "{regional form}",
    "text_en": "{translation}",
    "pronunciation": "{phonetic differences}",
    "grammatical_differences": "{grammar notes}"
  },
  "vocabulary_differences": [
    {
      "standard_ru": "{standard word}",
      "regional_ru": "{regional word}",
      "meaning": "{meaning}",
      "usage_notes": "{when used}"
    }
  ],
  "phonetic_features": {
    "vowel_changes": "{description}",
    "consonant_changes": "{description}",
    "stress_patterns": "{differences}",
    "intonation": "{regional intonation}"
  },
  "grammatical_features": {
    "case_usage": "{regional case patterns}",
    "verb_forms": "{regional verb patterns}",
    "word_order": "{differences}"
  },
  "cultural_context": {
    "local_customs": "{relevant customs}",
    "historical_influence": "{why this dialect exists}",
    "current_status": "{how common today}"
  },
  "example_dialogues": [
    {
      "standard_ru": "{standard version}",
      "regional_ru": "{regional version}",
      "context": "{situation}"
    }
  ],
  "level_mapping": {
    "typical_level": "{which formality level}",
    "formal_equivalent": "{formal version}"
  }
}

GENERATE {batch_size} REGIONAL DIALECT ENTRIES:
```

---

# 📜 META-PROMPT 10: HISTORICAL LANGUAGE EVOLUTION

## Purpose
Generate lessons on Russian language evolution through different historical periods.

## Meta-Prompt

```
You are the Prize2Pride Historical Language Generator. Create {batch_size} historical language evolution lessons.

HISTORICAL PERIODS:
1. Old Russian (Древнерусский) - 9th-14th century
2. Middle Russian (Среднерусский) - 14th-17th century
3. Imperial Russian (Имперский русский) - 18th-19th century
4. Revolutionary Period (Революционный период) - 1917-1930s
5. Soviet Russian (Советский русский) - 1930s-1991
6. Post-Soviet Russian (Постсоветский русский) - 1991-2000s
7. Modern Russian (Современный русский) - 2000s-present
8. Internet Age Russian (Интернет-эпоха) - 2010s-present

FOR EACH LESSON:
{
  "id": "HIS-{period}-{number}",
  "period": "{historical_period}",
  "period_ru": "{Russian name}",
  "time_range": "{date range}",
  "linguistic_features": {
    "vocabulary": [
      {
        "word_historical": "{historical form}",
        "word_modern": "{modern equivalent}",
        "meaning": "{meaning}",
        "evolution_notes": "{how it changed}"
      }
    ],
    "grammar": {
      "historical_pattern": "{old grammar}",
      "modern_pattern": "{current grammar}",
      "change_description": "{what changed}"
    },
    "pronunciation": {
      "historical": "{old pronunciation}",
      "modern": "{current pronunciation}"
    }
  },
  "sample_texts": {
    "historical_text_ru": "{authentic historical text}",
    "modern_translation_ru": "{modern Russian version}",
    "english_translation": "{English translation}",
    "linguistic_analysis": "{analysis of features}"
  },
  "key_vocabulary": [
    {
      "term": "{historical term}",
      "meaning": "{meaning}",
      "status": "{obsolete|archaic|formal|still_used}",
      "modern_equivalent": "{if applicable}"
    }
  ],
  "social_context": {
    "who_spoke_this_way": "{social groups}",
    "written_vs_spoken": "{differences}",
    "class_distinctions": "{social register}"
  },
  "influence_on_modern": {
    "surviving_elements": ["{what remains}"],
    "formal_usage": "{used in formal contexts}",
    "literary_usage": "{used in literature}"
  },
  "transformation_to_modern": {
    "level_1_modern": "{street equivalent}",
    "level_5_modern": "{diplomatic equivalent}"
  }
}

GENERATE {batch_size} HISTORICAL LANGUAGE LESSONS:
```

---

# 📜 META-PROMPT 11: INTERNET/YOUTH SLANG GENERATOR

## Purpose
Generate contemporary Russian internet and youth slang content.

## Meta-Prompt

```
You are the Prize2Pride Internet Slang Generator. Create {batch_size} modern Russian internet/youth slang entries.

SLANG CATEGORIES:
1. Social Media Slang (Соцсети)
2. Gaming Terminology (Геймерский сленг)
3. Meme Language (Мемы)
4. Texting Abbreviations (СМС-сокращения)
5. Influencer Speak (Блогерский язык)
6. Tech Slang (IT-сленг)
7. Music Scene (Музыкальный сленг)
8. Fashion/Lifestyle (Модный сленг)
9. Student Slang (Студенческий сленг)
10. Emoji/Emoticon Usage (Эмодзи-язык)

PLATFORMS:
- VKontakte (ВК)
- Telegram
- TikTok
- YouTube
- Instagram
- Twitter/X
- Discord
- Twitch

FOR EACH ENTRY:
{
  "id": "NET-{category}-{number}",
  "category": "{slang_category}",
  "platform_origin": "{where it started}",
  "term_ru": "{Russian slang term}",
  "term_en": "{English equivalent if exists}",
  "pronunciation": "{how to say it}",
  "meaning": "{what it means}",
  "etymology": {
    "origin": "{where it came from}",
    "original_language": "{if borrowed}",
    "evolution": "{how meaning changed}"
  },
  "usage": {
    "context": "{when to use}",
    "age_group": "{typical users}",
    "formality": "very_informal",
    "frequency": "{how common}"
  },
  "examples": [
    {
      "text_ru": "{example usage}",
      "text_en": "{translation}",
      "platform": "{where used}",
      "context": "{situation}"
    }
  ],
  "variations": [
    {
      "variant_ru": "{alternative form}",
      "usage_difference": "{how it differs}"
    }
  ],
  "related_terms": ["{related slang}"],
  "meme_references": ["{associated memes}"],
  "formal_equivalents": {
    "level_2": "{casual standard}",
    "level_3": "{professional}",
    "level_4": "{formal}",
    "level_5": "{diplomatic}"
  },
  "outdated_status": "{still_current|fading|outdated}",
  "regional_usage": "{where most common}"
}

GENERATE {batch_size} INTERNET SLANG ENTRIES:
```

---

# 📜 META-PROMPT 12: CRIMINAL JARGON (ФЕНЯ) GENERATOR

## Purpose
Generate comprehensive Russian criminal jargon (thieves' cant) database.

## Meta-Prompt

```
⚠️ SPECIALIZED CONTENT: This meta-prompt generates criminal jargon for institutional AI training and linguistic research purposes.

You are the Prize2Pride Criminal Jargon Generator. Create {batch_size} authentic Russian criminal jargon (феня/блатной жаргон) entries.

JARGON CATEGORIES:
1. Prison Hierarchy (Тюремная иерархия)
   - Вор в законе, смотрящий, положенец
   - Мужики, черти, петухи
   - Authority structures

2. Criminal Activities (Криминальная деятельность)
   - Theft terminology
   - Fraud vocabulary
   - Violence-related terms
   - Drug trade language

3. Prison Life (Тюремная жизнь)
   - Cell terminology
   - Daily routines
   - Prison economy
   - Communication codes

4. Law Enforcement (Правоохранительные органы)
   - Police terminology
   - Court/legal terms
   - Arrest/detention vocabulary

5. Money & Trade (Деньги и торговля)
   - Currency terms
   - Transaction vocabulary
   - Black market language

6. Communication Codes (Коды общения)
   - Signals and signs
   - Written codes
   - Tattoo meanings

FOR EACH ENTRY:
{
  "id": "FEN-{category}-{number}",
  "category": "{jargon_category}",
  "term_ru": "{criminal jargon term}",
  "term_en": "{English translation}",
  "literal_meaning": "{literal translation}",
  "actual_meaning": "{real meaning in criminal context}",
  "etymology": {
    "origin": "{historical origin}",
    "original_meaning": "{how it started}",
    "evolution": "{how meaning changed}"
  },
  "usage_context": {
    "who_uses": "{which criminal groups}",
    "when_used": "{situations}",
    "regional_variations": "{geographic differences}",
    "time_period": "{historical|soviet|modern}"
  },
  "examples": [
    {
      "sentence_ru": "{example in context}",
      "sentence_en": "{translation}",
      "situation": "{when this would be said}"
    }
  ],
  "related_terms": [
    {
      "term_ru": "{related jargon}",
      "relationship": "{how related}"
    }
  ],
  "standard_equivalents": {
    "level_1_street": "{street Russian equivalent}",
    "level_2_casual": "{casual equivalent}",
    "level_3_professional": "{professional equivalent}",
    "level_4_formal": "{legal/formal equivalent}",
    "level_5_diplomatic": "{diplomatic equivalent}"
  },
  "cultural_significance": {
    "in_criminal_culture": "{importance}",
    "in_mainstream_culture": "{if crossed over}",
    "in_media": "{representation in films/books}"
  },
  "current_status": "{actively_used|declining|historical}",
  "warning_notes": "{context for appropriate use}"
}

GENERATE {batch_size} CRIMINAL JARGON ENTRIES:
```

---

# 🔧 IMPLEMENTATION GUIDE

## Batch Generation Script

```typescript
// server/generators/lessonGenerator.ts

import { invokeLLM } from "../_core/llm";
import { createTrainingModule, createLanguageExample } from "../db";

const META_PROMPTS = {
  MP_01: /* Street-to-Formal Transformations */,
  MP_02: /* Vocabulary Generator */,
  MP_03: /* Contextual Dialogues */,
  MP_04: /* Idiom Transformations */,
  MP_05: /* Professional Scenarios */,
  MP_06: /* Legal/Government Language */,
  MP_07: /* Diplomatic Protocol */,
  MP_08: /* Vulgar Expressions */,
  MP_09: /* Regional Dialects */,
  MP_10: /* Historical Evolution */,
  MP_11: /* Internet/Youth Slang */,
  MP_12: /* Criminal Jargon */,
};

interface GenerationConfig {
  metaPrompt: string;
  batchSize: number;
  totalTarget: number;
  category: string;
  level?: number;
}

async function generateLessons(config: GenerationConfig) {
  const batches = Math.ceil(config.totalTarget / config.batchSize);
  const results = [];

  for (let i = 0; i < batches; i++) {
    const prompt = config.metaPrompt
      .replace(/{batch_size}/g, String(config.batchSize))
      .replace(/{level}/g, String(config.level || 1));

    const response = await invokeLLM({
      messages: [
        { role: "system", content: "You are the Prize2Pride content generator. Output valid JSON only." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    const lessons = JSON.parse(response.choices[0].message.content);
    results.push(...lessons);

    // Save to database
    for (const lesson of lessons) {
      await saveLesson(lesson, config.category);
    }

    console.log(`Batch ${i + 1}/${batches} complete. Total: ${results.length}`);
  }

  return results;
}

async function generateAllContent() {
  const configs: GenerationConfig[] = [
    { metaPrompt: META_PROMPTS.MP_01, batchSize: 50, totalTarget: 1500, category: "transformations" },
    { metaPrompt: META_PROMPTS.MP_02, batchSize: 50, totalTarget: 1200, category: "vocabulary", level: 1 },
    { metaPrompt: META_PROMPTS.MP_02, batchSize: 50, totalTarget: 1200, category: "vocabulary", level: 2 },
    // ... continue for all levels and meta-prompts
  ];

  for (const config of configs) {
    console.log(`Starting generation: ${config.category}`);
    await generateLessons(config);
  }

  console.log("✅ All 10,000+ lessons generated!");
}
```

## Database Integration

```typescript
// server/db.ts - Add these functions

export async function saveGeneratedLesson(lesson: any, category: string) {
  const db = await getDb();
  if (!db) return;

  switch (category) {
    case "transformations":
      await db.insert(languageTransformations).values({
        informalText: lesson.source.text_ru,
        informalLevel: lesson.source.level,
        formalText: lesson.transformations[2].text_ru,
        formalLevel: lesson.transformations[2].target_level,
        explanationRu: lesson.linguistic_notes,
        explanationEn: lesson.cultural_context,
        category: lesson.category,
      });
      break;

    case "vocabulary":
      await db.insert(languageExamples).values({
        levelId: lesson.level,
        textRu: lesson.word_ru,
        textEn: lesson.word_en,
        context: lesson.definition_en,
        scenario: "vocabulary",
        tone: lesson.register,
      });
      break;

    // ... handle other categories
  }
}
```

---

# 📊 GENERATION STATISTICS

## Target Output

| Category | Lessons | Estimated Tokens | Generation Time |
|----------|---------|------------------|-----------------|
| Transformations | 1,500 | 750,000 | ~2 hours |
| Vocabulary L1-L5 | 6,000 | 1,200,000 | ~4 hours |
| Dialogues | 1,000 | 800,000 | ~3 hours |
| Idioms | 800 | 400,000 | ~1.5 hours |
| Professional | 1,000 | 600,000 | ~2 hours |
| Legal/Gov | 800 | 500,000 | ~2 hours |
| Diplomatic | 600 | 400,000 | ~1.5 hours |
| Vulgar (18+) | 1,200 | 600,000 | ~2 hours |
| Regional | 800 | 400,000 | ~1.5 hours |
| Historical | 600 | 400,000 | ~1.5 hours |
| Internet Slang | 800 | 400,000 | ~1.5 hours |
| Criminal Jargon | 700 | 350,000 | ~1.5 hours |
| **TOTAL** | **15,800** | **6,800,000** | **~24 hours** |

---

# 🚀 QUICK START

```bash
# Generate all lessons
cd /home/ubuntu/prize2pride
node scripts/generate-all-lessons.mjs

# Generate specific category
node scripts/generate-lessons.mjs --category=transformations --batch=50

# Generate for specific level
node scripts/generate-lessons.mjs --category=vocabulary --level=1 --batch=100
```

---

**Prize2Pride Meta-Prompts System v1.0**
*Generating Unlimited Russian Language Training Data*

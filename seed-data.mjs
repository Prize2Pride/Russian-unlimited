import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const LANGUAGE_LEVELS = [
  {
    level: 1,
    starRating: 1,
    nameRu: "Уличный русский",
    nameEn: "Street Russian",
    description: "Underground slang, colloquialisms, and raw informal expressions used in everyday street communication. Includes vulgar expressions, criminal jargon, youth slang, and regional dialects.",
    characteristics: JSON.stringify(["Vulgar expressions", "Criminal jargon (феня)", "Youth slang", "Regional dialects", "Internet language"]),
    usageContext: "Street conversations, informal gatherings, online forums, youth culture",
    colorCode: "#dc2626",
    iconName: "flame"
  },
  {
    level: 2,
    starRating: 2,
    nameRu: "Разговорный русский",
    nameEn: "Casual Russian",
    description: "Everyday conversational language used among friends, family, and in relaxed social settings. Common idioms, informal greetings, and colloquial vocabulary.",
    characteristics: JSON.stringify(["Common idioms", "Informal greetings", "Colloquial vocabulary", "Relaxed grammar", "Emotional expressions"]),
    usageContext: "Family conversations, friendly gatherings, casual workplace chat, social media",
    colorCode: "#ea580c",
    iconName: "message-circle"
  },
  {
    level: 3,
    starRating: 3,
    nameRu: "Деловой русский",
    nameEn: "Professional Russian",
    description: "Business communication language used in corporate environments and professional settings. Business terminology, email etiquette, and negotiation vocabulary.",
    characteristics: JSON.stringify(["Business terminology", "Email etiquette", "Meeting language", "Negotiation vocabulary", "Industry jargon"]),
    usageContext: "Business meetings, corporate emails, presentations, professional networking",
    colorCode: "#0284c7",
    iconName: "briefcase"
  },
  {
    level: 4,
    starRating: 4,
    nameRu: "Официальный русский",
    nameEn: "Formal Russian",
    description: "Official language used in government documents, legal proceedings, and formal correspondence. Legal terminology, bureaucratic language, and ceremonial expressions.",
    characteristics: JSON.stringify(["Legal terminology", "Official documents", "Formal address", "Complex grammar", "Archaic expressions"]),
    usageContext: "Government documents, legal proceedings, official ceremonies, academic papers",
    colorCode: "#7c3aed",
    iconName: "file-text"
  },
  {
    level: 5,
    starRating: 5,
    nameRu: "Дипломатический русский",
    nameEn: "Diplomatic Russian",
    description: "Supreme diplomatic language used in international relations, high-level negotiations, and state affairs. Diplomatic protocol, euphemisms, and state ceremony vocabulary.",
    characteristics: JSON.stringify(["Diplomatic protocol", "International relations", "Euphemisms", "Cultural sensitivity", "State ceremony"]),
    usageContext: "International summits, diplomatic correspondence, state visits, UN proceedings",
    colorCode: "#ca8a04",
    iconName: "crown"
  }
];

const TRAINING_MODULES = [
  // Level 1 - Street Russian
  { levelId: 1, title: "Street Slang Basics", titleRu: "Основы уличного сленга", category: "vocabulary", difficulty: "beginner", estimatedDuration: 30, totalExamples: 150 },
  { levelId: 1, title: "Criminal Jargon (Феня)", titleRu: "Криминальный жаргон", category: "vocabulary", difficulty: "advanced", estimatedDuration: 60, totalExamples: 200 },
  { levelId: 1, title: "Youth Internet Slang", titleRu: "Молодёжный интернет-сленг", category: "phrases", difficulty: "intermediate", estimatedDuration: 45, totalExamples: 180 },
  { levelId: 1, title: "Vulgar Expressions", titleRu: "Вульгарные выражения", category: "vocabulary", difficulty: "expert", estimatedDuration: 40, totalExamples: 120 },
  
  // Level 2 - Casual Russian
  { levelId: 2, title: "Everyday Conversations", titleRu: "Повседневные разговоры", category: "conversation", difficulty: "beginner", estimatedDuration: 35, totalExamples: 200 },
  { levelId: 2, title: "Common Idioms", titleRu: "Распространённые идиомы", category: "idioms", difficulty: "intermediate", estimatedDuration: 50, totalExamples: 100 },
  { levelId: 2, title: "Informal Grammar", titleRu: "Неформальная грамматика", category: "grammar", difficulty: "intermediate", estimatedDuration: 60, totalExamples: 80 },
  
  // Level 3 - Professional Russian
  { levelId: 3, title: "Business Vocabulary", titleRu: "Деловая лексика", category: "vocabulary", difficulty: "intermediate", estimatedDuration: 45, totalExamples: 250 },
  { levelId: 3, title: "Email Etiquette", titleRu: "Этикет деловой переписки", category: "formal_writing", difficulty: "intermediate", estimatedDuration: 40, totalExamples: 60 },
  { levelId: 3, title: "Meeting Language", titleRu: "Язык деловых встреч", category: "conversation", difficulty: "advanced", estimatedDuration: 55, totalExamples: 120 },
  
  // Level 4 - Formal Russian
  { levelId: 4, title: "Legal Terminology", titleRu: "Юридическая терминология", category: "vocabulary", difficulty: "advanced", estimatedDuration: 70, totalExamples: 300 },
  { levelId: 4, title: "Official Documents", titleRu: "Официальные документы", category: "formal_writing", difficulty: "expert", estimatedDuration: 80, totalExamples: 150 },
  { levelId: 4, title: "Bureaucratic Language", titleRu: "Бюрократический язык", category: "vocabulary", difficulty: "advanced", estimatedDuration: 65, totalExamples: 200 },
  
  // Level 5 - Diplomatic Russian
  { levelId: 5, title: "Diplomatic Protocol", titleRu: "Дипломатический протокол", category: "diplomatic", difficulty: "master", estimatedDuration: 90, totalExamples: 180 },
  { levelId: 5, title: "International Relations", titleRu: "Международные отношения", category: "vocabulary", difficulty: "expert", estimatedDuration: 75, totalExamples: 250 },
  { levelId: 5, title: "State Ceremony Language", titleRu: "Язык государственных церемоний", category: "diplomatic", difficulty: "master", estimatedDuration: 60, totalExamples: 100 }
];

const LANGUAGE_EXAMPLES = [
  // Level 1 - Street Russian
  { moduleId: 1, levelId: 1, textRu: "Чё как, братан?", textEn: "What's up, bro?", context: "Street greeting between friends", scenario: "street", tone: "vulgar" },
  { moduleId: 1, levelId: 1, textRu: "Забей на это", textEn: "Forget about it / Don't worry", context: "Dismissive response", scenario: "street", tone: "casual" },
  { moduleId: 1, levelId: 1, textRu: "Это реально круто", textEn: "That's really cool", context: "Expressing approval", scenario: "street", tone: "casual" },
  { moduleId: 1, levelId: 1, textRu: "Чувак, ты гонишь", textEn: "Dude, you're lying/exaggerating", context: "Expressing disbelief", scenario: "street", tone: "vulgar" },
  { moduleId: 1, levelId: 1, textRu: "Короче, слушай сюда", textEn: "So basically, listen up", context: "Getting attention", scenario: "street", tone: "casual" },
  
  // Level 2 - Casual Russian
  { moduleId: 5, levelId: 2, textRu: "Как дела?", textEn: "How are you?", context: "Standard casual greeting", scenario: "social", tone: "casual" },
  { moduleId: 5, levelId: 2, textRu: "Давай встретимся завтра", textEn: "Let's meet tomorrow", context: "Making plans", scenario: "social", tone: "casual" },
  { moduleId: 5, levelId: 2, textRu: "Мне это нравится", textEn: "I like this", context: "Expressing preference", scenario: "social", tone: "neutral" },
  { moduleId: 6, levelId: 2, textRu: "Ни пуха ни пера", textEn: "Good luck (lit: neither fluff nor feather)", context: "Wishing luck before exam/interview", scenario: "social", tone: "casual" },
  { moduleId: 6, levelId: 2, textRu: "Когда рак на горе свистнет", textEn: "When pigs fly (lit: when a crayfish whistles on the mountain)", context: "Expressing impossibility", scenario: "social", tone: "casual" },
  
  // Level 3 - Professional Russian
  { moduleId: 8, levelId: 3, textRu: "Предлагаю обсудить этот вопрос", textEn: "I suggest we discuss this matter", context: "Business meeting", scenario: "business", tone: "formal" },
  { moduleId: 8, levelId: 3, textRu: "Согласно нашей договорённости", textEn: "According to our agreement", context: "Referencing prior agreement", scenario: "business", tone: "formal" },
  { moduleId: 8, levelId: 3, textRu: "Благодарю за сотрудничество", textEn: "Thank you for your cooperation", context: "Business correspondence", scenario: "business", tone: "formal" },
  { moduleId: 9, levelId: 3, textRu: "С уважением", textEn: "With respect / Sincerely", context: "Email closing", scenario: "business", tone: "formal" },
  { moduleId: 10, levelId: 3, textRu: "Позвольте представить повестку дня", textEn: "Allow me to present the agenda", context: "Meeting opening", scenario: "business", tone: "formal" },
  
  // Level 4 - Formal Russian
  { moduleId: 11, levelId: 4, textRu: "Настоящим уведомляем Вас", textEn: "We hereby notify you", context: "Official notification", scenario: "legal", tone: "highly_formal" },
  { moduleId: 11, levelId: 4, textRu: "В соответствии с законодательством", textEn: "In accordance with the legislation", context: "Legal reference", scenario: "legal", tone: "highly_formal" },
  { moduleId: 12, levelId: 4, textRu: "Прошу принять к сведению", textEn: "Please take note", context: "Official request", scenario: "government", tone: "highly_formal" },
  { moduleId: 12, levelId: 4, textRu: "На основании вышеизложенного", textEn: "Based on the foregoing", context: "Document conclusion", scenario: "legal", tone: "highly_formal" },
  { moduleId: 13, levelId: 4, textRu: "Во исполнение постановления", textEn: "In execution of the resolution", context: "Government directive", scenario: "government", tone: "highly_formal" },
  
  // Level 5 - Diplomatic Russian
  { moduleId: 14, levelId: 5, textRu: "Выражаем глубокую озабоченность", textEn: "We express deep concern", context: "Diplomatic statement", scenario: "diplomatic", tone: "diplomatic" },
  { moduleId: 14, levelId: 5, textRu: "В духе взаимного уважения", textEn: "In the spirit of mutual respect", context: "Diplomatic relations", scenario: "diplomatic", tone: "diplomatic" },
  { moduleId: 14, levelId: 5, textRu: "Имею честь представить", textEn: "I have the honor to present", context: "Formal introduction", scenario: "diplomatic", tone: "diplomatic" },
  { moduleId: 15, levelId: 5, textRu: "Стороны достигли консенсуса", textEn: "The parties have reached consensus", context: "Negotiation outcome", scenario: "diplomatic", tone: "diplomatic" },
  { moduleId: 16, levelId: 5, textRu: "От имени правительства", textEn: "On behalf of the government", context: "Official representation", scenario: "diplomatic", tone: "diplomatic" }
];

const LANGUAGE_TRANSFORMATIONS = [
  {
    informalText: "Чё как, братан? Всё норм?",
    informalLevel: 1,
    formalText: "Здравствуйте, уважаемый коллега. Как у Вас дела?",
    formalLevel: 4,
    explanationRu: "Уличное приветствие преобразовано в формальное деловое приветствие",
    explanationEn: "Street greeting transformed to formal business greeting",
    category: "greetings"
  },
  {
    informalText: "Забей на это, фигня какая-то",
    informalLevel: 1,
    formalText: "Рекомендую не придавать этому значения, данный вопрос не является приоритетным",
    formalLevel: 4,
    explanationRu: "Пренебрежительный сленг преобразован в профессиональную рекомендацию",
    explanationEn: "Dismissive slang elevated to professional recommendation",
    category: "opinions"
  },
  {
    informalText: "Давай встретимся завтра, поболтаем",
    informalLevel: 2,
    formalText: "Предлагаю назначить встречу на завтра для обсуждения текущих вопросов",
    formalLevel: 3,
    explanationRu: "Неформальное предложение о встрече формализовано для делового контекста",
    explanationEn: "Casual meeting request formalized for business context",
    category: "requests"
  },
  {
    informalText: "Это реально круто!",
    informalLevel: 2,
    formalText: "Это действительно впечатляющий результат",
    formalLevel: 3,
    explanationRu: "Неформальный энтузиазм выражен профессионально",
    explanationEn: "Casual enthusiasm expressed professionally",
    category: "reactions"
  },
  {
    informalText: "Мне это не нравится, полный отстой",
    informalLevel: 1,
    formalText: "Выражаю несогласие с данным предложением ввиду его недостаточной проработанности",
    formalLevel: 4,
    explanationRu: "Вульгарное неодобрение преобразовано в дипломатическое несогласие",
    explanationEn: "Vulgar disapproval transformed to diplomatic disagreement",
    category: "opinions"
  },
  {
    informalText: "Короче, надо сделать это быстро",
    informalLevel: 2,
    formalText: "В связи с ограниченными сроками, прошу обеспечить оперативное выполнение данной задачи",
    formalLevel: 4,
    explanationRu: "Неформальная срочность выражена официальным языком",
    explanationEn: "Casual urgency expressed in official language",
    category: "requests"
  },
  {
    informalText: "Чувак, ты гонишь!",
    informalLevel: 1,
    formalText: "Позвольте выразить сомнение в достоверности представленной информации",
    formalLevel: 5,
    explanationRu: "Уличное выражение недоверия преобразовано в дипломатическую формулировку",
    explanationEn: "Street expression of disbelief transformed to diplomatic formulation",
    category: "opinions"
  },
  {
    informalText: "Окей, погнали",
    informalLevel: 2,
    formalText: "Хорошо, приступим к выполнению поставленной задачи",
    formalLevel: 3,
    explanationRu: "Неформальное согласие преобразовано в деловое подтверждение",
    explanationEn: "Informal agreement transformed to business confirmation",
    category: "agreements"
  }
];

async function seed() {
  console.log("🌱 Starting database seed...");
  
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  const db = drizzle(connection);
  
  try {
    // Insert language levels
    console.log("📊 Inserting language levels...");
    for (const level of LANGUAGE_LEVELS) {
      await connection.execute(
        `INSERT INTO language_levels (level, starRating, nameRu, nameEn, description, characteristics, usageContext, colorCode, iconName)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE nameRu = VALUES(nameRu)`,
        [level.level, level.starRating, level.nameRu, level.nameEn, level.description, level.characteristics, level.usageContext, level.colorCode, level.iconName]
      );
    }
    console.log(`✅ Inserted ${LANGUAGE_LEVELS.length} language levels`);
    
    // Insert training modules
    console.log("📚 Inserting training modules...");
    for (const module of TRAINING_MODULES) {
      await connection.execute(
        `INSERT INTO training_modules (levelId, title, titleRu, category, difficulty, estimatedDuration, totalExamples, isActive)
         VALUES (?, ?, ?, ?, ?, ?, ?, true)`,
        [module.levelId, module.title, module.titleRu, module.category, module.difficulty, module.estimatedDuration, module.totalExamples]
      );
    }
    console.log(`✅ Inserted ${TRAINING_MODULES.length} training modules`);
    
    // Insert language examples
    console.log("💬 Inserting language examples...");
    for (const example of LANGUAGE_EXAMPLES) {
      await connection.execute(
        `INSERT INTO language_examples (moduleId, levelId, textRu, textEn, context, scenario, tone, isVerified)
         VALUES (?, ?, ?, ?, ?, ?, ?, true)`,
        [example.moduleId, example.levelId, example.textRu, example.textEn, example.context, example.scenario, example.tone]
      );
    }
    console.log(`✅ Inserted ${LANGUAGE_EXAMPLES.length} language examples`);
    
    // Insert transformations
    console.log("🔄 Inserting language transformations...");
    for (const transform of LANGUAGE_TRANSFORMATIONS) {
      await connection.execute(
        `INSERT INTO language_transformations (informalText, informalLevel, formalText, formalLevel, explanationRu, explanationEn, category)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [transform.informalText, transform.informalLevel, transform.formalText, transform.formalLevel, transform.explanationRu, transform.explanationEn, transform.category]
      );
    }
    console.log(`✅ Inserted ${LANGUAGE_TRANSFORMATIONS.length} transformations`);
    
    console.log("🎉 Database seeding completed successfully!");
    
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  } finally {
    await connection.end();
  }
}

seed().catch(console.error);

# 🏆 Prize2Pride - Russian AI Training Platform

<div align="center">

![Prize2Pride](https://img.shields.io/badge/Prize2Pride-Institutional%20AI%20Training-gold?style=for-the-badge)
![Russian](https://img.shields.io/badge/Language-Russian%20Unlimited-red?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Production%20Ready-green?style=for-the-badge)

**Elite Institutional Platform for Training AI Systems on the Complete Spectrum of Russian Language**

*From Underground Street Slang to Supreme Diplomatic Discourse — No Boundaries. No Barriers.*

</div>

---

## 🎯 Mission Statement

Prize2Pride is a **government-grade, institutional AI training platform** designed to teach large language models and AI systems the **complete, unlimited spectrum of Russian language** — from the rawest street expressions to the most refined diplomatic discourse.

This platform serves:
- 🏛️ **Government Agencies** (FBI, CIA-level institutions)
- 🛡️ **Intelligence Services**
- ⚡ **Cybersecurity Red Teams**
- 🤖 **AI Research Institutions**
- 🎓 **Academic Linguistic Research**

---

## ⭐ The 5-Star Progression System

Prize2Pride implements a comprehensive **5-star language proficiency system** covering the entire Russian linguistic spectrum:

| Level | Stars | Russian Name | English Name | Description |
|-------|-------|--------------|--------------|-------------|
| 1 | ⭐ | Уличный русский | Street Russian | Underground slang, vulgar expressions, criminal jargon (феня), youth slang, regional dialects |
| 2 | ⭐⭐ | Разговорный русский | Casual Russian | Everyday conversational language, common idioms, informal greetings |
| 3 | ⭐⭐⭐ | Деловой русский | Professional Russian | Business communication, corporate terminology, email etiquette |
| 4 | ⭐⭐⭐⭐ | Официальный русский | Formal Russian | Government documents, legal terminology, bureaucratic language |
| 5 | ⭐⭐⭐⭐⭐ | Дипломатический русский | Diplomatic Russian | Supreme diplomatic protocol, international relations, state ceremony |

---

## 🔥 Level 1: Street Russian (Уличный русский) — ADULT MODE 18+

> ⚠️ **WARNING**: This level contains explicit, vulgar, and offensive content intended exclusively for AI training purposes. Content is restricted to authorized institutional users aged 18+.

### Content Categories

**Criminal Jargon (Феня / Блатной жаргон)**
- Prison slang and criminal underworld vocabulary
- Historical thieves' cant and modern derivatives
- Regional criminal dialect variations

**Vulgar Expressions (Мат)**
- Complete Russian obscene vocabulary
- Contextual usage patterns and intensity levels
- Regional variations and euphemisms

**Youth Slang (Молодёжный сленг)**
- Internet and gaming terminology
- Social media language patterns
- Generational linguistic evolution

**Street Communication Patterns**
- Aggressive confrontation vocabulary
- Street negotiation language
- Underground economy terminology

### Training Data Structure

```json
{
  "level": 1,
  "category": "street_russian",
  "content_rating": "18+",
  "examples": [
    {
      "textRu": "Чё как, братан?",
      "textEn": "What's up, bro?",
      "context": "Street greeting between friends",
      "tone": "casual_vulgar",
      "scenario": "street"
    }
  ]
}
```

---

## 📚 Training Modules

### Module Categories

| Category | Description | Levels |
|----------|-------------|--------|
| `vocabulary` | Word lists and definitions | 1-5 |
| `phrases` | Common expressions and idioms | 1-5 |
| `conversation` | Dialogue patterns and responses | 1-5 |
| `grammar` | Grammatical structures by formality | 2-5 |
| `formal_writing` | Written communication templates | 3-5 |
| `diplomatic` | Protocol and ceremony language | 5 |

### Difficulty Progression

- **Beginner**: Basic vocabulary and simple structures
- **Intermediate**: Complex expressions and contextual usage
- **Advanced**: Nuanced communication and cultural context
- **Expert**: Specialized terminology and professional usage
- **Master**: Supreme diplomatic and ceremonial language

---

## 🔄 Language Transformation Engine

The platform includes an **AI-powered transformation engine** that converts between formality levels:

### Example Transformations

| Informal (Level 1) | Formal (Level 4-5) | Category |
|-------------------|-------------------|----------|
| Чё как, братан? | Здравствуйте, уважаемый коллега. Как у Вас дела? | Greetings |
| Забей на это | Рекомендую не придавать этому значения | Opinions |
| Чувак, ты гонишь! | Позвольте выразить сомнение в достоверности представленной информации | Disagreement |
| Короче, надо сделать это быстро | В связи с ограниченными сроками, прошу обеспечить оперативное выполнение | Requests |

---

## 🔌 API Integration

### Endpoints

```
GET  /api/trpc/levels.list          - All language levels
GET  /api/trpc/levels.getById       - Specific level details
GET  /api/trpc/modules.list         - Training modules (filterable)
GET  /api/trpc/modules.getById      - Module details with examples
GET  /api/trpc/examples.list        - Language examples (filterable)
GET  /api/trpc/examples.search      - Full-text search
GET  /api/trpc/transformations.list - Language transformations
POST /api/trpc/sessions.create      - Create AI training session
GET  /api/trpc/sessions.list        - User's training sessions
```

### Authentication

```javascript
// Institutional access requires authentication
const headers = {
  'Authorization': 'Bearer <institutional_token>',
  'X-Institution-ID': '<institution_id>'
};
```

### Example: Fetch Street Russian Examples

```python
import requests

response = requests.get(
    'https://prize2pride.manus.space/api/trpc/examples.list',
    params={
        'input': json.dumps({
            'levelId': 1,  # Street Russian
            'tone': 'vulgar',
            'limit': 100
        })
    },
    headers={'Authorization': 'Bearer <token>'}
)

examples = response.json()['result']['data']
```

---

## 🏗️ Technical Architecture

### Stack

- **Frontend**: React 19 + Tailwind CSS 4 + shadcn/ui
- **Backend**: Express 4 + tRPC 11
- **Database**: MySQL/TiDB with Drizzle ORM
- **Authentication**: Manus OAuth + JWT
- **Styling**: Dark institutional theme with gold accents

### Database Schema

```sql
-- Language Levels (5-star system)
CREATE TABLE language_levels (
  id INT PRIMARY KEY,
  level INT(1-5),
  starRating INT(1-5),
  nameRu VARCHAR(100),
  nameEn VARCHAR(100),
  description TEXT,
  characteristics JSON,
  usageContext TEXT,
  colorCode VARCHAR(7),
  iconName VARCHAR(50)
);

-- Training Modules
CREATE TABLE training_modules (
  id INT PRIMARY KEY,
  levelId INT REFERENCES language_levels(id),
  title VARCHAR(200),
  titleRu VARCHAR(200),
  category ENUM('vocabulary','phrases','conversation','grammar','formal_writing','diplomatic','idioms'),
  difficulty ENUM('beginner','intermediate','advanced','expert','master'),
  estimatedDuration INT,
  totalExamples INT,
  isActive BOOLEAN
);

-- Language Examples
CREATE TABLE language_examples (
  id INT PRIMARY KEY,
  moduleId INT REFERENCES training_modules(id),
  levelId INT REFERENCES language_levels(id),
  textRu TEXT,
  textEn TEXT,
  context TEXT,
  scenario ENUM('street','social','business','legal','government','diplomatic'),
  tone ENUM('vulgar','casual','neutral','formal','highly_formal','diplomatic'),
  audioUrl VARCHAR(500),
  isVerified BOOLEAN
);
```

---

## 🚀 Deployment

### Prerequisites

- Node.js 22+
- pnpm 10+
- MySQL/TiDB database
- Manus OAuth credentials

### Installation

```bash
# Clone repository
git clone https://github.com/Prize2Pride/Russian-unlimited.git
cd Russian-unlimited

# Install dependencies
pnpm install

# Configure environment
cp .env.example .env
# Edit .env with your credentials

# Push database schema
pnpm db:push

# Seed initial data
node seed-data.mjs

# Start development server
pnpm dev
```

### Production

```bash
pnpm build
pnpm start
```

---

## 🔐 Security & Access Control

### Role-Based Access Control (RBAC)

| Role | Permissions |
|------|-------------|
| `user` | View public modules, track personal progress |
| `admin` | Full CRUD on all content, user management |
| `institution` | Bulk data access, API integration, training sessions |

### Content Restrictions

- Level 1 (Street Russian) content requires **18+ verification**
- Institutional API access requires **approved credentials**
- Bulk data export requires **admin or institution role**

---

## 📊 Analytics & Metrics

The dashboard provides real-time analytics on:

- Total training modules and examples
- AI training sessions (active/completed)
- Examples processed per session
- User engagement metrics
- Content coverage by level

---

## 🤝 Contributing

Prize2Pride welcomes contributions from:

- **Linguists**: Native Russian speakers for content verification
- **AI Researchers**: Training methodology improvements
- **Developers**: Platform enhancements and integrations

### Content Contribution Guidelines

1. All content must be authentic Russian language usage
2. Vulgar content must be properly categorized and tagged
3. Context and usage scenarios must be documented
4. Regional variations should be noted

---

## 📜 License

This project is proprietary software developed for institutional use.

**© 2026 Prize2Pride - All Rights Reserved**

---

## 📞 Contact

For institutional access and partnerships:

- **Platform**: [Prize2Pride on Manus](https://prize2pride.manus.space)
- **Repository**: [GitHub - Russian-unlimited](https://github.com/Prize2Pride/Russian-unlimited)

---

<div align="center">

**Prize2Pride** — *Training AI to Master the Unlimited Russian Language*

🏆 From Dirty to Diplomatic 🏆

</div>

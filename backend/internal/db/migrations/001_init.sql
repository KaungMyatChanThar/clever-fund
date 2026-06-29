CREATE TABLE IF NOT EXISTS applications (
    id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name  TEXT        NOT NULL,
    contact    TEXT        NOT NULL,
    program    TEXT        NOT NULL,
    motivation TEXT        NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS courses (
    id          SERIAL      PRIMARY KEY,
    title       TEXT        NOT NULL,
    description TEXT        NOT NULL,
    program     TEXT        NOT NULL,
    provider    TEXT        NOT NULL,
    duration    TEXT        NOT NULL,
    price_mmk   INTEGER     NOT NULL DEFAULT 0,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO courses (title, description, program, provider, duration, price_mmk) VALUES
-- Tech & Software
('Full-Stack Web Development',
 'Build modern web apps with React, Node.js, and PostgreSQL from scratch.',
 'Tech & Software', 'Code Myanmar Institute', '6 months', 450000),

('Data Science & Machine Learning',
 'Master Python, pandas, scikit-learn, and build real ML models.',
 'Tech & Software', 'AI Academy Myanmar', '4 months', 380000),

('Cybersecurity Fundamentals',
 'Network security, ethical hacking, and incident response for beginners.',
 'Tech & Software', 'SecureNet Training', '3 months', 290000),

-- Healthcare
('Nursing Fundamentals',
 'Clinical skills, patient care, and medical ethics for aspiring nurses.',
 'Healthcare', 'Myanmar Medical College', '12 months', 550000),

('Public Health & Epidemiology',
 'Understand disease prevention, health policy, and community health.',
 'Healthcare', 'Health Sciences University', '6 months', 320000),

('Pharmacy Technician Certificate',
 'Drug dispensing, pharmacology basics, and hospital pharmacy workflows.',
 'Healthcare', 'PharmaTech Myanmar', '4 months', 280000),

-- Engineering
('Civil Engineering Essentials',
 'Structural analysis, AutoCAD, and construction project management.',
 'Engineering', 'Engineering Institute Myanmar', '8 months', 480000),

('Electrical Systems Design',
 'Wiring, circuit design, and industrial automation fundamentals.',
 'Engineering', 'Power Tech Academy', '6 months', 420000),

('Mechanical Design with SolidWorks',
 'CAD/CAM, manufacturing processes, and 3D design for industry.',
 'Engineering', 'MechTech Center', '5 months', 390000),

-- Business & Finance
('Accounting & Bookkeeping',
 'Financial statements, tax basics, and accounting software (MYOB/QuickBooks).',
 'Business & Finance', 'Finance Pro Myanmar', '3 months', 220000),

('Digital Marketing Fundamentals',
 'SEO, social media strategy, Google Ads, and analytics.',
 'Business & Finance', 'Digital Growth Academy', '2 months', 180000),

('Entrepreneurship Bootcamp',
 'Business plan, lean startup, pitching, and funding basics.',
 'Business & Finance', 'StartUp Myanmar', '3 months', 250000),

-- Teacher Training
('Primary School Teaching Methods',
 'Child psychology, curriculum design, and classroom management.',
 'Teacher Training', 'National Education Institute', '6 months', 300000),

('Secondary Education Certificate',
 'Subject pedagogy, assessment design, and inclusive teaching.',
 'Teacher Training', 'Teachers Academy Myanmar', '8 months', 350000),

('Special Needs Education',
 'Supporting learners with disabilities, IEPs, and adaptive teaching.',
 'Teacher Training', 'Inclusive Education Center', '4 months', 280000),

-- Languages
('Business English Proficiency',
 'Professional writing, presentations, and IELTS preparation.',
 'Languages', 'English First Myanmar', '3 months', 200000),

('Mandarin for Business',
 'Conversational Mandarin, business vocabulary, and HSK 2 prep.',
 'Languages', 'Sino-Myanmar Language School', '4 months', 240000),

('Japanese Language (JLPT N5-N4)',
 'Hiragana, katakana, kanji basics, and everyday conversation.',
 'Languages', 'Japan Foundation Yangon', '6 months', 260000);

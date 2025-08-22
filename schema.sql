-- images table (stores uploaded image links)
CREATE TABLE IF NOT EXISTS images (
    id SERIAL PRIMARY KEY,
    url TEXT NOT NULL,
    uploaded_at TIMESTAMP DEFAULT NOW()
);

-- predictions table (stores model predictions)
CREATE TABLE IF NOT EXISTS predictions (
    id SERIAL PRIMARY KEY,
    image_id INT REFERENCES images(id) ON DELETE CASCADE,
    disease TEXT NOT NULL,
    confidence NUMERIC(5,2), -- e.g. 92.34
    explanation TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- feedback table (stores user feedback on predictions)
CREATE TABLE IF NOT EXISTS feedback (
    id SERIAL PRIMARY KEY,
    prediction_id INT REFERENCES predictions(id) ON DELETE CASCADE,
    is_correct BOOLEAN NOT NULL,
    notes TEXT,
    submitted_at TIMESTAMP DEFAULT NOW()
);

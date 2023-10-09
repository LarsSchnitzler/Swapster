-- Create the articles table
CREATE TABLE articles (
    article_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    price INTEGER,
    upload_date DATE,
    category VARCHAR(255) NOT NULL,
    user_id INTEGER REFERENCES users(user_id),
);

-- Insert ExampleArticles
INSERT INTO articles (title, price, upload_date, category, user_id)
VALUES 
('', '', '', '', ''),
('', '', '', '', ''),
('', '', '', '', '')
;
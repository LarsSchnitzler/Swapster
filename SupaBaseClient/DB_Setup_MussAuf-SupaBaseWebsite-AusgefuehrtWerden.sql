-- Create the users table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    title INTEGER,
    email VARCHAR(255) NOT NULL
);

-- Create the articles table
CREATE TABLE articles (
    article_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    price INTEGER,
    upload_date DATE,
    category VARCHAR(255) NOT NULL,
    user_id INTEGER REFERENCES users(user_id),
);

-- Insert ExampleUsers
INSERT INTO users (first_name, last_name, title, email)
VALUES 
('Max', 'Muster', 0, 'max@muster.ch'),
('Bax', 'Buster', 1, 'bax@buster.ch'),
('Cax', 'Custer', 2, 'cax@custer.ch')
;

-- Insert ExampleArticles
INSERT INTO articles (title, price, upload_date, category, user_id)
VALUES 
('', '', '', '', ''),
('', '', '', '', ''),
('', '', '', '', '')
;

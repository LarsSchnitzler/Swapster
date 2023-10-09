-- Create the articles table
create table
  articles (
    article_id SERIAL primary key,
    title varchar(255) not null,
    price integer,
    uploadDate DATE,
    imgPath varchar(255) not null,
    user_id integer references users (user_id)
  );

-- Insert ExampleArticles
insert into
  articles (title, price, uploadDate, imgPath, user_id)
values
  (
    'hose',
    '20',
    '2023-10-10',
    './img/test1.jpg',
    '1'
  ),
  (
    'socken',
    '10',
    '2023-07-12',
    './img/test2.jpg',
    '2'
  ),
  (
    'tshirt',
    '15',
    '2023-05-02',
    './img/test3.jpg',
    '3'
  );
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100),
  email VARCHAR(100)
);

CREATE TABLE books (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255),
  user_id INT,
  location VARCHAR(255)
);

CREATE TABLE requests (
  id INT PRIMARY KEY AUTO_INCREMENT,
  book_id INT,
  requester_id INT,
  status VARCHAR(50)
);

CREATE TABLE RpvK48mv_omn_courses (
  id SERIAL PRIMARY KEY,         
  title VARCHAR(255) NOT NULL,   
  slug VARCHAR(255) UNIQUE NOT NULL, 
  school_name varchar(255) not null,
  chapter varchar(32) not null,
  grade varchar(32) not null,
  content TEXT NOT NULL,         
  videoUrl VARCHAR(255),         
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP 
);
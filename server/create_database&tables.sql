create database vacations;

use vacations;

CREATE TABLE outhorization (
  id int NOT NULL AUTO_INCREMENT,
  role varchar(20) DEFAULT NULL,
  PRIMARY KEY (id)
);

insert into outhorization (role)
values ("administrator"),
("user");

CREATE TABLE users (
  id int NOT NULL AUTO_INCREMENT,
  first_name varchar(20) DEFAULT NULL,
  last_name varchar(20) DEFAULT NULL,
  user_name varchar(20) DEFAULT NULL,
  password varchar(200) DEFAULT NULL,
  role_id int DEFAULT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (role_id) REFERENCES outhorization (id)
);

insert into users (first_name, last_name, user_name, password, role_id)
values ("sharon","brown","admin","$2b$10$Iaf.ODSZtEtFIk6Xz.SpJ.Z8/dbIT3c.r3fDDuFmrZP92S0T2MNIq",1),
("Ravid","Brown","dadi","$2b$10$qPQFawPfNLh6ZQLVXJoNS.xZuntOkBZMjHkFer8orT0oeueaB8kXy",2),
("bnaya","brown","benben","$2b$10$QhbgtLTwUj2N/dgSjgkIYOCLvy9Z6k.33yC3x9jCkPgTA/YwjB7MS",2),
("dor","brown","dordor","$2b$10$p6bPj6wWIWCAzwgZ84hwLeVI9pgyIwjinHh0LFfQ.hnv5G6cCVoGe",2),
("maayan","brown","yanyan","$2b$10$0.1RgnZJml4X37EGfDL6cO/GaSqOEATsLHq0Q3jZH7HKqrqVP7SH2",2),
("haggay","brown","gaygay","$2b$10$Dg7N5lmJ8ai9ITVy/wyiyeP62ifXAny/nVvrRRVcFQOfU27NjgKya",2),
("yosi","yosi","yosyos","$2b$10$W3p9fd1ZI4M7WRupfr5/xO/eZYVuGHZWH0.Q/.EKySvk8zktaINZu",2);

CREATE TABLE vacations (
  id int NOT NULL AUTO_INCREMENT,
  destination varchar(20) DEFAULT NULL,
  description text,
  image_link varchar(255) DEFAULT NULL,
  from_date date DEFAULT NULL,
  to_date date DEFAULT NULL,
  price int DEFAULT NULL,
  PRIMARY KEY (id)
);

insert into vacations (destination, description, image_link , from_date , to_date , price)
values ("Venice","The romantic city of Venice is located in the Veneto region of Italy — one of the northernmost states. This ancient and historically important city was originally built on 100 small islands in the Adriatic Sea. Instead or roads, Venice relies on a series of waterways and canals. One of the most famous areas of the city is the world-renowned Grand Canal thoroughfare, which was a major centre of the Renaissance. Another unmistakable area is the central square in Venice, called the Piazza San Marco. This is where you’ll find a range of Byzantine mosaics, the Campanile bell and, of course, the stunning St. Mark’s Basilica.","https://www.italyguides.it/images/gridfolio/venezia/rialto/rialto.05.jpg","2021-05-10","2021-05-15",1200),
("London","There are so many things to do in London! Get started with our guide for first-time visitors. Stay in some of the country's grandest hotels, see some of the best theatre in the world in the West End, or check out one of London's top attractions. Join in one of the many exciting London events happening throughout the year, or take a tour and allow an expert to guide you through the city’s hidden gems.","https://cdn.londonandpartners.com/visit/general-london/areas/river/76709-640x360-houses-of-parliament-and-london-eye-on-thames-from-above-640.jpg","2021-06-01","2021-06-07",2500),
("New York","New York City is still delivering its signature holiday magic. Celebrate this season by supporting local business while saving on attractions, dining, hotels, museums, shopping and more. You’ll get up to $100 back with Mastercard® as you shop gift-worthy deals—just add glad tidings and a sparkly bow.","https://blog-www.pods.com/wp-content/uploads/2019/04/MG_1_1_New_York_City-1.jpg","2020-12-15","2021-01-05",5000),
("Dubai","The sea breeze on your face, sun-kissed warmth on your skin and a heart set on new adventures…can you feel it? Whether you want to make the most of beautiful beaches and spectacular spas, try new outdoor adventures, delve deeper into history or experience the finest Arabian hospitality, our city has thrills for every traveller. You'll have to experience it to believe it. Come and live your story","https://io.telkomuniversity.ac.id/wp-content/uploads/2015/03/Dubai-e1434096715956-1024x522.jpg","2021-01-19","2021-02-09",1500);

CREATE TABLE followers (
  id int NOT NULL AUTO_INCREMENT,
  user_id int DEFAULT NULL,
  vacation_id int DEFAULT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users (id),
  FOREIGN KEY (vacation_id) REFERENCES vacations (id)
);

insert into followers (user_id, vacation_id)
values (2,1),(3,3),(5,1),(6,2),(4,3),(7,3);
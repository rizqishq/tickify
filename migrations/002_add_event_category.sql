CREATE TYPE event_category AS ENUM ('music', 'exhibition', 'theater', 'talkshow', 'sports', 'workshop', 'competition');

ALTER TABLE events 
ADD COLUMN category event_category;

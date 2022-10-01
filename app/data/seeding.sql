BEGIN;

TRUNCATE TABLE "user", "brewery", "category", "event", "brewery_has_category", "participate" RESTART IDENTITY CASCADE;

INSERT INTO "user" ("name", "email", "password", "role") VALUES 
    ('toto', 'toto@gmail.com', '$2y$10$fulWNnn/aBRls33vO0ProuAQy1VQs.fS98qo9ge.FBeR88ukuD6N.', 'user'), -- password: 11111tT/
    ('titi', 'titi@gmail.com', '$2y$10$fulWNnn/aBRls33vO0ProuAQy1VQs.fS98qo9ge.FBeR88ukuD6N.', 'user'), -- password: 11111tT/
    ('tutu', 'tutu@gmail.com', '$2y$10$fulWNnn/aBRls33vO0ProuAQy1VQs.fS98qo9ge.FBeR88ukuD6N.', 'user'), -- password: 11111tT/
    ('tata', 'tata@gmail.com', '$2y$10$fulWNnn/aBRls33vO0ProuAQy1VQs.fS98qo9ge.FBeR88ukuD6N.', 'user') -- password: 11111tT/
;

INSERT INTO "brewery" ("title", "phone", "description", "address", "image", "user_id") VALUES 
    ('title exemple 1', '0000000000', 'description exemple 1', 'adresse exemple 1' , 'lien exemple 1', 1),
    ('title exemple 2', '1111111111', 'description exemple 2', 'adresse exemple 2' , 'lien exemple 2', 2),
    ('title exemple 3', '2222222222', 'description exemple 3', 'adresse exemple 3' , 'lien exemple 3', 3),
    ('title exemple 4', '3333333333', 'description exemple 4', 'adresse exemple 4' , 'lien exemple 4', 4)
;

INSERT INTO "category" ("tag") VALUES 
    ('brune'),
    ('blonde'),
    ('ambrée'),
    ('blanche')
;

INSERT INTO "event" ("title", "description", "event_start", "brewery_id") VALUES 
    ('title exemple 1', 'description exemple 1', '02/01/2023', 1),
    ('title exemple 2', 'description exemple 2', '02/02/2023', 2),
    ('title exemple 3', 'description exemple 3', '02/03/2023', 3),
    ('title exemple 4', 'description exemple 4', '02/04/2023', 4)
;

INSERT INTO "brewery_has_category" ("category_id", "brewery_id") VALUES
    (1, 1),
    (2, 1),
    (3, 2),
    (4, 2),
    (1, 3),
    (3, 3),
    (2, 4),
    (4, 4)
;

INSERT INTO "participate" ("user_id", "event_id") VALUES
    (1, 1),
    (2, 1),
    (3, 2),
    (4, 2),
    (1, 3),
    (3, 3),
    (2, 4),
    (4, 4)
;

COMMIT;
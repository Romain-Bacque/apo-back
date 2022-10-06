BEGIN;

TRUNCATE TABLE "user", "brewery", "category", "event", "brewery_has_category", "participate" RESTART IDENTITY CASCADE;

INSERT INTO "user" ("name", "email", "password", "role") VALUES 
    ('toto', 'toto@gmail.com', '$2y$10$fulWNnn/aBRls33vO0ProuAQy1VQs.fS98qo9ge.FBeR88ukuD6N.', 'user'), -- password: 11111tT/
    ('titi', 'titi@gmail.com', '$2y$10$fulWNnn/aBRls33vO0ProuAQy1VQs.fS98qo9ge.FBeR88ukuD6N.', 'user'), -- password: 11111tT/
    ('tutu', 'tutu@gmail.com', '$2y$10$fulWNnn/aBRls33vO0ProuAQy1VQs.fS98qo9ge.FBeR88ukuD6N.', 'user'), -- password: 11111tT/
    ('tata', 'tata@gmail.com', '$2y$10$fulWNnn/aBRls33vO0ProuAQy1VQs.fS98qo9ge.FBeR88ukuD6N.', 'user') -- password: 11111tT/
;

INSERT INTO "brewery" ("title", "phone", "description", "address", "lat", "lon", "image", "user_id") VALUES 
    ('title exemple 1', '0000000000', 'description exemple 1', '10 Rue Minard, 92130 Issy-les-Moulineaux, France', 48.8237461, 2.2774691, 'lien exemple 1', 1),
    ('title exemple 2', '1111111111', 'description exemple 2', '11 Allée Ausone, 33607 Pessac, France', 44.798599100000004, -0.6139021806866118, 'lien exemple 2', 2),
    ('title exemple 3', '2222222222', 'description exemple 3', '12 Rue Daru, 75008 Paris, France', 48.87761315, 2.3019920220870844, 'lien exemple 3', 3),
    ('title exemple 4', '3333333333', 'description exemple 4', '10 Allee Degas, 95470 Fosses, France', 49.10152045, 2.516020879605858, 'lien exemple 4', 4)
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
    (3, 1),
    (4, 2),
    (1, 3),
    (3, 3),
    (2, 4),
    (4, 4)
;

COMMIT;

BEGIN;

TRUNCATE TABLE "user", "brewery", "category", "event", "brewery_has_category", "participate" RESTART IDENTITY CASCADE;

INSERT INTO "user" ("name", "email", "password", "role") VALUES 
    (''),
    (''),
    (''),
    (''),
    ('')
;

INSERT INTO "brewery" ("title", "phone", "description", "address", "image", "user_id") VALUES 
    (''),
    (''),
    (''),
    (''),
    (''),
    ('')
;

INSERT INTO "category" ("tag") VALUES 
    ('')
;

INSERT INTO "event" ("title", "description", "event_start", "brawery_id") VALUES 
    ('')
;

INSERT INTO "brewery_has_category" ("category_id", "brewery_id") VALUES
    (''),
    ('')
;

INSERT INTO "participate" ("user_id", "event_id") VALUES
    (''),
    ('')
;

COMMIT;
-- Verify bieres:create_table on pg

BEGIN;

SELECT "id", "name", "email", "password", "role", "created_at", "updated_at" FROM "user";
SELECT "id", "title", "phone", "description", "address", "lat", "lon", "image", "created_at", "updated_at" FROM "brewery";
SELECT "id", "tag", "created_at", "updated_at" FROM "category";
SELECT "id", "title", "description", "event_start", "brewery_id", "created_at", "updated_at" FROM "event";
SELECT "category_id", "brewery_id", "created_at", "updated_at" FROM "brewery_has_category";
SELECT "user_id", "event_id", "created_at", "updated_at" FROM "participate";

ROLLBACK;

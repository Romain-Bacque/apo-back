-- Revert bieres:create_table from pg

BEGIN;

DROP TABLE IF EXISTS "user_has_favorite";
DROP TABLE IF EXISTS "brewery_has_category";
DROP TABLE IF EXISTS "participate";
DROP TABLE IF EXISTS "event";
DROP TABLE IF EXISTS "brewery";
DROP TABLE IF EXISTS "category";
DROP TABLE IF EXISTS "user";

COMMIT;

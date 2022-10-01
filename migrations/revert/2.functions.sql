-- Revert bieres:2.functions from pg

BEGIN;

DROP TYPE packed;
DROP VIEW IF EXISTS brewery_records;
DROP FUNCTION IF EXISTS get_brewery_details();
DROP FUNCTION IF EXISTS get_user_breweries();
DROP FUNCTION IF EXISTS insert_brewery();
DROP FUNCTION IF EXISTS update_brewery();

COMMIT;

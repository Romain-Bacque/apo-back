-- Revert bieres:2.functions from pg

BEGIN;

DROP FUNCTION IF EXISTS get_brewery_details(int);
DROP FUNCTION IF EXISTS get_user_breweries(int);
DROP FUNCTION IF EXISTS insert_brewery(json);
DROP FUNCTION IF EXISTS update_brewery(json);
DROP FUNCTION IF EXISTS get_events_details(int);
DROP VIEW IF EXISTS brewery_records;
DROP TYPE packed;
DROP TYPE packed2;

COMMIT;

-- Revert bieres:2.functions from pg

BEGIN;

DROP FUNCTION IF EXISTS get_brewery_details();
DROP FUNCTION IF EXISTS insert_brewery(JSON);
DROP TYPE packed;

COMMIT;

-- Revert bieres:2.functions from pg

BEGIN;

DROP FUNCTION IF EXISTS get_brewery_details(int);
DROP FUNCTION IF EXISTS get_user_breweries(int);
DROP FUNCTION IF EXISTS insert_brewery(json);
DROP FUNCTION IF EXISTS update_brewery(json);
DROP FUNCTION IF EXISTS delete_brewery(int);
DROP FUNCTION IF EXISTS get_user_favorites(int);
DROP FUNCTION IF EXISTS insert_event(json);
DROP FUNCTION IF EXISTS get_events_by_owner(int);
DROP FUNCTION IF EXISTS get_events_by_participant(int);
DROP FUNCTION IF EXISTS get_brewery_events(int);
DROP FUNCTION IF EXISTS set_participant(int, int);
DROP VIEW IF EXISTS brewery_records;
DROP TYPE packed;
DROP TYPE packed2;
DROP TYPE packed3;

COMMIT;

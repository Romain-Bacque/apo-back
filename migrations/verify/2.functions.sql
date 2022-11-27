-- Verify bieres:2.functions on pg

BEGIN;

SELECT "id", "title", "phone", "description", "address", "lat", "lon", "image", "user_id", "categories", "created_at", "updated_at" FROM brewery_records;
SELECT "id", "title", "phone", "description", "address", "lat", "lon", "image", "user_id", "categories", "created_at", "updated_at" FROM get_user_breweries(1);
SELECT "id", "title", "phone", "description", "address", "lat", "lon", "image", "user_id", "categories", "events", "created_at", "updated_at" FROM get_brewery_details(1);
SELECT "id", "title", "phone", "description", "address", "lat", "lon", "image", "user_id", "categories", "created_at", "updated_at" FROM insert_brewery('{
    "title": "titre brasserie",
    "phone": "1212121212",
    "description": "test description",
    "address": "test addresse",
    "lat": "0",
    "lon": "0",
    "image": "{}",
    "user_id": "1",
    "categories": ["1", "2"]
}');
SELECT  "id", "title", "phone", "description", "address", "lat", "lon", "image", "user_id", "categories", "created_at", "updated_at" FROM update_brewery('{
    "id": "1",
    "title": "titre brasserie",
    "phone": "9999999999",
    "description": "test description",
    "address": "test addresse",
    "lat": "0",
    "lon": "0",
    "image": "{}",
    "user_id": "1",
    "categories": ["1", "2"]

}');
SELECT  "id", "title", "phone", "description", "address", "lat", "lon", "image", "user_id", "categories", "created_at", "updated_at" FROM delete_brewery(1);
SELECT * FROM insert_event('{						   
    "title": "titre brasserie",
    "description": "test description",
    "eventStart": "20/02/2022",
    "breweryId": 1,
	"userId": 1										   
}');
SELECT "id", "title", "description", "event_start", "total_participants", "brewery", "created_at", "updated_at" FROM get_events_by_owner(1);
SELECT "id", "title", "description", "event_start", "total_participants", "brewery", "created_at", "updated_at" FROM get_events_by_participant(1);
SELECT "id", "title", "description", "event_start", "participants", "total_participants", "brewery", "created_at", "updated_at" FROM get_brewery_events(1);

ROLLBACK;

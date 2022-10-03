-- Verify bieres:2.functions on pg

BEGIN;

SELECT "id", "title", "phone", "description", "address", "image", "user_id", "categories", "created_at", "updated_at" FROM brewery_records;
SELECT "id", "title", "phone", "description", "address", "image", "user_id", "categories", "created_at", "updated_at" FROM get_user_breweries(1);
SELECT "id", "title", "phone", "description", "address", "image", "user_id", "categories", "events", "created_at", "updated_at" FROM get_brewery_details(1);
SELECT "id", "title", "phone", "description", "address", "image", "user_id", "categories", "created_at", "updated_at" FROM insert_brewery('{
    "title": "titre brasserie",
    "phone": "1212121212",
    "description": "test description",
    "address": "test addresse",
    "image": "lien image",
    "user_id": "1",
    "categories": [
        {
            "id": "1"
        },
        {
            "id": "2"
        }
    ]
}');
SELECT "id", "title", "phone", "description", "address", "image", "user_id", "categories", "created_at", "updated_at" FROM update_brewery('{
    "id": "1",
    "title": "titre brasserie",
    "phone": "9999999999",
    "description": "test description",
    "address": "test addresse",
    "image": "lien image",
    "user_id": "1",
    "categories": [
        {
            "id": "1"
        },
        {
            "id": "2"
        }
    ]
}');
SELECT "id", "title", "description", "event_start", "participants", "brewery", "created_at", "updated_at" FROM get_events_details(1);

ROLLBACK;

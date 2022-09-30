-- Verify bieres:2.functions on pg

BEGIN;

SELECT "id", "title", "phone", "description", "address", "image", "created_at", "updated_at" FROM  get_brewery_details();
SELECT "title", "phone", "description", "address", "image", "categories" from insert_brewery('{
    "title": "titre brasserie",
    "phone": "0000000000",
    "description": "test description",
    "address": "test addresse",
    "image": "lien image",
    "categories": [
        {
            "tag": "brune",
        }
    ]
}');

ROLLBACK;

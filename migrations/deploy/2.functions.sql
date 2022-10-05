-- Deploy bieres:2.functions to pg

BEGIN;

-- Custom types 

-- Avoids the need to create an actual table as the argument or return type of function.
CREATE TYPE packed AS (
    id INT,
    title TEXT,
    phone TEXT,
    description TEXT, 
    address TEXT, 
    image TEXT, 
    user_id INT,
    categories json[],
    events json[],
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
);

-- Views

-- View to get all breweries details
CREATE VIEW brewery_records AS
    SELECT b."id",
        b."title",
        b."phone",
        b."description", 
        b."address", 
        b."image", 
        b."user_id", 
        array_agg(json_build_object(
                'id', c.id,
				'tag', c.tag
            )::json) AS "categories", 
        b."created_at", 
        b."updated_at"
    FROM "brewery" b
            JOIN "brewery_has_category" bc ON bc."brewery_id" = b."id"
            JOIN "category" c ON bc."category_id" = c."id"
	GROUP BY b."id",
        b."title",
        b."phone",
        b."description",
        b."address",
        b."image",
        b."user_id",
        b."created_at",
        b."updated_at";


-- Functions

-- function to get all user's breweries details
CREATE FUNCTION get_user_breweries(userId INT) RETURNS SETOF brewery_records AS $$
    SELECT b."id",
        b."title",
        b."phone",
        b."description", 
        b."address", 
        b."image", 
        b."user_id", 
        array_agg(json_build_object(
                'id', c.id,
				'tag', c.tag
            )::json) AS "categories", 
        b."created_at", 
        b."updated_at"
    FROM "brewery" b
            JOIN "brewery_has_category" bc ON bc."brewery_id" = b."id"
            JOIN "category" c ON bc."category_id" = c."id"
    WHERE b."user_id" = userId
	GROUP BY b."id",
        b."title",
        b."phone",
        b."description",
        b."address",
        b."image",
        b."user_id",
        b."created_at",
        b."updated_at";
$$ LANGUAGE SQL STRICT;

-- function to get details about a specific brewery
CREATE FUNCTION get_brewery_details(breweryId INT) RETURNS SETOF packed AS $$
    SELECT b."id",
        b."title",
        b."phone",
        b."description", 
        b."address", 
        b."image", 
        b."user_id",
        (SELECT array_agg(json_build_object(  
            'id', c.id,
			'tag', c.tag
        )::json) c FROM "category" c WHERE c."id" IN (
            SELECT bc."category_id" FROM "brewery_has_category" bc WHERE bc."brewery_id" = b."id")
        ) AS "categories",
        (SELECT array_agg(json_build_object(
            'id', e.id,
            'title', e.title,
            'description', e.description,
            'event_start', e.event_start
        )::json) FROM "event" e 
        WHERE e."brewery_id" = b."id") AS "events",
        b."created_at", 
        b."updated_at"
    FROM "brewery" b
    WHERE b."id" = breweryId
$$ LANGUAGE SQL STRICT;

-- Function to add a brewery
CREATE FUNCTION insert_brewery(json) RETURNS SETOF brewery_records AS $$
    DECLARE breweryId INT;

    BEGIN

        INSERT INTO "brewery" ("title", "phone", "description", "address", "image", "user_id") VALUES ( 
            ($1 ->> 'title')::text,
            ($1 ->> 'phone')::text,
            ($1 ->> 'description')::text,
            ($1 ->> 'address')::text,
            ($1 ->> 'image')::text,
            ($1 ->> 'user_id')::integer
        )
		RETURNING "brewery"."id" into breweryId;		

        IF(SELECT json_array_length( ( $1 ->> 'categories' )::json ) > 0) THEN
            INSERT INTO "brewery_has_category" ("brewery_id", "category_id")
                SELECT DISTINCT breweryId, category.id
                    FROM (
                        SELECT * FROM json_to_recordset( ( $1 ->> 'categories' )::json ) AS category("id" INT)
                    ) as category;      
		END IF;

		RETURN QUERY
        SELECT * FROM brewery_records;

    END;
$$ LANGUAGE PLPGSQL STRICT;


-- Function to update a specific brewery
CREATE FUNCTION update_brewery(json) RETURNS SETOF packed AS $$
    DECLARE breweryId INT;
    DECLARE ownerId INT;

    BEGIN
	
		SELECT ($1 ->> 'id')::int INTO breweryId;
        SELECT ($1 ->> 'user_id')::int INTO breweryId;

        UPDATE "brewery" SET 
            "title" = ($1 ->> 'title')::text,
            "phone" = ($1 ->> 'phone')::text,
            "description" = ($1 ->> 'description')::text,
            "address" = ($1 ->> 'address')::text,
            "image" = ($1 ->> 'image')::text
        WHERE "brewery"."id" = breweryId AND "brewery"."user_id" = ownerId ;

        DELETE FROM "brewery_has_category"
        WHERE "brewery_has_category"."brewery_id" = breweryId;

        INSERT INTO "brewery_has_category" ("brewery_id", "category_id")
        SELECT breweryId, "category"."category_id"
        FROM (
            SELECT DISTINCT "category"."id" AS category_id
			FROM json_to_recordset( ( $1 ->> 'categories' )::json ) AS "category"("id" INT)
        ) AS "category";
		
		RETURN QUERY
        SELECT * FROM get_brewery_details(breweryId);

    END;
$$ LANGUAGE PLPGSQL STRICT;


COMMIT;

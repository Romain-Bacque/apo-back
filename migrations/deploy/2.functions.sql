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
    lat NUMERIC,
    lon NUMERIC,
    image json, 
    user_id INT,
    categories json[],
    events json[],
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
);

CREATE TYPE packed2 AS (
    id INT,
    title TEXT,
    description TEXT, 
    event_start TIMESTAMPTZ, 
    total_participants BIGINT, 
    brewery json,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
);

CREATE TYPE packed3 AS (
    id INT,
    title TEXT,
    description TEXT, 
    event_start TIMESTAMPTZ,
    participants json[],
    total_participants BIGINT, 
    brewery json,
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
        b."lat",
        b."lon",
        b."image", 
        b."user_id", 
        array_agg(json_build_object(
                'id', c."id",
				'tag', c."tag"
            )::json) AS "categories", 
        b."created_at", 
        b."updated_at"
    FROM "brewery" b
            FULL JOIN "brewery_has_category" bc ON bc."brewery_id" = b."id"
            FULL JOIN "category" c ON bc."category_id" = c."id"
	GROUP BY b."id",
        b."title",
        b."phone",
        b."description",
        b."address",
        b."lat",
        b."lon",
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
        b."lat",
        b."lon", 
        b."image", 
        b."user_id", 
        array_agg(json_build_object(
                'id', c."id",
				'tag', c."tag"
            )::json) AS "categories", 
        b."created_at", 
        b."updated_at"
    FROM "brewery" b
            FULL JOIN "brewery_has_category" bc ON bc."brewery_id" = b."id"
            FULL JOIN "category" c ON bc."category_id" = c."id"
    WHERE b."user_id" = userId
	GROUP BY b."id",
        b."title",
        b."phone",
        b."description",
        b."address",
        b."lat",
        b."lon",
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
        b."lat",
        b."lon", 
        b."image"::json, 
        b."user_id",
        (SELECT array_agg(json_build_object(  
            'id', c."id",
			'tag', c."tag"
        )::json) c FROM "category" c WHERE c."id" IN (
            SELECT bc."category_id" FROM "brewery_has_category" bc WHERE bc."brewery_id" = b."id")
        ) AS "categories",
        (SELECT array_agg(json_build_object(
            'id', e."id",
            'title', e."title",
            'description', e."description",
            'eventStart', e."event_start",
            'totalParticipants', (
                SELECT COUNT("event_id") AS "total_participants"
                FROM "participate" p1
                WHERE p1."event_id" = e."id"
                GROUP BY("event_id")
            )
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

        INSERT INTO "brewery" ("title", "phone", "description", "address", "lat", "lon", "image", "user_id") VALUES ( 
            ($1 ->> 'title')::text,
            ($1 ->> 'phone')::text,
            ($1 ->> 'description')::text,
            ($1 ->> 'address')::text,
            ($1 ->> 'lat')::numeric,
            ($1 ->> 'lon')::numeric,
            ($1 ->> 'image')::json,
            ($1 ->> 'user_id')::integer
        )
		RETURNING "brewery"."id" into breweryId;		

        IF(SELECT json_array_length( ( $1 ->> 'categories' )::json ) > 0) THEN
            INSERT INTO "brewery_has_category" ("brewery_id", "category_id")
                SELECT DISTINCT breweryId, "category".id::integer
                    FROM json_array_elements_text( ( $1 ->> 'categories' )::json ) AS category(id);      
		END IF;

		RETURN QUERY
        SELECT * FROM brewery_records;

    END;
$$ LANGUAGE PLPGSQL STRICT;


-- Function to update a specific brewery
CREATE FUNCTION update_brewery(json) RETURNS SETOF brewery_records AS $$
    DECLARE breweryId INT;
    DECLARE ownerId INT;

    BEGIN
	
		SELECT ($1 ->> 'id')::int INTO breweryId;
        SELECT ($1 ->> 'user_id')::int INTO ownerId;

        UPDATE "brewery" SET 
            "title" = ($1 ->> 'title')::text,
            "phone" = ($1 ->> 'phone')::text,
            "description" = ($1 ->> 'description')::text,
            "address" = ($1 ->> 'address')::text,
            "lat" = ($1 ->> 'lat')::numeric,
            "lon" = ($1 ->> 'lon')::numeric,
            "image" = ($1 ->> 'image')::json
        WHERE "brewery"."id" = breweryId AND "brewery"."user_id" = ownerId ;

        DELETE FROM "brewery_has_category"
        WHERE "brewery_has_category"."brewery_id" = breweryId;

        INSERT INTO "brewery_has_category" ("brewery_id", "category_id")
        SELECT breweryId, "category"."category_id"
        FROM (
            SELECT DISTINCT "category"."id"::integer AS category_id
            FROM json_array_elements_text( ( $1 ->> 'categories' )::json ) AS category(id)
        ) AS "category";		
		
		RETURN QUERY
        SELECT * FROM brewery_records;

    END;
$$ LANGUAGE PLPGSQL STRICT;


-- Function to delete a specific brewery
CREATE FUNCTION delete_brewery(int) RETURNS SETOF brewery_records AS $$
    DECLARE queryResult INTEGER;

    BEGIN
		DELETE FROM brewery WHERE id = $1 returning * into queryResult;
        IF queryResult IS NULL THEN
            RETURN;
        ELSE
            RETURN QUERY
            SELECT * FROM brewery_records;
        END IF;
    END;
$$ LANGUAGE PLPGSQL STRICT;



-- Function add event
CREATE FUNCTION insert_event(json) RETURNS SETOF packed3 AS $$
    DECLARE queryResult INTEGER;

	BEGIN
	
		INSERT INTO event (
				"title",
				"description",
				"event_start",
				"brewery_id")
		VALUES (
			($1 ->> 'title')::text,
			($1 ->> 'description')::text,
			($1 ->> 'eventStart')::timestamptz,
			($1 ->> 'breweryId')::int
			)
		RETURNING * INTO queryResult;
		
	    IF queryResult IS NOT NULL THEN
            RETURN QUERY
			SELECT * FROM get_events_by_owner(($1 ->> 'ownerId')::int);
        ELSE
            RETURN;
		END IF;

	END;

$$ LANGUAGE PLPGSQL STRICT;

-- Function get all events details by owner
CREATE FUNCTION get_events_by_owner(userId INT) RETURNS SETOF packed3 AS $$
    SELECT  e."id",
            e."title",
            e."description",
            e."event_start",
			array_agg(
				json_build_object(
                    'name', u."name",
                    'email', u."email")
			) AS "participants",
            p."total_participants",
            json_build_object(
                    'id', b."id",
                    'address', b."address",
                    'title', b."title") AS "brewery",
            e."created_at", 
            e."updated_at"
    FROM (
        SELECT p2."user_id", p2."event_id", (
            SELECT COUNT("event_id") AS "total_participants"
            FROM "participate" p1
            WHERE p1."event_id" = p2."event_id"
            GROUP BY("event_id")
        )
    FROM "participate" p2) p 
    FULL JOIN "event" e ON e."id" = p."event_id"
    FULL JOIN "brewery" b ON b."id" = e."brewery_id"
    FULL JOIN public."user" u ON u."id" = p."user_id"
    WHERE b."user_id" = userId
	GROUP BY (e."id", p."total_participants", b."id");

$$ LANGUAGE SQL STRICT;


-- Function get all events details by participant
CREATE FUNCTION get_events_by_participant(userId INT) RETURNS SETOF packed2 AS $$
    SELECT  e.id,
            e."title",
            e."description",
            e."event_start",
            p."total_participants",
            json_build_object(
                    'id', b."id",
                    'address', b."address",
                    'title', b."title") AS "brewery",
            e."created_at", 
            e."updated_at"
    FROM (
        SELECT p2."user_id", p2."event_id", (
            SELECT COUNT("event_id") AS "total_participants"
            FROM "participate" p1
            WHERE p1."event_id" = p2."event_id"
            GROUP BY("event_id")
        )
    FROM "participate" p2 WHERE "user_id" = userId) p 
    JOIN event e ON e."id" = p."event_id"
    JOIN "brewery" b ON b."id" = e."brewery_id";
$$ LANGUAGE SQL STRICT;


-- Function get all events details by brewery
CREATE FUNCTION get_brewery_events(breweryId INT) RETURNS SETOF packed3 AS $$
    SELECT  e."id",
            e."title",
            e."description",
            e."event_start",
			array_agg(
				json_build_object(
                    'name', u."name",
                    'email', u."email")
			) AS "participants",
            p."total_participants",
            json_build_object(
                    'id', b."id",
                    'address', b."address",
                    'title', b."title") AS "brewery",
            e."created_at", 
            e."updated_at"
    FROM (
        SELECT p2."user_id", p2."event_id", (
            SELECT COUNT("event_id") AS "total_participants"
            FROM "participate" p1
            WHERE p1."event_id" = p2."event_id"
            GROUP BY("event_id")
        )
    FROM "participate" p2) p 
    JOIN "event" e ON e."id" = p."event_id"
    JOIN "brewery" b ON b."id" = e."brewery_id"
    JOIN public."user" u ON u."id" = p."user_id"
    WHERE b."id" = breweryId
	GROUP BY (e."id", p."total_participants", b."id");

$$ LANGUAGE SQL STRICT;


-- Function to register a participant in an event, by user id and event id
CREATE FUNCTION set_participant(userId INT, eventId INT) RETURNS TABLE("message" text) AS $$
    DECLARE selected_event_id INT;
    DECLARE selected_user_id INT;

    BEGIN
	
		SELECT e."id" FROM public."event" e
		INTO selected_event_id
		WHERE e."id" = eventId
		LIMIT 1; 		
		
		SELECT u."id" FROM public."user" u
		INTO selected_user_id
		WHERE u."id" = userId
		LIMIT 1;		
		
		IF selected_event_id IS NULL OR selected_user_id IS NULL THEN
            RETURN;
		ELSE		
			SELECT "user_id" FROM "participate" p
			INTO selected_user_id
			WHERE p."user_id" = userId AND p."event_id" = eventId
			LIMIT 1;

			IF NOT FOUND THEN
				INSERT INTO "participate" ("user_id", "event_id") VALUES (userId, eventId);
				RETURN QUERY SELECT 'Vous êtes désormais inscrit à cet évènement.'::text;
			ELSE
				RETURN QUERY SELECT 'Vous êtes déjà enregistré à cet évènement.'::text;
			END IF;
		END IF;
		
    END;
$$ LANGUAGE PLPGSQL STRICT;

COMMIT;

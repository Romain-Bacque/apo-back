-- Deploy bieres:2.functions to pg

BEGIN;

-- -- View to get a brewery virtual table with 'category' field added
-- CREATE VIEW brewery_details AS (
--     SELECT b.id,
--         b.title,
--         b.phone,
--         b.description,
--         b.address,
--         b.image,
--         b.user_id,
--         c.tag AS category
--         FROM brewery b
--             JOIN brewery_has_category bc ON bc.brewery_id = b.id
--             JOIN category c ON bc.category_id = c.id
-- );


-- -- Function to get a brewery virtual table with 'categories' field added, that contain list of categories
-- CREATE FUNCTION get_brewery_details() RETURNS SETOF packed AS $$
--     SELECT b."id",
--         b."title",
--         b."description", 
--         b."address", 
--         b."image", 
--         b."user_id", 
--         array_agg(json_build_object(
-- 				'tag', category
--             )) AS "categories", 
--         b."created_at", 
--         b."updated_at"
-- 	FROM "brewery_details" b
-- 	GROUP BY b."id", b."title", b."description", b."address", b."image", b."user_id";
-- $$ LANGUAGE SQL;


-- -- Function to add a brewery
-- CREATE OR REPLACE FUNCTION insert_brewery(json) RETURNS record AS $$

--     DECLARE id_brewery INT;

--     BEGIN

--         INSERT INTO "brewery" ("name") VALUES ( 
--             $1 ->> 'title'::text,
--             $1 ->> 'description'::text,
--             $1 ->> 'address'::text,
--             $1 ->> 'image'::text,
--             $1 ->> 'user_id'::integer
--         ) 
--         RETURNING ("brewery"."id") into id_brewery;

--         INSERT INTO "brewery_has_category" ("brewery_id", "category_id")
--             SELECT id_brewery, recipe.category_id, recipe.quantity
--                 FROM (
--                     SELECT * FROM json_to_recordset( ( $1 ->> 'categories' )::json ) as recipe("category_id" INT, "quantity" INT)
--                 ) as recipe;    

--     END;

-- $$ LANGUAGE PLPGSQL STRICT;


-- CREATE OR REPLACE FUNCTION update_brewery(json) RETURNS SETOF brewery_has_category AS $$

-- DECLARE id_brewery INT;

--     BEGIN

--         UPDATE "brewery" SET "name" = ($1 ->> 'name')::text WHERE "id" = ($1 ->> 'id')::int
--         RETURNING ("brewery"."id") into id_brewery;

--         DELETE FROM "brewery_has_category"
--         WHERE "brewery_has_category"."brewery_id" = id_brewery;

--         RETURN QUERY
--         INSERT INTO "brewery_has_category" ("brewery_id", "category_id", "quantity")
--         SELECT id_brewery, recipe.category_id, recipe.quantity
--         FROM (
--         SELECT * FROM json_to_recordset( ( $1 ->> 'details' )::json ) as recipe("category_id" INT, "quantity" INT)
--         ) as recipe
--         RETURNING "brewery_has_category".*;

--     END;

-- $$ LANGUAGE PLPGSQL STRICT;


COMMIT;

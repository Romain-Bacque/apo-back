-- Deploy bieres:create_table to pg

BEGIN;

CREATE TABLE IF NOT EXISTS "user" (
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL UNIQUE,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS "brewery" (
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "title" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "lat" NUMERIC NOT NULL,
    "lon" NUMERIC NOT NULL,
    "image" TEXT,
    "user_id" INT REFERENCES "user"("id") ON DELETE CASCADE,
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS "category" (
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "tag" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS "event" (
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "event_start" TIMESTAMPTZ NOT NULL,
    "brewery_id" INT REFERENCES "brewery"("id") ON DELETE CASCADE,
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS "brewery_has_category" (
    "category_id" INT NOT NULL REFERENCES "category"("id") ON DELETE CASCADE,
    "brewery_id" INT NOT NULL REFERENCES "brewery"("id") ON DELETE CASCADE,
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS "participate" (
    "user_id" INT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
    "event_id" INT NOT NULL REFERENCES "event"("id") ON DELETE CASCADE,
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ
);

COMMIT;

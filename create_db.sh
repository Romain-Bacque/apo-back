export PGUSER=apo

echo $PGUSER

dropdb apo

createdb apo -O apo

echo "tout va bien"
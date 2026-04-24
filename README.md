# Create react web app with typescipt

 npm create vite@latest

## Backup postgreSQL tables

docker-compose exec postgres pg_dump -U {myRootUser} -t users -t books -t comments --schema-only my-books > db/tables.sql

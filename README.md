# Create react web app with typescipt

 npx create-react-app {myApp} --template typescript

## Backup postgreSQL tables

docker-compose exec postgres pg_dump -U {myRootUser} -t users -t books -t comments --schema-only my-books > db/tables.sql

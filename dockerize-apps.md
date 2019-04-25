# Sonat Chat

Let's use the app we worked with at the previous fagdag.

A few changes:

1. the pouchdb will run in a separate docker container

- `mkdir -p /tmp/pouchdb`
-`docker run -d -p 5984:5984 -v /tmp/pouchdb:/pouchdb --hostname=pouchdb-server --name=pouchdb-server scttmthsn/pouchdb-server`

2. react app for the sonat chat

- `docker build --tag sonat-chat-docker-env:0.01 .`
- `docker run -d -p 8080:80 sonat-chat-docker-env:0.01`

3. another possibility is from sonat-chat directory to run:

- `yarn install`
- `yarn start` 

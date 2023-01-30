# Trajectories of engagement

WIP ...

## Installation

```
npm install
cd client && npm install
```

## Development

### Short way

It assumes you have docker running.

```
npm run dev
```

### Long way

Start a MongoDB (at least 4.0) on the port 27117, either already installed, or you can do so via Docker using:
```
npm run mongo
```

In another shell, run the API server with:
```
npm run start
```


- Client:

In another shell run:

```
cd client
npm run start
```

It will open automatically the website in your browser on `http://localhost:3000`

You can test the API is properly working by calling:
```
curl -H "Content-Type: application/json" -d '{"data": {"TEST": "OK"}}' localhost:4000/answer
curl 'admin:password@localhost:4000/data?json'
```


## Prod deployment with Docker

Build the containers:
```
docker-compose build
```

Or pull prebuilt ones:
```
docker-compose pull
```

Then start the whole website with the credentials and the port of your choice, for instance admin/password and 8000, using:
```
PUBLIC_PORT=8000 MONGO_USER=admin MONGO_PASSWORD=password docker-compose up
```

Or set environment variables definitely by creating a .env file such as the example one and edit it:
```
cp .env{.example,}
```

Then just run (or with -d option for production):
```
docker-compose up
```

The client is then served on `http://localhost:{PUBLIC_PORT}` and the API on `http://localhost:{PUBLIC_PORT}/api/`

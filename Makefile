.PHONY: start stop build clean logs

start:
	docker-compose up -d

stop:
	docker-compose down

build:
	docker-compose build

clean:
	docker-compose down -v

logs:
	docker-compose logs -f

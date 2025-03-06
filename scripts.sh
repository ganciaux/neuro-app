#!/bin/bash

case "$1" in
  start)
    docker-compose up -d
    ;;
  stop)
    docker-compose down
    ;;
  build)
    docker-compose build
    ;;
  build-no-cache)
    docker-compose build --no-cache
    ;;
  clean)
    docker-compose down -v
    ;;
  logs)
    docker-compose logs -f
    ;;
  *)
    echo "Usage: $0 {start|stop|build|clean|logs}"
    exit 1
    ;;
esac

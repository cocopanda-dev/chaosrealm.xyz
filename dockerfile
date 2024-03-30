# Build stage
FROM golang:1.22-alpine3.18 AS builder
WORKDIR /
COPY . .
RUN go build -o main main.go
RUN apk add curl
RUN curl -L https://github.com/golang-migrate/migrate/releases/download/v4.16.2/migrate.linux-amd64.tar.gz | tar xvz

# Run stage
FROM alpine:3.18
WORKDIR /
COPY --from=builder /main .
COPY --from=builder /migrate ./migrate
COPY app.env .
COPY start.sh .
COPY wait-for.sh .
COPY db/migration ./migration

EXPOSE 8080
CMD [ "/main" ]
ENTRYPOINT [ "/start.sh" ]
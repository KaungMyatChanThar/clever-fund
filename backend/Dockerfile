FROM golang:1.22-alpine AS builder

WORKDIR /app

COPY go.mod ./
# -mod=mod lets go resolve and update go.sum during the build
RUN GOFLAGS=-mod=mod go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux GOFLAGS=-mod=mod go build -o server ./cmd

# ── runtime ──────────────────────────────────────────────
FROM alpine:3.19
RUN apk --no-cache add ca-certificates tzdata

WORKDIR /app
COPY --from=builder /app/server .

EXPOSE 8080
CMD ["./server"]

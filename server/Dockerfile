FROM rust:1.72 AS builder

WORKDIR /usr/src/server

# Dependency caching method from https://stackoverflow.com/a/58474618/10499803

RUN echo 'fn main() {}' > dummy.rs
COPY Cargo.toml .
RUN sed -i 's#src/main.rs#dummy.rs#' Cargo.toml
RUN cargo build --release
RUN sed -i 's#dummy.rs#src/main.rs#' Cargo.toml

COPY . .
RUN cargo install --path .

FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
COPY --from=builder /usr/local/cargo/bin/sengenbango-server /usr/local/bin/sengenbango-server

CMD ["sengenbango-server"]

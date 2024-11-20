FROM node:18

RUN apt-get update && apt-get install -y \ 
    && npm install -g ganache

# Launch ganache to compile the smart contract and deploy it on the local blockchain
ENTRYPOINT ["ganache", "-h", "0.0.0.0", "-p", "7545"]

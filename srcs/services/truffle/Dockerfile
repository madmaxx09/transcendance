# Using Node.js as a base image
FROM node:18

# Install Truffle
RUN apt-get update && apt-get install -y \ 
	&& npm install -g truffle

# Working in the app directory
WORKDIR /dapp

# Initiating a truffle project
RUN truffle init

# Configure truffle and create the smart contract
COPY /conf/truffle-config.js truffle-config.js
COPY /contracts/TournamentScores.sol contracts/
COPY /migrations/1_deploy_contracts.js migrations/

COPY /tools/start.sh ../usr/local/bin/

RUN chmod +x ../usr/local/bin/start.sh

# Exhibit no port as it is a utility container
CMD ["../usr/local/bin/start.sh"]

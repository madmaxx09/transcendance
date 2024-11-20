#!/bin/sh
set -e

# Compile and deploy contracts
truffle compile
truffle migrate --network development

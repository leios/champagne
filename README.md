# 🍾 Champagne ! 🍾

Bubble up the outstanding and celebrate the best!

## What is champagne?

Champagne is a voting platform for massive competitions. It implements the [NodeRank](https://github.com/fcrozatier/NodeRank) peer ranking algorithm where people vote by comparing pairs of entries to let the best ones bubble up the surface.

## Features

See [configuration](#configuration) below for details.

- Register creators + entries and judges. Prevent duplicates (only one sign-up per email)
- Vote. Signed up users can vote with their token/link.
- The pairings follow the NodeRank algorithm with the random strategy (the best one). The vote is closed after a certain number of rounds or if a deadline is met.
- Auto cleanup of stale comparisons: if a user is assigned a comparison between entries and does not vote after 24h this is reassigned to someone else.
- Rate limit voting : a user must wait at least 5 minutes between votes
- Deadlines. Sign-up and vote forms are disabled at given dates


## Stack

This project is a [SvelteKit](https://kit.svelte.dev/) app running a [Neo4j](https://neo4j.com/) graph database. To run it locally you need [Neo4j Desktop](https://neo4j.com/developer/neo4j-desktop/?ref=product)

## Configuration

You can use this project by setting a few environment variables in your local `.env` file:

| name                        | value                    | description                         |
| --------------------------- | ------------------------ | ----------------------------------- |
| `PUBLIC_REGISTRATION_START` | "yyyy-mm-ddThh:mm:ssZ"   | string for the registration start   |
| `PUBLIC_REGISTRATION_END`   | "yyyy-mm-ddThh:mm:ssZ"   | string for the registration end     |
| `PUBLIC_VOTE_START`         | "yyyy-mm-ddThh:mm:ssZ"   | string for the voting phase start   |
| `PUBLIC_VOTING_END`         | "yyyy-mm-ddThh:mm:ssZ"   | string for the voting phase end     |
| `PUBLIC_VOTE_DELTA`         | number                   | Time delta between votes in minutes |
| `PUBLIC_RESULTS_AVAILABLE`  | 0 or 1                   | 1 if results are available          |
| `MAX_ROUNDS`                | number                   | Number of rounds to stop the vote   |
| `NEO4J_URI`                 | "neo4j://localhost:7687" | neo4j connection string             |
| `NEO4J_USERNAME`            | string                   | neo4j user                          |
| `NEO4J_PASSWORD`            | string                   | neo4j password                      |

## How to run locally?

1. Install [Neo4j Desktop](https://neo4j.com/developer/neo4j-desktop/?ref=product)
1. Create your local db and install the [APOC procedures](https://neo4j.com/docs/apoc/5/installation/#apoc)
1. Set your environment variables in `.env`
1. Install the packages `npm install`
1. Run the dev server `npm run dev`
1. Visit `localhost:5173/admin` to add the validation constraints to the database and fixtures if you want dummy data

> Note: if you want the background cleanup of old assigned comparisons in dev mode then you need to visit `localhost:5173/admin/db-setup` each time you launch neo4j Desktop since the background job is cleared when you close the db


## License

[MIT](/LICENSE)

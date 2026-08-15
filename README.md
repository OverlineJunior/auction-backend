# User Flow Diagram

![User Flow Diagram](./assets/user-flow-diagram.svg)

# Entity Relationship Diagram

![Entity Relationship Diagram](./assets/entity-relationship-diagram.svg)

# Tech Stack

- **Language:** TypeScript
- **Runtime:** NPM
- **Framework:** Express
- **ORM:** Prisma
- **Database:** PostgreSQL
- **Hosting:** AWS[^1]

[^1]: We'll start with Railway first, then migrate to AWS once the project is ready.

# Roadmap

- [ ] **1. Design**
  - [ ] Draw user flow diagram
  - [ ] Draw entity relationship diagram
- [ ] **2. Architecture Setup**
  - [ ] Define repository interfaces (`UserRepository`, `AuctionRepository`, `BidRepository`)
  - [ ] Implement the repositories with in-memory storage (for early testing)
- [ ] **3. Authentication & Users**
  - [ ] User registration, password hashing and login
  - [ ] Auth middleware
- [ ] **4. Core Business Logic**
  - [ ] Auction creation and listing endpoints
  - [ ] Bidding logic and validation rules
  - [ ] Unit tests for business rules
- [ ] **5. Database Persistence (WIP - unverified AI draft from here onwards)**
  - [ ] Set up PostgreSQL
  - [ ] Apply database schema
  - [ ] Implement SQL/ORM repositories and swap out in-memory classes
- [ ] **6. Concurrency & Integrity**
  - [ ] Database transactions and row locking (`SELECT FOR UPDATE`) for bid placement
  - [ ] Test simultaneous outbid scenarios
- [ ] **7. Background Tasks & Lifecycle**
  - [ ] Scheduled worker to detect expired auctions and assign `winner_id`
- [ ] **8. Integration Testing & Packaging**
  - [ ] Integration tests against the live database
  - [ ] Multi-stage Dockerfile for backend service deployment

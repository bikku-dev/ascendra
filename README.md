# ASCENDRA

### Goal-Driven Expert Guidance Platform

Ascendra is a full-stack mentoring and career guidance platform designed to connect learners with relevant experts based on their goals, skills, experience, and learning requirements.

The platform focuses on more than simply booking a mentor session.

The core journey is:

```text
Goal
  ↓
Skills
  ↓
Skill Gap
  ↓
Expert Discovery
  ↓
Expert Matching
  ↓
Availability
  ↓
Session Booking
  ↓
Payment
  ↓
Mentoring
  ↓
Progress
```

Ascendra is designed to provide a structured environment where learners can define what they want to achieve, discover suitable experts, schedule mentoring sessions, communicate with experts, and manage their learning journey.

---

# Features

## Authentication

Ascendra provides secure authentication and authorization using Spring Security.

Supported authentication functionality includes:

- User registration
- User login
- JWT-based authentication
- Role-based authorization
- Google OAuth2 authentication
- User profile management
- Password management
- User settings
- Authentication provider tracking

The application supports different user roles so that users can access functionality according to their permissions.

---

# User Roles

Ascendra is designed around three primary roles:

### Learner

Learners use Ascendra to:

- Create and manage their profile
- Define career and learning goals
- Add current skills
- Select experience level
- Discover experts
- View expert profiles
- View expert skills
- Check expert availability
- Book mentoring sessions
- Make payments
- View booking information
- Communicate with experts
- View notifications
- Track their learning journey

### Expert

Experts use Ascendra to:

- Create their professional profile
- Define their professional information
- Add skills
- Manage expert skills
- Configure availability
- Manage mentoring sessions
- Work with learners
- Participate in mentoring sessions
- Communicate with learners
- Manage their platform activity

### Admin

The platform architecture supports administrative functionality for managing platform-level resources and users.

Administrative capabilities can include:

- User management
- Expert management
- Skill management
- Booking management
- Payment management
- Platform monitoring
- Role-based administration

---

# Core Platform Modules

The backend follows a modular architecture where different business domains are separated into dedicated packages.

Current backend modules include:

```text
auth
booking
chat
expert
goal
learner
matching
notification
payment
skill
user
zoom
```

This structure keeps business logic organized and makes the application easier to maintain and extend.

---

# Goal Management

Goals are one of the core concepts of Ascendra.

A learner can create and manage goals that represent what they want to achieve.

Goals can be associated with skills so that the platform can understand the relationship between:

```text
Learner Goal
      ↓
Required Skills
      ↓
Current Skills
      ↓
Skill Gap
      ↓
Expert
```

Goal functionality includes:

- Goal creation
- Goal retrieval
- Goal management
- Goal status
- Goal-skill relationships
- Skill requirements associated with goals

---

# Learner Management

The learner module manages learner-specific information and skills.

Learner functionality includes:

- Learner profile
- Experience level
- Learner skills
- Skill management
- Learner information
- Profile updates

The learner module is separated from the general user module so that authentication-related information and learner-specific information remain logically organized.

---

# Expert Management

The expert module manages professional mentor information.

Expert functionality includes:

- Expert profiles
- Professional information
- Expert skills
- Expert availability
- Expert profile management
- Expert skill management
- Expert discovery
- Expert matching

Experts can maintain information that helps learners decide whether an expert is suitable for their requirements.

---

# Expert Availability

Experts can define their availability for mentoring sessions.

Availability management includes:

- Availability creation
- Availability retrieval
- Availability updates
- Day-based availability
- Time-based availability
- Expert-specific availability

The booking system uses expert availability when determining whether a learner can schedule a session.

---

# Expert Matching

Ascendra includes a dedicated mentor matching module.

The matching system is designed to connect learner requirements with relevant experts.

The matching process can consider concepts such as:

- Learner goals
- Learner skills
- Required skills
- Expert skills
- Professional expertise
- Learning requirements

The purpose of matching is to reduce the effort required for learners to find suitable experts.

---

# Expert Discovery

Learners can discover experts through the frontend application.

Expert discovery provides a platform for:

- Searching experts
- Viewing expert profiles
- Filtering experts
- Viewing expert skills
- Comparing available experts
- Checking expert availability
- Starting the booking process

The frontend contains reusable expert-related components such as:

```text
ExpertCard
ExpertFilters
ExpertSearch
ExpertSkeleton
```

These components provide a modular structure for the expert discovery experience.

---

# Booking System

Ascendra includes a dedicated booking module for mentoring sessions.

The booking system handles:

- Booking creation
- Booking information
- Booking status
- Learner bookings
- Expert bookings
- Session scheduling
- Booking validation
- Booking responses

The basic booking flow is:

```text
Learner
   ↓
Select Expert
   ↓
Check Availability
   ↓
Select Session
   ↓
Create Booking
   ↓
Payment
   ↓
Booking Confirmation
```

The backend contains dedicated booking controllers, services, repositories, entities, DTOs and mappers.

---

# Payment Integration

Ascendra integrates Razorpay for online payment processing.

The payment module contains functionality for:

- Creating payment orders
- Processing payment requests
- Payment verification
- Payment status management
- Payment records
- Razorpay integration

Payment flow:

```text
Learner
   ↓
Select Session
   ↓
Create Razorpay Order
   ↓
Complete Payment
   ↓
Verify Payment
   ↓
Update Payment Status
   ↓
Confirm Booking
```

Payment credentials are not stored in source code.

They must be provided through environment variables.

---

# Zoom Meeting Integration

Ascendra includes Zoom integration for online mentoring sessions.

The Zoom module provides functionality for:

- Zoom configuration
- Authentication with Zoom
- Meeting creation
- Meeting information
- Meeting responses
- Online mentoring sessions

The intended mentoring flow is:

```text
Booking
   ↓
Payment Verification
   ↓
Session Confirmation
   ↓
Zoom Meeting
   ↓
Learner + Expert
```

Zoom credentials must be provided through environment variables and must never be committed to GitHub.

---

# Real-Time Chat

Ascendra contains a chat module for communication between learners and experts.

The chat system includes:

- Chat messages
- Chat history
- Message requests
- Message responses
- Chat controllers
- Chat services
- WebSocket configuration

The backend uses WebSocket support for real-time communication.

The communication architecture is:

```text
Learner
   ↕
WebSocket
   ↕
Ascendra Backend
   ↕
WebSocket
   ↕
Expert
```

---

# Notifications

Ascendra contains a notification module.

Notifications can be used to keep users informed about important platform events.

The notification module includes:

- Notification creation
- Notification retrieval
- Notification types
- Notification services
- Notification persistence

Examples of events that can be associated with notifications include:

- Booking updates
- Session updates
- Payment-related events
- Platform activity
- Mentoring-related updates

---

# Skills

Skills are a central part of the Ascendra platform.

Skills can be associated with:

- Learners
- Experts
- Goals

This allows the platform to represent the relationship between a learner's current abilities, target requirements and expert capabilities.

The skill module includes:

- Skill creation
- Skill retrieval
- Skill management
- Skill DTOs
- Skill entities
- Skill repositories
- Skill services

---

# User Management

The user module handles common user-level functionality.

It includes:

- User information
- User profiles
- Roles
- Authentication providers
- User settings
- Password changes
- Profile updates

The user model is separated from learner and expert profiles so that common account information and role-specific information remain organized.

---

# Frontend

The frontend is built using:

- React
- Vite
- JavaScript
- CSS
- Axios
- React Router

The frontend communicates with the Spring Boot backend through REST APIs.

Frontend structure:

```text
ascendra-frontend/
│
├── public/
│
├── src/
│   │
│   ├── assets/
│   │
│   ├── components/
│   │
│   ├── context/
│   │
│   ├── pages/
│   │   ├── learner/
│   │   └── learner/boooking/
│   │
│   └── service/
│
├── Dockerfile
├── package.json
├── package-lock.json
└── vite.config.js
```

---

# Frontend Components

The frontend uses reusable React components to keep the user interface modular.

Current components include:

- ExpertCard
- ExpertFilters
- ExpertSearch
- ExpertSkeleton
- Navbar
- NotificationItem
- SessionCard
- ThemeToggle

The application also contains a theme context for managing theme-related behavior.

---

# Frontend Pages

The frontend contains pages for:

- Home
- Login
- Registration
- OAuth success handling
- Profile
- Learner dashboard
- Learner onboarding
- Expert discovery
- Booking
- Booking success
- Sessions
- Notifications
- Messages
- Payment history

The learner area is organized into dedicated feature sections.

---

# Learner Experience

The learner journey is designed around goals and expert guidance.

A typical learner journey is:

### 1. Create an account

The learner registers or signs in using supported authentication methods.

### 2. Complete profile

The learner provides profile and experience information.

### 3. Define a goal

The learner identifies what they want to achieve.

Examples:

```text
Become a Java Backend Developer
Prepare for Software Engineering Interviews
Learn React
Learn AI/ML
Prepare for System Design
Switch to Cloud Engineering
```

### 4. Add skills

The learner provides their current skills.

### 5. Discover experts

Ascendra presents experts relevant to the learner's requirements.

### 6. Review expert information

The learner can inspect expert profiles, skills and availability.

### 7. Book a session

The learner selects an available session.

### 8. Complete payment

The learner completes payment through Razorpay.

### 9. Attend mentoring session

The session can be conducted through the integrated Zoom workflow.

### 10. Continue the learning journey

The learner can continue interacting with experts, sessions and platform features.

---

# Expert Experience

The expert journey is designed around professional mentoring.

A typical expert journey is:

```text
Register
   ↓
Create Expert Profile
   ↓
Add Skills
   ↓
Configure Availability
   ↓
Receive Learner Bookings
   ↓
Conduct Mentoring Sessions
   ↓
Communicate With Learners
```

Experts can manage their professional information and availability through the platform.

---

# Backend Architecture

The backend is built using Spring Boot and follows a modular layered architecture.

The general structure is:

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
Database
```

DTOs and mappers are used between API and domain layers.

Example:

```text
HTTP Request
     ↓
Controller
     ↓
Request DTO
     ↓
Service
     ↓
Repository
     ↓
PostgreSQL
     ↓
Response
```

---

# Backend Package Structure

```text
ascendra-backend/
│
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── ascendra_backend/
│   │   │
│   │   │   ├── auth/
│   │   │   ├── booking/
│   │   │   ├── chat/
│   │   │   ├── expert/
│   │   │   ├── goal/
│   │   │   ├── learner/
│   │   │   ├── matching/
│   │   │   ├── notification/
│   │   │   ├── payment/
│   │   │   ├── skill/
│   │   │   ├── user/
│   │   │   └── zoom/
│   │   │
│   │   └── resources/
│   │       └── application.properties
│   │
│   └── test/
│
├── Dockerfile
├── pom.xml
├── mvnw
└── mvnw.cmd
```

---

# Security

Security is handled using Spring Security.

The application includes:

- JWT authentication
- Role-based access control
- Google OAuth2
- Protected backend endpoints
- Authentication filters
- User details service
- Secure credential configuration

JWT configuration is supplied through environment variables.

Secrets are intentionally kept outside the source code.

---

# Database

Ascendra uses PostgreSQL as its relational database.

The backend uses:

- Spring Data JPA
- Hibernate
- PostgreSQL JDBC driver

The application uses JPA entities and repositories for database interaction.

Important domain entities include:

```text
User
UserSettings
Role
LearnerProfile
LearnerSkill
ExpertProfile
ExpertSkill
ExpertAvailability
Goal
GoalSkill
Skill
Booking
Payment
ChatMessage
Notification
```

The application uses relationships between these entities to represent the platform's business logic.

---

# Database Relationship Concept

The major relationships can be represented as:

```text
User
 │
 ├── LearnerProfile
 │      │
 │      └── LearnerSkill
 │
 └── ExpertProfile
        │
        ├── ExpertSkill
        │
        └── ExpertAvailability


Learner
   │
   └── Goal
        │
        └── GoalSkill
              │
              ↓
        Expert Matching
              │
              ↓
           Expert
              │
              ↓
           Booking
              │
              ↓
           Payment
              │
              ↓
          Session
```

---

# REST API Architecture

The backend exposes REST APIs for different business modules.

Representative API areas include:

```text
/api/auth
/api/users
/api/experts
/api/learners
/api/goals
/api/skills
/api/bookings
/api/payments
/api/notifications
/api/chat
/api/zoom
```

Authentication APIs include operations such as:

```text
POST /api/auth/register
POST /api/auth/login
```

Expert APIs include operations for:

```text
GET /api/experts
GET /api/experts/{id}
```

Goal APIs include operations for:

```text
POST /api/goals
GET /api/goals/{id}
```

Booking APIs manage session booking operations.

Payment APIs manage Razorpay order creation and payment verification.

The exact available endpoints should be treated as defined by the current backend controllers.

---

# API Communication

The frontend communicates with the backend using HTTP requests.

The frontend contains centralized service modules for different domains:

```text
api.js
authService.js
bookingService.js
chatService.js
expertService.js
learnerService.js
notificationService.js
skillService.js
```

This keeps API communication separated from UI components.

---

# Environment Configuration

Ascendra uses environment variables for sensitive configuration.

The backend expects configuration for:

```text
SPRING_DATASOURCE_URL
SPRING_DATASOURCE_USERNAME
SPRING_DATASOURCE_PASSWORD

RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET

ZOOM_ACCOUNT_ID
ZOOM_CLIENT_ID
ZOOM_CLIENT_SECRET

JWT_SECRET

GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
```

Never commit actual values for these variables to GitHub.

Use a local `.env` file for development and secure environment configuration in production.

---

# Running Locally

## Prerequisites

Install the following:

- Java 21
- Maven
- Node.js
- npm
- Docker
- Git
- PostgreSQL-compatible database
- Required third-party service credentials

---

# Backend Setup

Move into the backend directory:

```bash
cd ascendra-backend
```

Build the backend:

```bash
mvnw.cmd clean package -DskipTests
```

On Linux/macOS:

```bash
./mvnw clean package -DskipTests
```

Run the application:

```bash
java -jar target/*.jar
```

The backend runs on:

```text
http://localhost:8080
```

---

# Frontend Setup

Move into the frontend directory:

```bash
cd ascendra-frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The Vite development server normally runs on:

```text
http://localhost:5173
```

---

# Docker

Ascendra supports containerized deployment.

Both backend and frontend have their own Dockerfiles.

## Backend Docker Image

Build the backend image:

```bash
docker build -t ascendra-backend ./ascendra-backend
```

Run the backend container:

```bash
docker run -d \
  --name ascendra-backend \
  -p 8080:8080 \
  --env-file ./ascendra-backend/.env \
  ascendra-backend
```

---

# Frontend Docker Image

Build the frontend image:

```bash
docker build -t ascendra-frontend ./ascendra-frontend
```

Run the frontend container:

```bash
docker run -d \
  --name ascendra-frontend \
  -p 3000:80 \
  ascendra-frontend
```

The containerized frontend can then be accessed at:

```text
http://localhost:3000
```

---

# Docker Architecture

The containerized application can be represented as:

```text
                 Internet / Browser
                        │
                        ↓
             ┌────────────────────┐
             │ Ascendra Frontend  │
             │   React + Nginx    │
             │      Port 3000     │
             └─────────┬──────────┘
                       │
                       │ HTTP / REST
                       ↓
             ┌────────────────────┐
             │ Ascendra Backend   │
             │    Spring Boot     │
             │      Port 8080     │
             └─────────┬──────────┘
                       │
          ┌────────────┼────────────┐
          │            │            │
          ↓            ↓            ↓
      PostgreSQL    Razorpay      Zoom
       Database     Payments     Meetings
```

---

# Production Deployment

Ascendra is designed to be containerized and deployed using Docker.

A production architecture can use:

```text
GitHub
   ↓
Docker Build
   ↓
Container Registry
   ↓
AWS / Cloud Server
   ↓
Docker Containers
   ├── Frontend
   └── Backend
```

The database and external integrations remain separate from the application containers.

Production secrets should be configured through the hosting platform's environment/secret management system.

---

# AWS Deployment Architecture

The project can be deployed on AWS using an EC2-based Docker architecture.

Example:

```text
                    AWS
                     │
                     ↓
                  EC2
                     │
          ┌──────────┴──────────┐
          │                     │
          ↓                     ↓
  Frontend Container     Backend Container
       Nginx                Spring Boot
      Port 80                Port 8080
          │                     │
          └──────────┬──────────┘
                     │
                     ↓
                 Supabase
                PostgreSQL
```

A reverse proxy can later be introduced to expose the application through a single domain and HTTPS.

---

# GitHub Repository Structure

Ascendra is maintained as a monorepo.

```text
ascendra/
│
├── ascendra-backend/
│
├── ascendra-frontend/
│
├── README.md
│
└── .gitignore
```

Keeping frontend and backend in a single repository makes it easier to manage the complete application as one product.

---

# CI/CD

Ascendra can be integrated with CI/CD workflows.

A typical deployment pipeline is:

```text
Developer
    ↓
Git Commit
    ↓
GitHub
    ↓
CI
    ├── Install dependencies
    ├── Build backend
    ├── Build frontend
    ├── Run tests
    └── Build Docker images
    ↓
Container Registry
    ↓
Deployment Server
    ↓
Live Application
```

Docker provides a consistent runtime environment between development, CI and deployment environments.

---

# Project Design Principles

Ascendra follows these principles:

### Modular Architecture

Business domains are separated into dedicated modules.

### Separation of Concerns

Controllers, services, repositories, DTOs, entities and mappers have separate responsibilities.

### Reusable Frontend Components

Common UI functionality is implemented using reusable React components.

### Centralized API Communication

Frontend API communication is organized into dedicated service modules.

### Secure Configuration

Sensitive credentials are stored outside the source code.

### Containerization

Backend and frontend can run independently inside Docker containers.

### Scalability

The modular structure allows additional features to be introduced without restructuring the entire application.

---

# Error Handling

The backend is designed around structured API communication and validation.

Important application errors can include:

- Invalid authentication
- Unauthorized access
- Resource not found
- Invalid request data
- Booking conflicts
- Payment failures
- Invalid payment verification
- Availability conflicts
- Server-side errors

The goal is to provide predictable API behavior for the frontend.

---

# Booking and Payment Consistency

Booking and payment are closely related business operations.

The intended flow is:

```text
Create Booking
      ↓
Create Payment Order
      ↓
Payment Completed
      ↓
Payment Verified
      ↓
Booking Confirmed
```

The system must prevent problems such as:

- Double booking
- Duplicate payment processing
- Invalid booking access
- Incorrect payment state
- Booking without successful payment verification

---

# Frontend UI

The frontend is designed as a modern career and mentoring platform rather than a generic dashboard.

The UI focuses on:

- Clear navigation
- Responsive layouts
- Learner-focused dashboards
- Expert discovery
- Booking experience
- Payment flow
- Session management
- Notifications
- Profile management
- Light/dark theme support

The design direction emphasizes the product concept:

```text
Goal-driven expert guidance
```

rather than simply presenting a marketplace for sessions.

---

# Responsive Design

The application is designed to support:

- Desktop
- Tablet
- Mobile

The UI should provide appropriate layouts for different screen sizes instead of simply shrinking the desktop interface.

Important mobile flows include:

- Expert discovery
- Booking
- Payment
- Session management
- Profile management
- Navigation

---

# Project Directory

```text
ascendra/
│
├── ascendra-backend/
│   │
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── ascendra_backend/
│   │   │   │       ├── auth/
│   │   │   │       ├── booking/
│   │   │   │       ├── chat/
│   │   │   │       ├── expert/
│   │   │   │       ├── goal/
│   │   │   │       ├── learner/
│   │   │   │       ├── matching/
│   │   │   │       ├── notification/
│   │   │   │       ├── payment/
│   │   │   │       ├── skill/
│   │   │   │       ├── user/
│   │   │   │       └── zoom/
│   │   │   │
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   │
│   │   └── test/
│   │
│   ├── Dockerfile
│   ├── pom.xml
│   ├── mvnw
│   └── mvnw.cmd
│
├── ascendra-frontend/
│   │
│   ├── public/
│   │
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── service/
│   │
│   ├── Dockerfile
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
├── README.md
└── .gitignore
```

---

# Technology Stack

## Backend

- Java 21
- Spring Boot
- Spring Security
- Spring Data JPA
- Hibernate
- REST APIs
- JWT
- OAuth2
- WebSocket
- Maven

## Frontend

- React
- Vite
- JavaScript
- HTML5
- CSS3
- Axios
- React Router

## Database

- PostgreSQL
- JPA
- Hibernate

## Integrations

- Razorpay
- Zoom
- Google OAuth2

## DevOps

- Git
- GitHub
- Docker
- Docker Compose compatible architecture
- AWS deployment
- CI/CD ready architecture

---

# Development Workflow

Recommended development workflow:

```text
1. Develop feature
      ↓
2. Test locally
      ↓
3. Build backend/frontend
      ↓
4. Test Docker containers
      ↓
5. Commit changes
      ↓
6. Push to GitHub
      ↓
7. CI/CD
      ↓
8. Deploy
```

---

# Security Guidelines

Never commit the following to GitHub:

```text
.env
API keys
Database passwords
JWT secrets
Razorpay secrets
Zoom client secrets
Google OAuth client secrets
Private credentials
```

Use environment variables instead.

Example:

```text
SPRING_DATASOURCE_PASSWORD=<your-secret>
JWT_SECRET=<your-secret>
RAZORPAY_KEY_SECRET=<your-secret>
ZOOM_CLIENT_SECRET=<your-secret>
GOOGLE_CLIENT_SECRET=<your-secret>
```

The actual values must only exist in the local environment or secure production secret storage.

---

# Testing

The backend contains a test structure under:

```text
src/test/
```

Before production deployment, the recommended testing process is:

```text
Unit Tests
    ↓
Integration Tests
    ↓
API Testing
    ↓
Docker Testing
    ↓
Production Deployment
```

---

# Future Improvements

The architecture allows the following improvements to be added as the platform evolves:

- Advanced expert recommendation algorithms
- Improved mentor matching
- Skill assessment system
- Skill-gap analytics
- Progress analytics
- Challenge management
- Mentor feedback workflows
- Reviews and ratings
- Advanced notifications
- Improved messaging
- Redis caching
- Advanced WebSocket functionality
- Analytics dashboards
- Admin analytics
- Coupons
- Refund management
- Audit logging
- Production monitoring
- Automated CI/CD deployment
- HTTPS and custom domain
- Cloud-native deployment

---

# Product Vision

Ascendra is not intended to be just another online course platform or generic mentor marketplace.

The product is built around a different idea:

> Connect a learner's goal with the right expert and turn mentoring into measurable progress.

The long-term product journey is:

```text
Goal
  ↓
Understand Current Level
  ↓
Identify Skill Gaps
  ↓
Find Relevant Expert
  ↓
Book Focused Session
  ↓
Learn
  ↓
Practice
  ↓
Get Feedback
  ↓
Track Progress
  ↓
Achieve Goal
```

---

# Why Ascendra?

Traditional learning platforms often provide large amounts of content but may not provide personalized guidance.

Generic marketplaces allow users to find service providers but may not be structured around long-term learning goals.

Ascendra combines:

```text
Goal Management
+
Skill Management
+
Expert Discovery
+
Expert Matching
+
Availability
+
Booking
+
Payments
+
Mentoring
+
Communication
+
Progress-oriented Learning
```

This creates a goal-oriented mentoring experience.

---

# Current Project Status

Ascendra is under active development.

The current codebase contains working foundations for:

- Authentication
- JWT security
- Google OAuth2
- User management
- Learner profiles
- Learner skills
- Expert profiles
- Expert skills
- Expert availability
- Goals
- Goal skills
- Expert matching
- Booking
- Payments
- Razorpay integration
- Chat
- WebSocket configuration
- Notifications
- Zoom integration
- React frontend
- Dockerized backend
- Dockerized frontend

Additional modules and production hardening can continue to be developed as the platform evolves.

---

# Getting Started

Clone the repository:

```bash
git clone https://github.com/bikku-dev/ascendra.git
```

Enter the project:

```bash
cd ascendra
```

Backend:

```bash
cd ascendra-backend
mvnw.cmd clean package
```

Frontend:

```bash
cd ../ascendra-frontend
npm install
npm run dev
```

For Docker:

```bash
docker build -t ascendra-backend ./ascendra-backend
docker build -t ascendra-frontend ./ascendra-frontend
```

Configure all required environment variables before starting the backend.

---

# Application Ports

| Service | Port |
|---|---:|
| React/Vite Development Server | 5173 |
| Frontend Docker/Nginx | 3000 |
| Spring Boot Backend | 8080 |

---

# Repository

GitHub:

```text
https://github.com/bikku-dev/ascendra
```

---

# Author

### Bikku Kushwaha

Full Stack Java Developer

GitHub:

```text
https://github.com/bikku-dev
```

LinkedIn:

```text
https://www.linkedin.com/in/bikku-kushwaha-6730902a3
```

---

# License

This project is currently maintained as a personal development project.

If this repository is later released publicly as an open-source project, an explicit open-source license should be added here.

---

# Ascendra

### Your next level starts with the right expert.

```text
Set the Goal.
Find the Gap.
Meet the Expert.
Make Progress.
```

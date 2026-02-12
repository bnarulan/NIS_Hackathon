-- Migration placeholder
-- Initial schema

CREATE TYPE "Role" AS ENUM ('RESIDENT', 'CONTRACTOR', 'CONTROLLER');
CREATE TYPE "PostStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'DONE');
CREATE TYPE "PointsType" AS ENUM ('LIKE', 'COMMENT', 'CLOSE');

CREATE TABLE "User" (
  "id" SERIAL PRIMARY KEY,
  "iin" TEXT NOT NULL UNIQUE,
  "passwordHash" TEXT NOT NULL,
  "role" "Role" NOT NULL,
  "points" INT NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE "Post" (
  "id" SERIAL PRIMARY KEY,
  "userId" INT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "category" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "lat" DOUBLE PRECISION,
  "lng" DOUBLE PRECISION,
  "photoUrl" TEXT,
  "dangerLevel" INT NOT NULL DEFAULT 1,
  "locationWeight" INT NOT NULL DEFAULT 5,
  "priorityScore" INT NOT NULL DEFAULT 0,
  "status" "PostStatus" NOT NULL DEFAULT 'OPEN',
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "assignedContractorId" INT REFERENCES "User"("id") ON DELETE SET NULL
);

CREATE INDEX "Post_status_idx" ON "Post"("status");

CREATE TABLE "Comment" (
  "id" SERIAL PRIMARY KEY,
  "text" TEXT NOT NULL,
  "userId" INT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "postId" INT NOT NULL REFERENCES "Post"("id") ON DELETE CASCADE,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT "Comment_user_post_unique" UNIQUE ("userId", "postId")
);

CREATE TABLE "Like" (
  "id" SERIAL PRIMARY KEY,
  "userId" INT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "postId" INT NOT NULL REFERENCES "Post"("id") ON DELETE CASCADE,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT "Like_user_post_unique" UNIQUE ("userId", "postId")
);

CREATE TABLE "ContractorReport" (
  "id" SERIAL PRIMARY KEY,
  "postId" INT NOT NULL UNIQUE REFERENCES "Post"("id") ON DELETE CASCADE,
  "contractorId" INT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "beforePhotoUrl" TEXT,
  "afterPhotoUrl" TEXT,
  "startedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "completedAt" TIMESTAMP,
  "durationSeconds" INT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE "SLA" (
  "id" SERIAL PRIMARY KEY,
  "postId" INT NOT NULL UNIQUE REFERENCES "Post"("id") ON DELETE CASCADE,
  "contractorId" INT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "targetHours" INT NOT NULL DEFAULT 24,
  "breached" BOOLEAN NOT NULL DEFAULT FALSE,
  "resolvedAt" TIMESTAMP,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE "PointsLog" (
  "id" SERIAL PRIMARY KEY,
  "userId" INT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "postId" INT REFERENCES "Post"("id") ON DELETE SET NULL,
  "type" "PointsType" NOT NULL,
  "points" INT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);
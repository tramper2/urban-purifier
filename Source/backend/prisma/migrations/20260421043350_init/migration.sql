-- CreateEnum
CREATE TYPE "TileState" AS ENUM ('POLLUTED', 'CLEANSED', 'BUILDING');

-- CreateEnum
CREATE TYPE "BuildingType" AS ENUM ('RESIDENTIAL', 'POWER_PLANT', 'RADAR', 'PURIFIER_TOWER');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" TEXT,
    "provider" TEXT NOT NULL DEFAULT 'guest',
    "providerId" TEXT,
    "totalEnergy" INTEGER NOT NULL DEFAULT 100,
    "hp" INTEGER NOT NULL DEFAULT 100,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSavedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game_sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "width" INTEGER NOT NULL DEFAULT 20,
    "height" INTEGER NOT NULL DEFAULT 20,
    "pollutantCount" INTEGER NOT NULL DEFAULT 30,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "game_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "map_tiles" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "x" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,
    "isPollutant" BOOLEAN NOT NULL DEFAULT false,
    "adjacentCount" INTEGER NOT NULL DEFAULT 0,
    "state" "TileState" NOT NULL DEFAULT 'POLLUTED',
    "buildingId" TEXT,
    "revealedAt" TIMESTAMP(3),

    CONSTRAINT "map_tiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "buildings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tileId" TEXT NOT NULL,
    "type" "BuildingType" NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "productionRate" INTEGER NOT NULL DEFAULT 10,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "buildings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "map_tiles_buildingId_key" ON "map_tiles"("buildingId");

-- CreateIndex
CREATE INDEX "map_tiles_sessionId_x_y_idx" ON "map_tiles"("sessionId", "x", "y");

-- CreateIndex
CREATE UNIQUE INDEX "map_tiles_sessionId_x_y_key" ON "map_tiles"("sessionId", "x", "y");

-- CreateIndex
CREATE UNIQUE INDEX "buildings_tileId_key" ON "buildings"("tileId");

-- AddForeignKey
ALTER TABLE "game_sessions" ADD CONSTRAINT "game_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "map_tiles" ADD CONSTRAINT "map_tiles_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "game_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "buildings" ADD CONSTRAINT "buildings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "buildings" ADD CONSTRAINT "buildings_tileId_fkey" FOREIGN KEY ("tileId") REFERENCES "map_tiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

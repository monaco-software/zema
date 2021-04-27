-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'THEME_MANAGER');

-- CreateTable
CREATE TABLE "Theme" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "icon" VARCHAR(4096) NOT NULL,
    "data" JSONB NOT NULL,
    "dark" BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL,
    "role" "Role" NOT NULL DEFAULT E'USER',
    "themeId" INTEGER NOT NULL DEFAULT 1,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Theme.name_unique" ON "Theme"("name");

-- AddForeignKey
ALTER TABLE "User" ADD FOREIGN KEY ("themeId") REFERENCES "Theme"("id") ON DELETE CASCADE ON UPDATE CASCADE;

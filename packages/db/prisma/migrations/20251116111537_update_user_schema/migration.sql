-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isFriendNotificationOn" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isGroupInvitationNotificationOn" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isMessageNotificationOn" BOOLEAN NOT NULL DEFAULT true;

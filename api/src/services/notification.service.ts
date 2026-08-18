import { notificationRepository } from "../repositories/notification.repository";
import { ApiError } from "../utils/api-error";
import { parseBoolean } from "../utils/helpers";

export const notificationService = {
  create(params: { userId: number; type: string; title: string; message: string }) {
    return notificationRepository.create({
      user: { connect: { id: params.userId } },
      type: params.type,
      title: params.title,
      message: params.message,
    });
  },

  async list(userId: number, page: number, limit: number, unread?: string) {
    const isUnread = parseBoolean(unread);
    const where = {
      userId,
      ...(isUnread === undefined ? {} : { isRead: isUnread }),
    };
    const [total, notifications] = await Promise.all([
      notificationRepository.count(where),
      notificationRepository.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        select: { id: true, type: true, title: true, message: true, isRead: true, createdAt: true },
      }),
    ]);
    return { notifications, total };
  },

  async markRead(userId: number, id: number) {
    const notification = await notificationRepository.findById(id);
    if (!notification || notification.userId !== userId) {
      throw ApiError.notFound();
    }
    if (!notification.isRead) {
      await notificationRepository.update(id, { isRead: true });
    }
    return { id, isRead: true };
  },

  async markAllRead(userId: number): Promise<number> {
    const result = await notificationRepository.updateMany(
      { userId, isRead: false },
      { isRead: true }
    );
    return result.count;
  },
};

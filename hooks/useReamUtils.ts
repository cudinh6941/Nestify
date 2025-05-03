// hooks/useRealmUtils.ts
import { useCallback } from "react";
import { useRealm } from "@/Context/RealmProvider";
import { BSON } from "realm";

/**
 * Hook cung cấp các utility functions để làm việc với Realm
 */
export const useRealmUtils = () => {
  const realm = useRealm();

  /**
   * Tạo UUID mới
   */
  const generateUUID = useCallback(() => {
    return new BSON.UUID().toHexString();
  }, []);

  /**
   * Thực hiện transaction với Realm
   */
  const performTransaction = useCallback(
    <T>(operation: () => T): T => {
      let result: T;
      realm.write(() => {
        result = operation();
      });
      return result!;
    },
    [realm]
  );

  /**
   * Tạo entity mới với các giá trị mặc định
   */
  const createEntity = useCallback(
    <T extends object>(
      schema: string,
      data: T & { id?: string; createdAt?: Date; updatedAt?: Date }
    ) => {
      return performTransaction(() => {
        const now = new Date();
        return realm.create(schema, {
          id: data.id || generateUUID(),
          createdAt: data.createdAt || now,
          updatedAt: data.updatedAt || now,
          ...data,
        });
      });
    },
    [performTransaction, generateUUID, realm]
  );

  /**
   * Cập nhật entity
   */
  const updateEntity = useCallback(
    <T extends object>(schema: string, id: string, data: Partial<T>) => {
      return performTransaction(() => {
        const entity = realm.objectForPrimaryKey(schema, id);
        if (!entity) {
          throw new Error(`${schema} with id ${id} not found`);
        }

        Object.assign(entity, {
          ...data,
          updatedAt: new Date(),
        });

        return entity;
      });
    },
    [performTransaction, realm]
  );

  /**
   * Xóa entity
   */
  const deleteEntity = useCallback(
    (schema: string, id: string) => {
      return performTransaction(() => {
        const entity = realm.objectForPrimaryKey(schema, id);
        if (!entity) {
          throw new Error(`${schema} with id ${id} not found`);
        }

        realm.delete(entity);
      });
    },
    [performTransaction, realm]
  );

  /**
   * Xóa nhiều entities
   */
  const deleteEntities = useCallback(
    (schema: string, ids: string[]) => {
      return performTransaction(() => {
        ids.forEach((id) => {
          const entity = realm.objectForPrimaryKey(schema, id);
          if (entity) {
            realm.delete(entity);
          }
        });
      });
    },
    [performTransaction, realm]
  );

  /**
   * Lấy entity theo id
   */

  const getEntityById = useCallback(
    <T>(schema: string, id: string): T | null => {
      return realm.objectForPrimaryKey<T>(schema, id as any);
    },
    [realm]
  );

  /**
   * Lấy tất cả entities của một schema
   */
  const getAllEntities = useCallback(
    <T>(schema: string) => {
      return realm.objects<T>(schema);
    },
    [realm]
  );

  /**
   * Lấy entities theo filter
   */
  const getEntitiesByFilter = useCallback(
    <T>(schema: string, filterQuery: string, ...args: any[]) => {
      return realm.objects<T>(schema).filtered(filterQuery, ...args);
    },
    [realm]
  );

  /**
   * Lấy entities thuộc về một user
   */
  const getUserEntities = useCallback(
    <T>(schema: string, userId: string) => {
      return realm.objects<T>(schema).filtered("userId == $0", userId);
    },
    [realm]
  );

  /**
   * Tạo hoạt động (activity)
   */
  const createActivity = useCallback(
    (
      userId: string,
      activityType: string,
      description: string,
      relatedTo?: string,
      relatedId?: string
    ) => {
      return createEntity("Activity", {
        userId,
        activityType,
        description,
        relatedTo,
        relatedId,
        timestamp: new Date(),
      });
    },
    [createEntity]
  );

  /**
   * Tạo thông báo (notification)
   */
  const createNotification = useCallback(
    (
      userId: string,
      title: string,
      message: string,
      type: string,
      relatedTo?: string,
      relatedId?: string
    ) => {
      return createEntity("Notification", {
        userId,
        title,
        message,
        type,
        read: false,
        relatedTo,
        relatedId,
      });
    },
    [createEntity]
  );

  /**
   * Đánh dấu thông báo đã đọc
   */
  //   const markNotificationAsRead = useCallback(
  //     (notificationId: string) => {
  //       return updateEntity("Notification", notificationId, { read: true });
  //     },
  //     [updateEntity]
  //   );

  /**
   * Tạo bản ghi chăm sóc
   */
  const createCareRecord = useCallback(
    (
      userId: string,
      entityType: string,
      entityId: string,
      careType: string,
      notes?: string,
      cost?: number,
      performedBy?: string
    ) => {
      return createEntity("CareRecord", {
        userId,
        entityType,
        entityId,
        careType,
        timestamp: new Date(),
        notes,
        cost,
        performedBy,
      });
    },
    [createEntity]
  );

  return {
    realm,
    generateUUID,
    performTransaction,
    createEntity,
    updateEntity,
    deleteEntity,
    deleteEntities,
    getEntityById,
    getAllEntities,
    getEntitiesByFilter,
    getUserEntities,
    createActivity,
    createNotification,
    // markNotificationAsRead,
    createCareRecord,
  };
};

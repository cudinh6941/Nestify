import { createRealmContext } from "@realm/react";
import Realm from "realm";
import {
  UserSchema,
  EntitySchema,
  CareRecordSchema,
  NotificationSchema,
  ActivitySchema,
  NotificationRuleSchema,
  TaskSchema,
} from "@/Schema/schema";

export const { RealmProvider, useRealm, useObject, useQuery } =
  createRealmContext({
    schema: [
      UserSchema,
      EntitySchema,
      CareRecordSchema,
      NotificationSchema,
      ActivitySchema,
      NotificationRuleSchema,
      TaskSchema,
    ] as Realm.ObjectSchema[],
    schemaVersion: 1,
  });

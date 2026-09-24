export type CreateAuthUserProps = {
  userId: string;
  password: string;
};

export type fromPersistentAuthUserProps = {
  id: string;
  userId: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
};

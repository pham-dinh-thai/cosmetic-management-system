export type CreateDepartmentProps = {
  code: string;
  name: string;
  managerId?: string;
};

export type FromPersistentDepartmentProps = {
  id: string;
  code: string;
  name: string;
  managerId?: string;
};

export type UpdateDepartmentProps = {
  code: string;
  name: string;
};

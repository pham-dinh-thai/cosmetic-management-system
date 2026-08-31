import { Department } from '../../domain/department.aggregate';
import { Department as DepartmentMikro } from '../entities/department.entity';

export class DepartmentsMapper {
  public static toDomain(departmentMikro: DepartmentMikro): Department {
    return Department.fromPersistent({
      id: departmentMikro.id,
      code: departmentMikro.code,
      name: departmentMikro.name,
      managerId: departmentMikro.managerId ?? undefined,
    });
  }

  public static toMikro(department: Department): DepartmentMikro {
    const departmentMikro = new DepartmentMikro();

    if (department.getId()) {
      departmentMikro.id = department.getId();
    }
    departmentMikro.code = department.getCode();
    departmentMikro.name = department.getName();
    departmentMikro.isActive = department.getIsActive();
    departmentMikro.managerId = department.getManagerId();

    return departmentMikro;
  }
}

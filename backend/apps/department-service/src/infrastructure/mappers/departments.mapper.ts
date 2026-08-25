import { Department } from '../../domain/department.aggregate';
import { DepartmentReadModel } from '../../domain/read-models/department.read-model';
import { Department as DepartmentMikro } from '../entities/department.entity';

export class DepartmentsMapper {
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

  public static toReadModel(
    departmentMikro: DepartmentMikro,
  ): DepartmentReadModel {
    return new DepartmentReadModel(
      departmentMikro.id,
      departmentMikro.code,
      departmentMikro.name,
      departmentMikro.isActive,
      departmentMikro.managerId,
    );
  }
}

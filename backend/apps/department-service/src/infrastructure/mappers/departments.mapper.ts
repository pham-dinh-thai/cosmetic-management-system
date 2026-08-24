import { Department } from '../../domain/department.aggregate';
import { Department as DepartmentMikro } from '../entities/department.entity';

export class DepartmentsMapper {
  public static toMikro(department: Department): DepartmentMikro {
    const departmentMikro = new DepartmentMikro();

    departmentMikro.id = department.getId();
    departmentMikro.code = department.getCode();
    departmentMikro.name = department.getName();
    departmentMikro.isActive = department.getIsActive();
    departmentMikro.managerId = department.getManagerId();

    return departmentMikro;
  }
}

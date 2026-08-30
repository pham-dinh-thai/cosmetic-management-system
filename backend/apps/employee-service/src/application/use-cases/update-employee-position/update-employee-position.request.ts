import { Position } from 'apps/employee-service/src/domain/enums/position.enum';

export interface IUpdateEmployeePositionRequest {
  position: Position;
}

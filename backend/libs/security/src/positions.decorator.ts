import { SetMetadata } from '@nestjs/common';
import { Position } from './position.enum';

export const POSITIONS_KEY = 'positions';

export const Positions = (...positions: Position[]) =>
  SetMetadata(POSITIONS_KEY, positions);

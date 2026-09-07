import type { OrderStatus, OrderReadModel } from "../../../../services/orders.service";

export type { OrderStatus, OrderReadModel };

export type StatusFilter = "all" | OrderStatus;

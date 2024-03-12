export interface Entity<PojoType = Record<string, unknown>> {
  id?: string;
  toPOJO(): PojoType;
}

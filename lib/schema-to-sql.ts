import type { TableDefinition } from "./schema-meta";

/**
 * Sinh SQL DDL (CREATE TABLE) từ danh sách bảng để người dùng copy.
 */
export function getSchemaAsSql(tables: TableDefinition[]): string {
  const lines: string[] = [
    "-- Database Schema (PostgreSQL)",
    "-- Generated from Database Schema viewer - Câu hỏi 5",
    "",
  ];

  for (const table of tables) {
    const schema = table.schema || "public";
    const tableName = `${schema}.${table.name}`;
    lines.push(`-- Table: ${tableName}`);
    lines.push(`CREATE TABLE IF NOT EXISTS ${tableName} (`);

    const pkCols = table.columns.filter((c) => c.isPrimaryKey);
    const hasSinglePk = pkCols.length === 1;

    const colParts = table.columns.map((col) => {
      let def = `  ${col.name} ${col.type}`;
      if (hasSinglePk && col.isPrimaryKey && col.type.toLowerCase() === "uuid") {
        def += " DEFAULT gen_random_uuid()";
      }
      if (hasSinglePk && col.isPrimaryKey) {
        def += " PRIMARY KEY";
      } else if (!col.isPrimaryKey) {
        def += col.isNullable !== false ? " NULL" : " NOT NULL";
      }
      if (col.foreignKey && !col.isPrimaryKey) {
        const refTable = col.foreignKey.replace(".id", "").trim();
        def += ` REFERENCES ${schema}.${refTable}(id)`;
      }
      return def;
    });

    if (pkCols.length > 1) {
      colParts.push(`  PRIMARY KEY (${pkCols.map((c) => c.name).join(", ")})`);
    }

    lines.push(colParts.join(",\n"));
    lines.push(");");
    lines.push("");
  }

  return lines.join("\n");
}

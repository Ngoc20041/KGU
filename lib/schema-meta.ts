
export interface ColumnDefinition {
    name: string;
    type: string;
    format: string;
    isPrimaryKey?: boolean;
    isNullable?: boolean;
    foreignKey?: string; // e.g. "public.users.id"
    description?: string;
}

export interface TableDefinition {
    name: string;
    schema: string;
    columns: ColumnDefinition[];
}

export const schemaData: TableDefinition[] = [
    {
        name: 'batch',
        schema: 'public',
        columns: [
            { name: 'id', type: 'uuid', format: 'uuid', isPrimaryKey: true, isNullable: false },
            { name: 'batch_code', type: 'text', format: 'text', isNullable: false },
            { name: 'manufacture_date', type: 'date', format: 'date', isNullable: false },
            { name: 'expiry_date', type: 'date', format: 'date', isNullable: false },
            { name: 'quality_status', type: 'text', format: 'text', isNullable: true },
            { name: 'product_id', type: 'uuid', format: 'uuid', isNullable: true, foreignKey: 'product.id' },
            { name: 'created_at', type: 'timestamptz', format: 'timestamp with time zone', isNullable: true },
        ]
    },
    {
        name: 'factory',
        schema: 'public',
        columns: [
            { name: 'id', type: 'uuid', format: 'uuid', isPrimaryKey: true, isNullable: false },
            { name: 'code', type: 'text', format: 'text', isNullable: false },
            { name: 'name', type: 'text', format: 'text', isNullable: false },
            { name: 'address', type: 'text', format: 'text', isNullable: true },
            { name: 'created_at', type: 'timestamptz', format: 'timestamp with time zone', isNullable: true },
        ]
    },
    {
        name: 'factory_user',
        schema: 'public',
        columns: [
            { name: 'user_id', type: 'uuid', format: 'uuid', isPrimaryKey: true, isNullable: false },
            { name: 'factory_id', type: 'uuid', format: 'uuid', isPrimaryKey: true, isNullable: false, foreignKey: 'factory.id' },
            { name: 'role', type: 'text', format: 'text', isNullable: true },
        ]
    },
    {
        name: 'inventory_transaction',
        schema: 'public',
        columns: [
            { name: 'id', type: 'uuid', format: 'uuid', isPrimaryKey: true, isNullable: false },
            { name: 'transaction_type', type: 'text', format: 'text', isNullable: true },
            { name: 'quantity', type: 'numeric', format: 'numeric', isNullable: false },
            { name: 'reference_type', type: 'text', format: 'text', isNullable: true },
            { name: 'reference_id', type: 'uuid', format: 'uuid', isNullable: true },
            { name: 'product_id', type: 'uuid', format: 'uuid', isNullable: true, foreignKey: 'product.id' },
            { name: 'batch_id', type: 'uuid', format: 'uuid', isNullable: true, foreignKey: 'batch.id' },
            { name: 'factory_id', type: 'uuid', format: 'uuid', isNullable: true, foreignKey: 'factory.id' },
            { name: 'warehouse_id', type: 'uuid', format: 'uuid', isNullable: true, foreignKey: 'warehouse.id' },
            { name: 'location_id', type: 'uuid', format: 'uuid', isNullable: true, foreignKey: 'location.id' },
            { name: 'created_at', type: 'timestamptz', format: 'timestamp with time zone', isNullable: true },
        ]
    },
    {
        name: 'location',
        schema: 'public',
        columns: [
            { name: 'id', type: 'uuid', format: 'uuid', isPrimaryKey: true, isNullable: false },
            { name: 'code', type: 'text', format: 'text', isNullable: false },
            { name: 'capacity', type: 'numeric', format: 'numeric', isNullable: true },
            { name: 'is_active', type: 'boolean', format: 'boolean', isNullable: true },
            { name: 'warehouse_id', type: 'uuid', format: 'uuid', isNullable: true, foreignKey: 'warehouse.id' },
        ]
    },
    {
        name: 'product',
        schema: 'public',
        columns: [
            { name: 'id', type: 'uuid', format: 'uuid', isPrimaryKey: true, isNullable: false },
            { name: 'code', type: 'text', format: 'text', isNullable: false },
            { name: 'name', type: 'text', format: 'text', isNullable: false },
            { name: 'unit', type: 'text', format: 'text', isNullable: false },
            { name: 'product_type', type: 'text', format: 'text', isNullable: true },
            { name: 'is_batch_controlled', type: 'boolean', format: 'boolean', isNullable: true },
            { name: 'shelf_life_days', type: 'integer', format: 'integer', isNullable: true },
            { name: 'category_id', type: 'uuid', format: 'uuid', isNullable: true, foreignKey: 'product_category.id' },
            { name: 'created_at', type: 'timestamptz', format: 'timestamp with time zone', isNullable: true },
        ]
    },
    {
        name: 'product_bom',
        schema: 'public',
        columns: [
            { name: 'id', type: 'uuid', format: 'uuid', isPrimaryKey: true, isNullable: false },
            { name: 'quantity_required', type: 'numeric', format: 'numeric', isNullable: false },
            { name: 'loss_rate', type: 'numeric', format: 'numeric', isNullable: true },
            { name: 'product_id', type: 'uuid', format: 'uuid', isNullable: true, foreignKey: 'product.id' },
            { name: 'material_id', type: 'uuid', format: 'uuid', isNullable: true, foreignKey: 'product.id' },
        ]
    },
    {
        name: 'product_category',
        schema: 'public',
        columns: [
            { name: 'id', type: 'uuid', format: 'uuid', isPrimaryKey: true, isNullable: false },
            { name: 'name', type: 'text', format: 'text', isNullable: false },
            { name: 'parent_id', type: 'uuid', format: 'uuid', isNullable: true, foreignKey: 'product_category.id' },
        ]
    },
    {
        name: 'production_consumption',
        schema: 'public',
        columns: [
            { name: 'id', type: 'uuid', format: 'uuid', isPrimaryKey: true, isNullable: false },
            { name: 'quantity_used', type: 'numeric', format: 'numeric', isNullable: false },
            { name: 'production_order_id', type: 'uuid', format: 'uuid', isNullable: true, foreignKey: 'production_order.id' },
            { name: 'material_id', type: 'uuid', format: 'uuid', isNullable: true, foreignKey: 'product.id' },
            { name: 'batch_id', type: 'uuid', format: 'uuid', isNullable: true, foreignKey: 'batch.id' },
        ]
    },
    {
        name: 'production_order',
        schema: 'public',
        columns: [
            { name: 'id', type: 'uuid', format: 'uuid', isPrimaryKey: true, isNullable: false },
            { name: 'status', type: 'text', format: 'text', isNullable: true },
            { name: 'planned_quantity', type: 'numeric', format: 'numeric', isNullable: true },
            { name: 'actual_quantity', type: 'numeric', format: 'numeric', isNullable: true },
            { name: 'start_date', type: 'date', format: 'date', isNullable: true },
            { name: 'end_date', type: 'date', format: 'date', isNullable: true },
            { name: 'product_id', type: 'uuid', format: 'uuid', isNullable: true, foreignKey: 'product.id' },
            { name: 'factory_id', type: 'uuid', format: 'uuid', isNullable: true, foreignKey: 'factory.id' },
        ]
    },
    {
        name: 'production_output',
        schema: 'public',
        columns: [
            { name: 'id', type: 'uuid', format: 'uuid', isPrimaryKey: true, isNullable: false },
            { name: 'quantity', type: 'numeric', format: 'numeric', isNullable: false },
            { name: 'production_order_id', type: 'uuid', format: 'uuid', isNullable: true, foreignKey: 'production_order.id' },
            { name: 'product_id', type: 'uuid', format: 'uuid', isNullable: true, foreignKey: 'product.id' },
            { name: 'batch_id', type: 'uuid', format: 'uuid', isNullable: true, foreignKey: 'batch.id' },
        ]
    },
    {
        name: 'warehouse',
        schema: 'public',
        columns: [
            { name: 'id', type: 'uuid', format: 'uuid', isPrimaryKey: true, isNullable: false },
            { name: 'code', type: 'text', format: 'text', isNullable: false },
            { name: 'name', type: 'text', format: 'text', isNullable: false },
            { name: 'type', type: 'text', format: 'text', isNullable: true },
            { name: 'factory_id', type: 'uuid', format: 'uuid', isNullable: true, foreignKey: 'factory.id' },
            { name: 'created_at', type: 'timestamptz', format: 'timestamp with time zone', isNullable: true },
        ]
    }
];

export const normalizeCsvRow = (uploadId, row) => {
    return {
        uploadId,

        transactionId: row.transaction_id?.trim(),

        employeeId: row.employee_id?.trim(),

        employeeName: row.employee_name?.trim(),

        storeId: row.store_id?.trim(),

        registerId: row.register_id?.trim(),

        timestamp: new Date(row.timestamp),

        eventType: row.event_type?.trim().toUpperCase(),

        productId: row.product_id?.trim(),

        productName: row.product_name?.trim(),

        category: row.category?.trim(),

        quantity: Number(row.quantity),

        unitPrice: Number(row.unit_price),

        totalAmount: Number(row.total_amount),

        paymentMethod: row.payment_method?.trim().toUpperCase(),

        approvalStatus:
            row.approval_status?.trim().toUpperCase() === "TRUE",

        approvedBy: row.approved_by?.trim() || null,

        reason: row.reason?.trim() || null,

        customerId: row.customer_id?.trim(),
    };
};
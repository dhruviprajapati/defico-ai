export const analyzeDataset = (events) => {
    if (!events || events.length === 0) {
        return null;
    }

    const uniqueEmployees = new Set();
    const uniqueStores = new Set();

    let totalTransactionValue = 0;
    let totalRefundAmount = 0;
    let totalDamageAmount = 0;

    let refundCount = 0;
    let damageCount = 0;

    const employeeMetrics = {};

    for (const event of events) {
        uniqueEmployees.add(event.employeeId);
        uniqueStores.add(event.storeId);

        totalTransactionValue += event.totalAmount;

        if (!employeeMetrics[event.employeeId]) {
            employeeMetrics[event.employeeId] = {
                employeeId: event.employeeId,
                employeeName: event.employeeName,
                storeId: event.storeId,

                transactionCount: 0,

                refundCount: 0,
                refundAmount: 0,

                voidCount: 0,

                damageCount: 0,
                damageAmount: 0,

                lossCount: 0,
                lossAmount: 0,

                totalTransactionValue: 0,
                highestTransaction: 0,

                paymentMethods: {},

                eventTypeCounts: {},
            };
        }

        const employee = employeeMetrics[event.employeeId];

        employee.transactionCount++;

        employee.totalTransactionValue += event.totalAmount;

        if (event.totalAmount > employee.highestTransaction) {
            employee.highestTransaction = event.totalAmount;
        }

        // Count payment methods
        if (event.paymentMethod) {
            employee.paymentMethods[event.paymentMethod] =
                (employee.paymentMethods[event.paymentMethod] || 0) + 1;
        }

        // Count event types
        employee.eventTypeCounts[event.eventType] =
            (employee.eventTypeCounts[event.eventType] || 0) + 1;

        switch (event.eventType) {
            case "REFUND":
            case "RETURN":
                refundCount++;
                totalRefundAmount += event.totalAmount;

                employee.refundCount++;
                employee.refundAmount += event.totalAmount;
                break;

            case "VOID":
                employee.voidCount++;
                break;

            case "DAMAGE":
                damageCount++;
                totalDamageAmount += event.totalAmount;

                employee.damageCount++;
                employee.damageAmount += event.totalAmount;
                break;

            case "LOSS":
                employee.lossCount++;
                employee.lossAmount += event.totalAmount;
                break;
        }
    }

    const employeeCount = uniqueEmployees.size;

    // Calculate averages per employee
    Object.values(employeeMetrics).forEach(employee => {
        employee.averageTransactionValue =
            employee.transactionCount === 0
                ? 0
                : employee.totalTransactionValue / employee.transactionCount;
    });

    return {
        totalEvents: events.length,

        totalEmployees: employeeCount,

        totalStores: uniqueStores.size,

        averageTransactionValue:
            totalTransactionValue / events.length,

        averageRefundAmount:
            refundCount === 0
                ? 0
                : totalRefundAmount / refundCount,

        averageDamageAmount:
            damageCount === 0
                ? 0
                : totalDamageAmount / damageCount,

        averageTransactionsPerEmployee:
            events.length / employeeCount,

        averageRefundPerEmployee:
            employeeCount === 0
                ? 0
                : totalRefundAmount / employeeCount,

        averageDamagePerEmployee:
            employeeCount === 0
                ? 0
                : totalDamageAmount / employeeCount,

        employeeMetrics,
    };
};
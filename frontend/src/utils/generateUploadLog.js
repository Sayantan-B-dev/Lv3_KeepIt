/**
 * Generates a formatted text string for the upload report.
 * @param {Array} report - Array of objects { name, status, error, timestamp }
 * @param {string} categoryName - Name of the category
 * @returns {string} - Formatted text
 */
export const generateUploadLog = (report, categoryName) => {
    const successCount = report.filter(r => r.status === "success").length;
    const errorCount = report.filter(r => r.status === "error").length;
    const totalCount = report.length;
    const date = new Date().toLocaleString();

    let text = `MARDRIVE BULK UPLOAD REPORT\n`;
    text += `Generated: ${date}\n`;
    text += `Category: ${categoryName}\n`;
    text += `--------------------------------------------------\n`;
    text += `SUMMARY:\n`;
    text += `  Total Processed: ${totalCount}\n`;
    text += `  Success:         ${successCount}\n`;
    text += `  Failed:          ${errorCount}\n`;
    text += `--------------------------------------------------\n\n`;
    text += `DETAILED LOG:\n`;

    report.forEach((item, index) => {
        const timestamp = new Date(item.timestamp).toLocaleTimeString();
        const status = item.status === "success" ? "[ SUCCESS ]" : "[ FAILED  ]";
        const detail = item.error ? `- Reason: ${item.error}` : "";
        text += `${index + 1}. ${timestamp} ${status} ${item.name} ${detail}\n`;
    });

    text += `\n--------------------------------------------------\n`;
    text += `End of Report\n`;

    return text;
};

/**
 * Triggers a browser download of a text file.
 * @param {string} content - Text content
 * @param {string} filename - Desired filename
 */
export const downloadTextFile = (content, filename) => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

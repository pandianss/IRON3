import { jsPDF } from 'jspdf';

/**
 * EXECUTIVE SERVICE: Certificate Authority
 * Role: Issues Sovereign Credentials in physical (PDF) form.
 */
export const CertificateAuthority = {
    /**
     * Generates a PDF Certificate for a fulfilled Chartered Contract (Task).
     * @param {object} recipient - User Name / ID
     * @param {object} enterprise - Issuing Authority
     * @param {object} task - The completed task/contract
     * @returns {Promise<Blob>}
     */
    generateCertificate: async (recipient, enterprise, task) => {
        const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4'
        });

        // 1. Branding (Sovereign Header)
        doc.setFillColor(20, 20, 20); // Dark Background
        doc.rect(0, 0, 297, 210, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(24);
        doc.text("SOVEREIGN CREDENTIAL", 148.5, 30, { align: 'center' });

        // 2. Body
        doc.setFillColor(255, 255, 255);
        doc.rect(20, 50, 257, 140, 'F');

        // Enterprise Logo / Name
        doc.setTextColor(40, 40, 40);
        doc.setFontSize(18);
        doc.text(enterprise.name.toUpperCase(), 148.5, 70, { align: 'center' });

        doc.setFontSize(14);
        doc.setFont("helvetica", "normal");
        doc.text("hereby certifies that", 148.5, 85, { align: 'center' });

        // Recipient Name
        doc.setFontSize(32);
        doc.setFont("times", "bolditalic");
        doc.text(recipient.name || "Sovereign Citizen", 148.5, 105, { align: 'center' });

        // Task Description
        doc.setFontSize(14);
        doc.setFont("helvetica", "normal");
        doc.text("has successfully completed the mandate:", 148.5, 125, { align: 'center' });

        doc.setFontSize(22);
        doc.setFont("helvetica", "bold");
        doc.text(task.title || "Unknown Mandate", 148.5, 140, { align: 'center' });

        // Metadata
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        const dateStr = new Date().toLocaleDateString();
        doc.text(`Issued: ${dateStr}`, 40, 170);
        doc.text(`Authority ID: ${enterprise.id}`, 40, 175);
        doc.text(`Credential Hash: ${crypto.randomUUID()}`, 40, 180);

        // Footer
        doc.setDrawColor(200, 200, 200);
        doc.line(180, 170, 260, 170);
        doc.text("Authorized Signature", 220, 175, { align: 'center' });

        return doc.output('blob');
    }
};

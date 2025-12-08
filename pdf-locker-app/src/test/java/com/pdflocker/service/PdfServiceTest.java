package com.pdflocker.service;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

public class PdfServiceTest {

    private final PdfService pdfService = new PdfService();

    @Test
    public void testLockAndUnlockPdf() throws IOException {
        // Create a simple PDF in memory
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try (PDDocument doc = new PDDocument()) {
            doc.addPage(new org.apache.pdfbox.pdmodel.PDPage());
            doc.save(baos);
        }
        byte[] originalPdfBytes = baos.toByteArray();

        MockMultipartFile originalFile = new MockMultipartFile("file", "test.pdf", "application/pdf", originalPdfBytes);
        String password = "password123";

        // Test Locking
        byte[] lockedBytes = pdfService.lockPdf(originalFile, password);
        Assertions.assertNotNull(lockedBytes);
        Assertions.assertTrue(lockedBytes.length > 0);

        // Verify it is locked
        Assertions.assertThrows(IOException.class, () -> {
            Loader.loadPDF(lockedBytes); // Should fail without password
        });

        // Test Unlocking
        MockMultipartFile lockedFile = new MockMultipartFile("file", "locked.pdf", "application/pdf", lockedBytes);
        byte[] unlockedBytes = pdfService.unlockPdf(lockedFile, password);
        Assertions.assertNotNull(unlockedBytes);

        // Verify it is unlocked
        try (PDDocument unlockedDoc = Loader.loadPDF(unlockedBytes)) {
             Assertions.assertNotNull(unlockedDoc);
             Assertions.assertFalse(unlockedDoc.isEncrypted());
        }
    }
}

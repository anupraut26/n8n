package com.pdflocker.controller;

import com.pdflocker.service.PdfService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api")
public class PdfController {

    private final PdfService pdfService;

    public PdfController(PdfService pdfService) {
        this.pdfService = pdfService;
    }

    @PostMapping("/lock")
    public ResponseEntity<byte[]> lockPdf(@RequestParam("file") MultipartFile file, @RequestParam("password") String password) throws IOException {
        byte[] lockedPdf = pdfService.lockPdf(file, password);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"locked_" + file.getOriginalFilename() + "\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(lockedPdf);
    }

    @PostMapping("/unlock")
    public ResponseEntity<byte[]> unlockPdf(@RequestParam("file") MultipartFile file, @RequestParam("password") String password) throws IOException {
        byte[] unlockedPdf = pdfService.unlockPdf(file, password);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"unlocked_" + file.getOriginalFilename() + "\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(unlockedPdf);
    }
}

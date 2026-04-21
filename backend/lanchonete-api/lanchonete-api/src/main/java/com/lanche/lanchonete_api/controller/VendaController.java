package com.lanche.lanchonete_api.controller;

import com.lanche.lanchonete_api.dto.VendaDTO;
import com.lanche.lanchonete_api.model.Venda;
import com.lanche.lanchonete_api.service.VendaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vendas")
public class VendaController {

    @Autowired
    private VendaService vendaService;

    @PostMapping
    public ResponseEntity<Venda> registrarVenda(@RequestBody @Valid VendaDTO.Request request) {
        Venda novaVenda = vendaService.registrarVenda(request);
        return ResponseEntity.ok(novaVenda);
    }

    @GetMapping
    public ResponseEntity<List<Venda>> listarVendas() {
        return ResponseEntity.ok(vendaService.listarVendas());
    }
}
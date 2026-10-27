package com.mld.danifixit;

import java.util.List;

/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
public class FormularioService {

    private final FormularioDAO dao = new FormularioDAO();

    public void guardar(FormularioDTO contacto) {

        dao.insertar(
                contacto.getNombre(),
                contacto.getEmail(),
                contacto.getAsunto(),
                contacto.getMensaje()
        );
    }

    public List<FormularioDTO> obtenerTodos() {
        return dao.obtenerTodos();
    }
}

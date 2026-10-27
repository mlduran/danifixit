package com.mld.danifixit;

/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import jakarta.servlet.*;
import java.io.IOException;

@WebServlet("/api/formulario")
public class FormularioServlet extends HttpServlet {

    private final ObjectMapper mapper = new ObjectMapper();
    private final FormularioService formularioService = new FormularioService();

    @Override
    protected void doPost(HttpServletRequest request,
            HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        try {

            // Convierte el JSON recibido en un objeto Java
            FormularioDTO contacto = mapper.readValue(request.getReader(), FormularioDTO.class);

            // Validación básica
            if (contacto.getNombre() == null || contacto.getNombre().isBlank()
                    || contacto.getEmail() == null || contacto.getEmail().isBlank()
                    || contacto.getAsunto() == null || contacto.getAsunto().isBlank()
                    || contacto.getMensaje() == null || contacto.getMensaje().isBlank()) {

                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.getWriter().write("{\"ok\":false,\"error\":\"Todos los campos son obligatorios.\"}");
                return;
            }

            // Guardar en la base de datos
            formularioService.guardar(contacto);

            // Enviamos mail
            EmailService.enviarCorreo(
                    Config.get("mail.correoadmin"),
                    "Formulario de contacto",
                    contacto.toString());

            response.setStatus(HttpServletResponse.SC_OK);
            response.getWriter().write("{\"ok\":true}");

        } catch (IOException e) {

            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write(
                    "{\"ok\":false,\"error\":\"Error interno del servidor: "
                    + e.getMessage() + "\"}"
            );

        } catch (Exception ex) {

            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write(
                    "{\"ok\":false,\"error\":\"Error interno del servidor: "
                    + ex.getMessage() + "\"}"
            );
        }
    }
}
